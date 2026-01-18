import { defineEventHandler, readBody, getCookie, createError } from 'h3'
import { $fetch } from 'ofetch'
import { MUTATION_CREATE_STADION } from '~/graphql/mutations/create_stadion'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const endpoint = config.public.gqlHttpEndpoint
  if (!endpoint) throw createError({ statusCode: 500, statusMessage: 'Missing GQL_HTTP_ENDPOINT' })

  const token = getCookie(event, 'admin_token')
  if (!token) throw createError({ statusCode: 401, statusMessage: 'Not authenticated' })

  const body = await readBody(event)

  try {
    const response = await $fetch<{ data?: any; errors?: any[] }>(endpoint, {
      method: 'POST',
      body: {
        query: MUTATION_CREATE_STADION,
        variables: {
          name: body.name,
          description: body.description,
          mapUrl: body.mapUrl,
          status: body.status,
          facilityIds: Array.isArray(body.facilityIds) && body.facilityIds.length > 0
            ? body.facilityIds.map(Number)
            : null,
        },
      },
      headers: { 'Authorization': `Bearer ${token}` }
    })

    if (response.errors) {
      const msg = response.errors[0].message
      throw createError({ statusCode: 400, statusMessage: msg })
    }
    return response.data.createStadion
  } catch (err: any) {
    if (err.statusCode) throw err
    throw createError({ statusCode: 502, statusMessage: err.message })
  }
})
