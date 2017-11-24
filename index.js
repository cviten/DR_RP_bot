const Discord = require('discord.js');
const client = new Discord.Client();

client.config = require("./config.json");

const Enmap = require('enmap');
const EnmapLevel = require('enmap-level');
const guildConfigs = new Enmap({provider: new EnmapLevel({name: "guildConfigs"})});

client.on('ready', () => {
  console.log('I am ready!');
});


const newSettings = {
  prefix: "m!",
  modRole: 0,
  studentRole: 0,
  log: 0,
  mod: 0,
  news: 0,
  announcement: 0,
  trial: 0,
  casino: 0
};

client.on("guildCreate", guild => {
  // Adding a new row to the collection uses `set(key, value)`
  guildConfigs.set(guild.id, newSettings);
  console.log("Joined a new guild");
});

//  mod_role = guild.roles.find("name", "test_role");
client.on("guildDelete", guild => {
  // Removing an element uses `delete(key)`
  guildConfigs.delete(guild.id);
  console.log("Left guild");
});

client.shout = (message, type, name, text) => {
  const author = message.member.nickname || message.author.username;
  let title;
  let color;
  switch (type) {
    case "obj":
      title = "NO, THAT'S WRONG";
      color = 0xCC4444;
      break;
    case "agree":
      title = "I AGREE WITH THAT";
      color = 0x3A85FF
      break;
    default:
      title = "Something wrong";
      color = 0x000000
  };
  if (!text) {
    text = "I forgot what I wanted to say.";
  }
  const embed = {
    "title": title,
    "author": {
      "name": author
    },
    "thumbnail": {
        "url": message.author.avatarURL
    },
    "color": color,
    "fields": [
      {
        "name": name,
        "value": text
      }
    ]
  };
  message.channel.send({embed});
}

client.say = (message, channel, text) => {
  if (!text) {
    text = "I forgot what I wanted to say."
  }
  message.guild.channels.get(channel).send(text);
}

client.on('message', message => {
  if (!message.guild && !message.author.bot) {
    const text = message.content;
    client.channels.get(client.config.log_channel).send(`Received a DM from **${message.author.username}**:\n\`\`\`${text}\`\`\``);
  }
  if (message.guild || !message.author.bot) {
    //Points and Coins
  }
  // Checking prefix and not bot
  if (!(message.content.startsWith(client.config.prefix) || message.content.startsWith(client.config.prefix.toUpperCase()) ) || message.author.bot) return;
  // Loading confing
  const guildConf = guildConfigs.get(message.guild.id);

  if (message.author.id == client.config.ownerid) {
    if (message.content.startsWith(client.config.prefix + "update")) {

    }
  }

  if (message.author.id == client.config.ownerid || message.member.hasPermission("ADMINISTRATOR")) {
    if (message.content.startsWith(client.config.prefix + "set")) {
      const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
      const command = args.shift().toLowerCase();
      if (!args[0]) {
        message.channel.send("Something wrong");
        return;
      }
      switch (args[0]) {
        case "news":
          guildConf.news = message.channel.id;
          break;
        case "announcement":
          guildConf.announcement = message.channel.id;
          break;
        case "trial":
          guildConf.trial = message.channel.id;
          break;
        case "log":
          guildConf.log = message.channel.id;
          break;
        case "casino":
          guildConf.casino = message.channel.id;
          break;
        case "modRole":
          if (message.mentions.roles.first()) {
            guildConf.modRole = message.mentions.roles.first().id;
          } else {
            message.channel.send("Something wrong");
            return;
          }
          break;
        case "studentRole":
          if (message.mentions.roles.first()) {
            guildConf.studentRole = message.mentions.roles.first().id;
          } else {
            message.channel.send("Something wrong");
            return;
          }
          break;
        default:
          message.channel.send("Something wrong");
          return;
      }
      guildConfigs.set(message.guild.id, guildConf);
      message.channel.send(`**${args[0]}** is setted successfully`);
    }
  };

  const cmd_test="374298011041398785";

  if (message.author.id == client.config.ownerid || message.member.roles.has(guildConf.modRole) || message.channel.id==cmd_test) {
    if (message.content.startsWith(client.config.prefix + "say") ||
        message.content.startsWith(client.config.prefix + "announce") ||
        message.content.startsWith(client.config.prefix + "gym") ||
        message.content.startsWith(client.config.prefix + "news") ||
        message.content.startsWith(client.config.prefix + "trial")) {
      const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
      //member.guild.channels.get("welcome").send(`"${member.user.username}" has joined this server`);
      const command = args.shift().toLowerCase();
      let text = args.slice(0).join(" ");
      message.delete();
      let channel = 0;
      //message.guild.channels.get(client.config.announcement_channel).send(text);
      switch (command) {
        case "announce":
          channel = guildConf.announcement;
          break;
        case "gym":
          channel = guildConf.announcement;
          break;
        case "news":
          channel = guildConf.news;
          break;
        case "trial":
          channel = guildConf.trial;
          break;
        default:
          channel = message.channel.id;
      }
      if (!channel) {
        message.reply(`Channel ${command} is not setted`);
        return;
      }
      client.say(message, channel, text)
      if (guildConf.log) {
        message.guild.channels.get(guildConf.log).send(`**${message.author.username}** sent a message in **${message.guild.channels.get(channel).name}**:\n\`\`\`${text}\`\`\``);
      }
    } else
    if (message.content.startsWith(client.config.prefix + "dm")) {
      const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
      const person = message.mentions.members.first();
      const name = message.mentions.members.first().nickname || message.mentions.members.first().user.username;
      let text = args.slice(2).join(" ");
      if (!text) {
        text = "I forgot what I wanted to say.";
      }
      if (person) {
        message.delete();
        person.send(text);
        message.guild.channels.get(guildConf.log).send(`**${message.author.username}** sent a Direct message to **${name}**:\n\`\`\`${text}\`\`\``);
      } else {
        message.channel.send("Do we have 17th student, who I don't know about?");
      }
    }
  }
  // Shouting "That's wrong" and "I agree with this"
  if (message.content.startsWith(client.config.prefix + "obj") || message.content.startsWith(client.config.prefix.toUpperCase() + "obj") || message.content.startsWith(client.config.prefix + "agree") || message.content.startsWith(client.config.prefix.toUpperCase() + "agree")) {
    const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const person = message.mentions.members.first();
    message.delete();
    if (person) {
      const name = message.mentions.members.first().nickname || message.mentions.members.first().user.username;
      const text = args.slice(1).join(" ");
      client.shout(message, command, name, text);
    } else {
      const name = "Everyone";
      const text = args.slice(0).join(" ");
      client.shout(message, command, name, text);
    }
  }
  else
  if (message.content.startsWith(client.config.prefix + "inv")) {
    //const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
    //message.delete();
    client.channels.get(master_room).send(`<@!304718419427721217> Check **${message.channel.name}**`);
  }


  //client.channels.get(master_room).send(`<@!304718419427721217> Check **${message.channel.name}**`);

});

client.login(client.config.token);
