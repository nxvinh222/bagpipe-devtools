// importScripts('jquery-3.6.0.min.js')

// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//     window.dashboard = request.dashboard
// })

// chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
//     if (changeInfo.status == 'complete' && tab.active) {

//         if (localStorage.getItem("dashboard"))
//             chrome.tabs.executeScript({ file: 'js/inject.js' });

//     }
// })

chrome.tabs.onActivated.addListener(function (tabId, changeInfo, tab) {
    // if (localStorage.getItem("dashboard") == null)
    //     localStorage.setItem("dashboard", false)
    fetch('/html/navigator.html')
        .then(re => re.text())
        .then(response => {
            // chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            //     chrome.tabs
            //         .sendMessage(tabs[0].id, {
            //             action: "add-dashboard",
            //             inject_html: response
            //         });
            // })
            chrome.storage.sync.set({ "injectHtml": response }, function (html) {
                //  A data saved callback omg so fancy
                console.log(html)
            });
        })
    // $.ajax({
    //     url: "/html/navigator.html",
    //     success: function (result) {

    //         chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    //             chrome.tabs.sendMessage(tabs[0].id, {
    //                 action: "add-dashboard",
    //                 inject_html: result
    //             }, function (response) { });
    //         });
    //     }
    // });
    // if (localStorage.getItem("dashboard") == true)
    //     chrome.tabs.executeScript({ file: 'js/inject.js' });
});

// chrome.browserAction.onClicked.addListener(function (tab) {
//     chrome.tabs.create({ url: '../html/popup.html' })
// })
