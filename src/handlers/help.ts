import { Context } from 'telegraf';

const help = (ctx: Context) => {
  return ctx.reply(
    `Hello ${ctx.from.first_name}!
	Just write what do you want to find about web development`,
  );
};

export default help;
