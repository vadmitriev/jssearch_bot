require("dotenv").config();
const { Telegraf } = require("telegraf");
const { Api } = require("./api");
// const TelegramBot = require("node-telegram-bot-api");

const {
	startHandler,
	textHandler,
	callbackQueryHandler,
	inlineQueryHandler,
} = require("./handlers");

const bot = new Telegraf(process.env.BOT_TOKEN);
// const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
const api = new Api();

// bot.start((ctx) => startHandler(ctx, api));
bot.on("start", (ctx) => startHandler(ctx, api));

bot.on("text", (ctx) => textHandler(ctx, api));

bot.on("inline_query", (ctx) => inlineQueryHandler(ctx, api));

bot.on("callback_query", (ctx) => callbackQueryHandler(ctx, api));

bot.on("chosen_inline_result", (ctx) => {
	console.log("chosen_inline_result chat", ctx.chat);
});

// bot.action(/.+/, (ctx) => {
// 	return ctx.answerCallbackQuery(`Oh, ${ctx.match[0]}! Great choise`);
// });

bot.launch().then(() => {
	console.log("Bot is running");
});
