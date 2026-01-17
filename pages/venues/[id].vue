<script setup lang="ts">
import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { Icon } from '@iconify/vue'
import { toDateKey, getNextNDays, toUtcMidnightIso } from '~/utils/dateHelpers'
import InfoModal from '~/components/InfoModal.vue'
import { parseBackendError } from '~/utils/errorParser'
import { UI } from '~/utils/constants'

type Slot = {
  start: string
  range: string
  status: 'Booked' | 'Available'
  price?: number
  previousPrice?: number
  highlight?: boolean
}

type Court = {
  id: number
  name: string
  surface: string
  type?: string
  status: 'Ready' | 'Maintenance'
  image: string
  gallery: string[]
  slots: Slot[]
}

type SelectedSlot = {
  key: string
  courtId: number
  courtName: string
  range: string
  price: number
  dateLabel: string
  dateKey: string
}

type StadionStatus = 'ACTIVE' | 'INACTIVE'

type BookingDetailRecord = {
  fieldId: number
  bookingDate: string
  startHour: number
}

type BookingRecord = {
  bookingCode: string
  details: BookingDetailRecord[]
}

type VenueDetail = {
  id: number
  name: string
  city: string
  sport: string
  gallery: string[]
  description: string
  location: string
  price: number
  facilities: Array<{ name: string; icon?: string }>
  scheduleDays: Array<{ label: string; value: string }>
  courts: Court[]
  mapUrl?: string
}

interface ImageData {
  id: number
  imageUrl: string | null
}

interface FacilityData {
  Facility: {
    name: string
    icon?: string
  }
}

interface BookingDetailData {
  startHour: number
}

interface FieldData {
  id: number
  name: string
  description: string
  type?: string
  status: StadionStatus
  pricePerHour: number
  priceTendik?: number
  images: ImageData[]
  bookingDetails: BookingDetailData[]
}

interface OperatingHoursData {
  openHour: number
  closeHour: number
}

interface StadionData {
  id: number
  name: string
  city: string
  description: string
  location: string
  mapUrl?: string
  status: StadionStatus
  images: ImageData[]
  facilities: FacilityData[]
  fields: FieldData[]
  operatingHours: OperatingHoursData
}

const fallbackOperatingHours = { open: 6, close: 22 }

const formatDayLabel = (date: Date) => {
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  }).format(date)
}

const padHour = (value: number) => value.toString().padStart(2, '0')

const createFallbackVenue = (): VenueDetail => ({
  id: 0,
  name: 'Stadion Venue Undip',
  city: 'Lokasi belum tersedia',
  sport: 'Multi Sport',
  gallery: [],
  description: 'Deskripsi belum tersedia.',
  location: 'Lokasi belum tersedia',
  price: 0,
  facilities: [],
  scheduleDays: getNextNDays(null, 7, true),
  courts: [],
  mapUrl: undefined,
})

const buildSlotsForField = (field: FieldData, hours: { open: number; close: number }, renterType: 'UMUM' | 'TENDIK' | 'AKADEMIK' = 'UMUM'): Slot[] => {
  const booked = new Set(
    (field?.bookingDetails ?? [])
      .map((detail) => Number(detail?.startHour))
      .filter((val: number) => Number.isFinite(val))
  )

  const slots: Slot[] = []
  const openHour = Number.isFinite(hours.open) ? hours.open : fallbackOperatingHours.open
  const closeHour = Number.isFinite(hours.close) ? hours.close : fallbackOperatingHours.close

  for (let hour = openHour; hour < closeHour; hour++) {
    const next = hour + 1
    const startTime = `${padHour(hour)}:00`
    const range = `${startTime} - ${padHour(next)}:00`
    const isBooked = booked.has(hour)

    let price = 0
    if (renterType === 'AKADEMIK') {
      price = 0
    } else if (renterType === 'TENDIK' && field?.priceTendik) {
      price = field.priceTendik
    } else {
      price = Number(field?.pricePerHour || 0)
    }

    slots.push({
      start: startTime,
      range,
      status: isBooked ? 'Booked' : 'Available',
      price: !isBooked ? price : undefined,
      highlight: !isBooked && hour === openHour,
    })
  }

  return slots
}

const mapFieldToCourt = (field: FieldData, hours: { open: number; close: number }, renterType: 'UMUM' | 'TENDIK' | 'AKADEMIK'): Court => {
  const rawImages = field?.images?.map((img) => img?.imageUrl).filter((url): url is string => Boolean(url)) || []

  return {
    id: Number(field?.id) || 0,
    name: field?.name ?? 'Lapangan',
    surface: field?.description || 'Permukaan belum tersedia',
    type: field?.type,
    status: field?.status === 'ACTIVE' ? 'Ready' : 'Maintenance',
    image: rawImages[0] || '',
    gallery: rawImages,
    slots: buildSlotsForField(field, hours, renterType),
  }
}

