import { defineEventHandler, readBody, createError, getCookie } from 'h3'
import { $fetch } from 'ofetch'
import { MUTATION_CREATE_BOOKING } from '~/graphql/mutations/create_booking'
import { UPDATE_BOOK_STATUS } from '~/graphql/mutations/update_book_status'
import { UPDATE_PAYMENT } from '~/graphql/mutations/update_payment'

interface BookingDetailPayload {
  fieldId: number
  bookingDate: string
  startHour: number
  pricePerHour?: number
}

interface BookingPayload {
  name: string
  contact: string
  email: string
  institution?: string
  suratUrl?: string
  isAcademic?: boolean
  details: BookingDetailPayload[]
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const endpoint = config.public.gqlHttpEndpoint
  if (!endpoint) throw createError({ statusCode: 500, statusMessage: 'Missing GQL_HTTP_ENDPOINT' })

  const contentType = (event.node.req.headers['content-type'] || '') as string

  if (contentType.includes('multipart/form-data')) {
    const token = getCookie(event, 'admin_token')
    const headers: Record<string, string> = {
      'apollo-require-preflight': 'true',
      'content-type': contentType,
    }
    if (token) headers['Authorization'] = `Bearer ${token}`

    try {
      const res = await (fetch as any)(endpoint, { method: 'POST', headers, body: event.node.req, duplex: 'half' })
      const json = await res.json()
      if (json.errors?.length) {
        throw createError({ statusCode: 400, statusMessage: json.errors[0]?.message || 'Failed to create booking' })
      }
      
      const bookingData = json.data?.createBooking
      if (!bookingData?.bookingCode) {
        return bookingData
      }

      try {
        await $fetch<{ data?: any; errors?: any[] }>(endpoint, {
          method: 'POST',
          body: {
            query: UPDATE_BOOK_STATUS,
            variables: { bookingCode: bookingData.bookingCode, status: "APPROVED" },
          },
          headers: { 'Content-Type': 'application/json', ...(token && { 'Authorization': `Bearer ${token}` }) },
        })

        await $fetch<{ data?: any; errors?: any[] }>(endpoint, {
          method: 'POST',
          body: {
            query: UPDATE_PAYMENT,
            variables: { bookingCode: bookingData.bookingCode, paymentStatus: "UNPAID" },
          },
          headers: { 'Content-Type': 'application/json', ...(token && { 'Authorization': `Bearer ${token}` }) },
        })
      } catch (err: any) {
        console.warn('Failed to auto-approve academic booking:', err?.message)
      }

      return bookingData
    } catch (err: any) {
      if (err?.statusCode) throw err
      throw createError({ statusCode: 502, statusMessage: err?.message || 'Booking service unreachable' })
    }
  }

  const body = await readBody<BookingPayload>(event)
  if (!body?.name || !body?.contact || !body?.email || !Array.isArray(body.details) || body.details.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'Incomplete booking payload' })
  }

  try {
    const token = getCookie(event, 'admin_token')
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (token) headers['Authorization'] = `Bearer ${token}`

    const response = await $fetch<{ data?: any; errors?: any[] }>(endpoint, {
      method: 'POST',
      body: {
        query: MUTATION_CREATE_BOOKING,
        variables: {
          name: body.name,
          contact: body.contact,
          email: body.email,
          institution: body.institution,
          suratUrl: body.suratUrl,
          isAcademic: body.isAcademic,
          details: body.details,
        },
      },
      headers,
    })

    if (response.errors?.length) {
      throw createError({ statusCode: 400, statusMessage: response.errors[0]?.message || 'Failed to create booking' })
    }

    const bookingData = response.data?.createBooking
    if (!bookingData?.bookingCode) {
      throw createError({ statusCode: 500, statusMessage: 'Booking created but no booking code returned' })
    }

    const statusResponse = await $fetch<{ data?: any; errors?: any[] }>(endpoint, {
      method: 'POST',
      body: {
        query: UPDATE_BOOK_STATUS,
        variables: {
          bookingCode: bookingData.bookingCode,
          status: "APPROVED",
        },
      },
      headers,
    })

    if (statusResponse.errors?.length) {
      console.warn('Failed to update booking status:', statusResponse.errors[0]?.message)
    }

    try {
      const paymentResponse = await $fetch<{ data?: any; errors?: any[] }>(endpoint, {
        method: 'POST',
        body: {
          query: UPDATE_PAYMENT,
          variables: {
            bookingCode: bookingData.bookingCode,
            paymentStatus: "UNPAID",
          },
        },
        headers,
      })

      if (paymentResponse.errors?.length) {
        console.warn('Failed to update payment status:', paymentResponse.errors[0]?.message)
      }
    } catch (err: any) {
      const details = err?.data || err?.response?.data || err?.message
      console.error('GraphQL payment mutation error:', details)
      if (err?.data?.errors?.length) {
        throw createError({ statusCode: 400, statusMessage: err.data.errors[0]?.message || 'Failed to update payment status' })
      }
      throw createError({ statusCode: 502, statusMessage: err?.message || 'Booking service unreachable' })
    }

    return bookingData
  } catch (error: any) {
    if (error?.statusCode) throw error
    throw createError({ statusCode: 502, statusMessage: error?.message || 'Booking service unreachable' })
  }
})
