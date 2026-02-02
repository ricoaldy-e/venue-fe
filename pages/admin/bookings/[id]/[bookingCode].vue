<script setup lang="ts">
definePageMeta({
  middleware: 'auth-admin',
  layout: 'admin',
  key: (route) => route.fullPath
})

const { options } = useAppOptions()
const appName = computed(() => options.value.data?.name || 'VENUE UNDIP')

useHead({
  title: 'Detail Booking - VENUE UNDIP',
  meta: [
    { name: 'description', content: 'Detail dan status booking lapangan di VENUE UNDIP' }
  ]
})

const confirmationModal = ref<any>(null)

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    timeZone: 'Asia/Jakarta'
  })
}

interface Field {
  name: string
}

interface BookingDetail {
  fieldId: number
  bookingDate: string,
  startHour: number,
  subtotal: number,
  Field: Field
}

interface BookingResult {
  bookingCode: string
  name: string
  contact: string
  email: string
  renterType?: 'UMUM' | 'TENDIK' | 'AKADEMIK'
  institution?: string
  suratUrl?: string
  sptjmUrl?: string
  totalPrice: number
  status: string
  paymentStatus: string
  createdAt: string
  details: BookingDetail[]
}

const route = useRoute()
const bookingCode = route.params.bookingCode

const { data: booking, pending, error, refresh } = await useAsyncData(
  `booking-${bookingCode}`,
  () => $fetch<BookingResult>(`/api/bookings/${bookingCode}`)
)

if (error.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Booking tidak ditemukan',
    fatal: true
  })
}

const isPdf = (url?: string) => {
  return !!url && url.toLowerCase().endsWith('.pdf')
}

const updating = ref(false)

async function markAsPaid() {
  if (!booking.value) return
  if (booking.value.paymentStatus === 'PAID') return
  if (updating.value) return
  updating.value = true

  try {
    await $fetch(`/api/bookings/${booking.value.bookingCode}/payment`, {
      method: 'POST',
      body: { paymentStatus: 'PAID' }
    })
    await refresh()
  } catch (err: any) {
    alert(err?.data?.message || 'Gagal update status pembayaran')
  } finally {
    updating.value = false
  }
}

async function markAsUnpaid() {
  if (!booking.value) return
  if (booking.value.paymentStatus !== 'PAID') return
  if (updating.value) return
  updating.value = true

  try {
    await $fetch(`/api/bookings/${booking.value.bookingCode}/payment`, {
      method: 'POST',
      body: { paymentStatus: 'UNPAID' }
    })
    await refresh()
  } catch (err: any) {
    alert(err?.data?.message || 'Gagal update status pembayaran')
  } finally {
    updating.value = false
  }
}

async function handleStatusChange(newStatus: string) {
  const statusText = newStatus === 'APPROVED' ? 'menyetujui' : 'membatalkan'
  
  const confirmed = await confirmationModal.value?.open({
    title: `Konfirmasi ${newStatus === 'APPROVED' ? 'Persetujuan' : 'Pembatalan'}`,
    message: `Apakah Anda yakin ingin ${statusText} booking ini?`,
    confirmText: newStatus === 'APPROVED' ? 'Setujui' : 'Batalkan',
    type: newStatus === 'APPROVED' ? 'success' : 'danger'
  })

  if (!confirmed || updating.value) return
  updating.value = true

  try {
    await $fetch(`/api/bookings/${booking.value?.bookingCode}/status`, {
      method: 'POST',
      body: { bookingStatus: newStatus }
    })
    await refresh()
    
    if (newStatus === 'CANCELLED') {
      await confirmationModal.value?.open({
        title: '❌ Booking Dibatalkan',
        message: `Kode Booking: ${booking.value?.bookingCode}\n\n📧 Informasi pembatalan telah dikirim ke:\n${booking.value?.email}\n\n💡 Pastikan client check inbox atau spam folder untuk detail booking yang dibatalkan.`,
        confirmText: 'OK',
        type: 'danger',
        mode: 'alert'
      })
    }
  } catch (err: any) {
    alert(err?.data?.message || 'Gagal update status booking')
  } finally {
    updating.value = false
  }
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount)
}

