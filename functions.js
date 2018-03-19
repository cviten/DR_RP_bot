var schedule = require('node-schedule')

const db = require('./db')
const configV3 = require('./configV3');
var ParamError = require('./error').ParamError;
var ItemCheck = require('./error').ItemCheck;

//----------------------------------
const config = configV3.configV3;
const itemsV3 = configV3.itemsV3;
const shopV3 = configV3.shopV3;

const rps_table = [
    [0,-1,1],
    [1,0,-1],
    [-1,1,0]
];

let client = {};

var j = schedule.scheduleJob('30 14 * * *', function(){
  db.db.map(player => {
    player.coins += config.daily;
  })
});


client.item_page = (playerID, page) => { return new Promise(function(resolve, reject) { //DB
  db.getPlayer(playerID)
  .then(player => {
    if (!(Object.getOwnPropertyNames(player.items).length === 0)) {
      const max_page = Math.floor(Object.getOwnPropertyNames(player.items).length / config.page_size);
      page--;
      page = (page > max_page) ? max_page : page;
      let s = "";
      let i = 0;
      for (let item in player.items) {
        i++;
        if ( (i > page * config.page_size) && (i <= ((page + 1) * config.page_size) ) )
        {
          s = s + `id: ${item} | ${itemsV3[item].name} x ${player.items[item]}\n`;
        } else {
          continue;
        }
      }
      page++;
      const page_s = `${page}`
      const msg = "Your items (page " + page_s + ` of ${max_page+1} ):` + "```" + s + "```"
      resolve(msg);
    } else {
      //reject(new ParamError("You don't have anything... :("));
      resolve("You don't have anything... :(");
    }
    })
  .catch(err => {
    reject(err);
    });
})
};

client.item_desc = (itemID) => { return new Promise(function(resolve, reject) { //Items
  ItemCheck(itemID)
  .then(() => {
    color = (config.special_items.indexOf(parseInt(itemID)) != -1) ? 0xeccd15 : 0x21b613;
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
    resolve(embed);
  })
  .catch(() => {
    //reject("We don't have this item");
    reject( new ParamError("We don't have this item"))
  })
})
}

client.item_break = (playerID, itemID) => { return new Promise(function(resolve, reject) { //Items, DB
    db.takeItem(playerID,itemID,1).then(res => {
      let item_name = `*${itemsV3[itemID].name}*`;
      const msg = item_name + " was broken";
      resolve(msg);
    }).catch(err => reject(err))
  //const item = args.slice(0).join(" ");
  //const player = guildConf.players[message.author.id];
})
}

client.item_use = (playerID, itemID) => { return new Promise(function(resolve, reject) {
  Promise.all([db.getPlayer(playerID), ItemCheck(itemID)])
    .then(res => {
      if (res[0].items.hasOwnProperty(itemID)) {
        if (config.special_items.includes(parseInt(itemID))) {
          return db.takeItem(playerID, itemID, 1, itemID);
        }
      } else {
        reject(new ParamError("You don't have this item"))
      }
      return db.nop(itemID);
    })
    .then(res => {
      resolve(`${itemsV3[res[1]].name}`)
    })
    .catch(err => {
      reject(err)
    });
})
}; // Items, DB

//Money operations
/*
client.giveMoney = (guildConf, playerID, amount) => {
  const player = guildConf.players[playerID];
  player.coins = parseInt(guildConf.players[playerID].coins) + parseInt(amount);
}
*/
//Casino operations

client.mono = (playerID) => { // Items, DB
  return new Promise(function(resolve, reject) {
    db.takeMoney(playerID,config.monoPrice)
    .then(res => {
      let item;
      do {
        item = Math.floor(Math.random() * (114 - 1)) + 1;
      } while (config.nonMonoV3.indexOf(item) != -1);
      return db.giveItem(playerID, item, 1, item)
      })
    .then(res => {
      /*
      console.log("Success?");
      console.log("mono:" + res);
      console.log(res[1]);
      */
      resolve(`You win ${itemsV3[res[1]].name}\n${itemsV3[res[1]].desc}`)
      })
    .catch(err => {
      reject(err);
      });
  });
}

client.rps = (playerID, bet, sign) => { // DB
  return new Promise(function(resolve, reject) {
    db.takeMoney(playerID, bet)
      .then(() => {

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
            reject(new ParamError("Wrong sign"));
        };
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
        /*
        db.getPlayer(playerID)
        .then(player => {
          if (player.items.hasOwnProperty("96") && (res == 1)) {
            mult = mult * 1.2;
          };
          console.log("mult block");
          })
        .catch(err => {
          reject(err);
          });
        */
        return db.giveMoney(playerID, Math.floor((res+1) * bet * mult), msg);
      })
      .then(res => {
        resolve(res[1]);
      })
      .catch(err => {
        reject(err);
      })
    }
  )}


client.shop = (playerID, itemID, op) => { // Items, DB, Shop
  return new Promise(function(resolve, reject) {
    switch (op) {
      case "buy":
        db.getPlayer(playerID)
        .then(player => {
          if (shopV3.buy.hasOwnProperty(itemID)) {
            return db.takeMoney(playerID,shopV3.buy[itemID])
          } else {
            reject(new ParamError("Shop doesn't sell such item"));
          }
          })
        .then(() => {
          return db.giveItem(playerID,itemID,1)
        })
        .then(() => {
          resolve(`You bought ${itemsV3[itemID].name}`);
        })
        .catch(err => {
          reject(err);
          });
        break;
      case "sell":
        Promise.all([db.getPlayer(playerID), ItemCheck(itemID)])
        .then(res => {
          return db.takeItem(playerID, itemID, 1)
          })
        .then(() => {
          return db.giveMoney(playerID, shopV3.sell[itemID])
        })
        .then(() => {
          resolve(`You sold ${itemsV3[itemID].name}`);
        })
        .catch(err => {
          reject(err)
          });
        break;
      default:
        reject(new ParamError("Something is wrong here"));
    }
  });
}
//------------------------

//Talking operations

client.shout = (author, avatar, type, name, text) => { return new Promise(function(resolve, reject) {
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
        "url": avatar
    },
    "color": color,
    "fields": [
      {
        "name": name,
        "value": text
      }
    ]
  };
  resolve(embed);
}) };


module.exports = client;
