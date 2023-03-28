const { Events } = require('discord.js');
const { formatToUtc } = require('../../common/function');

module.exports = {
  name: Events.ClientReady,
  once: true,
  /**
   *
   * @param {import('discord.js').Client} client
   */
  async execute(client) {
    console.log(`${client.user.tag} 로그인 , ${formatToUtc(new Date())}`);
  },
};
