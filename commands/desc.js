exports.run = (client, guildConf, message, args) => {
  //console.log(args[1]);
  if ( !( isNaN(args[0]) ) )  {
    const res = client.funcs.item_desc(args[0])
    if (res.res) {
      const embed = res.msg
      message.channel.send({embed});
    } else {
      message.reply(res.msg);
    }
  } else {
    message.reply("Something wrong with number")
  }
};

exports.config = {
  type: "Student"
};

exports.help = {
  name: "Description",
  cmd: "desc",
  desc: "Gives you description of the item",
  example : "Shows description of the item with ID 63:\n`m!desc`"
};
