const crawlClick = (childElement) => {
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
}

module.exports = crawlClick;