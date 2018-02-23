exports.run = (client, guildConf, message, args) => {
  const user = message.mentions.users.first();
  const amount = parseInt(args[0]) || parseInt(args[1]);
  if (!amount) return message.reply('Must specify an amount to delete!');
  if (!amount && !user) return message.reply('Must specify a user and amount, or just an amount, of messages to purge!');
  message.channel.fetchMessages({
    limit: amount,
  }).then((messages) => {
    if (user) {
      const filterBy = user ? user.id : Client.user.id;
      messages = messages.filter(m => m.author.id === filterBy).array().slice(0, amount);
    }
    message.channel.bulkDelete(messages)
      .then(message.channel.send(`${amount} messages was been forgotten`))
      .catch(error => console.log(error.stack));
  });
};

exports.config = {
  type: "Debug"
};

exports.help = {
  name: "Name",
  desc: "Description"
};
