<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useConfirmation } from '~/composables/useConfirmation'
import { parseBackendError } from '~/utils/errorParser'

definePageMeta({
  middleware: 'auth-admin',
  layout: 'admin',
  key: (route) => route.fullPath
})

const { options } = useAppOptions()
const appName = computed(() => options.value.data?.name || 'VENUE UNDIP')

useHead({
  title: 'Edit Stadion - VENUE UNDIP',
  meta: [
    { name: 'description', content: 'Edit detail stadion di VENUE UNDIP' }
  ]
})

interface StadionData {
  id: number
  name: string
  description: string | null
  mapUrl: string
  status: 'ACTIVE' | 'INACTIVE'
  facilities: {
    Facility: { id: number }
  }[]
  images?: { id: number; stadionId?: number; imageUrl: string }[]
}

interface FacilitySelect {
  id: number
  name: string
  icon: string
}

interface FetchErrorData {
  data?: {
    statusMessage: string
  }
}

const router = useRouter()
const route = useRoute()
const stadionId = route.params.id as string
const { confirm } = useConfirmation()

const form = ref({
  name: '',
  description: '',
  mapUrl: '',
  status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
  facilityIds: [] as number[],
})

const loading = ref(false)
const loadingDelete = ref(false)
const errorMsg = ref<string | null>(null)

interface ImageItem { id: number; stadionId?: number; imageUrl: string }
const existingImages = ref<ImageItem[]>([])
const removedImageIds = ref<number[]>([])
const selectedImages = ref<File[]>([])
const imagePreviews = ref<string[]>([])
const isDragging = ref(false)

const { data: stadion, error: fetchError, pending: pagePending } = await useAsyncData(`admin-stadiums-stadion-${stadionId}`, () =>
  $fetch<StadionData>(`/api/stadions/${stadionId}`)
)

const { data: facilities, error: facilityError, pending: facilitiesPending, refresh: refreshFacilities } = await useAsyncData('facilitiesListForStadion', () =>
  $fetch<FacilitySelect[]>('/api/facilities')
)

if (fetchError.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Stadion tidak ditemukan',
    fatal: true
  })
}

if (stadion.value) {
  form.value.name = stadion.value.name
  form.value.description = stadion.value.description || ''
  form.value.mapUrl = stadion.value.mapUrl
  form.value.status = stadion.value.status
  form.value.facilityIds = stadion.value.facilities.map((fac) => fac.Facility.id)
  
  existingImages.value = stadion.value.images ? [...stadion.value.images] : []
} else if (fetchError.value) {
  const typedError = fetchError.value as FetchErrorData
  errorMsg.value = typedError.data?.statusMessage || 'Gagal memuat data stadion.'
}

async function retryLoadFacilities() {
  errorMsg.value = null
  await refreshFacilities()
}

const activeImageCount = computed(() => {
  return (existingImages.value.length - removedImageIds.value.length) + selectedImages.value.length
})

const activeExistingImages = computed(() => {
  return existingImages.value.filter(img => !removedImageIds.value.includes(img.id))
})

function handleFileProcess(files: File[]) {
  const incomingFiles = files.filter(file => file.type.startsWith('image/'))
  
  if (incomingFiles.length === 0) return
  
  if (activeImageCount.value + incomingFiles.length > 5) {
    errorMsg.value = 'Total gambar (lama + baru) tidak boleh lebih dari 5.'
    const errorEl = document.getElementById('error-alert')
    if (errorEl) errorEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
    return
  }

  errorMsg.value = null 

  incomingFiles.forEach((f) => {
    selectedImages.value.push(f)
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        imagePreviews.value.push(String(e.target.result))
      }
    }
    reader.readAsDataURL(f)
  })
}

function handleImageInput(e: Event) {
  const input = e.target as HTMLInputElement
  const files = Array.from(input.files || [])
  handleFileProcess(files)
  input.value = ''
}

function onDragOver(e: DragEvent) { isDragging.value = true }
function onDragLeave(e: DragEvent) { isDragging.value = false }
function onDrop(e: DragEvent) {
  isDragging.value = false
  const files = Array.from(e.dataTransfer?.files || [])
  handleFileProcess(files)
}

function removeNewImage(idx: number) {
  selectedImages.value.splice(idx, 1)
  imagePreviews.value.splice(idx, 1)
}

function markRemoveExisting(id: number) {
  removedImageIds.value.push(id)
}

