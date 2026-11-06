import { c as useI18n } from '../virtual/entry.mjs';
import { _ as _plugin_vue_export_helper_default } from './_plugin-vue_export-helper-BOaGB7Aw.mjs';
import { defineComponent, ref, reactive, mergeProps, unref, computed, watch, useSSRContext } from 'vue';
import { p as publicAssetsURL } from '../routes/renderer.mjs';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderClass, ssrRenderStyle, ssrInterpolate, ssrRenderComponent, ssrRenderList } from 'vue/server-renderer';

//#region app/components/LanguageSwitcher.vue?vue&type=script&setup=true&lang.ts
var LanguageSwitcher_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "LanguageSwitcher",
	__ssrInlineRender: true,
	setup(__props) {
		const { locale, t } = useI18n();
		const open = ref(false);
		const root = ref(null);
		const languages = [{
			code: "en",
			label: "English",
			flag: "/assets/icons/flags/US.svg"
		}, {
			code: "zh",
			label: "中文",
			flag: "/assets/icons/flags/CN.svg"
		}];
		const current = computed(() => languages.find((item) => item.code === locale.value) ?? languages[0]);
		const pill = reactive({
			y: 0,
			h: 0,
			visible: false,
			snap: false
		});
		watch(open, (value) => {
			if (!value) pill.visible = false;
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({
				ref_key: "root",
				ref: root,
				class: ["lang-switcher", { open: unref(open) }]
			}, _attrs))} data-v-657d32d9><button class="lang-toggle" type="button"${ssrRenderAttr("aria-label", unref(t)("lang.switch"))}${ssrRenderAttr("aria-expanded", unref(open))} aria-haspopup="listbox" data-v-657d32d9><img class="lang-flag"${ssrRenderAttr("src", unref(current).flag)} alt="" data-v-657d32d9><span class="lang-label" data-v-657d32d9>${ssrInterpolate(unref(current).label)}</span><svg class="lang-chevron" viewBox="0 0 10 6" aria-hidden="true" data-v-657d32d9><path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" data-v-657d32d9></path></svg></button>`);
			if (unref(open)) {
				_push(`<ul class="lang-dropdown" role="listbox"${ssrRenderAttr("aria-label", unref(t)("lang.switch"))} data-v-657d32d9><span class="${ssrRenderClass([{
					visible: unref(pill).visible,
					snap: unref(pill).snap
				}, "lang-morph-pill"])}" style="${ssrRenderStyle({
					transform: `translateY(${unref(pill).y}px)`,
					height: `${unref(pill).h}px`
				})}" aria-hidden="true" data-v-657d32d9></span><!--[-->`);
				ssrRenderList(languages, (item) => {
					_push(`<li data-v-657d32d9><button type="button" role="option"${ssrRenderAttr("aria-selected", item.code === unref(locale))} class="${ssrRenderClass({ active: item.code === unref(locale) })}" data-v-657d32d9><img class="lang-flag"${ssrRenderAttr("src", item.flag)} alt="" data-v-657d32d9><span class="lang-dropdown-label" data-v-657d32d9>${ssrInterpolate(item.label)}</span>`);
					if (item.code === unref(locale)) _push(`<span class="lang-check" data-v-657d32d9><svg viewBox="0 0 12 10" aria-hidden="true" data-v-657d32d9><path d="M1 5.2 4.4 8.6 11 1.4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" data-v-657d32d9></path></svg></span>`);
					else _push(`<!---->`);
					_push(`</button></li>`);
				});
				_push(`<!--]--></ul>`);
			} else _push(`<!---->`);
			_push(`</div>`);
		};
	}
});
//#endregion
//#region app/components/LanguageSwitcher.vue
var _sfc_setup$2 = LanguageSwitcher_vue_vue_type_script_setup_true_lang_default.setup;
LanguageSwitcher_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/LanguageSwitcher.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var LanguageSwitcher_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(LanguageSwitcher_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-657d32d9"]]), { __name: "LanguageSwitcher" });
//#endregion
//#region \0virtual:public?%2Fassets%2Ffigma%2FimgLogo.svg
var _virtual_public__2Fassets_2Ffigma_2FimgLogo_default = publicAssetsURL("/assets/figma/imgLogo.svg");
//#endregion
//#region app/components/AppHeader.vue?vue&type=script&setup=true&lang.ts
var AppHeader_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "AppHeader",
	__ssrInlineRender: true,
	setup(__props) {
		const { t } = useI18n();
		const menuOpen = ref(false);
		const morph = ref(false);
		const navPill = reactive({
			x: 0,
			w: 0,
			visible: false,
			snap: false
		});
		return (_ctx, _push, _parent, _attrs) => {
			const _component_LanguageSwitcher = LanguageSwitcher_default;
			_push(`<header${ssrRenderAttrs(mergeProps({ class: ["site-header", {
				open: unref(menuOpen),
				morph: unref(morph) && !unref(menuOpen)
			}] }, _attrs))}><div class="site-header-inner"><a class="brand" href="/#top" aria-label="IP Ready home"><img${ssrRenderAttr("src", _virtual_public__2Fassets_2Ffigma_2FimgLogo_default)} alt=""><span>IP Ready</span></a><nav class="desktop-nav" aria-label="Primary navigation"><span class="${ssrRenderClass([{
				visible: unref(navPill).visible,
				snap: unref(navPill).snap
			}, "nav-morph-pill"])}" style="${ssrRenderStyle({
				transform: `translate(${unref(navPill).x}px, -50%)`,
				width: `${unref(navPill).w}px`
			})}" aria-hidden="true"></span><a href="/check">${ssrInterpolate(unref(t)("nav.checkAnother"))}</a><a href="/batch-check">${ssrInterpolate(unref(t)("nav.batchCheck"))}</a><a href="/resources">${ssrInterpolate(unref(t)("nav.resources"))}</a><a href="/blog">${ssrInterpolate(unref(t)("nav.blog"))}</a></nav>`);
			_push(ssrRenderComponent(_component_LanguageSwitcher, null, null, _parent));
			_push(`<button class="menu-toggle" type="button" aria-label="Toggle navigation"${ssrRenderAttr("aria-expanded", unref(menuOpen))}><span></span><span></span></button></div></header>`);
		};
	}
});
//#endregion
//#region app/components/AppHeader.vue
var _sfc_setup$1 = AppHeader_vue_vue_type_script_setup_true_lang_default.setup;
AppHeader_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AppHeader.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var AppHeader_default = Object.assign(AppHeader_vue_vue_type_script_setup_true_lang_default, { __name: "AppHeader" });
//#endregion
//#region app/components/AppFooter.vue?vue&type=script&setup=true&lang.ts
var AppFooter_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "AppFooter",
	__ssrInlineRender: true,
	setup(__props) {
		const { t } = useI18n();
		ref(null);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<footer${ssrRenderAttrs(mergeProps({ class: "site-footer" }, _attrs))}><div class="site-footer-inner"><div class="footer-grid"><a class="footer-mark" href="/#top" aria-label="IP Ready home"><img${ssrRenderAttr("src", _virtual_public__2Fassets_2Ffigma_2FimgLogo_default)} alt=""><span>IP Ready</span></a><div><h3>${ssrInterpolate(unref(t)("footer.platform"))}</h3><a href="/check">${ssrInterpolate(unref(t)("nav.checkAnother"))}</a><a href="/batch-check">${ssrInterpolate(unref(t)("nav.batchCheck"))}</a><a href="/#readiness">${ssrInterpolate(unref(t)("footer.platformReadiness"))}</a></div><div><h3>${ssrInterpolate(unref(t)("footer.useCases"))}</h3><a href="/#readiness">${ssrInterpolate(unref(t)("tabs.ai"))}</a><a href="/#readiness">${ssrInterpolate(unref(t)("tabs.ecommerce"))}</a><a href="/#readiness">${ssrInterpolate(unref(t)("tabs.advertising"))}</a><a href="/#readiness">${ssrInterpolate(unref(t)("tabs.social"))}</a></div><div><h3>${ssrInterpolate(unref(t)("footer.ipIntelligence"))}</h3><a href="/#top">${ssrInterpolate(unref(t)("footer.riskScore"))}</a><a href="/#information">${ssrInterpolate(unref(t)("footer.ipInformation"))}</a><a href="/#information">${ssrInterpolate(unref(t)("footer.fraudSignals"))}</a></div><div><h3>${ssrInterpolate(unref(t)("footer.resources"))}</h3><a href="/resources">${ssrInterpolate(unref(t)("footer.resources"))}</a><a href="/blog">${ssrInterpolate(unref(t)("nav.blog"))}</a><a href="/#faq">${ssrInterpolate(unref(t)("footer.faq"))}</a></div><div aria-hidden="true"></div></div><div class="footer-bottom reveal"><span>${ssrInterpolate(unref(t)("footer.rights"))}</span><span class="systems"><i></i>${ssrInterpolate(unref(t)("footer.systems"))}</span></div><div class="footer-wordmark" aria-hidden="true"><p>IP Ready</p></div></div></footer>`);
		};
	}
});
//#endregion
//#region app/components/AppFooter.vue
var _sfc_setup = AppFooter_vue_vue_type_script_setup_true_lang_default.setup;
AppFooter_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AppFooter.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var AppFooter_default = Object.assign(AppFooter_vue_vue_type_script_setup_true_lang_default, { __name: "AppFooter" });

export { AppHeader_default as A, LanguageSwitcher_default as L, _virtual_public__2Fassets_2Ffigma_2FimgLogo_default as _, AppFooter_default as a };
//# sourceMappingURL=AppFooter-Bo_g4zYJ.mjs.map
