module.exports = {
    name: 'stop',
    description: 'Stops the bot from playing music',
    async execute(message, args) {
        // In channel
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.channel.send('You need to be in a channel to execute this command!');
        // We are, so lets kick the bot
        await voiceChannel.leave();
        await message.channel.send('Leaving channel :smiling_face_with_tear:');
    }
}