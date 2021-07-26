require('dotenv').config();
const Discord = require('discord.js');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

const client = new Discord.Client();

client.on('ready', () => {
    console.log("Bot is ready!")
});

client.on('message', async (msg) => {
    const { guild, channel, cleanContent } = msg;
    if (cleanContent.startsWith('!version')) {
        const info = (await exec('git log -1')).stdout.split("\n").filter(e => e !== '');
        const versionEmbed = new Discord.MessageEmbed();

        var commit = info[0].substr(0, 14); // Get "commit" + 7 chars of hash
        commit = commit.charAt(0).toUpperCase() + commit.slice(1); // Capitalize first char

        versionEmbed.setTitle(commit);

        var commitURL = (await (await exec('git remote get-url origin'))).stdout.replace(".git", '') + `/commit/${info[0].substr(7)}`;
        versionEmbed.setURL(commitURL);

        var author = info[1].replace('Author: ', '').split(' <')[0];
        versionEmbed.addField('Author:', author)

        var date = (new Date(info[2].replace('Date: ', '')).getTime()) / 1000;

        versionEmbed.addField('Date:', `<t:${date}>`);

        versionEmbed.addField('Message:', info[3].trim());

        channel.send(versionEmbed);
    }
});

// Check for updates on start
async function updateCheck() {
    const answer = (await exec('git pull')).stdout;

    // Exit bot. Systemd will restart automatically.
    if (answer !== 'Already up to date.\n') process.exit();
}

setInterval(updateCheck, 1000 * 10);
updateCheck();

client.login(process.env.TOKEN);