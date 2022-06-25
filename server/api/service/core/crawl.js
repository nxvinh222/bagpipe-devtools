const crawlClick = require("./type/crawlClick")
const crawlImage = require("./type/crawlImage")
const crawlImageAuto = require("./type/crawlImageAuto")
const crawlLink = require("./type/crawlLink")
const crawlMap = require("./type/crawlMap")
const crawlParagraph = require("./type/crawlParagraph")
const crawlText = require("./type/crawlText")

const crawlSinglePage = async (browser, page, url, element, delayTime, root = false, limit, autoScroll = false) => {
    let result = []
    let crawlResult = {}
    let keyList = []
    let resultKey
    let resultValue
    let nextLink = []
    let childObjectResult
    let resultTmp
    let resultInLinkTmp
    let nextLinkTmp
    let returnedNextLink
    // list of link to go next
    let nextLinkStack;
    // link of added link (checking purpose only)
    let nextLinkList = [];

    // Check if this is root
    if (root == false) limit = 100000000;

    // Create new page
    // let page = await browser.newPage()
    // await page.setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36");
    // await page.setDefaultNavigationTimeout(0);

    // console.log("e: ", element);
    console.log("[INFO] waiting: ", url);
    await delay(delayTime);
    console.log("[INFO] crawling: ", url);
    await page.goto(url, {
        waitUtil: "networkkidle0",
        timeout: 0
    })

    // Scroll to bottom
    if (autoScroll == true) {
        let lastHeight = await page.evaluate('document.body.scrollHeight');
        while (true) {
            await page.evaluate('window.scrollBy(0, document.body.scrollHeight*0.8)');
            await page.waitForTimeout(1000);
            await page.evaluate('window.scrollBy(0, document.body.scrollHeight)');
            console.log("[INFO] Scrolled down! Waiting page load");
            await page.waitForTimeout(5000); // sleep a bit
            let newHeight = await page.evaluate('document.body.scrollHeight');
            if (newHeight === lastHeight) {
                break;
            }
            lastHeight = newHeight;
        }
    } else {
        await page.evaluate('window.scrollBy(0, document.body.scrollHeight*0.25)');
        await page.evaluate('window.scrollBy(0, document.body.scrollHeight*0.5)');
        await page.evaluate('window.scrollBy(0, document.body.scrollHeight*0.75)');
        await page.evaluate('window.scrollBy(0, document.body.scrollHeight)');
    }
    // Crawl
    await Promise.all(element.child_elements.map(async (childElement) => {
        try {
            // Wait for hard coded page load
            if (childElement.type != "object") {
                await page.waitForSelector(childElement.selector, timeout = 1e5)
            }
            // Crawl
            resultKey = childElement.name
            switch (childElement.type) {
                case "object":
                    keyList.push(childElement.name)
                    let newPage = await browser.newPage()
                    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');
                    resultTmp = await crawlSinglePage(browser, newPage, url, childElement, delayTime)
                    childObjectResult = resultTmp[0]
                    nextLinkStack = resultTmp[1]
                    //-------------
                    // remove duplicate link
                    nextLinkStack = [...new Set(nextLinkStack)];
                    // copy
                    nextLinkList = nextLinkStack.slice();

                    while (true) {
                        // console.log("link stack", nextLinkStack);
                        // get next link
                        nextLinkTmp = nextLinkStack.pop();
                        // check if this is an invalid link
                        if (!isValidHttpUrl(nextLinkTmp)) break;
                        [resultInLinkTmp, returnedNextLink] = await crawlSinglePage(
                            browser,
                            newPage,
                            nextLinkTmp,
                            element,
                            delayTime
                        );

                        // concat value
                        childObjectResult = childObjectResult.concat(resultInLinkTmp[0][childElement.name]);

                        // push returned link into next link stack
                        for (const next of returnedNextLink) {
                            if (!nextLinkList.includes(next)) {
                                nextLinkStack.push(next);
                                nextLinkList.push(next);
                            }
                        }
                    }
                    //------------

                    resultKey = childElement.name
                    resultValue = childObjectResult
                    await newPage.close()

                    break;
                case "text":
                    debugger;
                    keyList.push(childElement.name)
                    var crawledChildElementsContent = await page.evaluate(crawlText, childElement)
                    resultKey = childElement.name
                    resultValue = crawledChildElementsContent[childElement.name].slice(0, limit)
                    break;
                case "image":
                    keyList.push(childElement.name)
                    var crawledChildElementsContent = await page.evaluate(crawlImage, childElement)
                    resultKey = childElement.name
                    resultValue = crawledChildElementsContent[childElement.name].slice(0, limit)
                    break;
                case "image-auto":
                    keyList.push(childElement.name)
                    var crawledChildElementsContent = await page.evaluate(crawlImageAuto, childElement)
                    resultKey = childElement.name
                    resultValue = crawledChildElementsContent[childElement.name]
                    break;
                case "paragraph":
                    keyList.push(childElement.name)
                    var crawledChildElementsContent = await page.evaluate(crawlParagraph, childElement)
                    resultKey = childElement.name
                    resultValue = crawledChildElementsContent[childElement.name]
                    break;
                case "click":
                    nextLink = await page.evaluate(crawlClick, childElement)
                    // Check if there is any link
                    if (nextLink[0] != '') {
                        return;
                    }
                    // Open new page to get next link
                    let pageTmp = await browser.newPage();
                    await pageTmp.setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36");
                    await pageTmp.goto(url, { waitUtil: "networkkidle0", timeout: 0 })
                    await pageTmp.waitForSelector(childElement.selector, timeout = 1e5)
                    const button = await pageTmp.$(childElement.selector);
                    try {
                        if (button) {
                            // await page.waitForNavigation();
                            // await button.click();
                            await Promise.all([
                                pageTmp.waitForNavigation(),
                                button.click()
                            ]);
                            // await page.waitFor(2000);
                            nextLink = [pageTmp.url()]
                        }
                    } catch (error) {
                        console.log("[ERROR] Cannot click this element", error);
                    }
                    await pageTmp.close()
                    return;
                case "link-href":
                    keyList.push(childElement.name)
                    var crawledChildElementsContent = await page.evaluate(crawlLink, childElement)
                    resultKey = childElement.name
                    resultValue = crawledChildElementsContent[childElement.name]
                    break;
                case "link":
                    keyList.push(childElement.name)
                    // Get all href link from selector
                    var crawledChildElementsContent = await page.evaluate(crawlLink, childElement)
                    crawledChildElementsContent[childElement.name] = crawledChildElementsContent[childElement.name].slice(0, limit)
                    // For all href link, evaluate child elements
                    // Treat this the same as an object type
                    let crawledGotoResult = []
                    await Promise.all(crawledChildElementsContent[childElement.name].map(async (crawledElement, index) => {
                        let newPage = await browser.newPage()
                        await newPage.setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36");
                        resultTmp = await crawlSinglePage(browser, newPage, crawledElement, childElement, delayTime * index)
                        childObjectResult = resultTmp[0]
                        // Must use element because crawl function will return in correct order
                        crawledGotoResult[index] = childObjectResult
                        await newPage.close()
                    }))
                    resultKey = childElement.name
                    resultValue = crawledGotoResult
                    // crawlResult[childElement.name] = crawledGotoResult
                    // return
                    break;
                case "map":
                    keyList.push(childElement.name)
                    const mapSelectorType1 = `a[href ^= 'https://maps.google.com/maps?ll']`;
                    const mapSelectorType2 = `iframe[src ^= 'https://www.google.com/maps/embed']`;
                    let mapSelector = mapSelectorType1;
                    // Open new page to get map
                    let pageMapTmp = await browser.newPage();
                    await pageMapTmp.setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36");
                    await pageMapTmp.goto(url, { waitUtil: "networkkidle0", timeout: 0 })
                    // await pageMapTmp.setDefaultTimeout(60000);
                    await pageMapTmp.waitForSelector(childElement.selector)
                    const map = await pageMapTmp.$(childElement.selector);
                    try {
                        if (map) {
                            await pageMapTmp.bringToFront();
                            await pageMapTmp.hover(childElement.selector)
                            await pageMapTmp.click(childElement.selector);
                            await page.waitForTimeout(3000);
                            await pageMapTmp.hover(childElement.selector)
                            await pageMapTmp.click(childElement.selector);
                            try {
                                await pageMapTmp.waitForSelector(mapSelector);
                            } catch (error) {
                                console.log("[WARNING] Google map do not display, checking embeded map...");
                                mapSelector = mapSelectorType2;
                                await pageMapTmp.waitForSelector(mapSelector);
                            }
                            // Crawl map data
                            var crawledChildElementsContent = await pageMapTmp.evaluate(crawlMap, childElement, mapSelector)
                            resultKey = childElement.name
                            resultValue = crawledChildElementsContent[childElement.name]
                        }
                    } catch (error) {
                        console.log("[ERROR] Cannot access map", error);
                    }
                    await pageMapTmp.close()
                    break;
                default:
                    return;
            }

            if (resultValue.length == 1) {
                resultValue = resultValue[0]
            }
            crawlResult[resultKey] = resultValue
        } catch (error) {
            console.log(`[WARNING] cannot extract information from: ${url}\n ---> `, error.message);
            keyList.push(childElement.name);
            crawlResult[childElement.name] = "";
        }
    }))
    // await page.close()

    let i;
    for (i = 0; i <= keyList.length; i++) {
        if (i == keyList.length) break;
        if (Array.isArray(crawlResult[keyList[i]]) && crawlResult[keyList[i]].length > 1)
            break;
    }

    // if (element.type == "object") console.log("crawl result: ", crawlResult);
    // If crawled element is single element
    if (i == keyList.length || element.type != "object") {
        obj = {}
        // Combine all crawled result which is an single variable into an object
        keyList.forEach((value) => {
            if (crawlResult[value] == null ||
                (Array.isArray(crawlResult[value]) && crawlResult[value].length == 0)) {
                obj[value] = "nil"
            } else {
                if (Array.isArray(crawlResult[value]) && crawlResult[value].length == 1)
                    obj[value] = crawlResult[value][0]
                else
                    obj[value] = crawlResult[value]
            }
        })
        // And return it as result
        result.push(obj)
        return [result, nextLink]
    }

    // If crawled element is a list of element
    crawlResult[keyList[i]].forEach((v, i) => {
        obj = {}
        // For each element of crawl result of each selector which is an array
        // Take 1 in each of them and form an object
        keyList.forEach((value) => {
            if (crawlResult[value][i] == null ||
                (Array.isArray(crawlResult[value][i]) && crawlResult[value][i].length == 0)) {
                obj[value] = "nil"
            } else {
                if (Array.isArray(crawlResult[value][i]) && crawlResult[value][i].length == 1)
                    obj[value] = crawlResult[value][i][0]
                else
                    obj[value] = crawlResult[value][i]
            }
        })
        // Push it into result
        result.push(obj)
    })


    // if (element.type == "object")
    // console.log(crawlResult);
    // console.log("done handling: ", element.name);
    return [result, nextLink]
}

function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time);
    });
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


module.exports = crawlSinglePage;
