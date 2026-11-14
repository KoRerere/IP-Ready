<script setup lang="ts">
import { ArrowUp, ChevronDown, Clock, Code, Coffee, FolderClosed, GraduationCap, Lightbulb, MessageCircle, PanelLeft, PenLine, Plus, Shapes, SlidersHorizontal, SquarePen } from 'lucide-vue-next'

// Decorative, non-interactive replica of the claude.ai new-chat screen: warm paper background, slim icon rail,
// serif greeting, rounded-rectangle composer with tool row + model picker, and the starter chips underneath.
// Sizes scale with the window width (container query units), so it stays sharp at any size.
const props = defineProps<{ lang: 'en' | 'zh', logoPath: string }>()
const text = computed(() => props.lang === 'zh'
  ? { plan: '免费套餐', upgrade: '升级', heading: '下午好', placeholder: '今天我能帮你做些什么？', model: 'Opus 5.5', chips: ['写作', '学习', '编程', '生活琐事', 'Claude 来选'] }
  : { plan: 'Free plan', upgrade: 'Upgrade', heading: 'Good afternoon', placeholder: 'How can I help you today?', model: 'Opus 5.5', chips: ['Write', 'Learn', 'Code', 'Life stuff', "Claude's choice"] })
const rail = [MessageCircle, FolderClosed, Shapes, Code]
const chipIcons = [PenLine, GraduationCap, Code, Coffee, Lightbulb]

// Typing loop in the composer: type a short work prompt, hold, fade it out, type the next one.
// Chinese is typed the way a pinyin IME does it: underlined pinyin first, then committed to characters word by word.
const PROMPTS_EN = ['Review this pull request for edge cases', 'Turn these meeting notes into action items', 'Explain this error log in plain words', 'Draft a polite follow-up to the vendor', 'Outline an onboarding doc for new hires']
const PROMPTS_ZH = [
  "帮我|bang'wo 审查|shen'cha 这个|zhe'ge 合并|he'bing 请求|qing'qiu 的|de 边界|bian'jie 情况|qing'kuang",
  "把|ba 会议|hui'yi 纪要|ji'yao 整理|zheng'li 成|cheng 待办|dai'ban 清单|qing'dan",
  "用|yong 大白话|da'bai'hua 解释|jie'shi 这段|zhe'duan 报错|bao'cuo 日志|ri'zhi",
  "给|gei 供应商|gong'ying'shang 写|xie 一封|yi'feng 礼貌|li'mao 的|de 跟进|gen'jin 邮件|you'jian",
  "帮我|bang'wo 列|lie 一份|yi'fen 新人|xin'ren 入职|ru'zhi 文档|wen'dang 大纲|da'gang",
].map(line => line.split(' ').map((seg) => { const [hanzi, pinyin] = seg.split('|'); return { hanzi: hanzi!, pinyin: pinyin! } }))
const root = ref<HTMLElement | null>(null)
const typed = ref('')
const composing = ref('')
const typedEl = ref<HTMLElement | null>(null)
const fading = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined
let running = false
let index = 0
let observer: IntersectionObserver | undefined

function wait(ms: number) { return new Promise<void>((resolve) => { timer = setTimeout(resolve, ms) }) }
const jitter = (ms: number) => ms + Math.random() * ms * 0.6
async function show() { await nextTick(); if (typedEl.value) typedEl.value.scrollLeft = typedEl.value.scrollWidth } // keep the newest characters in view, like a real input
async function typeEnglish(phrase: string) {
  for (const char of phrase) {
    if (!running) return
    typed.value += char
    await show()
    await wait(jitter(55))
  }
}
async function typeChinese(segments: { hanzi: string, pinyin: string }[]) {
  // characters appear one by one; no pinyin pre-edit text is shown
  for (const { hanzi } of segments) {
    for (const char of hanzi) {
      if (!running) return
      typed.value += char
      await show()
      await wait(jitter(110))
    }
  }
}
async function loop() {
  if (running) return
  running = true
  const lang = props.lang
  while (running && lang === props.lang) {
    if (lang === 'zh') await typeChinese(PROMPTS_ZH[index % PROMPTS_ZH.length]!)
    else await typeEnglish(PROMPTS_EN[index % PROMPTS_EN.length]!)
    if (!running) return
    await wait(1700)
    if (!running) return
    fading.value = true
    await wait(320)
    typed.value = ''
    fading.value = false
    index += 1
    await wait(550)
  }
}
function stop() { running = false; if (timer) clearTimeout(timer) }
function reset() { stop(); typed.value = ''; composing.value = ''; fading.value = false }
onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  observer = new IntersectionObserver(([entry]) => { if (entry?.isIntersecting) void loop(); else reset() }, { threshold: 0.2 })
  if (root.value) observer.observe(root.value)
})
watch(() => props.lang, () => { if (!running) return; reset(); index = 0; void loop() })
onBeforeUnmount(() => { stop(); observer?.disconnect() })
</script>

