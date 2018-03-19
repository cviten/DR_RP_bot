var ParseError = require('../error').ParseError;

exports.run = (client, message, args) => {
  page = args[0] || 1;
  client.funcs.item_page(message.author.id, page)
  .then(res => {
    message.channel.send(res);
  })
  .catch(err => {
    message.reply(ParseError(err) + "\nUsage of command:\n" + this.help.example);
    });
};

exports.config = {
  type: "Student"
};

exports.help = {
  name: "Items",
  cmd: "items",
  desc: "Shows item of the student",
  example: "`m!items`"
};
