document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('.popup-button').addEventListener('click', () => {
        chrome.tabs.create({ url: '../html/popup.html' })
    }, false)

    document.querySelector('.scrape-button').addEventListener('click', () => {

        // if (localStorage.getItem("dashboard"))
        //     chrome.scripting.executeScript({
        //         target: { tabId: tab.id },
        //         files: 'js/inject.js'
        //     });
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                action: "inject-dashboard",
                status: true
            }, function (response) { });
            chrome.tabs.sendMessage(tabs[0].id, {
                action: "add-selector",
                status: true
            }, function (response) { });
        });
        localStorage.setItem("dashboard", true);
    }, false)

    // if (localStorage.getItem("dashboard"))
    //     chrome.tabs.executeScript({ file: 'js/inject.js' });
}, false)