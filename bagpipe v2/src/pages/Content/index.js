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
        chrome.storage.sync.set({ "elements": final_element }, function () {
            console.log("[bagpipe] Finish select element");
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
            console.log("prevent default");
            $(".hova").removeClass("hova");
            $(".click-hova").removeClass("click-hova");
            // console.log(getCssSelector(event.target));
            if (selected_element.length == 2)
                selected_element = [];

            selected_element.push(event.target)
            current_element = String(getCssSelector(selected_element))
            final_element = getSimilarElement(selected_element)
            if (selected_element.length < 2)
                $(current_element).addClass("click-hova");
            else
                $(final_element).addClass("click-hova");
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
