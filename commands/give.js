const db = require('../db');
var ParseError = require('../error').ParseError;

exports.run = (client, message, args) => {
  const person = message.mentions.members.first();
  //const role = message.mentions.roles.first();
  let num = args[2];
  const amount = args[3];
  //const item = args.slice(2);
  const name = message.mentions.members.first().nickname || message.mentions.members.first().user.username;
  switch (args[1]) {
    case "coins":
    case "coin":
      db.getPlayer(person.id)
      .then(res => {
        return db.giveMoney(person.id, num)
        })
      .then(() => {
        message.channel.send(`**${name}** were given ${num} coins`);
      })
      .catch(err => {
        message.reply(ParseError(err) + "\nUsage of command:\n" + this.help.example);
        });
      break;
    case "item":
    case "items":
      db.getPlayer(person.id)
      .then(res => {
        return db.giveItem(person.id, num, amount)
        })
      .then(() => {
        message.channel.send("Item has been given to " + "**" + name + "**");
      })
      .catch(err => {
        message.reply(ParseError(err) + "\nUsage of command:\n" + this.help.example);
        });
    default:
      message.reply("Wrong operation" + "\nUsage of command:\n" + this.help.example);
  }
};

exports.config = {
  type: "Mod"
};

exports.help = {
  name: "Give",
  cmd: "give",
  desc: "Gives item or coins to the person",
  example: "Give 1000 coins to Togami:\n `m!give @Togami coins 1000`\nGives Monkey Paw to Kiyo:\n `m!give @Kiyo item 88`\nGives 10 Bird Food to Himiko:\n `m!give @Himiko item 66 10`"
};
