/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STRIPE_FOUNDING_CHECKOUT_URL?: string;
  readonly VITE_B2B_CONTACT_EMAIL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
