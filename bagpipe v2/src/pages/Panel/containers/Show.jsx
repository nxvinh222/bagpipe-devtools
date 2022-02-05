import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import './css/Show.css';
import { basePath, newAttrPath } from './constants'

import downloadjs from "downloadjs";
import { useParams } from 'react-router-dom'
import { Table, Button, Tag, Modal, Form, Input, Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";

import { data } from './Data/ShowData'
import { buildBody } from './Utils/bodyBuilder';
import { CRAWL_URL } from './env';

const Show = (props) => {
    let { recipeId } = useParams();
    const [loadings, setLoadings] = useState([]);
    const [selectors, setSelectors] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: text => <a>{text}</a>,
        },
        {
            title: 'Selector',
            dataIndex: 'selector',
            key: 'selector',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Multitple',
            key: 'multitple',
            dataIndex: 'multitple',
            render: multiple => (
                <Tag color={multiple == "yes" ? 'green' : 'red'} key={multiple}>
                    {multiple.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Button onClick={() => {
                    var tempSelectors = selectors;
                    tempSelectors = tempSelectors.filter((selector) => {
                        return selector.name != record.name
                    })
                    console.log("new temp selector: ", {
                        name: record.name,
                        tempSelectors: tempSelectors
                    });


                    chrome.storage.sync.get("recipes", function (res) {
                        let tempRecipes = res.recipes;

                        tempRecipes[`${recipeId}`] = tempSelectors;
                        chrome.storage.sync.set({ "recipes": tempRecipes }, function () {
                            console.log("delete attr success, new recipe setted: ", tempRecipes);
                        });
                        setSelectors(tempSelectors)
                    });
                }}>
                    <a>Delete</a>
                </Button>
            ),
        }
    ];

    // new recipe path: /show/newattr?recipeId=vne
    const newAttrPathWithQuery = newAttrPath + "?" + new URLSearchParams({
        recipeId: recipeId
    }).toString()

    useEffect(() => {
        var url = new URL(window.location.href);
        console.log(url.searchParams.get('domain'));

        chrome.storage.sync.get("recipes", function (res) {
            if (selectors.length == res.recipes[`${recipeId}`].length) return;
            // if (res.recipes[`${recipeId}`] == null) {
            //     setSelectors([]);
            //     return;
            // }
            setSelectors(res.recipes[`${recipeId}`]);
        });
    });

    const enterLoading = (status, index = 0) => {
        let newLoadings = [...loadings];
        newLoadings[index] = status;
        setLoadings(newLoadings)
    };

    const onFinishConfigCrawler = (values) => {
        console.log('Success:', values);
        scrape();
    };

    const onFinishFailedConfigCrawler = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    const elementBody = buildBody(selectors);
    const scrape = () => {
        console.log("Scraping!");
        console.log("Calling ", CRAWL_URL);
        enterLoading(true);
        fetch(CRAWL_URL, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(elementBody),
        })
            //1st solution
            // .then(res =>
            //     res.blob()
            // )
            // .then(blob => {
            //     var file = window.URL.createObjectURL(blob);
            //     window.location.assign(file);
            // })
            //2nd
            .then(response => {
                if (response.status === 200) {
                    return response.blob();
                } else {
                    return;
                }
            })
            .then(body => {
                downloadjs(body, "data.json", "application/octet-stream");
                enterLoading(false);
            })
            .catch(e => {
                //json is invalid and other e
                console.log(e);
            });
    }

    return (
        <div className="show">
            <Breadcrumb separator=">">
                <Breadcrumb.Item href={basePath}>
                    <HomeOutlined />
                </Breadcrumb.Item>
                <Breadcrumb.Item>Recipe: {recipeId}</Breadcrumb.Item>
            </Breadcrumb>
            <Button type="primary">
                <Link to={{
                    pathname: newAttrPathWithQuery,
                    state: {
                        setSelectors: setSelectors
                    }
                }}
                >
                    New Selector
                </Link>
            </Button>
            <Table
                rowKey={row => row.name}
                dataSource={selectors}
                columns={columns} />
            <Button type="primary" loading={loadings[0]} onClick={showModal}>
                Start Scrapring!
            </Button>
            <Modal title="Config Crawler" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Form
                    name="basic"
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinishConfigCrawler}
                    onFinishFailed={onFinishFailedConfigCrawler}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Request interval (ms)"
                        name="request-interval"
                        rules={[]}
                    >
                        <Input placeholder="Leave it blank if you want to use default value" />
                    </Form.Item>

                    <Form.Item
                        label="Page load delay (ms)"
                        name="load-delay"
                        rules={[]}
                    >
                        <Input placeholder="Leave it blank if you want to use default value (1000ms)" />
                    </Form.Item>

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
        </div>
    )
}

export default Show;
