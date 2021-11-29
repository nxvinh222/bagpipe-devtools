import React from 'react';
import './Panel.css';
import { Routes, Route, Link } from "react-router-dom";
import useBreadcrumbs from 'use-react-router-breadcrumbs';

import Home from './containers/Home';

const Panel = () => {
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
      {/* <Link to={basePath + "/selector"}>Save Recipe</Link> */}
      <Routes>
        <Route path={basePath} element={<Home />} />
        <Route path={basePath + "/selector"} element={<h1>Selector</h1>} />
      </Routes>
    </div>
  );
};

export default Panel;
