import { defineEventHandler, readBody, getCookie } from 'h3'
import { $fetch } from 'ofetch'
import { MUTATION_DELETE_FACILITY } from '~/graphql/mutations/delete_facility'

export default defineEventHandler(async (event) => {
  const { facilityId } = await readBody(event)
  const config = useRuntimeConfig()
  const endpoint = config.public.gqlHttpEndpoint
  if (!endpoint) throw createError({ statusCode: 500, statusMessage: 'Missing GQL_HTTP_ENDPOINT' })
  const token = getCookie(event, 'admin_token')
  if (!token) throw createError({ statusCode: 401, statusMessage: 'Not authenticated' })
  try {
    const response = await $fetch<{ data?: any; errors?: any[] }>(endpoint, {
      method: 'POST',
      body: {
        query: MUTATION_DELETE_FACILITY,
        variables: { facilityId },
      },
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (response.errors) throw new Error(response.errors[0].message)
    return response.data.deleteFacility
  } catch (err: any) {
    throw createError({ statusCode: 502, statusMessage: err.message })
  }
})