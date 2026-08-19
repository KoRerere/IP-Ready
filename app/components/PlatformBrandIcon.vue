<script setup lang="ts">
defineProps<{
  name: string
  src: string
}>()
</script>

<template>
  <span class="platform-brand-icon" aria-hidden="true">
    <img v-if="name === 'Claude'" class="brand-leaf claude-leaf" src="/assets/figma/imgVector1.svg" alt="" />
    <img v-else-if="name === 'ChatGPT'" class="brand-leaf chatgpt-leaf" src="/assets/figma/imgVector16.svg" alt="" />

    <template v-else-if="name === 'Amazon'">
      <img class="brand-leaf amazon-letter" src="/assets/figma/imgVector17.svg" alt="" />
      <img class="brand-leaf amazon-smile" src="/assets/figma/imgVector19.svg" alt="" />
      <img class="brand-leaf amazon-arrow" src="/assets/figma/imgVector20.svg" alt="" />
    </template>

    <template v-else-if="name === 'Ebay'">
      <img class="brand-leaf ebay-b" src="/assets/figma/imgVector31.svg" alt="" />
      <img class="brand-leaf ebay-e" src="/assets/figma/imgVector32.svg" alt="" />
      <img class="brand-leaf ebay-a" src="/assets/figma/imgVector33.svg" alt="" />
      <img class="brand-leaf ebay-y" src="/assets/figma/imgVector34.svg" alt="" />
    </template>

    <img v-else-if="name === 'Binance'" class="brand-leaf binance-leaf" src="/assets/figma/imgGroup1.svg" alt="" />
    <img v-else class="brand-leaf fallback-leaf" :src="src" alt="" />
  </span>
</template>
