import { defineEventHandler, readBody, createError, getCookie, getQuery } from 'h3'
import jwt from 'jsonwebtoken'
import { AUTH, API } from '~/utils/constants'
import { QUERY_GET_BOOKINGS } from '~/graphql/queries/get_bookings'

interface CheckAvailabilityRequest {
  fieldId: string
  date: string
  timeSlots: string[]
  excludeBookingId?: string
}

interface CheckAvailabilityResponse {
  available: boolean
  conflictingSlots: string[]
  message: string
}

export default defineEventHandler(async (event): Promise<CheckAvailabilityResponse> => {
  const config = useRuntimeConfig()
  const token = getCookie(event, AUTH.TOKEN_COOKIE_NAME)
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const secret = config.jwtSecret
  if (!secret) {
    throw createError({ statusCode: 500, statusMessage: 'JWT_SECRET missing' })
  }

  try {
    jwt.verify(token, secret)
  } catch {
    throw createError({ statusCode: 401, statusMessage: 'Invalid token' })
  }

  const body = await readBody<CheckAvailabilityRequest>(event)

  if (!body.fieldId || !body.date || !body.timeSlots || body.timeSlots.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields: fieldId, date, timeSlots'
    })
  }

  try {
    const graphqlUrl = config.public.gqlHttpEndpoint || 'http://localhost:4000/graphql'

    // Use the same query as for displaying bookings
    const response = await $fetch<{
      data?: {
        bookings?: {
          data?: Array<{
            id: string
            bookingCode: string
            status: string
            details?: Array<{
              fieldId: number
              bookingDate: string
              startHour: number
            }>
          }>
        }
      }
      errors?: Array<{ message: string }>
    }>(graphqlUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        query: QUERY_GET_BOOKINGS,
        variables: {
          date: body.date
        }
      }),
      timeout: API.TIMEOUT
    })

    if (response.errors) {
      console.error('[check-availability] GraphQL errors:', response.errors)
      throw createError({
        statusCode: 500,
        statusMessage: response.errors[0]?.message || 'GraphQL error'
      })
    }

    // Extract bookings from paginated response
    const allBookings = response.data?.bookings?.data || []

    // Filter bookings that match the field and are not cancelled
    const relevantBookings = allBookings.filter(booking => {
      if (booking.status === 'CANCELLED') return false
      if (body.excludeBookingId && booking.id === body.excludeBookingId) return false
      return true
    })

    // Get all booked slots for the specific field
    const bookedSlots = new Set<string>()

    for (const booking of relevantBookings) {
      if (booking.details) {
        for (const detail of booking.details) {
          // Check if this detail matches the field and date we're checking
          if (String(detail.fieldId) === String(body.fieldId)) {
            // Parse the booking date to compare with the requested date
            const detailDate = new Date(detail.bookingDate)
            const requestDate = new Date(body.date)

            // Compare dates (ignoring time)
            const detailDateStr = detailDate.toISOString().split('T')[0]
            const requestDateStr = requestDate.toISOString().split('T')[0]

            if (detailDateStr === requestDateStr) {
              bookedSlots.add(String(detail.startHour))
            }
          }
        }
      }
    }

    // Find conflicting slots
    const conflictingSlots = body.timeSlots.filter(slot => bookedSlots.has(slot))

    if (conflictingSlots.length > 0) {
      return {
        available: false,
        conflictingSlots,
        message: `Slot Tidak Tersedia: Slot waktu yang dipilih sudah dibooking oleh pengguna lain. Silakan pilih slot yang berbeda atau coba lagi.`
      }
    }

    return {
      available: true,
      conflictingSlots: [],
      message: 'Semua slot waktu tersedia'
    }

  } catch (error: any) {
    console.error('[check-availability] Error:', error?.message || error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to check availability'
    })
  }
})
