module.exports = {
    name: 'commands',
    description: "List of commands",
    execute(client, message, args){
        let commands = "";
        for (let value of client.commands.values()) {
            message.channel.send(`Command: $${value.name} - ${value.description}`);
        }
    }
}