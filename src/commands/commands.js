const { prefix } = require('../config.json');

module.exports = {
    name: 'help',
    description: "List all of my commands or info about a specific command.",
    aliases: ['commands'],
    usage: `[Command name]`,
    cooldown: 5,
    execute(message, args){
        const data = [];
        const { commands } = message.client;

        if (!args.length) {
            data.push('Here\'s a list of all my commands:');
            data.push(commands.map(command => command.name).join(', '));
            data.push(`You can send \'${prefix}help [command name]\' to get info on a specific command!`);

            return message.author.send(data, {split: true})
                .then(() => {
                    if (message.channel.type === 'dm') return;
                    message.reply('I\'ve sent you a DM with all my commands!');
                })
                .catch(error => {
                    console.error('Cound no send help DM to ${message.author.tag}.\n', error);
                    message.reply('It seems like I can\'t DM you! Do you have DMs disabled?');
                })
        }
    }
}