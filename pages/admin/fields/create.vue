<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { parseBackendError } from '~/utils/errorParser'

definePageMeta({
  middleware: 'auth-admin',
  layout: 'admin',
})

const { options } = useAppOptions()
const appName = computed(() => options.value.data?.name || 'VENUE UNDIP')

useHead({
  title: 'Tambah Lapangan - VENUE UNDIP',
  meta: [
    { name: 'description', content: 'Tambah lapangan baru ke VENUE UNDIP' }
  ]
})

interface StadionSelect {
  id: number
  name: string
  status: 'ACTIVE' | 'INACTIVE'
}

const { data: stadions, pending: pendingStadions } = await useAsyncData('stadionListForSelect', () =>
  $fetch<StadionSelect[]>('/api/stadions')
)

const router = useRouter()

const form = ref({
  stadionId: '',
  name: '',
  description: '',
  pricePerHour: null as number | null,
  priceTendik: null as number | null,
  status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
})

const loading = ref(false)
const errorMsg = ref<string | null>(null)

const selectedImages = ref<File[]>([])
const imagePreviews = ref<string[]>([])
const isDragging = ref(false)

const selectedStadion = computed(() => {
  if (!form.value.stadionId || !stadions.value) return null
  return stadions.value.find((s) => s.id === Number(form.value.stadionId))
})

function onStadionChange() {
  if (selectedStadion.value?.status === 'INACTIVE') {
    form.value.status = 'INACTIVE'
  }
}

