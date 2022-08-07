const crawlText = (childElement) => {
    let crawledElementsContent = []

    let crawledElements = document.querySelectorAll(childElement.selector)
    debugger;
    console.log(childElement.selector);
    crawledElements.forEach((crawledElement, index) => {
        let crawledText = crawledElement.innerText
        // let crawledText = crawledElement.innerText.replace(/[\\]/g, '');
        // crawledText = crawledText.replaceAll("\n", "\\\\n");
        crawledText = crawledText.replaceAll("\n", " ");
        crawledText = crawledText.replaceAll("\t", " ");
        // crawledText = crawledText.replace("/\\/g", "\\\\");
        crawledText = crawledText.replace("/\\/g", " ");
        crawledText = crawledText.replace(/[•“”`!@#$%^&*()_+\-=\[\]{};'"\\|<>?~]/g, '');
        // crawledText = crawledText.replace(/[&\/\\#,+()$~%.'":;*?<>{}]/g, '');•

        if (crawledText != null)
            crawledElementsContent.push(crawledText);
    })

    return {
        [childElement.name]: crawledElementsContent
    }
}

module.exports = crawlText;