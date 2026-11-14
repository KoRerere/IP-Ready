<script setup lang="ts">
import { landingPages } from '~/data/landing-pages'
import PlatformLandingPage from '~/components/PlatformLandingPage.vue'
const page = landingPages.ebay!
</script>
<template><PlatformLandingPage :page="page" /></template>
