const Discord = require('discord.js')
const client = new Discord.Client()
const fs = require('fs')

client.config = require('./config.json')
client.configV3 = require('./configV3')
const db = require('./db')
// const itemsV3 = require('./itemsV3.json');
// const shopV3 = require('./shopV3.json');
// const sellV3 = require('./sellV3.json');
client.rolesV3 = client.configV3.rolesV3;

const Enmap = require('enmap')
const EnmapLevel = require('enmap-level')
// client.guildConfigs = new Enmap({provider: new EnmapLevel({name: "guildConfigs"})});

client.commands = new Enmap() // Replace with Enmap

client.funcs = require('./functions.js')


fs.readdir('./commands/', (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    let cmdFunction = require(`./commands/${file}`);
    let cmdName = file.split(".")[0];
    client.commands.set(cmdName, cmdFunction);
  });
});




client.on('ready', () => {
  console.log('I am ready!');
});

const newSettings = {
  //prefix: "r!",
  modRole: 0,
  studentRole: 0,
  log: 0,
  mod: 0,
  news: 0,
  announcement: 0,
  trial: 0,
  casino: 0,
  players: {}
};


client.checkPerm = (message) => {
  let role = 0;
  if (message.author.id == client.config.ownerid) { return 10; };
  //if (message.member.roles.has(role.id)) {return 4; };
  role = message.guild.roles.find("name", "Ultimate Moderators");
  if (message.member.roles.has(role.id)) {return 4; };
  role = message.guild.roles.find("name", "Students");
  if (message.member.roles.has(role.id)) {return 3; };
  role = message.guild.roles.find("name", "Ghost");
  if (message.member.roles.has(role.id)) {return 2; };
  role = message.guild.roles.find("name", "Viewer");
  if (message.member.roles.has(role.id)) {return 1; };
  return 0;
}

client.checkPermisions = (message, cmd) => {
  const cmdLevel = client.configV3.rolesV3[cmd.config.type];
  const permLevel = client.checkPerm(message);
  if (permLevel >= cmdLevel) {
    if (permLevel >= 3) {
      if (!(db.db.get(message.author.id))) {
        let startCoins = {coins : 10000, items: {'2': 10}};
        db.db.set(message.author.id, startCoins);
        //message.reply("Welcome to The Ultimate Academy for Gifted Juveniles. Hope you enjoy stay here!")
      }
    }
    return true;
  } else {
    switch (cmdLevel) {
      case 5:
        message.reply("Who dares to use this command?")
        break;
      case 4:
        message.reply("Student council still hasn't decided to give students right to use this command")
        break;
      case 3:
        message.reply("Update your Monopad to use this command!")
        break;
      case 2:
        message.reply("You need to be enrolled in The Ultimate Academy for Gifted Juveniles to use this command!")
        break;
      case 1:
        message.reply("Buy newest Danganronpa V3 for only 10 Hope Bagels! Otherwise this command won't be availbale for you!")
        break;
      case 1:
        message.reply("Are you sure you on the right server?")
        break;
      default:
        message.channel.send(`Somebody ping <@!${client.config.ownerid}> for this!`);
        console.log("Role idefication error");
    }
    return false;
  }
}


client.on('message', message => {
  if (!message.content.startsWith(client.config.prefix) || message.author.bot) return;

  const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  const cmd = client.commands.get(command);

  //const guildConf = 0;
  if (cmd && client.checkPermisions(message, cmd)) {
    cmd.run(client, message, args);
  }

});

client.login(client.config.token);
