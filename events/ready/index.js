// node-schedule : 초 분 시 일 월 요일
const { Events } = require('discord.js');
const schedule = require('node-schedule');
const { formatToUtc, formatToGmt } = require('../../common/function');
const BirthDay = require('../../models/birthday');

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
        const targetChannel = await client.channels.cache.get(process.env.BIRTHDAY_CHANNEL_ID);
        const rule = new schedule.RecurrenceRule();
        rule.tz = 'Asia/Seoul';
      });
    }
  },
};
