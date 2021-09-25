// document.addEventListener('DOMContentLoaded', function () {
//     document.querySelector('.scrape-button').addEventListener('click', () => {
//         chrome.tabs.executeScript({ file: 'js/jquery-3.6.0.min.js' }, () => {
//             chrome.tabs.executeScript({ file: 'js/theroom.js' });
//         });
//     }, false)
// }, false)
window.onload = function () {

    document.querySelector('.scrape-button').addEventListener('click', () => {
        window.theRoom.configure({
            // options here
        })
        window.theRoom.start()
    }, false)

}