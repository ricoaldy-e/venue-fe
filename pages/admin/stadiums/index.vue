<script setup lang="ts">
import { computed } from 'vue'

definePageMeta({
  middleware: 'auth-admin',
  layout: 'admin',
})

const { options } = useAppOptions()
const appName = computed(() => options.value.data?.name || 'VENUE UNDIP')

useHead({
  title: 'Kelola Stadion - VENUE UNDIP',
  meta: [
    { name: 'description', content: 'Kelola daftar stadion dan venue olahraga di VENUE UNDIP' }
  ]
})

interface StadionRow {
  id: number
  name: string
  status: 'ACTIVE' | 'INACTIVE'
  fields: any[]
  created_at?: string
}

const { data: rawStadions, pending, error, refresh } = await useAsyncData(
  'stadionsList',
  () => $fetch<StadionRow[]>('/api/stadions')
)

const stadionsRef = computed(() => rawStadions.value || [])
const { searchQuery, filteredItems: filteredStadions } = useSearch(
  stadionsRef,
  (stadion) => [stadion.name, String(stadion.id)]
)

const { 
  currentPage, 
  paginatedItems: paginatedStadions, 
  summary: paginationSummary, 
  nextPage, 
  prevPage,
  totalPages
} = usePagination(filteredStadions)

const getStatusClasses = (status: 'ACTIVE' | 'INACTIVE') => {
  return status === 'ACTIVE'
    ? 'bg-green-50 text-green-700 border border-green-200'
    : 'bg-red-50 text-red-700 border border-red-200'
}
</script>

