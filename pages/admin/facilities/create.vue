<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { availableIconsWithId as availableIcons, VALID_FACILITY_ICONS } from '~/utils/validIconList'
import { parseBackendError } from '~/utils/errorParser'

definePageMeta({
  middleware: 'auth-admin',
  layout: 'admin',
})

useHead({
  title: 'Tambah Fasilitas - VENUE UNDIP',
  meta: [
    { name: 'description', content: 'Tambah fasilitas baru ke VENUE UNDIP' }
  ]
})

const { preloadIcons } = useIconPreload()
onMounted(() => {
  preloadIcons()
})

const router = useRouter()

const form = ref({
  name: '',
  icon: '' as typeof VALID_FACILITY_ICONS[number] | '',
})

const loading = ref(false)
const errorMsg = ref<string | null>(null)
const iconErrorMsg = ref<string | null>(null)
const searchQuery = ref('')

const filteredIcons = computed(() => {
  if (!searchQuery.value.trim()) return availableIcons
  
  const query = searchQuery.value.toLowerCase().trim()
  return availableIcons.filter(icon => 
    icon.name.toLowerCase().includes(query)
  )
})

watch(() => form.value.icon, (newIcon) => {
  if (newIcon && iconErrorMsg.value) {
    iconErrorMsg.value = null
  }
})

