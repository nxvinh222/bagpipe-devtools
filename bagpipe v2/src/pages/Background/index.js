console.log('This is the background page.');
console.log('Put the background scripts hereee.');

let a = 0

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log("result viewing event from background :>>")
    console.log("request: ", request)
    console.log("sender tab: ", sender.tab.id)
    if (request.action == "view-result") {
        chrome.tabs.create({ url: 'options.html' })
    }

    if (request.action == "select-element-background") {
        console.log("received from panel!");
        a += 1
        sendResponse({ content: "from background: " + a })
    }

    if (request.action == "dm") {
        console.log(request.data);
    }

    console.log(sender.tab ?
        "from a content script:" + sender.tab.url :
        "from the extension");
    if (request.greeting === "hello")
        sendResponse({ farewell: "goodbye" });


    // Messages from content scripts should have sender.tab set
    if (sender.tab) {
        var tabId = sender.tab.id;
        if (tabId in connections) {
            connections[tabId].postMessage(request);
        } else {
            console.log("Tab not found in connection list.");
        }
    } else {
        console.log("sender.tab not defined.");
    }
    return true;

    // sendResponse();
})

var connections = {};

chrome.runtime.onConnect.addListener(function (port) {

    var extensionListener = function (message, sender, sendResponse) {

        // The original connection event doesn't include the tab ID of the
        // DevTools page, so we need to send it explicitly.
        if (message.name == "init") {
            connections[message.tabId] = port;
            return;
        }

        // other message handling
    }

    // Listen to messages sent from the DevTools page
    port.onMessage.addListener(extensionListener);

    port.onDisconnect.addListener(function (port) {
        port.onMessage.removeListener(extensionListener);

        var tabs = Object.keys(connections);
        for (var i = 0, len = tabs.length; i < len; i++) {
            if (connections[tabs[i]] == port) {
                delete connections[tabs[i]]
                break;
            }
        }
    });
});
