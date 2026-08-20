import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import PortalApp from './portal/PortalApp.tsx';
import './portal/portal.css';
import { injectDesignTokens } from './theme/injectCssVars';
import { initGa4 } from './utils/analytics';

const path = window.location.pathname.replace(/\/+$/, '') || '/';
const hostname = window.location.hostname.toLowerCase();
const portalMode =
  path === '/admin' || path.startsWith('/admin/') || hostname.startsWith('admin.')
    ? 'admin'
    : path === '/business' || path.startsWith('/business/') || hostname.startsWith('business.')
      ? 'business'
      : null;

injectDesignTokens();
if (!portalMode) initGa4();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {portalMode ? <PortalApp mode={portalMode} /> : <App />}
  </StrictMode>
);
