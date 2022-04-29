//----packages import--------
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

//----file imports------------
import './index.css';
import App from './App';
//-------pages imports----------
import { RegisterUser, LoginUser, Dashboard, Page404 } from './pages';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/register" element={<RegisterUser />} />
      <Route path="/login" element={<LoginUser />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*" element={<Page404 />} />
    </Routes>
  </BrowserRouter>
);
