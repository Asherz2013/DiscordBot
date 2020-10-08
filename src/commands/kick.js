module.exports = {
    name: 'kick',
    description: "Kicks a user",
    execute(client, message, args){
        if (!message.member.hasPermission('KICK_MEMBERS')) {
            return message.reply('You do not have permissions to use that command');
        } 
        if (args.length === 0) 
            return message.reply('Please provide an ID');
        
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