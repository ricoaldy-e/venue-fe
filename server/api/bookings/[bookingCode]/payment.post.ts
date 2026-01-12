import { UPDATE_PAYMENT } from "~/graphql/mutations/update_payment"

export default defineEventHandler(async (event) => {
    const { bookingCode } = getRouterParams(event)
    const token = getCookie(event, 'admin_token')
    const body = await readBody<{ paymentStatus?: string }>(event)
    const config = useRuntimeConfig()
    const endpoint = config.public.gqlHttpEndpoint

    if (!endpoint) {
        throw createError({ statusCode: 500, message: 'missing GQL endpoint' })
    }

    const paymentStatus = body?.paymentStatus
    if (!paymentStatus) {
        throw createError({ statusCode: 400, message: 'paymentStatus is required' })
    }

    const response = await $fetch<{
        data?: { updatePaymentStatus?: any }
        errors?: Array<{ message?: string }>
    }>(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: {
            query: UPDATE_PAYMENT,
            variables: { bookingCode, paymentStatus },
        },
    })

    if (response.errors?.length) {
        throw createError({ statusCode: 400, message: response.errors[0]?.message || 'failed to update payment status' })
    }

    return response.data?.updatePaymentStatus
})