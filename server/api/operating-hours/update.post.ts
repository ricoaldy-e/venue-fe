import { defineEventHandler, readBody, getCookie, createError } from 'h3'
import { $fetch } from 'ofetch'
import { MUTATION_UPDATE_OPERATING_HOUR } from '~/graphql/mutations/update_operating_hour'

type UpdateOperatingHourBody = {
  openHour: number
  closeHour: number
}

const isValidHour = (value: number) => Number.isInteger(value) && value >= 0 && value <= 24

export default defineEventHandler(async (event) => {
  const body = await readBody<UpdateOperatingHourBody>(event)
  const config = useRuntimeConfig()
  const endpoint = config.public.gqlHttpEndpoint

  if (!endpoint) {
    throw createError({ statusCode: 500, statusMessage: 'Missing GQL_HTTP_ENDPOINT' })
  }

  const token = getCookie(event, 'admin_token')
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Not authenticated' })
  }

  if (body?.openHour === undefined || body?.closeHour === undefined) {
    throw createError({ statusCode: 400, statusMessage: 'Incomplete payload' })
  }

  const openHour = Number(body.openHour)
  const closeHour = Number(body.closeHour)

  if (!isValidHour(openHour) || !isValidHour(closeHour)) {
    throw createError({ statusCode: 400, statusMessage: 'Jam harus berada antara 0-24' })
  }

  if (closeHour <= openHour) {
    throw createError({ statusCode: 400, statusMessage: 'Jam tutup harus lebih besar daripada jam buka' })
  }

  try {
    const response = await $fetch<{
      data?: { updateOperatingHour?: any }
      errors?: Array<{ message?: string }>
    }>(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: {
        query: MUTATION_UPDATE_OPERATING_HOUR,
        variables: {
          openHour,
          closeHour,
        },
      },
    })

    if (response?.errors?.length) {
      throw createError({
        statusCode: 400,
        statusMessage: response.errors[0]?.message || 'Failed to update operating hour',
      })
    }

    return response?.data?.updateOperatingHour
  } catch (error: any) {
    if (error?.statusCode) throw error
    throw createError({ statusCode: 502, statusMessage: 'Operating hour service unreachable' })
  }
})
