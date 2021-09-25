$(document).ready(function () {

    // fetch(fileUrl)
    //     .then(r => r.text())
    //     .then(t => $('body').prepend(t))
    // $.ajax({
    //     url: "/html/navigator.html",
    //     success: function (result) {
    //         $('body').prepend(result)
    //         alert(result)
    //         alert("test")
    //     }
    // });
    // $('body').prepend(`
    //     <div id="fb-root">
    //         hell3
    //     </div>
    //     `
    // );
    // var inject_html = localStorage.getItem('inject_html')
    // $('body').prepend(inject_html);
    $('body').prepend(localStorage.getItem("inject-html"));
});
// $.ajax({
//     url: "html/navigator.html",
//     success: function (data) { $('body').prepend(data); },
//     dataType: 'html'
// });
