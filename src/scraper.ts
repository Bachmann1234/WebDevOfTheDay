import axios from 'axios';
import cheerio from 'cheerio';

interface Concept {
    name: string;
    description: string;
    link: string;
}

export const MDN_US_HOME = 'https://developer.mozilla.org';
export const HTML_INDEX_URL = `${MDN_US_HOME}/en-US/docs/Web/HTML/Element`;

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
                name: $(firstAnchor).text(),
                description: $($(elem).find('td')[1]).text(),
                // I am not sure why the types say this prop does not exist
                // It really seems to exist...
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                link: `${MDN_US_HOME}${firstAnchor.attribs.href}`,
            };
        });
}
