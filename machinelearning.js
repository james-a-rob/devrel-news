"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mlFilter = void 0;
const { BayesClassifier } = require('natural');
const classifier = new BayesClassifier();
classifier.addDocument('Best Practices for Inclusive CLIs', 'devrel');
classifier.addDocument('Key Highlights from Tech Developer Conferences', 'devrel');
classifier.addDocument('How to Improve Developer Experience: 7 Things to Change', 'devrel');
classifier.addDocument('Meet the drag queen making coding glamorous and fun', 'devrel');
classifier.addDocument('Adobe releases open source toolkit to counter visual misinformation', 'devrel');
classifier.addDocument('We Will Never Have Enough Software Developers (2020)', 'devrel');
classifier.addDocument(`I'm Switching Form VS Code to vs Codium`, 'devrel');
classifier.addDocument(`Grafana releases OnCall open source project`, 'devrel');
classifier.addDocument('How Google, Sequoia are supporting growth plans of women-led startups', 'regular');
classifier.addDocument(`Apple's new 13-inch MacBook Pro with M2 chip goes on sale Friday`, 'regular');
classifier.addDocument(`88% drop in Google searches for 'buying NFTs' as crypto market crashes`, 'regular');
classifier.addDocument(`Jemiah Sius Articles and Insights`, 'regular');
classifier.addDocument(`CDEvents Aims To Standardize CI/CD Interoperability`, 'regular');
classifier.addDocument(`What to do if the Mac you need is delayed?`, 'regular');
classifier.addDocument(`Apple sued over alleged patent infringement for Auto Unlock with Apple Watch feature`, 'regular');
classifier.addDocument(`iOS 16 developer beta — how to download right now`, 'regular');
classifier.train();
console.log(classifier.getClassifications(`we would like to propose our offer`)); // spam
console.log(classifier.classify('we would like to propose our offer')); // spam
const mlFilter = (stories) => {
    return stories.filter((story) => {
        const classifications = classifier.getClassifications(story.title);
        const valDifference = (classifications[0].value - classifications[1].value);
        console.log(valDifference);
        const articleOfInterest = valDifference > 0.01;
        if (articleOfInterest) {
            return true;
        }
        else {
            return false;
        }
    });
};
exports.mlFilter = mlFilter;
// console.log(mlFilter([{ title: `HopingClub will hold a global developer conference in Europe` }, { title: `Google announces startup accelerator programme for women-led startups` }, { title: `Apache Cassandra 4.1: Building the Database Your Kids Will Use` }, { title: `What to do if the Mac you need is delayed?` }]));
