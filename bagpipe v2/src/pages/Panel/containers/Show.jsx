import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';

import { useParams } from 'react-router-dom'
import { Table, Button } from 'antd';
import { Link } from "react-router-dom";

import { columns, data } from './Data/HomeData'

const Show = (props) => {
    let { recipeId } = useParams();
    const [recipes, setRecipes] = useState(data);
    useEffect(() => {
        console.log(recipeId)
    });

    const scrape = () => {
        console.log("Scraping!");
    }

    return (
        <div className="show">
            <Button type="primary">
                <Link to={props.basePath}>New Attribute</Link>
            </Button>
            <Table dataSource={recipes} columns={columns} />;
            <Button type="primary" onClick={scrape}>
                Start Scrapring!
            </Button>
        </div>
    )
}

export default Show;
