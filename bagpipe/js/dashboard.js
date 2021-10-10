document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('.popup-button').addEventListener('click', () => {
        chrome.tabs.create({ url: '../html/popup.html' })
    }, false)

    document.querySelector('.scrape-button').addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                action: "inject-dashboard",
                status: true
            });
        });
    }, false)
}, false)