function undoRemoveExisting(id: number) {
  const idx = removedImageIds.value.indexOf(id)
  if (idx > -1) removedImageIds.value.splice(idx, 1)
}

const isValidUrl = (url: string): boolean => /^https?:\/\//.test(url)

async function handleSubmit() {
  errorMsg.value = null

  if (!form.value.name.trim()) { errorMsg.value = 'Nama stadion wajib diisi.'; window.scrollTo({ top: 0, behavior: 'smooth' }); return }
  if (form.value.mapUrl && !isValidUrl(form.value.mapUrl)) { errorMsg.value = 'URL Peta harus diawali dengan http:// atau https://'; window.scrollTo({ top: 0, behavior: 'smooth' }); return }
  if (form.value.facilityIds.length > 10) { errorMsg.value = 'Anda hanya dapat memilih maksimal 10 fasilitas.'; window.scrollTo({ top: 0, behavior: 'smooth' }); return }
  if (activeImageCount.value > 5) { errorMsg.value = 'Total gambar melebihi batas maksimal 5.'; window.scrollTo({ top: 0, behavior: 'smooth' }); return }

  loading.value = true
  try {
    await $fetch('/api/stadions/update', {
      method: 'POST',
      body: {
        stadionId: Number(stadionId),
        name: form.value.name,
        description: form.value.description || undefined,
        mapUrl: form.value.mapUrl,
        status: form.value.status,
        facilityIds: form.value.facilityIds.length > 0 ? form.value.facilityIds : null,
      },
    } as any)

    if (removedImageIds.value.length > 0) {
      await $fetch('/api/stadions/delete-image', {
        method: 'POST',
        body: { imageIds: removedImageIds.value },
      } as any)
    }

    if (selectedImages.value.length > 0) {
      const operations = {
        query: `mutation($stadionId:Int!,$files:[Upload!]!){ uploadStadionImages(stadionId:$stadionId,files:$files){ count imageUrls } }`,
        variables: { stadionId: Number(stadionId), files: selectedImages.value.map(() => null) },
      }
      const map: Record<string, string[]> = {}
      selectedImages.value.forEach((_, i) => { map[String(i)] = [`variables.files.${i}`] })
      const fd = new FormData()
      fd.append('operations', JSON.stringify(operations))
      fd.append('map', JSON.stringify(map))
      selectedImages.value.forEach((file, i) => fd.append(String(i), file, file.name))

      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('POST', '/api/stadions/upload')
        xhr.withCredentials = true
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) return resolve(null)
          try { const body = JSON.parse(xhr.responseText); return reject(new Error(body?.statusMessage || body?.error || xhr.statusText)) } 
          catch(e){ return reject(new Error(xhr.statusText || `HTTP ${xhr.status}`)) }
        }
        xhr.onerror = () => reject(new Error('Network error saat mengupload gambar'))
        xhr.send(fd)
      })
    }

    await router.push('/admin/stadiums')
  } catch (err: any) {
    const parsed = parseBackendError(err)
    errorMsg.value = parsed.message
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } finally {
    loading.value = false
  }
}

