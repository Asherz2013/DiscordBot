const { prefix, defaultCooldown } = require(`../../config.json`);

const cooldowns = new Map();

module.exports = (Discord, client, message) => {
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
        
        // Do we need certain permissions to exicute this command?
        if (commandToExecute.permissions) {
            const authorPerms = message.channel.permissionsFor(message.author);
            if (!authorPerms || !authorPerms.has(commandToExecute.permissions)) {
                return message.reply('You can no do this!');
            }
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
        const cooldownAmount = (commandToExecute.cooldown || defaultCooldown) * 1000;
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
        commandToExecute.execute(message, args, COMMAND_NAME);
    }
    // If its fails let the user know
    catch {
        message.channel.send(`Unable to find command: ${COMMAND_NAME}`);
    }
}