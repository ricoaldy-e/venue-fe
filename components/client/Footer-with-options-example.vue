<template>
  <footer class="mt-16 bg-gradient-to-br from-[#0f1f4a] via-[#1a2d5a] to-[#0f1f4a] text-white">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <!-- Info Section with Dynamic Options Data -->
      <div class="mb-8 p-6 bg-white/5 rounded-xl border border-white/10" v-if="appOptions.data">
        <div class="space-y-2">
          <h2 class="text-xl font-bold text-white">{{ appOptions.data.name }}</h2>
          <p class="text-sm text-blue-100/80">{{ appOptions.data.description }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 mb-12">
        <!-- Logo Section -->
        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <img
              src="~/assets/images/VENUE-UNDIP-LOGO.png"
              alt="Venue UNDIP Logo"
              class="h-10 w-10 object-contain drop-shadow-lg"
            />
            <div>
              <p class="text-lg font-bold leading-tight">{{ appName }}</p>
              <p class="text-xs text-blue-200/70">Booking Lapangan</p>
            </div>
          </div>
          <p class="text-sm text-blue-100/80 leading-relaxed">
            {{ appDescription }}
          </p>
        </div>

        <!-- Navigation -->
        <div class="space-y-4">
          <h3 class="text-sm font-bold uppercase tracking-wider text-white mb-4">Navigasi</h3>
          <ul class="space-y-2.5">
            <li>
              <button @click="handleBerandaClick" class="group inline-flex items-center gap-2 text-sm text-blue-100/80 hover:text-white transition-all duration-200">
                <span class="relative">
                  Beranda
                  <span class="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                </span>
              </button>
            </li>
            <li>
              <button @click="handleStadionClick" class="group inline-flex items-center gap-2 text-sm text-blue-100/80 hover:text-white transition-all duration-200">
                <span class="relative">
                  Stadion
                  <span class="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                </span>
              </button>
            </li>
            <li>
              <NuxtLink to="/admin/login" class="group inline-flex items-center gap-2 text-sm text-blue-100/80 hover:text-white transition-all duration-200">
                <span class="relative">
                  Admin Panel
                  <span class="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                </span>
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Help Section -->
        <div class="space-y-4">
          <h3 class="text-sm font-bold uppercase tracking-wider text-white mb-4">Bantuan</h3>
          <ul class="space-y-2.5">
            <li>
              <a href="https://helpdesk.undip.ac.id" target="_blank" rel="noopener noreferrer" class="group inline-flex items-center gap-2 text-sm text-blue-100/80 hover:text-white transition-all duration-200">
                <span class="relative">
                  Pusat Bantuan
                  <span class="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                </span>
              </a>
            </li>
            <li>
              <NuxtLink to="/bantuan/panduan-booking" class="group inline-flex items-center gap-2 text-sm text-blue-100/80 hover:text-white transition-all duration-200">
                <span class="relative">
                  Panduan Booking
                  <span class="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                </span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/bantuan/kebijakan-privasi" class="group inline-flex items-center gap-2 text-sm text-blue-100/80 hover:text-white transition-all duration-200">
                <span class="relative">
                  Kebijakan Privasi
                  <span class="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                </span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/bantuan/syarat-ketentuan" class="group inline-flex items-center gap-2 text-sm text-blue-100/80 hover:text-white transition-all duration-200">
                <span class="relative">
                  Syarat & Ketentuan
                  <span class="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                </span>
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Contact Section - Using Dynamic Options Data -->
        <div class="space-y-4">
          <h3 class="text-sm font-bold uppercase tracking-wider text-white mb-4">Hubungi Kami</h3>
          <ul class="space-y-3">
            <li class="group flex items-start gap-3">
              <svg class="h-5 w-5 text-blue-300 flex-shrink-0 mt-0.5 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              <a :href="`mailto:${contactEmail}`" class="text-sm text-blue-100/80 hover:text-white transition-colors duration-200 break-all hover:underline underline-offset-2">
                {{ contactEmail }}
              </a>
            </li>
            <li class="group flex items-start gap-3">
              <svg class="h-5 w-5 text-blue-300 flex-shrink-0 mt-0.5 group-hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <a :href="whatsappLink" target="_blank" rel="noopener noreferrer" class="text-sm text-blue-100/80 hover:text-white transition-colors duration-200 hover:underline underline-offset-2">
                {{ contactPhone }}
              </a>
            </li>
            <li class="group flex items-start gap-3">
              <svg class="h-5 w-5 text-blue-300 flex-shrink-0 mt-0.5 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <a :href="mapsLink" target="_blank" rel="noopener noreferrer" class="text-sm text-blue-100/80 hover:text-white transition-colors duration-200 hover:underline underline-offset-2">
                {{ contactAddress }}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t border-white/10"></div>

      <div class="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="text-sm text-blue-100/70 text-center sm:text-left">
          &copy; {{ new Date().getFullYear() }} {{ appName }}. Semua hak cipta dilindungi.
        </p>
        
        <!-- Social Media Icons -->
        <div class="flex items-center gap-3">
          <a href="https://undip.ac.id" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-110 hover:-translate-y-1" title="Website Resmi UNDIP">
            <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
            </svg>
          </a>
          <a href="https://www.instagram.com/undip.official" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-110 hover:-translate-y-1" title="Instagram">
            <svg class="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12c0 6.627 5.373 12 12 12s12-5.373 12-12c0-6.627-5.373-12-12-12zm0 2.25c5.385 0 9.75 4.365 9.75 9.75s-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12 6.615 2.25 12 2.25zm0 1.688c-4.454 0-8.062 3.608-8.062 8.062S7.546 20.062 12 20.062s8.062-3.608 8.062-8.062S16.454 3.938 12 3.938zm0 1.312c3.727 0 6.75 3.023 6.75 6.75s-3.023 6.75-6.75 6.75-6.75-3.023-6.75-6.75 3.023-6.75 6.75-6.75zm3.938-1.312c-.58 0-1.05.47-1.05 1.05s.47 1.05 1.05 1.05 1.05-.47 1.05-1.05-.47-1.05-1.05-1.05z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppOptions } from '~/composables/useAppOptions'

const route = useRoute()
const router = useRouter()

// Use global app options - fetched once on app load
const { options: appOptions } = useAppOptions()

// Computed values with fallbacks
const appName = computed(() => appOptions.value.data?.name || 'VENUE UNDIP')
const appDescription = computed(() => 
  appOptions.value.data?.description || 
  'Platform booking lapangan olahraga terpercaya untuk Sivitas Akademika Universitas Diponegoro.'
)
const contactEmail = computed(() => appOptions.value.data?.email || 'helpdesk@live.undip.ac.id')
const contactPhone = computed(() => appOptions.value.data?.nohp || '+62 851 6566 0339')
const contactAddress = computed(() => 
  appOptions.value.data?.address || 
  'Jl. Prof. Soedarto, Tembalang, Kec. Tembalang, Kota Semarang, Jawa Tengah'
)

// WhatsApp link
const whatsappLink = computed(() => {
  const phone = contactPhone.value.replace(/[^0-9]/g, '')
  return `https://wa.me/${phone}`
})

// Google Maps link
const mapsLink = computed(() => {
  const encodedAddress = encodeURIComponent(contactAddress.value)
  return `https://maps.google.com/?q=${encodedAddress}`
})

const handleBerandaClick = () => {
  if (route.path === '/') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    router.push('/')
  }
}

const handleStadionClick = () => {
  if (route.path === '/') {
    scrollToStadiumList()
  } else {
    router.push('/').then(() => {
      setTimeout(() => {
        scrollToStadiumList()
      }, 1000)
    })
  }
}

const scrollToStadiumList = () => {
  const section = document.getElementById('stadium-list')
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>
