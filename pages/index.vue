<script setup lang="ts">
import { computed, watch } from 'vue'
import { ref } from 'vue'

useHead({
  title: 'VENUE UNDIP - Sewa Venue & Lapangan Olahraga',
  meta: [
    { name: 'description', content: 'Temukan dan sewa venue serta lapangan olahraga terbaik di Universitas Diponegoro. Booking mudah, cepat, dan terpercaya.' }
  ]
})

const { options } = useAppOptions()
const venueName = computed(() => options.value.data?.name || 'VENUE UNDIP')
const unitName = computed(() => options.value.data?.unitName || 'UPT Layanan Seni, Budaya dan Olahraga')
const unitDesc = computed(() => options.value.data?.unitDesc || 'Temukan stadion pilihan Anda. Lihat lapangan yang tersedia dan siap untuk dijadwalkan kapan saja Anda butuhkan.')

type StadiumCard = {
  id: number
  name: string
  status?: string
  description?: string
  bookingCount?: number
  images?: Array<{ id: number; imageUrl: string | null }>
  fields?: Array<{
    id: number
    status?: string
  }>
}

const fallbackImage = 'https://images.unsplash.com/photo-1522778526097-ce0a22ceb253?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'

const searchQuery = ref('')
const debouncedSearchQuery = ref('')
const sortBy = ref<'popularity' | 'alphabetical'>('popularity')
const currentPage = ref(1)
const itemsPerPage = 9

const { data: stadionsData, pending, error, refresh } = await useAsyncData<StadiumCard[]>(
  'home-stadions',
  () => $fetch<StadiumCard[]>('/api/stadions/with-bookings')
)

const filteredStadions = computed(() => {
  let list = stadionsData.value || []
  
  list = list.filter((stadion) => stadion.status === 'ACTIVE')
  
  const query = debouncedSearchQuery.value.trim().toLowerCase()
  
  if (query) {
    list = list.filter((stadion) => stadion.name?.toLowerCase().includes(query))
  }
  
  const sorted = [...list].sort((a, b) => {
    if (sortBy.value === 'alphabetical') {
      return (a.name || '').localeCompare(b.name || '', 'id')
    } else {
      return (b.bookingCount ?? 0) - (a.bookingCount ?? 0)
    }
  })
  
  return sorted
})

const paginatedStadions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredStadions.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredStadions.value.length / itemsPerPage))

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    
    const section = document.getElementById('stadium-list')
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
}

const scrollToStadiumList = () => {
  const section = document.getElementById('stadium-list')
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

let debounceTimeout: ReturnType<typeof setTimeout> | null = null
watch(searchQuery, (newValue) => {
  if (debounceTimeout) {
    clearTimeout(debounceTimeout)
  }
  debounceTimeout = setTimeout(() => {
    debouncedSearchQuery.value = newValue
    currentPage.value = 1
  }, 300)
})

watch(debouncedSearchQuery, () => {
  currentPage.value = 1
})

const handleSearch = () => {
  if (debounceTimeout) {
    clearTimeout(debounceTimeout)
  }
  debouncedSearchQuery.value = searchQuery.value
  currentPage.value = 1
}

const getCoverImage = (stadion: StadiumCard) => stadion.images?.[0]?.imageUrl || fallbackImage

const totalStadions = computed(() => 
  stadionsData.value?.filter(s => s.status === 'ACTIVE').length ?? 0
)

const activeFieldCount = (stadion?: StadiumCard) => 
  stadion?.fields?.filter(f => f.status === 'ACTIVE').length ?? 0

const totalFreeFields = computed(() =>
  stadionsData.value
    ?.filter(s => s.status === 'ACTIVE')
    .reduce((sum, s) => sum + activeFieldCount(s), 0) ?? 0
)

const formatNumber = (num: number) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k+'
  }
  return num.toString()
}

const topFreeStadions = computed(() => {
  const list = (stadionsData.value || []).filter(s => s.status === 'ACTIVE')
  
  const mapped = [...list]
    .map((s) => ({
      ...s,
      freeFields: activeFieldCount(s),
      bookingCountDisplay: formatNumber(s.bookingCount ?? 0),
      cover: getCoverImage(s),
    }))
    .filter((s) => (s.bookingCount ?? 0) > 0)
    .sort((a, b) => (b.bookingCount ?? 0) - (a.bookingCount ?? 0))
    .slice(0, 3)

  if (mapped.length === 0) {
    return [...list]
      .map((s) => ({ 
        ...s, 
        freeFields: activeFieldCount(s), 
        bookingCountDisplay: '0',
        cover: getCoverImage(s) 
      }))
      .sort((a, b) => b.freeFields - a.freeFields)
      .slice(0, 3)
  }
  return mapped
})

