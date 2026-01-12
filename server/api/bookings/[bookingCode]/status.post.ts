import { UPDATE_BOOK_STATUS } from "~/graphql/mutations/update_book_status";
import { UPDATE_PAYMENT } from "~/graphql/mutations/update_payment";

export default defineEventHandler(async(event) => {
    const {bookingCode} = getRouterParams(event);
    const body = await readBody<{bookingStatus?: string}>(event)
    const token = getCookie(event, 'admin_token');
    const config = useRuntimeConfig()
    const endpoint = config.public.gqlHttpEndpoint 
    if (!endpoint) {
        throw createError({ statusCode: 500, message: 'missing GQL endpoint' })
    }

    const bookingStatus = body?.bookingStatus
    if (!bookingStatus) {
        throw createError({ statusCode: 400, message: 'bookingStatus is required' })
    }

    const response = await $fetch<{
        data?: { updateBookingStatus?: any }
        errors?: Array<{ message?: string }>
    }>(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: {
            query: UPDATE_BOOK_STATUS,
            variables: { bookingCode, status: bookingStatus },
        },
    })

    if (response.errors?.length) {
        throw createError({ statusCode: 400, message: response.errors[0]?.message || 'failed to update booking status' })
    }

    if (bookingStatus === 'CANCELLED') {
        try {
            await $fetch<{
                data?: { updatePaymentStatus?: any }
                errors?: Array<{ message?: string }>
            }>(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: {
                    query: UPDATE_PAYMENT,
                    variables: { bookingCode, paymentStatus: 'UNPAID' },
                },
            })
        } catch (err) {
            console.warn('Failed to update payment status on cancel:', err)
        }
    }

    return response.data?.updateBookingStatus;
})