<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { generateTimeSlots, type Slot } from '~/utils/generateTimeSlots'
import { toDateKey, getNextNDays, toUtcMidnightIso, getTodayInWib } from '~/utils/dateHelpers'
import { Icon } from '@iconify/vue'
import { parseBackendError } from '~/utils/errorParser'

definePageMeta({
  middleware: 'auth-admin',
  layout: 'admin'
})

const { options } = useAppOptions()
const appName = computed(() => options.value.data?.name || 'VENUE UNDIP')

useHead({
  title: 'Booking Lapangan - VENUE UNDIP',
  meta: [
    { name: 'description', content: 'Kelola booking lapangan per stadion di VENUE UNDIP' }
  ]
})

interface Images {
  imageUrl: string
}

interface Field {
  id: string
  name: string
  pricePerHour: number
  priceTendik?: number
  status?: string
  description?: string
  images?: Images[]
  gallery?: string[]
  slots: Slot[]
}

interface OperatingHour {
  openHour?: number
  closeHour?: number
  openTime?: string
  closeTime?: string
}

interface Facility {
  id: number
  name: string
  icon: string
}

interface StadionFacility {
  Facility: Facility
}

interface StadionRow {
  id: number
  name: string
  images?: Images[]
  fields: Field[]
  operatingHours: OperatingHour[]
  description?: string
  location?: string
  mapUrl: string
  facilities: StadionFacility[]
}

interface BookingDetails {
  bookingDate: string
  fieldId: number
  startHour: number
}

interface BookingsResult {
  bookingCode: string
  name?: string
  renterType?: 'UMUM' | 'TENDIK' | 'AKADEMIK'
  details: BookingDetails[]
}


const initialDays = getNextNDays(null, 7, true)
const selectedDate = ref<string>(initialDays[0]?.value ?? '')
const days = computed(() => getNextNDays(null, 7, true))

const selectedDateKey = computed(() => toDateKey(selectedDate.value))

const isDateEqual = (date1: string, date2: string) => {
  return toDateKey(date1) === toDateKey(date2)
}

function hourFrom(entry: OperatingHour | undefined, key: 'open' | 'close') {
  if (!entry) return key === 'open' ? 8 : 22
  const direct = key === 'open' ? entry.openHour : entry.closeHour
  if (typeof direct === 'number') return direct
  const time = key === 'open' ? entry.openTime : entry.closeTime
  if (time) return new Date(time).getUTCHours()
  return key === 'open' ? 8 : 22
}

function extractOperatingHours(operatingHours?: OperatingHour | OperatingHour[] | null) {
  if (!operatingHours || (Array.isArray(operatingHours) && operatingHours.length === 0)) {
    return { openHour: 8, closeHour: 22 }
  }

  const entries = Array.isArray(operatingHours) ? operatingHours : [operatingHours]
  const openHour = Math.min(...entries.map((entry) => hourFrom(entry, 'open')))
  const closeHour = Math.max(...entries.map((entry) => hourFrom(entry, 'close')))

  return { openHour, closeHour }
}

const route = useRoute()
const stadionId = Number(route.params.id)

const { data: stadion, pending, error } = await useAsyncData(
  `admin-bookings-stadion-${stadionId}`,
  () => $fetch<StadionRow>(`/api/stadions/${stadionId}`),
  {
    transform: (stadion) => {
      const { openHour, closeHour } = extractOperatingHours(stadion.operatingHours)
      const fields = stadion.fields.map(field => ({
        ...field,
        priceTendik: field.priceTendik,
        gallery: field.images?.map(img => img.imageUrl) || [],
        slots: generateTimeSlots(openHour, closeHour, field.pricePerHour)
      }))
      return { ...stadion, fields }
    }
  }
)

const stadionImageIndex = ref(0)

watch(stadion, (s) => {
  if (!s) return
  stadionImageIndex.value = 0
  if (s.fields && Array.isArray(s.fields)) {
    s.fields.forEach((f: any) => {
      if (f && f.id != null && fieldImageIndex.value[f.id] == null) fieldImageIndex.value[f.id] = 0
    })
  }
})

function nextStadionImage() {
  const len = stadion.value?.images?.length || 0
  if (!len) return
  stadionImageIndex.value = (stadionImageIndex.value + 1) % len
}

function prevStadionImage() {
  const len = stadion.value?.images?.length || 0
  if (!len) return
  stadionImageIndex.value = (stadionImageIndex.value - 1 + len) % len
}

const SWIPE_THRESHOLD_PX = 40

const stadionTouchStartX = ref<number | null>(null)

function onStadionTouchStart(e: TouchEvent) {
  if ((stadion.value?.images?.length || 0) <= 1) return
  stadionTouchStartX.value = e.touches?.[0]?.clientX ?? null
}

function onStadionTouchEnd(e: TouchEvent) {
  if ((stadion.value?.images?.length || 0) <= 1) return
  const startX = stadionTouchStartX.value
  stadionTouchStartX.value = null
  if (startX == null) return

  const endX = e.changedTouches?.[0]?.clientX
  if (endX == null) return

  const deltaX = endX - startX
  if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX) return
  if (deltaX < 0) nextStadionImage()
  else prevStadionImage()
}

