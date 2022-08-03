/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  VITE_SELECTED_ELEMENT_MARKER: string;
  VITE_SELECTED_ELEMENT_MARKER_QUERY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
