<script setup lang="ts">
import {
  siAliexpress,
  siDeepseek,
  siEtsy,
  siGooglegemini,
  siPerplexity,
  siShopify,
} from 'simple-icons'

const props = defineProps<{
  brand: 'gemini' | 'perplexity' | 'deepseek' | 'shopify' | 'etsy' | 'aliexpress'
}>()

const icons = {
  gemini: siGooglegemini,
  perplexity: siPerplexity,
  deepseek: siDeepseek,
  shopify: siShopify,
  etsy: siEtsy,
  aliexpress: siAliexpress,
}

const icon = computed(() => icons[props.brand])
</script>

<template>
  <svg class="simple-brand-icon" viewBox="0 0 24 24" aria-hidden="true" :style="{ color: `#${icon.hex}` }">
    <path fill="currentColor" :d="icon.path" />
  </svg>
</template>
