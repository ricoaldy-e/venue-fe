<template>
  <header 
    :class="[
      'sticky top-0 z-[60] bg-gradient-to-br from-[#f5f7fb] via-[#f8fafc] to-[#f5f7fb] backdrop-blur-sm border-b border-gray-200/50 transition-shadow duration-300',
      isScrolled ? 'shadow-lg' : 'shadow-sm'
    ]"
  >
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5">
      <div class="flex items-center justify-between gap-3 lg:gap-6">
        <button @click="handleHomeClick" class="group flex items-center gap-2.5 sm:gap-3 flex-shrink-0 text-left transition-all duration-300 cursor-pointer">
          <img 
            src="~/assets/images/VENUE-UNDIP-LOGO.png" 
            alt="Venue UNDIP Logo" 
            class="h-10 w-10 sm:h-12 sm:w-14 object-contain flex-shrink-0 group-hover:scale-105 transition-all duration-300 drop-shadow-lg"
          />
          <div class="min-w-0">
            <div class="text-lg sm:text-2xl font-bold tracking-tight text-[#1f2a56] truncate group-hover:text-[#0f1a3c] group-hover:scale-105 transition-all duration-300 origin-left">VENUE UNDIP</div>
            <div class="block sm:hidden text-xs text-gray-500 font-medium truncate group-hover:text-gray-700 group-hover:scale-105 transition-all duration-300 origin-left">Booking Lapangan Olahraga UNDIP</div>
            <div class="hidden sm:block text-xs text-gray-500 font-medium truncate group-hover:text-gray-700 group-hover:scale-105 transition-all duration-300 origin-left">Booking Lapangan Olahraga Universitas Diponegoro</div>
          </div>
        </button>
        
        <div class="hidden lg:flex items-center gap-3 xl:gap-16 flex-1 justify-center px-6">
          <div class="relative group">
            <img 
              src="~/assets/images/icon/icon-badminton.png"
              alt="Badminton"
              class="h-7 w-7 xl:h-8 xl:w-8 object-contain opacity-40 grayscale group-hover:opacity-70 group-hover:grayscale-0 group-hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            />
            <span class="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Smash!</span>
          </div>
          
          <div class="relative group">
            <img 
              src="~/assets/images/icon/icon-football.png"
              alt="Football"
              class="h-7 w-7 xl:h-8 xl:w-8 object-contain opacity-40 grayscale group-hover:opacity-70 group-hover:grayscale-0 group-hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            />
            <span class="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Siuu!</span>
          </div>
          
          <div class="relative group">
            <img 
              src="~/assets/images/icon/icon-basket.png"
              alt="Basketball"
              class="h-7 w-7 xl:h-8 xl:w-8 object-contain opacity-40 grayscale group-hover:opacity-70 group-hover:grayscale-0 group-hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            />
            <span class="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Dunk!</span>
          </div>
          
          <div class="relative group">
            <img 
              src="~/assets/images/icon/icon-futsal.png"
              alt="Futsal"
              class="h-7 w-7 xl:h-8 xl:w-8 object-contain opacity-40 grayscale group-hover:opacity-70 group-hover:grayscale-0 group-hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            />
            <span class="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Shoot!</span>
          </div>
          
          <div class="relative group">
            <img 
              src="~/assets/images/icon/icon-tenis.png"
              alt="Tennis"
              class="h-7 w-7 xl:h-8 xl:w-8 object-contain opacity-40 grayscale group-hover:opacity-70 group-hover:grayscale-0 group-hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            />
            <span class="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Ace!</span>
          </div>
          
          <div class="relative group">
            <img 
              src="~/assets/images/icon/icon-voli.png"
              alt="Volleyball"
              class="h-7 w-7 xl:h-8 xl:w-8 object-contain opacity-40 grayscale group-hover:opacity-70 group-hover:grayscale-0 group-hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            />
            <span class="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Spike!</span>
          </div>
          
          <div class="relative group">
            <img 
              src="~/assets/images/icon/icon-karate.png"
              alt="Karate"
              class="h-7 w-7 xl:h-8 xl:w-8 object-contain opacity-40 -scale-x-100 grayscale group-hover:opacity-70 group-hover:grayscale-0 group-hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            />
            <span class="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Shaah!</span>
          </div>

          <div class="relative group">
            <img 
              src="~/assets/images/icon/icon-panahan.png"
              alt="Archery"
              class="h-7 w-7 xl:h-8 xl:w-8 object-contain opacity-40 -scale-x-100 grayscale group-hover:opacity-70 group-hover:grayscale-0 group-hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            />
            <span class="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Arrow!</span>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const route = useRoute()
const router = useRouter()

const isScrolled = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleHomeClick = () => {
  if (route.path === '/') {
    scrollToTop()
  } else {
    router.push('/')
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
