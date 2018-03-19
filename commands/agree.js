var ParseError = require('../error').ParseError;

exports.run = (client, message, args) => {
  const person = message.mentions.members.first();
  const author = message.member.nickname || message.author.username;
  const avatar = message.author.avatarURL;
  message.delete();
  if (person) {
    const name = message.mentions.members.first().nickname || message.mentions.members.first().user.username;
    const text = args.slice(1).join(" ");
    client.funcs.shout(author, avatar, "agree", name, text)
    .then(res => {
      message.channel.send({embed});
      })
    .catch(err => {
      message.reply(ParseError(err) + "\nUsage of command:\n" + this.help.example);
      });;
  } else {
    const name = "Everyone";
    const text = args.slice(0).join(" ");
    client.funcs.shout(author, avatar, "agree", name, text)
    .then(res => {
      message.channel.send({embed});
      })
    .catch(err => {
      message.reply(ParseError(err) + "\nUsage of command:\n" + this.help.example);
      });;
  }
};

exports.config = {
  type: "Everybody"
};

exports.help = {
  name: "Agreement",
  cmd: "agree",
  desc: "Agrees with somebody",
  example : "Agree with everybody:\n`m!agree That was a knife`\nAgree with Naegi:\n`m!agree @Naegi knife was missing today's morning`"
};
