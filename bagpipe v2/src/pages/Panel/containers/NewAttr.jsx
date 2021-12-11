import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import { useLocation } from 'react-router-dom';

import { Form, Input, Button } from 'antd';

const NewAttr = () => {
    const useQuery = () => new URLSearchParams(useLocation().search);
    let query = useQuery();

    const recipeId = query.get('recipeId')
    const [element, setElement] = useState("null")

    useEffect(() => {
        chrome.storage.onChanged.addListener(function (changes, namespace) {
            if ("elements" in changes) {
                setElement(changes.elements.newValue);
            }
        });
    });

    const selectElementScript = function () {
        var extension_element = ["navigator-container", "attr-con", "attr-input", "bp-add-button", "bp-confirm-button", "bagpipe-finish"]
        var current_element = "null"
        $(".bagpipe-scrape-inject").trigger('click');
        return "Selecting......."
    }

    const getElement = () => {
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

        chrome.storage.sync.get("elements", function (res) {
            console.log("storage: ", res.elements)
            setElement(res.elements)
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