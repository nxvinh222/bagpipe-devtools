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
            e.preventDefault();
            if (extension_element.includes(e.target.className)) return false
            $(".hova").removeClass("hova");
            $(e.target).addClass("hova");
            return false;
        }).mouseout(function (e) {
            $(this).removeClass("hova");
        });

        $('body').children().on("contextmenu.selectElement", function (event) {
            handleClick(event)
        });
        console.log("turned on");
    })
});

function removeSelector() {
    selected_element = []
    $('body').children().off("mouseover.selectElement");
    $('body').children().off("contextmenu.selectElement");
    $(".click-hova").removeClass("click-hova");
    $(".hova").removeClass("hova");
    $(".select-panel").css("display", "none");
}

function handleClick(event) {
    event.preventDefault();
    event.stopPropagation();
    console.log("selected e: ", selected_element);
    if (extension_element.includes(event.target.className)) return false
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
        console.log("here: ", event.target.className);
        selected_element.push(event.target)

        final_element = String(getCssSelector(
            selected_element,
            {
                // combineWithinSelector: true,
                // combineBetweenSelectors: true,
                // includeTag: true,
                // maxCandidates: 10,
                selectors: ['class', 'nthchild'],
            }
        ))
        console.log("aa: ", final_element);
        $(final_element).addClass("click-hova");
    }
}
