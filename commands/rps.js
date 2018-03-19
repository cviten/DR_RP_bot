var ParseError = require('../error').ParseError;

exports.run = (client, message, args) => {
  const playerID = message.author.id;
  const bet = args[0]; const sign = args[1];
  client.funcs.rps(playerID, bet, sign)
  .then(res => {
    message.channel.send(res)
    })
  .catch(err => {
    message.reply(ParseError(err) + "\nUsage of command:\n" + this.help.example);
    });
};

exports.config = {
  type: "Student"
};

exports.help = {
  name: "Rock, Paper,Scissors",
  cmd: "rps",
  desc: "Lets you play Rock, Paper,Scissors with bets",
  example: "Betting 100 coins on rock:\n`m!rps 100 r`\n`m!rps 100 rock`\n`m!rps 100 R`\n`m!rps 100 Rock`"
};
