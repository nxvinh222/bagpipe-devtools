import React from 'react';
import './Panel.css';
import { Routes, Route } from "react-router-dom";
import { render } from "react-dom";
import useBreadcrumbs from 'use-react-router-breadcrumbs';
// import { createStore } from "redux"
// import reducer from "./reducers";

import Home from './containers/Home';
import New from './containers/New';
import Show from './containers/Show';

const Panel = () => {
  // const initialState = { basePath: "/panel.html" };
  // const store = createStore(reducer, initialState);
  const basePath = "/panel.html"
  const newRecipePath = basePath + "/new"
  const showRecipePath = basePath + "/show/:recipeId"

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
        <Route
          path={basePath}
          element={<Home basePath={basePath} />}
        />
        <Route
          path={newRecipePath}
          element={<New basePath={basePath} />}
        />
        <Route
          path={showRecipePath}
          element={<Show basePath={basePath} />}
        />
      </Routes>
    </div>
  );
};

export default Panel;
