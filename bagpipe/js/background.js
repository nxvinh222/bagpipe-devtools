// luu tru du lieu

window.bears = {}
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    window.bears[request.url] = request.testValue
})

// chrome.browserAction.onClicked.addListener(function (tab) {
//     chrome.tabs.create({ url: '../html/popup.html' })
// })
