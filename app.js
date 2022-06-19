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
exports.urlToImage = exports.removeDuplicateStories = exports.sortStoriesByDate = exports.scrapeLatestDxTipsStories = exports.scrapeLatestWeeklyEventStories = exports.scrapeLatestGoogleNewsStories = exports.scrapeLatestDevrelxStories = exports.scrapeLatestDevToStories = exports.scrapeLatestHnStories = exports.hnFilter = void 0;
const axios_1 = __importDefault(require("axios"));
const fast_xml_parser_1 = require("fast-xml-parser");
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
    const hasUrl = (story) => {
        return !!story.url;
    };
    return stories.filter((story) => {
        return hasEnoughPoints(story) && isStory(story) && queryOnlyInTitle(story) && hasUrl(story);
    });
};
exports.hnFilter = hnFilter;
const scrapeLatestHnStories = () => __awaiter(void 0, void 0, void 0, function* () {
    const yesterday = (Date.now() / 1000) - ((60 * 60 * 24) * 60);
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
    return Promise.all(hnResponses.flat().map((story) => __awaiter(void 0, void 0, void 0, function* () { return ({ title: story.title, url: story.url, created_at: story.created_at, image: yield (0, exports.urlToImage)(story.url) }); })));
});
exports.scrapeLatestHnStories = scrapeLatestHnStories;
const scrapeLatestDevToStories = () => __awaiter(void 0, void 0, void 0, function* () {
    let devToStories;
    try {
        let devToResponse = yield axios_1.default.get("https://dev.to/api/articles?tag=devrel&top=15");
        devToStories = devToResponse.data;
        console.log(devToResponse.data);
    }
    catch (e) {
        console.log(e);
        console.log("dev.to fetch failed");
        return [];
    }
    return Promise.all(devToStories.map((story) => __awaiter(void 0, void 0, void 0, function* () { return ({ title: story.title, url: story.url, created_at: story.created_at, image: "https://res.cloudinary.com/practicaldev/image/fetch/s--E8ak4Hr1--/c_limit,f_auto,fl_progressive,q_auto,w_32/https://dev-to.s3.us-east-2.amazonaws.com/favicon.ico" }); })));
});
exports.scrapeLatestDevToStories = scrapeLatestDevToStories;
const scrapeLatestDevrelxStories = () => __awaiter(void 0, void 0, void 0, function* () {
    let devrelxResponse = yield axios_1.default.get("https://www.devrelx.com/blog-feed.xml");
    const parser = new fast_xml_parser_1.XMLParser();
    let devrelxStories = parser.parse(devrelxResponse.data).rss.channel.item.slice(0, 10);
    return Promise.all(devrelxStories.map((story) => __awaiter(void 0, void 0, void 0, function* () { return ({ title: story.title, url: story.link, created_at: story.pubDate, image: yield (0, exports.urlToImage)(story.link) }); })));
});
exports.scrapeLatestDevrelxStories = scrapeLatestDevrelxStories;
const scrapeLatestGoogleNewsStories = () => __awaiter(void 0, void 0, void 0, function* () {
    const searchTerms = ['developer relations', 'developer conference', 'developer advocate'];
    let googleNewsResponses = [];
    try {
        for (const searchTerm of searchTerms) {
            const url = `https://news.google.com/rss/search?q="${searchTerm}"+when:300h&ceid=US:en&hl=en-US&gl=US`;
            let googleNewsResponse = yield axios_1.default.get(url);
            const parser = new fast_xml_parser_1.XMLParser();
            console.log(parser.parse(googleNewsResponse.data).rss.channel.item);
            let googleNewsStories = parser.parse(googleNewsResponse.data).rss.channel.item.slice(0, 20);
            googleNewsResponses.push(googleNewsStories);
        }
    }
    catch (e) {
    }
    return Promise.all(googleNewsResponses.flat().map((story) => __awaiter(void 0, void 0, void 0, function* () { return ({ title: story.title.split(' - ')[0], url: story.link, created_at: story.pubDate, image: yield (0, exports.urlToImage)(story.link) }); })));
});
exports.scrapeLatestGoogleNewsStories = scrapeLatestGoogleNewsStories;
const scrapeLatestWeeklyEventStories = () => __awaiter(void 0, void 0, void 0, function* () {
    let weeklyEventResponse = yield axios_1.default.get("https://bg.raindrop.io/rss/public/10525978");
    const parser = new fast_xml_parser_1.XMLParser();
    console.log(weeklyEventResponse.data);
    let weeklyEventStories = parser.parse(weeklyEventResponse.data).rss.channel.item.slice(0, 10);
    return Promise.all(weeklyEventStories.map((story) => __awaiter(void 0, void 0, void 0, function* () { return ({ title: story.title, url: story.link, created_at: story.pubDate, image: yield (0, exports.urlToImage)(story.link) }); })));
});
exports.scrapeLatestWeeklyEventStories = scrapeLatestWeeklyEventStories;
const scrapeLatestDxTipsStories = () => __awaiter(void 0, void 0, void 0, function* () {
    let dxTipsResponse = yield axios_1.default.get("https://dx.tips/rss.xml");
    const parser = new fast_xml_parser_1.XMLParser();
    console.log(dxTipsResponse.data);
    let dxTipsStories = parser.parse(dxTipsResponse.data).rss.channel.item.slice(0, 10);
    return Promise.all(dxTipsStories.map((story) => __awaiter(void 0, void 0, void 0, function* () { return ({ title: story.title, url: story.link, created_at: story.pubDate, image: yield (0, exports.urlToImage)(story.link) }); })));
});
exports.scrapeLatestDxTipsStories = scrapeLatestDxTipsStories;
const sortStoriesByDate = (stories) => {
    return stories.sort(function (a, b) {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
};
exports.sortStoriesByDate = sortStoriesByDate;
const removeDuplicateStories = (stories) => {
    return Object.values(stories.reduce((acc, cur) => Object.assign(acc, { [cur.url]: cur }), {}));
};
exports.removeDuplicateStories = removeDuplicateStories;
const urlToImage = (url) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("convert url to image", url);
    let domain = (new URL(url));
    const host = `${domain.protocol}${domain.host}`;
    return `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${host}&size=30`;
});
exports.urlToImage = urlToImage;
