exports.run = (client, guildConf, message, args) => {
  const person = message.mentions.members.first();
  //const role = message.mentions.roles.first();
  let num = args[2];
  const amount = args[3];
  const target = message.mentions.members.first().nickname || message.mentions.members.first().user.username;
  const name = message.member.nickname || message.author.username;
  if (isNaN(num)) {
    message.reply("Something wrong with number");
    return;
  }
  if (person) {
    switch (args[1]) {
      case "coins":
      case "coin":
        num = (num > 0) ? num : 0;
        client.funcs.giveMoney(guildConf, person.id, num)
        client.funcs.giveMoney(guildConf, message.author.id, -num)
        message.channel.send(`**${name}** gave ${target} ${num} coins`);
        client.guildConfigs.set(message.guild.id, guildConf);
        break;
      case "item":
      case "items":
        const res = client.funcs.item_trade(guildConf, message.author.id, person.id, num, amount)
        if (res.res) {
          message.channel.send("**" + name + "**" + res.msg + "**" + target + "**");
        } else {
          message.reply(res.msg)
        }
        client.guildConfigs.set(message.guild.id, guildConf);
        break;
    }
  }
};

exports.config = {
  type: "Student"
};

exports.help = {
  name: "Trade",
  desc: "Gives your coins or items to other student"
};
