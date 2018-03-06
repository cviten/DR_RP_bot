exports.run = (client, guildConf, message, args) => {
  message.channel.send((Math.floor(Math.random() * 2) == 0) ? 'Heads' : 'Tails').catch( err => console.log("Error test:" + err));
};

exports.config = {
  type: "Everyone"
};

exports.help = {
  name: "Coin flip",
  cmd: "flip",
  desc: "Flips a coin",
  example: "`m!flip`"
};
