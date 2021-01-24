module.exports = (Discord, client, member) => {
    // Send the message to a designated channel on a server:
    const channel = member.guild.channels.cache.find(ch => ch.name === 'welcome');
    // Do nothing if the channel wasn't found on this server
    if (!channel) return;
    
    // Look to make an image style welcome image
    const embed = new Discord.MessageEmbed()
                .setTitle('User information')
                .addField('Player Name', member.displayName)
                .setColor(`DARK_RED`)
                .setThumbnail(member.user.avatarURL())
                .setFooter('Subscribe to my channel');
    
    // Send the message, mentioning the member
    channel.send(embed);
}