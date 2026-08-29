import { ADMIN_COOKIE, verifySessionToken } from '../utils/auth'

/** Guard every /api/admin/** endpoint except login and session-check. */
export default defineEventHandler((event) => {
  const url = getRequestURL(event)
  if (!url.pathname.startsWith('/api/admin')) return
  if (url.pathname === '/api/admin/login') return
  if (url.pathname === '/api/admin/session') return

  const token = getCookie(event, ADMIN_COOKIE)
  if (!verifySessionToken(token)) {
    throw createError({ statusCode: 401, statusMessage: 'Admin authentication required.' })
  }
})
