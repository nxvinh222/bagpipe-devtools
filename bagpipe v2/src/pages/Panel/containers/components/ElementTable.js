import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from '../axios';
import { Table, Button, Tag } from 'antd';
import {
  basePath,
  newAttrPath,
  showRecipeBasicPath,
  editAttrPath,
} from '../constants';

const ElementTable = (props) => {
  let urlParams = new URLSearchParams(window.location.search);
  urlParams.set('recipeId', props.recipeId);
  urlParams.set(props.fatherIdQuery, props.fatherId);
  urlParams.delete(props.elementIdQuery);
  const newAttrPathWithQuery = newAttrPath + '?' + urlParams.toString();
  const editAttrPathWithQuery = editAttrPath + '?' + urlParams.toString();
  const columns = [
    {
      title: 'Name',
      dataIndex: props.nameColumn,
      key: props.nameColumn,
      render: (text, record) => {
        //  check if this attribute an object
        if (
          record[props.typeColumn] != 'object' &&
          record[props.typeColumn] != 'link'
        )
          return <div>{text}</div>;

        let urlParams = new URLSearchParams(window.location.search);
        urlParams.set(props.fatherIdQuery, record[props.idColumn]);
        let path =
          showRecipeBasicPath +
          `${props.recipeId}` +
          '?' +
          urlParams.toString();
        return (
          <Link
            to={{ pathname: path }}
            onClick={() => {
              props.getData(record[props.idColumn]);
              props.getBreadCrumbData(record[props.idColumn]);
            }}
          >
            {text}
          </Link>
        );
      },
    },
    {
      title: 'Type',
      dataIndex: props.typeColumn,
      key: props.typeColumn,
      width: '10%',
      filters: [
        {
          text: 'Click',
          value: 'click',
        },
      ],
      onFilter: (value, record) => record.type.indexOf(value) === 0,
      sorter: (a, b) => a.type.localeCompare(b.type),
      render: (type) => (
        <Tag color={getColor(type)} key={type}>
          {capitalizeFirstLetter(type)}
        </Tag>
      ),
    },
    {
      title: 'Selector',
      dataIndex: props.selectorColumn,
      key: props.selectorColumn,
      width: '40%',
    },
    // {
    //     title: 'Multitple',
    //     key: 'multitple',
    //     dataIndex: 'multitple',
    //     render: multiple => (
    //         <Tag color={multiple == "yes" ? 'green' : 'red'} key={multiple}>
    //             {multiple.toUpperCase()}
    //         </Tag>
    //     ),
    // },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => {
        let path =
          editAttrPathWithQuery +
          `&${props.elementIdQuery}=${record[props.idColumn]}`;
        return (
          <div>
            <Button>
              <Link
                to={{
                  pathname: path,
                }}
              >
                Edit
              </Link>
            </Button>
            <Button
              onClick={() => {
                axios
                  .delete(`/api/v1/elements/${record[props.idColumn]}`)
                  .then((r) => {
                    console.log(r);
                    props.getData(props.fatherId);
                  })
                  .catch((e) => console.log(e));
              }}
            >
              <a>Delete</a>
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <Table
      rowKey={(row) => row.name}
      dataSource={props.selectors}
      columns={columns}
    />
  );
};

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getColor(type) {
  switch (type) {
    case 'object':
      return 'red';
    case 'text':
      return 'gold';
    case 'link':
    case 'link-href':
      return 'magenta';
    case 'click':
    case 'click-infinity':
      return 'purple';
    case 'image':
    case 'image-auto':
      return 'blue';
    case 'paragraph':
      return 'green';
    default:
      return 'yellow';
  }
}

export default ElementTable;
