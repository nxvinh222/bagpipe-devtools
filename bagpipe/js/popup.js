document.addEventListener('DOMContentLoaded', function () {
    chrome.storage.sync.get("resultDemo", function (result) {
        console.log(result.resultDemo)
        $(".result-json").html(JSON.stringify(result.resultDemo, undefined, 2));
    });
    // const bg = chrome.extension.getBackgroundPage()
    // Object.keys(bg.bears).forEach(function (url) {
    //     const div = document.createElement('div')
    //     div.textContent = `${url}: ${bg.bears[url]}`
    //     document.body.appendChild(div)
    // })
    // document.querySelector('button').addEventListener('click', onclick, false)

    // function onclick() {
    //     chrome.tabs.query({ currentWindow: true, active: true },
    //         function (tabs) {
    //             chrome.tabs.sendMessage(tabs[0].id, 'hi', setContent)
    //         })
    // }

    // function setContent(res) {
    //     const div = document.createElement('div')
    //     div.textContent = `value: ${res.testValue}`
    //     document.body.appendChild(div)
    // }
}, false)