<script setup lang="ts">
import type { BlogPostListItem } from '#shared/types/blog'
import { FileText, Send, PencilLine, Activity, Plus } from 'lucide-vue-next'

const authenticated = ref<boolean | null>(null)
const password = ref('')
const loginError = ref('')
const loggingIn = ref(false)

const posts = ref<BlogPostListItem[]>([])
const loadingPosts = ref(false)

interface ScanRecord { ip: string; risk_score: number; country_code?: string; scanned_at: string }
interface RiskStats {
  scans: ScanRecord[]
  summary: { count: number; avg: number; low: number; medium: number; high: number }
}
const riskStats = ref<RiskStats | null>(null)

useHead({ title: '博客后台 — IP Ready' })

async function loadSession() {
  const session = await $fetch<{ authenticated: boolean }>('/api/admin/session')
  authenticated.value = session.authenticated
  if (session.authenticated) {
    void loadPosts()
    void loadRiskStats()
  }
}

async function loadPosts() {
  loadingPosts.value = true
  try {
    posts.value = await $fetch<BlogPostListItem[]>('/api/admin/posts')
  } finally {
    loadingPosts.value = false
  }
}

async function loadRiskStats() {
  riskStats.value = await $fetch<RiskStats>('/api/admin/risk-stats').catch(() => null)
}

async function login() {
  loginError.value = ''
  loggingIn.value = true
  try {
    await $fetch('/api/admin/login', { method: 'POST', body: { password: password.value } })
    authenticated.value = true
    password.value = ''
    void loadPosts()
    void loadRiskStats()
  } catch (error) {
    const err = error as { data?: { statusMessage?: string } }
    loginError.value = err.data?.statusMessage || '登录失败,密码不正确。'
  } finally {
    loggingIn.value = false
  }
}

async function removePost(slug: string) {
  if (!window.confirm(`确定删除「${slug}」?此操作不可恢复。`)) return
  await $fetch(`/api/admin/posts/${slug}`, { method: 'DELETE' })
  void loadPosts()
  void loadRiskStats()
}

/* — Stats cards — */
const stats = computed(() => {
  const published = posts.value.filter((p) => p.status === 'published').length
  const drafts = posts.value.filter((p) => p.status !== 'published').length
  return [
    { label: '总文章', value: String(posts.value.length), icon: FileText, tone: 'zinc' },
    { label: '已发布', value: String(published), icon: Send, tone: 'green' },
    { label: '草稿/下架', value: String(drafts), icon: PencilLine, tone: 'amber' },
    { label: '平均风险分', value: String(riskStats.value?.summary.avg ?? '—'), icon: Activity, tone: 'blue' },
  ]
})

/* — Risk chart (pure SVG) — */
const CHART_W = 640
const CHART_H = 170
const chartPoints = computed(() => {
  const scans = riskStats.value?.scans ?? []
  if (scans.length === 0) return ''
  if (scans.length === 1) {
    const y = CHART_H - 20 - ((scans[0]!.risk_score ?? 0) / 100) * (CHART_H - 40)
    return `${CHART_W - 20},${Math.round(y * 10) / 10}`
  }
  const stepX = (CHART_W - 40) / (scans.length - 1)
  return scans
    .map((s, i) => {
      const x = 20 + i * stepX
      const y = CHART_H - 20 - ((s.risk_score ?? 0) / 100) * (CHART_H - 40)
      return `${Math.round(x * 10) / 10},${Math.round(y * 10) / 10}`
    })
    .join(' ')
})
const chartAreaPath = computed(() => {
  const scans = riskStats.value?.scans ?? []
  if (scans.length < 2) return ''
  const stepX = (CHART_W - 40) / (scans.length - 1)
  const bottom = CHART_H - 20
  const line = scans
    .map((s, i) => {
      const x = 20 + i * stepX
      const y = CHART_H - 20 - ((s.risk_score ?? 0) / 100) * (CHART_H - 40)
      return `${Math.round(x * 10) / 10},${Math.round(y * 10) / 10}`
    })
    .join(' L')
  return `M${line} L${CHART_W - 20},${bottom} L20,${bottom} Z`
})
const chartDots = computed(() => {
  const scans = riskStats.value?.scans ?? []
  if (scans.length === 0) return []
  const stepX = scans.length === 1 ? 0 : (CHART_W - 40) / (scans.length - 1)
  return scans.map((s, i) => ({
    x: 20 + i * stepX,
    y: CHART_H - 20 - ((s.risk_score ?? 0) / 100) * (CHART_H - 40),
    level: (s.risk_score ?? 0) > 70 ? 'high' : (s.risk_score ?? 0) >= 40 ? 'medium' : 'low',
    score: s.risk_score,
    ip: s.ip,
  }))
})

