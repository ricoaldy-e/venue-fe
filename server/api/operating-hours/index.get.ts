import { defineEventHandler, createError, getCookie } from 'h3'
import { $fetch } from 'ofetch'
import { QUERY_GET_OPERATING_HOURS } from '~/graphql/queries/get_operating_hours'

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
      data?: { operatingHours?: any }
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
        query: QUERY_GET_OPERATING_HOURS,
      },
    })

    if (response?.errors?.length) {
      const firstError = response.errors[0]
      const errorCode = firstError?.extensions?.code || 'UNKNOWN'

      console.error('GraphQL error fetching operating hours:', {
        code: firstError?.extensions?.code,
        message: firstError?.message,
        fullError: firstError,
      })

      let statusCode = 400
      if (errorCode === 'UNAUTHENTICATED') {
        statusCode = 401
      } else if (errorCode === 'FORBIDDEN') {
        statusCode = 403
      } else if (errorCode === 'INTERNAL' || errorCode === 'INTERNAL_SERVER_ERROR') {
        statusCode = 500
      }

      throw createError({
        statusCode,
        statusMessage: 'Failed to fetch operating hours',
      })
    }

    return response?.data?.operatingHours ?? null
  } catch (error: any) {
    if (error?.statusCode) throw error
    throw createError({ statusCode: 502, statusMessage: 'Operating hour service unreachable' })
  }
})
