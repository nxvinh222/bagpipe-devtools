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
                        let crawledText = crawledElement.innerText.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
                        crawledText = crawledText.replaceAll("\n", "\\n")
                        crawledText = crawledText.replaceAll("\t", "")

                        crawledElementsContent.push(crawledText)
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
            case "image-auto":
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
                        let crawledText = crawledElement.innerText.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
                        crawledText = crawledText.replaceAll("\n", "\\n")
                        crawledText = crawledText.replaceAll("\t", "")

                        crawledElementsContent = crawledElementsContent + "\\n" + crawledText
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


module.exports = crawlSinglePage;
