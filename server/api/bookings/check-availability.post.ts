import { defineEventHandler, readBody, createError, getCookie } from 'h3'
import jwt from 'jsonwebtoken'
import { AUTH, API } from '~/utils/constants'
import { query } from '~/graphql/queries/cek_booking_availability'

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
    const graphqlUrl = config.public.gqlHttpEndpoint || 'http://localhost:3001/graphql'
    
    const response = await $fetch<{
      data?: {
        bookings: Array<{
          id: string
          timeSlot: string
        }>
      }
      errors?: Array<{ message: string }>
    }>(graphqlUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        variables: {
          fieldId: body.fieldId,
          date: body.date
        }
      }),
      timeout: API.TIMEOUT
    })

    if (response.errors) {
      throw createError({
        statusCode: 500,
        statusMessage: response.errors[0]?.message || 'GraphQL error'
      })
    }

    const existingBookings = response.data?.bookings || []
    
    const relevantBookings = body.excludeBookingId
      ? existingBookings.filter(b => b.id !== body.excludeBookingId)
      : existingBookings

    const bookedSlots = new Set(relevantBookings.map(b => b.timeSlot))
    const conflictingSlots = body.timeSlots.filter(slot => bookedSlots.has(slot))

    if (conflictingSlots.length > 0) {
      return {
        available: false,
        conflictingSlots,
        message: `Slot waktu ${conflictingSlots.join(', ')} sudah dibooking. Silakan pilih slot lain.`
      }
    }

    return {
      available: true,
      conflictingSlots: [],
      message: 'Semua slot waktu tersedia'
    }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to check availability'
    })
  }
})
