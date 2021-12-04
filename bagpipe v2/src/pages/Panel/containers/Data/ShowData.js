import React from 'react';
import { Tag, Space } from 'antd';

export const columns = [
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
    // {
    //     title: 'Action',
    //     key: 'action',
    //     render: (text, record) => (
    //         <Space size="middle">
    //             <a>Invite {record.name}</a>
    //             <a>Delete</a>
    //         </Space>
    //     ),
    // },
];

export const data = [
    {
        name: 'title',
        selector: 'article:nth-of-type(n+7) .title-news a',
        type: "Text",
        multitple: "yes",
        // address: 'New York No. 1 Lake Park',
        // tags: ['nice', 'developer'],
    },
    {
        name: 'picture',
        selector: 'img',
        type: "Image",
        multitple: "no",
        // address: 'London No. 1 Lake Park',
        // tags: ['loser'],
    },
    {
        name: 'content',
        selector: "article:nth-of-type(n+2) .description a[data-thumb='1']",
        type: "Text",
        multitple: "yes",
        // address: 'Sidney No. 1 Lake Park',
        // tags: ['cool', 'teacher'],
    },
];