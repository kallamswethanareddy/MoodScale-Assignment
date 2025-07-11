// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css'; // assuming your styles are in styles folder
import App from './client/App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
