import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import PortalApp from './portal/PortalApp.tsx';
import SocialSchedulerLab from './portal/social/SocialSchedulerLab.tsx';
import AffiliateDisclosurePage from './pages/AffiliateDisclosurePage.tsx';
import EventPage from './pages/EventPage.tsx';
import NycDirectoryPage from './pages/NycDirectoryPage.tsx';
import PartnersPage from './pages/PartnersPage.tsx';
import PlacePage from './pages/PlacePage.tsx';
import PrivacyPage from './pages/PrivacyPage.tsx';
import SupportPage from './pages/SupportPage.tsx';
import TermsPage from './pages/TermsPage.tsx';
import {
  GrowthPreviewPage,
  PartnerLinkPreviewPage,
} from './pages/UiPreviewPages.tsx';
import './index.css';

const path = window.location.pathname.replace(/\/+$/, '') || '/';
const hostname = window.location.hostname.toLowerCase();

if (path === '/contact' || path.startsWith('/contact/')) {
  window.location.replace('/support');
}

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

const placeMatch = path.match(/^\/places\/([^/]+)$/);
const eventMatch = path.match(/^\/e\/([^/]+)$/);

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
            : path === '/nyc' || path.startsWith('/nyc/')
              ? 'nyc'
            : path === '/partners' || path.startsWith('/partners/')
              ? 'partners'
              : path === '/__preview/partner-link'
                ? 'preview-partner'
                : path === '/__preview/growth'
                  ? 'preview-growth'
                  : placeMatch
                    ? 'place'
                    : eventMatch
                      ? 'event'
                      : null;

const page = isSocialLab ? (
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
) : staticPage === 'nyc' ? (
  <NycDirectoryPage />
) : staticPage === 'partners' ? (
  <PartnersPage />
) : staticPage === 'preview-partner' ? (
  <PartnerLinkPreviewPage />
) : staticPage === 'preview-growth' ? (
  <GrowthPreviewPage />
) : staticPage === 'place' && placeMatch ? (
  <PlacePage slug={decodeURIComponent(placeMatch[1])} />
) : staticPage === 'event' && eventMatch ? (
  <EventPage slug={decodeURIComponent(eventMatch[1])} />
) : (
  <App />
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>{page}</StrictMode>
);
