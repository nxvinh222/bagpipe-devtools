// luu tru du lieu

window.dashboard = false
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    window.dashboard = request.dashboard
})

// chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
//     if (changeInfo.status == 'complete' && tab.active) {

//         if (localStorage.getItem("dashboard"))
//             chrome.tabs.executeScript({ file: 'js/inject.js' });

//     }
// })
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (localStorage.getItem("dashboard") == null)
        localStorage.setItem("dashboard", false)
    $.ajax({
        url: "/html/navigator.html",
        success: function (result) {

            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: "open_dialog_box",
                    inject_html: result,
                    dashboard: localStorage.getItem("dashboard")
                }, function (response) { });
            });
        }
    });
    if (localStorage.getItem("dashboard") == true)
        chrome.tabs.executeScript({ file: 'js/inject.js' });
});

// chrome.browserAction.onClicked.addListener(function (tab) {
//     chrome.tabs.create({ url: '../html/popup.html' })
// })
