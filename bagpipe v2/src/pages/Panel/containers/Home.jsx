import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';

import { Table, Tag, Space } from 'antd';
import { columns, data } from './Data/HomeData'

const Home = () => {

    useEffect(() => {
        console.log(data)
        console.log(columns)
    });

    return (
        <div className="home">
            <Table dataSource={data} columns={columns} />;
        </div>
    )
}

export default Home;
