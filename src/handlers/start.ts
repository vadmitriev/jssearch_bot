import { Context } from 'telegraf';

const start = (ctx: Context) => {
  console.log(`start from ${ctx.from.first_name}`);
  return ctx.reply(
    `Hello ${ctx.from.first_name}!\nFind something about javascript and web development.`,
  );
};

export default start;
