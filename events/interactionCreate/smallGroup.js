const { Events } = require('discord.js');
const { enterButton, cancelButton } = require('../../components/smallGroup');

module.exports = {
  name: Events.InteractionCreate,
  once: false,
  /**
   *
   * @param {import('discord.js').CommandInteraction | import('discord.js').Interaction} interaction
   */
  async execute(interaction) {
    /** 명령어 실행일 경우 */
    if (interaction.isChatInputCommand() && interaction.commandName === '소그룹버튼생성') {
      interaction.reply({ components: [enterButton] });
      /** 버튼 클릭일 경우 */
    } else if (interaction.isButton()) {
      const { customId, guild, member } = interaction;
      const role = guild.roles.cache.find(v => v.name === '소그룹');
      /** 역할참가버튼 */
      if (customId === 'smallGroupEnterButton') {
        const hasAlready = member.roles.cache.find(v => v.name === '소그룹');
        if (!hasAlready)
          await member.roles.add(role).then(() =>
            interaction.reply({
              content: '역할이 부여되었습니다 :ok_hand:',
              ephemeral: true,
              components: [cancelButton],
            }),
          );
        else interaction.reply({ content: '이미 역할이 있어요', ephemeral: true });
      } else if (customId === 'smallGroupCancelButton') {
        await member.roles.remove(role).then(() => {
          interaction.update({
            content: '취소되었습니다',
            ephemeral: true,
            components: [],
          });
        });
      }
    }
  },
};