const goToDetail = (stadionId: number) => {
  navigateTo(`/venues/${stadionId}`)
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-[#f5f7fb] via-[#f8fafc] to-[#f5f7fb]">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6 lg:space-y-8">

      <section class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0f1f4a] via-[#1a2d5a] to-[#0f1f4a] px-6 py-10 text-white shadow-2xl shadow-[#0f1f4a]/40 sm:px-10 lg:py-12">
        <div class="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl"></div>
        
        <div class="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div class="space-y-3 max-w-xl">
            <div class="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 px-4 py-1.5">
              <span class="relative flex h-2.5 w-2.5">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span class="text-xs font-bold uppercase tracking-wider text-emerald-100">Statistik Terkini</span>
            </div>
            
            <div class="space-y-1.5">
              <p class="text-xs uppercase tracking-[0.2em] text-blue-200/70 font-semibold">Ringkasan Lapangan</p>
              <h2 class="uppercase text-3xl lg:text-4xl font-bold leading-[1.4] pb-1 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                {{ unitName }}
              </h2>
            </div>
            
            <p class="text-sm leading-relaxed text-blue-100/90 max-w-md">
              {{ unitDesc }}
            </p>
          </div>
          
          <div class="grid w-full max-w-md grid-cols-2 gap-3 sm:gap-4">
            <div 
              @click="scrollToStadiumList"
              class="group relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-4 sm:p-5 shadow-xl transition-transform duration-300 [@media(hover:hover)]:hover:-translate-y-1 [@media(hover:hover)]:hover:shadow-2xl cursor-pointer transform-gpu"
            >
              <div class="absolute inset-0 bg-white/0 [@media(hover:hover)]:group-hover:bg-white/10 transition-colors duration-300 pointer-events-none"></div>

              <div class="relative z-10">
                <div class="flex items-start justify-between mb-3">
                  <div class="flex items-center justify-center h-10 w-10 rounded-xl bg-blue-500/20 border border-blue-400/30">
                    <svg class="h-5 w-5 text-blue-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 3C6.48 3 2 5.24 2 8V12C2 14.76 6.48 17 12 17C17.52 17 22 14.76 22 12V8C22 5.24 17.52 3 12 3ZM4 8C4 6.34 7.58 5 12 5C16.42 5 20 6.34 20 8C20 9.66 16.42 11 12 11C7.58 11 4 9.66 4 8ZM20 12C20 12.24 19.94 12.48 19.8 12.71C18.92 14.15 15.78 15 12 15C8.22 15 5.08 14.15 4.2 12.71C4.06 12.48 4 12.24 4 12V10.74C5.77 11.64 8.64 12.25 12 12.25C15.36 12.25 18.23 11.64 20 10.74V12Z"/>
                    </svg>
                  </div>
                </div>
                <p class="text-[10px] uppercase tracking-wider text-blue-200/80 font-bold mb-1">Total Stadion</p>
                <p class="text-2xl sm:text-4xl font-black mb-1">{{ totalStadions }}</p>
                <p class="text-[10px] sm:text-xs text-blue-100/70 font-medium">Lokasi terdaftar</p>
              </div>
            </div>
            
            <div 
              @click="scrollToStadiumList"
              class="group relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-4 sm:p-5 shadow-xl transition-transform duration-300 [@media(hover:hover)]:hover:-translate-y-1 [@media(hover:hover)]:hover:shadow-2xl cursor-pointer transform-gpu"
            >
              <div class="absolute inset-0 bg-white/0 [@media(hover:hover)]:group-hover:bg-white/10 transition-colors duration-300 pointer-events-none"></div>

              <div class="relative z-10">
                <div class="flex items-start justify-between mb-3">
                  <div class="flex items-center justify-center h-10 w-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30">
                    <svg class="h-5 w-5 text-emerald-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4 5C2.9 5 2 5.9 2 7V17C2 18.1 2.9 19 4 19H20C21.1 19 22 18.1 22 17V7C22 5.9 21.1 5 20 5H4ZM4 7H11V17H4V7ZM13 7H20V17H13V7ZM9 9C8.45 9 8 9.45 8 10C8 10.55 8.45 11 9 11C9.55 11 10 10.55 10 10C10 9.45 9.55 9 9 9ZM15 9C14.45 9 14 9.45 14 10C14 10.55 14.45 11 15 11C15.55 11 16 10.55 16 10C16 9.45 15.55 9 15 9Z"/>
                    </svg>
                  </div>
                </div>
                <p class="text-[10px] uppercase tracking-wider text-blue-200/80 font-bold mb-1">Lapangan Aktif</p>
                <p class="text-2xl sm:text-4xl font-black mb-1">{{ totalFreeFields }}</p>
                <p class="text-[10px] sm:text-xs text-blue-100/70 font-medium">Siap dijadwalkan</p>
              </div>
            </div>
          </div>
        </div>

        <div class="relative z-10 mt-6 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-bold text-white flex items-center gap-2">
              <svg class="h-5 w-5 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              Stadion Terpopuler
            </h3>
          </div>
          
          <div class="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <NuxtLink
              v-for="stadion in topFreeStadions"
              :key="stadion.id"
              :to="`/venues/${stadion.id}`"
              class="group relative flex gap-3 overflow-hidden rounded-lg border border-white/20 bg-white/5 backdrop-blur-sm p-2.5 transition-all duration-300 [@media(hover:hover)]:hover:border-amber-400/40 [@media(hover:hover)]:hover:bg-white/10 [@media(hover:hover)]:hover:shadow-lg [@media(hover:hover)]:hover:shadow-amber-500/10"
            >
              <!-- Badge Top Rank -->
              <div class="absolute -top-1 -left-1 flex items-center justify-center w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-br-lg shadow-md z-10">
                <span class="text-xs font-black text-white">{{ topFreeStadions.indexOf(stadion) + 1 }}</span>
              </div>

              <!-- Image Thumbnail -->
              <div class="relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-md">
                <img :src="stadion.cover" :alt="stadion.name" class="h-full w-full object-cover transition-transform duration-500 [@media(hover:hover)]:group-hover:scale-110" />
                <div class="absolute inset-0 bg-gradient-to-br from-black/20 to-black/40"></div>
              </div>

              <!-- Content -->
              <div class="flex-1 flex flex-col justify-between min-w-0 py-0.5">
                <div>
                  <h4 class="text-sm font-bold text-white leading-tight line-clamp-1 mb-1.5 [@media(hover:hover)]:group-hover:text-amber-300 transition-colors">
                    {{ stadion.name }}
                  </h4>
                  <div class="flex flex-col gap-0.5 text-[11px]">
                    <div class="flex items-center gap-1.5 text-blue-100/80">
                      <svg class="h-3 w-3 text-amber-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                      </svg>
                      <span><span class="font-bold text-white">{{ stadion.bookingCountDisplay }}</span> orang telah booking</span>
                    </div>
                    <div class="flex items-center gap-1.5 text-blue-100/80">
                      <svg class="h-3 w-3 text-emerald-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                      </svg>
                      <span><span class="font-bold text-white">{{ stadion.freeFields }}</span> lapangan tersedia</span>
                    </div>
                  </div>
                </div>
                
                <!-- Arrow Icon -->
                <div class="flex items-center justify-end mt-1">
                  <svg class="h-3.5 w-3.5 text-white/60 transition-all [@media(hover:hover)]:group-hover:text-amber-300 [@media(hover:hover)]:group-hover:translate-x-0.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>
      </section>

      <section class="rounded-2xl bg-white p-6 shadow-lg shadow-gray-200/50 border border-gray-100/50">
        <div class="flex flex-col gap-3">
          <div class="flex flex-col sm:flex-row items-stretch gap-3">
            <!-- Search Input -->
            <div class="flex flex-1 items-center gap-3 rounded-xl border-2 border-gray-200 px-4 py-3.5 text-sm transition-all duration-200 focus-within:border-[#1f2a56] focus-within:ring-4 focus-within:ring-[#1f2a56]/10">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Cari stadion berdasarkan nama..."
                v-model="searchQuery"
                @keyup.enter="handleSearch"
                class="w-full border-none text-gray-700 placeholder:text-gray-400 focus:outline-none font-medium"
              >
              <button 
                v-if="searchQuery"
                @click="searchQuery = ''; debouncedSearchQuery = ''"
                class="text-gray-400 [@media(hover:hover)]:hover:text-gray-600 active:text-gray-600 transition-colors"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            
            <!-- Sort Filter + Search Button Container (Mobile: Side by side, Desktop: Inline) -->
            <div class="flex items-stretch gap-3 sm:flex-shrink-0">
              <!-- Sort Filter -->
              <div class="inline-flex rounded-xl border-2 border-gray-200 bg-gray-50 p-1 shadow-sm flex-shrink-0">
                <button
                  @click="sortBy = 'popularity'; currentPage = 1"
                  :class="[
                    'flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs font-bold rounded-lg transition-all duration-200 whitespace-nowrap',
                    sortBy === 'popularity'
                      ? 'bg-gradient-to-r from-[#1f2a56] to-[#0f1a3c] text-white shadow-md'
                      : 'text-gray-600 [@media(hover:hover)]:hover:bg-white/50 active:bg-white/50'
                  ]"
                  title="Urutkan berdasarkan popularitas"
                >
                  <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                  </svg>
                  <span class="hidden sm:inline">Popular</span>
                </button>
                <button
                  @click="sortBy = 'alphabetical'; currentPage = 1"
                  :class="[
                    'flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs font-bold rounded-lg transition-all duration-200 whitespace-nowrap',
                    sortBy === 'alphabetical'
                      ? 'bg-gradient-to-r from-[#1f2a56] to-[#0f1a3c] text-white shadow-md'
                      : 'text-gray-600 [@media(hover:hover)]:hover:bg-white/50 active:bg-white/50'
                  ]"
                  title="Urutkan A-Z"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 7h6m0 0V5m0 2v2m6-2h6M9 17h6m0 0v-2m0 2v2m-6-2H3"/>
                  </svg>
                  A-Z
                </button>
              </div>
              
              <!-- Search Button -->
              <button
                @click="handleSearch"
                class="group inline-flex flex-1 sm:flex-initial items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-[#1f2a56] to-[#0f1a3c] px-5 sm:px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#1f2a56]/20 transition-all duration-300 [@media(hover:hover)]:hover:shadow-xl [@media(hover:hover)]:hover:shadow-[#1f2a56]/30 [@media(hover:hover)]:hover:-translate-y-0.5 active:scale-[0.98]"
              >
                <svg class="h-5 w-5 transition-transform [@media(hover:hover)]:group-hover:scale-110" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <span class="hidden sm:inline">Cari Sekarang</span>
                <span class="sm:hidden">Cari</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section v-if="pending" class="grid w-full place-items-center rounded-2xl bg-white py-16 shadow-lg border border-gray-100">
        <div class="flex flex-col items-center gap-4">
          <div class="relative">
            <div class="h-16 w-16 rounded-full border-4 border-gray-200"></div>
            <div class="absolute top-0 h-16 w-16 animate-spin rounded-full border-4 border-[#1f2a56] border-t-transparent"></div>
          </div>
          <p class="text-gray-600 font-medium">Memuat data stadion...</p>
        </div>
      </section>
      
      <section
        v-else-if="error"
        class="grid w-full place-items-center rounded-2xl bg-white py-16 shadow-lg border border-red-100"
      >
        <div class="space-y-5 text-center max-w-md">
          <div class="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
            <svg class="h-8 w-8 text-red-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Gagal Memuat Data</h3>
            <p class="text-sm text-gray-600 max-w-xs mx-auto leading-relaxed">
              Layanan sedang tidak tersedia saat ini. Mohon periksa koneksi internet Anda atau coba muat ulang halaman.
            </p>
            <details class="group mt-2">
              <summary class="cursor-pointer text-xs text-gray-400 [@media(hover:hover)]:hover:text-gray-600 active:text-gray-600 transition-colors select-none list-none flex items-center justify-center gap-1">
                <span>Detail Error</span>
                <svg class="w-3 h-3 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
              </summary>
              <pre class="mt-2 p-3 bg-gray-50 rounded-lg text-[10px] text-red-500 font-mono text-left overflow-x-auto border border-gray-100 whitespace-pre-wrap break-all">{{ error.message }}</pre>
            </details>
          </div>
          <button 
            class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1f2a56] to-[#0f1a3c] px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all [@media(hover:hover)]:hover:shadow-xl [@media(hover:hover)]:hover:-translate-y-0.5 active:scale-[0.98]" 
            @click="refresh()"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            Coba Lagi
          </button>
        </div>
      </section>

      <section v-else-if="searchQuery && filteredStadions.length === 0" class="grid w-full place-items-center rounded-2xl bg-white py-16 shadow-lg border border-gray-100">
        <div class="space-y-5 text-center max-w-md">
          <div class="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-100">
            <svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Tidak Ada Hasil</h3>
            <p class="text-sm text-gray-600">Tidak ada stadion yang cocok dengan "<span class="font-semibold">{{ searchQuery }}</span>"</p>
            <p class="text-xs text-gray-500 mt-2">Coba gunakan kata kunci lain atau periksa ejaan.</p>
          </div>
          <button 
            @click="searchQuery = ''"
            class="inline-flex items-center gap-2 rounded-xl bg-gray-100 px-6 py-3 text-sm font-semibold text-gray-700 transition-all [@media(hover:hover)]:hover:bg-gray-200 active:bg-gray-200"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
            Hapus Pencarian
          </button>
        </div>
      </section>

      <section v-else id="stadium-list">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">
              {{ searchQuery ? 'Hasil Pencarian' : 'Semua Stadion' }}
            </h2>
            <p class="text-sm text-gray-600 mt-1">
              {{ searchQuery ? `${filteredStadions.length} stadion ditemukan` : `Menampilkan ${paginatedStadions.length} dari ${filteredStadions.length} stadion` }}
            </p>
          </div>
        </div>
        
        <TransitionGroup 
          name="stadium-list" 
          tag="div" 
          class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8"
        >
          <article
              v-for="stadion in paginatedStadions"
              :key="stadion.id"
              class="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-sm [@media(hover:hover)]:hover:shadow-lg [@media(hover:hover)]:hover:border-blue-300 transition-all duration-300 cursor-pointer h-full"
              @click="goToDetail(stadion.id)"
            >
            <div class="relative h-48 w-full overflow-hidden bg-gray-100">
              <img
                :src="getCoverImage(stadion)"
                :alt="stadion.name"
                class="h-full w-full object-cover transition-transform duration-500 [@media(hover:hover)]:group-hover:scale-105"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60"></div>
            </div>

            <div class="flex flex-col flex-1 p-5">
              <div class="flex-1">
                <p class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Venue</p>
                <h3 class="text-lg font-bold text-gray-900 [@media(hover:hover)]:group-hover:text-blue-700 transition-colors line-clamp-2">
                  {{ stadion.name }}
                </h3>
              </div>

              <div class="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div class="flex items-center gap-1.5 text-xs text-gray-500">
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  <span class="font-semibold text-gray-700">{{ activeFieldCount(stadion) }}</span>
                  <span>Lapangan Aktif</span>
                </div>
                <div class="flex items-center gap-1 text-sm font-bold text-blue-600 [@media(hover:hover)]:group-hover:translate-x-1 transition-transform">
                  Lihat Jadwal
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </article>
        </TransitionGroup>

        <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 mt-8">
          <button
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="p-2 rounded-lg border border-gray-200 [@media(hover:hover)]:hover:bg-gray-50 active:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div class="flex items-center gap-1">
            <button
              v-for="page in totalPages"
              :key="page"
              @click="changePage(page)"
              :class="[
                'w-10 h-10 rounded-lg text-sm font-semibold transition-all duration-200',
                currentPage === page
                  ? 'bg-[#1f2a56] text-white shadow-lg shadow-[#1f2a56]/20 scale-105'
                  : 'text-gray-600 [@media(hover:hover)]:hover:bg-gray-100 active:bg-gray-100'
              ]"
            >
              {{ page }}
            </button>
          </div>

          <button
            @click="changePage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="p-2 rounded-lg border border-gray-200 [@media(hover:hover)]:hover:bg-gray-50 active:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </section>
    </div>

    <ClientWhatsAppFloatingButton />
  </div>
</template>

<style scoped>
.stadium-list-enter-active,
.stadium-list-leave-active {
  transition: all 0.3s ease;
}
.stadium-list-enter-from,
.stadium-list-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>