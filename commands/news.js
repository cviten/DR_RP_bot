exports.run = (client, guildConf, message, args) => {
  let text = args.slice(0).join(" ");
  message.delete();
  let channel = guildConf.news;
  client.funcs.say(message, channel, text);
  client.funcs.log(guildConf, message, channel, text);
};

exports.config = {
  type: "Mod"
};

exports.help = {
  name: "News",
  cmd: "news",
  desc: "Says message as Monokuma in news channel",
  example: "`m!news`"
};
