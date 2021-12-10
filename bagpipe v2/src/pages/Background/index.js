console.log('This is the background page.');
console.log('Put the background scripts hereee.');

let a = 0

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log("result viewing event from background :>>")
    if (request.action == "view-result") {
        chrome.tabs.create({ url: 'options.html' })
    }

    if (request.action == "select-element-background") {
        console.log("received from panel!");
        a += 1
        sendResponse({ content: "from background: " + a })
    }

    // sendResponse();
})
