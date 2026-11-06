import { c as useI18n, u as useHead$1 } from '../virtual/entry.mjs';
import { A as AppHeader_default, a as AppFooter_default } from './AppFooter-Bo_g4zYJ.mjs';
import { _ as _plugin_vue_export_helper_default } from './_plugin-vue_export-helper-BOaGB7Aw.mjs';
import { defineComponent, reactive, mergeProps, unref, useSSRContext } from 'vue';
import { p as publicAssetsURL } from '../routes/renderer.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrRenderClass, ssrRenderStyle } from 'vue/server-renderer';
import 'unhead/utils';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'vue-router';
import 'unhead/server';
import 'unhead/legacy';
import 'unhead/plugins';
import 'nostics';
import 'vue-bundle-renderer/runtime';
import 'devalue';

//#region \0virtual:public?%2Fassets%2Fgradient-green-square.mp4
var _virtual_public__2Fassets_2Fgradient_green_square_default = publicAssetsURL("/assets/gradient-green-square.mp4");
//#endregion
//#region app/pages/resources.vue?vue&type=script&setup=true&lang.ts
var resources_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "resources",
	__ssrInlineRender: true,
	setup(__props) {
		const { t } = useI18n();
		const IP_TYPES = [
			"datacenter",
			"static",
			"rotating",
			"mobile"
		];
		const TYPE_IMAGES = {
			datacenter: "/assets/resources/datacenter.jpg",
			static: "/assets/resources/static.jpg",
			rotating: "/assets/resources/rotating.jpg",
			mobile: "/assets/resources/mobile.jpg"
		};
		const GLOSSARY_KEYS = [
			"ip",
			"ipv4",
			"isp",
			"asn",
			"datacenter",
			"residential",
			"mobile",
			"cgnat",
			"proxy",
			"vpn",
			"tor",
			"dnsbl",
			"score",
			"rotation",
			"geo"
		];
		const termPill = reactive({
			x: 0,
			y: 0,
			w: 0,
			h: 0,
			visible: false,
			snap: false
		});
		useHead$1({
			title: () => t("resources.metaTitle"),
			meta: [
				{
					name: "description",
					content: () => t("resources.metaDescription")
				},
				{
					property: "og:title",
					content: () => t("resources.metaTitle")
				},
				{
					property: "og:description",
					content: () => t("resources.metaDescription")
				}
			],
			link: [
				{
					rel: "canonical",
					href: "https://ipready.cc/resources"
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
			const _component_AppFooter = AppFooter_default;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "rs-page" }, _attrs))} data-v-534923d7>`);
			_push(ssrRenderComponent(_component_AppHeader, null, null, _parent));
			_push(`<main data-v-534923d7><section class="rs-hero" data-v-534923d7><div class="rs-hero-panel" data-v-534923d7><div class="rs-hero-inner" data-v-534923d7><div class="rs-hero-copy" data-v-534923d7><p class="rs-kicker reveal" data-v-534923d7>${ssrInterpolate(unref(t)("resources.kicker"))}</p><h1 class="rs-hero-title reveal" data-v-534923d7>${ssrInterpolate(unref(t)("resources.heroTitle"))}</h1><p class="rs-hero-sub reveal" data-v-534923d7>${ssrInterpolate(unref(t)("resources.heroSub"))}</p><div class="rs-hero-actions reveal" data-v-534923d7><a class="rs-cta-button" href="/check" data-v-534923d7>${ssrInterpolate(unref(t)("resources.cta.button"))}<i aria-hidden="true" data-v-534923d7>→</i></a></div></div></div></div></section><section class="rs-types-panel" data-v-534923d7><div class="rs-inner" data-v-534923d7><h2 class="rs-title" data-v-534923d7>${ssrInterpolate(unref(t)("resources.types.title"))}</h2><p class="rs-sub" data-v-534923d7>${ssrInterpolate(unref(t)("resources.types.sub"))}</p><div class="rs-types" data-v-534923d7><!--[-->`);
			ssrRenderList(IP_TYPES, (typeKey) => {
				_push(`<article class="rs-type-card" data-v-534923d7><div class="rs-type-media" data-v-534923d7><img${ssrRenderAttr("src", TYPE_IMAGES[typeKey])}${ssrRenderAttr("alt", unref(t)(`resources.types.${typeKey}.name`))} class="rs-type-img" loading="lazy" data-v-534923d7><span class="rs-type-tag" data-v-534923d7>${ssrInterpolate(unref(t)(`resources.types.${typeKey}.tag`))}</span></div><div class="rs-type-body" data-v-534923d7><h3 data-v-534923d7>${ssrInterpolate(unref(t)(`resources.types.${typeKey}.name`))}</h3><p class="rs-type-trait" data-v-534923d7>${ssrInterpolate(unref(t)(`resources.types.${typeKey}.trait`))}</p><p class="rs-type-label" data-v-534923d7>${ssrInterpolate(unref(t)("resources.types.bestFor"))}</p><ul class="rs-type-uses" data-v-534923d7><!--[-->`);
				ssrRenderList(4, (n) => {
					_push(`<li data-v-534923d7>${ssrInterpolate(unref(t)(`resources.types.${typeKey}.use${n}`))}</li>`);
				});
				_push(`<!--]--></ul><p class="rs-type-risk" data-v-534923d7>${ssrInterpolate(unref(t)(`resources.types.${typeKey}.risk`))}</p></div></article>`);
			});
			_push(`<!--]--></div><p class="rs-types-note" data-v-534923d7>${ssrInterpolate(unref(t)("resources.types.note"))}</p></div></section><section class="rs-section" data-v-534923d7><div class="rs-inner" data-v-534923d7><h2 class="rs-title" data-v-534923d7>${ssrInterpolate(unref(t)("resources.glossary.title"))}</h2><p class="rs-sub" data-v-534923d7>${ssrInterpolate(unref(t)("resources.glossary.sub"))}</p><div class="rs-glossary-wrap" data-v-534923d7><span class="${ssrRenderClass([{
				visible: unref(termPill).visible,
				snap: unref(termPill).snap
			}, "rs-term-pill"])}" style="${ssrRenderStyle({
				transform: `translate(${unref(termPill).x}px, ${unref(termPill).y}px)`,
				width: `${unref(termPill).w}px`,
				height: `${unref(termPill).h}px`
			})}" aria-hidden="true" data-v-534923d7></span><dl class="rs-glossary" data-v-534923d7><!--[-->`);
			ssrRenderList(GLOSSARY_KEYS, (termKey) => {
				_push(`<div class="rs-term" data-v-534923d7><dt data-v-534923d7>${ssrInterpolate(unref(t)(`resources.glossary.${termKey}.term`))}</dt><dd data-v-534923d7>${ssrInterpolate(unref(t)(`resources.glossary.${termKey}.def`))}</dd></div>`);
			});
			_push(`<!--]--></dl></div></div></section><section class="rs-section rs-section-last" data-v-534923d7><div class="rs-inner" data-v-534923d7><div class="rs-cta reveal-fade" data-v-534923d7><div class="rs-cta-motion" aria-hidden="true" data-v-534923d7><video autoplay loop muted playsinline preload="metadata"${ssrRenderAttr("src", _virtual_public__2Fassets_2Fgradient_green_square_default)} data-v-534923d7></video><div class="rs-cta-wash" data-v-534923d7></div></div><div class="rs-cta-inner" data-v-534923d7><div class="rs-cta-copy reveal" data-v-534923d7><h2 class="rs-cta-title" data-v-534923d7>${ssrInterpolate(unref(t)("resources.cta.title"))}</h2><p class="rs-cta-sub" data-v-534923d7>${ssrInterpolate(unref(t)("resources.cta.sub"))}</p><div class="rs-cta-actions" data-v-534923d7><a class="rs-cta-btn rs-cta-btn-primary" href="/check" data-v-534923d7>${ssrInterpolate(unref(t)("resources.cta.button"))}<i aria-hidden="true" data-v-534923d7>→</i></a><a class="rs-cta-btn rs-cta-btn-ghost" href="/batch-check" data-v-534923d7>${ssrInterpolate(unref(t)("resources.tools.batch.cta"))}</a></div></div><div class="rs-cta-col reveal" data-v-534923d7><h3 data-v-534923d7>${ssrInterpolate(unref(t)("resources.tools.check.title"))}</h3><p data-v-534923d7>${ssrInterpolate(unref(t)("resources.tools.check.desc"))}</p><a class="rs-cta-link" href="/check" data-v-534923d7>${ssrInterpolate(unref(t)("resources.tools.check.cta"))}<i aria-hidden="true" data-v-534923d7>→</i></a></div><div class="rs-cta-col reveal" data-v-534923d7><h3 data-v-534923d7>${ssrInterpolate(unref(t)("resources.tools.batch.title"))}</h3><p data-v-534923d7>${ssrInterpolate(unref(t)("resources.tools.batch.desc"))}</p><a class="rs-cta-link" href="/batch-check" data-v-534923d7>${ssrInterpolate(unref(t)("resources.tools.batch.cta"))}<i aria-hidden="true" data-v-534923d7>→</i></a></div></div></div></div></section></main>`);
			_push(ssrRenderComponent(_component_AppFooter, null, null, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region app/pages/resources.vue
var _sfc_setup = resources_vue_vue_type_script_setup_true_lang_default.setup;
resources_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/resources.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var resources_default = /*#__PURE__*/ _plugin_vue_export_helper_default(resources_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-534923d7"]]);

export { resources_default as default };
//# sourceMappingURL=resources-CkDo594k.mjs.map
