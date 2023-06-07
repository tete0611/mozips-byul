const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('생일')
    .setDescription('생일을 등록하고 다양한 사람들에게 축하를 받아보아요!')
    .addSubcommand(subCommand => subCommand.setName('등록').setDescription('생일을 등록합니다'))
    .addSubcommand(subCommand => subCommand.setName('수정').setDescription('내 생일을 수정합니다'))
    .addSubcommand(subCommand => subCommand.setName('삭제').setDescription('내 생일을 삭제합니다')),
};
