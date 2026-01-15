import { print } from "graphql"
import type { FetchError } from "ofetch"
import { QUERY_GET_OPTION } from "~/graphql/queries/get_option"

type Option = {
    name: string,
    description: string,
    email: string,
    nohp: string,
    address: string,
}

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  const endpoint = config.public.gqlHttpEndpoint
  if (!endpoint) {
    throw createError({ statusCode: 500, statusMessage: 'Missing GQL_HTTP_ENDPOINT' })
  }

  try {
    const response = await $fetch<{
      data?: { options?: Option }
      errors?: Array<{
        message?: string
        extensions?: {
          code?: string
        }
      }>
    }>(endpoint, {
      method: 'POST',
      body: {
        query: print(QUERY_GET_OPTION),
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

    return response?.data?.options ?? null
  } catch (e) {
    const err = e as FetchError
    if (err.statusCode) throw err
    throw createError({ statusCode: 502, statusMessage: 'Operating hour service unreachable' })
  }
})