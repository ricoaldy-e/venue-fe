import type { AppOption, AppOptionsState } from '~/types/app-options'

/**
 * Global state untuk app options
 * Akan digunakan di seluruh aplikasi tanpa perlu re-fetch
 */
export const useAppOptions = () => {
  const options = useState<AppOptionsState>('app-options', () => ({
    data: null,
    pending: false,
    error: null,
  }))

  /**
   * Fetch options dari API
   * Hanya akan fetch jika data belum tersedia
   */
  const fetchOptions = async (force = false) => {
    // Skip jika sudah ada data dan tidak force
    if (options.value.data && !force) {
      return options.value.data
    }

    // Skip jika sedang loading
    if (options.value.pending) {
      return options.value.data
    }

    options.value.pending = true
    options.value.error = null

    try {
      const data = await $fetch('/api/options') as AppOption
      options.value.data = data
      return data
    } catch (err) {
      options.value.error = err as Error
      console.error('Failed to fetch app options:', err)
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
