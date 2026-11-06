import { a as useRoute$1, c as useI18n, $ as $fetch$2, d as createError$1, u as useHead$1 } from '../virtual/entry.mjs';
import { u as useAsyncData } from './asyncData-BNxZsatZ.mjs';
import { A as AppHeader_default, a as AppFooter_default } from './AppFooter-Bo_g4zYJ.mjs';
import { u as useBlogLocale, S as StoryCover_default } from './useBlogLocale-9EZWATbR.mjs';
import { defineComponent, computed, withAsyncContext, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderList } from 'vue/server-renderer';
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

//#region app/pages/blog/[slug].vue?vue&type=script&setup=true&lang.ts
var siteUrl = "https://ipready.cc";
var _slug__vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "[slug]",
	__ssrInlineRender: true,
	async setup(__props) {
		let __temp, __restore;
		const route = useRoute$1();
		const { t } = useI18n();
		const { localizePost, formatDate, formatReadTime } = useBlogLocale();
		const slug = computed(() => String(route.params.slug ?? ""));
		const { data, error } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(() => `blog-post-${slug.value}`, () => $fetch$2(`/api/posts/${slug.value}`), { watch: [slug] })), __temp = await __temp, __restore(), __temp);
		if (error.value || !data.value) throw createError$1({
			statusCode: 404,
			statusMessage: "Post not found.",
			fatal: true
		});
		const post = computed(() => localizePost(data.value.post));
		const related = computed(() => data.value.related.map(localizePost));
		function absoluteUrl(value) {
			if (/^https?:\/\//i.test(value)) return value;
			return `${siteUrl}${value.startsWith("/") ? value : `/${value}`}`;
		}
		function plainText(value) {
			return value.replace(/<[^>]+>/g, " ").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/[*_`>#]/g, "").replace(/\s+/g, " ").trim();
		}
		function extractFaqItems(source) {
			const lines = source.replace(/\r\n?/g, "\n").replace(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi, (_, level, title) => `\n${"#".repeat(Number(level))} ${title}\n`).replace(/<(?:strong|b)[^>]*>([\s\S]*?)<\/(?:strong|b)>/gi, "\n**$1**\n").replace(/<br\s*\/?>|<\/(?:p|div|li)>/gi, "\n").replace(/<[^>]+>/g, "").split("\n");
			const items = [];
			let faqDepth = 0;
			let question = "";
			let answerParts = [];
			const flush = () => {
				const answer = plainText(answerParts.join(" "));
				if (question && answer) items.push({
					question,
					answer
				});
				question = "";
				answerParts = [];
			};
			for (const line of lines) {
				const heading = /^\s*(#{1,6})\s+(.+?)\s*#*\s*$/.exec(line);
				if (heading) {
					flush();
					if (/^(?:FAQ\b|Frequently Asked Questions\b|常见问题|常見問題)/i.test(plainText(heading[2] ?? ""))) faqDepth = heading[1].length;
					else if (faqDepth && heading[1].length <= faqDepth) faqDepth = 0;
					else if (faqDepth && /[?？]$/.test(plainText(heading[2] ?? ""))) question = plainText(heading[2] ?? "");
					continue;
				}
				if (!faqDepth) continue;
				const match = /^\s*(?:\*\*|__)(.+?[?？])(?:\*\*|__)\s*(.*)$/.exec(line) || /^\s*(?:\*\*|__)?(?:Q|问|問)[:：]\s*(.+?[?？])(?:\*\*|__)?\s*(.*)$/i.exec(line);
				if (match) {
					flush();
					question = plainText(match[1] ?? "").replace(/^(?:Q|问|問)[:：]\s*/i, "");
					if (match[2]) answerParts.push(match[2]);
				} else if (question && line.trim()) answerParts.push(line.trim().replace(/^(?:A|答)[:：]\s*/i, ""));
			}
			flush();
			return items;
		}
		const articleJsonLd = computed(() => {
			const currentPost = post.value;
			const faqItems = extractFaqItems(currentPost.markdown || currentPost.body || "");
			const article = {
				"@context": "https://schema.org",
				"@type": "Article",
				headline: currentPost.title,
				datePublished: currentPost.date,
				author: {
					"@type": "Organization",
					name: "IP Ready Team"
				}
			};
			if (currentPost.coverImage) article.image = absoluteUrl(currentPost.coverImage);
			const graph = [article];
			if (faqItems.length) graph.push({
				"@context": "https://schema.org",
				"@type": "FAQPage",
				mainEntity: faqItems.map((item) => ({
					"@type": "Question",
					name: item.question,
					acceptedAnswer: {
						"@type": "Answer",
						text: item.answer
					}
				}))
			});
			return graph;
		});
		useHead$1(() => ({
			title: `${post.value.title} — IP Ready`,
			meta: [
				{
					name: "description",
					content: post.value.seoDescription || post.value.excerpt
				},
				{
					property: "og:title",
					content: post.value.title
				},
				{
					property: "og:description",
					content: post.value.seoDescription || post.value.excerpt
				},
				{
					property: "og:type",
					content: "article"
				}
			],
			script: [{
				key: "article-jsonld",
				type: "application/ld+json",
				innerHTML: JSON.stringify(articleJsonLd.value)
			}],
			link: [
				{
					rel: "canonical",
					href: `https://ipready.cc/blog/${post.value.slug}`
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
		}));
		return (_ctx, _push, _parent, _attrs) => {
			const _component_AppHeader = AppHeader_default;
			const _component_StoryCover = StoryCover_default;
			const _component_AppFooter = AppFooter_default;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "blog-page" }, _attrs))}>`);
			_push(ssrRenderComponent(_component_AppHeader, null, null, _parent));
			_push(`<main id="blog-top"><article><div class="blog-article"><a href="/blog" class="blog-back"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5"></path><path d="m12 19-7-7 7-7"></path></svg> ${ssrInterpolate(unref(t)("blog.back"))}</a><h1 class="blog-article-title">${ssrInterpolate(unref(post).title)}</h1><div class="blog-article-meta"><span>${ssrInterpolate(unref(formatDate)(unref(post).date))}</span><span aria-hidden="true">·</span><span>${ssrInterpolate(unref(formatReadTime)(unref(post).readTime))}</span><span aria-hidden="true">·</span><span>${ssrInterpolate(unref(t)("blog.by"))} ${ssrInterpolate(unref(post).author)}</span></div><span class="blog-article-cover">`);
			if (unref(post).coverImage) _push(`<img${ssrRenderAttr("src", unref(post).coverImage)}${ssrRenderAttr("alt", unref(post).title)} class="blog-article-cover-art">`);
			else _push(ssrRenderComponent(_component_StoryCover, {
				variant: unref(post).cover,
				class: "blog-article-cover-art"
			}, null, _parent));
			_push(`</span>`);
			if (unref(post).body) _push(`<div class="blog-article-body">${unref(post).body ?? ""}</div>`);
			else _push(`<div class="blog-article-body"><p>${ssrInterpolate(unref(post).excerpt)}</p></div>`);
			_push(`</div></article><section class="blog-keep-reading"><div class="blog-keep-reading-inner"><h2 class="blog-keep-reading-label">${ssrInterpolate(unref(t)("blog.keepReading"))}</h2><div class="blog-keep-reading-grid"><!--[-->`);
			ssrRenderList(unref(related), (r) => {
				_push(`<a${ssrRenderAttr("href", `/blog/${r.slug}`)} class="blog-keep-reading-card">`);
				if (r.coverImage) _push(`<img${ssrRenderAttr("src", r.coverImage)}${ssrRenderAttr("alt", r.title)} class="blog-keep-reading-cover" loading="lazy" width="600" height="400">`);
				else _push(ssrRenderComponent(_component_StoryCover, {
					variant: r.cover,
					class: "blog-keep-reading-cover"
				}, null, _parent));
				_push(`<span class="blog-keep-reading-date">${ssrInterpolate(unref(formatDate)(r.date))}</span><span class="blog-keep-reading-title">${ssrInterpolate(r.title)}</span></a>`);
			});
			_push(`<!--]--></div></div></section></main>`);
			_push(ssrRenderComponent(_component_AppFooter, null, null, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region app/pages/blog/[slug].vue
var _sfc_setup = _slug__vue_vue_type_script_setup_true_lang_default.setup;
_slug__vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/blog/[slug].vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var _slug__default = _slug__vue_vue_type_script_setup_true_lang_default;

export { _slug__default as default };
//# sourceMappingURL=_slug_-DcBDuRpJ.mjs.map
