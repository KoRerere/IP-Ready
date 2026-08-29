<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'window' | 'steps' | 'orbit' | 'tiles'
  }>(),
  { variant: 'window' },
)
</script>

<template>
  <div class="story-cover" aria-hidden="true">
    <div class="cover-grid">
      <span v-for="n in 16" :key="n" />
    </div>
    <div v-if="variant === 'window'" class="cover-window">
      <div class="cover-window-left">
        <div class="cover-window-pane" />
      </div>
      <div class="cover-window-right">
        <span class="cover-line" />
        <span class="cover-circle" />
        <span class="cover-line cover-line-short" />
      </div>
    </div>
    <div v-else-if="variant === 'steps'" class="cover-steps">
      <span style="height: 38%" />
      <span style="height: 58%" />
      <span style="height: 78%" />
      <span style="height: 100%" />
    </div>
    <div v-else-if="variant === 'orbit'" class="cover-orbit">
      <span class="orbit-ring" />
      <span class="orbit-inner" />
      <span class="orbit-dot" />
      <span class="orbit-moon" />
    </div>
    <div v-else class="cover-tiles">
      <span v-for="n in 9" :key="n" :class="{ 'tile-active': n === 5 }" />
    </div>
  </div>
</template>
