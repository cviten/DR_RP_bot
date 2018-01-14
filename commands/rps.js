exports.run = (client, guildConf, message, args) => {
  const playerID = message.author.id;
  const bet = args[0]; const sign = args[1];
  if ((isNaN(bet)) || (bet < 0)) {
    message.reply("Wrong bet");
    return;
  };
  const res = client.funcs.rps(guildConf, playerID, bet, sign);
  if (res.res) {
    message.channel.send(res.msg);
  } else {
    message.reply(res.msg)
  }
  client.guildConfigs.set(message.guild.id, guildConf);
};

exports.config = {
  type: "Student"
};

exports.help = {
  name: "Rock, Paper,Scissors",
  desc: "Lets you play Rock, Paper,Scissors with bets"
};
