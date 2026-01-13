<script setup lang="ts">
import { VALIDATION, MESSAGES, detectSQLInjection } from '~/utils/constants'
import { parseBackendError } from '~/utils/errorParser'

defineOptions({ name: 'AdminLogin' })

definePageMeta({
  layout: 'auth'
})

useHead({
  title: 'Login Admin - VENUE UNDIP',
  meta: [
    { name: 'description', content: 'Halaman login untuk administrator VENUE UNDIP' }
  ]
})

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref<string | null>(null)
const errorField = ref<'email' | 'password' | null>(null)
const passwordFieldType = ref<'password' | 'text'>('password')
const router = useRouter()
const route = useRoute()

const togglePasswordVisibility = () => {
  passwordFieldType.value =
    passwordFieldType.value === 'password' ? 'text' : 'password'
}

function validateForm(): string | null {
  errorMsg.value = null
  errorField.value = null

  const trimmedEmail = email.value.trim()

  if (!trimmedEmail) {
    errorMsg.value = 'Email harus diisi.'
    errorField.value = 'email'
    return null
  }

  if (!VALIDATION.EMAIL_REGEX.test(trimmedEmail)) {
    errorMsg.value = 'Format email tidak valid. Contoh: nama@domain.com'
    errorField.value = 'email'
    return null
  }

  if (detectSQLInjection(trimmedEmail)) {
    errorMsg.value = MESSAGES.ERROR.SQL_INJECTION
    errorField.value = 'email'
    return null
  }

  if (!password.value.trim()) {
    errorMsg.value = 'Password harus diisi.'
    errorField.value = 'password'
    return null
  }

  if (password.value.length < VALIDATION.MIN_PASSWORD_LENGTH) {
    errorMsg.value = `Password minimal harus ${VALIDATION.MIN_PASSWORD_LENGTH} karakter.`
    errorField.value = 'password'
    return null
  }

  if (detectSQLInjection(password.value)) {
    errorMsg.value = MESSAGES.ERROR.SQL_INJECTION
    errorField.value = 'password'
    return null
  }

  email.value = trimmedEmail
  return trimmedEmail
}

