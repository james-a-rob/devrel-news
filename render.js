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
const fs_1 = __importDefault(require("fs"));
const moment_1 = __importDefault(require("moment"));
const app_1 = require("./app");
const machinelearning_1 = require("./machinelearning");
const head = () => {
    return `
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>DevRel News - The latest developer relations articles and resources</title>
    <meta name="description" content="Covering topics like developer experience, open source, conferences & community.">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" integrity="sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w==" crossorigin="anonymous" referrerpolicy="no-referrer" />

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,100;0,200;0,300;0,400;0,500;0,700;0,800;1,200;1,400&display=swap" rel="stylesheet">

    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-VRQSB2HB35"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
    
      gtag('config', 'G-VRQSB2HB35');
    </script>
</head>`;
};
const siteInfo = () => {
    return `
    <div>
        <div class="header">
            <h1 class="header-name">DevRel News</h1>
            <span><a target="_blank" href="https://www.twitter.com/james_a_rob"><i class="fab fa-twitter twitter"></i></a></span>
        </div>
        <div class="info-container">
        <h2>The latest developer relations news in one place</h2>
        <h3>Covering topics like developer experience, open source, conferences & community. </h3>
        </div>
    </div>
    `;
};
const css = () => {
    return `
    <style>
        body {
            background: #f2f2f2;
            font-family: 'Source Sans Pro', sans-serif;
            color: #282828;
            margin:0px;
        }

        a:link {
            text-decoration: none;
            color: #414141;
          }
          
        a:visited {
            text-decoration: none;
            color:#666666;
        }

        .fab.twitter{
            color:#1d9bf0;
        }

        h1 {
            font-family: 'Kanit', sans-serif;
            color: #cf23bd;
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

        .header{
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 8px 12px 8px;
            background: white;
        }

        .header-name{
            margin:2px;
        }

        .info-container{
            padding:0px 10px;
            color:#414141;
        }

        .stories-container {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            padding: 0px 10px;
        }

        .story {
            margin: 4px;
            background: white;
            border: 1px solid #eeeeee;
            height: 120px;
            padding: 20px;
            border-radius: 4px;
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

        .hero-stories-container {
            display: grid;
            grid-template-columns: 3fr 4fr;
            padding: 0px 10px 10px 10px;
        }
    
        .hero-story-header {
            font-size: 26px;
            font-weight: 800;
            padding: 20px;
        }

        .hero-story-header-large {
            font-size: 32px;
        }
    
        .hero-story {
            border-radius: 4px;
            margin: 4px;
            background: white;
    
        }
    
        .hero-story-image {
            width: 100%;
    
        }

        .hero-story-footer{
            display:flex;
            padding: 0 20 20 20;
            align-items:center;
        }

        .hero-story-authot-image{
            border-radius:50%;
            width:30px;
            margin-right:4px;
        }

        .section-header{
            font-family: 'Kanit', sans-serif;
            font-weight: 400;
            color: #aeaeae;
            padding: 0 12 0 12;
        }

        @media (max-width: 1400px) {

            .stories-container {
                grid-template-columns: repeat(3, 1fr);

            }
        }

        @media (max-width: 1000px) {


            .hero-story-header-large {
                font-size: 30px;
            }
        }


        @media (max-width: 740px) {

            .stories-container {
                grid-template-columns: repeat(2, 1fr);

            }

            .hero-stories-container {
                grid-template-columns: repeat(1, 1fr);

            }
        }


        @media (max-width: 600px) {


            .stories-container {
                grid-template-columns: repeat(1, 1fr);

            }

            .hero-stories-container {
                grid-template-columns: repeat(1, 1fr);

            }
            
        }


        @media (max-width: 480px) {

            .stories-container {
                grid-template-columns: repeat(1, 1fr);

            }

            .hero-stories-container {
                grid-template-columns: repeat(1, 1fr);

            }

            .hero-story-header {
                font-size: 24px;
            }

            .hero-story-header-large {
                font-size: 24px;
            }
        }

        @media (max-width: 320px) {

            .stories-container {
                grid-template-columns: repeat(1, 1fr);

            }

            .hero-stories-container {
                grid-template-columns: repeat(1, 1fr);

            }
        }
    </style>
    `;
};
const story = (storyData) => {
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
    <div class="story-date">${(0, moment_1.default)(storyData.created_at).fromNow()}</div>

</div>`;
};
const heroStories = () => {
    return `
    <div class="hero-stories-container">
    <div class="hero-story">
    <div class="hero-story-body">
            <img class="hero-story-image" src="https://miro.medium.com/max/1400/1*1csShiGD38bq3qfRjhx99Q.jpeg">
            <div class="hero-story-header hero-story-header-large">
                <a target="_blank"
                    href="https://medium.com/together-institute/whats-the-role-of-my-own-motivations-opinions-as-community-leader-622f78fd2a17">Community
                    leadership: how can I uplift the voices of members while still
                    expressing my own vision?</a>
            </div>
        </div>
        <div class="hero-story-footer">
            <div class="hero-story-author">
                <img class="hero-story-authot-image" src="https://miro.medium.com/fit/c/96/96/0*-JX3HagHYWFY-LiS.jpeg" />
            </div>

            <div class="hero-story-author">Fabian Pfortmüller</div>
        </div>
    </div>
    <div class="hero-story">
        <div class="hero-story-body">
            <img class="hero-story-image" src="https://carlyrichmondcom.files.wordpress.com/2022/05/pexels-photo-2833037.jpeg">
            <div class="hero-story-header hero-story-header-large">
                <a target="_blank"
                    href="https://carlyrichmond.com/2022/05/17/speak-your-mind/?utm_campaign=DevRel%2BWeekly&utm_medium=web&utm_source=DevRel_Weekly_190">Community
                    leadership: how can I uplift the voices of members while still
                    expressing my own vision?</a>
            </div>
        </div>
        <div class="hero-story-footer">
            <div class="hero-story-author">
                <img class="hero-story-authot-image" src="https://pbs.twimg.com/profile_images/978877201780178944/yP_1IiYQ_400x400.jpg" />
            </div>

            <div class="hero-story-author">Carly Richmond</div>
        </div>
    </div>

</div>
    `;
};
const render = () => __awaiter(void 0, void 0, void 0, function* () {
    const latestHnStories = yield (0, app_1.scrapeLatestHnStories)();
    const latestDevToStories = yield (0, app_1.scrapeLatestDevToStories)();
    const latestDevrelxStories = yield (0, app_1.scrapeLatestDevrelxStories)();
    const latestGoogleNewsStories = yield (0, app_1.scrapeLatestGoogleNewsStories)();
    console.log(latestHnStories);
    const filteredGoogleNewsStories = (0, machinelearning_1.mlFilter)(latestGoogleNewsStories);
    const storiesData = (0, app_1.sortStoriesByDate)((0, app_1.removeDuplicateStories)([...latestHnStories, ...latestDevToStories, ...latestDevrelxStories, ...filteredGoogleNewsStories]));
    const html = `
    <html lang="en">
        ${head()}
        ${css()}
        <body>
            ${siteInfo()}
            <div class="section-header">HIGHLIGHTS</div>
            ${heroStories()}
            <div class="section-header">LATEST</div>
            <div class="stories-container">
            ${storiesData.map((storyData) => {
        return story(storyData);
    }).join('')}
        </div>
        </body>
    </html>
    `;
    fs_1.default.writeFileSync('index.html', html);
});
console.log(render());
