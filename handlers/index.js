const { callbackQuery } = require("./callbackQuery");
const { inlineQuery } = require("./inlineQuery");
const { text } = require("./text");
const { start } = require("./start");

module.exports = {
	startHandler: start,
	textHandler: text,
	inlineQueryHandler: inlineQuery,
	callbackQueryHandler: callbackQuery,
};
