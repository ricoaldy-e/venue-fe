import { defineEventHandler, createError, getCookie } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const endpoint = config.public.gqlHttpEndpoint
  if (!endpoint) throw createError({ statusCode: 500, statusMessage: 'Missing GQL_HTTP_ENDPOINT' })

  const contentType = (event.node.req.headers['content-type'] || '') as string
  if (!contentType.includes('multipart/form-data')) {
    throw createError({ statusCode: 400, statusMessage: 'Expected multipart/form-data' })
  }

  const token = getCookie(event, 'admin_token')
  const headers: Record<string, string> = {
    'apollo-require-preflight': 'true',
    'content-type': contentType,
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  try {
    const chunks: Buffer[] = []
    for await (const chunk of (event.node.req as any)) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
    }
    const reqBuffer = Buffer.concat(chunks)

    const bodyText = reqBuffer.toString('utf8', 0, Math.min(reqBuffer.length, 1024 * 10))
    if (!/name=["']?map["']?/i.test(bodyText) && !/"map"\s*:/.test(bodyText)) {
      throw createError({ statusCode: 400, statusMessage: 'Missing multipart field "map" in request.' })
    }

    const res = await fetch(endpoint, { method: 'POST', headers, body: reqBuffer })
    const respContentType = (res.headers.get && res.headers.get('content-type')) || ''
    if (respContentType.includes('application/json')) {
      const json = await res.json()
      if (json.errors?.length) throw createError({ statusCode: 400, statusMessage: json.errors[0]?.message || 'Upload failed' })
      return json.data
    }

    const text = await res.text()
    const summary = text ? text.slice(0, 200) : 'Empty response'
    throw createError({ statusCode: res.status || 502, statusMessage: `Upstream returned non-JSON response: ${summary}` })
  } catch (err: any) {
    if (err?.statusCode) throw err
    throw createError({ statusCode: 502, statusMessage: err?.message || 'Upload service unreachable' })
  }
})
