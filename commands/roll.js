exports.run = (client, guildConf, message, args) => {
  n = Math.floor(Math.random() * (21 - 1)) + 1;
  message.channel.send(`:game_die: You rolled ${n}`);
};

exports.config = {
  type: "Everybody"
};

exports.help = {
  name: "Roll",
  cmd: "roll",
  desc: "Rolls a dice",
  example: "`m!dice`"
};
