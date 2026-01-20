import type { AppOption, AppOptionsState } from '~/types/app-options'

/**
 * Global state for app options
 * Used throughout the application without needing constant re-fetching
 */
export const useAppOptions = () => {
  // Define default values to prevent hydration mismatches and ensure types
  const defaults: AppOption = {
    name: 'VENUE UNDIP',
    nameKet: 'Booking Lapangan Olahraga Universitas Diponegoro',
    description: 'Platform booking lapangan olahraga terpercaya untuk Sivitas Akademika Universitas Diponegoro.',
    unitName: 'UPT Layanan Seni, Budaya dan Olahraga',
    unitDesc: 'Unit Pelaksana Teknis untuk mengelola fasilitas olahraga di lingkungan Universitas Diponegoro',
    email: 'contact@venueundip.id',
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
    // If we already have data and aren't forcing a refresh, return current data
    if (options.value.data && !force) {
      return options.value.data
    }

    // If a request is already compatible and pending, we could technically wait for it
    // But for simplicity in this pattern, we'll just check if we are already loading
    if (options.value.pending && !force) {
      return
    }

    options.value.pending = true
    options.value.error = null

    try {
      const data = await $fetch<AppOption>('/api/options')

      // Ensure we have all fields by merging with defaults if necessary
      // This helps if the API returns partial data
      options.value.data = { ...defaults, ...data }
      return options.value.data
    } catch (err) {
      console.error('[useAppOptions] Failed to fetch:', err)
      options.value.error = err as Error
      // On error, if we have no data, set defaults so app doesn't break
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
      data: null, // or defaults
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
