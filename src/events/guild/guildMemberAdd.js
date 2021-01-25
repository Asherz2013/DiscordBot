const Canvas = require('canvas')

// Pass the entire Canvas object because you'll need to access its width, as well its context
const getFontSize = (canvas, text, startingFontSize) => {
	const ctx = canvas.getContext('2d');
	// Declare a base size of the font
	let fontSize = startingFontSize;
    ctx.font = `${fontSize}px sans-serif`;
	// Compare pixel width of the text to the canvas minus the approximate avatar size
	while (ctx.measureText(text).width > canvas.width - 84) {
		// Assign the font to the context and decrement it so it can be measured again
		ctx.font = `${fontSize -= 10}px sans-serif`;
	}
	// Return the result to use in the actual canvas
	return ctx.font;
};

const returnTextCenter = (canvas, text) => {
    const ctx = canvas.getContext('2d');
    const canvasWidth = canvas.width / 2;
    const textWidth = ctx.measureText(text).width / 2;
    return canvasWidth - textWidth;
}

const returnAvatarCenter = (canvas, avatarWidth) => {
    const ctx = canvas.getContext('2d');
    const halfCanvasWidth = canvas.width / 2;
    const halfAvatarWidth = avatarWidth / 2;
    return halfCanvasWidth - halfAvatarWidth;
}

const formatMemberCount = (count) => {
    const tenth = count % 10;
    const hundreth = count % 100;
    if (tenth == 1 && hundreth != 11) {
        return `${count}st`;
    }
    else if (tenth == 2 && hundreth != 12) {
        return `${count}nd`;
    }
    else if (tenth == 3 && hundreth != 13) {
        return `${count}rd`;
    }
    return `${count}th`;
}

module.exports = async(Discord, client, member) => {
    // Send the message to a designated channel on a server:
    const channel = member.guild.channels.cache.find(ch => ch.name === 'welcome');
    // Do nothing if the channel wasn't found on this server
    if (!channel) return;
    
    // Set a new canvas to the dimensions of 700x250 pixels
	const canvas = Canvas.createCanvas(1024, 500);
	// ctx (context) will be used to modify a lot of the canvas
	const ctx = canvas.getContext('2d');
    
    // Since the image takes time to load, you should await it
    const background = await Canvas.loadImage('./src/assets/mountains.jpg');
	// This uses the canvas dimensions to stretch the image onto the entire canvas
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    // Select the color of the stroke
	ctx.strokeStyle = '#323044'; // Tuna
	// Draw a rectangle with the dimensions of the entire canvas
    ctx.strokeRect(5, 5, canvas.width-10, canvas.height-10);
    
    // Adding text

    // Welcome Message
    // Slightly smaller text placed above the member's display name
	ctx.font = '62px sans-serif';
	ctx.fillStyle = '#C6B873'; // Laser
	ctx.fillText('WELCOME', returnTextCenter(canvas, 'WELCOME'), 376);

    // Members Name
    const memberName = member.displayName;
    // Select the font size and type from one of the natively available fonts
	ctx.font = getFontSize(canvas, memberName, 62);
	// Select the style that will be used to fill the text in
	ctx.fillStyle = '#C6B873'; // Laser
	// Actually fill the text with a solid color
    ctx.fillText(memberName, returnTextCenter(canvas, memberName), 430);
    
    // Member count
    const memberCount = member.guild.memberCount;
    const memberCountString = `You are our ${formatMemberCount(memberCount)} member`;
    // Select the font size and type from one of the natively available fonts
	ctx.font = getFontSize(canvas, memberCountString, 26);
	// Select the style that will be used to fill the text in
	ctx.fillStyle = '#C6B873'; // Laser
	// Actually fill the text with a solid color
	ctx.fillText(memberCountString, returnTextCenter(canvas, memberCountString), 463);

    // Wait for Canvas to load the image
	const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg' }));
    const avatarX = returnAvatarCenter(canvas, 266);

    // Anything after this point will be caught by the ARC!
    // Draws a Circle
    // Pick up the pen
	ctx.beginPath();
	// Start the arc to form a circle
    ctx.arc(avatarX + 133, 40 + 133, 130, 0, Math.PI * 2);
    // Stroke the edges
    ctx.stroke = '#ffffff';
	// Put the pen down
	ctx.closePath();
	// Clip off the region you drew on
	ctx.clip();

    
	// Draw the avatar onto the main canvas
	// Move the image downwards vertically and constrain its height to 200, so it's a square
	ctx.drawImage(avatar, avatarX, 40, 266, 266);

    


	// Use helpful Attachment class structure to process the file for you
	const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');

	channel.send(`Welcome to the server, ${member}!`, attachment);
}