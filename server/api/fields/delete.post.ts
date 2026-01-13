import { defineEventHandler, readBody, getCookie, createError } from 'h3'
import { $fetch } from 'ofetch'
import { MUTATION_DELETE_FIELD } from '~/graphql/mutations/delete_field'

export default defineEventHandler(async (event) => {
  const { fieldId } = await readBody(event)
  const config = useRuntimeConfig()
  const endpoint = config.public.gqlHttpEndpoint
  if (!endpoint) throw createError({ statusCode: 500, statusMessage: 'Missing GQL_HTTP_ENDPOINT' })

  const token = getCookie(event, 'admin_token')
  if (!token) throw createError({ statusCode: 401, statusMessage: 'Not authenticated' })
  try {
    const response = await $fetch<{ data?: any; errors?: any[] }>(endpoint, {
      method: 'POST',
      body: {
        query: MUTATION_DELETE_FIELD,
        variables: { fieldId },
      },
      headers: { 'Authorization': `Bearer ${token}` }
    })

    if (response.errors) throw new Error(response.errors[0].message)
    return response.data.deleteField
  } catch (err: any) {
    throw createError({ statusCode: 502, statusMessage: err.message })
  }
})
