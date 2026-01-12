import { defineEventHandler, createError, getQuery, getCookie } from "h3"
import { $fetch } from "ofetch"
import { QUERY_GET_FIELDS } from "~/graphql/queries/get_fields"

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const endpoint = config.public.gqlHttpEndpoint
  if (!endpoint) throw createError({ statusCode: 500, statusMessage: "Missing GQL_HTTP_ENDPOINT" })
  const token = getCookie(event, "admin_token")
  const { stadionId } = getQuery(event)
  try {
    const body: Record<string, any> = { query: QUERY_GET_FIELDS }
    if (stadionId) {
      body.variables = { stadionId: String(stadionId) }
    }

    const headers: Record<string, string> = { "Content-Type": "application/json" }
    if (token) headers.Authorization = `Bearer ${token}`

    const response = await $fetch<{ data?: any; errors?: any[] }>(endpoint, {
      method: "POST",
      headers,
      body,
    })

    if (response?.errors?.length) {
      console.error("[fields/index] GraphQL error", response.errors)
      throw createError({
        statusCode: 400,
        statusMessage: response.errors.map((e) => e?.message).join(" | ") || "GraphQL error",
      })
    }
    const fields = response?.data?.fields ?? [];
    return fields.map((field: any) => ({
      ...field,
      stadion: field.Stadion ?? field.stadion ?? null,
    }))
  } catch (err: any) {
    console.error("[fields/index] upstream failure", err)
    if (err?.statusCode) throw err
    throw createError({ statusCode: 502, statusMessage: err?.message || "Upstream error" })
  }
})
