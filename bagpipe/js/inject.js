chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action == "inject-dashboard") {
        $(document).ready(function () {
            $('body').prepend(localStorage.getItem("inject-html"));
            document.querySelector('.select-button').addEventListener('click', () => {
                $("*").not("body, html").hover(function (e) {
                    $(this).css("border", "1px solid #000");
                    e.stopPropagation();
                }, function (e) {
                    $(this).css("border", "0px");
                    e.stopPropagation();
                });
            }, false)
        });
    }
});
