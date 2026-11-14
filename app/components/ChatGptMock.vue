<script setup lang="ts">
import { AtSign, AudioLines, Hexagon, Images, LifeBuoy, Menu, Mic, Plus, Settings, SquarePen, Telescope } from 'lucide-vue-next'

// Decorative, non-interactive recreation of the logged-out ChatGPT start screen.
// Sizes scale with the window width (container query units), so it stays sharp at any size.
const props = defineProps<{ lang: 'en' | 'zh', logoPath: string }>()
const text = computed(() => props.lang === 'zh'
  ? { login: '登录', signup: '免费注册', heading: '我们先从哪里开始呢？', placeholder: '询问 ChatGPT', chip: '你都有哪些功能？', d1: 'ChatGPT 是 AI。使用即表示你同意我们的', terms: '条款', and: '和', privacy: '隐私政策', d2: '。聊天内容可能会被审核，并用于改进我们的 AI 模型。', more: '了解更多' }
  : { login: 'Log in', signup: 'Sign up for free', heading: 'Where should we begin?', placeholder: 'Ask ChatGPT', chip: 'What can you do?', d1: 'ChatGPT is AI. By using it, you agree to our ', terms: 'Terms', and: ' and ', privacy: 'Privacy Policy', d2: '. Chats may be reviewed and used to improve our AI models. ', more: 'Learn more' })
const rail = [SquarePen, Images, AtSign, Hexagon, LifeBuoy, Telescope, Settings]

