/**
 * Per-platform readiness scoring.
 *
 * Each platform has its own risk-control model: a set of signal weights
 * (summing to 100) plus region availability rules, derived from the platform's
 * publicly known detection behavior rather than one global risk score.
 * Signals missing from the context are simply not penalized, so callers should
 * only render scores once a scan exists.
 */

export type ReadinessSignalId = 'region' | 'anonymizer' | 'datacenter' | 'abuse'

export type ReadinessLevel = 'ready' | 'caution' | 'risky'

export interface ReadinessContext {
  country_code?: string
  proxy?: boolean
  vpn?: boolean
  tor?: boolean
  anonymous?: boolean
  icloud_relay?: boolean
  hosting?: boolean
  recent_abuse?: boolean
}

export interface PlatformReadiness {
  score: number
  level: ReadinessLevel
  hits: ReadinessSignalId[]
}

interface PlatformModel {
  weights: Record<ReadinessSignalId, number>
  /** Country codes the platform blocks outright. */
  blocked?: string[]
  /** When present, the platform only operates in these markets. */
  onlyIn?: string[]
  sensitivity: { anonymizer: number; datacenter: number; abuse: number }
}

// A hard geo block caps the score here regardless of other signals.
const REGION_BLOCK_CAP = 25
// Tor exit nodes are treated as worst-case anonymizers everywhere.
const TOR_CAP = 40

const PLATFORM_MODELS: Record<string, PlatformModel> = {
  // AI — Anthropic/OpenAI enforce region blocks (CN/HK unsupported) and ban
  // signups from VPN/datacenter ranges aggressively.
  'Claude': {
    weights: { region: 40, anonymizer: 25, datacenter: 25, abuse: 10 },
    blocked: ['CN', 'HK', 'MO', 'RU', 'BY', 'IR', 'KP', 'SY', 'CU'],
    sensitivity: { anonymizer: 1, datacenter: 1, abuse: 0.9 },
  },
  'ChatGPT': {
    weights: { region: 40, anonymizer: 25, datacenter: 25, abuse: 10 },
    blocked: ['CN', 'HK', 'MO', 'RU', 'BY', 'IR', 'KP', 'SY', 'CU'],
    sensitivity: { anonymizer: 1, datacenter: 1, abuse: 0.9 },
  },
  // Google tolerates VPN/datacenter traffic but blocks unsupported regions.
  'Gemini': {
    weights: { region: 45, anonymizer: 20, datacenter: 15, abuse: 20 },
    blocked: ['CN', 'RU', 'KP', 'IR', 'SY', 'CU'],
    sensitivity: { anonymizer: 0.7, datacenter: 0.5, abuse: 0.7 },
  },
  'Perplexity': {
    weights: { region: 45, anonymizer: 20, datacenter: 15, abuse: 20 },
    blocked: ['CN', 'RU', 'KP', 'IR', 'SY', 'CU'],
    sensitivity: { anonymizer: 0.7, datacenter: 0.6, abuse: 0.7 },
  },
  'Grok': {
    weights: { region: 45, anonymizer: 25, datacenter: 15, abuse: 15 },
    blocked: ['CN', 'RU', 'BY', 'KP', 'IR', 'SY', 'CU'],
    sensitivity: { anonymizer: 0.8, datacenter: 0.6, abuse: 0.8 },
  },
  // Ecommerce — marketplaces scrutinize signup/payment from anonymizing and
  // datacenter networks; region blocks are narrow but account limits are not.
  'Amazon': {
    weights: { region: 20, anonymizer: 30, datacenter: 30, abuse: 20 },
    blocked: ['CU', 'IR', 'KP', 'SY'],
    sensitivity: { anonymizer: 0.9, datacenter: 0.9, abuse: 0.9 },
  },
  'Ebay': {
    weights: { region: 20, anonymizer: 30, datacenter: 30, abuse: 20 },
    blocked: ['CU', 'IR', 'KP', 'SY'],
    sensitivity: { anonymizer: 0.9, datacenter: 0.9, abuse: 0.9 },
  },
  // Etsy reviews/suspends new shops opened from datacenter IPs.
  'Etsy': {
    weights: { region: 20, anonymizer: 25, datacenter: 35, abuse: 20 },
    blocked: ['CU', 'IR', 'KP', 'SY'],
    sensitivity: { anonymizer: 0.8, datacenter: 1, abuse: 0.9 },
  },
  'Shopify': {
    weights: { region: 25, anonymizer: 20, datacenter: 30, abuse: 25 },
    blocked: ['CU', 'IR', 'KP', 'SY'],
    sensitivity: { anonymizer: 0.8, datacenter: 0.8, abuse: 0.9 },
  },
  'AliExpress': {
    weights: { region: 25, anonymizer: 25, datacenter: 25, abuse: 25 },
    blocked: ['CU', 'IR', 'KP', 'SY'],
    sensitivity: { anonymizer: 0.5, datacenter: 0.5, abuse: 0.6 },
  },
  // Binance geo-blocks restricted jurisdictions (US/CA/NL/CN/RU among others)
  // and ToS-violating VPN logins can freeze accounts.
  'Binance': {
    weights: { region: 45, anonymizer: 30, datacenter: 15, abuse: 10 },
    blocked: ['US', 'CA', 'NL', 'CN', 'RU', 'IR', 'KP', 'SY', 'CU'],
    sensitivity: { anonymizer: 1, datacenter: 0.7, abuse: 0.8 },
  },
  'Tiktok Shop': {
    weights: { region: 45, anonymizer: 25, datacenter: 20, abuse: 10 },
    onlyIn: ['US', 'MX', 'BR', 'GB', 'IE', 'DE', 'FR', 'IT', 'ES', 'PL', 'JP', 'KR', 'ID', 'MY', 'TH', 'VN', 'PH', 'SG', 'SA'],
    sensitivity: { anonymizer: 0.9, datacenter: 0.8, abuse: 0.8 },
  },
  // Meta's ad and social products disable new accounts on VPN/datacenter IPs.
  'Facebook Ads': {
    weights: { region: 25, anonymizer: 35, datacenter: 25, abuse: 15 },
    blocked: ['CN', 'RU', 'IR', 'KP', 'SY'],
    sensitivity: { anonymizer: 1, datacenter: 0.9, abuse: 0.9 },
  },
  'Instagram Ads': {
    weights: { region: 25, anonymizer: 35, datacenter: 25, abuse: 15 },
    blocked: ['CN', 'RU', 'IR', 'KP', 'SY'],
    sensitivity: { anonymizer: 1, datacenter: 0.9, abuse: 0.9 },
  },
  'Facebook': {
    weights: { region: 25, anonymizer: 35, datacenter: 25, abuse: 15 },
    blocked: ['CN', 'RU', 'IR', 'KP', 'SY'],
    sensitivity: { anonymizer: 1, datacenter: 0.9, abuse: 0.9 },
  },
  'Instagram': {
    weights: { region: 25, anonymizer: 35, datacenter: 25, abuse: 15 },
    blocked: ['CN', 'RU', 'IR', 'KP', 'SY'],
    sensitivity: { anonymizer: 1, datacenter: 0.9, abuse: 0.9 },
  },
  'TikTok Ads': {
    weights: { region: 30, anonymizer: 30, datacenter: 25, abuse: 15 },
    blocked: ['CN', 'IN', 'RU', 'KP', 'IR', 'SY'],
    sensitivity: { anonymizer: 0.9, datacenter: 0.8, abuse: 0.8 },
  },
  'YouTube Ads': {
    weights: { region: 30, anonymizer: 25, datacenter: 25, abuse: 20 },
    blocked: ['KP', 'IR', 'SY', 'CU'],
    sensitivity: { anonymizer: 0.7, datacenter: 0.7, abuse: 0.8 },
  },
  'LinkedIn Ads': {
    weights: { region: 40, anonymizer: 15, datacenter: 25, abuse: 20 },
    blocked: ['CN', 'RU', 'KP', 'IR', 'SY'],
    sensitivity: { anonymizer: 0.7, datacenter: 0.6, abuse: 0.6 },
  },
  // Social — TikTok follows SIM/IP region and degrades datacenter creators.
  'TikTok': {
    weights: { region: 35, anonymizer: 25, datacenter: 25, abuse: 15 },
    blocked: ['CN', 'IN', 'KP'],
    sensitivity: { anonymizer: 0.9, datacenter: 0.8, abuse: 0.8 },
  },
  'Reddit': {
    weights: { region: 20, anonymizer: 30, datacenter: 30, abuse: 20 },
    blocked: ['CN', 'IR', 'KP', 'RU'],
    sensitivity: { anonymizer: 0.9, datacenter: 0.9, abuse: 0.8 },
  },
  'Discord': {
    weights: { region: 25, anonymizer: 25, datacenter: 30, abuse: 20 },
    blocked: ['CN', 'RU', 'IR', 'KP'],
    sensitivity: { anonymizer: 0.8, datacenter: 0.8, abuse: 0.7 },
  },
}

