exports.run = (client, guildConf, message, args) => {
  message.channel.send(`You have ${guildConf.players[message.author.id].coins} Monocoins`);
};

exports.config = {
  type: "Student"
};

exports.help = {
  name: "Coins",
  cmd: "coins",
  desc: "Displays amount of coins"
};
