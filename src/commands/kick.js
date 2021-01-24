module.exports = {
    name: 'kick',
    description: "Kicks a user",
    args: true,
    usage: '<ID>',
    guildOnly: true,
    permissions: 'KICK_MEMBERS',
    execute(message, args){
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