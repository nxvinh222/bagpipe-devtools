import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import './css/Show.css';
import { basePath, newAttrPath, showRecipeBasicPath, editAttrPath } from './constants'

import downloadjs from "downloadjs";
import { useParams } from 'react-router-dom'
import { Table, Button, Tag, Modal, Form, Input, InputNumber, Breadcrumb } from 'antd';
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
    // console.log("father element id: ", fatherId);
    const elementIdQuery = 'elementId';

    let { recipeId } = useParams();
    const [loadings, setLoadings] = useState([]);
    const [selectors, setSelectors] = useState([]);
    const [breadCrumbList, setBreadCrumbList] = useState([]);
    const [recipeName, setRecipeName] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [crawlConfigForm] = Form.useForm();
    crawlConfigForm.setFieldsValue({
        request_interval: 500,
        load_delay: 500
    });

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };


    const getData = (fatherId) => {
        let url = `/api/v1/recipes/${recipeId}/elements`
        // console.log(fatherId);
        if (fatherId != "null" && fatherId != null) {
            url = `/api/v1/recipes/${recipeId}/elements?father_id=${fatherId}`
        }
        console.log("url: ", url);
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

    const getBreadCrumbData = (id) => {
        // get breadcrumb data
        let graphUrl = `/api/v1/elements/graph/${id}`
        console.log("alo");
        console.log(id);
        if (id != null) {
            console.log("alo");
            axios.
                get(graphUrl).
                then(response => {
                    console.log("bc: ", response.data.data);
                    setBreadCrumbList(response.data.data.reverse())
                })
                .catch(err => console.log(err))
        }
    }

    const columns = [
        {
            title: 'Name',
            dataIndex: nameColumn,
            key: nameColumn,
            render: (text, record) => {
                //  check if this attribute an object
                if (record[typeColumn] != "object" && record[typeColumn] != "link") return <div>{text}</div>

                let urlParams = new URLSearchParams(window.location.search);
                urlParams.set(fatherIdQuery, record[idColumn]);
                let path = showRecipeBasicPath + `${recipeId}` + "?" + urlParams.toString();
                return <Link
                    to={{ pathname: path }}
                    onClick={() => {
                        getData(record[idColumn]);
                        getBreadCrumbData(record[idColumn]);
                    }}>
                    {text}
                </Link>
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
                <div>
                    <Button>
                        <Link to={{
                            pathname: editAttrPathWithQuery + `&${elementIdQuery}=${record[idColumn]}`,
                        }}
                        >
                            Edit
                        </Link>
                    </Button>
                    <Button onClick={() => {
                        axios.
                            delete(`/api/v1/elements/${record[idColumn]}`).
                            then(
                                r => {
                                    console.log(r);
                                    getData(fatherId);
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
                </div>
            ),
        }
    ];

    // new recipe path: /show/newattr?recipeId=1
    let urlParams = new URLSearchParams(window.location.search);
    urlParams.set('recipeId', recipeId);
    urlParams.set(fatherIdQuery, fatherId);
    const newAttrPathWithQuery = newAttrPath + "?" + urlParams.toString();
    const editAttrPathWithQuery = editAttrPath + "?" + urlParams.toString();

    useEffect(() => {
        getData(fatherId);
        getBreadCrumbData(fatherId);
        // get recipe name
        axios.
            get(`/api/v1/recipes/${recipeId}?simple=1`).
            then(
                r => {
                    setRecipeName(r.data.data.name)
                }
            ).catch(e => console.log(e))
    }, []);

    const enterLoading = (status, index = 0) => {
        let newLoadings = [...loadings];
        newLoadings[index] = status;
        setLoadings(newLoadings)
    };

    const onFinishConfigCrawler = (values) => {
        console.log('Success:', values);
        setIsModalVisible(false)
        scrape(values);
    };

    const onFinishFailedConfigCrawler = (errorInfo) => {
        console.log('Failed:', errorInfo);
        setIsModalVisible(false)
    };
    const scrape = (config) => {
        console.log("Scraping!");
        console.log("Calling ", env.CRAWL_URL);
        enterLoading(true);
        axios.
            get(`/api/v1/recipes/${recipeId}`).
            then(response => {
                const elementBody = buildBody(
                    response.data.data.start_url,
                    response.data.data.elements,
                    config
                );

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

    const threedot = function () {
        if (fatherId != null)
            return (<Breadcrumb.Item>...</Breadcrumb.Item>)
    }()

    const testbread = breadCrumbList.map((item) => {
        return (
            <Breadcrumb.Item>
                <Link
                    to={{ pathname: showRecipeBasicPath + `${recipeId}?fatherId=${item.id}` }}
                    onClick={() => {
                        getData(item.id);
                        getBreadCrumbData(item.id);
                    }}>
                    {item.name}
                </Link>
            </Breadcrumb.Item>
        )
    })

    return (
        <div className="show">
            <div className="bagpipe-breadcrumb">
                <Breadcrumb separator=">">
                    <Breadcrumb.Item href={basePath}>
                        <HomeOutlined />
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <Link
                            to={{
                                pathname: showRecipeBasicPath + recipeId,
                            }}
                            onClick={() => {
                                getData(null);
                                setBreadCrumbList([])
                            }}
                        >
                            <b>Recipe: </b>{recipeName}
                        </Link>
                        {/* <a href={showRecipeBasicPath + recipeId}>
                            Recipe: {recipeName}
                        </a> */}
                    </Breadcrumb.Item>
                    {testbread}
                </Breadcrumb>
            </div>
            <Button type="primary">
                <Link to={{
                    pathname: newAttrPathWithQuery,
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
            <Modal title="Config Crawler"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={null}
            >
                <Form
                    name="basic"
                    form={crawlConfigForm}
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
                        label="Crawl item limit"
                        name="item_limit"
                        rules={[]}
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

                    <Form.Item
                        label="Page load delay (ms)"
                        name="load_delay"
                        rules={[]}
                    >
                        <InputNumber />
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
