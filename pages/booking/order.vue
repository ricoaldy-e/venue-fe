<script setup lang="ts">
import { computed, ref } from 'vue'
import { toUtcMidnightIso } from '~/utils/dateHelpers'
import { parseBackendError } from '~/utils/errorParser'

useHead({
  title: 'Booking Lapangan - VENUE UNDIP',
  meta: [
    { name: 'description', content: 'Selesaikan booking lapangan olahraga Anda di VENUE UNDIP' }
  ]
})

interface StadionDetail {
  id: number
  name: string
  mapUrl?: string
  description?: string
}

const router = useRouter()
const bookingCart = useState('booking-cart', () => ({
  stadionId: null as number | null,
  stadionName: '',
  slots: [] as Array<{
    key: string
    courtId: number
    courtName: string
    range: string
    price: number
    dateLabel: string
    dateKey: string
  }>,
}))

if (!bookingCart.value.stadionId || bookingCart.value.slots.length === 0) {
  await navigateTo('/')
}

const stadionId = bookingCart.value.stadionId

const { data: stadion, pending, error: fetchError } = await useAsyncData<StadionDetail | null>(
  () => (stadionId ? `booking-stadion-${stadionId}` : ""),

  async () => {
    if (!stadionId) return null
    return await $fetch<StadionDetail>(`/api/stadions/${stadionId}` as string)
  },
  
  { immediate: Boolean(stadionId) }
)

if (fetchError.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Stadion tidak ditemukan',
    fatal: true
  })
}

const orderSlots = computed(() => bookingCart.value.slots)
const totalPrice = computed(() =>
  orderSlots.value.reduce((sum, slot) => sum + (slot.price || 0), 0)
)

const customerName = ref('')
const customerContact = ref('')
const customerEmail = ref('')
const customerInstitution = ref('')
const renterType = ref<'UMUM' | 'TENDIK' | 'AKADEMIK'>('UMUM')
const bookingLoading = ref(false)
const bookingError = ref<string | null>(null)
const bookingSuccess = ref<string | null>(null)
const customerSuratUrl = ref('')
const sptjmFile = ref<File | null>(null)

const errors = ref({
  name: '',
  contact: '',
  email: '',
  suratUrl: '',
  sptjm: ''
})

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const phoneRegex = /^(\+62|62|0)[0-9]{9,13}$/
const urlRegex = /^https?:\/\/.+/

const validateName = () => {
  const trimmed = customerName.value.trim()
  if (!trimmed) {
    errors.value.name = 'Nama wajib diisi'
    return false
  }
  if (trimmed.length < 3) {
    errors.value.name = 'Nama minimal 3 karakter'
    return false
  }
  if (!/^[a-zA-Z\s.]+$/.test(trimmed)) {
    errors.value.name = 'Nama hanya boleh huruf dan spasi'
    return false
  }
  errors.value.name = ''
  return true
}

const validateContact = () => {
  const trimmed = customerContact.value.trim()
  if (!trimmed) {
    errors.value.contact = 'Nomor kontak wajib diisi'
    return false
  }
  if (!phoneRegex.test(trimmed)) {
    errors.value.contact = 'Format nomor tidak valid (contoh: 081234567890)'
    return false
  }
  errors.value.contact = ''
  return true
}

const validateEmail = () => {
  const trimmed = customerEmail.value.trim()
  if (!trimmed) {
    errors.value.email = 'Email wajib diisi'
    return false
  }
  if (!emailRegex.test(trimmed)) {
    errors.value.email = 'Format email tidak valid'
    return false
  }
  errors.value.email = ''
  return true
}

const validateSuratUrl = () => {
  if (renterType.value === 'UMUM') {
    errors.value.suratUrl = ''
    return true
  }
  const trimmed = customerSuratUrl.value.trim()
  if (trimmed && !urlRegex.test(trimmed)) {
    errors.value.suratUrl = 'URL harus diawali dengan http:// atau https://'
    return false
  }
  errors.value.suratUrl = ''
  return true
}

