const { TextInputBuilder, TextInputStyle, ActionRowBuilder, ModalBuilder } = require('discord.js');

const birthdayModal = new ModalBuilder();
const birthdayDeleteModal = new ModalBuilder()
  .setCustomId('birthdayDeleteModal')
  .setTitle('생일삭제');

const year = new TextInputBuilder()
  .setLabel('Year')
  .setPlaceholder('YYYY')
  .setCustomId('birthdayYear')
  .setStyle(TextInputStyle.Short)
  .setMinLength(4)
  .setMaxLength(4)
  .setRequired(true);

const month = new TextInputBuilder()
  .setLabel('Month')
  .setPlaceholder('MM')
  .setCustomId('birthdayMonth')
  .setStyle(TextInputStyle.Short)
  .setMinLength(1)
  .setMaxLength(2)
  .setRequired(true);

const day = new TextInputBuilder()
  .setLabel('Day')
  .setPlaceholder('DD')
  .setCustomId('birthdayDay')
  .setStyle(TextInputStyle.Short)
  .setMinLength(1)
  .setMaxLength(2)
  .setRequired(true);

const deleteInput = new TextInputBuilder()
  .setLabel('확인')
  .setPlaceholder(`"삭제"또는"Delete"를 입력해주세요`)
  .setStyle(TextInputStyle.Short)
  .setCustomId('birthdayDeleteInput')
  .setRequired(false);

const row_1 = new ActionRowBuilder().addComponents(year);
const row_2 = new ActionRowBuilder().addComponents(month);
const row_3 = new ActionRowBuilder().addComponents(day);

const deleteRow_1 = new ActionRowBuilder().addComponents(deleteInput);

birthdayModal.addComponents(row_1, row_2, row_3);
birthdayDeleteModal.addComponents(deleteRow_1);

module.exports = {
  birthdayModal: birthdayModal,
  birthdayDeleteModal: birthdayDeleteModal,
};
