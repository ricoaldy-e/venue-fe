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
  title: 'Edit Lapangan - VENUE UNDIP',
  meta: [
    { name: 'description', content: 'Edit detail lapangan di VENUE UNDIP' }
  ]
})

interface StadionSelect {
  id: number
  name: string
  status: 'ACTIVE' | 'INACTIVE'
}

interface FieldData {
  id: number
  name: string
  description: string | null
  pricePerHour: number
  priceTendik: number
  stadionId: number
  status: 'ACTIVE' | 'INACTIVE'
  images?: { id: number; fieldId?: number; imageUrl: string }[]
}

interface FetchErrorData {
  data?: { statusMessage: string }
}

const router = useRouter()
const route = useRoute()
const fieldId = route.params.id as string
const { confirm } = useConfirmation()

const form = ref({
  stadionId: 0,
  name: '',
  description: '',
  pricePerHour: 0,
  priceTendik: 0,
  status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE', 
})

const loading = ref(false)
const loadingDelete = ref(false)
const errorMsg = ref<string | null>(null)
const existingImages = ref<{ id: number; fieldId?: number; imageUrl: string }[]>([])
const removedImageIds = ref<number[]>([])
const selectedImages = ref<File[]>([])
const imagePreviews = ref<string[]>([])
const isDragging = ref(false)

const { data: stadions, pending: pendingStadions } = await useAsyncData(
  'stadionListForSelect',
  () => $fetch<StadionSelect[]>('/api/stadions')
)

const { data: field, error: fetchError, pending: pagePending } = await useAsyncData(
  `field-${fieldId}`,
  () => $fetch<FieldData>(`/api/fields/${fieldId}`)
)

if (fetchError.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Lapangan tidak ditemukan',
    fatal: true
  })
}

if (field.value) {
  form.value.stadionId = field.value.stadionId
  form.value.name = field.value.name
  form.value.description = field.value.description || ''
  form.value.pricePerHour = field.value.pricePerHour
  form.value.priceTendik = field.value.priceTendik || 0
  form.value.status = field.value.status 
  existingImages.value = field.value.images ? [...field.value.images] : []
} else if (fetchError.value) {
  const typedError = fetchError.value as FetchErrorData
  errorMsg.value = typedError.data?.statusMessage || 'Gagal memuat data lapangan.'
}

const selectedStadion = computed(() => {
  if (!form.value.stadionId || !stadions.value) return null
  return stadions.value.find(s => s.id === form.value.stadionId)
})

const activeImageCount = computed(() => {
  return existingImages.value.length + selectedImages.value.length
})

function onStadionChange() {
  if (selectedStadion.value?.status === 'INACTIVE') {
    form.value.status = 'INACTIVE'
  }
}

