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
        alert("from panel")
        return 123
    }

    const getElement = () => {
        setElement("clicked")

        let script = selectElementScript.toString() + "()"
        console.log(script);
        chrome.devtools.inspectedWindow.eval(
            "(" + selectElementScript.toString() + ")()",
            function (result, isException) {
                if (isException) {
                    console.log("Result not received");
                } else {
                    console.log("Selected element: " + result);
                    setElement(result)
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