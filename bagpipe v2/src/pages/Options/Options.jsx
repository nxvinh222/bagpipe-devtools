import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import 'antd/dist/antd.css';
import './Options.css';
import { Routes, Route, useLocation } from "react-router-dom";

import SideNav from './components/SideNav'
import Preview from './components/Preview'

import { Layout, Menu, Breadcrumb, Typography } from 'antd';

const { Header, Content, Footer } = Layout;
const { SubMenu } = Menu;
const { Title } = Typography;

const Options = () => {
  document.addEventListener('DOMContentLoaded', function () {
    chrome.storage.sync.get("resultDemo", function (result) {
      console.log(result.resultDemo)
      $(".result-json").html(JSON.stringify(result.resultDemo, undefined, 2));
    });
  }, false)

  useEffect(() => {

  });

  // const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  console.log(location.pathname);

  return (
    <div className="wrapper">
      <Layout style={{ minHeight: '100vh' }}>
        <SideNav />
        <Layout className="site-layout">
          {/* <Header className="site-layout-background" style={{ padding: 0 }} /> */}
          <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>User</Breadcrumb.Item>
              <Breadcrumb.Item>Bill</Breadcrumb.Item>
            </Breadcrumb>
            <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
              <Routes>
                <Route path="/options.html" element={<Preview />} />
                <Route path="about" element={<div>ok</div>} />
              </Routes>
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
        </Layout>
      </Layout>
      {/* <Redirect
        to={{
          pathname: "/home"
        }}
      /> */}
    </div>
  );
};

export default Options;
