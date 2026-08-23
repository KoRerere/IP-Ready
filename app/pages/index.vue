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

const activeFilter = ref<PlatformFilter>('all')
const activeFaq = ref(0)
const activeFeature = ref(0)
const copied = ref(false)
const copyToastMessage = ref('Copied to clipboard')
const platformHasSwapped = ref(false)
const animatedPlatformScores = ref<number[]>([])
const scan = ref<IpScanResult | null>(null)
const scanError = ref('')
const scanPending = ref(true)
const userAgent = ref('Detecting browser…')
const currentTime = ref(new Date())

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
const riskLabel = computed(() => riskLevel.value === 'high' ? 'High Risk' : riskLevel.value === 'medium' ? 'Medium Risk' : 'Low Risk')
const countryName = computed(() => {
  const code = scan.value?.country_code
  if (!code) return 'Detecting location…'
  return new Intl.DisplayNames(['en'], { type: 'region' }).of(code) || code
})
const countryFlag = computed(() => {
  const code = scan.value?.country_code?.toUpperCase()
  return code?.length === 2 ? `/assets/icons/flags/${code}.svg` : ''
})
const coordinates = computed(() => {
  if (scan.value?.latitude == null || scan.value?.longitude == null) return 'N/A'
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
  if (!scan.value?.timezone) return 'N/A'
  try {
    return currentTime.value.toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'long', timeZone: scan.value.timezone })
  } catch {
    return 'N/A'
  }
})

