import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import loadTextFixture from './utils';
import { CSS_INDEX_URL, elementFromUrl, getCssElements, getHtmlElements, HTML_INDEX_URL } from '../src/scraper';

test('Can get html elements', async () => {
    const page = loadTextFixture('html.html');
    const expectedResult = loadTextFixture('expectedParsedHTML.json');
    const mock = new MockAdapter(axios);
    mock.onGet(HTML_INDEX_URL).reply(200, page);
    const result = await getHtmlElements();
    expect(result).toStrictEqual(JSON.parse(expectedResult));
});

test('Can get css elements', async () => {
    const page = loadTextFixture('css.html');
    const expectedResult = loadTextFixture('expectedParsedCSS.json');
    const mock = new MockAdapter(axios);
    mock.onGet(CSS_INDEX_URL).reply(200, page);
    const result = await getCssElements();
    expect(result).toStrictEqual(JSON.parse(expectedResult));
});

test('Can make element from CSS page', async () => {
    const page = loadTextFixture('detail.html');
    const mock = new MockAdapter(axios);
    const url = 'https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-variant';
    mock.onGet(url).reply(200, page);
    const result = await elementFromUrl(url);
    const expected = {
        name: 'font-variant',
        description:
            'The font-variant CSS shorthand property allows you to set all the font variants for the fonts specified in the @font-face rule.',
        link: url,
    };
    expect(result).toStrictEqual(expected);
});
