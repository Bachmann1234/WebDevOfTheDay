"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.elementFromUrl = exports.getCssElements = exports.getHtmlElements = exports.CSS_INDEX_URL = exports.HTML_INDEX_URL = exports.MDN_US_HOME = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = __importDefault(require("cheerio"));
exports.MDN_US_HOME = 'https://developer.mozilla.org';
exports.HTML_INDEX_URL = `${exports.MDN_US_HOME}/en-US/docs/Web/HTML/Element`;
exports.CSS_INDEX_URL = `${exports.MDN_US_HOME}/en-US/docs/Web/HTML/Element`;
async function getHtmlElements() {
    const response = await axios_1.default.get(exports.HTML_INDEX_URL);
    if (response.status !== 200) {
        throw new Error('Failed to load index page');
    }
    const $ = cheerio_1.default.load(response.data);
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
            link: `${exports.MDN_US_HOME}${firstAnchor.attribs.href}`,
        };
    });
}
exports.getHtmlElements = getHtmlElements;
async function getCssElements() {
    const response = await axios_1.default.get(exports.CSS_INDEX_URL);
    if (response.status !== 200) {
        throw new Error('Failed to load index page');
    }
    const $ = cheerio_1.default.load(response.data);
    return $('div.index a')
        .toArray()
        .map((elem) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return `${exports.MDN_US_HOME}${elem.attribs.href}`;
    });
}
exports.getCssElements = getCssElements;
async function elementFromUrl(url) {
    const response = await axios_1.default.get(url);
    if (response.status !== 200) {
        throw new Error('Failed to load detail page');
    }
    const $ = cheerio_1.default.load(response.data);
    return {
        name: $('article h1').text().trim(),
        description: $($('article div').toArray()[0]).text().trim().replaceAll(String.fromCharCode(160), ' '),
        link: url,
    };
}
exports.elementFromUrl = elementFromUrl;
//# sourceMappingURL=scraper.js.map