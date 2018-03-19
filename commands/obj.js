var ParseError = require('../error').ParseError;

exports.run = (client, message, args) => {
  const person = message.mentions.members.first();
  const author = message.member.nickname || message.author.username;
  message.delete();
  if (person) {
    const name = message.mentions.members.first().nickname || message.mentions.members.first().user.username;
    const text = args.slice(1).join(" ");
    client.funcs.shout(author, avatar, "obj", name, text)
    .then(res => {
      message.channel.send({embed});
      })
    .catch(err => {
      message.reply(ParseError(err));
      });;
  } else {
    const name = "Everyone";
    const text = args.slice(0).join(" ");
    client.funcs.shout(author, avatar, "obj", name, text)
    .then(res => {
      message.channel.send({embed});
      })
    .catch(err => {
      message.reply(ParseError(err));
      });;
  }
};

exports.config = {
  type: "Everybody"
};

exports.help = {
  name: "Objection",
  cmd: "obj",
  desc: "Objects to somebody",
  example: "Object to everyone:\n`m!obj She is the liar, you know.`\nObject to Togami:`m!obj @Togami No! You tell them, Togami!`"
};
