const crawlClick = (childElement) => {
    let crawledLinkList = []
    let crawledElements = document.querySelectorAll(childElement.selector)
    // debugger;
    crawledElements.forEach((crawledElement, index) => {
        if (crawledElement != null)
            if (crawledElement.href != null) {
                crawledLinkList.push(crawledElement.href)
            } else if (crawledElement.parentElement.href != null) {
                crawledLinkList.push(crawledElement.parentElement.href)
            }
            else {
                crawledLinkList.push("")
            }
    })
    return crawledLinkList;
}

module.exports = crawlClick;