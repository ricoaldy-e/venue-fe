<template>
  <div
    v-show="isLoading"
    class="fixed top-0 left-0 right-0 z-[9999] h-1 bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg transition-all duration-200"
    :style="{ width: progress + '%' }"
  >
    <div class="h-full w-full bg-gradient-to-r from-blue-400 to-blue-500 opacity-50 animate-pulse"></div>
  </div>
</template>

<script setup lang="ts">
const isLoading = ref(false)
const progress = ref(0)
let interval: NodeJS.Timeout | null = null

const start = () => {
  isLoading.value = true
  progress.value = 0
  
  if (interval) clearInterval(interval)
  
  interval = setInterval(() => {
    if (progress.value < 90) {
      if (progress.value < 30) {
        progress.value += 10
      } 
      else if (progress.value < 60) {
        progress.value += 4
      }
      else {
        progress.value += 1
      }
    }
  }, 200)
}

const finish = () => {
  progress.value = 100
  
  if (interval) {
    clearInterval(interval)
    interval = null
  }
  
  setTimeout(() => {
    isLoading.value = false
    progress.value = 0
  }, 300)
}

const nuxtApp = useNuxtApp()

nuxtApp.hook('page:start', () => {
  start()
})

nuxtApp.hook('page:finish', () => {
  finish()
})

nuxtApp.hook('page:transition:finish', () => {
  finish()
})

nuxtApp.hook('vue:error', () => {
  finish()
})

onBeforeUnmount(() => {
  if (interval) clearInterval(interval)
})
</script>

<style scoped>
div {
  transition: width 0.2s ease-out, opacity 0.3s ease-out;
}
</style>
