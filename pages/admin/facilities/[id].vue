<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { availableIconsWithId as availableIcons, VALID_FACILITY_ICONS } from '~/utils/validIconList'
import { Icon } from '@iconify/vue'
import { useConfirmation } from '~/composables/useConfirmation'
import { parseBackendError } from '~/utils/errorParser'

definePageMeta({
  middleware: 'auth-admin',
  layout: 'admin',
})

const { options } = useAppOptions()
const appName = computed(() => options.value.data?.name || 'VENUE UNDIP')

useHead({
  title: 'Edit Fasilitas - VENUE UNDIP',
  meta: [
    { name: 'description', content: 'Edit detail fasilitas di VENUE UNDIP' }
  ]
})

const { preloadIcons } = useIconPreload()
onMounted(() => {
  preloadIcons()
})

const router = useRouter()
const route = useRoute()
const facilityId = Number(route.params.id)
const { confirm } = useConfirmation()

interface FacilityData {
  id: number
  name: string
  icon: string | null
}

interface FetchErrorData {
  data?: { statusMessage: string }
}

const form = ref({
  name: '',
  icon: VALID_FACILITY_ICONS[0] as typeof VALID_FACILITY_ICONS[number],
})

const searchQuery = ref('')
const loading = ref(false)
const loadingDelete = ref(false)
const errorMsg = ref<string | null>(null)

const filteredIcons = computed(() => {
  if (!searchQuery.value.trim()) return availableIcons
  const query = searchQuery.value.toLowerCase()
  return availableIcons.filter(icon => icon.name.toLowerCase().includes(query))
})

function getValidIcon(icon: string | null | undefined): typeof VALID_FACILITY_ICONS[number] {
  return icon && (VALID_FACILITY_ICONS as readonly string[]).includes(icon)
    ? (icon as any)
    : (VALID_FACILITY_ICONS[0] as typeof VALID_FACILITY_ICONS[number])
}

const { data: facility, error: fetchError, pending: pagePending } = await useAsyncData(
  `facility-${facilityId}`,
  () => $fetch<FacilityData>(`/api/facilities/${facilityId}`)
)

if (fetchError.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Fasilitas tidak ditemukan',
    fatal: true
  })
}

if (facility.value) {
  form.value.name = facility.value.name
  form.value.icon = getValidIcon(facility.value.icon)
}

async function handleSubmit() {
  loading.value = true
  errorMsg.value = null

  try {
    await $fetch('/api/facilities/update', {
      method: 'POST',
      body: {
        facilityId,
        ...form.value,
      },
    })
    await router.push('/admin/facilities')
  } catch (err: any) {
    const parsed = parseBackendError(err)
    errorMsg.value = parsed.message
  } finally {
    loading.value = false
  }
}

