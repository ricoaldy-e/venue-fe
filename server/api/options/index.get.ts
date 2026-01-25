import { defineEventHandler, createError, getCookie } from 'h3'
import { $fetch } from 'ofetch'
import { QUERY_GET_OPTION } from '~/graphql/queries/get_option'

type Option = {
  name: string
  nameKet: string
  description: string
  unitName: string
  unitDesc: string
  email: string
  nohp: string
  address: string
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const endpoint = config.public.gqlHttpEndpoint
  if (!endpoint) {
    throw createError({ statusCode: 500, statusMessage: 'Missing GQL_HTTP_ENDPOINT' })
  }

  const token = getCookie(event, 'admin_token')

  try {
    const headers: Record<string, any> = { 'Content-Type': 'application/json' }
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response: any = await $fetch(endpoint, {
      method: 'POST',
      headers,
      body: {
        query: QUERY_GET_OPTION,
      },
    })

    if (response?.errors?.length) {
      const firstError = response.errors[0]
      const errorCode = firstError?.extensions?.code || 'UNKNOWN'

      console.error('GraphQL error fetching options:', {
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
        statusMessage: 'Failed to fetch options',
      })
    }

    return response?.data?.options ?? null
  } catch (error: any) {
    if (error?.statusCode) throw error
    throw createError({ statusCode: 502, statusMessage: 'Option service unreachable' })
  }
})