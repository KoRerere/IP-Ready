import { c as useI18n, u as useHead$1 } from '../virtual/entry.mjs';
import { A as AppHeader_default, _ as _virtual_public__2Fassets_2Ffigma_2FimgLogo_default, a as AppFooter_default } from './AppFooter-Bo_g4zYJ.mjs';
import { I as InteractiveGlobe_default } from './InteractiveGlobe-DalcPMA7.mjs';
import { E as EVALUATED_PLATFORMS, c as computePlatformReadiness, P as PlatformBrandIcon_default } from '../_/platform-readiness.mjs';
import { _ as _virtual_public__2Fassets_2Fgradient_green_hero_default } from './_virtual_public-BD6c3a9J.mjs';
import { u as useBrowserInfo, C as CurrentIcon_default, P as PlatformReasonTooltip_default, c as _virtual_public__2Fassets_2Ffigma_2FimgVector30_default, _ as _virtual_public__2Fassets_2Ffigma_2Ficon_location_default, a as _virtual_public__2Fassets_2Ffigma_2Ficon_time_default, b as _virtual_public__2Fassets_2Ffigma_2Ficon_browser_default } from './_virtual_public-RIth-RMR.mjs';
import { defineComponent, computed, ref, watch, reactive, unref, createVNode, resolveDynamicComponent, useSSRContext } from 'vue';
import { p as publicAssetsURL } from '../routes/renderer.mjs';
import { ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderClass, ssrRenderList, ssrRenderStyle, ssrRenderVNode } from 'vue/server-renderer';
import { Bot, ShieldOff, Gauge } from 'lucide-vue-next';
import { a as analysisFor, i as isSuspectedExit, n as networkTypeLabel, s as safetyScoreFor, b as riskLevelForSafetyScore, f as formatRiskScore } from '../_/ip-display.mjs';
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
import './_plugin-vue_export-helper-BOaGB7Aw.mjs';
import 'unhead/server';
import 'unhead/legacy';
import 'unhead/plugins';
import 'nostics';
import 'vue-bundle-renderer/runtime';
import 'devalue';

const guides = {
  en: {
    title: "Guides & research",
    intro: "Understand the signals behind your score and what they mean for your next login.",
    read: "Read guide",
    viewAll: "View all guides",
    cards: [
      { slug: "what-is-ip-risk-score", title: "Understand your IP risk score", description: "Learn how reputation, network type and abuse signals shape your score.", icon: "gauge" },
      { slug: "why-is-my-ip-blacklisted", title: "Is your IP blacklisted?", description: "Find the reason behind a listing and the steps to resolve it.", icon: "shield-off" },
      { slug: "why-chatgpt-claude-blocking-your-ip", title: "Why ChatGPT and Claude block your IP", description: "See which network signals can interrupt access to AI platforms.", icon: "bot" }
    ]
  },
  zh: {
    title: "\u6307\u5357\u4E0E\u7814\u7A76",
    intro: "\u8BFB\u61C2\u5206\u6570\u80CC\u540E\u7684\u4FE1\u53F7\uFF0C\u4E3A\u4E0B\u4E00\u6B21\u767B\u5F55\u505A\u597D\u51C6\u5907\u3002",
    read: "\u9605\u8BFB\u6307\u5357",
    viewAll: "\u67E5\u770B\u5168\u90E8\u6587\u7AE0",
    cards: [
      { slug: "what-is-ip-risk-score", title: "\u8BFB\u61C2\u4F60\u7684 IP \u98CE\u9669\u5206", description: "\u4E86\u89E3\u4FE1\u8A89\u3001\u7F51\u7EDC\u7C7B\u578B\u4E0E\u6EE5\u7528\u4FE1\u53F7\u5982\u4F55\u5F71\u54CD\u98CE\u9669\u8BC4\u5206\u3002", icon: "gauge" },
      { slug: "why-is-my-ip-blacklisted", title: "\u4F60\u7684 IP \u88AB\u62C9\u9ED1\u4E86\u5417\uFF1F", description: "\u627E\u5230\u88AB\u5217\u5165\u9ED1\u540D\u5355\u7684\u539F\u56E0\uFF0C\u4EE5\u53CA\u89E3\u51B3\u95EE\u9898\u7684\u6B65\u9AA4\u3002", icon: "shield-off" },
      { slug: "why-chatgpt-claude-blocking-your-ip", title: "\u4E3A\u4EC0\u4E48 ChatGPT \u548C Claude \u4F1A\u5C01\u9501\u4F60\u7684 IP", description: "\u770B\u770B\u54EA\u4E9B\u7F51\u7EDC\u4FE1\u53F7\u4F1A\u5F71\u54CD AI \u5E73\u53F0\u7684\u8BBF\u95EE\u3002", icon: "bot" }
    ]
  }
};
function getHomeGuides(locale) {
  return locale === "zh" ? guides.zh : guides.en;
}

