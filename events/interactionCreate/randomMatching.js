const {
  MessageFlags,
  ChannelType,
  Events,
  EmbedBuilder,
  Colors,
  AttachmentBuilder,
} = require('discord.js');
const { row_1 } = require('../../components/randomMatching');
const { getTwoDimensions, getImageUrl, checkRole } = require('../../common/function');
const { env } = process;
const schedule = require('node-schedule');
const { addMinutes } = require('date-fns');

const waitingRoomId = env.WAITING_ROOM_ID;
const teacherRoomId = env.TEACHER_ROOM_ID;
let isTotalMatchProcessing = false;
let processingUserIds = [];

/**
 * 배열 섞는 함수
 * @param {T[]} array
 * @returns {T[]}
 */
const shuffle = array => {
  array.sort(() => Math.random() - 0.5);
  return array;
};

/**
 * 랜덤매칭 함수
 * @param {import('discord.js').GuildMember[]} memberList 매칭 참가자의 1차원 배열
 * @param {import('discord.js').CommandInteraction | import('discord.js').ButtonInteraction} interaction 해당 interaction 객체
 * @param {number} limitTime 제한시간
 * @param {Date} today 현재시각
 */
const onNormalMatch = async (memberList, interaction, limitTime, today) => {
  const { guild, client } = interaction;
  /** 전송할 임베드 */
  const imageUrl = getImageUrl(today);
  const topic = new AttachmentBuilder(imageUrl.ko);
  const topic_en = new AttachmentBuilder(imageUrl.en);
  const greeting = new EmbedBuilder({
    title: ':wave: Welcome to random VC :wave:',
    description: `${memberList
      .map(member => `<@${member.user.id}>`)
      .join(
        ' and ',
      )} are matched\n\n**아래 사진에서 대화 주제를 골라보세요!**\nChoose conversation topics from the picture below.\n당신이 방에서 나가면 이 채널이 자동으로 없어집니다. 주의하세요!\nIf you leave this channel, the channel will be automatically deleted. Be careful!\n\n**더 재미있는 대화를 위한 명령어**\nCommands for more fun conversation\n__/잰말놀이__:(tongue-twister sentences) 모집스봇이 한국어 잰말놀이 문장을 랜덤으로 보내줍니다.\n__/절대음감__: (tongue-twister words) 모집스봇이 발음하기 어려운 한국어 단어를 랜덤으로 보내줍니다.\n__/초성게임__: 모집스봇이 랜덤으로 초성을 제시합니다.`,
    color: Colors.Yellow,
    fields: [
      { name: '\u200B', value: '\u200B' },
      {
        name: ':timer: 제한시간 (Time Limit)',
        value: limitTime ? `__${limitTime} min__` : '__없음__',
      },
    ],
  });
  const waitingRoom = await client.channels.fetch(waitingRoomId);
  const teacherRoom = await client.channels.fetch(teacherRoomId);
  const combineRoomMemberIds = [
    ...waitingRoom.members.map(member => member.id),
    ...teacherRoom.members.map(member => member.id),
  ];
  /** 랜덤방 생성 */
  const newChannel = await guild.channels.create({
    name: `랜덤방`,
    type: ChannelType.GuildVoice,
    parent: env.RANDOM_ROOM_PARENT_ID,
    userLimit: memberList.length,
  });
  /** 도중 이탈이 있는지 점검 */
  let flag = true;
  await Promise.all(
    memberList.map(async member => {
      if (!combineRoomMemberIds.includes(member.id)) {
        await waitingRoom.send(
          `__${member}__님이 매칭중 이탈하여 ${memberList
            .filter(v => v.id !== member.id)
            .map(v => `__${v}__`)
            .join('님 ')}님과 매칭에 실패했어요. `,
        );
        newChannel.delete();
        flag = false;
        return;
      }
    }),
  );
  if (flag) {
    memberList.forEach(member => member.voice.setChannel(newChannel).catch(console.error));
    newChannel.send({
      embeds: [greeting],
      files: [topic, topic_en],
    });
  }
  if (limitTime && flag) {
    const isTeacher = memberList[0].roles.cache.some(v => v.name === '한국어 선생님');

    schedule.scheduleJob(addMinutes(today, limitTime - 1), async () => {
      const room = await guild.channels.cache.get(newChannel.id);
      if (room) {
        await newChannel.send({ content: '1분 남았습니다. 대화를 마무리해주세요!' });
      } else job_1.cancel();
    });
    const job_1 = schedule.scheduleJob(addMinutes(today, limitTime), async () => {
      const room = await guild.channels.cache.get(newChannel.id);
      if (room) {
        if (isTeacher) await memberList[0].voice.setChannel(teacherRoom);
        else memberList[0].voice.setChannel(waitingRoom);
      }
    });
  }
};

