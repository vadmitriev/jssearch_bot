import { Telegraf, Context } from 'telegraf';
import Api from './api';
import config from './config';

import {
  startHandler,
  textHandler,
  helpHandler,
  callbackQueryHandler,
  inlineQueryHandler,
} from './handlers';

const bot: Telegraf<Context> = new Telegraf(config.token);
const api = new Api();

bot.telegram.setMyCommands([
  { command: '/start', description: 'Start' },
  { command: '/help', description: 'Help' },
]);

bot.start((ctx) => startHandler(ctx));

bot.help((ctx) => helpHandler(ctx));

bot.on('text', (ctx) => textHandler(ctx, api));

bot.on('inline_query', (ctx) => inlineQueryHandler(ctx, api));

bot.on('callback_query', (ctx) => callbackQueryHandler(ctx, api));

bot.launch().then(() => {
  console.log('Bot is running');
});
