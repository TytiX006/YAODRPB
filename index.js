var app = require('express')();

const PORT = process.env.PORT || 3000;

app.get('/', function(req, res) {
  res.send('hello');
});

app.listen(PORT, function () {
  console.log('server started on PORT', PORT);
});

var Roll = require('roll'),
    roll = new Roll();

function rollDice(messageContent) {
  var dice = messageContent.replace('roll ', '');
  var result = roll.roll(dice)
  return JSON.stringify(result);
}

// Import the discord.js module
const Discord = require('discord.js');

// Create an instance of a Discord client
const client = new Discord.Client();

/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
client.on('ready', () => {
  console.log('I am ready!');
});

// Create an event listener for messages
client.on('message', message => {
  // If the message is "ping"
  if (message.content === 'ping') {
    // Send "pong" to the same channel
    message.channel.send('pong');
  }

  if (message.content.startsWith('roll')) {
    var result = rollDice(message.content);
    // Send "pong" to the same channel
    message.channel.send(result);
  }
});

// Log our bot in using the token from https://discordapp.com/developers/applications/me
client.login(process.env.DISCORD_TOKEN);