/* — Data table: TanStack Table + shadcn-vue, beUI Pro data-table style — */
import { FlexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useVueTable } from '@tanstack/vue-table'
import type { ColumnDef } from '@tanstack/vue-table'
import { h } from 'vue'
import { ArrowDown, ArrowUp, ArrowUpDown, Image as ImageIcon } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import AdminStatusSelect from '~/components/AdminStatusSelect.vue'

/** 行内切换文章状态(草稿/已发布/下架),下架后可随时重新发布 */
async function updateStatus(slug: string, status: string) {
  const post = posts.value.find((p) => p.slug === slug)
  if (!post || post.status === status) return
  const prev = post.status
  post.status = status as BlogPostListItem['status'] // optimistic update
  try {
    await $fetch(`/api/admin/posts/${slug}`, { method: 'PUT', body: { status } })
  } catch {
    post.status = prev // revert on failure
  }
}

const columnDefs: ColumnDef<BlogPostListItem, any>[] = [
  {
    id: 'drag',
    header: () => '',
    cell: () => h('span', { class: 'select-none text-[13px] tracking-[-1px] text-zinc-300 cursor-grab', title: '拖动排序' }, '⋮⋮'),
    enableSorting: false,
  },
  {
    id: 'cover',
    header: () => '',
    enableSorting: false,
    cell: ({ row }) => row.original.coverImage
      ? h('img', {
          src: row.original.coverImage,
          alt: row.original.title,
          class: 'w-[72px] max-w-none rounded-md border border-zinc-200',
          loading: 'lazy',
        })
      : h('span', { class: 'grid h-12 w-[72px] place-items-center rounded-md border border-zinc-200 bg-zinc-100 text-zinc-300' }, [
          h(ImageIcon, { class: 'size-4' }),
        ]),
  },
  {
    accessorKey: 'title',
    header: sortableHeader('标题'),
    cell: ({ row }) => h('div', { class: 'min-w-0 max-w-[420px]' }, [
      h('a', {
        class: 'block truncate font-medium text-zinc-900 hover:underline underline-offset-4',
        href: `/admin/posts/${row.original.slug}`,
        title: row.original.title,
      }, row.original.title),
      h('span', {
        class: 'block truncate text-xs text-zinc-400 mt-0.5',
        title: `/blog/${row.original.slug}`,
      }, `/blog/${row.original.slug}`),
    ]),
    enableSorting: true,
  },
  {
    accessorKey: 'status',
    header: '状态',
    cell: ({ row }) => h(AdminStatusSelect, {
      status: row.original.status,
      onChange: (v: string) => updateStatus(row.original.slug, v),
    }),
    enableSorting: false,
  },
  { accessorKey: 'date', header: sortableHeader('日期'), enableSorting: true },
  { accessorKey: 'category', header: sortableHeader('分类'), enableSorting: true },
  {
    id: 'actions',
    header: () => '',
    cell: ({ row }) => h('div', { class: 'flex justify-end gap-2' }, [
      h(
        Button,
        {
          variant: 'outline',
          class: 'h-9 rounded-md border-zinc-200 bg-white px-4 text-[14px] font-medium text-zinc-900 shadow-none hover:bg-zinc-50',
          as: 'a',
          href: `/blog/${row.original.slug}`,
        },
        () => '查看',
      ),
      h(
        Button,
        {
          variant: 'outline',
          class: 'h-9 rounded-md border-0 bg-red-100 px-4 text-[14px] font-medium text-red-600 shadow-none hover:bg-red-200',
          onClick: () => removePost(row.original.slug),
        },
        () => '删除',
      ),
    ]),
  },
]

const table = useVueTable({
  get data() {
    return posts.value
  },
  columns: columnDefs,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  initialState: { pagination: { pageSize: 10 } },
})

/** Sortable header cell: label + direction icon (shadcn data-table style). */
function sortableHeader(label: string) {
  return ({ column }: { column: any }) => {
    const dir = column.getIsSorted()
    const Icon = dir === 'asc' ? ArrowUp : dir === 'desc' ? ArrowDown : ArrowUpDown
    return h(
      'button',
      {
        class: 'group inline-flex items-center gap-1.5 text-[13px] font-medium text-zinc-500 hover:text-zinc-900 transition-colors',
        onClick: column.getToggleSortingHandler(),
      },
      [label, h(Icon, { class: `size-3.5 ${dir ? 'text-zinc-900' : 'text-zinc-400 group-hover:text-zinc-600'}` })],
    )
  }
}

