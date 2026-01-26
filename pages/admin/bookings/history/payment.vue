<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import dayjs from 'dayjs'
import 'dayjs/locale/id'

definePageMeta({
  middleware: 'auth-admin',
  layout: 'admin'
})

const { options } = useAppOptions()
const appName = computed(() => options.value.data?.name || 'VENUE UNDIP')

useHead({
  title: 'Laporan Pembayaran - VENUE UNDIP',
  meta: [
    { name: 'description', content: 'Laporan pembayaran dan pendapatan sewa lapangan di VENUE UNDIP' }
  ]
})

dayjs.locale('id')

interface BookingDetail {
  fieldId: number
  bookingDate: string
  startHour: number
  subtotal: number
  Field?: {
    id: number
    name: string
    stadionId: number
    Stadion?: {
      id: number
      name: string
    }
  }
}

interface BookingHistory {
  id: number
  bookingCode: string
  name: string
  contact: string
  email: string
  renterType: 'UMUM' | 'TENDIK' | 'AKADEMIK'
  totalPrice: number
  status: /* 'PENDING' | */ 'APPROVED' | 'CANCELLED' // PENDING temporarily disabled
  paymentStatus: 'UNPAID' | 'PAID'
  createdAt: string
  details: BookingDetail[]
}

interface Stadion {
  id: number
  name: string
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
  totalRevenue: number
  totalCount: number
  paidCount: number
  unpaidCount: number
  umumCount: number
  tendikCount: number
  academicCount: number
  nonAcademicCount: number
  academicRevenue: number
  nonAcademicRevenue: number
  paidPercentage: number
  averagePerBooking: number
}

interface BookingResponse {
  data: BookingHistory[]
  pagination: PaginationInfo
  summary: BookingSummary
}

const filterMode = ref<'daily' | 'range'>('daily')
const selectedDate = ref(dayjs().format('YYYY-MM-DD'))
const startDate = ref(dayjs().subtract(30, 'day').format('YYYY-MM-DD'))
const endDate = ref(dayjs().format('YYYY-MM-DD'))
const printTimestamp = ref('')

const selectedStadionId = ref<string>('')

const renterTypeFilter = ref<'' | 'UMUM' | 'TENDIK' | 'AKADEMIK'>('')

const bookingStatusFilter = ref<'' | 'APPROVED' | 'CANCELLED'>('')

const paymentStatusFilter = ref<'' | 'PAID' | 'UNPAID'>('')

const currentPage = ref(1)
const itemsPerPage = ref(10)

// Auto-refresh state
const autoRefreshInterval = ref<ReturnType<typeof setInterval> | null>(null)
const lastRefreshTime = ref<string>('')
const isRefreshing = ref(false)

