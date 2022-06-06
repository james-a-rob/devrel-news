import { jest, describe, expect, test } from '@jest/globals';
import nock from 'nock';
import { scrapeLatestHnStories, scrapeLatestDevToStories, hnFilter, sortStoriesByDate } from './app';


const nockBack = nock.back;
nockBack.fixtures = __dirname + '/nockFixtures';
nockBack.setMode('dryrun');

jest.setTimeout(6000000);

describe('hn', () => {
    test('scrape stories', async () => {
        jest.spyOn(Date, "now").mockReturnValue(new Date(1587893830000).getTime());
        const { nockDone } = await nockBack('hn-response.json')
        const latestStories = await scrapeLatestHnStories();
        nockDone();
        console.log(latestStories);
        expect(latestStories[0].title).toEqual("Tinygo: LLVM-based Go compiler for microcontrollers, WASM, and CLI tools");
    });
});

describe('dev.to', () => {
    test('scrape stories', async () => {
        const { nockDone } = await nockBack('devto-response.json')

        const latestStories = await scrapeLatestDevToStories();
        expect(latestStories[0].title).toEqual("Tye, starting and running multiple APIs with a single command");
        console.log(latestStories);
        nockDone();


    });

});

describe('hn filter', () => {
    test('has enough points', () => {
        const fakeHnStory = [{
            created_at: '2022-06-03T16:09:09.000Z',
            title: 'Show HN: Streamlit with native multipage app functionality',
            url: 'https://share.streamlit.io/streamlit/docs/main/python/api-examples-source/mpa-hello/Hello.py',
            author: 'TCR19',
            points: 3,
            num_comments: 1,
        }];
        expect(hnFilter(fakeHnStory, "github")).toEqual([]);
    });

    test('is genuine story', () => {
        const fakeHnStory = [{
            created_at: '2022-06-03T16:09:09.000Z',
            title: 'Show HN: cool thing about developers',
            url: 'https://thing.com',
            author: 'TCR19',
            points: 5,
            num_comments: 1,
        }];
        expect(hnFilter(fakeHnStory, "github")).toEqual([]);
    });

    test('query only in title', () => {
        const fakeHnStory = [{
            created_at: '2022-06-03T16:09:09.000Z',
            title: 'Cool devrel story about blah',
            url: 'github.com/devrelnews',
            author: 'TCR19',
            points: 5,
            num_comments: 1,
        }];
        expect(hnFilter(fakeHnStory, "github")).toEqual([]);
    });
});

describe('helpers', () => {
    test('sort stories by date', () => {
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
        expect(sortStoriesByDate(fakeHnStories)[0].title).toEqual("Story 2");
    });
});
