import axios from 'axios';
import { XMLParser } from "fast-xml-parser";


interface Story {
    title: string
    url: string
    created_at: string
    image: string
}

interface HNStory {
    title: string
    url: string | null
    points: number,
    created_at: string
}

interface DevToStory {
    title: string
    url: string
    created_at: string
}

interface DevrelxStory {
    title: string
    link: string
    pubDate: string
}

interface GoogleNewsStory {
    title: string
    link: string
    pubDate: string
}


export const hnFilter = (stories: HNStory[], searchTerm: string): HNStory[] => {
    const hasEnoughPoints = (story: HNStory) => {
        return story.points > 4;
    }
    const isStory = (story: HNStory) => {
        return !story.title.includes('Show HN') && !story.title.includes('Tell HN') && !story.title.includes('Ask HN');

    }
    const queryOnlyInTitle = (story: HNStory) => {
        return story.title.toLowerCase().includes(searchTerm);
    }

    const hasUrl = (story: HNStory) => {
        return !!story.url;
    }
    return stories.filter((story) => {
        return hasEnoughPoints(story) && isStory(story) && queryOnlyInTitle(story) && hasUrl(story)
    });
}
export const scrapeLatestHnStories = async (): Promise<Story[]> => {
    const yesterday = (Date.now() / 1000) - ((60 * 60 * 24) * 60);
    let hnResponses: HNStory[][] = [];
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
            const hnResponse = await axios.get(`https://hn.algolia.com/api/v1/search_by_date?query="${searchTerm}"&numericFilters=created_at_i>${yesterday}&tags=story`);
            const validStories = hnFilter(hnResponse.data.hits, searchTerm);
            hnResponses.push(validStories);
            await new Promise(r => setTimeout(r, 200));
        }
    } catch (e) {
        console.log(e);
        console.log("hn fetch failed");
        return [];
    }
    return Promise.all(hnResponses.flat().map(async (story: HNStory) => ({ title: story.title, url: story.url!, created_at: story.created_at, image: await urlToImage(story.url!) })));
}

export const scrapeLatestDevToStories = async (): Promise<Story[]> => {
    let devToStories: DevToStory[];
    try {
        let devToResponse = await axios.get("https://dev.to/api/articles?tag=devrel&top=15");
        devToStories = devToResponse.data;
        console.log(devToResponse.data)
    } catch (e) {
        console.log(e);
        console.log("dev.to fetch failed");
        return [];
    }
    return Promise.all(devToStories.map(async (story: DevToStory) => ({ title: story.title, url: story.url!, created_at: story.created_at, image: "https://res.cloudinary.com/practicaldev/image/fetch/s--E8ak4Hr1--/c_limit,f_auto,fl_progressive,q_auto,w_32/https://dev-to.s3.us-east-2.amazonaws.com/favicon.ico" })));
}

export const scrapeLatestDevrelxStories = async (): Promise<Story[]> => {
    let devrelxResponse = await axios.get("https://www.devrelx.com/blog-feed.xml");
    const parser = new XMLParser();
    let devrelxStories = parser.parse(devrelxResponse.data).rss.channel.item.slice(0, 10);
    return Promise.all(devrelxStories.map(async (story: DevrelxStory) => ({ title: story.title, url: story.link!, created_at: story.pubDate, image: await urlToImage(story.link) })));
}

export const scrapeLatestGoogleNewsStories = async (): Promise<Story[]> => {
    const searchTerms = ['developer relations', 'developer conference', 'developer advocate'];
    let googleNewsResponses: GoogleNewsStory[][] = [];

    try {
        for (const searchTerm of searchTerms) {
            const url = `https://news.google.com/rss/search?q="${searchTerm}"+when:300h&ceid=US:en&hl=en-US&gl=US`;
            let googleNewsResponse = await axios.get(url);
            const parser = new XMLParser();
            console.log(parser.parse(googleNewsResponse.data).rss.channel.item);
            let googleNewsStories = parser.parse(googleNewsResponse.data).rss.channel.item.slice(0, 20);
            googleNewsResponses.push(googleNewsStories);
        }
    } catch (e) {

    }

    return Promise.all(googleNewsResponses.flat().map(async (story: GoogleNewsStory) => ({ title: story.title.split(' - ')[0], url: story.link!, created_at: story.pubDate, image: await urlToImage(story.link) })));

}

export const sortStoriesByDate = (stories: Story[]): Story[] => {
    return stories.sort(function (a: Story, b: Story) {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    });
}

export const removeDuplicateStories = (stories: Story[]): Story[] => {
    return Object.values(stories.reduce((acc, cur) => Object.assign(acc, { [cur.url]: cur }), {}))
}

export const urlToImage = async (url: string) => {
    console.log("convert url to image", url);
    let domain = (new URL(url));
    const host = `${domain.protocol}${domain.host}`;
    return `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${host}&size=30`
}