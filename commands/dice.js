exports.run = (client, guildConf, message, args) => {
  n = Math.floor(Math.random() * (21 - 1)) + 1;
  message.channel.send(`You rolled ${n}`);
};

exports.config = {
  type: "Everybody"
};

exports.help = {
  name: "Dice",
  desc: "Rolls a dice"
};
