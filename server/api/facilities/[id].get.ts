import { defineEventHandler } from 'h3'
import { $fetch } from 'ofetch'
import { QUERY_GET_FACILITY_BY_ID } from '~/graphql/queries/get_facility_by_id'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const endpoint = config.public.gqlHttpEndpoint
  if (!endpoint) throw createError({ statusCode: 500, statusMessage: 'Missing GQL_HTTP_ENDPOINT' })
  const facilityId = event.context.params?.id
  if (!facilityId) throw createError({ statusCode: 400, statusMessage: 'Missing Facility ID' })
  try {
    const response = await $fetch<{ data?: any; errors?: any[] }>(endpoint, {
      method: 'POST',
      body: {
        query: QUERY_GET_FACILITY_BY_ID,
        variables: { facilityId },
      },
    })
    if (response.errors) throw new Error(response.errors[0].message)
    return response.data.facility
  } catch (err: any) {
    throw createError({ statusCode: 502, statusMessage: err.message })
  }
})