/** beUI Pro style numeric page list: 1 … around current … last (ellipsis on gaps). */
const visiblePages = computed<(number | '…')[]>(() => {
  const total = table.getPageCount()
  const current = table.getState().pagination.pageIndex + 1
  if (total <= 6) return Array.from({ length: total }, (_, i) => i + 1)
  const picks = new Set([1, current - 1, current, current + 1, total].filter((p) => p >= 1 && p <= total))
  const sorted = [...picks].sort((a, b) => a - b)
  const out: (number | '…')[] = []
  let prev = 0
  for (const p of sorted) {
    if (p - prev > 1) out.push('…')
    out.push(p)
    prev = p
  }
  return out
})

/** While a column sort is active, drag-to-reorder pauses (order would be ambiguous). */
const isSorted = computed(() => table.getState().sorting.length > 0)

const currentPage = computed(() => table.getState().pagination.pageIndex + 1)

const paginationRange = computed(() => {
  const { pageIndex, pageSize } = table.getState().pagination
  const total = table.getFilteredRowModel().rows.length
  if (!total) return '0 条'
  const start = pageIndex * pageSize + 1
  const end = Math.min((pageIndex + 1) * pageSize, total)
  return `第 ${start}–${end} 条 · 共 ${total} 篇`
})

/* — Drag & drop ordering — */
const dragIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)
const savingOrder = ref(false)

function onDragStart(globalIndex: number) {
  dragIndex.value = globalIndex
}

function onDragEnter(globalIndex: number) {
  if (dragIndex.value === null || globalIndex === dragIndex.value) return
  dragOverIndex.value = globalIndex
}

async function onDrop(globalIndex: number) {
  const from = dragIndex.value
  dragIndex.value = null
  dragOverIndex.value = null
  if (isSorted.value || from === null || from === globalIndex) return
  const moved = posts.value.splice(from, 1)[0]
  if (!moved) return
  posts.value.splice(globalIndex, 0, moved)
  savingOrder.value = true
  try {
    await $fetch('/api/admin/posts/order', {
      method: 'POST',
      body: { slugs: posts.value.map((p) => p.slug) },
    })
  } catch {
    // Revert to server order on failure.
    void loadPosts()
  } finally {
    savingOrder.value = false
  }
}

onMounted(() => void loadSession())
</script>

