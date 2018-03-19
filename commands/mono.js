var ParseError = require('../error').ParseError;

exports.run = (client, message, args) => {
  client.funcs.mono(message.author.id)
  .then(res => {
    message.channel.send(res)
    })
  .catch(err => {
    message.reply(ParseError(err) + "\nUsage of command:\n" + this.help.example);
    });
  //const playerID = message.author.id;
};

exports.config = {
  type: "Student"
};

exports.help = {
  name: "MonoMono Machine",
  cmd: "mono",
  desc: "Lets win one of the item",
  example: "`m!mono`"
};
