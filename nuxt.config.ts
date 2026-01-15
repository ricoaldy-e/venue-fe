import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: [
    '@/assets/css/tailwind.css'
  ],

  modules: [
    '@nuxt/content',
    '@nuxt/image',
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss',
  ],

  // Iconify configuration untuk offline icon loading
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
        { property: 'og:title', content: 'VENUE UNDIP - Sewa Venue & Lapangan Olahraga' },
        { property: 'og:description', content: 'Platform sewa venue dan lapangan olahraga Universitas Diponegoro' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'VENUE UNDIP' },
        { property: 'og:image', content: '/favicon.png' }
      ],
      link: [
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

  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET,
    public: {
      gqlHttpEndpoint: process.env.GQL_HTTP_ENDPOINT,
      bookingApiToken: process.env.BOOKING_API_TOKEN,
    },
  },
  typescript: { strict: true, typeCheck: false, shim: true },
})
