import { printLine } from './modules/print';
import $ from 'jquery';


var attr_index = 1
var current_attr_index = attr_index
var current_element = "null"
var result_demo = {}
var turn_on = false;
var extension_element = ["navigator-container", "attr-con", "attr-input", "bp-add-button", "bp-confirm-button", "bagpipe-finish"]

console.log('Content script works!!');
console.log('Must reload extension for modifications to take effect.');
printLine("Using the 'printLine' function from the Print Module");

$.get(chrome.runtime.getURL('./tool.html'), function (data) {
    $(data).appendTo('body');
    console.log('injected')

    $('.bagpipe-finish').on('click', () => {
        if (!turn_on) return false;
        chrome.storage.sync.set({ "elements": current_element }, function () {
            console.log("[bagpipe] finish select element");
        });
        turn_on = false;
    })

    $('.bagpipe-scrape-inject').on('click', () => {
        turn_on = true;
        console.log("turned on");
    })
});

$('body').children().on("mouseover.selectElement", function (e) {
    if (!turn_on) return false;
    if (extension_element.includes(e.target.className)) return false

    $(".hova").removeClass("hova");
    $(e.target).addClass("hova");
    return false;
}).mouseout(function (e) {
    $(this).removeClass("hova");
});

$('body').children().on("click.selectElement", function (event) {
    if (!turn_on) return false;
    if (extension_element.includes(event.target.className)) return false
    event.preventDefault()
    $(".hova").removeClass("hova");
    $(".click-hova").removeClass("click-hova");
    $(event.target).addClass("click-hova");
    current_element = event.target.className
});



chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    if (request.action == "inject-dashboard") {
        // document.addEventListener("DOMContentLoaded", function () {

        $.get(chrome.runtime.getURL('./tool.html'), function (data) {
            injectHtml(data)
        });
        // });

    }
});

function injectHtml(data) {
    $(data).appendTo('body');
    console.log("Scrape tool added")

    //add data field
    document.querySelector('.bp-add-button').addEventListener('click', () => {
        addAttr()
    }, false)

    //confirm attr
    document.querySelector('.bp-confirm-button').addEventListener('click', () => {
        confirmAttr()
    }, false)

    //view result
    document.querySelector('.bp-result-button').addEventListener('click', () => {
        viewResult()
    }, false)
}

function addAttr() {
    // document.getElementById('attr-con').insertAdjacentHTML("beforeend", "<input type='text' id='tst" + x++ + "'>")
    $("<input class='attr-input' placeholder='Attribute name' type='text' id='attr" + attr_index++ + "'>").insertBefore($('.bp-add-button'))
    $(".bp-add-button").css("display", "none");
    $(".bp-confirm-button").css("display", "inline-block");
    $(".bp-guide").css("display", "none");
    addSelector()
}

function confirmAttr() {
    $(".bp-add-button").css("display", "inline-block");
    $(".bp-confirm-button").css("display", "none");
    removeSelector()
    current_attr_index = attr_index - 1
    let attr_id = '#attr' + current_attr_index
    let attr_name = $(attr_id).val();
    console.log(attr_name)
    console.log(attr_id)
    result_demo[attr_name] = []
    console.log("current element:" + current_element)
    $(current_element).slice(0, 9).each(function (index) {
        result_demo[attr_name].push($(this).text().replace(/\n/g, '').trim())
        console.log(index + ": " + $(this).text().replace(/\n/g, '').trim())
    })
    chrome.storage.sync.set({ "resultDemo": result_demo }, function () {
        console.log(result_demo)
    });
}

function viewResult() {
    console.log("result clicked")
    chrome.runtime.sendMessage({
        action: "view-result",
        data: result_demo
    });
}

function addSelector() {
    $('body').children().bind("mouseover.selectElement", function (e) {
        if (extension_element.includes(e.target.className)) return false

        $(".hova").removeClass("hova");
        $(e.target).addClass("hova");
        return false;
    }).mouseout(function (e) {
        $(this).removeClass("hova");
    });

    $('body').children().bind("click.selectElement", function (event) {
        if (extension_element.includes(event.target.className)) return false
        event.preventDefault()
        $(".hova").removeClass("hova");
        $(".click-hova").removeClass("click-hova");
        event = event || window.event;
        var target = event.target || event.srcElement,
            text = target.textContent || target.innerText;

        current_element = "." + target.className.split(' ').join(',.')
        $(".selected-attr").html(target.className);
        $("[class='" + event.target.className + "']").addClass("click-hova");
    });
}

function removeSelector() {
    $('body').children().unbind("mouseover.selectElement");
    $('body').children().unbind("click.selectElement");
    $(".click-hova").removeClass("click-hova");
}