import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { DemoI18nProvider } from './i18n.jsx';
import './styles.css';

createRoot(document.getElementById('root')).render(<DemoI18nProvider><App /></DemoI18nProvider>);
