exports.run = (client, guildConf, message, args) => {
  const a = args[0]
  switch (a) {
    case "item":
        guildConf.players["342305137097703434"].items[args[1]];
        message.channel.send(`Deleted item with id: ${args[1]}`)
      break;
    case coins:
      delete guildConf.players["342305137097703434"].coins;
      message.channel.send(`Deleted coins`)
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
  cmd: "delete",
  desc: "Deletes stuff",
  example : "Reserved"
};
