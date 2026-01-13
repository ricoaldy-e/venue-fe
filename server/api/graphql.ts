import { defineEventHandler, readBody, createError } from 'h3'
import { $fetch } from 'ofetch'
import { AUTH } from '~/utils/constants'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const endpoint = config.public.gqlHttpEndpoint
  if (!endpoint) {
    throw createError({ statusCode: 500, statusMessage: 'Missing GQL_HTTP_ENDPOINT' })
  }
  const body = await readBody(event)

  const token = getCookie(event, AUTH.TOKEN_COOKIE_NAME)

  try {
    const response = await $fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: body,
    })

    if (response?.errors?.length) {
      throw createError({ 
        statusCode: 400, 
        statusMessage: response.errors[0]?.message || 'GraphQL Error' 
      })
    }

    return response
  } catch (error: any) {
    if (error.statusCode === 404) {
        throw createError({ statusCode: 502, statusMessage: 'Backend GraphQL server is not running.' })
    }
    if (error?.statusCode) throw error
    throw createError({ statusCode: 500, statusMessage: 'Internal server error during proxy.' })
  }
})