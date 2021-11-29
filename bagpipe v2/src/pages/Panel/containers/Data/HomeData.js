import React from 'react';
import { Tag, Space } from 'antd';

export const columns = [
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
    // {
    //     title: 'Tags',
    //     key: 'tags',
    //     dataIndex: 'tags',
    //     render: tags => (
    //         <>
    //             {tags.map(tag => {
    //                 let color = tag.length > 5 ? 'geekblue' : 'green';
    //                 if (tag === 'loser') {
    //                     color = 'volcano';
    //                 }
    //                 return (
    //                     <Tag color={color} key={tag}>
    //                         {tag.toUpperCase()}
    //                     </Tag>
    //                 );
    //             })}
    //         </>
    //     ),
    // },
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
        id: 'abc',
        domain: 'vnexpress.net',
        comment: "Thong tin vne",
        // address: 'New York No. 1 Lake Park',
        // tags: ['nice', 'developer'],
    },
    {
        id: 'def',
        domain: 'dantri.net',
        comment: "Điểm báo hàng ngày tại dân trí",
        // address: 'London No. 1 Lake Park',
        // tags: ['loser'],
    },
    {
        id: 'ghk',
        domain: 'baomoi.net',
        comment: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        // address: 'Sidney No. 1 Lake Park',
        // tags: ['cool', 'teacher'],
    },
];