import { appendScan } from '../utils/scan-store'
import { isPublicIp, isValidIp, lookupIpIntelligence, normalizeIp } from '../utils/ip-intelligence'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  if (!config.iplocateApiKey) throw createError({ statusCode: 503, statusMessage: 'IP detection is not configured.' })

  // 显式传入 ?ip= 时查询指定 IP，否则检测访问者自身 IP
  const query = getQuery(event)
  const requestedIp = typeof query.ip === 'string' ? normalizeIp(query.ip) : undefined
  if (query.ip && !requestedIp) throw createError({ statusCode: 400, statusMessage: 'Invalid IP address.' })
  if (requestedIp && !isPublicIp(requestedIp)) throw createError({ statusCode: 400, statusMessage: 'Private or reserved IP addresses cannot be checked.' })

  const headers = getRequestHeaders(event)
  let ip = requestedIp
    ?? normalizeIp(headers['cf-connecting-ip'])
    ?? normalizeIp(headers['x-vercel-forwarded-for'])
    ?? normalizeIp(headers['x-forwarded-for'])
    ?? normalizeIp(getRequestIP(event))

  // Local development only: loopback is not queryable, so use this machine's public egress IP.
  if (!requestedIp && !isPublicIp(ip)) {
    const detected = await $fetch<{ ip: string }>('https://api.iplocate.io/json', { timeout: 5_000 })
    ip = normalizeIp(detected.ip)
  }
  if (!ip) throw createError({ statusCode: 400, statusMessage: 'Unable to determine a public IP address.' })
  if (!isValidIp(ip)) throw createError({ statusCode: 400, statusMessage: 'Invalid IP address.' })

  const data = await lookupIpIntelligence(ip, config)
  void appendScan({ ip: data.ip, risk_score: data.risk_score, country_code: data.country_code, scanned_at: data.scanned_at })
  return data
})
