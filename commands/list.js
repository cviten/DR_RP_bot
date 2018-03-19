exports.run = (client, message, args) => {
  let s="";
  let i=0;
  client.commands.map(cmd => {
    let cmdLevel = client.rolesV3[cmd.config.type];
    let permLevel = client.checkPerm(message);
    if (cmdLevel <= permLevel) {
      i++;
      s+=`${i}. \`${cmd.help.cmd}\` - ${cmd.help.desc}\n`
    }
  })
  message.channel.send(s).catch(err => console.log(err))
};

exports.config = {
  type: "Student"
};

exports.help = {
  name: "List",
  cmd: "list",
  desc: "List all commands available to you",
  example: "`m!list`"
};
