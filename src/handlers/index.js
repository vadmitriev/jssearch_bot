const { callbackQuery } = require("./callbackQuery");
const { inlineQuery } = require("./inlineQuery");
const { text } = require("./text");
const { help } = require("./help");
const { start } = require("./start");

module.exports = {
	startHandler: start,
	helpHandler: help,
	textHandler: text,
	inlineQueryHandler: inlineQuery,
	callbackQueryHandler: callbackQuery,
};
