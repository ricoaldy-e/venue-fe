export function pad(n: number) {
  return String(n).padStart(2, '0')
}

export function toDateKey(value?: string | Date | null): string | null {
  if (!value) return null
  const d = typeof value === 'string' ? new Date(value) : value
  if (Number.isNaN(d.getTime())) return null
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/**
 * Converts a date to WIB midnight ISO string (Asia/Jakarta timezone, UTC+7)
 * Use this for date filtering in Indonesia/Semarang
 */
export function toWibMidnightIso(value?: string | Date | null): string | null {
  const dateKey = typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : toDateKey(value)
  if (!dateKey) return null
  // Using +07:00 for WIB (Waktu Indonesia Barat / Asia/Jakarta)
  return `${dateKey}T00:00:00.000+07:00`
}

/**
 * @deprecated Use toWibMidnightIso for Indonesia timezone handling
 * Converts a date to UTC midnight ISO string
 */
export function toUtcMidnightIso(value?: string | Date | null): string | null {
  const dateKey = typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : toDateKey(value)
  if (!dateKey) return null
  // Keep using WIB timezone for consistency with backend
  return `${dateKey}T00:00:00.000+07:00`
}

/**
 * Get current date in WIB timezone (UTC+7).
 */
export function getTodayInWib(): Date {
  // Get current time as ISO string in WIB timezone
  const now = new Date()
  const wibFormatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })

  // Format: YYYY-MM-DD
  const wibDateString = wibFormatter.format(now)
  const parts = wibDateString.split('-').map(Number)
  const year = parts[0] ?? 2026
  const month = parts[1] ?? 1
  const day = parts[2] ?? 1

  const wibToday = new Date(year, month - 1, day, 0, 0, 0, 0)
  return wibToday
}

export function getNextNDays(start: string | Date | number | null | undefined, n = 7, startFromTomorrow = true) {
  const days: { label: string; value: string }[] = []
  const now = start ? new Date(start) : new Date()
  const startOffset = startFromTomorrow ? 1 : 0

  for (let i = startOffset; i < n + startOffset; i++) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i)
    const label = d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'Asia/Jakarta' })
    const dateKey = toDateKey(d)!
    // Using WIB timezone for booking dates
    const value = toWibMidnightIso(dateKey)!
    days.push({ label, value })
  }
  return days
}

export default { pad, toDateKey, toUtcMidnightIso, toWibMidnightIso, getTodayInWib, getNextNDays }

