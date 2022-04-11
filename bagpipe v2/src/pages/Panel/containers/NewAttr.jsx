import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { showRecipeBasicPath } from './constants'

import { Form, Input, Button, Select } from 'antd';

import axios from './axios';

const NewAttr = (props) => {
    const navigate = useNavigate();
    const useQuery = () => new URLSearchParams(useLocation().search);
    let query = useQuery();

    const recipeId = query.get('recipeId')
    const [element, setElement] = useState('')

    const showRecipePath = showRecipeBasicPath + recipeId

    // Create a connection to the background page
    var backgroundPageConnection = chrome.runtime.connect({
        name: "panel"
    });

    backgroundPageConnection.postMessage({
        name: 'init',
        tabId: chrome.devtools.inspectedWindow.tabId
    });

    useEffect(() => {
        // get data from content script through background
        backgroundPageConnection.onMessage.addListener(function (request, sender, sendResponse) {
            if (request.action == "set-selected-element")
                setElement(request.data);
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

    const previewElement = () => {
        document.querySelector('.preview').style.display = "none";
        document.querySelector('.remove-preview').style.display = "inline-block";
        chrome.devtools.inspectedWindow.eval(
            `$("${element}").addClass("click-hova");`
        );
    }
    const removePreview = () => {
        document.querySelector('.preview').style.display = "inline-block";
        document.querySelector('.remove-preview').style.display = "none";
        chrome.devtools.inspectedWindow.eval(
            `$("${element}").removeClass("click-hova");`
        );
    }

    const onFinish = (values) => {
        // console.log('Success:', values);
        // chrome.storage.sync.get("recipes", function (res) {
        //     let tempRecipes = res.recipes
        //     console.log("old recipe: ", res.recipes);

        //     tempRecipes[`${recipeId}`].push({
        //         name: values.name,
        //         selector: element,
        //         type: "Text",
        //         multitple: "yes",
        //     })
        //     chrome.storage.sync.set({ "recipes": tempRecipes }, function () {
        //         console.log("new recipe setted: ", tempRecipes);
        //         navigate(showRecipePath)
        //     });
        // });
        axios.
            post(`/api/v1/recipes/${recipeId}/elements`, {
                elements: [
                    {
                        name: values.name,
                        selector: element,
                        type: values.type,
                        multitple: "yes",
                    }
                ]
            }).
            then(response => {
                console.log(response);
                navigate(showRecipePath)
            })
            .catch(err => console.log(err))
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const onCancel = () => {
        navigate(showRecipePath);
    };

    return (
        <div>
            <div>Select a new Attribute by clicking "Select Element"</div>
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
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="type"
                    label="Type"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Select
                        placeholder="Select type of data you want to scrape"

                        allowClear
                    >
                        <Option value="object">Object</Option>
                        <Option value="text">Text</Option>
                        <Option value="link">Link</Option>
                        {/* <Option value="popup-link">Popup Link</Option>
                        <Option value="table">Table</Option>
                        <Option value="html">Html</Option>
                        <Option value="attribute">Attribute Tag</Option> */}
                    </Select>
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                        offset: 3,
                        span: 16,
                    }}
                >
                    <Button type="primary" onClick={getElement}>
                        Select Element!
                    </Button>
                    <span className='preview'>
                        <Button type="ghost" danger onClick={previewElement}>
                            Preview Element
                        </Button>
                    </span>
                    <span className='remove-preview'>
                        <Button type="ghost" danger onClick={removePreview}>
                            Remove Preview
                        </Button>
                    </span>

                    <div>Element:
                        <div style={{ color: 'crimson' }}>{element}</div>
                    </div>
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
                    <Button type="danger" htmlType="button" onClick={onCancel}>
                        Cancel
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default NewAttr