function riskLevelFor(score) {
  return score > 70 ? "high" : score >= 40 ? "medium" : "low";
}
function safetyScoreFor(riskScore) {
  return Math.min(100, Math.max(0, 100 - riskScore));
}
function riskLevelForSafetyScore(score) {
  return score < 30 ? "high" : score <= 60 ? "medium" : "low";
}
function formatRiskScore(score) {
  return Number.isFinite(score) ? Number(score).toFixed(1) : "0.0";
}
function isSuspectedExit(data) {
  var _a;
  const anonymous = data.proxy || data.vpn || data.tor;
  return !anonymous && Boolean(data.hosting) && ((_a = data.connection_type) == null ? void 0 : _a.toLowerCase()) !== "residential";
}
function analysisFor(data, t) {
  var _a;
  const suspectedExit = isSuspectedExit(data);
  return {
    title: t(suspectedExit ? "analysis.suspectedExitTitle" : `analysis.${riskLevelFor((_a = data.risk_score) != null ? _a : 0)}`),
    summary: t(data.proxy || data.vpn || data.tor ? "analysis.anonymizer" : suspectedExit ? "analysis.suspectedExit" : "analysis.clean"),
    concern: t(data.recent_abuse ? "analysis.abuse" : suspectedExit ? "analysis.suspectedExitConcern" : data.hosting ? "analysis.hosting" : "analysis.noConcern")
  };
}
function networkTypeLabel(value, t, hosting = false) {
  if (hosting) return t("network.hosting");
  if (!value) return t("misc.unknown");
  const key = { isp: "isp", residential: "residential", hosting: "hosting", datacenter: "hosting", business: "business", mobile: "mobile", education: "education", government: "government" }[value.toLowerCase()];
  return key ? t(`network.${key}`) : value;
}
function parseBrowserInfo(ua) {
  const browser = /(?:Edg|EdgA|EdgiOS)\//.test(ua) ? "Microsoft Edge" : /(?:OPR|Opera)\//.test(ua) ? "Opera" : /(?:Chrome|CriOS)\//.test(ua) ? "Chrome" : /(?:Firefox|FxiOS)\//.test(ua) ? "Firefox" : /Safari\//.test(ua) ? "Safari" : "";
  const os = /(?:iPhone|iPad|iPod)/.test(ua) ? "iOS" : /Android/.test(ua) ? "Android" : /Windows/.test(ua) ? "Windows" : /CrOS/.test(ua) ? "ChromeOS" : /Macintosh|Mac OS X/.test(ua) ? "macOS" : /Linux/.test(ua) ? "Linux" : "";
  const device = /iPad|Tablet/.test(ua) ? "tablet" : /iPhone|iPod|Mobile|Android/.test(ua) ? "mobile" : ua ? "desktop" : "";
  return { browser, os, device };
}

export { analysisFor as a, riskLevelForSafetyScore as b, formatRiskScore as f, isSuspectedExit as i, networkTypeLabel as n, parseBrowserInfo as p, riskLevelFor as r, safetyScoreFor as s };
//# sourceMappingURL=ip-display.mjs.map
