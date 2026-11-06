<script setup lang="ts">
import { computePlatformReadiness, type ReadinessContext } from '#shared/utils/platform-readiness'

interface IpScanResult {
  ip: string
  ISP?: string
  organization?: string
  country_code?: string
  city?: string
  region?: string
  connection_type?: string
  latitude?: number
  longitude?: number
  timezone?: string
  vpn?: boolean
  tor?: boolean
  proxy?: boolean
  recent_abuse?: boolean
  hosting?: boolean
  anonymous?: boolean
  icloud_relay?: boolean
  risk_score?: number
  analysis: { title: string; summary: string; concern: string }
}

const { locale, t } = useI18n()
const scan = ref<IpScanResult | null>(null)
const scanError = ref('')
const scanPending = ref(true)
const copied = ref(false)
const copyToastMessage = ref('')
let toastTimer: ReturnType<typeof setTimeout> | undefined

const quickPlatforms = [
  { name: 'Claude', icon: '/assets/icons/platform/IP_ic_claude.svg' },
  { name: 'ChatGPT', icon: '/assets/icons/platform/IP_ic_chatgpt.svg' },
  { name: 'Gemini', icon: '/assets/icons/platform/IP_ic_gemini.svg' },
  { name: 'Amazon', icon: '/assets/icons/platform/IP_ic_Amazon.svg' },
  { name: 'Tiktok Shop', icon: '/assets/icons/platform/IP_ic_tiktok_shop.svg' },
]

const riskScore = computed(() => scan.value?.risk_score ?? 0)
const healthScore = computed(() => (scan.value ? Math.max(0, 100 - riskScore.value) : 0))
const riskLevel = computed(() => (riskScore.value > 70 ? 'high' : riskScore.value >= 40 ? 'medium' : 'low'))
const riskLabel = computed(() => (riskLevel.value === 'high' ? t('risk.high') : riskLevel.value === 'medium' ? t('risk.medium') : t('risk.low')))
const countryName = computed(() => {
  const code = scan.value?.country_code
  if (!code) return t('report.detectingLocation')
  return new Intl.DisplayNames([locale.value === 'zh' ? 'zh-CN' : 'en'], { type: 'region' }).of(code) || code
})
const countryFlag = computed(() => {
  const code = scan.value?.country_code?.toUpperCase()
  return code?.length === 2 ? `/assets/icons/flags/${code}.svg` : ''
})
const coordinates = computed(() => {
  if (scan.value?.latitude == null || scan.value?.longitude == null) return t('misc.na')
  return `${scan.value.latitude}, ${scan.value.longitude}`
})
const readinessContext = computed<ReadinessContext>(() => ({
  country_code: scan.value?.country_code,
  proxy: scan.value?.proxy,
  vpn: scan.value?.vpn,
  tor: scan.value?.tor,
  anonymous: scan.value?.anonymous,
  icloud_relay: scan.value?.icloud_relay,
  hosting: scan.value?.hosting,
  recent_abuse: scan.value?.recent_abuse,
}))
const analysisEmoji = computed(() => {
  if (!scan.value) return ''
  return healthScore.value >= 70 ? '👍' : '⚠️'
})

function quickReadFor(name: string) {
  if (!scan.value) return '--'
  return computePlatformReadiness(name, readinessContext.value)?.level === 'ready' ? t('report.good') : t('report.poor')
}

async function loadIpScan() {
  scanPending.value = true
  scanError.value = ''
  try {
    scan.value = await $fetch<IpScanResult>('/api/ip-check')
  } catch (error) {
    const apiError = error as { data?: { statusMessage?: string }; message?: string }
    scanError.value = apiError.data?.statusMessage || apiError.message || t('misc.scanFailed')
  } finally {
    scanPending.value = false
  }
}

async function copyIp() {
  if (!scan.value?.ip) return
  await navigator.clipboard.writeText(scan.value.ip)
  copyToastMessage.value = t('misc.ipCopied')
  copied.value = true
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { copied.value = false }, 1600)
}

onMounted(() => { void loadIpScan() })
onBeforeUnmount(() => { if (toastTimer) clearTimeout(toastTimer) })
</script>

