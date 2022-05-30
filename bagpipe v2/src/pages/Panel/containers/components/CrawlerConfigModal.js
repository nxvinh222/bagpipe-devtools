import React, { useEffect, useState } from 'react';
import {
    Modal,
    Button,
    Form,
    InputNumber,
    Input,
    Switch,
    Select
} from 'antd';

const CrawlerConfigModal = (props) => {

    return (
        <Modal
            title="Config Crawler"
            visible={props.isModalVisible}
            onOk={props.handleOk}
            onCancel={props.handleCancel}
            footer={null}
            width="60vw"
        >
            <Form
                name="basic"
                form={props.crawlConfigForm}
                labelCol={{
                    span: 8,
                }}
                wrapperCol={{
                    span: 16,
                }}
                initialValues={{
                    remember: true,
                }}
                onFinish={props.onFinishConfigCrawler}
                onFinishFailed={props.onFinishFailedConfigCrawler}
                autoComplete="off"
            >
                <Form.Item label="Crawl item limit" name="item_limit" rules={[]}>
                    <InputNumber />
                </Form.Item>

                <Form.Item
                    label="Request interval (ms)"
                    name="request_interval"
                    rules={[]}
                >
                    <InputNumber />
                </Form.Item>

                {/* <Form.Item label="Page load delay (ms)" name="load_delay" rules={[]}>
            <InputNumber />
          </Form.Item> */}

                <Form.Item label="Google Sheet URL" name="sheet_id">
                    <Input placeholder="leave this blank if you don't want to export to google sheet" />
                </Form.Item>

                <Form.Item
                    label="Convert to PostgreSQL"
                    valuePropName="checked"
                    name="is_sql"
                >
                    <Switch />
                </Form.Item>

                {/* <Form.Item
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
                        onChange={(value) => {
                        }}
                        allowClear
                    >
                        <Option value="object">Object</Option>
                    </Select>
                </Form.Item> */}

                <Form.Item
                    wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                >
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};


export default CrawlerConfigModal;
