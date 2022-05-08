"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startHandler = exports.helpHandler = exports.textHandler = exports.inlineQueryHandler = exports.callbackQueryHandler = void 0;
var callbackQuery_1 = require("./callbackQuery");
Object.defineProperty(exports, "callbackQueryHandler", { enumerable: true, get: function () { return __importDefault(callbackQuery_1).default; } });
var inlineQuery_1 = require("./inlineQuery");
Object.defineProperty(exports, "inlineQueryHandler", { enumerable: true, get: function () { return __importDefault(inlineQuery_1).default; } });
var text_1 = require("./text");
Object.defineProperty(exports, "textHandler", { enumerable: true, get: function () { return __importDefault(text_1).default; } });
var help_1 = require("./help");
Object.defineProperty(exports, "helpHandler", { enumerable: true, get: function () { return __importDefault(help_1).default; } });
var start_1 = require("./start");
Object.defineProperty(exports, "startHandler", { enumerable: true, get: function () { return __importDefault(start_1).default; } });
//# sourceMappingURL=index.js.map