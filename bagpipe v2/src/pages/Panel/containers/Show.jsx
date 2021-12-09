import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import './Show.css';
import { newAttrPath } from './constants'

import downloadjs from "downloadjs";
import { useParams } from 'react-router-dom'
import { Table, Button } from 'antd';
import { Link } from "react-router-dom";

import { columns, data } from './Data/ShowData'

const Show = (props) => {
    let { recipeId } = useParams();
    const [selectors, setSelectors] = useState(data);
    const newAttrPathWithQuery = newAttrPath + "?" + new URLSearchParams({
        recipeId: recipeId
    }).toString()
    useEffect(() => {
        console.log(recipeId)
    });

    const elementBody = {
        url: "https://vnexpress.net/",
        elements: [
            {
                name: "title",
                selector: "article:nth-of-type(n+7) .title-news a",
                type: ""
            },
            {
                name: "content",
                selector: "article:nth-of-type(n+2) .description a[data-thumb='1']",
                type: ""
            }
        ]
    }
    const scrape = () => {
        console.log("Scraping!");
        fetch("http://localhost:7000/", {
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
            })
            .catch(e => {
                //json is invalid and other e
                console.log(e);
            });
    }

    return (
        <div className="show">
            <Button type="primary">
                <Link to={newAttrPathWithQuery}>New Selector</Link>
            </Button>
            <Table dataSource={selectors} columns={columns} />
            <Button type="primary" onClick={scrape}>
                Start Scrapring!
            </Button>
        </div>
    )
}

export default Show;
