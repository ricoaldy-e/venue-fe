import { QUERY_GET_BOOKING } from "~/graphql/queries/get_booking_bookingCode"

export default defineEventHandler(async (event) => {
  const {bookingCode} = getRouterParams(event)
  const config = useRuntimeConfig()
  const endpoint = config.public.gqlHttpEndpoint

  if(!endpoint) {
    throw createError({statusCode: 500, message: 'missing GQL enpoint'})
  }

  const response = await $fetch<{
      data?: {booking?: any},
      errors?: Array<{
        message?: string
        extensions?: {
          code?: string
        }
      }> 
    }>(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      query: QUERY_GET_BOOKING,
      variables: { bookingCode },
    },
  })

  if(response.errors?.length) {
    throw createError({statusCode: 400, message: response.errors[0]?.message || 'failed to get booking detail'})
  }

  return response.data?.booking
})