const onSubmit = async () => {
  const trimmedEmail = validateForm()
  if (!trimmedEmail) return

  loading.value = true
  try {
    const response = await $fetch<{ ok: boolean; admin: any }>('/api/auth/login', {
      method: 'POST',
      body: { email: trimmedEmail, password: password.value },
      credentials: 'include'
    })

    if (!response?.ok) throw new Error('Login gagal')

    await navigateTo('/admin')
  } catch (e: any) {
    const parsed = parseBackendError(e)
    errorMsg.value = parsed.message
    errorField.value = null
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center bg-ds-gradient-blue px-6 py-8 relative overflow-hidden">
    <!-- Decorative background elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-ds-blue-600/10 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-ds-blue-700/10 rounded-full blur-3xl"></div>
    </div>

    <!-- Logo and Title Section -->
    <div class="flex flex-col items-center mb-6 relative z-10 animate-fade-in">
      <div class="flex justify-center mb-3 transform transition-transform duration-300 hover:scale-105">
        <div class="relative">
          <img
            src="~/assets/images/VENUE-UNDIP-LOGO.png"
            alt="Venue UNDIP Logo"
            class="w-20 h-20 sm:w-20 sm:h-20 object-contain relative z-10 drop-shadow-2xl"
          />
        </div>
      </div>
      <h1 class="text-2xl sm:text-3xl font-bold text-ds-surface tracking-wide drop-shadow-lg">
        VENUE UNDIP
      </h1>
      <div class="mt-2 h-0.5 w-16 bg-gradient-to-r from-transparent via-white to-transparent rounded-full"></div>
    </div>

    <!-- Login Card -->
    <div
      class="flex w-full max-w-sm flex-col items-center rounded-2xl border border-white/10 bg-white/95 backdrop-blur-xl px-6 py-7 text-center shadow-2xl relative z-10 animate-slide-up"
    >
      <!-- Header -->
      <div class="mb-6">
        <h2 class="text-xl font-bold text-ds-blue-900 mb-1.5 tracking-tight">Admin Login</h2>
        <p class="text-xs text-ds-muted">
          Masukkan kredensial Anda untuk melanjutkan
        </p>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="onSubmit" class="grid gap-4 w-full text-left">
        <!-- Email Field -->
        <label class="grid gap-1.5">
          <span class="text-xs font-semibold text-ds-text flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5 text-ds-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
            Email
          </span>
          <div
            :class="[
              'relative flex items-center rounded-lg border-2 px-3 h-10 transition-all duration-300',
              errorField === 'email'
                ? 'border-red-500 bg-red-50/50 ring-4 ring-red-100'
                : 'border-gray-200 bg-gray-50/50 focus-within:border-ds-blue-600 focus-within:bg-white focus-within:ring-4 focus-within:ring-ds-blue-100'
            ]"
          >
            <input
              v-model="email"
              type="email"
              required
              placeholder="nama@email.com"
              autocomplete="email"
              class="flex-1 bg-transparent text-sm text-ds-text placeholder:text-ds-muted/60 outline-none"
            />
          </div>
        </label>

        <!-- Password Field -->
        <label class="grid gap-1.5">
          <span class="text-xs font-semibold text-ds-text flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5 text-ds-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Password
          </span>
          <div
            :class="[
              'relative flex items-center rounded-lg border-2 px-3 h-10 transition-all duration-300',
              errorField === 'password'
                ? 'border-red-500 bg-red-50/50 ring-4 ring-red-100'
                : 'border-gray-200 bg-gray-50/50 focus-within:border-ds-blue-600 focus-within:bg-white focus-within:ring-4 focus-within:ring-ds-blue-100'
            ]"
          >
            <input
              v-model="password"
              :type="passwordFieldType"
              required
              placeholder="Masukkan password Anda"
              autocomplete="current-password"
              class="flex-1 bg-transparent text-sm text-ds-text placeholder:text-ds-muted/60 outline-none pr-2"
            />
            <button
              type="button"
              class="flex items-center justify-center text-ds-muted hover:text-ds-blue-700 transition-colors duration-200 p-1 rounded-md hover:bg-ds-blue-50"
              @click="togglePasswordVisibility"
              tabindex="-1"
            >
              <svg
                v-if="passwordFieldType === 'password'"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                class="w-5 h-5"
              >
                <path
                  d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17Z"
                  fill="currentColor"
                />
                <circle cx="12" cy="12" r="2.5" fill="currentColor"/>
              </svg>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                class="w-5 h-5"
              >
                <path
                  d="M12 7C14.76 7 17 9.24 17 12C17 12.65 16.87 13.26 16.64 13.83L19.56 16.75C21.07 15.49 22.26 13.86 22.99 12C21.26 7.61 17 4.5 12 4.5C10.59 4.5 9.25 4.75 8.01 5.2L10.17 7.36C10.74 7.13 11.35 7 12 7ZM2 4.27L4.28 6.55L4.74 7.01C3.08 8.3 1.78 10.02 1 12C2.73 16.39 7 19.5 12 19.5C13.55 19.5 15.03 19.2 16.38 18.66L16.8 19.08L19.73 22L21 20.73L3.27 3L2 4.27ZM7.53 9.8L9.08 11.35C9.03 11.56 9 11.78 9 12C9 13.66 10.34 15 12 15C12.22 15 12.44 14.97 12.65 14.92L14.2 16.47C13.53 16.8 12.79 17 12 17C9.24 17 7 14.76 7 12C7 11.21 7.2 10.47 7.53 9.8Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
        </label>

        <!-- Error Message -->
        <div
          v-if="errorMsg"
          class="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 animate-shake"
        >
          <svg class="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"
            />
          </svg>
          <p class="text-xs text-red-700 font-medium flex-1">{{ errorMsg }}</p>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="loading"
          class="relative flex h-10 w-full items-center justify-center rounded-lg bg-gradient-to-r from-ds-blue-700 to-ds-blue-800 text-white font-semibold text-sm shadow-lg hover:shadow-xl hover:from-ds-blue-800 hover:to-ds-blue-900 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] overflow-hidden group"
        >
          <span class="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
          <span class="relative flex items-center gap-2">
            <svg v-if="loading" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loading ? 'Memproses...' : 'Masuk' }}
          </span>
        </button>
      </form>

      <!-- Footer Text -->
      <p class="mt-5 text-[10px] text-ds-muted/80">
        Sistem Booking Venue Olahraga Universitas Diponegoro
      </p>
    </div>

    <!-- Copyright -->
    <p class="mt-5 text-[10px] text-white/60 relative z-10">
      &copy; {{ new Date().getFullYear() }} VENUE UNDIP. All rights reserved.
    </p>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
  20%, 40%, 60%, 80% { transform: translateX(4px); }
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out;
}

.animate-slide-up {
  animation: slide-up 0.6s ease-out;
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}
</style>