var ParseError = require('../error').ParseError;

exports.run = (client, message, args) => {
  const item = args[0];
  client.funcs.item_break(message.author.id, item)
  .then(res => {
    message.channel.send(`${message.author.nickname || message.author.username} broke item ${item}`)
    })
  .catch(err => {
    message.reply(ParseError(err) + "\nUsage of command:\n" + this.help.example);
    });
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
