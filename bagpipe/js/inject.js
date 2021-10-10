chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action == "inject-dashboard") {
        $(document).ready(function () {
            // $('body').prepend(localStorage.getItem("inject-html"));
            chrome.storage.sync.get("injectHtml", function (html) {
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
            });

        });
    }
});
