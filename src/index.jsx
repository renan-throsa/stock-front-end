import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import { AuthProvider } from './context/AuthContext';

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const rootElement = document.getElementById('root');

ReactDOM.render(
  <BrowserRouter basename={baseUrl}>
    <AuthProvider>
      <Dashboard />
    </AuthProvider>
  </BrowserRouter>,
  rootElement);


