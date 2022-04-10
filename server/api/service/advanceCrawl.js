const puppeteer = require("puppeteer");


const crawlSinglePage = async (url, element) => {
    console.log("crawling: ", url);
    let result = []
    let crawlResult = {}
    let keyList = []
    let browser = await puppeteer.launch()
    let page = await browser.newPage()
    await page.goto(url, { waitUtil: "networkkidle0", timeout: 120000 })
    await Promise.all(element.child_elements.map(async (childElement) => {


        switch (childElement.type) {
            case "object":
                keyList.push(childElement.name)
                childObjectResult = await crawlSinglePage(url, childElement)
                crawlResult[childElement.name] = childObjectResult
                return
            case "text":
                keyList.push(childElement.name)
                var crawledChildElementsContent = await page.evaluate((childElement) => {
                    let crawledElementsContent = []

                    let crawledElements = document.querySelectorAll(childElement.selector)
                    crawledElements.forEach((crawledElement, index) => {
                        crawledElementsContent.push(crawledElement.innerText)
                    })

                    return {
                        [childElement.name]: crawledElementsContent
                    }
                }, childElement)
                crawlResult[childElement.name] = crawledChildElementsContent[childElement.name]
                return
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
                    childObjectResult = await crawlSinglePage(crawledElement, childElement)
                    // Must use element because crawl function will return in correct order
                    crawledGotoResult[index] = childObjectResult
                }))
                crawlResult[childElement.name] = crawledGotoResult
                return
            default:
        }
    }))
    await browser.close()

    // console.log(keyList);
    let i
    for (i = 0; i <= keyList.length; i++) {
        if (i == keyList.length) break;
        if (crawlResult[keyList[i]].length > 1)
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

    // console.log("done handling: ", element.name);
    return result
}

async function advanceCrawlService(request) {
    console.log("Handling Text Scraping Request!");

    let crawlResult = {}

    await Promise.all(request.elements.map(async (element) => {
        if (element.type == "object") {
            crawlResult[element.name] = await crawlSinglePage(request.url, element);
        }

    }))

    return crawlResult
}

module.exports = advanceCrawlService;

