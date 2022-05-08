require('dotenv').config();
const { Telegraf } = require('telegraf');
const { Api } = require('./api');

const {
  startHandler,
  textHandler,
  helpHandler,
  callbackQueryHandler,
  inlineQueryHandler,
} = require('./handlers');

const bot = new Telegraf(process.env.BOT_TOKEN);
const api = new Api();

bot.telegram.setMyCommands([
  { command: '/start', description: 'Start' },
  { command: '/help', description: 'Help' },
]);

bot.start((ctx) => startHandler(ctx, api));

bot.help((ctx) => helpHandler(ctx, api));

bot.on('text', (ctx) => textHandler(ctx, api));

bot.on('inline_query', (ctx) => inlineQueryHandler(ctx, api));

bot.on('callback_query', (ctx) => callbackQueryHandler(ctx, api));

bot.launch().then(() => {
  console.log('Bot is running');
});
