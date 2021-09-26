// alert(chrome.runtime.id)

document.addEventListener('DOMContentLoaded', function () {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action == "add-selector") {
            alert("dcm")
            document.querySelector('.select-button').addEventListener('click', () => {
                $("*").not("body, html").hover(function (e) {
                    $(this).css("border", "1px solid #000");
                    e.stopPropagation();
                }, function (e) {
                    $(this).css("border", "0px");
                    e.stopPropagation();
                });
            }, false)
        }
    });
}, false)

// chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
//     $(".select-button").click(() => {
//         $("*").not("body, html").hover(function (e) {
//             $(this).css("border", "1px solid #000");
//             e.stopPropagation();
//         }, function (e) {
//             $(this).css("border", "0px");
//             e.stopPropagation();
//         });
//     })
// });

// $("*").not("body, html").hover(function (e) {
//     $(this).css("border", "1px solid #000");
//     e.stopPropagation();
// }, function (e) {
//     $(this).css("border", "0px");
//     e.stopPropagation();
// });
