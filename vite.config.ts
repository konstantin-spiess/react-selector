import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx } from '@crxjs/vite-plugin';
import { defineManifest } from '@crxjs/vite-plugin';
import packageJson from './package.json';
const { version } = packageJson;

const manifest = defineManifest({
  manifest_version: 3,
  name: 'React Selector',
  version,
  devtools_page: 'src/devtools/devtools.html',
  background: {
    service_worker: 'src/background.ts',
    type: 'module',
  },
  content_scripts: [
    {
      matches: ['http://*/*', 'https://*/*'],
      js: ['src/content.ts'],
    },
  ],
});

export default defineConfig({
  plugins: [react(), crx({ manifest })],
  build: {
    rollupOptions: {
      input: {
        devtools_panel: 'src/devtools/panel/panel.html',
      },
    },
  },
});
