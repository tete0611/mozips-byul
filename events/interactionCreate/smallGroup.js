const { Events } = require('discord.js');
const { enterButton } = require('../../components/smallGroup');
const wait = require('node:timers/promises').setTimeout;

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
      const { customId, guild, member, user, component } = interaction;
      /** 기존응답 보류후 삭제 */
      interaction.deferReply().then(async () => {
        await wait(1000);
        interaction.deleteReply();
      });
      const DM_Channel = await user.createDM();
      const role = guild.roles.cache.find(v => v.name === '소그룹');
      /** 역할참가버튼 */
      if (customId === 'smallGroupEnterButton') {
        const memberRoles = member.roles.cache;

        /** 레벨 설정이 안된 경우 */
        const hasLevel = memberRoles.some(v =>
          ['Level1', 'Level2', 'Level3', 'Level4', 'Level5', 'Level6', 'Level7'].includes(v.name),
        );
        if (!hasLevel)
          return DM_Channel.send({
            content: `**소그룹 ${component.label}** : "Level"역할을 먼저 설정하고 오세요!`,
          });

        /** 이미 역할이 있는 경우 */
        const hasAlready = memberRoles.find(v => v.name === '소그룹');
        if (hasAlready)
          return DM_Channel.send({
            content: `**소그룹 ${component.label}** : 이미 역할이 있어요`,
          });

        await member.roles.add(role).then(() =>
          DM_Channel.send({
            content: `**소그룹 ${component.label}** : 역할이 부여되었어요 :ok_hand:`,
          }),
        );
      }
    }
  },
};
