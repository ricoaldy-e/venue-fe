import type { FetchError } from "ofetch"
import { MUTATION_UPDATE_OPTION } from "~/graphql/mutations/update_option"

type UpdateOption = {
    name: string,
    nameKet: string,
    description: string,
    unitName: string,
    unitDesc: string,
    email: string,
    nohp: string,
    address: string,
}

export default defineEventHandler(async (event) => {
    const { name, nameKet, description, unitName, unitDesc, email, nohp, address } = await readBody<UpdateOption>(event)
    const config = useRuntimeConfig()
    const endpoint = config.public.gqlHttpEndpoint

    if (!endpoint) {
        throw createError({ statusCode: 500, statusMessage: 'Missing GQL_HTTP_ENDPOINT' })
    }

    const token = getCookie(event, 'admin_token')
    if (!token) {
        throw createError({ statusCode: 401, statusMessage: 'Not authenticated' })
    }

    if (!name || !nameKet || !description || !unitName || !unitDesc || !email || !nohp || !address) {
        throw createError({ statusCode: 400, statusMessage: "Incomplete payload" })
    }

    try {
        const res = await $fetch<{
            data: { updateOption: UpdateOption }
            errors?: Array<{ message?: string }>
        }>(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: {
                query: MUTATION_UPDATE_OPTION,
                variables: {
                    name,
                    nameKet,
                    description,
                    unitName,
                    unitDesc,
                    email,
                    nohp,
                    address
                }
            },
        })

        if (res.errors && res.errors.length) {
            throw createError({
                statusCode: 400,
                statusMessage: res.errors[0]?.message || 'Failed to update operating hour',
            })
        }

        return res.data.updateOption
    } catch (e) {
        const err = e as FetchError
        if (err.statusCode) throw err
        throw createError({ statusCode: 502, message: 'Option service unreachable' })
    }
})