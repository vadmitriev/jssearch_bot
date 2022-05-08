"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./../utils");
const telegraf_1 = require("telegraf");
const callbackQuery = async (ctx, api) => {
    try {
        const query = ctx.callbackQuery.data;
        const text = query.split('|')[0];
        const changePage = query.split('|')[1];
        const currentPage = api.getCurrentPage(text);
        const pageCount = api.getPageCount(text);
        const chatId = ctx.callbackQuery.message.chat.id;
        const messageId = ctx.callbackQuery.message.message_id;
        const inlineMessageId = '';
        const replyNewAnswer = async () => {
            const newPage = api.getCurrentPage(text);
            const data = await api.findInDb({
                query: text,
                loadDescription: false,
                page: newPage,
            });
            const result = await (0, utils_1.textAnswer)(text, data);
            if (data.length) {
                const keyboard = (0, utils_1.formKeyboard)(text, newPage, pageCount);
                if (!keyboard) {
                    return;
                }
                const markup = telegraf_1.Markup.inlineKeyboard(keyboard);
                return ctx.telegram.editMessageText(chatId, messageId, inlineMessageId, result, {
                    reply_markup: markup.reply_markup,
                    parse_mode: 'HTML',
                    disable_web_page_preview: true,
                });
            }
        };
        switch (changePage) {
            case 'prev':
                api.setPage(text, currentPage - 1);
                await replyNewAnswer();
                break;
            case 'next':
                api.setPage(text, currentPage + 1);
                await replyNewAnswer();
                break;
            default:
                let textAnswer = `Current page by query "${text}" is ${currentPage}`;
                if (currentPage === pageCount && pageCount !== 0) {
                    textAnswer = `Last page by query "${text}"`;
                }
                ctx.answerCbQuery(textAnswer, {
                    show_alert: false,
                });
        }
    }
    catch (e) {
        console.log('Callback query error: ', e);
        ctx.reply(`An error occured: ${e?.message}`);
    }
};
exports.default = callbackQuery;
//# sourceMappingURL=callbackQuery.js.map