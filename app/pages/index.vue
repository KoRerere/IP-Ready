<script setup lang="ts">

type PlatformFilter = 'all' | 'ai' | 'ecommerce' | 'advertising' | 'social'

interface PlatformCard {
  name: string
  score: number
  icon: string
}

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
  active_vpn?: boolean
  active_tor?: boolean
  recent_abuse?: boolean
  frequent_abuser?: boolean
  high_risk_attacks?: boolean
  abuse_velocity?: string
  bot_status?: boolean
  mobile?: boolean
  risk_score?: number
  operating_system?: string
  browser?: string
  device_model?: string
  device_brand?: string
  analysis: { title: string; summary: string; concern: string }
  scanned_at: string
}

const { locale, t } = useI18n()
const activeFilter = ref<PlatformFilter>('all')
const activeFaq = ref(0)
const activeFeature = ref(0)
const copied = ref(false)
const copyToastMessage = ref(t('misc.copied'))
const platformHasSwapped = ref(false)
const animatedPlatformScores = ref<number[]>([])
const scan = ref<IpScanResult | null>(null)
const scanError = ref('')
const scanPending = ref(true)
const userAgent = ref('Detecting browser…')
const currentTime = ref(new Date())

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

let revealObserver: IntersectionObserver | undefined
let platformScoreObserver: IntersectionObserver | undefined
let platformScoreFrame: number | undefined
let toastTimer: ReturnType<typeof setTimeout> | undefined
let featureTimer: ReturnType<typeof setInterval> | undefined
const revealTimers: ReturnType<typeof setTimeout>[] = []
const infoTableWrap = ref<HTMLElement | null>(null)
const infoTableScrollbar = ref<HTMLElement | null>(null)
const infoTableScrollbarContent = ref<HTMLElement | null>(null)
const infoTableDragging = ref(false)
let infoTableScrollSyncing = false
let infoTableDragPointerId: number | undefined
let infoTableDragStartX = 0
let infoTableDragStartScrollLeft = 0
let infoTableTextPointerId: number | undefined
let infoTableTextStartX = 0
let infoTableTextStartY = 0
let infoTableTextSelectionGesture = false
let infoTableTextGestureResetTimer: ReturnType<typeof setTimeout> | undefined

const featureDuration = 5000

const platformIcon = (filename: string) => `/assets/icons/platform/${filename}`
const claudePlatform: PlatformCard = { name: 'Claude', score: 88, icon: platformIcon('IP_ic_claude.svg') }
const chatGptPlatform: PlatformCard = { name: 'ChatGPT', score: 88, icon: platformIcon('IP_ic_chatgpt.svg') }
const amazonPlatform: PlatformCard = { name: 'Amazon', score: 95, icon: platformIcon('IP_ic_Amazon.svg') }
const ebayPlatform: PlatformCard = { name: 'Ebay', score: 98, icon: platformIcon('IP_ic_eBay.svg') }
const binancePlatform: PlatformCard = { name: 'Binance', score: 76, icon: platformIcon('IP_ic_binance.svg') }

const platformGroups: Record<PlatformFilter, PlatformCard[]> = {
  all: [claudePlatform, chatGptPlatform, amazonPlatform, ebayPlatform, binancePlatform],
  ai: [
    claudePlatform,
    chatGptPlatform,
    { name: 'Gemini', score: 91, icon: platformIcon('IP_ic_gemini.svg') },
    { name: 'Perplexity', score: 84, icon: platformIcon('IP_ic_perplexity.svg') },
    { name: 'Grok', score: 82, icon: platformIcon('IP_ic_grok.svg') },
  ],
  ecommerce: [
    amazonPlatform,
    ebayPlatform,
    { name: 'Shopify', score: 92, icon: platformIcon('IP_ic_Shopify.svg') },
    { name: 'Etsy', score: 89, icon: platformIcon('IP_ic_Etsy.svg') },
    { name: 'AliExpress', score: 85, icon: platformIcon('IP_ic_AliExpress.svg') },
  ],
  advertising: [
    { name: 'Facebook Ads', score: 90, icon: platformIcon('IP_ic_Facebook.svg') },
    { name: 'Instagram Ads', score: 88, icon: platformIcon('IP_ic_instagram.svg') },
    { name: 'TikTok Ads', score: 87, icon: platformIcon('IP_ic_tiktok.svg') },
    { name: 'YouTube Ads', score: 92, icon: platformIcon('IP_ic_youtube.svg') },
    { name: 'LinkedIn Ads', score: 84, icon: platformIcon('IP_ic_linkedin.svg') },
  ],
  social: [
    { name: 'Facebook', score: 91, icon: platformIcon('IP_ic_Facebook.svg') },
    { name: 'Instagram', score: 90, icon: platformIcon('IP_ic_instagram.svg') },
    { name: 'TikTok', score: 89, icon: platformIcon('IP_ic_tiktok.svg') },
    { name: 'Reddit', score: 86, icon: platformIcon('IP_ic_reddit.svg') },
    { name: 'Discord', score: 85, icon: platformIcon('IP_ic_discord.svg') },
  ],
}

