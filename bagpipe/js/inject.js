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

        $('body').children().bind("click.selectElement", function (event) {
            event.preventDefault()
            $(".hova").removeClass("hova");
            $(".click-hova").removeClass("click-hova");
            event = event || window.event;
            var target = event.target || event.srcElement,
                text = target.textContent || target.innerText;

            $(".selected-attr").html(target.className);
            $("[class='" + event.target.className + "']").addClass("click-hova");
        });
    }, false)

    document.querySelector('.finish-button').addEventListener('click', () => {
        $('body').children().unbind("mouseover.selectElement");
        $('body').children().unbind("click.selectElement");
        $(".click-hova").removeClass("click-hova");
    }, false)

    //add data field
    document.querySelector('.add-button').addEventListener('click', () => {
        // document.getElementById('attr-con').insertAdjacentHTML("beforeend", "<input type='text' id='tst" + x++ + "'>")
        $("<input type='text' id='tst" + x++ + "'>").insertBefore($('.add-button'))
        console.log("added")
    }, false)
}
