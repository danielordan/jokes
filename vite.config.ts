import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifest: {
        name: 'בדיחה בלחיצה',
        short_name: 'בדיחה בלחיצה',
        lang: 'he',
        dir: 'rtl',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        theme_color: '#F7AEB8',
        background_color: '#FFF4ED',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // App shell only (HTML, JS, CSS, fonts, kitten, icons). No runtimeCaching: /api/* is never cached.
        globPatterns: ['**/*.{html,js,css,svg,png,woff,woff2}'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//],
      },
    }),
  ],
})