const riskScore = computed(() => scan.value?.risk_score ?? 0)
const healthScore = computed(() => scan.value ? Math.max(0, 100 - riskScore.value) : 0)
const riskLevel = computed(() => riskScore.value > 70 ? 'high' : riskScore.value >= 40 ? 'medium' : 'low')
const riskLabel = computed(() => riskLevel.value === 'high' ? t('risk.high') : riskLevel.value === 'medium' ? t('risk.medium') : t('risk.low'))
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
const displayedPlatforms = computed(() => {
  const adjustment = scan.value ? healthScore.value - 86 : 0
  return platformGroups[activeFilter.value].map((platform) => ({
    ...platform,
    score: Math.min(99, Math.max(1, platform.score + adjustment)),
  }))
})
const localTime = computed(() => {
  if (!scan.value?.timezone) return t('misc.na')
  try {
    return currentTime.value.toLocaleString(locale.value === 'zh' ? 'zh-CN' : 'en-US', { dateStyle: 'full', timeStyle: 'long', timeZone: scan.value.timezone })
  } catch {
    return t('misc.na')
  }
})
// AI 分析标题前的表情：检测中不显示，状态好 👍，状态差 ⚠️
const analysisEmoji = computed(() => {
  if (!scan.value) return ''
  return healthScore.value >= 70 ? '👍' : '⚠️'
})

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

// Keep the visible score synchronized with the progress-bar loading motion.
function animatePlatformScores() {
  if (!import.meta.client) return

  const targets = displayedPlatforms.value.map((platform) => platform.score)
  if (platformScoreFrame !== undefined) cancelAnimationFrame(platformScoreFrame)

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    animatedPlatformScores.value = targets
    return
  }

  const startedAt = performance.now()
  const duration = 1000
  const stagger = 70
  animatedPlatformScores.value = targets.map(() => 0)

  const updateScores = (now: number) => {
    let complete = true
    animatedPlatformScores.value = targets.map((target, index) => {
      const progress = Math.min(Math.max((now - startedAt - index * stagger) / duration, 0), 1)
      if (progress < 1) complete = false
      const easedProgress = 1 - Math.pow(1 - progress, 3)
      return Math.round(target * easedProgress)
    })

    if (!complete) platformScoreFrame = requestAnimationFrame(updateScores)
    else platformScoreFrame = undefined
  }

  platformScoreFrame = requestAnimationFrame(updateScores)
}

function preparePlatformScores() {
  animatedPlatformScores.value = displayedPlatforms.value.map(() => 0)
}

function preventBottomOverscroll(event: WheelEvent) {
  if (event.ctrlKey || event.deltaY <= 0) return

  const scrollingElement = document.scrollingElement
  if (!scrollingElement) return

  const atBottom = scrollingElement.scrollTop + window.innerHeight >= scrollingElement.scrollHeight - 1
  if (atBottom) event.preventDefault()
}

useHead({
  title: () => t('meta.title'),
  meta: [
    {
      name: 'description',
      content: () => t('meta.description'),
    },
  ],
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Archivo:wght@500&family=Geist:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@700&display=swap',
    },
  ],
})

