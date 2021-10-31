var attr_index = 1
var current_attr_index = attr_index
var current_element
var result_demo = {}
var extension_element = ["navigator-container", "attr-input"]

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action == "inject-dashboard") {
        $(document).ready(function () {
            // inject dashboard
            chrome.storage.sync.get("injectHtml", function (html) {
                injectHtml(html)
            });
        });
    }
});


function injectHtml(html) {
    $('body').prepend(html.injectHtml)

    document.querySelector('.select-button').addEventListener('click', () => {
        addSelector()
    }, false)

    document.querySelector('.finish-button').addEventListener('click', () => {
        removeSelector()
    }, false)

    //add data field
    document.querySelector('.add-button').addEventListener('click', () => {
        addAttr()
    }, false)

    //confirm attr
    document.querySelector('.confirm-button').addEventListener('click', () => {
        confirmAttr()
    }, false)

    //view result
    document.querySelector('.result-button').addEventListener('click', () => {
        viewResult()
    }, false)
}

function addAttr() {
    // document.getElementById('attr-con').insertAdjacentHTML("beforeend", "<input type='text' id='tst" + x++ + "'>")
    $("<input class='attr-input' type='text' id='attr" + attr_index++ + "'>").insertBefore($('.add-button'))
    $(".add-button").css("display", "none");
    $(".confirm-button").css("display", "inline-block");
    addSelector()
}

function confirmAttr() {
    $(".add-button").css("display", "inline-block");
    $(".confirm-button").css("display", "none");
    removeSelector()
    current_attr_index = attr_index - 1
    let attr_id = '#attr' + current_attr_index
    let attr_name = $(attr_id).val();
    console.log(attr_name)
    console.log(attr_id)
    result_demo[attr_name] = []
    $(current_element).each(function (index) {
        result_demo[attr_name].push($(this).text())
        console.log(index + ": " + $(this).text());
        if (index == 9) return
    })
    chrome.storage.sync.set({ "resultDemo": result_demo }, function () {
        console.log(result_demo)
    });
}

function viewResult() {
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

        current_element = "." + target.className
        $(".selected-attr").html(target.className);
        $("[class='" + event.target.className + "']").addClass("click-hova");
    });
}

function removeSelector() {
    $('body').children().unbind("mouseover.selectElement");
    $('body').children().unbind("click.selectElement");
    $(".click-hova").removeClass("click-hova");
}
