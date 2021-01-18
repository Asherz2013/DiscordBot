module.exports = {
    name: 'ban',
    description: "Bans a user",
    args: true,
    usage: '<ID>',
    guildOnly: true,
    async execute(message, args){
        if (!message.member.hasPermission('BAN_MEMBERS')) {
            return message.reply('You do not have permissions to use that command');
        }
        
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