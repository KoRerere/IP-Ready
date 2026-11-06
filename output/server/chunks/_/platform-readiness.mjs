import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr } from 'vue/server-renderer';

//#region app/components/PlatformBrandIcon.vue?vue&type=script&setup=true&lang.ts
var PlatformBrandIcon_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "PlatformBrandIcon",
	__ssrInlineRender: true,
	props: {
		name: {},
		src: {}
	},
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<span${ssrRenderAttrs(mergeProps({
				class: "platform-brand-icon",
				"aria-hidden": "true"
			}, _attrs))}><img class="brand-leaf fallback-leaf"${ssrRenderAttr("src", __props.src)} alt=""></span>`);
		};
	}
});
//#endregion
//#region app/components/PlatformBrandIcon.vue
var _sfc_setup = PlatformBrandIcon_vue_vue_type_script_setup_true_lang_default.setup;
PlatformBrandIcon_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/PlatformBrandIcon.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var PlatformBrandIcon_default = Object.assign(PlatformBrandIcon_vue_vue_type_script_setup_true_lang_default, { __name: "PlatformBrandIcon" });

const EVALUATED_PLATFORMS = [
  { name: "Claude", category: "ai", icon: "/assets/icons/platform/IP_ic_claude.svg" },
  { name: "ChatGPT", category: "ai", icon: "/assets/icons/platform/IP_ic_chatgpt.svg" },
  { name: "Amazon", category: "ecommerce", icon: "/assets/icons/platform/IP_ic_Amazon.svg" },
  { name: "eBay", category: "ecommerce", icon: "/assets/icons/platform/IP_ic_eBay.svg" },
  { name: "Binance", category: "finance", icon: "/assets/icons/platform/IP_ic_binance.svg" }
];

const REGION_BLOCK_CAP = 25;
const TOR_CAP = 40;
const PLATFORM_MODELS = {
  // AI — Anthropic/OpenAI enforce region blocks (CN/HK unsupported) and ban
  // signups from VPN/datacenter ranges aggressively.
  "Claude": {
    weights: { region: 40, anonymizer: 25, datacenter: 25, abuse: 10 },
    blocked: ["CN", "HK", "MO", "RU", "BY", "IR", "KP", "SY", "CU"],
    sensitivity: { anonymizer: 1, datacenter: 1, abuse: 0.9 }
  },
  "ChatGPT": {
    weights: { region: 40, anonymizer: 25, datacenter: 25, abuse: 10 },
    blocked: ["CN", "HK", "MO", "RU", "BY", "IR", "KP", "SY", "CU"],
    sensitivity: { anonymizer: 1, datacenter: 1, abuse: 0.9 }
  },
  // Google tolerates VPN/datacenter traffic but blocks unsupported regions.
  "Gemini": {
    weights: { region: 45, anonymizer: 20, datacenter: 15, abuse: 20 },
    blocked: ["CN", "RU", "KP", "IR", "SY", "CU"],
    sensitivity: { anonymizer: 0.7, datacenter: 0.5, abuse: 0.7 }
  },
  "Perplexity": {
    weights: { region: 45, anonymizer: 20, datacenter: 15, abuse: 20 },
    blocked: ["CN", "RU", "KP", "IR", "SY", "CU"],
    sensitivity: { anonymizer: 0.7, datacenter: 0.6, abuse: 0.7 }
  },
  "Grok": {
    weights: { region: 45, anonymizer: 25, datacenter: 15, abuse: 15 },
    blocked: ["CN", "RU", "BY", "KP", "IR", "SY", "CU"],
    sensitivity: { anonymizer: 0.8, datacenter: 0.6, abuse: 0.8 }
  },
  // Ecommerce — marketplaces scrutinize signup/payment from anonymizing and
  // datacenter networks; region blocks are narrow but account limits are not.
  "Amazon": {
    weights: { region: 20, anonymizer: 30, datacenter: 30, abuse: 20 },
    blocked: ["CU", "IR", "KP", "SY"],
    sensitivity: { anonymizer: 0.9, datacenter: 0.9, abuse: 0.9 }
  },
  "eBay": {
    weights: { region: 20, anonymizer: 30, datacenter: 30, abuse: 20 },
    blocked: ["CU", "IR", "KP", "SY"],
    sensitivity: { anonymizer: 0.9, datacenter: 0.9, abuse: 0.9 }
  },
  // Etsy reviews/suspends new shops opened from datacenter IPs.
  "Etsy": {
    weights: { region: 20, anonymizer: 25, datacenter: 35, abuse: 20 },
    blocked: ["CU", "IR", "KP", "SY"],
    sensitivity: { anonymizer: 0.8, datacenter: 1, abuse: 0.9 }
  },
  "Shopify": {
    weights: { region: 25, anonymizer: 20, datacenter: 30, abuse: 25 },
    blocked: ["CU", "IR", "KP", "SY"],
    sensitivity: { anonymizer: 0.8, datacenter: 0.8, abuse: 0.9 }
  },
  "AliExpress": {
    weights: { region: 25, anonymizer: 25, datacenter: 25, abuse: 25 },
    blocked: ["CU", "IR", "KP", "SY"],
    sensitivity: { anonymizer: 0.5, datacenter: 0.5, abuse: 0.6 }
  },
  // Binance geo-blocks restricted jurisdictions (US/CA/NL/CN/RU among others)
  // and ToS-violating VPN logins can freeze accounts.
  "Binance": {
    weights: { region: 45, anonymizer: 30, datacenter: 15, abuse: 10 },
    blocked: ["US", "CA", "NL", "CN", "RU", "IR", "KP", "SY", "CU"],
    sensitivity: { anonymizer: 1, datacenter: 0.7, abuse: 0.8 }
  },
  "TikTok Shop": {
    weights: { region: 45, anonymizer: 25, datacenter: 20, abuse: 10 },
    onlyIn: ["US", "MX", "BR", "GB", "IE", "DE", "FR", "IT", "ES", "PL", "JP", "KR", "ID", "MY", "TH", "VN", "PH", "SG", "SA"],
    sensitivity: { anonymizer: 0.9, datacenter: 0.8, abuse: 0.8 }
  },
  // Meta's ad and social products disable new accounts on VPN/datacenter IPs.
  "Facebook Ads": {
    weights: { region: 25, anonymizer: 35, datacenter: 25, abuse: 15 },
    blocked: ["CN", "RU", "IR", "KP", "SY"],
    sensitivity: { anonymizer: 1, datacenter: 0.9, abuse: 0.9 }
  },
  "Instagram Ads": {
    weights: { region: 25, anonymizer: 35, datacenter: 25, abuse: 15 },
    blocked: ["CN", "RU", "IR", "KP", "SY"],
    sensitivity: { anonymizer: 1, datacenter: 0.9, abuse: 0.9 }
  },
  "Facebook": {
    weights: { region: 25, anonymizer: 35, datacenter: 25, abuse: 15 },
    blocked: ["CN", "RU", "IR", "KP", "SY"],
    sensitivity: { anonymizer: 1, datacenter: 0.9, abuse: 0.9 }
  },
  "Instagram": {
    weights: { region: 25, anonymizer: 35, datacenter: 25, abuse: 15 },
    blocked: ["CN", "RU", "IR", "KP", "SY"],
    sensitivity: { anonymizer: 1, datacenter: 0.9, abuse: 0.9 }
  },
  "TikTok Ads": {
    weights: { region: 30, anonymizer: 30, datacenter: 25, abuse: 15 },
    blocked: ["CN", "IN", "RU", "KP", "IR", "SY"],
    sensitivity: { anonymizer: 0.9, datacenter: 0.8, abuse: 0.8 }
  },
  "YouTube Ads": {
    weights: { region: 30, anonymizer: 25, datacenter: 25, abuse: 20 },
    blocked: ["KP", "IR", "SY", "CU"],
    sensitivity: { anonymizer: 0.7, datacenter: 0.7, abuse: 0.8 }
  },
  "LinkedIn Ads": {
    weights: { region: 40, anonymizer: 15, datacenter: 25, abuse: 20 },
    blocked: ["CN", "RU", "KP", "IR", "SY"],
    sensitivity: { anonymizer: 0.7, datacenter: 0.6, abuse: 0.6 }
  },
  // Social — TikTok follows SIM/IP region and degrades datacenter creators.
  "TikTok": {
    weights: { region: 35, anonymizer: 25, datacenter: 25, abuse: 15 },
    blocked: ["CN", "IN", "KP"],
    sensitivity: { anonymizer: 0.9, datacenter: 0.8, abuse: 0.8 }
  },
  "Reddit": {
    weights: { region: 20, anonymizer: 30, datacenter: 30, abuse: 20 },
    blocked: ["CN", "IR", "KP", "RU"],
    sensitivity: { anonymizer: 0.9, datacenter: 0.9, abuse: 0.8 }
  },
  "Discord": {
    weights: { region: 25, anonymizer: 25, datacenter: 30, abuse: 20 },
    blocked: ["CN", "RU", "IR", "KP"],
    sensitivity: { anonymizer: 0.8, datacenter: 0.8, abuse: 0.7 }
  }
};
function anonymizerPenalty(ctx) {
  if (ctx.tor) return 1;
  if (ctx.vpn || ctx.proxy) return 0.75;
  if (ctx.anonymous) return 0.5;
  if (ctx.icloud_relay) return 0.35;
  return 0;
}
function computePlatformReadiness(name, ctx) {
  var _a, _b;
  const model = PLATFORM_MODELS[name];
  if (!model) return void 0;
  const country = (_a = ctx.country_code) == null ? void 0 : _a.toUpperCase();
  const regionBlocked = Boolean(country && ((_b = model.blocked) == null ? void 0 : _b.includes(country)));
  const regionUnsupported = Boolean(country && model.onlyIn !== void 0 && !model.onlyIn.includes(country));
  const regionPenalty = regionBlocked || regionUnsupported ? 1 : 0;
  const penalties = [
    ["region", regionPenalty],
    ["anonymizer", anonymizerPenalty(ctx) * model.sensitivity.anonymizer],
    ["datacenter", (ctx.hosting ? 1 : 0) * model.sensitivity.datacenter],
    ["abuse", (ctx.recent_abuse ? 1 : 0) * model.sensitivity.abuse]
  ];
  let score = 100;
  for (const [id, penalty] of penalties) score -= model.weights[id] * penalty;
  if (regionPenalty >= 1) score = Math.min(score, REGION_BLOCK_CAP);
  if (ctx.tor) score = Math.min(score, TOR_CAP);
  const hits = penalties.filter(([, penalty]) => penalty >= 0.25).map(([id]) => id);
  const reasons = hits.map((id) => {
    if (id !== "region") return id;
    return regionBlocked ? "region-blocked" : "region-unsupported";
  });
  return { score: Math.min(99, Math.max(1, Math.round(score))), level: score >= 70 ? "ready" : score >= 40 ? "caution" : "risky", hits, reasons };
}

export { EVALUATED_PLATFORMS as E, PlatformBrandIcon_default as P, computePlatformReadiness as c };
//# sourceMappingURL=platform-readiness.mjs.map
