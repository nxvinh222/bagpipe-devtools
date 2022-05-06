const puppeteer = require("puppeteer");


const crawlSinglePage = async (browser, url, element, delayTime) => {
    let result = []
    let crawlResult = {}
    let keyList = []
    let resultKey
    let resultValue
    let nextLink
    let page = await browser.newPage()

    // console.log("e: ", element);
    console.log("waiting: ", url);
    await delay(delayTime);
    console.log("crawling: ", url);
    await page.goto(url, { waitUtil: "networkkidle0", timeout: 0 })
    // await page.setRequestInterception(true)
    // page.on("request", (request) => {
    //     request.abort();
    // });
    await Promise.all(element.child_elements.map(async (childElement) => {
        // delay
        switch (childElement.type) {
            case "object":
                keyList.push(childElement.name)
                childObjectResult = (await crawlSinglePage(browser, url, childElement, delayTime))[0]
                resultKey = childElement.name
                resultValue = childObjectResult
                // crawlResult[childElement.name] = childObjectResult
                // return
                break;
            case "text":
                keyList.push(childElement.name)
                var crawledChildElementsContent = await page.evaluate((childElement) => {
                    let crawledElementsContent = []

                    let crawledElements = document.querySelectorAll(childElement.selector)
                    debugger;
                    console.log(childElement.selector);
                    crawledElements.forEach((crawledElement, index) => {
                        crawledElementsContent.push(crawledElement.innerText)
                    })

                    return {
                        [childElement.name]: crawledElementsContent
                    }
                }, childElement)
                resultKey = childElement.name
                resultValue = crawledChildElementsContent[childElement.name]
                // crawlResult[childElement.name] = crawledChildElementsContent[childElement.name]
                // return
                break;
            case "image":
                keyList.push(childElement.name)
                var crawledChildElementsContent = await page.evaluate((childElement) => {
                    let crawledElementsContent = []

                    let crawledElements = document.querySelectorAll(childElement.selector)
                    debugger;
                    console.log(childElement.selector);
                    crawledElements.forEach((crawledElement, index) => {
                        crawledElementsContent.push(crawledElement.src)
                    })

                    return {
                        [childElement.name]: crawledElementsContent
                    }
                }, childElement)
                resultKey = childElement.name
                resultValue = crawledChildElementsContent[childElement.name]
                break;
            case "paragraph":
                keyList.push(childElement.name)
                var crawledChildElementsContent = await page.evaluate((childElement) => {
                    let crawledElementsContent = ""

                    let crawledElements = document.querySelectorAll(childElement.selector)
                    debugger;
                    console.log(childElement.selector);
                    crawledElements.forEach((crawledElement, index) => {
                        crawledElementsContent = crawledElementsContent + "\n" + crawledElement.innerText
                    })

                    return {
                        [childElement.name]: crawledElementsContent
                    }
                }, childElement)
                resultKey = childElement.name
                resultValue = crawledChildElementsContent[childElement.name]
                break;
            case "click":
                nextLink = await page.evaluate((childElement) => {
                    let crawledLinkList = []
                    let crawledElements = document.querySelectorAll(childElement.selector)
                    // debugger;
                    crawledElements.forEach((crawledElement, index) => {
                        if (crawledElement != null)
                            if ('href' in crawledElement) {
                                crawledLinkList.push(crawledElement.href)
                            } else {
                                crawledLinkList.push("")
                            }
                    })
                    return crawledLinkList;
                }, childElement)
                return;
            case "link":
                keyList.push(childElement.name)
                // Get all href link from selector
                var crawledChildElementsContent = await page.evaluate(async (childElement) => {
                    let crawledElementsContent = []

                    let crawledElements = document.querySelectorAll(childElement.selector)
                    crawledElements.forEach((crawledElement, index) => {
                        crawledElementsContent.push(crawledElement.href)
                    })

                    return {
                        [childElement.name]: crawledElementsContent
                    }
                }, childElement)
                // For all href link, evaluate child elements
                // Treat this the same as an object type
                let crawledGotoResult = []
                await Promise.all(crawledChildElementsContent[childElement.name].map(async (crawledElement, index) => {
                    childObjectResult = (await crawlSinglePage(browser, crawledElement, childElement, delayTime * index))[0]
                    // Must use element because crawl function will return in correct order
                    crawledGotoResult[index] = childObjectResult
                }))
                resultKey = childElement.name
                resultValue = crawledGotoResult
                // crawlResult[childElement.name] = crawledGotoResult
                // return
                break;
            default:
                return;
        }

        if (resultValue.length == 1) {
            resultValue = resultValue[0]
        }
        crawlResult[resultKey] = resultValue
    }))
    await page.close()

    let i
    for (i = 0; i <= keyList.length; i++) {
        if (i == keyList.length) break;
        if (crawlResult[keyList[i]].length > 1 && Array.isArray(crawlResult[keyList[i]]))
            break;
    }

    // If crawled element is single element
    if (i == keyList.length || element.type != "object") {
        obj = {}
        // Combine all crawled result which is an single variable into an object
        keyList.forEach((value) => {
            if (crawlResult[value] == null) {
                obj[value] = ""
            } else {
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
            if (crawlResult[value][i] == null) {
                obj[value] = ""
            } else {
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



async function advanceCrawlService(request) {
    console.log("Handling Text Scraping Request!");

    let crawlResult = {}
    let delayTime = request.request_interval

    let browser = await puppeteer.launch({
        headless: false,
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

function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time);
    });
}

module.exports = advanceCrawlService;

