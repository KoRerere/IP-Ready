<script setup lang="ts">
import type { NuxtError } from '#app'
import NuxtErrorPage from '#app/components/nuxt-error-page.vue'

const props = defineProps<{ error: NuxtError }>()
useHead({
  title: () => props.error.statusCode === 404 ? 'Page Not Found — IP Ready' : 'Error — IP Ready',
  titleTemplate: (title) => props.error.statusCode === 404 ? 'Page Not Found — IP Ready' : title || 'Error — IP Ready',
})
</script>

<template>
  <NuxtErrorPage :error="error" />
</template>
