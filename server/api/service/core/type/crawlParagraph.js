const crawlParagraph = (childElement) => {
    let crawledElementsContent = ""

    let crawledElements = document.querySelectorAll(childElement.selector)
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
}

module.exports = crawlParagraph;