onMounted(() => {
  userAgent.value = navigator.userAgent
  void loadIpScan()
  const clockTimer = window.setInterval(() => { currentTime.value = new Date() }, 1000)
  onBeforeUnmount(() => window.clearInterval(clockTimer))
  window.addEventListener('wheel', preventBottomOverscroll, { passive: false })

  revealObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const delay = Number((entry.target as HTMLElement).dataset.revealDelay ?? 0)
          const timer = setTimeout(() => entry.target.classList.add('visible'), delay)
          revealTimers.push(timer)
          revealObserver?.unobserve(entry.target)
        }
      }
    },
    { threshold: 0.13, rootMargin: '0px 0px -48px 0px' },
  )

  const revealGroups = [
    ['.hero-copy .gradient-label', '.hero-copy h1', '.hero-copy .hero-subtitle', '.hero-copy .hero-points'],
    ['.ip-report .report-main', '.ip-report .score-panel'],
    ['.logo-rail'],
    ['.readiness .section-index', '.readiness .section-head h2', '.readiness .section-head > p:not(.section-index)', '.readiness .tabs'],
    ['.platform-grid .platform-card'],
    ['.metric-grid > div'],
    ['.information .section-index', '.information .section-head h2', '.information .section-head > p:not(.section-index)'],
    ['.device-info-card'],
    ['.status-grid > article'],
    ['.feature-row > article'],
    ['.faq-card h2'],
    ['.faq-item'],
    ['.footer-grid > *'],
    ['.footer-bottom'],
    ['.footer-wordmark'],
  ]

  for (const selectors of revealGroups) {
    const groupElements = selectors.flatMap((selector) => Array.from(document.querySelectorAll<HTMLElement>(selector)))
    groupElements.forEach((element, index) => {
      element.classList.add('scroll-reveal-item')
      element.dataset.revealDelay = String(index * 75)
    })
  }

  document.querySelectorAll('.reveal, .scroll-reveal-item').forEach((element) => revealObserver?.observe(element))

  platformScoreObserver = new IntersectionObserver(
    ([entry]) => {
      if (!entry?.isIntersecting) return
      animatePlatformScores()
      platformScoreObserver?.disconnect()
    },
    { threshold: 0.35 },
  )
  const platformGrid = document.querySelector('.platform-grid')
  if (platformGrid) platformScoreObserver.observe(platformGrid)

  syncInfoTableScrollWidth()
  window.addEventListener('resize', syncInfoTableScrollWidth)
  window.addEventListener('resize', hidePlatformPill)
  window.addEventListener('resize', syncTabsPill)
  syncTabsPill()
  // 字体加载完成后按钮宽度会变，重新对齐胶囊
  document.fonts?.ready.then(() => syncTabsPill())

  featureTimer = setInterval(() => {
    activeFeature.value = (activeFeature.value + 1) % 4
  }, featureDuration)
})

onBeforeUnmount(() => {
  window.removeEventListener('wheel', preventBottomOverscroll)
  window.removeEventListener('resize', syncInfoTableScrollWidth)
  window.removeEventListener('resize', hidePlatformPill)
  window.removeEventListener('resize', syncTabsPill)
  revealObserver?.disconnect()
  platformScoreObserver?.disconnect()
  if (platformScoreFrame !== undefined) cancelAnimationFrame(platformScoreFrame)
  if (toastTimer) clearTimeout(toastTimer)
  if (infoTableTextGestureResetTimer) clearTimeout(infoTableTextGestureResetTimer)
  if (featureTimer) clearInterval(featureTimer)
  revealTimers.forEach(clearTimeout)
})

async function copyValue(value: string, message = t('misc.copied')) {
  await navigator.clipboard.writeText(value)
  copyToastMessage.value = message
  copied.value = true
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    copied.value = false
  }, 1600)
}

function copyTableValue(value: string) {
  if (infoTableTextSelectionGesture) {
    infoTableTextSelectionGesture = false
    return
  }

  const selection = window.getSelection()
  if (selection && !selection.isCollapsed && selection.toString().trim()) return
  return copyValue(value)
}

function hasScanValue(value: unknown) {
  return value !== undefined && value !== null && value !== ''
}

function copyDeviceValue(event: MouseEvent) {
  const dd = (event.target as HTMLElement).closest('dd')
  if (!dd?.classList.contains('copyable')) return
  const value = dd.innerText.trim()
  if (value) copyTableValue(value)
}

function copyIp() {
  if (!scan.value?.ip) return
  return copyValue(scan.value.ip, t('misc.ipCopied'))
}