const validateSptjm = () => {
  if (!sptjmFile.value) {
    errors.value.sptjm = 'Surat SPTJM wajib diupload'
    return false
  }
  if (!sptjmFile.value.type.includes('pdf')) {
    errors.value.sptjm = 'Surat SPTJM harus dalam format PDF'
    return false
  }
  errors.value.sptjm = ''
  return true
}

const handleSptjmUpload = (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) {
    if (!file.type.includes('pdf')) {
      errors.value.sptjm = 'Surat SPTJM harus dalam format PDF'
      sptjmFile.value = null
      return
    }
    sptjmFile.value = file
    errors.value.sptjm = ''
  }
}

const removeSptjm = () => {
  sptjmFile.value = null
}

// Computed price based on renter type
const displayPrice = computed(() => {
  if (renterType.value === 'AKADEMIK') return 0
  return totalPrice.value
})

const needsInstitution = computed(() => renterType.value !== 'UMUM')
const needsSuratPengantar = computed(() => renterType.value !== 'UMUM')

const formatDateLong = (slotDate: string, label: string) => {
  try {
    const d = new Date(slotDate)
    if (Number.isNaN(d.getTime())) return label
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(d)
  } catch {
    return label
  }
}

const removeSlot = (key: string) => {
  const filtered = bookingCart.value.slots.filter(slot => slot.key !== key)
  bookingCart.value = { ...bookingCart.value, slots: filtered }
  if (!filtered.length && bookingCart.value.stadionId) {
    router.push(`/venues/${bookingCart.value.stadionId}`)
  }
}

const addMore = () => {
  if (bookingCart.value.stadionId) {
    router.push(`/venues/${bookingCart.value.stadionId}`)
  } else {
    router.push('/')
  }
}

const createBooking = async () => {
  if (!orderSlots.value.length) return
  
  const isNameValid = validateName()
  const isContactValid = validateContact()
  const isEmailValid = validateEmail()
  const isSuratUrlValid = validateSuratUrl()
  const isSptjmValid = validateSptjm()
  
  if (!isNameValid || !isContactValid || !isEmailValid || !isSuratUrlValid || !isSptjmValid) {
    bookingError.value = 'Mohon perbaiki data yang tidak valid'
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }
  
  bookingLoading.value = true
  bookingError.value = null
  bookingSuccess.value = null
  
  customerName.value = customerName.value.trim()
  customerContact.value = customerContact.value.trim()
  customerEmail.value = customerEmail.value.trim()
  if (customerInstitution.value) customerInstitution.value = customerInstitution.value.trim()
  if (customerSuratUrl.value) customerSuratUrl.value = customerSuratUrl.value.trim()
  const details = orderSlots.value.map(slot => {
    const [startText] = slot.range.split('-')
    const [hourText] = startText?.trim().split(':') ?? []
    const startHour = Number(hourText)
    return {
      fieldId: slot.courtId,
      bookingDate: toUtcMidnightIso(slot.dateKey),
      startHour: Number.isNaN(startHour) ? 0 : startHour,
      pricePerHour: slot.price,
    }
  })
  try {
    // Verify file again to be sure
    if (sptjmFile.value && !sptjmFile.value.type.includes('pdf')) {
      throw new Error('File SPTJM harus PDF')
    }

    // Use FormData to support file upload
    const formData = new FormData()
    
    // 1. Prepare Operations JSON
    const operations = {
      query: `mutation CreateBooking(
        $name: String!
        $contact: String!
        $email: String!
        $institution: String
        $renterType: RenterType!
        $sptjmFile: Upload
        $suratFile: Upload
        $details: [BookingDetailInput!]!
      ) {
        createBooking(
          name: $name
          contact: $contact
          email: $email
          institution: $institution
          renterType: $renterType
          sptjmFile: $sptjmFile
          suratFile: $suratFile
          details: $details
        ) {
          bookingCode
          name
          status
          paymentStatus
          totalPrice
        }
      }`,
      variables: {
        name: customerName.value,
        contact: customerContact.value,
        email: customerEmail.value,
        institution: needsInstitution.value ? customerInstitution.value : null,
        renterType: renterType.value,
        sptjmFile: null, // Placeholder, will be mapped
        suratFile: null,
        details: details.map(d => ({
          fieldId: d.fieldId,
          bookingDate: d.bookingDate,
          startHour: d.startHour,
          pricePerHour: d.pricePerHour,
        })),
      },
    }

    // 2. Prepare Map JSON
    // Strict order: operations -> map -> files
    const map: Record<string, string[]> = {}
    
    if (sptjmFile.value) {
      map['0'] = ['variables.sptjmFile']
    }

    // Append operations FIRST
    formData.append('operations', JSON.stringify(operations))
    
    // Append map SECOND
    formData.append('map', JSON.stringify(map))
    
    // Append files LAST
    if (sptjmFile.value) {
      formData.append('0', sptjmFile.value)
    }
    

    
    const response = await fetch('/api/bookings/create', {
      method: 'POST',
      body: formData,
      // Do NOT set Content-Type header manually for FormData, let browser set it with boundary
    })

    if (!response.ok) {
        let errMsg = 'Terjadi kesalahan saat upload'
        try {
            const errJson = await response.json()
            errMsg = errJson.statusMessage || errJson.message || errMsg
        } catch (e) {
             // ignore
        }
        throw new Error(errMsg)
    }

    const result = await response.json()
    
    // Handle both response formats (direct or nested in data.createBooking)
    const bookingCode = (result as any)?.bookingCode || result?.data?.createBooking?.bookingCode || ''
    if (result?.errors?.length) {
      throw new Error(result.errors[0]?.message || 'Gagal membuat booking')
    }
    bookingCart.value = { stadionId: null, stadionName: '', slots: [] }
    bookingSuccess.value = `Booking berhasil! Kode: ${bookingCode}`
    setTimeout(() => {
      bookingSuccess.value = null
      navigateTo('/')
    }, 1500)
  } catch (error: any) {
    const parsed = parseBackendError(error)
    bookingError.value = parsed.message
  } finally {
    bookingLoading.value = false
  }
}
</script>

