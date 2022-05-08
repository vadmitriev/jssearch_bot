const start = (ctx) => {
	console.log("start");
	ctx.reply(
		`Hello ${ctx.from.first_name}!\nFind something about javascript and web development.`
	);
};

module.exports = {
	start,
};
