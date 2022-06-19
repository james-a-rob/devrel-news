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
classifier.addDocument(`7 Marketing Strategies for Your Software Development Content`, 'devrel');
classifier.addDocument(`Tailoring tech content for different audiences`, 'devrel');
classifier.addDocument(`The Documentation System`, 'devrel');
classifier.addDocument(`Building DevRel Strategy with Sean Falconer`, 'devrel');
classifier.addDocument(`Hot off the Press: Developer personalities, Low-code and No-code tools, Languages and more`, 'devrel');
classifier.addDocument(`Part 2. Content for Developers: What and How, Languages and more`, 'devrel');
classifier.addDocument(`Building a Developer Program Strategy`, 'devrel');
classifier.addDocument(`DevRel is a cost center, yet essential with Michael Heap`, 'devrel');
classifier.addDocument(`Grafana releases OnCall open source project`, 'devrel');
classifier.addDocument(`How can the United States build its Open Source Software policy?`, 'devrel');
classifier.addDocument(`One single API to build CRM, Accounting, HRIS, and ATS Integrations`, 'devrel');
classifier.addDocument(`A Git Origin Story (2018)`, 'devrel');
classifier.addDocument('How Google, Sequoia are supporting growth plans of women-led startups', 'regular');
classifier.addDocument(`Apple's new 13-inch MacBook Pro with M2 chip goes on sale Friday`, 'regular');
classifier.addDocument(`88% drop in Google searches for 'buying NFTs' as crypto market crashes`, 'regular');
classifier.addDocument(`CDEvents Aims To Standardize CI/CD Interoperability`, 'regular');
classifier.addDocument(`What to do if the Mac you need is delayed?`, 'regular');
classifier.addDocument(`Apple sued over alleged patent infringement for Auto Unlock with Apple Watch feature`, 'regular');
classifier.addDocument(`iOS 16 developer beta — how to download right now`, 'regular');
classifier.addDocument(`Jemiah Sius Articles and Insights`, 'regular');
classifier.addDocument(`PagerDuty automates 'tech hygiene tasks' to raise the CX bar`, 'regular');
classifier.addDocument(`Makers of ad blockers and browser privacy extensions fear the end is near`, 'regular');
classifier.addDocument(`Tesla files for a three-way stock split to make its shares more affordable`, 'regular');
classifier.addDocument(`Microsoft Teams may liven up meetings with casual game integration`, 'regular');
classifier.addDocument(`The man behind Larry Ellison’s health care gamble`, 'regular');
classifier.addDocument(`Amazon Elastic MapReduce Now Generally Available as a Serverless Offering`, 'regular');
classifier.addDocument(`TECH BYTE: IOS 16`, 'regular');
classifier.addDocument(`Boeing, UPS and Amazon AI on New AI Technologies`, 'regular');
classifier.addDocument(`BioWare QA team unanimously votes to form a union`, 'regular');
classifier.addDocument(`Google Weather is showing tablets some long-overdue love`, 'regular');
classifier.addDocument(`LG Targets Apple for XR Display Partnership`, 'regular');
classifier.addDocument(`Google Weather is showing tablets some long-overdue love`, 'regular');
classifier.addDocument(`Is Apple’s Passkeys the beginning of the end for passwords?`, 'regular');
classifier.addDocument(`Qualcomm wins EU court battle against $1b antitrust fine`, 'regular');
classifier.train();
console.log(classifier.getClassifications(`we would like to propose our offer`)); // spam
console.log(classifier.classify('we would like to propose our offer')); // spam
const mlFilter = (stories) => {
    return stories.filter((story) => {
        const classifications = classifier.getClassifications(story.title);
        const valDifference = (classifications[0].value - classifications[1].value);
        const articleOfInterest = valDifference > 0.000004;
        console.log("- - ", story.title);
        console.log(articleOfInterest);
        console.log(classifier.classify(story.title));
        if (articleOfInterest && classifier.classify(story.title) === 'devrel') {
            return true;
        }
        else {
            return false;
        }
    });
};
exports.mlFilter = mlFilter;
// console.log(mlFilter([{ title: `HopingClub will hold a global developer conference in Europe` }, { title: `Google announces startup accelerator programme for women-led startups` }, { title: `Apache Cassandra 4.1: Building the Database Your Kids Will Use` }, { title: `What to do if the Mac you need is delayed?` }]));
