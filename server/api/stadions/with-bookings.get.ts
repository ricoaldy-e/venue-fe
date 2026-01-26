import { defineEventHandler, createError } from 'h3'
import { $fetch } from 'ofetch'
import { QUERY_STADIONS_DATA } from "~/graphql/queries/get_stadions_data"
import { QUERY_BOOKINGS_WITH_DETAILS } from "~/graphql/queries/get_bookings_with_details"

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const endpoint = config.public.gqlHttpEndpoint
    if (!endpoint) throw createError({ statusCode: 500, statusMessage: 'Missing GQL_HTTP_ENDPOINT' })

    try {
        const [stadionsRes] = await Promise.all([
            $fetch<{ data?: any; errors?: any[] }>(endpoint, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: { query: QUERY_STADIONS_DATA },
            }),
        ])

        if (stadionsRes.errors) throw new Error(stadionsRes.errors[0].message)

        const stadions = stadionsRes.data.stadions

        return stadions
    } catch (err: any) {
        throw createError({ statusCode: 502, statusMessage: err.message })
    }
})