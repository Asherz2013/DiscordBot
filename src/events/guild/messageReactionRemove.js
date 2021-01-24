module.exports = (Discord, client, reaction, user) => {
    const { name } = reaction.emoji;
    const member = reaction.message.guild.members.cache.get(user.id);
    if (reaction.message.id === '751917635012395169') {
        // To get these icons, in Discord type "\:<name of item>:"
        // Then copy and paste here
        switch (name) {
        case '🍎' :
            member.roles.remove('751916647006339083');        
            break;
        case '🍑' :
            member.roles.remove('751916699669889035');
            break;
        case '🥑' :
            member.roles.remove('751916736630226944');
            break;
        case '🍇' :
            member.roles.remove('751916774613713006');
            break;
        case '🍌' :
            member.roles.remove('751916817068589217');
            break;
        }
    }
}