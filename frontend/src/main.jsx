import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './styles/index.css';
import Preloader from './components/common/Preloader';

// 1. Import Google Provider
import { GoogleOAuthProvider } from '@react-oauth/google';

// 2. Ambil Client ID dari environment (yang sudah kita taruh di file .env frontend)
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 3. Bungkus aplikasi kita dengan Provider Google */}
    <GoogleOAuthProvider clientId={clientId}>
      <BrowserRouter>
        <Preloader />
        <App />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
