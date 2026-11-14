<script setup lang="ts">
export interface MetricItem {
  value: string | number
  label: string
}

defineProps<{ items: MetricItem[] }>()
</script>

<template>
  <div class="metric-grid">
    <div v-for="item in items" :key="item.label">
      <strong>{{ item.value }}</strong>
      <span>{{ item.label }}</span>
    </div>
  </div>
</template>

<style scoped>
.metric-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  padding: 32px 0;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
}
.metric-grid div { display: flex; flex-direction: column; gap: 10px; }
.metric-grid strong { color: #202527; font-size: 36px; line-height: 1.2; }
.metric-grid span { color: #4f5a53; font-size: 14px; font-weight: 400; line-height: 20px; }

@media (max-width: 620px) {
  .metric-grid { grid-template-columns: repeat(2, 1fr); row-gap: 28px; }
}
</style>
