require('dotenv').config();

const Discord = require('discord.js');

const client = new Discord.Client({
    partials: ['MESSAGE', 'REACTION']
});

const PREFIX = "$";

// FS - Allows us to look at the File System
const fs = require('fs');

// Holds a Collection of Commands
client.commands = new Discord.Collection();

// Reads the path given, makes sure it only looks for .js files
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));
// Loop through all the files and add them to the Commands collection
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.on('ready', () => {
    console.log(`${client.user.tag} has logged in`);
    client.user.setActivity('You all', {type: 'WATCHING'}).catch(console.error);
});

client.on('message', async(message) => {
    if(message.author.bot) return;
    console.log(`[${message.author.tag}]: ${message.content}`);
    // React if the user types a Specfic "Command" (starts with PREFIX)
    if (message.content.startsWith(PREFIX)) {
        /* 
            ... is called the "Spreader Operator"
            It will catch the rest and put it into an array
        */ 
        const [COMMAND, ...args] = message.content
        .trim()
        .substring(PREFIX.length)
        .split(/\s+/);
        
        const commandToExecute = client.commands.get(COMMAND);
        if (commandToExecute !== undefined) {
            commandToExecute.execute(message, args);
        }        
    }
})

client.on('messageReactionAdd', (reaction, user) => {
    const { name } = reaction.emoji;
    const member = reaction.message.guild.members.cache.get(user.id);
    if (reaction.message.id === '751917635012395169') {
        // To get these icons, in Discord type "\:<name of item>:"
        // Then copy and paste here
        switch (name) {
        case '🍎' :
            member.roles.add('751916647006339083');        
            break;
        case '🍑' :
            member.roles.add('751916699669889035');
            break;
        case '🥑' :
            member.roles.add('751916736630226944');
            break;
        case '🍇' :
            member.roles.add('751916774613713006');
            break;
        case '🍌' :
            member.roles.add('751916817068589217');
            break;
        }
    }
});

client.on('messageReactionRemove', (reaction, user) => {
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
});

// Create an event listener for new guild members
client.on('guildMemberAdd', member => {
    // Send the message to a designated channel on a server:
    const channel = member.guild.channels.cache.find(ch => ch.name === 'welcome');
    // Do nothing if the channel wasn't found on this server
    if (!channel) return;
    
    // Look to make an image style welcome image
    const embed = new Discord.MessageEmbed()
                .setTitle('User information')
                .addField('Player Name', member.displayName)
                .setColor(0xF1C40F)
                .setThumbnail(member.user.avatarURL())
                .setFooter('Subscribe to my channel');
    
    // Send the message, mentioning the member
    channel.send(embed);
});

// Create an event listener for new guild members
client.on('guildMemberRemove', member => {
    // Send the message to a designated channel on a server:
    const channel = member.guild.channels.cache.find(ch => ch.name === 'welcome');
    // Do nothing if the channel wasn't found on this server
    if (!channel) return;
    // Send the message, mentioning the member
    channel.send(`${member} has been removed.`);
});

client.login(process.env.DISCORDJS_BOT_TOKEN);