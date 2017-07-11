import { bootstrapBot, createCommand } from './accord';
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

const subscription = bootstrapBot(bot, [ pingCommand, reverseCommand ]);
