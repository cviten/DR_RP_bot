const config = require("./configV3.json");
const itemsV3 = require('./itemsV3.json');
const shopV3 = require('./shopV3.json');
const sellV3 = require('./sellV3.json');

const rps_table = [
    [0,-1,1],
    [1,0,-1],
    [-1,1,0]
];

function Answer(res, msg) {
  this.res = res;
  this.msg = msg;
}

let client = {};
//Mod operations

client.item_give = (guildConf, playerID, itemID, n) => {
  if (client.isNormal(itemID) || (config.special_items.indexOf(parseInt(itemID)) != -1) || (config.added_items.indexOf(parseInt(itemID)) != -1) ) {
    //const name = message.mentions.members.first().nickname || message.mentions.members.first().user.username;
    n = (!(isNaN(n))) ? parseInt(n) : 1
    client.item_get(guildConf, playerID, itemID, n);
    //message.reply(`Item was given to ${name}`)
    return new Answer(true, "Item was given to ");
    //client.guildConfigs.set(message.guild.id, guildConf);
  } else {
    //message.reply("Don't have this item in the warehouse");
    return new Answer(false, "Don't have this item in the warehouse");
  }
}

//return new Answer(true, ` gave *${itemsV3[itemID].name}* to `);
client.item_trade = (guildConf, playerID, targetID, itemID, n) => {
  if (client.isNormal(itemID) || (config.special_items.indexOf(parseInt(itemID)) != -1) || (config.added_items.indexOf(parseInt(itemID)) != -1) ) {
    if (client.item_take(guildConf, playerID, itemID, n) == 0) {
      n = (!(isNaN(n))) ? parseInt(n) : 1
      client.item_get(guildConf, targetID, itemID, n);
    } else {
      return new Answer(false, "Don't try to give something out of empty pockets");
    }
    return new Answer(true, ` gave **${itemsV3[itemID].name}** to `);
  } else {
    return new Answer(false, "Don't have this item in the warehouse");
  }
}


//Items operations

client.item_get = (guildConf, playerID, itemID, n) => {
  const player = guildConf.players[playerID];
  n = !(isNaN(n)) ? parseInt(n) : 1
  if (!player.items.hasOwnProperty(itemID)) {
    player.items[itemID] = parseInt(n);  // number of items
  } else {
    player.items[itemID] += parseInt(n);
  }
};

client.item_take = (guildConf, playerID, itemID, n) => {
  const player = guildConf.players[playerID];
  n = !(isNaN(n)) ? parseInt(n) : 1
  if (!player.items.hasOwnProperty(itemID)) {
    //player.items[itemID] = 1;  // number of items
    return -1;
  } else {
    player.items[itemID] -= n;
    if (player.items[itemID] <= 0) {
      delete player.items[itemID];
    }
    return 0;
  }
}

client.item_page = (guildConf, playerID, page) => {
  const max_page = Math.floor(Object.getOwnPropertyNames(guildConf.players[playerID].items).length / config.page_size);
  page--;
  page = (page > max_page) ? max_page : page;
  let s = "";
  let i = 0;
  for (let item in guildConf.players[playerID].items ) {
    i++;
    if ( (i > page * config.page_size) && (i <= ((page + 1) * config.page_size) ) )
    {
      s = s + `id: ${item} | ${itemsV3[item].name} x ${guildConf.players[playerID].items[item]}\n`;
    } else {
      continue;
    }
  }
  page++;
  const page_s = `${page}`
  const msg = "Your items (page " + page_s + "): ```" + s + "```"
  return new Answer(true, msg);
}

client.item_desc = (itemID) => {
  if ( ( client.isNormal(itemID) || (config.special_items.indexOf(parseInt(itemID)) != -1) || (config.added_items.indexOf(parseInt(itemID)) != -1) ) ) {
    color = (config.special_items.indexOf(parseInt(itemID)) != -1) ? 0xeccd15 : 0x21b613
    const embed = {
      "title": itemsV3[itemID].name,
      "author": {
        "name": "ID: " + itemID
      },
      "color": color, //0xeccd15 for specail items
      "fields": [
        {
          "name": "Description",
          "value": itemsV3[itemID].desc
        },
        {
          "name": "Like",
          "value": itemsV3[itemID].like,
          "inline": true
        },
        {
          "name": "Love",
          "value": itemsV3[itemID].love,
          "inline": true
        },
      ]
    };
    return new Answer(true, embed);
  } else {
    return new Answer(false, "We don't have this item");
  }
}

client.item_break = (guildConf, playerID, itemID) => {
  //const item = args.slice(0).join(" ");
  //const player = guildConf.players[message.author.id];
  if (client.isNormal(itemID) || (config.special_items.indexOf(parseInt(itemID)) != -1) || (config.added_items.indexOf(parseInt(itemID)) != -1) ) {
    if (client.item_take(guildConf,playerID, itemID, 1) == 0) {
      //message.channel.send(`*${itemsV3[item].name}* was broken`);
      const item_name = `*${itemsV3[itemID].name}*`
      const msg = item_name + " was broken";
      return new Answer(true, msg);
    } else {
      //message.channel.send(`You don't have this item.`);
      return new Answer(false, "You don't have this item.");
    };
  } else {
    //message.channel.send("Something wrong with number");
    return new Answer(false, "Something wrong with number");
  }
}

