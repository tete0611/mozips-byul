const { Events } = require('discord.js');
const Birthday = require('../../models/birthday');

module.exports = {
  name: Events.GuildMemberRemove,
  once: false,
  /**
   *
   * @param {import('discord.js').GuildMember} member
   */
  async execute(member) {
    await Birthday.findOneAndDelete({ userId: member.user.id })
      .then(result => {
        if (result) console.log(`${member.displayName} 님의 이탈로인해 생일이 삭제되었습니다.`);
      })
      .catch(err => console.log(err));
  },
};
