const fs = require('fs');

module.exports = (client, Discord) => {
    client.commands = new Discord.Collection();
    
    // Reads the path given, makes sure it only looks for .js files
    const command_files = fs.readdirSync(`./src/commands`).filter(file => file.endsWith('.js'));
    // Loop through all the files and add them to the Commands collection
    for (const file of command_files) {
        const command = require(`../commands/${file}`);
        if(command.name) {
            client.commands.set(command.name, command);
        }
    }
}