<script setup lang="ts">
interface IpScanResult {
  ip: string
  proxy?: boolean
  ISP?: string
  organization?: string
  ASN?: number
  host?: string
  country_code?: string
  city?: string
  region?: string
  connection_type?: string
  latitude?: number
  longitude?: number
  zip_code?: string
  timezone?: string
  vpn?: boolean
  tor?: boolean
  recent_abuse?: boolean
  risk_score?: number
  browser?: string
  operating_system?: string
  device_brand?: string
  device_model?: string
  analysis: { title: string; summary: string; concern: string }
  scanned_at: string
}

const { locale, t } = useI18n()
const route = useRoute()
const router = useRouter()

const ipInput = ref(typeof route.query.ip === 'string' ? route.query.ip : '')
const scan = ref<IpScanResult | null>(null)
const scanPending = ref(false)
const scanError = ref('')
const copied = ref(false)
const copyToastMessage = ref(t('misc.copied'))
const userAgent = ref('Detecting browser…')
const currentTime = ref(new Date())
let toastTimer: ReturnType<typeof setTimeout> | undefined

const riskScore = computed(() => scan.value?.risk_score ?? 0)
const healthScore = computed(() => scan.value ? Math.max(0, 100 - riskScore.value) : 0)
const riskLevel = computed(() => riskScore.value > 70 ? 'high' : riskScore.value >= 40 ? 'medium' : 'low')
const riskLabel = computed(() => riskScore.value > 70 ? t('risk.high') : riskScore.value >= 40 ? t('risk.medium') : t('risk.low'))
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
const localTime = computed(() => {
  if (!scan.value?.timezone) return t('misc.na')
  try {
    return new Date().toLocaleString(locale.value === 'zh' ? 'zh-CN' : 'en-US', { dateStyle: 'full', timeStyle: 'long', timeZone: scan.value.timezone })
  } catch {
    return t('misc.na')
  }
})
const quickRead = computed(() => (scan.value ? (healthScore.value >= 70 ? t('report.good') : t('report.poor')) : t('report.good')))
// AI 分析标题前的表情：检测中不显示，状态好 👍，状态差 ⚠️
const analysisEmoji = computed(() => {
  if (!scan.value) return ''
  return healthScore.value >= 70 ? '👍' : '⚠️'
})

// 快捷示例：地理归属稳定的真实服务 IP（Apple / 百度 / 推特东京 / BBC）
const sampleIps = [
  { ip: '17.253.144.10', code: 'US' },
  { ip: '110.242.68.66', code: 'CN' },
  { ip: '210.140.92.187', code: 'JP' },
  { ip: '212.58.246.79', code: 'GB' },
]

const supportedServices = [
  { name: 'AliExpress', src: '/assets/figma/imgAliexpress.svg' },
  { name: 'Shopify', src: '/assets/figma/imgShopify.svg' },
  { name: 'eBay', src: '/assets/figma/imgEbay.svg' },
  { name: 'Facebook', src: '/assets/figma/imgFacebook.svg' },
  { name: 'Etsy', src: '/assets/figma/imgEtsy.svg' },
  { name: 'Amazon', src: '/assets/figma/imgAmazon.svg' },
  { name: 'Netflix', src: '/assets/figma/imgNetflix.svg' },
  { name: 'TikTok', src: '/assets/figma/imgTiktok.svg' },
  { name: 'YouTube', src: '/assets/figma/imgYoutube.svg' },
  { name: 'Temu', src: '/assets/figma/imgTemu.svg' },
  { name: 'Best Buy', src: '/assets/figma/imgBestuy.svg' },
  { name: 'Shopee', src: '/assets/figma/imgShopee.svg' },
]
function sampleCountry(code: string) {
  if (locale.value !== 'zh') return code
  try {
    return new Intl.DisplayNames(['zh-CN'], { type: 'region' }).of(code) || code
  } catch {
    return code
  }
}

