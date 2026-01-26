<template>
  <div class="date-picker-wrapper">
    <button
      @click.stop="togglePicker"
      class="inline-flex items-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold transition-all border bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm active:scale-95"
      ref="triggerButton"
    >
      <svg class="w-4 h-4 sm:w-4.5 sm:h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <span class="hidden sm:inline">Pilih Tanggal</span>
      <span class="sm:hidden">Kalender</span>
    </button>

    <Teleport to="body">
      <transition name="dropdown">
        <div
          v-if="isOpen"
          ref="popoverContent"
          :style="popoverStyles"
          @click.stop
          class="fixed z-50 w-[280px] sm:w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
        >
          <div class="flex items-center justify-between px-4 py-3 bg-[#1f2a56] text-white">
            <button
              @click="prevMonth"
              class="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span class="text-sm font-semibold">{{ currentMonth }}</span>
            <button
              @click="nextMonth"
              class="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div class="p-3 sm:p-4">
            <div class="grid grid-cols-7 gap-1 mb-2">
              <div
                v-for="day in ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']"
                :key="day"
                class="text-center text-xs font-semibold text-gray-600 py-1"
              >
                {{ day }}
              </div>
            </div>

            <div class="grid grid-cols-7 gap-1">
              <button
                v-for="(item, index) in calendarDays"
                :key="index"
                :disabled="!item.date || isDatePast(item.date)"
                @click="selectDate(item.date)"
                class="aspect-square rounded-lg text-sm font-medium transition-all"
                :class="[
                  !item.date ? 'invisible' : '',
                  isDatePast(item.date) 
                  ? 'text-gray-400 bg-gray-100 cursor-not-allowed opacity-50' 
                  : isDateSelected(item.date)
                  ? 'bg-[#1f2a56] text-white shadow-md scale-105'
                  : isDatePastOrToday(item.date) && props.allowPastDates
                  ? 'text-gray-500 bg-gray-50 border border-gray-300 hover:bg-gray-100 hover:border-gray-400 hover:scale-105 active:scale-95'
                  : 'text-gray-700 hover:bg-gray-100 hover:scale-105 active:scale-95'
                ]"
              >
                {{ item.day }}
              </button>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>

    <div
      v-if="isOpen"
      class="fixed inset-0 z-40"
      @click="closePicker"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { getTodayInWib } from '~/utils/dateHelpers'

interface Props {
  modelValue: string
  minDate?: Date
  maxDate?: Date
  allowPastDates?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isOpen = ref(false)
const triggerButton = ref<HTMLElement>()
const popoverContent = ref<HTMLElement>()
const datePickerDate = ref(new Date())
const popoverStyles = ref({
  top: '0px',
  left: '0px',
})

const currentMonth = computed(() => {
  const date = datePickerDate.value
  return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta' })
})

const calendarDays = computed(() => {
  const year = datePickerDate.value.getFullYear()
  const month = datePickerDate.value.getMonth()
  
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDayOfWeek = firstDay.getDay()
  
  const days = []
  
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push({ day: null, date: null })
  }
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day)
    days.push({ day, date })
  }
  
  return days
})

function toLocalDateKey(value?: string | Date | null) {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function isDatePast(date: Date | null) {
  if (!date) return false
  if (props.allowPastDates) return false
  // Use WIB timezone for consistent "today" comparison across all Indonesian timezones
  const today = getTodayInWib()
  return date <= today
}

function isDatePastOrToday(date: Date | null) {
  if (!date) return false
  // Use WIB timezone for consistent "today" comparison across all Indonesian timezones
  const today = getTodayInWib()
  return date <= today
}

function isDateSelected(date: Date | null) {
  if (!date || !props.modelValue) return false
  return toLocalDateKey(date) === toLocalDateKey(props.modelValue)
}

function prevMonth() {
  const date = new Date(datePickerDate.value)
  date.setMonth(date.getMonth() - 1)
  datePickerDate.value = date
}

function nextMonth() {
  const date = new Date(datePickerDate.value)
  date.setMonth(date.getMonth() + 1)
  datePickerDate.value = date
}

function selectDate(date: Date | null) {
  if (!date) return
  
  if (!props.allowPastDates) {
    // Use WIB timezone for consistent "today" comparison across all Indonesian timezones
    const today = getTodayInWib()
    if (date <= today) return
  }
  
  // Format date with WIB timezone (UTC+7) for consistency with Indonesia/Semarang timezone
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const wibDateString = `${year}-${month}-${day}T12:00:00.000+07:00`
  emit('update:modelValue', wibDateString)
  closePicker()
}

function togglePicker() {
  isOpen.value ? closePicker() : openPicker()
}

function openPicker() {
  isOpen.value = true
  nextTick(() => {
    updatePopoverPosition()
  })
}

function closePicker() {
  isOpen.value = false
}

function updatePopoverPosition() {
  if (!triggerButton.value || !popoverContent.value) return

  const triggerRect = triggerButton.value.getBoundingClientRect()
  const popoverRect = popoverContent.value.getBoundingClientRect()
  
  let top = triggerRect.bottom + 8
  let left = triggerRect.right - popoverRect.width
  
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const padding = 16
  
  if (left + popoverRect.width > viewportWidth - padding) {
    left = viewportWidth - popoverRect.width - padding
  }
  
  if (left < padding) {
    left = padding
  }
  
  if (top + popoverRect.height > viewportHeight - padding) {
    top = triggerRect.top - popoverRect.height - 8
  }
  
  popoverStyles.value = {
    top: `${top}px`,
    left: `${left}px`,
  }
}

function handleWindowResize() {
  if (isOpen.value) {
    updatePopoverPosition()
  }
}

function handleScroll() {
  if (isOpen.value) {
    closePicker()
  }
}

watch(isOpen, (newVal) => {
  if (newVal) {
    window.addEventListener('resize', handleWindowResize)
    window.addEventListener('scroll', handleScroll, true)
  } else {
    window.removeEventListener('resize', handleWindowResize)
    window.removeEventListener('scroll', handleScroll, true)
  }
})

onMounted(() => {
  const selectedDate = props.modelValue
  if (selectedDate) {
    datePickerDate.value = new Date(selectedDate)
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', handleWindowResize)
  window.removeEventListener('scroll', handleScroll, true)
})
</script>

<style scoped>
.date-picker-wrapper {
  position: relative;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
