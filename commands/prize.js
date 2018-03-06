exports.run = (client, guildConf, message, args) => {
  //const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
  const person = message.mentions.members.first();
  const num = args[1];
	if (message.author.id  = "330853547757404182") {
    if ((isNaN(num))) {
      message.reply("Wrong number");
      return;
    }
	  if (num > prize_limit) {
        message.reply("Prize is too big");
        return;
      }
    if (person) {
      guildConf.players[person.id].coins = parseInt(guildConf.players[person.id].coins) + parseInt(num);
      guildConfigs.set(message.guild.id, guildConf);
      const name = message.mentions.members.first().nickname || message.mentions.members.first().user.username;
      message.channel.send(`**${name}** were given ${num} coins`);
      message.channels.get(guildConf.log).send(`**${name}** were given ${num} coins by ${message.author.username}`);
    } else {
      message.channel.send("Do we have 17th student, who I don't know about?");
    }
  }
};

exports.config = {
  type: "Student"
};

exports.help = {
  name: "Prize",
  cmd: "prize",
  desc: "Gives a prize to somebody",
  example: "I need to rewrite this command"
};
