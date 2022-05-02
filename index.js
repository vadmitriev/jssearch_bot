require("dotenv").config();
const axios = require("axios");
const { Telegraf, Markup } = require("telegraf");
const cheerio = require("cheerio");

const ID_PREFIX = "Search: ";
const MDN_URL = "https://developer.mozilla.org";

let db = [];
let selectedResults = [];
let allItems = [];
let ITEMS_PER_PAGE = 5;
let PAGE = 1;

const loadDescription = async (url) => {
	const html = await axios.get(MDN_URL + url);
	const $ = cheerio.load(html.data);
	const description = $('meta[property="og:description"]').attr("content");
	return description;
};

const fetchDb = async () => {
	const res = await axios.get(MDN_URL + "/en-US/search-index.json");
	db = res.data;
};

const findInDb = async (
	query = "",
	page = PAGE,
	itemsPerPage = ITEMS_PER_PAGE
) => {
	if (!query) {
		return [];
	}

	if (!db.length) {
		await fetchDb();
	}

	const indexes = [];

	const start = (page - 1) * itemsPerPage;
	const end = start + itemsPerPage;

	allItems = db.filter((item, idx) => {
		const check = item.title.toLowerCase().includes(query.toLowerCase());
		if (check) {
			indexes.push(idx);
		}
		return check;
	});

	const result = allItems.slice(start, end);

	const resultWithDescription = await Promise.allSettled(
		result.map(async (item, idx) => {
			if (!item.description) {
				const description = await loadDescription(item.url);
				item.description = description;
				const dbIndex = indexes[idx];

				const dbItem = db[dbIndex];
				dbItem.description = description;
				db[dbIndex] = dbItem;
			}
			return item;
		})
	);

	selectedResults = resultWithDescription.map((promise) => promise.value);

	return selectedResults;
};

const formatAnswer = (item) => {
	return `<b>${item?.title}</b>\n${MDN_URL + item?.url}\n${item?.description}
		`;
};

const textAnswer = async (text = "") => {
	const notFountText = `Nothing was found by query <i>${text}</i>`;

	if (text.startsWith(ID_PREFIX)) {
		const query = text.replace(ID_PREFIX, "");
		if (!selectedResults.length) {
			await findInDb(query);
		}
		const res = selectedResults.find((item) => item.title === query);
		if (!res) {
			return notFountText;
		}
		return formatAnswer(res);
	}

	const data = await findInDb(text);

	if (!data.length) {
		return notFountText;
	}

	return data.map(formatAnswer).join("");
};

const formKeyboard = (limit = 5) => {
	const pageCount = Math.round(allItems.length / ITEMS_PER_PAGE);
	if (!pageCount) return;

	const pages = [...Array.from({ length: pageCount }, (_, i) => i + 1)].map(
		(number) => ({ text: number, callback_data: number })
	);

	const keyboard = [
		[
			{
				text: "◀️",
				callback_data: "first",
			},
		],
		[...pages.slice(0, limit)],
		[
			{
				text: "▶️",
				callback_data: "last",
			},
		],
	];

	return keyboard;
};

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
	console.log("start");
	ctx.reply(`
    Hello ${ctx.from.first_name}!\nFind something about javascript and web development.
`);
});

bot.on("text", async (ctx) => {
	const myId = ctx.botInfo.id;
	const messageFromBot = ctx.message?.via_bot?.id === myId;

	if (messageFromBot) {
		return;
	}

	try {
		const text = ctx.message.text;
		const result = await textAnswer(text);
		// ctx.replyWithHTML(result);

		const keyboard = formKeyboard();

		await ctx.replyWithHTML(result, Markup.inlineKeyboard(keyboard), {
			// reply_markup: Markup.inlineKeyboard(keyboard),
			// disable_web_page_preview: true,
		});
	} catch (e) {
		console.log("context error:", ctx);
		console.log("error", e);
		await ctx.reply(`An error occurred`);
	}
});

bot.on("inline_query", async (ctx) => {
	console.log("inline_query chat", ctx.chat);
	const text = ctx.inlineQuery.query;
	console.log("inline query", text);

	if (!text.length) {
		ctx.answerInlineQuery([]);
		return;
	}

	const result = await findInDb(text);

	if (result.length <= 2) {
		ctx.answerInlineQuery([]);
		return;
	}

	const answer = result.map((item, idx) => ({
		type: "article",
		id: idx,
		title: item.title,
		description: item.description,
		input_message_content: {
			message_text: formatAnswer(item),
			parse_mode: "HTML",
		},
		disable_web_page_preview: true,
		// url: MDN_URL + item.url,
		hide_url: true,
	}));

	ctx.answerInlineQuery(answer);

	// bot.on("chosen_inline_result", async (ctx1) => {
	// 	console.log("chosen_inline_result chat", ctx1.chat);

	// 	const text = ctx1.chosenInlineResult.query;
	// 	console.log("chosen_inline_result:", text);

	// 	const result = await textAnswer(ID_PREFIX + text);
	// 	ctx.reply(result);
	// });
});

bot.on("callback_query", async (ctx) => {
	console.log("callback_query chat", ctx.chat);

	console.log("callback query ctx: ", ctx);
	console.log("callback query: ", ctx.callbackQuery);

	switch (ctx.callbackQuery.data) {
		case "first":
			PAGE = 1;

			ctx.reply("page: " + PAGE);
			break;
		case "last":
			PAGE = Math.round(allItems.length / ITEMS_PER_PAGE);
			ctx.reply("page: " + PAGE);
			break;
		default:
			PAGE = ctx.callbackQuery.data;

			// await findInDb(query)
			ctx.reply("page: " + PAGE);
			break;
	}
});

bot.on("chosen_inline_result", (ctx) => {
	console.log("chosen_inline_result chat", ctx.chat);
	// console.log("chosen inline result", chosenInlineResult);
	// console.log("chosen inline update", update);
	// const result = update.chosen_inline_result;
	// const resultId = result.result_id;
	// const query = result.query;
	// const user = result.from.id;
	// bot.telegram.sendMessage(
	// 	user,
	// 	((text = "fetching data with id: " + resultId), "query: " + query)
	// );
});

bot.on("message", async (ctx) => {
	console.log("message", ctx.chat);
});

bot.launch().then(() => {
	console.log("Bot is running");
});
