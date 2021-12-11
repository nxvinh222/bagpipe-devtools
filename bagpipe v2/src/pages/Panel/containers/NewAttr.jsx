import React, { useState } from 'react';
import 'antd/dist/antd.css';
import { useLocation } from 'react-router-dom';

import { Form, Input, Button } from 'antd';

const NewAttr = () => {
    const useQuery = () => new URLSearchParams(useLocation().search);
    let query = useQuery();

    const recipeId = query.get('recipeId')
    const [element, setElement] = useState("null")

    const selectElementScript = function () {
        var extension_element = ["navigator-container", "attr-con", "attr-input", "bp-add-button", "bp-confirm-button", "bagpipe-finish"]
        var current_element = "null"

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
            $(event.target).addClass("click-hova");
            current_element = event.target.className
        });

        $('.bagpipe-finish').on('click', () => {
            chrome.storage.sync.set({ "elements": current_element }, function () {
                alert("Done");
                console.log(current_element);
            });
        })
        return 123

    }

    const getElement = () => {
        setElement("clicked")

        let script = selectElementScript.toString() + "()"
        console.log(script);
        chrome.devtools.inspectedWindow.eval(
            `(${selectElementScript.toString()})()`,
            function (result, isException) {
                if (isException) {
                    console.log("Result not received");
                } else {
                    console.log("Selected element: " + result);
                    setElement(result)
                }
            });
        chrome.storage.onChanged.addListener(function (changes, namespace) {
            for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
                console.log(
                    `Storage key "${key}" in namespace "${namespace}" changed.`,
                    `Old value was "${oldValue}", new value is "${newValue}".`
                );
            }
        });
    }

    return (
        <div>
            recipe id: {recipeId}
            <div>
                element: {element}
            </div>
            <div>
                <Button type="primary" onClick={getElement}>
                    Select element!
                </Button>
            </div>
        </div>
    )
}

export default NewAttr