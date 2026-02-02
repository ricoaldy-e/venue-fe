<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useAdminLayout } from '~/composables/useAdminLayout'
import { useConfirmation } from '~/composables/useConfirmation'
import { useAuthSession } from '~/composables/useAuthSession'

const { isSidebarOpen, closeSidebar } = useAdminLayout()
const { registerModal } = useConfirmation()
const { 
  isExpiringSoon, 
  timeRemaining, 
  refreshSession, 
  logout
} = useAuthSession()

const confirmModal = ref(null)
const showSessionWarning = ref(false)

const formattedTimeRemaining = computed(() => {
  const seconds = timeRemaining.value
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${minutes} menit ${secs} detik`
})

watch(isExpiringSoon, (expiring) => {
  if (expiring) {
    showSessionWarning.value = true
  } else {
    showSessionWarning.value = false
  }
})

const handleRefreshSession = async () => {
  await refreshSession()
  showSessionWarning.value = false
}

onMounted(() => {
  registerModal(confirmModal.value)
})


</script>

<template>
  <div class="flex min-h-screen overflow-x-clip">
    <ConfirmationModal ref="confirmModal" />
    
    <Teleport to="body">
      <div
        v-if="showSessionWarning"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      >
        <div class="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-[scale-in_0.2s_ease-out]">
          <div class="flex items-center gap-3">
            <div class="flex-shrink-0 w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
              <svg class="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Sesi Akan Berakhir</h3>
              <p class="text-sm text-gray-500">{{ formattedTimeRemaining }}</p>
            </div>
          </div>

          <!-- Message -->
          <p class="text-gray-600 text-sm">
            Sesi Anda akan berakhir dalam waktu singkat. Klik tombol di bawah untuk memperpanjang sesi atau Anda akan otomatis logout.
          </p>

          <div class="flex gap-3">
            <button
              @click="handleRefreshSession"
              class="flex-1 px-4 py-2.5 bg-blue-600 [@media(hover:hover)]:hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Perpanjang Sesi
            </button>
            <button
              @click="logout"
              class="px-4 py-2.5 bg-gray-100 [@media(hover:hover)]:hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </Teleport>
    
    <AdminSidebar />

    <div
      v-if="isSidebarOpen"
      @click="closeSidebar"
      class="fixed inset-0 z-[60] bg-black/50 lg:hidden"
      aria-hidden="true"
    />

    <div class="flex-1 min-w-0 flex flex-col lg:pl-64 min-h-screen">
      
      <AdminTopBar />

      <main class="flex-1 min-w-0 p-6 sm:p-8 bg-gray-100">
        <slot />
      </main>

      <AdminFooter />
    </div>
  </div>
</template>