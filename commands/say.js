var ParseError = require('../error').ParseError;

exports.run = (client, message, args) => {
  let text = args.slice(0).join(" ");
  message.delete();
  //let channel = message.channel.id;
  //client.funcs.say(message, channel, text);
  if (!text) {
    text = "I forgot what I wanted to say."
  }
  message.channel.send(text).catch(err => {
    console.log(`${message.author.username} said:\n${text}\n${err}`);
    message.channel.send("Something wrong")
  })
  //client.funcs.log(guildConf, message, channel, text);
};

exports.config = {
  type: "Mod"
};

exports.help = {
  name: "Say",
  cmd: "say",
  desc: "Says message as Monokuma",
  example: "`m!say Donuts!`"
};
