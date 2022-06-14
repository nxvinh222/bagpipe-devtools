const crawlLink = async (childElement) => {
    let crawledElementsContent = []

    let crawledElements = document.querySelectorAll(childElement.selector)
    crawledElements.forEach((crawledElement, index) => {
        // check if href link is in wrapper
        if (crawledElement.href != null)
            crawledElementsContent.push(crawledElement.href)
        else
            crawledElementsContent.push(crawledElement.parentElement.href)
    })

    return {
        [childElement.name]: crawledElementsContent
    }
}

module.exports = crawlLink;