//#region \0virtual:public?%2Fassets%2Fgradient-green-faq.mp4
var _virtual_public__2Fassets_2Fgradient_green_faq_default = publicAssetsURL("/assets/gradient-green-faq.mp4");
//#endregion
//#region app/pages/index.vue?vue&type=script&setup=true&lang.ts
var homepageTitle = "IP Ready — Free IP Risk Score Checker & Reputation Lookup";
var featureDuration = 5e3;
var index_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "index",
	__ssrInlineRender: true,
	setup(__props) {
		const { locale, t } = useI18n();
		const homeGuides = computed(() => getHomeGuides(locale.value));
		const homeGuideIcons = {
			gauge: Gauge,
			"shield-off": ShieldOff,
			bot: Bot
		};
		const activeFilter = ref("all");
		const activeFaq = ref(0);
		const activeFeature = ref(0);
		const copied = ref(false);
		const copyToastMessage = ref("misc.copied");
		const platformHasSwapped = ref(false);
		const animatedPlatformScores = ref([]);
		const scan = ref(null);
		const scanError = ref("");
		const scanPending = ref(true);
		const { userAgent, browserInfo } = useBrowserInfo();
		const analysis = computed(() => scan.value ? analysisFor(scan.value, t) : null);
		const suspectedExit = computed(() => scan.value ? isSuspectedExit(scan.value) : false);
		const networkType = computed(() => networkTypeLabel(scan.value?.connection_type, t, scan.value?.hosting));
		const currentTime = ref(/* @__PURE__ */ new Date());
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
		ref(null);
		ref(null);
		ref(null);
		ref(false);
		const platformGroups = {
			all: [...EVALUATED_PLATFORMS],
			ai: EVALUATED_PLATFORMS.filter((p) => p.category === "ai"),
			ecommerce: EVALUATED_PLATFORMS.filter((p) => p.category === "ecommerce"),
			advertising: [],
			social: []
		};
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
		const displayedPlatforms = computed(() => {
			return platformGroups[activeFilter.value].map((platform) => ({
				...platform,
				readiness: scan.value ? computePlatformReadiness(platform.name, readinessContext.value) : void 0
			}));
		});
		function readinessCaption(platform) {
			const level = platform.readiness?.level;
			if (!level) return t("report.checkingSignals");
			return t(level === "ready" ? "platform.applicable" : level === "caution" ? "platform.caution" : "platform.notApplicable");
		}
		function readinessHits(platform) {
			return platform.readiness?.hits.map((id) => t(`signal.${id}`)).join(" · ") ?? "";
		}
		function quickReadFor(name) {
			if (!scan.value) return "--";
			return computePlatformReadiness(name, readinessContext.value)?.level === "ready" ? t("report.good") : t("report.poor");
		}
		const localTime = computed(() => {
			if (!scan.value?.timezone) return t("misc.na");
			try {
				return currentTime.value.toLocaleString(locale.value === "zh" ? "zh-CN" : "en-US", {
					dateStyle: "full",
					timeStyle: "long",
					timeZone: scan.value.timezone
				});
			} catch {
				return t("misc.na");
			}
		});
		const analysisEmoji = computed(() => {
			if (!scan.value) return "";
			if (suspectedExit.value) return "⚠️";
			return riskScore.value <= 30 ? "👍" : "⚠️";
		});
		function preparePlatformScores() {
			animatedPlatformScores.value = displayedPlatforms.value.map(() => 0);
		}
		watch(scan, () => {
			preparePlatformScores();
		});
		useHead$1({
			title: homepageTitle,
			meta: [
				{
					name: "description",
					content: () => t("meta.description")
				},
				{
					property: "og:title",
					content: homepageTitle
				},
				{
					property: "og:description",
					content: () => t("meta.description")
				},
				{
					property: "og:type",
					content: "website"
				}
			],
			script: [{
				key: "homepage-webapplication-schema",
				type: "application/ld+json",
				innerHTML: JSON.stringify({
					"@context": "https://schema.org",
					"@type": "WebApplication",
					name: "IP Ready",
					url: "https://ipready.cc/",
					applicationCategory: "UtilitiesApplication",
					offers: {
						"@type": "Offer",
						price: "0",
						priceCurrency: "USD"
					}
				})
			}],
			link: [
				{
					rel: "canonical",
					href: "https://ipready.cc/"
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
		return (_ctx, _push, _parent, _attrs) => {
			const _component_AppHeader = AppHeader_default;
			const _component_CurrentIcon = CurrentIcon_default;
			const _component_InteractiveGlobe = InteractiveGlobe_default;
			const _component_PlatformBrandIcon = PlatformBrandIcon_default;
			const _component_PlatformReasonTooltip = PlatformReasonTooltip_default;
			const _component_AppFooter = AppFooter_default;
			_push(`<!--[-->`);
			_push(ssrRenderComponent(_component_AppHeader, null, null, _parent));
			_push(`<main id="top"><section class="hero-shell"><div class="hero-motion" aria-hidden="true"><video autoplay loop muted playsinline preload="metadata"${ssrRenderAttr("src", _virtual_public__2Fassets_2Fgradient_green_hero_default)} poster="/assets/gradient-green-hero-poster.webp"></video><div class="hero-motion-wash"></div></div><div class="hero-copy"><p class="gradient-label reveal">${ssrInterpolate(unref(t)("hero.label"))}</p><h1 class="reveal"><span>${ssrInterpolate(unref(t)("hero.titleLead"))}</span>${ssrInterpolate(unref(t)("hero.titleRest"))}</h1><p class="hero-subtitle reveal">${ssrInterpolate(unref(t)("hero.subtitle"))}</p><div class="hero-points reveal" aria-label="Product benefits"><span>`);
			_push(ssrRenderComponent(_component_CurrentIcon, {
				class: "hero-point-icon hero-point-shield",
				src: "/assets/figma/imgVector4.svg"
			}, null, _parent));
			_push(`${ssrInterpolate(unref(t)("hero.pointScore"))}</span><span>`);
			_push(ssrRenderComponent(_component_CurrentIcon, {
				class: "hero-point-icon hero-point-data",
				src: "/assets/figma/imgVector5.svg"
			}, null, _parent));
			_push(`${ssrInterpolate(unref(t)("hero.pointData"))}</span><span>`);
			_push(ssrRenderComponent(_component_CurrentIcon, {
				class: "hero-point-icon hero-point-ai",
				src: "/assets/figma/imgVector6.svg"
			}, null, _parent));
			_push(`${ssrInterpolate(unref(t)("hero.pointAI"))}</span></div></div><article class="ip-report"><div class="report-frame"><div class="report-main"><div class="report-map">`);
			_push(ssrRenderComponent(_component_InteractiveGlobe, null, null, _parent));
			_push(`</div><div class="ip-heading"><p class="overline">${ssrInterpolate(unref(t)("report.yourIp"))}</p><div class="ip-line"><strong>${ssrInterpolate(unref(scan)?.ip || (unref(scanPending) ? unref(t)("report.detecting") : unref(t)("report.unavailable")))}</strong><button class="icon-button copy-ip" type="button"${ssrRenderAttr("title", unref(t)("report.copyIp"))}${ssrRenderAttr("aria-label", unref(t)("report.copyIp"))}${ssrIncludeBooleanAttr(!unref(scan)?.ip) ? " disabled" : ""}>`);
			_push(ssrRenderComponent(_component_CurrentIcon, {
				class: "copy-icon",
				src: "/assets/figma/imgVector7.svg"
			}, null, _parent));
			_push(`</button></div><div class="country-line">`);
			if (unref(countryFlag)) _push(`<img class="country-flag-icon"${ssrRenderAttr("src", unref(countryFlag))} alt="">`);
			else _push(`<!---->`);
			_push(`<b>${ssrInterpolate(unref(scanError) || `${unref(countryName)}${unref(scan)?.city ? ` / ${unref(scan).city}` : ""}`)}</b></div></div><div class="ip-facts"><div><b>${ssrInterpolate(unref(scan)?.ISP || unref(t)("report.detecting"))}</b><span>${ssrInterpolate(unref(t)("report.isp"))}</span></div><div><b>${ssrInterpolate(unref(networkType))}</b><span>${ssrInterpolate(unref(t)("report.networkType"))}</span></div><div><b>${ssrInterpolate(unref(scan)?.timezone || unref(t)("misc.unknown"))}</b><span>${ssrInterpolate(unref(t)("report.timezone"))}</span></div><div><b>${ssrInterpolate(unref(coordinates))}</b><span>${ssrInterpolate(unref(t)("report.location"))}</span></div></div><div class="analysis-block"><div class="analysis-title"><span class="ai-logo"><img${ssrRenderAttr("src", _virtual_public__2Fassets_2Ffigma_2FimgLogo_default)} alt=""></span><b>${ssrInterpolate(unref(t)("report.aiAnalysis"))}</b></div><h2>`);
			if (unref(analysisEmoji)) _push(`<span aria-hidden="true">${ssrInterpolate(unref(analysisEmoji))}</span>`);
			else _push(`<!---->`);
			_push(` ${ssrInterpolate(unref(analysis)?.title || unref(t)("report.analyzing"))}</h2><p>${ssrInterpolate(unref(analysis)?.summary || unref(t)("report.checkingSignals"))}</p><p><b>${ssrInterpolate(unref(t)("report.mainConcern"))}</b>${ssrInterpolate(" " + (unref(analysis)?.concern || unref(t)("report.analysisPending")))}</p><div class="analysis-checks"><span>`);
			_push(ssrRenderComponent(_component_CurrentIcon, {
				class: "analysis-check-icon",
				src: "/assets/figma/imgVector3.svg"
			}, null, _parent));
			_push(`${ssrInterpolate(unref(scan) ? unref(networkType) : unref(t)("report.networkPending"))}</span><span>`);
			_push(ssrRenderComponent(_component_CurrentIcon, {
				class: "analysis-check-icon",
				src: "/assets/figma/imgVector3.svg"
			}, null, _parent));
			_push(`${ssrInterpolate(unref(scan)?.city ? unref(t)("report.locationAvailable") : unref(t)("report.locationLimited"))}</span><span>`);
			_push(ssrRenderComponent(_component_CurrentIcon, {
				class: "analysis-check-icon",
				src: "/assets/figma/imgVector3.svg"
			}, null, _parent));
			_push(`${ssrInterpolate(unref(t)("report.iplocateChecked"))}</span></div></div></div><aside class="score-panel"><p class="score-label">${ssrInterpolate(unref(t)("report.score"))}</p><div class="score-value"><span class="score-number"><strong class="${ssrRenderClass(unref(scan) ? `risk-number-${unref(riskLevel)}` : "")}">${ssrInterpolate(unref(scan) ? unref(formatRiskScore)(unref(safetyScore)) : "--")}</strong><span>/100</span></span><em class="${ssrRenderClass(unref(scan) ? `risk-${unref(riskLevel)}` : "")}">${ssrInterpolate(unref(scan) ? unref(riskLabel) : unref(t)("report.scanning"))}</em></div><div class="score-divider"></div><p class="platform-label">${ssrInterpolate(unref(t)("report.quickRead"))}</p><div class="quick-platforms"><!--[-->`);
			ssrRenderList(unref(EVALUATED_PLATFORMS), (platform) => {
				_push(`<div><span><span class="quick-icon"><img class="simple-glyph"${ssrRenderAttr("src", platform.icon)} alt=""></span>${ssrInterpolate(platform.name)}</span><b>${ssrInterpolate(quickReadFor(platform.name))}</b></div>`);
			});
			_push(`<!--]--></div><a class="platform-link" href="#readiness">${ssrInterpolate(unref(t)("report.otherPlatforms"))} `);
			_push(ssrRenderComponent(_component_CurrentIcon, {
				class: "platform-arrow-icon",
				src: "/assets/figma/imgVector29.svg"
			}, null, _parent));
			_push(`</a></aside></div></article></section><section class="logo-rail"${ssrRenderAttr("aria-label", unref(t)("report.popularPlatforms"))}><div class="logo-track"><div class="logo-set"><!--[-->`);
			ssrRenderList(supportedServices, (service) => {
				_push(`<img${ssrRenderAttr("src", service.src)}${ssrRenderAttr("alt", service.name)}>`);
			});
			_push(`<!--]--></div><div class="logo-set" aria-hidden="true"><!--[-->`);
			ssrRenderList(supportedServices, (service) => {
				_push(`<img${ssrRenderAttr("src", service.src)} alt="">`);
			});
			_push(`<!--]--></div></div></section><div class="details-sections"><section class="readiness" id="readiness"><div class="readiness-inner"><div class="section-head"><h2>${ssrInterpolate(unref(t)("readiness.title"))}</h2><p>${ssrInterpolate(unref(t)("readiness.subtitle"))}</p><div class="tabs" role="tablist" aria-label="Platform categories"><span class="${ssrRenderClass([{
				ready: unref(tabsPill).ready,
				snap: unref(tabsPill).snap
			}, "tabs-morph-pill"])}" style="${ssrRenderStyle({
				transform: `translate(${unref(tabsPill).x}px, ${unref(tabsPill).y}px)`,
				width: `${unref(tabsPill).w}px`
			})}" aria-hidden="true"></span><button class="${ssrRenderClass({ active: unref(activeFilter) === "all" })}" type="button" role="tab"${ssrRenderAttr("aria-selected", unref(activeFilter) === "all")}>${ssrInterpolate(unref(t)("tabs.all"))}</button><button class="${ssrRenderClass({ active: unref(activeFilter) === "ai" })}" type="button" role="tab"${ssrRenderAttr("aria-selected", unref(activeFilter) === "ai")}>${ssrInterpolate(unref(t)("tabs.ai"))}</button><button class="${ssrRenderClass({ active: unref(activeFilter) === "ecommerce" })}" type="button" role="tab"${ssrRenderAttr("aria-selected", unref(activeFilter) === "ecommerce")}>${ssrInterpolate(unref(t)("tabs.ecommerce"))}</button><button class="${ssrRenderClass({ active: unref(activeFilter) === "advertising" })}" type="button" role="tab"${ssrRenderAttr("aria-selected", unref(activeFilter) === "advertising")}>${ssrInterpolate(unref(t)("tabs.advertising"))}</button><button class="${ssrRenderClass({ active: unref(activeFilter) === "social" })}" type="button" role="tab"${ssrRenderAttr("aria-selected", unref(activeFilter) === "social")}>${ssrInterpolate(unref(t)("tabs.social"))}</button></div></div><div class="${ssrRenderClass([{ "is-swapped": unref(platformHasSwapped) }, "platform-grid"])}"><span class="${ssrRenderClass([{
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
				_push(` ${ssrInterpolate(platform.name)}</span>`);
				if (platform.readiness?.level === "ready") _push(ssrRenderComponent(_component_CurrentIcon, {
					class: "check-icon",
					src: "/assets/figma/imgVector2.svg",
					label: unref(t)("platform.ready")
				}, null, _parent));
				else if (platform.readiness) _push(ssrRenderComponent(_component_PlatformReasonTooltip, {
					platform: platform.name,
					readiness: platform.readiness,
					"country-code": unref(scan)?.country_code
				}, null, _parent));
				else _push(`<!---->`);
				_push(`</div><div class="platform-info"><div class="platform-score-block${platform.readiness ? ` level-${platform.readiness.level}` : ""}"><div class="platform-score"${ssrRenderAttr("aria-label", `${platform.readiness?.score ?? 0} out of 100`)}${ssrRenderAttr("title", readinessHits(platform))}><b aria-hidden="true">${ssrInterpolate(unref(scan) ? unref(animatedPlatformScores)[index] ?? platform.readiness?.score ?? 0 : "--")}</b><span aria-hidden="true">/100</span></div><div class="meter"><i style="${ssrRenderStyle({ "--score": `${platform.readiness?.score ?? 0}%` })}"></i></div></div><p>${ssrInterpolate(readinessCaption(platform))}</p></div></article>`);
				if (index < unref(displayedPlatforms).length - 1) _push(`<img class="platform-divider"${ssrRenderAttr("src", _virtual_public__2Fassets_2Ffigma_2FimgVector30_default)} alt="" aria-hidden="true">`);
				else _push(`<!---->`);
				_push(`<!--]-->`);
			});
			_push(`<!--]--></div><div class="metric-grid"><div><strong>12</strong><span>${ssrInterpolate(unref(t)("metrics.signals"))}</span></div><div><strong>${ssrInterpolate(unref(t)("metrics.live"))}</strong><span>${ssrInterpolate(unref(t)("metrics.iplocate"))}</span></div><div><strong>${ssrInterpolate(unref(EVALUATED_PLATFORMS).length)}</strong><span>${ssrInterpolate(unref(t)("metrics.platforms"))}</span></div><div><strong>1</strong><span>${ssrInterpolate(unref(t)("metrics.aiPass"))}</span></div></div></div></section><section class="information section-panel" id="information"><div class="information-inner"><div class="section-head"><h2>${ssrInterpolate(unref(t)("info.title"))}</h2><p>${ssrInterpolate(unref(t)("info.subtitle"))}</p></div><div class="device-card-grid"${ssrRenderAttr("aria-label", unref(t)("info.title"))}><article class="device-info-card"><h3><img class="device-card-icon"${ssrRenderAttr("src", _virtual_public__2Fassets_2Ffigma_2Ficon_location_default)} alt="">${ssrInterpolate(unref(t)("info.location"))}</h3><dl><div><dt>${ssrInterpolate(unref(t)("info.country"))}</dt><dd class="${ssrRenderClass({ copyable: hasScanValue(unref(scan)?.country_code) })}"><span class="country-value">`);
			if (unref(countryFlag)) _push(`<img class="country-flag-icon"${ssrRenderAttr("src", unref(countryFlag))} alt="">`);
			else _push(`<!---->`);
			_push(`${ssrInterpolate(unref(countryName))}</span></dd></div><div><dt>${ssrInterpolate(unref(t)("info.state"))}</dt><dd class="${ssrRenderClass({ copyable: hasScanValue(unref(scan)?.region) })}">${ssrInterpolate(unref(scan)?.region || unref(t)("misc.na"))}</dd></div><div><dt>${ssrInterpolate(unref(t)("info.city"))}</dt><dd class="${ssrRenderClass({ copyable: hasScanValue(unref(scan)?.city) })}">${ssrInterpolate(unref(scan)?.city || unref(t)("misc.na"))}</dd></div><div><dt>${ssrInterpolate(unref(t)("info.hostname"))}</dt><dd class="${ssrRenderClass({ copyable: hasScanValue(unref(scan)?.host) })}">${ssrInterpolate(unref(scan)?.host || unref(t)("misc.na"))}</dd></div><div><dt>${ssrInterpolate(unref(t)("info.postalCode"))}</dt><dd class="${ssrRenderClass({ copyable: hasScanValue(unref(scan)?.zip_code) })}">${ssrInterpolate(unref(scan)?.zip_code || unref(t)("misc.na"))}</dd></div><div><dt>${ssrInterpolate(unref(t)("info.coordinates"))}</dt><dd class="${ssrRenderClass([{ copyable: unref(coordinates) !== unref(t)("misc.na") }, "accent-value"])}">${ssrInterpolate(unref(coordinates))}</dd></div><div><dt>${ssrInterpolate(unref(t)("info.isp"))}</dt><dd class="${ssrRenderClass({ copyable: hasScanValue(unref(scan)?.ISP) })}">${ssrInterpolate(unref(scan)?.ISP || unref(t)("misc.na"))}</dd></div><div><dt>${ssrInterpolate(unref(t)("info.organization"))}</dt><dd class="${ssrRenderClass({ copyable: hasScanValue(unref(scan)?.organization) })}">${ssrInterpolate(unref(scan)?.organization || unref(t)("misc.na"))}</dd></div><div><dt>${ssrInterpolate(unref(t)("info.connection"))}</dt><dd class="${ssrRenderClass({ copyable: hasScanValue(unref(scan)?.connection_type) })}">${ssrInterpolate(unref(scan) ? unref(networkType) : unref(t)("misc.na"))}</dd></div><div><dt>${ssrInterpolate(unref(t)("info.asn"))}</dt><dd class="${ssrRenderClass([{ copyable: hasScanValue(unref(scan)?.ASN) }, "accent-value"])}">${ssrInterpolate(unref(scan)?.ASN ? `AS${unref(scan).ASN}` : unref(t)("misc.na"))}</dd></div></dl></article><article class="device-info-card"><h3><img class="device-card-icon"${ssrRenderAttr("src", _virtual_public__2Fassets_2Ffigma_2Ficon_time_default)} alt="">${ssrInterpolate(unref(t)("info.time"))}</h3><dl><div><dt>${ssrInterpolate(unref(t)("info.timezone"))}</dt><dd class="${ssrRenderClass({ copyable: hasScanValue(unref(scan)?.timezone) })}">${ssrInterpolate(unref(scan)?.timezone || unref(t)("misc.na"))}</dd></div><div><dt>${ssrInterpolate(unref(t)("info.ipLocalTime"))}</dt><dd class="${ssrRenderClass({ copyable: unref(localTime) !== unref(t)("misc.na") })}">${ssrInterpolate(unref(localTime))}</dd></div><div><dt>${ssrInterpolate(unref(t)("info.systemTime"))}</dt><dd class="copyable">${ssrInterpolate(unref(currentTime).toLocaleString(unref(locale) === "zh" ? "zh-CN" : "en-US"))}</dd></div></dl></article><article class="device-info-card"><h3><img class="device-card-icon"${ssrRenderAttr("src", _virtual_public__2Fassets_2Ffigma_2Ficon_browser_default)} alt="">${ssrInterpolate(unref(t)("info.browser"))}</h3><dl><div><dt>${ssrInterpolate(unref(t)("info.userAgent"))}</dt><dd class="copyable">${ssrInterpolate(unref(userAgent))}</dd></div><div><dt>${ssrInterpolate(unref(t)("info.detectedBrowser"))}</dt><dd class="${ssrRenderClass({ copyable: hasScanValue(unref(browserInfo).browser) })}">${ssrInterpolate(unref(browserInfo).browser || unref(t)("misc.na"))}</dd></div><div><dt>${ssrInterpolate(unref(t)("info.os"))}</dt><dd class="${ssrRenderClass({ copyable: hasScanValue(unref(browserInfo).os) })}">${ssrInterpolate(unref(browserInfo).os || unref(t)("misc.na"))}</dd></div><div><dt>${ssrInterpolate(unref(t)("info.device"))}</dt><dd class="${ssrRenderClass({ copyable: hasScanValue(unref(browserInfo).device) })}">${ssrInterpolate(unref(browserInfo).device ? unref(t)(`device.${unref(browserInfo).device}`) : unref(t)("misc.na"))}</dd></div></dl></article></div><div class="status-grid"><article><strong>${ssrInterpolate(unref(scan)?.proxy ? unref(t)("status.detected") : unref(t)("status.notDetected"))}</strong><span>${ssrInterpolate(unref(t)("status.proxy"))}</span></article><article class="${ssrRenderClass({ "suspected-exit-card": unref(suspectedExit) })}"><strong class="${ssrRenderClass({ "suspected-exit-text": unref(suspectedExit) })}">${ssrInterpolate(unref(suspectedExit) ? unref(t)("status.suspectedExit") : unref(scan)?.vpn || unref(scan)?.tor ? unref(t)("status.detected") : unref(t)("status.notDetected"))}</strong><span>${ssrInterpolate(unref(t)("status.vpnTor"))}</span>`);
			if (unref(suspectedExit)) _push(`<small>${ssrInterpolate(unref(t)("status.suspectedExitHelp"))}</small>`);
			else _push(`<!---->`);
			_push(`</article><article><strong>${ssrInterpolate(unref(scan)?.recent_abuse ? unref(t)("status.detected") : unref(t)("status.notDetected"))}</strong><span>${ssrInterpolate(unref(t)("status.recentAbuse"))}</span>`);
			if (unref(scan)?.recent_abuse) _push(`<small>${ssrInterpolate(unref(t)("status.abuseListed"))}</small>`);
			else _push(`<!---->`);
			_push(`</article><article class="risk-card"><em class="${ssrRenderClass(unref(scan) ? `risk-${unref(riskLevel)}` : "detecting")}">${ssrInterpolate(unref(scan) ? unref(riskLabel) : unref(t)("status.detecting"))}</em><strong class="${ssrRenderClass(unref(scan) ? `risk-number-${unref(riskLevel)}` : "")}">${ssrInterpolate(unref(scan) ? unref(formatRiskScore)(unref(safetyScore)) : "--")} / 100</strong><span>${ssrInterpolate(unref(t)("status.safetyScore"))}</span></article></div></div></section></div><section class="home-guides" id="guides" aria-labelledby="guides-title"><div class="home-guides-inner"><div class="section-head"><h2 id="guides-title">${ssrInterpolate(unref(homeGuides).title)}</h2><p>${ssrInterpolate(unref(homeGuides).intro)}</p></div><div class="home-guides-grid"><!--[-->`);
			ssrRenderList(unref(homeGuides).cards, (guide) => {
				_push(`<a class="home-guide-card"${ssrRenderAttr("href", "/blog/" + guide.slug)}><span class="${ssrRenderClass(["home-guide-icon-" + guide.icon, "home-guide-icon"])}">`);
				ssrRenderVNode(_push, createVNode(resolveDynamicComponent(homeGuideIcons[guide.icon]), {
					size: 24,
					"stroke-width": 1.8,
					"aria-hidden": "true"
				}, null), _parent);
				_push(`</span><h3>${ssrInterpolate(guide.title)}</h3><p>${ssrInterpolate(guide.description)}</p><span class="home-guide-link">${ssrInterpolate(unref(homeGuides).read)} <span aria-hidden="true">↗</span></span></a>`);
			});
			_push(`<!--]--></div><a class="home-guides-all" href="/blog"><span>${ssrInterpolate(unref(homeGuides).viewAll)}</span><span aria-hidden="true">↗</span></a></div></section><section class="faq-section" id="faq"><div class="faq-motion" aria-hidden="true"><video autoplay loop muted playsinline preload="metadata"${ssrRenderAttr("src", _virtual_public__2Fassets_2Fgradient_green_faq_default)} poster="/assets/gradient-green-faq-poster.webp"></video><div class="faq-motion-wash"></div></div><div class="faq-card"><h2>${ssrInterpolate(unref(t)("faq.title"))}</h2><div class="faq-list"><article class="${ssrRenderClass([{ active: unref(activeFaq) === 0 }, "faq-item"])}"><button type="button"${ssrRenderAttr("aria-expanded", unref(activeFaq) === 0)}><span>${ssrInterpolate(unref(t)("faq.q1"))}</span>`);
			_push(ssrRenderComponent(_component_CurrentIcon, {
				class: "faq-toggle-icon faq-plus-icon",
				src: "/assets/figma/imgVector.svg"
			}, null, _parent));
			_push(`</button><div class="faq-answer"><p>${ssrInterpolate(unref(t)("faq.a1"))}</p></div></article><article class="${ssrRenderClass([{ active: unref(activeFaq) === 1 }, "faq-item"])}"><button type="button"${ssrRenderAttr("aria-expanded", unref(activeFaq) === 1)}><span>${ssrInterpolate(unref(t)("faq.q2"))}</span>`);
			_push(ssrRenderComponent(_component_CurrentIcon, {
				class: "faq-toggle-icon faq-plus-icon",
				src: "/assets/figma/imgVector.svg"
			}, null, _parent));
			_push(`</button><div class="faq-answer"><p>${ssrInterpolate(unref(t)("faq.a2"))}</p></div></article><article class="${ssrRenderClass([{ active: unref(activeFaq) === 2 }, "faq-item"])}"><button type="button"${ssrRenderAttr("aria-expanded", unref(activeFaq) === 2)}><span>${ssrInterpolate(unref(t)("faq.q3"))}</span>`);
			_push(ssrRenderComponent(_component_CurrentIcon, {
				class: "faq-toggle-icon faq-plus-icon",
				src: "/assets/figma/imgVector.svg"
			}, null, _parent));
			_push(`</button><div class="faq-answer"><p>${ssrInterpolate(unref(t)("faq.a3"))}</p></div></article><article class="${ssrRenderClass([{ active: unref(activeFaq) === 3 }, "faq-item"])}"><button type="button"${ssrRenderAttr("aria-expanded", unref(activeFaq) === 3)}><span>${ssrInterpolate(unref(t)("faq.q4"))}</span>`);
			_push(ssrRenderComponent(_component_CurrentIcon, {
				class: "faq-toggle-icon faq-plus-icon",
				src: "/assets/figma/imgVector.svg"
			}, null, _parent));
			_push(`</button><div class="faq-answer"><p>${ssrInterpolate(unref(t)("faq.a4"))}</p></div></article><article class="${ssrRenderClass([{ active: unref(activeFaq) === 4 }, "faq-item"])}"><button type="button"${ssrRenderAttr("aria-expanded", unref(activeFaq) === 4)}><span>${ssrInterpolate(unref(t)("faq.q5"))}</span>`);
			_push(ssrRenderComponent(_component_CurrentIcon, {
				class: "faq-toggle-icon faq-plus-icon",
				src: "/assets/figma/imgVector.svg"
			}, null, _parent));
			_push(`</button><div class="faq-answer"><p>${ssrInterpolate(unref(t)("faq.a5"))}</p></div></article></div></div></section><section class="feature-row" aria-label="Product qualities" style="${ssrRenderStyle({ "--feature-duration": `${featureDuration}ms` })}"><article class="${ssrRenderClass({ "carousel-active": unref(activeFeature) === 0 })}">`);
			_push(ssrRenderComponent(_component_CurrentIcon, {
				class: "feature-icon feature-icon-shield",
				src: "/assets/figma/imgSubtract.svg"
			}, null, _parent));
			_push(`<b>${ssrInterpolate(unref(t)("feature.reliable"))}</b><i></i></article><article class="${ssrRenderClass({ "carousel-active": unref(activeFeature) === 1 })}"><span class="feature-icon feature-icon-efficient" aria-hidden="true">`);
			_push(ssrRenderComponent(_component_CurrentIcon, {
				class: "efficient-back",
				src: "/assets/figma/imgVector40.svg"
			}, null, _parent));
			_push(ssrRenderComponent(_component_CurrentIcon, {
				class: "efficient-pen",
				src: "/assets/figma/imgVector41.svg"
			}, null, _parent));
			_push(ssrRenderComponent(_component_CurrentIcon, {
				class: "efficient-device",
				src: "/assets/figma/imgSubtract1.svg"
			}, null, _parent));
			_push(`</span><b>${ssrInterpolate(unref(t)("feature.efficient"))}</b><i></i></article><article class="${ssrRenderClass({ "carousel-active": unref(activeFeature) === 2 })}">`);
			_push(ssrRenderComponent(_component_CurrentIcon, {
				class: "feature-icon feature-icon-target",
				src: "/assets/figma/imgVector42.svg"
			}, null, _parent));
			_push(`<b>${ssrInterpolate(unref(t)("feature.accurate"))}</b><i></i></article><article class="${ssrRenderClass({ "carousel-active": unref(activeFeature) === 3 })}">`);
			_push(ssrRenderComponent(_component_CurrentIcon, {
				class: "feature-icon feature-icon-aperture",
				src: "/assets/figma/imgVector43.svg"
			}, null, _parent));
			_push(`<b>${ssrInterpolate(unref(t)("feature.stable"))}</b><i></i></article></section></main>`);
			_push(ssrRenderComponent(_component_AppFooter, null, null, _parent));
			_push(`<div class="${ssrRenderClass([{ show: unref(copied) }, "copy-toast"])}" role="status" aria-live="polite">${ssrInterpolate(unref(t)(unref(copyToastMessage)))}</div><!--]-->`);
		};
	}
});
//#endregion
//#region app/pages/index.vue
var _sfc_setup = index_vue_vue_type_script_setup_true_lang_default.setup;
index_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var pages_default = index_vue_vue_type_script_setup_true_lang_default;

export { pages_default as default };
//# sourceMappingURL=pages-BuNf1zPR.mjs.map
