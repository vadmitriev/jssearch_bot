"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./../utils");
const telegraf_1 = require("telegraf");
const text = async (ctx, api) => {
    const myId = ctx.botInfo.id;
    const message = ctx.message;
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
        const result = await (0, utils_1.textAnswer)(text, data);
        const page = api.getCurrentPage(text);
        const pageCount = api.getPageCount(text);
        if (data.length) {
            const keyboard = (0, utils_1.formKeyboard)(text, page, pageCount);
            if (!keyboard) {
                return;
            }
            const markup = telegraf_1.Markup.inlineKeyboard(keyboard);
            return ctx.telegram.sendMessage(chatId, result, {
                reply_markup: markup.reply_markup,
                parse_mode: 'HTML',
                disable_web_page_preview: true,
            });
        }
        return ctx.reply(result);
    }
    catch (e) {
        console.log('context error:', e);
        return ctx.reply(`An error occurred, ${e.message}`);
    }
};
exports.default = text;
//# sourceMappingURL=text.js.map