async function submitCheck() {
  const value = ipInput.value.trim()
  const looksValid = /^\d{1,3}(\.\d{1,3}){3}$/.test(value) || (value.includes(':') && /^[0-9a-f:]+$/i.test(value))
  if (!looksValid) {
    scanError.value = t('check.invalid')
    scan.value = null
    return
  }
  scanPending.value = true
  scanError.value = ''
  try {
    scan.value = await $fetch<IpScanResult>('/api/ip-check', { query: { ip: value } })
    router.replace({ query: { ip: scan.value.ip } })
  } catch (error) {
    const apiError = error as { data?: { statusMessage?: string }; message?: string }
    scanError.value = apiError.data?.statusMessage || apiError.message || t('misc.scanFailed')
    scan.value = null
  } finally {
    scanPending.value = false
  }
}

async function copyValue(value: string, message = t('misc.copied')) {
  await navigator.clipboard.writeText(value)
  copyToastMessage.value = message
  copied.value = true
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { copied.value = false }, 1600)
}

function copyIp() {
  if (!scan.value?.ip) return
  return copyValue(scan.value.ip, t('misc.ipCopied'))
}

useHead({
  title: () => `${t('check.label')} - IP Ready`,
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Archivo:wght@500&family=Geist:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@700&display=swap',
    },
  ],
})

onBeforeUnmount(() => {
  if (toastTimer) clearTimeout(toastTimer)
})

function hasScanValue(value: unknown) {
  return value !== undefined && value !== null && value !== ''
}

function copyDeviceValue(event: MouseEvent) {
  const dd = (event.target as HTMLElement).closest('dd')
  if (!dd?.classList.contains('copyable')) return
  const value = dd.innerText.trim()
  if (value) void copyValue(value)
}

// 支持 /check?ip=x.x.x.x 直接出结果
onMounted(() => {
  userAgent.value = navigator.userAgent
  const clockTimer = window.setInterval(() => { currentTime.value = new Date() }, 1000)
  onBeforeUnmount(() => window.clearInterval(clockTimer))
  if (typeof route.query.ip === 'string' && route.query.ip) void submitCheck()
})
</script>

