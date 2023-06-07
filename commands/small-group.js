const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('소그룹버튼생성')
    .setDescription('소그룹버튼생성')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
};
