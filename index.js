require("dotenv").config();
const { Telegraf } = require("telegraf");
const { Api } = require("./api");

const {
	startHandler,
	textHandler,
	callbackQueryHandler,
	inlineQueryHandler,
} = require("./handlers");

const bot = new Telegraf(process.env.BOT_TOKEN);
const api = new Api();

bot.start(startHandler);

bot.on("text", (ctx) => textHandler(ctx, api));

bot.on("inline_query", (ctx) => inlineQueryHandler(ctx, api));

bot.on("callback_query", (ctx) => callbackQueryHandler(ctx, api));

bot.on("chosen_inline_result", (ctx) => {
	console.log("chosen_inline_result chat", ctx.chat);
});

// bot.on("message", async (ctx) => {
// 	console.log("message", ctx.chat);
// });

bot.launch().then(() => {
	console.log("Bot is running");
});
