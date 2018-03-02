exports.run = (client, guildConf, message, args) => {
  const num = args[0];
  if ((isNaN(num))) {
    message.reply("Wrong number");
    return;
  };
  for (let person in guildConf.players) {
    //guildConf.players[person].coins = parseInt(guildConf.players[person].coins) + parseInt(num);
    client.funcs.giveMoney(guildConf ,person, num);
  };
  message.channel.send(`All students were given ${num} coins`);
  client.guildConfigs.set(message.guild.id, guildConf);
};

exports.config = {
  type: "Mod"
};

exports.help = {
  name: "Give All",
  cmd: "giveall",
  desc: "Gives Money to all students"
};