function handleFileProcess(files: File[]) {
  const incomingFiles = files.filter(file => file.type.startsWith('image/'))
  
  if (incomingFiles.length === 0) return
  
  if (activeImageCount.value + incomingFiles.length > 5) {
    errorMsg.value = 'Maksimal 5 gambar per lapangan.'
    window.scrollTo({ top: 0, behavior: 'smooth' })
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

function markRemoveExisting(idx: number) {
  const item = existingImages.value[idx]
  if (!item) return
  removedImageIds.value.push(item.id)
  existingImages.value.splice(idx, 1)
}

async function handleSubmit() {
  loading.value = true
  errorMsg.value = null

  if (!form.value.stadionId) { errorMsg.value = 'Stadion induk wajib dipilih.'; loading.value = false; window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
  if (!form.value.name.trim()) { errorMsg.value = 'Nama lapangan wajib diisi.'; loading.value = false; window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
  if (!form.value.pricePerHour) { errorMsg.value = 'Harga per jam wajib diisi.'; loading.value = false; window.scrollTo({ top: 0, behavior: 'smooth' }); return; }

  try {
    const updated: any = await $fetch('/api/fields/update', {
      method: 'POST',
      body: {
        fieldId: Number(fieldId),
        ...form.value,
        stadionId: Number(form.value.stadionId),

        pricePerHour: Number(form.value.pricePerHour || 0),
        priceTendik: Number(form.value.priceTendik || 0),
        description: form.value.description || undefined,
      },
    } as any) as any

    if (removedImageIds.value.length > 0) {
      await $fetch('/api/fields/delete-image', { method: 'POST', body: { imageIds: removedImageIds.value } } as any)
    }

    if (selectedImages.value.length > 0 && updated?.id) {
      const operations = {
        query: `mutation($fieldId:Int!,$files:[Upload!]!){ uploadFieldImages(fieldId:$fieldId,files:$files){ count imageUrls } }`,
        variables: { fieldId: Number(updated.id), files: selectedImages.value.map(() => null) },
      }

      const map: Record<string, string[]> = {}
      selectedImages.value.forEach((_, i) => { map[String(i)] = [`variables.files.${i}`] })

      const fd = new FormData()
      fd.append('operations', JSON.stringify(operations))
      fd.append('map', JSON.stringify(map))
      selectedImages.value.forEach((file, i) => fd.append(String(i), file, file.name))

      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('POST', '/api/fields/upload')
        xhr.withCredentials = true
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) return resolve(null)
          try { const body = JSON.parse(xhr.responseText); return reject(new Error(body?.statusMessage || body?.error || xhr.statusText)) } catch(e){ return reject(new Error(xhr.statusText || `HTTP ${xhr.status}`)) }
        }
        xhr.onerror = () => reject(new Error('Network error saat mengupload gambar'))
        xhr.send(fd)
      })
    }

    await router.push('/admin/fields')
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
    title: 'Hapus Lapangan',
    message: 'Apakah Anda yakin ingin menghapus lapangan ini? Data yang dihapus tidak dapat dikembalikan.',
    confirmText: 'Hapus',
    cancelText: 'Batal',
    type: 'danger'
  })

  if (!isConfirmed) return
  loadingDelete.value = true
  try {
    await $fetch('/api/fields/delete', {
      method: 'POST',
      body: { fieldId: Number(fieldId) },
    })
    router.push('/admin/fields')
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
          <h1 class="text-2xl uppercase font-bold text-gray-900 tracking-tight">Edit Lapangan</h1>
          <p class="text-sm text-gray-500 mt-1">
            Perbarui informasi dan status lapangan.
          </p>
        </div>
      </div>

      <div class="hidden sm:flex items-center gap-3">
        <NuxtLink
          to="/admin/fields"
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
          form="edit-field-form"
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
      <p class="text-sm text-gray-500 font-medium">Memuat data lapangan...</p>
    </div>

    <div v-else-if="errorMsg && !field" class="p-8 text-center rounded-2xl border border-red-200 bg-red-50 text-red-700">
      <p class="font-bold mb-2">Terjadi Kesalahan</p>
      <p class="text-sm">{{ errorMsg }}</p>
      <NuxtLink to="/admin/fields" class="mt-4 inline-block underline hover:no-underline">Kembali ke daftar</NuxtLink>
    </div>

    <form v-else id="edit-field-form" @submit.prevent="handleSubmit" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <div class="lg:col-span-2 space-y-8">
        
        <div class="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden">
          <div class="p-5 border-b border-gray-200 bg-gray-50/50">
            <h3 class="text-base font-bold text-gray-900">Informasi Lapangan</h3>
            <p class="text-xs text-gray-500 mt-0.5">Detail utama lapangan.</p>
          </div>
          <div class="p-6 space-y-6">
            
            <div class="space-y-1.5">
              <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider">Stadion Induk <span class="text-red-500">*</span></label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                </div>
                <select 
                  v-model="form.stadionId" 
                  @change="onStadionChange" 
                  class="block w-full rounded-xl border border-gray-300 pl-10 pr-10 py-3 text-sm font-medium text-gray-900 focus:border-blue-500 focus:ring-blue-500 shadow-sm transition-all hover:border-gray-400 cursor-pointer appearance-none bg-white disabled:bg-gray-100" 
                  :disabled="pendingStadions"
                  required
                >
                  <option value="" disabled>Pilih Stadion...</option>
                  <option v-for="stadion in stadions" :key="stadion.id" :value="stadion.id">
                    {{ stadion.name }} {{ stadion.status === 'INACTIVE' ? '(Non-Aktif)' : '' }}
                  </option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                  <svg v-if="pendingStadions" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
              <p v-if="errorMsg && errorMsg.includes('Stadion')" class="mt-2 text-xs text-red-600 font-medium flex items-start gap-1.5">
                <svg class="w-3.5 h-3.5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{{ errorMsg }}</span>
              </p>
            </div>

            <div class="space-y-1.5">
              <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider">Nama Lapangan <span class="text-red-500">*</span></label>
              <input v-model="form.name" type="text" required placeholder="Contoh: Lapangan Futsal A" class="block w-full rounded-xl border border-gray-300 pl-4 pr-4 py-3 text-sm font-medium text-gray-900 focus:border-blue-500 focus:ring-blue-500 shadow-sm transition-all" />
              <p v-if="errorMsg && errorMsg.includes('Nama lapangan')" class="mt-2 text-xs text-red-600 font-medium flex items-start gap-1.5">
                <svg class="w-3.5 h-3.5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{{ errorMsg }}</span>
              </p>
            </div>
            
            <div class="space-y-1.5">
              <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Deskripsi Lapangan <span class="text-gray-400 font-normal">(Opsional)</span>
              </label>
              <textarea 
                v-model="form.description" 
                rows="4" 
                maxlength="400" 
                placeholder="Jelaskan spesifikasi lapangan: jenis lantai, ukuran, pencahayaan, fasilitas penunjang, dll..."
                class="block w-full rounded-xl border border-gray-300 pl-4 pr-4 py-3 text-sm font-medium text-gray-900 focus:border-blue-500 focus:ring-blue-500 shadow-sm transition-all resize-none"
              ></textarea>
              <div class="flex items-center justify-between text-[11px]">
                <p class="text-gray-500">
                  <svg class="w-3.5 h-3.5 inline-block mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Detail spesifikasi membantu pengguna memahami kondisi dan fasilitas lapangan
                </p>
                <span class="font-semibold" :class="form.description.length >= 400 ? 'text-red-500' : 'text-gray-400'">
                  {{ form.description.length }}/400
                </span>
              </div>
            </div>

            <div class="space-y-1.5">
              <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider">Harga Sewa Umum per Jam <span class="text-red-500">*</span></label>
              <div class="relative rounded-xl shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span class="text-gray-500 font-bold sm:text-sm">Rp</span>
                </div>
                <input 
                  v-model.number="form.pricePerHour" 
                  type="number" 
                  min="0"
                  step="1000"
                  required 
                  placeholder="0" 
                  class="block w-full rounded-xl border border-gray-300 pl-10 pr-16 py-3 text-sm font-medium text-gray-900 focus:border-blue-500 focus:ring-blue-500 shadow-sm transition-all" 
                />
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span class="text-gray-400 text-xs font-medium">/ jam</span>
                </div>
              </div>
              <p class="text-xs text-gray-500 mt-1">Harga untuk penyewa kategori Umum</p>
              <p v-if="errorMsg && errorMsg.includes('Harga')" class="mt-2 text-xs text-red-600 font-medium flex items-start gap-1.5">
                <svg class="w-3.5 h-3.5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{{ errorMsg }}</span>
              </p>
            </div>

            <div class="space-y-1.5">
              <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider">Harga Sewa Tendik per Jam <span class="text-red-500">*</span></label>
              <div class="relative rounded-xl shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span class="text-gray-500 font-bold sm:text-sm">Rp</span>
                </div>
                <input 
                  v-model.number="form.priceTendik" 
                  type="number" 
                  min="0"
                  step="1000"
                  required 
                  placeholder="0" 
                  class="block w-full rounded-xl border border-gray-300 pl-10 pr-16 py-3 text-sm font-medium text-gray-900 focus:border-blue-500 focus:ring-blue-500 shadow-sm transition-all" 
                />
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span class="text-gray-400 text-xs font-medium">/ jam</span>
                </div>
              </div>
              <p class="text-xs text-gray-500 mt-1">Harga untuk penyewa kategori Tenaga Kependidikan</p>
            </div>

          </div>
        </div>
      </div>

      <div class="lg:col-span-1 space-y-8">
        
        <div class="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden">
          <div class="p-5 border-b border-gray-200 bg-gray-50/50">
            <h3 class="text-base font-bold text-gray-900">Status Operasional</h3>
          </div>
          <div class="p-6 space-y-4">
            <div class="space-y-1.5">
              <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider">Status</label>
              <div class="relative">
                <select 
                  v-model="form.status" 
                  :disabled="selectedStadion?.status === 'INACTIVE'" 
                  class="block w-full rounded-xl border border-gray-300 pl-4 pr-10 py-3 text-sm font-medium focus:border-blue-500 focus:ring-blue-500 cursor-pointer shadow-sm transition-all hover:border-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none bg-white"
                >
                  <option value="ACTIVE">Aktif</option>
                  <option value="INACTIVE">Non-Aktif</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
              <p v-if="selectedStadion?.status === 'INACTIVE'" class="text-xs text-amber-600 mt-2 flex items-center gap-1.5 font-medium bg-amber-50 p-2 rounded-lg border border-amber-100">
                <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                Stadion induk sedang non-aktif.
              </p>
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
              class="relative w-full rounded-xl transition-all duration-200 ease-in-out border-2 border-dashed overflow-hidden"
              :class="[
                isDragging ? 'border-blue-500 bg-blue-50/50 ring-4 ring-blue-500/10' : 'border-gray-200 bg-gray-50 hover:border-blue-400 hover:bg-gray-100',
                activeImageCount === 0 ? 'h-40' : 'h-24 mb-4'
              ]"
              @dragover.prevent="onDragOver" 
              @dragleave.prevent="onDragLeave" 
              @drop.prevent="onDrop"
              v-if="activeImageCount < 5"
            >
              <label class="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                <div class="flex flex-col items-center justify-center p-4 text-center">
                  <div class="p-2 rounded-full bg-white shadow-sm ring-1 ring-gray-100 mb-2">
                    <Icon icon="solar:upload-minimalistic-bold" class="w-5 h-5 text-blue-600" />
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

            <div v-if="activeImageCount > 0" class="flex flex-col gap-3">
              
              <div v-if="existingImages.length > 0" class="flex flex-col gap-3">
                <div class="relative w-full aspect-video rounded-xl overflow-hidden border border-gray-200 shadow-sm group">
                  <img :src="existingImages[0]?.imageUrl" class="w-full h-full object-cover" />
                  <div class="absolute top-0 left-0 right-0 p-2 bg-gradient-to-b from-black/60 to-transparent">
                    <div class="flex items-center gap-1.5">
                      <Icon icon="solar:star-bold" class="text-amber-400 w-3.5 h-3.5" />
                      <span class="text-[10px] font-bold text-white tracking-wide uppercase">Cover Utama</span>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    @click="markRemoveExisting(0)" 
                    class="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 shadow-sm"
                    title="Hapus"
                  >
                    <Icon icon="solar:trash-bin-trash-bold" class="w-4 h-4" />
                  </button>
                </div>

                <div class="grid grid-cols-2 gap-3" v-if="existingImages.length > 1">
                  <div 
                    v-for="(img, idx) in existingImages.slice(1)" 
                    :key="img.id" 
                    class="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group bg-gray-100"
                  >
                    <img :src="img.imageUrl" class="w-full h-full object-cover" />
                    <button 
                      type="button" 
                      @click="markRemoveExisting(idx + 1)" 
                      class="absolute top-1.5 right-1.5 p-1 bg-white/90 rounded-md text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 shadow-sm"
                    >
                      <Icon icon="solar:trash-bin-trash-bold" class="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              <div v-if="imagePreviews.length > 0" class="grid grid-cols-2 gap-3">
                <div v-for="(src, idx) in imagePreviews" :key="idx" class="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                  <img :src="src" class="w-full h-full object-cover" />
                  <div class="absolute top-1.5 left-1.5 bg-blue-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">BARU</div>
                  <div v-if="existingImages.length === 0 && idx === 0" class="absolute top-0 left-0 right-0 p-2 bg-gradient-to-b from-black/60 to-transparent">
                     <div class="flex items-center gap-1.5">
                      <Icon icon="solar:star-bold" class="text-amber-400 w-3.5 h-3.5" />
                      <span class="text-[10px] font-bold text-white tracking-wide uppercase">Cover</span>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    @click="removeNewImage(idx)" 
                    class="absolute top-1.5 right-1.5 p-1 bg-white/90 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 shadow-sm"
                    title="Hapus"
                  >
                    <Icon icon="solar:trash-bin-trash-bold" class="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>

            <!-- Inline Error untuk Upload Images -->
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
          <NuxtLink
            to="/admin/fields"
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