import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        VitePWA({
          registerType: 'autoUpdate',
          includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
          manifest: {
            name: 'Absensi MI Nur Bilad',
            short_name: 'MI Nur Bilad',
            description: 'Aplikasi Absensi MI Nur Bilad Banten',
            theme_color: '#0f172a',
            background_color: '#0f172a',
            display: 'standalone',
            start_url: '/',
            icons: [
              {
                src: 'https://i.ibb.co/LdXLhscV/photo-2026-02-21-18-02-04.jpg',
                sizes: '192x192',
                type: 'image/jpeg'
              },
              {
                src: 'https://i.ibb.co/LdXLhscV/photo-2026-02-21-18-02-04.jpg',
                sizes: '512x512',
                type: 'image/jpeg'
              },
              {
                src: 'https://i.ibb.co/LdXLhscV/photo-2026-02-21-18-02-04.jpg',
                sizes: '512x512',
                type: 'image/jpeg',
                purpose: 'any maskable'
              }
            ]
          }
        })
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
