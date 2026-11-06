import { a as useRoute$1, b as useRequestFetch, u as useHead$1, n as navigateTo } from '../virtual/entry.mjs';
import { A as AdminShell_default } from './AdminShell-C5e8khbI.mjs';
import { A as AdminPostForm_default } from './AdminPostForm-DL20Q56v.mjs';
import { u as useAsyncData } from './asyncData-BNxZsatZ.mjs';
import { defineComponent, computed, withAsyncContext, mergeProps, unref, withCtx, openBlock, createBlock, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttr } from 'vue/server-renderer';
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
import 'lucide-vue-next';
import '../_/markdown.mjs';

//#region app/pages/admin/posts/[slug].vue?vue&type=script&setup=true&lang.ts
var _slug__vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "[slug]",
	__ssrInlineRender: true,
	async setup(__props) {
		let __temp, __restore;
		const route = useRoute$1();
		const slug = computed(() => String(route.params.slug ?? ""));
		const requestFetch = useRequestFetch();
		const { data: post, status } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(() => `admin-post-${slug.value}`, () => requestFetch(`/api/admin/posts/${slug.value}`), { watch: [slug] })), __temp = await __temp, __restore(), __temp);
		useHead$1({ title: () => `编辑:${post.value?.title ?? slug.value} — 博客后台` });
		return (_ctx, _push, _parent, _attrs) => {
			const _component_AdminShell = AdminShell_default;
			const _component_AdminPostForm = AdminPostForm_default;
			_push(ssrRenderComponent(_component_AdminShell, mergeProps({
				title: "编辑文章",
				subtitle: unref(post)?.title
			}, _attrs), {
				actions: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						if (unref(post)) _push(`<a class="admin-btn"${ssrRenderAttr("href", `/blog/${unref(post).slug}`)}${_scopeId}>查看公开页面</a>`);
						else _push(`<!---->`);
					} else return [unref(post) ? (openBlock(), createBlock("a", {
						key: 0,
						class: "admin-btn",
						href: `/blog/${unref(post).slug}`
					}, "查看公开页面", 8, ["href"])) : createCommentVNode("", true)];
				}),
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						if (unref(status) === "pending") _push(`<div class="admin-loading"${_scopeId}>加载中…</div>`);
						else if (!unref(post)) _push(`<p class="admin-empty"${_scopeId}>文章不存在。</p>`);
						else _push(ssrRenderComponent(_component_AdminPostForm, {
							key: unref(post).slug,
							post: unref(post),
							onSaved: () => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))("/admin")
						}, null, _parent, _scopeId));
					} else return [unref(status) === "pending" ? (openBlock(), createBlock("div", {
						key: 0,
						class: "admin-loading"
					}, "加载中…")) : !unref(post) ? (openBlock(), createBlock("p", {
						key: 1,
						class: "admin-empty"
					}, "文章不存在。")) : (openBlock(), createBlock(_component_AdminPostForm, {
						key: unref(post).slug,
						post: unref(post),
						onSaved: () => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))("/admin")
					}, null, 8, ["post", "onSaved"]))];
				}),
				_: 1
			}, _parent));
		};
	}
});
//#endregion
//#region app/pages/admin/posts/[slug].vue
var _sfc_setup = _slug__vue_vue_type_script_setup_true_lang_default.setup;
_slug__vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/posts/[slug].vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var _slug__default = _slug__vue_vue_type_script_setup_true_lang_default;

export { _slug__default as default };
//# sourceMappingURL=_slug_-DSd1Rt18.mjs.map
