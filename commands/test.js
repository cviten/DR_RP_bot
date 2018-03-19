exports.run = (client, guildConf, message, args) => {
  message.channel.send("Test").catch( err => console.log("Error test:" + err));
  //client.IsPlayer(message);
}

exports.config = {
  type: "Debug"
};

exports.help = {
  name: "test",
  cmd: "test",
  desc: "Simple test message"
}
