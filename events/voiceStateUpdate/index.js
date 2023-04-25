const { Events, ChannelType } = require('discord.js');
const { checkRole } = require('../../common/function');
const client = require('../../index');
const { env } = process;
const parentId = env.RANDOM_ROOM_PARENT_ID;
const groupParentId = env.GROUP_PARENT_ID;
const wait = require('node:timers/promises').setTimeout;
const MOZIPS_FAMILY_ID = '1095183488786903170';
const GENERAL_CHAT_ID = '1051667735773458542';
const LOG_GENERAL_VC = '1100302116406427699';
const BROADCAST_REGULAR_VC = '1077493494442119218';
const LOG_BROADCAST_REGULAR_VC = '1100302358514245684';

module.exports = {
  name: Events.VoiceStateUpdate,
  once: false,
  /**
   *
   * @param {import("discord.js").VoiceState} oldState
   * @param {import("discord.js").VoiceState} newState
   */
  async execute(oldState, newState) {
    // 랜덤매칭 리스너
    if (oldState?.channel?.parent?.id === parentId && oldState?.channel?.name === '랜덤방') {
      /** 이탈한 채널의 멤버가 혼자이고 채널이 존재한다면 */
      if (oldState?.channel?.members.size === 1) {
        const waitingRoom = await client.channels.fetch(env.WAITING_ROOM_ID);
        const teacherRoom = await client.channels.fetch(env.TEACHER_ROOM_ID);
        const nowChannel = await oldState?.guild?.channels.fetch(oldState.channelId);
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
      // 소그룹 VC 리스너
    } else if (newState?.channel?.parentId === groupParentId) {
      /** 해당 그룹의 채팅채널을 찾음 */
      const targetChannel = await newState.guild.channels.cache.find(
        c => c.name === newState?.channel.name && c.type === ChannelType.GuildText,
      );
      await targetChannel.send({
        content: `**${newState?.member.displayName}**님이 음성채널에 입장했어요 :speaking_head:`,
      });
      /** Voice Chat (1)(2) 입장 리스너 */
    } else if (newState?.channel?.parentId === MOZIPS_FAMILY_ID) {
      const { guild, channel, member } = newState;
      const generalChatChannel = await guild.channels.cache.get(GENERAL_CHAT_ID);
      const log_genaralChat = await guild.channels.cache.get(LOG_GENERAL_VC);
      const channelName = channel?.name;
      await generalChatChannel?.send({
        content: `**${member.displayName}**님이 **${channelName}**채널에 입장했어요 :speaking_head:`,
      });
      await log_genaralChat?.send({
        content: `**${member?.displayName}**님이 **${channelName}**채널에 입장했어요 :speaking_head:`,
      });
      /** Voice Chat (1)(2) 퇴장 리스너 */
    } else if (oldState?.channel?.parentId === MOZIPS_FAMILY_ID) {
      const { guild, member, channel } = oldState;
      const log_genaralChat = await guild.channels.cache.get(LOG_GENERAL_VC);
      const channelName = channel?.name;
      await log_genaralChat?.send({
        content: `**${member?.displayName}**님이 **${channelName}**채널에서 퇴장했어요`,
      });
      /** 방송국 - Regular VC 입장 리스너 */
    } else if (newState?.channelId === BROADCAST_REGULAR_VC) {
      const { guild, member } = newState;
      const log_regularChat = await guild.channels.cache.get(LOG_BROADCAST_REGULAR_VC);
      await log_regularChat?.send({
        content: `**${member?.displayName}**님이 음성채널에 입장했어요 :speaking_head:`,
      });
      /** 방송국 - Regular VC 퇴장 리스너 */
    } else if (oldState?.channelId === BROADCAST_REGULAR_VC) {
      const { guild, member } = oldState;
      const log_regularChat = await guild.channels.cache.get(LOG_BROADCAST_REGULAR_VC);
      await log_regularChat?.send({
        content: `**${member?.displayName}**님이 음성채널에서 퇴장했어요`,
      });
    }
  },
};
