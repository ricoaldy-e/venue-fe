<script setup lang="ts">
import { computed } from 'vue'

definePageMeta({
  middleware: 'auth-admin',
  layout: 'admin'
})

const { options } = useAppOptions()
const appName = computed(() => options.value.data?.name || 'VENUE UNDIP')

useHead({
  title: 'Kelola Booking - VENUE UNDIP',
  meta: [
    { name: 'description', content: 'Pilih stadion untuk kelola booking lapangan di VENUE UNDIP' }
  ]
})

interface Images {
  imageUrl: string
}

interface StadionRow {
  id: number
  name: string
  status: string
  images?: Images[]
  fields?: any[] 
  _count?: { fields: number }
}

const { data: stadions, pending, error, refresh } = await useAsyncData(
  'stadionsList',
  () => $fetch<StadionRow[]>('/api/stadions')
)

const stadionsRef = computed(() => {
  const list = stadions.value || []
  return [...list].sort((a, b) => {
    const aCount = a._count?.fields ?? a.fields?.length ?? 0
    const bCount = b._count?.fields ?? b.fields?.length ?? 0
    return bCount - aCount
  })
})
const { searchQuery, filteredItems: filteredStadions } = useSearch(
  stadionsRef,
  (stadion) => [stadion.name]
)

const { 
  currentPage, 
  paginatedItems: paginatedStadions, 
  summary: paginationSummary, 
  nextPage, 
  prevPage,
  totalPages
} = usePagination(filteredStadions, { itemsPerPage: 6 })

const fallbackImage = 'https://images.unsplash.com/photo-1522778526097-ce0a22ceb253?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
</script>

<template>
  <section class="flex w-full flex-col gap-6 sm:gap-8 pb-16 max-w-7xl mx-auto">
    
    <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
      <div class="flex items-start gap-4">
        <div class="p-3 bg-blue-50 rounded-xl border border-blue-100 shrink-0 hidden sm:flex items-center justify-center">
          <svg class="w-6 h-6 text-blue-600" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 3C4.9 3 4 3.9 4 5V21L12 17L20 21V5C20 3.9 19.1 3 18 3H6ZM6 5H18V17.97L12 15.2L6 17.97V5Z"/>
          </svg>
        </div>
        <div>
          <h1 class="text-2xl uppercase font-bold text-gray-900 tracking-tight">Kelola Booking</h1>
          <p class="text-sm text-gray-500 mt-1">
            Pilih stadion untuk melihat jadwal ketersediaan dan mengelola reservasi.
          </p>
        </div>
      </div>
      
      <NuxtLink 
        to="/admin/bookings/history"
        class="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 hover:shadow-md transition-all active:scale-95"
      >
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Riwayat Booking</span>
      </NuxtLink>
    </header>

    <div class="flex flex-col gap-6">
      
      <div class="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden flex flex-col">
        <div class="p-5 border-b border-gray-300 bg-gray-50/30 flex flex-col md:flex-row justify-between items-center gap-4">
          <div class="relative w-full md:max-w-xs">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              v-model="searchQuery"
              type="search"
              class="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-500 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
              placeholder="Cari stadion berdasarkan nama..."
            />
          </div>
        </div>
      </div>

      <div v-if="error" class="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
        <p class="font-semibold text-sm">Gagal memuat data venue.</p>
        <button @click="refresh()" class="mt-2 underline font-bold hover:text-red-800">Coba lagi</button>
      </div>

      <div v-else-if="pending" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        <div v-for="i in 3" :key="i" class="bg-white rounded-2xl border border-gray-200 h-80 overflow-hidden">
          <div class="h-48 bg-gray-200 w-full"></div>
          <div class="p-5 space-y-3">
            <div class="h-5 bg-gray-200 rounded w-3/4"></div>
            <div class="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>

      <div v-else-if="filteredStadions.length === 0" class="rounded-2xl border border-dashed border-gray-300 bg-gray-50 py-16 text-center">
        <div class="p-4 bg-white rounded-full inline-block shadow-sm mb-3">
          <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h3 class="text-base font-bold text-gray-900">Venue tidak ditemukan</h3>
        <p class="text-sm text-gray-500 mt-1">Tidak ada stadion aktif atau sesuai pencarian.</p>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <article
          v-for="venue in paginatedStadions"
          :key="venue.id"
          class="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all duration-300 cursor-pointer h-full"
          @click="navigateTo(`/admin/bookings/${venue.id}`)"
        >
          <div class="relative h-48 w-full overflow-hidden bg-gray-100">
            <img 
              :src="venue.images?.[0]?.imageUrl || fallbackImage" 
              :alt="venue.name" 
              class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              onerror="this.src='https://images.unsplash.com/photo-1529900748604-07564a03e7a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'"
            >
            <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60"></div>
          </div>

          <div class="flex flex-col flex-1 p-5">
            <div class="flex-1">
              <p class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Venue</p>
              <h3 class="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-2">
                {{ venue.name }}
              </h3>
            </div>

            <div class="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
              <div class="flex items-center gap-1.5 text-xs text-gray-500">
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                <span class="font-semibold text-gray-700">{{ venue._count?.fields ?? venue.fields?.length ?? 0 }}</span>
                <span>Lapangan</span>
              </div>
              <div class="flex items-center gap-1 text-sm font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
                Lihat Jadwal
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </article>
      </div>

      <nav
        v-if="!pending && totalPages > 1"
        class="flex flex-col-reverse items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm sm:flex-row"
      >
        <span class="text-xs text-gray-500 font-medium">
          {{ paginationSummary }}
        </span>

        <div class="flex items-center gap-2">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>

          <div class="px-4 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 shadow-sm">
            {{ currentPage }} / {{ totalPages }}
          </div>

          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </nav>

    </div>
  </section>
</template>
