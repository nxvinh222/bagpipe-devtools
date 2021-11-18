$.get(chrome.runtime.getURL('/tool.html'), function (data) {
    $(data).appendTo('body');
    // Or if you're using jQuery 1.8+:
    $($.parseHTML(data)).appendTo('body');
    console.log("ok")
});