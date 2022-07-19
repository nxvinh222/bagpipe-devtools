import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { basePath, loginPath } from './constants'

import 'antd/dist/antd.css';
import { Form, Button, Typography, Input, Col, Row, Space } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import axios from './axios';

const { Title } = Typography;

const Register = (props) => {
    const navigate = useNavigate();

    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue({
            email: "vinh1@gmail.com",
            password: "123456",
            confirm: "123456"
        });
    }, []);

    const onFinish = (values) => {
        axios.
            post(`/api/v1/register`, {
                email: values.email,
                password: values.password,
                first_name: values.first_name,
                last_name: values.last_name
            }
            ).
            then(response => {
                localStorage.removeItem("token");
                props.setSelectedKey("1");
                navigate(loginPath);
            })
            .catch(err => {
                console.log("[Bagpipe] Cannot register: ", err);
                form.setFields([
                    {
                        name: 'email',
                        errors: ['This email have already exists!'],
                    },
                ]);
            })
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
                <Col span={12}>
                    <Space
                        direction="vertical"
                        size="middle"
                        style={{
                            display: 'flex',
                        }}
                    >
                        <Title level={3}>Register New Account</Title>
                        <Form
                            name="basic"
                            form={form}
                            labelCol={{
                                span: 5,
                            }}
                            wrapperCol={{
                                span: 15,
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
                                <Input placeholder="Email" />
                            </Form.Item>

                            <Form.Item
                                label="Password"
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your password!',
                                    },
                                    {
                                        message: 'Password must have at least 6 character!',
                                        validator: (_, value) => {
                                            if (value.length < 6) {
                                                return Promise.reject('Some message here');
                                            } else {
                                                return Promise.resolve();
                                            }
                                        }
                                    }
                                ]}
                            >
                                <Input.Password placeholder="Password" />
                            </Form.Item>

                            <Form.Item
                                name="confirm"
                                label="Confirm Password"
                                dependencies={['password']}
                                hasFeedback
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please confirm your password!',
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }

                                            return Promise.reject(new Error('The two passwords that you entered do not match!'));
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password placeholder="Confirm Password" />
                            </Form.Item>

                            <Form.Item
                                label="First Name"
                                name="first_name"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your first name!',
                                    },
                                ]}
                            >
                                <Input placeholder="First Name" />
                            </Form.Item>

                            <Form.Item
                                label="Last Name"
                                name="last_name"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your last name!',
                                    },
                                ]}
                            >
                                <Input placeholder="Last Name" />
                            </Form.Item>

                            <Form.Item
                                wrapperCol={{
                                    offset: 8,
                                    span: 16,
                                }}
                            >
                                <Button type="primary" htmlType="submit">
                                    Register
                                </Button>
                            </Form.Item>
                        </Form>
                    </Space>

                </Col>
            </Row>

        </div>
    )
}

export default Register;
