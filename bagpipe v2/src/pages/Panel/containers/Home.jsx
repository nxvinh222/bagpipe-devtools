import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import './css/Home.css';
import { basePath, newRecipePath, showRecipeBasicPath } from './constants'

import { Table, Button, Breadcrumb, Typography } from 'antd';
import { AliwangwangOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
import { data } from './Data/HomeData'
import axios from './axios';

const Home = (props) => {
    // crawlers = [
    //     {
    //         comment: 'vne', 
    //         domain: 'https://vnexpress.net/', 
    //         id: 'vnexpress'
    //     },
    // ]
    const [crawlers, setCrawlers] = useState([]);
    const idNameColumn = "id"
    const nameColumn = "name"
    const urlColumn = "start_url"
    const commentColumn = "note"
    const { Title } = Typography;

    const getData = () => {
        axios.
            get("/api/v1/recipes").
            then(response => {
                // console.log(response.data.data);
                let recipes = response.data.data.map(recipe => ({
                    [idNameColumn]: recipe[idNameColumn],
                    [nameColumn]: recipe[nameColumn],
                    [urlColumn]: recipe[urlColumn],
                    [commentColumn]: recipe[commentColumn]
                })
                )
                console.log("recipes: " + recipes);
                setCrawlers(recipes)
            })
            .catch(err => console.log(err))
    }

    const columns = [
        {
            title: 'Name',
            dataIndex: nameColumn,
            key: nameColumn,
            sorter: (a, b) => a[nameColumn].localeCompare(b[nameColumn]),
            render: (text, record) => {
                // let urlParams = new URLSearchParams(window.location.search);
                // urlParams.set('domain', record.domain);
                // let path = showRecipeBasicPath + text + "?" + urlParams.toString();
                let path = showRecipeBasicPath + record.id
                console.log(path);
                return <Link to={path}><b>{text}</b></Link>
            }
            ,
        },
        {
            title: 'Start Url',
            dataIndex: urlColumn,
            key: urlColumn,
        },
        {
            title: 'Note',
            dataIndex: commentColumn,
            key: commentColumn,
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Button onClick={() => {
                    axios.
                        delete(`/api/v1/recipes/${record[idNameColumn]}`).
                        then(
                            r => {
                                console.log(r);
                                getData();
                            }
                        ).catch(e => console.log(e))
                    // var tempCrawlers = crawlers;
                    // tempCrawlers = tempCrawlers.filter((crawler) => {
                    //     return crawler.id != record.id
                    // })

                    // chrome.storage.sync.set({ "crawlers": tempCrawlers }, function () {
                    //     console.log("delete crawler success, new crawler list setted: ", tempCrawlers);
                    //     // setCrawlers(tempCrawlers)
                    // });
                }}>
                    <a>Delete</a>
                </Button>
            ),
        }
    ]

    useEffect(() => {
        getData()
    }, []);

    return (
        <div className="home">
            <Title level={3}>
                Recipe list <AliwangwangOutlined />
            </Title>
            {/* <Breadcrumb separator=">">
                <Breadcrumb.Item href={basePath}>
                    <HomeOutlined />
                </Breadcrumb.Item>
            </Breadcrumb> */}
            <Button type="primary">
                <Link to={newRecipePath}>Add Recipe</Link>
            </Button>
            <Table
                rowKey={row => row.id}
                dataSource={crawlers}
                columns={columns}
            />;
        </div>
    )
}

export default Home;
