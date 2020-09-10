require('dotenv').config();

const {Client, MessageEmbed} = require('discord.js');

const client = new Client({
    partials: ['MESSAGE', 'REACTION']
});

const PREFIX = "$";

client.on('ready', () => {
    console.log(`${client.user.tag} has logged in`);
});

client.on('message', async(message) => {
    if(message.author.bot) return;
    console.log(`[${message.author.tag}]: ${message.content}`);
    // React if a user says "Hello"
    if (message.content === 'hello') {
        message.reply('Hello there!');
        message.channel.send('Hello there');
    }
    // React if the user types a Specfic "Command" (starts with PREFIX)
    else if (message.content.startsWith(PREFIX)) {
        /* 
            ... is called the "Spreader Operator"
            It will catch the rest and put it into an array
        */ 
        const [COMMAND, ...args] = message.content
        .trim()
        .substring(PREFIX.length)
        .split(/\s+/);
        
        if (COMMAND === 'kick') {
            if (!message.member.hasPermission('KICK_MEMBERS')) 
                return message.reply('You do not have permissions to use that command');
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
        else if (COMMAND === 'ban') {
            if (!message.member.hasPermission('BAN_MEMBERS')) 
                return message.reply('You do not have permissions to use that command');
            if (args.length === 0) 
                return message.reply('Please provide an ID');
            
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
    // If the message is "how to embed"
    else if (message.content === 'how to embed') {
      // We can create embeds using the MessageEmbed constructor
      // Read more about all that you can do with the constructor
      // over at https://discord.js.org/#/docs/main/master/class/MessageEmbed
      const embed = new MessageEmbed()
        // Set the title of the field
        .setTitle('A slick little embed')
        // Set the color of the embed
        .setColor(0xff0000)
        // Set the main content of the embed
        .setDescription('Hello, this is a slick embed!');
      // Send the embed to the same channel as the message
      message.channel.send(embed)
      .catch((err) => message.channel.send('Embedding did not work :('));
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
    const channel = member.guild.channels.cache.find(ch => ch.name === 'member-log');
    // Do nothing if the channel wasn't found on this server
    if (!channel) return;
    // Send the message, mentioning the member
    channel.send(`Welcome to the server, ${member}`);
});

// Create an event listener for new guild members
client.on('guildMemberRemove', member => {
    // Send the message to a designated channel on a server:
    const channel = member.guild.channels.cache.find(ch => ch.name === 'member-log');
    // Do nothing if the channel wasn't found on this server
    if (!channel) return;
    // Send the message, mentioning the member
    channel.send(`${member} has been removed.`);
});

client.login(process.env.DISCORDJS_BOT_TOKEN);