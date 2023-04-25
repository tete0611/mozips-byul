const { Events, AttachmentBuilder } = require('discord.js');
const { checkRole } = require('../../common/function');

module.exports = {
  name: Events.MessageCreate,
  once: false,
  /**
   *
   * @param {import('discord.js').Message} message
   */
  async execute(message) {
    const { content, member, guild } = message;
    if (!checkRole(member, 'Manager')) return;
    if (content === '!소개하기') {
      const picture_1 = new AttachmentBuilder(
        'https://cdn.discordapp.com/attachments/1095518704994881636/1096326069960851498/intro_1.png',
      );
      const picture_2 = new AttachmentBuilder(
        'https://cdn.discordapp.com/attachments/1095518704994881636/1096326070191534171/intro_2.png',
      );
      const picture_3 = new AttachmentBuilder(
        'https://cdn.discordapp.com/attachments/1095518704994881636/1096326070422208573/intro_3.png',
      );
      const picture_4 = new AttachmentBuilder(
        'https://cdn.discordapp.com/attachments/1095518704994881636/1096326070640328764/intro_4.png',
      );
      const picture_5 = new AttachmentBuilder(
        'https://cdn.discordapp.com/attachments/1095518704994881636/1096326070875205733/intro_5.png',
      );
      const picture_6 = new AttachmentBuilder(
        'https://cdn.discordapp.com/attachments/1095518704994881636/1096326071101685760/intro_6.png',
      );
      const introChannel = guild.channels.cache.get(process.env.INTRO_CHANNEL_ID);
      await introChannel.send({
        files: [picture_1, picture_2, picture_3, picture_4, picture_5, picture_6],
      });
    }
    if (content === '!소그룹공지하기') {
      const group_1 = {
        id: '1092699385915260978',
        members: ['Ariel', 'etsha', 'kenzie!', 'rain0.Id', 'Shermaine', 'Zola'],
      };
      const group_2 = {
        id: '1092699536364945478',
        members: ['아리', 'ha-ri', 'lucieenb', 'salezy', 'Su-Jin (수진)'],
      };
      const group_3 = {
        id: '1092699655244091464',
        members: ['아이샤', 'Dxliaaa', 'Oreoluwa', 'Soso_B', 'Thinniee'],
      };
      const group_4 = {
        id: '1092699708054573116',
        members: ['~만두 ~', '수정 :crystal_ball:', 'Gorma', 'Monica', 'naymg'],
      };
      const group_5 = {
        id: '1092699731446206464',
        members: ['ading', 'Kim', 'misanthrope', 'nafisa17', 'Rizti'],
      };
      const group_6 = {
        id: '1092699810550775878',
        members: ['레아', '쏭쏭:밤::얼룩_다람쥐:', '푸부키', 'kx_', 'strawberryjamontop'],
      };
      const group_7 = {
        id: '1092699854540656731',
        members: ['하나だよ', 'Lin_', 'Uhti Akmal', 'Vuvuzela 부부젤라'],
      };
      const group_8 = {
        id: '1092699896768897105',
        members: ['마리아나', 'Gladys 글래디스', 'Handan', 'harin', 'mayangstephanie'],
      };
      const group = [group_1, group_2, group_3, group_4, group_5, group_6, group_7, group_8];

      group.forEach(async v => {
        const channel = await guild.channels.cache.get(v.id);
        await channel.send({
          content: `${v.members
            .map(v2 => `@${v2}`)
            .join(' ')}\nHere is the private channel for group ${
            v.members.length
          } members!\nYou can use this channel until May 3`,
        });
      });
    }
  },
};
