import { getScans } from '../../utils/scan-store'

export interface RiskSummary {
  count: number
  avg: number
  low: number
  medium: number
  high: number
}

/** Risk overview for the admin dashboard: recent scans + aggregate levels. */
export default defineEventHandler(async () => {
  const all = await getScans()
  const recent = all.slice(-50)
  const summary: RiskSummary = {
    count: all.length,
    avg: recent.length ? Math.round(recent.reduce((sum, s) => sum + (s.risk_score ?? 0), 0) / recent.length) : 0,
    low: recent.filter((s) => (s.risk_score ?? 0) < 40).length,
    medium: recent.filter((s) => (s.risk_score ?? 0) >= 40 && (s.risk_score ?? 0) <= 70).length,
    high: recent.filter((s) => (s.risk_score ?? 0) > 70).length,
  }
  return { scans: recent, summary }
})
