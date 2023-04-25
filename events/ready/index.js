// node-schedule : 초 분 시 일 월 요일
const { Events, EmbedBuilder, Colors } = require('discord.js');
const schedule = require('node-schedule');
const {
  formatToUtc,
  formatToGmt,
  getUser,
  getRandomElement,
  getUserImage,
} = require('../../common/function');
const BirthDay = require('../../models/birthday');
const { env } = process;

const colors = Object.values(Colors);

module.exports = {
  name: Events.ClientReady,
  once: true,
  /**
   *
   * @param {import('discord.js').Client} client
   */
  async execute(client) {
    const today = new Date();
    console.log(
      `${client.user.username} 로그인 , ${formatToUtc(today)} / ${formatToGmt(today)}(한국시)`,
    );

    const birthdayJobs = await BirthDay.find();
    if (birthdayJobs.length !== 0) {
      birthdayJobs.map(async v => {
        const { date, userId } = v;
        const targetChannel = await client.channels.cache.get(env.BIRTHDAY_CHANNEL_ID);
        const user = await getUser(userId);
        const userImage = await getUserImage(user, 4096);
        const guild = await client.guilds.cache.get(env.SERVER_ID);
        const name = (await guild.members.fetch(user)).displayName;
        const month = Number(date.substring(4, 6));
        const day = Number(date.substring(6));
        const embed = new EmbedBuilder()
          .setTitle(`:birthday:${name}님의 생일을 축하합니다`)
          .setDescription(
            `${user}님 생일 축하해요:love_letter: 행복한 하루 보내세요\n\nHappy birthday,${name}:partying_face:\nLet's celebrate ${name}'s birthday together!\n\n_Villagers!_ ${name}님의 생일을 같이 축하해주세요!`,
          )
          .setColor(getRandomElement(colors))
          .setFooter({
            iconURL: 'https://i.esdrop.com/d/f/1Ik176tCZg/3VHW97RTiA.png',
            text: 'Mozips village',
          })
          .setThumbnail(userImage);

        schedule.scheduleJob({ tz: 'Asia/Seoul', rule: `0 0 0 ${day} ${month} *` }, async () => {
          await targetChannel.send({ embeds: [embed] });
        });
      });
      console.log(birthdayJobs.length + '개의 생일이 등록되었습니다.');
    }
  },
};
