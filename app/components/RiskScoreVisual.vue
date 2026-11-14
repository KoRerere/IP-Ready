<script setup lang="ts">
import LandingGradientBackground from './LandingGradientBackground.vue'

const props = defineProps<{ lang: 'en' | 'zh' }>()
const text = computed(() => props.lang === 'zh'
  ? { score: '风险评分', rows: ['代理', 'VPN', '黑名单', 'Tor'], clear: '正常', verdict: '结论：就绪' }
  : { score: 'Risk score', rows: ['Proxy', 'VPN', 'Blacklist', 'Tor'], clear: 'Clear', verdict: 'Verdict: Ready' })

const root = ref<HTMLElement | null>(null)
const shown = ref(false)
let observer: IntersectionObserver | undefined
onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    shown.value = true
    return
  }
  observer = new IntersectionObserver(([entry]) => {
    if (entry?.isIntersecting) { shown.value = true; observer?.disconnect() }
  }, { threshold: .35 })
  if (root.value) observer.observe(root.value)
})
onBeforeUnmount(() => observer?.disconnect())

// 70.1% of the ticks light up for the illustrated 29.9 risk score.
const ticks = Array.from({ length: 60 }, (_, i) => ({
  rotation: `rotate(${i * 6} 50 50)`,
  color: i < 42 ? `hsl(${200 - i / 41 * 85} 100% 47%)` : '#d8dce3',
  delay: `${.45 + i * .01}s`,
}))
</script>

<template>
  <div ref="root" class="rsv" :class="{ 'is-shown': shown }" aria-hidden="true">
    <LandingGradientBackground />
    <div class="rsv-card">
      <div class="rsv-gauge">
        <svg class="rsv-ring" viewBox="0 0 100 100" fill="none" focusable="false">
          <line v-for="(tick, i) in ticks" :key="i" x1="50" y1="4" x2="50" y2="9" :transform="tick.rotation" :style="{ '--tick-color': tick.color, '--tick-delay': tick.delay }" />
        </svg>
        <div class="rsv-score"><strong>29.9</strong><span>{{ text.score }}</span></div>
      </div>
      <span class="rsv-verdict">{{ text.verdict }}</span>
      <div class="rsv-signals">
        <div v-for="(label, i) in text.rows" :key="i" class="rsv-row" :style="{ '--delay': `${1.05 + i * .08}s` }">
          <span class="rsv-dot"></span><span class="rsv-label">{{ label }}</span><span class="rsv-clear">{{ text.clear }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.rsv { position: relative; isolation: isolate; container-type: inline-size; width: 100%; height: 100%; aspect-ratio: 4 / 5; overflow: hidden; font-family: Inter, -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif; }
.rsv-card { position: absolute; inset: 8cqw; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 7cqw 6.2cqw 6cqw; border-radius: 3cqw; background: rgba(255,255,255,.9); color: #1b1f2a; opacity: 0; transform: translateY(125cqw); transition: opacity 1.2s ease, transform 1.2s ease; }
.is-shown .rsv-card { opacity: 1; transform: none; }
.rsv-gauge { position: relative; flex-shrink: 0; width: 38cqw; height: 38cqw; }
.rsv-ring { display: block; width: 100%; height: 100%; overflow: visible; }
.rsv-ring line { stroke: #d8dce3; stroke-width: 2.5; stroke-linecap: round; transition: stroke .25s ease var(--tick-delay); }
.is-shown .rsv-ring line { stroke: var(--tick-color); }
.rsv-score { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: .4cqw; }
.rsv-score strong { color: #080b0c; font-size: 7.6cqw; font-weight: 700; line-height: 1; letter-spacing: -.03em; font-variant-numeric: tabular-nums; }
.rsv-score span { color: #687385; font-size: 3.3cqw; line-height: 1.4; }
.rsv-signals { width: 100%; margin-top: 5cqw; border-top: 1px solid #eceef2; }
.rsv-row { display: grid; grid-template-columns: 1.6cqw minmax(0, 1fr) auto; align-items: center; gap: 2.4cqw; min-height: 9.6cqw; border-bottom: 1px solid #eceef2; opacity: 0; transform: translateY(6px); transition: opacity .4s ease var(--delay), transform .4s ease var(--delay); }
.is-shown .rsv-row { opacity: 1; transform: none; }
.rsv-dot { width: 1.6cqw; height: 1.6cqw; border-radius: 50%; background: #34b87a; }
.rsv-label { font-size: 3.3cqw; font-weight: 500; }
.rsv-clear { color: #7b838c; font-size: 3.2cqw; }
.rsv-verdict { margin-top: 3cqw; padding: .9cqw 2.8cqw; border-radius: 999px; background: #dff9ed; color: #187954; font-size: 3.2cqw; font-weight: 500; line-height: 1.25; white-space: nowrap; opacity: 0; transform: translateY(6px); transition: opacity .4s ease .85s, transform .4s ease .85s; }
.is-shown .rsv-verdict { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) { .rsv-card, .rsv-ring line, .rsv-row, .rsv-verdict { transition: none; } }
</style>
