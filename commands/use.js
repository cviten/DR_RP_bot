exports.run = (client, message, args) => {
  const item = args[0];
  const name = message.member.nickname || message.author.username;
  client.funcs.item_use(message.author.id, item)
  .then(res => {
    message.channel.send("**"+name+"** used " + res);
    })
  .catch(err => {
    message.reply(ParseError(err) + "\nUsage of command:\n" + this.help.example);
  });
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
