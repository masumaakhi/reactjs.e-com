import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { RouterProvider } from 'react-router-dom';
import { router } from './router/router';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext'; // 🟢 Import AuthProvider

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider> {/* 🟢 Wrap with AuthProvider */}
      <CartProvider> {/* 🟢 Then wrap with CartProvider */}
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();