const currentStadionImage = computed(() => stadion.value?.images?.[stadionImageIndex.value]?.imageUrl || '/placeholder-stadium.jpg')

const fieldImageIndex = ref<Record<number, number>>({})

function nextFieldImage(fieldId: number) {
  const field = stadion.value?.fields?.find((f: any) => Number(f.id) === Number(fieldId))
  const len = field?.gallery?.length || 0
  if (!len) return
  fieldImageIndex.value[fieldId] = ((fieldImageIndex.value[fieldId] || 0) + 1) % len
}

function prevFieldImage(fieldId: number) {
  const field = stadion.value?.fields?.find((f: any) => Number(f.id) === Number(fieldId))
  const len = field?.gallery?.length || 0
  if (!len) return
  fieldImageIndex.value[fieldId] = ((fieldImageIndex.value[fieldId] || 0) - 1 + len) % len
}

function getFieldImageUrl(fieldId: number) {
  const field = stadion.value?.fields?.find((f: any) => Number(f.id) === Number(fieldId))
  const idx = fieldImageIndex.value[fieldId] || 0
  return field?.gallery?.[idx] || field?.images?.[idx]?.imageUrl || '/placeholder-field.jpg'
}

const fieldTouchStartX = ref<Record<number, number | null>>({})

function onFieldTouchStart(fieldId: number, e: TouchEvent) {
  const field = stadion.value?.fields?.find((f: any) => Number(f.id) === Number(fieldId))
  const len = field?.gallery?.length || 0
  if (len <= 1) return
  fieldTouchStartX.value[fieldId] = e.touches?.[0]?.clientX ?? null
}

function onFieldTouchEnd(fieldId: number, e: TouchEvent) {
  const field = stadion.value?.fields?.find((f: any) => Number(f.id) === Number(fieldId))
  const len = field?.gallery?.length || 0
  if (len <= 1) return

  const startX = fieldTouchStartX.value[fieldId]
  fieldTouchStartX.value[fieldId] = null
  if (startX == null) return

  const endX = e.changedTouches?.[0]?.clientX
  if (endX == null) return

  const deltaX = endX - startX
  if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX) return
  if (deltaX < 0) nextFieldImage(fieldId)
  else prevFieldImage(fieldId)
}

const publicBookings = ref<BookingsResult[]>([])
const bookingError = ref<string | null>(null)

const loadPublicBookings = async () => {
  if (!stadionId || !selectedDateKey.value) {
    publicBookings.value = []
    bookingError.value = null
    return
  }
  try {
    bookingError.value = null
    publicBookings.value = await $fetch<BookingsResult[]>('/api/bookings', {
      query: { stadionId, date: toUtcMidnightIso(selectedDateKey.value) },
    })
  } catch (error: any) {
    const parsed = parseBackendError(error)
    console.error('Failed to load bookings:', parsed.message)
    bookingError.value = parsed.message
    publicBookings.value = []
  }
}

onMounted(loadPublicBookings)
watch(selectedDateKey, () => loadPublicBookings())

onMounted(() => {
  const handleVisibilityChange = () => {
    if (!document.hidden) {
      loadPublicBookings()
    }
  }
  
  const pollInterval = setInterval(() => {
    if (!document.hidden) {
      loadPublicBookings()
    }
  }, 15000)
  
  document.addEventListener('visibilitychange', handleVisibilityChange)
  
  onBeforeUnmount(() => {
    document.removeEventListener('visibilitychange', handleVisibilityChange)
    clearInterval(pollInterval)
  })
})

const expandedFields = ref<Record<number, boolean>>({})

function toggleField(id: number) {
  expandedFields.value = {
    ...expandedFields.value,
    [id]: !expandedFields.value[id],
  }
}

function isFieldExpanded(id: number) {
  return expandedFields.value[id] ?? false
}

function isSlotBooked(fieldId: number, startHour: number) {
  if (!publicBookings.value || !selectedDateKey.value) return false
  return publicBookings.value.some((booking) =>
    booking.details?.some(
      (detail) =>
        detail.fieldId === fieldId &&
        toDateKey(detail.bookingDate) === selectedDateKey.value &&
        detail.startHour === startHour
    )
  )
}

function isFieldFullyBooked(field: Field) {
  return field.slots.every((slot) => {
    const startHour = Number(slot.start.split(':')[0])
    return isSlotBooked(Number(field.id), startHour)
  })
}

function availableSlotsCount(field: Field) {
  return field.slots.filter((slot) => {
    const startHour = Number(slot.start.split(':')[0])
    return !isSlotBooked(Number(field.id), startHour)
  }).length
}

function getBookingCode(fieldId: number, startHour: number) {
  const selectedKey = selectedDateKey.value
  if (!selectedKey) return undefined
  const booking = publicBookings.value?.find((b) =>
    b.details.some(
      (d) =>
        d.fieldId === fieldId &&
        toDateKey(d.bookingDate) === selectedKey &&
        d.startHour === startHour
    )
  )
  return booking?.bookingCode
}

