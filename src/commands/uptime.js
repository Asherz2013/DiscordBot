const { Client } = require("discord.js");

module.exports = {
    name: 'uptime',
    description: "How long have I been ready!",
    execute(message, args){
        const uptime = message.client.uptime;
        const seconds = uptime / 1000;
        message.channel.send(`I've been alive for ${seconds} seconds.`);
    }
}