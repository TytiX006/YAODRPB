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

function renderRollInMessage(dice) {
  var result = rollDice(dice);

  result.rolled = result.rolled.map((diceValue, i, a) => {
     return {
      value: diceValue,
      comma: i===a.length -1 ? false : true
    };
  });

  var template = fs.readFileSync('templates/roll_format.mustache', 'utf8');
  return Mustache.render(template, result);
}

function renderRoll(dice, author) {
  var result = rollDice(dice);

  result.rolled = result.rolled.map((diceValue, i, a) => {
     return {
      value: diceValue,
      comma: i===a.length -1 ? false : true
    };
  });
  result.author = author;

  var template = fs.readFileSync('templates/roll_response.mustache', 'utf8');
  return Mustache.render(template, result);
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

    message.channel.send(renderRoll(dice, message.author.username));

    message.delete()
      .then(msg => console.log(`Deleted message from ${msg.author.username}`))
      .catch(console.error);
  } else {
    // this is not a bot message
    if (message.author.id != client.user.id) {
      // split message in lines
      var arrayOfLines = message.content.match(/[^\r\n]+/g);

      const diceRegExp = /(\d{1,3}d\d{1,3})(\+\d{1,3}(d\d{1,3})*)*/gm;
      var buffer = '';
      for (line of arrayOfLines) {
        if (line.match(diceRegExp)) {
          buffer += line.replace(diceRegExp, (match) => {
            return renderRollInMessage(match);
          });
          buffer += '\n';
        }
      }

      if (arrayOfLines.length === 1) {
        message.channel.send('*@' + message.author.username + '* : '+ buffer.trim());
        message.delete()
          .then(msg => console.log(`Deleted message from ${msg.author.username}`))
          .catch(console.error);
      } else {
        message.channel.send(buffer.trim());
      }
    }

  }
});

client.on('messageUpdate', (oldMessage, newMessage) => {
  console.log('update :', oldMessage, newMessage);
});

client.on('error', err => {
  console.error(err);
});

// Log our bot in using the token from https://discordapp.com/developers/applications/me
client.login(process.env.DISCORD_TOKEN);

var testStr = 'ceci est un test: 1d6+3';

const diceRegExp = /(\d{1,3}d\d{1,3})(\+\d{1,3}(d\d{1,3})*)*/gm;
var newMessageContent = testStr.replace(diceRegExp, (match) => {
  return renderRollInMessage(match);
});
console.log(newMessageContent);
