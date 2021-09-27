chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action == "inject-dashboard") {
        $(document).ready(function () {
            $('body').prepend(localStorage.getItem("inject-html"));
            document.querySelector('.select-button').addEventListener('click', () => {
                // $('body').children().mouseover(function (e) {
                //     $(".hova").removeClass("hova");
                //     $(e.target).addClass("hova");
                //     return false;
                // }).mouseout(function (e) {
                //     $(this).removeClass("hova");
                // });
                $('body').children().bind("mouseover.selectElement", function (e) {
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
    }
});
