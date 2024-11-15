import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App/App'; // Update import path
import CategoryPage from './CategoryPage/CategoryPage'; // Update import path
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/category" element={<CategoryPage />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

reportWebVitals();