function getBookingInfo(fieldId: number, startHour: number) {
  const selectedKey = selectedDateKey.value
  if (!selectedKey) return null
  const booking = publicBookings.value?.find((b) =>
    b.details.some(
      (d) =>
        d.fieldId === fieldId &&
        toDateKey(d.bookingDate) === selectedKey &&
        d.startHour === startHour
    )
  )
  return booking ? {
    name: booking.name,
    renterType: booking.renterType,
    bookingCode: booking.bookingCode
  } : null
}

function getFirstName(fullName?: string) {
  if (!fullName) return 'N/A'
  const names = fullName.trim().split(' ')
  return names[0] || 'N/A'
}

function handleSlotClick(fieldId: number, startHour: number, pricePerHour: number, fieldName: string, priceTendik?: number) {
  if (isSlotBooked(fieldId, startHour)) {
    const bookingCode = getBookingCode(fieldId, startHour)
    if (bookingCode) {
      navigateTo(`/admin/bookings/${stadionId}/${bookingCode}`)
    }
    return
  }
  
  if (isSelectedDatePastOrToday()) {
    return
  }
  
  const field = stadion.value?.fields?.find((f: any) => Number(f.id) === fieldId)
  if (field && field.status !== 'ACTIVE') {
    return
  }
  
  toggleSlot(fieldId, startHour, pricePerHour, fieldName, priceTendik)
}

const selectedSlots = ref<{fieldId: number; startHour: number; date: string; pricePerHour: number; priceTendik?: number; fieldName: string}[]>([])

function toggleSlot(fieldId: number, startHour: number, pricePerHour: number, fieldName: string, priceTendik?: number) {
  const date = selectedDate.value as string
  const index = selectedSlots.value.findIndex(
    (s) => s.fieldId === fieldId && s.startHour === startHour && s.date === date
  )

  if (index > -1) {
    selectedSlots.value.splice(index, 1)
  } else {
    selectedSlots.value.push({
      fieldId,
      startHour,
      date,
      pricePerHour,
      priceTendik,
      fieldName
    })
  }
}

function isSlotSelected(fieldId: number, startHour: number) {
  return selectedSlots.value.some(
    (s) => s.fieldId === fieldId && s.startHour === startHour && s.date === selectedDate.value
  )
}

function makeBooking() {
  navigateTo({
    path: `/admin/bookings/${stadionId}/create`,
    query: {
      selections: encodeURIComponent(JSON.stringify(selectedSlots.value))
    }
  })
}

function isDatePast(date: Date | null) {
  if (!date) return false
  // Use WIB timezone for consistent "today" comparison across all Indonesian timezones
  const today = getTodayInWib()
  return date <= today
}

function isSelectedDatePastOrToday() {
  if (!selectedDate.value) return false
  const selected = new Date(selectedDate.value)
  selected.setHours(0, 0, 0, 0)
  // Use WIB timezone for consistent "today" comparison across all Indonesian timezones
  const today = getTodayInWib()
  return selected <= today
}

watch(() => selectedSlots.value.length, (newLength) => {
  if (newLength === 0) {
    selectedSlots.value = []
  }
})
</script>

