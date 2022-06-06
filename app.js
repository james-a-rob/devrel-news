"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortStoriesByDate = exports.scrapeLatestDevToStories = exports.scrapeLatestHnStories = exports.hnFilter = void 0;
const axios_1 = __importDefault(require("axios"));
const hnFilter = (stories, searchTerm) => {
    const hasEnoughPoints = (story) => {
        return story.points > 4;
    };
    const isStory = (story) => {
        return !story.title.includes('Show HN') && !story.title.includes('Tell HN') && !story.title.includes('Ask HN');
    };
    const queryOnlyInTitle = (story) => {
        return story.title.toLowerCase().includes(searchTerm);
    };
    return stories.filter((story) => {
        return hasEnoughPoints(story) && isStory(story) && queryOnlyInTitle(story);
    });
};
exports.hnFilter = hnFilter;
const scrapeLatestHnStories = () => __awaiter(void 0, void 0, void 0, function* () {
    const yesterday = (Date.now() / 1000) - ((60 * 60 * 24) * 20);
    let hnResponses = [];
    const searchTerms = [
        "api",
        "sdk",
        "cli",
        "readme",
        "devrel",
        "developer advocate",
        "dev tool",
        "ide",
        "text editor",
        "vs code",
        "developer relations",
        "devex",
        "developer experiance",
        "plugin",
        "extention",
        "twilio",
        "stripe",
        "keynote",
        "open source",
        "git",
        "conference",
        "tutorial",
        "github",
        "documentation",
        "developers",
    ];
    try {
        for (const searchTerm of searchTerms) {
            const hnResponse = yield axios_1.default.get(`https://hn.algolia.com/api/v1/search_by_date?query="${searchTerm}"&numericFilters=created_at_i>${yesterday}&tags=story`);
            const validStories = (0, exports.hnFilter)(hnResponse.data.hits, searchTerm);
            hnResponses.push(validStories);
            yield new Promise(r => setTimeout(r, 200));
        }
    }
    catch (e) {
        console.log(e);
        console.log("hn fetch failed");
        return [];
    }
    return hnResponses.flat().map((story) => ({ title: story.title, url: story.url, created_at: story.created_at }));
});
exports.scrapeLatestHnStories = scrapeLatestHnStories;
const scrapeLatestDevToStories = () => __awaiter(void 0, void 0, void 0, function* () {
    let devToStories;
    try {
        let devToResponse = yield axios_1.default.get("https://dev.to/api/articles?tag=devrel&top=15");
        devToStories = devToResponse.data;
    }
    catch (e) {
        console.log(e);
        console.log("dev.to fetch failed");
        return [];
    }
    return devToStories.map((story) => ({ title: story.title, url: story.url, created_at: story.created_at }));
});
exports.scrapeLatestDevToStories = scrapeLatestDevToStories;
const sortStoriesByDate = (stories) => {
    return stories.sort(function (a, b) {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
};
exports.sortStoriesByDate = sortStoriesByDate;
