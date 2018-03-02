exports.run = (client, guildConf, message, args) => {
  if (!(Object.getOwnPropertyNames(guildConf.players[message.author.id].items).length === 0)) {
    const page = args[0] || 1;
    const res = client.funcs.item_page(guildConf, message.author.id, page)
    message.channel.send(res.msg)
  } else {
    message.reply("You don't have anything... :(")
  }
};

exports.config = {
  type: "Student"
};

exports.help = {
  name: "Items",
  cmd: "items",
  desc: "Shows item of the student"
};
