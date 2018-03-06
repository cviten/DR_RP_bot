exports.run = (client, guildConf, message, args) => {
  const item = args[0];
  console.log(item);
  const res = client.funcs.item_break(guildConf, message.author.id, item)
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
  cmd: "break",
  desc: "Breaks the item",
  example : "Break iten with ID 120:\n`m!break 120`"
};
