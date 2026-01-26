<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useFetch } from 'nuxt/app'
import { gql } from 'graphql-tag'
import { print } from 'graphql'
import dayjs from 'dayjs'
import 'dayjs/locale/id'
import { toUtcMidnightIso } from '~/utils/dateHelpers'

import { useDashboardLogic, type DashboardCardItem } from '~/composables/useDashboardLogic'
import { QUERY_GET_FIELDS } from '~/graphql/queries/get_fields'
import { QUERY_GET_BOOKINGS } from '~/graphql/queries/get_bookings'
import { QUERY_GET_STADIONS } from '~/graphql/queries/get_stadions'
import { OPERATING_HOURS } from '~/utils/constants'

definePageMeta({ middleware: 'auth-admin', layout: 'admin' })

const { options } = useAppOptions()
const appName = computed(() => options.value.data?.name || 'VENUE UNDIP')

useHead({
  title: 'Dashboard Admin - VENUE UNDIP',
  meta: [
    { name: 'description', content: 'Dashboard admin untuk mengelola venue dan booking lapangan olahraga VENUE UNDIP' }
  ]
})

dayjs.locale('id')

const getQueryString = (query: any) => typeof query === 'string' ? query : print(query)
const { calculateDailyStats, calculateRangeStats } = useDashboardLogic()

const filterMode = ref<'daily' | 'range'>('daily')
const singleDate = ref(dayjs().add(1, 'day').format('YYYY-MM-DD'))
const formattedSingleDate = computed(() => dayjs(singleDate.value).format('dddd, DD MMMM YYYY'))

const startDate = ref(dayjs().format('YYYY-MM-DD'))
const endDate = ref(dayjs().add(6, 'day').format('YYYY-MM-DD'))
const selectedStadionId = ref<string>('')
const searchQuery = ref('')

const printTimestamp = ref('')

// Auto-refresh state
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
    await refreshBookings()
    updateLastRefreshTime()
  } finally {
    isRefreshing.value = false
  }
}

const formattedRangeDate = computed(() => {
  return `${dayjs(startDate.value).format('DD MMM YYYY')} - ${dayjs(endDate.value).format('DD MMM YYYY')}`
})

const setRange = (days: number) => {
  const start = dayjs()
  startDate.value = start.format('YYYY-MM-DD')
  endDate.value = start.add(days - 1, 'day').format('YYYY-MM-DD')
}

const isRangeActive = (days: number) => {
  const targetStart = dayjs().format('YYYY-MM-DD')
  const targetEnd = dayjs().add(days - 1, 'day').format('YYYY-MM-DD')
  return startDate.value === targetStart && endDate.value === targetEnd
}

const resetFilters = () => {
  selectedStadionId.value = ''
  filterMode.value = 'daily'
  singleDate.value = dayjs().add(1, 'day').format('YYYY-MM-DD')
}

const handlePrint = () => {
  printTimestamp.value = dayjs().format('DD MMMM YYYY, HH:mm WIB')
  setTimeout(() => window.print(), 100)
}

const QUERY_OP_HOURS_INLINE = gql`query GetOpHours { operatingHours { openHour closeHour } }`
const { data: opHoursData } = await useFetch('/api/graphql', {
  method: 'POST',
  body: { query: getQueryString(QUERY_OP_HOURS_INLINE) }
})
const opHours = computed(() => (opHoursData.value as any)?.data?.operatingHours || { 
  openHour: OPERATING_HOURS.DEFAULT_OPEN, 
  closeHour: OPERATING_HOURS.DEFAULT_CLOSE 
})

const { data: fieldsData } = await useFetch('/api/graphql', {
  method: 'POST',
  body: computed(() => ({
    query: getQueryString(QUERY_GET_FIELDS),
    variables: { stadionId: null }
  }))
})
const allFields = computed<any[]>(() => (fieldsData.value as any)?.data?.fields || [])

