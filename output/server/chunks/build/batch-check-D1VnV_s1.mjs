import { c as useI18n, a as useRoute$1, j as useRouter, u as useHead$1 } from '../virtual/entry.mjs';
import { T as Table_default, a as TableHeader_default, b as TableRow_default, c as TableHead_default, d as TableBody_default, e as TableCell_default } from './table-C5wIZS21.mjs';
import { A as AppHeader_default, a as AppFooter_default } from './AppFooter-Bo_g4zYJ.mjs';
import { _ as _plugin_vue_export_helper_default } from './_plugin-vue_export-helper-BOaGB7Aw.mjs';
import { E as EVALUATED_PLATFORMS, P as PlatformBrandIcon_default, c as computePlatformReadiness } from '../_/platform-readiness.mjs';
import { N as NuxtLink } from './nuxt-link-DYXowh3u.mjs';
import { u as useRotatingPlaceholder } from './useRotatingPlaceholder-hZeAfRvN.mjs';
import { defineComponent, ref, computed, watch, nextTick, reactive, unref, withCtx, createTextVNode, toDisplayString, createVNode, openBlock, createBlock, createCommentVNode, Fragment, renderList, useSSRContext } from 'vue';
import { p as publicAssetsURL } from '../routes/renderer.mjs';
import { ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrIncludeBooleanAttr, ssrRenderStyle } from 'vue/server-renderer';
import { f as formatRiskScore, a as analysisFor, r as riskLevelFor } from '../_/ip-display.mjs';
import { i as isValidIp } from '../_/ip-validation.mjs';
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
import '@vueuse/core';
import 'clsx';
import 'tailwind-merge';
import 'unhead/server';
import 'unhead/legacy';
import 'unhead/plugins';
import 'nostics';
import 'vue-bundle-renderer/runtime';
import 'devalue';

