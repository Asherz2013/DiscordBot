const fs = require('fs');

module.exports = (client, Discord) => {
    client.cooldowns = new Discord.Collection();

    const load_dir = (dirs) => {
        const event_files = fs.readdirSync(`./src/events/${dirs}`).filter(file => file.endsWith('.js'));

        // Loop through all the files and add them to the Commands collection
        for (const file of event_files) {
            // Grab the event
            const event = require(`../events/${dirs}/${file}`);
            // Grab its Name from the file name
            const event_name = file.split('.')[0];
            // Hook up the event to the event name and pass in Discord and Client as a Minimum
            client.on(event_name, event.bind(null, Discord, client));
        }
    }

    // Array of all the Folders we plan to load files from
    ['client', 'guild'].forEach(e => load_dir(e));
}