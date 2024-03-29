import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import './css/Home.css';
import { basePath, newRecipePath, showRecipeBasicPath, editRecipePath, recipeIdQuery, idColumn } from './constants';

import { Table, Button, Popconfirm, Typography, message, Input, Spin, Col, Row, Statistic, Popover } from 'antd';
import { CheckOutlined, LoadingOutlined, ReloadOutlined, PlusCircleOutlined } from '@ant-design/icons';
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
  const [inputTextProjectSearch, setInputTextProjectSearch] = useState("");
  const nameColumn = 'name';
  const urlColumn = 'start_url';
  const commentColumn = 'note';
  const statusColumn = 'status';
  const { Title, Paragraph, Text } = Typography;

  const getData = () => {
    axios
      .get('/api/v1/recipes?limit=100', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      .then((response) => {
        // console.log(response.data.data);
        let recipes = response.data.data.map((recipe) => ({
          [idColumn]: recipe[idColumn],
          [nameColumn]: recipe[nameColumn],
          [urlColumn]: recipe[urlColumn],
          [commentColumn]: recipe[commentColumn],
          [statusColumn]: recipe[statusColumn],
        }));
        // console.log('recipes: ' + recipes);
        setCrawlers(recipes);
      })
      .catch((err) => console.log(err));
  };

  //create a new array by filtering the original array
  const filteredCrawlerList = crawlers.filter((el) => {
    //if no input the return the original
    if (inputTextProjectSearch === '') {
      return el;
    }
    //return the item which contains the user input
    else {
      return el[nameColumn].toLowerCase().includes(inputTextProjectSearch)
    }
  })

  let inputProjectSearchHandler = (e) => {
    //convert input text to lower case
    var lowerCase = e.target.value.toLowerCase();
    setInputTextProjectSearch(lowerCase);
    // console.log("enter: ", filteredData);
  };

  const columns = [
    {
      title: 'Project Name',
      dataIndex: nameColumn,
      key: nameColumn,
      width: '10%',
      sorter: (a, b) => a[nameColumn].localeCompare(b[nameColumn]),
      render: (text, record) => {
        // let urlParams = new URLSearchParams(window.location.search);
        // urlParams.set('domain', record.domain);
        // let path = showRecipeBasicPath + text + "?" + urlParams.toString();
        let path = showRecipeBasicPath + record.id;
        // console.log(path);
        return (
          <Link to={path}>
            <b>{text}</b>
          </Link>
        );
      },
    },
    {
      title: 'Crawl Url',
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
      title: 'Status',
      dataIndex: statusColumn,
      key: statusColumn,
      width: '10%',
      filters: [
        {
          text: 'Running',
          value: 2,
        },
        {
          text: 'Finished',
          value: '3',
        },
        {
          text: 'Failed',
          value: '4',
        },
      ],
      onFilter: (value, record) => record.status == value,
      render: (text, record) => {
        switch (text) {
          case 1:
            return (
              <Text type="strong">Not running</Text>
            );
          case 2:
            const antIcon = (
              <LoadingOutlined
                style={{
                  fontSize: 10,
                }}
                spin
              />
            );
            return (
              <Text type="warning">Running <Spin indicator={antIcon} /></Text>
            )
          case 3:
            return (
              <Text type="success">Finished <CheckOutlined /></Text>
            );
          case 4:
            return (
              <Text type="danger">Failed</Text>
            );
        }
      },
    },
    {
      title: 'Action',
      key: 'action',
      width: '15%',
      render: (text, record) => {
        let editPath = editRecipePath + `?${recipeIdQuery}=${record[idColumn]}`
        const instructionEdit = (
          <div>
            Edit Project's name, URL and note.
          </div>
        );
        const instructionDelete = (
          <div>
            Delete this Project.
          </div>
        );
        return (
          <div>
            <Popover
              content={instructionEdit}
              trigger="hover"
            >
              <Button>
                <Link
                  to={{
                    pathname: editPath,
                  }}
                >
                  Edit
                </Link>
              </Button>
            </Popover>

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

              <Popover
                content={instructionDelete}
                // title="Title" 
                trigger="hover"
              >
                <Button><a>Delete</a></Button>
              </Popover>
            </Popconfirm>
          </div>
        )
      },
    },
    {
      title: 'Note',
      dataIndex: commentColumn,
      key: commentColumn,
      width: '15%',
    },
  ];

  const getStat = (status) => {
    let filteredProjectList = crawlers.filter((v) => {
      return v.status == status;
    })
    let projectCount = filteredProjectList.length;
    // console.log(projectCount);
    return parseInt(projectCount).toString();
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="home">
      <Title level={3}>
        Projects list
      </Title>
      {/* <Breadcrumb separator=">">
                <Breadcrumb.Item href={basePath}>
                    <HomeOutlined />
                </Breadcrumb.Item>
            </Breadcrumb> */}
      <div className='summary'>
        <Row gutter={8}>
          <Col span={4}>
            <Statistic
              title="Total projects"
              value={crawlers.length}
            />
          </Col>
          <Col span={5}>
            <Statistic
              title="Not running"
              value={getStat(1)}
            />
          </Col>
          <Col span={5}>
            <Statistic
              title="Running"
              valueStyle={{
                color: "#faad14"
              }}
              value={getStat(2)}
            />
          </Col>
          <Col span={5}>
            <Statistic
              title="Finished"
              valueStyle={{
                color: "#3f8600"
              }}
              value={getStat(3)}
            />
          </Col>
          <Col span={5}>
            <Statistic
              title="Failed"
              valueStyle={{
                color: "red"
              }}
              value={getStat(4)}
            />
          </Col>
        </Row>
      </div>

      <div className='main-action'>
        <Row gutter={8} style={{
          // width: "50%",
          marginTop: "1%",
          marginBottom: "1%"
        }}>
          <Col>
            <Button type="primary">
              <Link to={newRecipePath}><PlusCircleOutlined /> Create New Project</Link>
            </Button>
          </Col>
          <Col>
            <Button
              onClick={() => {
                getData();
                message.success('Project list reloaded!');
              }}
              shape="circle"
              icon={<ReloadOutlined />}
            />
          </Col>
          <Col span={10}>
            <div className="bagpipe-search-bar">
              <Input
                placeholder="Filter Project by Name"
                size="middle"
                onChange={inputProjectSearchHandler}
                style={{
                  // width: "50%",
                  // marginTop: "1%",
                  // marginBottom: "1%"
                }}
              />
            </div>
          </Col>
        </Row>
      </div>

      <div className='tips'>Tips: Click Project's name to view project's detail.</div>

      <Table
        rowKey={(row) => row.id}
        dataSource={filteredCrawlerList}
        columns={columns}
        scroll={{
          y: "50%",
        }}
        pagination={{
          pageSize: 5,
        }}
      />
    </div>
  );
};

export default Home;
