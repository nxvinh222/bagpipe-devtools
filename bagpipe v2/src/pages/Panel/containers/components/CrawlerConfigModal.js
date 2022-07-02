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
    const warningMsg = "If you change this field, information about previous running will be lost";
    const [disableAttributeDropdown, setDisableAttributeDropdow] = useState(true);

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
                <Form.Item label="Crawl records limit" name="item_limit"
                    rules={[
                        {
                            message: 'Crawl records limit must be larger than 0!',
                            validator: (_, value) => {
                                if (value > 0) {
                                    return Promise.resolve();
                                } else {
                                    return Promise.reject('Some message here');
                                }
                            }
                        }
                    ]}
                >
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

                <Form.Item
                    label="Exclude crawled data"
                    valuePropName="checked"
                    name="exclude"
                >
                    <Switch onChange={(value) => {
                        setDisableAttributeDropdow(!value)
                    }} />
                </Form.Item>
                <Form.Item
                    name="identifier_attr"
                    label="Identifier attribute"
                    rules={[
                        {
                            required: false,
                        },
                    ]}
                    validateStatus={props.attrNameChangeWarningMsg.status} help={props.attrNameChangeWarningMsg.msg}
                >
                    <Select
                        placeholder="Select the selector you want to choose as an identifier to distinguish data records"
                        onChange={(value) => {
                            if (props.identifierAttr != null && value != props.identifierAttr) {
                                props.setAttrNameChangeWarningMsg({
                                    msg: warningMsg,
                                    status: "warning"
                                });
                            } else {
                                props.setAttrNameChangeWarningMsg({
                                    msg: "",
                                    status: ""
                                });
                            }
                        }}
                        allowClear
                        defaultValue={props.identifierAttr}
                        disabled={disableAttributeDropdown}
                    >
                        {props.attrNameList.map((attr, index) => (
                            <Option value={attr}>{attr}</Option>
                        ))}
                        {/* <Option value="object">Object</Option> */}
                    </Select>
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                >
                    <Button type="primary" htmlType="submit">
                        Start Crawling!
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};


export default CrawlerConfigModal;
