import { c as useI18n, a as useRoute$1, j as useRouter, u as useHead$1 } from '../virtual/entry.mjs';
import { A as AppHeader_default, _ as _virtual_public__2Fassets_2Ffigma_2FimgLogo_default, a as AppFooter_default } from './AppFooter-Bo_g4zYJ.mjs';
import { _ as _plugin_vue_export_helper_default } from './_plugin-vue_export-helper-BOaGB7Aw.mjs';
import { I as InteractiveGlobe_default } from './InteractiveGlobe-DalcPMA7.mjs';
import { E as EVALUATED_PLATFORMS, c as computePlatformReadiness, P as PlatformBrandIcon_default } from '../_/platform-readiness.mjs';
import { u as useRotatingPlaceholder } from './useRotatingPlaceholder-hZeAfRvN.mjs';
import { u as useBrowserInfo, C as CurrentIcon_default, _ as _virtual_public__2Fassets_2Ffigma_2Ficon_location_default, a as _virtual_public__2Fassets_2Ffigma_2Ficon_time_default, b as _virtual_public__2Fassets_2Ffigma_2Ficon_browser_default, P as PlatformReasonTooltip_default, c as _virtual_public__2Fassets_2Ffigma_2FimgVector30_default } from './_virtual_public-RIth-RMR.mjs';
import { defineComponent, ref, computed, watch, unref, reactive, mergeProps, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderClass, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderList, ssrRenderAttrs, ssrRenderStyle } from 'vue/server-renderer';
import { a as analysisFor, i as isSuspectedExit, n as networkTypeLabel, s as safetyScoreFor, b as riskLevelForSafetyScore, f as formatRiskScore } from '../_/ip-display.mjs';
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

