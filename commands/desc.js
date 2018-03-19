var ParseError = require('../error').ParseError;

exports.run = (client, message, args) => {
  //console.log(args[1]);
  client.funcs.item_desc(args[0])
  .then(embed => {
    message.channel.send({embed})
    })
  .catch(err => {
    message.reply(ParseError(err) + "\nUsage of command:\n" + this.help.example);
    });

};

exports.config = {
  type: "Student"
};

exports.help = {
  name: "Description",
  cmd: "desc",
  desc: "Gives you description of the item",
  example : "Shows description of the item with ID 63:\n`m!desc 63`"
};
