const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

const enterButton = new ButtonBuilder({
  custom_id: 'smallGroupEnterButton',
  label: '참가',
  style: ButtonStyle.Primary,
});
const cancelButton = new ButtonBuilder({
  custom_id: 'smallGroupCancelButton',
  label: '취소하기',
  style: ButtonStyle.Danger,
});

const enterRow = new ActionRowBuilder({ components: [enterButton] });
const cancelRow = new ActionRowBuilder({ components: [cancelButton] });

module.exports = {
  enterButton: enterRow,
  cancelButton: cancelRow,
};
