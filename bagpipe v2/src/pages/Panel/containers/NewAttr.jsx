import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { showRecipeBasicPath, editAttrPath } from './constants'

import { Form, Input, Button, Select, Typography, TreeSelect } from 'antd';

import axios from './axios';
import { data } from './Data/ShowData';
const { Text } = Typography;

const NewAttr = (props) => {
    const navigate = useNavigate();
    const useQuery = () => new URLSearchParams(useLocation().search);
    let query = useQuery();

    const fatherIdQuery = 'fatherId';
    const fatherId = query.get(fatherIdQuery);
    const recipeId = query.get('recipeId');
    const elementIdQuery = 'elementId';
    const elementId = query.get(elementIdQuery);
    const [element, setElement] = useState('');
    const [currentType, setCurrentType] = useState('');
    const [isCrawlResultFailVisible, setIsCrawlResultFailVisible] = useState(false);
    const [createFailMsg, setCreateFailMsg] = useState("");

    const [form] = Form.useForm();

    const showRecipePath = showRecipeBasicPath + recipeId

    // Check if this is an edit form
    let isEdit = false;
    if (window.location.href.toString().split(window.location.host)[1].startsWith(editAttrPath)) {
        isEdit = true;
        console.log("This is edit element form!");
    }



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
            if (request.action == "set-selected-element") {
                if (currentType == "image-auto") {
                    setElement(request.data + " img")
                }
                else {
                    setElement(request.data);
                }
            }
        });


        // if (isEdit) {
        //     form.setFieldsValue({
        //         name: 'Hi, man!',
        //     });
        // }
    });

    useEffect(() => {
        if (isEdit) {
            let url = `/api/v1/elements/${elementId}`

            axios.
                get(url).
                then(response => {
                    // console.log(response.data.data);

                    form.setFieldsValue({
                        name: response.data.data.name,
                        type: response.data.data.type,
                    });

                    setElement(response.data.data.selector)
                })
                .catch(err => console.log(err))
        }
    }, []);

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
            `$('${element}').addClass("click-hova");`
        );
    }
    const removePreview = () => {
        document.querySelector('.preview').style.display = "inline-block";
        document.querySelector('.remove-preview').style.display = "none";
        chrome.devtools.inspectedWindow.eval(
            `$('.click-hova').removeClass("click-hova");`
        );
    }

    const onFinish = (values) => {
        // console.log('Success:', values);
        if (isEdit) {
            let updateBody = {
                name: values.name,
                selector: element,
                type: values.type,
            }

            axios.
                put(`/api/v1/elements/${elementId}`, updateBody).
                then(response => {
                    console.log(response);

                    let urlParams = new URLSearchParams(window.location.search);
                    urlParams.set(fatherIdQuery, fatherId);
                    let path = showRecipeBasicPath + `${recipeId}` + "?" + urlParams.toString();
                    navigate(path)
                })
                .catch(err => {
                    setFailMsg(err);
                })
        } else {
            let requestBody = {
                element_id: parseInt(fatherId),
                name: values.name,
                selector: element,
                type: values.type,
                multitple: "yes",
            }
            if (requestBody.element_id == "null") {
                delete requestBody.element_id
            }
            axios.
                post(`/api/v1/recipes/${recipeId}/elements`, {
                    elements: [
                        requestBody
                    ]
                }).
                then(response => {
                    console.log(response);

                    let urlParams = new URLSearchParams(window.location.search);
                    urlParams.set(fatherIdQuery, fatherId);
                    let path = showRecipeBasicPath + `${recipeId}` + "?" + urlParams.toString();
                    navigate(path);
                })
                .catch(err => {
                    setFailMsg(err);
                })
        }
    };

    const setFailMsg = (err) => {
        console.log("cannot create element: ", err.response.data)
        if (err.response.data.error_key == "ErrAttributeNameAlreadyExists") {
            setIsCrawlResultFailVisible(true);
            setCreateFailMsg("Duplicate element name!");
        } else {
            setIsCrawlResultFailVisible(true);
            setCreateFailMsg("Something wrong happened!");
        }
    }

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const onCancel = () => {
        let urlParams = new URLSearchParams(window.location.search);
        urlParams.set(fatherIdQuery, fatherId);
        let path = showRecipeBasicPath + `${recipeId}` + "?" + urlParams.toString();
        navigate(path);
    };

    return (
        <div>
            <div>Click "Select Element" to start extracting information from the website.</div>
            <Form
                name="basic"
                form={form}
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
                        {
                            message: 'Element name must contain only letters (a-z, A-Z), numbers (0-9), or underscores ( _ )',
                            validator: (_, value) => {
                                if (/^[a-zA-Z0-9_]+$/.test(value)) {
                                    return Promise.resolve();
                                } else {
                                    return Promise.reject('Some message here');
                                }
                            }
                        }
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
                        {
                            message: 'Root Element must be an Object Element!',
                            validator: (_, value) => {
                                if (fatherId == "null" && value != "object") {
                                    return Promise.reject('Some message here');
                                } else {
                                    return Promise.resolve();
                                }
                            }
                        }
                    ]}
                >
                    {/* <Select
                        placeholder="Select type of data you want to scrape"
                        onChange={(value) => {
                            setCurrentType(value)
                            if (value == "image-auto" && element.slice(-3) != "img")
                                setElement(element + " img")
                        }}
                        allowClear
                    >
                        <Option value="object">Object</Option>
                        <Option value="text">Text</Option>
                        <Option value="link">Link</Option>
                        <Option value="image">Image</Option>
                        <Option value="image-auto">Image <b>(Auto scan)</b></Option>
                        <Option value="paragraph">Paragraph</Option>
                        <Option value="click">Click <b>(Action)</b></Option>
                    </Select> */}
                    <TreeSelect
                        treeData={[
                            {
                                title: "Object",
                                value: "object",
                            },
                            {
                                title: "Text",
                                value: "text",
                                children: [
                                    {
                                        title: "Paragraph",
                                        value: "paragraph"
                                    }
                                ],
                            },
                            {
                                title: "Link",
                                value: "link",
                                children: [
                                    {
                                        title: "Link (Href Link)",
                                        value: "link-href"
                                    }
                                ]
                            },
                            {
                                title: "Image",
                                value: "image",
                                children: [
                                    {
                                        title: "Image (Auto scan)",
                                        value: "image-auto"
                                    }
                                ]
                            },
                            {
                                title: "Click",
                                value: "click",
                                children: [
                                    {
                                        title: "Click (Infinity click)",
                                        value: "click-infinity"
                                    }
                                ]
                            },
                            {
                                title: "Map",
                                value: "map",
                            }
                        ]}
                    />
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

                    <div>Selected Element's Selector:
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

                <Form.Item
                    wrapperCol={{
                        offset: 3,
                        span: 9,
                    }}
                >
                    {isCrawlResultFailVisible && <CrawlMsgFail createFailMsg={createFailMsg} />}
                </Form.Item>
            </Form>
        </div>
    )
}

const CrawlMsgFail = (props) => (
    <div className="crawl-result-fail-msg">
        <Text type="danger">
            <b>{props.createFailMsg}</b>
        </Text>
    </div>
);

export default NewAttr