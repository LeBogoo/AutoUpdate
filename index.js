require('dotenv').config();
const Discord = require('discord.js');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

const client = new Discord.Client();

client.on('ready', () => {
    console.log("Bot is ready!")
});

client.on('message', (msg) => {
    const { guild, channel, author, cleanContent } = msg;
    console.log(`${guild.name}, #${channel.name} | ${author.username}: ${cleanContent}`);
});

// Check for updates on start
async function updateCheck() {
    const hash = await exec('git rev-parse HEAD');
    await exec('git pull');
    const newHash = await exec('git rev-parse HEAD');

    // Exit bot. Systemd will restart automatically.
    if (hash !== newHash) process.exit();
}

setInterval(updateCheck, 1000 * 60);
updateCheck();

client.login(process.env.TOKEN);