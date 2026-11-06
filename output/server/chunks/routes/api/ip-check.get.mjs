import { d as defineEventHandler, u as useRuntimeConfig, c as createError, l as getQuery, m as getRequestHeaders, n as getRequestIP } from '../../nitro/nitro.mjs';
import { i as isValidIp } from '../../_/ip-validation.mjs';
import { a as appendScan } from '../../_/scan-store.mjs';
import { n as normalizeIp, i as isPublicIp, l as lookupIpIntelligence } from '../../_/ip-intelligence.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../../_/ip-display.mjs';

const ipCheck_get = defineEventHandler(async (event) => {
  var _a, _b, _c;
  const config = useRuntimeConfig(event);
  if (!config.iplocateApiKey) throw createError({ statusCode: 503, statusMessage: "IP detection is not configured." });
  const query = getQuery(event);
  const requestedIp = typeof query.ip === "string" ? normalizeIp(query.ip) : void 0;
  if (query.ip && !requestedIp) throw createError({ statusCode: 400, statusMessage: "Invalid IP address." });
  if (requestedIp && !isPublicIp(requestedIp)) throw createError({ statusCode: 400, statusMessage: "Private or reserved IP addresses cannot be checked." });
  const headers = getRequestHeaders(event);
  let ip = (_c = (_b = (_a = requestedIp != null ? requestedIp : normalizeIp(headers["cf-connecting-ip"])) != null ? _a : normalizeIp(headers["x-vercel-forwarded-for"])) != null ? _b : normalizeIp(headers["x-forwarded-for"])) != null ? _c : normalizeIp(getRequestIP(event));
  if (!requestedIp && !isPublicIp(ip)) {
    const detected = await $fetch("https://api.iplocate.io/json", { timeout: 5e3 });
    ip = normalizeIp(detected.ip);
  }
  if (!ip) throw createError({ statusCode: 400, statusMessage: "Unable to determine a public IP address." });
  if (!isValidIp(ip)) throw createError({ statusCode: 400, statusMessage: "Invalid IP address." });
  const data = await lookupIpIntelligence(ip, config);
  void appendScan({ ip: data.ip, risk_score: data.risk_score, country_code: data.country_code, scanned_at: data.scanned_at });
  return data;
});

export { ipCheck_get as default };
//# sourceMappingURL=ip-check.get.mjs.map
