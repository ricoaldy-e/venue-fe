import { defineEventHandler, getCookie, createError } from 'h3'
import jwt from 'jsonwebtoken'
import { AUTH } from '~/utils/constants'

interface JWTPayload {
  id: string
  email: string
  iat: number
  exp: number
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, AUTH.TOKEN_COOKIE_NAME)
  if (!token) return { authenticated: false }

  const secret = config.jwtSecret
  if (!secret) throw createError({ statusCode: 500, statusMessage: 'JWT_SECRET missing' })

  try {
    const payload = jwt.verify(token, secret as string) as JWTPayload
    return { 
      authenticated: true, 
      payload,
      expiresAt: payload.exp * 1000
    }
  } catch {
    return { authenticated: false }
  }
})