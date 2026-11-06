import { c as useI18n, $ as $fetch$2, u as useHead$1 } from '../virtual/entry.mjs';
import { u as useAsyncData } from './asyncData-BNxZsatZ.mjs';
import { A as AppHeader_default, a as AppFooter_default } from './AppFooter-Bo_g4zYJ.mjs';
import { u as useBlogLocale, S as StoryCover_default } from './useBlogLocale-9EZWATbR.mjs';
import { defineComponent, ref, withAsyncContext, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import 'unhead/utils';
import '../routes/renderer.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'unhead/server';
import 'unhead/legacy';
import 'unhead/plugins';
import 'nostics';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import 'vue-router';
import './_plugin-vue_export-helper-BOaGB7Aw.mjs';

//#region app/pages/blog/index.vue?vue&type=script&setup=true&lang.ts
var index_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "index",
	__ssrInlineRender: true,
	async setup(__props) {
		let __temp, __restore;
		const { t } = useI18n();
		const { localizePost, formatDate, formatReadTime } = useBlogLocale();
		const FILTERS = [
			{
				key: "all",
				label: "blog.filter.allPosts"
			},
			{
				key: "changelog",
				label: "blog.filter.changelog"
			},
			{
				key: "resources",
				label: "blog.filter.resources"
			},
			{
				key: "news",
				label: "blog.filter.news"
			}
		];
		const filter = ref("all");
		const { data: posts, status } = ([__temp, __restore] = withAsyncContext(() => useAsyncData("blog-posts", () => $fetch$2("/api/posts"), { default: () => [] })), __temp = await __temp, __restore(), __temp);
		const localizedPosts = computed(() => posts.value.map(localizePost));
		const FEATURED = computed(() => localizedPosts.value[0]);
		const featured = computed(() => FEATURED.value && filter.value === "all" ? localizedPosts.value.slice(1) : localizedPosts.value);
		const filteredPosts = computed(() => filter.value === "all" ? featured.value : localizedPosts.value.filter((post) => post.category === filter.value));
		useHead$1({
			title: () => t("blog.metaTitle"),
			meta: [
				{
					name: "description",
					content: () => t("blog.metaDescription")
				},
				{
					property: "og:title",
					content: () => t("blog.metaTitle")
				},
				{
					property: "og:description",
					content: () => t("blog.metaDescription")
				}
			],
			link: [
				{
					rel: "canonical",
					href: "https://ipready.cc/blog"
				},
				{
					rel: "preconnect",
					href: "https://fonts.googleapis.com"
				},
				{
					rel: "preconnect",
					href: "https://fonts.gstatic.com",
					crossorigin: ""
				},
				{
					rel: "stylesheet",
					href: "https://fonts.googleapis.com/css2?family=Archivo:wght@500&family=Geist:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@700&display=swap"
				}
			]
		});
		return (_ctx, _push, _parent, _attrs) => {
			const _component_AppHeader = AppHeader_default;
			const _component_StoryCover = StoryCover_default;
			const _component_AppFooter = AppFooter_default;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "blog-page" }, _attrs))}>`);
			_push(ssrRenderComponent(_component_AppHeader, null, null, _parent));
			_push(`<main id="blog-top"><section class="blog-hero"><div class="blog-hero-inner"><div class="blog-hero-copy"><p class="blog-kicker">${ssrInterpolate(unref(t)("blog.kicker"))}</p><h1 class="blog-hero-title">${ssrInterpolate(unref(t)("blog.heroTitle"))}</h1><p class="blog-hero-sub">${ssrInterpolate(unref(t)("blog.heroSub"))}</p></div>`);
			if (unref(FEATURED)) {
				_push(`<a class="blog-featured-card"${ssrRenderAttr("href", `/blog/${unref(FEATURED).slug}`)}${ssrRenderAttr("aria-label", unref(FEATURED).title)}>`);
				if (unref(FEATURED).coverImage) _push(`<img${ssrRenderAttr("src", unref(FEATURED).coverImage)}${ssrRenderAttr("alt", unref(FEATURED).title)} class="blog-featured-cover" loading="eager" fetchpriority="high" width="930" height="624">`);
				else _push(ssrRenderComponent(_component_StoryCover, {
					variant: unref(FEATURED).cover,
					class: "blog-featured-cover"
				}, null, _parent));
				_push(`</a>`);
			} else _push(`<!---->`);
			_push(`</div></section><section class="blog-stories" id="stories"><div class="blog-stories-layout"><aside class="blog-filters" role="group"${ssrRenderAttr("aria-label", unref(t)("blog.filter.label"))}><!--[-->`);
			ssrRenderList(FILTERS, (item) => {
				_push(`<button type="button"${ssrRenderAttr("aria-pressed", unref(filter) === item.key)} class="${ssrRenderClass({ active: unref(filter) === item.key })}">${ssrInterpolate(unref(t)(item.label))}</button>`);
			});
			_push(`<!--]--></aside>`);
			if (unref(status) === "pending") _push(`<div class="admin-loading">${ssrInterpolate(unref(t)("blog.loading"))}</div>`);
			else {
				_push(`<div class="blog-grid"><!--[-->`);
				ssrRenderList(unref(filteredPosts), (post, index) => {
					_push(`<article class="blog-card scroll-reveal-item"><a${ssrRenderAttr("href", `/blog/${post.slug}`)} class="blog-card-link"><span class="blog-card-media">`);
					if (post.coverImage) _push(`<img${ssrRenderAttr("src", post.coverImage)}${ssrRenderAttr("alt", post.title)} class="blog-card-cover"${ssrRenderAttr("loading", index < 2 ? "eager" : "lazy")}${ssrRenderAttr("fetchpriority", index < 2 ? "high" : "auto")} width="930" height="624">`);
					else _push(ssrRenderComponent(_component_StoryCover, {
						variant: post.cover,
						class: "blog-card-cover"
					}, null, _parent));
					_push(`</span><span class="blog-card-body"><span class="blog-card-meta">${ssrInterpolate(unref(formatDate)(post.date))} · ${ssrInterpolate(unref(formatReadTime)(post.readTime))}</span><span class="blog-card-title">${ssrInterpolate(post.title)}</span></span></a></article>`);
				});
				_push(`<!--]--></div>`);
			}
			_push(`</div></section></main>`);
			_push(ssrRenderComponent(_component_AppFooter, null, null, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region app/pages/blog/index.vue
var _sfc_setup = index_vue_vue_type_script_setup_true_lang_default.setup;
index_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/blog/index.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var blog_default = index_vue_vue_type_script_setup_true_lang_default;

export { blog_default as default };
//# sourceMappingURL=blog-D2gIckYV.mjs.map
