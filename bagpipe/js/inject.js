var x = 1

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action == "inject-dashboard") {
        $(document).ready(function () {
            // inject dashboard
            chrome.storage.sync.get("injectHtml", function (html) {
                injectHtml(html)
            });
        });
    }
});


function injectHtml(html) {
    $('body').prepend(html.injectHtml)
    document.querySelector('.select-button').addEventListener('click', () => {
        $('body').children().bind("mouseover.selectElement", function (e) {
            if (e.target.className == "navigator-container") return false

            $(".hova").removeClass("hova");
            $(e.target).addClass("hova");
            return false;
        }).mouseout(function (e) {
            $(this).removeClass("hova");
        });

    }, false)

    document.querySelector('.finish-button').addEventListener('click', () => {
        $('body').children().unbind("mouseover.selectElement");
    }, false)

    //add data field
    document.querySelector('.add-button').addEventListener('click', () => {
        // document.getElementById('attr-con').insertAdjacentHTML("beforeend", "<input type='text' id='tst" + x++ + "'>")
        $("<input type='text' id='tst" + x++ + "'>").insertBefore($('.add-button'))
        console.log("added")
    }, false)
}
