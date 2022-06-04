import axios from 'axios';
interface Story {
    title: string
    url: string
}

interface HNStory {
    title: string
    url: string
    points: number,
    created_at: string
}

const yesterday = (Date.now() / 1000) - (60 * 60 * 24);
console.log(yesterday);
export const hnFilter = (stories: HNStory[]): HNStory[] => {
    // no show or tell
    // ignore query mentions in link
    // greater than 3 points
    return stories.filter((story) => {
        if (story.points > 5) {
            return true;
        } else {
            return false;
        }
    });
}
export const scrapeLatestStories = async (): Promise<Story[]> => {
    let hnResponses: HNStory[][] = [];
    const searchTerms = ["api", "open source"];
    try {
        for (const searchTerm of searchTerms) {
            const hnResponse = await axios.get(`https://hn.algolia.com/api/v1/search_by_date?query="${searchTerm}"&numericFilters=created_at_i>${yesterday}&tags=story`);
            // console.log(hnResponse.data.hits);
            const validStories = hnFilter(hnResponse.data.hits);
            console.log(validStories);
            hnResponses.push(validStories);

        }
    } catch (e) {
        console.log(e);
        console.log("fetch failed");
        return [];
    }
    return hnResponses.flat().map((story: HNStory) => ({ title: story.title, url: story.url, created_at: story.created_at }))
}