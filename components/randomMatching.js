const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

/** 랜덤매칭 참/불참 컴포넌트 */
const sendButton = new ButtonBuilder({
  custom_id: 'randomMatchingConfirmButton',
  label: '참가',
  style: ButtonStyle.Success,
});

const cancelButton = new ButtonBuilder({
  custom_id: 'randomMatchingRejectButton',
  label: '거절',
  style: ButtonStyle.Danger,
});
const row1 = new ActionRowBuilder({ components: [sendButton, cancelButton] });

module.exports = {
  row_1: row1,
};
