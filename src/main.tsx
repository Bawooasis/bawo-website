import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import PortalApp from './portal/PortalApp.tsx';
import EventsUiPreview from './portal/events/EventsUiPreview.tsx';
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
const eventsUiPreview =
  path === '/admin/events-ui-preview' &&
  new URLSearchParams(window.location.search).get('qa') === '1';

const portalMode =
  path === '/admin' || path.startsWith('/admin/') || hostname.startsWith('admin.')
    ? 'admin'
    : isBusinessPath
      ? 'business'
      : null;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {eventsUiPreview
      ? <EventsUiPreview />
      : portalMode
      ? <PortalApp mode={portalMode} />
      : <App />}
  </StrictMode>
);
