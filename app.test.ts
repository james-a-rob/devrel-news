import { jest, describe, expect, test } from '@jest/globals';
import nock from 'nock';

const nockBack = nock.back;
nockBack.fixtures = __dirname + '/nockFixtures';
nockBack.setMode('dryrun');

import { scrapeLatestStories, hnFilter } from './app';
jest.setTimeout(6000000);

test('scrape stories', async () => {
    jest.spyOn(Date, "now").mockReturnValue(new Date(1587893830000).getTime());


    const { nockDone } = await nockBack('hn-response.json')

    const latestStories = await scrapeLatestStories();

    nockDone()
    expect(latestStories[0].title).toEqual("Contentlayer: Type-Safe Content SDK");
    console.log(latestStories);
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
