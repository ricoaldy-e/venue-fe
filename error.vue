<script setup lang="ts">
import Lonely404 from '~/assets/lottie/lonely-404.json'
import SadWalking from '~/assets/lottie/sad-walking.json'

import LottieAnimation from '~/components/LottieAnimation.vue'

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

const currentAnimation = computed(() => {
  if (errorCode.value === 404) {
    return Lonely404
  }
  return SadWalking
})

const errorMessage = computed(() => {
  if (props.error?.statusMessage) return props.error.statusMessage
  if (props.error?.message) return props.error.message
  
  switch (errorCode.value) {
    case 404:
      return 'Halaman yang Anda cari tidak ditemukan'
    case 403:
      return 'Maaf, Anda tidak memiliki izin untuk mengakses halaman ini.'
    case 500:
      return 'Terjadi kesalahan pada server'
    case 502:
      return 'Layanan sedang tidak dapat dihubungi saat ini.'
    case 503:
      return 'Layanan sedang dalam pemeliharaan rutin.'
    default:
      return 'Terjadi kesalahan yang tidak terduga.'
  }
})

const errorTitle = computed(() => {
  switch (errorCode.value) {
    case 404:
      return 'Halaman Tidak Ditemukan'
    case 502:
      return 'Koneksi Terputus'
    case 500:
      return 'Kesalahan Sistem'
    default:
      return 'Terjadi Kesalahan'
  }
})

const handleGoHome = () => {
  const errorDismissed = useState<boolean>('app-error-dismissed')
  errorDismissed.value = true
  clearError({ redirect: '/' })
}

const handleGoBack = () => {
  const errorDismissed = useState<boolean>('app-error-dismissed')
  errorDismissed.value = true
  router.back()
  clearError()
}

const handleReload = () => {
  const errorDismissed = useState<boolean>('app-error-dismissed')
  errorDismissed.value = false
  window.location.reload()
}

const { options, fetchOptions } = useAppOptions()
const currentYear = new Date().getFullYear()
const appName = computed(() => options.value.data?.name || 'VENUE UNDIP')

onMounted(() => {
  fetchOptions()
})
</script>

<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-white sm:bg-gray-50 px-4 sm:px-6 py-12 relative overflow-hidden">
    
    <div class="w-full max-w-5xl grid lg:grid-cols-2 gap-8 lg:gap-12 items-center mx-auto z-10">
    
      <div class="space-y-6 text-center lg:text-left order-2 lg:order-1">
        
        <div class="space-y-4">
          <div class="inline-flex items-center justify-center px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 font-bold text-xs tracking-wide shadow-sm">
            ERROR {{ errorCode }}
          </div>
          
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight leading-tight">
            {{ errorTitle }}
          </h1>
          
          <p class="text-base sm:text-lg text-gray-500 leading-relaxed font-medium max-w-xl mx-auto lg:mx-0">
            {{ errorMessage }}
          </p>
  
          <div v-if="props.error?.url" class="mt-2 p-2 bg-gray-50 rounded border border-gray-200 inline-block text-left">
            <p class="text-[10px] font-mono text-gray-400 break-all">
              <span class="font-bold text-gray-500">Source:</span> {{ props.error.url }}
            </p>
          </div>
        </div>
  
        <div class="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-2">
          <button
            v-if="errorCode === 500 || errorCode === 502 || errorCode === 503"
            @click="handleReload"
            class="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-200 text-sm font-bold rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-200 transition-all shadow-sm hover:shadow active:scale-[0.98]"
          >
            <svg class="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            Coba Lagi
          </button>
          
          <button
            v-else
            @click="handleGoBack"
            class="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-200 text-sm font-bold rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-200 transition-all shadow-sm hover:shadow active:scale-[0.98]"
          >
            <svg class="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            Kembali
          </button>

          <button
            @click="handleGoHome"
            class="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            Kembali ke Beranda
          </button>
        </div>
  
      </div>
  
      <div class="order-1 lg:order-2 flex justify-center items-center relative w-full">
         <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] bg-gradient-to-tr from-blue-100/40 via-indigo-50/40 to-white rounded-full blur-3xl -z-10"></div>
         
         <div 
           class="w-full transition-all duration-500 hover:scale-105"
           :class="errorCode === 404 ? 'max-w-[240px] sm:max-w-xs lg:max-w-md' : 'max-w-[180px] sm:max-w-[220px] lg:max-w-[300px]'"
         >
            <LottieAnimation
              :animation-data="currentAnimation"
              :loop="true"
              :auto-play="true"
            />
         </div>
      </div>
  
    </div>

    <div class="absolute bottom-4 left-0 w-full text-center px-4">
      <p class="text-xs text-gray-400 font-medium">
        &copy; {{ currentYear }} <span class="text-gray-500 font-semibold">{{ appName }}</span>. All rights reserved.
      </p>
    </div>
  </div>
</template>