import React from 'react';
import './Panel.css';
import { Routes, Route, Link } from "react-router-dom";
import useBreadcrumbs from 'use-react-router-breadcrumbs';
// import { createStore } from "redux"
// import reducer from "./reducers";

import Home from './containers/Home';
import New from './containers/New';

const Panel = () => {
  // const initialState = { basePath: "/panel.html" };
  // const store = createStore(reducer, initialState);
  const basePath = "/panel.html"

  const Breadcrumbs = () => {
    const breadcrumbs = useBreadcrumbs();

    return (
      <React.Fragment>
        {breadcrumbs.map(({ breadcrumb }) => breadcrumb)}
      </React.Fragment>
    );
  }

  return (
    <div>
      <Breadcrumbs />
      <Routes>
        <Route path={basePath} element={<Home basePath={basePath} />} />
        <Route path={basePath + "/new"} element={<New />} />
      </Routes>
    </div>
  );
};

export default Panel;
