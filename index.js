var app = require('express')();
var fs = require('fs');
var Mustache = require('mustache');

const PORT = process.env.PORT || 3000;

app.get('/', function(req, res) {
  res.send('hello');
});

app.listen(PORT, function () {
  console.log('server started on PORT', PORT);
});

var Roll = require('roll'),
    roll = new Roll();

function rollDice(dice) {
  var result = roll.roll(dice);
  result.dice = dice;
  return result;
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

  if (message.content.toLowerCase().startsWith('roll ')) {
    var dice = message.content.toLowerCase().replace('roll ', '');
    var result = rollDice(dice);
    // Send "pong" to the same channel
    var template = fs.readFileSync('templates/roll_response.mustache', 'utf8');
    message.channel.send(Mustache.render(template, result));
  }
});

// Log our bot in using the token from https://discordapp.com/developers/applications/me
client.login(process.env.DISCORD_TOKEN);
