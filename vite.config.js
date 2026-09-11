import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  assetsInclude: ['**/*.glb'],
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'inline',
      workbox: {
        // Cache only the shell eagerly; cache 3D and tab assets when actually used.
        globPatterns: ['index.html', 'assets/index-*.{js,css}', '*.ico', 'icon-*.png', 'pwa-star.svg'],
        runtimeCaching: [{
          urlPattern: ({ url }) => url.origin === self.location.origin && url.pathname.startsWith('/assets/'),
          handler: 'CacheFirst',
          options: {
            cacheName: 'portfolio-assets-v2',
            expiration: { maxEntries: 80, maxAgeSeconds: 30 * 24 * 60 * 60 },
            cacheableResponse: { statuses: [200] }
          }
        }]
      },
      manifest: {
        name: 'Fahru Portofolio',
        short_name: 'Fahru',
        description: 'Interactive UI/UX Portfolio with Liquid Glass effects',
        theme_color: '#1a1a1a',
        background_color: '#1a1a1a',
        display: 'standalone',
        icons: [
          {
            src: '/pwa-star.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ]
})
