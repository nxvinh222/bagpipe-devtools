import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import './css/Home.css';
import { newRecipePath } from './constants'

import { Table, Button } from 'antd';
import { Link } from "react-router-dom";
import { data } from './Data/HomeData'

const Home = (props) => {
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            render: text => <a>{text}</a>,
        },
        {
            title: 'Domain',
            dataIndex: 'domain',
            key: 'domain',
        },
        {
            title: 'Comment',
            dataIndex: 'comment',
            key: 'comment',
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
                        setCrawlers(tempCrawlers)
                    });
                }}>
                    <a>Delete</a>
                </Button>
            ),
        }
    ]

    const [crawlers, setCrawlers] = useState(data);

    useEffect(() => {
        chrome.storage.sync.get("crawlers", function (res) {
            setCrawlers(res.crawlers);
        });
    });

    return (
        <div className="home">
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
