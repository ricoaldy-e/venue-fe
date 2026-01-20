<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { useAdminLayout } from '~/composables/useAdminLayout'
import { useConfirmation } from '~/composables/useConfirmation'

const { options } = useAppOptions()
const venueName = computed(() => options.value.data?.name || 'Venue UNDIP')

type NavItem = {
  label: string
  icon: 'dashboard' | 'stadium' | 'field' | 'facility' | 'schedule' | 'booking' | 'profile' | 'logout' | 'option' | 'more'
  to?: string
  action?: 'logout'
  exact?: boolean
}

const router = useRouter()
const route = useRoute()
const logoutLoading = ref(false)
const isMenuLainnyaOpen = ref(false)
const { isSidebarOpen, closeSidebar } = useAdminLayout()
const { confirm } = useConfirmation()

const primaryNav: NavItem[] = [
  { label: 'Dashboard', icon: 'dashboard', to: '/admin', exact: true },
  { label: 'Booking', icon: 'booking', to: '/admin/bookings' },
]

const menuLainnya: NavItem[] = [
  { label: 'Stadion', icon: 'stadium', to: '/admin/stadiums' },
  { label: 'Lapangan', icon: 'field', to: '/admin/fields' },
  { label: 'Fasilitas', icon: 'facility', to: '/admin/facilities' },
  { label: 'Jadwal', icon: 'schedule', to: '/admin/schedules' },
  { label: 'Pengaturan', icon: 'option', to: '/admin/options' },
]

const secondaryNav: NavItem[] = [
  { label: 'Logout', icon: 'logout', action: 'logout' },
]

const normalizePath = (input: string) => input.replace(/\/+$/, '') || '/'
const currentPath = computed(() => normalizePath((route as RouteLocationNormalizedLoaded).path || '/'))

const isActive = (item: NavItem) => {
  if (!item.to) return false
  const target = normalizePath(item.to)
  if (item.exact) return currentPath.value === target
  return currentPath.value === target || currentPath.value.startsWith(`${target}/`)
}

const isMenuLainnyaActive = computed(() => {
  return menuLainnya.some(item => isActive(item))
})

if (isMenuLainnyaActive.value) {
  isMenuLainnyaOpen.value = true
}

const handleNavClick = () => {
  if (window.innerWidth < 1024) closeSidebar()
}

const toggleMenuLainnya = () => {
  isMenuLainnyaOpen.value = !isMenuLainnyaOpen.value
}

const handleAction = async (item: NavItem) => {
    if (item.action === 'logout') {
    const isConfirmed = await confirm({
      title: 'Konfirmasi Logout',
      message: 'Apakah Anda yakin ingin keluar dari aplikasi?',
      confirmText: 'Logout',
      cancelText: 'Batal',
      type: 'danger'
    })

    if (!isConfirmed) return

    if (logoutLoading.value) return
    logoutLoading.value = true
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
    } catch (error) {
      console.error('Failed to logout', error)
    } finally {
      logoutLoading.value = false
      await router.push('/admin/login')
      handleNavClick()
    }
  }
}
</script>

