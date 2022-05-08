import { Context } from 'telegraf';
import { InlineQueryResult } from 'typegram';
import Api from '../api';

const inlineQuery = async (ctx: Context, api: Api) => {
  const text = ctx.inlineQuery.query;

  if (!text.length) {
    ctx.answerInlineQuery([]);
    return;
  }

  try {
    const result = await api.findInDb({
      query: text,
      loadDescription: false,
      itemsPerPage: 20,
    });

    if (result.length <= 2) {
      return ctx.answerInlineQuery([]);
    }

    const answer: InlineQueryResult[] = result.map((item, idx) => ({
      type: 'article',
      id: `${idx}`,
      title: item.title,
      // message_text: item.url,
      url: item.url,
      input_message_content: {
        message_text: item.url,
      },
    }));
    return ctx.answerInlineQuery(answer);
  } catch (e: any) {
    console.log('inline query error', e.message);
    const answer: InlineQueryResult[] = [0].map((_, idx) => ({
      type: 'article',
      id: `${idx}`,
      title: '',
      input_message_content: {
        message_text: 'Nothing was found',
      },
    }));
    ctx.answerInlineQuery(answer);
  }
};

export default inlineQuery;
