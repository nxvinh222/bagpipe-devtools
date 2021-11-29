import React from 'react';
import * as ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import Panel from './Panel';
import './index.css';

ReactDOM.render(
    <BrowserRouter>
        <Panel />
    </BrowserRouter>
    ,
    window.document.querySelector('#app-container'));

if (module.hot) module.hot.accept();
