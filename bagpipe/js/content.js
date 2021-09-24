// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//     // alert(request)
//     sendResponse({ testValue: 9 })
// })
chrome.runtime.sendMessage({
    url: window.location.href,
    testValue: 9
})