import React, { useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { basePath, registerPath } from './constants'

import 'antd/dist/antd.css';
import { Form, Button, Typography, Input, Col, Row, Space } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import axios from './axios';

const { Title } = Typography;

const Login = (props) => {
    const navigate = useNavigate();

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
            .catch(err => {
                console.log("[Bagpipe] Cannot login: ", err);
                form.setFields([
                    {
                        name: 'email',
                        errors: ['Invalid email or password!'],
                    },
                    {
                        name: 'password',
                        errors: ['Invalid email or password!'],
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
                <Col span={8}>
                    <Title level={2}>Welcome to BagpipeScrape!</Title>
                    <Space
                        direction="vertical"
                        size="middle"
                        style={{
                            display: 'flex',
                        }}
                    >
                        <div>You need to login or register before using this tool</div>
                        <Form
                            name="basic"
                            form={form}
                            labelCol={{
                                span: 4,
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
                                ]}
                            >
                                <Input.Password placeholder="Password" />
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
                                <span> or <Link to={registerPath} onClick={() => { props.setSelectedKey("2"); }}>Register</Link></span>
                            </Form.Item>
                        </Form>
                    </Space>

                </Col>
            </Row>

        </div>
    )
}

export default Login;
