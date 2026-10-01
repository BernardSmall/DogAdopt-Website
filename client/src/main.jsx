import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../../styles.css';
import '../../adopt.css';
import '../../contact.css';
import '../../responsive.css';
import './migration.css';
import './polish.css';
import { AuthProvider } from './AuthContext';
import App from './App';

createRoot(document.getElementById('root')).render(<React.StrictMode><BrowserRouter><AuthProvider><App/></AuthProvider></BrowserRouter></React.StrictMode>);
