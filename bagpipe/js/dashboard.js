document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('.popup-button').addEventListener('click', onClick, false)

    function onClick() {
        chrome.tabs.create({ url: '../html/popup.html' })
    }
}, false)