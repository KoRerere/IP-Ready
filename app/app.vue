<script setup lang="ts">
const { locale } = useI18n()

useHead({
  htmlAttrs: { lang: computed(() => (locale.value === 'zh' ? 'zh-CN' : 'en')) },
})
</script>

<template>
  <NuxtPage />
</template>