const buildVenueFromGraphQL = (stadion?: StadionData, renterType: 'UMUM' | 'TENDIK' | 'AKADEMIK' = 'UMUM'): VenueDetail => {
  const fallback = createFallbackVenue()
  if (!stadion) return fallback

  const gallery = stadion.images?.map((img) => img?.imageUrl).filter((url): url is string => Boolean(url)) || []
  const facilities =
    stadion.facilities
      ?.map((item) => ({
        name: item?.Facility?.name || '',
        icon: item?.Facility?.icon || undefined
      }))
      .filter((fac) => Boolean(fac.name)) ?? []

  const fields = Array.isArray(stadion.fields) ? stadion.fields : []
    
  const prices = fields
    .map((field) => Number(field?.pricePerHour))
    .filter((val: number) => Number.isFinite(val) && val >= 0)

  const hours = {
    open: Number(stadion.operatingHours?.openHour ?? fallbackOperatingHours.open),
    close: Number(stadion.operatingHours?.closeHour ?? fallbackOperatingHours.close),
  }

  return {
    id: Number(stadion.id) || fallback.id,
    name: stadion.name ?? fallback.name,
    city: stadion.city ?? fallback.city,
    sport: fields.length ? 'Multi Sport' : fallback.sport,
    gallery,
    description: stadion.description || fallback.description,
    location: stadion.location || fallback.location,
    price: prices.length ? Math.min(...prices) : fallback.price,
    facilities: facilities.length ? facilities : fallback.facilities,
    scheduleDays: getNextNDays(null, 7, true),
    courts: fields.length ? fields.map((field: any) => mapFieldToCourt(field, hours, renterType)) : fallback.courts,
    mapUrl: stadion.mapUrl ?? undefined,
  }
}

const route = useRoute()
const stadionId = Number(route.params.id ?? 0)

const { data: stadionData } = await useAsyncData<StadionData>(
  `stadion-detail-${stadionId}`,
  () => $fetch<StadionData>(`/api/stadions/${stadionId}`)
)

if (stadionData.value?.status === 'INACTIVE') {
  throw createError({
    statusCode: 404,
    statusMessage: 'Venue tidak tersedia',
    fatal: true
  })
}

const renterType = ref<'UMUM' | 'TENDIK' | 'AKADEMIK'>('UMUM')
const venue = computed(() => buildVenueFromGraphQL(stadionData.value, renterType.value))

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount)
}

useHead({
  title: computed(() => `${venue.value.name} - VENUE UNDIP`),
  meta: [
    { name: 'description', content: computed(() => venue.value.description || `Booking lapangan di ${venue.value.name}`) },
    { property: 'og:title', content: computed(() => `${venue.value.name} - VENUE UNDIP`) },
    { property: 'og:description', content: computed(() => venue.value.description || `Booking lapangan di ${venue.value.name}`) },
    { property: 'og:image', content: computed(() => venue.value.gallery[0] || '') },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: computed(() => `${venue.value.name} - VENUE UNDIP`) },
    { name: 'twitter:description', content: computed(() => venue.value.description || `Booking lapangan di ${venue.value.name}`) },
    { name: 'twitter:image', content: computed(() => venue.value.gallery[0] || '') },
  ]
})

const activeGalleryIndex = ref(0)
const galleryLength = computed(() => venue.value?.gallery?.length ?? 0)

watch(venue, () => { activeGalleryIndex.value = 0 })

const nextGallery = () => {
  const len = galleryLength.value
  if (!len) return
  activeGalleryIndex.value = (activeGalleryIndex.value + 1) % len
}

const prevGallery = () => {
  const len = galleryLength.value
  if (!len) return
  activeGalleryIndex.value = (activeGalleryIndex.value - 1 + len) % len
}

const galleryTouchStartX = ref<number | null>(null)

const onGalleryTouchStart = (e: TouchEvent) => {
  if (galleryLength.value <= 1) return
  galleryTouchStartX.value = e.touches?.[0]?.clientX ?? null
}

