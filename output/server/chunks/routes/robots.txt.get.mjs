import { d as defineEventHandler, o as setResponseHeader } from '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const robots_txt_get = defineEventHandler((event) => {
  setResponseHeader(event, "Content-Type", "text/plain; charset=utf-8");
  return "User-agent: *\nAllow: /\n\nSitemap: https://ipready.cc/sitemap.xml\n";
});

export { robots_txt_get as default };
//# sourceMappingURL=robots.txt.get.mjs.map
