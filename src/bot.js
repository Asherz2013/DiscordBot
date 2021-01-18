require('dotenv').config();
const Discord = require('discord.js');

const { prefix } = require('./config.json');

const client = new Discord.Client({
    partials: ['MESSAGE', 'REACTION']
});
// FS - Allows us to look at the File System
const fs = require('fs');

// Holds a Collection of Commands
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();

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
    // No prefix or its coming from a bot.
    if(!message.content.startsWith(prefix) || message.author.bot) return;
    // Log the message to the console (REMOVE ME)
    console.log(`[${message.author.tag}]: ${message.content}`);
    /* 
        ... is called the "Spreader Operator"
        It will catch the rest and put it into an array
    */ 
    const [COMMAND_NAME, ...args] = message.content
    .trim()
    .substring(prefix.length)
    .split(/\s+/);
    
    // Try to find the command fom our command list
    const commandToExecute = client.commands.get(COMMAND_NAME) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(COMMAND_NAME));
    
    // Try to Run the command
    try {
        // Check if this command can only be executed in the Guild (server)
        if (commandToExecute.guildOnly && message.channel.type === 'dm') {
            return message.reply('I can\'t execute that command inside DMs!');
        }
        
        // Do we need any Arguments passed on?
        if (commandToExecute.args && !args.length) {
            let reply = `You didn't provide any arguments, ${message.author}!`;

            if (commandToExecute.usage) {
                reply += `\nThe proper usage would be: \`${prefix}${commandToExecute.name} ${commandToExecute.usage}\``;
            }

            return message.channel.send(reply);
        }

        // Is this command found in our "Cooldowns" collection
        if (!cooldowns.has(commandToExecute.name)) {
            // If not, add it.
            cooldowns.set(commandToExecute.name, new Discord.Collection())
        }
        // Get the Time NOW.
        const now = Date.now();
        // Get the collection of TimeStamps for the given command
        const timestamps = cooldowns.get(commandToExecute.name);
        // Does the command specify a Cooldown amount? If not we use 3 seconds
        const cooldownAmount = (commandToExecute.cooldown || 3) * 1000;
        // Does the TimeStamp have this authors ID in it?
        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${commandToExecute.name}\` command.`);
            }
        }
        // If the command is NOT in cooldown, add it to the collection
        timestamps.set(message.author.id, now);
        // Ensure that after the cooldown period we remove the Author ID. Allows us to make sure the user can set the command again
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

        // By this point we know its all good. So run the command
        commandToExecute.execute(message, args);
    }
    // If its fails let the user know
    catch {
        message.channel.send(`Unable to find command: ${COMMAND_NAME}`);
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
                .setColor(`DARK_RED`)
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