async function handleDelete() {
  const isConfirmed = await confirm({
    title: 'Hapus Fasilitas',
    message: 'Apakah Anda yakin ingin menghapus fasilitas ini?',
    confirmText: 'Hapus',
    cancelText: 'Batal',
    type: 'danger'
  })

  if (!isConfirmed) return
  loadingDelete.value = true
  try {
    await $fetch('/api/facilities/delete', {
      method: 'POST',
      body: { facilityId },
    })
    router.push('/admin/facilities')
  } catch (err: any) {
    const parsed = parseBackendError(err)
    errorMsg.value = parsed.message
    loadingDelete.value = false
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
</script>

<template>
  <section class="flex w-full flex-col gap-6 sm:gap-8 pb-12 relative">
    
    <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
      <div class="flex items-start gap-4">
        <div class="p-3 bg-blue-50 rounded-xl border border-blue-100 shrink-0 hidden sm:flex items-center justify-center">
          <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
        <div>
          <h1 class="text-2xl uppercase font-bold text-gray-900 tracking-tight">Edit Fasilitas</h1>
          <p class="text-sm text-gray-500 mt-1">
            Perbarui informasi dan ikon fasilitas.
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
          type="button"
          @click="handleDelete"
          :disabled="loadingDelete || loading"
          class="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-bold text-red-700 shadow-sm transition-all active:scale-95 hover:bg-red-100 hover:border-red-300 disabled:opacity-50"
        >
          <svg v-if="loadingDelete" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          <span>{{ loadingDelete ? 'Menghapus...' : 'Hapus' }}</span>
        </button>

        <button
          type="submit"
          form="edit-facility-form"
          :disabled="loading || loadingDelete"
          class="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-700 hover:shadow-md transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <svg v-if="loading" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          <span>{{ loading ? 'Menyimpan...' : 'Simpan Perubahan' }}</span>
        </button>
      </div>
    </header>

    <div v-if="pagePending" class="p-12 text-center rounded-2xl border border-gray-300 bg-white">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-100 border-t-blue-600 mb-4"></div>
      <p class="text-sm text-gray-500 font-medium">Memuat data fasilitas...</p>
    </div>

    <div v-else-if="errorMsg && !facility" class="p-8 text-center rounded-2xl border border-red-200 bg-red-50 text-red-700">
      <p class="font-bold mb-2">Terjadi Kesalahan</p>
      <p class="text-sm">{{ errorMsg }}</p>
      <NuxtLink to="/admin/facilities" class="mt-4 inline-block underline hover:no-underline">Kembali ke daftar</NuxtLink>
    </div>

    <form v-else id="edit-facility-form" @submit.prevent="handleSubmit" class="flex flex-col gap-8 max-w-5xl mx-auto w-full">
      
      <div class="w-full">
        <div class="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden">
          <div class="p-5 border-b border-gray-200 bg-gray-50/50">
            <h3 class="text-base font-bold text-gray-900">Informasi Dasar</h3>
            <p class="text-xs text-gray-500 mt-0.5">Detail utama fasilitas.</p>
          </div>
          <div class="p-6 space-y-4">
            <div class="space-y-1.5">
              <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider">Nama Fasilitas <span class="text-red-500">*</span></label>
              <input v-model="form.name" type="text" required placeholder="Contoh: Mushola" class="block w-full rounded-xl border border-gray-300 pl-4 pr-4 py-3 text-sm font-medium text-gray-900 focus:border-blue-500 focus:ring-blue-500 shadow-sm transition-all" />
            </div>
          </div>
        </div>
      </div>

      <div class="w-full">
        <div class="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden">
          <div class="p-5 border-b border-gray-200 bg-gray-50/50">
            <h3 class="text-base font-bold text-gray-900">Pilih Visual Ikon</h3>
            <p class="text-xs text-gray-500 mt-0.5">Pilih simbol yang paling merepresentasikan fasilitas ini.</p>
          </div>
          <div class="p-6">
            <!-- Search Input -->
            <div class="mb-5 relative">
              <div class="relative">
                <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Cari ikon... (contoh: toilet, parkir, wifi)"
                  class="block w-full rounded-xl border border-gray-300 pl-11 pr-10 py-3 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 shadow-sm transition-all"
                />
                <button
                  v-if="searchQuery"
                  @click="searchQuery = ''"
                  type="button"
                  class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div class="mt-2 flex items-center justify-between">
                <span class="text-xs text-gray-500">
                  <span class="font-bold text-blue-600">{{ filteredIcons.length }}</span> ikon ditemukan dari <span class="font-bold">{{ availableIcons.length }}</span> total
                </span>
              </div>
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

            <!-- Empty State -->
            <div v-else class="text-center py-12">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 class="mt-3 text-sm font-bold text-gray-900">Tidak ada ikon ditemukan</h3>
              <p class="mt-1 text-xs text-gray-500">Coba kata kunci lain atau hapus filter pencarian</p>
              <button
                @click="searchQuery = ''"
                type="button"
                class="mt-4 inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-bold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Reset Pencarian
              </button>
            </div>
            
            <p class="mt-6 text-xs text-center text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-200">
              💡 Ikon ini akan muncul pada kartu stadion dan halaman detail venue.
            </p>
          </div>
        </div>
      </div>

      <div class="sm:hidden flex flex-col gap-3 mt-4">
        <button
          type="submit"
          :disabled="loading || loadingDelete"
          class="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-bold text-white shadow-sm active:bg-blue-700 disabled:opacity-70"
        >
          <svg v-if="loading" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          <span>{{ loading ? 'Menyimpan...' : 'Simpan Perubahan' }}</span>
        </button>

        <div class="grid grid-cols-2 gap-3">
          <NuxtLink
            to="/admin/facilities"
            class="flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-sm font-bold text-gray-700 active:bg-gray-50"
          >
            Batal
          </NuxtLink>
          <button
            type="button"
            @click="handleDelete"
            :disabled="loadingDelete"
            class="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm font-bold text-red-700 active:bg-red-100"
          >
            {{ loadingDelete ? '...' : 'Hapus' }}
          </button>
        </div>
      </div>
    </form>
  </section>
</template>