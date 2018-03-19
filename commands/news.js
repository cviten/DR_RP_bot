exports.run = (client, message, args) => {
  let text = args.slice(0).join(" ");
  message.delete();
  let channel = "375631496704163851";
  //client.funcs.say(channel, text);
  if (!text) {
    text = "I forgot what I wanted to say."
  }
  message.guild.channels.get(channel).send(text).catch(err => {
    console.log(`${message.author.username} said:\n${text}\n${err}`);
    message.channel.send("Something wrong")
  })
  //client.funcs.log(guildConf, message, channel, text);
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
