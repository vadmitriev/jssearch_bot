const inlineQuery = async (ctx, api) => {
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

    const answer = result.map((item, idx) => ({
      type: 'article',
      id: idx,
      title: item.title,
      message_text: item.url,
      url: item.url,
    }));
    return ctx.answerInlineQuery(answer);
  } catch (e) {
    console.log('inline query error', e.message);
    ctx.answerInlineQuery('Nothing was found');
  }
};

module.exports = {
  inlineQuery,
};
