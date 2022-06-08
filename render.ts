import fs from 'fs';
import moment from 'moment';
import { scrapeLatestHnStories, scrapeLatestDevToStories, scrapeLatestDevrelxStories, sortStoriesByDate } from './app';

const head = () => {
    return `
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro&display=swap" rel="stylesheet">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" rel="stylesheet">

    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-LND799P9HM"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-LND799P9HM');
    </script>
</head>`
}

const siteInfo = () => {
    return `
    <div>
        <h1>🥑 DevRel News</h1>
        <h2>The latest developer relations news in one place</h2>
        <h3>Covering topics like developer experience, open source, conferences & community. </h3>
    </div>
    `
}

const css = () => {
    return `
    <style>
        body {
            background: #fcfcfc;
            font-family: 'Source Sans Pro', sans-serif;
            color: #282828;
        }

        h1 {
            font-family: 'Pacifico', cursive;
            color: #18b954;
            font-weight: 700;
            font-size: 20px;
        }

        h2 {
            font-weight: 700;
            font-size: 18px;

        }

        h3 {
            font-weight: 400;
            font-size: 16px;

        }

        .stories-container {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            padding: 10px;
        }

        .story {
            margin: 4px;
            background: white;
            border: 1px solid #eeeeee;
            height: 120px;
            padding: 28px;
        }

        .story-meta {
            display: flex;
            margin-bottom: 4px;
        }

        .story-image {
            width: 20px;
            margin-right: 6px;
        }

        .story-header {
            overflow-y: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            margin-bottom: 12px;
            font-weight: 700;
            font-size: 18px;
        }

        @media only screen and (max-device-width: 1500px) {

            .stories-container {
                grid-template-columns: repeat(3, 1fr);

            }
        }


        @media only screen and (max-device-width: 1100px) {

            .stories-container {
                grid-template-columns: repeat(2, 1fr);

            }
        }


        @media only screen and (max-device-width: 600px) {


            .stories-container {
                grid-template-columns: repeat(1, 1fr);

            }
        }


        @media only screen and (max-device-width: 480px) {

            .stories-container {
                grid-template-columns: repeat(1, 1fr);

            }
        }

        @media only screen and (max-device-width: 320px) {

            .stories-container {
                grid-template-columns: repeat(1, 1fr);

            }
        }
    </style>
    `
}

const story = (storyData: any) => {
    console.log(storyData);
    let domain = (new URL(storyData.url));
    return ` <div class="story">
    <div class="story-meta">
        <img onerror="this.style.display='none'" class="story-image" src="${storyData.image}">
        <div class="story-url">${domain.host}</div>
    </div>
    <div class="story-header">
        <a target="_blank" href="${storyData.url}">${storyData.title}</a>
    </div>
    <div class="story-date">${moment(storyData.created_at).fromNow()}</div>

</div>`
}

const render = async () => {
    const latestHnStories = await scrapeLatestHnStories();
    const latestDevToStories = await scrapeLatestDevToStories();
    const latestDevrelxStories = await scrapeLatestDevrelxStories();
    console.log(latestHnStories);

    const storiesData = sortStoriesByDate([...latestHnStories, ...latestDevToStories, ...latestDevrelxStories]);


    const html = `
    ${head()}
    ${css()}
    <body>
        ${siteInfo()}
        <div class="stories-container">
        ${storiesData.map((storyData) => {
        return story(storyData)
    }).join('')}
    </div>
    </body>
    `
    fs.writeFileSync('index.html', html);
}

console.log(render());