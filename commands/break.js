exports.run = (client, guildConf, message, args) => {
  const item = args[0];
  console.log(item);
  const res = client.item_break(guildConf, message.author.id, item)
  if (res.res) {
    message.channel.send(res.msg);
  } else {
    message.reply(res.msg);
  }
};

exports.config = {
  type: "Student"
};

exports.help = {
  name: "Break",
  desc: "Breaks the item"
};
