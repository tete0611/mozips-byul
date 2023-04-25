const { Events, ChannelType } = require('discord.js');
const { checkRole } = require('../../common/function');
const client = require('../../index');
const { env } = process;
const parentId = env.RANDOM_ROOM_PARENT_ID;
const groupParentId = env.GROUP_PARENT_ID;
const wait = require('node:timers/promises').setTimeout;

module.exports = {
  name: Events.VoiceStateUpdate,
  once: false,
  /**
   *
   * @param {import("discord.js").VoiceState} oldState
   * @param {import("discord.js").VoiceState} newState
   */
  async execute(oldState, newState) {
    const { channel, channelId, guild } = oldState;
    const { channel: channel_new } = newState;
    if (channel?.parent?.id === parentId && channel?.name === '랜덤방') {
      /** 이탈한 채널의 멤버가 혼자이고 채널이 존재한다면 */
      if (channel?.members.size === 1) {
        const waitingRoom = await client.channels.fetch(env.WAITING_ROOM_ID);
        const teacherRoom = await client.channels.fetch(env.TEACHER_ROOM_ID);
        const nowChannel = await guild.channels.fetch(channelId);
        if (nowChannel) {
          const member = nowChannel.members.at(0);
          try {
            if (checkRole(member, '한국어 선생님')) await member.voice.setChannel(teacherRoom);
            else await member.voice.setChannel(waitingRoom);
            await wait(3000);
            await nowChannel.delete();
          } catch (error) {
            console.log('Channel Delete Error : ' + error);
          }
        }
      }
    } else if (channel_new?.parentId === groupParentId && channel_new?.name.includes('𝐆𝐫𝐨𝐮𝐩')) {
      /** 해당 그룹의 채팅채널을 찾음 */
      const targetChannel = await guild.channels.cache.find(
        c => c.name === channel_new.name && c.type === ChannelType.GuildText,
      );
      await targetChannel.send({
        content: `__${newState.member.displayName}__님이 :speaking_head:음성채널에 입장했어요`,
      });
    }
  },
};
