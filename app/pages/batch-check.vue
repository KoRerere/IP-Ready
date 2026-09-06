<script setup lang="ts">
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'

interface IpScanResult {
  ip: string
  proxy: boolean
  vpn: boolean
  tor: boolean
  hosting: boolean
  recent_abuse: boolean
  ISP?: string
  organization?: string
  ASN?: number
  country_code?: string
  city?: string
  connection_type?: string
  risk_score: number
  analysis: { title: string; summary: string; concern: string }
  scanned_at: string
}

interface BatchResultError {
  ip: string
  status: 'error'
  error: string
}

interface BatchResultOk {
  ip: string
  status: 'ok'
  data: IpScanResult
}

type BatchResult = BatchResultOk | BatchResultError

const MAX_BATCH_IPS = 20

const { locale, t } = useI18n()
const route = useRoute()
const router = useRouter()

const rawInput = ref(typeof route.query.ips === 'string' ? route.query.ips.replace(/,/g, '\n') : '')
const pending = ref(false)
const scanningCount = ref(0)
const results = ref<BatchResult[] | null>(null)
const textareaEl = ref<HTMLTextAreaElement | null>(null)
let revealObserver: IntersectionObserver | undefined

// 占位符打字机动画（wrangle hero 同款效果）：逐字打出示例文案，停顿后删除换下一条
const PHRASE_KEYS = ['batch.placeholder', 'batch.phrase2', 'batch.phrase3', 'batch.phrase4']
const placeholderText = ref('')
let phraseIndex = 0
let charIndex = 0
let deleting = false
let typeTimer: ReturnType<typeof setTimeout> | undefined
let toastTimer: ReturnType<typeof setTimeout> | undefined
const toastVisible = ref(false)
const toastMessage = ref('')

function showToast(message: string, duration = 2400) {
  toastMessage.value = message
  toastVisible.value = true
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toastVisible.value = false }, duration)
}

function tickPlaceholder() {
  const full = t(PHRASE_KEYS[phraseIndex]!)
  if (!deleting) {
    charIndex++
    placeholderText.value = full.slice(0, charIndex)
    if (charIndex >= full.length) {
      deleting = true
      typeTimer = setTimeout(tickPlaceholder, 1800)
    } else {
      typeTimer = setTimeout(tickPlaceholder, 65)
    }
  } else {
    charIndex--
    placeholderText.value = full.slice(0, charIndex)
    if (charIndex <= 0) {
      deleting = false
      phraseIndex = (phraseIndex + 1) % PHRASE_KEYS.length
      typeTimer = setTimeout(tickPlaceholder, 420)
    } else {
      typeTimer = setTimeout(tickPlaceholder, 26)
    }
  }
}

function startPlaceholder() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    placeholderText.value = t(PHRASE_KEYS[0]!)
    return
  }
  const full = t(PHRASE_KEYS[0]!)
  placeholderText.value = full
  charIndex = full.length
  deleting = true
  typeTimer = setTimeout(tickPlaceholder, 1800)
}

const sampleIps = [
  { ip: '17.253.144.10', code: 'US' },
  { ip: '110.242.68.66', code: 'CN' },
  { ip: '210.140.92.187', code: 'JP' },
  { ip: '212.58.246.79', code: 'GB' },
]

