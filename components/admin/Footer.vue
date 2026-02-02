<script setup lang="ts">
import { computed } from 'vue'

const { options } = useAppOptions()
const venueName = computed(() => options.value.data?.name || 'VENUE UNDIP')
</script>

<template>
  <footer class="relative bg-gradient-to-br from-gray-50 via-white to-gray-50 border-t border-gray-200/80 shadow-inner">
    <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMCwwLDAsMC4wMikiLz48L3N2Zz4=')] opacity-40"></div>
    
    <div class="relative max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div class="flex items-center gap-3">
          <img
            src="~/assets/images/VENUE-UNDIP-LOGO.png"
            alt="Venue UNDIP Logo"
            class="h-8 w-8 object-contain drop-shadow-sm"
          />
          <div class="flex flex-col">
            <p class="text-sm font-bold text-gray-900 leading-tight">{{ venueName }}</p>
            <p class="text-xs text-gray-500 leading-tight">
              &copy; {{ new Date().getFullYear() }} Admin Panel v1.0
            </p>
          </div>
        </div>

        <!-- Right: Quick Info -->
        <div class="flex items-center gap-6 text-xs text-gray-600">
          <div class="flex items-center gap-1.5 group cursor-help" title="System Status">
            <div class="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <span class="font-medium [@media(hover:hover)]:group-hover:text-green-600 transition-colors">System Online</span>
          </div>
          <span class="hidden sm:inline text-gray-400">•</span>
          <p class="hidden sm:block font-medium text-gray-500">
            Dikembangkan dengan <span class="text-red-500">❤</span> untuk Universitas Diponegoro
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>