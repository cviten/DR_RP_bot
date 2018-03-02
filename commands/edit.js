exports.run = (client, guildConf, message, args) => {
  let newMsg = args.slice(0).join(" ");
  message.channel.fetchMessages({around: message.id, limit: 20})
    .then(messages => {
      //const fetchedMsgs = messages.last(); // messages is a collection!)
      let botMsg = messages.filter(msg => msg.author.id == client.user.id);// do something with it
      let oldMsg = botMsg.first();
      oldMsg.edit(newMsg).then(message.delete()).catch(error => {message.reply("You can't edit this message")});
    });
};

exports.config = {
  type: "Debug"
};

exports.help = {
  name: "Editing",
  cmd: "edt",
  desc: "Editing last bot's meassge in the channel"
};