function handleFileProcess(files: File[]) {
  const incomingFiles = files.filter(file => file.type.startsWith('image/'))
  
  if (incomingFiles.length === 0) return
  
  if (selectedImages.value.length + incomingFiles.length > 5) {
    errorMsg.value = 'Maksimal 5 gambar per lapangan.'
    const errorEl = document.getElementById('error-alert')
    if (errorEl) errorEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
    else window.scrollTo({ top: 0, behavior: 'smooth' })
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

function removeImage(idx: number) {
  selectedImages.value.splice(idx, 1)
  imagePreviews.value.splice(idx, 1)
  errorMsg.value = null
}

async function handleSubmit() {
  loading.value = true
  errorMsg.value = null

  if (!form.value.stadionId) { errorMsg.value = 'Stadion induk wajib dipilih.'; loading.value = false; window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
  if (!form.value.name.trim()) { errorMsg.value = 'Nama lapangan wajib diisi.'; loading.value = false; window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
  if (!form.value.pricePerHour) { errorMsg.value = 'Harga per jam wajib diisi.'; loading.value = false; window.scrollTo({ top: 0, behavior: 'smooth' }); return; }

  try {
    const created: any = await $fetch('/api/fields/create', {
      method: 'POST',
      body: {
        ...form.value,
        stadionId: Number(form.value.stadionId),

        pricePerHour: Number(form.value.pricePerHour || 0),
        priceTendik: Number(form.value.priceTendik || 0),
        description: form.value.description || undefined,
      },
    } as any) as any

    if (selectedImages.value.length > 0 && created?.id) {
      const operations = {
        query: `mutation($fieldId:Int!,$files:[Upload!]!){ uploadFieldImages(fieldId:$fieldId,files:$files){ count imageUrls } }`,
        variables: { fieldId: Number(created.id), files: selectedImages.value.map(() => null) },
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
</script>

<template>
  <section class="flex w-full flex-col gap-6 sm:gap-8 pb-12 relative">
    
    <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
      <div class="flex items-start gap-4">
        <div class="p-3 bg-blue-50 rounded-xl border border-blue-100 shrink-0 hidden sm:flex items-center justify-center">
          <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h1 class="text-2xl uppercase font-bold text-gray-900 tracking-tight">Tambah Lapangan</h1>
          <p class="text-sm text-gray-500 mt-1">
            Daftarkan lapangan baru ke dalam stadion yang sudah ada.
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
          type="submit"
          form="create-field-form"
          :disabled="loading"
          class="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-700 hover:shadow-md transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <svg v-if="loading" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          <span>{{ loading ? 'Menyimpan...' : 'Simpan Lapangan' }}</span>
        </button>
      </div>
    </header>

    <form id="create-field-form" @submit.prevent="handleSubmit" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
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
            <span class="text-[10px] font-extrabold uppercase px-2 py-1 bg-blue-100 text-blue-700 rounded-md tracking-wide">{{ selectedImages.length }}/5</span>
          </div>
          
          <div class="p-5">
            <div 
              class="relative w-full rounded-xl transition-all duration-200 ease-in-out border-2 border-dashed overflow-hidden"
              :class="[
                isDragging ? 'border-blue-500 bg-blue-50/50 ring-4 ring-blue-500/10' : 'border-gray-200 bg-gray-50 hover:border-blue-400 hover:bg-gray-100',
                selectedImages.length === 0 ? 'h-40' : 'h-24 mb-4'
              ]"
              @dragover.prevent="onDragOver" 
              @dragleave.prevent="onDragLeave" 
              @drop.prevent="onDrop"
              v-if="selectedImages.length < 5"
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

            <div v-if="errorMsg && (errorMsg.includes('gambar') || errorMsg.includes('foto') || errorMsg.includes('5'))" class="text-xs text-red-600 font-medium flex items-start gap-1.5 p-3 bg-red-50 rounded-lg border border-red-100 mb-4">
              <svg class="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              <span>{{ errorMsg }}</span>
            </div>

            <div v-if="selectedImages.length > 0" class="flex flex-col gap-3">
              <div class="relative w-full aspect-video rounded-xl overflow-hidden border border-gray-200 shadow-sm group">
                <img :src="imagePreviews[0]" class="w-full h-full object-cover" />
                <div class="absolute top-0 left-0 right-0 p-2 bg-gradient-to-b from-black/60 to-transparent">
                  <div class="flex items-center gap-1.5">
                    <Icon icon="solar:star-bold" class="text-amber-400 w-3.5 h-3.5" />
                    <span class="text-[10px] font-bold text-white tracking-wide uppercase">Cover Utama</span>
                  </div>
                </div>
                <button 
                  type="button" 
                  @click="removeImage(0)" 
                  class="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 shadow-sm"
                  title="Hapus"
                >
                  <Icon icon="solar:trash-bin-trash-bold" class="w-4 h-4" />
                </button>
              </div>

              <div class="grid grid-cols-2 gap-3" v-if="selectedImages.length > 1">
                <div 
                  v-for="(src, idx) in imagePreviews.slice(1)" 
                  :key="idx + 1" 
                  class="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group bg-gray-100"
                >
                  <img :src="src" class="w-full h-full object-cover" />
                  <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                  <button 
                    type="button" 
                    @click="removeImage(idx + 1)" 
                    class="absolute top-1.5 right-1.5 p-1 bg-white/90 rounded-md text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 shadow-sm"
                  >
                    <Icon icon="solar:trash-bin-trash-bold" class="w-3.5 h-3.5" />
                  </button>
                  <span class="absolute bottom-1 right-1.5 text-[10px] font-bold text-white drop-shadow-md">#{{ idx + 2 }}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>


      <div class="lg:col-span-3 sm:hidden flex flex-col gap-3 mt-4">
        <button
          type="submit"
          :disabled="loading"
          class="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-bold text-white shadow-sm active:bg-blue-700 disabled:opacity-70"
        >
          <svg v-if="loading" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          <span>{{ loading ? 'Menyimpan...' : 'Simpan Lapangan' }}</span>
        </button>

        <NuxtLink
          to="/admin/fields"
          class="w-full flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-sm font-bold text-gray-700 active:bg-gray-50"
        >
          Batal
        </NuxtLink>
      </div>

    </form>
  </section>
</template>