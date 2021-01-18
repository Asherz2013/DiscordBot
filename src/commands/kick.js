module.exports = {
    name: 'kick',
    description: "Kicks a user",
    args: true,
    usage: '<ID>',
    guildOnly: true,
    execute(message, args){
        if (!message.member.hasPermission('KICK_MEMBERS')) {
            return message.reply('You do not have permissions to use that command');
        }
        const member = message.guild.members.cache.get(args[0]);
        if (member) {
            member
            .kick()
            .then((member) => message.channel.send(`${member} was kicked.`))
            .catch((err) => message.channel.send('I can not kick that user :('));
        }
        else {
            message.channel.send('That member was not found');
        }
    }
}