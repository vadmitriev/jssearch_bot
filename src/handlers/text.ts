import { formKeyboard, textAnswer } from '../utils';
import { Markup, Context } from 'telegraf';
import { Message } from 'typegram';
import Api from '../api';

const text = async (ctx: Context, api: Api) => {
  const myId = ctx.botInfo.id;

  const message = ctx.message as Message.TextMessage;

  const messageFromBot = message?.via_bot?.id === myId;

  const chatId = ctx.chat.id;

  if (messageFromBot) {
    return;
  }

  try {
    const text = message.text;
    const data = await api.findInDb({
      query: text,
      loadDescription: false,
    });
    const result = await textAnswer(text, data);

    api.setPage(text, 1);
    const pageCount = api.getPageCount(text);

    if (data.length) {
      const keyboard = formKeyboard(text, 1, pageCount);
      if (!keyboard) {
        return;
      }
      const markup = Markup.inlineKeyboard(keyboard);

      return ctx.telegram.sendMessage(chatId, result, {
        reply_markup: markup.reply_markup,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      });
    }

    return ctx.reply(result);
  } catch (e: any) {
    console.log('context error:', e);
    return ctx.reply(`An error occurred, ${e.message}`);
  }
};

export default text;
