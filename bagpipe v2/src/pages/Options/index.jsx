import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import Options from './Options';
import './index.css';

// render(
//   <Options title={'Settings'} />,
//   window.document.querySelector('#app-container')
// );
ReactDOM.render(
  <BrowserRouter>
    <Options />
  </BrowserRouter>,
  window.document.querySelector('#app-container')
);

if (module.hot) module.hot.accept();
