<script setup lang="ts">
useHead({ title: '新建文章 — 博客后台' })
</script>

<template>
  <AdminShell title="新建文章" subtitle="撰写并发布一篇新的博客文章">
    <template #actions>
      <span class="admin-order-saving">保存后自动加入文章列表</span>
    </template>
    <AdminPostForm @saved="(slug: string) => navigateTo(`/admin/posts/${slug}`)" />
  </AdminShell>
</template>
