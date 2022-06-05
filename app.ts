import axios from 'axios';
interface Story {
    title: string
    url: string
    created_at: string

}

interface HNStory {
    title: string
    url: string | null
    points: number,
    created_at: string
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
    return stories.filter((story) => {
        return hasEnoughPoints(story) && isStory(story) && queryOnlyInTitle(story);
    });
}
export const scrapeLatestStories = async (): Promise<Story[]> => {
    const yesterday = (Date.now() / 1000) - ((60 * 60 * 24) * 20);
    console.log('yesterday', yesterday);
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
        console.log("fetch failed");
        return [];
    }
    return hnResponses.flat().map((story: HNStory) => ({ title: story.title, url: story.url!, created_at: story.created_at }))
}