function selectPlatformFilter(filter: PlatformFilter) {
  if (filter === activeFilter.value) return
  platformHasSwapped.value = true
  hidePlatformPill()
  activeFilter.value = filter
  nextTick(syncTabsPill)
}

const tabsEl = ref<HTMLElement | null>(null)
const tabsPill = reactive({ x: 0, y: 0, w: 0, ready: false, snap: false })

function syncTabsPill() {
  const active = tabsEl.value?.querySelector('button.active') as HTMLElement | null
  if (!active) return
  tabsPill.x = active.offsetLeft
  tabsPill.y = active.offsetTop
  tabsPill.w = active.offsetWidth
  if (!tabsPill.ready) {
    // 首次定位不播放滑动动画
    tabsPill.snap = true
    requestAnimationFrame(() => requestAnimationFrame(() => { tabsPill.snap = false }))
  }
  tabsPill.ready = true
}

function hoverTabPill(event: Event) {
  const btn = event.currentTarget as HTMLElement
  tabsPill.x = btn.offsetLeft
  tabsPill.y = btn.offsetTop
  tabsPill.w = btn.offsetWidth
  tabsPill.ready = true
}

const platformPill = reactive({ x: 0, y: 0, w: 0, h: 0, visible: false, snap: false })

function movePlatformPill(event: Event) {
  const card = event.currentTarget as HTMLElement
  platformPill.x = card.offsetLeft
  platformPill.y = card.offsetTop
  platformPill.w = card.offsetWidth
  platformPill.h = card.offsetHeight
  if (!platformPill.visible) {
    // 首次出现时直接就位，不播放滑入动画
    platformPill.snap = true
    requestAnimationFrame(() => requestAnimationFrame(() => { platformPill.snap = false }))
  }
  platformPill.visible = true
}

function hidePlatformPill() {
  platformPill.visible = false
}

function syncInfoTableScrollWidth() {
  const table = infoTableWrap.value?.querySelector('table')
  if (!table || !infoTableScrollbarContent.value) return
  infoTableScrollbarContent.value.style.width = `${table.scrollWidth}px`
}

function syncInfoTableScroll(source: HTMLElement, target: HTMLElement) {
  if (infoTableScrollSyncing) return
  infoTableScrollSyncing = true
  target.scrollLeft = source.scrollLeft
  requestAnimationFrame(() => {
    infoTableScrollSyncing = false
  })
}

function handleInfoTableScroll() {
  if (infoTableWrap.value && infoTableScrollbar.value) {
    syncInfoTableScroll(infoTableWrap.value, infoTableScrollbar.value)
  }
}

function handleInfoTableScrollbarScroll() {
  if (infoTableScrollbar.value && infoTableWrap.value) {
    syncInfoTableScroll(infoTableScrollbar.value, infoTableWrap.value)
  }
}

function handleInfoTablePointerDown(event: PointerEvent) {
  if (event.button !== 0 || event.ctrlKey) return

  const target = event.target instanceof Element ? event.target : null
  if (target?.closest('.copyable-value, .info-table-heading-text')) {
    infoTableTextPointerId = event.pointerId
    infoTableTextStartX = event.clientX
    infoTableTextStartY = event.clientY
    infoTableTextSelectionGesture = false
    return
  }

  const wrap = infoTableWrap.value
  if (!wrap || wrap.scrollWidth <= wrap.clientWidth) return

  infoTableDragPointerId = event.pointerId
  infoTableDragStartX = event.clientX
  infoTableDragStartScrollLeft = wrap.scrollLeft
  wrap.setPointerCapture(event.pointerId)
  event.preventDefault()
}

function handleInfoTablePointerMove(event: PointerEvent) {
  if (event.pointerId === infoTableTextPointerId) {
    const distance = Math.hypot(event.clientX - infoTableTextStartX, event.clientY - infoTableTextStartY)
    if (distance >= 4) infoTableTextSelectionGesture = true
    return
  }

  const wrap = infoTableWrap.value
  if (!wrap || event.pointerId !== infoTableDragPointerId) return

  const deltaX = event.clientX - infoTableDragStartX
  if (!infoTableDragging.value && Math.abs(deltaX) < 4) return

  infoTableDragging.value = true
  wrap.scrollLeft = infoTableDragStartScrollLeft - deltaX
  event.preventDefault()
}

