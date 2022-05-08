"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const start = (ctx) => {
    console.log('start');
    ctx.reply(`Hello ${ctx.from.first_name}!\nFind something about javascript and web development.`);
};
exports.default = start;
//# sourceMappingURL=start.js.map