const onGalleryTouchEnd = (e: TouchEvent) => {
  if (galleryLength.value <= 1) return
  const startX = galleryTouchStartX.value
  galleryTouchStartX.value = null
  if (startX == null) return

  const endX = e.changedTouches?.[0]?.clientX
  if (endX == null) return

  const deltaX = endX - startX
  if (Math.abs(deltaX) < UI.SWIPE_THRESHOLD) return
  if (deltaX < 0) nextGallery()
  else prevGallery()
}

const courtTouchStartX = ref<Record<number, number | null>>({})

const onCourtTouchStart = (courtId: number, length: number, e: TouchEvent) => {
  if (length <= 1) return
  courtTouchStartX.value[courtId] = e.touches?.[0]?.clientX ?? null
}

const onCourtTouchEnd = (courtId: number, length: number, e: TouchEvent) => {
  if (length <= 1) return
  const startX = courtTouchStartX.value[courtId]
  courtTouchStartX.value[courtId] = null
  if (startX == null) return

  const endX = e.changedTouches?.[0]?.clientX
  if (endX == null) return

  const deltaX = endX - startX
  if (Math.abs(deltaX) < UI.SWIPE_THRESHOLD) return
  if (deltaX < 0) nextCourtImage(courtId, length)
  else prevCourtImage(courtId, length)
}

const selectedDate = ref<string>(getNextNDays(null, 7, true)[0]?.value ?? '')
const expandedCourts = ref<Record<number, boolean>>({})
const courtImageIndices = ref<Record<number, number>>({})

const selectedSlots = ref<SelectedSlot[]>([])
const isDrawerOpen = ref(false)
const isInfoModalOpen = ref(false)

const router = useRouter()
const selectionDisabled = true

const bookingCart = useState('booking-cart', () => ({
  stadionId: null as number | null,
  stadionName: '',
  slots: [] as SelectedSlot[],
}))

const selectedDayIndex = computed(() => {
  const index = venue.value?.scheduleDays.findIndex(day => day.value === selectedDate.value) ?? -1
  return index >= 0 ? index : 0
})

const selectedDayLabel = computed(() => venue.value?.scheduleDays[selectedDayIndex.value]?.label ?? '')
const selectedDayKey = computed(() => toDateKey(selectedDate.value))

const fullSelectedDateLabel = computed(() => {
  if (!selectedDate.value) return ''
  const date = new Date(selectedDate.value)
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date)
})

const selectedSlotCount = computed(() => selectedSlots.value.length)

const slotKey = (courtId: number, range: string) => `${courtId}-${range}-${selectedDayKey.value ?? 'none'}`

const isSlotSelected = (courtId: number, range: string) =>
  selectedSlots.value.some(slot => slot.key === slotKey(courtId, range))

const toggleCourt = (courtId: number) => {
  expandedCourts.value = {
    ...expandedCourts.value,
    [courtId]: !expandedCourts.value[courtId],
  }
}

const nextCourtImage = (courtId: number, length: number) => {
  if (!length) return
  const current = courtImageIndices.value[courtId] ?? 0
  courtImageIndices.value[courtId] = (current + 1) % length
}

const prevCourtImage = (courtId: number, length: number) => {
  if (!length) return
  const current = courtImageIndices.value[courtId] ?? 0
  courtImageIndices.value[courtId] = (current - 1 + length) % length
}

const getCourtImageUrl = (court: Court) => {
  const index = courtImageIndices.value[court.id] ?? 0
  return court.gallery[index] || court.image
}

const isCourtExpanded = (courtId: number) => expandedCourts.value[courtId] ?? false

const isDateEqual = (date1: string, date2: string) => {
  return toDateKey(date1) === toDateKey(date2)
}

const availableCount = (court: Court) => court.slots.filter((slot) => slot.status === 'Available').length

const availableCountWithServer = (court: Court) => {
  return court.slots.filter((slot) => {
    const startHour = Number(slot.start.split(':')[0])
    const isBooked = slot.status === 'Booked' || isSlotBookedFromServer(court.id, Number.isNaN(startHour) ? 0 : startHour)
    return !isBooked
  }).length
}

const isCourtFullyBooked = (court: Court) => {
  return court.slots.every((slot) => {
    const startHour = Number(slot.start.split(':')[0])
    return slot.status === 'Booked' || isSlotBookedFromServer(court.id, Number.isNaN(startHour) ? 0 : startHour)
  })
}

const publicBookings = ref<BookingRecord[]>([])

const loadPublicBookings = async () => {
  if (!stadionId || !selectedDayKey.value) {
    publicBookings.value = []
    return
  }
  try {
    publicBookings.value = await $fetch<BookingRecord[]>('/api/public-bookings', {
      query: { stadionId, date: toUtcMidnightIso(selectedDayKey.value) },
    })
  } catch (error) {
    const parsed = parseBackendError(error)
    console.error('Failed to load bookings:', parsed.message)
    publicBookings.value = []
  }
}

