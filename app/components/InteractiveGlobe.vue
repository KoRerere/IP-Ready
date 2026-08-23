<script setup lang="ts">
import createGlobe, { type COBEOptions } from 'cobe'

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

const globeConfig: COBEOptions = {
  width: 800,
  height: 800,
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  dark: 0,
  diffuse: 0.4,
  mapSamples: 16000,
  mapBrightness: 1.2,
  mapBaseBrightness: 0.02,
  baseColor: [248 / 255, 253 / 255, 249 / 255],
  markerColor: [0.08, 0.72, 0.28],
  glowColor: [1, 1, 1],
  opacity: 0.88,
  scale: 1,
  markers: [],
}

function render() {
  if (pointerStart === null && visible && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) phi += 0.0035
  globe?.update({ phi: phi + dragRotation, width: width * 2, height: width * 2 })
  animationFrame = requestAnimationFrame(render)
}

function updateSize() {
  if (!canvas.value) return
  width = canvas.value.offsetWidth
  globe?.update({ width: width * 2, height: width * 2 })
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
  updateSize()
  globe = createGlobe(element, { ...globeConfig, width: width * 2, height: width * 2 })
  resizeObserver = new ResizeObserver(updateSize)
  resizeObserver.observe(element)
  document.addEventListener('visibilitychange', updateVisibility)
  requestAnimationFrame(() => element.classList.add('ready'))
  animationFrame = requestAnimationFrame(render)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animationFrame)
  resizeObserver?.disconnect()
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
