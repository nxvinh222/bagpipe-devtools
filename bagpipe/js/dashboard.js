document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('.popup-button').addEventListener('click', () => {
        chrome.tabs.create({ url: '../html/popup.html' })
    }, false)

    document.querySelector('.scrape-button').addEventListener('click', () => {
        if (localStorage.getItem("dashboard"))
            chrome.tabs.executeScript({ file: 'js/inject.js' });
        localStorage.setItem("dashboard", true);
    }, false)

    // if (localStorage.getItem("dashboard"))
    //     chrome.tabs.executeScript({ file: 'js/inject.js' });
}, false)