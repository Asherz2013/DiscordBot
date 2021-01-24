module.exports = (Discord, client) => {
    console.log(`${client.user.username}(${client.user.tag}) has logged in`);
    client.user.setActivity('You all', {type: 'WATCHING'}).catch(console.error);
}