<template>
  <aside
    class="bg-ds-blue-900 text-white flex flex-col justify-between h-full fixed inset-y-0 left-0 z-[70] w-64 transition-all duration-300 ease-in-out border-r border-ds-blue-800"
    :class="[isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0']"
  >
    <div class="px-6 py-7 border-b border-ds-blue-800">
      <div class="flex items-center gap-3">
        <img
          src="~/assets/images/VENUE-UNDIP-LOGO.png"
          alt="Venue UNDIP Logo"
          class="h-11 w-11 object-contain drop-shadow-lg"
        />
        <div class="flex flex-col">
          <p class="font-bold uppercase text-base text-white leading-tight tracking-wide">{{ venueName }}</p>
          <p class="text-xs text-blue-200/90 leading-tight font-medium">Admin Panel</p>
        </div>
      </div>
    </div>

    <nav aria-label="Admin utama" class="px-4 py-6 flex-1 overflow-y-auto">
      <p class="px-3 mb-3 text-[10px] uppercase tracking-widest font-bold text-blue-400">Main Menu</p>
      <ul class="space-y-1">
        <li v-for="item in primaryNav" :key="item.label">
          <NuxtLink
            :to="item.to"
            @click="handleNavClick"
            class="group relative flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200"
            :class="[
              isActive(item)
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-blue-200 hover:bg-ds-blue-800 hover:text-white'
            ]"
            :aria-current="isActive(item) ? 'page' : undefined"
          >
            <span
              v-if="isActive(item)"
              class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"
            ></span>

            <span
              class="w-5 h-5 flex-shrink-0 transition-transform duration-200"
              :class="[isActive(item) ? 'text-white' : 'text-blue-300 group-hover:text-white']"
            >
              <svg v-if="item.icon === 'dashboard'" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M5 11H11V5H5V11ZM5 19H11V13H5V19ZM13 19H19V13H13V19ZM13 5V11H19V5H13Z"/></svg>

              <svg v-else-if="item.icon === 'booking'" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 3C4.9 3 4 3.9 4 5V21L12 17L20 21V5C20 3.9 19.1 3 18 3H6ZM6 5H18V17.97L12 15.2L6 17.97V5Z"/></svg>
            </span>

            <span class="flex-1 whitespace-nowrap">{{ item.label }}</span>

            <span
              v-if="isActive(item)"
              class="w-2 h-2 rounded-full bg-white shadow-sm"
            ></span>
          </NuxtLink>
        </li>

        <li>
          <button
            type="button"
            @click="toggleMenuLainnya"
            class="group w-full relative flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200"
            :class="[
              isMenuLainnyaActive
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-blue-200 hover:bg-ds-blue-800 hover:text-white'
            ]"
          >
            <span
              v-if="isMenuLainnyaActive"
              class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"
            ></span>

            <span
              class="w-5 h-5 flex-shrink-0 transition-transform duration-200"
              :class="[isMenuLainnyaActive ? 'text-white' : 'text-blue-300 group-hover:text-white']"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
              </svg>
            </span>

            <span class="flex-1 whitespace-nowrap text-left">Master</span>

            <!-- Expand/Collapse indicator -->
            <svg
              class="w-4 h-4 transition-transform duration-300 ease-out"
              :class="[isMenuLainnyaOpen ? 'rotate-180' : '', isMenuLainnyaActive ? 'text-white' : 'text-blue-300']"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- Submenu -->
          <transition
            enter-active-class="transition-all duration-200 ease-out"
            enter-from-class="opacity-0 max-h-0"
            enter-to-class="opacity-100 max-h-96"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 max-h-96"
            leave-to-class="opacity-0 max-h-0"
          >
            <ul v-show="isMenuLainnyaOpen" class="mt-1 ml-4 space-y-1 overflow-hidden">
              <li v-for="item in menuLainnya" :key="item.label">
                <NuxtLink
                  :to="item.to"
                  @click="handleNavClick"
                  class="group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
                  :class="[
                    isActive(item)
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'text-blue-200 hover:bg-ds-blue-800 hover:text-white'
                  ]"
                  :aria-current="isActive(item) ? 'page' : undefined"
                >
                  <span
                    class="w-4 h-4 flex-shrink-0 transition-transform duration-200"
                    :class="[isActive(item) ? 'text-white' : 'text-blue-300 group-hover:text-white']"
                  >
                    <svg v-if="item.icon === 'stadium'" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3C6.48 3 2 5.24 2 8V12C2 14.76 6.48 17 12 17C17.52 17 22 14.76 22 12V8C22 5.24 17.52 3 12 3ZM4 8C4 6.34 7.58 5 12 5C16.42 5 20 6.34 20 8C20 9.66 16.42 11 12 11C7.58 11 4 9.66 4 8ZM20 12C20 12.24 19.94 12.48 19.8 12.71C18.92 14.15 15.78 15 12 15C8.22 15 5.08 14.15 4.2 12.71C4.06 12.48 4 12.24 4 12V10.74C5.77 11.64 8.64 12.25 12 12.25C15.36 12.25 18.23 11.64 20 10.74V12Z"/></svg>

                    <svg v-else-if="item.icon === 'field'" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M4 5C2.9 5 2 5.9 2 7V17C2 18.1 2.9 19 4 19H20C21.1 19 22 18.1 22 17V7C22 5.9 21.1 5 20 5H4ZM4 7H11V17H4V7ZM13 7H20V17H13V7ZM9 9C8.45 9 8 9.45 8 10C8 10.55 8.45 11 9 11C9.55 11 10 10.55 10 10C10 9.45 9.55 9 9 9ZM15 9C14.45 9 14 9.45 14 10C14 10.55 14.45 11 15 11C15.55 11 16 10.55 16 10C16 9.45 15.55 9 15 9Z"/></svg>

                    <svg v-else-if="item.icon === 'facility'" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M11 19V17H13V19H11ZM11 15V13H13V15H11ZM7 15V13H9V15H7ZM7 11V9H9V11H7ZM11 11V9H13V11H11ZM15 11V9H17V11H15ZM15 7V5H17V7H15ZM11 7V5H13V7H11ZM5 7V5H7V7H5ZM5 11V9H3V11H5ZM5 15V13H3V15H5ZM5 19V17H3V19H5ZM15 19V17H17V19H15ZM19 19V17H21V19H19ZM19 15V13H21V15H19ZM19 11V9H21V11H19ZM19 7V5H21V7H19ZM15 3V5H9V3H15Z"/></svg>

                    <svg v-else-if="item.icon === 'schedule'" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7 3V5H5C3.9 5 3 5.9 3 7V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V7C21 5.9 20.1 5 19 5H17V3H15V5H9V3H7ZM5 9H19V19H5V9ZM7 11V13H12V11H7ZM13 11V13H17V11H13ZM7 15V17H12V15H7ZM13 15V17H17V15H13Z"/></svg>

                    <svg v-else-if="item.icon === 'option'" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.14 12.94c.04-.3.06-.61.06-.94c0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94L14.4 2.81c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6s3.6 1.62 3.6 3.6s-1.62 3.6-3.6 3.6z"/></svg>
                  </span>

                  <span class="flex-1 whitespace-nowrap text-xs">{{ item.label }}</span>

                  <!-- Active indicator for submenu items -->
                  <span
                    v-if="isActive(item)"
                    class="w-2 h-2 rounded-full bg-white shadow-sm"
                  ></span>
                </NuxtLink>
              </li>
            </ul>
          </transition>
        </li>
      </ul>
    </nav>

    <nav class="px-4 pb-6 border-t border-ds-blue-800" aria-label="Akun">
      <div class="pt-6">
        <ul class="space-y-1">
          <li v-for="item in secondaryNav" :key="item.label">
            <button
              v-if="!item.to"
              type="button"
              class="group w-full relative flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 text-red-300 hover:bg-red-500/10 hover:text-red-200 disabled:opacity-50 disabled:cursor-wait"
              :disabled="logoutLoading"
              @click="handleAction(item)"
            >
              <span class="w-5 h-5 flex-shrink-0 transition-all duration-200 group-hover:scale-110 opacity-80 group-hover:opacity-100">
                <svg v-if="!logoutLoading" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M16 13V11H8V8L3 12L8 16V13H16ZM20 3H12V5H20V19H12V21H20C21.1 21 22 20.1 22 19V5C22 3.9 21.1 3 20 3Z"/></svg>
                <svg v-else class="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
              </span>
              <span class="flex-1 whitespace-nowrap text-left">
                {{ logoutLoading ? 'Logging out...' : item.label }}
              </span>
            </button>
          </li>
        </ul>
      </div>
    </nav>
  </aside>
</template>