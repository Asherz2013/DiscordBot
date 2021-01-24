const { prefix } = require('../config.json');

module.exports = {
    name: 'ban',
    description: "Bans a user",
    args: true,
    usage: '<@name> <reason>',
    guildOnly: true,
    permissions: 'BAN_MEMBERS',
    async execute(message, args){        
        // Do I have any Tags?
        if (!message.mentions.users.size) {
            let reply = `You didn't tag anyone, ${message.author}!`;
            reply += `\nThe proper usage would be: \`${prefix}${this.name} ${this.usage}\``;
            return message.channel.send(reply);
        }
        // Make sure you only tag 1 person at a time.
        if (message.mentions.users.size > 1) {
            let reply = `You didn't tag anyone, ${message.author}!`;
            reply += 'Please only tag 1 person at a time.';
            return message.channel.send(reply);
        }
        // Am I passing in 2 args?
        if (args.length < 2) {
            let reply = `You didn't provide enough arguments, ${message.author}!`;
            reply += `\nThe proper usage would be: \`${prefix}${this.name} ${this.usage}\``;
            return message.channel.send(reply);
        }
        
        console.log(args);
        console.log(message.mentions.users);
        const user = args[0];
        const reason = args.slice(1).join(' ');
        console.log(user);
        console.log(reason);
        return;

        try {
            const user = await message.guild.members.ban(args[0]);
            console.log(user);
            message.channel.send('User was banned successfully');
        } catch (err) {
            console.log(err);
            message.channel.send('An error occured. Either I do not have permissions or the user was not found');
        }
    }
}