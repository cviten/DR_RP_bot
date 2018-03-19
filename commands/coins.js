const db = require('../db');
var ParseError = require('../error').ParseError;

exports.run = (client, message, args) => {
  db.getPlayer(message.author.id)
  .then(res => {
    message.channel.send(`You have ${res.coins} Monocoins`);
    })
  .catch(err => {
    message.reply(ParseError(err) + "\nUsage of command:\n" + this.help.example);
    });
};

exports.config = {
  type: "Student"
};

exports.help = {
  name: "Coins",
  cmd: "coins",
  desc: "Displays amount of coins",
  example : "m!coins"
};
