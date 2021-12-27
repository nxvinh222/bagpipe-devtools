import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import './css/Show.css';
import { newAttrPath } from './constants'

import downloadjs from "downloadjs";
import { useParams } from 'react-router-dom'
import { Table, Button, Tag } from 'antd';
import { Link } from "react-router-dom";

import { data } from './Data/ShowData'
import { buildBody } from './Utils/bodyBuilder';
import { CRAWL_URL } from './env';

const Show = (props) => {
    let { recipeId } = useParams();
    const [loadings, setLoadings] = useState([]);
    const [selectors, setSelectors] = useState(data);
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
        chrome.storage.sync.get("recipes", function (res) {
            if (res.recipes[`${recipeId}`].length != null)
                if (selectors.length == res.recipes[`${recipeId}`].length) return;
            setSelectors(res.recipes[`${recipeId}`]);
        });
    });

    const enterLoading = (status, index = 0) => {
        let newLoadings = [...loadings];
        newLoadings[index] = status;
        setLoadings(newLoadings)
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
            <Button type="primary" loading={loadings[0]} onClick={scrape}>
                Start Scrapring!
            </Button>
        </div>
    )
}

export default Show;