const updateLastRefreshTime = () => {
  const now = new Date()
  lastRefreshTime.value = now.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const handleManualRefresh = async () => {
  if (isRefreshing.value) return
  isRefreshing.value = true
  try {
    await refresh()
    updateLastRefreshTime()
  } finally {
    isRefreshing.value = false
  }
}

onMounted(() => {
  updateLastRefreshTime()
  autoRefreshInterval.value = setInterval(async () => {
    await refresh()
    updateLastRefreshTime()
  }, 60000) // 60 seconds = 1 minute
})

onUnmounted(() => {
  if (autoRefreshInterval.value) {
    clearInterval(autoRefreshInterval.value)
  }
})

const queryParams = computed(() => {
  const params: any = {
    page: currentPage.value,
    limit: itemsPerPage.value,
    sortOrder: 'desc',
  }


  if (filterMode.value === 'daily') {
    params.startDate = selectedDate.value
    params.endDate = selectedDate.value
  } else {
    params.startDate = startDate.value
    params.endDate = endDate.value
  }

  if (selectedStadionId.value) {
    params.stadionId = selectedStadionId.value
  }

  if (paymentStatusFilter.value) {
    params.paymentStatus = paymentStatusFilter.value
  }

  if (renterTypeFilter.value) {
    params.renterType = renterTypeFilter.value
  }

  if (bookingStatusFilter.value) {
    params.status = bookingStatusFilter.value
  }

  return params
})

const defaultSummary: BookingSummary = {
  totalRevenue: 0,
  totalCount: 0,
  paidCount: 0,
  unpaidCount: 0,
  umumCount: 0,
  tendikCount: 0,
  academicCount: 0,
  nonAcademicCount: 0,
  academicRevenue: 0,
  nonAcademicRevenue: 0,
  paidPercentage: 0,
  averagePerBooking: 0
}

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

const { data: stadionsData } = await useFetch('/api/stadions', {
  server: false,
  lazy: true,
  default: () => []
})

const stadions = computed(() => (stadionsData.value as any) || [])

const bookings = computed(() => response.value?.data || [])
const pagination = computed(() => response.value?.pagination || { page: 1, limit: 10, total: 0, totalPages: 0, hasNextPage: false, hasPrevPage: false })

const serverSummary = computed(() => response.value?.summary || defaultSummary)

const debouncedRefresh = useDebounceFn(() => {
  currentPage.value = 1
  refresh()
}, 300)

watch([filterMode, selectedDate, startDate, endDate, selectedStadionId, paymentStatusFilter, renterTypeFilter, bookingStatusFilter], () => {
  debouncedRefresh()
})

const setDateRange = (days: number) => {
  if (days === 0) {
    startDate.value = dayjs().startOf('month').format('YYYY-MM-DD')
    endDate.value = dayjs().endOf('month').format('YYYY-MM-DD')
  } else {
    startDate.value = dayjs().subtract(days - 1, 'day').format('YYYY-MM-DD')
    endDate.value = dayjs().format('YYYY-MM-DD')
  }
}

const isRangeActive = (days: number) => {
  if (days === 0) {
    return startDate.value === dayjs().startOf('month').format('YYYY-MM-DD') &&
           endDate.value === dayjs().endOf('month').format('YYYY-MM-DD')
  }
  return startDate.value === dayjs().subtract(days - 1, 'day').format('YYYY-MM-DD') &&
         endDate.value === dayjs().format('YYYY-MM-DD')
}

const formattedDateRange = computed(() => {
  if (filterMode.value === 'daily') {
    return dayjs(selectedDate.value).format('dddd, DD MMMM YYYY')
  }
  return `${dayjs(startDate.value).format('DD MMM YYYY')} - ${dayjs(endDate.value).format('DD MMM YYYY')}`
})

const selectedDayName = computed(() => {
  return dayjs(selectedDate.value).format('dddd')
})

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

const paginationSummary = computed(() => {
  const p = pagination.value
  if (p.total === 0) return 'Tidak ada data'
  const start = (p.page - 1) * p.limit + 1
  const end = Math.min(p.page * p.limit, p.total)
  return `Menampilkan ${start}-${end} dari ${p.total} data`
})

// Payment Summary - Menggunakan data dari SERVER (AKURAT untuk semua data sesuai filter)
// PENTING: Ini menampilkan total dari SEMUA data yang sesuai filter, bukan hanya halaman ini
const paymentSummary = computed(() => {
  const summary = serverSummary.value
  
  return {
    totalRevenue: summary.totalRevenue,
    totalBookings: summary.totalCount,
    paidBookings: summary.paidCount,
    unpaidBookings: summary.unpaidCount,
    umumBookings: summary.umumCount || 0,
    tendikBookings: summary.tendikCount || 0,
    academicBookings: summary.academicCount,
    nonAcademicBookings: summary.nonAcademicCount,
    academicRevenue: summary.academicRevenue,
    nonAcademicRevenue: summary.nonAcademicRevenue,
    avgPerBooking: summary.averagePerBooking,
    paidPercentage: summary.paidPercentage
  }
})

// Print handler
const handlePrint = () => {
  printTimestamp.value = dayjs().format('DD MMMM YYYY, HH:mm') + ' WIB'
  setTimeout(() => window.print(), 100)
}

// Helper functions
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', { 
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta'
  })
}

const formatSlotDate = (booking: BookingHistory) => {
  if (!booking.details || booking.details.length === 0) return '-'
  
  // Get all unique dates from booking details sorted
  const uniqueDates = [...new Set(booking.details.map(d => d.bookingDate))].sort()
  
  if (uniqueDates.length === 0) return '-'
  if (uniqueDates.length === 1) {
    const date = new Date(uniqueDates[0]!)
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Jakarta' })
  }
  
  // Check if dates are consecutive
  const isConsecutive = (dates: string[]) => {
    for (let i = 1; i < dates.length; i++) {
      const prev = new Date(dates[i - 1]!)
      const curr = new Date(dates[i]!)
      const diffDays = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)
      if (diffDays !== 1) return false
    }
    return true
  }
  
  const formatDateItem = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Jakarta' })
  }
  
  // If all dates are consecutive, show range with '-'
  if (isConsecutive(uniqueDates)) {
    return `${formatDateItem(uniqueDates[0]!)} - ${formatDateItem(uniqueDates[uniqueDates.length - 1]!)}`
  }
  
  // Non-consecutive: group consecutive ranges
  const groups: string[][] = []
  let currentGroup: string[] = [uniqueDates[0]!]
  
  for (let i = 1; i < uniqueDates.length; i++) {
    const prev = new Date(uniqueDates[i - 1]!)
    const curr = new Date(uniqueDates[i]!)
    const diffDays = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)
    
    if (diffDays === 1) {
      currentGroup.push(uniqueDates[i]!)
    } else {
      groups.push([...currentGroup])
      currentGroup = [uniqueDates[i]!]
    }
  }
  groups.push(currentGroup)
  
  // Format groups
  const formattedGroups = groups.map(group => {
    if (group.length === 1) {
      return formatDateItem(group[0]!)
    } else {
      return `${formatDateItem(group[0]!)} - ${formatDateItem(group[group.length - 1]!)}`
    }
  })
  
  return formattedGroups.join(', ')
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount)
}

