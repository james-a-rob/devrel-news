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
nockBack.setMode('dryrun');
globals_1.jest.setTimeout(6000000);
(0, globals_1.describe)('hn', () => {
    (0, globals_1.test)('scrape stories', () => __awaiter(void 0, void 0, void 0, function* () {
        globals_1.jest.spyOn(Date, "now").mockReturnValue(new Date(1587893830000).getTime());
        const { nockDone } = yield nockBack('hn-response.json');
        const latestStories = yield (0, app_1.scrapeLatestHnStories)();
        nockDone();
        console.log(latestStories);
        (0, globals_1.expect)(latestStories[0].title).toEqual("Tinygo: LLVM-based Go compiler for microcontrollers, WASM, and CLI tools");
    }));
});
(0, globals_1.describe)('dev.to', () => {
    (0, globals_1.test)('scrape stories', () => __awaiter(void 0, void 0, void 0, function* () {
        const { nockDone } = yield nockBack('devto-response.json');
        const latestStories = yield (0, app_1.scrapeLatestDevToStories)();
        (0, globals_1.expect)(latestStories[0].title).toEqual("Tye, starting and running multiple APIs with a single command");
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
                author: 'TCR19',
                points: 5,
                num_comments: 1,
            }, {
                created_at: '2022-06-06T16:09:09.000Z',
                title: 'Story 2',
                url: 'github.com/devrelnews',
                author: 'TCR19',
                points: 5,
                num_comments: 1,
            }];
        (0, globals_1.expect)((0, app_1.sortStoriesByDate)(fakeHnStories)[0].title).toEqual("Story 2");
    });
});
