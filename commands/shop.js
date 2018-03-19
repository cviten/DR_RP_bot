var ParseError = require('../error').ParseError;

exports.run = (client, message, args) => {
  const item = args[1];
  const op = args[0]
  const name = message.member.nickname || message.author.username;
  client.funcs.shop(message.author.id, item, op)
  .then(res => {
    message.channel.send(res)
    })
  .catch(err => {
    message.reply(ParseError(err) + "\nUsage of command:\n" + this.help.example);
    });
};

exports.config = {
  type: "Student"
};

exports.help = {
  name: "Shop",
  cmd: "shop",
  desc: "Lets you buy and sell items",
  example: "Buy a Love Key:\n`m!shop buy 150`\nSell a Love Key:\n`m!shop sell 150`"
};
