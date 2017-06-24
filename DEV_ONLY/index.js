import PropTypes from 'prop-types';
import React, {
  Component
} from 'react';
import {
  render
} from 'react-dom';

import Example from './Example';

const renderItem = (index, key) => {
  return (
    <div
      className={`item${index % 2 ? '' : ' even'}`}
      key={key}
    >
      {index}
    </div>
  );
};

renderItem.toJSON = () => {
  return renderItem.toString();
};

const div = document.createElement('div');
const style = document.createElement('style');

style.textContent = `
    body {
      margin: 0;
      font-family: 'Helvetica Neue', sans-serif;
    }

    a {
      color: #38afd4;
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }

    .banner {
      border: 0;
      position: absolute;
      right: 0;
      top: 0;
    }

    .header {
      background: #fff;
      color: #ec7720;
      font-size: 50px;
      padding: 40px;
    }

    .example {
      padding: 25px;
    }

    .props {
      overflow: auto;
    }

    .component {
      border: 10px solid #38afd4;
      border-radius: 5px;
      height: 320px;
      overflow: auto;
      -webkit-overflow-scrolling: touch;
    }

    .item {
      background: linear-gradient(#fff, #eee);
      line-height: 30px;
      padding: 0 10px;
    }

    .axis-x .item {
      display: inline-block;
      line-height: 300px;
      padding: 0;
      text-align: center;
      width: 150px;
    }

    .axis-x .component {
      white-space: nowrap;
    }

    .square-item {
      background: linear-gradient(#fff, #eee);
      display: inline-block;
      line-height: 100px;
      text-align: center;
      width: 100px;
    }

    .even {
      background: linear-gradient(#ddd, #ccc);
    }

    .button {
      -webkit-appearance: none;
      background-color: #fff;
      border: 1px solid #ccc;
      border-radius: 5px;
      color: #5d5d5d;
      cursor: pointer;
      outline: none;
      padding: 10px 15px;
    }

    .button:hover {
      background-color: #f0f0f0;
      box-shadow: 0 0 3px #ccc;
    }
`;

const renderApp = (container, length = 1000) => {
  render((
    <Example/>
  ), container);
};

renderApp(div);

document.body.appendChild(div);
document.body.appendChild(style);
