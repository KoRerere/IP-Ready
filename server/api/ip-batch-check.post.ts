import { appendScan, type ScanRecord } from '../utils/scan-store'
import { isPublicIp, isValidIp, lookupIpIntelligence, type IpScanResult } from '../utils/ip-intelligence'

// 单次批量检测的 IP 上限，前端输入框的计数器与之保持一致
export const MAX_BATCH_IPS = 20

interface BatchResultOk {
  ip: string
  status: 'ok'
  data: Awaited<ReturnType<typeof lookupIpIntelligence>>
}

interface BatchResultError {
  ip: string
  status: 'error'
  error: string
}

// 本地开发且未配置 iplocate key 时，返回基于 IP 哈希的确定性假数据（同 IP 结果恒定），方便预览完整检测结果样式
const MOCK_PLACES = [
  { code: 'US', city: 'Ashburn', isp: 'Cogent Communications', type: 'hosting' },
  { code: 'CN', city: 'Hangzhou', isp: 'China Telecom', type: 'isp' },
  { code: 'JP', city: 'Tokyo', isp: 'NTT Communications', type: 'hosting' },
  { code: 'GB', city: 'London', isp: 'Vodafone UK', type: 'mobile' },
  { code: 'DE', city: 'Frankfurt', isp: 'Hetzner Online GmbH', type: 'hosting' },
  { code: 'SG', city: 'Singapore', isp: 'Singtel', type: 'isp' },
  { code: 'KR', city: 'Seoul', isp: 'Korea Telecom', type: 'mobile' },
  { code: 'NL', city: 'Amsterdam', isp: 'LeaseWeb Netherlands', type: 'hosting' },
]

function hashIp(ip: string) {
  let hash = 0
  for (let i = 0; i < ip.length; i++) hash = (hash * 31 + ip.charCodeAt(i)) >>> 0
  return hash
}

function buildMockResult(ip: string): IpScanResult {
  const hash = hashIp(ip)
  const place = MOCK_PLACES[hash % MOCK_PLACES.length]!
  const risk = hash % 100
  return {
    ip,
    proxy: risk >= 55,
    vpn: risk >= 40,
    tor: risk >= 85,
    anonymous: risk >= 40,
    hosting: risk >= 55 || hash % 3 === 0,
    recent_abuse: risk >= 70,
    icloud_relay: risk >= 90,
    ISP: place.isp,
    organization: place.isp,
    ASN: 10000 + (hash % 55000),
    country_code: place.code,
    city: place.city,
    connection_type: place.type,
    risk_score: risk,
    analysis: {
      title: risk >= 75 ? 'Your Network Shows Elevated Risk.' : risk >= 40 ? 'Your Network Needs Attention.' : 'Your Network Looks Healthy.',
      summary: risk >= 55 ? 'An anonymizing network signal was detected, which may trigger additional verification.' : 'No active proxy, VPN, or Tor signal was detected in the current scan.',
      concern: risk >= 70 ? 'This IP address appears on an abuse blocklist.' : risk >= 55 ? 'Datacenter characteristics may affect verification on some platforms.' : 'No major network concern was identified from the available signals.',
    },
    scanned_at: new Date().toISOString(),
    source: 'Local mock (no API key)',
  }
}

/** 以固定并发数逐个消费列表，保持结果顺序与输入一致 */
async function mapWithConcurrency<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results = new Array<R>(items.length)
  let cursor = 0
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor++
      results[index] = await fn(items[index]!)
    }
  })
  await Promise.all(workers)
  return results
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)

  const body = await readBody<{ ips?: unknown }>(event).catch(() => null)
  const rawList = Array.isArray(body?.ips) ? body.ips.filter((value): value is string => typeof value === 'string') : []
  if (!rawList.length) throw createError({ statusCode: 400, statusMessage: 'No IP addresses were provided.' })

  // 去重并截断到上限，保持输入顺序
  const seen = new Set<string>()
  const ips: string[] = []
  for (const value of rawList.map((value) => value.trim()).filter(Boolean)) {
    if (ips.length >= MAX_BATCH_IPS) break
    if (seen.has(value)) continue
    seen.add(value)
    ips.push(value)
  }

  if (!config.iplocateApiKey) {
    if (import.meta.dev) {
      const mockResults = ips.map((ip) => ({ ip, status: 'ok' as const, data: buildMockResult(ip) }))
      return { results: mockResults, total: mockResults.length }
    }
    throw createError({ statusCode: 503, statusMessage: 'IP detection is not configured.' })
  }

  const scannedRecords: ScanRecord[] = []
  const results = await mapWithConcurrency<string, BatchResultOk | BatchResultError>(ips, 4, async (ip) => {
    if (!isValidIp(ip)) return { ip, status: 'error', error: 'Invalid IP address.' }
    if (!isPublicIp(ip)) return { ip, status: 'error', error: 'Private or reserved IP addresses cannot be checked.' }
    try {
      const data = await lookupIpIntelligence(ip, config)
      scannedRecords.push({ ip: data.ip, risk_score: data.risk_score, country_code: data.country_code, scanned_at: data.scanned_at })
      return { ip, status: 'ok', data }
    } catch (error) {
      const apiError = error as { data?: { statusMessage?: string }; statusMessage?: string; message?: string }
      return { ip, status: 'error', error: apiError.data?.statusMessage || apiError.statusMessage || apiError.message || 'IP intelligence lookup failed.' }
    }
  })

  // 记录与单 IP 检测接口保持一致，供后台风险统计使用；失败不影响检测本身
  void (async () => {
    for (const record of scannedRecords) await appendScan(record)
  })()

  return { results, total: results.length }
})
