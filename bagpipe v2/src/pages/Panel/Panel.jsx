import React, { useState, useEffect } from 'react';
import './Panel.css';
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import * as myConsts from './containers/constants'

import Home from './containers/Home';
import New from './containers/New';
import Show from './containers/Show';
import NewAttr from './containers/NewAttr';
import Login from './containers/Login'
import Register from './containers/Register';

import mainLogo from "../../assets/img/logo.svg"

import { FolderOpenOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';

const { Header, Content, Footer, Sider } = Layout;
import 'antd/dist/antd.css';

import axios from './containers/axios';

const Panel = () => {
  const basePath = myConsts.basePath;
  const newRecipePath = myConsts.newRecipePath;
  const editRecipePath = myConsts.editRecipePath;
  const showRecipePath = myConsts.showRecipePath;
  const newAttrPath = myConsts.newAttrPath;
  const editAttrPath = myConsts.editAttrPath;
  const loginPath = myConsts.loginPath;
  const registerPath = myConsts.registerPath;

  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const logout = () => {
    try {
      localStorage.removeItem("token");
      setUserData(null);
      navigate(loginPath);
    } catch (error) {
      console.log("Cannot logout", error);
    }
  }
  const getUserData = () => {
    axios
      .get("/api/v1/profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      .then(response => {
        setUserData(response.data.data);
        console.log("data", response.data.data);
      }).catch(e => {
        logout();
      })
  }
  useEffect(() => {
    getUserData();
  }, []);

  const FinalPanel = () => {
    // if (!userData) return (<div><Login /></div>)
    // else
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
            {userData != null ?
              <Menu.Item key="3" >
                <UserOutlined />
                <span>Welcome, {userData.first_name}</span>
                <Link to={basePath} />
              </Menu.Item> : ''}

            {userData != null ?
              <Menu.Item key="1" >
                <FolderOpenOutlined />
                <span>My Projects</span>
                <Link to={basePath} />
              </Menu.Item> : <Menu.Item key="1" >
                <UserOutlined />
                <span>Login</span>
                <Link to={loginPath} />
              </Menu.Item>}
            {userData != null ?
              <Menu.Item key="2" >
                <LogoutOutlined />
                <span >Logout</span>
                <Link to={loginPath} />
              </Menu.Item> : <Menu.Item key="2" >
                <UserOutlined />
                <span >Register</span>
                <Link to={registerPath} />
              </Menu.Item>}
          </Menu>
        </Sider>
        <Layout>
          {/* <Header
            className="site-layout-sub-header-background"
            style={{
              padding: 0,
            }}
          /> */}
          <Content
            style={{
              margin: '24px 16px 0',
            }}
          >
            <div
              className="site-layout-background"
              style={{
                padding: 24,
                minHeight: 600,
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
                  <Route
                    path={loginPath}
                    element={<Login setUserData={setUserData} getUserData={getUserData} />}
                  />
                  <Route
                    path={registerPath}
                    element={<Register setUserData={setUserData} getUserData={getUserData} />}
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
  }

  return <FinalPanel />
};

export default Panel;
