import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import { useLocation, Link } from 'react-router-dom';
import { showRecipeBasicPath } from './constants'

import { Form, Input, Button } from 'antd';

const NewAttr = () => {
    const useQuery = () => new URLSearchParams(useLocation().search);
    let query = useQuery();

    const recipeId = query.get('recipeId')
    const [element, setElement] = useState("null")

    const showRecipePath = showRecipeBasicPath + recipeId

    useEffect(() => {
        chrome.storage.onChanged.addListener(function (changes, namespace) {
            if ("elements" in changes) {
                setElement(changes.elements.newValue);
            }
        });
    });

    const selectElementScript = function () {
        $(".bagpipe-scrape-inject").trigger('click');
    }

    const getElement = () => {
        let script = selectElementScript.toString() + "()"
        console.log(script);
        chrome.devtools.inspectedWindow.eval(
            `(${selectElementScript.toString()})()`
        );

        chrome.storage.sync.get("elements", function (res) {
            setElement(res.elements)
        });
    }

    return (
        <div>
            recipe id: {recipeId}
            <div>
                <div>
                    <Button type="primary" onClick={getElement}>
                        Select element!
                    </Button>
                </div>
                <div>
                    element: {element}
                </div>
                <div>
                    <Button type="primary">
                        <Link to={showRecipePath}>                    Finish
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default NewAttr