exports.run = (client, guildConf, message, args) => {
  message.channel.send(`You have ${guildConf.players[message.author.id].coins} Monocoins`);
};

exports.config = {
  type: "Student"
};

exports.help = {
  name: "coins",
  desc: "Displays amount of coins"
};