// 从一行任意文本中提取第一个有效 IP：支持纯 IP、ip:port、ip:port:user:pass 代理串、user:pass@ip:port 等
const IPV4_PATTERN = /(?<![\d.])((?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?!\d)/
const IPV6_PATTERN = /(?<![0-9A-Fa-f:])((?:[0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4}|(?:[0-9A-Fa-f]{1,4}:){1,7}:|(?:[0-9A-Fa-f]{1,4}:){1,6}:[0-9A-Fa-f]{1,4}|(?:[0-9A-Fa-f]{1,4}:){1,5}(?::[0-9A-Fa-f]{1,4}){1,2}|(?:[0-9A-Fa-f]{1,4}:){1,4}(?::[0-9A-Fa-f]{1,4}){1,3}|(?:[0-9A-Fa-f]{1,4}:){1,3}(?::[0-9A-Fa-f]{1,4}){1,4}|(?:[0-9A-Fa-f]{1,4}:){1,2}(?::[0-9A-Fa-f]{1,4}){1,5}|[0-9A-Fa-f]{1,4}:(?::[0-9A-Fa-f]{1,4}){1,6})(?![0-9A-Fa-f:])/

function extractIp(line: string) {
  return line.match(IPV4_PATTERN)?.[0] ?? line.match(IPV6_PATTERN)?.[0] ?? undefined
}

interface ParsedEntry {
  raw: string
  ip?: string
}

// 按行解析：输入框保留用户粘贴的原始内容，每行提取出的 IP 才是送去检测的对象（按 IP 去重）
const parsedEntries = computed<ParsedEntry[]>(() => {
  const entries: ParsedEntry[] = []
  const seenIps = new Set<string>()
  for (const line of rawInput.value.split(/\r?\n/)) {
    const raw = line.trim()
    if (!raw) continue
    const ip = extractIp(raw)
    if (ip) {
      if (seenIps.has(ip)) continue
      seenIps.add(ip)
    }
    entries.push({ raw, ip })
  }
  return entries
})

const invalidCount = computed(() => parsedEntries.value.filter((entry) => !entry.ip).length)
const overLimit = computed(() => parsedEntries.value.filter((entry) => entry.ip).length > MAX_BATCH_IPS)
const submitList = computed(() => parsedEntries.value.filter((entry) => entry.ip).map((entry) => entry.ip!).slice(0, MAX_BATCH_IPS))
const counterLabel = computed(() => t('batch.counter').replace('{n}', String(Math.min(submitList.value.length, MAX_BATCH_IPS))))

const scanningLabel = computed(() => t('batch.scanningN').replace('{n}', String(scanningCount.value)))

const summary = computed(() => {
  const ok = results.value?.filter((entry): entry is BatchResultOk => entry.status === 'ok') ?? []
  return {
    total: results.value?.length ?? 0,
    low: ok.filter((entry) => entry.data.risk_score < 40).length,
    flagged: ok.filter((entry) => entry.data.risk_score >= 40).length,
    failed: results.value?.filter((entry) => entry.status === 'error').length ?? 0,
  }
})

function riskLevel(score: number) {
  return score > 70 ? 'high' : score >= 40 ? 'medium' : 'low'
}

function riskLabel(score: number) {
  const level = riskLevel(score)
  return level === 'high' ? t('risk.high') : level === 'medium' ? t('risk.medium') : t('risk.low')
}

function countryName(code?: string) {
  if (!code) return t('misc.na')
  try {
    return new Intl.DisplayNames([locale.value === 'zh' ? 'zh-CN' : 'en'], { type: 'region' }).of(code.toUpperCase()) || code
  } catch {
    return code
  }
}

function sampleCountry(code: string) {
  if (locale.value !== 'zh') return code
  try {
    return new Intl.DisplayNames(['zh-CN'], { type: 'region' }).of(code) || code
  } catch {
    return code
  }
}

function signalChips(entry: IpScanResult) {
  const chips: Array<{ label: string; level: 'medium' | 'high' }> = []
  if (entry.proxy) chips.push({ label: t('status.proxy'), level: 'medium' })
  if (entry.vpn) chips.push({ label: 'VPN', level: 'medium' })
  if (entry.tor) chips.push({ label: 'Tor', level: 'high' })
  if (entry.recent_abuse) chips.push({ label: t('status.recentAbuse'), level: 'high' })
  return chips
}

function addSampleIp(ip: string) {
  if (submitList.value.includes(ip)) return
  rawInput.value = rawInput.value.trimEnd()
  if (rawInput.value) rawInput.value += '\n'
  rawInput.value += ip
}

async function pasteFromClipboard() {
  try {
    const text = await navigator.clipboard.readText()
    if (!text) return
    rawInput.value = rawInput.value.trimEnd()
    if (rawInput.value) rawInput.value += '\n'
    rawInput.value += text.trim()
  } catch {
    // 剪贴板权限被拒绝时保持安静，用户仍可手动粘贴
  }
}

// wrangle 的做法：textarea 本身随内容无限长高（overflow hidden），滚动发生在外层
// max-height 包裹层上，滚动条因此贴在卡片右缘；上下边缘用 mask 渐隐提示还有内容
const textareaWrapEl = ref<HTMLDivElement | null>(null)

function autosizeTextarea() {
  const el = textareaEl.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = `${Math.max(el.scrollHeight, 80)}px`
  nextTick(updateTextareaMask)
}

function updateTextareaMask() {
  const el = textareaWrapEl.value
  if (!el) return
  const fade = 28
  const canTop = el.scrollTop > 4
  const canBottom = el.scrollTop + el.clientHeight < el.scrollHeight - 4
  const top = canTop ? `transparent 0, #000 ${fade}px` : `#000 0`
  const bottom = canBottom ? `#000 calc(100% - ${fade}px), transparent 100%` : `#000 100%`
  const mask = `linear-gradient(to bottom, ${top}, ${bottom})`
  el.style.maskImage = mask
  el.style.webkitMaskImage = mask
}

watch(rawInput, () => nextTick(autosizeTextarea))

async function submitBatch() {
  if (pending.value) return
  // 空输入 / 全部无效时用 toast 提示，不再展示红色文字块
  if (!parsedEntries.value.length) {
    showToast(t('batch.empty'))
    return
  }
  if (!submitList.value.length) {
    showToast(t('check.invalid'))
    return
  }
  if (invalidCount.value) showToast(t('batch.skippedN').replace('{n}', String(invalidCount.value)))
  else if (overLimit.value) showToast(t('batch.maxNote'))

  pending.value = true
  results.value = null
  scanningCount.value = submitList.value.length
  try {
    const response = await $fetch<{ results: BatchResult[] }>('/api/ip-batch-check', { method: 'POST', body: { ips: submitList.value } })
    results.value = response.results
    router.replace({ query: { ips: submitList.value.join(',') } })
    await nextTick()
    observeReveals()
    syncTabsPill()
    document.getElementById('batch-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  } catch (error) {
    const apiError = error as { data?: { statusMessage?: string }; message?: string }
    showToast(apiError.data?.statusMessage || apiError.message || t('batch.failed'), 3000)
  } finally {
    pending.value = false
  }
}

function backToComposer() {
  document.getElementById('top')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  document.querySelector<HTMLTextAreaElement>('.batch-textarea')?.focus()
}

// 表格行悬停的滑动胶囊（与导航/标签页的 morph pill 同款）
const tablePill = reactive({ x: 0, y: 0, w: 0, h: 0, visible: false, snap: false })

function moveTablePill(event: Event) {
  const row = event.currentTarget as HTMLElement
  const card = row.closest('.batch-table-card') as HTMLElement | null
  if (!card) return
  const cardRect = card.getBoundingClientRect()
  const rowRect = row.getBoundingClientRect()
  // 完整贴边：不内缩、无圆角，只保留滑动动画
  tablePill.x = rowRect.left - cardRect.left
  tablePill.y = rowRect.top - cardRect.top
  tablePill.w = rowRect.width
  tablePill.h = rowRect.height
  if (!tablePill.visible) {
    // 首次出现直接就位，不播放滑入动画
    tablePill.snap = true
    requestAnimationFrame(() => requestAnimationFrame(() => { tablePill.snap = false }))
  }
  tablePill.visible = true
}

function hideTablePill() {
  tablePill.visible = false
}

// 结果区 Tabs：基础检测 / 适用平台（胶囊滑动与首页标签页同款）
type BatchTab = 'basic' | 'platforms'
const activeTab = ref<BatchTab>('basic')
const tabsEl = ref<HTMLElement | null>(null)
const tabsPill = reactive({ x: 0, y: 0, w: 0, ready: false, snap: false })

function syncTabsPill() {
  const active = tabsEl.value?.querySelector('button.active') as HTMLElement | null
  if (!active) return
  tabsPill.x = active.offsetLeft
  tabsPill.y = active.offsetTop
  tabsPill.w = active.offsetWidth
  if (!tabsPill.ready) {
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

function selectTab(tab: BatchTab) {
  if (activeTab.value === tab) return
  activeTab.value = tab
  hideTablePill()
  nextTick(syncTabsPill)
}

// 适用平台评分：与首页同一组平台和基准分，按每个 IP 的健康分（100 - 风险分）偏移
const BATCH_PLATFORMS = [
  { name: 'Claude', base: 88, icon: '/assets/icons/platform/IP_ic_claude.svg' },
  { name: 'ChatGPT', base: 88, icon: '/assets/icons/platform/IP_ic_chatgpt.svg' },
  { name: 'Amazon', base: 95, icon: '/assets/icons/platform/IP_ic_Amazon.svg' },
  { name: 'Ebay', base: 98, icon: '/assets/icons/platform/IP_ic_eBay.svg' },
  { name: 'Binance', base: 76, icon: '/assets/icons/platform/IP_ic_Binance.svg' },
]

const okEntries = computed(() => (results.value ?? [])
  .filter((entry): entry is BatchResultOk => entry.status === 'ok')
  .map((entry) => ({ ip: entry.data.ip, risk: entry.data.risk_score, health: 100 - entry.data.risk_score })))

function platformScore(base: number, health: number) {
  return Math.min(99, Math.max(1, base + (health - 86)))
}

function scoreTone(score: number) {
  return score >= 70 ? 'good' : score >= 40 ? 'warn' : 'bad'
}

function observeReveals() {
  if (!import.meta.client) return
  document.querySelectorAll('.reveal:not(.visible), .scroll-reveal-item:not(.visible)').forEach((element) => revealObserver?.observe(element))
}

useHead({
  title: () => t('batch.metaTitle'),
  meta: [
    { name: 'description', content: () => t('batch.metaDescription') },
    { property: 'og:title', content: () => t('batch.metaTitle') },
    { property: 'og:description', content: () => t('batch.metaDescription') },
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
  revealObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          revealObserver?.unobserve(entry.target)
        }
      }
    },
    { threshold: 0.13 },
  )
  observeReveals()
  autosizeTextarea()
  startPlaceholder()
  window.addEventListener('resize', syncTabsPill)

  // 支持 /batch-check?ips=a,b,c 直接出结果
  if (typeof route.query.ips === 'string' && route.query.ips && submitList.value.length) void submitBatch()
})

onBeforeUnmount(() => {
  revealObserver?.disconnect()
  window.removeEventListener('resize', syncTabsPill)
  if (typeTimer) clearTimeout(typeTimer)
  if (toastTimer) clearTimeout(toastTimer)
})
</script>

<template>
  <AppHeader />

  <main id="top">
    <section class="batch-hero">
      <div class="batch-hero-panel" aria-hidden="true">
        <div class="batch-hero-tint"></div>
        <video autoplay loop muted playsinline preload="auto" src="/assets/gradient-blue-hero.mp4"></video>
        <div class="batch-hero-veil"></div>
      </div>

      <div class="batch-hero-inner">
        <h1 class="reveal">{{ t('batch.title') }}</h1>
        <p class="batch-hero-sub reveal">{{ t('batch.subtitle') }}</p>

        <div class="batch-composer reveal">
          <span class="composer-glass" aria-hidden="true"></span>
          <div class="composer-card">
            <div class="composer-field">
              <div ref="textareaWrapEl" class="batch-textarea-wrap" @scroll="updateTextareaMask">
                <textarea
                  ref="textareaEl"
                  v-model="rawInput"
                  class="batch-textarea"
                  rows="1"
                  autocomplete="off"
                  autocapitalize="off"
                  spellcheck="false"
                  :placeholder="placeholderText"
                  :aria-label="t('batch.placeholder')"
                  @keydown.meta.enter.prevent="submitBatch"
                  @keydown.ctrl.enter.prevent="submitBatch"
                ></textarea>
              </div>
            </div>
            <div class="composer-toolbar">
              <div class="composer-left">
                <div class="composer-icons">
                  <button class="icon-tool icon-tool-active" type="button" :title="t('batch.paste')" :aria-label="t('batch.paste')" @click="pasteFromClipboard">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="8" height="4" x="8" y="2" rx="1" ry="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /></svg>
                  </button>
                  <button class="icon-tool" type="button" :title="t('batch.clear')" :aria-label="t('batch.clear')" :disabled="!rawInput" @click="rawInput = ''">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
                  </button>
                </div>
                <span class="composer-counter">{{ counterLabel }}</span>
              </div>
              <button class="composer-submit" type="button" :disabled="pending || !parsedEntries.length" @click="submitBatch">
                <span class="submit-chip" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14,6 C14,5.448 13.552,5 13,5 L8.5,5 C5.462,5 3,7.462 3,10.5 C3,13.538 5.462,16 8.5,16 L16,16 L16,18 C16,18.377 16.212,18.722 16.549,18.892 C16.886,19.063 17.289,19.029 17.593,18.805 L17.604,18.797 L17.631,18.777 C17.655,18.759 17.689,18.734 17.732,18.701 C17.817,18.637 17.939,18.544 18.084,18.431 C18.374,18.205 18.763,17.892 19.156,17.552 C19.543,17.215 19.956,16.831 20.281,16.464 C20.442,16.282 20.602,16.08 20.727,15.872 C20.836,15.691 21,15.377 21,15 C21,14.623 20.836,14.309 20.727,14.128 C20.602,13.92 20.442,13.718 20.281,13.536 C19.956,13.169 19.543,12.785 19.156,12.448 C18.763,12.108 18.374,11.795 18.084,11.569 C17.939,11.456 17.817,11.363 17.732,11.299 C17.689,11.266 17.655,11.241 17.631,11.223 L17.604,11.203 L17.596,11.197 L17.593,11.195 C17.29,10.971 16.886,10.937 16.549,11.107 C16.212,11.278 16,11.623 16,12 L16,14 L8.5,14 C6.567,14 5,12.433 5,10.5 C5,8.567 6.567,7 8.5,7 L13,7 C13.552,7 14,6.552 14,6 Z" fill="currentColor" /></svg>
                </span>
                <span>{{ pending ? scanningLabel : t('batch.submit') }}</span>
              </button>
            </div>
          </div>
        </div>

        <div class="batch-examples reveal">
          <span class="batch-examples-label">{{ t('check.try') }}</span>
          <div class="chip-marquee">
            <div class="chip-track">
              <div class="chip-set">
                <button
                  v-for="sample in sampleIps"
                  :key="sample.ip"
                  type="button"
                  class="batch-example-chip"
                  :title="t('batch.addToInput')"
                  @click="addSampleIp(sample.ip)"
                >
                  <img class="batch-example-flag" :src="`/assets/icons/flags/${sample.code}.svg`" alt="" />
                  <b>{{ sampleCountry(sample.code) }}</b>
                  <span class="batch-example-ip">{{ sample.ip }}</span>
                </button>
              </div>
              <div class="chip-set" aria-hidden="true">
                <button
                  v-for="sample in sampleIps"
                  :key="`duplicate-${sample.ip}`"
                  type="button"
                  tabindex="-1"
                  class="batch-example-chip"
                  @click="addSampleIp(sample.ip)"
                >
                  <img class="batch-example-flag" :src="`/assets/icons/flags/${sample.code}.svg`" alt="" />
                  <b>{{ sampleCountry(sample.code) }}</b>
                  <span class="batch-example-ip">{{ sample.ip }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="logo-rail" aria-label="Supported services">
      <div class="logo-track">
        <div class="logo-set">
          <img src="/assets/figma/imgAliexpress.svg" alt="AliExpress" />
          <img src="/assets/figma/imgShopify.svg" alt="Shopify" />
          <img src="/assets/figma/imgEbay.svg" alt="eBay" />
          <img src="/assets/figma/imgFacebook.svg" alt="Facebook" />
          <img src="/assets/figma/imgEtsy.svg" alt="Etsy" />
          <img src="/assets/figma/imgAmazon.svg" alt="Amazon" />
          <img src="/assets/figma/imgNetflix.svg" alt="Netflix" />
          <img src="/assets/figma/imgTiktok.svg" alt="TikTok" />
          <img src="/assets/figma/imgYoutube.svg" alt="YouTube" />
          <img src="/assets/figma/imgTemu.svg" alt="Temu" />
          <img src="/assets/figma/imgBestuy.svg" alt="Best Buy" />
          <img src="/assets/figma/imgShopee.svg" alt="Shopee" />
        </div>
        <div class="logo-set" aria-hidden="true">
          <img src="/assets/figma/imgAliexpress.svg" alt="" />
          <img src="/assets/figma/imgShopify.svg" alt="" />
          <img src="/assets/figma/imgEbay.svg" alt="" />
          <img src="/assets/figma/imgFacebook.svg" alt="" />
          <img src="/assets/figma/imgEtsy.svg" alt="" />
          <img src="/assets/figma/imgAmazon.svg" alt="" />
          <img src="/assets/figma/imgNetflix.svg" alt="" />
          <img src="/assets/figma/imgTiktok.svg" alt="" />
          <img src="/assets/figma/imgYoutube.svg" alt="" />
          <img src="/assets/figma/imgTemu.svg" alt="" />
          <img src="/assets/figma/imgBestuy.svg" alt="" />
          <img src="/assets/figma/imgShopee.svg" alt="" />
        </div>
      </div>
    </section>

    <section v-if="pending || results" class="section-panel batch-results" id="batch-results">
      <div class="information-inner">
        <div class="section-head">
          <h2 class="reveal">{{ t('batch.resultsTitle') }}</h2>
          <p class="reveal">{{ t('batch.resultsSubtitle') }}</p>
        </div>

        <div v-if="results" class="status-grid batch-summary">
          <article><strong>{{ summary.total }}</strong><span>{{ t('batch.summaryIps') }}</span></article>
          <article><strong>{{ summary.low }}</strong><span>{{ t('batch.summaryLow') }}</span></article>
          <article><strong>{{ summary.flagged }}</strong><span>{{ t('batch.summaryFlagged') }}</span></article>
          <article><strong>{{ summary.failed }}</strong><span>{{ t('batch.summaryFailed') }}</span></article>
        </div>

        <div v-if="results" ref="tabsEl" class="tabs batch-tabs" role="tablist" @mouseleave="syncTabsPill">
          <span class="tabs-morph-pill" :class="{ ready: tabsPill.ready, snap: tabsPill.snap }" :style="{ transform: `translate(${tabsPill.x}px, ${tabsPill.y}px)`, width: `${tabsPill.w}px` }" aria-hidden="true"></span>
          <button :class="{ active: activeTab === 'basic' }" type="button" role="tab" :aria-selected="activeTab === 'basic'" @mouseenter="hoverTabPill" @click="selectTab('basic')">{{ t('batch.tabBasic') }}</button>
          <button :class="{ active: activeTab === 'platforms' }" type="button" role="tab" :aria-selected="activeTab === 'platforms'" @mouseenter="hoverTabPill" @click="selectTab('platforms')">{{ t('batch.tabPlatforms') }}</button>
        </div>

        <div v-if="pending && !results" class="batch-table-card batch-table-pending">
          <p>{{ scanningLabel }}</p>
        </div>

        <div v-if="results && activeTab === 'basic'" class="batch-table-card" @mouseleave="hideTablePill">
          <span
            class="batch-table-pill"
            :class="{ visible: tablePill.visible, snap: tablePill.snap }"
            :style="{ transform: `translate(${tablePill.x}px, ${tablePill.y}px)`, width: `${tablePill.w}px`, height: `${tablePill.h}px` }"
            aria-hidden="true"
          ></span>
          <Table class="batch-table">
              <TableHeader>
                <TableRow class="batch-table-head-row hover:bg-transparent">
                  <TableHead class="h-11 pl-4 pr-2">{{ t('batch.colIp') }}</TableHead>
                  <TableHead class="h-11 px-2">{{ t('batch.colLocation') }}</TableHead>
                  <TableHead class="h-11 px-2">{{ t('batch.colIsp') }}</TableHead>
                  <TableHead class="h-11 px-2">{{ t('batch.colSignals') }}</TableHead>
                  <TableHead class="h-11 px-2">{{ t('status.riskScore') }}</TableHead>
                  <TableHead class="h-11 pl-2 pr-4">{{ t('batch.colVerdict') }}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <template v-for="entry in results" :key="entry.ip">
                  <TableRow v-if="entry.status === 'ok'" class="hover:bg-transparent" @mouseenter="moveTablePill">
                    <TableCell class="py-4 pl-4 pr-2">
                      <NuxtLink
                        class="batch-ip-link"
                        :to="`/check?ip=${encodeURIComponent(entry.data.ip)}`"
                        :title="t('batch.viewReport')"
                      >{{ entry.data.ip }}</NuxtLink>
                    </TableCell>
                    <TableCell class="py-4 px-2">
                      <span class="batch-location">
                        <img v-if="entry.data.country_code" class="country-flag-icon" :src="`/assets/icons/flags/${entry.data.country_code.toUpperCase()}.svg`" alt="" />
                        <span>{{ countryName(entry.data.country_code) }}<em v-if="entry.data.city"> / {{ entry.data.city }}</em></span>
                      </span>
                    </TableCell>
                    <TableCell class="py-4 px-2">
                      <span class="batch-isp">
                        <b>{{ entry.data.ISP || t('misc.na') }}</b>
                        <small v-if="entry.data.ASN">AS{{ entry.data.ASN }}</small>
                      </span>
                    </TableCell>
                    <TableCell class="py-4 px-2">
                      <span v-if="signalChips(entry.data).length" class="batch-signals">
                        <i v-for="chip in signalChips(entry.data)" :key="chip.label" :class="chip.level">{{ chip.label }}</i>
                      </span>
                      <span v-else class="batch-clean">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
                        {{ t('batch.clean') }}
                      </span>
                    </TableCell>
                    <TableCell class="py-4 px-2">
                      <span class="batch-risk">
                        <b>{{ entry.data.risk_score }}</b>
                        <em :class="`risk-${riskLevel(entry.data.risk_score)}`">{{ riskLabel(entry.data.risk_score) }}</em>
                      </span>
                    </TableCell>
                    <TableCell class="py-4 pl-2 pr-4">
                      <span class="batch-verdict">{{ entry.data.analysis.title }}</span>
                    </TableCell>
                  </TableRow>
                  <TableRow v-else class="hover:bg-transparent" @mouseenter="moveTablePill">
                    <TableCell :colspan="6" class="py-4 pl-4 pr-4">
                      <span class="batch-row-error">
                        <b class="batch-ip-link batch-ip-static">{{ entry.ip }}</b>
                        <span>{{ t('batch.rowFailed') }}: {{ entry.error }}</span>
                      </span>
                    </TableCell>
                  </TableRow>
                </template>
              </TableBody>
            </Table>
        </div>

        <div v-if="results && activeTab === 'platforms'" class="batch-table-card" @mouseleave="hideTablePill">
          <span
            class="batch-table-pill"
            :class="{ visible: tablePill.visible, snap: tablePill.snap }"
            :style="{ transform: `translate(${tablePill.x}px, ${tablePill.y}px)`, width: `${tablePill.w}px`, height: `${tablePill.h}px` }"
            aria-hidden="true"
          ></span>
          <Table v-if="okEntries.length" class="batch-table batch-platform-table">
            <TableHeader>
              <TableRow class="batch-table-head-row hover:bg-transparent">
                <TableHead class="h-11 pl-4 pr-2">{{ t('batch.colPlatform') }}</TableHead>
                <TableHead v-for="entry in okEntries" :key="entry.ip" class="h-11 px-3">
                  <span class="batch-platform-ip">{{ entry.ip }}</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="platform in BATCH_PLATFORMS" :key="platform.name" class="hover:bg-transparent" @mouseenter="moveTablePill">
                <TableCell class="py-4 pl-4 pr-2">
                  <span class="batch-platform-name">
                    <PlatformBrandIcon :name="platform.name" :src="platform.icon" />
                    {{ platform.name }}
                  </span>
                </TableCell>
                <TableCell v-for="entry in okEntries" :key="entry.ip" class="py-4 px-3">
                  <span class="batch-platform-cell">
                    <span class="batch-platform-score" :class="scoreTone(platformScore(platform.base, entry.health))">
                      <b>{{ platformScore(platform.base, entry.health) }}</b><i>/100</i>
                    </span>
                    <span class="batch-platform-meter" :class="scoreTone(platformScore(platform.base, entry.health))">
                      <i :style="{ width: `${platformScore(platform.base, entry.health)}%` }"></i>
                    </span>
                  </span>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <p v-else class="batch-table-pending">{{ t('batch.noPlatformData') }}</p>
        </div>

        <button v-if="results" class="batch-rescan" type="button" @click="backToComposer">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /></svg>
          <span>{{ t('batch.rescan') }}</span>
        </button>
      </div>
    </section>
  </main>

  <AppFooter />

  <div class="copy-toast" :class="{ show: toastVisible }" role="status" aria-live="polite">{{ toastMessage }}</div>
</template>

<style scoped>
/* Hero 与 wrangle.ai 同构：白色 section 从页面顶部开始；835px 为对齐 wrangle 官网实测的面板高度（内容撑开后 > min-h-730） */
.batch-hero {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  margin-top: -64px;
  padding-top: 56px; /* 补偿透明导航的高度，让内容在导航与面板底边之间视觉居中 */
  min-height: 835px;
  background: #fff;
}
.batch-hero-panel {
  position: absolute;
  top: 50px;
  right: 32px;
  bottom: 12px;
  left: 32px;
  overflow: hidden;
  border-radius: 28px;
  background: #f4f5f4;
}
/* wrangle.ai/enterprise 同款背景：蓝色径向渐变垫底 + gradient-blue-hero.mp4 + 白色 10% 蒙层 */
.batch-hero-tint {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(72% 90% at 10% 94%, rgba(92, 157, 238, .7) 0%, rgba(92, 157, 238, 0) 72%),
    radial-gradient(62% 78% at 88% 90%, rgba(106, 217, 232, .52) 0%, rgba(106, 217, 232, 0) 74%),
    linear-gradient(180deg, #ffffff 8%, #f8faf9 100%);
}
.batch-hero-panel video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transform: scale(1.04);
  opacity: .7;
}
.batch-hero-veil { position: absolute; inset: 0; background: rgba(255, 255, 255, .1); }
.batch-hero-inner { position: relative; z-index: 1; width: 100%; max-width: 1120px; margin: 0 auto; padding: 24px 20px; text-align: center; }
.batch-hero-inner h1 {
  margin: 0;
  color: var(--ink);
  font-family: Geist, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
  font-size: 52px;
  font-weight: 600;
  line-height: 1.05;
  letter-spacing: -.025em;
  text-align: center;
}
@media (min-width: 1100px) {
  .batch-hero-inner h1 { white-space: nowrap; }
}
.batch-hero-sub { max-width: 720px; margin: 20px auto 0; color: #525252; font-size: 17px; line-height: 28px; }

/* wrangle.ai 风格输入卡：外层磨砂玻璃 p-2 + 内层白卡（玻璃描边同其他页面；卡片本身只用 shadow-sm，避免投影压暗下方间距） */
.batch-composer { position: relative; width: min(610px, 100%); margin: 32px auto 0; padding: 8px; border-radius: 16px; }
.composer-glass { position: absolute; inset: 0; border-radius: 16px; background: rgba(255, 255, 255, .2); -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px); }
.composer-card {
  position: relative;
  z-index: 1;
  border-radius: 12px;
  background: #fff;
  outline: 1px solid #e5e7eb;
  outline-offset: -1px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, .05);
  text-align: left;
  transition: outline-color .2s;
}
.composer-card:focus-within { outline-color: #5c9dee; }
.composer-field { padding: 12px 16px 0; }
.batch-textarea-wrap {
  position: relative;
  max-height: 264px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #d9dce0 transparent;
}
.batch-textarea-wrap::-webkit-scrollbar { width: 8px; }
.batch-textarea-wrap::-webkit-scrollbar-track { background: transparent; }
.batch-textarea-wrap::-webkit-scrollbar-thumb { background: #d9dce0; border-radius: 999px; border: 2px solid #fff; }
.batch-textarea {
  display: block;
  width: 100%;
  height: 80px;
  padding: 0;
  border: 0;
  outline: none;
  resize: none;
  overflow: hidden;
  background: transparent;
  color: var(--ink);
  font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
  font-size: 16px;
  line-height: 24px;
}
.batch-textarea::placeholder { color: #a3a3a3; }

.composer-toolbar { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; justify-content: space-between; padding: 8px; }
.composer-left { display: flex; min-width: 0; flex-wrap: wrap; gap: 8px; align-items: center; }
.composer-icons { position: relative; display: inline-flex; align-items: center; gap: 2px; padding: 2px 1px; border: 1px solid #e5e7eb; border-radius: 6px; background: #f7f7f8; box-shadow: 0 1px 2px rgba(0, 0, 0, .05); }
.icon-tool {
  display: grid; place-items: center; padding: 4px 6px; border: 0; border-radius: 4px;
  background: transparent; color: #a3a3a3; cursor: pointer; transition: background .15s, color .15s;
}
.icon-tool svg { width: 16px; height: 16px; display: block; }
.icon-tool:hover:not(:disabled) { background: #ececee; color: var(--ink); }
.icon-tool:disabled { opacity: .5; cursor: not-allowed; }
.icon-tool-active { color: var(--ink); }
.composer-counter { color: #a3a3a3; font-size: 12px; white-space: nowrap; }
.composer-submit {
  display: inline-flex; align-items: center; padding: 4px 12px 4px 4px;
  border: 1px solid #e5e7eb; border-radius: 6px; background: #fff; color: var(--ink);
  box-shadow: 0 1px 2px rgba(0, 0, 0, .05);
  font-size: 13px; font-weight: 400; cursor: pointer; white-space: nowrap;
  transition: background .15s, opacity .15s;
}
.composer-submit:hover:not(:disabled) { background: #f7f7f8; }
.composer-submit:disabled { opacity: .5; cursor: not-allowed; color: #525252; }
.submit-chip { display: grid; place-items: center; margin-right: 8px; padding: 4px; border-radius: 4px; background: #f4f4f5; color: #71717a; }
.submit-chip svg { display: block; width: 14px; height: 14px; }

/* 示例 IP 模块：与 /check 页的 check-examples 同款（标签 + 滚动 marquee + 白色磨砂胶囊） */
.batch-examples { display: flex; gap: 14px; align-items: center; justify-content: center; width: min(860px, 100%); margin: 20px auto 0; }
.batch-examples-label { flex: 0 0 auto; color: var(--muted-ink); font-size: 13px; }
.chip-marquee { flex: 1 1 auto; min-width: 0; overflow: hidden; padding: 9px 0; -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 5%, #000 95%, transparent 100%); mask-image: linear-gradient(90deg, transparent 0, #000 5%, #000 95%, transparent 100%); }
.chip-track { display: flex; width: max-content; align-items: center; animation: chip-marquee 22s linear infinite; will-change: transform; }
.chip-set { display: flex; flex: 0 0 auto; gap: 10px; align-items: center; padding-right: 10px; }
@keyframes chip-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
.batch-example-chip {
  display: inline-flex; gap: 7px; align-items: center; padding: 7px 14px;
  border: 0; border-radius: 999px; background: rgba(255, 255, 255, .7);
  -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px); color: #334155; cursor: pointer;
}
.batch-example-flag { width: 17px; height: 12px; flex: 0 0 auto; object-fit: cover; border-radius: 2px; }
.batch-example-chip b { font-size: 12.5px; font-weight: 600; color: #334155; }
.batch-example-ip { font-family: "JetBrains Mono", monospace; font-size: 13px; color: #0f172a; }
@media (prefers-reduced-motion: reduce) {
  .chip-track { animation: none; }
}

/* 检测结果区 */
.batch-results { margin-top: 56px; padding: 80px 0; min-height: 0; }
.batch-summary { margin-top: 48px; }
.batch-table-card { position: relative; margin-top: 28px; border-radius: 12px; background: #fff; overflow: hidden; }
.batch-table-pill {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  border-radius: 0;
  background: #f1f4f1;
  opacity: 0;
  pointer-events: none;
  transition: transform .5s cubic-bezier(.3, 1.35, .45, 1), width .5s cubic-bezier(.3, 1.35, .45, 1), height .5s cubic-bezier(.3, 1.35, .45, 1), opacity .25s ease;
  will-change: transform, width, height;
}
.batch-table-pill.visible { opacity: 1; }
.batch-table-pill.snap { transition: opacity .25s ease; }
.batch-table-pending { padding: 48px 16px; color: #737373; font-size: 14px; text-align: center; }
.batch-table { position: relative; z-index: 1; min-width: 880px; }
.batch-tabs { margin-top: 28px; }
.batch-platform-name { display: inline-flex; gap: 8px; align-items: center; font-size: 14px; font-weight: 500; }
.batch-platform-ip { font-family: "JetBrains Mono", monospace; font-size: 12.5px; color: #737373; }
.batch-platform-cell { display: flex; flex-direction: column; gap: 6px; min-width: 96px; }
.batch-platform-score { display: inline-flex; gap: 3px; align-items: baseline; font-family: "JetBrains Mono", monospace; font-size: 14px; font-weight: 700; }
.batch-platform-score i { font-style: normal; font-weight: 400; font-size: 11px; color: #a3a3a3; }
.batch-platform-score.good { color: #27a64a; }
.batch-platform-score.warn { color: #ec6a2e; }
.batch-platform-score.bad { color: #dc2626; }
.batch-platform-meter { display: block; width: 72px; height: 4px; overflow: hidden; border-radius: 999px; background: #edf0ed; }
.batch-platform-meter i { display: block; height: 100%; border-radius: inherit; }
.batch-platform-meter.good i { background: #27a64a; }
.batch-platform-meter.warn i { background: #ec6a2e; }
.batch-platform-meter.bad i { background: #dc2626; }
.batch-table-head-row { background: #f8f9f8; }
.batch-table-head-row [data-slot="table-head"] { color: #737373; font-size: 13px; font-weight: 500; }
.batch-ip-link { font-family: "JetBrains Mono", monospace; font-size: 13.5px; font-weight: 500; color: var(--ink); transition: color .2s; }
a.batch-ip-link:hover { color: var(--deep-green); text-decoration: underline; text-underline-offset: 3px; }
.batch-ip-static { cursor: default; }
.batch-location { display: inline-flex; gap: 8px; align-items: center; font-size: 13.5px; font-weight: 500; }
.batch-location em { color: #737373; font-style: normal; }
.batch-isp { display: flex; flex-direction: column; gap: 2px; max-width: 230px; }
.batch-isp b { font-size: 13.5px; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.batch-isp small { color: #737373; font-size: 12px; }
.batch-signals { display: inline-flex; gap: 6px; flex-wrap: wrap; }
.batch-signals i { padding: 3px 8px; border-radius: 6px; font-size: 12px; font-style: normal; font-weight: 500; line-height: 16px; }
.batch-signals i.medium { background: #fbded0; color: #ec6a2e; }
.batch-signals i.high { background: #fee2e2; color: #dc2626; }
.batch-clean { display: inline-flex; gap: 6px; align-items: center; color: var(--deep-green); font-size: 13px; font-weight: 500; }
.batch-clean svg { width: 13px; height: 13px; }
.batch-risk { display: inline-flex; gap: 8px; align-items: center; }
.batch-risk b { font-family: "JetBrains Mono", monospace; font-size: 15px; font-weight: 700; }
.batch-risk em { padding: 3px 7px; border-radius: 6px; font-size: 12px; font-style: normal; font-weight: 500; line-height: 16px; }
.batch-verdict { display: block; max-width: 300px; font-size: 13.5px; line-height: 1.5; white-space: normal; }
.batch-row-error { display: inline-flex; gap: 10px; align-items: baseline; flex-wrap: wrap; color: #dc2626; font-size: 13px; }
.batch-rescan { display: flex; width: fit-content; gap: 8px; align-items: center; margin: 28px auto 0; padding: 13px 28px; border: 1px solid #e5e7eb; border-radius: 999px; background: #fff; color: var(--ink); font-size: 14.5px; font-weight: 550; cursor: pointer; transition: background .2s, border-color .2s; }
.batch-rescan svg { width: 16px; height: 16px; }
.batch-rescan:hover { border-color: var(--ink); background: var(--ink); color: #fff; }

@media (max-width: 900px) {
  .batch-hero { min-height: 704px; margin-top: 0; }
  .batch-hero-panel { top: 40px; right: 16px; bottom: 12px; left: 16px; }
  .batch-hero-inner { padding: 24px 16px; }
  .batch-hero-inner h1 { font-size: 34px; }
  .batch-hero-sub { font-size: 16px; line-height: 26px; }
  .batch-results { margin-top: 40px; padding: 56px 0; }
  .batch-summary { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 620px) {
  .batch-hero { min-height: 624px; }
}
</style>
