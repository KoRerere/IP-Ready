<script setup lang="ts">
import type { BlogPost, BlogFilter, CoverVariant, PostStatus } from '#shared/types/blog'
import { renderMarkdown } from '#shared/utils/markdown'

const props = defineProps<{ post?: BlogPost }>()
const emit = defineEmits<{ saved: [slug: string] }>()

const title = ref(props.post?.title ?? '')
const slug = ref(props.post?.slug ?? '')
const slugTouched = ref(Boolean(props.post))
const author = ref(props.post?.author ?? 'IP Ready Team')
const category = ref<Exclude<BlogFilter, 'all'>>(props.post?.category ?? 'resources')
const status = ref<PostStatus>(props.post?.status ?? 'draft')
const cover = ref<CoverVariant>(props.post?.cover ?? 'window')
const coverImage = ref(props.post?.coverImage ?? '')
const excerpt = ref(props.post?.excerpt ?? '')
const markdown = ref(props.post?.markdown ?? '')
const date = ref(props.post?.date ?? new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }))

const isEdit = computed(() => Boolean(props.post))
const slugPreview = computed(() => slug.value || slugifyLocal(title.value))
const htmlPreview = computed(() => renderMarkdown(markdown.value))
const saving = ref(false)
const errorMessage = ref('')
const savedMessage = ref('')

function slugifyLocal(value: string): string {
  return value.toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80)
}

function onTitleInput() {
  if (!slugTouched.value) slug.value = slugifyLocal(title.value)
}

async function save() {
  saving.value = true
  errorMessage.value = ''
  savedMessage.value = ''
  try {
    const payload = {
      slug: slug.value,
      title: title.value,
      date: date.value,
      author: author.value,
      category: category.value,
      status: status.value,
      cover: cover.value,
      coverImage: coverImage.value,
      excerpt: excerpt.value,
      markdown: markdown.value,
    }
    if (isEdit.value) {
      await $fetch(`/api/admin/posts/${props.post!.slug}`, { method: 'PUT', body: payload })
    } else {
      await $fetch('/api/admin/posts', { method: 'POST', body: payload })
    }
    savedMessage.value = '已保存'
    emit('saved', slug.value)
  } catch (error) {
    const err = error as { data?: { statusMessage?: string }; message?: string }
    errorMessage.value = err.data?.statusMessage || err.message || '保存失败'
  } finally {
    saving.value = false
  }
}

defineExpose({ save })
</script>

<template>
  <div class="admin-editor">
    <div class="admin-editor-toolbar">
      <p v-if="errorMessage" class="admin-message admin-message-error">{{ errorMessage }}</p>
      <p v-else-if="savedMessage" class="admin-message admin-message-ok">{{ savedMessage }}</p>
      <span v-else />
      <button class="admin-btn admin-btn-primary" type="button" :disabled="saving" @click="save">
        {{ saving ? '保存中…' : '保存' }}
      </button>
    </div>

    <div class="admin-form">
      <div class="admin-form-main">
        <label class="admin-field">
          <span>标题</span>
          <input v-model="title" type="text" @input="onTitleInput">
        </label>

        <div class="admin-field-row">
          <label class="admin-field">
            <span>Slug</span>
            <input v-model="slug" type="text" @input="slugTouched = true">
          </label>
          <label class="admin-field">
            <span>作者</span>
            <input v-model="author" type="text">
          </label>
        </div>

        <div class="admin-field-row">
          <label class="admin-field">
            <span>分类</span>
            <select v-model="category">
              <option value="resources">资源(Resources)</option>
              <option value="changelog">更新日志(Changelog)</option>
            </select>
          </label>
          <label class="admin-field">
            <span>状态</span>
            <select v-model="status">
              <option value="draft">草稿</option>
              <option value="published">已发布</option>
            <option value="unpublished">下架</option>
            </select>
          </label>
          <label class="admin-field">
            <span>日期</span>
            <input v-model="date" type="text">
          </label>
        </div>

        <div class="admin-field-row">
          <label class="admin-field">
            <span>封面占位图案(无图时)</span>
            <select v-model="cover">
              <option value="window">Window</option>
              <option value="steps">Steps</option>
              <option value="orbit">Orbit</option>
              <option value="tiles">Tiles</option>
            </select>
          </label>
          <label class="admin-field">
            <span>封面图片路径(可选)</span>
            <input v-model="coverImage" type="text" placeholder="/landing/blog/我的封面.png">
          </label>
        </div>

        <label class="admin-field">
          <span>摘要</span>
          <textarea v-model="excerpt" rows="2" />
        </label>

        <label class="admin-field">
          <span>正文(Markdown)</span>
          <textarea v-model="markdown" rows="22" class="admin-markdown" />
        </label>
      </div>

      <aside class="admin-form-preview">
        <p class="admin-preview-label">预览 · /blog/{{ slugPreview }}</p>
        <div class="blog-article-body admin-preview-body" v-html="htmlPreview" />
      </aside>
    </div>
  </div>
</template>