<template>
  <!-- Login (standalone, no shell) -->
  <div v-if="authenticated === false" class="admin-page">
    <form class="admin-login" @submit.prevent="login">
      <h1>登录后台</h1>
      <p class="admin-login-hint">输入管理员密码,管理你的博客文章。</p>
      <input
        v-model="password"
        type="password"
        placeholder="管理员密码"
        autocomplete="current-password"
      >
      <p v-if="loginError" class="admin-message admin-message-error">{{ loginError }}</p>
      <button class="admin-btn admin-btn-primary" type="submit" :disabled="loggingIn || !password">
        {{ loggingIn ? '登录中…' : '登录' }}
      </button>
    </form>
  </div>

  <div v-else-if="authenticated === null" class="admin-page">
    <div class="admin-loading admin-loading-center">加载中…</div>
  </div>

  <!-- Dashboard -->
  <AdminShell v-else title="概览" subtitle="管理博客内容与 IP 风险动态">
    <template #actions>
      <Button as="a" href="/admin/posts/new" class="admin-primary-btn">
        <Plus /> 新建文章
      </Button>
    </template>

    <!-- Stats row -->
    <div class="admin-stats">
      <div v-for="stat in stats" :key="stat.label" class="admin-stat-card">
        <span class="admin-stat-icon" :class="`tone-${stat.tone}`">
          <component :is="stat.icon" />
        </span>
        <div class="admin-stat-meta">
          <b>{{ stat.value }}</b>
          <span>{{ stat.label }}</span>
        </div>
      </div>
    </div>

    <!-- Risk overview -->
    <section class="admin-risk">
      <div class="admin-risk-head">
        <h2>IP 风险概览</h2>
        <span class="admin-risk-sub">最近 {{ riskStats?.scans.length ?? 0 }} 次扫描 · 共 {{ riskStats?.summary.count ?? 0 }} 条</span>
      </div>

      <div class="admin-risk-body">
        <div class="admin-risk-chips">
          <span class="admin-chip admin-chip-low"><b>{{ riskStats?.summary.low ?? 0 }}</b>低风险</span>
          <span class="admin-chip admin-chip-medium"><b>{{ riskStats?.summary.medium ?? 0 }}</b>中风险</span>
          <span class="admin-chip admin-chip-high"><b>{{ riskStats?.summary.high ?? 0 }}</b>高风险</span>
          <span class="admin-chip admin-chip-avg"><b>{{ riskStats?.summary.avg ?? 0 }}</b>平均分</span>
        </div>

        <div class="admin-risk-chart">
          <svg :viewBox="`0 0 ${CHART_W} ${CHART_H}`" preserveAspectRatio="none" role="img" aria-label="风险分走势">
            <defs>
              <linearGradient id="riskAreaFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#12b84f" stop-opacity=".22" />
                <stop offset="100%" stop-color="#12b84f" stop-opacity="0" />
              </linearGradient>
            </defs>
            <line x1="20" :y1="CHART_H - 20" :x2="CHART_W - 20" :y2="CHART_H - 20" class="risk-axis" />
            <line x1="20" y1="20" :x2="CHART_W - 20" y2="20" class="risk-axis risk-axis-dashed" />
            <path v-if="chartAreaPath" :d="chartAreaPath" fill="url(#riskAreaFill)" />
            <polyline v-if="chartPoints" :points="chartPoints" class="risk-line" />
            <circle
              v-for="(dot, i) in chartDots"
              :key="i"
              :cx="dot.x"
              :cy="dot.y"
              r="4"
              :class="`risk-dot risk-dot-${dot.level}`"
            >
              <title>{{ dot.ip }} — 风险分 {{ dot.score }}</title>
            </circle>
          </svg>
          <p v-if="!chartDots.length" class="admin-risk-empty">暂无扫描记录——访客运行 IP 检测后,图表会自动填充。</p>
        </div>
      </div>
    </section>

    <!-- Posts -->
    <div class="admin-posts-head">
      <h2>全部文章</h2>
      <span v-if="savingOrder" class="admin-order-saving">正在保存排序…</span>
      <span class="admin-drag-hint">{{ isSorted ? '按列排序中——点击排序图标取消后可恢复拖动排序。' : '拖动行即可排序——博客页面将按此顺序展示。' }}</span>
    </div>

    <div v-if="loadingPosts" class="admin-loading">文章加载中…</div>
    <p v-else-if="!posts.length" class="admin-empty">还没有文章,去创建第一篇吧。</p>

        <div v-else class="rounded-xl border border-zinc-200 bg-white overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow class="hover:bg-transparent">
                <TableHead v-for="header in table.getHeaderGroups()[0]?.headers ?? []" :key="header.id" class="h-11 px-4 first:pl-4 last:pr-4">
                  <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header" :props="header.getContext()" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <template v-if="table.getRowModel().rows.length">
                <TableRow
                  v-for="row in table.getRowModel().rows"
                  :key="row.id"
                  :draggable="!isSorted"
                  :class="{ 'opacity-40': dragIndex === row.index, 'row-drag-over': dragOverIndex === row.index && dragIndex !== row.index }"
                  @dragstart="!isSorted && onDragStart(row.index)"
                  @dragenter.prevent="!isSorted && onDragEnter(row.index)"
                  @dragover.prevent
                  @dragleave="dragOverIndex === row.index && (dragOverIndex = null)"
                  @drop.prevent="onDrop(row.index)"
                  @dragend="dragIndex = null; dragOverIndex = null"
                >
                  <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id" class="px-4 py-[18px] first:pl-4 last:pr-4">
                    <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                  </TableCell>
                </TableRow>
              </template>
              <TableRow v-else>
                <TableCell :colspan="columnDefs.length" class="h-24 text-center text-zinc-500">暂无文章。</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <!-- Pagination — @beui-pro/data-table-pagination style -->
        <div v-if="posts.length" class="flex flex-wrap items-center justify-between gap-4 mt-3 px-1">
          <p class="text-[13px] text-zinc-500">{{ paginationRange }}</p>

          <div class="flex flex-wrap items-center gap-5">
            <div class="flex items-center gap-1">
              <template v-for="(p, i) in visiblePages" :key="i">
                <span v-if="p === '…'" class="grid h-8 min-w-8 place-items-center text-[13px] text-zinc-400">…</span>
                <button
                  v-else
                  class="grid h-8 min-w-8 place-items-center rounded-lg px-2 text-[13px] font-medium tabular-nums transition-colors"
                  :class="p === currentPage ? 'bg-zinc-900 text-white' : 'text-zinc-700 hover:bg-zinc-100'"
                  type="button"
                  :aria-label="`第 ${p} 页`"
                  :aria-current="p === currentPage ? 'page' : undefined"
                  @click="table.setPageIndex(p - 1)"
                >
                  {{ p }}
                </button>
              </template>
            </div>

            <Select
              :model-value="String(table.getState().pagination.pageSize)"
              @update:model-value="(v) => table.setPageSize(Number(v))"
            >
              <SelectTrigger class="h-8 w-[92px] text-[13px] text-zinc-600 shadow-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="size in [10, 20, 30, 50]" :key="size" :value="String(size)">
                  {{ size }} 条 / 页
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
  </AdminShell>
</template>
