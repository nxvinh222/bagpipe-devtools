// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//     // alert(request)
//     sendResponse({ testValue: 9 })
// })


// chrome.runtime.sendMessage({
//     url: window.location.href,
//     testValue: 9
// })

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request) {
        localStorage.setItem("inject-html", request.inject_html)
    }
});