//#region app/components/PlatformCompatibilitySection.vue?vue&type=script&setup=true&lang.ts
var PlatformCompatibilitySection_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "PlatformCompatibilitySection",
	__ssrInlineRender: true,
	props: { scan: {} },
	setup(__props) {
		const props = __props;
		const { t } = useI18n();
		const activeFilter = ref("all");
		const platformHasSwapped = ref(false);
		const animatedPlatformScores = ref([]);
		ref(null);
		const tabsPill = reactive({
			x: 0,
			y: 0,
			w: 0,
			ready: false,
			snap: false
		});
		const platformPill = reactive({
			x: 0,
			y: 0,
			w: 0,
			h: 0,
			visible: false,
			snap: false
		});
		const platformGroups = {
			all: [...EVALUATED_PLATFORMS],
			ai: EVALUATED_PLATFORMS.filter((platform) => platform.category === "ai"),
			ecommerce: EVALUATED_PLATFORMS.filter((platform) => platform.category === "ecommerce"),
			advertising: [],
			social: []
		};
		const readinessContext = computed(() => ({
			country_code: props.scan?.country_code,
			proxy: props.scan?.proxy,
			vpn: props.scan?.vpn,
			tor: props.scan?.tor,
			anonymous: props.scan?.anonymous,
			icloud_relay: props.scan?.icloud_relay,
			hosting: props.scan?.hosting,
			recent_abuse: props.scan?.recent_abuse
		}));
		const displayedPlatforms = computed(() => platformGroups[activeFilter.value].map((platform) => ({
			...platform,
			readiness: props.scan ? computePlatformReadiness(platform.name, readinessContext.value) : void 0
		})));
		function readinessCaption(platform) {
			const level = platform.readiness?.level;
			if (!level) return t("report.checkingSignals");
			return t(level === "ready" ? "platform.applicable" : level === "caution" ? "platform.caution" : "platform.notApplicable");
		}
		function preparePlatformScores() {
			animatedPlatformScores.value = displayedPlatforms.value.map(() => 0);
		}
		watch(() => props.scan, () => {
			preparePlatformScores();
		});
		return (_ctx, _push, _parent, _attrs) => {
			const _component_PlatformBrandIcon = PlatformBrandIcon_default;
			const _component_CurrentIcon = CurrentIcon_default;
			const _component_PlatformReasonTooltip = PlatformReasonTooltip_default;
			_push(`<section${ssrRenderAttrs(mergeProps({
				class: "readiness check-readiness",
				"aria-labelledby": "check-readiness-title"
			}, _attrs))}><div class="readiness-inner"><div class="section-head"><h2 id="check-readiness-title">${ssrInterpolate(unref(t)("readiness.title"))}</h2><p>${ssrInterpolate(unref(t)("readiness.subtitle"))}</p>`);
			if (__props.scan?.ip) _push(`<p class="readiness-target">${ssrInterpolate(unref(t)("platform.assessingIp", { ip: __props.scan.ip }))}</p>`);
			else _push(`<!---->`);
			_push(`<div class="tabs" role="tablist"${ssrRenderAttr("aria-label", unref(t)("platform.categories"))}><span class="${ssrRenderClass([{
				ready: unref(tabsPill).ready,
				snap: unref(tabsPill).snap
			}, "tabs-morph-pill"])}" style="${ssrRenderStyle({
				transform: `translate(${unref(tabsPill).x}px, ${unref(tabsPill).y}px)`,
				width: `${unref(tabsPill).w}px`
			})}" aria-hidden="true"></span><!--[-->`);
			ssrRenderList([
				"all",
				"ai",
				"ecommerce",
				"advertising",
				"social"
			], (filter) => {
				_push(`<button class="${ssrRenderClass({ active: unref(activeFilter) === filter })}" type="button" role="tab"${ssrRenderAttr("aria-selected", unref(activeFilter) === filter)}>${ssrInterpolate(unref(t)(`tabs.${filter}`))}</button>`);
			});
			_push(`<!--]--></div></div><div class="${ssrRenderClass([{ "is-swapped": unref(platformHasSwapped) }, "platform-grid"])}"><span class="${ssrRenderClass([{
				visible: unref(platformPill).visible,
				snap: unref(platformPill).snap
			}, "platform-morph-pill"])}" style="${ssrRenderStyle({
				transform: `translate(${unref(platformPill).x}px, ${unref(platformPill).y}px)`,
				width: `${unref(platformPill).w}px`,
				height: `${unref(platformPill).h}px`
			})}" aria-hidden="true"></span>`);
			if (!unref(displayedPlatforms).length) _push(`<p class="platform-empty">${ssrInterpolate(unref(t)("platform.emptyCategory"))}</p>`);
			else _push(`<!---->`);
			_push(`<!--[-->`);
			ssrRenderList(unref(displayedPlatforms), (platform, index) => {
				_push(`<!--[--><article class="platform-card" style="${ssrRenderStyle({ "--platform-index": index })}"><div class="platform-name"><span>`);
				_push(ssrRenderComponent(_component_PlatformBrandIcon, {
					name: platform.name,
					src: platform.icon
				}, null, _parent));
				_push(`${ssrInterpolate(platform.name)}</span>`);
				if (platform.readiness?.level === "ready") _push(ssrRenderComponent(_component_CurrentIcon, {
					class: "check-icon",
					src: "/assets/figma/imgVector2.svg",
					label: unref(t)("platform.ready")
				}, null, _parent));
				else if (platform.readiness) _push(ssrRenderComponent(_component_PlatformReasonTooltip, {
					platform: platform.name,
					readiness: platform.readiness,
					"country-code": __props.scan?.country_code
				}, null, _parent));
				else _push(`<!---->`);
				_push(`</div><div class="platform-info"><div class="platform-score-block${platform.readiness ? ` level-${platform.readiness.level}` : ""}"><div class="platform-score"${ssrRenderAttr("aria-label", `${platform.readiness?.score ?? 0} out of 100`)}><b aria-hidden="true">${ssrInterpolate(__props.scan ? unref(animatedPlatformScores)[index] ?? platform.readiness?.score ?? 0 : "--")}</b><span aria-hidden="true">/100</span></div><div class="meter"><i style="${ssrRenderStyle({ "--score": `${platform.readiness?.score ?? 0}%` })}"></i></div></div><p>${ssrInterpolate(readinessCaption(platform))}</p></div></article>`);
				if (index < unref(displayedPlatforms).length - 1) _push(`<img class="platform-divider"${ssrRenderAttr("src", _virtual_public__2Fassets_2Ffigma_2FimgVector30_default)} alt="" aria-hidden="true">`);
				else _push(`<!---->`);
				_push(`<!--]-->`);
			});
			_push(`<!--]--></div><div class="metric-grid"><div><strong>12</strong><span>${ssrInterpolate(unref(t)("metrics.signals"))}</span></div><div><strong>${ssrInterpolate(unref(t)("metrics.live"))}</strong><span>${ssrInterpolate(unref(t)("metrics.iplocate"))}</span></div><div><strong>${ssrInterpolate(unref(EVALUATED_PLATFORMS).length)}</strong><span>${ssrInterpolate(unref(t)("metrics.platforms"))}</span></div><div><strong>1</strong><span>${ssrInterpolate(unref(t)("metrics.aiPass"))}</span></div></div></div></section>`);
		};
	}
});
//#endregion
//#region app/components/PlatformCompatibilitySection.vue
var _sfc_setup$1 = PlatformCompatibilitySection_vue_vue_type_script_setup_true_lang_default.setup;
PlatformCompatibilitySection_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/PlatformCompatibilitySection.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var PlatformCompatibilitySection_default = Object.assign(PlatformCompatibilitySection_vue_vue_type_script_setup_true_lang_default, { __name: "PlatformCompatibilitySection" });
//#endregion
//#region app/pages/check.vue?vue&type=script&setup=true&lang.ts
var check_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "check",
	__ssrInlineRender: true,
	setup(__props) {
		const { locale, t } = useI18n();
		const route = useRoute$1();
		useRouter();
		const ipInput = ref(typeof route.query.ip === "string" ? route.query.ip : "");
		const scan = ref(null);
		const scanPending = ref(false);
		const scanError = ref("");
		const copied = ref(false);
		const copyToastMessage = ref("misc.copied");
		const { userAgent, browserInfo } = useBrowserInfo();
		const analysis = computed(() => scan.value ? analysisFor(scan.value, t) : null);
		const suspectedExit = computed(() => scan.value ? isSuspectedExit(scan.value) : false);
		const networkType = computed(() => networkTypeLabel(scan.value?.connection_type, t, scan.value?.hosting));
		const currentTime = ref(/* @__PURE__ */ new Date());
		const placeholderText = useRotatingPlaceholder([
			"check.placeholder",
			"check.phrase2",
			"check.phrase3"
		]);
		const checkingVisitor = ref(!route.query.ip);
		const errorKey = ref("");
		watch(locale, () => {
			if (errorKey.value) scanError.value = t(errorKey.value);
		});
		const riskScore = computed(() => scan.value?.risk_score ?? 0);
		const safetyScore = computed(() => safetyScoreFor(riskScore.value));
		const riskLevel = computed(() => riskLevelForSafetyScore(safetyScore.value));
		const riskLabel = computed(() => riskLevel.value === "high" ? t("risk.high") : riskLevel.value === "medium" ? t("risk.medium") : t("risk.low"));
		const countryName = computed(() => {
			const code = scan.value?.country_code;
			if (!code) return t("report.detectingLocation");
			return new Intl.DisplayNames([locale.value === "zh" ? "zh-CN" : "en"], { type: "region" }).of(code) || code;
		});
		const countryFlag = computed(() => {
			const code = scan.value?.country_code?.toUpperCase();
			return code?.length === 2 ? `/assets/icons/flags/${code}.svg` : "";
		});
		const coordinates = computed(() => {
			if (scan.value?.latitude == null || scan.value?.longitude == null) return t("misc.na");
			return `${scan.value.latitude}, ${scan.value.longitude}`;
		});
		const localTime = computed(() => {
			if (!scan.value?.timezone) return t("misc.na");
			try {
				return (/* @__PURE__ */ new Date()).toLocaleString(locale.value === "zh" ? "zh-CN" : "en-US", {
					dateStyle: "full",
					timeStyle: "long",
					timeZone: scan.value.timezone
				});
			} catch {
				return t("misc.na");
			}
		});
		const readinessContext = computed(() => ({
			country_code: scan.value?.country_code,
			proxy: scan.value?.proxy,
			vpn: scan.value?.vpn,
			tor: scan.value?.tor,
			anonymous: scan.value?.anonymous,
			icloud_relay: scan.value?.icloud_relay,
			hosting: scan.value?.hosting,
			recent_abuse: scan.value?.recent_abuse
		}));
		function quickReadFor(name) {
			if (!scan.value) return "--";
			return computePlatformReadiness(name, readinessContext.value)?.level === "ready" ? t("report.good") : t("report.poor");
		}
		const analysisEmoji = computed(() => {
			if (!scan.value) return "";
			if (suspectedExit.value) return "⚠️";
			return riskScore.value <= 30 ? "👍" : "⚠️";
		});
		const sampleIps = [
			{
				ip: "17.253.144.10",
				code: "US"
			},
			{
				ip: "110.242.68.66",
				code: "CN"
			},
			{
				ip: "210.140.92.187",
				code: "JP"
			},
			{
				ip: "212.58.246.79",
				code: "GB"
			}
		];
		const supportedServices = [
			{
				name: "AliExpress",
				src: "/assets/figma/imgAliexpress.svg"
			},
			{
				name: "Shopify",
				src: "/assets/figma/imgShopify.svg"
			},
			{
				name: "eBay",
				src: "/assets/figma/imgEbay.svg"
			},
			{
				name: "Facebook",
				src: "/assets/figma/imgFacebook.svg"
			},
			{
				name: "Etsy",
				src: "/assets/figma/imgEtsy.svg"
			},
			{
				name: "Amazon",
				src: "/assets/figma/imgAmazon.svg"
			},
			{
				name: "Netflix",
				src: "/assets/figma/imgNetflix.svg"
			},
			{
				name: "TikTok",
				src: "/assets/figma/imgTiktok.svg"
			},
			{
				name: "YouTube",
				src: "/assets/figma/imgYoutube.svg"
			},
			{
				name: "Temu",
				src: "/assets/figma/imgTemu.svg"
			},
			{
				name: "Best Buy",
				src: "/assets/figma/imgBestuy.svg"
			},
			{
				name: "Shopee",
				src: "/assets/figma/imgShopee.svg"
			}
		];
		function sampleCountry(code) {
			if (locale.value !== "zh") return code;
			try {
				return new Intl.DisplayNames(["zh-CN"], { type: "region" }).of(code) || code;
			} catch {
				return code;
			}
		}
		useHead$1({
			title: () => t("check.metaTitle"),
			meta: [
				{
					name: "description",
					content: () => t("check.metaDescription")
				},
				{
					property: "og:title",
					content: () => t("check.metaTitle")
				},
				{
					property: "og:description",
					content: () => t("check.metaDescription")
				}
			],
			link: [
				{
					rel: "canonical",
					href: "https://ipready.cc/check"
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
		function hasScanValue(value) {
			return value !== void 0 && value !== null && value !== "";
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_AppHeader = AppHeader_default;
			const _component_InteractiveGlobe = InteractiveGlobe_default;
			const _component_CurrentIcon = CurrentIcon_default;
			const _component_PlatformCompatibilitySection = PlatformCompatibilitySection_default;
			const _component_AppFooter = AppFooter_default;
			_push(`<!--[-->`);
			_push(ssrRenderComponent(_component_AppHeader, null, null, _parent));
			_push(`<main data-v-e5c53ac1><section class="${ssrRenderClass([{ "has-result": unref(scan) }, "hero-shell check-shell"])}" data-v-e5c53ac1><div class="hero-motion check-hero-motion" aria-hidden="true" data-v-e5c53ac1><span class="motion-blob motion-blob-blue" data-v-e5c53ac1></span><span class="motion-blob motion-blob-cyan" data-v-e5c53ac1></span><div class="hero-motion-wash check-motion-wash" data-v-e5c53ac1></div></div><div class="hero-copy" data-v-e5c53ac1><p class="gradient-label" data-v-e5c53ac1>${ssrInterpolate(unref(t)("check.label"))}</p><h1 data-v-e5c53ac1>${ssrInterpolate(unref(t)("check.title"))}</h1><p class="hero-subtitle" data-v-e5c53ac1>${ssrInterpolate(unref(t)("check.subtitle"))}</p><form class="check-form" data-v-e5c53ac1><input${ssrRenderAttr("value", unref(ipInput))} class="check-input" type="text" inputmode="text" autocomplete="off" spellcheck="false"${ssrRenderAttr("placeholder", unref(placeholderText))}${ssrRenderAttr("aria-label", unref(t)("check.placeholder"))} data-v-e5c53ac1><button class="check-submit" type="submit"${ssrIncludeBooleanAttr(unref(scanPending)) ? " disabled" : ""} data-v-e5c53ac1>${ssrInterpolate(unref(scanPending) ? unref(t)("report.scanning") : unref(t)("check.submit"))}</button></form>`);
			if (unref(scanError)) _push(`<p class="check-error" role="alert" data-v-e5c53ac1>${ssrInterpolate(unref(scanError))}</p>`);
			else _push(`<!---->`);
			_push(`<div class="check-examples" data-v-e5c53ac1><span class="check-examples-label" data-v-e5c53ac1>${ssrInterpolate(unref(t)("check.try"))}</span><div class="chip-marquee" data-v-e5c53ac1><div class="chip-track" data-v-e5c53ac1><div class="chip-set" data-v-e5c53ac1><!--[-->`);
			ssrRenderList(sampleIps, (sample) => {
				_push(`<button type="button" class="check-example-chip" data-v-e5c53ac1><img class="check-example-flag"${ssrRenderAttr("src", `/assets/icons/flags/${sample.code}.svg`)} alt="" data-v-e5c53ac1><b data-v-e5c53ac1>${ssrInterpolate(sampleCountry(sample.code))}</b><span class="check-example-ip" data-v-e5c53ac1>${ssrInterpolate(sample.ip)}</span></button>`);
			});
			_push(`<!--]--></div><div class="chip-set" aria-hidden="true" data-v-e5c53ac1><!--[-->`);
			ssrRenderList(sampleIps, (sample) => {
				_push(`<button type="button" tabindex="-1" class="check-example-chip" data-v-e5c53ac1><img class="check-example-flag"${ssrRenderAttr("src", `/assets/icons/flags/${sample.code}.svg`)} alt="" data-v-e5c53ac1><b data-v-e5c53ac1>${ssrInterpolate(sampleCountry(sample.code))}</b><span class="check-example-ip" data-v-e5c53ac1>${ssrInterpolate(sample.ip)}</span></button>`);
			});
			_push(`<!--]--></div></div></div></div></div><article class="ip-report" data-v-e5c53ac1><div class="report-frame" data-v-e5c53ac1><div class="report-main" data-v-e5c53ac1><div class="report-map" data-v-e5c53ac1>`);
			_push(ssrRenderComponent(_component_InteractiveGlobe, { tint: "blue" }, null, _parent));
			_push(`</div><div class="ip-heading" data-v-e5c53ac1><p class="overline" data-v-e5c53ac1>${ssrInterpolate(unref(t)(unref(checkingVisitor) ? "report.yourIp" : "report.queriedIp"))}</p><div class="ip-line" data-v-e5c53ac1><strong data-v-e5c53ac1>${ssrInterpolate(unref(scan)?.ip || (unref(scanPending) ? unref(t)("report.detecting") : unref(t)("report.unavailable")))}</strong><button class="icon-button copy-ip" type="button"${ssrRenderAttr("title", unref(t)("report.copyIp"))}${ssrRenderAttr("aria-label", unref(t)("report.copyIp"))}${ssrIncludeBooleanAttr(!unref(scan)?.ip) ? " disabled" : ""} data-v-e5c53ac1>`);
			_push(ssrRenderComponent(_component_CurrentIcon, {
				class: "copy-icon",
				src: "/assets/figma/imgVector7.svg"
			}, null, _parent));
			_push(`</button></div><div class="country-line" data-v-e5c53ac1>`);
			if (unref(countryFlag)) _push(`<img class="country-flag-icon"${ssrRenderAttr("src", unref(countryFlag))} alt="" data-v-e5c53ac1>`);
			else _push(`<!---->`);
			_push(`<b data-v-e5c53ac1>${ssrInterpolate(`${unref(countryName)}${unref(scan)?.city ? ` / ${unref(scan).city}` : ""}`)}</b></div></div><div class="ip-facts" data-v-e5c53ac1><div data-v-e5c53ac1><b data-v-e5c53ac1>${ssrInterpolate(unref(scan)?.ISP || unref(t)("report.detecting"))}</b><span data-v-e5c53ac1>${ssrInterpolate(unref(t)("report.isp"))}</span></div><div data-v-e5c53ac1><b data-v-e5c53ac1>${ssrInterpolate(unref(networkType))}</b><span data-v-e5c53ac1>${ssrInterpolate(unref(t)("report.networkType"))}</span></div><div data-v-e5c53ac1><b data-v-e5c53ac1>${ssrInterpolate(unref(scan)?.timezone || unref(t)("misc.unknown"))}</b><span data-v-e5c53ac1>${ssrInterpolate(unref(t)("report.timezone"))}</span></div><div data-v-e5c53ac1><b data-v-e5c53ac1>${ssrInterpolate(unref(coordinates))}</b><span data-v-e5c53ac1>${ssrInterpolate(unref(t)("report.location"))}</span></div></div><div class="analysis-block" data-v-e5c53ac1><div class="analysis-title" data-v-e5c53ac1><span class="ai-logo" data-v-e5c53ac1><img${ssrRenderAttr("src", _virtual_public__2Fassets_2Ffigma_2FimgLogo_default)} alt="" data-v-e5c53ac1></span><b data-v-e5c53ac1>${ssrInterpolate(unref(t)("report.aiAnalysis"))}</b></div><h2 data-v-e5c53ac1>`);
			if (unref(analysisEmoji)) _push(`<span aria-hidden="true" data-v-e5c53ac1>${ssrInterpolate(unref(analysisEmoji))}</span>`);
			else _push(`<!---->`);
			_push(` ${ssrInterpolate(unref(analysis)?.title || unref(t)("report.analyzing"))}</h2><p data-v-e5c53ac1>${ssrInterpolate(unref(analysis)?.summary || unref(t)("report.checkingSignals"))}</p><p data-v-e5c53ac1><b data-v-e5c53ac1>${ssrInterpolate(unref(t)("report.mainConcern"))}</b>${ssrInterpolate(" " + (unref(analysis)?.concern || unref(t)("report.analysisPending")))}</p><div class="analysis-checks" data-v-e5c53ac1><span data-v-e5c53ac1>`);
			_push(ssrRenderComponent(_component_CurrentIcon, {
				class: "analysis-check-icon",
				src: "/assets/figma/imgVector3.svg"
			}, null, _parent));
			_push(`${ssrInterpolate(unref(scan) ? unref(networkType) : unref(t)("report.networkPending"))}</span><span data-v-e5c53ac1>`);
			_push(ssrRenderComponent(_component_CurrentIcon, {
				class: "analysis-check-icon",
				src: "/assets/figma/imgVector3.svg"
			}, null, _parent));
			_push(`${ssrInterpolate(unref(scan)?.city ? unref(t)("report.locationAvailable") : unref(t)("report.locationLimited"))}</span><span data-v-e5c53ac1>`);
			_push(ssrRenderComponent(_component_CurrentIcon, {
				class: "analysis-check-icon",
				src: "/assets/figma/imgVector3.svg"
			}, null, _parent));
			_push(`${ssrInterpolate(unref(t)("report.iplocateChecked"))}</span></div></div></div><aside class="score-panel" data-v-e5c53ac1><p class="score-label" data-v-e5c53ac1>${ssrInterpolate(unref(t)("report.score"))}</p><div class="score-value" data-v-e5c53ac1><span class="score-number" data-v-e5c53ac1><strong class="${ssrRenderClass(unref(scan) ? `risk-number-${unref(riskLevel)}` : "")}" data-v-e5c53ac1>${ssrInterpolate(unref(scan) ? unref(formatRiskScore)(unref(safetyScore)) : "--")}</strong><span data-v-e5c53ac1>/100</span></span><em class="${ssrRenderClass(unref(scan) ? `risk-${unref(riskLevel)}` : "")}" data-v-e5c53ac1>${ssrInterpolate(unref(scan) ? unref(riskLabel) : unref(t)("report.scanning"))}</em></div><div class="score-divider" data-v-e5c53ac1></div><p class="platform-label" data-v-e5c53ac1>${ssrInterpolate(unref(t)("report.quickRead"))}</p><div class="quick-platforms" data-v-e5c53ac1><!--[-->`);
			ssrRenderList(unref(EVALUATED_PLATFORMS), (platform) => {
				_push(`<div data-v-e5c53ac1><span data-v-e5c53ac1><span class="quick-icon" data-v-e5c53ac1><img class="simple-glyph"${ssrRenderAttr("src", platform.icon)} alt="" data-v-e5c53ac1></span>${ssrInterpolate(platform.name)}</span><b data-v-e5c53ac1>${ssrInterpolate(quickReadFor(platform.name))}</b></div>`);
			});
			_push(`<!--]--></div><a class="platform-link" href="/#readiness" data-v-e5c53ac1>${ssrInterpolate(unref(t)("report.otherPlatforms"))} `);
			_push(ssrRenderComponent(_component_CurrentIcon, {
				class: "platform-arrow-icon",
				src: "/assets/figma/imgVector29.svg"
			}, null, _parent));
			_push(`</a></aside></div></article></section><section class="logo-rail"${ssrRenderAttr("aria-label", unref(t)("report.popularPlatforms"))} data-v-e5c53ac1><div class="logo-track" data-v-e5c53ac1><div class="logo-set" data-v-e5c53ac1><!--[-->`);
			ssrRenderList(supportedServices, (service) => {
				_push(`<img${ssrRenderAttr("src", service.src)}${ssrRenderAttr("alt", service.name)} data-v-e5c53ac1>`);
			});
			_push(`<!--]--></div><div class="logo-set" aria-hidden="true" data-v-e5c53ac1><!--[-->`);
			ssrRenderList(supportedServices, (service) => {
				_push(`<img${ssrRenderAttr("src", service.src)} alt="" data-v-e5c53ac1>`);
			});
			_push(`<!--]--></div></div></section>`);
			_push(ssrRenderComponent(_component_PlatformCompatibilitySection, { scan: unref(scan) }, null, _parent));
			_push(`<section class="information section-panel" id="information" data-v-e5c53ac1><div class="information-inner" data-v-e5c53ac1><div class="section-head" data-v-e5c53ac1><h2 data-v-e5c53ac1>${ssrInterpolate(unref(t)("info.title"))}</h2><p data-v-e5c53ac1>${ssrInterpolate(unref(t)("info.subtitle"))}</p></div><div class="device-card-grid"${ssrRenderAttr("aria-label", unref(t)("info.title"))} data-v-e5c53ac1><article class="device-info-card" data-v-e5c53ac1><h3 data-v-e5c53ac1><img class="device-card-icon"${ssrRenderAttr("src", _virtual_public__2Fassets_2Ffigma_2Ficon_location_default)} alt="" data-v-e5c53ac1>${ssrInterpolate(unref(t)("info.location"))}</h3><dl data-v-e5c53ac1><div data-v-e5c53ac1><dt data-v-e5c53ac1>${ssrInterpolate(unref(t)("info.country"))}</dt><dd class="${ssrRenderClass({ copyable: hasScanValue(unref(scan)?.country_code) })}" data-v-e5c53ac1><span class="country-value" data-v-e5c53ac1>`);
			if (unref(countryFlag)) _push(`<img class="country-flag-icon"${ssrRenderAttr("src", unref(countryFlag))} alt="" data-v-e5c53ac1>`);
			else _push(`<!---->`);
			_push(`${ssrInterpolate(unref(countryName))}</span></dd></div><div data-v-e5c53ac1><dt data-v-e5c53ac1>${ssrInterpolate(unref(t)("info.state"))}</dt><dd class="${ssrRenderClass({ copyable: hasScanValue(unref(scan)?.region) })}" data-v-e5c53ac1>${ssrInterpolate(unref(scan)?.region || unref(t)("misc.na"))}</dd></div><div data-v-e5c53ac1><dt data-v-e5c53ac1>${ssrInterpolate(unref(t)("info.city"))}</dt><dd class="${ssrRenderClass({ copyable: hasScanValue(unref(scan)?.city) })}" data-v-e5c53ac1>${ssrInterpolate(unref(scan)?.city || unref(t)("misc.na"))}</dd></div><div data-v-e5c53ac1><dt data-v-e5c53ac1>${ssrInterpolate(unref(t)("info.hostname"))}</dt><dd class="${ssrRenderClass({ copyable: hasScanValue(unref(scan)?.host) })}" data-v-e5c53ac1>${ssrInterpolate(unref(scan)?.host || unref(t)("misc.na"))}</dd></div><div data-v-e5c53ac1><dt data-v-e5c53ac1>${ssrInterpolate(unref(t)("info.postalCode"))}</dt><dd class="${ssrRenderClass({ copyable: hasScanValue(unref(scan)?.zip_code) })}" data-v-e5c53ac1>${ssrInterpolate(unref(scan)?.zip_code || unref(t)("misc.na"))}</dd></div><div data-v-e5c53ac1><dt data-v-e5c53ac1>${ssrInterpolate(unref(t)("info.coordinates"))}</dt><dd class="${ssrRenderClass([{ copyable: unref(coordinates) !== unref(t)("misc.na") }, "accent-value"])}" data-v-e5c53ac1>${ssrInterpolate(unref(coordinates))}</dd></div><div data-v-e5c53ac1><dt data-v-e5c53ac1>${ssrInterpolate(unref(t)("info.isp"))}</dt><dd class="${ssrRenderClass({ copyable: hasScanValue(unref(scan)?.ISP) })}" data-v-e5c53ac1>${ssrInterpolate(unref(scan)?.ISP || unref(t)("misc.na"))}</dd></div><div data-v-e5c53ac1><dt data-v-e5c53ac1>${ssrInterpolate(unref(t)("info.organization"))}</dt><dd class="${ssrRenderClass({ copyable: hasScanValue(unref(scan)?.organization) })}" data-v-e5c53ac1>${ssrInterpolate(unref(scan)?.organization || unref(t)("misc.na"))}</dd></div><div data-v-e5c53ac1><dt data-v-e5c53ac1>${ssrInterpolate(unref(t)("info.connection"))}</dt><dd class="${ssrRenderClass({ copyable: hasScanValue(unref(scan)?.connection_type) })}" data-v-e5c53ac1>${ssrInterpolate(unref(scan) ? unref(networkType) : unref(t)("misc.na"))}</dd></div><div data-v-e5c53ac1><dt data-v-e5c53ac1>${ssrInterpolate(unref(t)("info.asn"))}</dt><dd class="${ssrRenderClass([{ copyable: hasScanValue(unref(scan)?.ASN) }, "accent-value"])}" data-v-e5c53ac1>${ssrInterpolate(unref(scan)?.ASN ? `AS${unref(scan).ASN}` : unref(t)("misc.na"))}</dd></div></dl></article><article class="device-info-card" data-v-e5c53ac1><h3 data-v-e5c53ac1><img class="device-card-icon"${ssrRenderAttr("src", _virtual_public__2Fassets_2Ffigma_2Ficon_time_default)} alt="" data-v-e5c53ac1>${ssrInterpolate(unref(t)("info.time"))}</h3><dl data-v-e5c53ac1><div data-v-e5c53ac1><dt data-v-e5c53ac1>${ssrInterpolate(unref(t)("info.timezone"))}</dt><dd class="${ssrRenderClass({ copyable: hasScanValue(unref(scan)?.timezone) })}" data-v-e5c53ac1>${ssrInterpolate(unref(scan)?.timezone || unref(t)("misc.na"))}</dd></div><div data-v-e5c53ac1><dt data-v-e5c53ac1>${ssrInterpolate(unref(t)("info.ipLocalTime"))}</dt><dd class="${ssrRenderClass({ copyable: unref(localTime) !== unref(t)("misc.na") })}" data-v-e5c53ac1>${ssrInterpolate(unref(localTime))}</dd></div><div data-v-e5c53ac1><dt data-v-e5c53ac1>${ssrInterpolate(unref(t)("info.systemTime"))}</dt><dd class="copyable" data-v-e5c53ac1>${ssrInterpolate(unref(currentTime).toLocaleString(unref(locale) === "zh" ? "zh-CN" : "en-US"))}</dd></div></dl></article><article class="device-info-card" data-v-e5c53ac1><h3 data-v-e5c53ac1><img class="device-card-icon"${ssrRenderAttr("src", _virtual_public__2Fassets_2Ffigma_2Ficon_browser_default)} alt="" data-v-e5c53ac1>${ssrInterpolate(unref(t)("info.browser"))}</h3><dl data-v-e5c53ac1><div data-v-e5c53ac1><dt data-v-e5c53ac1>${ssrInterpolate(unref(t)("info.userAgent"))}</dt><dd class="copyable" data-v-e5c53ac1>${ssrInterpolate(unref(userAgent))}</dd></div><div data-v-e5c53ac1><dt data-v-e5c53ac1>${ssrInterpolate(unref(t)("info.detectedBrowser"))}</dt><dd class="${ssrRenderClass({ copyable: hasScanValue(unref(browserInfo).browser) })}" data-v-e5c53ac1>${ssrInterpolate(unref(browserInfo).browser || unref(t)("misc.na"))}</dd></div><div data-v-e5c53ac1><dt data-v-e5c53ac1>${ssrInterpolate(unref(t)("info.os"))}</dt><dd class="${ssrRenderClass({ copyable: hasScanValue(unref(browserInfo).os) })}" data-v-e5c53ac1>${ssrInterpolate(unref(browserInfo).os || unref(t)("misc.na"))}</dd></div><div data-v-e5c53ac1><dt data-v-e5c53ac1>${ssrInterpolate(unref(t)("info.device"))}</dt><dd class="${ssrRenderClass({ copyable: hasScanValue(unref(browserInfo).device) })}" data-v-e5c53ac1>${ssrInterpolate(unref(browserInfo).device ? unref(t)(`device.${unref(browserInfo).device}`) : unref(t)("misc.na"))}</dd></div></dl></article></div>`);
			if (unref(scan)) {
				_push(`<div class="check-status-grid status-grid" data-v-e5c53ac1><article data-v-e5c53ac1><strong data-v-e5c53ac1>${ssrInterpolate(unref(scan).proxy ? unref(t)("status.detected") : unref(t)("status.notDetected"))}</strong><span data-v-e5c53ac1>${ssrInterpolate(unref(t)("status.proxy"))}</span></article><article class="${ssrRenderClass({ "suspected-exit-card": unref(suspectedExit) })}" data-v-e5c53ac1><strong class="${ssrRenderClass({ "suspected-exit-text": unref(suspectedExit) })}" data-v-e5c53ac1>${ssrInterpolate(unref(suspectedExit) ? unref(t)("status.suspectedExit") : unref(scan).vpn || unref(scan).tor ? unref(t)("status.detected") : unref(t)("status.notDetected"))}</strong><span data-v-e5c53ac1>${ssrInterpolate(unref(t)("status.vpnTor"))}</span>`);
				if (unref(suspectedExit)) _push(`<small data-v-e5c53ac1>${ssrInterpolate(unref(t)("status.suspectedExitHelp"))}</small>`);
				else _push(`<!---->`);
				_push(`</article><article data-v-e5c53ac1><strong data-v-e5c53ac1>${ssrInterpolate(unref(scan).recent_abuse ? unref(t)("status.detected") : unref(t)("status.notDetected"))}</strong><span data-v-e5c53ac1>${ssrInterpolate(unref(t)("status.recentAbuse"))}</span>`);
				if (unref(scan).recent_abuse) _push(`<small data-v-e5c53ac1>${ssrInterpolate(unref(t)("status.abuseListed"))}</small>`);
				else _push(`<!---->`);
				_push(`</article><article class="risk-card" data-v-e5c53ac1><em class="${ssrRenderClass(`risk-${unref(riskLevel)}`)}" data-v-e5c53ac1>${ssrInterpolate(unref(riskLabel))}</em><strong class="${ssrRenderClass(`risk-number-${unref(riskLevel)}`)}" data-v-e5c53ac1>${ssrInterpolate(unref(formatRiskScore)(unref(safetyScore)))} / 100</strong><span data-v-e5c53ac1>${ssrInterpolate(unref(t)("status.safetyScore"))}</span></article></div>`);
			} else _push(`<!---->`);
			_push(`</div></section></main>`);
			_push(ssrRenderComponent(_component_AppFooter, null, null, _parent));
			_push(`<div class="${ssrRenderClass([{ show: unref(copied) }, "copy-toast"])}" role="status" aria-live="polite" data-v-e5c53ac1>${ssrInterpolate(unref(t)(unref(copyToastMessage)))}</div><!--]-->`);
		};
	}
});
//#endregion
//#region app/pages/check.vue
var _sfc_setup = check_vue_vue_type_script_setup_true_lang_default.setup;
check_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/check.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var check_default = /*#__PURE__*/ _plugin_vue_export_helper_default(check_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-e5c53ac1"]]);

export { check_default as default };
//# sourceMappingURL=check-CCkgP7so.mjs.map
