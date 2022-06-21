const crawlImageAuto = (childElement) => {
    let crawledElementsContent = []

    let crawledElements = document.querySelectorAll(childElement.selector)
    debugger;
    console.log(childElement.selector);
    crawledElements.forEach((crawledElement, index) => {
        if (crawledElement.src != null)
            crawledElementsContent.push(crawledElement.src)
    })

    console.log("images: ", crawledElementsContent);
    if (crawledElementsContent[0] == null) {
        let crawledElements = document.querySelectorAll(childElement.selector + " [src]")
        console.log(childElement.selector);
        crawledElements.forEach((crawledElement, index) => {
            if (crawledElement.src != null)
                crawledElementsContent.push(crawledElement.src)
        })
    }
    debugger;

    return {
        [childElement.name]: crawledElementsContent
    }
}

module.exports = crawlImageAuto;