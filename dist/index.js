"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const api_1 = __importDefault(require("./api"));
const config_1 = __importDefault(require("./config"));
const handlers_1 = require("./handlers");
const bot = new telegraf_1.Telegraf(config_1.default.token);
const api = new api_1.default();
bot.telegram.setMyCommands([
    { command: '/start', description: 'Start' },
    { command: '/help', description: 'Help' },
]);
bot.start((ctx) => (0, handlers_1.startHandler)(ctx));
bot.help((ctx) => (0, handlers_1.helpHandler)(ctx));
bot.on('text', (ctx) => (0, handlers_1.textHandler)(ctx, api));
bot.on('inline_query', (ctx) => (0, handlers_1.inlineQueryHandler)(ctx, api));
bot.on('callback_query', (ctx) => (0, handlers_1.callbackQueryHandler)(ctx, api));
bot.launch().then(() => {
    console.log('Bot is running');
});
//# sourceMappingURL=index.js.map