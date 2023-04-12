const { EmbedBuilder, Colors } = require('discord.js');

const warningKoreanEmbed = new EmbedBuilder({
  title: '여기서는 한국어만 사용해요!',
  description: `이 채팅방에서는 한국어만 쓰세요!\n영어를 쓰려면 <#1051667735773458542> 채팅방에서 이야기하세요.\n\nYou can use only Korean in this channel. Please use channel <#1051667735773458542> to talk in English:heartpulse:`,
  color: Colors.Red,
});

module.exports = {
  warningKoreanEmbed: warningKoreanEmbed,
};
