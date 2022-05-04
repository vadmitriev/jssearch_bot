const { API_URL } = require("./../constants");

const formatAnswer = (item) => {
	return `<b>${item?.title}</b>\n${API_URL + item?.url}\n${item?.description}
		`;
};

const formKeyboard = (query, page = 1, pageCount = 1) => {
	const firstButton =
		page === 1
			? null
			: {
					text: "◀️",
					callback_data: `${query}|prev`,
			  };

	const currentPageButton = {
		text: `${page}/${pageCount}`,
		callback_data: `${query}|${page}`,
	};

	const lastButton =
		page === pageCount
			? null
			: {
					text: "▶️",
					callback_data: `${query}|next`,
			  };

	const keyboard = [];

	if (firstButton) {
		keyboard.push(firstButton);
	}

	keyboard.push(currentPageButton);

	if (lastButton) {
		keyboard.push(lastButton);
	}

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
