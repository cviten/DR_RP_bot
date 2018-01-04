exports.run = (client, guildConf, message, args) => {
  let text = args.slice(0).join(" ");
  message.delete();
  let channel = guildConf.news;
  client.say(message, channel, text);
  client.log(guildConf, message, channel, text);
};

exports.config = {
  type: "Mod"
};

exports.help = {
  name: "News",
  desc: "Says message as Monokuma in news channel"
};
