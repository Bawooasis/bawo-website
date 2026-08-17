import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { injectDesignTokens } from './theme/injectCssVars';
import { initGa4 } from './utils/analytics';

injectDesignTokens();
initGa4();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
