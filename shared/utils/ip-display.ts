export type RiskLevel = 'low' | 'medium' | 'high'

export function riskLevelFor(score: number): RiskLevel {
  return score > 70 ? 'high' : score >= 40 ? 'medium' : 'low'
}

export function formatRiskScore(score: number | null | undefined): string {
  return Number.isFinite(score) ? Number(score).toFixed(1) : '0.0'
}

export interface DisplaySignals {
  risk_score?: number
  proxy?: boolean
  vpn?: boolean
  tor?: boolean
  hosting?: boolean
  connection_type?: string
  recent_abuse?: boolean
}

export function isSuspectedExit(data: DisplaySignals): boolean {
  const anonymous = data.proxy || data.vpn || data.tor
  return !anonymous && Boolean(data.hosting) && data.connection_type?.toLowerCase() !== 'residential'
}

export function analysisFor(data: DisplaySignals, t: (key: string) => string) {
  const suspectedExit = isSuspectedExit(data)
  return {
    title: t(`analysis.${riskLevelFor(data.risk_score ?? 0)}`),
    summary: t(data.proxy || data.vpn || data.tor ? 'analysis.anonymizer' : suspectedExit ? 'analysis.suspectedExit' : 'analysis.clean'),
    concern: t(data.recent_abuse ? 'analysis.abuse' : suspectedExit ? 'analysis.suspectedExitConcern' : data.hosting ? 'analysis.hosting' : 'analysis.noConcern'),
  }
}

export function networkTypeLabel(value: string | undefined, t: (key: string) => string, hosting = false): string {
  if (hosting) return t('network.hosting')
  if (!value) return t('misc.unknown')
  const key = ({ isp: 'isp', residential: 'residential', hosting: 'hosting', datacenter: 'hosting', business: 'business', mobile: 'mobile', education: 'education', government: 'government' } as Record<string, string>)[value.toLowerCase()]
  return key ? t(`network.${key}`) : value
}

export function parseBrowserInfo(ua: string) {
  const browser = /(?:Edg|EdgA|EdgiOS)\//.test(ua) ? 'Microsoft Edge'
    : /(?:OPR|Opera)\//.test(ua) ? 'Opera'
    : /(?:Chrome|CriOS)\//.test(ua) ? 'Chrome'
    : /(?:Firefox|FxiOS)\//.test(ua) ? 'Firefox'
    : /Safari\//.test(ua) ? 'Safari' : ''
  const os = /(?:iPhone|iPad|iPod)/.test(ua) ? 'iOS'
    : /Android/.test(ua) ? 'Android'
    : /Windows/.test(ua) ? 'Windows'
    : /CrOS/.test(ua) ? 'ChromeOS'
    : /Macintosh|Mac OS X/.test(ua) ? 'macOS'
    : /Linux/.test(ua) ? 'Linux' : ''
  const device = /iPad|Tablet/.test(ua) ? 'tablet'
    : /iPhone|iPod|Mobile|Android/.test(ua) ? 'mobile' : ua ? 'desktop' : ''
  return { browser, os, device }
}
