import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import PortalApp from './portal/PortalApp.tsx';
import ClientsProspectsLab from './portal/ClientsProspectsLab.tsx';
import MediaCmsLab from './portal/MediaCmsLab.tsx';
import SocialSchedulerLab from './portal/social/SocialSchedulerLab.tsx';
import AffiliateDisclosurePage from './pages/AffiliateDisclosurePage.tsx';
import PrivacyPage from './pages/PrivacyPage.tsx';
import SupportPage from './pages/SupportPage.tsx';
import TermsPage from './pages/TermsPage.tsx';
import './index.css';

const path = window.location.pathname.replace(/\/+$/, '') || '/';
const hostname = window.location.hostname.toLowerCase();

if (path === '/contact' || path.startsWith('/contact/')) {
  window.location.replace('/support');
}

const isSocialLab = path === '/admin/social-lab';
const isMediaLab = path === '/admin/media-lab';
const isClientsLab = path === '/admin/clients-lab';
const isBusinessPath =
  path === '/business' ||
  path.startsWith('/business/') ||
  path === '/businesses' ||
  path.startsWith('/businesses/') ||
  hostname.startsWith('business.') ||
  hostname.startsWith('businesses.');
const portalMode =
  !isSocialLab &&
  !isMediaLab &&
  !isClientsLab &&
  (path === '/admin' || path.startsWith('/admin/') || hostname.startsWith('admin.'))
    ? 'admin'
    : isBusinessPath
      ? 'business'
      : null;

const staticPage =
  path === '/privacy' || path.startsWith('/privacy/')
    ? 'privacy'
    : path === '/terms' || path.startsWith('/terms/')
      ? 'terms'
      : path === '/support' || path.startsWith('/support/')
        ? 'support'
        : path === '/affiliate-disclosure' || path.startsWith('/affiliate-disclosure/')
          ? 'affiliate'
          : path === '/contact' || path.startsWith('/contact/')
            ? 'contact'
            : null;

const page = isClientsLab ? (
  <ClientsProspectsLab />
) : isMediaLab ? (
  <MediaCmsLab />
) : isSocialLab ? (
  <SocialSchedulerLab />
) : portalMode ? (
  <PortalApp mode={portalMode} />
) : staticPage === 'privacy' ? (
  <PrivacyPage />
) : staticPage === 'terms' ? (
  <TermsPage />
) : staticPage === 'support' || staticPage === 'contact' ? (
  <SupportPage />
) : staticPage === 'affiliate' ? (
  <AffiliateDisclosurePage />
) : (
  <App />
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>{page}</StrictMode>
);
