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
    // If this is not root, dont check limit
    if (root == false) limit = 100000000;

    // Infinite Click Status
    let infiniteLoopStatus = false;

    // Create new page
    // let page = await browser.newPage()
    // await page.setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36");
    // await page.setDefaultNavigationTimeout(0);

    // console.log("e: ", element);
    console.log("[INFO] Waiting: ", url);
    await delay(delayTime);
    console.log("[INFO] Crawling: ", url);
    await page.goto(url, {
        waitUtil: "networkkidle0",
        timeout: 0
    })

    // Scroll to bottom
    if (autoScroll == true) {
        await page.waitForTimeout(1000);
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
        await page.evaluate('window.scrollBy(0, document.body.scrollHeight*0.15)');
        await page.waitForTimeout(1000);
        await page.evaluate('window.scrollBy(0, document.body.scrollHeight*0.25)');
        await page.waitForTimeout(1000);
        await page.evaluate('window.scrollBy(0, document.body.scrollHeight*0.25)');
        await page.waitForTimeout(1000);
        await page.evaluate('window.scrollBy(0, document.body.scrollHeight*0.25)');
    }

    // Check if there is infinite click element
    // If it is, get the button
    let infiniteButton;
    for (let e of element.child_elements) {
        if (e.type == "click-infinity") {
            infiniteLoopStatus = true;
            try {
                // Wait for hard coded page load
                await page.waitForSelector(e.selector, timeout = 30000);
                infiniteButton = await page.$(e.selector);
            } catch (error) {
                console.log(`[WARNING] cannot get infinite data load button: ${url}\n ---> `, error.message);
                infiniteLoopStatus = false;
            }
            break;
        }
    }
    if (root)
        console.log(`[INFO] Infinite load status of element ${element.name}: `, infiniteLoopStatus);
    else {
        infiniteLoopStatus = false;
        // console.log(`[INFO] Infinite load status of element ${element.name} (not root): `, infiniteLoopStatus);
    }

    // Crawl
    loop: while (true) {
        // Click infinite button
        if (infiniteLoopStatus == true) {
            let lastHeight = await page.evaluate('document.body.scrollHeight');
            try {
                if (infiniteButton) {
                    await infiniteButton.click();
                }
            } catch (error) {
                console.log("[ERROR] Cannot load more data", error.message);
            }
            // Check if data loaded, else wait
            let waitedTimeCount = 0;
            while (true) {
                await page.waitForTimeout(1000);
                waitedTimeCount = waitedTimeCount + 1;
                let newHeight = await page.evaluate('document.body.scrollHeight');
                if (waitedTimeCount > 10) {
                    console.log("[INFO] No more data to be loaded, infinite click stopped!");
                    infiniteLoopStatus = false;
                    break;
                }
                // Break if new data loaded
                if (newHeight > lastHeight) {
                    console.log("[INFO] New data loaded by clicking infinite load button!");
                    break;
                }
            }
        }

        // Start Crawling
        await Promise.all(element.child_elements.map(async (childElement) => {
            try {
                // Wait for hard coded page load
                if (childElement.type != "object") {
                    // await page.setDefaultTimeout(60000);
                    await page.waitForSelector(childElement.selector, timeout = 60000)
                }
                // Crawl
                resultKey = childElement.name
                switch (childElement.type) {
                    case "object":
                        // Do nothing if data not load enough
                        if (infiniteLoopStatus == true) break;

                        keyList.push(childElement.name)
                        let newPage = await browser.newPage()
                        await newPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');
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
                        var crawledChildElementsContent = await page.evaluate(crawlText, childElement)
                        // Check if quantity met in infinite load crawl
                        if (
                            infiniteLoopStatus == true &&
                            Array.isArray(crawledChildElementsContent[childElement.name]) &&
                            crawledChildElementsContent[childElement.name].length < limit
                        )
                            break;
                        else
                            infiniteLoopStatus = false;

                        // Continue Register result
                        keyList.push(childElement.name)
                        resultKey = childElement.name
                        resultValue = crawledChildElementsContent[childElement.name].slice(0, limit)
                        break;
                    case "image":
                        var crawledChildElementsContent = await page.evaluate(crawlImage, childElement)
                        // Check if quantity met in infinite load crawl
                        if (
                            infiniteLoopStatus == true &&
                            Array.isArray(crawledChildElementsContent[childElement.name]) &&
                            crawledChildElementsContent[childElement.name].length < limit
                        )
                            break;
                        else
                            infiniteLoopStatus = false;

                        // Continue Register result
                        keyList.push(childElement.name)
                        resultKey = childElement.name
                        resultValue = crawledChildElementsContent[childElement.name].slice(0, limit)
                        break;
                    case "image-auto":
                        // Do nothing if data not load enough
                        if (infiniteLoopStatus == true) break;

                        keyList.push(childElement.name)
                        var crawledChildElementsContent = await page.evaluate(crawlImageAuto, childElement)
                        resultKey = childElement.name
                        resultValue = crawledChildElementsContent[childElement.name]
                        break;
                    case "paragraph":
                        // Do nothing if data not load enough
                        if (infiniteLoopStatus == true) break;

                        keyList.push(childElement.name)
                        var crawledChildElementsContent = await page.evaluate(crawlParagraph, childElement)
                        resultKey = childElement.name
                        resultValue = crawledChildElementsContent[childElement.name]
                        break;
                    case "click":
                        // Do nothing if data not load enough
                        if (infiniteLoopStatus == true) break;

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
                        var crawledChildElementsContent = await page.evaluate(crawlLink, childElement)
                        // Check if quantity met in infinite load crawl
                        if (
                            infiniteLoopStatus == true &&
                            Array.isArray(crawledChildElementsContent[childElement.name]) &&
                            crawledChildElementsContent[childElement.name].length < limit
                        )
                            break;
                        else
                            infiniteLoopStatus = false;

                        // Continue Register result
                        keyList.push(childElement.name);
                        resultKey = childElement.name;
                        resultValue = crawledChildElementsContent[childElement.name].slice(0, limit);
                        break;
                    case "link":
                        // Get all href link from selector
                        var crawledChildElementsContent = await page.evaluate(crawlLink, childElement)
                        // Check if quantity met in infinite load crawl
                        if (
                            infiniteLoopStatus == true &&
                            Array.isArray(crawledChildElementsContent[childElement.name]) &&
                            crawledChildElementsContent[childElement.name].length < limit
                        )
                            break;
                        else
                            infiniteLoopStatus = false;

                        // Continue Register result
                        crawledChildElementsContent[childElement.name] = crawledChildElementsContent[childElement.name].slice(0, limit)
                        // For all href link, evaluate child elements
                        // Treat this the same as an object type
                        let crawledGotoResult = []
                        // Crawl page by batch
                        const chunkSize = 30;
                        for (let i = 0; i < crawledChildElementsContent[childElement.name].length; i += chunkSize) {
                            const chunk = crawledChildElementsContent[childElement.name].slice(i, i + chunkSize);
                            await Promise.all(chunk.map(async (crawledElement, index) => {
                                let newPage = await browser.newPage()
                                await newPage.setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36");
                                resultTmp = await crawlSinglePage(browser, newPage, crawledElement, childElement, delayTime * index)
                                childObjectResult = resultTmp[0]
                                // Must use element because crawl function will return in correct order
                                crawledGotoResult[index + i] = childObjectResult
                                await newPage.close()
                            }))
                        }
                        keyList.push(childElement.name);
                        resultKey = childElement.name
                        resultValue = crawledGotoResult
                        // crawlResult[childElement.name] = crawledGotoResult
                        // return
                        break;
                    case "map":
                        // Do nothing if data not load enough
                        if (infiniteLoopStatus == true) break;

                        keyList.push(childElement.name)
                        const mapSelectorType1 = `a[href ^= 'https://maps.google.com/maps?ll']`;
                        const mapSelectorType2 = `iframe[src ^= 'https://www.google.com/maps/embed']`;
                        let mapSelector = mapSelectorType1;
                        // Open new page to get map
                        let pageMapTmp = await browser.newPage();
                        await pageMapTmp.setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36");
                        await pageMapTmp.goto(url, { waitUtil: "networkkidle0", timeout: 0 })
                        await pageMapTmp.setDefaultTimeout(60000);
                        await pageMapTmp.waitForSelector(childElement.selector)
                        const map = await pageMapTmp.$(childElement.selector);
                        try {
                            if (map) {
                                let clickedTimes = 0;
                                let clickTimesMax = 10;
                                var mapType1;
                                var mapType2;
                                while (clickedTimes < clickTimesMax) {
                                    await pageMapTmp.bringToFront();
                                    await pageMapTmp.hover(childElement.selector);
                                    await pageMapTmp.click(childElement.selector);
                                    await pageMapTmp.waitForTimeout(1000);

                                    mapType1 = (await pageMapTmp.$(mapSelectorType1)) || "";
                                    mapType2 = (await pageMapTmp.$(mapSelectorType2)) || "";
                                    if (mapType1 != "" || mapType2 != "") break;

                                    clickedTimes++;
                                }

                                // If map dont show, wait for it to load
                                if (mapType1 == "" && mapType2 == "") {
                                    try {
                                        await pageMapTmp.waitForSelector(mapSelector);
                                    } catch (error) {
                                        console.log("[WARNING] Google map do not display, checking embeded map...");
                                        mapSelector = mapSelectorType2;
                                        await pageMapTmp.setDefaultTimeout(30000);
                                        await pageMapTmp.waitForSelector(mapSelector);
                                    }
                                } else {
                                    if (mapType2 != "")
                                        mapSelector = mapSelectorType2;
                                }
                                // Crawl map data
                                var crawledChildElementsContent = await pageMapTmp.evaluate(crawlMap, childElement, mapSelector)
                                resultKey = childElement.name
                                resultValue = crawledChildElementsContent[childElement.name]
                            }
                        } catch (error) {
                            console.log("[ERROR] Cannot access map", error.message);
                        }
                        await pageMapTmp.close()
                        break;
                    default:
                        return;
                }

                // Only register result when infinite load completed
                if (infiniteLoopStatus == false) {
                    if (resultValue.length == 1) {
                        resultValue = resultValue[0];
                    }
                    crawlResult[resultKey] = resultValue;

                    // Add lat long field for map type crawl
                    if (childElement.type == "map") {
                        let latName = childElement.name + "_lat";
                        let longName = childElement.name + "_long";
                        keyList.push(latName);
                        keyList.push(longName);
                        if (Array.isArray(resultValue) && resultValue.length == 2) {
                            crawlResult[latName] = resultValue[0];
                            crawlResult[longName] = resultValue[1];
                        }
                    }
                }
            } catch (error) {
                console.log(`[WARNING] cannot extract information of ${childElement.name} from: ${url}\n ---> `, error.message);
                keyList.push(childElement.name);
                crawlResult[childElement.name] = "";
            }
        }))

        if (infiniteLoopStatus == false)
            break loop;
    }


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
    console.log("[INFO] Crawled: ", url);
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
