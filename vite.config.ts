import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { crx } from '@crxjs/vite-plugin';
import manifest from './src/manifest.json';
import path from 'path';
import fs from 'fs';

function firefoxCompat(): Plugin {
  return {
    name: 'firefox-compat',
    apply: 'build',
    closeBundle() {
      const distManifestPath = path.resolve(__dirname, 'dist/manifest.json');
      if (fs.existsSync(distManifestPath)) {
        try {
          const raw = fs.readFileSync(distManifestPath, 'utf-8');
          const distManifest = JSON.parse(raw);

          // Firefox MV3 requires background.scripts alongside or instead of service_worker
          if (distManifest.background) {
            const sw = distManifest.background.service_worker || 'service-worker-loader.js';
            distManifest.background.scripts = [sw];
          }

          // Ensure browser_specific_settings is retained for Firefox
          if ((manifest as any).browser_specific_settings) {
            distManifest.browser_specific_settings = (manifest as any).browser_specific_settings;
          }

          fs.writeFileSync(distManifestPath, JSON.stringify(distManifest, null, 2), 'utf-8');
          console.log('[firefox-compat] Injected background.scripts and browser_specific_settings for Firefox compatibility.');
        } catch (err) {
          console.error('[firefox-compat] Failed to update manifest:', err);
        }
      }
    }
  };
}

export default defineConfig({
  plugins: [
    react(),
    crx({ manifest: manifest as any }),
    firefoxCompat()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    emptyOutDir: true,
    outDir: 'dist',
    sourcemap: process.env.NODE_ENV !== 'production'
  }
});

