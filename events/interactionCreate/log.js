const { Events } = require('discord.js');
const { formatToUtc } = require('../../common/function');

module.exports = {
  name: Events.InteractionCreate,
  once: false,
  /**
   *
   * @param {import('discord.js').CommandInteraction} interaction
   */
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;
    const { commandName, createdAt, member, user, guild } = interaction;
    const managerChannel = guild.channels.cache.get(process.env.MANAGER_CHANNEL);
    managerChannel.send({
      content: `**${
        member.nickname ?? user.username
      }**님이 **${commandName}**명령어 사용 (${formatToUtc(createdAt, 'yyyy-MM-dd HH:mm:ss')})`,
      allowedMentions: {
        parse: ['users', 'roles'],
        repliedUser: false,
        everyone: false,
        here: false,
      },
    });
  },
};
