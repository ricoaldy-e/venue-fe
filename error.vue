<script setup lang="ts">
import { useRouter } from 'vue-router'

interface ErrorProps {
  error?: {
    statusCode?: number
    statusMessage?: string
    message?: string
    url?: string
  }
}

const props = defineProps<ErrorProps>()
const router = useRouter()

const errorCode = computed(() => props.error?.statusCode || 500)
const errorMessage = computed(() => {
  if (props.error?.statusMessage) return props.error.statusMessage
  if (props.error?.message) return props.error.message
  
  switch (errorCode.value) {
    case 404:
      return 'Halaman yang Anda cari tidak ditemukan'
    case 403:
      return 'Anda tidak memiliki akses ke halaman ini'
    case 401:
      return 'Anda harus login untuk mengakses halaman ini'
    case 500:
      return 'Terjadi kesalahan pada server'
    case 502:
      return 'Server tidak dapat dihubungi'
    case 503:
      return 'Layanan sedang dalam pemeliharaan'
    default:
      return 'Terjadi kesalahan yang tidak terduga'
  }
})

const errorTitle = computed(() => {
  switch (errorCode.value) {
    case 404:
      return 'Halaman Tidak Ditemukan'
    case 403:
      return 'Akses Ditolak'
    case 401:
      return 'Autentikasi Diperlukan'
    case 500:
      return 'Kesalahan Server'
    case 502:
      return 'Bad Gateway'
    case 503:
      return 'Layanan Tidak Tersedia'
    default:
      return 'Oops! Terjadi Kesalahan'
  }
})

const errorIcon = computed(() => {
  switch (errorCode.value) {
    case 404:
      return '🔍'
    case 403:
      return '🔒'
    case 401:
      return '🔐'
    case 500:
    case 502:
    case 503:
      return '⚠️'
    default:
      return '❌'
  }
})

const handleGoHome = () => {
  navigateTo('/')
}

const handleGoBack = () => {
  router.back()
}

const handleReload = () => {
  window.location.reload()
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 flex items-center justify-center px-4 py-12">
    <div class="max-w-2xl w-full">
      <div class="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        <div class="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8 text-center">
          <div class="text-6xl mb-4">{{ errorIcon }}</div>
          <h1 class="text-3xl font-bold text-white mb-2">{{ errorTitle }}</h1>
          <div class="inline-flex items-center justify-center px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">
            <span class="text-sm font-semibold text-white">Error {{ errorCode }}</span>
          </div>
        </div>

        <div class="px-6 py-8 sm:px-10 sm:py-10">
          <p class="text-center text-gray-600 text-lg mb-8">
            {{ errorMessage }}
          </p>

          <div v-if="props.error?.url" class="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p class="text-xs font-mono text-gray-500 break-all">
              <span class="font-semibold">URL:</span> {{ props.error.url }}
            </p>
          </div>

          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              @click="handleGoHome"
              class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Kembali ke Beranda</span>
            </button>

            <button
              v-if="errorCode === 500 || errorCode === 502 || errorCode === 503"
              @click="handleReload"
              class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all border border-gray-300 hover:border-gray-400 active:scale-95"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Muat Ulang</span>
            </button>

            <button
              v-else
              @click="handleGoBack"
              class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all border border-gray-300 hover:border-gray-400 active:scale-95"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Kembali</span>
            </button>
          </div>
        </div>

        <div class="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <p class="text-center text-sm text-gray-500">
            Jika masalah berlanjut, silakan hubungi administrator sistem.
          </p>
        </div>
      </div>

      <div class="mt-8 text-center">
        <p class="text-sm text-gray-600">
          Butuh bantuan? 
          <NuxtLink to="/" class="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
            Kembali ke halaman utama
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>