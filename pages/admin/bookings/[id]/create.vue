<script setup lang="ts">
import { $fetch } from 'ofetch'
import { toUtcMidnightIso } from '~/utils/dateHelpers'
import { MUTATION_CREATE_BOOKING } from '~/graphql/mutations/create_booking'
import { parseBackendError } from '~/utils/errorParser'
definePageMeta({
  layout: 'admin',
  middleware: 'auth-admin'
})

const { options } = useAppOptions()
const appName = computed(() => options.value.data?.name || 'VENUE UNDIP')

useHead({
  title: 'Buat Booking Baru - VENUE UNDIP',
  meta: [
    { name: 'description', content: 'Buat booking baru untuk lapangan di VENUE UNDIP' }
  ]
})

const route = useRoute()
const stadionId = Number(route.params.id)
const selectedSlots = ref<any[]>([])
try {
  const raw = route.query.selections as string
  if (raw) selectedSlots.value = JSON.parse(decodeURIComponent(raw))
} catch {
  selectedSlots.value = []
}

const bookingForm = reactive({
  name: '',
  contact: '',
  email: '',
  renterType: 'UMUM' as 'UMUM' | 'TENDIK' | 'AKADEMIK',
  institution: '',
  suratFile: null as File | null,
  sptjmFile: null as File | null
})

const errorMsg = ref<string | null>(null)
const uploadProgress = ref<number | null>(null)
const submitting = ref(false)
const checkingAvailability = ref(false)
const confirmationModal = ref<any>(null)

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount)
}

const fieldErrors = ref({
  name: '',
  contact: '',
  email: '',
  institution: ''
})

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const phoneRegex = /^(\+62|62|0)[0-9]{9,13}$/
const nameRegex = /^[a-zA-Z\s.]+$/

const validateName = () => {
  const trimmed = bookingForm.name.trim()
  if (!trimmed) {
    fieldErrors.value.name = 'Nama lengkap wajib diisi'
    return false
  }
  if (trimmed.length < 3) {
    fieldErrors.value.name = 'Nama minimal 3 karakter'
    return false
  }
  if (!nameRegex.test(trimmed)) {
    fieldErrors.value.name = 'Nama hanya boleh berisi huruf dan spasi'
    return false
  }
  fieldErrors.value.name = ''
  return true
}

const validateContact = () => {
  const trimmed = bookingForm.contact.trim()
  if (!trimmed) {
    fieldErrors.value.contact = 'Nomor kontak wajib diisi'
    return false
  }
  if (!phoneRegex.test(trimmed)) {
    fieldErrors.value.contact = 'Format nomor tidak valid (contoh: 081234567890)'
    return false
  }
  fieldErrors.value.contact = ''
  return true
}

const validateEmail = () => {
  const trimmed = bookingForm.email.trim()
  if (!trimmed) {
    fieldErrors.value.email = 'Alamat email wajib diisi'
    return false
  }
  if (!emailRegex.test(trimmed)) {
    fieldErrors.value.email = 'Format email tidak valid'
    return false
  }
  fieldErrors.value.email = ''
  return true
}

const validateInstitution = () => {
  if (bookingForm.renterType === 'UMUM') {
    fieldErrors.value.institution = ''
    return true
  }
  const trimmed = bookingForm.institution.trim()
  if (!trimmed) {
    fieldErrors.value.institution = 'Nama institusi wajib diisi untuk booking akademik'
    return false
  }
  if (trimmed.length < 3) {
    fieldErrors.value.institution = 'Nama institusi minimal 3 karakter'
    return false
  }
  fieldErrors.value.institution = ''
  return true
}

function handleSuratUpload(e: Event){
  const input = e.target as HTMLInputElement
  bookingForm.suratFile = input.files?.[0] || null
}

function handleSptjmUpload(e: Event){
  const input = e.target as HTMLInputElement
  bookingForm.sptjmFile = input.files?.[0] || null
}

