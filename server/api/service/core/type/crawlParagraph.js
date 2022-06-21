const crawlParagraph = (childElement) => {
    let crawledElementsContent = ""

    let crawledElements = document.querySelectorAll(childElement.selector)
    console.log(childElement.selector);
    crawledElements.forEach((crawledElement, index) => {
        let crawledText = crawledElement.innerText
        crawledText = crawledText.replaceAll("\n", " ");
        crawledText = crawledText.replaceAll("\t", " ");
        crawledText = crawledText.replace("/\\/g", " ");

        if (crawledText != null)
            crawledElementsContent = crawledElementsContent + "\\\\n" + crawledText
    })

    return {
        [childElement.name]: crawledElementsContent
    }
}

module.exports = crawlParagraph;