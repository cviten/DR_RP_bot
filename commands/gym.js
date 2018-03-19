exports.run = (client, message, args) => {
  let text = args.slice(0).join(" ");
  message.delete();
  let channel = "374280650531930124";
  if (!text) {
    text = "I forgot what I wanted to say."
  }
  message.guild.channels.get(channel).send(text).catch(err => {
    console.log(`${message.author.username} said:\n${text}\n${err}`);
    message.channel.send("Something wrong")
  })
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
