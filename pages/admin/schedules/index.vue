<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { parseBackendError } from '~/utils/errorParser'

defineOptions({ name: 'AdminSchedules' })
definePageMeta({
  name: 'admin-schedules',
  layout: 'admin',
  middleware: 'auth-admin',
  ssr: false,
})

const { options: appOptions } = useAppOptions()
const appName = computed(() => appOptions.value.data?.name || 'VENUE UNDIP')

useHead({
  title: 'Jadwal Operasional - VENUE UNDIP',
  meta: [
    { name: 'description', content: 'Kelola jadwal operasional venue di VENUE UNDIP' }
  ]
})

type OperatingHoursRecord = {
  id: number
  openHour: number
  closeHour: number
}

const FALLBACK_HOURS = { openHour: 8, closeHour: 22 }

const { data: operatingHours, pending, error, refresh } = await useAsyncData<OperatingHoursRecord | null>(
  'operating-hours',
  () => $fetch<OperatingHoursRecord | null>('/api/operating-hours')
)

const editing = ref(false)
const submitting = ref(false)
const submitError = ref<string | null>(null)
const formState = reactive({
  open: '',
  close: '',
})

const padHour = (hour: number) => String(hour).padStart(2, '0')

const toTimeInputValue = (hour?: number | null) => {
  if (typeof hour !== 'number' || Number.isNaN(hour)) return ''
  const bounded = Math.min(24, Math.max(0, hour))
  return `${padHour(bounded)}:00`
}

const displayHour = (hour?: number | null) => {
  if (typeof hour !== 'number' || Number.isNaN(hour)) return '-'
  const bounded = Math.min(24, Math.max(0, hour))
  return `${padHour(bounded)}:00 WIB`
}

const parseTimeInput = (value: string) => {
  if (!value) return null
  const [hoursPart] = value.split(':')
  const hour = Number(hoursPart)
  if (!Number.isInteger(hour)) return null
  return hour
}

const syncFormFromData = () => {
  const source = operatingHours.value ?? FALLBACK_HOURS
  formState.open = toTimeInputValue(source.openHour)
  formState.close = toTimeInputValue(source.closeHour)
}

watch(
  () => operatingHours.value,
  () => {
    if (!editing.value) {
      syncFormFromData()
    }
  },
  { immediate: true }
)

watch(editing, (isEditing) => {
  if (!isEditing) {
    submitError.value = null
    syncFormFromData()
  }
})

const hasExistingHours = computed(() => Boolean(operatingHours.value))

const startEditing = () => {
  editing.value = true
  submitError.value = null
  if (!formState.open || !formState.close) {
    syncFormFromData()
  }
}

const cancelEditing = () => {
  editing.value = false
}

