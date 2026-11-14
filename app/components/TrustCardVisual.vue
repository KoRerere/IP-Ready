<script setup lang="ts">
import { Check, House, Link, ShieldAlert, Users } from 'lucide-vue-next'
import LandingGradientBackground from './LandingGradientBackground.vue'

// Decorative "IP Trust Check" card on a gradient. It rises from the bottom of the frame
// the first time the frame scrolls into view. Sizes use container units, so it scales with the frame.
const props = defineProps<{ lang: 'en' | 'zh' }>()
const text = computed(() => props.lang === 'zh'
  ? { title: 'IP 信任检测', connected: '已连接' }
  : { title: 'IP Trust Check', connected: 'Connected' })

const root = ref<HTMLElement | null>(null)
const shown = ref(false)
let observer: IntersectionObserver | undefined
onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) { shown.value = true; return }
  observer = new IntersectionObserver(([entry]) => {
    if (entry?.isIntersecting) { shown.value = true; observer?.disconnect() }
  }, { threshold: 0.35 })
  if (root.value) observer.observe(root.value)
})
onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div ref="root" class="tcv" aria-hidden="true">
    <LandingGradientBackground />
    <div class="tcv-card" :class="{ 'is-shown': shown }">
      <span class="tcv-pill">{{ text.title }}</span>
      <div class="tcv-row">
        <Link class="tcv-icon tcv-icon--link" :stroke-width="2" />
        <span class="tcv-label">{{ text.connected }}</span>
        <span class="tcv-check" style="--d: 1.1s"><Check :stroke-width="3" /></span>
      </div>
      <div class="tcv-row">
        <House class="tcv-icon" :stroke-width="1.75" />
        <span class="tcv-track"><i class="tcv-fill tcv-fill--residential" style="--d: .9s" /></span>
        <span class="tcv-check" style="--d: 1.8s"><Check :stroke-width="3" /></span>
      </div>
      <div class="tcv-row">
        <Users class="tcv-icon" :stroke-width="1.75" />
        <span class="tcv-track"><i class="tcv-fill tcv-fill--shared" style="--d: .98s" /></span>
        <span />
      </div>
      <div class="tcv-row">
        <ShieldAlert class="tcv-icon tcv-icon--risk" :stroke-width="2" />
        <span class="tcv-track"><i class="tcv-fill tcv-fill--risk" style="--d: 1.06s" /></span>
        <span />
      </div>
    </div>
  </div>
</template>

<style scoped>
.tcv { --tcv-gap: 7cqw; position: relative; isolation: isolate; width: 100%; height: 100%; overflow: hidden; container-type: inline-size; background: linear-gradient(115deg, #f5f9fc 0%, #e8f2ff 48%, #d4e8ff 100%); }
/* same gap on all four sides, full radius; rows share the card height so the content always fits */
.tcv-card { position: absolute; inset: var(--tcv-gap); display: flex; flex-direction: column; box-sizing: border-box; padding: 4.6cqw 5.4cqw; border-radius: 2.3cqw; background: rgba(255, 255, 255, .9); color: #1b1f2a; font-family: Inter, -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif; opacity: 0; transform: translateY(62.5cqw); transition: opacity 1.2s ease, transform 1.2s ease; }
.tcv-card.is-shown { opacity: 1; transform: none; }
.tcv-pill { display: inline-block; align-self: flex-start; padding: 0.94cqw 2.3cqw; border-radius: 999px; background: #e8eaf2; font-size: 2.3cqw; font-weight: 600; letter-spacing: .01em; line-height: 1.2; }
.tcv-row { flex: 1 1 0; min-height: 0; display: grid; grid-template-columns: 4.92cqw minmax(0, 1fr) 4.43cqw; align-items: center; gap: 0 4.1cqw; border-bottom: 1px solid #eceef2; }
.tcv-row:last-child { border-bottom: 0; }
.tcv-pill + .tcv-row { margin-top: 2.6cqw; }
.tcv-icon { width: 4.6cqw; height: 4.6cqw; justify-self: center; color: #3c414d; }
.tcv-icon--link { color: #2f9ff0; }
.tcv-icon--risk { color: #f07a1a; }
.tcv-label { margin-left: 2.46cqw; font-size: 2.7cqw; font-weight: 600; } /* starts where the bars start */
.tcv-track { position: relative; display: block; width: 86%; height: 1.7cqw; margin-left: 2.46cqw; overflow: hidden; border-radius: 999px; background: #e8eaf2; }
/* As the card rises, stagger the bars and reveal each check after its signal (--d = delay from scroll-in). */
.tcv-fill { position: absolute; inset: 0 auto 0 0; border-radius: inherit; transform: scaleX(0); transform-origin: left center; transition: transform .9s cubic-bezier(.3, .7, .2, 1) var(--d, 0s); }
.is-shown .tcv-fill { transform: none; }
.tcv-fill--residential { width: 82%; background: linear-gradient(90deg, #aaf0b8, #4fd8c6 45%, #3aa2f5); }
.tcv-fill--shared { width: 29%; background: linear-gradient(90deg, #4fb4f5, #73d3f8); }
.tcv-fill--risk { width: 22%; background: linear-gradient(90deg, #f0701a, #f7b53d); }
.tcv-check { display: grid; width: 3.8cqw; height: 3.8cqw; justify-self: center; place-items: center; border-radius: 50%; background: #34c27a; color: #fff; opacity: 0; transform: scale(.4); transition: transform .5s cubic-bezier(.3, 1.6, .5, 1) var(--d, 0s), opacity .25s ease var(--d, 0s); }
.is-shown .tcv-check { opacity: 1; transform: none; }
.tcv-check svg { width: 58%; height: 58%; }
@media (prefers-reduced-motion: reduce) { .tcv-card, .tcv-fill, .tcv-check { transition: none; } }
</style>
