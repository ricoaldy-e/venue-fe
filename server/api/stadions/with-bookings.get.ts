import { defineEventHandler, createError } from 'h3'
import { $fetch } from 'ofetch'
import { QUERY_STADIONS_DATA } from "~/graphql/queries/get_stadions_data"
import { QUERY_BOOKINGS_WITH_DETAILS } from "~/graphql/queries/get_bookings_with_details"

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const endpoint = config.public.gqlHttpEndpoint
    if (!endpoint) throw createError({ statusCode: 500, statusMessage: 'Missing GQL_HTTP_ENDPOINT' })

    try {
        const [stadionsRes, bookingsRes] = await Promise.all([
            $fetch<{ data?: any; errors?: any[] }>(endpoint, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: { query: QUERY_STADIONS_DATA },
            }),
            $fetch<{ data?: any; errors?: any[] }>(endpoint, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: {
                    query: QUERY_BOOKINGS_WITH_DETAILS,
                    variables: {
                        startDate: "2024-01-01T00:00:00Z",
                        endDate: "2026-12-31T23:59:59Z"
                    }
                },
            })
        ])

        if (stadionsRes.errors) throw new Error(stadionsRes.errors[0].message)
        if (bookingsRes.errors) throw new Error(bookingsRes.errors[0].message)

        const stadions = stadionsRes.data.stadions
        // Updated: bookings now returns { data: [...], pagination: {...} }
        const bookings = bookingsRes.data.bookings?.data || []

        const fieldBookingsMap = new Map<string, any[]>()

        bookings.forEach((booking: any) => {
            booking.details?.forEach((detail: any) => {
                const fieldId = String(detail.fieldId)
                if (!fieldBookingsMap.has(fieldId)) {
                    fieldBookingsMap.set(fieldId, [])
                }
                fieldBookingsMap.get(fieldId)!.push({
                    bookingId: booking.id,
                    bookingCode: booking.bookingCode,
                    Booking: {
                        status: booking.status
                    }
                })
            })
        })

        const mergedStadions = stadions.map((stadion: any) => ({
            ...stadion,
            fields: stadion.fields.map((field: any) => {
                const fieldId = String(field.id)
                const bookingsForField = fieldBookingsMap.get(fieldId) || []

                return {
                    ...field,
                    bookingDetails: bookingsForField
                }
            })
        }))

        return mergedStadions
    } catch (err: any) {
        throw createError({ statusCode: 502, statusMessage: err.message })
    }
})