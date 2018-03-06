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
      case "coin":
        num = (num > 0) ? num : 0;
        client.funcs.giveMoney(guildConf, person.id, num)
        message.channel.send(`**${name}** were given ${num} coins`);
        client.guildConfigs.set(message.guild.id, guildConf);
        break;
      case "item":
      case "items":
        const res = client.funcs.item_give(guildConf, person.id, num, amount)
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
  name: "Give",
  cmd: "give",
  desc: "Gives item or coins to the person",
  example: "Give 1000 coins to Togami:\n `m!give @Togami coins 1000`\nGives Monkey Paw to Kiyo:\n `m!give @Kiyo item 88`\nGives 10 Bird Food to Himiko:\n `m!give @Himiko item 66 10`"
};
