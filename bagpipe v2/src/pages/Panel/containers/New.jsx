import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { basePath, editRecipePath, recipeIdQuery, idColumn } from './constants'

import 'antd/dist/antd.css';
import { Form, Input, Button, Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import axios from './axios';

const New = (props) => {
    const navigate = useNavigate();
    const useQuery = () => new URLSearchParams(useLocation().search);
    let query = useQuery();

    const nameColumn = "name"
    const urlColumn = "start_url"
    const noteColumn = "note"

    // Check if this is an edit form
    let isEdit = false;
    if (window.location.href.toString().split(window.location.host)[1].startsWith(editRecipePath)) {
        isEdit = true;
        console.log("This is edit recipe form!");
    }

    const recipeId = query.get(recipeIdQuery);
    var showRecipePath = basePath + "/show/"

    const [form] = Form.useForm();

    useEffect(() => {
        if (isEdit) {
            let url = `/api/v1/recipes/${recipeId}`

            axios.
                get(url).
                then(response => {
                    // console.log(response.data.data);

                    form.setFieldsValue({
                        name: response.data.data.name,
                        start_url: response.data.data.start_url,
                        note: response.data.data.note,
                    });

                })
                .catch(err => console.log("[Bagpipe] Cannot get recipe info: ", err))
        }
    }, []);

    const onFinish = (values) => {
        if (isEdit) {
            axios.
                put(`/api/v1/recipes/${recipeId}`, {
                    [nameColumn]: values[nameColumn],
                    [urlColumn]: values[urlColumn],
                    [noteColumn]: values[noteColumn],
                }
                ).
                then(response => {
                    console.log(response);
                    navigate(basePath)
                })
                .catch(err => console.log("[Bagpipe] Cannot update recipe: ", err))
        } else {
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
                .catch(err => console.log("[Bagpipe] Cannot create new recipe: ", err))
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const onCancel = () => {
        navigate(basePath);
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
                    <Button type="danger" htmlType="button" onClick={onCancel}>
                        Cancel
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default New;
