import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import './Home.css';
import { newRecipePath } from './constants'

import { Table, Button } from 'antd';
import { Link } from "react-router-dom";
import { columns, data } from './Data/HomeData'

const Home = (props) => {

    const [recipes, setRecipes] = useState(data);

    useEffect(() => {
        console.log(data)
        console.log(columns)
    });

    return (
        <div className="home">
            <Button type="primary">
                <Link to={newRecipePath}>Add Recipe</Link>
            </Button>
            <Table dataSource={recipes} columns={columns} />;
        </div>
    )
}

export default Home;
