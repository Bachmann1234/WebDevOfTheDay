import Twit, { Response } from 'twit';
import { Concept, elementFromUrl, getCssElements, getHtmlElements } from './scraper';
import { IncomingMessage } from 'http';

export function conceptToTweet(concept: Concept, hashtags: string): string {
    // all urls are shortened to 23 chars
    const urlLength = 23; // https://help.twitter.com/en/using-twitter/how-to-tweet-a-link
    const hashTagLength = hashtags.length;
    const remainingLength = 280 - urlLength - hashTagLength - concept.name.length - 5;
    if (concept.description.length <= remainingLength) {
        return `${concept.name} - ${concept.description} ${concept.link} ${hashtags}`;
    } else {
        return `${concept.name} - ${concept.description.substring(0, remainingLength - 3)}... ${
            concept.link
        } ${hashtags}`;
    }
}

type SuccessfulTwitterResponse = {
    id_str: string;
    created_at: string;
    text: string;
};

function isSuccessfulTwitterResponse(value: unknown): value is SuccessfulTwitterResponse {
    if (value && typeof value === 'object') {
        return 'id_str' in value && 'created_at' in value && 'text' in value;
    }
    return false;
}

function handleTwitterResponse(
    err: Error | null,
    result: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    response: IncomingMessage,
): void {
    if (err) {
        throw new Error(`Failed to Tweet -- ${err}`);
    }
    if (isSuccessfulTwitterResponse(result)) {
        console.log(`tweet id: ${result.id_str} created_at: ${result.created_at} text: ${result.text}`);
    } else {
        console.log('Twitter response had an unexpected type');
    }
}

async function tweetConcept(concept: Concept, hashtags: string): Promise<void> {
    const tweet = conceptToTweet(concept, hashtags);
    console.log(`Tweeting: ${tweet}`);
    if (
        !(
            process.env.TWITTER_API_KEY &&
            process.env.TWITTER_API_KEY_SECRET &&
            process.env.TWITTER_ACCESS_TOKEN &&
            process.env.TWITTER_ACCESS_TOKEN_SECRET
        )
    ) {
        throw new Error('Twitter keys not defined in environment');
    }
    const twit = new Twit({
        consumer_key: process.env.TWITTER_API_KEY,
        consumer_secret: process.env.TWITTER_API_KEY_SECRET,
        access_token: process.env.TWITTER_ACCESS_TOKEN,
        access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
        timeout_ms: 1000 * 60,
        strictSSL: true,
    });
    twit.post('statuses/update', { status: tweet }, handleTwitterResponse);
}

function getDay(): number {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.valueOf() - start.valueOf() + (start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay) + 1;
}

async function tweetHTMLConcept(): Promise<void> {
    const concepts = await getHtmlElements();
    const todaysConcept = concepts[getDay() % concepts.length];
    await tweetConcept(todaysConcept, '#webdev #html');
}
async function tweetCSSConcept(): Promise<void> {
    const cssUrls = await getCssElements();
    const todaysUrl = cssUrls[getDay() % cssUrls.length];
    const todaysConcept = await elementFromUrl(todaysUrl);
    await tweetConcept(todaysConcept, '#webdev #css');
}

function doTweet(tweetType: string, fn: () => Promise<void>): void {
    fn()
        .then(() => console.log(`${tweetType} tweet made!`))
        .catch((error) => {
            console.log(`Failed to tweet ${tweetType} concept`);
            console.log(error);
        });
}

if (require.main === module) {
    const concept = process.argv.slice(2)[0];
    if (concept === 'html') {
        doTweet(concept, tweetHTMLConcept);
    } else if (concept === 'css') {
        doTweet(concept, tweetCSSConcept);
    } else {
        console.log(`Unknown concept ${concept}`);
    }
}
