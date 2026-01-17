import { getQuery, createError } from 'h3'
import { QUERY_GET_BOOKINGS } from '~/graphql/queries/get_bookings'

interface QueryParams {
    stadionId?: string | number
    date?: string
}

export default defineEventHandler(async (event) => {
    const { stadionId, date } = getQuery<QueryParams>(event)
    const config = useRuntimeConfig()
    const endpoint = config.public.gqlHttpEndpoint
    if (!endpoint) throw createError({ statusCode: 500, statusMessage: 'Missing GQL_HTTP_ENDPOINT' })
    const serviceToken = process.env.GQL_SERVICE_TOKEN || process.env.GQL_PUBLIC_TOKEN || ''

    try {
        const response = await $fetch<{ data?: any; errors?: any[] }>(endpoint, {
            method: 'POST',
            body: {
                query: QUERY_GET_BOOKINGS,
                variables: { stadionId, date },
            },
            headers: {
                'Content-Type': 'application/json',
                ...(serviceToken ? { Authorization: serviceToken } : {}),
            },
        })

        if (response.errors?.length) {
            throw createError({
                statusCode: 400,
                statusMessage: response.errors[0]?.message || 'Failed to load bookings',
            })
        }

        // Updated: bookings now returns { data: [...], pagination: {...} }
        return response.data?.bookings?.data ?? []
    } catch (error: any) {
        if (error?.statusCode) throw error
        throw createError({ statusCode: 502, statusMessage: error?.message || 'Booking service unreachable' })
    }
})