import { QUERY_GET_BOOKINGS } from "~/graphql/queries/get_bookings"
import { print } from 'graphql'

interface BookingsVariables {
    stadionId: number | string,
    date: Date
}

export default defineEventHandler(async (event) => {
    const body = getQuery<BookingsVariables>(event)
    const config = useRuntimeConfig()
    const endpoint = config.public.gqlHttpEndpoint
    if (!endpoint) {
        throw createError({ statusCode: 500, statusMessage: 'Missing GQL_HTTP_ENDPOINT' })
    }

    const token = getCookie(event, 'admin_token')
    if (!token) {
        throw createError({ statusCode: 401, statusMessage: 'Not authenticated' })
    }

    const stadionId = body.stadionId
    const date = body.date
    try {
        const response = await $fetch<{
            data?: { bookings?: { data?: any[], pagination?: any } },
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
                Authorization: `Bearer ${token}`,
            },
            body: {
                query: QUERY_GET_BOOKINGS,
                variables: { stadionId, date }
            },
        })

        if (response?.errors?.length) {
            throw createError({
                statusCode: 400,
                statusMessage: response.errors[0]?.message || 'Failed to get bookings',
            })
        }

        // Updated: bookings now returns { data: [...], pagination: {...} }
        return response.data?.bookings?.data || []
    } catch (error: unknown) {
        if (error as unknown as Error) throw error
        throw createError({ statusCode: 502, statusMessage: 'Bookings service unreachable' })
    }
}) 