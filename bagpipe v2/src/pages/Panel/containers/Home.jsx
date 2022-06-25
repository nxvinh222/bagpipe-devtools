import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import './css/Home.css';
import { basePath, newRecipePath, showRecipeBasicPath, editRecipePath, recipeIdQuery, idColumn } from './constants';

import { Table, Button, Popconfirm, Typography, message } from 'antd';
import { AliwangwangOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { data } from './Data/HomeData';
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
  const nameColumn = 'name';
  const urlColumn = 'start_url';
  const commentColumn = 'note';
  const { Title, Paragraph } = Typography;

  const getData = () => {
    axios
      .get('/api/v1/recipes')
      .then((response) => {
        // console.log(response.data.data);
        let recipes = response.data.data.map((recipe) => ({
          [idColumn]: recipe[idColumn],
          [nameColumn]: recipe[nameColumn],
          [urlColumn]: recipe[urlColumn],
          [commentColumn]: recipe[commentColumn],
        }));
        console.log('recipes: ' + recipes);
        setCrawlers(recipes);
      })
      .catch((err) => console.log(err));
  };

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
        let path = showRecipeBasicPath + record.id;
        console.log(path);
        return (
          <Link to={path}>
            <b>{text}</b>
          </Link>
        );
      },
    },
    {
      title: 'Start Url',
      dataIndex: urlColumn,
      key: urlColumn,
      width: '30%',
      render: (text, record) => {
        return (
          <Paragraph copyable>{text}</Paragraph>
        );
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => {
        let editPath = editRecipePath + `?${recipeIdQuery}=${record[idColumn]}`
        return (
          <div>
            <Button>
              <Link
                to={{
                  pathname: editPath,
                }}
              >
                Edit
              </Link>
            </Button>
            <Popconfirm
              title="Are you sure to delete this project?"
              onConfirm={() => {
                axios
                  .delete(`/api/v1/recipes/${record[idColumn]}`)
                  .then((r) => {
                    console.log(r);
                    getData();
                    message.success('Project deleted!');
                  })
                  .catch((e) => console.log(e));
              }}
              // onCancel={cancel}
              okText="Yes"
              cancelText="No"
            >
              <Button><a>Delete</a></Button>
            </Popconfirm>
          </div>
        )
      },
    },
    {
      title: 'Note',
      dataIndex: commentColumn,
      key: commentColumn,
      width: '30%',
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="home">
      <Title level={3}>
        Projects list
        {/* <AliwangwangOutlined /> */}
      </Title>
      {/* <Breadcrumb separator=">">
                <Breadcrumb.Item href={basePath}>
                    <HomeOutlined />
                </Breadcrumb.Item>
            </Breadcrumb> */}
      <Button type="primary">
        <Link to={newRecipePath}>Create New Project</Link>
      </Button>
      <Table
        rowKey={(row) => row.id}
        dataSource={crawlers}
        columns={columns}
        scroll={{
          y: "50%",
        }}
      // pagination={{
      //   pageSize: 7,
      // }}
      />
    </div>
  );
};

export default Home;
