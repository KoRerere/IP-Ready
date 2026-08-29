import { createHmac, timingSafeEqual } from 'node:crypto'

export const ADMIN_COOKIE = 'blog_admin'

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB)
}

export function getAdminPassword(): string {
  const password = useRuntimeConfig().adminPassword
  if (!password) {
    console.warn('[admin] NUXT_ADMIN_PASSWORD is not set — falling back to the dev default "admin123". Set it before deploying.')
    return 'admin123'
  }
  return password
}

function getSecret(): string {
  const config = useRuntimeConfig()
  return config.adminSecret || `${getAdminPassword()}::ip-ready-blog-admin`
}

export function createSessionToken(): string {
  return createHmac('sha256', getSecret()).update('blog-admin-session').digest('hex')
}

export function verifyPassword(input: string): boolean {
  return safeEqual(input, getAdminPassword())
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false
  return safeEqual(token, createSessionToken())
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  }
}