client.item_use = (guildConf, playerID, itemID) => {
  if (client.isNormal(itemID) || (config.special_items.indexOf(parseInt(itemID)) != -1) || (config.added_items.indexOf(parseInt(itemID)) != -1) ) {
    if (client.item_take(guildConf,playerID, itemID, 1) == 0) {
      //message.channel.send(`*${itemsV3[item].name}* was broken`);
      if (!(config.special_items.indexOf(parseInt(itemID)) != -1)) {
        client.item_get(guildConf,playerID, itemID, 1);
      }
      const item_name = `*${itemsV3[itemID].name}*`
      const msg = " is using " + item_name;
      return new Answer(true, msg);
    } else {
      //message.channel.send(`You don't have this item.`);
      return new Answer(false, "You don't have this item.");
    };
  } else {
    //message.channel.send("Something wrong with number");
    return new Answer(false, "Something wrong with number");
  }
}

//Money operations

client.giveMoney = (guildConf, playerID, amount) => {
  const player = guildConf.players[playerID];
  player.coins = parseInt(guildConf.players[playerID].coins) + parseInt(amount);
}

//Game operations

client.mono = (guildConf, playerID) => {
  const player = guildConf.players[playerID];
  if (config.monoPrice > player.coins) {
    //message.channel.send("You don't have that many coins");
    return new Answer(false, "You don't have that many coins");
  } else {
    let item;
    do {
      item = Math.floor(Math.random() * (114 - 1)) + 1;
    } while (config.nonMonoV3.indexOf(item) != -1);
    client.item_get(guildConf, playerID, item);
    //message.channel.send(`You win ${itemsV3[item].name}\n${itemsV3[item].desc}`);
    player.coins = player.coins - config.monoPrice;
    guildConf.players[playerID] = player;
    const item_name = `${itemsV3[item].name}`;
    const item_desc = `${itemsV3[item].desc}`;
    const msg = "You win " + item_name+ "\n" + item_desc;
    return new Answer(true, msg);
    //guildConfigs.set(message.guild.id, guildConf);
  }
}

client.rps = (guildConf, playerID, bet, sign) => {
  const player = guildConf.players[playerID];
  if (!player) {
    message.channel.send("Don't have this player");

  }
  if ((isNaN(bet)) || (bet < 0)) {
    return new Answer(false, "Wrong bet");
  };
  bet = Math.floor(bet);
  if (bet > player.coins) {
    //message.channel.send("You don't have that many coins");
    return new Answer(false, "You don't have that many coins");
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
      //message.reply("Wrong sign");
      return new Answer(false, "Wrong sign");
  }
  const comp = Math.floor(Math.random() * 3);
  const res = rps_table[pl][comp];
  let msg;
  switch (res) {
    case 1:
      msg = "You won!";
      break;
    case 0:
      msg = "Tie!";
      break;
    case -1:
      msg = "You lose!";
      break;
  }
  let mult = 1;
  if ((player.items.hasOwnProperty("96")) && (res == 1)) {
    mult = mult * 1.2;
  }
  player.coins = Math.floor(player.coins + res * bet * mult);
  guildConf.players[playerID] = player;
  return new Answer(true, msg);
};

client.shop = (guildConf, playerID, itemID, op) => {
  const player = guildConf.players[playerID];
  switch (op) {
    case "buy":
      if (shopV3.hasOwnProperty(itemID)) {
        if (shopV3[itemID] > player.coins) {
          return new Answer(false, "You don't have enough moeny for this item");
        } else {
          client.item_get(guildConf, playerID, itemID, 1);
          player.coins = player.coins - shopV3[itemID];
          guildConf.players[playerID] = player;
          //guildConfigs.set(message.guild.id, guildConf);
          //message.channel.send(`You bought ${itemsV3[item].name}`);
          return new Answer(true, `You bought ${itemsV3[itemID].name}`);
        }
      } else {
        return new Answer(false, "Sorry! We don't have this item in the shop.");
      }
      break;
    case "sell":
      //return new Answer(false, "We don't have this functionality yet");
      if (client.isNormal(itemID) || (config.special_items.indexOf(parseInt(itemID)) != -1) || (config.added_items.indexOf(parseInt(itemID)) != -1) ) {
        if (client.item_take(guildConf,playerID, itemID, 1) == 0) {
          client.giveMoney(guildConf, playerID, sellV3[itemID]);
          //message.channel.send(`*${itemsV3[item].name}* was broken`);
          //const item_name = `*${itemsV3[itemID].name}*`
          const msg = ` sells *${itemsV3[itemID].name}*`;
          return new Answer(true, msg);
        } else {
          //message.channel.send(`You don't have this item.`);
          return new Answer(false, "You don't have this item.");
        };
      } else {
        //message.channel.send("Something wrong with number");
        return new Answer(false, "Something wrong with number");
      }
      break;
    default:
      return new Answer(false, "Something is wrong here");
  }
}
//------------------------

//Talking operations

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
};

client.say = (message, channel, text) => {
  if (!text) {
    text = "I forgot what I wanted to say."
  }
  message.guild.channels.get(channel).send(text);
};

client.log = (guildConf, message, channel, text) => {
  if (guildConf.log && (config.summit_channels.indexOf(channel) != -1)) {
    message.guild.channels.get(guildConf.log).send(`**${message.author.username}** sent a message in **${message.guild.channels.get(channel).name}**:\n\`\`\`${text}\`\`\``);
  } else {
    message.guild.channels.get(config.summit_log).send(`**${message.author.username}** sent a message in **${message.guild.channels.get(channel).name}**:\n\`\`\`${text}\`\`\``);
  }
};

module.exports = client;
