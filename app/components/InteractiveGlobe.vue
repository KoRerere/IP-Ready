<script setup lang="ts">
import createGlobe, { type COBEOptions } from 'cobe'

const props = defineProps<{ tint?: 'green' | 'blue' }>()

// 配色整体都很浅；blue 供 /check 页蓝色主题使用
const palettes = {
  green: { base: [248 / 255, 253 / 255, 249 / 255], glow: [1, 1, 1], marker: [0.08, 0.72, 0.28] },
  blue: { base: [206 / 255, 226 / 255, 250 / 255], glow: [0.87, 0.93, 1], marker: [0.18, 0.49, 0.85] },
} as const
const palette = palettes[props.tint ?? 'green']

const canvas = ref<HTMLCanvasElement | null>(null)
let globe: ReturnType<typeof createGlobe> | undefined
let resizeObserver: ResizeObserver | undefined
let animationFrame = 0
let phi = 0
let width = 0
let pointerStart: number | null = null
let pointerOffset = 0
let dragRotation = 0
let visible = true
// tbt1116：画布离开视口时跳过绘制（回到视口后从原角度继续，肉眼无差别）
let inView = true
let intersectionObserver: IntersectionObserver | undefined
let reducedMotion: MediaQueryList | undefined
// tbt1116：后备分辨率 = CSS 宽 × min(4, 2×屏幕 DPR)。DPR≥2 与原先 4 倍完全一致（逐像素相同）；
// DPR<2 仍保留 2 倍超采样，只去掉多余像素——无 GPU 的软件 WebGL（PSI/Lighthouse）下这正是逐帧长任务的来源。
let backingScale = 4

const globeConfig: COBEOptions = {
  width: 800,
  height: 800,
  devicePixelRatio: 1,
  phi: 0,
  theta: 0.3,
  dark: 0,
  diffuse: 0.4,
  mapSamples: 16000,
  mapBrightness: 1.2,
  mapBaseBrightness: 0.02,
  baseColor: [...palette.base] as COBEOptions['baseColor'],
  markerColor: [...palette.marker] as COBEOptions['markerColor'],
  glowColor: [...palette.glow] as COBEOptions['glowColor'],
  opacity: 0.88,
  scale: 1,
  markers: [],
}

function render() {
  if (inView) {
    if (pointerStart === null && visible && !reducedMotion?.matches) phi += 0.0035
    globe?.update({ phi: phi + dragRotation, width: width * backingScale, height: width * backingScale })
  }
  animationFrame = requestAnimationFrame(render)
}

function updateSize() {
  if (!canvas.value) return
  width = canvas.value.offsetWidth
  backingScale = Math.min(4, 2 * Math.max(1, window.devicePixelRatio || 1))
  globe?.update({ width: width * backingScale, height: width * backingScale })
}

function pointerDown(event: PointerEvent) {
  pointerStart = event.clientX - pointerOffset
  canvas.value?.setPointerCapture(event.pointerId)
}

function pointerMove(event: PointerEvent) {
  if (pointerStart === null) return
  pointerOffset = event.clientX - pointerStart
  dragRotation = pointerOffset / 180
}

function pointerUp() {
  pointerStart = null
}

function updateVisibility() {
  visible = !document.hidden
}

onMounted(() => {
  const element = canvas.value
  if (!element) return
  reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  updateSize()
  globe = createGlobe(element, { ...globeConfig, width: width * backingScale, height: width * backingScale })
  resizeObserver = new ResizeObserver(updateSize)
  resizeObserver.observe(element)
  intersectionObserver = new IntersectionObserver(([entry]) => { inView = entry?.isIntersecting ?? true })
  intersectionObserver.observe(element)
  document.addEventListener('visibilitychange', updateVisibility)
  requestAnimationFrame(() => element.classList.add('ready'))
  animationFrame = requestAnimationFrame(render)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animationFrame)
  resizeObserver?.disconnect()
  intersectionObserver?.disconnect()
  document.removeEventListener('visibilitychange', updateVisibility)
  globe?.destroy()
})
</script>

<template>
  <canvas
    ref="canvas"
    class="interactive-globe"
    aria-label="Interactive globe showing global network locations"
    @pointerdown="pointerDown"
    @pointermove="pointerMove"
    @pointerup="pointerUp"
    @pointercancel="pointerUp"
    @pointerleave="pointerUp"
  />
</template>