const getFieldName = (booking: BookingHistory) => {
  if (!booking.details || booking.details.length === 0) return '-'
  const fieldNames = [...new Set(booking.details.map(d => d.Field?.name || '-').filter(name => name !== '-'))]
  if (fieldNames.length === 0) return '-'
  if (fieldNames.length === 1) return fieldNames[0]
  return `${fieldNames[0]} (+${fieldNames.length - 1})`
}

// Reactive stadium name mapping
const stadiumNameMap = computed(() => {
  const map = new Map<number, string>()
  if (stadions.value && stadions.value.length > 0) {
    stadions.value.forEach((s: Stadion) => {
      map.set(Number(s.id), s.name)
    })
  }
  return map
})

// Reactive stadium name getter
const getStadiumName = (booking: BookingHistory) => {
  if (!booking.details || booking.details.length === 0) return '-'

  const stadiumNames = [...new Set(booking.details
    .map(d => {
      if (d.Field?.stadionId) {
        const mappedName = stadiumNameMap.value.get(Number(d.Field.stadionId))
        if (mappedName) {
          return mappedName
        }
      }
      if (d.Field?.Stadion?.name) {
        return d.Field.Stadion.name
      }
      return null
    })
    .filter(name => name !== null && name !== '-' && name !== undefined)
  )]

  if (stadiumNames.length === 0) return '-'
  if (stadiumNames.length === 1) return stadiumNames[0]
  return `${stadiumNames[0]} (+${stadiumNames.length - 1})`
}

const getPaymentStatusClasses = (status: string) => {
  return status === 'PAID'
    ? 'bg-green-50 text-green-700 border-green-200'
    : 'bg-orange-50 text-orange-700 border-orange-200'
}

