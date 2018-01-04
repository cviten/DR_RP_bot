exports.run = (client, guildConf, message, args) => {
  const person = message.mentions.members.first();
  message.delete();
  if (person) {
    const name = message.mentions.members.first().nickname || message.mentions.members.first().user.username;
    const text = args.slice(1).join(" ");
    client.shout(message, "obj", name, text);
  } else {
    const name = "Everyone";
    const text = args.slice(0).join(" ");
    client.shout(message, "obj", name, text);
  }
};

exports.config = {
  type: "Everybody"
};

exports.help = {
  name: "Objection",
  desc: "Objects to somebody"
};
