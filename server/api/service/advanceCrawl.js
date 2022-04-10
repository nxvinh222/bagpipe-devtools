const puppeteer = require("puppeteer");


const crawlSinglePage = async (request, element) => {
    let result = []
    let crawlResult = {}
    let keyList = []
    let browser = await puppeteer.launch()
    let page = await browser.newPage()
    let i = 0
    await page.goto(request.url, { waitUtil: "networkkidle0", timeout: 120000 })
    await Promise.all(element.child_elements.map(async (childElement) => {
        keyList.push(childElement.name)

        if (childElement.type == "object") {
            childObjectResult = await crawlSinglePage(request, childElement)
            crawlResult[childElement.name] = childObjectResult
            return
        }


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
    }))
    await browser.close()

    console.log(keyList);
    crawlResult[keyList[0]].forEach((v, i) => {
        obj = {}
        obj[keyList[0]] = v
        keyList.forEach((value) => {
            obj[value] = crawlResult[value][i]
        })
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
            crawlResult[element.name] = await crawlSinglePage(request, element);
        }

    }))

    return crawlResult
}

module.exports = advanceCrawlService;

