const Enmap = require('enmap')
const EnmapLevel = require('enmap-level')

const error = require('../error');
var ParamError = error.ParamError;
var ItemCheck = error.ItemCheck;
var MoneyCheck = error.MoneyCheck;
var ParseError = error.ParseError;


const db = {
  db : new Map()
  //guildConfigs : new Enmap({provider: new EnmapLevel({name: "players"})});
};

db.workItem = (playerID, itemID, amount) => {
    const player = db.db.get(playerID);
    if (!player.items.hasOwnProperty(itemID)) {
      player.items[itemID] = parseInt(amount);  // number of items
    } else {
      player.items[itemID] += parseInt(amount);
    }
    if (player.items[itemID] <= 0) {
      delete player.items[itemID];
    }
    db.db.set(playerID, player)
  };
db.workMoney = (playerID, amount) => {
    const player = db.db.get(playerID);
    player.coins += parseInt(amount);
    if (player.coins < 0) {
      player.coins = 0;
    }
    db.db.set(playerID, player)
  };

  // === Public functions ===
  // Getters
db.getPlayer = (playerID) => { return new Promise(function (resolve, reject) {
    const player = db.db.get(playerID);
    if (player) {
      resolve(player );
    } else {
      reject( new ParamError("Have we forget somebody?"));
    }
  });
};
db.getChannel = (name) => {

};

  // Work with db
  // Money
db.giveMoney = (playerID, amount, msg) => { return new Promise(function(resolve, reject) {
    db.getPlayer(playerID)
      .then(player => {
        return MoneyCheck(player, amount, false);
      })
      .then(() => {
        db.workMoney(playerID, amount);
        resolve([`${amount} was been given`, msg]);
      })
      .catch(err => {
        //console.log(ParseError(err));
        reject(err);
      })
  });
};
db.takeMoney = (playerID, amount, msg) => { return new Promise(function(resolve, reject) {
    db.getPlayer(playerID)
      .then((player) => {
        return MoneyCheck(player, amount, true);
      })
      .then(() => {
        db.workMoney(playerID, -amount);
        resolve([`${amount} was been taken`, msg]);
      })
      .catch(err => {
        //console.log(ParseError(err));
        reject(err);
      })
  });
};
  //Items
db.giveItem = (playerID, itemID, amount, msg) => { return new Promise(function(resolve, reject) {
    Promise.all([db.getPlayer(playerID), ItemCheck(itemID)])
      .then(() => {
        db.workItem(playerID, itemID, amount);
        //console.log("db:" + itemID);
        resolve([itemID, msg]);
      })
      .catch(err => {
        //console.log(ParseError(err));
        reject(err);
      })
  });
};
db.takeItem = (playerID, itemID, amount, msg) => { return new Promise(function(resolve, reject) {
    Promise.all([db.getPlayer(playerID), ItemCheck(itemID)])
      .then(res => {
        let player = res[0];
        if (player.items[itemID] < amount) {
          reject(new ParamError("Not enough items"));
        }
        if (player.items[itemID] == null) {
          reject(new ParamError("You don't have this item"));
        }
        //console.log(player);
        db.workItem(playerID, itemID, -amount);
        resolve([`item ${itemID} was been taken`, msg]);
      })
      .catch(err => {
        //console.log(ParseError(err));
        reject(err);
      })
  })
};
db.nop = (msg) => { return new Promise(function(resolve, reject) {
    resolve(["Nothing",msg]);
  })
};

// Linix version

//db.startDB();

process.on("SIGINT", function() {
  console.log('Stopping the bot...');
  //db.db.db.close();
  process.exit();
} );

// Windows version
process.on('message', function (msg) {
  if (msg == 'shutdown') {
    console.log('Stopping the bot...');
    //db.db.db.close();
    process.exit(0);
  }
});

module.exports = db;
