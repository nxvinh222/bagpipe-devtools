const crawlText = (childElement, limit) => {
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
}

module.exports = crawlText;