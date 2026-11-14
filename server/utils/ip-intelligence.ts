import { isValidIp } from '#shared/utils/ip-validation'
import { isSuspectedExit } from '#shared/utils/ip-display'

export interface IplocateResponse {
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

export interface IpIntelligence {
  ip: string
  proxy: boolean
  vpn: boolean
  tor: boolean
  anonymous: boolean
  hosting: boolean
  recent_abuse: boolean
  icloud_relay: boolean
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

export interface IpAnalysis {
  title: string
  summary: string
  concern: string
}

export interface IpScanResult extends IpIntelligence {
  analysis: IpAnalysis
  scanned_at: string
  source: string
}

interface DeepSeekResponse {
  choices?: Array<{ message?: { content?: string } }>
}


export function normalizeIp(value?: string | null) {
  if (!value) return undefined
  const first = value.split(',')[0]?.trim().replace(/^::ffff:/, '')
  return first && isValidIp(first) ? first : undefined
}

export function isPublicIp(ip?: string) {
  if (!ip || !isValidIp(ip)) return false
  return !(ip === '::1' || ip === '0.0.0.0' || ip.startsWith('10.') || ip.startsWith('127.') || ip.startsWith('192.168.') || /^172\.(1[6-9]|2\d|3[01])\./.test(ip) || ip.startsWith('fc') || ip.startsWith('fd') || ip.startsWith('fe80:'))
}

export function clampRiskScore(score: number) {
  if (!Number.isFinite(score)) return 99.9
  return Math.min(99.9, Math.max(0.1, Math.round(score * 10) / 10))
}

function networkRiskContribution(data: IplocateResponse) {
  const type = `${data.asn?.type || data.company?.type || ""}`.toLowerCase()
  if (type.includes("datacenter") || type.includes("hosting")) return 17.0
  if (type.includes("mobile")) return 5.2
  if (type.includes("residential") || type.includes("isp")) return 3.6
  if (type.includes("business")) return 8.4
  if (type.includes("education") || type.includes("government")) return 6.1
  if (data.privacy?.is_hosting) return 15.8
  return 6.4
}

function providerRiskContribution(data: IplocateResponse) {
  const type = `${data.asn?.type || data.company?.type || ""}`.toLowerCase()
  const provider = `${data.asn?.name || data.company?.name || data.hosting?.provider || ""}`.toLowerCase()
  if (type.includes("datacenter") || type.includes("hosting") || /cloud|vps|server|hosting|datacenter/.test(provider)) return 3.8
  if (type.includes("business")) return 1.8
  if (type.includes("residential") || type.includes("isp") || type.includes("mobile")) return 0.6
  return 1.1
}

function anonymizerRiskContribution(data: IplocateResponse) {
  const privacy = data.privacy
  let score = 0
  if (privacy?.is_tor) score = 36.8
  else if (privacy?.is_proxy && privacy?.is_vpn) score = 31.6
  else if (privacy?.is_proxy) score = 28.4
  else if (privacy?.is_vpn) score = 24.7
  if (privacy?.is_anonymous) score += 4.2
  return score
}

function abuseRiskContribution(data: IplocateResponse, networkRisk: number, anonymizerRisk: number) {
  if (!data.privacy?.is_abuser) return 0
  // The upstream response exposes a boolean only, so use network/anonymizer
  // pressure as a continuous severity proxy instead of inventing abuse counts.
  return 50.2 + networkRisk * 0.24 + anonymizerRisk * 0.08
}

function compatibilityBand(data: IplocateResponse): [number, number] {
  const privacy = data.privacy
  // The old weights are used ONLY to select the existing decision band.
  // The numeric score within it comes from the graded contributions below.
  const legacy = (privacy?.is_abuser ? 60 : 0)
    + (privacy?.is_tor ? 50 : privacy?.is_proxy || privacy?.is_vpn ? 35 : 0)
    + (privacy?.is_hosting ? 20 : 0)
    + (privacy?.is_icloud_relay ? 10 : 0)
    + (data.is_anycast ? 5 : 0)
  if (legacy <= 30) return [0.1, 30]
  if (legacy < 40) return [30.1, 39.9]
  if (legacy <= 70) return [40, 70]
  if (legacy < 75) return [70.1, 74.9]
  return [75, 99.9]
}

function calibrateRiskBand(score: number, lower: number, upper: number) {
  // Smooth shoulders avoid both threshold crossings and a pile-up at a hard cap.
  // Preserve the existing 30 (emoji), 40/70 (level), and 75 (API fallback) decisions.
  const shoulder = Math.min(3, (upper - lower) / 3)
  if (score < lower + shoulder) return lower + shoulder * Math.exp((score - lower - shoulder) / shoulder)
  if (score > upper - shoulder) return upper - shoulder * Math.exp((upper - shoulder - score) / shoulder)
  return score
}

export function calculateRisk(data: IplocateResponse) {
  if (data.privacy?.is_bogon) return 99.9
  const networkRisk = networkRiskContribution(data)
  const anonymizerRisk = anonymizerRiskContribution(data)
  const score = networkRisk
    + providerRiskContribution(data)
    + anonymizerRisk
    + abuseRiskContribution(data, networkRisk, anonymizerRisk)
    + (data.privacy?.is_hosting ? 11.8 + networkRisk * 0.025 + anonymizerRisk * 0.015 : 0)
    + (data.privacy?.is_icloud_relay ? 6.4 + networkRisk * 0.1 + anonymizerRisk * 0.06 : 0)
    + (data.is_anycast ? 3.2 + networkRisk * 0.04 + providerRiskContribution(data) * 0.15 : 0)
  const [lower, upper] = compatibilityBand(data)
  return clampRiskScore(calibrateRiskBand(score, lower, upper))
}

function normalizeIntelligence(data: IplocateResponse): IpIntelligence {
  const asnNumber = Number(data.asn?.asn?.replace(/^AS/i, ''))
  const network = data.asn?.name ? data.asn : data.company
  return {
    ip: data.ip,
    proxy: Boolean(data.privacy?.is_proxy),
    vpn: Boolean(data.privacy?.is_vpn),
    tor: Boolean(data.privacy?.is_tor),
    anonymous: Boolean(data.privacy?.is_anonymous),
    hosting: Boolean(data.privacy?.is_hosting),
    recent_abuse: Boolean(data.privacy?.is_abuser),
    icloud_relay: Boolean(data.privacy?.is_icloud_relay),
    ISP: network?.name || undefined,
    organization: network?.name || undefined,
    ASN: Number.isFinite(asnNumber) ? asnNumber : undefined,
    host: network?.domain || undefined,
    ip_range: data.asn?.route || data.hosting?.network || undefined,
    country: data.country || undefined,
    country_code: data.country_code || undefined,
    city: data.city || undefined,
    region: data.subdivision || undefined,
    connection_type: network?.type || undefined,
    latitude: data.latitude ?? undefined,
    longitude: data.longitude ?? undefined,
    zip_code: data.postal_code || undefined,
    timezone: data.time_zone || undefined,
    risk_score: calculateRisk(data),
  }
}

function fallbackAnalysis(data: IpIntelligence): IpAnalysis {
  const anonymous = data.proxy || data.vpn || data.tor
  const suspectedExit = isSuspectedExit(data)
  return {
    title: data.risk_score >= 75 ? 'Your Network Shows Elevated Risk.' : data.risk_score >= 40 ? 'Your Network Needs Attention.' : 'Your Network Looks Healthy.',
    summary: anonymous ? 'An anonymizing network signal was detected, which may trigger additional verification.' : suspectedExit ? 'No active proxy, VPN, or Tor signal was detected, but this hosting network is a suspected exit signal.' : 'No active proxy, VPN, or Tor signal was detected in the current scan.',
    concern: data.recent_abuse ? 'This IP address appears on an abuse blocklist.' : suspectedExit ? 'This IP is in a datacenter range and may be a proxy or VPN exit, even though it was not found on known VPN exit lists.' : data.hosting ? 'Hosting or datacenter network characteristics may affect verification on some platforms.' : 'No major network concern was identified from the available signals.',
  }
}

async function createAiAnalysis(data: IpIntelligence, config: ReturnType<typeof useRuntimeConfig>): Promise<IpAnalysis> {
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
    const parsed = JSON.parse(content) as Partial<IpAnalysis>
    const suspectedExit = isSuspectedExit(data)
    return {
      title: parsed.title || fallback.title,
      summary: suspectedExit ? fallback.summary : parsed.summary || fallback.summary,
      concern: suspectedExit && !data.recent_abuse ? fallback.concern : parsed.concern || fallback.concern,
    }
  } catch {
    return fallback
  }
}

export async function lookupIpIntelligence(ip: string, config: ReturnType<typeof useRuntimeConfig>): Promise<IpScanResult> {
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
}
