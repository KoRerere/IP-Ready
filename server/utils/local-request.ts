import type { H3Event } from 'h3'
import type { IpScanResult } from './ip-intelligence'
import { DEV_LOCAL_VERDICT_HEADER, isLocalRequest } from '../lib/local-request-core'

// 判定逻辑（包 2 封版语义）与 dev 监听器修复见 ../lib/local-request-core.ts
export { isLocalRequest }

export function isLocalRequestEvent(event: H3Event): boolean {
  const headers = getRequestHeaders(event)
  if (import.meta.dev) {
    const token = process.env.IPREADY_DEV_LOCAL_TOKEN
    const verdict = headers[DEV_LOCAL_VERDICT_HEADER]
    if (token && typeof verdict === 'string') return verdict === `${token}:local`
  }
  return isLocalRequest(headers)
}

export const LOCAL_STUB_NOTICE = 'LOCAL STUB — 本地桩数据，未调用 IP 检测服务，不消耗生产 key / local stub, IP provider not called'

export function markLocalStub(event: H3Event) {
  setResponseHeader(event, 'X-IPReady-Stub', 'local-no-provider-call')
  setResponseHeader(event, 'Cache-Control', 'no-store')
}

export function buildLocalStub(ip: string): IpScanResult & { stub: true, stub_notice: string } {
  return {
    stub: true,
    stub_notice: LOCAL_STUB_NOTICE,
    ip,
    risk_score: 0,
    country_code: undefined,
    country: undefined,
    city: 'LOCAL STUB',
    ISP: 'LOCAL STUB (no provider call)',
    organization: 'LOCAL STUB (no provider call)',
    connection_type: 'local-stub',
    proxy: false,
    vpn: false,
    tor: false,
    hosting: false,
    anonymous: false,
    icloud_relay: false,
    recent_abuse: false,
    analysis: {
      title: 'LOCAL STUB',
      summary: LOCAL_STUB_NOTICE,
      concern: 'Local request: the IP provider was not called and no scan was recorded.',
    },
    scanned_at: new Date().toISOString(),
    source: 'Local stub (no provider call)',
  }
}
