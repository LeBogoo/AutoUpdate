require('dotenv').config();
const Discord = require('discord.js');

const client = new Discord.Client();


client.on('ready', () => {
    console.log("Bot is ready!")
})

client.on('message', (msg) => {
    const { guild, channel, author, cleanContent } = msg;
    console.log(`${guild.name}, #${channel.name} | ${author.username}: ${cleanContent}`);
})


client.login(process.env.TOKEN);