module.exports = {
  name: Events.InteractionCreate,
  once: false,
  /**
   *
   * @param {import("discord.js").CommandInteraction} interaction
   */
  async execute(interaction) {
    const { commandName, options } = interaction;
    if (interaction.isChatInputCommand() && commandName === '랜덤매칭') {
      //
      //
      //
      //
      //
      /** 개인매칭일 경우 */
      if (options.getSubcommand() === '개인') {
        const { user: ownerUser, member: ownerMember, channel: waitingRoom, guild } = interaction;

        /** 대기방에서 사용했는지 검사 */
        if (waitingRoom.id !== env.WAITING_ROOM_ID)
          return interaction.reply({ content: '대기방에서 사용해주세요', ephemeral: true });

        /** 중복 사용인지 검사 */
        if (processingUserIds.includes(ownerUser.id))
          return interaction.reply({
            content: '이미 랜덤매칭(개인)을 사용중이에요.',
            ephemeral: true,
          });
        /** 대기방에 내가 있는지 검사 */
        const waitingRoomMembers = waitingRoom.members.map(v => v);
        if (!waitingRoomMembers.some(v => v.user.tag === ownerUser.tag))
          return interaction.reply({ content: '대기방에 먼저 입장해주세요.', ephemeral: true });

        /** 온라인 중인 멤버 가져오기 */
        const onlineMembers = guild.members.cache.filter(
          member =>
            member.presence?.status === 'online' &&
            (!member.voice.channelId ||
              (member.voice.channelId && member.voice.channel.name === '대기방')) &&
            !member.user.bot &&
            member.user.id !== ownerUser.id,
          // &&
          // member.user.id === '1078487280928428143',
        );

        /** 매칭가능한 멤버가 있는지 검사 */
        if (onlineMembers.size < 1)
          return interaction.reply({
            content: '서버에 현재 매칭가능한 멤버가 없어요 :pensive:',
            ephemeral: true,
          });

        /** 랜덤매칭 진행 */
        processingUserIds.push(ownerUser.id);
        await interaction.reply({
          content: '상대방의 응답을 기다리는중...',
          ephemeral: true,
        });

        /** 온라인 멤버 랜덤선택 */
        const selectedMember = onlineMembers.map(v => v)[~~(Math.random() * onlineMembers.size)];

        /** 선정된 사용자의 User객체 */
        const selectedUser = selectedMember.user;

        /** 선정된 사용자의 DM채널 */
        const DM_Channel = await selectedUser.createDM();

        /** 콜렉터 필터 선언 */
        const filter = i =>
          (i.customId === 'randomMatchingConfirmButton' ||
            i.customId === 'randomMatchingRejectButton') &&
          i.user.id === selectedUser.id;
        /** 콜렉터 생성 */
        const collector = DM_Channel.createMessageComponentCollector({
          filter: filter,
          time: 60000,
          message: ownerMember.displayName,
        });
        /** 콜렉터 리스너 등록 */
        collector.on('collect', async buttonInteraction => {
          const { message, customId } = buttonInteraction;
          if (customId === 'randomMatchingConfirmButton') {
            /** 송신자가 대기방에 있는지 판별 */
            if (!ownerMember.voice.channel) {
              await buttonInteraction.update({
                content: '상대방이 대기방에 존재하지 않습니다',
                components: [],
              });
              await interaction.editReply('대기방에 참가해있지 않은거 같아요');
              collector.stop('실패');
              return;
            }
            /** 수신자가 대기방에 있는지 판별 */
            if (!selectedMember.voice.channel)
              return buttonInteraction.update({
                content: `<#${env.WAITING_ROOM_ID}>에 참가해서 클릭해주세요`,
              });

            await interaction.editReply('상대방이 승락했어요! :wave:');

            /** 랜덤방 생성 */
            const newChannel = await guild.channels.create({
              name: `랜덤방`,
              type: ChannelType.GuildVoice,
              parent: process.env.RANDOM_ROOM_PARENT_ID,
              userLimit: 2,
            });
            /** 인사말 임베드 생성 */
            const greeting = new EmbedBuilder({
              title: ':wave: Welcome to random VC :wave:',
              description: `자유롭게 채팅&대화를 나누세요!\n방에 혼자 남았을 경우 방이 자동삭제 됩니다.\n\n :wave: **Welcome to Random Room!** :wave:\nFeel free to talk and chat.\nIf you are left alone, the room will be automatically deleted.\n<@${ownerUser.id}> <@${selectedUser.id}>`,
              color: Colors.Yellow,
            });
            /** 인사말 전송 */
            newChannel.send({
              embeds: [greeting],
            });
            /** 멤버 음성채널 초대 */
            Promise.allSettled([
              ownerMember.voice.setChannel(newChannel),
              selectedMember.voice.setChannel(newChannel),
            ])
              .then(() =>
                message.edit({
                  content: `참가 완료 <#${newChannel.id}>`,
                  components: [],
                }),
              )
              .finally(() => collector.stop('승락'));
          } else if (customId === 'randomMatchingRejectButton') {
            interaction.editReply('상대방이 거절했어요 :pensive:');
            message.edit({ content: '거절 완료', components: [] });
            collector.stop('거절');
          }
        });

        /** 콜렉터 종료 리스너 등록 */
        collector.on('end', async () => {
          processingUserIds = processingUserIds.filter(v => v !== ownerUser.id);
          if (collector.endReason === 'time')
            await interaction.editReply('상대방이 응답하지 않았어요.');
        });

        /** DM전송 */
        DM_Channel.send({
          content: `랜덤매칭에 상대로 선택되었습니다. 참가 하시겠어요?`,
          components: [row_1],
          flags: MessageFlags.Ephemeral,
        });

        //
        //
        //
        //
        //
        /** 전체매칭인 경우 */
      } else if (options.getSubcommand() === '전체') {
        if (!checkRole(interaction.member, 'Manager'))
          return interaction.reply({ content: '관리자만 사용할 수 있어요', ephemeral: true });
        if (isTotalMatchProcessing)
          return interaction.reply({ content: '이미 매칭 실행중입니다.' });
        const { options: thisOptions, channel: waitingRoom, guild } = interaction;
        const today = new Date();
        const limitTime = thisOptions.getInteger('제한시간설정');
        const isTeacher = thisOptions.getBoolean('선생님');
        const waitingRoomMembers = shuffle(waitingRoom.members.map(v => v));
        const waitingRoomMemberLength = waitingRoomMembers.length;
        let resultMembers = null;
        /** 선생님 매칭일 경우 */
        if (isTeacher) {
          const teacherRoom = await guild.channels.cache.get(teacherRoomId);
          const teacherRoomMembers = shuffle(teacherRoom.members.map(v => v));
          const teacherRoomMembersLength = teacherRoomMembers.length;
          if (teacherRoomMembersLength < 1)
            return interaction.reply({ content: '대기방에 선생님이 없어요.', ephemeral: true });
          if (waitingRoomMemberLength < 1)
            return interaction.reply({ content: '대기방에 사람이 없어요.', ephemeral: true });

          const combineRoomMembers = [];
          for (let i = 0; i < Math.min(teacherRoomMembersLength, waitingRoomMemberLength); i++) {
            combineRoomMembers.push(teacherRoomMembers.pop(0));
            combineRoomMembers.push(waitingRoomMembers.pop(0));
          }
          resultMembers = getTwoDimensions(combineRoomMembers);
          /** 일반 매칭일 경우 */
        } else {
          if (waitingRoomMemberLength < 2)
            return interaction.reply({
              content: '대기방에 충분한 사람이 없어요.',
              ephemeral: true,
            });
          /** 2차원 배열 제작 */
          resultMembers = getTwoDimensions(waitingRoomMembers);
        }
        isTotalMatchProcessing = true;
        await interaction.reply({ content: '매칭중.....' });
        /** 비동기 랜덤매칭 실행 */
        Promise.allSettled(resultMembers.map(v => onNormalMatch(v, interaction, limitTime, today)))
          .catch(err => console.log('랜덤매칭 에러발생 : ' + err))
          .finally(() => {
            isTotalMatchProcessing = false;
            interaction.editReply({ content: `매칭되었습니다` });
          });
      }
    }
    // else if (
    //   /** 랜덤매칭 버튼일 경우 */
    //   interaction.isButton() &&
    //   (interaction.customId === 'randomMatchingConfirmButton' ||
    //     interaction.customId === 'randomMatchingRejectButton')
    // ) {
    //   if (!processingUserIds.includes(interaction.user.id))
    //     interaction.update({ content: '만료된 요청입니다.', components: [] });
    // }
  },
};
