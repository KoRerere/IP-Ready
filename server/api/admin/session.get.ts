import { ADMIN_COOKIE, verifySessionToken } from '../../utils/auth'

export default defineEventHandler((event) => {
  return { authenticated: verifySessionToken(getCookie(event, ADMIN_COOKIE)) }
})