const getStatusClasses = (status: string) => {
  const classes = {
    // 'PENDING': 'bg-yellow-50 text-yellow-700 border-yellow-200', // Temporarily disabled
    'APPROVED': 'bg-green-50 text-green-700 border-green-200',
    'CANCELLED': 'bg-red-50 text-red-700 border-red-200'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-50 text-gray-700 border-gray-200'
}

const getStatusText = (status: string) => {
  const texts = {
    'APPROVED': 'Disetujui',
    'CANCELLED': 'Dibatalkan'
  }
  return texts[status as keyof typeof texts] || status
}

const getPaymentText = (status: string) => {
  return status === 'PAID' ? 'Lunas' : 'Belum Bayar'
}

// Print Handling - Fetch ALL data before printing
const isPrinting = ref(false)
const originalItemsPerPage = ref(10)

const printAllData = async () => {
  if (isPrinting.value) return
  isPrinting.value = true
  
  // Set timestamp
  printTimestamp.value = dayjs().format('DD MMMM YYYY, HH:mm WIB')
  
  // Save current pagination state
  originalItemsPerPage.value = itemsPerPage.value
  
  // Set limit to total records to fetch EVERYTHING
  // If total is 0, use a safe default like 1000
  const totalRecords = pagination.value.total > 0 ? pagination.value.total : 1000
  itemsPerPage.value = totalRecords
  
  try {
    // Wait for data to refresh with new limit
    await refresh()
    
    // Small delay to ensure DOM is updated
    setTimeout(() => {
      window.print()
      
      // Restore pagination after print dialog is closed (approximation)
      // Browsers block JS during print dialog, so this runs after
      itemsPerPage.value = originalItemsPerPage.value
      isPrinting.value = false
      refresh() 
    }, 500)
  } catch (e) {
    console.error('Error preparing print:', e)
    itemsPerPage.value = originalItemsPerPage.value
    isPrinting.value = false
  }
}
</script>

<template>
  <section class="flex w-full flex-col gap-6 sm:gap-8 pb-16 print:pb-8 max-w-7xl mx-auto">
    
    <!-- PRINT HEADER -->
    <div class="hidden print:block pb-4 border-b-2 border-gray-900">
      <div class="flex items-start gap-4">
        <div class="w-16 h-16 flex items-center justify-center shrink-0">
          <img src="~/assets/images/VENUE-UNDIP-LOGO.png" alt="VENUE UNDIP Logo" class="w-full h-full object-contain logo-print-color" />
        </div>
        
        <div class="flex-1">
          <h1 class="text-xl font-bold text-gray-900 uppercase tracking-tight leading-tight">Laporan Pembayaran Booking</h1>
          <h2 class="text-base font-semibold text-gray-700 mt-0.5">{{ options.data?.unitName || 'UPT Layanan Seni, Budaya dan Olahraga' }}</h2>
          <p class="text-[10px] text-gray-600 mt-1 leading-tight">{{ options.data?.address || 'Jl. Prof. Soedarto, Tembalang, Kec. Tembalang, Kota Semarang, Jawa Tengah' }}</p>
        </div>

        <div class="text-right shrink-0">
          <div class="mb-2">
            <p class="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Periode Data</p>
            <p class="text-xs font-bold text-gray-900">{{ formattedDateRange }}</p>
          </div>
          <div>
            <p class="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Dicetak Pada</p>
            <p class="text-[10px] font-medium text-gray-700">{{ printTimestamp }}</p>
          </div>
        </div>
      </div>
    </div>
    
    <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-6 print:hidden">
      <div class="flex items-start gap-4">
        <div class="p-3 bg-emerald-50 rounded-xl border border-emerald-100 shrink-0 hidden sm:flex items-center justify-center">
          <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <h1 class="text-2xl uppercase font-bold text-gray-900 tracking-tight">Laporan Pembayaran</h1>
          <p class="text-sm text-gray-500 mt-1">
            Analisis pendapatan dan laporan pembayaran booking lapangan.
          </p>
          <!-- Auto Refresh Info -->
          <div class="flex items-center gap-3 mt-2">
            <button
              @click="handleManualRefresh"
              :disabled="isRefreshing"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-all active:scale-95 disabled:opacity-50"
              title="Refresh data"
            >
              <svg 
                :class="['h-3.5 w-3.5', isRefreshing ? 'animate-spin' : '']"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </button>
            <span v-if="lastRefreshTime" class="text-xs text-gray-400">
              <span class="hidden sm:inline">Update terakhir:</span> {{ lastRefreshTime }}
            </span>
            <span class="text-xs text-gray-400 hidden sm:inline">• Auto-refresh: 1 menit</span>
          </div>
        </div>
      </div>
      
      <div class="flex items-center gap-2">
        <NuxtLink 
          to="/admin/bookings/history" 
          class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:text-[#1f2a56] hover:border-[#1f2a56] hover:shadow-md active:scale-95"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span>Kembali</span>
        </NuxtLink>
        <button
          @click="printAllData"
          class="inline-flex items-center gap-2 rounded-lg border border-gray-800 bg-gray-800 px-4 py-2 text-sm font-bold text-white shadow-sm transition-all hover:bg-gray-900 active:scale-95"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          <span>Cetak Laporan</span>
        </button>
      </div>
    </header>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
      <div class="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-6 text-white shadow-lg min-h-[120px] flex flex-col">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-bold uppercase tracking-wide opacity-90">Total Pendapatan</span>
          <svg class="w-8 h-8 opacity-20 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd"/>
          </svg>
        </div>
        <p class="text-3xl font-black flex-grow break-words overflow-hidden">{{ formatCurrency(paymentSummary.totalRevenue) }}</p>
        <p class="text-xs opacity-90 mt-2">{{ paymentSummary.paidBookings }} transaksi lunas</p>
      </div>
      
      <!-- Rata-rata per Booking -->
      <div class="bg-white border-2 border-blue-200 rounded-xl p-6 shadow-sm min-h-[120px] flex flex-col">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-bold uppercase tracking-wide text-gray-600">Rata-rata / Booking</span>
          <svg class="w-8 h-8 text-blue-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
          </svg>
        </div>
        <p class="text-3xl font-black text-gray-900 flex-grow break-words overflow-hidden">{{ formatCurrency(paymentSummary.avgPerBooking) }}</p>
        <p class="text-xs text-gray-500 mt-2">Per transaksi lunas</p>
      </div>
      
      <!-- Persentase Lunas -->
      <div class="bg-white border-2 border-green-200 rounded-xl p-6 shadow-sm min-h-[120px] flex flex-col">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-bold uppercase tracking-wide text-gray-600">Tingkat Lunas</span>
          <svg class="w-8 h-8 text-green-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
        </div>
        <p class="text-3xl font-black text-green-600 flex-grow">{{ Math.round(paymentSummary.paidPercentage) }}%</p>
        <p class="text-xs text-gray-500 mt-2">{{ paymentSummary.paidBookings }}/{{ paymentSummary.totalBookings }} booking</p>
      </div>
      
      <!-- Breakdown Tipe Penyewa -->
      <div class="bg-white border-2 border-purple-200 rounded-xl p-6 shadow-sm min-h-[120px] flex flex-col">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-bold uppercase tracking-wide text-gray-600">Tipe Penyewa</span>
          <svg class="w-8 h-8 text-purple-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
          </svg>
        </div>
        <div class="space-y-1 flex-grow overflow-y-auto">
          <div class="flex justify-between text-sm">
            <span class="text-gray-600 font-medium">Umum:</span>
            <span class="font-bold text-gray-900">{{ paymentSummary.umumBookings }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600 font-medium">Tendik:</span>
            <span class="font-bold text-purple-600">{{ paymentSummary.tendikBookings }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600 font-medium">Akademik:</span>
            <span class="font-bold text-blue-600">{{ paymentSummary.academicBookings }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- PRINT SUMMARY -->
    <div class="hidden print:block">
      <!-- Summary Cards -->
      <div class="grid grid-cols-4 gap-4 mb-2">
        <div class="bg-transparent p-3 rounded border border-gray-900">
          <p class="text-[9px] font-bold text-black uppercase mb-1">Total Pendapatan</p>
          <p class="text-base font-black text-black">{{ formatCurrency(paymentSummary.totalRevenue) }}</p>
          <p class="text-[8px] text-gray-700">{{ paymentSummary.paidBookings }} transaksi lunas</p>
        </div>
        <div class="bg-transparent p-3 rounded border border-gray-900">
          <p class="text-[9px] font-bold text-black uppercase mb-1">Rata-rata / Booking</p>
          <p class="text-base font-black text-black">{{ formatCurrency(paymentSummary.avgPerBooking) }}</p>
          <p class="text-[8px] text-gray-700">Per transaksi lunas</p>
        </div>
        <div class="bg-transparent p-3 rounded border border-gray-900">
          <p class="text-[9px] font-bold text-black uppercase mb-1">Lunas / Belum Bayar</p>
          <p class="text-base font-black text-black">{{ paymentSummary.paidBookings }} / {{ paymentSummary.unpaidBookings }}</p>
          <p class="text-[8px] text-gray-700">{{ Math.round(paymentSummary.paidPercentage) }}% tingkat lunas</p>
        </div>
        <div class="bg-transparent p-3 rounded border border-gray-900">
          <p class="text-[9px] font-bold text-black uppercase mb-1">Tipe Penyewa</p>
          <div class="flex justify-between text-[9px]">
            <span>Umum:</span>
            <span class="font-bold">{{ paymentSummary.umumBookings }}</span>
          </div>
          <div class="flex justify-between text-[9px]">
            <span>Tendik:</span>
            <span class="font-bold">{{ paymentSummary.tendikBookings }}</span>
          </div>
          <div class="flex justify-between text-[9px]">
            <span>Akademik:</span>
            <span class="font-bold">{{ paymentSummary.academicBookings }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- FILTERS SECTION -->
    <div class="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden print:hidden">
      <div class="p-5 border-b border-gray-200 bg-gray-50/30">
        <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Filter Laporan</h3>
        
        <div class="space-y-4">
          <!-- Mode Selection -->
          <div>
            <label class="block text-xs font-semibold text-gray-600 mb-2">Mode Laporan</label>
            <div class="flex gap-2">
              <button
                @click="filterMode = 'daily'"
                :class="['flex-1 px-4 py-2.5 rounded-xl text-sm font-bold transition-all', filterMode === 'daily' ? 'bg-blue-600 text-white shadow-md' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50']"
              >
                Harian
              </button>
              <button
                @click="filterMode = 'range'"
                :class="['flex-1 px-4 py-2.5 rounded-xl text-sm font-bold transition-all', filterMode === 'range' ? 'bg-blue-600 text-white shadow-md' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50']"
              >
                Rentang Tanggal
              </button>
            </div>
          </div>

          <div v-if="filterMode === 'daily'">
            <label class="block text-xs font-semibold text-gray-600 mb-2">Tanggal Booking Dibuat</label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input 
                type="date" 
                v-model="selectedDate"
                class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 p-3 font-medium cursor-pointer shadow-sm"
              >
              <!-- Day Name Info -->
              <div class="hidden sm:flex items-center gap-2 w-full text-sm font-medium text-gray-600 bg-gray-50 px-4 py-3 rounded-xl border border-gray-300 border-dashed">
                <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span class="font-semibold">{{ selectedDayName }}</span>
                <span class="text-gray-400">•</span>
                <span>{{ dayjs(selectedDate).format('DD/MM/YYYY') }}</span>
              </div>
            </div>
          </div>

          <!-- Range Mode -->
          <div v-if="filterMode === 'range'" class="space-y-3">
            <div>
              <label class="block text-xs font-semibold text-gray-600 mb-2">Periode Tanggal Booking Dibuat</label>
              <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div class="flex items-center gap-2 flex-1 w-full">
                  <input 
                    type="date" 
                    v-model="startDate"
                    class="flex-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 p-2.5 shadow-sm"
                  >
                  <span class="text-gray-400">—</span>
                  <input 
                    type="date" 
                    v-model="endDate"
                    class="flex-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 p-2.5 shadow-sm"
                  >
                </div>
                
                <div class="flex gap-2">
                  <button 
                    @click="setDateRange(7)"
                    :class="['px-3 py-2 rounded-lg text-xs font-bold transition-all', isRangeActive(7) ? 'bg-blue-600 text-white shadow-md' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50']"
                  >
                    7 Hari
                  </button>
                  <button 
                    @click="setDateRange(30)"
                    :class="['px-3 py-2 rounded-lg text-xs font-bold transition-all', isRangeActive(30) ? 'bg-blue-600 text-white shadow-md' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50']"
                  >
                    30 Hari
                  </button>
                  <button 
                    @click="setDateRange(0)"
                    :class="['px-3 py-2 rounded-lg text-xs font-bold transition-all', isRangeActive(0) ? 'bg-blue-600 text-white shadow-md' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50']"
                  >
                    Bulan Ini
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Stadium Filter -->
            <div>
              <label class="block text-xs font-semibold text-gray-600 mb-2">Stadion</label>
              <div class="relative">
                <select 
                  v-model="selectedStadionId"
                  class="appearance-none w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 p-3 pr-10 transition-colors hover:bg-gray-100/50 cursor-pointer font-medium shadow-sm"
                >
                  <option value="">Semua Stadion</option>
                  <option v-for="stadion in stadions" :key="stadion.id" :value="stadion.id">
                    {{ stadion.name }}
                  </option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Renter Type Filter -->
            <div>
              <label class="block text-xs font-semibold text-gray-600 mb-2">Tipe Penyewa</label>
              <div class="relative">
                <select 
                  v-model="renterTypeFilter"
                  class="appearance-none w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 p-3 pr-10 transition-colors hover:bg-gray-100/50 cursor-pointer font-medium shadow-sm"
                >
                  <option value="">Semua Tipe</option>
                  <option value="UMUM">Umum</option>
                  <option value="TENDIK">Tendik</option>
                  <option value="AKADEMIK">Akademik</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Booking Status Filter -->
            <div>
              <label class="block text-xs font-semibold text-gray-600 mb-2">Status Booking</label>
              <div class="relative">
                <select 
                  v-model="bookingStatusFilter"
                  class="appearance-none w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 p-3 pr-10 transition-colors hover:bg-gray-100/50 cursor-pointer font-medium shadow-sm"
                >
                  <option value="">Semua Status</option>
                  <option value="APPROVED">Disetujui</option>
                  <option value="CANCELLED">Dibatalkan</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Payment Status Filter -->
            <div>
              <label class="block text-xs font-semibold text-gray-600 mb-2">Status Pembayaran</label>
              <div class="relative">
                <select 
                  v-model="paymentStatusFilter"
                  class="appearance-none w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 p-3 pr-10 transition-colors hover:bg-gray-100/50 cursor-pointer font-medium shadow-sm"
                >
                  <option value="">Semua Status</option>
                  <option value="PAID">Lunas</option>
                  <option value="UNPAID">Belum Bayar</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- PRINT-ONLY TABLE (Strict Dashboard Design) -->
    <div class="hidden print:block mb-6">
      <table class="w-full border-collapse border border-gray-900 text-[9px]">
        <thead>
          <!-- Header with light gray bg like dashboard context -->
          <tr class="bg-gray-100"> 
            <th class="border border-gray-900 px-2 py-1.5 text-center font-bold text-gray-900 uppercase tracking-wide" style="width: 5%;">No</th>
            <th class="border border-gray-900 px-2 py-1.5 text-left font-bold text-gray-900 uppercase tracking-wide">Info Booking</th>
            <th class="border border-gray-900 px-2 py-1.5 text-center font-bold text-gray-900 uppercase tracking-wide">Client</th>
            <th class="border border-gray-900 px-2 py-1.5 text-center font-bold text-gray-900 uppercase tracking-wide">Stadion</th>
            <th class="border border-gray-900 px-2 py-1.5 text-center font-bold text-gray-900 uppercase tracking-wide">Total Harga</th>
            <th class="border border-gray-900 px-2 py-1.5 text-center font-bold text-gray-900 uppercase tracking-wide">Status</th>
            <th class="border border-gray-900 px-2 py-1.5 text-center font-bold text-gray-900 uppercase tracking-wide">Pembayaran</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(booking, index) in bookings" :key="'print-'+booking.id">
            <td class="border border-gray-900 px-2 py-1.5 text-center font-medium text-gray-900 align-middle">{{ index + 1 }}</td>
            <td class="border border-gray-900 px-2 py-1.5 text-gray-900 align-middle">
              <span class="block font-bold">{{ booking.bookingCode }}</span>
              <span class="block text-[8px]">{{ formatDate(booking.createdAt) }}</span>
              <span class="block text-[8px]">{{ formatSlotDate(booking) }}</span>
            </td>
            <td class="border border-gray-900 px-2 py-1.5 text-gray-900 align-middle">
               <span class="font-medium">{{ booking.name }}</span>
               <span v-if="booking.renterType === 'UMUM'" class="block text-[8px] italic">(Umum)</span>
               <span v-else-if="booking.renterType === 'TENDIK'" class="block text-[8px] italic">(Tendik)</span>
               <span v-else-if="booking.renterType === 'AKADEMIK'" class="block text-[8px] italic">(Akademik)</span>
            </td>
            <td class="border border-gray-900 px-2 py-1.5 text-gray-900 align-middle">{{ getStadiumName(booking) }}</td>
            <td class="border border-gray-900 px-2 py-1.5 text-right font-medium text-gray-900 align-middle">
              {{ formatCurrency(booking.totalPrice) }}
              <span class="block text-[8px] font-normal">{{ booking.details.length }} slot</span>
            </td>
            <td class="border border-gray-900 px-2 py-1.5 text-center font-medium text-gray-900 align-middle uppercase text-[8px]">
              {{ getStatusText(booking.status) }}
            </td>
            <td class="border border-gray-900 px-2 py-1.5 text-center font-medium text-gray-900 align-middle uppercase text-[8px]">
              {{ getPaymentText(booking.paymentStatus) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- DATA TABLE (Screen Only) -->
    <div class="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden print:hidden">
      <!-- Table Header -->
      <div class="p-5 border-b border-gray-200 bg-gray-50/30 print:hidden">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wider">Data Booking</h3>
          <div class="text-sm text-gray-600">
            <span class="font-bold text-blue-600">{{ pagination.total }}</span> transaksi
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="pending" class="p-12 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-blue-600"></div>
        <p class="mt-4 text-sm text-gray-500">Memuat data...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="p-12 text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
          <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-sm font-semibold text-gray-900">Gagal memuat data</p>
        <button class="mt-4 text-sm text-blue-600 hover:text-blue-700 font-semibold" @click="() => refresh()">
          Coba Lagi
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="bookings.length === 0" class="p-12 text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p class="text-sm font-semibold text-gray-900">Tidak ada data</p>
        <p class="text-xs text-gray-500 mt-1">Coba ubah filter untuk melihat data booking</p>
      </div>

      <!-- Table Content -->
      <div v-else class="overflow-x-auto">
        <table class="w-full border-collapse">
          <thead>
            <tr class="bg-gray-50 border-b-2 border-gray-200">
              <th class="px-5 py-3.5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Info Booking
              </th>
              <th class="px-5 py-3.5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Client
              </th>
              <th class="px-5 py-3.5 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                Stadion
              </th>
              <th class="px-5 py-3.5 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                Total Harga
              </th>
              <th class="px-5 py-3.5 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th class="px-5 py-3.5 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                Pembayaran
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-100">
            <tr 
              v-for="booking in bookings" 
              :key="booking.id"
              class="hover:bg-blue-50/30 transition-colors duration-150 print:hover:bg-transparent"
            >
              <!-- Info Booking Column -->
              <td class="px-5 py-4">
                <div class="flex flex-col gap-1.5">
                  <span class="text-sm font-bold text-blue-600 tracking-tight">{{ booking.bookingCode }}</span>
                  <div class="flex items-center gap-1.5 text-[11px] text-gray-500">
                    <svg class="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span class="font-medium">{{ formatDate(booking.createdAt) }}</span>
                  </div>
                  <div class="flex items-center gap-1.5 text-[11px] font-semibold text-gray-700">
                    <svg class="w-3 h-3 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{{ formatSlotDate(booking) }}</span>
                  </div>
                </div>
              </td>
              
              <!-- Client Column -->
              <td class="px-5 py-4">
                <div class="flex flex-col gap-1.5 max-w-xs">
                  <span class="text-sm font-bold text-gray-900 truncate">{{ booking.name }}</span>
                  <div class="flex items-center gap-2 flex-wrap">
                    <span v-if="booking.renterType === 'UMUM'" class="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 border border-gray-300 rounded-md text-[10px] font-bold text-gray-700">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Umum
                    </span>
                    <span v-else-if="booking.renterType === 'AKADEMIK'" class="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 border border-blue-200 rounded-md text-[10px] font-bold text-blue-700 print:bg-gray-100 print:text-gray-800 print:border-gray-400">
                      <svg class="w-3 h-3 print:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      Akademik
                    </span>
                    <span v-else-if="booking.renterType === 'TENDIK'" class="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-50 border border-purple-200 rounded-md text-[10px] font-bold text-purple-700 print:bg-gray-100 print:text-gray-800 print:border-gray-400">
                      <svg class="w-3 h-3 print:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Tendik
                    </span>
                  </div>
                </div>
              </td>

              <!-- Stadion Column -->
              <td class="px-5 py-4">
                <div class="flex justify-center">
                  <span class="text-sm font-semibold text-gray-700 bg-gray-50 px-3 py-1 rounded-md border border-gray-200">
                    {{ getStadiumName(booking) }}
                  </span>
                </div>
              </td>
              
              <!-- Total Harga Column -->
              <td class="px-5 py-4">
                <div class="flex flex-col gap-0.5 items-end">
                  <span class="text-sm font-bold text-gray-900 tabular-nums">{{ formatCurrency(booking.totalPrice) }}</span>
                  <span class="text-[10px] text-gray-500 font-medium">{{ booking.details.length }} slot</span>
                </div>
              </td>
              
              <!-- Status Column -->
              <td class="px-5 py-4">
                <div class="flex justify-center">
                  <span 
                    :class="[
                      'inline-flex items-center px-3 py-1.5 rounded-lg text-[11px] font-bold border whitespace-nowrap print:shadow-none print:border-none print:text-black print:bg-transparent print:p-0',
                      getStatusClasses(booking.status)
                    ]"
                  >
                    {{ getStatusText(booking.status) }}
                  </span>
                </div>
              </td>
              
              <!-- Payment Status Column -->
              <td class="px-5 py-4">
                <div class="flex justify-center">
                  <span 
                    :class="[
                      'inline-flex items-center px-3 py-1.5 rounded-lg text-[11px] font-bold border whitespace-nowrap print:shadow-none print:border-none print:text-black print:bg-transparent print:p-0',
                      getPaymentStatusClasses(booking.paymentStatus)
                    ]"
                  >
                    {{ getPaymentText(booking.paymentStatus) }}
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- PAGINATION -->
      <nav
        v-if="!pending && pagination.totalPages > 1"
        class="flex flex-col-reverse items-center justify-between gap-4 bg-gray-50/30 px-6 py-4 border-t border-gray-200 sm:flex-row print:hidden"
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
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>

          <div class="px-4 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 shadow-sm">
            {{ pagination.page }} / {{ pagination.totalPages }}
          </div>

          <button
            @click="nextPage"
            :disabled="!pagination.hasNextPage"
            class="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </nav>
    </div>

  </section>
</template>

<style scoped>
@media print {
  .logo-print-color,
  img[alt*="VENUE UNDIP Logo"],
  img[alt*="VENUE UNDIP"] {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    filter: none !important;
    -webkit-filter: none !important;
  }

  /* Professional Table Structure */
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 8pt;
    border: 1px solid #4b5563; /* Gray-600 */
    margin-bottom: 20px;
  }

  /* Table Header */
  thead {
    display: table-header-group;
    page-break-inside: avoid;
  }

  thead tr {
    background-color: transparent !important;
  }

  /* Match Dashboard Print Style: Black Borders, 9px Font */
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 9px;
    border: 1px solid #111827; /* Gray-900/Black */
    margin-bottom: 20px;
  }

  thead th {
    border: 1px solid #111827; /* Gray-900/Black */
    padding: 4px 6px; /* Compact padding like dashboard */
    font-weight: 800;
    text-transform: uppercase;
    color: #111827;
    text-align: center;
  }
  
  /* Specific alignments */
  thead th:nth-child(2)
  {
    text-align: left;
  }

  /* Table Body */
  tbody tr {
    page-break-inside: avoid;
    page-break-after: auto;
  }

  tbody tr:nth-child(even) {
    background-color: transparent !important;
  }

  tbody td {
    border: 1px solid #111827; /* Gray-900/Black */
    padding: 4px 6px; /* Compact padding */
    vertical-align: middle;
    color: #000;
  }

  /* Ensure content wrapping */
  th, td {
    word-wrap: break-word;
    overflow-wrap: break-word;
  }
}
</style>

<style>
@media print {
  @page {
    size: A4 portrait;
    margin: 1.5cm 1.5cm 1.5cm 1.5cm;
  }
  
  /* Page Footer with Numbering */
  @page {
    @bottom-center {
      content: "Halaman " counter(page) " dari " counter(pages);
      font-size: 8pt;
      color: #6b7280;
      font-family: ui-sans-serif, system-ui, sans-serif;
    }
  }

  nav, header, aside, footer, .sidebar, .top-bar, .layout-header, .navbar {
    display: none !important;
  }
  
  body, #__nuxt, #__layout {
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    background-color: white !important;
    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  }
}
</style>
