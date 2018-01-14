const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');

client.config = require("./config.json");
const itemsV3 = require('./itemsV3.json');
const shopV3 = require('./shopV3.json');
const sellV3 = require('./sellV3.json');

const Enmap = require('enmap');
const EnmapLevel = require('enmap-level');
client.guildConfigs = new Enmap({provider: new EnmapLevel({name: "guildConfigs"})});

client.commands = new Enmap(); //Replace with Enmap

client.funcs = require('./functions.js');

fs.readdir("./commands/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    let cmdFunction = require(`./commands/${file}`);
    let cmdName = file.split(".")[0];
    client.commands.set(cmdName,cmdFunction);
  });
});

// Linix version
process.on("SIGINT", function() {
  console.log('Stopping the bot...');
  client.guildConfigs.db.close();
  process.exit();
} );

//Windows version
process.on('message', function (msg) {
  if (msg == 'shutdown') {
    console.log('Stopping the bot...');
    client.guildConfigs.db.close();
    process.exit(0);
  }
})


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


function checkPermisions(message, cmd, guildConf) {
  switch (cmd.config.type) {
    case "Debug":
      if (message.author.id == client.config.ownerid) {
        return true;
      } else {
        message.reply("Don't touch my code!")
        return false;
      }
      break;
    case "Mod":
      if (message.member.roles.has(guildConf.modRole) || message.author.id == client.config.ownerid) {
        return true;
      } else {
        message.reply("Mods are here for a reason")
        return false;
      }
      break;
    case "Student":
      if (message.member.roles.has(guildConf.studentRole) || message.author.id == client.config.ownerid) {
        if (!(guildConf.players.hasOwnProperty(message.author.id))) {
          guildConf.players[message.author.id] = {coins : 200, items: {}};
          client.guildConfigs.set(message.guild.id, guildConf);
        }
        return true;
      } else {
        message.reply("YOu need to be enrolled in The Ultimate Academy for Gifted Juveniles to use this command");
        return false;
      }
      break;
    case "Everyone":
      return true;
      break;
    default:
      message.channel.send(`<@!${client.config.ownerid}>! Get your ass over here!`);
      return false;
  }
}

client.on('message', message => {
  if (!message.content.startsWith(client.config.prefix) || message.author.bot) return;

  const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  const cmd = client.commands.get(command);

  const guildConf = client.guildConfigs.get(message.guild.id);
  if (cmd && checkPermisions(message, cmd, guildConf)) {
    cmd.run(client, guildConf, message, args);
  }

});

client.login(client.config.token);
