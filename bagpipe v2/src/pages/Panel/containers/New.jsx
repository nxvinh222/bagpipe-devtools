import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { basePath } from './constants'

import 'antd/dist/antd.css';
import { Form, Input, Button } from 'antd';

const New = (props) => {
    var showRecipePath = basePath + "/show/"
    const navigate = useNavigate();

    const onFinish = (values) => {
        chrome.storage.sync.get("crawlers", function (res) {
            showRecipePath += values.id;
            let tempCrawlers = res.crawlers || [];
            console.log("old crawlers: ", res.crawlers);

            tempCrawlers.unshift({
                id: values.id,
                domain: values.domain,
                comment: values.comment,
            });
            console.log("new crawlers: ", tempCrawlers);
            chrome.storage.sync.set({ "crawlers": tempCrawlers }, function () {
                console.log("new crawlers setted: ", tempCrawlers);

                //create blank recipe in storage
                chrome.storage.sync.get("recipes", function (res) {
                    let tempRecipes = res.recipes;
                    tempRecipes[`${values.id}`] = [];
                    chrome.storage.sync.set({ "recipes": tempRecipes }, () => {
                        navigate(basePath)
                    });
                });

            });


        });
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className="new-recipe">
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
                    label="ID"
                    name="id"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your ID!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Domain"
                    name="domain"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your domain!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Comment"
                    name="comment"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your comment!!',
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
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default New;