async function handleDelete() {
  const isConfirmed = await confirm({
    title: 'Hapus Stadion',
    message: 'PERINGATAN: Menghapus stadion ini akan menghapus semua lapangan dan data yang dihapus tidak dapat dikembalikan. Anda yakin?',
    confirmText: 'Hapus',
    cancelText: 'Batal',
    type: 'danger'
  })

  if (!isConfirmed) return
  
  loadingDelete.value = true
  try {
    await $fetch('/api/stadions/delete', {
      method: 'POST',
      body: { stadionId: Number(stadionId) },
    })
    router.push('/admin/stadiums')
  } catch (err: any) {
    const parsed = parseBackendError(err)
    errorMsg.value = parsed.message
    loadingDelete.value = false
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
</script>

<template>
  <section class="flex w-full flex-col gap-6 sm:gap-8 pb-12 relative max-w-7xl mx-auto">
    
    <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
      <div class="flex items-start gap-4">
        <div class="p-3 bg-blue-50 rounded-xl border border-blue-100 shrink-0 hidden sm:flex items-center justify-center">
          <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
        <div>
          <h1 class="text-2xl uppercase font-bold text-gray-900 tracking-tight">Edit Stadion</h1>
          <p class="text-sm text-gray-500 mt-1">
            Perbarui informasi stadion dan fasilitas.
          </p>
        </div>
      </div>

      <div class="hidden sm:flex items-center gap-3">
        <button
          type="button"
          @click="handleDelete"
          :disabled="loadingDelete || loading"
          class="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-bold text-red-700 shadow-sm transition-all active:scale-95 hover:bg-red-100 hover:border-red-300 disabled:opacity-50"
        >
          <svg v-if="loadingDelete" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          <span>{{ loadingDelete ? 'Menghapus...' : 'Hapus' }}</span>
        </button>

        <NuxtLink
          to="/admin/stadiums"
          class="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-bold text-gray-700 shadow-sm transition-all active:scale-95 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
        >
          Batal
        </NuxtLink>

        <button
          type="submit"
          form="edit-stadium-form"
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
      <p class="text-sm text-gray-500 font-medium">Memuat data stadion...</p>
    </div>

    <div v-else-if="errorMsg && !stadion" class="p-8 text-center rounded-2xl border border-red-200 bg-red-50 text-red-700">
      <p class="font-bold mb-2">Terjadi Kesalahan</p>
      <p class="text-sm">{{ errorMsg }}</p>
      <NuxtLink to="/admin/stadiums" class="mt-4 inline-block underline hover:no-underline">Kembali ke daftar</NuxtLink>
    </div>

    <form v-else id="edit-stadium-form" @submit.prevent="handleSubmit" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <div class="lg:col-span-2 space-y-8">
        
        <div class="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden">
          <div class="p-5 border-b border-gray-200 bg-gray-50/50">
            <h3 class="text-base font-bold text-gray-900">Informasi Dasar</h3>
            <p class="text-xs text-gray-500 mt-0.5">Detail utama mengenai stadion.</p>
          </div>
          <div class="p-6 space-y-6">
            <div class="space-y-1.5">
              <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider">Nama Stadion <span class="text-red-500">*</span></label>
              <input v-model="form.name" type="text" required placeholder="Contoh: Stadion Futsal" class="block w-full rounded-xl border border-gray-300 pl-4 pr-4 py-3 text-sm font-medium text-gray-900 focus:border-blue-500 focus:ring-blue-500 shadow-sm transition-all" />
              <p v-if="errorMsg && errorMsg.includes('Nama stadion')" class="mt-2 text-xs text-red-600 font-medium flex items-start gap-1.5">
                <svg class="w-3.5 h-3.5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{{ errorMsg }}</span>
              </p>
            </div>
            <div class="space-y-1.5">
              <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Deskripsi <span class="text-gray-400 font-normal">(Opsional)</span>
              </label>
              <textarea 
                v-model="form.description" 
                rows="5" 
                maxlength="1000" 
                placeholder="Jelaskan fasilitas unggulan, lokasi strategis, atau keunggulan stadion ini..."
                class="block w-full rounded-xl border border-gray-300 pl-4 pr-4 py-3 text-sm font-medium text-gray-900 focus:border-blue-500 focus:ring-blue-500 shadow-sm transition-all resize-none"
              ></textarea>
              <div class="flex items-center justify-between text-[11px]">
                <p class="text-gray-500">
                  <svg class="w-3.5 h-3.5 inline-block mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Tambahkan deskripsi untuk memberikan informasi lengkap kepada pengunjung
                </p>
                <span class="font-semibold" :class="form.description.length >= 1000 ? 'text-red-500' : 'text-gray-400'">
                  {{ form.description.length }}/1000
                </span>
              </div>
            </div>
            <div class="space-y-1.5">
              <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider">URL Google Maps <span class="text-red-500">*</span></label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg></div>
                <input v-model="form.mapUrl" type="url" required placeholder="https://maps.app.goo.gl/..." class="block w-full rounded-xl border border-gray-300 pl-10 pr-4 py-3 text-sm font-medium text-gray-900 focus:border-blue-500 focus:ring-blue-500 shadow-sm transition-all" />
              </div>
              <p v-if="errorMsg && (errorMsg.includes('URL Peta') || errorMsg.includes('URL'))" class="mt-2 text-xs text-red-600 font-medium flex items-start gap-1.5">
                <svg class="w-3.5 h-3.5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{{ errorMsg }}</span>
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden">
          <div class="p-5 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
            <div><h3 class="text-base font-bold text-gray-900">Fasilitas Tersedia</h3><p class="text-xs text-gray-500 mt-0.5">Pilih fasilitas yang tersedia (maksimal 10).</p></div>
            <span class="text-xs font-bold px-2 py-1 rounded bg-blue-50 text-blue-700 border border-blue-100">{{ form.facilityIds.length }}/10 Dipilih</span>
          </div>
          <div class="p-6 space-y-4">
            <div v-if="facilitiesPending" class="text-center py-8 text-sm text-gray-500"><div class="inline-block animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-blue-600 mb-2"></div><p>Memuat fasilitas...</p></div>
            <div v-else-if="facilityError" class="text-center py-8 text-red-600 text-sm">Gagal memuat data. <button type="button" @click="retryLoadFacilities" class="underline font-bold">Coba lagi</button></div>
            <div v-else class="space-y-4">
              <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                <label v-for="facility in facilities" :key="facility.id" class="group relative flex flex-col items-center justify-center p-3 rounded-xl border cursor-pointer transition-all duration-200" :class="[form.facilityIds.includes(facility.id) ? 'border-blue-500 bg-blue-50/50 shadow-md ring-1 ring-blue-500/20' : 'border-gray-200 bg-white hover:border-blue-400 hover:bg-blue-50/30 hover:shadow-sm', (form.facilityIds.length >= 10 && !form.facilityIds.includes(facility.id)) ? 'opacity-50 cursor-not-allowed grayscale' : '']">
                  <input type="checkbox" v-model="form.facilityIds" :value="facility.id" :disabled="form.facilityIds.length >= 10 && !form.facilityIds.includes(facility.id)" class="sr-only" />
                  <div v-if="form.facilityIds.includes(facility.id)" class="absolute top-2 right-2 bg-blue-500 rounded-full p-0.5 shadow-sm"><svg class="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg></div>
                  <Icon :icon="facility.icon" class="w-8 h-8 mb-2 transition-transform duration-200 group-hover:scale-110" :class="form.facilityIds.includes(facility.id) ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-500'" />
                  <span class="text-xs font-medium text-center leading-tight transition-colors" :class="form.facilityIds.includes(facility.id) ? 'text-blue-700 font-bold' : 'text-gray-600 group-hover:text-blue-600'">{{ facility.name }}</span>
                </label>
              </div>
              <p v-if="errorMsg && errorMsg.includes('Fasilitas')" class="mt-2 text-xs text-red-600 font-medium flex items-start gap-1.5">
                <svg class="w-3.5 h-3.5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{{ errorMsg }}</span>
              </p>
            </div>
          </div>
        </div>

      </div>

      <div class="lg:col-span-1 space-y-8">
        
        <div class="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden">
          <div class="p-5 border-b border-gray-200 bg-gray-50/50"><h3 class="text-base font-bold text-gray-900">Status Operasional</h3></div>
          <div class="p-6 space-y-4">
            <div class="space-y-1.5">
              <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider">Status</label>
              <div class="relative">
                <select v-model="form.status" class="block w-full rounded-xl border border-gray-300 pl-4 pr-10 py-3 text-sm font-medium focus:border-blue-500 focus:ring-blue-500 cursor-pointer shadow-sm transition-all hover:border-gray-400 appearance-none bg-white">
                  <option value="ACTIVE">Aktif)</option>
                  <option value="INACTIVE">Non-Aktif</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden">
          <div class="p-5 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
            <div>
              <h3 class="text-base font-bold text-gray-900">Foto Venue</h3>
              <p class="text-xs text-gray-500 mt-0.5">Maksimal 5 foto.</p>
            </div>
            <span class="text-[10px] font-extrabold uppercase px-2 py-1 bg-blue-100 text-blue-700 rounded-md tracking-wide">{{ activeImageCount }}/5</span>
          </div>
          
          <div class="p-5">
            
            <div 
              v-if="activeImageCount < 5"
              class="relative w-full rounded-xl transition-all duration-200 ease-in-out border-2 border-dashed overflow-hidden"
              :class="[
                isDragging ? 'border-blue-500 bg-blue-50/50 ring-4 ring-blue-500/10' : 'border-gray-200 bg-gray-50 hover:border-blue-400 hover:bg-gray-100',
                activeImageCount === 0 ? 'h-40' : 'h-24 mb-4'
              ]"
              @dragover.prevent="onDragOver" 
              @dragleave.prevent="onDragLeave" 
              @drop.prevent="onDrop"
            >
              <label class="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                <div class="flex flex-col items-center justify-center p-4 text-center">
                  <div class="p-2 rounded-full bg-white shadow-sm ring-1 ring-gray-100 mb-2">
                    <svg class="w-6 h-6 text-gray-400 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                  <p class="text-xs font-bold text-gray-700">Klik / Tarik Foto</p>
                  <p class="text-[10px] text-gray-500 mt-0.5">JPG/PNG (Maks 2MB)</p>
                </div>
                <input type="file" multiple accept="image/*" @change="handleImageInput" class="hidden" />
              </label>
            </div>

            <div v-else class="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-xl text-center">
              <p class="text-xs text-gray-500 font-medium">Kuota foto penuh (5/5).</p>
            </div>

            <div v-if="activeExistingImages.length > 0" class="flex flex-col gap-3">
              <div class="relative w-full aspect-video rounded-xl overflow-hidden border border-gray-200 shadow-sm group">
                <img :src="activeExistingImages[0]?.imageUrl" class="w-full h-full object-cover" />
                <div class="absolute top-0 left-0 right-0 p-2 bg-gradient-to-b from-black/60 to-transparent">
                  <div class="flex items-center gap-1.5">
                    <svg class="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    <span class="text-[10px] font-bold text-white tracking-wide uppercase">Cover Utama</span>
                  </div>
                </div>
                <button 
                  type="button" 
                  @click="activeExistingImages[0] && markRemoveExisting(activeExistingImages[0].id)" 
                  class="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 shadow-sm"
                  title="Hapus"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>

              <div class="grid grid-cols-2 gap-3" v-if="activeExistingImages.length > 1">
                <div 
                  v-for="(img, idx) in activeExistingImages.slice(1)" 
                  :key="img.id" 
                  class="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group bg-gray-100"
                >
                  <img :src="img.imageUrl" class="w-full h-full object-cover" />
                  <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                  <button 
                    type="button" 
                    @click="markRemoveExisting(img.id)" 
                    class="absolute top-1.5 right-1.5 p-1 bg-white/90 rounded-md text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 shadow-sm"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            </div>

            <div v-if="imagePreviews.length > 0" class="mt-3">
              <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Akan Diupload</p>
              <div class="grid grid-cols-2 gap-3">
                <div v-for="(src, idx) in imagePreviews" :key="idx" class="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                  <img :src="src" class="w-full h-full object-cover" />
                  <div class="absolute top-1.5 left-1.5 bg-green-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">BARU</div>
                  <button 
                    type="button" 
                    @click="removeNewImage(idx)" 
                    class="absolute top-1.5 right-1.5 p-1 bg-white/90 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 shadow-sm"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>
            </div>

            <div v-if="removedImageIds.length > 0" class="mt-4 p-3 bg-red-50 rounded-xl border border-red-100">
              <div class="flex items-center gap-2 mb-2 text-red-800">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                <span class="text-xs font-bold">{{ removedImageIds.length }} foto ditandai hapus</span>
              </div>
              <div class="flex flex-wrap gap-2">
                <button 
                  v-for="id in removedImageIds" 
                  :key="id" 
                  @click="undoRemoveExisting(id)" 
                  type="button" 
                  class="inline-flex items-center gap-1 text-[10px] font-semibold bg-white border border-red-200 text-red-600 px-2 py-1 rounded-md shadow-sm hover:bg-red-50 hover:border-red-300 transition-all"
                >
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                  <span>Batal Hapus #{{ id }}</span>
                </button>
              </div>
            </div>

            <p v-if="errorMsg && (errorMsg.includes('gambar') || errorMsg.includes('foto') || errorMsg.includes('5'))" class="mt-3 text-xs text-red-600 font-medium flex items-start gap-1.5 p-3 bg-red-50 rounded-lg border border-red-100">
              <svg class="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              <span>{{ errorMsg }}</span>
            </p>

          </div>
        </div>
      </div>

      <div class="lg:col-span-3 sm:hidden flex flex-col gap-3 mt-4">
        <button
          type="submit"
          :disabled="loading || loadingDelete"
          class="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-bold text-white shadow-sm active:bg-blue-700 disabled:opacity-70"
        >
          <svg v-if="loading" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          <span>{{ loading ? 'Menyimpan...' : 'Simpan Perubahan' }}</span>
        </button>

        <div class="grid grid-cols-2 gap-3">
          <button
            type="button"
            @click="handleDelete"
            :disabled="loadingDelete"
            class="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm font-bold text-red-700 active:bg-red-100"
          >
            {{ loadingDelete ? '...' : 'Hapus' }}
          </button>
          <NuxtLink
            to="/admin/stadiums"
            class="flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-sm font-bold text-gray-700 active:bg-gray-50"
          >
            Batal
          </NuxtLink>
        </div>
      </div>

    </form>
  </section>
</template>