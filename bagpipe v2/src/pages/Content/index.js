import { printLine } from './modules/print';
import getCssSelector from './modules/selector-gen/index';
import { getSimilarElement } from './modules/event-handler/similar';
import $ from 'jquery';


var attr_index = 1
var selected_element = []
var current_attr_index = attr_index
var current_element = "null"
var final_element = "null"
var result_demo = {}
var extension_element = ["select-panel", "attr-con", "attr-input", "bp-add-button", "bp-confirm-button", "bagpipe-finish", "bagpipe-scrape-inject"]

console.log('Content script works!!');
console.log('Must reload extension for modifications to take effect.');
printLine("Using the 'printLine' function from the Print Module");

$.get(chrome.runtime.getURL('./tool.html'), function (data) {
    $(data).appendTo('body');
    console.log('injected')
    chrome.storage.sync.set({ "elements": "Selecting........." }, function () {
        console.log("[bagpipe] Selecting element");
    });

    $('.bagpipe-finish').on('click', () => {
        console.log("FINAL element: ", final_element);
        // send through background to devtool
        chrome.runtime.sendMessage({
            action: "set-selected-element",
            data: final_element
        });
        removeSelector();
    })

    $('.bagpipe-scrape-inject').on('click', () => {
        $(".select-panel").css("display", "block");
        $('body').children().on("mouseover.selectElement", function (e) {
            if (extension_element.includes(e.target.className)) return false
            $(".hova").removeClass("hova");
            $(e.target).addClass("hova");
            return false;
        }).mouseout(function (e) {
            $(this).removeClass("hova");
        });

        $('body').children().on("click.selectElement", function (event) {
            if (extension_element.includes(event.target.className)) return false
            event.preventDefault()
            $(".hova").removeClass("hova");
            $(".click-hova").removeClass("click-hova");
            if (selected_element.length == 2)
                selected_element = [];

            if (selected_element.length >= 1) {
                selected_element.push(event.target)
                final_element = getSimilarElement(selected_element)
                $(final_element).addClass("click-hova");
            }
            else {
                selected_element.push(event.target)

                final_element = String(getCssSelector(
                    selected_element,
                    {
                        // combineWithinSelector: true,
                        // combineBetweenSelectors: true,
                        // includeTag: true,
                        // maxCandidates: 10,
                        selectors: ['class', 'id', 'nthchild'],
                    }
                ))
                console.log("aa: ", final_element);
                $(final_element).addClass("click-hova");
            }
        });
        console.log("turned on");
    })
});

function removeSelector() {
    selected_element = []
    $('body').children().off("mouseover.selectElement");
    $('body').children().off("click.selectElement");
    $(".click-hova").removeClass("click-hova");
    $(".hova").removeClass("hova");
    $(".select-panel").css("display", "none");
}

function getFullSelector(e) {
    var s = "", t, i, c, p, n;
    do {
        t = e.tagName.toLowerCase();
        i = e.hasAttribute("id") ? "#" + e.id : "";
        c = e.hasAttribute("class") ? "." + e.className.split(/\s+/).join(".") : "";
        p = e.parentNode;
        n = Array.prototype.filter.call(e.parentNode.childNodes, function (x) {
            return x.nodeType == Node.ELEMENT_NODE;
        }).indexOf(e) + 1;
        s = t + i + c + ":nth-child(" + n + ") > " + s;
    } while (!p || !(e = p).tagName.match(/^HTML$/i));
    return s.slice(0, -3);
}

function getMinSelector(e) {
    var s = "", t, i, c, p, n;
    do {
        t = e.tagName.toLowerCase();
        i = e.hasAttribute("id") ? "#" + e.id : "";
        c = e.hasAttribute("class") ? "." + e.className.split(/\s+/).join(".") : "";
        p = e.parentNode;
        n = Array.prototype.filter.call(e.parentNode.childNodes, function (x) {
            return x.nodeType == Node.ELEMENT_NODE;
        }).indexOf(e) + 1;
        n = ":nth-child(" + n + ")";
        if (i && p.querySelectorAll(i).length == 1)
            s = i + " > " + s;
        else if (p.querySelectorAll(t).length == 1)
            s = t + " > " + s;
        else if (c && p.querySelectorAll(t + c).length == 1)
            s = t + c + " > " + s;
        else if (i && c && p.querySelectorAll(t + i + c).length == 1)
            s = t + i + c + " > " + s;
        else
            s = t + i + c + n + " > " + s;
    } while (!p || !(e = p).tagName.match(/^HTML$/i));
    // try to remove parent selectors
    let cs = s.slice(0, -(" > ".length)).split(" > ");
    s = cs.pop();
    while (document.querySelectorAll(s).length > 1) {
        s = cs.pop() + " > " + s;
    }
    return s;
}
