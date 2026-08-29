import { ADMIN_COOKIE, createSessionToken, sessionCookieOptions, verifyPassword } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ password?: string }>(event).catch(() => null)
  if (!body?.password || !verifyPassword(body.password)) {
    throw createError({ statusCode: 401, statusMessage: 'Incorrect password.' })
  }
  setCookie(event, ADMIN_COOKIE, createSessionToken(), sessionCookieOptions())
  return { ok: true }
})
