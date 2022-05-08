const { formKeyboard, textAnswer } = require('./../utils');
const { Markup } = require('telegraf');

const text = async (ctx, api) => {
  const myId = ctx.botInfo.id;
  const messageFromBot = ctx.message?.via_bot?.id === myId;

  const chatId = ctx.chat.id;

  if (messageFromBot) {
    return;
  }

  try {
    const text = ctx.message.text;
    const data = await api.findInDb({
      query: text,
      loadDescription: false,
    });
    const result = await textAnswer(text, data);

    const page = api.getCurrentPage(text);
    const pageCount = api.getPageCount(text);

    if (data.length) {
      const keyboard = formKeyboard(text, page, pageCount);
      const markup = Markup.inlineKeyboard(keyboard);
      // return ctx.reply(result, Markup.inlineKeyboard(keyboard), {
      //   reply_markup: markup.reply_markup,
      //   parse_mode: 'HTML',
      //   disable_web_page_preview: true,
      // });
      return ctx.telegram.sendMessage(chatId, result, {
        reply_markup: markup.reply_markup,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      });
    }

    // reply_markup: Markup.inlineKeyboard(keyboard),
    // disable_web_page_preview: true,

    return ctx.reply(result);
  } catch (e) {
    console.log('context error:', e);
    return ctx.reply(`An error occurred, ${e.message}`);
  }
};

module.exports = {
  text,
};
