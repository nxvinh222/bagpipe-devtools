import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';

import {
    Form,
    Input,
    Button,
    Radio,
    Select,
    Cascader,
    DatePicker,
    InputNumber,
    TreeSelect,
    Switch,
} from 'antd';

const NewRecipe = () => {

    const componentSize = "large"

    useEffect(() => {

    });

    return (
        <Form
            labelCol={{
                span: 4,
            }}
            wrapperCol={{
                span: 14,
            }}
            layout="horizontal"
            size={componentSize}
        >
            <h1>Save Recipe</h1>
            {/* <Form.Item label="Form Size" name="size">
            </Form.Item> */}
            <Form.Item label="Recipe Name">
                <Input />
            </Form.Item>
            <Form.Item label="Recipe URL">
                <Select>
                    <Select.Option value="demo">Demo</Select.Option>
                </Select>
            </Form.Item>
            <Form.Item label="Attributes list">
            </Form.Item>
            {/* <Form.Item label="TreeSelect">
                <TreeSelect
                    treeData={[
                        {
                            title: 'Light',
                            value: 'light',
                            children: [
                                {
                                    title: 'Bamboo',
                                    value: 'bamboo',
                                },
                            ],
                        },
                    ]}
                />
            </Form.Item>
            <Form.Item label="Cascader">
                <Cascader
                    options={[
                        {
                            value: 'zhejiang',
                            label: 'Zhejiang',
                            children: [
                                {
                                    value: 'hangzhou',
                                    label: 'Hangzhou',
                                },
                            ],
                        },
                    ]}
                />
            </Form.Item> */}
            {/* <Form.Item label="DatePicker">
                <DatePicker />
            </Form.Item> */}
            <Form.Item label="Number of pages">
                <InputNumber />
            </Form.Item>
            <Form.Item label="Use javascript" valuePropName="checked">
                <Switch />
            </Form.Item>
            <Form.Item label="Cookies">
                <Input />
            </Form.Item>
            <Form.Item label="">
                <Button>Create Recipe</Button>
            </Form.Item>
        </Form>
    );
};

export default NewRecipe;
