const db = require('../db');
var ParseError = require('../error').ParseError;

exports.run = (client, message, args) => {
  const person = message.mentions.members.first();
  //const role = message.mentions.roles.first();
  let num = args[2];
  const amount = args[3];
  const target = message.mentions.members.first().nickname || message.mentions.members.first().user.username;
  const name = message.member.nickname || message.author.username;
  switch (args[1]) {
    case "coins":
    case "coin":
      db.getPlayer(message.author.id)
      .then(res => {
        return db.takeMoney(message.author.id, num)
        })
      .then(res => {
        return db.getPlayer(person.id)
        })
      .then(res => {
        return db.giveMoney(message.author.id, num)
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
      db.getPlayer(message.author.id)
      .then(res => {
        return db.takeItem(message.author.id, num, amount)
        })
      .then(res => {
        return db.getPlayer(person.id)
        })
      .then(res => {
        return db.giveItem(message.author.id, num, amount)
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
  type: "Student"
};

exports.help = {
  name: "Trade",
  cmd: "trade",
  desc: "Trade your coins or items to other student",
  example: "Take from you and gives Junko 500 coins:\n`m!trade @Junko coins 500`\n`m!trade @Junko coin 500`\nTaks from you and gives Mukuro Aluminum Water Bottle:\n`m!trade @Mukuro item 80`\n`m!trade @Mukuro items 80`"
};
