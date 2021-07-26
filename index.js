require('dotenv').config();
const Discord = require('discord.js');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

const client = new Discord.Client();

client.on('ready', () => {
    console.log("Bot is ready!")
});

client.on('message', async (msg) => {
    const { guild, channel, author, cleanContent } = msg;
    console.log(`${guild.name}, #${channel.name} | ${author.username}: ${cleanContent}`);
    if (cleanContent.startsWith('!hash')) {
        const hash = (await exec('git rev-parse HEAD')).stdout.substr(0, 7);
        channel.send(`Current version: \`${hash}\``)
    }
});

// Check for updates on start
async function updateCheck() {
    const answer = (await exec('git pull')).stdout;

    // Exit bot. Systemd will restart automatically.
    if (answer !== 'Already up to date.\n') process.exit();
}

setInterval(updateCheck, 1000 * 60);
updateCheck();

client.login(process.env.TOKEN);