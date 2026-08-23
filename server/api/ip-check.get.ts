interface IplocateResponse {
  ip: string
  country?: string | null
  country_code?: string | null
  city?: string | null
  latitude?: number | null
  longitude?: number | null
  time_zone?: string | null
  postal_code?: string | null
  subdivision?: string | null
  is_anycast?: boolean
  asn?: { asn?: string | null; route?: string | null; name?: string | null; domain?: string | null; type?: string | null } | null
  privacy?: { is_abuser?: boolean; is_anonymous?: boolean; is_bogon?: boolean; is_hosting?: boolean; is_icloud_relay?: boolean; is_proxy?: boolean; is_tor?: boolean; is_vpn?: boolean } | null
  hosting?: { provider?: string | null; domain?: string | null; network?: string | null } | null
  company?: { name?: string | null; domain?: string | null; type?: string | null } | null
}

interface IpIntelligence {
  ip: string
  proxy: boolean
  vpn: boolean
  tor: boolean
  anonymous: boolean
  hosting: boolean
  recent_abuse: boolean
  ISP?: string
  organization?: string
  ASN?: number
  host?: string
  ip_range?: string
  country?: string
  country_code?: string
  city?: string
  region?: string
  connection_type?: string
  latitude?: number
  longitude?: number
  zip_code?: string
  timezone?: string
  risk_score: number
}

interface DeepSeekResponse {
  choices?: Array<{ message?: { content?: string } }>
}

function isValidIp(value: string) {
  const ipv4 = value.split('.')
  if (ipv4.length === 4 && ipv4.every((part) => /^\d{1,3}$/.test(part) && Number(part) <= 255)) return true
  return value.includes(':') && /^[0-9a-f:]+$/i.test(value)
}

function normalizeIp(value?: string | null) {
  if (!value) return undefined
  const first = value.split(',')[0]?.trim().replace(/^::ffff:/, '')
  return first && isValidIp(first) ? first : undefined
}

function isPublicIp(ip?: string) {
  if (!ip || !isValidIp(ip)) return false
  return !(ip === '::1' || ip === '0.0.0.0' || ip.startsWith('10.') || ip.startsWith('127.') || ip.startsWith('192.168.') || /^172\.(1[6-9]|2\d|3[01])\./.test(ip) || ip.startsWith('fc') || ip.startsWith('fd') || ip.startsWith('fe80:'))
}

function calculateRisk(data: IplocateResponse) {
  const privacy = data.privacy
  if (privacy?.is_bogon) return 100
  let score = 0
  if (privacy?.is_abuser) score += 60
  if (privacy?.is_tor) score += 50
  else if (privacy?.is_proxy || privacy?.is_vpn) score += 35
  if (privacy?.is_hosting) score += 20
  if (privacy?.is_icloud_relay) score += 10
  if (data.is_anycast) score += 5
  return Math.min(score, 100)
}

function normalizeIntelligence(data: IplocateResponse): IpIntelligence {
  const asnNumber = Number(data.asn?.asn?.replace(/^AS/i, ''))
  return {
    ip: data.ip,
    proxy: Boolean(data.privacy?.is_proxy),
    vpn: Boolean(data.privacy?.is_vpn),
    tor: Boolean(data.privacy?.is_tor),
    anonymous: Boolean(data.privacy?.is_anonymous),
    hosting: Boolean(data.privacy?.is_hosting),
    recent_abuse: Boolean(data.privacy?.is_abuser),
    ISP: data.asn?.name || data.company?.name || undefined,
    organization: data.company?.name || data.asn?.name || undefined,
    ASN: Number.isFinite(asnNumber) ? asnNumber : undefined,
    host: data.company?.domain || data.asn?.domain || undefined,
    ip_range: data.asn?.route || data.hosting?.network || undefined,
    country: data.country || undefined,
    country_code: data.country_code || undefined,
    city: data.city || undefined,
    region: data.subdivision || undefined,
    connection_type: data.company?.type || data.asn?.type || undefined,
    latitude: data.latitude ?? undefined,
    longitude: data.longitude ?? undefined,
    zip_code: data.postal_code || undefined,
    timezone: data.time_zone || undefined,
    risk_score: calculateRisk(data),
  }
}

function fallbackAnalysis(data: IpIntelligence) {
  const anonymous = data.proxy || data.vpn || data.tor
  return {
    title: data.risk_score >= 75 ? 'Your Network Shows Elevated Risk.' : data.risk_score >= 40 ? 'Your Network Needs Attention.' : 'Your Network Looks Healthy.',
    summary: anonymous ? 'An anonymizing network signal was detected, which may trigger additional verification.' : 'No active proxy, VPN, or Tor signal was detected in the current scan.',
    concern: data.recent_abuse ? 'This IP address appears on an abuse blocklist.' : data.hosting ? 'Hosting or datacenter network characteristics may affect verification on some platforms.' : 'No major network concern was identified from the available signals.',
  }
}

async function createAiAnalysis(data: IpIntelligence, config: ReturnType<typeof useRuntimeConfig>) {
  const fallback = fallbackAnalysis(data)
  if (!config.deepseekApiKey) return fallback
  try {
    const response = await $fetch<DeepSeekResponse>(`${config.deepseekBaseUrl}/chat/completions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${config.deepseekApiKey}` },
      body: {
        model: 'deepseek-v4-flash',
        response_format: { type: 'json_object' },
        max_tokens: 220,
        messages: [
          { role: 'system', content: 'You analyze IP reputation data. Return JSON only with string fields title, summary, concern. Be concise, cautious, and never claim platform approval or facts absent from the supplied data.' },
          { role: 'user', content: JSON.stringify(data) },
        ],
      },
      timeout: 12_000,
    })
    const content = response.choices?.[0]?.message?.content
    if (!content) return fallback
    const parsed = JSON.parse(content) as Partial<typeof fallback>
    return { title: parsed.title || fallback.title, summary: parsed.summary || fallback.summary, concern: parsed.concern || fallback.concern }
  } catch {
    return fallback
  }
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  if (!config.iplocateApiKey) throw createError({ statusCode: 503, statusMessage: 'IP detection is not configured.' })

  const headers = getRequestHeaders(event)
  let ip = normalizeIp(headers['cf-connecting-ip']) || normalizeIp(headers['x-vercel-forwarded-for']) || normalizeIp(headers['x-forwarded-for']) || normalizeIp(getRequestIP(event))

  // Local development only: loopback is not queryable, so use this machine's public egress IP.
  if (!isPublicIp(ip)) {
    const detected = await $fetch<{ ip: string }>('https://api.iplocate.io/json', { timeout: 5_000 })
    ip = normalizeIp(detected.ip)
  }
  if (!ip) throw createError({ statusCode: 400, statusMessage: 'Unable to determine a public IP address.' })

  let rawData: IplocateResponse
  try {
    rawData = await $fetch<IplocateResponse>(`https://iplocate.io/api/lookup/${encodeURIComponent(ip)}`, {
      query: { apikey: config.iplocateApiKey },
      timeout: 10_000,
    })
  } catch (error) {
    const apiError = error as { data?: { error?: string }; statusMessage?: string }
    throw createError({ statusCode: 502, statusMessage: apiError.data?.error || apiError.statusMessage || 'IP intelligence lookup failed.' })
  }

  const data = normalizeIntelligence(rawData)
  return { ...data, analysis: await createAiAnalysis(data, config), scanned_at: new Date().toISOString(), source: 'IPLocate' }
})
