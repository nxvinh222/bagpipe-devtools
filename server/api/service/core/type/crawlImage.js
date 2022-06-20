const crawlImage = (childElement) => {
    let crawledElementsContent = []

    let crawledElements = document.querySelectorAll(childElement.selector)
    console.log(childElement.selector);
    crawledElements.forEach((crawledElement, index) => {
        crawledElementsContent.push(crawledElement.src)
    })

    if (crawledElementsContent[0] == null) {
        let crawledElements = document.querySelectorAll(childElement.selector + " [src]")
        console.log(childElement.selector);
        crawledElements.forEach((crawledElement, index) => {
            crawledElementsContent.push(crawledElement.src)
        })
    }

    return {
        [childElement.name]: crawledElementsContent
    }
}

module.exports = crawlImage;