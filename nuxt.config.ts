import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: [
    '@/assets/css/tailwind.css'
  ],

  modules: [
    '@nuxtjs/turnstile',
    '@nuxt/content',
    '@nuxt/image',
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss',
  ],

  vite: {
    optimizeDeps: {
      include: [
        '@iconify/vue',
        '@iconify-json/lucide',
        '@iconify-json/heroicons'
      ]
    }
  },

  app: {
    head: {
      title: 'VENUE UNDIP - Sewa Venue & Lapangan Olahraga',
      titleTemplate: '%s',
      htmlAttrs: {
        lang: 'id'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Platform sewa venue dan lapangan olahraga Universitas Diponegoro - VENUE UNDIP' },
        { name: 'author', content: 'VENUE UNDIP - Universitas Diponegoro' },
        { name: 'theme-color', content: '#1f2a56' },
        // Open Graph Tags
        { property: 'og:title', content: 'VENUE UNDIP - Sewa Venue & Lapangan Olahraga' },
        { property: 'og:description', content: 'Platform booking lapangan olahraga terpercaya untuk Sivitas Akademika Universitas Diponegoro.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'VENUE UNDIP' },
        { property: 'og:url', content: 'https://venue.undip.id' },
        { property: 'og:image', content: 'https://venue.undip.id/og-image.png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:alt', content: 'VENUE UNDIP - Platform Sewa Venue & Lapangan Olahraga Universitas Diponegoro' },
        { property: 'og:locale', content: 'id_ID' },
        // Twitter Card Tags
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'VENUE UNDIP - Sewa Venue & Lapangan Olahraga' },
        { name: 'twitter:description', content: 'Platform booking lapangan olahraga terpercaya untuk Sivitas Akademika Universitas Diponegoro.' },
        { name: 'twitter:image', content: 'https://venue.undip.id/og-image.png' },
        { name: 'twitter:image:alt', content: 'VENUE UNDIP - Platform Sewa Venue & Lapangan Olahraga' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon.png' },
        { rel: 'shortcut icon', href: '/favicon.png' }
      ]
    },
    pageTransition: {
      name: 'page',
      mode: 'out-in'
    },
    layoutTransition: {
      name: 'layout',
      mode: 'out-in'
    }
  },

  ssr: true,

  // HYBRID RENDERING CONFIGURATION
  // Tujuan: Mengurangi beban memory server dengan mengoptimalkan rendering
  // per-route berdasarkan kebutuhan masing-masing halaman.
  // Dokumentasi: https://nuxt.com/docs/guide/concepts/rendering#hybrid-rendering
  routeRules: {
    
    // ADMIN PAGES - Client-Side Rendering (CSR)
    '/admin/**': { ssr: false },

    // HALAMAN BANTUAN - Stale-While-Revalidate (SWR)
    '/bantuan/**': { swr: 86400 },
  },

  nitro: {
    routeRules: {
      '/**': {
        headers: {
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'SAMEORIGIN',
          'X-XSS-Protection': '1; mode=block',
          'Referrer-Policy': 'strict-origin-when-cross-origin'
        }
      }
    }
  },

  turnstile: {
    siteKey: '0x4AAAAAACMZd-IE1Ec6SjaL',
    // siteKey: '1x00000000000000000000AA',
  },

  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET,
    public: {
      gqlHttpEndpoint: process.env.GQL_HTTP_ENDPOINT,
      bookingApiToken: process.env.BOOKING_API_TOKEN,
    },
  },
  typescript: { strict: true, typeCheck: false, shim: true },
})
