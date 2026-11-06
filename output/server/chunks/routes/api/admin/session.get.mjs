import { d as defineEventHandler, j as verifySessionToken, k as getCookie, A as ADMIN_COOKIE } from '../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const session_get = defineEventHandler((event) => {
  return { authenticated: verifySessionToken(getCookie(event, ADMIN_COOKIE)) };
});

export { session_get as default };
//# sourceMappingURL=session.get.mjs.map
