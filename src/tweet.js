"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tweetCSSConcept = exports.tweetHTMLConcept = exports.handleTwitterResponse = exports.conceptToTweet = void 0;
const twit_1 = __importDefault(require("twit"));
const scraper_1 = require("./scraper");
function conceptToTweet(concept, hashtags) {
    // all urls are shortened to 23 chars
    const urlLength = 23; // https://help.twitter.com/en/using-twitter/how-to-tweet-a-link
    const hashTagLength = hashtags.length;
    const remainingLength = 280 - urlLength - hashTagLength - concept.name.length - 5;
    if (concept.description.length <= remainingLength) {
        return `${concept.name} - ${concept.description} ${concept.link} ${hashtags}`;
    }
    else {
        return `${concept.name} - ${concept.description.substring(0, remainingLength - 3)}... ${concept.link} ${hashtags}`;
    }
}
exports.conceptToTweet = conceptToTweet;
function isSuccessfulTwitterResponse(value) {
    if (value && typeof value === 'object') {
        return 'id_str' in value && 'created_at' in value && 'text' in value;
    }
    return false;
}
function handleTwitterResponse(err, result, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
response) {
    if (err) {
        throw new Error(`Failed to Tweet -- ${err}`);
    }
    if (isSuccessfulTwitterResponse(result)) {
        console.log(`tweet id: ${result.id_str} created_at: ${result.created_at} text: ${result.text}`);
    }
    else {
        console.log('Twitter response had an unexpected type');
    }
}
exports.handleTwitterResponse = handleTwitterResponse;
async function tweetConcept(concept, hashtags) {
    if (!(process.env.TWITTER_API_KEY &&
        process.env.TWITTER_API_KEY_SECRET &&
        process.env.TWITTER_ACCESS_TOKEN &&
        process.env.TWITTER_ACCESS_TOKEN_SECRET)) {
        throw new Error('Twitter keys not defined in environment');
    }
    const twit = new twit_1.default({
        consumer_key: process.env.TWITTER_API_KEY,
        consumer_secret: process.env.TWITTER_API_KEY_SECRET,
        access_token: process.env.TWITTER_ACCESS_TOKEN,
        access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
        timeout_ms: 1000 * 60,
        strictSSL: true,
    });
    twit.post('statuses/update', { status: conceptToTweet(concept, hashtags) }, handleTwitterResponse);
}
function getDay() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.valueOf() - start.valueOf() + (start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
}
async function tweetHTMLConcept() {
    const concepts = await scraper_1.getHtmlElements();
    const todaysConcept = concepts[getDay() % concepts.length];
    await tweetConcept(todaysConcept, '#webdev #html');
}
exports.tweetHTMLConcept = tweetHTMLConcept;
async function tweetCSSConcept() {
    const cssUrls = await scraper_1.getCssElements();
    const todaysUrl = cssUrls[getDay() % cssUrls.length];
    const todaysConcept = await scraper_1.elementFromUrl(todaysUrl);
    await tweetConcept(todaysConcept, '#webdev #css');
}
exports.tweetCSSConcept = tweetCSSConcept;
//# sourceMappingURL=tweet.js.map