const totalPrice = computed(() => {
  if(bookingForm.renterType === 'AKADEMIK') {
    return 0
  }

  return selectedSlots.value.reduce((sum, s) => {
    const price = bookingForm.renterType === 'TENDIK' && s.priceTendik 
      ? s.priceTendik 
      : (s.pricePerHour || 0)
    return sum + price
  }, 0)
})

/**
 * Check slot availability before creating booking
 */
async function checkSlotAvailability(): Promise<boolean> {
  checkingAvailability.value = true
  
  try {
    const slotsByFieldAndDate = new Map<string, { fieldId: string; date: string; timeSlots: string[] }>()
    
    for (const slot of selectedSlots.value) {
      const normalizedDate = new Date(slot.date)
      const year = normalizedDate.getUTCFullYear()
      const month = String(normalizedDate.getUTCMonth() + 1).padStart(2, '0')
      const day = String(normalizedDate.getUTCDate()).padStart(2, '0')
      const dateStr = `${year}-${month}-${day}`
      
      const key = `${slot.fieldId}-${dateStr}`
      
      if (!slotsByFieldAndDate.has(key)) {
        slotsByFieldAndDate.set(key, {
          fieldId: String(slot.fieldId),
          date: dateStr,
          timeSlots: []
        })
      }
      
      slotsByFieldAndDate.get(key)!.timeSlots.push(String(slot.startHour))
    }
    
    for (const [, group] of slotsByFieldAndDate) {
      const response = await $fetch<{
        available: boolean
        conflictingSlots: string[]
        message: string
      }>('/api/bookings/check-availability', {
        method: 'POST',
        body: {
          fieldId: group.fieldId,
          date: toUtcMidnightIso(group.date),
          timeSlots: group.timeSlots
        },
        credentials: 'include'
      })
      
      if (!response.available) {
        errorMsg.value = response.message
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return false
      }
    }
    
    return true
  } catch (error: any) {
    const parsed = parseBackendError(error)
    errorMsg.value = parsed.title ? `${parsed.title}: ${parsed.message}` : parsed.message
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return false
  } finally {
    checkingAvailability.value = false
  }
}

