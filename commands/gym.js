exports.run = (client, guildConf, message, args) => {
  let text = args.slice(0).join(" ");
  message.delete();
  let channel = guildConf.gym;
  client.funcs.say(message, channel, text)
    .catch(message.reply("You don't have gym channel"));
  client.funcs.log(guildConf, message, channel, text);
};

exports.config = {
  type: "Mod"
};

exports.help = {
  name: "Gym",
  cmd: "gym",
  desc: "Says message as Monokuma in gym channel",
  example: "I still don't know what's wrong"
};
