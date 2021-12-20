import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import { useLocation, Link } from 'react-router-dom';
import { showRecipeBasicPath } from './constants'

import { Form, Input, Button } from 'antd';

const NewAttr = (props) => {
    const useQuery = () => new URLSearchParams(useLocation().search);
    let query = useQuery();

    const recipeId = query.get('recipeId')
    const [element, setElement] = useState()

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

    const setNewSelector = () => {
        chrome.storage.sync.get("recipes", function (res) {
            let tempRecipes = res.recipes
            console.log("old recipe: ", res.recipes);

            tempRecipes[`${recipeId}`].push({
                name: 'title',
                selector: element,
                type: "Text",
                multitple: "yes",
            })
            chrome.storage.sync.set({ "recipes": tempRecipes }, function () {
                console.log("new recipe setted: ", tempRecipes);
            });
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
                        <Link to={showRecipePath} onClick={setNewSelector}>
                            Finish
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default NewAttr