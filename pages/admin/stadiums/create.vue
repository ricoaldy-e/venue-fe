<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { parseBackendError } from '~/utils/errorParser'

const { onFormEnter } = useFormNavigation()

definePageMeta({
  middleware: 'auth-admin',
  layout: 'admin',
})

const { options } = useAppOptions()
const appName = computed(() => options.value.data?.name || 'VENUE UNDIP')

useHead({
  title: 'Tambah Stadion - VENUE UNDIP',
  meta: [
    { name: 'description', content: 'Tambah stadion baru ke VENUE UNDIP' }
  ]
})

interface FacilitySelect {
  id: number
  name: string
  icon: string
}

const router = useRouter()

const form = ref({
  name: '',
  description: '',
  mapUrl: '',
  status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
  facilityIds: [] as number[],
})

const loading = ref(false)
const errorMsg = ref<string | null>(null)
const selectedImages = ref<File[]>([])
const imagePreviews = ref<string[]>([])
const isDragging = ref(false)

function handleFileProcess(files: File[]) {
  const incomingFiles = files.filter(file => file.type.startsWith('image/'))
  
  if (incomingFiles.length === 0) return

  if (selectedImages.value.length + incomingFiles.length > 5) {
    errorMsg.value = 'Maksimal hanya diperbolehkan 5 foto untuk stadion.'
    const errorEl = document.getElementById('error-alert')
    if (errorEl) errorEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
    return
  }

  errorMsg.value = null 

  incomingFiles.forEach(file => {
    selectedImages.value.push(file)
    const reader = new FileReader()
    reader.onload = (e) => { 
      if (e.target?.result) {
        imagePreviews.value.push(String(e.target.result)) 
      }
    }
    reader.readAsDataURL(file)
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

function removeImage(index: number) {
  selectedImages.value.splice(index, 1)
  imagePreviews.value.splice(index, 1)
}

const { data: facilities, error: facilityError, pending: facilitiesPending, refresh: refreshFacilities } = await useAsyncData('facilitiesListForStadion', () => $fetch<FacilitySelect[]>('/api/facilities'))

async function retryLoadFacilities() {
  errorMsg.value = null
  await refreshFacilities()
}

if (facilityError.value) {
  errorMsg.value = 'Gagal memuat daftar fasilitas. Silakan coba lagi.'
}

const isValidUrl = (url: string): boolean => /^https?:\/\//.test(url)

async function handleSubmit() {
  errorMsg.value = null

  if (!form.value.name.trim()) { errorMsg.value = 'Nama stadion wajib diisi.'; window.scrollTo({ top: 0, behavior: 'smooth' }); return }
  if (form.value.mapUrl && !isValidUrl(form.value.mapUrl)) { errorMsg.value = 'URL Peta harus diawali dengan http:// atau https://'; window.scrollTo({ top: 0, behavior: 'smooth' }); return }
  if (form.value.facilityIds.length > 10) { errorMsg.value = 'Anda hanya dapat memilih maksimal 10 fasilitas.'; window.scrollTo({ top: 0, behavior: 'smooth' }); return }

  loading.value = true
  try {
    const created = await $fetch<{ id: number }>('/api/stadions/create', {
      method: 'POST',
      body: {
        ...form.value,
        description: form.value.description || undefined,
        facilityIds: form.value.facilityIds.length > 0 ? form.value.facilityIds : null,
      },
    })

    if (selectedImages.value.length > 0 && created?.id) {
      const operations = {
        query: `mutation($stadionId:Int!,$files:[Upload!]!){ uploadStadionImages(stadionId:$stadionId,files:$files){ count imageUrls } }`,
        variables: { stadionId: Number(created.id), files: selectedImages.value.map(() => null) },
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
</script>

<template>
  <section class="flex w-full flex-col gap-6 sm:gap-8 pb-12 relative max-w-7xl mx-auto">
    
    <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
      <div class="flex items-start gap-4">
        <div class="p-3 bg-blue-50 rounded-xl border border-blue-100 shrink-0 hidden sm:flex items-center justify-center">
          <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h1 class="text-2xl uppercase font-bold text-gray-900 tracking-tight">Tambah Stadion</h1>
          <p class="text-sm text-gray-500 mt-1">
            Isi formulir lengkap untuk mendaftarkan venue olahraga baru.
          </p>
        </div>
      </div>

      <div class="hidden sm:flex items-center gap-3">
        <NuxtLink
          to="/admin/stadiums"
          class="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-bold text-gray-700 shadow-sm transition-all active:scale-95 [@media(hover:hover)]:hover:bg-blue-50 [@media(hover:hover)]:hover:text-blue-700 [@media(hover:hover)]:hover:border-blue-300"
        >
          Batal
        </NuxtLink>

        <button
          type="submit"
          form="create-stadium-form"
          :disabled="loading"
          class="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm [@media(hover:hover)]:hover:bg-blue-700 [@media(hover:hover)]:hover:shadow-md transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <svg v-if="loading" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          <span>{{ loading ? 'Menyimpan...' : 'Simpan Stadion' }}</span>
        </button>
      </div>
    </header>

    <form id="create-stadium-form" @submit.prevent="handleSubmit" @keydown.enter="onFormEnter" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
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
          <div class="p-6">
            <div v-if="facilitiesPending" class="text-center py-8 text-sm text-gray-500"><div class="inline-block animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-blue-600 mb-2"></div><p>Memuat fasilitas...</p></div>
            <div v-else-if="facilityError" class="text-center py-8 text-red-600 text-sm">Gagal memuat data. <button type="button" @click="retryLoadFacilities" class="underline font-bold">Coba lagi</button></div>
            <div v-else class="space-y-4">
              <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                <label v-for="facility in facilities" :key="facility.id" class="group relative flex flex-col items-center justify-center p-3 rounded-xl border cursor-pointer transition-all duration-200" :class="[form.facilityIds.includes(facility.id) ? 'border-blue-500 bg-blue-50/50 shadow-md ring-1 ring-blue-500/20' : 'border-gray-200 bg-white [@media(hover:hover)]:hover:border-blue-400 [@media(hover:hover)]:hover:bg-blue-50/30 [@media(hover:hover)]:hover:shadow-sm', (form.facilityIds.length >= 10 && !form.facilityIds.includes(facility.id)) ? 'opacity-50 cursor-not-allowed grayscale' : '']">
                  <input type="checkbox" v-model="form.facilityIds" :value="facility.id" :disabled="form.facilityIds.length >= 10 && !form.facilityIds.includes(facility.id)" class="sr-only" />
                  <div v-if="form.facilityIds.includes(facility.id)" class="absolute top-2 right-2 bg-blue-500 rounded-full p-0.5 shadow-sm"><svg class="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg></div>
                  <Icon :icon="facility.icon" class="w-8 h-8 mb-2 transition-transform duration-200 [@media(hover:hover)]:group-hover:scale-110" :class="form.facilityIds.includes(facility.id) ? 'text-blue-600' : 'text-gray-400 [@media(hover:hover)]:group-hover:text-blue-500'" />
                  <span class="text-xs font-medium text-center leading-tight transition-colors" :class="form.facilityIds.includes(facility.id) ? 'text-blue-700 font-bold' : 'text-gray-600 [@media(hover:hover)]:group-hover:text-blue-600'">{{ facility.name }}</span>
                </label>
              </div>
              <p v-if="errorMsg && errorMsg.includes('fasilitas')" class="text-xs text-red-600 font-medium flex items-start gap-1.5 p-3 bg-red-50 rounded-lg border border-red-100">
                <svg class="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
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
                <select v-model="form.status" class="block w-full rounded-xl border border-gray-300 pl-4 pr-10 py-3 text-sm font-medium focus:border-blue-500 focus:ring-blue-500 cursor-pointer shadow-sm transition-all [@media(hover:hover)]:hover:border-gray-400 appearance-none bg-white">
                  <option value="ACTIVE">Aktif</option>
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
            <span class="text-[10px] font-extrabold uppercase px-2 py-1 bg-blue-100 text-blue-700 rounded-md tracking-wide">{{ selectedImages.length }}/5</span>
          </div>
          
          <div class="p-5">
            <div 
              class="relative w-full rounded-xl transition-all duration-200 ease-in-out border-2 border-dashed overflow-hidden"
              :class="[
                isDragging ? 'border-blue-500 bg-blue-50/50 ring-4 ring-blue-500/10' : 'border-gray-200 bg-gray-50 [@media(hover:hover)]:hover:border-blue-400 [@media(hover:hover)]:hover:bg-gray-100',
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
                  class="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-red-500 opacity-0 [@media(hover:hover)]:group-hover:opacity-100 transition-all [@media(hover:hover)]:hover:bg-red-50 shadow-sm"
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
                  <div class="absolute inset-0 bg-black/0 [@media(hover:hover)]:group-hover:bg-black/10 transition-colors"></div>
                  <button 
                    type="button" 
                    @click="removeImage(idx + 1)" 
                    class="absolute top-1.5 right-1.5 p-1 bg-white/90 rounded-md text-red-500 opacity-0 [@media(hover:hover)]:group-hover:opacity-100 transition-all [@media(hover:hover)]:hover:bg-red-50 shadow-sm"
                  >
                    <Icon icon="solar:trash-bin-trash-bold" class="w-3.5 h-3.5" />
                  </button>
                  <span class="absolute bottom-1 right-1.5 text-[10px] font-bold text-white drop-shadow-md">#{{ idx + 2 }}</span>
                </div>
              </div>
            </div>

            <!-- Inline Error untuk Upload Images -->
            <p v-if="errorMsg && (errorMsg.includes('foto') || errorMsg.includes('gambar') || errorMsg.includes('5'))" class="mt-3 text-xs text-red-600 font-medium flex items-start gap-1.5 p-3 bg-red-50 rounded-lg border border-red-100">
              <svg class="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              <span>{{ errorMsg }}</span>
            </p>

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
          <span>{{ loading ? 'Menyimpan...' : 'Simpan Stadion' }}</span>
        </button>

        <NuxtLink
          to="/admin/stadiums"
          class="w-full flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-sm font-bold text-gray-700 active:bg-gray-50"
        >
          Batal
        </NuxtLink>
      </div>

    </form>
  </section>
</template>