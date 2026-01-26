<script setup lang="ts">
const isHydrated = ref(false)
const { fetchOptions, options } = useAppOptions()

const errorDismissed = useState<boolean>('app-error-dismissed', () => false)

await callOnce(async () => {
  await fetchOptions()
})

if (options.value.error && !errorDismissed.value) {
  throw createError({
    statusCode: 502,
    statusMessage: 'Layanan tidak tersedia. Silakan coba lagi nanti.',
    fatal: true
  })
}

onMounted(() => {
  isHydrated.value = true
})
</script>

<template>
  <div>
    <div 
      v-if="!isHydrated"
      class="loading-screen"
    >
      <div class="loading-content">
        <!-- Spinner -->
        <div class="spinner-wrapper">
          <div class="spinner">
            <div class="spinner-ring"></div>
            <div class="spinner-ring"></div>
            <div class="spinner-ring"></div>
          </div>
        </div>
        
        <!-- Loading Text -->
        <p class="loading-text">Memuat...</p>
      </div>
    </div>

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style>
#__nuxt {
  min-height: 100vh;
}

.loading-screen {
  position: fixed;
  inset: 0;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #f1f5f9 100%);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.4s ease-out;
}

.loading-content {
  text-align: center;
  animation: fadeIn 0.5s ease-out;
}

.spinner-wrapper {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
}

.spinner {
  position: relative;
  width: 100%;
  height: 100%;
}

.spinner-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 3px solid transparent;
}

.spinner-ring:nth-child(1) {
  border-top-color: #1f2a56;
  animation: spin 1.5s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite;
}

.spinner-ring:nth-child(2) {
  border-right-color: #3b82f6;
  animation: spin 1.5s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite;
  animation-delay: 0.15s;
  opacity: 0.8;
}

.spinner-ring:nth-child(3) {
  border-bottom-color: #60a5fa;
  animation: spin 1.5s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite;
  animation-delay: 0.3s;
  opacity: 0.6;
}

.loading-text {
  font-size: 15px;
  font-weight: 500;
  color: #64748b;
  margin: 0;
  letter-spacing: 0.5px;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

@media (prefers-reduced-motion: reduce) {
  .loading-screen *,
  .loading-screen *::before,
  .loading-screen *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

@media (max-width: 640px) {
  .spinner-wrapper {
    width: 64px;
    height: 64px;
  }
  
  .loading-text {
    font-size: 14px;
  }
}
</style>