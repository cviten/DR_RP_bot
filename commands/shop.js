exports.run = (client, guildConf, message, args) => {
  const item = args[0];
  const name = message.member.nickname || message.author.username;
  const res = client.shop(guildConf, message.author.id, item, "buy")
  if (res.res) {
    message.channel.send(res.msg);
  } else {
    message.reply(res.msg);
  }
  client.guildConfigs.set(message.guild.id, guildConf);
};

exports.config = {
  type: "Student"
};

exports.help = {
  name: "Shop",
  desc: "Lets you buy an item"
};