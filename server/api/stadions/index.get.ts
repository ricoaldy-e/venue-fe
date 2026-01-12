import { defineEventHandler, createError } from 'h3'
import { $fetch } from 'ofetch'
import { QUERY_GET_STADIONS } from '~/graphql/queries/get_stadions'
const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const endpoint = config.public.gqlHttpEndpoint
  if (!endpoint) throw createError({ statusCode: 500, statusMessage: 'Missing GQL_HTTP_ENDPOINT' })

  try {
    const response = await $fetch<{ data?: any; errors?: any[] }>(endpoint, {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: {
        query: QUERY_GET_STADIONS
      },
    })
    
    if (response.errors) throw new Error(response.errors[0].message)
    return response.data.stadions
  } catch (err: any) {
    throw createError({ statusCode: 502, statusMessage: err.message })
  }
})
