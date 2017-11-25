const Discord = require('discord.js');
const client = new Discord.Client();

client.config = require("./config.json");

const Enmap = require('enmap');
const EnmapLevel = require('enmap-level');
const guildConfigs = new Enmap({provider: new EnmapLevel({name: "guildConfigs"})});



const itemsV3 = require('./itemsV3.json');
const shopV3 = require('./shopV3.json');
//Casino items that should be removed:
//18,19,21,22,24,31,33,34,35,37,43,44,45,46,48,50,56,67,68,69,71,77,87,89,90,91,92,93,106
const nonMonoV3 = [18,19,21,22,24,31,33,34,35,37,43,44,45,46,48,50,56,67,68,69,71,77,87,89,90,91,92,93,106];


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
  casino: 0,
  players: null
};

//cmd_test = "374298011041398785";
const monoPrice = 100;

const messages_log = "383233337801834497";
rps_table = [
    [0,-1,1],
    [1,0,-1],
    [-1,1,0]
];

client.on("guildCreate", guild => {
  // Adding a new row to the collection uses `set(key, value)`
  guildConfigs.set(guild.id, newSettings);
  console.log("Joined a new guild");
});

//  mod_role = guild.roles.find("name", "test_role");
client.on("guildDelete", guild => {
  // Removing an element uses `delete(key)`
  //guildConfigs.delete(guild.id);
  console.log("Left guild");
});

client.item_get = (guildConf, playerID, itemID) => {
  const player = guildConf.players[playerID];
  if (!player.items.hasOwnProperty(itemID)) {
    player.items[itemID] = 1;  // number of items
  } else {
    player.items[itemID]++;
  }
};

