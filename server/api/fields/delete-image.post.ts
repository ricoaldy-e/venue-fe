import { defineEventHandler, readBody, getCookie, createError } from 'h3'
import { $fetch } from 'ofetch'
import { MUTATION_DELETE_FIELD_IMAGE } from '~/graphql/mutations/delete_field_image'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { imageIds } = body
  if (!Array.isArray(imageIds) || imageIds.length === 0) return []

  const config = useRuntimeConfig()
  const endpoint = config.public.gqlHttpEndpoint
  if (!endpoint) throw createError({ statusCode: 500, statusMessage: 'Missing GQL_HTTP_ENDPOINT' })

  const token = getCookie(event, 'admin_token')
  if (!token) throw createError({ statusCode: 401, statusMessage: 'Not authenticated' })

  try {
    const results: any[] = []
    for (const id of imageIds) {
      const response = await $fetch<{ data?: any; errors?: any[] }>(endpoint, {
        method: 'POST',
        body: {
          query: MUTATION_DELETE_FIELD_IMAGE,
          variables: { imageId: Number(id) },
        },
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.errors) throw new Error(response.errors[0].message)
      results.push(response.data.deleteFieldImage)
    }

    return results
  } catch (err: any) {
    throw createError({ statusCode: 502, statusMessage: err.message })
  }
})