function anonymizerPenalty(ctx: ReadinessContext) {
  if (ctx.tor) return 1
  if (ctx.vpn || ctx.proxy) return 0.75
  if (ctx.anonymous) return 0.5
  if (ctx.icloud_relay) return 0.35
  return 0
}

export function computePlatformReadiness(name: string, ctx: ReadinessContext): PlatformReadiness | undefined {
  const model = PLATFORM_MODELS[name]
  if (!model) return undefined

  const country = ctx.country_code?.toUpperCase()
  const regionPenalty = country
    ? (model.blocked?.includes(country) || (model.onlyIn !== undefined && !model.onlyIn.includes(country)) ? 1 : 0)
    : 0
  const penalties: Array<[ReadinessSignalId, number]> = [
    ['region', regionPenalty],
    ['anonymizer', anonymizerPenalty(ctx) * model.sensitivity.anonymizer],
    ['datacenter', (ctx.hosting ? 1 : 0) * model.sensitivity.datacenter],
    ['abuse', (ctx.recent_abuse ? 1 : 0) * model.sensitivity.abuse],
  ]

  let score = 100
  for (const [id, penalty] of penalties) score -= model.weights[id] * penalty
  if (regionPenalty >= 1) score = Math.min(score, REGION_BLOCK_CAP)
  if (ctx.tor) score = Math.min(score, TOR_CAP)

  const hits = penalties.filter(([, penalty]) => penalty >= 0.25).map(([id]) => id)
  return { score: Math.min(99, Math.max(1, Math.round(score))), level: score >= 70 ? 'ready' : score >= 40 ? 'caution' : 'risky', hits }
}
