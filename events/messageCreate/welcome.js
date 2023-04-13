const { Events } = require('discord.js');
const { REG_EXP } = require('../../common/regex');
const { warningKoreanEmbed } = require('../../components/messageCreate');
const { checkRole } = require('../../common/function');
const { env } = process;
let messageCount = 0;
const welcomeChannelId = env.WELCOME_CHANNEL_ID;
const koreanChannelId = env.KOREAN_CHANNEL_ID;
const koreanBeginnerChannelId = env.KOREAN_BEGINNER_CHANNEL_ID;

module.exports = {
  name: Events.MessageCreate,
  once: false,
  /**
   *
   * @param {import("discord.js").Message} message
   */
  async execute(message) {
    if (message.author.bot) return;
    if (message.channelId === welcomeChannelId) {
      if (!checkRole(message.member, 'Manager')) {
        messageCount += 1;
        if (messageCount === 20) {
          await message.channel.send({
            content: `모두 환영합니다! <#1051667735773458542> 채널에서 채팅을 시작해보세요.\nWelcome to Mozips village!\nThis channel is to introduce yourself.\nPlease use <#1051667735773458542> channel to chat :cherries:\nAnd don't forget to get your roles from <#1051689953295351818>`,
          });
        }
        if (message.content.includes('안녕')) {
          await message.reply({ content: `**반갑습니다!** :slight_smile:` });
        } else if (REG_EXP.hello.test(message.content) || REG_EXP.hi.test(message.content)) {
          await message.reply({ content: `**Hello!** :slight_smile:` });
        }
      }
    } else if (
      message.channelId === koreanChannelId ||
      message.channelId === koreanBeginnerChannelId
    ) {
      const formatted = message.content
        .replace(REG_EXP.mension, '')
        .replace(REG_EXP.hashTag, '')
        .replace(REG_EXP.hyperLink, '')
        .replace(REG_EXP.emoji, '')
        .replace(/\d/g, '')
        // eslint-disable-next-line no-useless-escape
        .replace(/[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/g, '')
        .replace(/<:[a-zA-Z0-9_]+:[0-9]+>/g, '');
      if (!REG_EXP.korean.test(formatted) && formatted.trim() !== '' && /[a-z]/g.test(formatted)) {
        message.reply({ embeds: [warningKoreanEmbed] });
      }
    }
  },
};
