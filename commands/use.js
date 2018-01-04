exports.run = (client, guildConf, message, args) => {
  const item = args[0];
  const name = message.member.nickname || message.author.username;
  const res = client.item_use(guildConf, message.author.id, item)
  if (res.res) {
    message.channel.send("**"+name+"**" + res.msg);
  } else {
    message.reply(res.msg);
  }
};

exports.config = {
  type: "Student"
};

exports.help = {
  name: "Use",
  desc: "Lets you use the item"
};
