import { appendScan, type ScanRecord } from '../utils/scan-store'
import { isPublicIp, isValidIp, lookupIpIntelligence } from '../utils/ip-intelligence'

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
  if (!config.iplocateApiKey) throw createError({ statusCode: 503, statusMessage: 'IP detection is not configured.' })

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
