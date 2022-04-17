const puppeteer = require("puppeteer");


const crawlSinglePage = async (browser, url, element) => {
    console.log("crawling: ", url);
    let result = []
    let crawlResult = {}
    let keyList = []
    let resultKey
    let resultValue
    let nextLink
    let page = await browser.newPage()
    await page.goto(url, { waitUtil: "networkkidle0", timeout: 120000 })
    await Promise.all(element.child_elements.map(async (childElement) => {
        switch (childElement.type) {
            case "object":
                keyList.push(childElement.name)
                childObjectResult = (await crawlSinglePage(browser, url, childElement))[0]
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
            case "click":
                nextLink = await page.evaluate((childElement) => {
                    console.log(childElement);
                    let crawledElements = document.querySelector(childElement.selector)
                    return crawledElements.href
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
                    childObjectResult = (await crawlSinglePage(browser, crawledElement, childElement))[0]
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
    if (i == keyList.length) {
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
        return result
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
    //     console.log(crawlResult);
    // console.log("done handling: ", element.name);
    return [result, nextLink]
}



async function advanceCrawlService(request) {
    console.log("Handling Text Scraping Request!");

    let crawlResult = {}

    let browser = await puppeteer.launch({
        headless: true,
        devtools: true,
        defaultViewport: null,
    })

    let nextLink
    let size = 31

    await Promise.all(request.elements.map(async (element) => {
        if (element.type == "object") {
            [crawlResult[element.name], nextLink] = await crawlSinglePage(
                browser,
                request.url,
                element
            );

            if (nextLink) {
                while (crawlResult[element.name].length <= 50) {
                    let result
                    [result, nextLink] = await crawlSinglePage(
                        browser,
                        nextLink,
                        element
                    );
                    crawlResult[element.name] = crawlResult[element.name].concat(result)
                }
                crawlResult[element.name] = crawlResult[element.name].slice(0, size)
                console.log(crawlResult[element.name].length);
            }
        }

    }))

    await browser.close()

    return crawlResult
}

module.exports = advanceCrawlService;

