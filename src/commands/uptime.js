const { Client } = require("discord.js");

module.exports = {
    name: 'uptime',
    description: "How long have I been ready!",
    execute(client, message, args){
        const uptime = client.uptime;
        const seconds = uptime / 1000;
        message.channel.send(`I've been alive for ${seconds} seconds.`);
    }
}