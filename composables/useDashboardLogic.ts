import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

export interface Field {
  id: string
  name: string
  stadionId: number
  status: string
  Stadion: { id: string; name: string } | null
}

export interface BookingDetail {
  fieldId: string | number
  bookingDate: string
  startHour: number
}

export interface Booking {
  id: string
  bookingCode: string
  status: string
  details: BookingDetail[]
}

export interface OperationalField {
  id: string
  name: string
  stadionName: string
  capacity: number
  booked: number
  remaining: number
  occupancyRate: number
  status: string
  statusClass: string
}

dayjs.extend(isBetween)
dayjs.extend(utc)
dayjs.extend(timezone)

export interface DashboardCardItem {
  id: string
  name: string
  stadionId: number
  stadionName: string
  mode: 'daily' | 'range'
  totalCapacity: number
  totalBooked: number
  remaining: number
  occupancyRate: number
  statusLabel: string
  statusColor: string
}

export const useDashboardLogic = () => {

  const getDailyHours = (opHours: { openHour: number, closeHour: number }) => {
    return Math.max(0, opHours.closeHour - opHours.openHour)
  }

  const calculateDailyStats = (
    fields: Field[],
    bookings: Booking[],
    opHours: { openHour: number, closeHour: number },
    targetDate: string
  ): DashboardCardItem[] => {

    const dailyCapacity = getDailyHours(opHours)

    return fields.map(field => {
      let bookedCount = 0

      bookings.forEach(b => {
        if (b.status === 'CANCELLED') return

        b.details.forEach(d => {
          const dbDate = dayjs(d.bookingDate).tz('Asia/Jakarta').format('YYYY-MM-DD')

          if (String(d.fieldId) === String(field.id) && dbDate === targetDate) {
            bookedCount++
          }
        })
      })

      const remaining = Math.max(0, dailyCapacity - bookedCount)
      const occupancyRate = dailyCapacity > 0 ? (bookedCount / dailyCapacity) * 100 : 0

      let statusLabel = 'Tersedia'
      let statusColor = 'bg-green-100 text-green-700 border-green-200'

      if (bookedCount >= dailyCapacity) {
        statusLabel = 'Full Booked'
        statusColor = 'bg-red-100 text-red-700 border-red-200'
      } else if (occupancyRate > 75) {
        statusLabel = 'Hampir Penuh'
        statusColor = 'bg-amber-100 text-amber-700 border-amber-200'
      }

      return {
        id: field.id,
        name: field.name,
        stadionId: field.stadionId || Number(field.Stadion?.id) || 0,
        stadionName: field.Stadion?.name || '-',
        mode: 'daily',
        totalCapacity: dailyCapacity,
        totalBooked: bookedCount,
        remaining,
        occupancyRate,
        statusLabel,
        statusColor
      }
    })
  }

  const calculateRangeStats = (
    fields: Field[],
    bookings: Booking[],
    opHours: { openHour: number, closeHour: number },
    startDate: string,
    endDate: string
  ): DashboardCardItem[] => {

    const start = dayjs(startDate).startOf('day')
    const end = dayjs(endDate).endOf('day')
    const totalDays = end.diff(start, 'day') + 1
    const hoursPerDay = getDailyHours(opHours)
    const totalRangeCapacity = hoursPerDay * totalDays

    return fields.map(field => {
      let rangeBookedCount = 0

      bookings.forEach(b => {
        if (b.status === 'CANCELLED') return

        b.details.forEach(d => {
          const dDate = dayjs(d.bookingDate).tz('Asia/Jakarta')

          if (String(d.fieldId) === String(field.id) &&
            (dDate.isSame(start, 'day') || dDate.isSame(end, 'day') || dDate.isBetween(start, end, 'day', '[]'))) {
            rangeBookedCount++
          }
        })
      })

      const remaining = Math.max(0, totalRangeCapacity - rangeBookedCount)
      const occupancyRate = totalRangeCapacity > 0 ? (rangeBookedCount / totalRangeCapacity) * 100 : 0

      let statusLabel = `${rangeBookedCount} Jam Terpakai`
      let statusColor = 'bg-blue-50 text-blue-700 border-blue-200'

      if (rangeBookedCount === 0) {
        statusLabel = 'Kosong (0 Jam)'
        statusColor = 'bg-gray-100 text-gray-600 border-gray-200'
      } else if (occupancyRate > 80) {
        statusLabel = 'Sangat Sibuk'
        statusColor = 'bg-orange-100 text-orange-700 border-orange-200'
      }

      return {
        id: field.id,
        name: field.name,
        stadionId: field.stadionId || Number(field.Stadion?.id) || 0,
        stadionName: field.Stadion?.name || '-',
        mode: 'range',
        totalCapacity: totalRangeCapacity,
        totalBooked: rangeBookedCount,
        remaining,
        occupancyRate,
        statusLabel,
        statusColor
      }
    })
  }

  return { calculateDailyStats, calculateRangeStats }
}