async function handleSubmit(){
  errorMsg.value = null
  uploadProgress.value = null

  const isNameValid = validateName()
  const isContactValid = validateContact()
  const isEmailValid = validateEmail()
  const isInstitutionValid = validateInstitution()

  if (!isNameValid || !isContactValid || !isEmailValid || !isInstitutionValid) {
    errorMsg.value = 'Mohon perbaiki data yang tidak valid'
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }

  if (selectedSlots.value.length === 0) {
    errorMsg.value = 'Pilih minimal satu slot booking.'
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }

  // Check slot availability before proceeding (race condition prevention)
  const slotsAvailable = await checkSlotAvailability()
  if (!slotsAvailable) {
    return // Error message already set by checkSlotAvailability
  }

  bookingForm.name = bookingForm.name.trim()
  bookingForm.contact = bookingForm.contact.trim()
  bookingForm.email = bookingForm.email.trim()
  if (bookingForm.institution) bookingForm.institution = bookingForm.institution.trim()

    const details = selectedSlots.value.map((slot) => {
    let price = slot.pricePerHour || 0
    if (bookingForm.renterType === 'AKADEMIK') price = 0
    else if (bookingForm.renterType === 'TENDIK' && slot.priceTendik) price = slot.priceTendik

    const normalizedDate = new Date(slot.date)
    const utcMidnight = toUtcMidnightIso(normalizedDate)

    return {
      fieldId: Number(slot.fieldId),
      bookingDate: utcMidnight,
      startHour: Number(slot.startHour),
      subtotal: price,
    }
  })
  const vars: any = {
    name: bookingForm.name,
    contact: bookingForm.contact,
    email: bookingForm.email,
    institution: bookingForm.renterType !== 'UMUM' ? bookingForm.institution : undefined,
    renterType: bookingForm.renterType,
    details,
    suratFile: null,
    sptjmFile: null
  }

  // If uploading files, set variables to null initially
  if (bookingForm.suratFile) vars.suratFile = null
  if (bookingForm.sptjmFile) vars.sptjmFile = null

  const operations = {
    query: MUTATION_CREATE_BOOKING,
    variables: vars
  }

  try {
    if (bookingForm.suratFile || bookingForm.sptjmFile) {
      const fd = new FormData()
      fd.append('operations', JSON.stringify(operations))
      
      const map: Record<string, string[]> = {}
      let fileCounter = 0
      
      if (bookingForm.suratFile) {
        map[`${fileCounter}`] = ['variables.suratFile']
        fd.append(`${fileCounter}`, bookingForm.suratFile, bookingForm.suratFile.name)
        fileCounter++
      }
      
      if (bookingForm.sptjmFile) {
        map[`${fileCounter}`] = ['variables.sptjmFile']
        fd.append(`${fileCounter}`, bookingForm.sptjmFile, bookingForm.sptjmFile.name)
        fileCounter++
      }
      
      fd.append('map', JSON.stringify(map))

      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('POST', '/api/bookings/create')
        xhr.withCredentials = true

        xhr.upload.onprogress = (ev) => {
          if (ev.lengthComputable) uploadProgress.value = Math.round((ev.loaded / ev.total) * 100)
        }

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const json = JSON.parse(xhr.responseText)
              const bookingCode = json?.bookingCode || json?.createBooking?.bookingCode
              if (!bookingCode) return reject(new Error('Server tidak mengembalikan booking code'))
              resolve(bookingCode)
            } catch (e) {
              reject(e)
            }
          } else {
            let msg = xhr.statusText || `HTTP ${xhr.status}`
            try { const body = JSON.parse(xhr.responseText); msg = body?.statusMessage || body?.error || msg } catch {}
            reject(new Error(msg))
          }
        }

        xhr.onerror = () => reject(new Error('Network error saat mengirim request'))
        xhr.send(fd)
      }).then(async (bookingCode) => {
        await confirmationModal.value?.open({
          title: '✅ Booking Berhasil Dibuat!',
          message: `Kode Booking: ${bookingCode}\n\n📧 Email konfirmasi telah dikirim ke:\n${bookingForm.email}\n\n💡 Pastikan client check inbox atau spam folder untuk detail booking.`,
          confirmText: 'OK',
          type: 'success',
          mode: 'alert'
        })
        navigateTo(`/admin/bookings/${stadionId}/${bookingCode}`)
      })
    } else {
      submitting.value = true
      const payload = {
        name: bookingForm.name,
        contact: bookingForm.contact,
        email: bookingForm.email,
        institution: bookingForm.renterType !== 'UMUM' ? bookingForm.institution : undefined,
        renterType: bookingForm.renterType,
        details,
      }

      const resp = await $fetch('/api/bookings/create', {
        method: 'POST',
        body: payload,
        credentials: 'include',
      })

      const bookingCode = resp?.bookingCode || resp?.createBooking?.bookingCode
      if (!bookingCode) throw new Error('Server tidak mengembalikan booking code')
      
      await confirmationModal.value?.open({
        title: '✅ Booking Berhasil Dibuat!',
        message: `Kode Booking: ${bookingCode}\n\n📧 Email konfirmasi telah dikirim ke:\n${bookingForm.email}\n\n💡 Pastikan client check inbox atau spam folder untuk detail booking.`,
        confirmText: 'OK',
        type: 'success',
        mode: 'alert'
      })
      navigateTo(`/admin/bookings/${stadionId}/${bookingCode}`)
    }
  } catch (e) {
    const parsed = parseBackendError(e)
    errorMsg.value = parsed.title ? `${parsed.title}: ${parsed.message}` : parsed.message
  } finally {
    uploadProgress.value = null
    submitting.value = false
  }
}

watch(() => bookingForm.renterType, (val) => {
  if (val === 'UMUM') {
    bookingForm.suratFile = null
    bookingForm.institution = ''
  }
})
</script>

