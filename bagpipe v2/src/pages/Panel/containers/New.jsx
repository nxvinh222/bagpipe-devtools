import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { basePath } from './constants'

import 'antd/dist/antd.css';
import { Form, Input, Button } from 'antd';

const New = (props) => {
    const showRecipePath = basePath + "/show/vne"
    const navigate = useNavigate();

    const onFinish = (values) => {
        console.log('Success:', values);
        navigate(showRecipePath)
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
