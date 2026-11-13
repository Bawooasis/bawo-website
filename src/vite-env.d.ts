/// <reference types="vite/client" />

declare module "*.avif" {
  const src: string;
  export default src;
}

interface ImportMetaEnv {
  readonly VITE_B2B_CONTACT_EMAIL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
