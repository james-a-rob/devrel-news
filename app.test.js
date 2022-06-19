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
const globals_1 = require("@jest/globals");
const nock_1 = __importDefault(require("nock"));
const app_1 = require("./app");
const nockBack = nock_1.default.back;
nockBack.fixtures = __dirname + '/nockFixtures';
nockBack.setMode('update');
globals_1.jest.setTimeout(6000000);
(0, globals_1.describe)('hn', () => {
    globals_1.test.only('scrape stories', () => __awaiter(void 0, void 0, void 0, function* () {
        globals_1.jest.spyOn(Date, "now").mockReturnValue(new Date(1587893830000).getTime());
        const { nockDone } = yield nockBack('hn-response.json');
        const latestStories = yield (0, app_1.scrapeLatestHnStories)();
        nockDone();
        console.log(latestStories);
        (0, globals_1.expect)(latestStories[0].title).toEqual("NextDNS API");
    }));
});
(0, globals_1.describe)('devrelx', () => {
    (0, globals_1.test)('scrape stories', () => __awaiter(void 0, void 0, void 0, function* () {
        const { nockDone } = yield nockBack('devrelx-response.json');
        const latestStories = yield (0, app_1.scrapeLatestDevrelxStories)();
        nockDone();
        (0, globals_1.expect)(latestStories[0].title).toEqual("State of Cloud Native Development: Who is using Kubernetes?");
    }));
});
(0, globals_1.describe)('dev.to', () => {
    (0, globals_1.test)('scrape stories', () => __awaiter(void 0, void 0, void 0, function* () {
        const { nockDone } = yield nockBack('devto-response.json');
        const latestStories = yield (0, app_1.scrapeLatestDevToStories)();
        (0, globals_1.expect)(latestStories[0].title).toEqual("Getting Your Conference Talk Proposal Accepted 🎙");
        console.log(latestStories);
        nockDone();
    }));
});
(0, globals_1.describe)('weekly events', () => {
    (0, globals_1.test)('scrape stories', () => __awaiter(void 0, void 0, void 0, function* () {
        const { nockDone } = yield nockBack('weekly-events-response.json');
        const latestStories = yield (0, app_1.scrapeLatestWeeklyEventStories)();
        (0, globals_1.expect)(latestStories[0].title).toEqual(" July 12 - CZSK CMX Chapter Launch in Bratislava! | Calling on all Community Managers! ");
        console.log(latestStories);
        nockDone();
    }));
});
(0, globals_1.describe)('dx tips', () => {
    (0, globals_1.test)('scrape stories', () => __awaiter(void 0, void 0, void 0, function* () {
        const { nockDone } = yield nockBack('dx-tips-response.json');
        const latestStories = yield (0, app_1.scrapeLatestDxTipsStories)();
        (0, globals_1.expect)(latestStories[0].title).toEqual("Resource: The Best DevTools Pitches of All Time");
        console.log(latestStories);
        nockDone();
    }));
});
(0, globals_1.describe)('google news', () => {
    (0, globals_1.test)('scrape stories', () => __awaiter(void 0, void 0, void 0, function* () {
        const { nockDone } = yield nockBack('googlenews-response.json');
        const latestStories = yield (0, app_1.scrapeLatestGoogleNewsStories)();
        (0, globals_1.expect)(latestStories[0].title).toEqual("CVP for Developer Relations Jeff Sandquist leaving Microsoft again");
        console.log(latestStories);
        nockDone();
    }));
});
(0, globals_1.describe)('hn filter', () => {
    (0, globals_1.test)('has enough points', () => {
        const fakeHnStory = [{
                created_at: '2022-06-03T16:09:09.000Z',
                title: 'Show HN: Streamlit with native multipage app functionality',
                url: 'https://share.streamlit.io/streamlit/docs/main/python/api-examples-source/mpa-hello/Hello.py',
                author: 'TCR19',
                points: 3,
                num_comments: 1,
            }];
        (0, globals_1.expect)((0, app_1.hnFilter)(fakeHnStory, "github")).toEqual([]);
    });
    (0, globals_1.test)('is genuine story', () => {
        const fakeHnStory = [{
                created_at: '2022-06-03T16:09:09.000Z',
                title: 'Show HN: cool thing about developers',
                url: 'https://thing.com',
                author: 'TCR19',
                points: 5,
                num_comments: 1,
            }];
        (0, globals_1.expect)((0, app_1.hnFilter)(fakeHnStory, "github")).toEqual([]);
    });
    (0, globals_1.test)('query only in title', () => {
        const fakeHnStory = [{
                created_at: '2022-06-03T16:09:09.000Z',
                title: 'Cool devrel story about blah',
                url: 'github.com/devrelnews',
                author: 'TCR19',
                points: 5,
                num_comments: 1,
            }];
        (0, globals_1.expect)((0, app_1.hnFilter)(fakeHnStory, "github")).toEqual([]);
    });
});
(0, globals_1.describe)('helpers', () => {
    (0, globals_1.test)('sort stories by date', () => {
        const fakeHnStories = [{
                created_at: '2022-06-03T16:09:09.000Z',
                title: 'Story 1',
                url: 'github.com/devrelnews',
                image: "blah"
            }, {
                created_at: '2022-06-06T16:09:09.000Z',
                title: 'Story 2',
                url: 'github.com/devrelnews',
                image: "blah"
            }];
        (0, globals_1.expect)((0, app_1.sortStoriesByDate)(fakeHnStories)[0].title).toEqual("Story 2");
    });
    (0, globals_1.test)('remove duplicates', () => {
        const fakeHnStories = [{
                created_at: '2022-06-03T16:09:09.000Z',
                title: 'Story 1',
                url: 'github.com/devrelnews',
                image: "blah"
            }, {
                created_at: '2022-06-06T16:09:09.000Z',
                title: 'Story 2',
                url: 'github.com/devrelnews',
                image: "blah"
            }, {
                created_at: '2022-06-06T16:09:09.000Z',
                title: 'Story 3',
                url: 'github.com/devrelnews',
                image: "blah"
            }];
        (0, globals_1.expect)((0, app_1.removeDuplicateStories)(fakeHnStories).length).toEqual(1);
    });
    (0, globals_1.test)('url to image', () => __awaiter(void 0, void 0, void 0, function* () {
        const iconLink = yield (0, app_1.urlToImage)("https://google.com");
        (0, globals_1.expect)(iconLink).toEqual("https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https:google.com&size=30");
    }));
});
