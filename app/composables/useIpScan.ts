import { EVALUATED_PLATFORMS } from '#shared/utils/platforms'
import { analysisFor, formatRiskScore, networkTypeLabel, riskLevelFor } from '#shared/utils/ip-display'
import { computePlatformReadiness, type ReadinessContext } from '#shared/utils/platform-readiness'

export interface IpScanResult {
  ip: string
  ISP?: string
  country_code?: string
  city?: string
  timezone?: string
  connection_type?: string
  proxy?: boolean
  vpn?: boolean
  tor?: boolean
  anonymous?: boolean
  icloud_relay?: boolean
  hosting?: boolean
  recent_abuse?: boolean
  risk_score?: number
}

/** Visitor IP scan shared by the landing-page detector cards: fetches /api/ip-check on mount and derives display values. */
export function useIpScan() {
  const { locale, t } = useI18n()
  const scan = ref<IpScanResult | null>(null)
  const pending = ref(true)
  const error = ref('')
  const copied = ref(false)

  const riskScore = computed(() => scan.value?.risk_score ?? 0)
  const riskScoreText = computed(() => scan.value ? formatRiskScore(riskScore.value) : '--')
  const riskLevel = computed(() => riskLevelFor(riskScore.value))
  const riskLabel = computed(() => t('risk.' + riskLevel.value))
  const networkType = computed(() => networkTypeLabel(scan.value?.connection_type, t))
  const analysis = computed(() => scan.value ? analysisFor(scan.value, t) : null)
  const countryName = computed(() => {
    if (!scan.value?.country_code) return t('report.detectingLocation')
    try { return new Intl.DisplayNames([locale.value === 'zh' ? 'zh-CN' : 'en'], { type: 'region' }).of(scan.value.country_code) || scan.value.country_code } catch { return scan.value.country_code }
  })
  const countryFlag = computed(() => {
    const code = scan.value?.country_code?.toUpperCase()
    return code?.length === 2 ? '/assets/icons/flags/' + code + '.svg' : ''
  })
  const readinessContext = computed<ReadinessContext>(() => ({ country_code: scan.value?.country_code, proxy: scan.value?.proxy, vpn: scan.value?.vpn, tor: scan.value?.tor, anonymous: scan.value?.anonymous, icloud_relay: scan.value?.icloud_relay, hosting: scan.value?.hosting, recent_abuse: scan.value?.recent_abuse }))
  const platforms = computed(() => EVALUATED_PLATFORMS.map((platform) => ({ ...platform, readiness: scan.value ? computePlatformReadiness(platform.name, readinessContext.value) : undefined })))
  const signalCards = computed(() => [
    { label: 'Proxy', value: scan.value ? (scan.value.proxy ? 'Detected' : 'Clear') : '--', active: Boolean(scan.value?.proxy) },
    { label: 'VPN', value: scan.value ? (scan.value.vpn ? 'Detected' : 'Clear') : '--', active: Boolean(scan.value?.vpn) },
    { label: 'Tor', value: scan.value ? (scan.value.tor ? 'Detected' : 'Clear') : '--', active: Boolean(scan.value?.tor) },
    { label: 'Abuse', value: scan.value ? (scan.value.recent_abuse ? 'Detected' : 'Clear') : '--', active: Boolean(scan.value?.recent_abuse) },
  ])

  async function loadScan() {
    pending.value = true
    try { scan.value = await $fetch<IpScanResult>('/api/ip-check', { timeout: 30_000, retry: 0 }) } catch (requestError) {
      const response = requestError as { data?: { statusMessage?: string }; message?: string }
      error.value = response.data?.statusMessage || response.message || t('misc.scanFailed')
    } finally { pending.value = false }
  }
  async function copyIp() {
    if (!scan.value?.ip || !navigator.clipboard) return
    await navigator.clipboard.writeText(scan.value.ip)
    copied.value = true
    window.setTimeout(() => { copied.value = false }, 1500)
  }
  onMounted(() => { void loadScan() })

  return { scan, pending, error, copied, riskScore, riskScoreText, riskLevel, riskLabel, networkType, analysis, countryName, countryFlag, platforms, signalCards, copyIp }
}
