import { u as useHead$1, n as navigateTo } from '../virtual/entry.mjs';
import { A as AdminShell_default } from './AdminShell-C5e8khbI.mjs';
import { A as AdminPostForm_default } from './AdminPostForm-DL20Q56v.mjs';
import { defineComponent, mergeProps, withCtx, unref, createVNode, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
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

//#region app/pages/admin/posts/new.vue?vue&type=script&setup=true&lang.ts
var new_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "new",
	__ssrInlineRender: true,
	setup(__props) {
		useHead$1({ title: "新建文章 — 博客后台" });
		return (_ctx, _push, _parent, _attrs) => {
			const _component_AdminShell = AdminShell_default;
			const _component_AdminPostForm = AdminPostForm_default;
			_push(ssrRenderComponent(_component_AdminShell, mergeProps({
				title: "新建文章",
				subtitle: "撰写并发布一篇新的博客文章"
			}, _attrs), {
				actions: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<span class="admin-order-saving"${_scopeId}>保存后自动加入文章列表</span>`);
					else return [createVNode("span", { class: "admin-order-saving" }, "保存后自动加入文章列表")];
				}),
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(_component_AdminPostForm, { onSaved: (slug) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))(`/admin/posts/${slug}`) }, null, _parent, _scopeId));
					else return [createVNode(_component_AdminPostForm, { onSaved: (slug) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))(`/admin/posts/${slug}`) }, null, 8, ["onSaved"])];
				}),
				_: 1
			}, _parent));
		};
	}
});
//#endregion
//#region app/pages/admin/posts/new.vue
var _sfc_setup = new_vue_vue_type_script_setup_true_lang_default.setup;
new_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/posts/new.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var new_default = new_vue_vue_type_script_setup_true_lang_default;

export { new_default as default };
//# sourceMappingURL=new-BBwWnQXI.mjs.map
