import React, { useState, useEffect } from 'react';
import './Panel.css';
import { Routes, Route, Link, useLocation } from "react-router-dom";
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

  return (
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
