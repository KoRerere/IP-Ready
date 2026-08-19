<script setup lang="ts">
defineProps<{
  src: string
  label?: string
}>()
</script>

<template>
  <span
    class="current-icon"
    :style="{ '--icon': `url('${src}')` }"
    :role="label ? 'img' : undefined"
    :aria-label="label"
    :aria-hidden="label ? undefined : 'true'"
  ></span>
</template>
