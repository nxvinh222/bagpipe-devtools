const puppeteer = require("puppeteer");
const crawlSinglePage = require('./core/crawl');

async function advanceCrawlService(request) {
    console.log("Handling Text Scraping Request!");

    let crawlResult = {}
    let delayTime = request.request_interval

    let browser = await puppeteer.launch({
        headless: true,
        // devtools: true,
        defaultViewport: null,
        args: ['--start-maximized']
    })

    // list of link to go next
    let nextLinkStack
    // link of added link (checking purpose only)
    let nextLinkList = []
    let returnedNextLink
    let nextLink
    let size = request.item_limit
    if (size == null) size = 5

    await Promise.all(request.elements.map(async (element) => {
        if (element.type == "object") {
            [crawlResult[element.name], nextLinkStack] = await crawlSinglePage(
                browser,
                request.url,
                element,
                delayTime
            );

            //remove duplicate link
            nextLinkStack = [...new Set(nextLinkStack)];
            // copy
            nextLinkList = nextLinkStack.slice();

            // crawl next link one by one
            while (crawlResult[element.name].length < size) {
                console.log("crawled link list: ", nextLinkStack);
                // get next link
                nextLink = nextLinkStack.pop();
                console.log("next link: ", nextLink);
                // check if this is an invalid link
                if (!isValidHttpUrl(nextLink)) break;
                let result
                // crawl with this link
                [result, returnedNextLink] = await crawlSinglePage(
                    browser,
                    nextLink,
                    element,
                    delayTime
                );
                crawlResult[element.name] = crawlResult[element.name].concat(result)

                // push returned link into next link stack
                for (const next of returnedNextLink) {
                    if (!nextLinkList.includes(next)) {
                        nextLinkStack.push(next);
                        nextLinkList.push(next);
                    }
                }
            }

            crawlResult[element.name] = crawlResult[element.name].slice(0, size)
            console.log(crawlResult[element.name].length);
        }

    }))

    await browser.close()

    return crawlResult
}

function isValidHttpUrl(string) {
    let url;

    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
}

module.exports = advanceCrawlService;

