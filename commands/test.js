exports.run = (client, guildConf, message, args) => {
  message.channel.send("Test");
  //client.IsPlayer(message);
}

exports.config = {
  type: "Everyone"
};

exports.help = {
  name: "test",
  desc: "Simple test message"
}