<template>
  <section class="flex w-full flex-col gap-6 sm:gap-8 pb-16 max-w-7xl mx-auto">
    
    <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
      <div class="flex items-start gap-4">
        <div class="p-3 bg-blue-50 rounded-xl border border-blue-100 shrink-0 hidden sm:flex items-center justify-center">
          <svg class="w-6 h-6 text-blue-800" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3C6.48 3 2 5.24 2 8V12C2 14.76 6.48 17 12 17C17.52 17 22 14.76 22 12V8C22 5.24 17.52 3 12 3ZM4 8C4 6.34 7.58 5 12 5C16.42 5 20 6.34 20 8C20 9.66 16.42 11 12 11C7.58 11 4 9.66 4 8ZM20 12C20 12.24 19.94 12.48 19.8 12.71C18.92 14.15 15.78 15 12 15C8.22 15 5.08 14.15 4.2 12.71C4.06 12.48 4 12.24 4 12V10.74C5.77 11.64 8.64 12.25 12 12.25C15.36 12.25 18.23 11.64 20 10.74V12Z"/>
          </svg>
        </div>
        <div>
          <h1 class="text-2xl font-bold uppercase text-gray-900 tracking-tight">Kelola Stadion</h1>
          <p class="text-sm text-gray-500 mt-1">
            Kelola data stadion, status operasional, dan fasilitas venue.
          </p>
        </div>
      </div>

      <NuxtLink
        to="/admin/stadiums/create"
        class="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm [@media(hover:hover)]:hover:bg-blue-700 [@media(hover:hover)]:hover:shadow-md transition-all active:scale-95"
      >
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>Tambah Stadion Baru</span>
      </NuxtLink>
    </header>

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
            placeholder="Cari stadion berdasarkan nama atau ID..."
          />
        </div>
      </div>

      <div v-if="error" class="p-6">
        <div class="rounded-xl border border-red-200 bg-red-50 p-4 flex items-center gap-3 text-red-700">
          <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <div class="text-sm font-medium">
            {{ error?.message || 'Terjadi kesalahan saat memuat data.' }}
            <button @click="refresh()" class="underline ml-1 font-bold [@media(hover:hover)]:hover:text-red-800 active:text-red-800">Coba lagi</button>
          </div>
        </div>
      </div>

      <div v-else-if="pending" class="p-12 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-100 border-t-blue-600 mb-4"></div>
        <p class="text-sm text-gray-500 font-medium">Memuat data stadion...</p>
      </div>

      <div v-else-if="filteredStadions.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
        <div class="p-4 bg-gray-50 rounded-full mb-3">
          <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h3 class="text-base font-bold text-gray-900">Data tidak ditemukan</h3>
        <p class="text-sm text-gray-500 mt-1 max-w-xs mx-auto">
          {{ searchQuery ? `Tidak ada hasil untuk "${searchQuery}"` : 'Belum ada stadion yang terdaftar.' }}
        </p>
        <button v-if="searchQuery" @click="searchQuery = ''" class="mt-4 text-sm font-medium text-blue-600 [@media(hover:hover)]:hover:text-blue-700 active:text-blue-700">
          Bersihkan Pencarian
        </button>
      </div>

      <template v-else>
        <div class="hidden md:block overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-50/50 border-b border-gray-300">
                <th class="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-left">Info Stadion</th>
                <th class="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center">Jumlah Lapangan</th>
                <th class="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center">Status</th>
                <th class="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-300">
              <tr
                v-for="stadion in paginatedStadions"
                :key="stadion.id"
                class="group [@media(hover:hover)]:hover:bg-gray-100 transition-colors duration-200"
              >
                <td class="px-6 py-4 align-middle">
                  <div class="flex flex-col">
                    <span class="text-sm font-bold text-gray-900 [@media(hover:hover)]:group-hover:text-blue-700 transition-colors">{{ stadion.name }}</span>
                    <span class="text-xs text-gray-400">ID: #{{ stadion.id }}</span>
                  </div>
                </td>
                
                <td class="px-6 py-4 text-center align-middle">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                    {{ stadion.fields?.length ?? 0 }} Lapangan
                  </span>
                </td>
                
                <td class="px-6 py-4 text-center align-middle">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize shadow-sm"
                    :class="getStatusClasses(stadion.status)"
                  >
                    <span class="w-1.5 h-1.5 rounded-full mr-1.5" :class="stadion.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'"></span>
                    {{ stadion.status === 'ACTIVE' ? 'Aktif' : 'Non-Aktif' }}
                  </span>
                </td>
                
                <td class="px-6 py-4 text-center align-middle">
                  <NuxtLink
                    :to="`/admin/stadiums/${stadion.id}`"
                    class="text-sm font-semibold text-blue-600 [@media(hover:hover)]:hover:text-blue-800 [@media(hover:hover)]:hover:underline decoration-2 underline-offset-2 transition-all"
                  >
                    Edit
                  </NuxtLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="md:hidden flex flex-col gap-3 p-4 bg-gray-50 border-t border-gray-300">
          <div
            v-for="stadion in paginatedStadions"
            :key="stadion.id"
            class="bg-white rounded-xl border border-gray-300 p-4 shadow-sm [@media(hover:hover)]:hover:shadow-md transition-all duration-200"
          >
            <div class="flex justify-between items-start mb-3">
              <div class="flex-1 mr-3">
                <h3 class="text-sm font-bold text-gray-900 line-clamp-2 leading-tight">{{ stadion.name }}</h3>
                <div class="flex flex-wrap items-center gap-2 mt-2">
                  <span class="text-[10px] font-medium px-2 py-0.5 bg-gray-100 text-gray-600 rounded border border-gray-300">ID: #{{ stadion.id }}</span>
                  <span class="text-[10px] font-medium px-2 py-0.5 bg-blue-50 text-blue-600 rounded border border-blue-100">{{ stadion.fields?.length ?? 0 }} Lapangan</span>
                </div>
              </div>
              <span
                class="shrink-0 inline-flex items-center px-2 py-1 rounded-lg text-[10px] font-bold border capitalize"
                :class="getStatusClasses(stadion.status)"
              >
                {{ stadion.status === 'ACTIVE' ? 'Aktif' : 'Non-Aktif' }}
              </span>
            </div>

            <div class="flex items-center justify-end pt-2 border-t border-gray-300 mt-3">
              <NuxtLink
                :to="`/admin/stadiums/${stadion.id}`"
                class="text-sm font-semibold text-blue-600 [@media(hover:hover)]:hover:text-blue-800 [@media(hover:hover)]:hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                Edit
              </NuxtLink>
            </div>
          </div>
        </div>
      </template>

      <nav
        v-if="!pending && totalPages > 1"
        class="flex flex-col-reverse items-center justify-between gap-4 border-t border-gray-300 p-5 sm:flex-row bg-gray-50/50"
      >
        <span class="text-xs text-gray-500 font-medium">
          {{ paginationSummary }}
        </span>

        <div class="flex items-center gap-2">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="p-2 rounded-lg border border-gray-300 bg-white text-gray-600 [@media(hover:hover)]:hover:bg-gray-50 [@media(hover:hover)]:hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>

          <div class="px-4 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-bold text-gray-700 shadow-sm">
            {{ currentPage }} / {{ totalPages }}
          </div>

          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="p-2 rounded-lg border border-gray-300 bg-white text-gray-600 [@media(hover:hover)]:hover:bg-gray-50 [@media(hover:hover)]:hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </nav>

    </div>
  </section>
</template>