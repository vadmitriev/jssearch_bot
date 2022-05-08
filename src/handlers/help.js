const help = (ctx) => {
  ctx.reply(
    `Hello ${ctx.from.first_name}!
	Just write what do you want to find about web development`,
  );
};

module.exports = {
  help,
};
