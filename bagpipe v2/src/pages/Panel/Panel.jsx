import React, { useState, useEffect } from 'react';
import './Panel.css';
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { Breadcrumb } from 'antd';
import * as myConsts from './containers/constants'

import Home from './containers/Home';
import New from './containers/New';
import Show from './containers/Show';
import NewAttr from './containers/NewAttr';

const Panel = () => {
  const basePath = myConsts.basePath;
  const newRecipePath = myConsts.newRecipePath;
  const showRecipePath = myConsts.showRecipePath;
  const newAttrPath = myConsts.newAttrPath;
  const showRecipeBasicPath = myConsts.showRecipeBasicPath;

  const location = useLocation();

  const [breadcrumbNameMap, setBreadcrumb] = useState({
    [basePath]: "Home",
    [newRecipePath]: "New Recipe",
    [showRecipeBasicPath.slice(0, -1)]: "Recipes",
  })
  const pathSnippets = location.pathname.split('/').filter(i => i);
  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    var alterPathForHome = url;
    if (url == showRecipeBasicPath.slice(0, -1))
      alterPathForHome = basePath;
    // console.log(url);
    return (
      <Breadcrumb.Item key={url}>
        <Link to={alterPathForHome}>{breadcrumbNameMap[url]}</Link>
      </Breadcrumb.Item>
    );
  });
  const breadcrumbItems = [].concat(extraBreadcrumbItems);

  useEffect(() => {
    let newBreadcrumbNameMap = breadcrumbNameMap;
    chrome.storage.sync.get("crawlers", function (res) {
      res.crawlers.forEach(item => {
        newBreadcrumbNameMap[showRecipeBasicPath + item.id] = item.id
      });
      setBreadcrumb(newBreadcrumbNameMap)
      console.log("new breadcrumb: ", newBreadcrumbNameMap);
    });
  })

  return (
    <div className='bagpipe-root'>
      <div className="nav">
        <Link to={basePath}>Home</Link>
      </div>
      <Breadcrumb>{breadcrumbItems}</Breadcrumb>
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
          path={showRecipePath}
          element={<Show />}
        />
        <Route
          path={newAttrPath}
          element={<NewAttr />}
        />
      </Routes>
    </div>
  );
};

export default Panel;