onMounted(loadPublicBookings)
watch(selectedDayKey, () => loadPublicBookings())

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
  }, UI.POLLING_INTERVAL)
  
  document.addEventListener('visibilitychange', handleVisibilityChange)
  
  onBeforeUnmount(() => {
    document.removeEventListener('visibilitychange', handleVisibilityChange)
    clearInterval(pollInterval)
  })
})

const openInfoModal = () => {
  isInfoModalOpen.value = true
}

const closeInfoModal = () => {
  isInfoModalOpen.value = false
}

const isSlotBookedFromServer = (fieldId: number, startHour: number) => {
  if (!publicBookings.value || !selectedDayKey.value) return false
  return publicBookings.value.some((booking) =>
    booking.details?.some(
      detail =>
        detail.fieldId === fieldId &&
        toDateKey(detail.bookingDate) === selectedDayKey.value &&
        detail.startHour === startHour
    )
  )
}

const toggleSlotSelection = (court: Court, slot: Slot) => {
  if (slot.status === 'Booked') return

  const startHour = Number(slot.start.split(':')[0])
  if (isSlotBookedFromServer(court.id, Number.isNaN(startHour) ? 0 : startHour)) return

  if (court.status === 'Maintenance') return

  openInfoModal()
}

const removeSelectedSlot = (key: string) => {
  selectedSlots.value = selectedSlots.value.filter(slot => slot.key !== key)
}

const openDrawer = () => {
  if (selectionDisabled) return
  if (selectedSlots.value.length) {
    isDrawerOpen.value = true
  }
}

const closeDrawer = () => {
  isDrawerOpen.value = false
}

const proceedToOrder = () => {
  if (!selectedSlots.value.length || !venue.value) return
  bookingCart.value = {
    stadionId: venue.value.id,
    stadionName: venue.value.name,
    slots: selectedSlots.value.map(slot => ({ ...slot })),
  }
  isDrawerOpen.value = false
  router.push('/booking/order')
}

watch(selectedDate, () => {
  selectedSlots.value = []
  isDrawerOpen.value = false
})
</script>

