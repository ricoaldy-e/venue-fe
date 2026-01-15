import { useAppOptions } from "~/composables/useAppOptions"

/**
 * Plugin untuk auto-fetch app options saat aplikasi pertama kali dimuat
 * Menggunakan prefix "01" agar dieksekusi lebih awal dari plugin lain
 * Suffix ".client" agar hanya berjalan di client-side
 */
export default defineNuxtPlugin(async () => {
  const { fetchOptions } = useAppOptions()

  // Fetch options saat aplikasi dimuat
  // Ini akan berjalan sekali saja saat aplikasi pertama kali load
  await fetchOptions()
})
