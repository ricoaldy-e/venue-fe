<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'

definePageMeta({
  middleware: 'auth-admin',
  layout: 'admin'
})

useHead({
  title: 'Riwayat & Kelola Booking - VENUE UNDIP',
  meta: [
    { name: 'description', content: 'Riwayat & kelola semua booking lapangan di VENUE UNDIP' }
  ]
})

interface BookingDetail {
  fieldId: number
  bookingDate: string
  startHour: number
  subtotal: number
}

interface BookingHistory {
  id: number
  bookingCode: string
  name: string
  contact: string
  email: string
  isAcademic: boolean
  totalPrice: number
  status: 'PENDING' | 'APPROVED' | 'CANCELLED'
  paymentStatus: 'UNPAID' | 'PAID'
  createdAt: string
  details: BookingDetail[]
}

interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

interface BookingSummary {
  totalCount: number
  paidCount: number
  unpaidCount: number
  academicCount: number
  nonAcademicCount: number
  approvedCount: number
  cancelledCount: number
  pendingCount: number
}

interface BookingResponse {
  data: BookingHistory[]
  pagination: PaginationInfo
  summary: BookingSummary
}

// Filter state - sent to server
const currentPage = ref(1)
const itemsPerPage = ref(10)
const searchQuery = ref('')
const statusFilter = ref<'' | 'PENDING' | 'APPROVED' | 'CANCELLED'>('')
const paymentFilter = ref<'' | 'PAID' | 'UNPAID'>('')
const sortOrder = ref<'desc' | 'asc'>('desc')

// Build query params for API
const queryParams = computed(() => ({
  page: currentPage.value,
  limit: itemsPerPage.value,
  search: searchQuery.value || undefined,
  status: statusFilter.value || undefined,
  paymentStatus: paymentFilter.value || undefined,
  sortOrder: sortOrder.value,
}))

// Default summary values
const defaultSummary: BookingSummary = {
  totalCount: 0,
  paidCount: 0,
  unpaidCount: 0,
  academicCount: 0,
  nonAcademicCount: 0,
  approvedCount: 0,
  cancelledCount: 0,
  pendingCount: 0
}

// Fetch bookings with server-side pagination
const { data: response, pending, error, refresh } = await useFetch<BookingResponse>(
  '/api/bookings/history',
  {
    query: queryParams,
    server: false,
    lazy: true,
    default: () => ({ 
      data: [], 
      pagination: { page: 1, limit: 10, total: 0, totalPages: 0, hasNextPage: false, hasPrevPage: false },
      summary: defaultSummary
    })
  }
)

// Extracted data from response
const bookings = computed(() => response.value?.data || [])
const pagination = computed(() => response.value?.pagination || { page: 1, limit: 10, total: 0, totalPages: 0, hasNextPage: false, hasPrevPage: false })
const summary = computed(() => response.value?.summary || defaultSummary)

// Debounced search to avoid too many requests
const debouncedRefresh = useDebounceFn(() => {
  currentPage.value = 1 // Reset to page 1 when filters change
  refresh()
}, 300)

// Watch for filter changes (except page changes)
watch([searchQuery, statusFilter, paymentFilter, sortOrder], () => {
  debouncedRefresh()
})

// Pagination handlers
const nextPage = () => {
  if (pagination.value.hasNextPage) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (pagination.value.hasPrevPage) {
    currentPage.value--
  }
}

