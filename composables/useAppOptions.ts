import type { AppOption, AppOptionsState } from '~/types/app-options'

/**
 * Global state for app options
 * Used throughout the application without needing constant re-fetching
 */
export const useAppOptions = () => {
  const defaults: AppOption = {
    name: 'VENUE UNDIP',
    nameKet: 'Sistem Reservasi Fasilitas Olahraga Universitas Diponegoro',
    description: 'Platform booking lapangan olahraga terpercaya untuk Sivitas Akademika Universitas Diponegoro.',
    unitName: 'UPT Layanan Seni, Budaya dan Olahraga',
    unitDesc: 'Unit Pelaksana Teknis yang mengelola fasilitas seni, budaya, dan olahraga di lingkungan Universitas Diponegoro',
    email: 'helpdesk@undip.ac.id',
    nohp: '+62 851 6566 0339',
    address: 'Jl. Prof. Soedarto, Tembalang, Kec. Tembalang, Kota Semarang, Jawa Tengah'
  }

  const options = useState<AppOptionsState>('app-options', () => ({
    data: null,
    pending: false,
    error: null,
  }))

  /**
   * Fetch options from API
   * Only fetches if data is missing or force is true
   */
  const fetchOptions = async (force = false) => {
    if (options.value.data && !force) {
      return options.value.data
    }

    if (options.value.pending && !force) {
      return
    }

    options.value.pending = true
    options.value.error = null

    try {
      const data = await $fetch<AppOption>('/api/options')

      options.value.data = { ...defaults, ...data }
      return options.value.data
    } catch (err) {
      console.error('[useAppOptions] Failed to fetch:', err)
      const errorMessage = err instanceof Error ? err.message : 'Unknown error fetching options'
      options.value.error = errorMessage
      if (!options.value.data) {
        options.value.data = defaults
      }
      return null
    } finally {
      options.value.pending = false
    }
  }

  /**
   * Refresh options data
   */
  const refresh = () => fetchOptions(true)

  /**
   * Reset options state
   */
  const reset = () => {
    options.value = {
      data: null,
      pending: false,
      error: null,
    }
  }

  return {
    options: readonly(options),
    fetchOptions,
    refresh,
    reset,
  }
}