<template>
  <AppHeader />

  <main>
    <section class="hero-shell check-shell" :class="{ 'has-result': scan }">
      <div class="hero-motion check-hero-motion" aria-hidden="true">
        <span class="motion-blob motion-blob-blue"></span>
        <span class="motion-blob motion-blob-cyan"></span>
        <div class="hero-motion-wash check-motion-wash"></div>
      </div>

      <div class="hero-copy">
        <p class="gradient-label">{{ t('check.label') }}</p>
        <h1>{{ t('check.title') }}</h1>
        <p class="hero-subtitle">{{ t('check.subtitle') }}</p>
        <form class="check-form" @submit.prevent="submitCheck">
          <input
            v-model="ipInput"
            class="check-input"
            type="text"
            inputmode="text"
            autocomplete="off"
            spellcheck="false"
            :placeholder="t('check.placeholder')"
            :aria-label="t('check.placeholder')"
          />
          <button class="check-submit" type="submit" :disabled="scanPending">
            {{ scanPending ? t('report.scanning') : t('check.submit') }}
          </button>
        </form>
        <p v-if="scanError" class="check-error" role="alert">{{ scanError }}</p>

        <div class="check-examples">
          <span class="check-examples-label">{{ t('check.try') }}</span>
          <div class="chip-marquee">
            <div class="chip-track">
              <div class="chip-set">
                <button v-for="sample in sampleIps" :key="sample.ip" type="button" class="check-example-chip" @click="ipInput = sample.ip; submitCheck()">
                  <img class="check-example-flag" :src="`/assets/icons/flags/${sample.code}.svg`" alt="" />
                  <b>{{ sampleCountry(sample.code) }}</b>
                  <span class="check-example-ip">{{ sample.ip }}</span>
                </button>
              </div>
              <div class="chip-set" aria-hidden="true">
                <button v-for="sample in sampleIps" :key="`duplicate-${sample.ip}`" type="button" tabindex="-1" class="check-example-chip" @click="ipInput = sample.ip; submitCheck()">
                  <img class="check-example-flag" :src="`/assets/icons/flags/${sample.code}.svg`" alt="" />
                  <b>{{ sampleCountry(sample.code) }}</b>
                  <span class="check-example-ip">{{ sample.ip }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <article class="ip-report">
        <div class="report-frame">
        <div class="report-main">
          <div class="report-map">
            <InteractiveGlobe tint="blue" />
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
          <div class="score-value"><strong>{{ scan ? healthScore : '--' }}</strong><span>/100</span><em :class="scan ? `risk-${riskLevel}` : ''">{{ scan ? riskLabel : t('report.scanning') }}</em></div>
          <div class="score-divider"></div>
          <p class="platform-label">{{ t('report.quickRead') }}</p>
          <div class="quick-platforms">
            <div><span><span class="quick-icon"><img class="simple-glyph" src="/assets/icons/platform/IP_ic_claude.svg" alt="" /></span>Claude</span><b>{{ quickRead }}</b></div>
            <div><span><span class="quick-icon"><img class="simple-glyph" src="/assets/icons/platform/IP_ic_chatgpt.svg" alt="" /></span>ChatGPT</span><b>{{ quickRead }}</b></div>
            <div><span><span class="quick-icon"><img class="simple-glyph" src="/assets/icons/platform/IP_ic_Amazon.svg" alt="" /></span>Amazon</span><b>{{ quickRead }}</b></div>
            <div><span><span class="quick-icon"><img class="simple-glyph" src="/assets/icons/platform/IP_ic_tiktok_shop.svg" alt="" /></span>Tiktok Shop</span><b>{{ quickRead }}</b></div>
          </div>
          <a class="platform-link" href="/#readiness">{{ t('report.otherPlatforms') }} <CurrentIcon class="platform-arrow-icon" src="/assets/figma/imgVector29.svg" /></a>
        </aside>
        </div>
      </article>

      <div v-if="scan" class="check-status-grid status-grid">
        <article><strong>{{ scan.proxy ? t('status.detected') : t('status.notDetected') }}</strong><span>{{ t('status.proxy') }}</span></article>
        <article><strong>{{ scan.vpn || scan.tor ? t('status.detected') : t('status.notDetected') }}</strong><span>{{ t('status.vpnTor') }}</span></article>
        <article><strong>{{ scan.recent_abuse ? t('status.detected') : t('status.notDetected') }}</strong><span>{{ t('status.recentAbuse') }}</span></article>
        <article class="risk-card"><em :class="`risk-${riskLevel}`">{{ riskLabel }}</em><strong>{{ riskScore }} / 100</strong><span>{{ t('status.riskScore') }}</span></article>
      </div>
    </section>

    <section class="logo-rail" aria-label="Supported services">
      <div class="logo-track">
        <div class="logo-set">
          <img v-for="service in supportedServices" :key="service.name" :src="service.src" :alt="service.name" />
        </div>
        <div class="logo-set" aria-hidden="true">
          <img v-for="service in supportedServices" :key="`duplicate-${service.name}`" :src="service.src" alt="" />
        </div>
      </div>
    </section>

    <section class="information section-panel" id="information">
      <div class="information-inner">
        <div class="section-head">
          <p class="section-index"><span>1</span>{{ t('info.index') }}</p>
          <h2>{{ t('info.title') }}</h2>
          <p>{{ t('info.subtitle') }}</p>
        </div>

        <div class="device-card-grid" aria-label="Network and device details" @click="copyDeviceValue">
          <article class="device-info-card">
            <h3><img class="device-card-icon" src="/assets/figma/icon-location.png" alt="" />{{ t('info.location') }}</h3>
            <dl>
              <div><dt>{{ t('info.country') }}</dt><dd :class="{ copyable: hasScanValue(scan?.country_code) }"><span class="country-value"><img v-if="countryFlag" class="country-flag-icon" :src="countryFlag" alt="" />{{ countryName }}</span></dd></div>
              <div><dt>{{ t('info.state') }}</dt><dd :class="{ copyable: hasScanValue(scan?.region) }">{{ scan?.region || t('misc.na') }}</dd></div>
              <div><dt>{{ t('info.city') }}</dt><dd :class="{ copyable: hasScanValue(scan?.city) }">{{ scan?.city || t('misc.na') }}</dd></div>
              <div><dt>{{ t('info.hostname') }}</dt><dd :class="{ copyable: hasScanValue(scan?.host) }">{{ scan?.host || t('misc.na') }}</dd></div>
              <div><dt>{{ t('info.postalCode') }}</dt><dd :class="{ copyable: hasScanValue(scan?.zip_code) }">{{ scan?.zip_code || t('misc.na') }}</dd></div>
              <div><dt>{{ t('info.coordinates') }}</dt><dd :class="{ copyable: coordinates !== t('misc.na') }" class="accent-value">{{ coordinates }}</dd></div>
              <div><dt>{{ t('info.isp') }}</dt><dd :class="{ copyable: hasScanValue(scan?.ISP) }">{{ scan?.ISP || t('misc.na') }}</dd></div>
              <div><dt>{{ t('info.organization') }}</dt><dd :class="{ copyable: hasScanValue(scan?.organization) }">{{ scan?.organization || t('misc.na') }}</dd></div>
              <div><dt>{{ t('info.connection') }}</dt><dd :class="{ copyable: hasScanValue(scan?.connection_type) }">{{ scan?.connection_type || t('misc.na') }}</dd></div>
              <div><dt>{{ t('info.asn') }}</dt><dd :class="{ copyable: hasScanValue(scan?.ASN) }" class="accent-value">{{ scan?.ASN ? `AS${scan.ASN}` : t('misc.na') }}</dd></div>
            </dl>
          </article>

          <article class="device-info-card">
            <h3><img class="device-card-icon" src="/assets/figma/icon-time.png" alt="" />{{ t('info.time') }}</h3>
            <dl>
              <div><dt>{{ t('info.timezone') }}</dt><dd :class="{ copyable: hasScanValue(scan?.timezone) }">{{ scan?.timezone || t('misc.na') }}</dd></div>
              <div><dt>{{ t('info.ipLocalTime') }}</dt><dd :class="{ copyable: localTime !== t('misc.na') }">{{ localTime }}</dd></div>
              <div><dt>{{ t('info.systemTime') }}</dt><dd class="copyable">{{ currentTime.toLocaleString(locale === 'zh' ? 'zh-CN' : 'en-US') }}</dd></div>
            </dl>
          </article>

          <article class="device-info-card">
            <h3><img class="device-card-icon" src="/assets/figma/icon-browser.png" alt="" />{{ t('info.browser') }}</h3>
            <dl>
              <div><dt>{{ t('info.userAgent') }}</dt><dd class="copyable">{{ userAgent }}</dd></div>
              <div><dt>{{ t('info.detectedBrowser') }}</dt><dd :class="{ copyable: hasScanValue(scan?.browser) }">{{ scan?.browser || t('misc.na') }}</dd></div>
              <div><dt>{{ t('info.os') }}</dt><dd :class="{ copyable: hasScanValue(scan?.operating_system) }">{{ scan?.operating_system || t('misc.na') }}</dd></div>
              <div><dt>{{ t('info.device') }}</dt><dd :class="{ copyable: hasScanValue(scan?.device_brand) || hasScanValue(scan?.device_model) }">{{ [scan?.device_brand, scan?.device_model].filter(Boolean).join(' ') || t('misc.na') }}</dd></div>
            </dl>
          </article>
        </div>
      </div>
    </section>
  </main>

  <AppFooter />

  <div class="copy-toast" :class="{ show: copied }" role="status" aria-live="polite">{{ copyToastMessage }}</div>
</template>

<style scoped>
.check-shell { height: auto; min-height: 560px; padding-bottom: 0; }
/* 复刻 wrangle.ai 的蓝色渐变动画背景 */
.check-shell .gradient-label { background: linear-gradient(94deg, #2f7fe8 0%, #35b1d8 25%, #6ad9e8 50%, #2f7fe8 75%, #35b1d8 100%); background-size: 260% 100%; background-position: 100% 50%; -webkit-background-clip: text; background-clip: text; }
.check-hero-motion { background: linear-gradient(180deg, #ffffff 10%, #f2f7fc 48%, #e7f0fa 100%); overflow: hidden; }
.check-motion-wash { background: linear-gradient(180deg, rgba(255,255,255,.95) 0%, rgba(255,255,255,.72) 20%, rgba(255,255,255,.15) 42%, rgba(255,255,255,0) 58%); }
.motion-blob { position: absolute; will-change: transform; }
.motion-blob-blue {
  left: 2%; top: 102%; width: 96%; height: 120%; transform: translate(-50%, -50%);
  background: radial-gradient(closest-side, rgba(92, 157, 238, .82) 0%, rgba(92, 157, 238, .28) 52%, rgba(92, 157, 238, 0) 76%);
  animation: blob-drift-blue 11s ease-in-out infinite alternate;
}
.motion-blob-cyan {
  left: 74%; top: 104%; width: 88%; height: 105%; transform: translate(-50%, -50%);
  background: radial-gradient(closest-side, rgba(106, 217, 232, .6) 0%, rgba(106, 217, 232, .2) 55%, rgba(106, 217, 232, 0) 78%);
  animation: blob-drift-cyan 13s ease-in-out infinite alternate-reverse;
}
@keyframes blob-drift-blue {
  from { transform: translate(-50%, -50%) scale(1); }
  to { transform: translate(-42%, -62%) scale(1.1); }
}
@keyframes blob-drift-cyan {
  from { transform: translate(-50%, -50%) scale(1); }
  to { transform: translate(-60%, -60%) scale(1.12); }
}
@keyframes chip-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@media (prefers-reduced-motion: reduce) {
  .motion-blob { animation: none; }
}
/* /check 页脚 logo 字改为蓝色主题 */
:deep(.footer-wordmark p) { background: linear-gradient(103.14deg, #5c9dee 0%, #9cc3f2 38%, #6ad9e8 68%, #8fc6ee 100%); -webkit-background-clip: text; background-clip: text; }
.check-shell.has-result { min-height: 980px; padding-bottom: 120px; }
.check-shell .hero-copy { position: relative; top: 0; left: auto; transform: none; margin: 0 auto; padding-top: 96px; max-width: 1066px; width: calc(100% - 100px); }
.check-shell .ip-report { position: relative; top: auto; left: auto; translate: none; margin: 56px auto 0; }
/* 无结果时占位卡片底部溢出被裁切，跟首页一致 */
.check-shell:not(.has-result) .ip-report { margin-bottom: -40px; }
/* /check 页无状态格，取消首页为容纳状态格设置的 min-height */
.information { min-height: 0; }
/* wrangle 风格：外层磨砂玻璃衬底 + 内层白卡 */
.check-shell .ip-report { display: block; height: auto; overflow: visible; padding: 8px; border: 0; border-radius: 16px; background: rgba(255, 255, 255, .2); -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px); box-shadow: 0 32px 80px rgba(31, 63, 104, .16); }
.check-shell .report-frame { display: grid; grid-template-columns: minmax(0, 1fr) 325px; overflow: hidden; border: 1px solid rgba(255, 255, 255, .6); border-radius: 12px; background: #fff; }
.check-form { display: flex; gap: 10px; align-items: center; justify-content: center; width: 100%; max-width: 620px; margin: 28px auto 0; }
.check-input {
  flex: 1 1 auto;
  min-width: 0;
  height: 52px;
  padding: 0 18px;
  border: 1px solid #dfe5e2;
  border-radius: 12px;
  background: rgba(255, 255, 255, .9);
  color: #0a0a0a;
  font-family: "JetBrains Mono", monospace;
  font-size: 15px;
  outline: none;
  transition: border-color .2s, box-shadow .2s;
}
.check-input::placeholder { color: #9aa4a0; font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; }
.check-input:focus { border-color: #17b57d; box-shadow: 0 0 0 3px rgba(23, 181, 125, .15); }
.check-submit {
  flex: 0 0 auto;
  height: 52px;
  padding: 0 26px;
  border: 0;
  border-radius: 12px;
  background: var(--ink);
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity .2s, transform .2s;
}
.check-submit:hover { transform: translateY(-1px); }
.check-submit:disabled { opacity: .6; cursor: wait; transform: none; }
.check-error { margin: 14px 0 0; color: #dc2626; font-size: 13px; text-align: center; }
.check-examples { display: flex; gap: 14px; align-items: center; justify-content: center; width: min(860px, calc(100% - 40px)); margin: 20px auto 0; }
.check-examples-label { flex: 0 0 auto; color: var(--muted-ink, #6b7280); font-size: 13px; }
.chip-marquee { flex: 1 1 auto; min-width: 0; overflow: hidden; padding: 9px 0; -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 5%, #000 95%, transparent 100%); mask-image: linear-gradient(90deg, transparent 0, #000 5%, #000 95%, transparent 100%); }
.chip-track { display: flex; width: max-content; align-items: center; animation: chip-marquee 22s linear infinite; will-change: transform; }
.chip-set { display: flex; flex: 0 0 auto; gap: 10px; align-items: center; padding-right: 10px; }
.check-example-chip { display: inline-flex; gap: 7px; align-items: center; padding: 7px 14px; border: 0; border-radius: 999px; background: rgba(255, 255, 255, .7); -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px); color: #334155; cursor: pointer; }
.check-example-flag { width: 17px; height: 12px; flex: 0 0 auto; object-fit: cover; border-radius: 2px; }
.check-example-chip b { font-size: 12.5px; font-weight: 600; color: #334155; }
.check-example-ip { font-family: "JetBrains Mono", monospace; font-size: 13px; color: #0f172a; }
.check-status-grid { position: relative; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; width: min(1066px, calc(100% - 100px)); margin: 40px auto 0; }
.check-status-grid article { position: relative; display: flex; height: 111px; flex-direction: column; gap: 8px; align-items: center; justify-content: center; padding: 24px 16px; border: 1px solid #dfe2e7; border-radius: 12px; background: #fff; }
.check-status-grid strong { font-size: 20px; }
.check-status-grid span { color: var(--muted-ink); font-size: 13px; }
.check-status-grid em { position: absolute; top: -13px; right: 11px; padding: 4px 7px; border-radius: 6px; font-family: "DingTalk JinBuTi", sans-serif; font-size: 14px; font-style: normal; line-height: 18px; }
.check-status-grid em.detecting { background: #eef1f4; color: var(--muted-ink); }
@media (max-width: 900px) {
  .check-shell { min-height: 0; margin: -64px 16px 0; border-radius: 0 0 20px 20px; padding-bottom: 48px; }
  .check-shell .hero-copy { top: 0; padding-top: 112px; width: calc(100% - 32px); }
  .check-shell h1 { font-size: 32px; }
  .check-form { flex-direction: column; max-width: 100%; }
  .check-input, .check-submit { width: 100%; }
  .check-shell .ip-report { position: relative; margin: 48px 0 0; }
  .check-shell .report-frame { grid-template-columns: minmax(0, 1fr); }
  .check-status-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); width: calc(100% - 32px); }
}
</style>
