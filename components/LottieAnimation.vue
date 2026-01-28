<script setup lang="ts">
import { Vue3Lottie } from 'vue3-lottie'

interface Props {
  animationData?: object
  animationPath?: string
  width?: string | number
  height?: string | number
  loop?: boolean
  autoPlay?: boolean
  speed?: number
  pauseOnHover?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '100%',
  loop: true,
  autoPlay: true,
  speed: 1,
  pauseOnHover: false
})

const lottieRef = ref<InstanceType<typeof Vue3Lottie> | null>(null)
const isLoaded = ref(false)
const hasError = ref(false)

const handleAnimationLoaded = () => {
  isLoaded.value = true
}

const handleError = () => {
  hasError.value = true
}

const play = () => lottieRef.value?.play()
const pause = () => lottieRef.value?.pause()
const stop = () => lottieRef.value?.stop()

defineExpose({ play, pause, stop })
</script>

<template>
  <div class="lottie-wrapper">
    <client-only>
      <Vue3Lottie
        v-if="!hasError"
        ref="lottieRef"
        :animation-data="animationData"
        :animation-link="animationPath"
        :width="width"
        :height="height"
        :loop="loop"
        :auto-play="autoPlay"
        :speed="speed"
        :pause-on-hover="pauseOnHover"
        @on-animation-loaded="handleAnimationLoaded"
        @on-error="handleError"
      />
    </client-only>
    
    <div v-if="hasError" class="lottie-fallback">
      <svg class="fallback-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </div>
  </div>
</template>

<style scoped>
.lottie-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.lottie-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: #94a3b8;
}

.fallback-icon {
  width: 48px;
  height: 48px;
  opacity: 0.5;
}
</style>
