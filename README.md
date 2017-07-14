# Accord.js

[![Travis](https://img.shields.io/travis/chadrien/accord.svg?style=flat-square)](https://travis-ci.org/chadrien/accord)
[![Coveralls](https://img.shields.io/coveralls/chadrien/accord.svg?style=flat-square)](https://coveralls.io/github/chadrien/accord)

Accord is the library that will allow you to write your [discord](https://discordapp.com)
bot with serenity.

How do you ask? By trying to have the simplest possible API while giving great control of
what your bot will do.

## Documentation

The documentation is available in [`docs/`](docs/)

## Usage

Here is an example of how to use Accord.js.

```js
import { bootstrapBot, createCommand } from 'accord.js';
import { Client } from 'discord.js';

const discordToken = process.env.DISCORD_TOKEN || '';
const bot = new Client();

bot.on('ready', () => console.log('Bot connected'));
bot.login(discordToken);

const pingCommand = createCommand('ping', message => new Promise(resolve =>
  setTimeout(() => resolve({
    content: 'PONG',
    recipient: message.channel,
  }), 3000),
));

const reverseCommand = createCommand(/reverse (.*)/, (message, stringToReverse) => ({
  content: stringToReverse.split('').reverse().join(''),
  recipient: message.channel,
}));

const subscription = bootstrapBot(bot, [ pingCommand, reverseCommand ], '!');
 ```
