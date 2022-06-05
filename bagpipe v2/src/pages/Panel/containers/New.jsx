import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { basePath } from './constants'

import 'antd/dist/antd.css';
import { Form, Input, Button, Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import axios from './axios';

const New = (props) => {
    const nameColumn = "name"
    const urlColumn = "start_url"
    const noteColumn = "note"

    var showRecipePath = basePath + "/show/"
    const navigate = useNavigate();

    const onFinish = (values) => {
        axios.
            post(`/api/v1/recipes`, {
                [nameColumn]: values[nameColumn],
                [urlColumn]: values[urlColumn],
                [noteColumn]: values[noteColumn],
            }
            ).
            then(response => {
                console.log(response);
                navigate(basePath)
            })
            .catch(err => console.log(err))
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className="new-recipe">
            <Breadcrumb separator=">">
                <Breadcrumb.Item href={basePath}>
                    <HomeOutlined />
                </Breadcrumb.Item>
                <Breadcrumb.Item>New Recipe</Breadcrumb.Item>
            </Breadcrumb>
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
                    label="Name"
                    name={nameColumn}
                    rules={[
                        {
                            required: true,
                            message: 'Please input your recipe name!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Domain"
                    name={urlColumn}
                    rules={[
                        {
                            required: true,
                            message: 'Please input your start url!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Note"
                    name={noteColumn}
                    rules={[
                        {
                            required: false,
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
