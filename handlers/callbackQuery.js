const { formKeyboard, textAnswer } = require("./../utils");
const { Markup, Extra } = require("telegraf");

const callbackQuery = async (ctx, api) => {
	// console.log("callback query ctx: ", ctx);
	// console.log("callback query: ", ctx.callbackQuery);

	const query = ctx.callbackQuery.data;

	const text = query.split("|")[0];
	const changePage = query.split("|")[1];

	const currentPage = api.getCurrentPage(text);

	const chatId = ctx.chat.id;
	// const messageId = ctx.update.message.id;

	const replyNewAnswer = async () => {
		const newPage = api.getCurrentPage(text);
		console.log("page: " + newPage);

		const data = await api.findInDb(text, newPage);
		const result = await textAnswer(text, data);
		const pageCount = api.getPageCount(text);

		if (data.length) {
			const keyboard = formKeyboard(text, newPage, pageCount);
			return ctx.editMessageText(result, Markup.inlineKeyboard(keyboard));
		}
	};

	switch (changePage) {
		case "prev":
			api.setPage(text, currentPage - 1);
			await replyNewAnswer();
			// ctx.answerCallbackQuery(chatId, {
			// 	text: "Вы уже на последней странице!",
			// 	show_alert: true,
			// });

			// ctx.answerInlineQuery("page: " + PAGE);
			// ctx.reply("page: " + 1);
			break;
		case "next":
			api.setPage(text, currentPage + 1);
			await replyNewAnswer();

			// const newPage = api.getCurrentPage(text);
			// console.log("page: " + newPage);

			// const data = await api.findInDb(text, newPage);
			// const result = await textAnswer(text, data);
			// const pageCount = api.getPageCount(text);

			// if (data.length) {
			// 	const keyboard = formKeyboard(text, newPage, pageCount);
			// 	// ctx.answerCallbackQuery("Wait...");
			// 	return ctx.replyL(result, Markup.inlineKeyboard(keyboard));
			// 	// return ctx.answerCallbackQuery("test");
			// 	// return ctx.answerCallbackQuery(
			// 	// 	result,
			// 	// 	Markup.inlineKeyboard(keyboard)
			// 	// );
			// }

			// ctx.reply("page: " + currentPage);
			break;
		default:
			api.setPage(text, currentPage);
			// await findInDb(query)

			// ctx.answerCallbackQuery("Wait...");

			// ctx.answerCallbackQuery(chatId, {
			// 	text: "Вы уже на последней странице!",
			// 	show_alert: true,
			// });
			// ctx.reply("page: " + currentPage);
			break;
	}
};

module.exports = {
	callbackQuery,
};
