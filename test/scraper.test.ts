import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import loadTextFixture from './utils';
import { getHtmlElements, HTML_INDEX_URL } from '../src/scraper';

test('Can get html elements', async () => {
    const page = loadTextFixture('html.html');
    const expectedResult = loadTextFixture('expectedParsedHTML.json');
    const mock = new MockAdapter(axios);
    mock.onGet(HTML_INDEX_URL).reply(200, page);
    const result = await getHtmlElements();
    const result2 = await getHtmlElements();
    expect(result).toStrictEqual(result2);

    expect(result).toStrictEqual(JSON.parse(expectedResult));
});
