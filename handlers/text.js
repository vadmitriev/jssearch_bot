const { formKeyboard, textAnswer } = require("./../utils");
const { Markup } = require("telegraf");

const text = async (ctx, api) => {
	const myId = ctx.botInfo.id;
	const messageFromBot = ctx.message?.via_bot?.id === myId;

	if (messageFromBot) {
		return;
	}

	try {
		const text = ctx.message.text;
		const data = await api.findInDb(text);
		const result = await textAnswer(text, data);

		const page = api.getCurrentPage(text);
		const pageCount = api.getPageCount(text);

		if (data.length) {
			const keyboard = formKeyboard(text, page, pageCount);
			return ctx.replyWithHTML(result, Markup.inlineKeyboard(keyboard));
		}

		// reply_markup: Markup.inlineKeyboard(keyboard),
		// disable_web_page_preview: true,

		return ctx.replyWithHTML(result);
	} catch (e) {
		console.log("context error:", ctx);
		console.log("error", e);
		return ctx.reply(`An error occurred`);
	}
};

module.exports = {
	text,
};
