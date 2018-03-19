exports.run = (client, message, args) => {
  n = Math.floor(Math.random() * (21 - 1)) + 1;
  message.channel.send(`:game_die: You rolled ${n}`);
};

exports.config = {
  type: "Everybody"
};

exports.help = {
  name: "Dice",
  cmd: "dice",
  desc: "Rolls a dice from 1 to 20",
  example : "m!dice"
};