<template>
  <main class="min-h-screen bg-[#f5f7fb] pb-16">
    <div class="mx-auto grid max-w-6xl gap-6 px-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,1fr)]">
      <section class="space-y-6">
        <div class="rounded-3xl bg-white p-6 shadow-sm">
          <header class="mb-6">
            <p class="text-xs font-semibold uppercase tracking-widest text-gray-500">Detail Venue</p>
            <h1 class="text-2xl font-bold text-[#1f2a56]">
              {{ stadion?.name || bookingCart.stadionName }}
            </h1>
            <p v-if="stadion?.mapUrl" class="text-sm text-gray-500">
              <a :href="stadion.mapUrl" class="text-[#1f2a56] underline" target="_blank" rel="noopener">
                Lihat lokasi di peta
              </a>
            </p>
          </header>
          <div class="space-y-4">
            <article
              v-for="slot in orderSlots"
              :key="slot.key"
              class="flex items-center justify-between rounded-2xl border border-gray-200 px-4 py-3"
            >
              <div>
                <p class="text-sm font-semibold text-[#1f2a56]">{{ slot.courtName }}</p>
                <p class="text-sm text-gray-600">
                  {{ formatDateLong(slot.dateKey, slot.dateLabel) }} • {{ slot.range }}
                </p>
                <p class="text-base font-semibold text-[#1f2a56]">
                  Rp{{ slot.price.toLocaleString('id-ID') }}
                </p>
              </div>
              <button class="text-red-500 hover:text-red-700" @click="removeSlot(slot.key)">
                <span class="sr-only">Hapus slot</span>
                <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 7h12M10 11v6m4-6v6M9 7l.867-1.8A1 1 0 0 1 10.79 5h2.42a1 1 0 0 1 .923.2L15 7" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M7 7v11a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V7" />
                </svg>
              </button>
            </article>
          </div>
          <button class="mt-4 text-sm font-semibold text-[#1f2a56] hover:underline" @click="addMore">
            Tambah Jadwal
          </button>
        </div>
      </section>

      <aside class="space-y-4">
        <div class="rounded-3xl bg-white p-4 shadow-sm">
          <p class="mb-3 font-semibold text-[#1f2a56]">Data Pemesan</p>
          <div class="space-y-3 text-sm">
            <label class="block">
              <span class="text-gray-600">Nama Lengkap <span class="text-red-500">*</span></span>
              <input
                v-model="customerName"
                type="text"
                placeholder="Masukkan nama lengkap"
                @blur="validateName"
                :class="[
                  'mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 transition-colors',
                  errors.name 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-200 bg-red-50'
                    : 'border-gray-200 focus:border-[#1f2a56] focus:ring-[#1f2a56]/20'
                ]"
              />
              <p v-if="errors.name" class="mt-1 text-xs text-red-600 flex items-center gap-1">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                {{ errors.name }}
              </p>
            </label>
            <label class="block">
              <span class="text-gray-600">Nomor Kontak <span class="text-red-500">*</span></span>
              <input
                v-model="customerContact"
                type="tel"
                placeholder="Contoh: 081234567890"
                @blur="validateContact"
                :class="[
                  'mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 transition-colors',
                  errors.contact 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-200 bg-red-50'
                    : 'border-gray-200 focus:border-[#1f2a56] focus:ring-[#1f2a56]/20'
                ]"
              />
              <p v-if="errors.contact" class="mt-1 text-xs text-red-600 flex items-center gap-1">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                {{ errors.contact }}
              </p>
            </label>
            <label class="block">
              <span class="text-gray-600">Email <span class="text-red-500">*</span></span>
              <input
                v-model="customerEmail"
                type="email"
                placeholder="nama@email.com"
                @blur="validateEmail"
                :class="[
                  'mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 transition-colors',
                  errors.email 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-200 bg-red-50'
                    : 'border-gray-200 focus:border-[#1f2a56] focus:ring-[#1f2a56]/20'
                ]"
              />
              <p v-if="errors.email" class="mt-1 text-xs text-red-600 flex items-center gap-1">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                {{ errors.email }}
              </p>
            </label>
            <!-- Kategori Penyewa Dropdown -->
            <div class="block">
              <span class="text-gray-600">Kategori Penyewa <span class="text-red-500">*</span></span>
              <select
                v-model="renterType"
                class="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 focus:border-[#1f2a56] focus:outline-none focus:ring-2 focus:ring-[#1f2a56]/20 bg-white"
              >
                <option value="UMUM">Umum (Mahasiswa Umum)</option>
                <option value="TENDIK">Tenaga Kependidikan</option>
                <option value="AKADEMIK">Akademik (Mahasiswa dengan Kegiatan Kampus)</option>
              </select>
              <p class="mt-1 text-xs text-gray-500">
                <template v-if="renterType === 'UMUM'">Harga standar berlaku</template>
                <template v-else-if="renterType === 'TENDIK'">Harga khusus tenaga kependidikan UNDIP</template>
                <template v-else>Gratis untuk kegiatan akademik resmi</template>
              </p>
            </div>

            <!-- Institution (untuk Tendik & Akademik) -->
            <label v-if="needsInstitution" class="block">
              <span class="text-gray-600">Instansi/Unit <span class="text-red-500">*</span></span>
              <input
                v-model="customerInstitution"
                type="text"
                placeholder="Contoh: Fakultas Teknik UNDIP"
                class="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 focus:border-[#1f2a56] focus:outline-none focus:ring-2 focus:ring-[#1f2a56]/20"
              />
            </label>

            <!-- Upload SPTJM (wajib untuk semua) -->
            <div class="block">
              <span class="text-gray-600">Upload SPTJM <span class="text-red-500">*</span></span>
              <p class="text-xs text-gray-500 mb-2">Surat Pernyataan Tanggung Jawab Mutlak (format PDF)</p>
              <div v-if="!sptjmFile" class="mt-1">
                <label class="flex items-center justify-center w-full rounded-xl border-2 border-dashed border-gray-300 px-3 py-4 cursor-pointer hover:border-[#1f2a56] hover:bg-gray-50 transition-colors">
                  <div class="flex flex-col items-center">
                    <svg class="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span class="text-sm text-gray-600">Klik untuk upload PDF</span>
                  </div>
                  <input type="file" accept=".pdf" class="hidden" @change="handleSptjmUpload" />
                </label>
              </div>
              <div v-else class="mt-1 flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-3 py-2">
                <div class="flex items-center gap-2">
                  <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span class="text-sm text-green-700 font-medium truncate max-w-[150px]">{{ sptjmFile.name }}</span>
                </div>
                <button type="button" @click="removeSptjm" class="text-red-500 hover:text-red-700 p-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p v-if="errors.sptjm" class="mt-1 text-xs text-red-600 flex items-center gap-1">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                {{ errors.sptjm }}
              </p>
            </div>

            <!-- Surat Pengantar (untuk Tendik & Akademik) -->
            <label v-if="needsSuratPengantar" class="block">
              <span class="text-gray-600">URL Surat Pengantar <span class="text-gray-400">(opsional)</span></span>
              <input
                v-model="customerSuratUrl"
                type="url"
                placeholder="https://contoh.com/surat.pdf"
                @blur="validateSuratUrl"
                :class="[
                  'mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 transition-colors',
                  errors.suratUrl 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-200 bg-red-50'
                    : 'border-gray-200 focus:border-[#1f2a56] focus:ring-[#1f2a56]/20'
                ]"
              />
              <p v-if="errors.suratUrl" class="mt-1 text-xs text-red-600 flex items-center gap-1">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                {{ errors.suratUrl }}
              </p>
            </label>
          </div>
        </div>

        <div v-if="bookingError" class="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {{ bookingError }}
        </div>
        <div v-else-if="bookingSuccess" class="rounded-2xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          {{ bookingSuccess }}
        </div>

        <div class="rounded-3xl bg-white p-4 shadow-sm">
          <div class="flex items-center justify-between">
            <p class="font-semibold text-[#1f2a56]">Gunakan Voucher</p>
            <span class="text-gray-400">+</span>
          </div>
        </div>

        <div class="rounded-3xl bg-white p-4 shadow-sm">
          <p class="mb-3 font-semibold text-[#1f2a56]">Rincian Biaya</p>
          <div class="space-y-2 text-sm text-gray-600">
            <div class="flex items-center justify-between">
              <span>Biaya Sewa</span>
              <span>Rp{{ displayPrice.toLocaleString('id-ID') }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span>Biaya Tambahan</span>
              <span>Rp0</span>
            </div>
          </div>
          <div v-if="renterType === 'AKADEMIK'" class="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
            <p class="text-xs text-green-700 font-medium">✓ Gratis untuk kegiatan akademik</p>
          </div>
          <div class="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 text-sm font-semibold text-[#1f2a56]">
            <span>Total Bayar</span>
            <span>Rp{{ displayPrice.toLocaleString('id-ID') }}</span>
          </div>
        </div>

        <div class="rounded-3xl bg-white p-4 shadow-sm">
          <p class="mb-2 font-semibold text-[#1f2a56]">Atur Pembayaran</p>
          <p class="text-sm text-gray-600">Bayar Lunas</p>
          <p class="text-base font-bold text-[#1f2a56]">Rp{{ displayPrice.toLocaleString('id-ID') }}</p>
        </div>

        <div class="rounded-3xl bg-white p-4 shadow-sm">
          <p class="font-semibold text-[#1f2a56]">Kebijakan Reschedule & Pembatalan</p>
          <p class="mt-1 text-sm text-gray-500">Hubungi admin untuk informasi lebih lanjut.</p>
        </div>

        <button
          class="w-full rounded-xl bg-[#1f2a56] py-3 text-sm font-semibold text-white shadow hover:bg-[#162347] disabled:bg-[#1f2a56]/70 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
          @click="createBooking"
          :disabled="pending || !orderSlots.length || bookingLoading"
        >
          <svg v-if="bookingLoading" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{{ bookingLoading ? 'Memproses...' : 'Buat Booking' }}</span>
        </button>
      </aside>
    </div>
  </main>
</template>