const { data: stadionsData } = await useFetch('/api/graphql', {
  method: 'POST',
  body: { query: getQueryString(QUERY_GET_STADIONS) }
})
const stadionList = computed(() => (stadionsData.value as any)?.data?.stadions || [])

const bookingPayload = computed(() => {
  const vars: any = { stadionId: selectedStadionId.value || undefined }

  const toUTCMidnight = (dateStr: string) => toUtcMidnightIso(dateStr) || ''

  if (filterMode.value === 'daily') {
    vars.date = toUTCMidnight(singleDate.value)
  } else {
    vars.startDate = toUTCMidnight(startDate.value)
    vars.endDate = toUTCMidnight(endDate.value)
  }

  return {
    query: getQueryString(QUERY_GET_BOOKINGS),
    variables: vars
  }
})

const { data: bookingsResponse, pending: isLoading, refresh: refreshBookings } = await useFetch('/api/graphql', {
  method: 'POST',
  body: bookingPayload,
  watch: [singleDate, startDate, endDate, filterMode, selectedStadionId] 
})

// Auto-refresh interval reference
const autoRefreshInterval = ref<ReturnType<typeof setInterval> | null>(null)

onMounted(() => {
  updateLastRefreshTime()
  
  const handleVisibilityChange = () => {
    if (!document.hidden) {
      refreshBookings()
      updateLastRefreshTime()
    }
  }
  
  autoRefreshInterval.value = setInterval(async () => {
    if (!document.hidden) {
      await refreshBookings()
      updateLastRefreshTime()
    }
  }, 60000) // 60 seconds = 1 minute
  
  document.addEventListener('visibilitychange', handleVisibilityChange)
  
  onBeforeUnmount(() => {
    document.removeEventListener('visibilitychange', handleVisibilityChange)
    if (autoRefreshInterval.value) {
      clearInterval(autoRefreshInterval.value)
    }
  })
})

const rawBookings = computed<any[]>(() => (bookingsResponse.value as any)?.data?.bookings?.data || [])

const dashboardData = computed<DashboardCardItem[]>(() => {
  let fieldsToCheck = allFields.value

  if (selectedStadionId.value) {
    fieldsToCheck = fieldsToCheck.filter(f =>
      String(f.stadionId) === String(selectedStadionId.value) ||
      String(f.Stadion?.id) === String(selectedStadionId.value)
    )
  }

  return filterMode.value === 'daily'
    ? calculateDailyStats(fieldsToCheck, rawBookings.value, opHours.value, singleDate.value)
    : calculateRangeStats(fieldsToCheck, rawBookings.value, opHours.value, startDate.value, endDate.value)
})

// Filtered dashboard data based on search query
const filteredDashboardData = computed(() => {
  if (!searchQuery.value.trim()) return dashboardData.value
  
  const query = searchQuery.value.toLowerCase().trim()
  return dashboardData.value.filter(item => 
    item.name.toLowerCase().includes(query)
  )
})

const totalAvailable = computed(() => filteredDashboardData.value.reduce((acc, curr) => acc + curr.remaining, 0))
const totalBooked = computed(() => filteredDashboardData.value.reduce((acc, curr) => acc + curr.totalBooked, 0))
const totalCapacity = computed(() => filteredDashboardData.value.reduce((acc, curr) => acc + curr.totalCapacity, 0))

const switchMode = (mode: 'daily' | 'range') => {
  filterMode.value = mode
}
</script>

