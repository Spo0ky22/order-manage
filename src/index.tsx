import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter as Router } from 'react-router-dom'
import App from './App';
import { message } from 'antd';
import { Provider } from 'react-redux';
import { store } from './tools/store';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

message.config({
  top: 100,
  duration: 2,
  maxCount: 3,
});

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </React.StrictMode>
);
