import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // 登録は main.tsx で手動で行う（定期的な更新チェックを入れるため）。
      injectRegister: false,
      includeAssets: ['favicon.svg'],
      workbox: {
        // 古いキャッシュを掃除し、新しい Service Worker をすぐ有効にする。
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
      },
      manifest: {
        name: 'こどもがくしゅう',
        short_name: 'がくしゅう',
        description: '子供向けの学習アプリ（日本語の読み書き）',
        theme_color: '#ffb703',
        background_color: '#fffbf0',
        display: 'standalone',
        orientation: 'portrait',
        lang: 'ja',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
})
