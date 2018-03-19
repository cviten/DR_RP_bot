const db = require('../db');
var ParseError = require('../error').ParseError;

exports.run = (client, message, args) => {
  const num = args[0];
  if ((isNaN(num))) {
    message.reply("Wrong number");
    return;
  };
  //db.db.map(player => player.coins += )
  message.channel.send(`All students were given ${num} coins (Not really)`);
  //client.guildConfigs.set(message.guild.id, guildConf);
};

exports.config = {
  type: "Mod"
};

exports.help = {
  name: "Give All",
  cmd: "giveall",
  desc: "Gives Money to all students",
  example: "Gives everyone 200 coins:\n`m!giveall 200`"
};
