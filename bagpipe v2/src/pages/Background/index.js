console.log('This is the background page.');
console.log('Put the background scripts hereee.');

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log("result viewing event from background :>>")
    if (request.action == "view-result") {
        chrome.tabs.create({ url: 'options.html' })
    }

    sendResponse();
})
