import { print } from 'graphql'
import { QUERY_GET_BOOKINGS } from "~/graphql/queries/get_bookings"

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const endpoint = config.public.gqlHttpEndpoint
  if (!endpoint) {
    throw createError({ statusCode: 500, statusMessage: 'Missing GQL_HTTP_ENDPOINT' })
  }

  const token = getCookie(event, 'admin_token')
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Not authenticated' })
  }

  try {
    const response = await $fetch<{
      data?: { bookings?: any[] }
      errors?: Array<{
        message?: string
        extensions?: {
          code?: string
        }
      }>
    }>(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: {
        query: QUERY_GET_BOOKINGS,
        variables: {}
      },
    })

    if (response?.errors?.length) {
      throw createError({
        statusCode: 400,
        statusMessage: response.errors[0]?.message || 'Failed to get bookings history',
      })
    }

    const bookings = response.data?.bookings || []
    
    const sortedBookings = bookings.sort((a: any, b: any) => {
      const dateA = new Date(a.createdAt || 0).getTime()
      const dateB = new Date(b.createdAt || 0).getTime()
      return dateB - dateA
    })

    return sortedBookings
  } catch (error: unknown) {
    if (error as unknown as Error) throw error
    throw createError({ statusCode: 502, statusMessage: 'Bookings service unreachable' })
  }
})
