import { d as defineEventHandler } from '../../../nitro/nitro.mjs';
import { g as getScans } from '../../../_/scan-store.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const riskStats_get = defineEventHandler(async () => {
  const all = await getScans();
  const recent = all.slice(-50);
  const summary = {
    count: all.length,
    avg: recent.length ? Math.round(recent.reduce((sum, s) => {
      var _a;
      return sum + ((_a = s.risk_score) != null ? _a : 0);
    }, 0) / recent.length * 10) / 10 : 0,
    low: recent.filter((s) => {
      var _a;
      return ((_a = s.risk_score) != null ? _a : 0) < 40;
    }).length,
    medium: recent.filter((s) => {
      var _a, _b;
      return ((_a = s.risk_score) != null ? _a : 0) >= 40 && ((_b = s.risk_score) != null ? _b : 0) <= 70;
    }).length,
    high: recent.filter((s) => {
      var _a;
      return ((_a = s.risk_score) != null ? _a : 0) > 70;
    }).length
  };
  return { scans: recent, summary };
});

export { riskStats_get as default };
//# sourceMappingURL=risk-stats.get.mjs.map
