exports.run = (client, guildConf, message, args) => {
  message.channel.send("Test").catch( err => console.log("Error test:" + err));
  //client.IsPlayer(message);
}

exports.config = {
  type: "Everyone"
};

exports.help = {
  name: "test",
  desc: "Simple test message"
}