function stopInfoTableDrag(event: PointerEvent) {
  if (event.pointerId === infoTableTextPointerId) {
    infoTableTextPointerId = undefined
    if (infoTableTextGestureResetTimer) clearTimeout(infoTableTextGestureResetTimer)
    if (event.type === 'pointercancel') infoTableTextSelectionGesture = false
    else infoTableTextGestureResetTimer = setTimeout(() => {
      infoTableTextSelectionGesture = false
    }, 0)
    return
  }

  const wrap = infoTableWrap.value
  if (!wrap || event.pointerId !== infoTableDragPointerId) return

  if (wrap.hasPointerCapture(event.pointerId)) wrap.releasePointerCapture(event.pointerId)
  infoTableDragPointerId = undefined
  infoTableDragging.value = false
}
</script>

<template>
    <AppHeader />

    <main id="top">
      <section class="hero-shell">
        <div class="hero-motion" aria-hidden="true">
          <video autoplay loop muted playsinline preload="metadata" src="/assets/gradient-green-hero.mp4"></video>
          <div class="hero-motion-wash"></div>
        </div>

        <div class="hero-copy">
          <p class="gradient-label reveal">{{ t('hero.label') }}</p>
          <h1 class="reveal"><span>{{ t('hero.titleLead') }}</span>{{ t('hero.titleRest') }}</h1>
          <p class="hero-subtitle reveal">
            {{ t('hero.subtitle') }}
          </p>
          <div class="hero-points reveal" aria-label="Product benefits">
            <span><CurrentIcon class="hero-point-icon hero-point-shield" src="/assets/figma/imgVector4.svg" />{{ t('hero.pointScore') }}</span>
            <span><CurrentIcon class="hero-point-icon hero-point-data" src="/assets/figma/imgVector5.svg" />{{ t('hero.pointData') }}</span>
            <span><CurrentIcon class="hero-point-icon hero-point-ai" src="/assets/figma/imgVector6.svg" />{{ t('hero.pointAI') }}</span>
          </div>
        </div>

        <article class="ip-report">
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
            <div class="score-value"><strong>{{ scan ? healthScore : '--' }}</strong><span>/100</span><em :class="scan ? `risk-${riskLevel}` : ''">{{ scan ? riskLabel : t('report.scanning') }}</em></div>
            <div class="score-divider"></div>
            <p class="platform-label">{{ t('report.quickRead') }}</p>
            <div class="quick-platforms">
              <div><span><span class="quick-icon"><img class="simple-glyph" :src="platformIcon('IP_ic_claude.svg')" alt="" /></span>Claude</span><b>{{ t('report.good') }}</b></div>
              <div><span><span class="quick-icon"><img class="simple-glyph" :src="platformIcon('IP_ic_chatgpt.svg')" alt="" /></span>ChatGPT</span><b>{{ t('report.good') }}</b></div>
              <div><span><span class="quick-icon"><img class="simple-glyph" :src="platformIcon('IP_ic_Amazon.svg')" alt="" /></span>Amazon</span><b>{{ t('report.good') }}</b></div>
              <div><span><span class="quick-icon"><img class="simple-glyph" :src="platformIcon('IP_ic_tiktok_shop.svg')" alt="" /></span>Tiktok Shop</span><b>{{ t('report.good') }}</b></div>
            </div>
            <a class="platform-link" href="#readiness">{{ t('report.otherPlatforms') }} <CurrentIcon class="platform-arrow-icon" src="/assets/figma/imgVector29.svg" /></a>
          </aside>
          </div>
        </article>
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

      <div class="details-sections">
        <section class="readiness" id="readiness">
        <div class="readiness-inner">
          <div class="section-head">
            <p class="section-index"><span>2</span>{{ t('readiness.index') }}</p>
            <h2>{{ t('readiness.title') }}</h2>
            <p>{{ t('readiness.subtitle') }}</p>
            <div ref="tabsEl" class="tabs" role="tablist" aria-label="Platform categories" @mouseleave="syncTabsPill">
              <span class="tabs-morph-pill" :class="{ ready: tabsPill.ready, snap: tabsPill.snap }" :style="{ transform: `translate(${tabsPill.x}px, ${tabsPill.y}px)`, width: `${tabsPill.w}px` }" aria-hidden="true"></span>
              <button :class="{ active: activeFilter === 'all' }" type="button" role="tab" :aria-selected="activeFilter === 'all'" @mouseenter="hoverTabPill" @click="selectPlatformFilter('all')">{{ t('tabs.all') }}</button>
              <button :class="{ active: activeFilter === 'ai' }" type="button" role="tab" :aria-selected="activeFilter === 'ai'" @mouseenter="hoverTabPill" @click="selectPlatformFilter('ai')">{{ t('tabs.ai') }}</button>
              <button :class="{ active: activeFilter === 'ecommerce' }" type="button" role="tab" :aria-selected="activeFilter === 'ecommerce'" @mouseenter="hoverTabPill" @click="selectPlatformFilter('ecommerce')">{{ t('tabs.ecommerce') }}</button>
              <button :class="{ active: activeFilter === 'advertising' }" type="button" role="tab" :aria-selected="activeFilter === 'advertising'" @mouseenter="hoverTabPill" @click="selectPlatformFilter('advertising')">{{ t('tabs.advertising') }}</button>
              <button :class="{ active: activeFilter === 'social' }" type="button" role="tab" :aria-selected="activeFilter === 'social'" @mouseenter="hoverTabPill" @click="selectPlatformFilter('social')">{{ t('tabs.social') }}</button>
            </div>
          </div>

          <Transition name="platform-swap" mode="out-in" @before-enter="preparePlatformScores" @enter="animatePlatformScores">
            <div :key="activeFilter" class="platform-grid" :class="{ 'is-swapped': platformHasSwapped }" @mouseleave="hidePlatformPill">
              <span class="platform-morph-pill" :class="{ visible: platformPill.visible, snap: platformPill.snap }" :style="{ transform: `translate(${platformPill.x}px, ${platformPill.y}px)`, width: `${platformPill.w}px`, height: `${platformPill.h}px` }" aria-hidden="true"></span>
              <template v-for="(platform, index) in displayedPlatforms" :key="platform.name">
                <article
                  class="platform-card"
                  :style="{ '--platform-index': index }"
                  @mouseenter="movePlatformPill"
                >
                  <div class="platform-name">
                    <span>
                      <PlatformBrandIcon :name="platform.name" :src="platform.icon" />
                      {{ platform.name }}
                    </span>
                      <CurrentIcon class="check-icon" src="/assets/figma/imgVector2.svg" :label="t('platform.ready')" />
                  </div>
                  <div class="platform-info">
                    <div class="platform-score-block">
                      <div class="platform-score" :aria-label="`${platform.score} out of 100`">
                        <b aria-hidden="true">{{ animatedPlatformScores[index] ?? 0 }}</b>
                        <span aria-hidden="true">/100</span>
                      </div>
                      <div class="meter"><i :style="{ '--score': `${platform.score}%` }"></i></div>
                    </div>
                    <p>{{ t('platform.applicable') }}</p>
                  </div>
                </article>
                <img
                  v-if="index < displayedPlatforms.length - 1"
                  class="platform-divider"
                  src="/assets/figma/imgVector30.svg"
                  alt=""
                  aria-hidden="true"
                />
              </template>
            </div>
          </Transition>

          <div class="metric-grid">
            <div><strong>12</strong><span>{{ t('metrics.signals') }}</span></div>
            <div><strong>{{ t('metrics.live') }}</strong><span>{{ t('metrics.iplocate') }}</span></div>
            <div><strong>8</strong><span>{{ t('metrics.platforms') }}</span></div>
            <div><strong>1</strong><span>{{ t('metrics.aiPass') }}</span></div>
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

        <div class="status-grid">
          <article><strong>{{ scan?.proxy ? t('status.detected') : t('status.notDetected') }}</strong><span>{{ t('status.proxy') }}</span></article>
          <article><strong>{{ scan?.vpn || scan?.tor ? t('status.detected') : t('status.notDetected') }}</strong><span>{{ t('status.vpnTor') }}</span></article>
          <article><strong>{{ scan?.recent_abuse ? t('status.detected') : t('status.notDetected') }}</strong><span>{{ t('status.recentAbuse') }}</span></article>
          <article class="risk-card"><em :class="scan ? `risk-${riskLevel}` : 'detecting'">{{ scan ? riskLabel : t('status.detecting') }}</em><strong>{{ scan ? riskScore : '--' }} / 100</strong><span>{{ t('status.riskScore') }}</span></article>
        </div>
          </div>
        </section>
      </div>

      <section class="faq-section" id="faq">
        <div class="faq-motion" aria-hidden="true">
          <video autoplay loop muted playsinline preload="metadata" src="/assets/gradient-green-faq.mp4"></video>
          <div class="faq-motion-wash"></div>
        </div>
        <div class="faq-card">
          <h2>{{ t('faq.title') }}</h2>
          <div class="faq-list">
            <article class="faq-item" :class="{ active: activeFaq === 0 }">
              <button type="button" :aria-expanded="activeFaq === 0" @click="activeFaq = activeFaq === 0 ? -1 : 0"><span>{{ t('faq.q1') }}</span><CurrentIcon class="faq-toggle-icon faq-plus-icon" src="/assets/figma/imgVector.svg" /></button>
              <div class="faq-answer"><p>{{ t('faq.a1') }}</p></div>
            </article>
            <article class="faq-item" :class="{ active: activeFaq === 1 }"><button type="button" :aria-expanded="activeFaq === 1" @click="activeFaq = activeFaq === 1 ? -1 : 1"><span>{{ t('faq.q2') }}</span><CurrentIcon class="faq-toggle-icon faq-plus-icon" src="/assets/figma/imgVector.svg" /></button><div class="faq-answer"><p>{{ t('faq.a2') }}</p></div></article>
            <article class="faq-item" :class="{ active: activeFaq === 2 }"><button type="button" :aria-expanded="activeFaq === 2" @click="activeFaq = activeFaq === 2 ? -1 : 2"><span>{{ t('faq.q3') }}</span><CurrentIcon class="faq-toggle-icon faq-plus-icon" src="/assets/figma/imgVector.svg" /></button><div class="faq-answer"><p>{{ t('faq.a3') }}</p></div></article>
            <article class="faq-item" :class="{ active: activeFaq === 3 }"><button type="button" :aria-expanded="activeFaq === 3" @click="activeFaq = activeFaq === 3 ? -1 : 3"><span>{{ t('faq.q4') }}</span><CurrentIcon class="faq-toggle-icon faq-plus-icon" src="/assets/figma/imgVector.svg" /></button><div class="faq-answer"><p>{{ t('faq.a4') }}</p></div></article>
            <article class="faq-item" :class="{ active: activeFaq === 4 }"><button type="button" :aria-expanded="activeFaq === 4" @click="activeFaq = activeFaq === 4 ? -1 : 4"><span>{{ t('faq.q5') }}</span><CurrentIcon class="faq-toggle-icon faq-plus-icon" src="/assets/figma/imgVector.svg" /></button><div class="faq-answer"><p>{{ t('faq.a5') }}</p></div></article>
          </div>
        </div>
      </section>

      <section class="feature-row" aria-label="Product qualities" :style="{ '--feature-duration': `${featureDuration}ms` }">
        <article :class="{ 'carousel-active': activeFeature === 0 }"><CurrentIcon class="feature-icon feature-icon-shield" src="/assets/figma/imgSubtract.svg" /><b>{{ t('feature.reliable') }}</b><i></i></article>
        <article :class="{ 'carousel-active': activeFeature === 1 }"><span class="feature-icon feature-icon-efficient" aria-hidden="true"><CurrentIcon class="efficient-back" src="/assets/figma/imgVector40.svg" /><CurrentIcon class="efficient-pen" src="/assets/figma/imgVector41.svg" /><CurrentIcon class="efficient-device" src="/assets/figma/imgSubtract1.svg" /></span><b>{{ t('feature.efficient') }}</b><i></i></article>
        <article :class="{ 'carousel-active': activeFeature === 2 }"><CurrentIcon class="feature-icon feature-icon-target" src="/assets/figma/imgVector42.svg" /><b>{{ t('feature.accurate') }}</b><i></i></article>
        <article :class="{ 'carousel-active': activeFeature === 3 }"><CurrentIcon class="feature-icon feature-icon-aperture" src="/assets/figma/imgVector43.svg" /><b>{{ t('feature.stable') }}</b><i></i></article>
      </section>
    </main>

    <AppFooter />

    <div class="copy-toast" :class="{ show: copied }" role="status" aria-live="polite">{{ copyToastMessage }}</div>
</template>
