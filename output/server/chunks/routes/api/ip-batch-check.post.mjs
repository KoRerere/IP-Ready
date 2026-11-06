import { d as defineEventHandler, u as useRuntimeConfig, a as readBody, c as createError } from '../../nitro/nitro.mjs';
import { i as isValidIp } from '../../_/ip-validation.mjs';
import { a as appendScan } from '../../_/scan-store.mjs';
import { i as isPublicIp, l as lookupIpIntelligence } from '../../_/ip-intelligence.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../../_/ip-display.mjs';

const MAX_BATCH_IPS = 20;
async function mapWithConcurrency(items, limit, fn) {
  const results = new Array(items.length);
  let cursor = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await fn(items[index]);
    }
  });
  await Promise.all(workers);
  return results;
}
const ipBatchCheck_post = defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const body = await readBody(event).catch(() => null);
  const rawList = Array.isArray(body == null ? void 0 : body.ips) ? body.ips.filter((value) => typeof value === "string") : [];
  if (!rawList.length) throw createError({ statusCode: 400, statusMessage: "No IP addresses were provided." });
  const seen = /* @__PURE__ */ new Set();
  const ips = [];
  for (const value of rawList.map((value2) => value2.trim()).filter(Boolean)) {
    if (ips.length >= MAX_BATCH_IPS) break;
    if (seen.has(value)) continue;
    seen.add(value);
    ips.push(value);
  }
  if (!config.iplocateApiKey) {
    throw createError({ statusCode: 503, statusMessage: "IP detection is not configured." });
  }
  const scannedRecords = [];
  const results = await mapWithConcurrency(ips, 4, async (ip) => {
    var _a;
    if (!isValidIp(ip)) return { ip, status: "error", error: "Invalid IP address." };
    if (!isPublicIp(ip)) return { ip, status: "error", error: "Private or reserved IP addresses cannot be checked." };
    try {
      const data = await lookupIpIntelligence(ip, config);
      scannedRecords.push({ ip: data.ip, risk_score: data.risk_score, country_code: data.country_code, scanned_at: data.scanned_at });
      return { ip, status: "ok", data };
    } catch (error) {
      const apiError = error;
      return { ip, status: "error", error: ((_a = apiError.data) == null ? void 0 : _a.statusMessage) || apiError.statusMessage || apiError.message || "IP intelligence lookup failed." };
    }
  });
  void (async () => {
    for (const record of scannedRecords) await appendScan(record);
  })();
  return { results, total: results.length };
});

export { MAX_BATCH_IPS, ipBatchCheck_post as default };
//# sourceMappingURL=ip-batch-check.post.mjs.map
