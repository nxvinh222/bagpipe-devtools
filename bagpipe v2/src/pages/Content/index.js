import { printLine } from './modules/print';
import getCssSelector from './modules/selector-gen/index';
import $ from 'jquery';


var attr_index = 1
var selected_element = []
var current_attr_index = attr_index
var current_element = "null"
var result_demo = {}
var extension_element = ["select-panel", "attr-con", "attr-input", "bp-add-button", "bp-confirm-button", "bagpipe-finish", "bagpipe-scrape-inject"]
var css_selector_option = {
    combineBetweenSelector: true,
    maxCombinations: 2,
    maxCandidates: 2
}

console.log('Content script works!!');
console.log('Must reload extension for modifications to take effect.');
printLine("Using the 'printLine' function from the Print Module");

$.get(chrome.runtime.getURL('./tool.html'), function (data) {
    $(data).appendTo('body');
    console.log('injected')

    $('.bagpipe-finish').on('click', () => {
        chrome.storage.sync.set({ "elements": current_element }, function () {
            console.log("[bagpipe] finish select element");
        });
        removeSelector();
    })

    $('.bagpipe-scrape-inject').on('click', () => {
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
                selected_element = []

            selected_element.push(event.target)
            current_element = String(getCssSelector(
                selected_element,
                css_selector_option)
            )
            // console.log("current element: ", current_element);
            // getSimilarElement()
            if (selected_element.length < 2)
                $(current_element).addClass("click-hova");
            else
                $(getSimilarElement()).addClass("click-hova");
        });
        console.log("turned on");
    })
});


function getSimilarElement() {
    if (selected_element.length < 2) return;
    console.log("first e class: ", selected_element[0].className);
    console.log("second e class: ", selected_element[1].className);

    let first_father = selected_element[0];
    let second_father = selected_element[1];
    let first_classlist
    let second_classlist
    let final_classlist = []
    while (true) {
        first_father = first_father.parentElement;
        second_father = second_father.parentElement;
        if (first_father.isSameNode(second_father)) break;
        if (first_father == undefined || second_father == undefined) {
            console.log("Can't find father element");
            break;
        }
    }

    let final_father = first_father.nodeName + "." + first_father.className.split(" ").join(".");
    console.log("FINAL e father selector: ", final_father);

    first_classlist = selected_element[0].className.split(" ")
    second_classlist = selected_element[1].className.split(" ")
    for (var i = 0; i < first_classlist.length; i++) {
        if (first_classlist[i] == second_classlist[i])
            final_classlist.push(first_classlist[i]);
    }
    let final_child = selected_element[0].nodeName + "." + final_classlist.join(".")
    console.log("FINAL e child class: ", final_child);
    let final_selector = final_father + " " + final_child
    // console.log("FINAL e selector: ", final_selector);
    return final_selector
}

function removeSelector() {
    selected_element = []
    $('body').children().off("mouseover.selectElement");
    $('body').children().off("click.selectElement");
    $(".click-hova").removeClass("click-hova");
    $(".hova").removeClass("hova");
}

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
