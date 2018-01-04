exports.run = (client, guildConf, message, args) => {
  const a = args[0]
  switch (a) {
    case "item":
        delete guildConf.players[message.author.id].items[args[1]];
        message.channel.send(`Deleted item with id: ${args[1]}`)
      break;
    default:
      message.channel.send("Choose something else")
  }
  client.guildConfigs.set(message.guild.id, guildConf);
};

exports.config = {
  type: "Debug"
};

exports.help = {
  name: "Delete",
  desc: "Deletes stuff"
};