async function handleSubmit() {
  loading.value = true
  errorMsg.value = null
  iconErrorMsg.value = null

  if (!form.value.name.trim()) {
    errorMsg.value = 'Nama fasilitas wajib diisi.'
    loading.value = false
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }

  if (!form.value.icon) {
    iconErrorMsg.value = 'Pilih ikon untuk fasilitas ini.'
    loading.value = false
    const iconSection = document.querySelector('[data-icon-section]')
    if (iconSection) {
      iconSection.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    return
  }

  try {
    await $fetch('/api/facilities/create', {
      method: 'POST',
      body: form.value,
    })
    await router.push('/admin/facilities')
  } catch (err: any) {
    const parsed = parseBackendError(err)
    errorMsg.value = parsed.message
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="flex w-full flex-col gap-6 sm:gap-8 pb-12 relative">
    
    <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
      <div class="flex items-start gap-4">
        <div class="p-3 bg-blue-50 rounded-xl border border-blue-100 shrink-0 hidden sm:flex items-center justify-center">
          <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <div>
          <h1 class="text-2xl uppercase font-bold text-gray-900 tracking-tight">Tambah Fasilitas</h1>
          <p class="text-sm text-gray-500 mt-1">
            Buat master data fasilitas baru (mis: Toilet, Kantin, WiFi).
          </p>
        </div>
      </div>

      <div class="hidden sm:flex items-center gap-3">
        <NuxtLink
          to="/admin/facilities"
          class="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-bold text-gray-700 shadow-sm transition-all active:scale-95 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
        >
          Batal
        </NuxtLink>

        <button
          type="submit"
          form="create-facility-form"
          :disabled="loading"
          class="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-700 hover:shadow-md transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <svg v-if="loading" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          <span>{{ loading ? 'Menyimpan...' : 'Simpan Fasilitas' }}</span>
        </button>
      </div>
    </header>

    <form id="create-facility-form" @submit.prevent="handleSubmit" class="flex flex-col gap-8 max-w-5xl mx-auto w-full">
      
      <!-- CARD 1: INFO DASAR -->
      <div class="w-full">
        <div class="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden">
          <div class="p-5 border-b border-gray-200 bg-gray-50/50">
            <h3 class="text-base font-bold text-gray-900">Informasi Dasar</h3>
            <p class="text-xs text-gray-500 mt-0.5">Detail utama fasilitas.</p>
          </div>
          <div class="p-6 space-y-4">
            <div class="space-y-1.5">
              <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider">Nama Fasilitas <span class="text-red-500">*</span></label>
              <input 
                v-model="form.name" 
                type="text" 
                required 
                placeholder="Mis: Toilet, WiFi, Kantin" 
                class="block w-full rounded-xl border border-gray-300 pl-4 pr-4 py-3 text-sm font-medium text-gray-900 focus:border-blue-500 focus:ring-blue-500 shadow-sm transition-all" 
              />
              <p v-if="errorMsg && errorMsg.includes('Nama fasilitas')" class="mt-2 text-xs text-red-600 font-medium flex items-start gap-1.5">
                <svg class="w-3.5 h-3.5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{{ errorMsg }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- CARD 2: PILIH IKON -->
      <div class="w-full" data-icon-section>
        <div class="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden">
          <div class="p-5 border-b border-gray-200 bg-gray-50/50">
            <h3 class="text-base font-bold text-gray-900">Pilih Visual Ikon</h3>
            <p class="text-xs text-gray-500 mt-0.5">Pilih simbol yang paling merepresentasikan fasilitas ini.</p>
            <p v-if="iconErrorMsg" class="mt-2 text-xs text-red-600 font-medium flex items-start gap-1.5">
              <svg class="w-3.5 h-3.5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{{ iconErrorMsg }}</span>
            </p>
          </div>
          <div class="p-6">
            <!-- Search Box -->
            <div class="mb-6">
              <div class="relative">
                <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Cari ikon... (mis: toilet, wifi, parkir)"
                  class="block w-full rounded-xl border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
                <button
                  v-if="searchQuery"
                  @click="searchQuery = ''"
                  type="button"
                  class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p class="mt-2 text-xs text-gray-500 flex items-center gap-1.5">
                <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px]">{{ filteredIcons.length }}</span>
                {{ filteredIcons.length === availableIcons.length ? 'Semua ikon tersedia' : `ikon ditemukan dari ${availableIcons.length} total` }}
              </p>
            </div>

            <!-- Empty State -->
            <div v-if="filteredIcons.length === 0" class="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h4 class="text-sm font-semibold text-gray-900 mb-1">Tidak ada ikon ditemukan</h4>
              <p class="text-xs text-gray-500 mb-4">Coba gunakan kata kunci lain seperti "toilet", "wifi", atau "parkir"</p>
              <button
                @click="searchQuery = ''"
                type="button"
                class="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Tampilkan semua ikon
              </button>
            </div>

            <!-- Icon Grid -->
            <div v-if="filteredIcons.length > 0" class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              <label
                v-for="icon in filteredIcons"
                :key="icon.id"
                class="group relative flex flex-col items-center justify-center p-3 rounded-xl border cursor-pointer transition-all duration-200"
                :class="[form.icon === icon.value ? 'border-blue-500 bg-blue-50/50 shadow-md ring-1 ring-blue-500/20' : 'border-gray-200 bg-white hover:border-blue-400 hover:bg-blue-50/30 hover:shadow-sm']"
              >
                <input type="radio" v-model="form.icon" :value="icon.value" class="sr-only" />
                
                <div v-if="form.icon === icon.value" class="absolute top-2 right-2 bg-blue-500 rounded-full p-0.5 shadow-sm">
                  <svg class="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
                </div>
                
                <Icon :icon="icon.value" class="w-8 h-8 mb-2 transition-transform duration-200 group-hover:scale-110" :class="form.icon === icon.value ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-500'" />
                <span class="text-[10px] font-medium text-center leading-tight transition-colors" :class="form.icon === icon.value ? 'text-blue-700 font-bold' : 'text-gray-600 group-hover:text-blue-600'">{{ icon.name }}</span>
              </label>
            </div>
            
            <p class="mt-6 text-xs text-center text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-200">
              💡 Ikon ini akan muncul pada kartu stadion dan halaman detail venue.
            </p>
          </div>
        </div>
      </div>

      <!-- MOBILE ACTIONS -->
      <div class="sm:hidden flex flex-col gap-3 mt-4">
        <button
          type="submit"
          :disabled="loading"
          class="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-bold text-white shadow-sm active:bg-blue-700 disabled:opacity-70"
        >
          <svg v-if="loading" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          <span>{{ loading ? 'Menyimpan...' : 'Simpan Fasilitas' }}</span>
        </button>

        <NuxtLink
          to="/admin/facilities"
          class="w-full flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-sm font-bold text-gray-700 active:bg-gray-50"
        >
          Batal
        </NuxtLink>
      </div>

    </form>
  </section>
</template>