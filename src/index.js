import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import HexMap from './hex-map';
import {renderToDOM} from "./hex-map";
// import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<HexMap />, document.getElementById('app'));
renderToDOM(document.getElementById('app'));
// registerServiceWorker();