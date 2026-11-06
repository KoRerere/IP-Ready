import { c as createError } from '../nitro/nitro.mjs';
import { i as isValidIp } from './ip-validation.mjs';
import { i as isSuspectedExit } from './ip-display.mjs';

function normalizeIp(value) {
  var _a;
  if (!value) return void 0;
  const first = (_a = value.split(",")[0]) == null ? void 0 : _a.trim().replace(/^::ffff:/, "");
  return first && isValidIp(first) ? first : void 0;
}
function isPublicIp(ip) {
  if (!ip || !isValidIp(ip)) return false;
  return !(ip === "::1" || ip === "0.0.0.0" || ip.startsWith("10.") || ip.startsWith("127.") || ip.startsWith("192.168.") || /^172\.(1[6-9]|2\d|3[01])\./.test(ip) || ip.startsWith("fc") || ip.startsWith("fd") || ip.startsWith("fe80:"));
}
function clampRiskScore(score) {
  if (!Number.isFinite(score)) return 99.9;
  return Math.min(99.9, Math.max(0.1, Math.round(score * 10) / 10));
}
function networkRiskContribution(data) {
  var _a, _b, _c;
  const type = `${((_a = data.asn) == null ? void 0 : _a.type) || ((_b = data.company) == null ? void 0 : _b.type) || ""}`.toLowerCase();
  if (type.includes("datacenter") || type.includes("hosting")) return 17;
  if (type.includes("mobile")) return 5.2;
  if (type.includes("residential") || type.includes("isp")) return 3.6;
  if (type.includes("business")) return 8.4;
  if (type.includes("education") || type.includes("government")) return 6.1;
  if ((_c = data.privacy) == null ? void 0 : _c.is_hosting) return 15.8;
  return 6.4;
}
function providerRiskContribution(data) {
  var _a, _b, _c, _d, _e;
  const type = `${((_a = data.asn) == null ? void 0 : _a.type) || ((_b = data.company) == null ? void 0 : _b.type) || ""}`.toLowerCase();
  const provider = `${((_c = data.asn) == null ? void 0 : _c.name) || ((_d = data.company) == null ? void 0 : _d.name) || ((_e = data.hosting) == null ? void 0 : _e.provider) || ""}`.toLowerCase();
  if (type.includes("datacenter") || type.includes("hosting") || /cloud|vps|server|hosting|datacenter/.test(provider)) return 3.8;
  if (type.includes("business")) return 1.8;
  if (type.includes("residential") || type.includes("isp") || type.includes("mobile")) return 0.6;
  return 1.1;
}
function anonymizerRiskContribution(data) {
  const privacy = data.privacy;
  let score = 0;
  if (privacy == null ? void 0 : privacy.is_tor) score = 36.8;
  else if ((privacy == null ? void 0 : privacy.is_proxy) && (privacy == null ? void 0 : privacy.is_vpn)) score = 31.6;
  else if (privacy == null ? void 0 : privacy.is_proxy) score = 28.4;
  else if (privacy == null ? void 0 : privacy.is_vpn) score = 24.7;
  if (privacy == null ? void 0 : privacy.is_anonymous) score += 4.2;
  return score;
}
function abuseRiskContribution(data, networkRisk, anonymizerRisk) {
  var _a;
  if (!((_a = data.privacy) == null ? void 0 : _a.is_abuser)) return 0;
  return 50.2 + networkRisk * 0.24 + anonymizerRisk * 0.08;
}
function compatibilityBand(data) {
  const privacy = data.privacy;
  const legacy = ((privacy == null ? void 0 : privacy.is_abuser) ? 60 : 0) + ((privacy == null ? void 0 : privacy.is_tor) ? 50 : (privacy == null ? void 0 : privacy.is_proxy) || (privacy == null ? void 0 : privacy.is_vpn) ? 35 : 0) + ((privacy == null ? void 0 : privacy.is_hosting) ? 20 : 0) + ((privacy == null ? void 0 : privacy.is_icloud_relay) ? 10 : 0) + (data.is_anycast ? 5 : 0);
  if (legacy <= 30) return [0.1, 30];
  if (legacy < 40) return [30.1, 39.9];
  if (legacy <= 70) return [40, 70];
  if (legacy < 75) return [70.1, 74.9];
  return [75, 99.9];
}
function calibrateRiskBand(score, lower, upper) {
  const shoulder = Math.min(3, (upper - lower) / 3);
  if (score < lower + shoulder) return lower + shoulder * Math.exp((score - lower - shoulder) / shoulder);
  if (score > upper - shoulder) return upper - shoulder * Math.exp((upper - shoulder - score) / shoulder);
  return score;
}
function calculateRisk(data) {
  var _a, _b, _c;
  if ((_a = data.privacy) == null ? void 0 : _a.is_bogon) return 99.9;
  const networkRisk = networkRiskContribution(data);
  const anonymizerRisk = anonymizerRiskContribution(data);
  const score = networkRisk + providerRiskContribution(data) + anonymizerRisk + abuseRiskContribution(data, networkRisk, anonymizerRisk) + (((_b = data.privacy) == null ? void 0 : _b.is_hosting) ? 11.8 + networkRisk * 0.025 + anonymizerRisk * 0.015 : 0) + (((_c = data.privacy) == null ? void 0 : _c.is_icloud_relay) ? 6.4 + networkRisk * 0.1 + anonymizerRisk * 0.06 : 0) + (data.is_anycast ? 3.2 + networkRisk * 0.04 + providerRiskContribution(data) * 0.15 : 0);
  const [lower, upper] = compatibilityBand(data);
  return clampRiskScore(calibrateRiskBand(score, lower, upper));
}
function normalizeIntelligence(data) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n;
  const asnNumber = Number((_b = (_a = data.asn) == null ? void 0 : _a.asn) == null ? void 0 : _b.replace(/^AS/i, ""));
  const network = ((_c = data.asn) == null ? void 0 : _c.name) ? data.asn : data.company;
  return {
    ip: data.ip,
    proxy: Boolean((_d = data.privacy) == null ? void 0 : _d.is_proxy),
    vpn: Boolean((_e = data.privacy) == null ? void 0 : _e.is_vpn),
    tor: Boolean((_f = data.privacy) == null ? void 0 : _f.is_tor),
    anonymous: Boolean((_g = data.privacy) == null ? void 0 : _g.is_anonymous),
    hosting: Boolean((_h = data.privacy) == null ? void 0 : _h.is_hosting),
    recent_abuse: Boolean((_i = data.privacy) == null ? void 0 : _i.is_abuser),
    icloud_relay: Boolean((_j = data.privacy) == null ? void 0 : _j.is_icloud_relay),
    ISP: (network == null ? void 0 : network.name) || void 0,
    organization: (network == null ? void 0 : network.name) || void 0,
    ASN: Number.isFinite(asnNumber) ? asnNumber : void 0,
    host: (network == null ? void 0 : network.domain) || void 0,
    ip_range: ((_k = data.asn) == null ? void 0 : _k.route) || ((_l = data.hosting) == null ? void 0 : _l.network) || void 0,
    country: data.country || void 0,
    country_code: data.country_code || void 0,
    city: data.city || void 0,
    region: data.subdivision || void 0,
    connection_type: (network == null ? void 0 : network.type) || void 0,
    latitude: (_m = data.latitude) != null ? _m : void 0,
    longitude: (_n = data.longitude) != null ? _n : void 0,
    zip_code: data.postal_code || void 0,
    timezone: data.time_zone || void 0,
    risk_score: calculateRisk(data)
  };
}
function fallbackAnalysis(data) {
  const anonymous = data.proxy || data.vpn || data.tor;
  const suspectedExit = isSuspectedExit(data);
  return {
    title: data.risk_score >= 75 ? "Your Network Shows Elevated Risk." : data.risk_score >= 40 ? "Your Network Needs Attention." : "Your Network Looks Healthy.",
    summary: anonymous ? "An anonymizing network signal was detected, which may trigger additional verification." : suspectedExit ? "No active proxy, VPN, or Tor signal was detected, but this hosting network is a suspected exit signal." : "No active proxy, VPN, or Tor signal was detected in the current scan.",
    concern: data.recent_abuse ? "This IP address appears on an abuse blocklist." : suspectedExit ? "This IP is in a datacenter range and may be a proxy or VPN exit, even though it was not found on known VPN exit lists." : data.hosting ? "Hosting or datacenter network characteristics may affect verification on some platforms." : "No major network concern was identified from the available signals."
  };
}
async function createAiAnalysis(data, config) {
  var _a, _b, _c;
  const fallback = fallbackAnalysis(data);
  if (!config.deepseekApiKey) return fallback;
  try {
    const response = await $fetch(`${config.deepseekBaseUrl}/chat/completions`, {
      method: "POST",
      headers: { Authorization: `Bearer ${config.deepseekApiKey}` },
      body: {
        model: "deepseek-v4-flash",
        response_format: { type: "json_object" },
        max_tokens: 220,
        messages: [
          { role: "system", content: "You analyze IP reputation data. Return JSON only with string fields title, summary, concern. Be concise, cautious, and never claim platform approval or facts absent from the supplied data." },
          { role: "user", content: JSON.stringify(data) }
        ]
      },
      timeout: 12e3
    });
    const content = (_c = (_b = (_a = response.choices) == null ? void 0 : _a[0]) == null ? void 0 : _b.message) == null ? void 0 : _c.content;
    if (!content) return fallback;
    const parsed = JSON.parse(content);
    const suspectedExit = isSuspectedExit(data);
    return {
      title: parsed.title || fallback.title,
      summary: suspectedExit ? fallback.summary : parsed.summary || fallback.summary,
      concern: suspectedExit && !data.recent_abuse ? fallback.concern : parsed.concern || fallback.concern
    };
  } catch {
    return fallback;
  }
}
async function lookupIpIntelligence(ip, config) {
  var _a;
  let rawData;
  try {
    rawData = await $fetch(`https://iplocate.io/api/lookup/${encodeURIComponent(ip)}`, {
      query: { apikey: config.iplocateApiKey },
      timeout: 1e4
    });
  } catch (error) {
    const apiError = error;
    throw createError({ statusCode: 502, statusMessage: ((_a = apiError.data) == null ? void 0 : _a.error) || apiError.statusMessage || "IP intelligence lookup failed." });
  }
  const data = normalizeIntelligence(rawData);
  return { ...data, analysis: await createAiAnalysis(data, config), scanned_at: (/* @__PURE__ */ new Date()).toISOString(), source: "IPLocate" };
}

export { isPublicIp as i, lookupIpIntelligence as l, normalizeIp as n };
//# sourceMappingURL=ip-intelligence.mjs.map
