import { a as useRoute$1 } from '../virtual/entry.mjs';
import { defineComponent, mergeProps, createVNode, resolveDynamicComponent, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderAttr, ssrRenderClass, ssrRenderVNode, ssrInterpolate, ssrRenderComponent, ssrRenderSlot } from 'vue/server-renderer';
import { LayoutDashboard, FilePlus2, Globe, ExternalLink, LogOut } from 'lucide-vue-next';

//#region app/components/AdminShell.vue?vue&type=script&setup=true&lang.ts
var AdminShell_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "AdminShell",
	__ssrInlineRender: true,
	props: {
		title: {},
		subtitle: {}
	},
	setup(__props) {
		const route = useRoute$1();
		const nav = [
			{
				href: "/admin",
				label: "概览",
				icon: LayoutDashboard,
				exact: true
			},
			{
				href: "/admin/posts/new",
				label: "新建文章",
				icon: FilePlus2,
				exact: true
			},
			{
				href: "/blog",
				label: "前台博客",
				icon: Globe,
				exact: false
			}
		];
		function isActive(item) {
			return item.exact ? route.path === item.href : route.path.startsWith(item.href);
		}
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "admin-shell" }, _attrs))}><aside class="admin-side"><div class="admin-side-brand"><span class="admin-side-dot"></span><b>IP Ready</b><span class="admin-side-sub">博客后台</span></div><nav class="admin-side-nav"><!--[-->`);
			ssrRenderList(nav, (item) => {
				_push(`<a${ssrRenderAttr("href", item.href)} class="${ssrRenderClass([{ active: isActive(item) }, "admin-side-link"])}">`);
				ssrRenderVNode(_push, createVNode(resolveDynamicComponent(item.icon), { class: "admin-side-icon" }, null), _parent);
				_push(` ${ssrInterpolate(item.label)} `);
				if (item.href === "/blog") _push(ssrRenderComponent(unref(ExternalLink), { class: "admin-side-ext" }, null, _parent));
				else _push(`<!---->`);
				_push(`</a>`);
			});
			_push(`<!--]--></nav><div class="admin-side-foot"><a href="/" class="admin-side-link admin-side-home"> ← 返回官网 </a><button class="admin-side-link admin-side-logout" type="button">`);
			_push(ssrRenderComponent(unref(LogOut), { class: "admin-side-icon" }, null, _parent));
			_push(` 退出登录 </button></div></aside><div class="admin-body"><header class="admin-topbar"><div><h1 class="admin-topbar-title">${ssrInterpolate(__props.title)}</h1>`);
			if (__props.subtitle) _push(`<p class="admin-topbar-sub">${ssrInterpolate(__props.subtitle)}</p>`);
			else _push(`<!---->`);
			_push(`</div><div class="admin-topbar-actions">`);
			ssrRenderSlot(_ctx.$slots, "actions", {}, null, _push, _parent);
			_push(`</div></header><main class="admin-content">`);
			ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
			_push(`</main></div></div>`);
		};
	}
});
//#endregion
//#region app/components/AdminShell.vue
var _sfc_setup = AdminShell_vue_vue_type_script_setup_true_lang_default.setup;
AdminShell_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AdminShell.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var AdminShell_default = Object.assign(AdminShell_vue_vue_type_script_setup_true_lang_default, { __name: "AdminShell" });

export { AdminShell_default as A };
//# sourceMappingURL=AdminShell-C5e8khbI.mjs.map
