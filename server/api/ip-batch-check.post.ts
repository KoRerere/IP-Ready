import { isValidIp } from '#shared/utils/ip-validation'
import { appendScan, type ScanRecord } from '../utils/scan-store'
import { calculateRisk, isPublicIp, lookupIpIntelligence, type IpScanResult } from '../utils/ip-intelligence'
import { buildLocalStub, isLocalRequestEvent, markLocalStub } from '../utils/local-request'

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
  const riskBucket = hash % 100
  const risk = calculateRisk({
    ip,
    is_anycast: hash % 11 === 0,
    asn: { name: place.isp, type: place.type },
    privacy: {
      is_proxy: riskBucket >= 55,
      is_vpn: riskBucket >= 40,
      is_tor: riskBucket >= 85,
      is_anonymous: riskBucket >= 40,
      is_hosting: riskBucket >= 55 || hash % 3 === 0,
      is_abuser: riskBucket >= 70,
      is_icloud_relay: riskBucket >= 90,
    },
  })
  return {
    ip,
    proxy: riskBucket >= 55,
    vpn: riskBucket >= 40,
    tor: riskBucket >= 85,
    anonymous: riskBucket >= 40,
    hosting: riskBucket >= 55 || hash % 3 === 0,
    recent_abuse: riskBucket >= 70,
    icloud_relay: riskBucket >= 90,
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

  // 包 2（tor1114）：本地/局域网且无代理头的请求不调供应商：校验照常，合法公网 IP 一律返回标注桩，不写扫描记录
  if (isLocalRequestEvent(event)) {
    markLocalStub(event)
    const stubResults: Array<BatchResultOk | BatchResultError> = ips.map((ip) => {
      if (!isValidIp(ip)) return { ip, status: 'error', error: 'Invalid IP address.' }
      if (!isPublicIp(ip)) return { ip, status: 'error', error: 'Private or reserved IP addresses cannot be checked.' }
      return { ip, status: 'ok', data: buildLocalStub(ip) }
    })
    return { results: stubResults, total: stubResults.length }
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
