const { Events } = require('discord.js');
const { formatToUtc, formatToGmt } = require('../../common/function');

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
  },
};
