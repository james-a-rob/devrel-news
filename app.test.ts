import { jest, describe, expect, test } from '@jest/globals';
import nock from 'nock';
import { scrapeLatestHnStories, scrapeLatestDevToStories, scrapeLatestGoogleNewsStories, scrapeLatestDevrelxStories, hnFilter, sortStoriesByDate, removeDuplicateStories, urlToImage } from './app';


const nockBack = nock.back;
nockBack.fixtures = __dirname + '/nockFixtures';
nockBack.setMode('wild');

jest.setTimeout(6000000);

describe('hn', () => {
    test('scrape stories', async () => {
        jest.spyOn(Date, "now").mockReturnValue(new Date(1587893830000).getTime());
        const { nockDone } = await nockBack('hn-response.json')
        const latestStories = await scrapeLatestHnStories();
        nockDone();
        console.log(latestStories);
        expect(latestStories[0].title).toEqual("Generating a GraphQL API from schema using SQLite");
    });
});

describe('devrelx', () => {
    test('scrape stories', async () => {
        const { nockDone } = await nockBack('devrelx-response.json')
        const latestStories = await scrapeLatestDevrelxStories();
        nockDone();
        expect(latestStories[0].title).toEqual("State of Cloud Native Development: Who is using Kubernetes?");
    });
});

describe('dev.to', () => {
    test.only('scrape stories', async () => {
        const { nockDone } = await nockBack('devto-response.json')

        const latestStories = await scrapeLatestDevToStories();
        expect(latestStories[0].title).toEqual("Getting Your Conference Talk Proposal Accepted 🎙");

        console.log(latestStories);
        nockDone();


    });

});

describe('google news', () => {
    test('scrape stories', async () => {
        const { nockDone } = await nockBack('googlenews-response.json')

        const latestStories = await scrapeLatestGoogleNewsStories();
        expect(latestStories[0].title).toEqual("CVP for Developer Relations Jeff Sandquist leaving Microsoft again");

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
            image: "blah"
        }, {
            created_at: '2022-06-06T16:09:09.000Z',
            title: 'Story 2',
            url: 'github.com/devrelnews',
            image: "blah"
        }];
        expect(sortStoriesByDate(fakeHnStories)[0].title).toEqual("Story 2");
    });

    test('remove duplicates', () => {
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
        expect(removeDuplicateStories(fakeHnStories).length).toEqual(1);
    });

    test('url to image', async () => {
        const iconLink = await urlToImage("https://google.com");
        expect(iconLink).toEqual("https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https:google.com&size=30");
    });
});
