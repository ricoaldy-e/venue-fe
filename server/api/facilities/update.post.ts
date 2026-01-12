import { defineEventHandler, readBody, getCookie } from 'h3'
import { $fetch } from 'ofetch'
import { MUTATION_UPDATE_FACILITY } from '~/graphql/mutations/update_facility'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()
  const endpoint = config.public.gqlHttpEndpoint
  if (!endpoint) throw createError({ statusCode: 500, statusMessage: 'Missing GQL_HTTP_ENDPOINT' })
  const token = getCookie(event, 'admin_token')
  if (!token) throw createError({ statusCode: 401, statusMessage: 'Not authenticated' })
  try {
    const response = await $fetch<{ data?: any; errors?: any[] }>(endpoint, {
      method: 'POST',
      body: {
        query: MUTATION_UPDATE_FACILITY,
        variables: {
          facilityId: body.facilityId,
          name: body.name,
          icon: body.icon,
        },
      },
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (response.errors) {
      const msg = response.errors[0].message
      throw createError({ statusCode: 400, statusMessage: msg })
    }
    return response.data.updateFacility
  } catch (err: any) {
    if (err.statusCode) throw err
    throw createError({ statusCode: 502, statusMessage: err.message })
  }
})