client.item_take = (guildConf, playerID, itemID) => {
  const player = guildConf.players[playerID];
  if (!player.items.hasOwnProperty(itemID)) {
    //player.items[itemID] = 1;  // number of items
    return -1;
  } else {
    player.items[itemID]--;
    if (player.items[itemID] == 0) {
      delete player.items[itemID];
    }
    return 0;
  }
}

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
    client.channels.get(messages_log).send(`Received a DM from **${message.author.username}**:\n\`\`\`${text}\`\`\``);
  }
  //if (message.guild || !message.author.bot) {
    //Points and Coins
  //}
  // Checking prefix and not bot
  if (!(message.content.startsWith(client.config.prefix) || message.content.startsWith(client.config.prefix.toUpperCase()) ) || message.author.bot) return;
  // Loading confing
  const guildConf = guildConfigs.get(message.guild.id);

  //----------------------------------------------------------------------------

  // Debug stuff
  if (message.author.id == client.config.ownerid) {
    if (message.content.startsWith(client.config.prefix + "add")) {
      const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
      const command = args.shift().toLowerCase();
      switch (args[0]) {
        case "players":
          if (!(guildConf.hasOwnProperty("players"))) {
            guildConf.players = {};
            guildConfigs.set(message.guild.id, guildConf);
          } else {
            message.reply(`It already has *${args[0]}*`);
          }
          break;
        default:
          message.reply("Something wrong");
      }
    };
    if (message.content.startsWith(client.config.prefix + "delete")) {
      const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
      const command = args.shift().toLowerCase();
      switch (args[0]) {
        case "players":
          if ((guildConf.hasOwnProperty("players"))) {
            delete guildConf.players
            guildConfigs.set(message.guild.id, guildConf);
          } else {
            message.reply(`It doesn't have *${args[0]}*`);
          }
          break;
        default:
          message.reply("Something wrong");
      }
    }
  }

  // Managing global stuff
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

  // Managing not so global stuff global stuff
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
    if (message.content.startsWith(client.config.prefix + "reset")) {
      const person = message.mentions.members.first();
      if (person) {
        guildConf.players[person.id].coins = 200;
        guildConfigs.set(message.guild.id, guildConf);
        const name = message.mentions.members.first().nickname || message.mentions.members.first().user.username;
        message.channel.send(`**${name}** coins were resetted`);
        //message.channels.get(guildConf.log).send(`**${message.author.username}** sent a Direct message to **${name}**:\n\`\`\`${text}\`\`\``);
      } else {
        message.channel.send("Do we have 17th student, who I don't know about?");
      }
    };
    if (message.content.startsWith(client.config.prefix + "give")) {
      const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
      const person = message.mentions.members.first();
      const num = args[3];
      if ((isNaN(num))) {
        message.reply("Wrong number");
        return;
      }
      if (person) {
        switch (args[2]) {
          case "coins":
            guildConf.players[person.id].coins = parseInt(guildConf.players[person.id].coins) + parseInt(num);
            guildConfigs.set(message.guild.id, guildConf);
            const name = message.mentions.members.first().nickname || message.mentions.members.first().user.username;
            message.channel.send(`**${name}** were given ${num} coins`);
            //message.channels.get(guildConf.log).send(`**${message.author.username}** sent a Direct message to **${name}**:\n\`\`\`${text}\`\`\``);
            break;
          case "item":
            if (num > 0 && num < 114) {
              const name = message.mentions.members.first().nickname || message.mentions.members.first().user.username;
              client.item_get(guildConf, person.id, num);
              message.reply(`Item was given to ${name}`)
              guildConfigs.set(message.guild.id, guildConf);
            } else {
              message.reply("Don't have this item");
              return;
            }
            break;
          default:
        }
      } else {
        message.channel.send("Do we have 17th student, who I don't know about?");
      }
    }
  }

  //Student's stuff
  if (message.author.id == client.config.ownerid || message.member.roles.has(guildConf.studentRole)) {
    if (message.content.startsWith(client.config.prefix + "init")) {
      if (!(guildConf.hasOwnProperty("players"))) {
        guildConf.players = {};
        guildConfigs.set(message.guild.id, guildConf);
      } else {
        if (!(guildConf.players.hasOwnProperty(message.author.id))) {
          guildConf.players[message.author.id] = {coins : 200, items: {}};
          guildConfigs.set(message.guild.id, guildConf);
          message.channel.send("Success");
        } else {
          message.channel.send("Failure");
        }
      };

    }
    if (message.content.startsWith(client.config.prefix + "coins")) {
      if (guildConf.players.hasOwnProperty(message.author.id)) {
        message.channel.send(`You have ${guildConf.players[message.author.id].coins} Monocoins`);
      } else {
        message.channel.send("Don't have you as a player...");
      }
    }
    if (message.channel.id == guildConf.casino || message.channel.id==cmd_test ) {
      if (message.content.startsWith(client.config.prefix + "rps")) {
        const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();
        const bet = args[0]; const sign = args[1];
        const player = guildConf.players[message.author.id];
        if (!player) {
          message.channel.send("Don't have this player");
        }
        if ((isNaN(bet)) || (bet < 0)) {
          message.channel.send("Wrong bet");
          return;
        };
        if (bet > player.coins) {
          message.channel.send("You don't have that many coins");
          return;
        }
        let pl;
        switch (sign) {
          case "Rock":
          case "rock":
          case "R":
          case "r":
            pl = 2;
            break;
          case "Paper":
          case "paper":
          case "P":
          case "p":
            pl = 1;
            break;
          case "Scissors":
          case "scissors":
          case "S":
          case "s":
            pl = 0;
            break;
          default:
          message.reply("Wrong sign");
          return;
        }
        const comp = Math.floor(Math.random() * 3);
        const res = rps_table[pl][comp];
        switch (res) {
          case 1:
            message.channel.send("You won!");
            break;
          case 0:
            message.channel.send("Tie");
            break;
          case -1:
            message.channel.send("You lose!");
            break;
        }
        player.coins = player.coins + res * bet;
        guildConf.players[message.author.id] = player;
        guildConfigs.set(message.guild.id, guildConf);
      }
    };
    if (message.content.startsWith(client.config.prefix + "items")) {
      if (guildConf.players.hasOwnProperty(message.author.id)) {
        if (!(Object.getOwnPropertyNames(guildConf.players[message.author.id].items).length === 0)) {
          let s = "";
          for (var item in guildConf.players[message.author.id].items ) {
            s = s + `id: ${item} | ${itemsV3[item].name} x ${guildConf.players[message.author.id].items[item]}\n`
          }
          message.channel.send("Your items: ```" + s + "```");
        } else {
          message.channel.send("You don't have anything... :(")
        }
      } else {
        message.channel.send("Don't have you as a player...");
      }
    }
    if (message.content.startsWith(client.config.prefix + "mono")) {
      const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
      const command = args.shift().toLowerCase();
      const player = guildConf.players[message.author.id];
      if (monoPrice > player.coins) {
        message.channel.send("You don't have that many coins");
        return;
      } else {
        let item;
        do {
          item = Math.floor(Math.random() * (114 - 1)) + 1;
        } while (nonMonoV3.indexOf(item) != -1);
        client.item_get(guildConf, message.author.id, item);
        message.channel.send(`You win ${itemsV3[item].name}`);
        player.coins = player.coins - monoPrice;
        guildConf.players[message.author.id] = player;
        guildConfigs.set(message.guild.id, guildConf);
      }
    };
    if (message.content.startsWith(client.config.prefix + "shop")) {
      if (guildConf.players.hasOwnProperty(message.author.id)) {
        const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();
        const item = args.slice(0).join(" ");
        const player = guildConf.players[message.author.id];
        switch (item) {
          case "150":
          case "Love Key":
            if (shopV3[150] > player.coins) {
              message.channel.send("You don't have that many coins");
              return;
            } else {
              client.item_get(guildConf, message.author.id, 150);
              player.coins = player.coins - shopV3[150];
              guildConf.players[message.author.id] = player;
              guildConfigs.set(message.guild.id, guildConf);
              message.channel.send(`You bought ${itemsV3[item].name}`);
            }
            break;
          default:
            message.channel.send("Wrong item");
        }
      } else {
        message.channel.send("Don't have you as a player...");
      }
    }
  }

  //Everyone's stuff
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
