import React from 'react';
import './Panel.css';
import { Routes, Route } from "react-router-dom";
import { render } from "react-dom";
import useBreadcrumbs from 'use-react-router-breadcrumbs';
import * as myConsts from './containers/constants'
// import { createStore } from "redux"
// import reducer from "./reducers";

import Home from './containers/Home';
import New from './containers/New';
import Show from './containers/Show';
import NewAttr from './containers/NewAttr';

const Panel = () => {
  // const initialState = { basePath: "/panel.html" };
  // const store = createStore(reducer, initialState);
  const basePath = myConsts.basePath
  const newRecipePath = myConsts.newRecipePath
  const showRecipePath = myConsts.showRecipePath
  const newAttrPath = myConsts.newAttrPath

  const Breadcrumbs = () => {
    const breadcrumbs = useBreadcrumbs();

    return (
      <React.Fragment>
        {breadcrumbs.map(({ breadcrumb }) => breadcrumb)}
      </React.Fragment>
    );
  }

  return (
    <div className='bagpipe-root'>
      <Breadcrumbs />
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
