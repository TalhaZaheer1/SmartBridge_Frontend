// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './i18n';
import { CartProvider } from './context/CartContext';


ReactDOM.createRoot(document.getElementById('root')).render(

    <CartProvider><App /></CartProvider>);
