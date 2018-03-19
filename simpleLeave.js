const Discord = require('discord.js');
const client = new Discord.Client();
//const fs = require('fs');

client.config = require("./config.json");

let guilds = client.guilds

client.on('ready', () => {
  console.log('Starting');
  guilds.map(g => g.leave()
    .then(g => console.log(`Left the guild ${g}`))
    .catch(console.error));
});

client.login(client.config.simpleToken);
