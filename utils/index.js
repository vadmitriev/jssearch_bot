const { API_URL } = require("./../constants");

const formatAnswer = (item) => {
	return `*${item?.title}*\n${API_URL + item?.url}\n${item?.description}
		`;
};

const formKeyboard = (query, page = 1, pageCount = 1) => {
	// const pages = [...Array.from({ length: pageCount }, (_, i) => i + 1)].map(
	// 	(number) => ({ text: number, callback_data: number })
	// );

	const keyboard = [
		[
			{
				text: page < 1 ? "◀️" : "❌",
				callback_data: `${query}|prev`,
			},
			{
				text: `${page}/${pageCount}`,
				callback_data: `${query}|${page}`,
			},
			{
				text: page < pageCount ? "▶️" : "❌",
				callback_data: `${query}|next`,
			},
		],
	];

	return keyboard;
};

const textAnswer = async (text = "", data = []) => {
	if (!text) return;

	if (!data.length) {
		return `Nothing was found by query <i>${text}</i>`;
	}

	return data.map(formatAnswer).join("");
};

module.exports = {
	textAnswer,
	formKeyboard,
	formatAnswer,
};
