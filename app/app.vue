<script setup lang="ts">
const { locale } = useI18n()

useHead({
  htmlAttrs: { lang: computed(() => (locale.value === 'zh' ? 'zh-CN' : 'en')) },
  script: [{
    defer: true,
    src: 'https://cloud.umami.is/script.js',
    'data-website-id': 'f555f81d-f480-4b78-a3b6-ab9ac0278f2c',
    // 包 2（tor1114）：Umami 只在生产主机名 ipready.cc 上报，localhost / 局域网 / 其他主机名不发送（与线上一致）
    'data-domains': 'ipready.cc',
  }],
})
</script>

<template>
  <NuxtPage />
</template>
