<script setup lang="ts">
import { LayoutDashboard, FilePlus2, Globe, LogOut, ExternalLink } from 'lucide-vue-next'

defineProps<{ title: string; subtitle?: string }>()

const route = useRoute()

const nav = [
  { href: '/admin', label: '概览', icon: LayoutDashboard, exact: true },
  { href: '/admin/posts/new', label: '新建文章', icon: FilePlus2, exact: true },
  { href: '/blog', label: '前台博客', icon: Globe, exact: false },
]

function isActive(item: { href: string; exact: boolean }) {
  return item.exact ? route.path === item.href : route.path.startsWith(item.href)
}

async function logout() {
  await $fetch('/api/admin/logout', { method: 'POST' })
  navigateTo('/admin')
}
</script>

<template>
  <div class="admin-shell">
    <!-- Sidebar -->
    <aside class="admin-side">
      <div class="admin-side-brand">
        <span class="admin-side-dot" />
        <b>IP Ready</b>
        <span class="admin-side-sub">博客后台</span>
      </div>

      <nav class="admin-side-nav">
        <a
          v-for="item in nav"
          :key="item.href"
          :href="item.href"
          class="admin-side-link"
          :class="{ active: isActive(item) }"
        >
          <component :is="item.icon" class="admin-side-icon" />
          {{ item.label }}
          <ExternalLink v-if="item.href === '/blog'" class="admin-side-ext" />
        </a>
      </nav>

      <div class="admin-side-foot">
        <a href="/" class="admin-side-link admin-side-home">
          ← 返回官网
        </a>
        <button class="admin-side-link admin-side-logout" type="button" @click="logout">
          <LogOut class="admin-side-icon" />
          退出登录
        </button>
      </div>
    </aside>

    <!-- Body -->
    <div class="admin-body">
      <header class="admin-topbar">
        <div>
          <h1 class="admin-topbar-title">{{ title }}</h1>
          <p v-if="subtitle" class="admin-topbar-sub">{{ subtitle }}</p>
        </div>
        <div class="admin-topbar-actions">
          <slot name="actions" />
        </div>
      </header>
      <main class="admin-content">
        <slot />
      </main>
    </div>
  </div>
</template>
