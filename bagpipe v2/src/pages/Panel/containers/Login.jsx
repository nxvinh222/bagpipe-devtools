import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { basePath, editRecipePath, recipeIdQuery, idColumn } from './constants'

import 'antd/dist/antd.css';
import { Form, Button, Checkbox, Input, Col, Row } from 'antd';
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
        form.setFieldsValue({
            email: "vinh1@gmail.com",
            password: "123456",
        });
        props.setUserData(null);
        localStorage.removeItem("token");
    }, []);

    const onFinish = (values) => {
        axios.
            post(`/api/v1/login`, {
                email: values.email,
                password: values.password
            }
            ).
            then(response => {
                localStorage.removeItem("token");
                localStorage.setItem('token', response.data.data.token);
                // chrome.storage.sync.set({ token: response.data.data.token });
                // console.log("token", response.data.token);
                // axios
                //     .get("/api/v1/profile", {
                //         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                //     })
                //     .then(response => {
                //         props.setUserData(response.data.data);
                //         console.log("data", response.data.data);
                //     }).catch(e => {
                //         console.log(e);
                //     })
                props.getUserData();
                navigate(basePath);
            })
            .catch(err => console.log("[Bagpipe] Cannot create new recipe: ", err))
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const onCancel = () => {
        navigate(basePath);
    };
    return (
        <div className="login">
            <Row type="flex" justify="center" align="middle" style={{ minHeight: '100vh' }}>
                <Col span={8}>
                    <Form
                        name="basic"
                        form={form}
                        labelCol={{
                            span: 8,
                        }}
                        wrapperCol={{
                            span: 16,
                        }}
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your email!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>

                        {/* <Form.Item
                            name="remember"
                            valuePropName="checked"
                            wrapperCol={{
                                offset: 8,
                                span: 16,
                            }}
                        >
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item> */}

                        <Form.Item
                            wrapperCol={{
                                offset: 8,
                                span: 16,
                            }}
                        >
                            <Button type="primary" htmlType="submit">
                                Login
                            </Button>
                            <span> or Register</span>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>

        </div>
    )
}

export default New;
