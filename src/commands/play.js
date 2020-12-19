const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

module.exports = {
    name: 'play',
    description: "Join and player a video from youtube",
    async execute(client, message, args) {
        // In channel
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.channel.send('You need to be in a channel to execute this command!');
        // Permission check
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT')) return message.channel.send('You do not have the correct permissions');
        if (!permissions.has('SPEAK')) return message.channel.send('You do not have the correct permissions');
        // DO we have some arguments?
        if (!args.length) return message.channel.send('You need to send the second argument');

        const validURL = (str) => {
            var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
            return regex.test(str);            
        }

        // Wait for the bot to join the channel
        const connection = await voiceChannel.join();

        let video = {};

        if (validURL(args[0])) {
            video = {
                'url': args[0],
            };
        }
        else {
            // Mini function to search for a You Tube video
            const videoFinder = async (query) => {
                const videoResult = await ytSearch(query);
                return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
            }

            // look to see if we can find a video - Join all the arguments up into 1 long string
            video = await videoFinder(args.join(' '));
        }

        // DO we have a video?
        if (video) {
            // Grab some info about the Video
            const videoInfo = await ytdl.getBasicInfo(video.url);

            // Make it into a AUDIO ONLY stream
            const stream = ytdl(video.url, {filter: 'audioonly'});

            // No we can play the song in the channel
            connection.play(stream, {seek: 0, volume: 1})
            // Once finished, we will leave the channel
            .on('finish', () => {
                voiceChannel.leave();
            })
            
            // Mini function for length format
            const formatSongLength = (songLength) => {
                // Convert to number
                d = Number(songLength);
                // 3600 is the number of seconds in an hour
                var h = Math.floor(d / 3600);
                var m = Math.floor(d % 3600 / 60);
                var s = Math.floor(d % 3600 % 60);
                var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
                var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
                var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
                return hDisplay + mDisplay + sDisplay; 
            }

            // Once complete send a message saying we are playing a video
            await message.reply(`:thumbsup: Now playing ***${videoInfo.videoDetails.title}*** (${formatSongLength(videoInfo.videoDetails.lengthSeconds)})`);
        }
        else {
            message.channel.send('No video found');
        }
    }
}