<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFetch } from 'nuxt/app'
import { useAdminLayout } from '~/composables/useAdminLayout'
import { useConfirmation } from '~/composables/useConfirmation'

const route = useRoute()
const router = useRouter()
const { toggleSidebar, isSidebarOpen } = useAdminLayout()
const { confirm } = useConfirmation()

type MeResponse = { ok: boolean; admin: { name: string; email: string } | null }
const { data: me } = await useFetch<MeResponse>('/api/auth/me', { method: 'GET' })

// --- PROFILE LOGIC (COMMENTED OUT) ---
/*
const adminName = computed(() => me.value?.admin?.name || 'Admin User')
const adminEmail = computed(() => me.value?.admin?.email || 'admin@example.com')
const adminInitials = computed(() => {
  const parts = adminName.value.trim().split(/\s+/)
  const ini = (parts[0]?.[0] || '') + (parts[1]?.[0] || '')
  return (ini || 'A').toUpperCase()
})

const profileMenu = ref<HTMLDetailsElement | null>(null)

const onProfileToggle = () => {
}

const handleGlobalPointerDown = (e: Event) => {
}
*/

const nameMapping: Record<string, string> = {
  'stadiums': 'Stadion',
  'fields': 'Lapangan',
  'facilities': 'Fasilitas',
  'bookings': 'Booking',
  'schedules': 'Jadwal',
  'create': 'Tambah Baru',
  'edit': 'Edit',
  'detail': 'Riwayat',
  'history': 'Riwayat',
  'payment': 'Laporan Pembayaran',
  'options': 'Pengaturan'
}

const dynamicNames = ref<Record<string, string>>({})

watch(() => route.path, async (newPath) => {
  const params = route.params
  if (!params.id) return

  const id = String(params.id)
  let type = ''
  
  if (newPath.includes('/stadiums/')) type = 'stadions'
  else if (newPath.includes('/fields/')) type = 'fields'
  else if (newPath.includes('/facilities/')) type = 'facilities'
  else if (newPath.includes('/bookings/') && !newPath.includes('/bookings/order')) type = 'stadions'

  if (type) {
    const key = `${type}-${id}`
    if (dynamicNames.value[key]) return

    try {
      const data = await $fetch<any>(`/api/${type}/${id}`)
      if (data && data.name) {
        dynamicNames.value[key] = data.name
      } else {
        dynamicNames.value[key] = id
      }
    } catch (e) {
      console.error(`Failed to fetch name for ${type} ${id}`, e)
      dynamicNames.value[key] = id
    }
  }
}, { immediate: true })

const breadcrumbs = computed(() => {
  const pathParts = route.path.split('/').filter(p => p && p !== 'admin')
  const crumbs = [{ name: 'Dashboard', to: '/admin', isLast: pathParts.length === 0 }]
  let currentPath = '/admin'
  
  pathParts.forEach((part, index) => {
    currentPath += `/${part}`
    
    let displayName = nameMapping[part] || (part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' '))
    
    if (part === String(route.params.id)) {
       const prevPart = pathParts[index - 1]
       let type = ''
       if (prevPart === 'stadiums') type = 'stadions'
       else if (prevPart === 'fields') type = 'fields'
       else if (prevPart === 'facilities') type = 'facilities'
       else if (prevPart === 'bookings') type = 'stadions'
       
       const key = `${type}-${part}`
       const name = dynamicNames.value[key]
       
       if (type) {
         if (name) {
           displayName = name
         } else {
           displayName = '...'
         }
       }
    }

    if (part === 'fields' && index === pathParts.length - 1 && route.params.id) {
      displayName = `Lapangan`
    }
    
    let crumbTo = currentPath
    if (part === 'detail') {
      crumbTo = '/admin/bookings/history'
    }
    
    crumbs.push({
      name: displayName,
      to: crumbTo,
      isLast: index === pathParts.length - 1
    })
  })
  
  return crumbs
})

const topbarLogoutLoading = ref(false)
const handleTopbarLogout = async () => {
  const isConfirmed = await confirm({
    title: 'Konfirmasi Logout',
    message: 'Apakah Anda yakin ingin keluar dari aplikasi?',
    confirmText: 'Logout',
    cancelText: 'Batal',
    type: 'danger'
  })

  if (!isConfirmed) return

  if (topbarLogoutLoading.value) return
  topbarLogoutLoading.value = true
  try {
    await $fetch('/api/auth/logout', { method: 'POST' })
  } catch (e) {
    console.error('Failed to logout', e)
  } finally {
    topbarLogoutLoading.value = false
    await router.push('/admin/login')
  }
}
</script>

<template>
  <header class="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
    <div class="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">

      <div class="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
        <button
          type="button"
          @click="toggleSidebar"
          class="lg:hidden relative flex items-center justify-center h-10 w-10 rounded-lg text-gray-700 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Buka sidebar"
        >
          <div class="relative h-5 w-5">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <path d="M4 6h16" class="transition-all duration-300 ease-out origin-center" :class="{ 'rotate-45 translate-y-1.5': isSidebarOpen }" />
              <path d="M4 12h16" class="transition-all duration-200 ease-out" :class="{ 'opacity-0 scale-75': isSidebarOpen }" />
              <path d="M4 18h16" class="transition-all duration-300 ease-out origin-center" :class="{ '-rotate-45 -translate-y-1.5': isSidebarOpen }" />
            </svg>
          </div>
        </button>

        <nav class="hidden lg:flex items-center text-sm font-medium min-w-0" aria-label="Breadcrumb">
          <ol class="flex items-center gap-1.5 text-gray-600 min-w-0">
            <li v-for="(crumb, index) in breadcrumbs" :key="crumb.to" class="flex items-center gap-1.5 min-w-0">
              <NuxtLink
                :to="crumb.to"
                :class="[
                  'transition-all duration-200 px-2.5 py-1.5 rounded-md truncate',
                  crumb.isLast 
                    ? 'text-gray-900 font-semibold bg-gradient-to-br from-blue-50 to-indigo-50 pointer-events-none' 
                    : 'hover:text-blue-600 hover:bg-gray-50'
                ]"
                :aria-current="crumb.isLast ? 'page' : undefined"
              >
                {{ crumb.name }}
              </NuxtLink>
              <svg v-if="!crumb.isLast" class="h-4 w-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </li>
          </ol>
        </nav>

        <div class="lg:hidden flex items-center min-w-0">
          <span class="text-sm font-semibold text-gray-900 truncate">
            {{ breadcrumbs[breadcrumbs.length - 1]?.name }}
          </span>
        </div>
      </div>

      <div class="flex items-center gap-2 sm:gap-3">
        
        <!-- NOTIFICATIONS REMOVED -->

        <!-- PROFILE SECTION COMMENTED OUT -->
        <!--
        <details ref="profileMenu" class="relative">
          <summary class="...">...</summary>
          <div class="...">...</div>
        </details>
        -->

        <button
          type="button"
          :disabled="topbarLogoutLoading"
          @click="handleTopbarLogout"
          class="group flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 hover:shadow-lg hover:shadow-red-500/30 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-wait disabled:hover:scale-100 border border-red-800/20"
        >
          <svg v-if="!topbarLogoutLoading" class="w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 13V11H8V8L3 12L8 16V13H16ZM20 3H12V5H20V19H12V21H20C21.1 21 22 20.1 22 19V5C22 3.9 21.1 3 20 3Z"/>
          </svg>
          <svg v-else class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="hidden sm:inline">{{ topbarLogoutLoading ? 'Keluar...' : 'Logout' }}</span>
        </button>

      </div>
    </div>
  </header>
</template>