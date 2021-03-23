const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

// Global Queue for ALL servers.
const queue = new Map();
// Holds the following information
// queue(message.guild.id, queue_constructor object (voice channel, text channel, connection, song[]));

module.exports = {
    name: 'adv_play',
    aliases: ['skip', 'stop'],
    description: "Joins a Voice Channel and plays a video from youtube",
    cooldown: 5,
    async execute(message, args, cmd) {
        console.log(cmd)
        
        // In channel
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.channel.send('You need to be in a channel to execute this command!');

        // Permission check
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) return message.channel.send('You do not have the correct permissions');

        // Grab this servers specific queue
        const serverQueue = queue.get(message.guild.id);

        if (cmd === 'adv_play') {
            if (!args.length) return message.channel.send('You need to send a second argument!');
            let song = {};
            // If the argument is a valid URL
            if (ytdl.validateURL(args[0])) {
                // Get the Song Data
                const songInfo = await ytdl.getInfo(args[0]);
                // Add info to the Song object above
                song = { title: songInfo.videoDetails.title, url: songInfo.videoDetails.video_url };

            }
            else {
                // If not a valid URL then we just use the keywords added
                
                // Create a function to search for videos based on keywords
                const videoFinder = async (query) => {
                    const videoResult = await ytSearch(query);
                    return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
                }

                const video = await videoFinder(args.join(' '));
                if (video) {
                    song = { title: video.title, url: video.url };
                }
                else {
                    return message.channel.send('Error finding video.');
                }
            }

            if (!serverQueue) {
                const queue_constructor = {
                    voiceChannel: voiceChannel,
                    textChannel: message.channel,
                    connection: null,
                    songs: []
                }
    
                queue.set(message.guild.id, queue_constructor);
                queue_constructor.songs.push(song);
    
                try {
                    // Try to Join the channel
                    const connection = await voiceChannel.join();
                    // Pass this connection to the Map, to be used later
                    queue_constructor.connection = connection;
                    video_player(message.guild, queue_constructor.songs[0]);
                }
                catch (err){
                    queue.delete(message.guild.id);
                    message.channel.send('There was an error connecting.')
                    throw err;
                }
            }
            else {
                serverQueue.songs.push(song);
                return message.channel.send(`🎤 **${song.title}** added to queue!`);
            }
        }
        else if (cmd === 'skip') {
            skip_song(message, serverQueue);
        }
        else if (cmd === 'stop') {
            stop_song(message, serverQueue);
        }
    }
}

const video_player = async (guild, song) => {
    const songQueue = queue.get(guild.id);

    if (!song) {
        songQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }

    const stream = ytdl(song.url, {filter: 'audioonly'});
    songQueue.connection.play(stream, {seek: 0, volume: 0.5})
    .on('finish', () => {
        songQueue.songs.shift();
        video_player(guild, songQueue.songs[0]);
    });
    await songQueue.textChannel.send(`🎶 Now Playing **${song.title}**`);
}

const skip_song = (message, serverQueue) => {
    if (!message.member.voice.channel) return message.channel.send(' You need to be in a channel to execute this command!');
    if (!serverQueue) return message.channel.send('There are no songs tin queue');
    serverQueue.connection.dispatcher.end();
}

const stop_song = (message, serverQueue) => {
    if (!message.member.voice.channel) return message.channel.send(' You need to be in a channel to execute this command!');
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
}