<template>
  <div class="w-full pb-16 print:p-0 print:pb-16 max-w-7xl mx-auto">
    
    <!-- HEADER PRINT -->
    <div class="hidden print:block mb-6 pb-4 border-b-2 border-gray-900">
      <div class="flex items-start gap-4">
        <div class="w-16 h-16 flex items-center justify-center shrink-0">
          <img src="~/assets/images/VENUE-UNDIP-LOGO.png" alt="{{ appName }} Logo" class="w-full h-full object-contain logo-print-color" />
        </div>
        
        <div class="flex-1">
          <h1 class="text-xl font-bold text-gray-900 uppercase tracking-tight leading-tight">Laporan Operasional Lapangan</h1>
          <h2 class="text-base font-semibold text-gray-700 mt-0.5">UPT Layanan Seni, Budaya dan Olahraga</h2>
          <p class="text-[10px] text-gray-600 mt-1 leading-tight">Jl. Prof. Soedarto, Tembalang, Kec. Tembalang, Kota Semarang, Jawa Tengah</p>
        </div>

        <div class="text-right shrink-0">
          <div class="mb-2">
            <p class="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Periode Data</p>
            <p class="text-xs font-bold text-gray-900">
              {{ filterMode === 'daily' ? formattedSingleDate : formattedRangeDate }}
            </p>
          </div>
          <div>
            <p class="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Dicetak Pada</p>
            <p class="text-[10px] font-medium text-gray-700">{{ printTimestamp }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 print:hidden">
      <div class="flex items-start gap-4">
        <div class="p-3 bg-blue-50 rounded-xl border border-blue-100 shrink-0 hidden sm:flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-800" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 11H11V5H5V11ZM5 19H11V13H5V19ZM13 19H19V13H13V19ZM13 5V11H19V5H13Z"/>
            </svg>
        </div>
        <div>
          <h1 class="text-2xl uppercase font-bold text-gray-900 tracking-tight">Dashboard Analisis</h1>
          <p class="text-sm text-gray-500 mt-1 leading-relaxed">
            Pantau ketersediaan lapangan secara real-time untuk efisiensi pengelolaan.
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

      <div class="bg-gray-100 p-1.5 rounded-xl flex w-full md:w-auto md:inline-flex border border-gray-200/50">
        <button 
          @click="switchMode('daily')" 
          class="flex-1 md:flex-none justify-center px-5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center gap-2" 
          :class="filterMode === 'daily' ? 'bg-white text-blue-700 shadow-sm ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700'"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          Harian
        </button>
        <button 
          @click="switchMode('range')" 
          class="flex-1 md:flex-none justify-center px-5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center gap-2" 
          :class="filterMode === 'range' ? 'bg-white text-blue-700 shadow-sm ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700'"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          Rentang
        </button>
      </div>
    </div>

    <div class="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm mb-8 flex flex-col lg:flex-row gap-5 items-end print:hidden">
      <div class="flex-1 w-full">
        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Lokasi Stadion</label>
        <div class="relative">
          <select v-model="selectedStadionId" class="appearance-none w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 p-3 pr-10 transition-colors hover:bg-gray-100/50 cursor-pointer font-medium">
            <option value="">Semua Stadion</option>
            <option v-for="s in stadionList" :key="s.id" :value="s.id">{{ s.name }}</option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>
      </div>

      <!-- Search Input -->
      <div class="flex-1 w-full">
        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Cari Lapangan</label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            v-model="searchQuery"
            type="search"
            class="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 transition-shadow font-medium"
            placeholder="Cari nama ..."
          />
        </div>
      </div>

      <div class="flex-[2] w-full">
        <div class="flex justify-between items-center mb-2">
          <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider">
            {{ filterMode === 'daily' ? 'Pilih Tanggal' : 'Pilih Periode Waktu' }}
          </label>
          <div v-if="filterMode === 'range'" class="flex gap-2">
            <button @click="setRange(7)" class="text-[10px] font-semibold px-2 py-1 rounded transition-colors" :class="isRangeActive(7) ? 'bg-blue-600 text-white shadow-sm' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'">7 Hari ke Depan</button>
            <button @click="setRange(30)" class="text-[10px] font-semibold px-2 py-1 rounded transition-colors" :class="isRangeActive(30) ? 'bg-blue-600 text-white shadow-sm' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'">1 Bulan ke Depan</button>
          </div>
        </div>
        <div v-if="filterMode === 'daily'" class="flex flex-col sm:flex-row items-center gap-3">
          <input type="date" v-model="singleDate" class="w-full sm:w-auto bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3 font-medium cursor-pointer">
          <div class="hidden sm:flex items-center gap-2 w-full text-sm font-medium text-gray-600 bg-gray-50 px-4 py-3 rounded-xl border border-gray-200 border-dashed">{{ formattedSingleDate }}</div>
        </div>
        <div v-else class="flex flex-col sm:flex-row items-center gap-3 w-full">
          <div class="relative w-full"><div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><span class="text-gray-400 text-xs font-bold uppercase">Dari</span></div><input type="date" v-model="startDate" class="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block pl-12 p-2.5 font-medium cursor-pointer shadow-sm"></div>
          <div class="text-gray-400 shrink-0"><svg class="w-4 h-4 transform rotate-90 sm:rotate-0 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg></div>
          <div class="relative w-full"><div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><span class="text-gray-400 text-xs font-bold uppercase">Smp</span></div><input type="date" v-model="endDate" class="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block pl-12 p-2.5 font-medium cursor-pointer shadow-sm"></div>
        </div>
      </div>

      <div class="flex gap-2 w-full lg:w-auto">
        <button @click="handlePrint()" class="flex-1 lg:flex-none px-4 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-900 font-semibold transition-all flex items-center justify-center gap-2 shadow-sm">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
          <span>Cetak</span>
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10 print:grid-cols-1 print:gap-3 print:mb-5 print:break-inside-avoid">
      <div class="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 rounded-2xl p-8 text-white shadow-2xl shadow-emerald-200/50 print:bg-white print:text-black print:border-2 print:border-gray-800 print:shadow-none print:rounded-lg print:p-4 print:w-80 print:mx-0">
        <div class="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl print:hidden"></div>
        <div class="absolute -left-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-xl print:hidden"></div>
        
        <div class="absolute right-4 top-4 opacity-10 print:hidden">
          <svg class="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
          </svg>
        </div>

        <div class="relative z-10">
          <!-- Label -->
          <div class="flex items-center gap-2 mb-3 print:mb-2">
            <div class="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-pulse print:hidden"></div>
            <p class="text-emerald-50 text-xs font-bold uppercase tracking-wider print:text-gray-800 print:text-[10px]">
              {{ filterMode === 'daily' ? `Sisa Kapasitas (${formattedSingleDate})` : `Sisa Kapasitas (${formattedRangeDate})`}}
            </p>
          </div>

          <!-- Main Number - Print shows different format -->
          <div class="flex items-end gap-3 mb-2 print:mb-1 print:flex-row print:items-baseline print:gap-2">
            <!-- Screen mode: Show available slots -->
            <h2 class="text-7xl font-black tracking-tighter leading-none print:hidden">
              {{ totalAvailable }}
            </h2>
            <!-- Print mode: Show booked/total -->
            <h2 class="hidden print:block print:text-2xl print:font-extrabold print:text-black">
              {{ totalBooked }}
            </h2>
            <span class="hidden print:inline print:text-xl print:font-bold print:text-gray-700">/</span>
            <h2 class="hidden print:block print:text-2xl print:font-extrabold print:text-black">
              {{ totalCapacity }}
            </h2>
            <div class="pb-2 print:pb-0 print:hidden">
              <span class="text-lg font-bold text-emerald-100 uppercase tracking-wide">Slot</span>
              <span class="block text-sm font-semibold text-emerald-200 -mt-1">Tersedia</span>
            </div>
          </div>

          <!-- Description -->
          <div class="flex items-center gap-2 mt-3 print:mt-1">
            <svg class="w-4 h-4 text-emerald-300 print:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p class="text-sm text-emerald-100 font-semibold print:text-gray-700 print:text-[10px] print:font-bold">
              <span class="print:hidden">Siap untuk booking</span>
              <span class="hidden print:inline">Slot Terbooking / Slot Tersedia</span>
            </p>
          </div>
        </div>
      </div>

      <div class="print:hidden relative overflow-hidden bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-100 to-red-100 opacity-50 rounded-bl-full print:hidden"></div>
        
        <div class="absolute right-4 top-4 opacity-5 print:hidden">
          <svg class="w-24 h-24 text-red-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>

        <div class="relative z-10">
          <!-- Label -->
          <div class="flex items-center gap-2 mb-3 print:mb-1">
            <div class="w-1.5 h-1.5 bg-red-500 rounded-full print:hidden"></div>
            <p class="text-gray-600 text-xs font-bold uppercase tracking-wider print:text-gray-700 print:text-[9px]">
              {{ filterMode === 'daily' ? `Terbooking (${formattedSingleDate})` : `Total Terbooking (${formattedRangeDate})`}}
            </p>
          </div>

          <!-- Main Number -->
          <div class="flex items-end gap-3 mb-2 print:mb-0.5">
            <h2 class="text-7xl font-black text-gray-900 tracking-tighter leading-none print:text-black print:text-3xl">
              {{ totalBooked }}
            </h2>
            <div class="pb-2 print:pb-0">
              <span class="text-lg font-bold text-gray-600 uppercase tracking-wide print:text-gray-700 print:text-xs">Slot</span>
              <span class="block text-sm font-semibold text-gray-500 -mt-1 print:text-gray-600 print:text-[8px] print:mt-0">Terisi</span>
            </div>
          </div>

          <!-- Progress Indicator -->
          <div class="flex items-center gap-2 mt-3 print:mt-0.5">
            <div class="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden print:hidden">
              <div 
                class="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-700"
                :style="{ width: totalCapacity > 0 ? `${Math.min((totalBooked / totalCapacity) * 100, 100)}%` : '0%' }"
              ></div>
            </div>
            <span class="text-sm font-bold text-gray-700 print:text-[9px]">
              {{ totalCapacity > 0 ? Math.round((totalBooked / totalCapacity) * 100) : 0 }}%
            </span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-pulse print:hidden">
      <div v-for="i in 3" :key="i" class="bg-white rounded-2xl h-64 border border-gray-200 p-5 flex flex-col justify-between">
         <div class="space-y-3"><div class="h-4 bg-gray-200 rounded w-3/4"></div><div class="h-10 bg-gray-200 rounded w-full"></div></div>
      </div>
    </div>

    <div v-else-if="filteredDashboardData.length === 0" class="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-dashed border-gray-300 print:border-gray-800 print:py-10 print:mx-6 print:border-2">
      <div class="p-4 bg-gray-50 rounded-full mb-4 print:hidden">
        <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
      </div>
      <h3 class="text-lg font-bold text-gray-900">{{ searchQuery ? 'Tidak ada hasil pencarian' : 'Tidak ada data lapangan' }}</h3>
      <p class="text-gray-500 mt-1 max-w-sm text-center">{{ searchQuery ? `Tidak ditemukan lapangan dengan kata kunci "${searchQuery}"` : 'Belum ada lapangan yang aktif atau sesuai dengan filter lokasi yang Anda pilih.' }}</p>
      
      <button @click="resetFilters(); searchQuery = ''" class="mt-6 px-5 py-2.5 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-xl transition-colors print:hidden flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
        Reset Filter Pencarian
      </button>
    </div>

    <div v-else class="print:hidden grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <div v-for="item in filteredDashboardData" :key="item.id" class="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all duration-300 overflow-hidden flex flex-col break-inside-avoid">
        
        <div class="p-5 border-b border-gray-100 bg-gray-50/50">
          <div class="flex justify-between items-start gap-4">
            <div class="min-w-0 flex-1">
              <h3 class="text-lg font-bold text-gray-900 line-clamp-2" :title="item.name">
                {{ item.name }}
              </h3>
              
              <div class="flex items-start gap-1.5 mt-2">
                <svg class="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p class="text-xs font-medium text-gray-500 uppercase tracking-wide break-words">
                  {{ item.stadionName }}
                </p>
              </div>
            </div>

            <span class="shrink-0 px-3 py-1 rounded-full text-[11px] font-bold border uppercase tracking-wide shadow-sm" :class="item.statusColor">
              {{ item.statusLabel }}
            </span>
          </div>
        </div>

        <div class="p-6 flex-1 flex flex-col justify-center">
          <div class="flex justify-between items-end mb-3">
            <div>
              <span class="text-xs font-bold uppercase text-gray-400 block mb-1">Sisa</span>
              <div class="flex items-baseline gap-1.5">
                <span class="text-4xl font-extrabold text-gray-900 tracking-tighter">{{ item.remaining }}</span>
                <span class="text-sm font-semibold text-gray-400">/ {{ item.totalCapacity }}</span>
              </div>
            </div>
            <div class="text-right">
              <span class="text-xs font-bold text-gray-400 block mb-1">Terisi</span>
              <span class="text-xl font-bold" :class="item.occupancyRate > 80 ? 'text-red-600' : 'text-blue-600'">
                {{ Math.round(item.occupancyRate) }}%
              </span>
            </div>
          </div>

          <div class="w-full bg-gray-100 rounded-full h-3 overflow-hidden shadow-inner">
            <div
              class="h-full rounded-full transition-all duration-700 ease-out relative"
              :class="item.occupancyRate > 80 ? 'bg-red-500' : (item.occupancyRate > 50 ? 'bg-amber-500' : 'bg-green-500')"
              :style="{ width: `${Math.max(item.occupancyRate, 5)}%` }"
            ></div>
          </div>
        </div>

        <div class="p-4 bg-gray-50 border-t border-gray-100 group-hover:bg-blue-50/30 transition-colors">
          <NuxtLink :to="`/admin/bookings/${item.stadionId}`" class="flex items-center justify-center w-full py-2.5 text-sm font-semibold text-gray-700 hover:text-blue-700 bg-white border border-gray-200 hover:border-blue-300 rounded-xl shadow-sm hover:shadow transition-all gap-2">
            Lihat Jadwal Detail
          </NuxtLink>
        </div>
      </div>
    </div>

    <div v-if="filteredDashboardData.length > 0" class="hidden print:block pb-6">
      <table class="w-full border-collapse border border-gray-900 mb-6 text-[9px]">
        <thead>
          <tr class="bg-gray-200">
            <th class="border border-gray-900 px-1.5 py-1.5 text-center font-bold text-gray-900 uppercase tracking-wide" style="width: 8%;">No.</th>
            <th class="border border-gray-900 px-2 py-1.5 text-left font-bold text-gray-900 uppercase tracking-wide" style="width: 40%;">Nama Lapangan</th>
            <th class="border border-gray-900 px-1.5 py-1.5 text-center font-bold text-gray-900 uppercase tracking-wide" style="width: 13%;">Total Kuota</th>
            <th class="border border-gray-900 px-1.5 py-1.5 text-center font-bold text-gray-900 uppercase tracking-wide" style="width: 13%;">Terbooking</th>
            <th class="border border-gray-900 px-1.5 py-1.5 text-center font-bold text-gray-900 uppercase tracking-wide" style="width: 13%;">Sisa</th>
            <th class="border border-gray-900 px-1.5 py-1.5 text-center font-bold text-gray-900 uppercase tracking-wide" style="width: 13%;">% Okupansi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in filteredDashboardData" :key="item.id" :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'">
            <td class="border border-gray-900 px-1.5 py-1.5 font-medium text-gray-900 text-center">{{ index + 1 }}</td>
            <td class="border border-gray-900 px-2 py-1.5 font-medium text-gray-900">{{ item.name }}</td>
            <td class="border border-gray-900 px-1.5 py-1.5 font-medium text-gray-900 text-center">{{ item.totalCapacity }}</td>
            <td class="border border-gray-900 px-1.5 py-1.5 font-medium text-gray-900 text-center">{{ item.totalBooked }}</td>
            <td class="border border-gray-900 px-1.5 py-1.5 font-medium text-gray-900 text-center">{{ item.remaining }}</td>
            <td class="border border-gray-900 px-1.5 py-1.5 font-medium text-center print:bg-transparent print:text-gray-900" :class="item.occupancyRate >= 100 ? 'bg-red-100 text-red-900' : (item.occupancyRate > 75 ? 'bg-amber-100 text-amber-900' : 'bg-green-100 text-green-900')">
              {{ Math.round(item.occupancyRate) }}%
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr class="bg-gray-200 font-bold">
            <td colspan="2" class="border border-gray-900 px-2 py-2 font-bold text-gray-900 uppercase">Total</td>
            <td class="border border-gray-900 px-1.5 py-2 font-bold text-gray-900 text-center">{{ totalCapacity }}</td>
            <td class="border border-gray-900 px-1.5 py-2 font-bold text-gray-900 text-center">{{ totalBooked }}</td>
            <td class="border border-gray-900 px-1.5 py-2 font-bold text-gray-900 text-center">{{ totalAvailable }}</td>
            <td class="border border-gray-900 px-1.5 py-2 font-bold text-gray-900 text-center">
              {{ totalCapacity > 0 ? ((totalBooked / totalCapacity) * 100).toFixed(2) : '0.00' }}%
            </td>
          </tr>
        </tfoot>
      </table>

      <div class="mt-4 mb-2 space-y-3 text-[9px] text-gray-800 leading-tight">
        <div class="border-t border-gray-400 pt-2">
          <p class="font-bold mb-1.5 text-[10px]">Keterangan Informasi:</p>
          <ul class="list-disc list-inside space-y-0.5 text-gray-700 ml-2">
            <li><span class="font-semibold">Total Kuota:</span> Kapasitas slot operasional lapangan selama periode yang dipilih.</li>
            <li><span class="font-semibold">Terbooking:</span> Jumlah slot yang sudah dipesan oleh pengguna.</li>
            <li><span class="font-semibold">Sisa:</span> Jumlah slot yang masih tersedia untuk dipesan.</li>
            <li><span class="font-semibold">Persentase Okupansi:</span> Tingkat penggunaan lapangan (Terbooking / Total Kuota × 100%).</li>
          </ul>
        </div>

        <div class="border-t border-gray-400 pt-2">
          <p class="text-gray-600 italic text-[8px]">Laporan ini dicetak secara otomatis oleh Sistem Informasi {{ appName }}.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media print {
  /* Logo container - preserve all colors */
  .logo-print-color,
  img[alt*="VENUE UNDIP Logo"],
  img[alt*="VENUE UNDIP"] {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    filter: none !important;
    -webkit-filter: none !important;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    page-break-inside: auto;
    font-size: 9px;
  }

  thead {
    display: table-header-group;
    page-break-inside: avoid;
  }

  tfoot {
    display: table-footer-group;
    page-break-inside: avoid;
  }

  tbody tr {
    page-break-inside: avoid;
    page-break-after: auto;
  }

  th, td {
    word-wrap: break-word;
    overflow-wrap: break-word;
    max-width: 100%;
  }
}
</style>

<style>
@media print {
  @page {
    size: A4 portrait;
    margin: 1.5cm 1.5cm 1cm 1.5cm;
  }

  nav, header, aside, footer, .sidebar, .top-bar, .layout-header, .navbar {
    display: none !important;
  }
  
  body, #__nuxt, #__layout {
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    background-color: white !important;
  }

  * {
    box-sizing: border-box;
  }
}
</style>