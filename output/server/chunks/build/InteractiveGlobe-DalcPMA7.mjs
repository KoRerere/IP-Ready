import { defineComponent, ref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs } from 'vue/server-renderer';

//#region app/components/InteractiveGlobe.vue?vue&type=script&setup=true&lang.ts
var InteractiveGlobe_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "InteractiveGlobe",
	__ssrInlineRender: true,
	props: { tint: {} },
	setup(__props) {
		const palette = {
			green: {
				base: [
					248 / 255,
					253 / 255,
					249 / 255
				],
				glow: [
					1,
					1,
					1
				],
				marker: [
					.08,
					.72,
					.28
				]
			},
			blue: {
				base: [
					206 / 255,
					226 / 255,
					250 / 255
				],
				glow: [
					.87,
					.93,
					1
				],
				marker: [
					.18,
					.49,
					.85
				]
			}
		}[__props.tint ?? "green"];
		const canvas = ref(null);
		[...palette.base], [...palette.marker], [...palette.glow];
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<canvas${ssrRenderAttrs(mergeProps({
				ref_key: "canvas",
				ref: canvas,
				class: "interactive-globe",
				"aria-label": "Interactive globe showing global network locations"
			}, _attrs))}></canvas>`);
		};
	}
});
//#endregion
//#region app/components/InteractiveGlobe.vue
var _sfc_setup = InteractiveGlobe_vue_vue_type_script_setup_true_lang_default.setup;
InteractiveGlobe_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/InteractiveGlobe.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var InteractiveGlobe_default = Object.assign(InteractiveGlobe_vue_vue_type_script_setup_true_lang_default, { __name: "InteractiveGlobe" });

export { InteractiveGlobe_default as I };
//# sourceMappingURL=InteractiveGlobe-DalcPMA7.mjs.map
