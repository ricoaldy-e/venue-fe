export function pad(n: number) {
  return String(n).padStart(2, '0')
}

export function toDateKey(value?: string | Date | null): string | null {
  if (!value) return null
  const d = typeof value === 'string' ? new Date(value) : value
  if (Number.isNaN(d.getTime())) return null
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function toUtcMidnightIso(value?: string | Date | null): string | null {
  const dateKey = typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : toDateKey(value)
  if (!dateKey) return null
  return `${dateKey}T00:00:00.000Z`
}

export function getNextNDays(start:string | Date | number | null | undefined , n = 7, startFromTomorrow = true) {
  const days: { label: string; value: string }[] = []
  const now = start ? new Date(start) : new Date()
  const startOffset = startFromTomorrow ? 1 : 0

  for (let i = startOffset; i < n + startOffset; i++) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i)
    const label = d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })
    const dateKey = toDateKey(d)!
    const value = toUtcMidnightIso(dateKey)!
    days.push({ label, value })
  }
  return days
}

export default { pad, toDateKey, toUtcMidnightIso, getNextNDays }
