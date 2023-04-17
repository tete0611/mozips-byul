const { Events } = require('discord.js');
const { birthdayModal, birthdayDeleteModal } = require('../../components/birthday');
const Schema = require('../../models/birthday');

module.exports = {
  name: Events.InteractionCreate,
  once: false,
  /**
   *
   * @param {import('discord.js').ModalSubmitInteraction | import('discord.js').CommandInteraction} interaction
   */
  async execute(interaction) {
    /** isChatInputCommand  */
    if (interaction.isChatInputCommand() && interaction.commandName === '생일') {
      const { options, user } = interaction;
      /** 내 생일 조회 */
      const birthData = await Schema.findOne({ userId: user.id });

      switch (options.getSubcommand()) {
        case '등록':
          if (birthData)
            return interaction.reply({ content: `이미 생일이 등록되어있어요!`, ephemeral: true });
          interaction.showModal(
            birthdayModal.setTitle('생일등록').setCustomId('birthdayCreateModal'),
          );
          break;
        case '수정':
          if (!birthData)
            return interaction.reply({ content: `생일 등록을 먼저 해주세요!`, ephemeral: true });
          interaction.showModal(
            birthdayModal.setTitle('생일수정').setCustomId('birthdayUpdateModal'),
          );
          break;
        case '삭제':
          if (!birthData)
            return interaction.reply({ content: `등록된 생일이 없어요!`, ephemeral: true });
          interaction.showModal(birthdayDeleteModal);
          break;
      }

      /** isModalSubmit */
    } else if (interaction.isModalSubmit()) {
      const { customId, fields, user } = interaction;

      switch (customId) {
        /** 생일등록 */
        case 'birthdayCreateModal': {
          const year = fields.getTextInputValue('birthdayYear');
          const month = fields.getTextInputValue('birthdayMonth');
          const day = fields.getTextInputValue('birthdayDay');
          /** 유효성 검사 */
          if (isNaN(Number(year)))
            return interaction.reply({ content: 'Year값은 숫자여야만 해요', ephemeral: true });
          if (isNaN(Number(month)))
            return interaction.reply({ content: 'Month값은 숫자여야만 해요', ephemeral: true });
          if (isNaN(Number(day)))
            return interaction.reply({ content: 'Day값은 숫자여야만 해요', ephemeral: true });
          /** 생일데이터 생성 */
          const newDate = new Schema({
            date: year + month.padStart(2, '0') + day.padStart(2, '0'),
            userId: user.id,
          });
          /** 생일저장 */
          newDate
            .save()
            .then(
              async () =>
                await interaction.reply({
                  content: `${month}월 ${day}일에 생일이 입력되었어요. :birthday:`,
                  ephemeral: false,
                }),
            )
            .catch(err => '생일등록 에러 : ' + err);
          break;
        }

        /** 생일수정 */
        case 'birthdayUpdateModal': {
          const year = fields.getTextInputValue('birthdayYear');
          const month = fields.getTextInputValue('birthdayMonth');
          const day = fields.getTextInputValue('birthdayDay');
          /** 유효성 검사 */
          if (isNaN(Number(year)))
            return interaction.reply({ content: 'Year값은 숫자여야만 해요', ephemeral: true });
          if (isNaN(Number(month)))
            return interaction.reply({ content: 'Month값은 숫자여야만 해요', ephemeral: true });
          if (isNaN(Number(day)))
            return interaction.reply({ content: 'Day값은 숫자여야만 해요', ephemeral: true });

          await Schema.findOneAndUpdate(
            { userId: user.id },
            { $set: { date: year + month.padStart(2, '0') + day.padStart(2, '0') } },
          )
            .then(
              async () =>
                await interaction.reply({
                  content: `${month}월 ${day}일로 생일이 수정되었어요. :birthday:`,
                  ephemeral: false,
                }),
            )
            .catch(err => '생일수정 에러 : ' + err);
          break;
        }

        /** 생일삭제 */
        case 'birthdayDeleteModal': {
          const deleteInput = fields.getTextInputValue('birthdayDeleteInput');
          if (deleteInput !== '삭제' && deleteInput !== 'Delete')
            return interaction.reply({
              content: '"삭제"또는"Delete"를 입력해주세요.',
              ephemeral: true,
            });
          await Schema.findOneAndDelete({ userId: user.id })
            .then(
              async () =>
                await interaction.reply({ content: `삭제 완료되었어요.`, ephemeral: true }),
            )
            .catch(err => '생일삭제 에러 : ' + err);
          break;
        }
      }
    }
  },
};