const handleSubmit = async () => {
  if (!formState.open || !formState.close) {
    submitError.value = 'Jam buka dan jam tutup wajib diisi.'
    return
  }

  const openHour = parseTimeInput(formState.open)
  const closeHour = parseTimeInput(formState.close)

  if (openHour === null || closeHour === null) {
    submitError.value = 'Format jam tidak valid.'
    return
  }

  if (openHour < 0 || openHour > 23) {
    submitError.value = 'Jam buka harus antara 0 dan 23.'
    return
  }

  if (closeHour < 1 || closeHour > 24) {
    submitError.value = 'Jam tutup harus antara 1 dan 24.'
    return
  }

  if (closeHour <= openHour) {
    submitError.value = 'Jam tutup harus lebih besar daripada jam buka.'
    return
  }

  submitting.value = true
  submitError.value = null

  try {
    const updated = await $fetch<OperatingHoursRecord>('/api/operating-hours/update', {
      method: 'POST',
      body: {
        openHour,
        closeHour,
      },
    })
    operatingHours.value = updated
    editing.value = false
  } catch (err: any) {
    const parsed = parseBackendError(err)
    submitError.value = parsed.message
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <section class="flex w-full flex-col gap-6 sm:gap-8 pb-16">
    
    <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
      <div class="flex items-start gap-4">
        <div class="p-3 bg-blue-50 rounded-xl border border-blue-100 shrink-0 hidden sm:flex items-center justify-center">
          <svg class="w-6 h-6 text-blue-800" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 3V5H5C3.9 5 3 5.9 3 7V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V7C21 5.9 20.1 5 19 5H17V3H15V5H9V3H7ZM5 9H19V19H5V9ZM7 11V13H12V11H7ZM13 11V13H17V11H13ZM7 15V17H12V15H7ZM13 15V17H17V15H13Z"/>
          </svg>
        </div>
        <div>
          <h1 class="text-2xl uppercase font-bold text-gray-900 tracking-tight">Kelola Jadwal</h1>
          <p class="text-sm text-gray-500 mt-1">
            Atur jam operasional venue untuk membatasi ketersediaan pemesanan.
          </p>
        </div>
      </div>

      <button
        v-if="!editing"
        type="button"
        class="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 hover:shadow-md transition-all active:scale-95"
        :disabled="pending || Boolean(error)"
        @click="startEditing"
      >
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        <span>{{ hasExistingHours ? 'Ubah Jadwal Operasional' : 'Set Jadwal Baru' }}</span>
      </button>
    </header>

    <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300">
      
      <div v-if="pending" class="p-12 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-100 border-t-blue-600 mb-4"></div>
        <p class="text-sm text-gray-500 font-medium">Memuat data jadwal...</p>
      </div>

      <div v-else-if="error" class="p-6">
        <div class="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          <p class="font-semibold text-sm">Gagal memuat data: {{ error.message }}</p>
          <button class="mt-2 text-sm font-bold underline hover:text-red-800" @click="refresh()">Coba lagi</button>
        </div>
      </div>

      <div v-else-if="!editing" class="p-6 sm:p-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="p-5 rounded-xl bg-gray-100 border border-gray-200 flex items-center gap-4">
            <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </div>
            <div>
              <p class="text-xs font-bold text-gray-500 uppercase tracking-wider">Jam Buka</p>
              <p class="text-2xl font-bold text-gray-900 mt-0.5">{{ displayHour(operatingHours?.openHour) }}</p>
            </div>
          </div>

          <div class="p-5 rounded-xl bg-gray-100 border border-gray-200 flex items-center gap-4">
            <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            </div>
            <div>
              <p class="text-xs font-bold text-gray-500 uppercase tracking-wider">Jam Tutup</p>
              <p class="text-2xl font-bold text-gray-900 mt-0.5">{{ displayHour(operatingHours?.closeHour) }}</p>
            </div>
          </div>
        </div>

        <div class="mt-6 flex items-start gap-3 p-4 rounded-lg bg-blue-50 border border-blue-100 text-blue-700 text-sm">
          <svg class="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <p>
            Perubahan jadwal ini akan berlaku untuk semua lapangan yang terdaftar di {{ appName }}. Pastikan tidak ada jadwal booking aktif yang berkonflik sebelum mengubah jam operasional.
          </p>
        </div>
      </div>

      <!-- BAGIAN EDIT YANG DIPERBAIKI BORDER-NYA -->
      <div v-else class="p-6 sm:p-8 bg-gray-50/30">
        <div class="max-w-3xl mx-auto">
          
          <div class="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
            <div>
              <h2 class="text-lg font-bold text-gray-900">Edit Jam Operasional</h2>
              <p class="text-xs text-gray-500 mt-1">Sesuaikan waktu buka dan tutup venue.</p>
            </div>
            <button @click="cancelEditing" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div class="mb-6 flex items-start gap-3 p-4 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm">
            <svg class="w-5 h-5 shrink-0 mt-0.5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <div>
              <p class="font-semibold">Perhatian:</p>
              <p>Mengubah jam operasional dapat mempengaruhi slot booking yang tersedia di halaman publik. Pastikan perubahan ini sudah sesuai dengan kebijakan venue.</p>
            </div>
          </div>

          <!-- FORM DENGAN BORDER YANG LEBIH TEGAS & PROFESIONAL -->
          <form @submit.prevent="handleSubmit" class="space-y-6 bg-white p-8 rounded-2xl border border-gray-300 shadow-md ring-1 ring-black/5">
            <div class="grid gap-6 sm:grid-cols-2">
              
              <div class="space-y-2">
                <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider">Jam Buka (WIB)</label>
                <div class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  </div>
                  <select
                    v-model="formState.open"
                    class="block w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 shadow-sm appearance-none transition-all cursor-pointer hover:border-gray-400"
                    required
                    :disabled="submitting"
                  >
                    <option value="" disabled>Pilih jam buka</option>
                    <option v-for="hour in 24" :key="`open-${hour-1}`" :value="toTimeInputValue(hour - 1)">
                      {{ padHour(hour - 1) }}:00
                    </option>
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>

              <div class="space-y-2">
                <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider">Jam Tutup (WIB)</label>
                <div class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                  </div>
                  <select
                    v-model="formState.close"
                    class="block w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 shadow-sm appearance-none transition-all cursor-pointer hover:border-gray-400"
                    required
                    :disabled="submitting"
                  >
                    <option value="" disabled>Pilih jam tutup</option>
                    <option v-for="hour in 24" :key="`close-${hour}`" :value="toTimeInputValue(hour)">
                      {{ padHour(hour) }}:00
                    </option>
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="submitError" class="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm font-medium flex items-center gap-2 animate-pulse">
              <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {{ submitError }}
            </div>

            <div class="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                class="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-gray-50 border border-gray-300 rounded-xl hover:bg-gray-100 hover:text-gray-900 transition-colors"
                :disabled="submitting"
                @click="cancelEditing"
              >
                Batal
              </button>
              <button
                type="submit"
                class="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-md hover:shadow-lg focus:ring-4 focus:ring-blue-100 transition-all disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-95"
                :disabled="submitting"
              >
                <svg v-if="submitting" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                {{ submitting ? 'Menyimpan...' : 'Simpan Perubahan' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>