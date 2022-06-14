const crawlImageAuto = (childElement) => {
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
}

module.exports = crawlImageAuto;