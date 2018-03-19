const util = require('util');

// Errors
function ParamError(message) {
  this.message = message;
}
util.inherits(ParamError, Error);
ParamError.prototype.name = 'ParamError';

exports.ParamError = ParamError;

function ItemCheck(itemID) { return new Promise(function(resolve, reject) {
  if ((itemID >= 1  && itemID <= 132) || (itemID >= 150  && itemID <= 162)) {
    // 1 - 113   - Original DRV3 items
    // 114 - 129 - Underwear (needed to be added)
    // 130 - 132 - Added items (EMP grenade and rings)
    // 150 - 162 - Keys and stones
    resolve(itemID);
  } else {
    reject(new ParamError("Such item does not exist"));
  }
});
}

function MoneyCheck(player, amount, checkPlayer) { return new Promise(function(resolve, reject) {
  amount = parseInt(amount);
  if (amount < 0 || isNaN(amount)) {reject(new ParseError("Wrong number!"))}
  if (!checkPlayer || player.coins >= amount) {
    resolve(player);
  } else {
    reject(new ParamError("Not enough resources"));
  }
});
}

function HaveItemCheck(player, itemID) { return new Promise(function(resolve, reject) {
  if (player.items.hasOwnProperty(itemID)) {
    resolve(player);
  } else {
    reject(new ParamError("Player doesn't have this item"));
  }
});
}



function ParseError(err) {
  if (err instanceof ParamError) {
  //if (!(err instanceof Error)) {
    return err.message;
  } else {
    console.log(err);
    return `Something wrong happened!`;
  }
}

exports.ItemCheck = ItemCheck;
exports.MoneyCheck = MoneyCheck;
exports.HaveItemCheck = HaveItemCheck;
exports.ParseError = ParseError;
