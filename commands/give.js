exports.run = (client, guildConf, message, args) => {
  const person = message.mentions.members.first();
  //const role = message.mentions.roles.first();
  let num = args[2];
  const amount = args[3];
  //const item = args.slice(2);
  const name = message.mentions.members.first().nickname || message.mentions.members.first().user.username;
  if (isNaN(num)) {
    message.reply("Something wrong with number");
    return;
  }
  if (person) {
    switch (args[1]) {
      case "coins":
        num = (num > 0) ? num : 0;
        client.giveMoney(guildConf, person.id, num)
        message.channel.send(`**${name}** were given ${num} coins`);
        client.guildConfigs.set(message.guild.id, guildConf);
        break;
      case "item":
        const res = client.item_give(guildConf, person.id, num, amount)
        if (res.res) {
          message.channel.send(res.msg + "**" + name + "**");
        } else {
          message.reply(res.msg)
        }
        client.guildConfigs.set(message.guild.id, guildConf);
        break;
    }
  }
};

exports.config = {
  type: "Mod"
};

exports.help = {
  name: "give",
  desc: "Gives item or coins to the person"
};
