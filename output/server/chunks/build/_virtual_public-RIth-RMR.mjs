import { c as useI18n } from '../virtual/entry.mjs';
import { ref, computed, defineComponent, mergeProps, unref, useSSRContext } from 'vue';
import { p as publicAssetsURL } from '../routes/renderer.mjs';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderAttr, ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { TriangleAlert } from 'lucide-vue-next';
import { p as parseBrowserInfo } from '../_/ip-display.mjs';

//#region app/components/CurrentIcon.vue?vue&type=script&setup=true&lang.ts
var CurrentIcon_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "CurrentIcon",
	__ssrInlineRender: true,
	props: {
		src: {},
		label: {}
	},
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<span${ssrRenderAttrs(mergeProps({
				class: "current-icon",
				style: { "--icon": `url('${__props.src}')` },
				role: __props.label ? "img" : void 0,
				"aria-label": __props.label,
				"aria-hidden": __props.label ? void 0 : "true"
			}, _attrs))}></span>`);
		};
	}
});
//#endregion
//#region app/components/CurrentIcon.vue
var _sfc_setup$1 = CurrentIcon_vue_vue_type_script_setup_true_lang_default.setup;
CurrentIcon_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/CurrentIcon.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var CurrentIcon_default = Object.assign(CurrentIcon_vue_vue_type_script_setup_true_lang_default, { __name: "CurrentIcon" });
//#endregion
//#region app/components/PlatformReasonTooltip.vue?vue&type=script&setup=true&lang.ts
var PlatformReasonTooltip_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "PlatformReasonTooltip",
	__ssrInlineRender: true,
	props: {
		platform: {},
		readiness: {},
		countryCode: {}
	},
	setup(__props) {
		const props = __props;
		const { locale, t } = useI18n();
		const open = ref(false);
		const tapped = ref(false);
		const tooltipId = `platform-reason-${props.platform.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
		const countryName = computed(() => {
			const code = props.countryCode?.toUpperCase();
			if (!code) return t("misc.unknown");
			try {
				return new Intl.DisplayNames([locale.value === "zh" ? "zh-CN" : "en"], { type: "region" }).of(code) || code;
			} catch {
				return code;
			}
		});
		function reasonText(reason) {
			if (reason === "region-blocked") return t("platform.reason.regionBlocked", {
				platform: props.platform,
				country: countryName.value
			});
			if (reason === "region-unsupported") return t("platform.reason.regionUnsupported", {
				platform: props.platform,
				country: countryName.value
			});
			return t(`platform.reason.${reason}`);
		}
		const reasons = computed(() => props.readiness.reasons.map(reasonText));
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<span${ssrRenderAttrs(mergeProps({ class: ["platform-reason", {
				open: unref(open),
				tapped: unref(tapped)
			}] }, _attrs))}><button class="${ssrRenderClass([__props.readiness.level, "platform-reason-trigger"])}" type="button"${ssrRenderAttr("aria-label", unref(t)("platform.showReason", { platform: __props.platform }))}${ssrRenderAttr("aria-expanded", unref(open))}${ssrRenderAttr("aria-describedby", tooltipId)}>`);
			_push(ssrRenderComponent(unref(TriangleAlert), {
				size: 15,
				"stroke-width": 2.4,
				"aria-hidden": "true"
			}, null, _parent));
			_push(`</button><span${ssrRenderAttr("id", tooltipId)} class="platform-reason-tooltip" role="tooltip"><strong>${ssrInterpolate(unref(t)("platform.reasonTitle"))}</strong><!--[-->`);
			ssrRenderList(unref(reasons), (reason) => {
				_push(`<span>${ssrInterpolate(reason)}</span>`);
			});
			_push(`<!--]--></span></span>`);
		};
	}
});
//#endregion
//#region app/components/PlatformReasonTooltip.vue
var _sfc_setup = PlatformReasonTooltip_vue_vue_type_script_setup_true_lang_default.setup;
PlatformReasonTooltip_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/PlatformReasonTooltip.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var PlatformReasonTooltip_default = Object.assign(PlatformReasonTooltip_vue_vue_type_script_setup_true_lang_default, { __name: "PlatformReasonTooltip" });
//#endregion
//#region \0virtual:public?%2Fassets%2Ffigma%2FimgVector30.svg
var _virtual_public__2Fassets_2Ffigma_2FimgVector30_default = publicAssetsURL("/assets/figma/imgVector30.svg");
//#endregion
//#region app/composables/useBrowserInfo.ts
function useBrowserInfo() {
	const userAgent = ref("");
	return {
		userAgent,
		browserInfo: computed(() => parseBrowserInfo(userAgent.value))
	};
}
//#endregion
//#region \0virtual:public?%2Fassets%2Ffigma%2Ficon-location.png
var _virtual_public__2Fassets_2Ffigma_2Ficon_location_default = publicAssetsURL("/assets/figma/icon-location.png");
//#endregion
//#region \0virtual:public?%2Fassets%2Ffigma%2Ficon-time.png
var _virtual_public__2Fassets_2Ffigma_2Ficon_time_default = publicAssetsURL("/assets/figma/icon-time.png");
//#endregion
//#region \0virtual:public?%2Fassets%2Ffigma%2Ficon-browser.png
var _virtual_public__2Fassets_2Ffigma_2Ficon_browser_default = publicAssetsURL("/assets/figma/icon-browser.png");

export { CurrentIcon_default as C, PlatformReasonTooltip_default as P, _virtual_public__2Fassets_2Ffigma_2Ficon_location_default as _, _virtual_public__2Fassets_2Ffigma_2Ficon_time_default as a, _virtual_public__2Fassets_2Ffigma_2Ficon_browser_default as b, _virtual_public__2Fassets_2Ffigma_2FimgVector30_default as c, useBrowserInfo as u };
//# sourceMappingURL=_virtual_public-RIth-RMR.mjs.map
