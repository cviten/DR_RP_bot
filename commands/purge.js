exports.run = (client, message, args) => {
  const user = message.mentions.users.first();
  const amount = parseInt(args[0]) || parseInt(args[1]);
  if (amount > 100 || amount < 2) {
    message.reply("Sorry, but you can delete only between 2 and 100 messages for one command, Discord API rules...")
  }
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
      .then(message.channel.send(`${amount} messages have been forgotten`))
      .catch(error => console.log(error.stack));
  });
};

exports.config = {
  type: "Debug"
};

exports.help = {
  name: "Name",
  cmd: "pruge",
  desc: "Description",
  example: "Deletes any *10* recent messages:\n`m!purge 10`\nDeletes any Togami's messages in *25* recent messages\n`m!purge @Togami 25`"
};
