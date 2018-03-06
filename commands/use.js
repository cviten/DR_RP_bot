exports.run = (client, guildConf, message, args) => {
  const item = args[0];
  const name = message.member.nickname || message.author.username;
  const res = client.funcs.tem_use(guildConf, message.author.id, item)
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
  cmd: "use",
  desc: "Lets you use the item",
  example: "m!use 23"
};
