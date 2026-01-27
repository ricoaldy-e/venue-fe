import { defineEventHandler, readBody, createError, getCookie, readFormData } from 'h3'
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
  renterType?: 'UMUM' | 'TENDIK' | 'AKADEMIK'
  details: BookingDetailPayload[]
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const endpoint = config.public.gqlHttpEndpoint
  if (!endpoint) throw createError({ statusCode: 500, statusMessage: 'Missing GQL_HTTP_ENDPOINT' })

  const contentType = (event.node.req.headers['content-type'] || '') as string

  if (contentType.includes('multipart/form-data')) {
    const token = getCookie(event, 'admin_token')

    try {
      const incomingFormData = await readFormData(event)

      const operationsStr = incomingFormData.get('operations') as string
      const mapStr = incomingFormData.get('map') as string

      if (!operationsStr || !mapStr) {
        throw createError({ statusCode: 400, statusMessage: 'Missing operations or map in multipart request' })
      }

      const map = JSON.parse(mapStr) as Record<string, string[]>

      const files: Record<string, File> = {}
      for (const key of Object.keys(map)) {
        const file = incomingFormData.get(key)
        if (file instanceof File) {
          files[key] = file
        }
      }

      const newFormData = new FormData()

      newFormData.append('operations', operationsStr)

      newFormData.append('map', mapStr)

      const sortedKeys = Object.keys(files).sort()
      for (const key of sortedKeys) {
        const file = files[key]
        if (file) {
          newFormData.append(key, file)
        }
      }

      const headers: Record<string, string> = {
        'apollo-require-preflight': 'true',
      }
      if (token) headers['Authorization'] = `Bearer ${token}`

      const res = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: newFormData
      })
      const json = await res.json()
      if (json.errors?.length) {
        throw createError({ statusCode: 400, statusMessage: json.errors[0]?.message || 'Failed to create booking' })
      }

      const bookingData = json.data?.createBooking
      if (!bookingData?.bookingCode) {
        return bookingData
      }

      try {
        const operations = JSON.parse(operationsStr)
        const renterType = operations?.variables?.renterType || 'UMUM'
        const paymentStatusToSet = renterType === 'AKADEMIK' ? 'PAID' : 'UNPAID'

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
            variables: { bookingCode: bookingData.bookingCode, paymentStatus: paymentStatusToSet },
          },
          headers: { 'Content-Type': 'application/json', ...(token && { 'Authorization': `Bearer ${token}` }) },
        })
      } catch (err: any) {
        console.warn('Failed to auto-approve booking:', err?.message)
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
          renterType: body.renterType,
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
      // AKADEMIK bookings are free, so automatically mark as PAID
      // UMUM and TENDIK remain UNPAID by default
      const paymentStatusToSet = body.renterType === 'AKADEMIK' ? 'PAID' : 'UNPAID'

      const paymentResponse = await $fetch<{ data?: any; errors?: any[] }>(endpoint, {
        method: 'POST',
        body: {
          query: UPDATE_PAYMENT,
          variables: {
            bookingCode: bookingData.bookingCode,
            paymentStatus: paymentStatusToSet,
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
