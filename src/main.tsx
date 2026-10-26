import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import PortalApp from './portal/PortalApp.tsx';
import './index.css';

const path = window.location.pathname.replace(/\/+$/, '') || '/';
const hostname = window.location.hostname.toLowerCase();
const isBusinessPath =
  path === '/business' ||
  path.startsWith('/business/') ||
  path === '/businesses' ||
  path.startsWith('/businesses/') ||
  hostname.startsWith('business.') ||
  hostname.startsWith('businesses.');
const portalMode =
  path === '/admin' || path.startsWith('/admin/') || hostname.startsWith('admin.')
    ? 'admin'
    : isBusinessPath
      ? 'business'
      : null;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {portalMode ? <PortalApp mode={portalMode} /> : <App />}
  </StrictMode>
);
