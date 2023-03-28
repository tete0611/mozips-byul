const { Client, Collection, REST, Routes, GatewayIntentBits } = require('discord.js');
// const mongoose = require('mongoose');
const { env } = process;

/** 서버연결 */
// mongoose
//   .connect(env.END_POINT, { dbName: env.DB_NAME })
//   .then(console.log('데이터베이스 연결완료'))
//   .catch(console.error);

/** 클라이언트로 부터 수신할 패킷 선언 */
const client = (module.exports = new Client({
  intents: [
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.Guilds,
  ],
}));

/** 이벤트 파일 등록 */
const fs = require('fs');
const eventFolders = fs.readdirSync('./events');
/** 폴더 loop */
for (const folder of eventFolders) {
  const eventsPath = `./events/${folder}`;
  const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
  /** 파일 loop */
  for (const file of eventFiles) {
    const event = require(`./events/${folder}/${file}`);
    if (event.once == true) {
      client.once(event.name, (...args) => event.execute(...args));
    } else {
      client.on(event.name, (...args) => event.execute(...args));
    }
  }
}

/** 커맨드 파일 등록 */
client.commands = new Collection();
/** 무시할 커맨드 파일 */
const ignoreCommandFiles = [
  /** ex) 'ban.js', */
];
const commands_json = [];
const commandsFolders = fs.readdirSync('./commands');
/** 폴더 loop */
for (const folder of commandsFolders) {
  const commandsPath = `./commands/${folder}`;
  const commandsFiles = fs
    .readdirSync(commandsPath)
    .filter(file => file.endsWith('.js') && !ignoreCommandFiles.includes(file));
  /** 파일 loop */
  for (const file of commandsFiles) {
    const command = require(`./commands/${folder}/${file}`);
    client.commands.set(command.data.name, command);
    commands_json.push(command.data.toJSON());
  }
}
const rest = new REST({ version: '10' }).setToken(env.TOKEN);

rest
  .put(Routes.applicationCommands(env.ID), { body: commands_json })
  .then(command => console.log(`${command.length}개의 커맨드를 푸쉬했습니다.`))
  .catch(console.error);

try {
  client.login(env.TOKEN);
} catch (TOKEN_INVALID) {
  console.log('An invalid token was provided');
}
