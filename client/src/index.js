import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// import reportWebVitals from './reportWebVitals';
// import { CouponProvider } from './Context/CouponContext';

// Note: Console warnings about "Self-XSS" and "ERR_BLOCKED_BY_CLIENT" are normal.
// These are Google's security warnings and ad blocker messages, not app errors.
// They don't affect functionality and can be safely ignored.

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <CouponProvider> */}
    <App />
    {/* </CouponProvider> */}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