<template>
  <div ref="root" class="clm" aria-hidden="true">
    <div class="clm-window">
      <nav class="clm-rail">
        <PanelLeft class="clm-rail-icon" :stroke-width="1.6" />
        <span class="clm-new"><Plus :stroke-width="2.2" /></span>
        <component :is="icon" v-for="(icon, i) in rail" :key="i" class="clm-rail-icon" :stroke-width="1.6" />
        <span class="clm-avatar">IP</span>
      </nav>
      <div class="clm-main">
        <div class="clm-topbar">
          <PanelLeft class="clm-m-icon" :stroke-width="1.6" />
          <span class="clm-wordmark">Claude</span>
          <SquarePen class="clm-m-icon" :stroke-width="1.6" />
        </div>
        <div class="clm-center">
          <span class="clm-plan">{{ text.plan }}<i>·</i><u>{{ text.upgrade }}</u></span>
          <p class="clm-heading"><svg class="clm-spark" viewBox="0 0 24 24"><path :d="props.logoPath" fill="#D97757" /></svg>{{ text.heading }}</p>
          <div class="clm-composer">
            <div class="clm-input">
              <span v-if="typed || composing" ref="typedEl" class="clm-typed" :class="{ 'is-fading': fading }">{{ typed }}<span v-if="composing" class="clm-composing">{{ composing }}</span><i class="clm-caret"></i></span>
              <span v-else class="clm-placeholder">{{ text.placeholder }}</span>
            </div>
            <div class="clm-tools">
              <span class="clm-tool"><Plus :stroke-width="1.75" /></span>
              <span class="clm-tool"><SlidersHorizontal :stroke-width="1.75" /></span>
              <span class="clm-tool"><Clock :stroke-width="1.75" /></span>
              <span class="clm-model">{{ text.model }}<ChevronDown :stroke-width="1.75" /></span>
              <span class="clm-send" :class="{ 'is-active': typed || composing }"><ArrowUp :stroke-width="2.25" /></span>
            </div>
          </div>
          <div class="clm-chips">
            <span v-for="(chip, i) in text.chips" :key="chip" class="clm-chip"><component :is="chipIcons[i]" :stroke-width="1.75" />{{ chip }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.clm { container-type: inline-size; width: 100%; }
.clm-window { position: relative; display: grid; grid-template-columns: auto minmax(0, 1fr); width: 100%; aspect-ratio: 1 / var(--cgm-ratio, .625); overflow: hidden; border: 1px solid #e6e3d8; border-radius: 14px; background: #faf9f5; box-shadow: 0 24px 60px rgba(70,40,26,.1); color: #141413; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, "PingFang SC", "Microsoft YaHei", sans-serif; text-align: left; user-select: none; }
.clm-rail { display: flex; flex-direction: column; align-items: center; gap: clamp(12px, 1.7cqw, 22px); width: clamp(42px, 5cqw, 58px); padding: clamp(12px, 1.5cqw, 18px) 0; border-right: 1px solid #ebe8de; background: #f5f4ee; color: #3d3d3a; }
.clm-rail-icon { width: clamp(15px, 1.7cqw, 20px); height: clamp(15px, 1.7cqw, 20px); }
.clm-new { display: grid; width: clamp(22px, 2.5cqw, 30px); height: clamp(22px, 2.5cqw, 30px); place-items: center; border-radius: 50%; background: #c96442; color: #fff; }
.clm-new svg { width: 62%; height: 62%; }
.clm-avatar { display: grid; width: clamp(22px, 2.5cqw, 30px); height: clamp(22px, 2.5cqw, 30px); margin-top: auto; place-items: center; border-radius: 50%; background: #3d3d3a; color: #faf9f5; font-size: clamp(9px, .95cqw, 12px); font-weight: 600; }
.clm-main { position: relative; display: flex; min-width: 0; flex-direction: column; }
.clm-topbar { display: none; }
.clm-center { display: flex; flex: 1; flex-direction: column; align-items: center; justify-content: center; padding: 0 clamp(12px, 3cqw, 40px) calc(var(--cgm-ratio, .625) * 100cqw / 3); }
.clm-plan { display: inline-flex; align-items: center; gap: .45em; margin-bottom: clamp(14px, 2.2cqw, 28px); padding: .5em .95em; border-radius: 8px; background: #efede4; color: #73726c; font-size: clamp(10px, 1cqw, 13px); line-height: 1; white-space: nowrap; }
.clm-plan i { font-style: normal; }
.clm-plan u { color: #3d3d3a; text-decoration: underline; text-underline-offset: 2px; }
.clm-heading { display: flex; align-items: center; gap: .32em; margin: 0 0 clamp(14px, 2.2cqw, 30px); color: #3d3d3a; font-family: "Copernicus", "Tiempos Headline", ui-serif, Georgia, Cambria, "Times New Roman", "Songti SC", "STSong", serif; font-size: clamp(22px, 3.1cqw, 40px); font-weight: 400; letter-spacing: -.01em; white-space: nowrap; }
.clm-spark { width: 1em; height: 1em; flex: none; }
.clm-composer { display: flex; width: min(100%, 60cqw); flex-direction: column; gap: clamp(8px, 1.1cqw, 14px); padding: clamp(11px, 1.3cqw, 16px) clamp(10px, 1.1cqw, 14px) clamp(9px, 1cqw, 12px); border: 1px solid #e3e0d5; border-radius: clamp(14px, 1.6cqw, 20px); background: #fff; box-shadow: 0 4px 20px rgba(60,40,20,.045); }
.clm-input { display: flex; min-height: 1.5em; padding: 0 clamp(2px, .35cqw, 5px); font-size: clamp(13px, 1.3cqw, 16px); }
.clm-placeholder, .clm-typed { min-width: 0; flex: 1; overflow: hidden; white-space: nowrap; }
.clm-placeholder { color: #8a8984; text-overflow: ellipsis; }
.clm-typed { color: #141413; transition: opacity .3s ease; }
.clm-typed.is-fading { opacity: 0; }
.clm-composing { text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 3px; }
.clm-caret { display: inline-block; width: 1.5px; height: 1.1em; margin-left: 1px; background: #141413; vertical-align: -.18em; animation: clm-blink 1s steps(1) infinite; }
@keyframes clm-blink { 50% { opacity: 0; } }
.clm-tools { display: flex; align-items: center; gap: clamp(5px, .6cqw, 8px); }
.clm-tool { display: grid; width: clamp(26px, 2.6cqw, 32px); height: clamp(26px, 2.6cqw, 32px); place-items: center; border: 1px solid #e3e0d5; border-radius: 8px; color: #57564f; }
.clm-tool svg { width: 52%; height: 52%; }
.clm-model { display: inline-flex; align-items: center; gap: .3em; margin-left: auto; padding: 0 .3em; color: #3d3d3a; font-size: clamp(11px, 1.1cqw, 14px); white-space: nowrap; }
.clm-model svg { width: 1em; height: 1em; color: #73726c; }
.clm-send { display: grid; width: clamp(26px, 2.6cqw, 32px); height: clamp(26px, 2.6cqw, 32px); flex: none; place-items: center; border-radius: 8px; background: #e8a58f; color: #fff; transition: background-color .2s ease; }
.clm-send.is-active { background: #c96442; }
.clm-send svg { width: 56%; height: 56%; }
.clm-chips { display: flex; max-width: min(100%, 64cqw); flex-wrap: wrap; justify-content: center; gap: clamp(6px, .75cqw, 10px); margin-top: clamp(12px, 1.6cqw, 20px); }
.clm-chip { display: inline-flex; align-items: center; gap: .45em; padding: .5em .85em; border: 1px solid #e3e0d5; border-radius: 9px; background: #faf9f5; color: #3d3d3a; font-size: clamp(11px, 1.08cqw, 14px); line-height: 1; white-space: nowrap; }
.clm-chip svg { width: 1.1em; height: 1.1em; color: #73726c; }
@container (max-width: 560px) {
  .clm-window { grid-template-columns: minmax(0, 1fr); border-radius: 12px; }
  .clm-rail { display: none; }
  .clm-topbar { display: flex; align-items: center; justify-content: space-between; padding: 12px 14px 0; color: #3d3d3a; }
  .clm-m-icon { width: 20px; height: 20px; }
  .clm-wordmark { font-family: "Copernicus", "Tiempos Headline", ui-serif, Georgia, serif; font-size: 18px; }
  .clm-composer, .clm-chips { width: 100%; max-width: 100%; }
  .clm-chip:nth-child(n+4) { display: none; }
}
</style>
