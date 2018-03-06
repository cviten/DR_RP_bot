exports.run = (client, guildConf, message, args) => {
  if(!args || args.size < 1) return message.reply("Must provide a command name to reload.");
  // the path is relative to the *current folder*, so just ./filename.js
  delete require.cache[require.resolve(`./${args[0]}.js`)];
  client.commands.set(args[0], require(`./${args[0]}.js`));
  message.channel.send(`The command ${args[0]} has been reloaded`);
};

exports.config = {
  type: "Debug"
};

exports.help = {
  name: "Reload",
  cmd: "reload",
  desc: "Reloads the command",
  example: "Haven't used it yet..."
};
