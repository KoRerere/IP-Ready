import { c as useI18n } from '../virtual/entry.mjs';
import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderStyle, ssrRenderClass } from 'vue/server-renderer';

//#region app/components/StoryCover.vue?vue&type=script&setup=true&lang.ts
var StoryCover_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "StoryCover",
	__ssrInlineRender: true,
	props: { variant: { default: "window" } },
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({
				class: "story-cover",
				"aria-hidden": "true"
			}, _attrs))}><div class="cover-grid"><!--[-->`);
			ssrRenderList(16, (n) => {
				_push(`<span></span>`);
			});
			_push(`<!--]--></div>`);
			if (__props.variant === "window") _push(`<div class="cover-window"><div class="cover-window-left"><div class="cover-window-pane"></div></div><div class="cover-window-right"><span class="cover-line"></span><span class="cover-circle"></span><span class="cover-line cover-line-short"></span></div></div>`);
			else if (__props.variant === "steps") _push(`<div class="cover-steps"><span style="${ssrRenderStyle({ "height": "38%" })}"></span><span style="${ssrRenderStyle({ "height": "58%" })}"></span><span style="${ssrRenderStyle({ "height": "78%" })}"></span><span style="${ssrRenderStyle({ "height": "100%" })}"></span></div>`);
			else if (__props.variant === "orbit") _push(`<div class="cover-orbit"><span class="orbit-ring"></span><span class="orbit-inner"></span><span class="orbit-dot"></span><span class="orbit-moon"></span></div>`);
			else {
				_push(`<div class="cover-tiles"><!--[-->`);
				ssrRenderList(9, (n) => {
					_push(`<span class="${ssrRenderClass({ "tile-active": n === 5 })}"></span>`);
				});
				_push(`<!--]--></div>`);
			}
			_push(`</div>`);
		};
	}
});
//#endregion
//#region app/components/StoryCover.vue
var _sfc_setup = StoryCover_vue_vue_type_script_setup_true_lang_default.setup;
StoryCover_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/StoryCover.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var StoryCover_default = Object.assign(StoryCover_vue_vue_type_script_setup_true_lang_default, { __name: "StoryCover" });
//#endregion
//#region app/composables/useBlogLocale.ts
function useBlogLocale() {
	const { locale } = useI18n();
	function localizePost(post) {
		const translation = locale.value === "zh" ? post.translations?.zh : void 0;
		return translation ? {
			...post,
			...translation
		} : post;
	}
	function formatDate(date) {
		if (locale.value !== "zh") return date;
		const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
		return match ? `${match[1]}年${Number(match[2])}月${Number(match[3])}日` : date;
	}
	function formatReadTime(readTime) {
		return locale.value === "zh" ? readTime.replace(/(\d+)\s*min(?:ute)?s?\s+read/i, "$1 分钟阅读") : readTime;
	}
	return {
		localizePost,
		formatDate,
		formatReadTime
	};
}

export { StoryCover_default as S, useBlogLocale as u };
//# sourceMappingURL=useBlogLocale-9EZWATbR.mjs.map
