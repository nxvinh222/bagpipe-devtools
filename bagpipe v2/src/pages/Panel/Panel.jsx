import React, { useState, useEffect } from 'react';
import './Panel.css';
import { Routes, Route, Link, useLocation } from "react-router-dom";
import * as myConsts from './containers/constants'

import Home from './containers/Home';
import New from './containers/New';
import Show from './containers/Show';
import NewAttr from './containers/NewAttr';

import mainLogo from "../../assets/img/logo.svg"

import { UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';

const { Header, Content, Footer, Sider } = Layout;
import 'antd/dist/antd.css';

const Panel = () => {
  const basePath = myConsts.basePath;
  const newRecipePath = myConsts.newRecipePath;
  const editRecipePath = myConsts.editRecipePath;
  const showRecipePath = myConsts.showRecipePath;
  const newAttrPath = myConsts.newAttrPath;
  const editAttrPath = myConsts.editAttrPath;

  return (
    <Layout>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        <div className="main-logo" ><img src={mainLogo} alt="fireSpot" /></div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
        >
          <Menu.Item key="1" >
            <UserOutlined />
            <span>Home</span>
            <Link to='/' />
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header
          className="site-layout-sub-header-background"
          style={{
            padding: 0,
          }}
        />
        <Content
          style={{
            margin: '24px 16px 0',
          }}
        >
          <div
            className="site-layout-background"
            style={{
              padding: 24,
              minHeight: 500,
            }}
          >
            <div className='bagpipe-root'>
              <Routes>
                <Route
                  path={basePath}
                  element={<Home />}
                />
                <Route
                  path={newRecipePath}
                  element={<New />}
                />
                <Route
                  path={editRecipePath}
                  element={<New />}
                />
                <Route
                  path={showRecipePath}
                  element={<Show />}
                />
                <Route
                  path={newAttrPath}
                  element={<NewAttr />}
                />
                <Route
                  path={editAttrPath}
                  element={<NewAttr />}
                />
              </Routes>
            </div>
          </div>
        </Content>
        <Footer
          style={{
            textAlign: 'center',
          }}
        >
          Bagpipe Scraper ©2022 Created by Vinh
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Panel;
