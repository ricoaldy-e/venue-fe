<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: 'Cara Melakukan Booking' },
  message: { type: String, default: '' },
  showWhatsApp: { type: Boolean, default: true },
  stadiumName: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue'])

const { options } = useAppOptions()

// Phone number from options, with fallback
const phoneNumber = computed(() => options.value.data?.nohp || '+62 851 6566 0339')

// Clean phone number for WhatsApp URL (remove spaces, dashes, and ensure correct format)
const cleanPhoneNumber = computed(() => {
  let phone = phoneNumber.value.replace(/[\s\-\(\)]/g, '')
  // Convert 08xxx to 628xxx format
  if (phone.startsWith('08')) {
    phone = '62' + phone.substring(1)
  }
  // Remove leading + if present
  if (phone.startsWith('+')) {
    phone = phone.substring(1)
  }
  return phone
})

// WhatsApp URL with greeting message - includes stadium name when available
const venueName = computed(() => options.value.data?.name || 'VENUE UNDIP')
const whatsappUrl = computed(() => {
  // If stadium name is provided (from venue detail page), include it in the message
  if (props.stadiumName) {
    const message = encodeURIComponent(`Halo, saya ingin bertanya mengenai booking lapangan di ${props.stadiumName}, ${venueName.value}.`)
    return `https://wa.me/${cleanPhoneNumber.value}?text=${message}`
  }
  
  // Otherwise, just use the venue name
  const message = encodeURIComponent(`Halo, saya ingin bertanya mengenai booking lapangan di ${venueName.value}.`)
  return `https://wa.me/${cleanPhoneNumber.value}?text=${message}`
})

const close = () => {
  emit('update:modelValue', false)
}
</script>

<template>
  <Teleport to="body">
    <transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md px-4"
        @click="close"
      >
        <div
          class="relative max-w-lg w-full bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
          @click.stop
        >
          <!-- Decorative Background -->
          <div class="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-3xl"></div>
          <div class="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-green-500/10 to-emerald-500/10 rounded-full blur-2xl"></div>

          <!-- Close Button -->
          <button
            @click="close"
            class="absolute top-4 right-4 z-10 inline-flex items-center justify-center h-8 w-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-all duration-200 hover:scale-110"
            aria-label="Tutup modal"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>

          <div class="relative p-6 sm:p-8">
            <!-- Header with Icon -->
            <div class="text-center mb-6">
              <div class="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-[#1f2a56] to-[#0f1a3c] shadow-lg shadow-[#1f2a56]/25 mb-4">
                <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 class="text-xl sm:text-2xl font-bold text-gray-900">{{ title }}</h3>
              <p v-if="message" class="text-gray-600 text-sm mt-2 leading-relaxed" v-html="message"></p>
            </div>
            <!-- Two Options -->
            <div class="space-y-3 mb-4">
              <!-- Option 1: Visit Venue -->
              <div class="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200">
                <div class="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-white shadow-sm border border-gray-200">
                  <svg class="h-5 w-5 text-[#1f2a56]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                </div>
                <div class="flex-1">
                  <h4 class="font-semibold text-gray-900 text-sm">Datang Langsung ke Venue</h4>
                  <p class="text-xs text-gray-600 mt-0.5">Kunjungi lokasi dan temui operator untuk melakukan booking secara langsung.</p>
                </div>
              </div>

              <!-- Option 2: WhatsApp -->
              <div v-if="showWhatsApp" class="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
                <div class="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-white shadow-sm border border-green-200">
                  <svg class="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <div class="flex-1">
                  <h4 class="font-semibold text-gray-900 text-sm">Hubungi Operator via WhatsApp</h4>
                  <p class="text-xs text-gray-600 mt-0.5">Tanyakan ketersediaan dan lakukan koordinasi booking dengan operator.</p>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row gap-3">
              <!-- WhatsApp Button -->
              <a
                v-if="showWhatsApp"
                :href="whatsappUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#25D366] to-[#128C7E] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-green-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-0.5 active:translate-y-0"
              >
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Hubungi Operator
              </a>
              
              <!-- Close Button -->
              <button
                @click="close"
                class="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1f2a56] to-[#0f1a3c] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#1f2a56]/20 transition-all duration-300 hover:shadow-xl hover:shadow-[#1f2a56]/30 hover:-translate-y-0.5 active:translate-y-0"
              >
                Saya Mengerti
                <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
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
