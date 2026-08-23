<script setup lang="ts">
defineProps<{
  name: string
  src: string
}>()
</script>

<template>
  <span class="platform-brand-icon" aria-hidden="true">
    <img class="brand-leaf fallback-leaf" :src="src" alt="" />
  </span>
</template>