<template>
  <section class="flex w-full flex-col gap-6 sm:gap-8 pb-12 relative">
    
    <!-- HEADER -->
    <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
      <div class="flex items-start gap-4">
        <div class="p-3 bg-blue-50 rounded-xl border border-blue-100 shrink-0 hidden sm:flex items-center justify-center">
          <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <div>
          <h1 class="text-2xl uppercase font-bold text-gray-900 tracking-tight">Buat Booking Baru</h1>
          <p class="text-sm text-gray-500 mt-1">
            Lengkapi informasi pemesan untuk membuat booking lapangan olahraga.
          </p>
        </div>
      </div>
    </header>

    <form id="booking-form" @submit.prevent="handleSubmit" class="flex flex-col gap-8 max-w-5xl mx-auto w-full">
      
      <div class="w-full">
        <div class="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden">
          <div class="p-5 border-b border-gray-200 bg-gray-50/50">
            <h3 class="text-base font-bold text-gray-900">Slot yang Dipilih</h3>
            <p class="text-xs text-gray-500 mt-0.5">Review jadwal booking sebelum melanjutkan.</p>
          </div>
          
          <div class="p-6">
            <div v-if="selectedSlots.length === 0" class="text-center py-8">
              <svg class="w-16 h-16 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p class="text-sm text-gray-500 font-medium">Tidak ada slot yang dipilih</p>
              <p class="text-xs text-gray-400 mt-1">Silakan pilih slot terlebih dahulu</p>
            </div>

            <div v-else class="space-y-3">
              <div 
                v-for="slot in selectedSlots" 
                :key="slot.fieldId + '-' + slot.startHour"
                class="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <p class="font-bold text-gray-900 text-base">{{ slot.fieldName }}</p>
                    <div class="flex items-center gap-2 mt-2 text-sm text-gray-600">
                      <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span class="font-medium">{{ slot.date.split('T')[0] }}</span>
                    </div>
                    <div class="flex items-center gap-2 mt-1.5 text-sm text-gray-600">
                      <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span class="font-medium">{{ slot.startHour }}:00 - {{ slot.startHour + 1 }}:00</span>
                    </div>
                  </div>
                  <!-- HARGA DINAMIS BERDASARKAN TIPE PENYEWA -->
                  <div class="text-right">
                    <p class="text-xs text-gray-500 uppercase tracking-wide font-bold">Harga</p>
                    <template v-if="bookingForm.renterType === 'AKADEMIK'">
                      <p class="text-lg font-bold text-green-600 mt-1">GRATIS</p>
                    </template>
                    <template v-else-if="bookingForm.renterType === 'TENDIK' && slot.priceTendik">
                      <p class="text-lg font-bold text-purple-600 mt-1">Rp {{ slot.priceTendik.toLocaleString('id-ID') }}</p>
                      <p class="text-xs text-gray-400 line-through">Rp {{ slot.pricePerHour.toLocaleString('id-ID') }}</p>
                    </template>
                    <template v-else>
                      <p class="text-lg font-bold text-blue-600 mt-1">Rp {{ slot.pricePerHour.toLocaleString('id-ID') }}</p>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="w-full">
        <div class="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden">
          <div class="p-5 border-b border-gray-200 bg-gray-50/50">
            <h3 class="text-base font-bold text-gray-900">Informasi Pemesan</h3>
            <p class="text-xs text-gray-500 mt-0.5">Data kontak untuk konfirmasi booking.</p>
          </div>
          <div class="p-6 space-y-4">
            <div class="space-y-1.5">
              <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider">Nama Lengkap <span class="text-red-500">*</span></label>
              <input 
                v-model="bookingForm.name" 
                type="text" 
                required 
                placeholder="Masukkan nama lengkap" 
                @blur="validateName"
                :class="[
                  'block w-full rounded-xl border pl-4 pr-4 py-3 text-sm font-medium text-gray-900 focus:ring-2 shadow-sm transition-all',
                  fieldErrors.name
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-200 bg-red-50'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                ]"
              />
              <p v-if="fieldErrors.name" class="mt-1.5 text-xs text-red-600 font-medium flex items-start gap-1.5">
                <svg class="w-3.5 h-3.5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>{{ fieldErrors.name }}</span>
              </p>
            </div>

            <div class="space-y-1.5">
              <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider">Nomor Kontak <span class="text-red-500">*</span></label>
              <input 
                v-model="bookingForm.contact" 
                type="tel" 
                required 
                placeholder="Contoh: 081234567890" 
                @blur="validateContact"
                :class="[
                  'block w-full rounded-xl border pl-4 pr-4 py-3 text-sm font-medium text-gray-900 focus:ring-2 shadow-sm transition-all',
                  fieldErrors.contact
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-200 bg-red-50'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                ]"
              />
              <p v-if="fieldErrors.contact" class="mt-1.5 text-xs text-red-600 font-medium flex items-start gap-1.5">
                <svg class="w-3.5 h-3.5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>{{ fieldErrors.contact }}</span>
              </p>
            </div>

            <div class="space-y-1.5">
              <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider">Alamat Email <span class="text-red-500">*</span></label>
                <p class="text-xs text-gray-500 mt-1">Harap masukkan email client yang valid untuk keperluan pengiriman kode booking dan informasi lainnya.</p>
              <input 
                v-model="bookingForm.email" 
                type="email" 
                required 
                placeholder="contoh@email.com" 
                @blur="validateEmail"
                :class="[
                  'block w-full rounded-xl border pl-4 pr-4 py-3 text-sm font-medium text-gray-900 focus:ring-2 shadow-sm transition-all',
                  fieldErrors.email
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-200 bg-red-50'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                ]"
              />
              <p v-if="fieldErrors.email" class="mt-1.5 text-xs text-red-600 font-medium flex items-start gap-1.5">
                <svg class="w-3.5 h-3.5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>{{ fieldErrors.email }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- ===================== BOOKING AKADEMIK CARD ===================== -->
      <div class="w-full">
        <div class="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden">
          <div class="p-5 border-b border-gray-200 bg-gray-50/50">
            <h3 class="text-base font-bold text-gray-900">Kategori Booking</h3>
            <p class="text-xs text-gray-500 mt-0.5">Pilih jenis booking untuk keperluan akademik.</p>
          </div>
          <div class="p-6 space-y-6">
            <div class="space-y-1.5">
              <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider">Tipe Penyewa</label>
              <div class="relative">
                <select 
                  v-model="bookingForm.renterType"
                  class="block w-full rounded-xl border border-gray-300 pl-4 pr-10 py-3 text-sm font-medium text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 bg-white shadow-sm transition-all appearance-none cursor-pointer"
                >
                  <option value="UMUM">Umum (Mahasiswa Umum)</option>
                  <option value="TENDIK">Tendik (Tenaga Kependidikan)</option>
                  <option value="AKADEMIK">Akademik (Mahasiswa dengan Kegiatan Kampus)</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
              <p class="text-xs text-gray-500 mt-1">
                Pilih kategori penyewa untuk menentukan harga sewa.
              </p>
            </div>

            <!-- SPTJM Upload (Mandatory) -->
            <div class="space-y-1.5">
              <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider">Upload SPTJM (PDF) <span class="text-red-500">*</span></label>
              <div class="relative">
                <input 
                  type="file" 
                  accept="application/pdf" 
                  @change="handleSptjmUpload"
                  class="block w-full text-sm text-gray-900 border border-gray-300 rounded-xl cursor-pointer bg-gray-50 focus:outline-none focus:border-blue-500 file:mr-4 file:py-3 file:px-4 file:rounded-l-xl file:border-0 file:text-sm file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition-all" 
                />
              </div>
              <p class="text-xs text-gray-500 mt-1">
                💡 Surat Pernyataan Tanggung Jawab Mutlak (Wajib), format PDF max 5MB.
              </p>
            </div>

            <div v-if="bookingForm.renterType !== 'UMUM'" class="space-y-4 pt-4 border-t border-gray-100">
              <div class="space-y-1.5">
                <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider">Nama Institusi <span class="text-red-500">*</span></label>
                <input 
                  v-model="bookingForm.institution" 
                  type="text" 
                  required 
                  placeholder="Fakultas / Jurusan / Unit / Organisasi..." 
                  @blur="validateInstitution"
                  :class="[
                    'block w-full rounded-xl border pl-4 pr-4 py-3 text-sm font-medium text-gray-900 focus:ring-2 shadow-sm transition-all',
                    fieldErrors.institution
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-200 bg-red-50'
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  ]"
                />
                <p v-if="fieldErrors.institution" class="mt-1.5 text-xs text-red-600 font-medium flex items-start gap-1.5">
                  <svg class="w-3.5 h-3.5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span>{{ fieldErrors.institution }}</span>
                </p>
              </div>

              <div class="space-y-1.5">
                <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider">Upload Surat Pengantar (PDF)</label>
                <div class="relative">
                  <input 
                    type="file" 
                    accept="application/pdf" 
                    @change="handleSuratUpload"
                    class="block w-full text-sm text-gray-900 border border-gray-300 rounded-xl cursor-pointer bg-gray-50 focus:outline-none focus:border-blue-500 file:mr-4 file:py-3 file:px-4 file:rounded-l-xl file:border-0 file:text-sm file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition-all" 
                  />
                </div>
                <p class="text-xs text-gray-500 mt-1">
                  💡 Surat pengantar dari institusi/fakultas (Wajib untuk Akademik/Tendik).
                </p>
                
                <div v-if="uploadProgress !== null" class="mt-3 space-y-2">
                  <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      :style="{ width: uploadProgress + '%' }" 
                      class="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300 ease-out"
                    ></div>
                  </div>
                  <div class="flex items-center justify-between text-xs">
                    <span class="text-gray-600 font-medium">Mengunggah file...</span>
                    <span class="text-blue-600 font-bold">{{ uploadProgress }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ===================== TOTAL HARGA CARD ===================== -->
      <div class="w-full">
        <div class="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden">
          <div class="p-5 border-b border-gray-200 bg-gray-50/50">
            <h3 class="text-base font-bold text-gray-900">Total Harga</h3>
            <p class="text-xs text-gray-500 mt-0.5">Ringkasan biaya booking lapangan.</p>
          </div>
          <div class="p-6">
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-gray-700">Total Biaya Booking</span>
              <span class="text-lg font-bold text-gray-900">{{ formatCurrency(totalPrice) }}</span>
            </div>
            <div v-if="bookingForm.renterType === 'AKADEMIK'" class="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <p class="text-xs font-semibold text-green-700">Gratis untuk kegiatan Akademik.</p>
              </div>
            </div>
            <div v-else-if="bookingForm.renterType === 'TENDIK'" class="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p class="text-xs font-semibold text-purple-700">Harga khusus Tendik diterapkan.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="errorMsg" class="p-4 rounded-xl border border-red-200 bg-red-50 text-red-700 flex items-start gap-3 shadow-sm animate-shake">
        <svg class="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
        <div class="flex-1">
          <p class="font-bold text-sm">Terjadi Kesalahan</p>
          <p class="text-sm">{{ errorMsg }}</p>
        </div>
        <button 
          type="button" 
          @click="errorMsg = null" 
          class="text-red-700 hover:text-red-900 transition-colors"
          aria-label="Tutup pesan error"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- ACTION BUTTONS -->
      <div class="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-4">
        <button
          type="button"
          @click="$router.back()"
          class="flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-all active:scale-95"
        >
          Batal
        </button>

        <button
          type="submit"
          :disabled="uploadProgress !== null || checkingAvailability || submitting"
          class="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-blue-700 hover:shadow-md transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <svg v-if="uploadProgress !== null || checkingAvailability || submitting" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          <span>
            {{ checkingAvailability ? 'Memeriksa Ketersediaan...' : (uploadProgress !== null || submitting) ? 'Menyimpan...' : 'Buat Booking' }}
          </span>
        </button>
      </div>

    </form>

    <!-- Confirmation Modal -->
    <ConfirmationModal ref="confirmationModal" />
  </section>
</template>