const getStatusClasses = (status: string) => {
  const classes = {
    // 'PENDING': 'bg-yellow-50 text-yellow-700 border-yellow-200', // Temporarily disabled
    'APPROVED': 'bg-green-50 text-green-700 border-green-200',
    'CANCELLED': 'bg-red-50 text-red-700 border-red-200'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-50 text-gray-700 border-gray-200'
}

const getPaymentStatusClasses = (status: string) => {
  return status === 'PAID'
    ? 'bg-green-50 text-green-700 border-green-200'
    : 'bg-orange-50 text-orange-700 border-orange-200'
}

const getStatusText = (status: string) => {
  const texts = {
    // 'PENDING': 'Menunggu Persetujuan', // Temporarily disabled
    'APPROVED': 'Disetujui',
    'CANCELLED': 'Dibatalkan'
  }
  return texts[status as keyof typeof texts] || status
}

const getPaymentText = (status: string) => {
  return status === 'PAID' ? 'Lunas' : 'Belum Bayar'
}

const getTimeSlot = (hour: number) => {
  return `${hour.toString().padStart(2, '0')}:00 - ${(hour + 1).toString().padStart(2, '0')}:00`
}

const groupedDetails = computed(() => {
  if (!booking.value?.details) return []
  
  const grouped = new Map<string, BookingDetail[]>()
  
  booking.value.details.forEach(detail => {
    const key = detail.bookingDate
    if (!grouped.has(key)) {
      grouped.set(key, [])
    }
    grouped.get(key)!.push(detail)
  })
  
  return Array.from(grouped.entries()).map(([date, details]) => ({
    date,
    details: details.sort((a, b) => a.startHour - b.startHour)
  }))
})
</script>

<template>
  <section class="flex w-full flex-col gap-6 sm:gap-8 pb-16 max-w-7xl mx-auto">
    
    <!-- Header -->
    <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
      <div class="flex items-start gap-4">
        <div class="p-3 bg-blue-50 rounded-xl border border-blue-100 shrink-0 hidden sm:flex items-center justify-center">
          <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <h1 class="text-2xl uppercase font-bold text-gray-900 tracking-tight">Detail Booking</h1>
          <p class="text-sm text-gray-500 mt-1">
            Informasi lengkap dan status reservasi booking.
          </p>
        </div>
      </div>
      
      <NuxtLink
        :to="`/admin/bookings/${route.params.id}`"
        class="inline-flex w-fit items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-all [@media(hover:hover)]:hover:bg-gray-50 [@media(hover:hover)]:hover:text-[#1f2a56] [@media(hover:hover)]:hover:border-[#1f2a56] [@media(hover:hover)]:hover:shadow-md active:scale-95"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        <span>Kembali</span>
      </NuxtLink>
    </header>

    <!-- Loading State -->
    <div v-if="pending" class="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white rounded-2xl border border-gray-200 p-8 h-64"></div>
        <div class="bg-white rounded-2xl border border-gray-200 p-8 h-96"></div>
      </div>
      <div class="bg-white rounded-2xl border border-gray-200 p-8 h-96"></div>
    </div>

    <!-- Main Content -->
    <div v-else-if="booking" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Left Column: Booking Details -->
      <div class="lg:col-span-2 space-y-6">
        
        <!-- Booking Code & Status -->
        <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-200">
            <div>
              <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Kode Booking</p>
              <p class="text-2xl font-bold text-blue-600">{{ booking.bookingCode }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ formatDate(booking.createdAt) }}</p>
            </div>
            <div class="flex flex-wrap gap-2">
              <span 
                :class="[
                  'inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold border',
                  getStatusClasses(booking.status)
                ]"
              >
                {{ getStatusText(booking.status) }}
              </span>
              <span 
                :class="[
                  'inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold border',
                  getPaymentStatusClasses(booking.paymentStatus)
                ]"
              >
                {{ getPaymentText(booking.paymentStatus) }}
              </span>
            </div>
          </div>

          <!-- Customer Info -->
          <div class="space-y-4">
            <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wide">Informasi Pemesan</h3>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p class="text-xs font-semibold text-gray-500 mb-1">Nama Lengkap</p>
                <p class="text-sm font-semibold text-gray-900">{{ booking.name }}</p>
              </div>
              <div>
                <p class="text-xs font-semibold text-gray-500 mb-1">Nomor Kontak</p>
                <p class="text-sm font-semibold text-gray-900">{{ booking.contact }}</p>
              </div>
              <div>
                <p class="text-xs font-semibold text-gray-500 mb-1">Email</p>
                <p class="text-sm font-semibold text-gray-900">{{ booking.email }}</p>
              </div>
              <div>
                <p class="text-xs font-semibold text-gray-500 mb-1">Tipe Booking</p>
                <div>
                   <span 
                    v-if="booking.renterType === 'AKADEMIK'"
                    class="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200"
                  >
                    AKADEMIK
                  </span>
                  <span 
                    v-else-if="booking.renterType === 'TENDIK'"
                    class="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200"
                  >
                    TENDIK
                  </span>
                  <span 
                    v-else
                    class="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200"
                  >
                    UMUM
                  </span>
                </div>
              </div>
              <div v-if="booking.renterType !== 'UMUM' && booking.institution" class="sm:col-span-2">
                <p class="text-xs font-semibold text-gray-500 mb-1">Institusi</p>
                <p class="text-sm font-semibold text-gray-900">{{ booking.institution }}</p>
              </div>
            </div>

            <!-- Surat Keterangan -->
              <div v-if="booking.sptjmUrl || (booking.renterType !== 'UMUM' && booking.suratUrl)" class="sm:col-span-2 pt-4 border-t border-gray-100">
                <div class="flex flex-wrap gap-4">
                  <!-- SPTJM ALWAYS DISPLAYED IF AVAILABLE -->
                  <div v-if="booking.sptjmUrl">
                    <p class="text-xs font-semibold text-gray-500 mb-2">Surat SPTJM</p>
                    <a 
                      :href="booking.sptjmUrl" 
                      target="_blank"
                      class="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 [@media(hover:hover)]:hover:bg-blue-100 border border-blue-200 text-blue-700 rounded-lg text-sm font-semibold transition-colors"
                    >
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                      </svg>
                      Lihat SPTJM (PDF)
                    </a>
                  </div>

                  <!-- SURAT PENGANTAR (For TENDIK / AKADEMIK) -->
                  <div v-if="booking.renterType !== 'UMUM' && booking.suratUrl">
                    <p class="text-xs font-semibold text-gray-500 mb-2">Surat Pengantar</p>
                    <a 
                      v-if="isPdf(booking.suratUrl)"
                      :href="booking.suratUrl" 
                      target="_blank"
                      class="inline-flex items-center gap-2 px-4 py-2 bg-red-50 [@media(hover:hover)]:hover:bg-red-100 border border-red-200 text-red-700 rounded-lg text-sm font-semibold transition-colors"
                    >
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                      </svg>
                      Lihat Surat (PDF)
                    </a>
                    <a 
                      v-else
                      :href="booking.suratUrl" 
                      target="_blank"
                      class="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 [@media(hover:hover)]:hover:bg-blue-100 border border-blue-200 text-blue-700 rounded-lg text-sm font-semibold transition-colors"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Lihat Gambar
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

        <!-- Booking Details -->
        <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wide mb-6">Detail Reservasi</h3>
          
          <!-- Cancellation Notice Inside -->
          <div v-if="booking.status === 'CANCELLED'" class="mb-6 bg-red-50 rounded-xl border border-red-200 p-4">
            <div class="flex items-start gap-3">
              <svg class="w-5 h-5 text-red-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p class="text-xs font-bold text-red-900 mb-1">Booking Dibatalkan</p>
                <p class="text-xs text-red-700 leading-relaxed">
                  Booking ini telah dibatalkan dan tidak dapat diproses lebih lanjut.
                </p>
              </div>
            </div>
          </div>

          <div class="space-y-6">
            <div v-for="(group, index) in groupedDetails" :key="index" class="space-y-3">
              <div class="flex items-center gap-2 pb-2 border-b border-gray-200">
                <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p class="text-sm font-bold text-gray-900">{{ formatDate(group.date) }}</p>
              </div>
              
              <div class="space-y-2">
                <div 
                  v-for="detail in group.details" 
                  :key="`${detail.fieldId}-${detail.startHour}`"
                  class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div class="flex items-center gap-3">
                    <div class="p-2 bg-white rounded-lg border border-gray-300">
                      <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                    </div>
                    <div>
                      <p class="text-sm font-semibold text-gray-900">{{ detail.Field.name }}</p>
                      <p class="text-xs text-gray-500">{{ getTimeSlot(detail.startHour) }}</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <!-- TENDIK pricing -->
                    <template v-if="booking?.renterType === 'TENDIK'">
                      <p class="text-sm font-bold text-purple-600">{{ formatCurrency(detail.subtotal) }}</p>
                      <p class="text-xs text-purple-500">Harga Tendik</p>
                    </template>
                    <!-- AKADEMIK pricing (free) -->
                    <template v-else-if="booking?.renterType === 'AKADEMIK'">
                      <p class="text-sm font-bold text-green-600">GRATIS</p>
                      <p class="text-xs text-green-500">Akademik</p>
                    </template>
                    <!-- Normal price for UMUM -->
                    <template v-else>
                      <p class="text-sm font-bold text-gray-900">{{ formatCurrency(detail.subtotal) }}</p>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Actions & Summary -->
      <div class="space-y-6">
        
        <!-- Payment Summary -->
        <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">Ringkasan Pembayaran</h3>
          
          <div class="space-y-3 mb-6">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Total Booking</span>
              <span class="text-sm font-semibold text-gray-900">{{ booking.details.length }} sesi</span>
            </div>
            <div class="pt-3 border-t border-gray-200">
              <div class="flex justify-between items-center">
                <span class="text-sm font-bold text-gray-900">Total Harga</span>
                <span class="text-lg font-bold text-blue-600">{{ formatCurrency(booking?.totalPrice) }}</span>
              </div>
            </div>

            <div v-if="booking?.renterType === 'AKADEMIK'" class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <p class="text-xs font-semibold text-green-700">Gratis untuk kegiatan Akademik.</p>
              </div>
            </div>
            <div v-else-if="booking?.renterType === 'TENDIK'" class="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p class="text-xs font-semibold text-purple-700">Harga khusus Tendik diterapkan.</p>
              </div>
            </div>
          </div>

          <!-- Payment Status Button -->
          <div>
            <button
              v-if="booking?.paymentStatus !== 'PAID'"
              @click="markAsPaid"
              :disabled="updating"
              class="w-full px-4 py-2.5 bg-green-600 [@media(hover:hover)]:hover:bg-green-700 disabled:bg-gray-400 text-white text-sm font-semibold rounded-xl transition-all shadow-sm"
            >
              <span v-if="updating">Memproses...</span>
              <span v-else>Tandai Sudah Dibayar</span>
            </button>
            
            <div v-else class="space-y-3">
              <div class="w-full px-4 py-2.5 bg-green-50 border border-green-200 text-green-700 text-sm font-semibold rounded-xl text-center">
                ✓ Pembayaran Lunas
              </div>
              <button
                @click="markAsUnpaid"
                :disabled="updating"
                class="w-full px-4 py-2.5 bg-white [@media(hover:hover)]:hover:bg-orange-50 border border-orange-300 disabled:bg-gray-100 text-orange-700 text-sm font-semibold rounded-xl transition-all shadow-sm"
              >
                <span v-if="updating">Memproses...</span>
                <span v-else>Tandai Belum Lunas</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div v-if="booking?.status !== 'CANCELLED'" class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">Aksi Booking</h3>
          
          <div class="space-y-3">
            <!-- PENDING approval button - Temporarily disabled
            <button
              v-if="booking?.status === 'PENDING'"
              @click="handleStatusChange('APPROVED')"
              :disabled="updating"
              class="w-full px-4 py-2.5 bg-blue-600 [@media(hover:hover)]:hover:bg-blue-700 disabled:bg-gray-400 text-white text-sm font-semibold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Setujui Booking
            </button>
            -->
            
            <button
              @click="handleStatusChange('CANCELLED')"
              :disabled="updating"
              class="w-full px-4 py-2.5 bg-white [@media(hover:hover)]:hover:bg-red-50 border border-red-200 disabled:opacity-50 text-red-700 text-sm font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Batalkan Booking
            </button>
          </div>
        </div>

        <!-- Booking Info -->
        <div class="bg-gray-50 rounded-2xl border border-gray-200 p-5">
          <div class="flex items-start gap-3">
            <svg class="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p class="text-xs font-bold text-gray-900 mb-1">Informasi</p>
              <p class="text-xs text-gray-600 leading-relaxed">
                Booking dibuat pada {{ formatDate(booking?.createdAt ?? '') }}.
                <!-- {{ booking?.status === 'PENDING' ? 'Segera proses untuk konfirmasi kepada pemesan.' : '' }} -->
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ConfirmationModal ref="confirmationModal" />
  </section>
</template>