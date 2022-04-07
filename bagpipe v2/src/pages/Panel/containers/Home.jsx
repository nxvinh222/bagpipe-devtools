import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import './css/Home.css';
import { basePath, newRecipePath, showRecipeBasicPath } from './constants'

import { Table, Button, Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
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
    const urlColumn = "domain"
    const commentColumn = "comment"

    const columns = [
        {
            title: 'Name',
            dataIndex: nameColumn,
            key: nameColumn,
            render: (text, record) => {
                let urlParams = new URLSearchParams(window.location.search);
                urlParams.set('domain', record.domain);
                // let path = showRecipeBasicPath + text + "?" + urlParams.toString();
                let path = showRecipeBasicPath + record.id
                console.log(path);
                return <Link to={path}>{text}</Link>
            }
            ,
        },
        {
            title: 'Domain',
            dataIndex: urlColumn,
            key: urlColumn,
        },
        {
            title: 'Comment',
            dataIndex: commentColumn,
            key: commentColumn,
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Button onClick={() => {
                    var tempCrawlers = crawlers;
                    tempCrawlers = tempCrawlers.filter((crawler) => {
                        return crawler.id != record.id
                    })

                    chrome.storage.sync.set({ "crawlers": tempCrawlers }, function () {
                        console.log("delete crawler success, new crawler list setted: ", tempCrawlers);
                        // setCrawlers(tempCrawlers)
                    });
                }}>
                    <a>Delete</a>
                </Button>
            ),
        }
    ]

    useEffect(() => {
        axios.
            get("/api/v1/recipes").
            then(response => {
                // console.log(response.data.data);
                let recipes = response.data.data.map(recipe => ({
                    [idNameColumn]: recipe.id,
                    [nameColumn]: recipe.name,
                    [urlColumn]: recipe.start_url,
                    [commentColumn]: recipe.note
                })
                )
                console.log("recipes: " + recipes);
                setCrawlers(recipes)
            })
            .catch(err => console.log(err))

        // chrome.storage.sync.get("crawlers", function (res) {
        //     if (res.crawlers.length != null)
        //         if (crawlers.length == res.crawlers.length) return;
        //     setCrawlers(res.crawlers);
        // });
    }, []);

    return (
        <div className="home">
            <Breadcrumb separator=">">
                <Breadcrumb.Item href={basePath}>
                    <HomeOutlined />
                </Breadcrumb.Item>
            </Breadcrumb>
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