async function loadIpScan() {
  scanPending.value = true
  scanError.value = ''
  try {
    scan.value = await $fetch<IpScanResult>('/api/ip-check')
  } catch (error) {
    const apiError = error as { data?: { statusMessage?: string }; message?: string }
    scanError.value = apiError.data?.statusMessage || apiError.message || 'IP scan failed.'
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

useHead({
  title: 'IP-Ready - AI IP Intelligence',
  meta: [
    {
      name: 'description',
      content: 'AI-powered IP intelligence, risk analysis, and platform readiness.',
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

  featureTimer = setInterval(() => {
    activeFeature.value = (activeFeature.value + 1) % 4
  }, featureDuration)
})

onBeforeUnmount(() => {
  window.removeEventListener('wheel', preventBottomOverscroll)
  window.removeEventListener('resize', syncInfoTableScrollWidth)
  revealObserver?.disconnect()
  platformScoreObserver?.disconnect()
  if (platformScoreFrame !== undefined) cancelAnimationFrame(platformScoreFrame)
  if (toastTimer) clearTimeout(toastTimer)
  if (infoTableTextGestureResetTimer) clearTimeout(infoTableTextGestureResetTimer)
  if (featureTimer) clearInterval(featureTimer)
  revealTimers.forEach(clearTimeout)
})

async function copyValue(value: string, message = 'Copied to clipboard') {
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

function copyDeviceValue(event: MouseEvent) {
  const value = (event.target as HTMLElement).closest('dd')?.innerText.trim()
  if (value) copyTableValue(value)
}

function copyIp() {
  if (!scan.value?.ip) return
  return copyValue(scan.value.ip, 'IP address copied')
}

function selectPlatformFilter(filter: PlatformFilter) {
  if (filter === activeFilter.value) return
  platformHasSwapped.value = true
  activeFilter.value = filter
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
          <p class="gradient-label reveal">AI-Powered IP Intelligence</p>
          <h1 class="reveal"><span>Know Your IP.</span>Understand its Risk and Platform Readiness.</h1>
          <p class="hero-subtitle reveal">
            AI IP Checker turns public network data into a clear score, an explainable verdict, and practical platform-readiness signals.
          </p>
          <div class="hero-points reveal" aria-label="Product benefits">
            <span><CurrentIcon class="hero-point-icon hero-point-shield" src="/assets/figma/imgVector4.svg" />Explainable Score</span>
            <span><CurrentIcon class="hero-point-icon hero-point-data" src="/assets/figma/imgVector5.svg" />Public Network Data</span>
            <span><CurrentIcon class="hero-point-icon hero-point-ai" src="/assets/figma/imgVector6.svg" />AI-Assisted Verdict</span>
          </div>
        </div>

        <article class="ip-report">
          <div class="report-main">
            <div class="report-map">
              <InteractiveGlobe />
            </div>
            <div class="ip-heading">
              <p class="overline">Your Current IP Address</p>
              <div class="ip-line">
                <strong>{{ scan?.ip || (scanPending ? 'Detecting…' : 'Unavailable') }}</strong>
                <button class="icon-button copy-ip" type="button" title="Copy IP address" aria-label="Copy IP address" :disabled="!scan?.ip" @click="copyIp">
                  <CurrentIcon class="copy-icon" src="/assets/figma/imgVector7.svg" />
                </button>
              </div>
              <div class="country-line">
                <img v-if="countryFlag" class="country-flag-icon" :src="countryFlag" alt="" />
                <b>{{ scanError || `${countryName}${scan?.city ? ` / ${scan.city}` : ''}` }}</b>
              </div>
            </div>

            <div class="ip-facts">
              <div><b>{{ scan?.ISP || 'Detecting…' }}</b><span>ISP / Organization</span></div>
              <div><b>{{ scan?.connection_type || 'Unknown' }}</b><span>Network type</span></div>
              <div><b>{{ scan?.timezone || 'Unknown' }}</b><span>Time Zone</span></div>
              <div><b>{{ coordinates }}</b><span>Location</span></div>
            </div>

            <div class="analysis-block">
              <div class="analysis-title">
                <span class="ai-logo"><img src="/assets/figma/imgLogo.svg" alt="" /></span>
                <b>AI Analysis</b>
              </div>
              <h2><span aria-hidden="true">{{ riskScore >= 75 ? '⚠️' : '👍' }}</span> {{ scan?.analysis.title || 'Analyzing your network…' }}</h2>
              <p>{{ scan?.analysis.summary || 'Checking public network intelligence and reputation signals.' }}</p>
              <p><b>Main concern:</b> {{ scan?.analysis.concern || 'Analysis will appear when the scan completes.' }}</p>
              <div class="analysis-checks">
                <span><CurrentIcon class="analysis-check-icon" src="/assets/figma/imgVector3.svg" />{{ scan?.connection_type || 'Network pending' }}</span>
                <span><CurrentIcon class="analysis-check-icon" src="/assets/figma/imgVector3.svg" />{{ scan?.city ? 'Location signal available' : 'Limited location signal' }}</span>
                <span><CurrentIcon class="analysis-check-icon" src="/assets/figma/imgVector3.svg" />IPLocate intelligence checked</span>
              </div>
            </div>
          </div>

          <aside class="score-panel">
            <p class="score-label">AI IP Score</p>
            <div class="score-value"><strong>{{ scan ? healthScore : '—' }}</strong><span>/100</span><em :class="scan ? `risk-${riskLevel}` : ''">{{ scan ? riskLabel : 'Scanning' }}</em></div>
            <div class="score-divider"></div>
            <p class="platform-label">Quick Platform Read</p>
            <div class="quick-platforms">
              <div><span><span class="quick-icon"><img class="simple-glyph" :src="platformIcon('IP_ic_claude.svg')" alt="" /></span>Claude</span><b>Good</b></div>
              <div><span><span class="quick-icon"><img class="simple-glyph" :src="platformIcon('IP_ic_chatgpt.svg')" alt="" /></span>ChatGPT</span><b>Good</b></div>
              <div><span><span class="quick-icon"><img class="simple-glyph" :src="platformIcon('IP_ic_Amazon.svg')" alt="" /></span>Amazon</span><b>Good</b></div>
              <div><span><span class="quick-icon"><img class="simple-glyph" :src="platformIcon('IP_ic_tiktok_shop.svg')" alt="" /></span>Tiktok Shop</span><b>Good</b></div>
            </div>
            <a class="platform-link" href="#readiness">Detection of Other Platforms <CurrentIcon class="platform-arrow-icon" src="/assets/figma/imgVector29.svg" /></a>
          </aside>
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
            <p class="section-index"><span>2</span>Platform Compatibility</p>
            <h2>Readiness Estimates by Use Case.</h2>
            <p>AI-assisted estimates based on current network characteristics, not platform guarantees.</p>
            <div class="tabs" role="tablist" aria-label="Platform categories">
              <button :class="{ active: activeFilter === 'all' }" type="button" role="tab" :aria-selected="activeFilter === 'all'" @click="selectPlatformFilter('all')">All</button>
              <button :class="{ active: activeFilter === 'ai' }" type="button" role="tab" :aria-selected="activeFilter === 'ai'" @click="selectPlatformFilter('ai')">AI Intelligence</button>
              <button :class="{ active: activeFilter === 'ecommerce' }" type="button" role="tab" :aria-selected="activeFilter === 'ecommerce'" @click="selectPlatformFilter('ecommerce')">Ecommerce</button>
              <button :class="{ active: activeFilter === 'advertising' }" type="button" role="tab" :aria-selected="activeFilter === 'advertising'" @click="selectPlatformFilter('advertising')">Advertising</button>
              <button :class="{ active: activeFilter === 'social' }" type="button" role="tab" :aria-selected="activeFilter === 'social'" @click="selectPlatformFilter('social')">Social</button>
            </div>
          </div>

          <Transition name="platform-swap" mode="out-in" @before-enter="preparePlatformScores" @enter="animatePlatformScores">
            <div :key="activeFilter" class="platform-grid" :class="{ 'is-swapped': platformHasSwapped }">
              <template v-for="(platform, index) in displayedPlatforms" :key="platform.name">
                <article
                  class="platform-card"
                  :style="{ '--platform-index': index }"
                >
                  <div class="platform-name">
                    <span>
                      <PlatformBrandIcon :name="platform.name" :src="platform.icon" />
                      {{ platform.name }}
                    </span>
                    <CurrentIcon class="check-icon" src="/assets/figma/imgVector2.svg" label="Ready" />
                  </div>
                  <div class="platform-info">
                    <div class="platform-score-block">
                      <div class="platform-score" :aria-label="`${platform.score} out of 100`">
                        <b aria-hidden="true">{{ animatedPlatformScores[index] ?? 0 }}</b>
                        <span aria-hidden="true">/100</span>
                      </div>
                      <div class="meter"><i :style="{ '--score': `${platform.score}%` }"></i></div>
                    </div>
                    <p>Current Network is Applicable to This Platform</p>
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
            <div><strong>12</strong><span>Signals analyzed</span></div>
            <div><strong>Live</strong><span>IPLocate intelligence</span></div>
            <div><strong>8</strong><span>Platforms evaluated</span></div>
            <div><strong>1</strong><span>AI analysis pass</span></div>
          </div>
        </div>
        </section>

        <section class="information section-panel" id="information">
          <div class="information-inner">
        <div class="section-head">
          <p class="section-index"><span>1</span>Basic Information</p>
          <h2>Network &amp; Device Information</h2>
          <p>Information without traces makes your internet browsing safer</p>
        </div>

        <div class="device-card-grid" aria-label="Network and device details" @click="copyDeviceValue">
          <article class="device-info-card">
            <h3><img class="device-card-icon" src="/assets/figma/icon-location.png" alt="" />Location</h3>
            <dl>
              <div><dt>Country</dt><dd><span class="country-value"><img v-if="countryFlag" class="country-flag-icon" :src="countryFlag" alt="" />{{ countryName }}</span></dd></div>
              <div><dt>State</dt><dd>{{ scan?.region || 'N/A' }}</dd></div>
              <div><dt>City</dt><dd>{{ scan?.city || 'N/A' }}</dd></div>
              <div><dt>Hostname</dt><dd>{{ scan?.host || 'N/A' }}</dd></div>
              <div><dt>Postal Code</dt><dd>{{ scan?.zip_code || 'N/A' }}</dd></div>
              <div><dt>Coordinates</dt><dd class="accent-value">{{ coordinates }}</dd></div>
              <div><dt>ISP</dt><dd>{{ scan?.ISP || 'N/A' }}</dd></div>
              <div><dt>Organization</dt><dd>{{ scan?.organization || 'N/A' }}</dd></div>
              <div><dt>Connection</dt><dd>{{ scan?.connection_type || 'N/A' }}</dd></div>
              <div><dt>ASN</dt><dd class="accent-value">{{ scan?.ASN ? `AS${scan.ASN}` : 'N/A' }}</dd></div>
            </dl>
          </article>

          <article class="device-info-card">
            <h3><img class="device-card-icon" src="/assets/figma/icon-time.png" alt="" />Time</h3>
            <dl>
              <div><dt>Time Zone</dt><dd>{{ scan?.timezone || 'N/A' }}</dd></div>
              <div><dt>IP Local Time</dt><dd>{{ localTime }}</dd></div>
              <div><dt>System Time</dt><dd>{{ currentTime.toString() }}</dd></div>
            </dl>
          </article>

          <article class="device-info-card">
            <h3><img class="device-card-icon" src="/assets/figma/icon-browser.png" alt="" />Browser</h3>
            <dl>
              <div><dt>User Agent</dt><dd>{{ userAgent }}</dd></div>
              <div><dt>Detected Browser</dt><dd>{{ scan?.browser || 'N/A' }}</dd></div>
              <div><dt>Operating System</dt><dd>{{ scan?.operating_system || 'N/A' }}</dd></div>
              <div><dt>Device</dt><dd>{{ [scan?.device_brand, scan?.device_model].filter(Boolean).join(' ') || 'N/A' }}</dd></div>
            </dl>
          </article>
        </div>

        <div class="status-grid">
          <article><strong>{{ scan?.proxy ? 'Detected' : 'Not Detected' }}</strong><span>Proxy</span></article>
          <article><strong>{{ scan?.vpn || scan?.tor ? 'Detected' : 'Not Detected' }}</strong><span>VPN / Tor</span></article>
          <article><strong>{{ scan?.recent_abuse ? 'Detected' : 'Not Detected' }}</strong><span>Recent Abuse</span></article>
          <article class="risk-card"><em :class="`risk-${riskLevel}`">{{ riskLabel }}</em><strong>{{ scan ? riskScore : '—' }} / 100</strong><span>Risk Score</span></article>
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
          <h2>Frequently Asked Questions</h2>
          <div class="faq-list">
            <article class="faq-item" :class="{ active: activeFaq === 0 }">
              <button type="button" :aria-expanded="activeFaq === 0" @click="activeFaq = activeFaq === 0 ? -1 : 0"><span>What does IP-Ready check?</span><CurrentIcon class="faq-toggle-icon faq-plus-icon" src="/assets/figma/imgVector.svg" /></button>
              <div class="faq-answer"><p>IP-Ready analyzes your public IP, location, ISP, ASN, DNS, network type, proxy and blacklist signals, browser, and device details. It combines these signals into an AI IP Score and a practical platform-readiness report.</p></div>
            </article>
            <article class="faq-item" :class="{ active: activeFaq === 1 }"><button type="button" :aria-expanded="activeFaq === 1" @click="activeFaq = activeFaq === 1 ? -1 : 1"><span>How is the platform readiness score calculated?</span><CurrentIcon class="faq-toggle-icon faq-plus-icon" src="/assets/figma/imgVector.svg" /></button><div class="faq-answer"><p>The score combines IP reputation, network type, location consistency, fraud signals, and known platform access patterns. It is a diagnostic estimate, not a guarantee that a third-party platform will approve an account or session.</p></div></article>
            <article class="faq-item" :class="{ active: activeFaq === 2 }"><button type="button" :aria-expanded="activeFaq === 2" @click="activeFaq = activeFaq === 2 ? -1 : 2"><span>Is my IP address and browsing data private?</span><CurrentIcon class="faq-toggle-icon faq-plus-icon" src="/assets/figma/imgVector.svg" /></button><div class="faq-answer"><p>IP-Ready only uses the technical network and device signals needed to generate your report. It never asks for account passwords, private messages, or browsing history, and scan results are not designed to identify you personally.</p></div></article>
            <article class="faq-item" :class="{ active: activeFaq === 3 }"><button type="button" :aria-expanded="activeFaq === 3" @click="activeFaq = activeFaq === 3 ? -1 : 3"><span>Which platforms can I check?</span><CurrentIcon class="faq-toggle-icon faq-plus-icon" src="/assets/figma/imgVector.svg" /></button><div class="faq-answer"><p>You can review readiness across popular AI, ecommerce, advertising, and social platforms, including ChatGPT, Claude, Amazon, eBay, Facebook, TikTok, and more. Supported platforms are expanded as new signals become available.</p></div></article>
            <article class="faq-item" :class="{ active: activeFaq === 4 }"><button type="button" :aria-expanded="activeFaq === 4" @click="activeFaq = activeFaq === 4 ? -1 : 4"><span>Why can my scan results change?</span><CurrentIcon class="faq-toggle-icon faq-plus-icon" src="/assets/figma/imgVector.svg" /></button><div class="faq-answer"><p>IP reputation databases, routing, DNS, VPN endpoints, and blacklist records change over time. Run a new scan whenever you switch networks, proxies, VPN locations, or devices to see the most relevant result.</p></div></article>
          </div>
        </div>
      </section>

      <section class="feature-row" aria-label="Product qualities" :style="{ '--feature-duration': `${featureDuration}ms` }">
        <article :class="{ 'carousel-active': activeFeature === 0 }"><CurrentIcon class="feature-icon feature-icon-shield" src="/assets/figma/imgSubtract.svg" /><b>Professional and Reliable</b><i></i></article>
        <article :class="{ 'carousel-active': activeFeature === 1 }"><span class="feature-icon feature-icon-efficient" aria-hidden="true"><CurrentIcon class="efficient-back" src="/assets/figma/imgVector40.svg" /><CurrentIcon class="efficient-pen" src="/assets/figma/imgVector41.svg" /><CurrentIcon class="efficient-device" src="/assets/figma/imgSubtract1.svg" /></span><b>Efficient and Convenient</b><i></i></article>
        <article :class="{ 'carousel-active': activeFeature === 2 }"><CurrentIcon class="feature-icon feature-icon-target" src="/assets/figma/imgVector42.svg" /><b>Accurate Data</b><i></i></article>
        <article :class="{ 'carousel-active': activeFeature === 3 }"><CurrentIcon class="feature-icon feature-icon-aperture" src="/assets/figma/imgVector43.svg" /><b>Safe and Stable</b><i></i></article>
      </section>
    </main>

    <AppFooter />

    <div class="copy-toast" :class="{ show: copied }" role="status" aria-live="polite">{{ copyToastMessage }}</div>
</template>
