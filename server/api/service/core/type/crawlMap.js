const crawlMap = async (childElement, mapSelector) => {
    let crawledElementsContent = []
    // document.querySelector(childElement.selector).click();
    // await new Promise(resolve => setTimeout(resolve, 3000));
    let crawledElement = document.querySelector(mapSelector);
    debugger;
    crawledElementsContent.push(crawledElement.href)
    // if (crawledElementsContent[0] == null) {
    //     let crawledElements = document.querySelectorAll(childElement.selector + " [src]")
    //     debugger;
    //     console.log(childElement.selector);
    //     crawledElements.forEach((crawledElement, index) => {
    //         crawledElementsContent.push(crawledElement.src)
    //     })
    // }

    return {
        [childElement.name]: crawledElementsContent
    }
}

module.exports = crawlMap;