console.log('This is the background page.');
console.log('Put the background scripts hereee.');

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log("result viewing event from background :>>")
    if (request.action == "view-result") {
        chrome.tabs.create({ url: 'options.html' })
        chrome.tabs.create({
            url: 'https://vnexpress.net/',
            active: false
        }, function (tab) {
            // After the tab has been created, open a window to inject the tab
            // chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            //     chrome.tabs.sendMessage(tabs[0].id, { action: "scrape" });
            // });
            chrome.runtime.sendMessage({ action: "scrape" });
            chrome.windows.create({
                tabId: tab.id,
                type: 'popup',
                focused: true
                // incognito, top, left, ...
            }, function (win) {
                chrome.runtime.sendMessage({ action: "scrape" });
            });
        });
    }



    sendResponse();
})

console.log('checked');