<template>
  <div class="w-full pb-16">
    <header class="mx-auto flex max-w-7xl items-center justify-between pt-2 pb-4 sm:pt-1 sm:pb-6">
        <NuxtLink 
          to="/admin/bookings" 
          class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:text-[#1f2a56] hover:border-[#1f2a56] hover:shadow-md active:scale-95"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span>Kembali</span>
        </NuxtLink>
      </header>

      <section v-if="pending" class="text-center py-20">
        <div class="inline-flex flex-col items-center gap-4">
          <div class="w-12 h-12 border-4 border-gray-200 border-t-[#1f2a56] rounded-full animate-spin"></div>
          <p class="text-sm font-medium text-gray-600">Memuat detail stadion...</p>
        </div>
      </section>

      <section v-else-if="error" class="mx-auto max-w-6xl py-12">
        <div class="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <div class="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-4">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-red-900 mb-2">Terjadi Kesalahan</h3>
          <p class="text-sm text-red-700">{{ error.message }}</p>
        </div>
      </section>

      <section v-else class="mx-auto max-w-7xl space-y-4 sm:space-y-6 overflow-hidden">
        
        <div class="grid gap-3 lg:grid-cols-[minmax(0,2.3fr)_minmax(320px,1fr)]">
          <div
            class="relative overflow-hidden rounded-[32px] border border-gray-200/80 bg-white shadow-md"
            @touchstart.passive="onStadionTouchStart"
            @touchend="onStadionTouchEnd"
          >
            <div class="relative aspect-[16/10] w-full overflow-hidden bg-gray-200 p-[1px] leading-[0]">
              <img
                v-if="stadion?.images && stadion.images.length > 0"
                :src="currentStadionImage"
                :alt="stadion?.name"
                class="absolute inset-[1px] h-[calc(100%-2px)] w-[calc(100%-2px)] object-cover block"
              >
              <div v-else class="absolute inset-[1px] flex items-center justify-center bg-gray-100">
                <PlaceholderImage text="Foto Stadion Belum Ditambahkan" />
              </div>
            </div>

            <button
              v-if="(stadion?.images?.length || 0) > 1"
              @click="prevStadionImage"
              class="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-1.5 sm:p-2.5 text-gray-700 shadow-lg hover:bg-white hover:scale-110 transition-all backdrop-blur-sm active:scale-95"
              aria-label="Foto sebelumnya"
            >
              <svg class="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              v-if="(stadion?.images?.length || 0) > 1"
              @click="nextStadionImage"
              class="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-1.5 sm:p-2.5 text-gray-700 shadow-lg hover:bg-white transition-all backdrop-blur-sm"
              aria-label="Foto berikutnya"
            >
              <svg class="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <div v-if="(stadion?.images?.length || 0) > 1" class="absolute bottom-3 sm:bottom-4 left-0 right-0 flex justify-center gap-1.5 sm:gap-2">
              <button
                v-for="(img, idx) in stadion?.images"
                :key="`dot-${idx}`"
                class="h-1.5 sm:h-2 rounded-full transition-all"
                :class="idx === stadionImageIndex ? 'bg-white w-6 sm:w-8' : 'bg-white/60 w-1.5 sm:w-2 hover:bg-white/80'"
                @click="stadionImageIndex = idx"
                :aria-label="`Gambar ${idx + 1}`"
              />
            </div>

            <span 
              v-if="stadion?.images && stadion.images.length > 0" 
              class="absolute top-3 sm:top-4 right-3 sm:right-4 rounded-lg bg-black/75 backdrop-blur-sm px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold text-white"
            >
              {{ stadionImageIndex + 1 }} / {{ stadion.images.length }}
            </span>
          </div>

          <div class="hidden lg:grid gap-3 grid-rows-2 h-full">
            <template v-if="stadion?.images && stadion.images.length > 1">
              <div
                v-for="(img, idx) in stadion?.images?.slice(1, 3)"
                :key="`thumb-${idx}`"
                class="relative w-full h-full overflow-hidden rounded-[24px] shadow-sm cursor-pointer transition-all duration-200 hover:opacity-80 hover:shadow-md hover:scale-[1.02]"
                @click="stadionImageIndex = idx + 1"
              >
                <img
                  :src="img.imageUrl"
                  :alt="`${stadion?.name} preview ${idx + 1}`"
                  class="absolute inset-0 h-full w-full object-cover"
                >
              </div>
            </template>
          </div>
        </div>

        <div class="space-y-4 sm:space-y-5 rounded-xl sm:rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
          <div class="space-y-2 pb-3 sm:pb-4 border-b border-gray-100">
            <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">{{ stadion?.name }}</h1>
          </div>

          <div class="space-y-4">
            <div>
              <h2 class="text-sm sm:text-base font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <svg class="w-4 h-4 sm:w-5 sm:h-5 text-[#1f2a56]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                Deskripsi
              </h2>
              <p class="text-xs sm:text-sm text-gray-600 whitespace-pre-line leading-relaxed">
                {{ stadion?.description || 'Belum ada deskripsi.' }}
              </p>
            </div>

            <div class="relative rounded-lg sm:rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-white p-3 sm:p-4 border border-gray-200">
              <!-- Subtle Street Map Background Pattern -->
              <div class="absolute inset-0 opacity-[0.08] pointer-events-none">
                <svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 300" preserveAspectRatio="xMidYMid slice">

                  <path d="M 0 150 Q 50 145, 100 150 Q 140 155, 180 150 Q 220 145, 260 140 Q 300 138, 350 140" stroke="#94a3b8" stroke-width="2.5" fill="none"/>
                  <path d="M 350 140 Q 400 142, 450 145 Q 500 148, 550 150 L 600 152" stroke="#94a3b8" stroke-width="2" fill="none"/>
                  
                  <path d="M 180 0 Q 185 40, 180 80 Q 175 120, 180 150 Q 182 180, 185 220 Q 188 260, 190 300" stroke="#94a3b8" stroke-width="2.5" fill="none"/>
                  
                  <path d="M 420 0 Q 415 50, 420 100 Q 425 130, 420 160 Q 418 200, 420 240 L 420 300" stroke="#94a3b8" stroke-width="2" fill="none"/>
                  

                  <path d="M 0 80 Q 40 78, 80 80 Q 120 82, 160 85 Q 200 83, 240 80 Q 280 78, 320 80" stroke="#94a3b8" stroke-width="1.5" fill="none"/>
                  
                  <path d="M 100 50 Q 102 70, 100 90 Q 98 120, 100 150 Q 102 180, 105 210" stroke="#94a3b8" stroke-width="1.5" fill="none"/>
                  
                  <path d="M 0 220 Q 60 218, 120 220 Q 180 222, 240 220 Q 300 218, 360 220 Q 420 222, 480 220 L 600 218" stroke="#94a3b8" stroke-width="1.5" fill="none"/>
                  

                  <path d="M 350 140 Q 360 120, 370 100 Q 380 85, 390 80" stroke="#94a3b8" stroke-width="1" fill="none"/>
                  
                  <path d="M 260 80 Q 270 100, 280 120 Q 285 135, 280 150" stroke="#94a3b8" stroke-width="1" fill="none"/>
                  
                  <path d="M 500 80 Q 490 110, 485 140 Q 483 170, 490 200" stroke="#94a3b8" stroke-width="1" fill="none"/>
                  
                  <path d="M 300 220 Q 310 200, 320 180 Q 330 160, 340 145" stroke="#94a3b8" stroke-width="1" fill="none"/>
                  

                  <circle cx="180" cy="150" r="3" fill="#3b82f6" opacity="0.7"/>
                  <circle cx="350" cy="140" r="3" fill="#3b82f6" opacity="0.7"/>
                  <circle cx="420" cy="160" r="3" fill="#3b82f6" opacity="0.7"/>
                  <circle cx="180" cy="80" r="3" fill="#3b82f6" opacity="0.7"/>
                  <circle cx="260" cy="140" r="3" fill="#3b82f6" opacity="0.7"/>
                  <circle cx="100" cy="150" r="3" fill="#3b82f6" opacity="0.7"/>
                  <circle cx="420" cy="100" r="3" fill="#3b82f6" opacity="0.7"/>
                  <circle cx="240" cy="220" r="3" fill="#3b82f6" opacity="0.7"/>
                  <circle cx="500" cy="145" r="3" fill="#3b82f6" opacity="0.7"/>
                  <circle cx="100" cy="80" r="2.5" fill="#3b82f6" opacity="0.6"/>
                  <circle cx="260" cy="80" r="2.5" fill="#3b82f6" opacity="0.6"/>
                  <circle cx="320" cy="80" r="2.5" fill="#3b82f6" opacity="0.6"/>
                </svg>
              </div>
              
              <!-- Content -->
              <div class="relative z-10">
                <p class="text-xs sm:text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <svg class="w-4 h-4 text-[#3b82f6]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  <span>Lokasi Venue</span>
                </p>
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                  <span class="text-xs sm:text-sm text-gray-600">{{ stadion?.mapUrl || 'Lokasi belum tersedia' }}</span>
                  <a
                    v-if="stadion?.mapUrl"
                    :href="stadion.mapUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-1.5 text-sm font-semibold text-[#3b82f6] hover:text-[#2563eb] hover:underline transition-all whitespace-nowrap"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    <span>Buka Peta</span>
                  </a>
                  <span v-else class="text-xs sm:text-sm text-gray-400 whitespace-nowrap">Peta belum tersedia</span>
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-3 pt-2">
            <h2 class="text-sm sm:text-base font-semibold text-gray-900 flex items-center gap-2">
              <svg class="w-4 h-4 sm:w-5 sm:h-5 text-[#1f2a56]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Fasilitas
            </h2>
            <ul class="grid gap-2 text-gray-700 sm:grid-cols-2">
              <li 
                v-for="facility in stadion?.facilities" 
                :key="facility.Facility.id" 
                class="flex items-center gap-2 sm:gap-2.5 text-xs sm:text-sm bg-gray-50 rounded-lg px-2.5 sm:px-3 py-2 sm:py-2.5 border border-gray-100 [@media(hover:hover)]:hover:bg-white [@media(hover:hover)]:hover:border-gray-300 [@media(hover:hover)]:hover:shadow-sm [@media(hover:hover)]:hover:scale-[1.02] transition-all"
              >
                <div class="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg bg-gray-100 border border-gray-200 text-[#1f2a56]">
                  <Icon
                    v-if="facility.Facility.icon"
                    :icon="facility.Facility.icon"
                    class="h-3.5 w-3.5 sm:h-4 sm:w-4"
                  />
                  <span v-else class="w-1.5 h-1.5 rounded-full bg-[#1f2a56]"></span>
                </div>
                <span class="font-medium">{{ facility.Facility.name }}</span>
              </li>
            </ul>
          </div>
        </div>

        <section class="rounded-xl sm:rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          
          <div class="flex flex-wrap items-center justify-between gap-3 sm:gap-4 border-b border-gray-200 bg-gray-50/50 px-4 sm:px-6 py-3 sm:py-4">
            <div class="flex items-center gap-2 sm:gap-3">
              <span class="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-[#1f2a56]"></span>
              <h3 class="text-base sm:text-lg font-bold text-gray-900 uppercase tracking-tight">Pilih Lapangan & Jadwal</h3>
            </div>

            <SmartDatePicker v-model="selectedDate" :allow-past-dates="true" />
          </div>


          <div class="px-4 sm:px-6 py-3 sm:py-3.5 bg-white border-b border-gray-200">
            <div class="flex items-center gap-2.5 sm:gap-3">
              <div class="flex items-center gap-2 sm:gap-2.5 flex-1 min-w-0">
                <div class="flex-shrink-0">
                  <svg class="w-5 h-5 sm:w-5.5 sm:h-5.5 text-[#1f2a56]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs text-gray-500 font-medium">Tanggal Dipilih</p>
                  <p class="text-sm sm:text-base font-bold text-gray-900 truncate">
                    {{ new Date(selectedDate).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta' }) }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="px-4 sm:px-6 py-4 sm:py-5 bg-gray-50/30 border-b border-gray-200">
            <div class="flex flex-wrap items-center gap-2 sm:gap-2.5">
              
              <button
                v-for="(day, index) in days.slice(0, 3)"
                :key="day.value"
                class="rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold transition-all border"
                :class="
                  isDateEqual(selectedDate, day.value)
                    ? 'bg-[#1f2a56] text-white shadow border-[#1f2a56] hover:bg-[#162347]'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                "
                @click="selectedDate = day.value"
              >
                {{ day.label }}
              </button>

              <button
                v-for="(day, index) in days.slice(3)"
                :key="day.value"
                class="hidden sm:inline-flex rounded-xl px-4 py-2.5 text-sm font-semibold transition-all border"
                :class="
                  isDateEqual(selectedDate, day.value)
                    ? 'bg-[#1f2a56] text-white shadow border-[#1f2a56] hover:bg-[#162347]'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                "
                @click="selectedDate = day.value"
              >
                {{ day.label }}
              </button>

            </div>
          </div>

          <!-- Error Loading Bookings -->
          <div v-if="bookingError" class="px-4 sm:px-6 py-4 bg-yellow-50 border-b border-yellow-200">
            <div class="flex items-start gap-3">
              <svg class="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
              <div class="flex-1">
                <p class="text-sm font-semibold text-yellow-900">Gagal Memuat Data Booking</p>
                <p class="text-xs text-yellow-700 mt-1">{{ bookingError }}</p>
                <button 
                  @click="loadPublicBookings" 
                  class="mt-2 text-xs font-semibold text-yellow-900 hover:text-yellow-700 underline"
                >
                  Coba Lagi
                </button>
              </div>
            </div>
          </div>


          <div 
            v-if="!stadion?.fields || stadion.fields.length === 0"
            class="flex flex-col items-center justify-center py-16 px-4"
          >
            <div class="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center mb-6">
              <svg class="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Belum Ada Lapangan di Stadion Ini</h3>
            <p class="text-sm text-gray-500 text-center max-w-md mb-6">
              Stadion ini belum memiliki lapangan. Silakan tambahkan lapangan terlebih dahulu untuk mulai menerima booking.
            </p>
            <NuxtLink 
              :to="`/admin/fields/create?stadionId=${stadionId}`"
              class="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-all active:scale-95"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>Tambah Lapangan</span>
            </NuxtLink>
          </div>

          <div
            v-for="field in stadion?.fields"
            :key="field.id"
            class="border-b border-gray-100 last:border-b-0"
          >
            <div class="p-4 sm:p-5">
              <div class="flex flex-col gap-5 rounded-3xl border border-gray-200 p-5 lg:flex-row">
                <div
                  class="relative w-full overflow-hidden rounded-[28px] border border-white shadow lg:w-[420px] h-56"
                  @touchstart.passive="onFieldTouchStart(Number(field.id), $event)"
                  @touchend="onFieldTouchEnd(Number(field.id), $event)"
                >
                  <img
                    v-if="getFieldImageUrl(Number(field.id)) && !getFieldImageUrl(Number(field.id)).includes('placeholder')"
                    :src="getFieldImageUrl(Number(field.id))"
                    :alt="field.name"
                    class="absolute inset-0 h-full w-full object-cover transition-transform duration-500"
                  >
                  <div v-else class="absolute inset-0 h-full w-full flex items-center justify-center bg-gray-100">
                    <PlaceholderImage text="Foto Lapangan Belum Ditambahkan" />
                  </div>

                  <template v-if="field.gallery && field.gallery.length > 1">
                    <button
                      @click.stop="prevFieldImage(Number(field.id))"
                      aria-label="Foto sebelumnya"
                      class="absolute left-2 sm:left-2.5 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-1.5 sm:p-2 text-gray-700 hover:bg-white hover:scale-110 shadow-lg transition-all backdrop-blur-sm active:scale-95"
                    >
                      <svg class="h-3.5 w-3.5 sm:h-4 sm:w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      @click.stop="nextFieldImage(Number(field.id))"
                      aria-label="Foto berikutnya"
                      class="absolute right-2 sm:right-2.5 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-1.5 sm:p-2 text-gray-700 hover:bg-white hover:scale-110 shadow-lg transition-all backdrop-blur-sm active:scale-95"
                    >
                      <svg class="h-3.5 w-3.5 sm:h-4 sm:w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </template>

                  <span 
                    v-if="field.gallery && field.gallery.length > 0" 
                    class="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 rounded-lg bg-black/75 backdrop-blur-sm px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold text-white"
                  >
                    {{ (fieldImageIndex[Number(field.id)] ?? 0) + 1 }} / {{ field.gallery.length }}
                  </span>
                </div>

                <div class="flex-1 space-y-3 sm:space-y-4">
                  <div class="space-y-2">
                    <h4 class="text-lg sm:text-xl font-bold text-gray-900">
                      {{ field.name }}
                    </h4>
                    <div class="flex items-center gap-2 flex-wrap">
                      <span
                        v-if="field.status !== 'ACTIVE'"
                        class="inline-flex items-center gap-1.5 rounded-lg px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs font-semibold border bg-amber-50 text-amber-700 border-amber-200"
                      >
                        <span class="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                        Maintenance
                      </span>
                      <span
                        v-else-if="isFieldFullyBooked(field)"
                        class="inline-flex items-center gap-1.5 rounded-lg px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs font-semibold border bg-red-50 text-red-700 border-red-200"
                      >
                        <span class="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                        Full Booked
                      </span>
                      <template v-else>
                        <span
                          class="inline-flex items-center gap-1.5 rounded-lg px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs font-semibold border bg-green-50 text-green-700 border-green-200"
                        >
                          <span class="relative flex h-1.5 w-1.5">
                            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-600"></span>
                          </span>
                          Ready
                        </span>
                        <span 
                          v-if="availableSlotsCount(field) > 0"
                          class="inline-flex items-center gap-1 rounded-lg px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs font-bold bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-sm"
                        >
                          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                          </svg>
                          {{ availableSlotsCount(field) }} Slot Tersedia
                        </span>
                      </template>
                    </div>
                    <p class="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-2 sm:line-clamp-none">
                      {{ field.description || 'Tidak ada deskripsi tersedia.' }}
                    </p>
                  </div>

                  <button
                    class="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-[#1f2a56] px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white shadow hover:bg-[#162347] transition-all active:scale-95"
                    @click="toggleField(Number(field.id))"
                  >
                    <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{{ isFieldExpanded(Number(field.id)) ? 'Sembunyikan Jadwal' : 'Lihat Jadwal' }}</span>
                    <svg 
                      class="h-3 w-3 transition-transform" 
                      :class="isFieldExpanded(Number(field.id)) ? 'rotate-180' : ''"
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      stroke-width="2"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>

              <transition name="expand">
                <div
                  v-if="isFieldExpanded(Number(field.id))"
                  class="mt-4 sm:mt-5 grid gap-2 sm:gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
                >
                  <button
                    v-for="slot in field.slots"
                    :key="slot.start"
                    type="button"
                    class="group relative rounded-lg sm:rounded-xl border p-2 sm:p-3 text-left shadow-sm transition-all overflow-hidden"
                    :class="[
                      isSlotBooked(Number(field.id), Number(slot.start.split(':')[0]))
                        ? 'bg-blue-50 text-blue-600 border-blue-200 cursor-pointer [@media(hover:hover)]:hover:bg-blue-100 [@media(hover:hover)]:hover:border-blue-300'
                        : field.status !== 'ACTIVE'
                        ? 'bg-orange-50 text-orange-400 border-orange-100 cursor-not-allowed'
                        : isSelectedDatePastOrToday()
                        ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed opacity-70'
                        : isSlotSelected(Number(field.id), Number(slot.start.split(':')[0]))
                        ? 'bg-[#1f2a56] text-white border-[#1f2a56] shadow-md ring-2 ring-[#1f2a56] ring-offset-2'
                        : 'bg-white text-gray-900 border-gray-200 [@media(hover:hover)]:hover:border-emerald-500 [@media(hover:hover)]:hover:bg-emerald-50 [@media(hover:hover)]:hover:shadow-lg [@media(hover:hover)]:hover:shadow-emerald-500/20 [@media(hover:hover)]:hover:scale-105 active:scale-100 cursor-pointer'
                    ]"
                    @click="handleSlotClick(Number(field.id), Number(slot.start.split(':')[0]), Number(slot.price), field.name, field.priceTendik)"
                  >
                    <div
                      v-if="isSlotBooked(Number(field.id), Number(slot.start.split(':')[0]))"
                      class="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#1f2a56]/90 opacity-0 backdrop-blur-[2px] transition-all duration-300 [@media(hover:hover)]:group-hover:opacity-100"
                    >
                      <svg class="mb-1 h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span class="px-1 text-center text-[10px] font-bold text-white leading-tight">
                        Lihat Detail Booking
                      </span>
                    </div>


                    <div
                      v-if="isSlotBooked(Number(field.id), Number(slot.start.split(':')[0]))"
                      class="flex items-center justify-between mb-1 [@media(hover:hover)]:group-hover:opacity-0 transition-opacity"
                    >
                      <p class="text-[10px] sm:text-[0.65rem] font-bold text-blue-700 truncate flex-1 pr-1">
                        {{ getFirstName(getBookingInfo(Number(field.id), Number(slot.start.split(':')[0]))?.name) }}
                      </p>
                        <span
                        class="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-semibold whitespace-nowrap"
                        :class="getBookingInfo(Number(field.id), Number(slot.start.split(':')[0]))?.renterType === 'AKADEMIK'
                          ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                          : getBookingInfo(Number(field.id), Number(slot.start.split(':')[0]))?.renterType === 'TENDIK'
                          ? 'bg-purple-100 text-purple-700 border border-purple-200'
                          : 'bg-gray-100 text-gray-700 border border-gray-200'"
                      >
                        <svg v-if="getBookingInfo(Number(field.id), Number(slot.start.split(':')[0]))?.renterType === 'AKADEMIK'" class="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                        </svg>
                        <svg v-else-if="getBookingInfo(Number(field.id), Number(slot.start.split(':')[0]))?.renterType === 'TENDIK'" class="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <svg v-else class="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
                        </svg>
                        <span v-if="getBookingInfo(Number(field.id), Number(slot.start.split(':')[0]))?.renterType === 'AKADEMIK'">Akademik</span>
                        <span v-else-if="getBookingInfo(Number(field.id), Number(slot.start.split(':')[0]))?.renterType === 'TENDIK'">Tendik</span>
                        <span v-else>Umum</span>
                      </span>
                    </div>

                    <p
                      class="text-[10px] sm:text-[0.65rem] uppercase tracking-wide font-semibold"
                      :class="[
                        isSlotBooked(Number(field.id), Number(slot.start.split(':')[0])) 
                          ? 'text-blue-500 [@media(hover:hover)]:group-hover:opacity-0 transition-opacity' 
                          : field.status !== 'ACTIVE'
                          ? 'text-orange-400'
                          : isSelectedDatePastOrToday()
                          ? 'text-gray-400'
                          : isSlotSelected(Number(field.id), Number(slot.start.split(':')[0]))
                          ? 'text-white/80'
                          : 'text-gray-500'
                      ]"
                    >
                      60 Menit
                    </p>
                    <p
                      class="text-sm sm:text-base font-bold mt-0.5"
                      :class="[
                        isSlotBooked(Number(field.id), Number(slot.start.split(':')[0]))
                          ? 'text-blue-700 [@media(hover:hover)]:group-hover:opacity-0 transition-opacity'
                          : field.status !== 'ACTIVE'
                          ? 'text-orange-600'
                          : isSelectedDatePastOrToday()
                          ? 'text-gray-400'
                          : isSlotSelected(Number(field.id), Number(slot.start.split(':')[0]))
                          ? 'text-white'
                          : 'text-[#1f2a56]'
                      ]"
                    >
                      {{ slot.start }} - {{ slot.end }}
                    </p>
                    <div class="flex items-center justify-between mt-1">
                      <p
                        v-if="isSlotBooked(Number(field.id), Number(slot.start.split(':')[0]))"
                        class="text-[10px] sm:text-xs font-semibold text-blue-600 [@media(hover:hover)]:group-hover:opacity-0 transition-opacity"
                      >
                        Booked
                      </p>
                      <p
                        v-else-if="field.status !== 'ACTIVE'"
                        class="text-[10px] sm:text-xs font-semibold text-orange-500"
                      >
                        Maintenance
                      </p>
                      <p
                        v-else-if="isSelectedDatePastOrToday()"
                        class="text-[10px] sm:text-xs font-semibold text-gray-400"
                      >
                        Tidak Tersedia
                      </p>
                      <p 
                        v-else 
                        class="text-[10px] sm:text-xs font-semibold"
                        :class="isSlotSelected(Number(field.id), Number(slot.start.split(':')[0])) ? 'text-white' : 'text-green-600'"
                      >
                        Available
                      </p>
                      
                      <svg
                        v-if="isSlotSelected(Number(field.id), Number(slot.start.split(':')[0]))"
                        class="w-4 h-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                    </div>
                  </button>
                </div>
              </transition>
            </div>
          </div>
        </section>
      </section>

    <transition name="slide-up">
      <div
        v-if="selectedSlots.length > 0"
        class="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white shadow-2xl backdrop-blur-sm lg:left-64"
      >
        <div class="mx-auto flex max-w-6xl items-center justify-between gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 w-full">
          <div class="flex items-center gap-2 sm:gap-3">
            <div class="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 bg-[#1f2a56] rounded-full">
              <span class="text-sm sm:text-base font-bold text-white">{{ selectedSlots.length }}</span>
            </div>
            <div>
              <p class="text-xs sm:text-sm font-semibold text-gray-900">{{ selectedSlots.length }} Jadwal Dipilih</p>
              <p class="text-[10px] sm:text-xs text-gray-500">Lanjutkan untuk membuat booking</p>
            </div>
          </div>

          <div class="flex gap-2 sm:gap-2.5">
            <button
              type="button"
              class="rounded-lg sm:rounded-xl border border-gray-300 bg-white px-3 sm:px-5 py-1.5 sm:py-2.5 text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all active:scale-95"
              @click="selectedSlots = []"
            >
              Batalkan
            </button>
            <button
              type="button"
              class="inline-flex items-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl bg-[#1f2a56] px-3 sm:px-5 py-1.5 sm:py-2.5 text-xs sm:text-sm font-semibold text-white shadow hover:bg-[#162347] transition-all active:scale-95"
              @click="makeBooking"
            >
              <span>Lanjut</span>
              <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.2s ease;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(100%);
}
</style>