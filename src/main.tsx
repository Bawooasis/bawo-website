import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import PortalApp from './portal/PortalApp.tsx';
import SocialSchedulerLab from './portal/social/SocialSchedulerLab.tsx';
import './index.css';

const path = window.location.pathname.replace(/\/+$/, '') || '/';
const hostname = window.location.hostname.toLowerCase();
const isSocialLab = path === '/admin/social-lab';
const isBusinessPath =
  path === '/business' ||
  path.startsWith('/business/') ||
  path === '/businesses' ||
  path.startsWith('/businesses/') ||
  hostname.startsWith('business.') ||
  hostname.startsWith('businesses.');
const portalMode =
  !isSocialLab &&
  (path === '/admin' || path.startsWith('/admin/') || hostname.startsWith('admin.'))
    ? 'admin'
    : isBusinessPath
      ? 'business'
      : null;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isSocialLab ? (
      <SocialSchedulerLab />
    ) : portalMode ? (
      <PortalApp mode={portalMode} />
    ) : (
      <App />
    )}
  </StrictMode>
);
