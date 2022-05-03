const { api } = require("./../api");

const callbackQuery = async (ctx, api) => {
	console.log("callback query ctx: ", ctx);
	console.log("callback query: ", ctx.callbackQuery);

	const query = ctx.callbackQuery.data;

	const text = query.split("|")[0];
	let page = query.split("|")[1];

	const currentPage = api.getCurrentPage(text);

	const chatId = ctx.chat.id;

	switch (ctx.callbackQuery.data) {
		case "first":
			api.setPage(1);

			// ctx.answerInlineQuery("page: " + PAGE);
			ctx.reply("page: " + 1);
			break;
		case "next":
			api.setPage(currentPage + 1);
			ctx.reply("page: " + page);
			break;
		default:
			page = ctx.callbackQuery.data;
			api.setPage(page);
			// await findInDb(query)
			ctx.reply("page: " + page);
			break;
	}
};

module.exports = {
	callbackQuery,
};
