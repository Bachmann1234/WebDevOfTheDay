import axios from 'axios';
import cheerio from 'cheerio';

export interface Concept {
    name: string;
    description: string;
    link: string;
}

export const MDN_US_HOME = 'https://developer.mozilla.org';
export const HTML_INDEX_URL = `${MDN_US_HOME}/en-US/docs/Web/HTML/Element`;
export const CSS_INDEX_URL = `${MDN_US_HOME}/en-US/docs/Web/CSS/Reference`;

export async function getHtmlElements(): Promise<Array<Concept>> {
    const response = await axios.get(HTML_INDEX_URL);
    if (response.status !== 200) {
        throw new Error('Failed to load index page');
    }
    const $ = cheerio.load(response.data);
    return $('tbody tr')
        .toArray()
        .map((elem) => {
            const firstAnchor = $(elem).find('a')[0];
            return {
                name: $(firstAnchor).text().trim(),
                description: $($(elem).find('td')[1]).text().trim(),
                // I am not sure why the types say this prop does not exist
                // It really seems to exist...
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                link: `${MDN_US_HOME}${firstAnchor.attribs.href}`,
            };
        });
}

export async function getCssElements(): Promise<string[]> {
    const response = await axios.get(CSS_INDEX_URL);
    if (response.status !== 200) {
        throw new Error('Failed to load index page');
    }
    const $ = cheerio.load(response.data);
    return $('div.index a')
        .toArray()
        .map((elem) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return `${MDN_US_HOME}${elem.attribs.href}`;
        });
}

export async function elementFromUrl(url: string): Promise<Concept> {
    console.log(`Loading element from ${url}`);
    const response = await axios.get(url);
    if (response.status !== 200) {
        throw new Error('Failed to load detail page');
    }
    const $ = cheerio.load(response.data);
    return {
        name: $('article h1').text().trim(),
        description: $($('article div').toArray()[0]).text().trim().replaceAll(String.fromCharCode(160), ' '),
        link: url,
    };
}
