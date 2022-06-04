import { expect, test } from '@jest/globals';
import { scrapeLatestStories, hnFilter } from './app';

test.only('scrape latest 20 articles', async () => {
    const latestStories = await scrapeLatestStories();
    console.log(latestStories);
});

test('filter hn story', () => {
    const fakeHnStory = [{
        created_at: '2022-06-03T16:09:09.000Z',
        title: 'Show HN: Streamlit with native multipage app functionality',
        url: 'https://share.streamlit.io/streamlit/docs/main/python/api-examples-source/mpa-hello/Hello.py',
        author: 'TCR19',
        points: 3,
        num_comments: 1,
    }];
    expect(hnFilter(fakeHnStory)).toEqual(null);
});