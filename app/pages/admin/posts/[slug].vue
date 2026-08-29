<script setup lang="ts">
import type { BlogPost } from '#shared/types/blog'

const route = useRoute()
const slug = computed(() => String(route.params.slug ?? ''))

const { data: post, status } = await useAsyncData(
  () => `admin-post-${slug.value}`,
  () => $fetch<BlogPost>(`/api/admin/posts/${slug.value}`),
  { watch: [slug] },
)

useHead({ title: () => `编辑:${post.value?.title ?? slug.value} — 博客后台` })
</script>

<template>
  <AdminShell title="编辑文章" :subtitle="post?.title">
    <template #actions>
      <a v-if="post" class="admin-btn" :href="`/blog/${post.slug}`">查看公开页面</a>
    </template>
    <div v-if="status === 'pending'" class="admin-loading">加载中…</div>
    <p v-else-if="!post" class="admin-empty">文章不存在。</p>
    <AdminPostForm v-else :key="post.slug" :post="post" @saved="() => navigateTo('/admin')" />
  </AdminShell>
</template>
