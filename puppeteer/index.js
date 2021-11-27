const puppeteer = require("puppeteer");

(async function () {
    const request = {
        url: "https://vnexpress.net/",
        elements: [
            {
                name: "title",
                selector: "article:nth-of-type(n+7) .title-news a",
                type: ""
            },
            {
                name: "content",
                selector: "article:nth-of-type(n+2) .description a[data-thumb='1']",
                type: ""
            }
        ]
    }
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    let crawlResult = []
    await page.goto(request.url, { waitUtil: "networkkidle0" })

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
                name: element.name,
                content: crawledElementsContent
            }
        }, element)
        crawlResult.push(crawledElementsContent)
    }
    ))

    // const grabParagraph = await page.evaluate(() => {

    //     //multi
    //     // const techTags = document.querySelectorAll(".row.back-end ul li")
    //     // let technologies = []
    //     // techTags.forEach((tag) => {
    //     //     technologies.push(tag.innerText)
    //     // })

    //     return crawlResult
    // })

    console.log(crawlResult);
    await browser.close()
})();