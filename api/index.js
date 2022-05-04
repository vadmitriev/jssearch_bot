const cheerio = require("cheerio");
const axios = require("axios");

const { API_URL } = require("./../constants");

// interface Results {
// 	data: [],
// 	page: number,
// }
// interface Indexes {
//
//}

class Api {
	selectedResults = {};
	itemsPerPage = 5;
	page = 1;
	db = [];
	indexes = []; // {[query]: page,}
	query = "";

	constructor() {}

	async fetchDb() {
		const res = await axios.get(API_URL + "/en-US/search-index.json");
		this.db = res.data;
	}

	async getItemByIndex(index) {
		if (this.db.length > index) {
			return null;
		}
		return this.db[index];
	}

	async changeItemByIndex(index, newItem) {
		this.db[index] = newItem;
	}

	async fetchDescription(data) {
		const loadDescription = async (url) => {
			const html = await axios.get(API_URL + url);
			const $ = cheerio.load(html.data);
			const description = $('meta[property="og:description"]').attr(
				"content"
			);
			return description;
		};

		const resultWithDescription = await Promise.allSettled(
			data.map(async (item, idx) => {
				if (!item.description) {
					const description = await loadDescription(item.url);
					item.description = description;

					const indexes = this.indexes[this.query];
					const dbIndex = indexes[idx];
					const dbItem = this.getItemByIndex(dbIndex);
					if (dbItem) {
						dbItem.description = description;
						this.changeItemByIndex(dbIndex, dbItem);
					}
				}
				return item;
			})
		);

		return resultWithDescription.map((promise) => promise.value);
	}

	filterByQuery(data = [], query = this.query) {
		return data.filter((item, idx) => {
			if (!item.title) {
				console.log("hmm", item);
			}
			const check = item.title
				.toLowerCase()
				.includes(query.toLowerCase());
			if (check) {
				if (!this.indexes[query]) {
					this.indexes[query] = [];
				}
				this.indexes[query].push(idx);
			}
			return check;
		});
	}

	async findInDb(
		query = "",
		page = this.page,
		itemsPerPage = this.itemsPerPage
	) {
		if (!query.length) {
			this.query = "";
			return [];
		}

		this.query = query;

		try {
			if (!this.db.length) {
				await this.fetchDb();
			}

			const needFilter =
				!this.selectedResults[query]?.data?.length ||
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

			const resultWithDescription = await this.fetchDescription(result);

			return resultWithDescription;
		} catch (e) {
			console.log("api.findInDb error: " + e.message);
			return [];
		}
	}

	async saveinDb(chatId, message) {}

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

	set itemsPerPage(count) {
		this.itemsPerPage = count;
	}

	get itemsPerPage() {
		return itemsCountPerPage;
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

module.exports = {
	Api,
};
