import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { showRecipeBasicPath } from './constants'

import { Form, Input, Button } from 'antd';

const NewAttr = (props) => {
    const navigate = useNavigate();
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

    const onFinish = (values) => {
        // console.log('Success:', values);
        chrome.storage.sync.get("recipes", function (res) {
            let tempRecipes = res.recipes
            console.log("old recipe: ", res.recipes);

            tempRecipes[`${recipeId}`].push({
                name: values.name,
                selector: element,
                type: "Text",
                multitple: "yes",
            })
            chrome.storage.sync.set({ "recipes": tempRecipes }, function () {
                console.log("new recipe setted: ", tempRecipes);
                navigate(showRecipePath)
            });
        });
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div>
            <Form
                name="basic"
                labelCol={{
                    span: 3,
                }}
                wrapperCol={{
                    span: 9,
                }}
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    label="name"
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your name!!',
                        },
                    ]}
                    wrapperCol={{
                        span: 14,
                    }}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                        offset: 3,
                        span: 9,
                    }}
                >
                    <div>recipe id: {recipeId}</div>
                    <Button type="primary" onClick={getElement}>
                        Select element!
                    </Button>
                    <div>element: {element}</div>
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                        offset: 3,
                        span: 9,
                    }}
                >
                    <Button type="primary" htmlType="submit">
                        Finish
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default NewAttr