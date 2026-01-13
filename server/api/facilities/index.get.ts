import { defineEventHandler } from 'h3'
import { $fetch } from 'ofetch'
import { QUERY_GET_FACILITIES } from '~/graphql/queries/get_facilities'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const endpoint = config.public.gqlHttpEndpoint
  if (!endpoint) throw createError({ statusCode: 500, statusMessage: 'Missing GQL_HTTP_ENDPOINT' })
  try {
    const response = await $fetch<{ data?: any; errors?: any[] }>(endpoint, {
      method: 'POST',
      body: { query: QUERY_GET_FACILITIES },
    })
    if (response.errors) throw new Error(response.errors[0].message)
    return response.data.facilities
  } catch (err: any) {
    throw createError({ statusCode: 502, statusMessage: err.message })
  }
})