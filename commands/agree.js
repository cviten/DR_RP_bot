exports.run = (client, guildConf, message, args) => {
  const person = message.mentions.members.first();
  message.delete();
  if (person) {
    const name = message.mentions.members.first().nickname || message.mentions.members.first().user.username;
    const text = args.slice(1).join(" ");
    client.funcs.shout(message, "agree", name, text);
  } else {
    const name = "Everyone";
    const text = args.slice(0).join(" ");
    client.funcs.shout(message, "agree", name, text);
  }
};

exports.config = {
  type: "Everybody"
};

exports.help = {
  name: "Agreement",
  desc: "Agrees with somebody"
};
