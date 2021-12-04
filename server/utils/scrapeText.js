const puppeteer = require("puppeteer");

async function scrape(request) {
    // const request = {
    //     url: "https://vnexpress.net/",
    //     elements: [
    //         {
    //             name: "title",
    //             selector: "article:nth-of-type(n+7) .title-news a",
    //             type: ""
    //         },
    //         {
    //             name: "content",
    //             selector: "article:nth-of-type(n+2) .description a[data-thumb='1']",
    //             type: ""
    //         }
    //     ]
    // }
    console.log("Handling Text Scraping Request!");
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    let crawlResult = []
    await page.goto(request.url, { waitUtil: "networkkidle0", timeout: 60000 })

    await Promise.all(request.elements.map(async (element) => {
        let crawledElementsContent = await page.evaluate((element) => {
            let crawledElementsContent = []
            console.log("element: ");
            console.log(element)
            let crawledElements = document.querySelectorAll(element.selector)
            crawledElements.forEach((crawledElement) => {
                crawledElementsContent.push(crawledElement.innerText)
            })
            return {
                [element.name]: crawledElementsContent
            }
        }, element)
        crawlResult.push(crawledElementsContent)
    }
    ))

    // console.log(crawlResult);
    await browser.close()

    return crawlResult
}


module.exports = scrape;