<template>
  <div class="min-h-screen bg-[#f5f7fb]">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 py-4 sm:py-6">
      <NuxtLink 
        to="/" 
        class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:text-[#1f2a56] hover:border-[#1f2a56] hover:shadow-md active:scale-95"
        aria-label="Kembali ke halaman utama"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        <span>Kembali</span>
      </NuxtLink>
    </div>

    <section class="mx-auto max-w-6xl space-y-4 sm:space-y-6 px-4 sm:px-6">
      <div class="grid gap-3 lg:grid-cols-[minmax(0,2.3fr)_minmax(320px,1fr)]">
        <div
          class="relative overflow-hidden rounded-[32px] border border-white/70 bg-white shadow-md"
          @touchstart.passive="onGalleryTouchStart"
          @touchend="onGalleryTouchEnd"
        >
          <img
            v-if="venue?.gallery && venue.gallery.length > 0"
            :src="venue?.gallery[activeGalleryIndex]"
            :alt="venue?.name"
            loading="lazy"
            decoding="async"
            class="aspect-[16/9] w-full object-cover"
          >
          <div v-else class="aspect-[16/9] w-full flex items-center justify-center bg-gray-100">
            <PlaceholderImage text="Foto Stadion Belum Ditambahkan" />
          </div>

          <button
            v-if="(venue?.gallery?.length || 0) > 1"
            @click="prevGallery"
            class="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-1.5 sm:p-2.5 text-gray-700 shadow-lg hover:bg-white hover:scale-110 transition-all backdrop-blur-sm active:scale-95"
            aria-label="Foto sebelumnya"
          >
            <svg class="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            v-if="(venue?.gallery?.length || 0) > 1"
            @click="nextGallery"
            class="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-1.5 sm:p-2.5 text-gray-700 shadow-lg hover:bg-white hover:scale-110 transition-all backdrop-blur-sm active:scale-95"
            aria-label="Foto berikutnya"
          >
            <svg class="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div v-if="(venue?.gallery?.length || 0) > 1" class="absolute bottom-3 sm:bottom-4 left-0 right-0 flex justify-center gap-1.5 sm:gap-2">
            <button
              v-for="(img, idx) in venue?.gallery"
              :key="`dot-${idx}`"
              class="h-1.5 sm:h-2 rounded-full transition-all"
              :class="idx === activeGalleryIndex ? 'bg-white w-6 sm:w-8' : 'bg-white/60 w-1.5 sm:w-2 hover:bg-white/80'"
              @click="activeGalleryIndex = idx"
              :aria-label="`Lihat gambar ${idx + 1} dari ${venue.gallery.length}`"
              :aria-current="idx === activeGalleryIndex"
            />
          </div>

          <span 
            v-if="venue?.gallery && venue.gallery.length > 0" 
            class="absolute top-3 sm:top-4 right-3 sm:right-4 rounded-lg bg-black/75 backdrop-blur-sm px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold text-white"
          >
            {{ activeGalleryIndex + 1 }} / {{ venue.gallery.length }}
          </span>
        </div>

        <div class="hidden lg:grid gap-3 grid-rows-2 h-full">
          <template v-if="venue?.gallery && venue.gallery.length > 1">
            <div
              v-for="(img, idx) in venue?.gallery?.slice(1, 3)"
              :key="`thumb-${idx}`"
              class="relative w-full h-full overflow-hidden rounded-[24px] shadow-sm cursor-pointer transition-all hover:opacity-80 hover:shadow-md hover:scale-[1.02]"
              @click="activeGalleryIndex = idx + 1"
            >
              <img
                :src="img"
                :alt="`${venue?.name} preview ${idx + 1}`"
                loading="lazy"
                decoding="async"
                class="absolute inset-0 h-full w-full object-cover"
              >
            </div>
          </template>
        </div>
      </div>

      <div class="space-y-4 sm:space-y-5 rounded-xl sm:rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
        <div class="space-y-2 pb-3 sm:pb-4 border-b border-gray-100">
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">{{ venue.name }}</h1>
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
              {{ venue.description || 'Belum ada deskripsi.' }}
            </p>
          </div>

          <div class="relative rounded-lg sm:rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-white p-3 sm:p-4 border border-gray-200">
            <!-- Subtle Street Map Background Pattern -->
            <div class="absolute inset-0 opacity-[0.08] pointer-events-none">
              <svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 300" preserveAspectRatio="xMidYMid slice">
                <!-- Main roads berkelok natural -->
                <path d="M 0 150 Q 50 145, 100 150 Q 140 155, 180 150 Q 220 145, 260 140 Q 300 138, 350 140" stroke="#94a3b8" stroke-width="2.5" fill="none"/>
                <path d="M 350 140 Q 400 142, 450 145 Q 500 148, 550 150 L 600 152" stroke="#94a3b8" stroke-width="2" fill="none"/>
                
                <path d="M 180 0 Q 185 40, 180 80 Q 175 120, 180 150 Q 182 180, 185 220 Q 188 260, 190 300" stroke="#94a3b8" stroke-width="2.5" fill="none"/>
                
                <path d="M 420 0 Q 415 50, 420 100 Q 425 130, 420 160 Q 418 200, 420 240 L 420 300" stroke="#94a3b8" stroke-width="2" fill="none"/>
                
                <!-- Secondary roads berkelok -->
                <path d="M 0 80 Q 40 78, 80 80 Q 120 82, 160 85 Q 200 83, 240 80 Q 280 78, 320 80" stroke="#94a3b8" stroke-width="1.5" fill="none"/>
                
                <path d="M 100 50 Q 102 70, 100 90 Q 98 120, 100 150 Q 102 180, 105 210" stroke="#94a3b8" stroke-width="1.5" fill="none"/>
                
                <path d="M 0 220 Q 60 218, 120 220 Q 180 222, 240 220 Q 300 218, 360 220 Q 420 222, 480 220 L 600 218" stroke="#94a3b8" stroke-width="1.5" fill="none"/>
                
                <!-- Small connecting roads berkelok -->
                <path d="M 350 140 Q 360 120, 370 100 Q 380 85, 390 80" stroke="#94a3b8" stroke-width="1" fill="none"/>
                
                <path d="M 260 80 Q 270 100, 280 120 Q 285 135, 280 150" stroke="#94a3b8" stroke-width="1" fill="none"/>
                
                <path d="M 500 80 Q 490 110, 485 140 Q 483 170, 490 200" stroke="#94a3b8" stroke-width="1" fill="none"/>
                
                <path d="M 300 220 Q 310 200, 320 180 Q 330 160, 340 145" stroke="#94a3b8" stroke-width="1" fill="none"/>
                
                <!-- Intersection points (biru) -->
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
                <span class="text-xs sm:text-sm text-gray-600">{{ venue.mapUrl || 'Lokasi belum tersedia' }}</span>
                <a
                  v-if="venue.mapUrl"
                  :href="venue.mapUrl"
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
              v-for="(facility, index) in venue.facilities" 
              :key="index" 
              class="flex items-center gap-2 sm:gap-2.5 text-xs sm:text-sm bg-gray-50 rounded-lg px-2.5 sm:px-3 py-2 sm:py-2.5 border border-gray-100 hover:bg-white hover:border-gray-300 hover:shadow-sm hover:scale-[1.02] transition-all"
            >
              <div class="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg bg-gray-100 border border-gray-200 text-[#1f2a56]">
                <Icon
                  v-if="facility.icon"
                  :icon="facility.icon"
                  class="h-3.5 w-3.5 sm:h-4 sm:w-4"
                />
                <span v-else class="w-1.5 h-1.5 rounded-full bg-[#1f2a56]"></span>
              </div>
              <span class="font-medium">{{ facility.name || facility }}</span>
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

          <SmartDatePicker v-model="selectedDate" :allow-past-dates="false" />
        </div>

        <!-- Informasi Tanggal Terpilih -->
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
                <p class="text-sm sm:text-base font-bold text-gray-900 truncate">{{ fullSelectedDateLabel }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="px-4 sm:px-6 py-4 sm:py-5 bg-gray-50/30 border-b border-gray-200">
          <div class="flex flex-wrap items-center gap-2 sm:gap-2.5">
            <button
              v-for="(day, index) in venue?.scheduleDays.slice(0, 3)"
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
              v-for="(day, index) in venue?.scheduleDays.slice(3)"
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

        <div 
          v-if="!venue?.courts || venue.courts.length === 0"
          class="flex flex-col items-center justify-center py-16 px-4"
        >
          <div class="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
            <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">Belum Ada Lapangan Tersedia</h3>
          <p class="text-sm text-gray-500 text-center max-w-md mb-6">
            Saat ini venue belum memiliki lapangan yang dapat dibooking. Silakan hubungi pengelola untuk informasi lebih lanjut.
          </p>
          <NuxtLink 
            to="/" 
            class="inline-flex items-center gap-2 rounded-xl bg-[#1f2a56] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#162347] transition-all active:scale-95"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span>Kembali ke Beranda</span>
          </NuxtLink>
        </div>

        <div
          v-for="court in venue?.courts"
          :key="court.id"
          class="border-b border-gray-100 last:border-b-0"
        >
          <div class="p-4 sm:p-5">
            <div class="flex flex-col gap-5 rounded-3xl border border-gray-200 p-5 lg:flex-row">
              <div
                class="relative w-full overflow-hidden rounded-[28px] border border-white shadow lg:w-[420px]"
                @touchstart.passive="onCourtTouchStart(court.id, court.gallery.length, $event)"
                @touchend="onCourtTouchEnd(court.id, court.gallery.length, $event)"
              >
                <img
                  v-if="getCourtImageUrl(court) && !getCourtImageUrl(court).includes('placeholder')"
                  :src="getCourtImageUrl(court)"
                  :alt="court.name"
                  loading="lazy"
                  decoding="async"
                  class="h-56 w-full object-cover transition-transform duration-500"
                >
                <div v-else class="h-56 w-full flex items-center justify-center bg-gray-100">
                  <PlaceholderImage text="Foto Lapangan Belum Ditambahkan" />
                </div>

                <template v-if="court.gallery && court.gallery.length > 1">
                  <button
                    @click.stop="prevCourtImage(court.id, court.gallery.length)"
                    aria-label="Foto sebelumnya"
                    class="absolute left-2 sm:left-2.5 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-1.5 sm:p-2 text-gray-700 hover:bg-white hover:scale-110 shadow-lg transition-all backdrop-blur-sm active:scale-95"
                  >
                    <svg class="h-3.5 w-3.5 sm:h-4 sm:w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    @click.stop="nextCourtImage(court.id, court.gallery.length)"
                    aria-label="Foto berikutnya"
                    class="absolute right-2 sm:right-2.5 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-1.5 sm:p-2 text-gray-700 hover:bg-white hover:scale-110 shadow-lg transition-all backdrop-blur-sm active:scale-95"
                  >
                    <svg class="h-3.5 w-3.5 sm:h-4 sm:w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </template>

                <span 
                  v-if="court.gallery && court.gallery.length > 0" 
                  class="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 rounded-lg bg-black/75 backdrop-blur-sm px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold text-white"
                >
                  {{ (courtImageIndices[court.id] ?? 0) + 1 }} / {{ court.gallery.length }}
                </span>
              </div>

              <div class="flex-1 space-y-3 sm:space-y-4">
                <div class="space-y-2">
                  <h4 class="text-lg sm:text-xl font-bold text-gray-900">
                    {{ court.name }}
                  </h4>
                  <div class="flex items-center gap-2 flex-wrap">
                    <span
                      v-if="court.status !== 'Ready'"
                      class="inline-flex items-center gap-1.5 rounded-lg px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs font-semibold border bg-amber-50 text-amber-700 border-amber-200"
                    >
                      <span class="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                      Maintenance
                    </span>
                    <span
                      v-else-if="isCourtFullyBooked(court)"
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
                        v-if="availableCountWithServer(court) > 0"
                        class="inline-flex items-center gap-1 rounded-lg px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs font-bold bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-sm"
                      >
                        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                        </svg>
                        {{ availableCountWithServer(court) }} Slot Tersedia
                      </span>
                    </template>
                  </div>
                  <p class="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-2 sm:line-clamp-none">
                    {{ court.surface || 'Tidak ada deskripsi tersedia.' }}
                  </p>
                </div>

                <div class="flex flex-wrap items-center gap-2 sm:gap-3">
                  <button
                    class="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-[#1f2a56] px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white shadow hover:bg-[#162347] transition-all active:scale-95"
                    @click="toggleCourt(court.id)"
                    :aria-expanded="isCourtExpanded(court.id)"
                    :aria-controls="`court-schedule-${court.id}`"
                    :aria-label="`${isCourtExpanded(court.id) ? 'Sembunyikan' : 'Lihat'} jadwal ${court.name}`"
                  >
                    <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{{ isCourtExpanded(court.id) ? 'Sembunyikan Jadwal' : 'Lihat Jadwal' }}</span>
                    <svg 
                      class="h-3 w-3 transition-transform" 
                      :class="isCourtExpanded(court.id) ? 'rotate-180' : ''"
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
            </div>

            <transition name="expand">
              <div
                v-if="isCourtExpanded(court.id)"
                :id="`court-schedule-${court.id}`"
                class="mt-4 sm:mt-5 grid gap-2 sm:gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
                role="region"
                :aria-label="`Jadwal untuk ${court.name}`"
              >
                <button
                  v-for="slot in court.slots"
                  :key="slot.range"
                  type="button"
                  :title="
                    (slot.status === 'Booked' || isSlotBookedFromServer(court.id, Number(slot.start.split(':')[0])))
                      ? 'Slot ini sudah dibooking'
                      : court.status === 'Maintenance'
                      ? 'Lapangan sedang dalam perbaikan/maintenance'
                      : 'Klik untuk pilih slot ini'
                  "
                  :aria-label="`Slot ${slot.range}, ${slot.status === 'Booked' ? 'sudah dibooking' : court.status === 'Maintenance' ? 'maintenance' : 'tersedia'}`"
                  :aria-disabled="slot.status === 'Booked' || court.status === 'Maintenance' || isSlotBookedFromServer(court.id, Number(slot.start.split(':')[0]))"
                  class="group relative rounded-lg sm:rounded-xl border p-2 sm:p-3 text-left shadow-sm transition-all overflow-hidden"
                  :class="[
                    (slot.status === 'Booked' || isSlotBookedFromServer(court.id, Number(slot.start.split(':')[0])))
                      ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                      : court.status === 'Maintenance'
                      ? 'bg-orange-50 text-orange-400 border-orange-100 cursor-not-allowed'
                      : isSlotSelected(court.id, slot.range)
                      ? 'bg-[#1f2a56] text-white border-[#1f2a56] shadow-md ring-2 ring-[#1f2a56] ring-offset-2'
                      : 'bg-white text-gray-900 border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 hover:shadow-lg hover:shadow-emerald-500/20 hover:scale-105 active:scale-100 cursor-pointer'
                  ]"
                  @click="toggleSlotSelection(court, slot)"
                >
                  <p
                    class="text-[10px] sm:text-[0.65rem] uppercase tracking-wide font-semibold"
                    :class="[
                      (slot.status === 'Booked' || isSlotBookedFromServer(court.id, Number(slot.start.split(':')[0])))
                        ? 'text-gray-400'
                        : court.status === 'Maintenance'
                        ? 'text-orange-400'
                        : isSlotSelected(court.id, slot.range)
                        ? 'text-white/80'
                        : 'text-gray-500'
                    ]"
                  >
                    60 Menit
                  </p>
                  <p
                    class="text-sm sm:text-base font-bold mt-0.5"
                    :class="[
                      (slot.status === 'Booked' || isSlotBookedFromServer(court.id, Number(slot.start.split(':')[0])))
                        ? 'text-gray-500'
                        : court.status === 'Maintenance'
                        ? 'text-orange-600'
                        : isSlotSelected(court.id, slot.range)
                        ? 'text-white'
                        : 'text-[#1f2a56]'
                    ]"
                  >
                    {{ slot.range }}
                  </p>
                  <div class="flex items-center justify-between mt-1">
                    <p
                      v-if="slot.status === 'Booked' || isSlotBookedFromServer(court.id, Number(slot.start.split(':')[0]))"
                      class="text-[10px] sm:text-xs font-semibold text-gray-400"
                    >
                      Booked
                    </p>
                    <p
                      v-else-if="court.status === 'Maintenance'"
                      class="text-[10px] sm:text-xs font-semibold text-orange-500"
                    >
                      Maintenance
                    </p>
                    <p 
                      v-else 
                      class="text-[10px] sm:text-xs font-semibold"
                      :class="isSlotSelected(court.id, slot.range) ? 'text-white' : 'text-green-600'"
                    >
                      Available
                    </p>
                    <!-- Harga disembunyikan sesuai permintaan
                    <p 
                      v-if="slot.status !== 'Booked' && court.status !== 'Maintenance' && !isSlotBookedFromServer(court.id, Number(slot.start.split(':')[0]))"
                      class="text-[10px] sm:text-xs font-bold ml-auto mr-1"
                       :class="isSlotSelected(court.id, slot.range) ? 'text-white' : 'text-gray-700'"
                    >
                      {{ slot.price !== undefined ? (slot.price === 0 ? 'Gratis' : formatCurrency(slot.price)) : '' }}
                    </p>
                    -->
                    
                    <svg
                      v-if="isSlotSelected(court.id, slot.range)"
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

    <!-- Info Modal (moved to component) -->
    <InfoModal
      v-model="isInfoModalOpen"
      title="Informasi"
      :message="`Maaf, untuk saat ini Anda hanya bisa melihat sisa kuota booking lapangan. Untuk booking, silahkan untuk datang langsung ke venue terkait.`"
    />

    <Teleport to="body">
      <transition name="fade">
        <div v-if="isDrawerOpen" class="fixed inset-0 z-40">
        <div class="absolute inset-0 bg-black/40" @click="closeDrawer"></div>

        <div class="absolute inset-y-0 right-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
          <header class="flex items-center justify-between border-b border-gray-100 px-6 py-5">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.4em] text-[#1f2a56]">Jadwal Dipilih</p>
              <p class="text-sm text-gray-500">{{ selectedDayLabel }}</p>
            </div>

            <button class="text-gray-500 hover:text-gray-800" @click="closeDrawer">
              <span class="sr-only">Tutup</span>
              <svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </header>

          <section class="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            <p v-if="!selectedSlots.length" class="text-sm text-gray-500">
              Belum ada jadwal yang dipilih. Silakan pilih slot tersedia.
            </p>

            <article
              v-for="item in selectedSlots"
              :key="item.key"
              class="flex items-start justify-between rounded-xl border border-gray-200 bg-[#f4f6fc] px-4 py-3 text-sm text-[#1f2a56]"
            >
              <div>
                <p class="text-sm font-semibold">{{ item.courtName }}</p>
                <p>{{ item.dateLabel }} &bull; {{ item.range }}</p>
                <p class="mt-1 font-semibold">Rp{{ item.price.toLocaleString('id-ID') }}</p>
              </div>

              <button class="text-[#b91c1c] hover:text-red-700" @click="removeSelectedSlot(item.key)">
                <span class="sr-only">Hapus slot</span>
                <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 7h12M10 11v6m4-6v6M9 7l.867-1.8A1 1 0 0 1 10.79 5h2.42a1 1 0 0 1 .923.2L15 7" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M7 7v11a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V7" />
                </svg>
              </button>
            </article>
          </section>

          <footer class="border-t border-gray-100 px-6 py-4">
            <button
              type="button"
              class="w-full rounded-xl bg-[#1f2a56] px-4 py-3 text-sm font-semibold text-white shadow hover:bg-[#162347] disabled:cursor-not-allowed disabled:bg-gray-300"
              :disabled="!selectedSlots.length"
              @click="proceedToOrder"
            >
              Selanjutnya
            </button>
          </footer>
        </div>
      </div>
    </transition>
  </Teleport>
  </div>
</template>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.2s ease;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.9);
}
</style>