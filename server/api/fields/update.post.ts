import { defineEventHandler, readBody, getCookie, createError } from 'h3'
import { $fetch } from 'ofetch'
import { MUTATION_UPDATE_FIELD } from '~/graphql/mutations/update_field'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()
  const endpoint = config.public.gqlHttpEndpoint
  if (!endpoint) throw createError({ statusCode: 500, statusMessage: 'Missing GQL_HTTP_ENDPOINT' })

  const token = getCookie(event, 'admin_token')
  if (!token) throw createError({ statusCode: 401, statusMessage: 'Not authenticated' })

  try {
    const variables = {
      fieldId: String(body.fieldId),
      stadionId: Number(body.stadionId),
      name: body.name,
      description: body.description,
      // HARGA DISEMBUNYIKAN: Terima dari body (default 0 dari FE)
      // Tidak hardcode agar nanti bisa reactive kalau fitur diaktifkan
      pricePerHour: Number(body.pricePerHour || 0),
      status: body.status,
      images: body.images,
    }

    const response = await $fetch<{ data?: any; errors?: any[] }>(endpoint, {
      method: 'POST',
      body: {
        query: MUTATION_UPDATE_FIELD,
        variables,
      },
      headers: { 'Authorization': `Bearer ${token}` }
    })

    if (response.errors) {
      const msg = response.errors[0].message
      throw createError({ statusCode: 400, statusMessage: msg })
    }
    return response.data.updateField
  } catch (err: any) {
    if (err.statusCode) throw err
    throw createError({ statusCode: 502, statusMessage: err.message })
  }
})
