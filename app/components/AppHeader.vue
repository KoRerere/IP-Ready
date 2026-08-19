<script setup lang="ts">
const menuOpen = ref(false)
</script>

<template>
  <header class="site-header" :class="{ open: menuOpen }">
    <div class="site-header-inner">
      <a class="brand" href="#top" aria-label="IP-Ready home" @click="menuOpen = false">
        <img src="/assets/figma/imgLogo.svg" alt="" />
        <span>IP-Ready</span>
      </a>
      <nav class="desktop-nav" aria-label="Primary navigation">
        <a href="#top" @click="menuOpen = false">Check Another IP</a>
        <a href="#readiness" @click="menuOpen = false">Batch Check</a>
        <a href="#information" @click="menuOpen = false">Resources</a>
        <a href="#faq" @click="menuOpen = false">Blog</a>
        <a href="#faq" @click="menuOpen = false">Partners</a>
      </nav>
      <a class="contact-link" href="mailto:hello@ip-ready.example">Contact us</a>
      <button class="menu-toggle" type="button" aria-label="Toggle navigation" :aria-expanded="menuOpen" @click="menuOpen = !menuOpen">
        <span></span><span></span>
      </button>
    </div>
  </header>
</template>