//#region \0virtual:public?%2Fassets%2Fgradient-blue-hero.mp4
var _virtual_public__2Fassets_2Fgradient_blue_hero_default = publicAssetsURL("/assets/gradient-blue-hero.mp4");
//#endregion
//#region \0virtual:public?%2Fassets%2Ffigma%2FimgAliexpress.svg
var _virtual_public__2Fassets_2Ffigma_2FimgAliexpress_default = publicAssetsURL("/assets/figma/imgAliexpress.svg");
//#endregion
//#region \0virtual:public?%2Fassets%2Ffigma%2FimgShopify.svg
var _virtual_public__2Fassets_2Ffigma_2FimgShopify_default = publicAssetsURL("/assets/figma/imgShopify.svg");
//#endregion
//#region \0virtual:public?%2Fassets%2Ffigma%2FimgEbay.svg
var _virtual_public__2Fassets_2Ffigma_2FimgEbay_default = publicAssetsURL("/assets/figma/imgEbay.svg");
//#endregion
//#region \0virtual:public?%2Fassets%2Ffigma%2FimgFacebook.svg
var _virtual_public__2Fassets_2Ffigma_2FimgFacebook_default = publicAssetsURL("/assets/figma/imgFacebook.svg");
//#endregion
//#region \0virtual:public?%2Fassets%2Ffigma%2FimgEtsy.svg
var _virtual_public__2Fassets_2Ffigma_2FimgEtsy_default = publicAssetsURL("/assets/figma/imgEtsy.svg");
//#endregion
//#region \0virtual:public?%2Fassets%2Ffigma%2FimgAmazon.svg
var _virtual_public__2Fassets_2Ffigma_2FimgAmazon_default = publicAssetsURL("/assets/figma/imgAmazon.svg");
//#endregion
//#region \0virtual:public?%2Fassets%2Ffigma%2FimgNetflix.svg
var _virtual_public__2Fassets_2Ffigma_2FimgNetflix_default = publicAssetsURL("/assets/figma/imgNetflix.svg");
//#endregion
//#region \0virtual:public?%2Fassets%2Ffigma%2FimgTiktok.svg
var _virtual_public__2Fassets_2Ffigma_2FimgTiktok_default = publicAssetsURL("/assets/figma/imgTiktok.svg");
//#endregion
//#region \0virtual:public?%2Fassets%2Ffigma%2FimgYoutube.svg
var _virtual_public__2Fassets_2Ffigma_2FimgYoutube_default = publicAssetsURL("/assets/figma/imgYoutube.svg");
//#endregion
//#region \0virtual:public?%2Fassets%2Ffigma%2FimgTemu.svg
var _virtual_public__2Fassets_2Ffigma_2FimgTemu_default = publicAssetsURL("/assets/figma/imgTemu.svg");
//#endregion
//#region \0virtual:public?%2Fassets%2Ffigma%2FimgBestuy.svg
var _virtual_public__2Fassets_2Ffigma_2FimgBestuy_default = publicAssetsURL("/assets/figma/imgBestuy.svg");
//#endregion
//#region \0virtual:public?%2Fassets%2Ffigma%2FimgShopee.svg
var _virtual_public__2Fassets_2Ffigma_2FimgShopee_default = publicAssetsURL("/assets/figma/imgShopee.svg");
//#endregion
//#region app/pages/batch-check.vue?vue&type=script&setup=true&lang.ts
var MAX_BATCH_IPS = 20;
var batch_check_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "batch-check",
	__ssrInlineRender: true,
	setup(__props) {
		const { locale, t } = useI18n();
		const route = useRoute$1();
		useRouter();
		const rawInput = ref(typeof route.query.ips === "string" ? route.query.ips.replace(/,/g, "\n") : "");
		const pending = ref(false);
		const scanningCount = ref(0);
		const results = ref(null);
		const textareaEl = ref(null);
		const placeholderText = useRotatingPlaceholder([
			"batch.placeholder",
			"batch.phrase2",
			"batch.phrase3",
			"batch.phrase4"
		]);
		const toastVisible = ref(false);
		const toastMessage = ref("");
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
		const IPV4_PATTERN = /(?<![\d.])((?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?![\d.])/;
		const IPV6_PATTERN = /(?<![0-9A-Fa-f:])((?:[0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4}|(?:[0-9A-Fa-f]{1,4}:){1,7}:|(?:[0-9A-Fa-f]{1,4}:){1,6}:[0-9A-Fa-f]{1,4}|(?:[0-9A-Fa-f]{1,4}:){1,5}(?::[0-9A-Fa-f]{1,4}){1,2}|(?:[0-9A-Fa-f]{1,4}:){1,4}(?::[0-9A-Fa-f]{1,4}){1,3}|(?:[0-9A-Fa-f]{1,4}:){1,3}(?::[0-9A-Fa-f]{1,4}){1,4}|(?:[0-9A-Fa-f]{1,4}:){1,2}(?::[0-9A-Fa-f]{1,4}){1,5}|[0-9A-Fa-f]{1,4}:(?::[0-9A-Fa-f]{1,4}){1,6})(?![0-9A-Fa-f:])/;
		function extractIp(line) {
			const ip = isValidIp(line.trim()) ? line.trim() : line.match(IPV4_PATTERN)?.[0] ?? line.match(IPV6_PATTERN)?.[0];
			return ip && isValidIp(ip) ? ip : void 0;
		}
		const parsedEntries = computed(() => {
			const entries = [];
			const seenIps = /* @__PURE__ */ new Set();
			for (const line of rawInput.value.split(/\r?\n/)) {
				const raw = line.trim();
				if (!raw) continue;
				const ip = extractIp(raw);
				if (ip) {
					if (seenIps.has(ip)) continue;
					seenIps.add(ip);
				}
				entries.push({
					raw,
					ip
				});
			}
			return entries;
		});
		const inputLines = computed(() => rawInput.value.split(/\r?\n/).map((raw) => ({
			raw,
			invalid: Boolean(raw.trim()) && !extractIp(raw)
		})));
		const invalidCount = computed(() => parsedEntries.value.filter((entry) => !entry.ip).length);
		const overLimit = computed(() => parsedEntries.value.filter((entry) => entry.ip).length > MAX_BATCH_IPS);
		const submitList = computed(() => parsedEntries.value.filter((entry) => entry.ip).map((entry) => entry.ip).slice(0, MAX_BATCH_IPS));
		const counterLabel = computed(() => t("batch.counter").replace("{n}", String(submitList.value.length)));
		const ignoredLabel = computed(() => t("batch.ignoredN").replace("{n}", String(invalidCount.value)));
		const scanningLabel = computed(() => t("batch.scanningN").replace("{n}", String(scanningCount.value)));
		const summary = computed(() => {
			const ok = results.value?.filter((entry) => entry.status === "ok") ?? [];
			return {
				total: results.value?.length ?? 0,
				low: ok.filter((entry) => entry.data.risk_score < 40).length,
				flagged: ok.filter((entry) => entry.data.risk_score >= 40).length,
				failed: results.value?.filter((entry) => entry.status === "error").length ?? 0
			};
		});
		function riskLevel(score) {
			return riskLevelFor(score);
		}
		function riskLabel(score) {
			const level = riskLevel(score);
			return level === "high" ? t("risk.high") : level === "medium" ? t("risk.medium") : t("risk.low");
		}
		function countryName(code) {
			if (!code) return t("misc.na");
			try {
				return new Intl.DisplayNames([locale.value === "zh" ? "zh-CN" : "en"], { type: "region" }).of(code.toUpperCase()) || code;
			} catch {
				return code;
			}
		}
		function sampleCountry(code) {
			if (locale.value !== "zh") return code;
			try {
				return new Intl.DisplayNames(["zh-CN"], { type: "region" }).of(code) || code;
			} catch {
				return code;
			}
		}
		function signalChips(entry) {
			const chips = [];
			if (entry.proxy) chips.push({
				label: t("status.proxy"),
				level: "medium"
			});
			if (entry.vpn) chips.push({
				label: "VPN",
				level: "medium"
			});
			if (entry.tor) chips.push({
				label: "Tor",
				level: "high"
			});
			if (entry.recent_abuse) chips.push({
				label: t("status.recentAbuse"),
				level: "high"
			});
			return chips;
		}
		const textareaWrapEl = ref(null);
		function autosizeTextarea() {
			const el = textareaEl.value;
			if (!el) return;
			el.style.height = "auto";
			el.style.height = `${Math.max(el.scrollHeight, 80)}px`;
			nextTick(updateTextareaMask);
		}
		function updateTextareaMask() {
			const el = textareaWrapEl.value;
			if (!el) return;
			const fade = 28;
			const canTop = el.scrollTop > 4;
			const canBottom = el.scrollTop + el.clientHeight < el.scrollHeight - 4;
			const mask = `linear-gradient(to bottom, ${canTop ? `transparent 0, #000 ${fade}px` : `#000 0`}, ${canBottom ? `#000 calc(100% - ${fade}px), transparent 100%` : `#000 100%`})`;
			el.style.maskImage = mask;
			el.style.webkitMaskImage = mask;
		}
		watch(rawInput, () => nextTick(autosizeTextarea));
		const tablePill = reactive({
			x: 0,
			y: 0,
			w: 0,
			h: 0,
			visible: false,
			snap: false
		});
		function moveTablePill(event) {
			const row = event.currentTarget;
			const card = row.closest(".batch-table-card");
			if (!card) return;
			const cardRect = card.getBoundingClientRect();
			const rowRect = row.getBoundingClientRect();
			tablePill.x = rowRect.left - cardRect.left;
			tablePill.y = rowRect.top - cardRect.top;
			tablePill.w = rowRect.width;
			tablePill.h = rowRect.height;
			if (!tablePill.visible) {
				tablePill.snap = true;
				requestAnimationFrame(() => requestAnimationFrame(() => {
					tablePill.snap = false;
				}));
			}
			tablePill.visible = true;
		}
		const activeTab = ref("basic");
		ref(null);
		const tabsPill = reactive({
			x: 0,
			y: 0,
			w: 0,
			ready: false,
			snap: false
		});
		const BATCH_PLATFORMS = EVALUATED_PLATFORMS;
		const okEntries = computed(() => (results.value ?? []).filter((entry) => entry.status === "ok").map((entry) => ({
			ip: entry.data.ip,
			data: entry.data
		})));
		function platformScore(name, data) {
			return computePlatformReadiness(name, data)?.score ?? 0;
		}
		function scoreTone(score) {
			return score >= 70 ? "good" : score >= 40 ? "warn" : "bad";
		}
		useHead$1({
			title: () => t("batch.metaTitle"),
			meta: [
				{
					name: "description",
					content: () => t("batch.metaDescription")
				},
				{
					property: "og:title",
					content: () => t("batch.metaTitle")
				},
				{
					property: "og:description",
					content: () => t("batch.metaDescription")
				}
			],
			link: [
				{
					rel: "canonical",
					href: "https://ipready.cc/batch-check"
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
			const _component_NuxtLink = NuxtLink;
			const _component_PlatformBrandIcon = PlatformBrandIcon_default;
			const _component_AppFooter = AppFooter_default;
			_push(`<!--[-->`);
			_push(ssrRenderComponent(_component_AppHeader, null, null, _parent));
			_push(`<main id="top" data-v-4b400519><section class="batch-hero" data-v-4b400519><div class="batch-hero-panel" aria-hidden="true" data-v-4b400519><div class="batch-hero-tint" data-v-4b400519></div><video autoplay loop muted playsinline preload="auto"${ssrRenderAttr("src", _virtual_public__2Fassets_2Fgradient_blue_hero_default)} poster="/assets/gradient-blue-hero-poster.webp" data-v-4b400519></video><div class="batch-hero-veil" data-v-4b400519></div></div><div class="batch-hero-inner" data-v-4b400519><h1 class="reveal" data-v-4b400519>${ssrInterpolate(unref(t)("batch.title"))}</h1><p class="batch-hero-sub reveal" data-v-4b400519>${ssrInterpolate(unref(t)("batch.subtitle"))}</p><div class="batch-composer reveal" data-v-4b400519><span class="composer-glass" aria-hidden="true" data-v-4b400519></span><div class="composer-card" data-v-4b400519><div class="composer-field" data-v-4b400519><div class="batch-textarea-wrap" data-v-4b400519><div class="batch-input-highlights" aria-hidden="true" data-v-4b400519><!--[-->`);
			ssrRenderList(unref(inputLines), (line, index) => {
				_push(`<div class="${ssrRenderClass({ invalid: line.invalid })}" data-v-4b400519>${ssrInterpolate(line.raw || "\xA0")}</div>`);
			});
			_push(`<!--]--></div><textarea class="batch-textarea" rows="1" autocomplete="off" autocapitalize="off" spellcheck="false"${ssrRenderAttr("placeholder", unref(placeholderText))}${ssrRenderAttr("aria-label", unref(t)("batch.placeholder"))}${ssrRenderAttr("aria-invalid", unref(invalidCount) > 0)} aria-describedby="batch-input-help batch-input-validation" data-v-4b400519>${ssrInterpolate(unref(rawInput))}</textarea></div></div><div class="composer-toolbar" data-v-4b400519><div class="composer-left" data-v-4b400519><div class="composer-icons" data-v-4b400519><button class="icon-tool icon-tool-active" type="button"${ssrRenderAttr("title", unref(t)("batch.paste"))}${ssrRenderAttr("aria-label", unref(t)("batch.paste"))} data-v-4b400519><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-4b400519><rect width="8" height="4" x="8" y="2" rx="1" ry="1" data-v-4b400519></rect><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" data-v-4b400519></path></svg></button><button class="icon-tool" type="button"${ssrRenderAttr("title", unref(t)("batch.clear"))}${ssrRenderAttr("aria-label", unref(t)("batch.clear"))}${ssrIncludeBooleanAttr(!unref(rawInput)) ? " disabled" : ""} data-v-4b400519><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-4b400519><path d="M3 6h18" data-v-4b400519></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" data-v-4b400519></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" data-v-4b400519></path><line x1="10" x2="10" y1="11" y2="17" data-v-4b400519></line><line x1="14" x2="14" y1="11" y2="17" data-v-4b400519></line></svg></button></div><span class="composer-counter" data-v-4b400519>${ssrInterpolate(unref(counterLabel))}</span>`);
			if (unref(invalidCount)) _push(`<span class="composer-invalid-count" data-v-4b400519>${ssrInterpolate(unref(ignoredLabel))}</span>`);
			else _push(`<!---->`);
			_push(`</div><button class="composer-submit" type="button"${ssrIncludeBooleanAttr(unref(pending) || !unref(submitList).length) ? " disabled" : ""} data-v-4b400519><span class="submit-chip" aria-hidden="true" data-v-4b400519><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" data-v-4b400519><path d="M14,6 C14,5.448 13.552,5 13,5 L8.5,5 C5.462,5 3,7.462 3,10.5 C3,13.538 5.462,16 8.5,16 L16,16 L16,18 C16,18.377 16.212,18.722 16.549,18.892 C16.886,19.063 17.289,19.029 17.593,18.805 L17.604,18.797 L17.631,18.777 C17.655,18.759 17.689,18.734 17.732,18.701 C17.817,18.637 17.939,18.544 18.084,18.431 C18.374,18.205 18.763,17.892 19.156,17.552 C19.543,17.215 19.956,16.831 20.281,16.464 C20.442,16.282 20.602,16.08 20.727,15.872 C20.836,15.691 21,15.377 21,15 C21,14.623 20.836,14.309 20.727,14.128 C20.602,13.92 20.442,13.718 20.281,13.536 C19.956,13.169 19.543,12.785 19.156,12.448 C18.763,12.108 18.374,11.795 18.084,11.569 C17.939,11.456 17.817,11.363 17.732,11.299 C17.689,11.266 17.655,11.241 17.631,11.223 L17.604,11.203 L17.596,11.197 L17.593,11.195 C17.29,10.971 16.886,10.937 16.549,11.107 C16.212,11.278 16,11.623 16,12 L16,14 L8.5,14 C6.567,14 5,12.433 5,10.5 C5,8.567 6.567,7 8.5,7 L13,7 C13.552,7 14,6.552 14,6 Z" fill="currentColor" data-v-4b400519></path></svg></span><span data-v-4b400519>${ssrInterpolate(unref(pending) ? unref(scanningLabel) : unref(t)("batch.submit"))}</span></button></div></div></div><p id="batch-input-help" class="batch-input-note" data-v-4b400519>${ssrInterpolate(unref(t)("batch.inputHint"))}</p><div id="batch-input-validation" class="batch-input-note" role="status" aria-live="polite" data-v-4b400519>`);
			if (unref(invalidCount)) _push(`<p class="composer-invalid-count" data-v-4b400519>${ssrInterpolate(unref(ignoredLabel))}</p>`);
			else _push(`<!---->`);
			if (unref(overLimit)) _push(`<p class="composer-invalid-count" data-v-4b400519>${ssrInterpolate(unref(t)("batch.limitHint"))}</p>`);
			else _push(`<!---->`);
			_push(`</div><div class="batch-examples reveal" data-v-4b400519><span class="batch-examples-label" data-v-4b400519>${ssrInterpolate(unref(t)("check.try"))}</span><div class="chip-marquee" data-v-4b400519><div class="chip-track" data-v-4b400519><div class="chip-set" data-v-4b400519><!--[-->`);
			ssrRenderList(sampleIps, (sample) => {
				_push(`<button type="button" class="batch-example-chip"${ssrRenderAttr("title", unref(t)("batch.addToInput"))} data-v-4b400519><img class="batch-example-flag"${ssrRenderAttr("src", `/assets/icons/flags/${sample.code}.svg`)} alt="" data-v-4b400519><b data-v-4b400519>${ssrInterpolate(sampleCountry(sample.code))}</b><span class="batch-example-ip" data-v-4b400519>${ssrInterpolate(sample.ip)}</span></button>`);
			});
			_push(`<!--]--></div><div class="chip-set" aria-hidden="true" data-v-4b400519><!--[-->`);
			ssrRenderList(sampleIps, (sample) => {
				_push(`<button type="button" tabindex="-1" class="batch-example-chip" data-v-4b400519><img class="batch-example-flag"${ssrRenderAttr("src", `/assets/icons/flags/${sample.code}.svg`)} alt="" data-v-4b400519><b data-v-4b400519>${ssrInterpolate(sampleCountry(sample.code))}</b><span class="batch-example-ip" data-v-4b400519>${ssrInterpolate(sample.ip)}</span></button>`);
			});
			_push(`<!--]--></div></div></div></div></div></section><section class="logo-rail"${ssrRenderAttr("aria-label", unref(t)("report.popularPlatforms"))} data-v-4b400519><div class="logo-track" data-v-4b400519><div class="logo-set" data-v-4b400519><img${ssrRenderAttr("src", _virtual_public__2Fassets_2Ffigma_2FimgAliexpress_default)} alt="AliExpress" data-v-4b400519><img${ssrRenderAttr("src", _virtual_public__2Fassets_2Ffigma_2FimgShopify_default)} alt="Shopify" data-v-4b400519><img${ssrRenderAttr("src", _virtual_public__2Fassets_2Ffigma_2FimgEbay_default)} alt="eBay" data-v-4b400519><img${ssrRenderAttr("src", _virtual_public__2Fassets_2Ffigma_2FimgFacebook_default)} alt="Facebook" data-v-4b400519><img${ssrRenderAttr("src", _virtual_public__2Fassets_2Ffigma_2FimgEtsy_default)} alt="Etsy" data-v-4b400519><img${ssrRenderAttr("src", _virtual_public__2Fassets_2Ffigma_2FimgAmazon_default)} alt="Amazon" data-v-4b400519><img${ssrRenderAttr("src", _virtual_public__2Fassets_2Ffigma_2FimgNetflix_default)} alt="Netflix" data-v-4b400519><img${ssrRenderAttr("src", _virtual_public__2Fassets_2Ffigma_2FimgTiktok_default)} alt="TikTok" data-v-4b400519><img${ssrRenderAttr("src", _virtual_public__2Fassets_2Ffigma_2FimgYoutube_default)} alt="YouTube" data-v-4b400519><img${ssrRenderAttr("src", _virtual_public__2Fassets_2Ffigma_2FimgTemu_default)} alt="Temu" data-v-4b400519><img${ssrRenderAttr("src", _virtual_public__2Fassets_2Ffigma_2FimgBestuy_default)} alt="Best Buy" data-v-4b400519><img${ssrRenderAttr("src", _virtual_public__2Fassets_2Ffigma_2FimgShopee_default)} alt="Shopee" data-v-4b400519></div><div class="logo-set" aria-hidden="true" data-v-4b400519><img${ssrRenderAttr("src", _virtual_public__2Fassets_2Ffigma_2FimgAliexpress_default)} alt="" data-v-4b400519><img${ssrRenderAttr("src", _virtual_public__2Fassets_2Ffigma_2FimgShopify_default)} alt="" data-v-4b400519><img${ssrRenderAttr("src", _virtual_public__2Fassets_2Ffigma_2FimgEbay_default)} alt="" data-v-4b400519><img${ssrRenderAttr("src", _virtual_public__2Fassets_2Ffigma_2FimgFacebook_default)} alt="" data-v-4b400519><img${ssrRenderAttr("src", _virtual_public__2Fassets_2Ffigma_2FimgEtsy_default)} alt="" data-v-4b400519><img${ssrRenderAttr("src", _virtual_public__2Fassets_2Ffigma_2FimgAmazon_default)} alt="" data-v-4b400519><img${ssrRenderAttr("src", _virtual_public__2Fassets_2Ffigma_2FimgNetflix_default)} alt="" data-v-4b400519><img${ssrRenderAttr("src", _virtual_public__2Fassets_2Ffigma_2FimgTiktok_default)} alt="" data-v-4b400519><img${ssrRenderAttr("src", _virtual_public__2Fassets_2Ffigma_2FimgYoutube_default)} alt="" data-v-4b400519><img${ssrRenderAttr("src", _virtual_public__2Fassets_2Ffigma_2FimgTemu_default)} alt="" data-v-4b400519><img${ssrRenderAttr("src", _virtual_public__2Fassets_2Ffigma_2FimgBestuy_default)} alt="" data-v-4b400519><img${ssrRenderAttr("src", _virtual_public__2Fassets_2Ffigma_2FimgShopee_default)} alt="" data-v-4b400519></div></div></section>`);
			if (unref(pending) || unref(results)) {
				_push(`<section class="section-panel batch-results" id="batch-results" data-v-4b400519><div class="information-inner" data-v-4b400519><div class="section-head" data-v-4b400519><h2 class="reveal" data-v-4b400519>${ssrInterpolate(unref(t)("batch.resultsTitle"))}</h2><p class="reveal" data-v-4b400519>${ssrInterpolate(unref(t)("batch.resultsSubtitle"))}</p></div>`);
				if (unref(results)) _push(`<div class="status-grid batch-summary" data-v-4b400519><article data-v-4b400519><strong data-v-4b400519>${ssrInterpolate(unref(summary).total)}</strong><span data-v-4b400519>${ssrInterpolate(unref(t)("batch.summaryIps"))}</span></article><article data-v-4b400519><strong data-v-4b400519>${ssrInterpolate(unref(summary).low)}</strong><span data-v-4b400519>${ssrInterpolate(unref(t)("batch.summaryLow"))}</span></article><article data-v-4b400519><strong data-v-4b400519>${ssrInterpolate(unref(summary).flagged)}</strong><span data-v-4b400519>${ssrInterpolate(unref(t)("batch.summaryFlagged"))}</span></article><article data-v-4b400519><strong data-v-4b400519>${ssrInterpolate(unref(summary).failed)}</strong><span data-v-4b400519>${ssrInterpolate(unref(t)("batch.summaryFailed"))}</span></article></div>`);
				else _push(`<!---->`);
				if (unref(results)) _push(`<div class="tabs batch-tabs" role="tablist" data-v-4b400519><span class="${ssrRenderClass([{
					ready: unref(tabsPill).ready,
					snap: unref(tabsPill).snap
				}, "tabs-morph-pill"])}" style="${ssrRenderStyle({
					transform: `translate(${unref(tabsPill).x}px, ${unref(tabsPill).y}px)`,
					width: `${unref(tabsPill).w}px`
				})}" aria-hidden="true" data-v-4b400519></span><button class="${ssrRenderClass({ active: unref(activeTab) === "basic" })}" type="button" role="tab"${ssrRenderAttr("aria-selected", unref(activeTab) === "basic")} data-v-4b400519>${ssrInterpolate(unref(t)("batch.tabBasic"))}</button><button class="${ssrRenderClass({ active: unref(activeTab) === "platforms" })}" type="button" role="tab"${ssrRenderAttr("aria-selected", unref(activeTab) === "platforms")} data-v-4b400519>${ssrInterpolate(unref(t)("batch.tabPlatforms"))}</button></div>`);
				else _push(`<!---->`);
				if (unref(pending) && !unref(results)) _push(`<div class="batch-table-card batch-table-pending" data-v-4b400519><p data-v-4b400519>${ssrInterpolate(unref(scanningLabel))}</p></div>`);
				else _push(`<!---->`);
				if (unref(results) && unref(activeTab) === "basic") {
					_push(`<div class="batch-table-card" data-v-4b400519><span class="${ssrRenderClass([{
						visible: unref(tablePill).visible,
						snap: unref(tablePill).snap
					}, "batch-table-pill"])}" style="${ssrRenderStyle({
						transform: `translate(${unref(tablePill).x}px, ${unref(tablePill).y}px)`,
						width: `${unref(tablePill).w}px`,
						height: `${unref(tablePill).h}px`
					})}" aria-hidden="true" data-v-4b400519></span>`);
					_push(ssrRenderComponent(unref(Table_default), { class: "batch-table" }, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(ssrRenderComponent(unref(TableHeader_default), null, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(ssrRenderComponent(unref(TableRow_default), { class: "batch-table-head-row hover:bg-transparent" }, {
											default: withCtx((_, _push, _parent, _scopeId) => {
												if (_push) {
													_push(ssrRenderComponent(unref(TableHead_default), { class: "h-11 pl-4 pr-2" }, {
														default: withCtx((_, _push, _parent, _scopeId) => {
															if (_push) _push(`${ssrInterpolate(unref(t)("batch.colIp"))}`);
															else return [createTextVNode(toDisplayString(unref(t)("batch.colIp")), 1)];
														}),
														_: 1
													}, _parent, _scopeId));
													_push(ssrRenderComponent(unref(TableHead_default), { class: "h-11 px-2" }, {
														default: withCtx((_, _push, _parent, _scopeId) => {
															if (_push) _push(`${ssrInterpolate(unref(t)("batch.colLocation"))}`);
															else return [createTextVNode(toDisplayString(unref(t)("batch.colLocation")), 1)];
														}),
														_: 1
													}, _parent, _scopeId));
													_push(ssrRenderComponent(unref(TableHead_default), { class: "h-11 px-2" }, {
														default: withCtx((_, _push, _parent, _scopeId) => {
															if (_push) _push(`${ssrInterpolate(unref(t)("batch.colIsp"))}`);
															else return [createTextVNode(toDisplayString(unref(t)("batch.colIsp")), 1)];
														}),
														_: 1
													}, _parent, _scopeId));
													_push(ssrRenderComponent(unref(TableHead_default), { class: "h-11 px-2" }, {
														default: withCtx((_, _push, _parent, _scopeId) => {
															if (_push) _push(`${ssrInterpolate(unref(t)("batch.colSignals"))}`);
															else return [createTextVNode(toDisplayString(unref(t)("batch.colSignals")), 1)];
														}),
														_: 1
													}, _parent, _scopeId));
													_push(ssrRenderComponent(unref(TableHead_default), { class: "h-11 px-2" }, {
														default: withCtx((_, _push, _parent, _scopeId) => {
															if (_push) _push(`${ssrInterpolate(unref(t)("status.riskScore"))}`);
															else return [createTextVNode(toDisplayString(unref(t)("status.riskScore")), 1)];
														}),
														_: 1
													}, _parent, _scopeId));
													_push(ssrRenderComponent(unref(TableHead_default), { class: "h-11 pl-2 pr-4" }, {
														default: withCtx((_, _push, _parent, _scopeId) => {
															if (_push) _push(`${ssrInterpolate(unref(t)("batch.colVerdict"))}`);
															else return [createTextVNode(toDisplayString(unref(t)("batch.colVerdict")), 1)];
														}),
														_: 1
													}, _parent, _scopeId));
												} else return [
													createVNode(unref(TableHead_default), { class: "h-11 pl-4 pr-2" }, {
														default: withCtx(() => [createTextVNode(toDisplayString(unref(t)("batch.colIp")), 1)]),
														_: 1
													}),
													createVNode(unref(TableHead_default), { class: "h-11 px-2" }, {
														default: withCtx(() => [createTextVNode(toDisplayString(unref(t)("batch.colLocation")), 1)]),
														_: 1
													}),
													createVNode(unref(TableHead_default), { class: "h-11 px-2" }, {
														default: withCtx(() => [createTextVNode(toDisplayString(unref(t)("batch.colIsp")), 1)]),
														_: 1
													}),
													createVNode(unref(TableHead_default), { class: "h-11 px-2" }, {
														default: withCtx(() => [createTextVNode(toDisplayString(unref(t)("batch.colSignals")), 1)]),
														_: 1
													}),
													createVNode(unref(TableHead_default), { class: "h-11 px-2" }, {
														default: withCtx(() => [createTextVNode(toDisplayString(unref(t)("status.riskScore")), 1)]),
														_: 1
													}),
													createVNode(unref(TableHead_default), { class: "h-11 pl-2 pr-4" }, {
														default: withCtx(() => [createTextVNode(toDisplayString(unref(t)("batch.colVerdict")), 1)]),
														_: 1
													})
												];
											}),
											_: 1
										}, _parent, _scopeId));
										else return [createVNode(unref(TableRow_default), { class: "batch-table-head-row hover:bg-transparent" }, {
											default: withCtx(() => [
												createVNode(unref(TableHead_default), { class: "h-11 pl-4 pr-2" }, {
													default: withCtx(() => [createTextVNode(toDisplayString(unref(t)("batch.colIp")), 1)]),
													_: 1
												}),
												createVNode(unref(TableHead_default), { class: "h-11 px-2" }, {
													default: withCtx(() => [createTextVNode(toDisplayString(unref(t)("batch.colLocation")), 1)]),
													_: 1
												}),
												createVNode(unref(TableHead_default), { class: "h-11 px-2" }, {
													default: withCtx(() => [createTextVNode(toDisplayString(unref(t)("batch.colIsp")), 1)]),
													_: 1
												}),
												createVNode(unref(TableHead_default), { class: "h-11 px-2" }, {
													default: withCtx(() => [createTextVNode(toDisplayString(unref(t)("batch.colSignals")), 1)]),
													_: 1
												}),
												createVNode(unref(TableHead_default), { class: "h-11 px-2" }, {
													default: withCtx(() => [createTextVNode(toDisplayString(unref(t)("status.riskScore")), 1)]),
													_: 1
												}),
												createVNode(unref(TableHead_default), { class: "h-11 pl-2 pr-4" }, {
													default: withCtx(() => [createTextVNode(toDisplayString(unref(t)("batch.colVerdict")), 1)]),
													_: 1
												})
											]),
											_: 1
										})];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(ssrRenderComponent(unref(TableBody_default), null, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) {
											_push(`<!--[-->`);
											ssrRenderList(unref(results), (entry) => {
												_push(`<!--[-->`);
												if (entry.status === "ok") _push(ssrRenderComponent(unref(TableRow_default), {
													class: "hover:bg-transparent",
													onMouseenter: moveTablePill
												}, {
													default: withCtx((_, _push, _parent, _scopeId) => {
														if (_push) {
															_push(ssrRenderComponent(unref(TableCell_default), { class: "py-4 pl-4 pr-2" }, {
																default: withCtx((_, _push, _parent, _scopeId) => {
																	if (_push) _push(ssrRenderComponent(_component_NuxtLink, {
																		class: "batch-ip-link",
																		to: `/check?ip=${encodeURIComponent(entry.data.ip)}`,
																		title: unref(t)("batch.viewReport")
																	}, {
																		default: withCtx((_, _push, _parent, _scopeId) => {
																			if (_push) _push(`${ssrInterpolate(entry.data.ip)}`);
																			else return [createTextVNode(toDisplayString(entry.data.ip), 1)];
																		}),
																		_: 2
																	}, _parent, _scopeId));
																	else return [createVNode(_component_NuxtLink, {
																		class: "batch-ip-link",
																		to: `/check?ip=${encodeURIComponent(entry.data.ip)}`,
																		title: unref(t)("batch.viewReport")
																	}, {
																		default: withCtx(() => [createTextVNode(toDisplayString(entry.data.ip), 1)]),
																		_: 2
																	}, 1032, ["to", "title"])];
																}),
																_: 2
															}, _parent, _scopeId));
															_push(ssrRenderComponent(unref(TableCell_default), { class: "py-4 px-2" }, {
																default: withCtx((_, _push, _parent, _scopeId) => {
																	if (_push) {
																		_push(`<span class="batch-location" data-v-4b400519${_scopeId}>`);
																		if (entry.data.country_code) _push(`<img class="country-flag-icon"${ssrRenderAttr("src", `/assets/icons/flags/${entry.data.country_code.toUpperCase()}.svg`)} alt="" data-v-4b400519${_scopeId}>`);
																		else _push(`<!---->`);
																		_push(`<span data-v-4b400519${_scopeId}>${ssrInterpolate(countryName(entry.data.country_code))}`);
																		if (entry.data.city) _push(`<em data-v-4b400519${_scopeId}> / ${ssrInterpolate(entry.data.city)}</em>`);
																		else _push(`<!---->`);
																		_push(`</span></span>`);
																	} else return [createVNode("span", { class: "batch-location" }, [entry.data.country_code ? (openBlock(), createBlock("img", {
																		key: 0,
																		class: "country-flag-icon",
																		src: `/assets/icons/flags/${entry.data.country_code.toUpperCase()}.svg`,
																		alt: ""
																	}, null, 8, ["src"])) : createCommentVNode("", true), createVNode("span", null, [createTextVNode(toDisplayString(countryName(entry.data.country_code)), 1), entry.data.city ? (openBlock(), createBlock("em", { key: 0 }, " / " + toDisplayString(entry.data.city), 1)) : createCommentVNode("", true)])])];
																}),
																_: 2
															}, _parent, _scopeId));
															_push(ssrRenderComponent(unref(TableCell_default), { class: "py-4 px-2" }, {
																default: withCtx((_, _push, _parent, _scopeId) => {
																	if (_push) {
																		_push(`<span class="batch-isp" data-v-4b400519${_scopeId}><b data-v-4b400519${_scopeId}>${ssrInterpolate(entry.data.ISP || unref(t)("misc.na"))}</b>`);
																		if (entry.data.ASN) _push(`<small data-v-4b400519${_scopeId}>AS${ssrInterpolate(entry.data.ASN)}</small>`);
																		else _push(`<!---->`);
																		_push(`</span>`);
																	} else return [createVNode("span", { class: "batch-isp" }, [createVNode("b", null, toDisplayString(entry.data.ISP || unref(t)("misc.na")), 1), entry.data.ASN ? (openBlock(), createBlock("small", { key: 0 }, "AS" + toDisplayString(entry.data.ASN), 1)) : createCommentVNode("", true)])];
																}),
																_: 2
															}, _parent, _scopeId));
															_push(ssrRenderComponent(unref(TableCell_default), { class: "py-4 px-2" }, {
																default: withCtx((_, _push, _parent, _scopeId) => {
																	if (_push) {
																		if (signalChips(entry.data).length) {
																			_push(`<span class="batch-signals" data-v-4b400519${_scopeId}><!--[-->`);
																			ssrRenderList(signalChips(entry.data), (chip) => {
																				_push(`<i class="${ssrRenderClass(chip.level)}" data-v-4b400519${_scopeId}>${ssrInterpolate(chip.label)}</i>`);
																			});
																			_push(`<!--]--></span>`);
																		} else _push(`<span class="batch-clean" data-v-4b400519${_scopeId}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-4b400519${_scopeId}><path d="M20 6 9 17l-5-5" data-v-4b400519${_scopeId}></path></svg> ${ssrInterpolate(unref(t)("batch.clean"))}</span>`);
																	} else return [signalChips(entry.data).length ? (openBlock(), createBlock("span", {
																		key: 0,
																		class: "batch-signals"
																	}, [(openBlock(true), createBlock(Fragment, null, renderList(signalChips(entry.data), (chip) => {
																		return openBlock(), createBlock("i", {
																			key: chip.label,
																			class: chip.level
																		}, toDisplayString(chip.label), 3);
																	}), 128))])) : (openBlock(), createBlock("span", {
																		key: 1,
																		class: "batch-clean"
																	}, [(openBlock(), createBlock("svg", {
																		viewBox: "0 0 24 24",
																		fill: "none",
																		stroke: "currentColor",
																		"stroke-width": "2.2",
																		"stroke-linecap": "round",
																		"stroke-linejoin": "round",
																		"aria-hidden": "true"
																	}, [createVNode("path", { d: "M20 6 9 17l-5-5" })])), createTextVNode(" " + toDisplayString(unref(t)("batch.clean")), 1)]))];
																}),
																_: 2
															}, _parent, _scopeId));
															_push(ssrRenderComponent(unref(TableCell_default), { class: "py-4 px-2" }, {
																default: withCtx((_, _push, _parent, _scopeId) => {
																	if (_push) _push(`<span class="batch-risk" data-v-4b400519${_scopeId}><b class="${ssrRenderClass(`risk-number-${riskLevel(entry.data.risk_score)}`)}" data-v-4b400519${_scopeId}>${ssrInterpolate(unref(formatRiskScore)(entry.data.risk_score))}</b><em class="${ssrRenderClass(`risk-${riskLevel(entry.data.risk_score)}`)}" data-v-4b400519${_scopeId}>${ssrInterpolate(riskLabel(entry.data.risk_score))}</em></span>`);
																	else return [createVNode("span", { class: "batch-risk" }, [createVNode("b", { class: `risk-number-${riskLevel(entry.data.risk_score)}` }, toDisplayString(unref(formatRiskScore)(entry.data.risk_score)), 3), createVNode("em", { class: `risk-${riskLevel(entry.data.risk_score)}` }, toDisplayString(riskLabel(entry.data.risk_score)), 3)])];
																}),
																_: 2
															}, _parent, _scopeId));
															_push(ssrRenderComponent(unref(TableCell_default), { class: "py-4 pl-2 pr-4" }, {
																default: withCtx((_, _push, _parent, _scopeId) => {
																	if (_push) _push(`<span class="batch-verdict" data-v-4b400519${_scopeId}>${ssrInterpolate(unref(analysisFor)(entry.data, unref(t)).title)}</span>`);
																	else return [createVNode("span", { class: "batch-verdict" }, toDisplayString(unref(analysisFor)(entry.data, unref(t)).title), 1)];
																}),
																_: 2
															}, _parent, _scopeId));
														} else return [
															createVNode(unref(TableCell_default), { class: "py-4 pl-4 pr-2" }, {
																default: withCtx(() => [createVNode(_component_NuxtLink, {
																	class: "batch-ip-link",
																	to: `/check?ip=${encodeURIComponent(entry.data.ip)}`,
																	title: unref(t)("batch.viewReport")
																}, {
																	default: withCtx(() => [createTextVNode(toDisplayString(entry.data.ip), 1)]),
																	_: 2
																}, 1032, ["to", "title"])]),
																_: 2
															}, 1024),
															createVNode(unref(TableCell_default), { class: "py-4 px-2" }, {
																default: withCtx(() => [createVNode("span", { class: "batch-location" }, [entry.data.country_code ? (openBlock(), createBlock("img", {
																	key: 0,
																	class: "country-flag-icon",
																	src: `/assets/icons/flags/${entry.data.country_code.toUpperCase()}.svg`,
																	alt: ""
																}, null, 8, ["src"])) : createCommentVNode("", true), createVNode("span", null, [createTextVNode(toDisplayString(countryName(entry.data.country_code)), 1), entry.data.city ? (openBlock(), createBlock("em", { key: 0 }, " / " + toDisplayString(entry.data.city), 1)) : createCommentVNode("", true)])])]),
																_: 2
															}, 1024),
															createVNode(unref(TableCell_default), { class: "py-4 px-2" }, {
																default: withCtx(() => [createVNode("span", { class: "batch-isp" }, [createVNode("b", null, toDisplayString(entry.data.ISP || unref(t)("misc.na")), 1), entry.data.ASN ? (openBlock(), createBlock("small", { key: 0 }, "AS" + toDisplayString(entry.data.ASN), 1)) : createCommentVNode("", true)])]),
																_: 2
															}, 1024),
															createVNode(unref(TableCell_default), { class: "py-4 px-2" }, {
																default: withCtx(() => [signalChips(entry.data).length ? (openBlock(), createBlock("span", {
																	key: 0,
																	class: "batch-signals"
																}, [(openBlock(true), createBlock(Fragment, null, renderList(signalChips(entry.data), (chip) => {
																	return openBlock(), createBlock("i", {
																		key: chip.label,
																		class: chip.level
																	}, toDisplayString(chip.label), 3);
																}), 128))])) : (openBlock(), createBlock("span", {
																	key: 1,
																	class: "batch-clean"
																}, [(openBlock(), createBlock("svg", {
																	viewBox: "0 0 24 24",
																	fill: "none",
																	stroke: "currentColor",
																	"stroke-width": "2.2",
																	"stroke-linecap": "round",
																	"stroke-linejoin": "round",
																	"aria-hidden": "true"
																}, [createVNode("path", { d: "M20 6 9 17l-5-5" })])), createTextVNode(" " + toDisplayString(unref(t)("batch.clean")), 1)]))]),
																_: 2
															}, 1024),
															createVNode(unref(TableCell_default), { class: "py-4 px-2" }, {
																default: withCtx(() => [createVNode("span", { class: "batch-risk" }, [createVNode("b", { class: `risk-number-${riskLevel(entry.data.risk_score)}` }, toDisplayString(unref(formatRiskScore)(entry.data.risk_score)), 3), createVNode("em", { class: `risk-${riskLevel(entry.data.risk_score)}` }, toDisplayString(riskLabel(entry.data.risk_score)), 3)])]),
																_: 2
															}, 1024),
															createVNode(unref(TableCell_default), { class: "py-4 pl-2 pr-4" }, {
																default: withCtx(() => [createVNode("span", { class: "batch-verdict" }, toDisplayString(unref(analysisFor)(entry.data, unref(t)).title), 1)]),
																_: 2
															}, 1024)
														];
													}),
													_: 2
												}, _parent, _scopeId));
												else _push(ssrRenderComponent(unref(TableRow_default), {
													class: "hover:bg-transparent",
													onMouseenter: moveTablePill
												}, {
													default: withCtx((_, _push, _parent, _scopeId) => {
														if (_push) _push(ssrRenderComponent(unref(TableCell_default), {
															colspan: 6,
															class: "py-4 pl-4 pr-4"
														}, {
															default: withCtx((_, _push, _parent, _scopeId) => {
																if (_push) _push(`<span class="batch-row-error" data-v-4b400519${_scopeId}><b class="batch-ip-link batch-ip-static" data-v-4b400519${_scopeId}>${ssrInterpolate(entry.ip)}</b><span data-v-4b400519${_scopeId}>${ssrInterpolate(unref(t)("batch.rowFailed"))}: ${ssrInterpolate(entry.error)}</span></span>`);
																else return [createVNode("span", { class: "batch-row-error" }, [createVNode("b", { class: "batch-ip-link batch-ip-static" }, toDisplayString(entry.ip), 1), createVNode("span", null, toDisplayString(unref(t)("batch.rowFailed")) + ": " + toDisplayString(entry.error), 1)])];
															}),
															_: 2
														}, _parent, _scopeId));
														else return [createVNode(unref(TableCell_default), {
															colspan: 6,
															class: "py-4 pl-4 pr-4"
														}, {
															default: withCtx(() => [createVNode("span", { class: "batch-row-error" }, [createVNode("b", { class: "batch-ip-link batch-ip-static" }, toDisplayString(entry.ip), 1), createVNode("span", null, toDisplayString(unref(t)("batch.rowFailed")) + ": " + toDisplayString(entry.error), 1)])]),
															_: 2
														}, 1024)];
													}),
													_: 2
												}, _parent, _scopeId));
												_push(`<!--]-->`);
											});
											_push(`<!--]-->`);
										} else return [(openBlock(true), createBlock(Fragment, null, renderList(unref(results), (entry) => {
											return openBlock(), createBlock(Fragment, { key: entry.ip }, [entry.status === "ok" ? (openBlock(), createBlock(unref(TableRow_default), {
												key: 0,
												class: "hover:bg-transparent",
												onMouseenter: moveTablePill
											}, {
												default: withCtx(() => [
													createVNode(unref(TableCell_default), { class: "py-4 pl-4 pr-2" }, {
														default: withCtx(() => [createVNode(_component_NuxtLink, {
															class: "batch-ip-link",
															to: `/check?ip=${encodeURIComponent(entry.data.ip)}`,
															title: unref(t)("batch.viewReport")
														}, {
															default: withCtx(() => [createTextVNode(toDisplayString(entry.data.ip), 1)]),
															_: 2
														}, 1032, ["to", "title"])]),
														_: 2
													}, 1024),
													createVNode(unref(TableCell_default), { class: "py-4 px-2" }, {
														default: withCtx(() => [createVNode("span", { class: "batch-location" }, [entry.data.country_code ? (openBlock(), createBlock("img", {
															key: 0,
															class: "country-flag-icon",
															src: `/assets/icons/flags/${entry.data.country_code.toUpperCase()}.svg`,
															alt: ""
														}, null, 8, ["src"])) : createCommentVNode("", true), createVNode("span", null, [createTextVNode(toDisplayString(countryName(entry.data.country_code)), 1), entry.data.city ? (openBlock(), createBlock("em", { key: 0 }, " / " + toDisplayString(entry.data.city), 1)) : createCommentVNode("", true)])])]),
														_: 2
													}, 1024),
													createVNode(unref(TableCell_default), { class: "py-4 px-2" }, {
														default: withCtx(() => [createVNode("span", { class: "batch-isp" }, [createVNode("b", null, toDisplayString(entry.data.ISP || unref(t)("misc.na")), 1), entry.data.ASN ? (openBlock(), createBlock("small", { key: 0 }, "AS" + toDisplayString(entry.data.ASN), 1)) : createCommentVNode("", true)])]),
														_: 2
													}, 1024),
													createVNode(unref(TableCell_default), { class: "py-4 px-2" }, {
														default: withCtx(() => [signalChips(entry.data).length ? (openBlock(), createBlock("span", {
															key: 0,
															class: "batch-signals"
														}, [(openBlock(true), createBlock(Fragment, null, renderList(signalChips(entry.data), (chip) => {
															return openBlock(), createBlock("i", {
																key: chip.label,
																class: chip.level
															}, toDisplayString(chip.label), 3);
														}), 128))])) : (openBlock(), createBlock("span", {
															key: 1,
															class: "batch-clean"
														}, [(openBlock(), createBlock("svg", {
															viewBox: "0 0 24 24",
															fill: "none",
															stroke: "currentColor",
															"stroke-width": "2.2",
															"stroke-linecap": "round",
															"stroke-linejoin": "round",
															"aria-hidden": "true"
														}, [createVNode("path", { d: "M20 6 9 17l-5-5" })])), createTextVNode(" " + toDisplayString(unref(t)("batch.clean")), 1)]))]),
														_: 2
													}, 1024),
													createVNode(unref(TableCell_default), { class: "py-4 px-2" }, {
														default: withCtx(() => [createVNode("span", { class: "batch-risk" }, [createVNode("b", { class: `risk-number-${riskLevel(entry.data.risk_score)}` }, toDisplayString(unref(formatRiskScore)(entry.data.risk_score)), 3), createVNode("em", { class: `risk-${riskLevel(entry.data.risk_score)}` }, toDisplayString(riskLabel(entry.data.risk_score)), 3)])]),
														_: 2
													}, 1024),
													createVNode(unref(TableCell_default), { class: "py-4 pl-2 pr-4" }, {
														default: withCtx(() => [createVNode("span", { class: "batch-verdict" }, toDisplayString(unref(analysisFor)(entry.data, unref(t)).title), 1)]),
														_: 2
													}, 1024)
												]),
												_: 2
											}, 1024)) : (openBlock(), createBlock(unref(TableRow_default), {
												key: 1,
												class: "hover:bg-transparent",
												onMouseenter: moveTablePill
											}, {
												default: withCtx(() => [createVNode(unref(TableCell_default), {
													colspan: 6,
													class: "py-4 pl-4 pr-4"
												}, {
													default: withCtx(() => [createVNode("span", { class: "batch-row-error" }, [createVNode("b", { class: "batch-ip-link batch-ip-static" }, toDisplayString(entry.ip), 1), createVNode("span", null, toDisplayString(unref(t)("batch.rowFailed")) + ": " + toDisplayString(entry.error), 1)])]),
													_: 2
												}, 1024)]),
												_: 2
											}, 1024))], 64);
										}), 128))];
									}),
									_: 1
								}, _parent, _scopeId));
							} else return [createVNode(unref(TableHeader_default), null, {
								default: withCtx(() => [createVNode(unref(TableRow_default), { class: "batch-table-head-row hover:bg-transparent" }, {
									default: withCtx(() => [
										createVNode(unref(TableHead_default), { class: "h-11 pl-4 pr-2" }, {
											default: withCtx(() => [createTextVNode(toDisplayString(unref(t)("batch.colIp")), 1)]),
											_: 1
										}),
										createVNode(unref(TableHead_default), { class: "h-11 px-2" }, {
											default: withCtx(() => [createTextVNode(toDisplayString(unref(t)("batch.colLocation")), 1)]),
											_: 1
										}),
										createVNode(unref(TableHead_default), { class: "h-11 px-2" }, {
											default: withCtx(() => [createTextVNode(toDisplayString(unref(t)("batch.colIsp")), 1)]),
											_: 1
										}),
										createVNode(unref(TableHead_default), { class: "h-11 px-2" }, {
											default: withCtx(() => [createTextVNode(toDisplayString(unref(t)("batch.colSignals")), 1)]),
											_: 1
										}),
										createVNode(unref(TableHead_default), { class: "h-11 px-2" }, {
											default: withCtx(() => [createTextVNode(toDisplayString(unref(t)("status.riskScore")), 1)]),
											_: 1
										}),
										createVNode(unref(TableHead_default), { class: "h-11 pl-2 pr-4" }, {
											default: withCtx(() => [createTextVNode(toDisplayString(unref(t)("batch.colVerdict")), 1)]),
											_: 1
										})
									]),
									_: 1
								})]),
								_: 1
							}), createVNode(unref(TableBody_default), null, {
								default: withCtx(() => [(openBlock(true), createBlock(Fragment, null, renderList(unref(results), (entry) => {
									return openBlock(), createBlock(Fragment, { key: entry.ip }, [entry.status === "ok" ? (openBlock(), createBlock(unref(TableRow_default), {
										key: 0,
										class: "hover:bg-transparent",
										onMouseenter: moveTablePill
									}, {
										default: withCtx(() => [
											createVNode(unref(TableCell_default), { class: "py-4 pl-4 pr-2" }, {
												default: withCtx(() => [createVNode(_component_NuxtLink, {
													class: "batch-ip-link",
													to: `/check?ip=${encodeURIComponent(entry.data.ip)}`,
													title: unref(t)("batch.viewReport")
												}, {
													default: withCtx(() => [createTextVNode(toDisplayString(entry.data.ip), 1)]),
													_: 2
												}, 1032, ["to", "title"])]),
												_: 2
											}, 1024),
											createVNode(unref(TableCell_default), { class: "py-4 px-2" }, {
												default: withCtx(() => [createVNode("span", { class: "batch-location" }, [entry.data.country_code ? (openBlock(), createBlock("img", {
													key: 0,
													class: "country-flag-icon",
													src: `/assets/icons/flags/${entry.data.country_code.toUpperCase()}.svg`,
													alt: ""
												}, null, 8, ["src"])) : createCommentVNode("", true), createVNode("span", null, [createTextVNode(toDisplayString(countryName(entry.data.country_code)), 1), entry.data.city ? (openBlock(), createBlock("em", { key: 0 }, " / " + toDisplayString(entry.data.city), 1)) : createCommentVNode("", true)])])]),
												_: 2
											}, 1024),
											createVNode(unref(TableCell_default), { class: "py-4 px-2" }, {
												default: withCtx(() => [createVNode("span", { class: "batch-isp" }, [createVNode("b", null, toDisplayString(entry.data.ISP || unref(t)("misc.na")), 1), entry.data.ASN ? (openBlock(), createBlock("small", { key: 0 }, "AS" + toDisplayString(entry.data.ASN), 1)) : createCommentVNode("", true)])]),
												_: 2
											}, 1024),
											createVNode(unref(TableCell_default), { class: "py-4 px-2" }, {
												default: withCtx(() => [signalChips(entry.data).length ? (openBlock(), createBlock("span", {
													key: 0,
													class: "batch-signals"
												}, [(openBlock(true), createBlock(Fragment, null, renderList(signalChips(entry.data), (chip) => {
													return openBlock(), createBlock("i", {
														key: chip.label,
														class: chip.level
													}, toDisplayString(chip.label), 3);
												}), 128))])) : (openBlock(), createBlock("span", {
													key: 1,
													class: "batch-clean"
												}, [(openBlock(), createBlock("svg", {
													viewBox: "0 0 24 24",
													fill: "none",
													stroke: "currentColor",
													"stroke-width": "2.2",
													"stroke-linecap": "round",
													"stroke-linejoin": "round",
													"aria-hidden": "true"
												}, [createVNode("path", { d: "M20 6 9 17l-5-5" })])), createTextVNode(" " + toDisplayString(unref(t)("batch.clean")), 1)]))]),
												_: 2
											}, 1024),
											createVNode(unref(TableCell_default), { class: "py-4 px-2" }, {
												default: withCtx(() => [createVNode("span", { class: "batch-risk" }, [createVNode("b", { class: `risk-number-${riskLevel(entry.data.risk_score)}` }, toDisplayString(unref(formatRiskScore)(entry.data.risk_score)), 3), createVNode("em", { class: `risk-${riskLevel(entry.data.risk_score)}` }, toDisplayString(riskLabel(entry.data.risk_score)), 3)])]),
												_: 2
											}, 1024),
											createVNode(unref(TableCell_default), { class: "py-4 pl-2 pr-4" }, {
												default: withCtx(() => [createVNode("span", { class: "batch-verdict" }, toDisplayString(unref(analysisFor)(entry.data, unref(t)).title), 1)]),
												_: 2
											}, 1024)
										]),
										_: 2
									}, 1024)) : (openBlock(), createBlock(unref(TableRow_default), {
										key: 1,
										class: "hover:bg-transparent",
										onMouseenter: moveTablePill
									}, {
										default: withCtx(() => [createVNode(unref(TableCell_default), {
											colspan: 6,
											class: "py-4 pl-4 pr-4"
										}, {
											default: withCtx(() => [createVNode("span", { class: "batch-row-error" }, [createVNode("b", { class: "batch-ip-link batch-ip-static" }, toDisplayString(entry.ip), 1), createVNode("span", null, toDisplayString(unref(t)("batch.rowFailed")) + ": " + toDisplayString(entry.error), 1)])]),
											_: 2
										}, 1024)]),
										_: 2
									}, 1024))], 64);
								}), 128))]),
								_: 1
							})];
						}),
						_: 1
					}, _parent));
					_push(`</div>`);
				} else _push(`<!---->`);
				if (unref(results) && unref(activeTab) === "platforms") {
					_push(`<div class="batch-table-card" data-v-4b400519><span class="${ssrRenderClass([{
						visible: unref(tablePill).visible,
						snap: unref(tablePill).snap
					}, "batch-table-pill"])}" style="${ssrRenderStyle({
						transform: `translate(${unref(tablePill).x}px, ${unref(tablePill).y}px)`,
						width: `${unref(tablePill).w}px`,
						height: `${unref(tablePill).h}px`
					})}" aria-hidden="true" data-v-4b400519></span>`);
					if (unref(okEntries).length) _push(ssrRenderComponent(unref(Table_default), { class: "batch-table batch-platform-table" }, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(ssrRenderComponent(unref(TableHeader_default), null, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(ssrRenderComponent(unref(TableRow_default), { class: "batch-table-head-row hover:bg-transparent" }, {
											default: withCtx((_, _push, _parent, _scopeId) => {
												if (_push) {
													_push(ssrRenderComponent(unref(TableHead_default), { class: "h-11 pl-4 pr-2" }, {
														default: withCtx((_, _push, _parent, _scopeId) => {
															if (_push) _push(`${ssrInterpolate(unref(t)("batch.colPlatform"))}`);
															else return [createTextVNode(toDisplayString(unref(t)("batch.colPlatform")), 1)];
														}),
														_: 1
													}, _parent, _scopeId));
													_push(`<!--[-->`);
													ssrRenderList(unref(okEntries), (entry) => {
														_push(ssrRenderComponent(unref(TableHead_default), {
															key: entry.ip,
															class: "h-11 px-3"
														}, {
															default: withCtx((_, _push, _parent, _scopeId) => {
																if (_push) _push(`<span class="batch-platform-ip" data-v-4b400519${_scopeId}>${ssrInterpolate(entry.ip)}</span>`);
																else return [createVNode("span", { class: "batch-platform-ip" }, toDisplayString(entry.ip), 1)];
															}),
															_: 2
														}, _parent, _scopeId));
													});
													_push(`<!--]-->`);
												} else return [createVNode(unref(TableHead_default), { class: "h-11 pl-4 pr-2" }, {
													default: withCtx(() => [createTextVNode(toDisplayString(unref(t)("batch.colPlatform")), 1)]),
													_: 1
												}), (openBlock(true), createBlock(Fragment, null, renderList(unref(okEntries), (entry) => {
													return openBlock(), createBlock(unref(TableHead_default), {
														key: entry.ip,
														class: "h-11 px-3"
													}, {
														default: withCtx(() => [createVNode("span", { class: "batch-platform-ip" }, toDisplayString(entry.ip), 1)]),
														_: 2
													}, 1024);
												}), 128))];
											}),
											_: 1
										}, _parent, _scopeId));
										else return [createVNode(unref(TableRow_default), { class: "batch-table-head-row hover:bg-transparent" }, {
											default: withCtx(() => [createVNode(unref(TableHead_default), { class: "h-11 pl-4 pr-2" }, {
												default: withCtx(() => [createTextVNode(toDisplayString(unref(t)("batch.colPlatform")), 1)]),
												_: 1
											}), (openBlock(true), createBlock(Fragment, null, renderList(unref(okEntries), (entry) => {
												return openBlock(), createBlock(unref(TableHead_default), {
													key: entry.ip,
													class: "h-11 px-3"
												}, {
													default: withCtx(() => [createVNode("span", { class: "batch-platform-ip" }, toDisplayString(entry.ip), 1)]),
													_: 2
												}, 1024);
											}), 128))]),
											_: 1
										})];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(ssrRenderComponent(unref(TableBody_default), null, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) {
											_push(`<!--[-->`);
											ssrRenderList(unref(BATCH_PLATFORMS), (platform) => {
												_push(ssrRenderComponent(unref(TableRow_default), {
													key: platform.name,
													class: "hover:bg-transparent",
													onMouseenter: moveTablePill
												}, {
													default: withCtx((_, _push, _parent, _scopeId) => {
														if (_push) {
															_push(ssrRenderComponent(unref(TableCell_default), { class: "py-4 pl-4 pr-2" }, {
																default: withCtx((_, _push, _parent, _scopeId) => {
																	if (_push) {
																		_push(`<span class="batch-platform-name" data-v-4b400519${_scopeId}>`);
																		_push(ssrRenderComponent(_component_PlatformBrandIcon, {
																			name: platform.name,
																			src: platform.icon
																		}, null, _parent, _scopeId));
																		_push(` ${ssrInterpolate(platform.name)}</span>`);
																	} else return [createVNode("span", { class: "batch-platform-name" }, [createVNode(_component_PlatformBrandIcon, {
																		name: platform.name,
																		src: platform.icon
																	}, null, 8, ["name", "src"]), createTextVNode(" " + toDisplayString(platform.name), 1)])];
																}),
																_: 2
															}, _parent, _scopeId));
															_push(`<!--[-->`);
															ssrRenderList(unref(okEntries), (entry) => {
																_push(ssrRenderComponent(unref(TableCell_default), {
																	key: entry.ip,
																	class: "py-4 px-3"
																}, {
																	default: withCtx((_, _push, _parent, _scopeId) => {
																		if (_push) _push(`<span class="batch-platform-cell" data-v-4b400519${_scopeId}><span class="${ssrRenderClass([scoreTone(platformScore(platform.name, entry.data)), "batch-platform-score"])}" data-v-4b400519${_scopeId}><b data-v-4b400519${_scopeId}>${ssrInterpolate(platformScore(platform.name, entry.data))}</b><i data-v-4b400519${_scopeId}>/100</i></span><span class="${ssrRenderClass([scoreTone(platformScore(platform.name, entry.data)), "batch-platform-meter"])}" data-v-4b400519${_scopeId}><i style="${ssrRenderStyle({ width: `${platformScore(platform.name, entry.data)}%` })}" data-v-4b400519${_scopeId}></i></span></span>`);
																		else return [createVNode("span", { class: "batch-platform-cell" }, [createVNode("span", { class: ["batch-platform-score", scoreTone(platformScore(platform.name, entry.data))] }, [createVNode("b", null, toDisplayString(platformScore(platform.name, entry.data)), 1), createVNode("i", null, "/100")], 2), createVNode("span", { class: ["batch-platform-meter", scoreTone(platformScore(platform.name, entry.data))] }, [createVNode("i", { style: { width: `${platformScore(platform.name, entry.data)}%` } }, null, 4)], 2)])];
																	}),
																	_: 2
																}, _parent, _scopeId));
															});
															_push(`<!--]-->`);
														} else return [createVNode(unref(TableCell_default), { class: "py-4 pl-4 pr-2" }, {
															default: withCtx(() => [createVNode("span", { class: "batch-platform-name" }, [createVNode(_component_PlatformBrandIcon, {
																name: platform.name,
																src: platform.icon
															}, null, 8, ["name", "src"]), createTextVNode(" " + toDisplayString(platform.name), 1)])]),
															_: 2
														}, 1024), (openBlock(true), createBlock(Fragment, null, renderList(unref(okEntries), (entry) => {
															return openBlock(), createBlock(unref(TableCell_default), {
																key: entry.ip,
																class: "py-4 px-3"
															}, {
																default: withCtx(() => [createVNode("span", { class: "batch-platform-cell" }, [createVNode("span", { class: ["batch-platform-score", scoreTone(platformScore(platform.name, entry.data))] }, [createVNode("b", null, toDisplayString(platformScore(platform.name, entry.data)), 1), createVNode("i", null, "/100")], 2), createVNode("span", { class: ["batch-platform-meter", scoreTone(platformScore(platform.name, entry.data))] }, [createVNode("i", { style: { width: `${platformScore(platform.name, entry.data)}%` } }, null, 4)], 2)])]),
																_: 2
															}, 1024);
														}), 128))];
													}),
													_: 2
												}, _parent, _scopeId));
											});
											_push(`<!--]-->`);
										} else return [(openBlock(true), createBlock(Fragment, null, renderList(unref(BATCH_PLATFORMS), (platform) => {
											return openBlock(), createBlock(unref(TableRow_default), {
												key: platform.name,
												class: "hover:bg-transparent",
												onMouseenter: moveTablePill
											}, {
												default: withCtx(() => [createVNode(unref(TableCell_default), { class: "py-4 pl-4 pr-2" }, {
													default: withCtx(() => [createVNode("span", { class: "batch-platform-name" }, [createVNode(_component_PlatformBrandIcon, {
														name: platform.name,
														src: platform.icon
													}, null, 8, ["name", "src"]), createTextVNode(" " + toDisplayString(platform.name), 1)])]),
													_: 2
												}, 1024), (openBlock(true), createBlock(Fragment, null, renderList(unref(okEntries), (entry) => {
													return openBlock(), createBlock(unref(TableCell_default), {
														key: entry.ip,
														class: "py-4 px-3"
													}, {
														default: withCtx(() => [createVNode("span", { class: "batch-platform-cell" }, [createVNode("span", { class: ["batch-platform-score", scoreTone(platformScore(platform.name, entry.data))] }, [createVNode("b", null, toDisplayString(platformScore(platform.name, entry.data)), 1), createVNode("i", null, "/100")], 2), createVNode("span", { class: ["batch-platform-meter", scoreTone(platformScore(platform.name, entry.data))] }, [createVNode("i", { style: { width: `${platformScore(platform.name, entry.data)}%` } }, null, 4)], 2)])]),
														_: 2
													}, 1024);
												}), 128))]),
												_: 2
											}, 1024);
										}), 128))];
									}),
									_: 1
								}, _parent, _scopeId));
							} else return [createVNode(unref(TableHeader_default), null, {
								default: withCtx(() => [createVNode(unref(TableRow_default), { class: "batch-table-head-row hover:bg-transparent" }, {
									default: withCtx(() => [createVNode(unref(TableHead_default), { class: "h-11 pl-4 pr-2" }, {
										default: withCtx(() => [createTextVNode(toDisplayString(unref(t)("batch.colPlatform")), 1)]),
										_: 1
									}), (openBlock(true), createBlock(Fragment, null, renderList(unref(okEntries), (entry) => {
										return openBlock(), createBlock(unref(TableHead_default), {
											key: entry.ip,
											class: "h-11 px-3"
										}, {
											default: withCtx(() => [createVNode("span", { class: "batch-platform-ip" }, toDisplayString(entry.ip), 1)]),
											_: 2
										}, 1024);
									}), 128))]),
									_: 1
								})]),
								_: 1
							}), createVNode(unref(TableBody_default), null, {
								default: withCtx(() => [(openBlock(true), createBlock(Fragment, null, renderList(unref(BATCH_PLATFORMS), (platform) => {
									return openBlock(), createBlock(unref(TableRow_default), {
										key: platform.name,
										class: "hover:bg-transparent",
										onMouseenter: moveTablePill
									}, {
										default: withCtx(() => [createVNode(unref(TableCell_default), { class: "py-4 pl-4 pr-2" }, {
											default: withCtx(() => [createVNode("span", { class: "batch-platform-name" }, [createVNode(_component_PlatformBrandIcon, {
												name: platform.name,
												src: platform.icon
											}, null, 8, ["name", "src"]), createTextVNode(" " + toDisplayString(platform.name), 1)])]),
											_: 2
										}, 1024), (openBlock(true), createBlock(Fragment, null, renderList(unref(okEntries), (entry) => {
											return openBlock(), createBlock(unref(TableCell_default), {
												key: entry.ip,
												class: "py-4 px-3"
											}, {
												default: withCtx(() => [createVNode("span", { class: "batch-platform-cell" }, [createVNode("span", { class: ["batch-platform-score", scoreTone(platformScore(platform.name, entry.data))] }, [createVNode("b", null, toDisplayString(platformScore(platform.name, entry.data)), 1), createVNode("i", null, "/100")], 2), createVNode("span", { class: ["batch-platform-meter", scoreTone(platformScore(platform.name, entry.data))] }, [createVNode("i", { style: { width: `${platformScore(platform.name, entry.data)}%` } }, null, 4)], 2)])]),
												_: 2
											}, 1024);
										}), 128))]),
										_: 2
									}, 1024);
								}), 128))]),
								_: 1
							})];
						}),
						_: 1
					}, _parent));
					else _push(`<p class="batch-table-pending" data-v-4b400519>${ssrInterpolate(unref(t)("batch.noPlatformData"))}</p>`);
					_push(`</div>`);
				} else _push(`<!---->`);
				if (unref(results)) _push(`<button class="batch-rescan" type="button" data-v-4b400519><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-4b400519><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" data-v-4b400519></path><path d="M21 3v5h-5" data-v-4b400519></path></svg><span data-v-4b400519>${ssrInterpolate(unref(t)("batch.rescan"))}</span></button>`);
				else _push(`<!---->`);
				_push(`</div></section>`);
			} else _push(`<!---->`);
			_push(`</main>`);
			_push(ssrRenderComponent(_component_AppFooter, null, null, _parent));
			_push(`<div class="${ssrRenderClass([{ show: unref(toastVisible) }, "copy-toast"])}" role="status" aria-live="polite" data-v-4b400519>${ssrInterpolate(unref(toastMessage))}</div><!--]-->`);
		};
	}
});
//#endregion
//#region app/pages/batch-check.vue
var _sfc_setup = batch_check_vue_vue_type_script_setup_true_lang_default.setup;
batch_check_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/batch-check.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var batch_check_default = /*#__PURE__*/ _plugin_vue_export_helper_default(batch_check_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-4b400519"]]);

export { batch_check_default as default };
//# sourceMappingURL=batch-check-D1VnV_s1.mjs.map
