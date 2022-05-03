const { formatAnswer } = require("./../utils");

const inlineQuery = async (ctx, api) => {
	const text = ctx.inlineQuery.query;

	if (!text.length) {
		ctx.answerInlineQuery([]);
		return;
	}

	try {
		const result = await api.findInDb(text);

		if (result.length <= 2) {
			ctx.answerInlineQuery([]);
			return;
		}

		const answer = result.map((item, idx) => ({
			type: "article",
			id: idx,
			title: item.title,
			// description: item.description,
			input_message_content: {
				message_text: JSON.stringify(formatAnswer(item)),
				parse_mode: "HTML", // MarkdownV2
				disable_web_page_preview: true,
			},
			disable_web_page_preview: true,
			// url: MDN_URL + item.url,
			hide_url: true,
		}));
		ctx.answerInlineQuery(answer);
	} catch (e) {
		console.log("inline query error", e.message);
	}

	// bot.on("chosen_inline_result", async (ctx1) => {
	// 	console.log("chosen_inline_result chat", ctx1.chat);

	// 	const text = ctx1.chosenInlineResult.query;
	// 	console.log("chosen_inline_result:", text);

	// 	const result = await textAnswer(ID_PREFIX + text);
	// 	ctx.reply(result);
	// });
};

module.exports = {
	inlineQuery,
};
