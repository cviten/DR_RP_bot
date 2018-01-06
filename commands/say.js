exports.run = (client, guildConf, message, args) => {
  let text = args.slice(0).join(" ");
  message.delete();
  let channel = message.channel.id;
  client.say(message, channel, text);
  client.log(guildConf, message, channel, text);
};

exports.config = {
  type: "Mod"
};

exports.help = {
  name: "Say",
  desc: "Says message as Monokuma"
};