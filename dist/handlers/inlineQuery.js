"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
            id: `${idx}`,
            title: item.title,
            // message_text: item.url,
            url: item.url,
            input_message_content: {
                message_text: item.url,
            },
        }));
        return ctx.answerInlineQuery(answer);
    }
    catch (e) {
        console.log('inline query error', e.message);
        const answer = [0].map((_, idx) => ({
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
exports.default = inlineQuery;
//# sourceMappingURL=inlineQuery.js.map