<template>
  <article class="ip-report landing-detector" :class="{ 'is-pending': scanPending }" :aria-busy="scanPending">
    <div class="report-frame">
      <div class="report-main">
        <div class="report-map">
          <InteractiveGlobe />
        </div>
        <div class="ip-heading">
          <p class="overline">{{ t('report.yourIp') }}</p>
          <div class="ip-line">
            <strong>{{ scan?.ip || (scanPending ? t('report.detecting') : t('report.unavailable')) }}</strong>
            <button class="icon-button copy-ip" type="button" :title="t('report.copyIp')" :aria-label="t('report.copyIp')" :disabled="!scan?.ip" @click="copyIp">
              <CurrentIcon class="copy-icon" src="/assets/figma/imgVector7.svg" />
            </button>
          </div>
          <div class="country-line">
            <img v-if="countryFlag" class="country-flag-icon" :src="countryFlag" alt="" />
            <b>{{ scanError || `${countryName}${scan?.city ? ` / ${scan.city}` : ''}` }}</b>
          </div>
        </div>

        <div class="ip-facts">
          <div><b>{{ scan?.ISP || t('report.detecting') }}</b><span>{{ t('report.isp') }}</span></div>
          <div><b>{{ scan?.connection_type || t('misc.unknown') }}</b><span>{{ t('report.networkType') }}</span></div>
          <div><b>{{ scan?.timezone || t('misc.unknown') }}</b><span>{{ t('report.timezone') }}</span></div>
          <div><b>{{ coordinates }}</b><span>{{ t('report.location') }}</span></div>
        </div>

        <div class="analysis-block">
          <div class="analysis-title">
            <span class="ai-logo"><img src="/assets/figma/imgLogo.svg" alt="" /></span>
            <b>{{ t('report.aiAnalysis') }}</b>
          </div>
          <h2><span v-if="analysisEmoji" aria-hidden="true">{{ analysisEmoji }}</span> {{ scan?.analysis.title || t('report.analyzing') }}</h2>
          <p>{{ scan?.analysis.summary || t('report.checkingSignals') }}</p>
          <p><b>{{ t('report.mainConcern') }}</b> {{ scan?.analysis.concern || t('report.analysisPending') }}</p>
          <div class="analysis-checks">
            <span><CurrentIcon class="analysis-check-icon" src="/assets/figma/imgVector3.svg" />{{ scan?.connection_type || t('report.networkPending') }}</span>
            <span><CurrentIcon class="analysis-check-icon" src="/assets/figma/imgVector3.svg" />{{ scan?.city ? t('report.locationAvailable') : t('report.locationLimited') }}</span>
            <span><CurrentIcon class="analysis-check-icon" src="/assets/figma/imgVector3.svg" />{{ t('report.iplocateChecked') }}</span>
          </div>
        </div>
      </div>

      <aside class="score-panel">
        <p class="score-label">{{ t('report.score') }}</p>
        <div class="score-value">
          <strong>{{ scan ? healthScore : '--' }}</strong>
          <span>/100</span>
          <em :class="scan ? `risk-${riskLevel}` : ''">{{ scan ? riskLabel : t('report.scanning') }}</em>
        </div>
        <div class="score-divider"></div>
        <p class="platform-label">{{ t('report.quickRead') }}</p>
        <div class="quick-platforms">
          <div v-for="platform in quickPlatforms" :key="platform.name">
            <span><span class="quick-icon"><img class="simple-glyph" :src="platform.icon" alt="" /></span>{{ platform.name }}</span>
            <b>{{ quickReadFor(platform.name) }}</b>
          </div>
        </div>
        <a class="platform-link" href="/#readiness">{{ t('report.otherPlatforms') }} <CurrentIcon class="platform-arrow-icon" src="/assets/figma/imgVector29.svg" /></a>
      </aside>
    </div>

    <div class="copy-toast" :class="{ show: copied }" role="status" aria-live="polite">{{ copyToastMessage }}</div>
  </article>
</template>

<style scoped>
.landing-detector {
  position: relative;
  top: auto;
  left: auto;
  z-index: 1;
  width: min(1066px, 100%);
  height: auto;
  margin: 48px auto 0;
  translate: none;
}

.landing-detector :deep(.report-frame) {
  width: 100%;
  max-width: 100%;
}

.landing-detector.is-pending :deep(.score-value strong),
.landing-detector.is-pending :deep(.ip-line strong) {
  opacity: .55;
}
</style>
