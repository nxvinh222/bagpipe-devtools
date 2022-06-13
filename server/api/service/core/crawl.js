const crawlSinglePage = async (browser, url, element, delayTime, root = false, limit) => {
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
    let page = await browser.newPage()
    await page.setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36");
    await page.setDefaultNavigationTimeout(0);

    // console.log("e: ", element);
    console.log("[INFO] waiting: ", url);
    await delay(delayTime);
    console.log("[INFO] crawling: ", url);
    await page.goto(url, {
        waitUtil: ["networkkidle0", "domcontentloaded"],
        timeout: 0
    })

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
                    resultTmp = await crawlSinglePage(browser, url, childElement, delayTime)
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
                    // crawlResult[childElement.name] = childObjectResult
                    // return
                    break;
                case "text":
                    debugger;
                    keyList.push(childElement.name)
                    var crawledChildElementsContent = await page.evaluate((childElement, limit) => {
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
                            [childElement.name]: crawledElementsContent.slice(0, limit)
                        }
                    }, childElement, limit)
                    resultKey = childElement.name
                    resultValue = crawledChildElementsContent[childElement.name]
                    // crawlResult[childElement.name] = crawledChildElementsContent[childElement.name]
                    // return
                    break;
                case "image":
                    keyList.push(childElement.name)
                    var crawledChildElementsContent = await page.evaluate((childElement, limit) => {
                        let crawledElementsContent = []

                        let crawledElements = document.querySelectorAll(childElement.selector)
                        debugger;
                        console.log(childElement.selector);
                        crawledElements.forEach((crawledElement, index) => {
                            crawledElementsContent.push(crawledElement.src)
                        })

                        return {
                            [childElement.name]: crawledElementsContent.slice(0, limit)
                        }
                    }, childElement, limit)
                    resultKey = childElement.name
                    resultValue = crawledChildElementsContent[childElement.name]
                    break;
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
                    // Check if there is any link
                    if (nextLink[0] != '') {
                        return;
                    }
                    // Open new page to get next link
                    let pageTmp = await browser.newPage();
                    await pageTmp.goto(url, { waitUtil: "networkkidle0", timeout: 0 })
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
                        console.log("[ERROR] ", error);
                    }
                    await pageTmp.close()
                    return;
                case "link":
                    keyList.push(childElement.name)
                    // Get all href link from selector
                    var crawledChildElementsContent = await page.evaluate(async (childElement, limit) => {
                        let crawledElementsContent = []

                        let crawledElements = document.querySelectorAll(childElement.selector)
                        crawledElements.forEach((crawledElement, index) => {
                            // check if href link is in wrapper
                            if (crawledElement.hasOwnProperty("href"))
                                crawledElementsContent.push(crawledElement.href)
                            else
                                crawledElementsContent.push(crawledElement.parentElement.href)
                        })

                        return {
                            [childElement.name]: crawledElementsContent.slice(0, limit)
                        }
                    }, childElement, limit)
                    // For all href link, evaluate child elements
                    // Treat this the same as an object type
                    let crawledGotoResult = []
                    await Promise.all(crawledChildElementsContent[childElement.name].map(async (crawledElement, index) => {
                        resultTmp = await crawlSinglePage(browser, crawledElement, childElement, delayTime * index)
                        childObjectResult = resultTmp[0]
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
        } catch (error) {
            console.log(`[WARNING] cannot extract information from: ${url}\n ---> `, error.message);
            keyList.push(childElement.name);
            crawlResult[childElement.name] = "";
        }
    }))
    await page.close()

    let i;
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
