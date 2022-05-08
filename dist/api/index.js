"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cheerio_1 = __importDefault(require("cheerio"));
const axios_1 = __importDefault(require("axios"));
const constants_1 = require("../constants");
const utils_1 = require("../utils");
class Api {
    constructor() {
        this.selectedResults = {};
        this.itemsPerPage = 15;
        this.page = 1;
        this.db = [];
        this.indexes = {};
        this.query = '';
    }
    async fetchDb() {
        const res = await axios_1.default.get(constants_1.API_URL + '/en-US/search-index.json');
        this.db = res.data.map((item) => ({
            ...item,
            url: constants_1.API_URL + item.url,
        }));
    }
    async fetchDescription(data) {
        const loadDescription = async (url) => {
            const html = await axios_1.default.get(url);
            const $ = cheerio_1.default.load(html.data);
            const description = $('meta[property="og:description"]').attr('content');
            return description;
        };
        const resultWithDescription = await Promise.allSettled(data.map(async (item, idx) => {
            if (!item.description) {
                const description = await loadDescription(item.url);
                item.description = description;
                const indexes = this.indexes[this.query];
                const dbIndex = indexes[idx];
                const dbItem = this.db[dbIndex];
                if (dbItem) {
                    dbItem.description = description;
                    this.db[dbIndex] = dbItem;
                }
            }
            return item;
        }));
        return resultWithDescription.map((promise) => promise.status === 'fulfilled' ? promise.value : null);
    }
    filterByQuery(data = [], query = this.query) {
        query = query.toLowerCase();
        const result = data.filter((item, idx) => {
            const check = item.title.toLowerCase().includes(query);
            if (check) {
                if (!this.indexes[query]) {
                    this.indexes[query] = [];
                }
                this.indexes[query].push(idx);
            }
            return check;
        });
        return (0, utils_1.sortByRelevance)(result, 'title', query);
    }
    async findInDb({ query = '', loadDescription = true, page = this.page, itemsPerPage = this.itemsPerPage, }) {
        if (!query.length) {
            this.query = '';
            return [];
        }
        this.query = query;
        try {
            if (!this.db.length) {
                await this.fetchDb();
            }
            const needFilter = !this.selectedResults[query]?.data?.length ||
                this.query.toLowerCase() !== query.toLowerCase();
            if (needFilter) {
                const filteredItems = this.filterByQuery(this.db, query);
                const results = { data: filteredItems, page: 1 };
                this.selectedResults[query] = results;
            }
            const start = (page - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            const { data } = this.selectedResults[query];
            const result = data.slice(start, end);
            if (loadDescription) {
                const resultWithDescription = await this.fetchDescription(result);
                return resultWithDescription;
            }
            return result;
        }
        catch (e) {
            console.log('api.findInDb error: ' + e);
            return [];
        }
    }
    async saveinDb(chatId, message) {
        // TODO
    }
    setPage(query, page) {
        const results = this.selectedResults[query];
        if (results) {
            results.page = page;
            this.selectedResults[query] = results;
        }
        this.page = page;
        this.query = query;
    }
    getCurrentPage(query = this.query) {
        const results = this.selectedResults[query];
        if (results) {
            return results.page;
        }
        return 0;
    }
    getPageCount(query) {
        const results = this.selectedResults[query];
        if (!results) {
            return 0;
        }
        return Math.floor(results.data.length / this.itemsPerPage);
    }
    getSelectedResults(query) {
        return this.selectedResults[query];
    }
}
exports.default = Api;
//# sourceMappingURL=index.js.map