import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import './css/Show.css';
import { basePath, newAttrPath, showRecipeBasicPath } from './constants'

import downloadjs from "downloadjs";
import { useParams } from 'react-router-dom'
import { Table, Button, Tag, Modal, Form, Input, Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { Link, useLocation } from "react-router-dom";

import { data } from './Data/ShowData'
import { buildBody } from './Utils/bodyBuilder';
import env from './env';
import axios from './axios';

const Show = (props) => {
    const idColumn = "id"
    const nameColumn = "name"
    const selectorColumn = "selector"
    const typeColumn = "type"

    const useQuery = () => new URLSearchParams(useLocation().search);
    let query = useQuery();
    const fatherIdQuery = 'fatherId'
    const fatherId = query.get(fatherIdQuery)
    console.log("father element id: ", fatherId);

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


    const getData = () => {
        let url = `/api/v1/recipes/${recipeId}/elements`
        console.log(fatherId);
        if (fatherId != "null" && fatherId != null && fatherId.length > 0) {
            url = url + `?father_id=${fatherId}`
        }
        axios.
            get(url).
            then(response => {
                // console.log(response.data.data);
                let selectors = response.data.data.map(recipe => ({
                    [idColumn]: recipe.id,
                    [nameColumn]: recipe.name,
                    [selectorColumn]: recipe.selector,
                    [typeColumn]: recipe.type
                })
                )
                console.log("selectors: " + selectors);
                setSelectors(selectors)
            })
            .catch(err => console.log(err))
    }

    const columns = [
        {
            title: 'Name',
            dataIndex: nameColumn,
            key: nameColumn,
            render: (text, record) => {
                let urlParams = new URLSearchParams(window.location.search);
                urlParams.set(fatherIdQuery, record[idColumn]);
                let path = showRecipeBasicPath + `${recipeId}` + "?" + urlParams.toString();
                return <Link
                    to={{ pathname: path }}
                    onClick={() => {
                        axios.
                            get(`/api/v1/recipes/${recipeId}/elements?father_id=${record[idColumn]}`).
                            then(response => {
                                // console.log(response.data.data);
                                let selectors = response.data.data.map(recipe => ({
                                    [idColumn]: recipe.id,
                                    [nameColumn]: recipe.name,
                                    [selectorColumn]: recipe.selector,
                                    [typeColumn]: recipe.type
                                })
                                )
                                console.log("selectors: " + selectors);
                                setSelectors(selectors)
                            })
                            .catch(err => console.log(err))
                    }}>{text}</Link>
            },
        },
        {
            title: 'Selector',
            dataIndex: selectorColumn,
            key: selectorColumn,
        },
        {
            title: 'Type',
            dataIndex: typeColumn,
            key: typeColumn,
        },
        // {
        //     title: 'Multitple',
        //     key: 'multitple',
        //     dataIndex: 'multitple',
        //     render: multiple => (
        //         <Tag color={multiple == "yes" ? 'green' : 'red'} key={multiple}>
        //             {multiple.toUpperCase()}
        //         </Tag>
        //     ),
        // },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Button onClick={() => {
                    axios.
                        delete(`/api/v1/elements/${record[idColumn]}`).
                        then(
                            r => {
                                console.log(r);
                                getData();
                            }
                        ).catch(e => console.log(e))
                    // var tempSelectors = selectors;
                    // tempSelectors = tempSelectors.filter((selector) => {
                    //     return selector.name != record.name
                    // })
                    // console.log("new temp selector: ", {
                    //     name: record.name,
                    //     tempSelectors: tempSelectors
                    // });


                    // chrome.storage.sync.get("recipes", function (res) {
                    //     let tempRecipes = res.recipes;

                    //     tempRecipes[`${recipeId}`] = tempSelectors;
                    //     chrome.storage.sync.set({ "recipes": tempRecipes }, function () {
                    //         console.log("delete attr success, new recipe setted: ", tempRecipes);
                    //     });
                    //     setSelectors(tempSelectors)
                    // });
                }}>
                    <a>Delete</a>
                </Button>
            ),
        }
    ];

    // new recipe path: /show/newattr?recipeId=1
    let urlParams = new URLSearchParams(window.location.search);
    urlParams.set('recipeId', recipeId);
    urlParams.set(fatherIdQuery, fatherId);
    const newAttrPathWithQuery = newAttrPath + "?" + urlParams.toString()

    useEffect(() => {
        getData()

        // chrome.storage.sync.get("recipes", function (res) {
        //     if (selectors.length == res.recipes[`${recipeId}`].length) return;
        //     setSelectors(res.recipes[`${recipeId}`]);
        // });
    }, []);

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
    const scrape = () => {
        console.log("Scraping!");
        console.log("Calling ", env.CRAWL_URL);
        enterLoading(true);
        axios.
            get(`/api/v1/recipes/${recipeId}`).
            then(response => {
                const elementBody = buildBody(response.data.data.start_url, response.data.data.elements);

                fetch(env.CRAWL_URL, {
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
            })
    }

    return (
        <div className="show">
            <Breadcrumb separator=">">
                <Breadcrumb.Item href={basePath}>
                    <HomeOutlined />
                </Breadcrumb.Item>
                <Breadcrumb.Item>Recipe: {recipeId}</Breadcrumb.Item>
                <Breadcrumb.Item>Recipe: {recipeId}</Breadcrumb.Item>
            </Breadcrumb>
            <Button type="primary">
                <Link to={{
                    pathname: newAttrPathWithQuery,
                    // state: {
                    //     setSelectors: setSelectors
                    // }
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
