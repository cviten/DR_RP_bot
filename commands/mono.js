exports.run = (client, guildConf, message, args) => {
  const playerID = message.author.id;
  const res = client.funcs.mono(guildConf, playerID);
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
  name: "MonoMono Machine",
  cmd: "mono",
  desc: "Lets win one of the item"
};