// Typing loop in the composer: type a short work prompt, hold, fade it out, type the next one.
// Chinese is typed the way a pinyin IME does it: underlined pinyin first, then committed to characters word by word.
const PROMPTS_EN = ['Help me debug this login flow', 'Write a launch checklist for the new feature', "Summarize this week's user feedback", 'Draft a short delay update for the client', 'Refactor this function to be easier to read']
const PROMPTS_ZH = [
  "帮我|bang'wo 排查|pai'cha 一下|yi'xia 这个|zhe'ge 登录|deng'lu 流程|liu'cheng 的|de 报错|bao'cuo",
  "给|gei 新功能|xin'gong'neng 写|xie 一份|yi'fen 上线|shang'xian 检查|jian'cha 清单|qing'dan",
  "总结|zong'jie 一下|yi'xia 这周|zhe'zhou 的|de 用户|yong'hu 反馈|fan'kui",
  "帮我|bang'wo 给|gei 客户|ke'hu 写|xie 一封|yi'feng 简短|jian'duan 的|de 延期|yan'qi 说明|shuo'ming",
  "把|ba 这个|zhe'ge 函数|han'shu 重构|chong'gou 得|de 更好读|geng'hao'du 一点|yi'dian",
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
  <div ref="root" class="cgm" aria-hidden="true">
    <div class="cgm-window">
      <nav class="cgm-rail">
        <svg class="cgm-logo" viewBox="0 0 24 24"><path fill-rule="evenodd" clip-rule="evenodd" :d="props.logoPath" fill="currentColor" /></svg>
        <component :is="icon" v-for="(icon, i) in rail" :key="i" class="cgm-rail-icon" :stroke-width="1.75" />
      </nav>
      <div class="cgm-main">
        <div class="cgm-topbar">
          <Menu class="cgm-menu" :stroke-width="1.75" />
          <div class="cgm-actions"><span class="cgm-btn cgm-btn--dark">{{ text.login }}</span><span class="cgm-btn">{{ text.signup }}</span></div>
        </div>
        <div class="cgm-center">
          <p class="cgm-heading">{{ text.heading }}</p>
          <div class="cgm-composer">
            <Plus class="cgm-plus" :stroke-width="1.75" />
            <span v-if="typed || composing" ref="typedEl" class="cgm-typed" :class="{ 'is-fading': fading }">{{ typed }}<span v-if="composing" class="cgm-composing">{{ composing }}</span><i class="cgm-caret"></i></span>
            <span v-else class="cgm-placeholder">{{ text.placeholder }}</span>
            <Mic class="cgm-mic" :stroke-width="1.75" />
            <span class="cgm-voice"><AudioLines :stroke-width="2.25" /></span>
          </div>
          <span class="cgm-chip">{{ text.chip }}</span>
        </div>
        <p class="cgm-disclaimer">{{ text.d1 }}<u>{{ text.terms }}</u>{{ text.and }}<u>{{ text.privacy }}</u>{{ text.d2 }}<u>{{ text.more }}</u></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cgm { container-type: inline-size; width: 100%; }
.cgm-window { position: relative; display: grid; grid-template-columns: auto minmax(0, 1fr); width: 100%; aspect-ratio: 1 / var(--cgm-ratio, .625); overflow: hidden; border: 1px solid #e3e8e6; border-radius: 14px; background: #fcfcfc; box-shadow: 0 24px 60px rgba(32,55,42,.1); color: #0d0d0d; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, "PingFang SC", "Microsoft YaHei", sans-serif; text-align: left; user-select: none; }
.cgm-rail { display: flex; flex-direction: column; align-items: center; gap: clamp(12px, 1.9cqw, 24px); width: clamp(40px, 5cqw, 58px); padding-top: clamp(12px, 1.6cqw, 20px); border-right: 1px solid #ececec; background: #f9f9f9; color: #3d3d3d; }
.cgm-logo { width: clamp(19px, 2.4cqw, 27px); height: clamp(19px, 2.4cqw, 27px); margin-bottom: clamp(4px, 1.1cqw, 14px); }
.cgm-rail-icon { width: clamp(15px, 1.8cqw, 21px); height: clamp(15px, 1.8cqw, 21px); }
.cgm-main { position: relative; display: flex; min-width: 0; flex-direction: column; }
.cgm-topbar { display: flex; align-items: center; justify-content: flex-end; padding: clamp(10px, 1.3cqw, 18px) clamp(10px, 1.3cqw, 18px) 0; }
.cgm-menu { display: none; width: 20px; height: 20px; color: #3d3d3d; }
.cgm-actions { display: flex; gap: clamp(5px, .7cqw, 10px); }
.cgm-btn { padding: .62em 1.05em; border: 1px solid #e3e3e3; border-radius: 999px; background: #fff; font-size: clamp(10px, 1.08cqw, 13px); font-weight: 500; line-height: 1; white-space: nowrap; }
.cgm-btn--dark { border-color: #0d0d0d; background: #0d0d0d; color: #fff; }
.cgm-center { display: flex; flex: 1; flex-direction: column; align-items: center; justify-content: center; padding: 0 clamp(12px, 3cqw, 40px) calc(var(--cgm-ratio, .625) * 100cqw / 3); }
.cgm-heading { margin: 0 0 clamp(14px, 2.6cqw, 34px); font-size: clamp(20px, 2.8cqw, 36px); font-weight: 500; text-align: center; }
.cgm-composer { display: flex; width: min(100%, 66cqw); min-height: clamp(46px, 4.8cqw, 64px); align-items: center; gap: clamp(9px, 1.1cqw, 14px); padding: 0 clamp(6px, .65cqw, 9px) 0 clamp(12px, 1.4cqw, 20px); border: 1px solid #e5e5e5; border-radius: 999px; background: #fff; box-shadow: 0 3px 14px rgba(0,0,0,.03); }
.cgm-plus, .cgm-mic { width: clamp(17px, 1.9cqw, 24px); height: clamp(17px, 1.9cqw, 24px); flex: none; color: #2b2b2b; }
.cgm-placeholder, .cgm-typed { min-width: 0; flex: 1; overflow: hidden; font-size: clamp(13px, 1.3cqw, 16px); white-space: nowrap; }
.cgm-placeholder { color: #8f8f8f; text-overflow: ellipsis; }
.cgm-typed { color: #0d0d0d; transition: opacity .3s ease; }
.cgm-typed.is-fading { opacity: 0; }
.cgm-composing { text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 3px; }
.cgm-caret { display: inline-block; width: 1.5px; height: 1.1em; margin-left: 1px; background: #0d0d0d; vertical-align: -.18em; animation: cgm-blink 1s steps(1) infinite; }
@keyframes cgm-blink { 50% { opacity: 0; } }
.cgm-voice { display: grid; width: clamp(32px, 3.5cqw, 46px); height: clamp(32px, 3.5cqw, 46px); flex: none; place-items: center; border-radius: 50%; background: #3e6ff2; color: #fff; }
.cgm-voice svg { width: 56%; height: 56%; }
.cgm-chip { margin-top: clamp(16px, 2cqw, 26px); padding: .55em 1em; border: 1px solid #e3e3e3; border-radius: 999px; background: #fff; font-size: clamp(12px, 1.25cqw, 16px); font-weight: 500; white-space: nowrap; }
.cgm-disclaimer { position: absolute; right: 0; bottom: clamp(6px, .8cqw, 12px); left: 0; margin: 0; padding: 0 12px; color: #5d5d5d; font-size: clamp(9px, .85cqw, 12px); line-height: 1.4; text-align: center; }
.cgm-disclaimer u { text-underline-offset: 2px; }
@container (max-width: 560px) {
  .cgm-window { grid-template-columns: minmax(0, 1fr); border-radius: 12px; }
  .cgm-rail { display: none; }
  .cgm-topbar { justify-content: space-between; padding: 12px 12px 0 14px; }
  .cgm-menu { display: block; }
  .cgm-composer { width: 100%; }
}
</style>