// Pagination summary
const paginationSummary = computed(() => {
  const p = pagination.value
  if (p.total === 0) return 'Tidak ada data'
  const start = (p.page - 1) * p.limit + 1
  const end = Math.min(p.page * p.limit, p.total)
  return `Menampilkan ${start}-${end} dari ${p.total} data`
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', { 
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatSlotDate = (booking: BookingHistory) => {
  if (!booking.details || booking.details.length === 0) return '-'
  
  // Get all unique dates from booking details
  const dates = [...new Set(booking.details.map(d => d.bookingDate))]
    .sort()
    .map(dateStr => {
      const date = new Date(dateStr)
      return date.toLocaleDateString('id-ID', { 
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    })
  
  // If single date, return it
  if (dates.length === 1) return dates[0]
  
  // If multiple dates, show range or count
  if (dates.length === 2) return `${dates[0]} - ${dates[1]}`
  return `${dates[0]} (+${dates.length - 1} hari)`
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
    'PENDING': 'bg-yellow-50 text-yellow-700 border-yellow-200',
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
    // 'PENDING': 'Menunggu',
    'APPROVED': 'Disetujui',
    'CANCELLED': 'Dibatalkan'
  }
  return texts[status as keyof typeof texts] || status
}

const getPaymentText = (status: string) => {
  return status === 'PAID' ? 'Lunas' : 'Belum Bayar'
}

const navigateToDetail = (bookingCode: string) => {
  navigateTo(`/admin/bookings/detail/${bookingCode}`)
}
</script>

<template>
  <section class="flex w-full flex-col gap-6 sm:gap-8 pb-16">
    
    <!-- Header -->
    <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
      <div class="flex items-start gap-4">
        <div class="p-3 bg-blue-50 rounded-xl border border-blue-100 shrink-0 hidden sm:flex items-center justify-center">
          <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h1 class="text-2xl uppercase font-bold text-gray-900 tracking-tight">Riwayat & Kelola Booking</h1>
          <p class="text-sm text-gray-500 mt-1">
            Kelola dan pantau seluruh riwayat reservasi lapangan olahraga.
          </p>
        </div>
      </div>
      
      <div class="flex gap-2">
        <NuxtLink 
          to="/admin/bookings" 
          class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:text-[#1f2a56] hover:border-[#1f2a56] hover:shadow-md active:scale-95"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span>Kembali</span>
        </NuxtLink>
        <NuxtLink
          to="/admin/bookings/history/payment"
          class="inline-flex items-center gap-2 rounded-lg border border-emerald-600 bg-emerald-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition-all hover:bg-emerald-700 active:scale-95"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Laporan Pembayaran</span>
        </NuxtLink>
      </div>
    </header>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Total Booking Card -->
      <button
        @click="statusFilter = ''"
        :class="[
          'bg-white rounded-xl border p-5 shadow-sm text-left transition-all duration-200 hover:shadow-lg hover:scale-105 hover:border-blue-400 cursor-pointer',
          statusFilter === '' ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
        ]"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total Booking</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ pagination.total }}</p>
          </div>
          <div :class="[
            'p-3 rounded-lg transition-colors',
            statusFilter === '' ? 'bg-blue-100' : 'bg-blue-50'
          ]">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        </div>
      </button>

      <!-- Disetujui Card -->
      <button
        @click="statusFilter = 'APPROVED'"
        :class="[
          'bg-white rounded-xl border p-5 shadow-sm text-left transition-all duration-200 hover:shadow-lg hover:scale-105 hover:border-green-400 cursor-pointer',
          statusFilter === 'APPROVED' ? 'border-green-500 ring-2 ring-green-200' : 'border-gray-200'
        ]"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Disetujui</p>
            <p class="text-2xl font-bold text-green-600 mt-1">{{ summary.approvedCount }}</p>
          </div>
          <div :class="[
            'p-3 rounded-lg transition-colors',
            statusFilter === 'APPROVED' ? 'bg-green-100' : 'bg-green-50'
          ]">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </button>

      <!-- Dibatalkan Card -->
      <button
        @click="statusFilter = 'CANCELLED'"
        :class="[
          'bg-white rounded-xl border p-5 shadow-sm text-left transition-all duration-200 hover:shadow-lg hover:scale-105 hover:border-red-400 cursor-pointer',
          statusFilter === 'CANCELLED' ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-200'
        ]"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Dibatalkan</p>
            <p class="text-2xl font-bold text-red-600 mt-1">{{ summary.cancelledCount }}</p>
          </div>
          <div :class="[
            'p-3 rounded-lg transition-colors',
            statusFilter === 'CANCELLED' ? 'bg-red-100' : 'bg-red-50'
          ]">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </button>

      <!-- Pending Card (hidden as per request) -->
      <!-- <button
        @click="statusFilter = 'PENDING'"
        :class="[
          'bg-white rounded-xl border p-5 shadow-sm text-left transition-all duration-200 hover:shadow-lg hover:scale-105 hover:border-yellow-400 cursor-pointer',
          statusFilter === 'PENDING' ? 'border-yellow-500 ring-2 ring-yellow-200' : 'border-gray-200'
        ]"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Pending</p>
            <p class="text-2xl font-bold text-yellow-600 mt-1">-</p>
          </div>
          <div :class="[
            'p-3 rounded-lg transition-colors',
            statusFilter === 'PENDING' ? 'bg-yellow-100' : 'bg-yellow-50'
          ]">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </button> -->
    </div>

    <!-- Filters and Search -->
    <div class="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden">
      <div class="p-5 border-b border-gray-200 bg-gray-50/30">
        <div class="flex flex-col gap-4">
          <!-- Search -->
          <div class="relative w-full lg:max-w-md">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              v-model="searchQuery"
              type="search"
              class="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-500 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
              placeholder="Cari kode booking atau nama client..."
            />
          </div>

          <!-- Filters Row -->
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <!-- Payment Status Filter -->
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-xs font-semibold text-gray-600 mr-1">Status Pembayaran:</span>
              <button
                @click="paymentFilter = ''"
                :class="[
                  'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                  paymentFilter === ''
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                ]"
              >
                Semua
              </button>
              <button
                @click="paymentFilter = 'PAID'"
                :class="[
                  'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                  paymentFilter === 'PAID'
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                ]"
              >
                Lunas
              </button>
              <button
                @click="paymentFilter = 'UNPAID'"
                :class="[
                  'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                  paymentFilter === 'UNPAID'
                    ? 'bg-orange-600 text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                ]"
              >
                Belum Bayar
              </button>
            </div>

            <!-- Sort Filter -->
            <div class="flex items-center gap-2">
              <span class="text-xs font-semibold text-gray-600 mr-1">Urutkan:</span>
              <button
                @click="sortOrder = 'desc'"
                :class="[
                  'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1',
                  sortOrder === 'desc'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                ]"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
                Terbaru
              </button>
              <button
                @click="sortOrder = 'asc'"
                :class="[
                  'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1',
                  sortOrder === 'asc'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                ]"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                </svg>
                Terlama
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-if="error" class="p-8 text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-red-50 rounded-full mb-4">
          <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-sm font-semibold text-gray-900 mb-1">Gagal memuat data booking</p>
        <button @click="refresh()" class="mt-3 text-sm font-semibold text-blue-600 hover:text-blue-700 underline">
          Coba lagi
        </button>
      </div>

      <!-- Loading State -->
      <div v-else-if="pending" class="p-8">
        <div class="animate-pulse space-y-4">
          <div v-for="i in 5" :key="i" class="h-16 bg-gray-100 rounded-lg"></div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="bookings.length === 0" class="p-12 text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 class="text-base font-bold text-gray-900 mb-1">Tidak ada data booking</h3>
        <p class="text-sm text-gray-500">
          {{ searchQuery ? 'Tidak ditemukan booking dengan kata kunci tersebut.' : 'Belum ada riwayat booking.' }}
        </p>
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-48">
                Info Booking
              </th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Client
              </th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Total Harga
              </th>
              <th class="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider w-32">
                Status
              </th>
              <th class="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider w-32">
                Pembayaran
              </th>
              <th class="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider w-24">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr 
              v-for="booking in bookings" 
              :key="booking.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <!-- Info Booking Column -->
              <td class="px-6 py-4">
                <div class="flex flex-col gap-1">
                  <span class="text-sm font-bold text-blue-600">{{ booking.bookingCode }}</span>
                  <div class="flex items-center gap-1.5 text-xs text-gray-500">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {{ formatDate(booking.createdAt) }}
                  </div>
                  <div class="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mt-0.5">
                    <svg class="w-3 h-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {{ formatSlotDate(booking) }}
                  </div>
                </div>
              </td>
              
              <!-- Client Column -->
              <td class="px-6 py-4">
                <div class="flex flex-col gap-1">
                  <span class="text-sm font-semibold text-gray-900">{{ booking.name }}</span>
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="text-xs text-gray-600">{{ booking.contact }}</span>
                    <span v-if="booking.isAcademic" class="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 border border-blue-200 rounded-md text-[10px] font-bold text-blue-700">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      Akademik
                    </span>
                  </div>
                  <span class="text-xs text-gray-500">{{ booking.email }}</span>
                </div>
              </td>
              
              <!-- Total Harga Column -->
              <td class="px-6 py-4">
                <div class="flex flex-col gap-0.5">
                  <span class="text-sm font-bold text-gray-900">{{ formatCurrency(booking.totalPrice) }}</span>
                  <span class="text-xs text-gray-500">{{ booking.details.length }} slot booking</span>
                </div>
              </td>
              
              <!-- Status Column -->
              <td class="px-6 py-4 text-center">
                <span 
                  :class="[
                    'inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold border shadow-sm',
                    getStatusClasses(booking.status)
                  ]"
                >
                  {{ getStatusText(booking.status) }}
                </span>
              </td>
              
              <!-- Payment Status Column -->
              <td class="px-6 py-4 text-center">
                <span 
                  :class="[
                    'inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold border shadow-sm',
                    getPaymentStatusClasses(booking.paymentStatus)
                  ]"
                >
                  {{ getPaymentText(booking.paymentStatus) }}
                </span>
              </td>
              
              <!-- Action Column -->
              <td class="px-6 py-4 text-center">
                <button
                  @click="navigateToDetail(booking.bookingCode)"
                  class="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-all shadow-sm hover:shadow-md active:scale-95"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Detail
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <nav
        v-if="!pending && pagination.totalPages > 1"
        class="flex flex-col-reverse items-center justify-between gap-4 bg-gray-50/30 px-6 py-4 border-t border-gray-200 sm:flex-row"
      >
        <span class="text-xs text-gray-500 font-medium">
          {{ paginationSummary }}
        </span>

        <div class="flex items-center gap-2">
          <button
            @click="prevPage"
            :disabled="!pagination.hasPrevPage"
            class="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div class="px-4 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 shadow-sm">
            {{ pagination.page }} / {{ pagination.totalPages }}
          </div>

          <button
            @click="nextPage"
            :disabled="!pagination.hasNextPage"
            class="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </nav>
    </div>

  </section>
</template>
