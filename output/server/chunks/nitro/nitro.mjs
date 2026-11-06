import process from 'node:process';globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import http, { Server as Server$1 } from 'node:http';
import https, { Server } from 'node:https';
import { EventEmitter } from 'node:events';
import { Buffer as Buffer$1 } from 'node:buffer';
import { promises, existsSync } from 'node:fs';
import { resolve as resolve$1, dirname as dirname$1, join } from 'node:path';
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const suspectProtoRx = /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/;
const suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
const JsonSigRx = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
function jsonParseTransform(key, value) {
  if (key === "__proto__" || key === "constructor" && value && typeof value === "object" && "prototype" in value) {
    warnKeyDropped(key);
    return;
  }
  return value;
}
function warnKeyDropped(key) {
  console.warn(`[destr] Dropping "${key}" key to prevent prototype pollution.`);
}
function destr(value, options = {}) {
  if (typeof value !== "string") {
    return value;
  }
  if (value[0] === '"' && value[value.length - 1] === '"' && value.indexOf("\\") === -1) {
    return value.slice(1, -1);
  }
  const _value = value.trim();
  if (_value.length <= 9) {
    switch (_value.toLowerCase()) {
      case "true": {
        return true;
      }
      case "false": {
        return false;
      }
      case "undefined": {
        return void 0;
      }
      case "null": {
        return null;
      }
      case "nan": {
        return Number.NaN;
      }
      case "infinity": {
        return Number.POSITIVE_INFINITY;
      }
      case "-infinity": {
        return Number.NEGATIVE_INFINITY;
      }
    }
  }
  if (!JsonSigRx.test(value)) {
    if (options.strict) {
      throw new SyntaxError("[destr] Invalid JSON");
    }
    return value;
  }
  try {
    if (suspectProtoRx.test(value) || suspectConstructorRx.test(value)) {
      if (options.strict) {
        throw new Error("[destr] Possible prototype pollution");
      }
      return JSON.parse(value, jsonParseTransform);
    }
    return JSON.parse(value);
  } catch (error) {
    if (options.strict) {
      throw error;
    }
    return value;
  }
}

const HASH_RE = /#/g;
const AMPERSAND_RE = /&/g;
const SLASH_RE = /\//g;
const EQUAL_RE = /=/g;
const IM_RE = /\?/g;
const PLUS_RE = /\+/g;
const ENC_CARET_RE = /%5e/gi;
const ENC_BACKTICK_RE = /%60/gi;
const ENC_PIPE_RE = /%7c/gi;
const ENC_SPACE_RE = /%20/gi;
const ENC_SLASH_RE = /%2f/gi;
const ENC_ENC_SLASH_RE = /%252f/gi;
function encode(text) {
  return encodeURI("" + text).replace(ENC_PIPE_RE, "|");
}
function encodeQueryValue(input) {
  return encode(typeof input === "string" ? input : JSON.stringify(input)).replace(PLUS_RE, "%2B").replace(ENC_SPACE_RE, "+").replace(HASH_RE, "%23").replace(AMPERSAND_RE, "%26").replace(ENC_BACKTICK_RE, "`").replace(ENC_CARET_RE, "^").replace(SLASH_RE, "%2F");
}
function encodeQueryKey(text) {
  return encodeQueryValue(text).replace(EQUAL_RE, "%3D");
}
function encodePath(text) {
  return encode(text).replace(HASH_RE, "%23").replace(IM_RE, "%3F").replace(ENC_ENC_SLASH_RE, "%2F").replace(AMPERSAND_RE, "%26").replace(PLUS_RE, "%2B");
}
function decode$1(text = "") {
  try {
    return decodeURIComponent("" + text);
  } catch {
    return "" + text;
  }
}
function decodePath(text) {
  return decode$1(text.replace(ENC_SLASH_RE, "%252F"));
}
function decodeQueryKey(text) {
  return decode$1(text.replace(PLUS_RE, " "));
}
function decodeQueryValue(text) {
  return decode$1(text.replace(PLUS_RE, " "));
}

function parseQuery(parametersString = "") {
  const object = /* @__PURE__ */ Object.create(null);
  if (parametersString[0] === "?") {
    parametersString = parametersString.slice(1);
  }
  for (const parameter of parametersString.split("&")) {
    const s = parameter.match(/([^=]+)=?(.*)/) || [];
    if (s.length < 2) {
      continue;
    }
    const key = decodeQueryKey(s[1]);
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = decodeQueryValue(s[2] || "");
    if (object[key] === void 0) {
      object[key] = value;
    } else if (Array.isArray(object[key])) {
      object[key].push(value);
    } else {
      object[key] = [object[key], value];
    }
  }
  return object;
}
function encodeQueryItem(key, value) {
  if (typeof value === "number" || typeof value === "boolean") {
    value = String(value);
  }
  if (!value) {
    return encodeQueryKey(key);
  }
  if (Array.isArray(value)) {
    return value.map(
      (_value) => `${encodeQueryKey(key)}=${encodeQueryValue(_value)}`
    ).join("&");
  }
  return `${encodeQueryKey(key)}=${encodeQueryValue(value)}`;
}
function stringifyQuery(query) {
  return Object.keys(query).filter((k) => query[k] !== void 0).map((k) => encodeQueryItem(k, query[k])).filter(Boolean).join("&");
}

const PROTOCOL_STRICT_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{1,2})/;
const PROTOCOL_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{2})?/;
const PROTOCOL_RELATIVE_REGEX = /^([/\\]\s*){2,}[^/\\]/;
const PROTOCOL_SCRIPT_RE = /^[\s\0]*(blob|data|javascript|vbscript):$/i;
const TRAILING_SLASH_RE = /\/$|\/\?|\/#/;
const JOIN_LEADING_SLASH_RE = /^\.?\//;
function hasProtocol(inputString, opts = {}) {
  if (typeof opts === "boolean") {
    opts = { acceptRelative: opts };
  }
  if (opts.strict) {
    return PROTOCOL_STRICT_REGEX.test(inputString);
  }
  return PROTOCOL_REGEX.test(inputString) || (opts.acceptRelative ? PROTOCOL_RELATIVE_REGEX.test(inputString) : false);
}
function isScriptProtocol(protocol) {
  return !!protocol && PROTOCOL_SCRIPT_RE.test(protocol);
}
function hasTrailingSlash(input = "", respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return input.endsWith("/");
  }
  return TRAILING_SLASH_RE.test(input);
}
function withoutTrailingSlash(input = "", respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return (hasTrailingSlash(input) ? input.slice(0, -1) : input) || "/";
  }
  if (!hasTrailingSlash(input, true)) {
    return input || "/";
  }
  let path = input;
  let fragment = "";
  const fragmentIndex = input.indexOf("#");
  if (fragmentIndex !== -1) {
    path = input.slice(0, fragmentIndex);
    fragment = input.slice(fragmentIndex);
  }
  const [s0, ...s] = path.split("?");
  const cleanPath = s0.endsWith("/") ? s0.slice(0, -1) : s0;
  return (cleanPath || "/") + (s.length > 0 ? `?${s.join("?")}` : "") + fragment;
}
function withTrailingSlash(input = "", respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return input.endsWith("/") ? input : input + "/";
  }
  if (hasTrailingSlash(input, true)) {
    return input || "/";
  }
  let path = input;
  let fragment = "";
  const fragmentIndex = input.indexOf("#");
  if (fragmentIndex !== -1) {
    path = input.slice(0, fragmentIndex);
    fragment = input.slice(fragmentIndex);
    if (!path) {
      return fragment;
    }
  }
  const [s0, ...s] = path.split("?");
  return s0 + "/" + (s.length > 0 ? `?${s.join("?")}` : "") + fragment;
}
function hasLeadingSlash(input = "") {
  return input.startsWith("/");
}
function withLeadingSlash(input = "") {
  return hasLeadingSlash(input) ? input : "/" + input;
}
function withBase(input, base) {
  if (isEmptyURL(base) || hasProtocol(input)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (input.startsWith(_base)) {
    const nextChar = input[_base.length];
    if (!nextChar || nextChar === "/" || nextChar === "?") {
      return input;
    }
  }
  return joinURL(_base, input);
}
function withoutBase(input, base) {
  if (isEmptyURL(base)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (!input.startsWith(_base)) {
    return input;
  }
  const nextChar = input[_base.length];
  if (nextChar && nextChar !== "/" && nextChar !== "?") {
    return input;
  }
  const trimmed = input.slice(_base.length).replace(/^\/+/, "");
  return "/" + trimmed;
}
function withQuery(input, query) {
  const parsed = parseURL(input);
  const mergedQuery = { ...parseQuery(parsed.search), ...query };
  parsed.search = stringifyQuery(mergedQuery);
  return stringifyParsedURL(parsed);
}
function getQuery$1(input) {
  return parseQuery(parseURL(input).search);
}
function isEmptyURL(url) {
  return !url || url === "/";
}
function isNonEmptyURL(url) {
  return url && url !== "/";
}
function joinURL(base, ...input) {
  let url = base || "";
  for (const segment of input.filter((url2) => isNonEmptyURL(url2))) {
    if (url) {
      const _segment = segment.replace(JOIN_LEADING_SLASH_RE, "");
      url = withTrailingSlash(url) + _segment;
    } else {
      url = segment;
    }
  }
  return url;
}
function joinRelativeURL(..._input) {
  const JOIN_SEGMENT_SPLIT_RE = /\/(?!\/)/;
  const input = _input.filter(Boolean);
  const segments = [];
  let segmentsDepth = 0;
  for (const i of input) {
    if (!i || i === "/") {
      continue;
    }
    for (const [sindex, s] of i.split(JOIN_SEGMENT_SPLIT_RE).entries()) {
      if (!s || s === ".") {
        continue;
      }
      if (s === "..") {
        if (segments.length === 1 && hasProtocol(segments[0])) {
          continue;
        }
        segments.pop();
        segmentsDepth--;
        continue;
      }
      if (sindex === 1 && segments[segments.length - 1]?.endsWith(":/")) {
        segments[segments.length - 1] += "/" + s;
        continue;
      }
      segments.push(s);
      segmentsDepth++;
    }
  }
  let url = segments.join("/");
  if (segmentsDepth >= 0) {
    if (input[0]?.startsWith("/") && !url.startsWith("/")) {
      url = "/" + url;
    } else if (input[0]?.startsWith("./") && !url.startsWith("./")) {
      url = "./" + url;
    }
  } else {
    url = "../".repeat(-1 * segmentsDepth) + url;
  }
  if (input[input.length - 1]?.endsWith("/") && !url.endsWith("/")) {
    url += "/";
  }
  return url;
}

const protocolRelative = Symbol.for("ufo:protocolRelative");
function parseURL(input = "", defaultProto) {
  const _specialProtoMatch = input.match(
    /^[\s\0]*(blob:|data:|javascript:|vbscript:)(.*)/i
  );
  if (_specialProtoMatch) {
    const [, _proto, _pathname = ""] = _specialProtoMatch;
    return {
      protocol: _proto.toLowerCase(),
      pathname: _pathname,
      href: _proto + _pathname,
      auth: "",
      host: "",
      search: "",
      hash: ""
    };
  }
  if (!hasProtocol(input, { acceptRelative: true })) {
    return parsePath(input);
  }
  const [, protocol = "", auth, hostAndPath = ""] = input.replace(/\\/g, "/").match(/^[\s\0]*([\w+.-]{2,}:)?\/\/([^/@]+@)?(.*)/) || [];
  let [, host = "", path = ""] = hostAndPath.match(/([^#/?]*)(.*)?/) || [];
  if (protocol === "file:") {
    path = path.replace(/\/(?=[A-Za-z]:)/, "");
  }
  const { pathname, search, hash } = parsePath(path);
  return {
    protocol: protocol.toLowerCase(),
    auth: auth ? auth.slice(0, Math.max(0, auth.length - 1)) : "",
    host,
    pathname,
    search,
    hash,
    [protocolRelative]: !protocol
  };
}
function parsePath(input = "") {
  const [pathname = "", search = "", hash = ""] = (input.match(/([^#?]*)(\?[^#]*)?(#.*)?/) || []).splice(1);
  return {
    pathname,
    search,
    hash
  };
}
function stringifyParsedURL(parsed) {
  const pathname = parsed.pathname || "";
  const search = parsed.search ? (parsed.search.startsWith("?") ? "" : "?") + parsed.search : "";
  const hash = parsed.hash || "";
  const auth = parsed.auth ? parsed.auth + "@" : "";
  const host = parsed.host || "";
  const proto = parsed.protocol || parsed[protocolRelative] ? (parsed.protocol || "") + "//" : "";
  return proto + auth + host + pathname + search + hash;
}

const NullObject = /* @__PURE__ */ (() => {
  const C = function() {
  };
  C.prototype = /* @__PURE__ */ Object.create(null);
  return C;
})();
function parse$1(str, options) {
  if (typeof str !== "string") {
    throw new TypeError("argument str must be a string");
  }
  const obj = new NullObject();
  const opt = {};
  const dec = opt.decode || decode;
  let index = 0;
  while (index < str.length) {
    const eqIdx = str.indexOf("=", index);
    if (eqIdx === -1) {
      break;
    }
    let endIdx = str.indexOf(";", index);
    if (endIdx === -1) {
      endIdx = str.length;
    } else if (endIdx < eqIdx) {
      index = str.lastIndexOf(";", eqIdx - 1) + 1;
      continue;
    }
    const key = str.slice(index, eqIdx).trim();
    if (opt?.filter && !opt?.filter(key)) {
      index = endIdx + 1;
      continue;
    }
    if (void 0 === obj[key]) {
      let val = str.slice(eqIdx + 1, endIdx).trim();
      if (val.codePointAt(0) === 34) {
        val = val.slice(1, -1);
      }
      obj[key] = tryDecode(val, dec);
    }
    index = endIdx + 1;
  }
  return obj;
}
function decode(str) {
  return str.includes("%") ? decodeURIComponent(str) : str;
}
function tryDecode(str, decode2) {
  try {
    return decode2(str);
  } catch {
    return str;
  }
}

const fieldContentRegExp = /^[\u0009\u0020-\u007E\u0080-\u00FF]+$/;
function serialize$2(name, value, options) {
  const opt = options || {};
  const enc = opt.encode || encodeURIComponent;
  if (typeof enc !== "function") {
    throw new TypeError("option encode is invalid");
  }
  if (!fieldContentRegExp.test(name)) {
    throw new TypeError("argument name is invalid");
  }
  const encodedValue = enc(value);
  if (encodedValue && !fieldContentRegExp.test(encodedValue)) {
    throw new TypeError("argument val is invalid");
  }
  let str = name + "=" + encodedValue;
  if (void 0 !== opt.maxAge && opt.maxAge !== null) {
    const maxAge = opt.maxAge - 0;
    if (Number.isNaN(maxAge) || !Number.isFinite(maxAge)) {
      throw new TypeError("option maxAge is invalid");
    }
    str += "; Max-Age=" + Math.floor(maxAge);
  }
  if (opt.domain) {
    if (!fieldContentRegExp.test(opt.domain)) {
      throw new TypeError("option domain is invalid");
    }
    str += "; Domain=" + opt.domain;
  }
  if (opt.path) {
    if (!fieldContentRegExp.test(opt.path)) {
      throw new TypeError("option path is invalid");
    }
    str += "; Path=" + opt.path;
  }
  if (opt.expires) {
    if (!isDate(opt.expires) || Number.isNaN(opt.expires.valueOf())) {
      throw new TypeError("option expires is invalid");
    }
    str += "; Expires=" + opt.expires.toUTCString();
  }
  if (opt.httpOnly) {
    str += "; HttpOnly";
  }
  if (opt.secure) {
    str += "; Secure";
  }
  if (opt.priority) {
    const priority = typeof opt.priority === "string" ? opt.priority.toLowerCase() : opt.priority;
    switch (priority) {
      case "low": {
        str += "; Priority=Low";
        break;
      }
      case "medium": {
        str += "; Priority=Medium";
        break;
      }
      case "high": {
        str += "; Priority=High";
        break;
      }
      default: {
        throw new TypeError("option priority is invalid");
      }
    }
  }
  if (opt.sameSite) {
    const sameSite = typeof opt.sameSite === "string" ? opt.sameSite.toLowerCase() : opt.sameSite;
    switch (sameSite) {
      case true: {
        str += "; SameSite=Strict";
        break;
      }
      case "lax": {
        str += "; SameSite=Lax";
        break;
      }
      case "strict": {
        str += "; SameSite=Strict";
        break;
      }
      case "none": {
        str += "; SameSite=None";
        break;
      }
      default: {
        throw new TypeError("option sameSite is invalid");
      }
    }
  }
  if (opt.partitioned) {
    str += "; Partitioned";
  }
  return str;
}
function isDate(val) {
  return Object.prototype.toString.call(val) === "[object Date]" || val instanceof Date;
}

function parseSetCookie(setCookieValue, options) {
  const parts = (setCookieValue || "").split(";").filter((str) => typeof str === "string" && !!str.trim());
  const nameValuePairStr = parts.shift() || "";
  const parsed = _parseNameValuePair(nameValuePairStr);
  const name = parsed.name;
  let value = parsed.value;
  try {
    value = options?.decode === false ? value : (options?.decode || decodeURIComponent)(value);
  } catch {
  }
  const cookie = {
    name,
    value
  };
  for (const part of parts) {
    const sides = part.split("=");
    const partKey = (sides.shift() || "").trimStart().toLowerCase();
    const partValue = sides.join("=");
    switch (partKey) {
      case "expires": {
        cookie.expires = new Date(partValue);
        break;
      }
      case "max-age": {
        cookie.maxAge = Number.parseInt(partValue, 10);
        break;
      }
      case "secure": {
        cookie.secure = true;
        break;
      }
      case "httponly": {
        cookie.httpOnly = true;
        break;
      }
      case "samesite": {
        cookie.sameSite = partValue;
        break;
      }
      default: {
        cookie[partKey] = partValue;
      }
    }
  }
  return cookie;
}
function _parseNameValuePair(nameValuePairStr) {
  let name = "";
  let value = "";
  const nameValueArr = nameValuePairStr.split("=");
  if (nameValueArr.length > 1) {
    name = nameValueArr.shift();
    value = nameValueArr.join("=");
  } else {
    value = nameValuePairStr;
  }
  return { name, value };
}

const NODE_TYPES = {
  NORMAL: 0,
  WILDCARD: 1,
  PLACEHOLDER: 2
};

function createRouter$1(options = {}) {
  const ctx = {
    options,
    rootNode: createRadixNode(),
    staticRoutesMap: {}
  };
  const normalizeTrailingSlash = (p) => options.strictTrailingSlash ? p : p.replace(/\/$/, "") || "/";
  if (options.routes) {
    for (const path in options.routes) {
      insert(ctx, normalizeTrailingSlash(path), options.routes[path]);
    }
  }
  return {
    ctx,
    lookup: (path) => lookup(ctx, normalizeTrailingSlash(path)),
    insert: (path, data) => insert(ctx, normalizeTrailingSlash(path), data),
    remove: (path) => remove(ctx, normalizeTrailingSlash(path))
  };
}
function lookup(ctx, path) {
  const staticPathNode = ctx.staticRoutesMap[path];
  if (staticPathNode) {
    return staticPathNode.data;
  }
  const sections = path.split("/");
  const params = {};
  let paramsFound = false;
  let wildcardNode = null;
  let node = ctx.rootNode;
  let wildCardParam = null;
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (node.wildcardChildNode !== null) {
      wildcardNode = node.wildcardChildNode;
      wildCardParam = sections.slice(i).join("/");
    }
    const nextNode = node.children.get(section);
    if (nextNode === void 0) {
      if (node && node.placeholderChildren.length > 1) {
        const remaining = sections.length - i;
        node = node.placeholderChildren.find((c) => c.maxDepth === remaining) || null;
      } else {
        node = node.placeholderChildren[0] || null;
      }
      if (!node) {
        break;
      }
      if (node.paramName) {
        params[node.paramName] = section;
      }
      paramsFound = true;
    } else {
      node = nextNode;
    }
  }
  if ((node === null || node.data === null) && wildcardNode !== null) {
    node = wildcardNode;
    params[node.paramName || "_"] = wildCardParam;
    paramsFound = true;
  }
  if (!node) {
    return null;
  }
  if (paramsFound) {
    return {
      ...node.data,
      params: paramsFound ? params : void 0
    };
  }
  return node.data;
}
function insert(ctx, path, data) {
  let isStaticRoute = true;
  const sections = path.split("/");
  let node = ctx.rootNode;
  let _unnamedPlaceholderCtr = 0;
  const matchedNodes = [node];
  for (const section of sections) {
    let childNode;
    if (childNode = node.children.get(section)) {
      node = childNode;
    } else {
      const type = getNodeType(section);
      childNode = createRadixNode({ type, parent: node });
      node.children.set(section, childNode);
      if (type === NODE_TYPES.PLACEHOLDER) {
        childNode.paramName = section === "*" ? `_${_unnamedPlaceholderCtr++}` : section.slice(1);
        node.placeholderChildren.push(childNode);
        isStaticRoute = false;
      } else if (type === NODE_TYPES.WILDCARD) {
        node.wildcardChildNode = childNode;
        childNode.paramName = section.slice(
          3
          /* "**:" */
        ) || "_";
        isStaticRoute = false;
      }
      matchedNodes.push(childNode);
      node = childNode;
    }
  }
  for (const [depth, node2] of matchedNodes.entries()) {
    node2.maxDepth = Math.max(matchedNodes.length - depth, node2.maxDepth || 0);
  }
  node.data = data;
  if (isStaticRoute === true) {
    ctx.staticRoutesMap[path] = node;
  }
  return node;
}
function remove(ctx, path) {
  let success = false;
  const sections = path.split("/");
  let node = ctx.rootNode;
  for (const section of sections) {
    node = node.children.get(section);
    if (!node) {
      return success;
    }
  }
  if (node.data) {
    const lastSection = sections.at(-1) || "";
    node.data = null;
    if (Object.keys(node.children).length === 0 && node.parent) {
      node.parent.children.delete(lastSection);
      node.parent.wildcardChildNode = null;
      node.parent.placeholderChildren = [];
    }
    success = true;
  }
  return success;
}
function createRadixNode(options = {}) {
  return {
    type: options.type || NODE_TYPES.NORMAL,
    maxDepth: 0,
    parent: options.parent || null,
    children: /* @__PURE__ */ new Map(),
    data: options.data || null,
    paramName: options.paramName || null,
    wildcardChildNode: null,
    placeholderChildren: []
  };
}
function getNodeType(str) {
  if (str.startsWith("**")) {
    return NODE_TYPES.WILDCARD;
  }
  if (str[0] === ":" || str === "*") {
    return NODE_TYPES.PLACEHOLDER;
  }
  return NODE_TYPES.NORMAL;
}

function toRouteMatcher(router) {
  const table = _routerNodeToTable("", router.ctx.rootNode);
  return _createMatcher(table, router.ctx.options.strictTrailingSlash);
}
function _createMatcher(table, strictTrailingSlash) {
  return {
    ctx: { table },
    matchAll: (path) => _matchRoutes(path, table, strictTrailingSlash)
  };
}
function _createRouteTable() {
  return {
    static: /* @__PURE__ */ new Map(),
    wildcard: /* @__PURE__ */ new Map(),
    dynamic: /* @__PURE__ */ new Map()
  };
}
function _matchRoutes(path, table, strictTrailingSlash) {
  if (strictTrailingSlash !== true && path.endsWith("/")) {
    path = path.slice(0, -1) || "/";
  }
  const matches = [];
  for (const [key, value] of _sortRoutesMap(table.wildcard)) {
    if (path === key || path.startsWith(key + "/")) {
      matches.push(value);
    }
  }
  for (const [key, value] of _sortRoutesMap(table.dynamic)) {
    if (path.startsWith(key + "/")) {
      const subPath = "/" + path.slice(key.length).split("/").splice(2).join("/");
      matches.push(..._matchRoutes(subPath, value));
    }
  }
  const staticMatch = table.static.get(path);
  if (staticMatch) {
    matches.push(staticMatch);
  }
  return matches.filter(Boolean);
}
function _sortRoutesMap(m) {
  return [...m.entries()].sort((a, b) => a[0].length - b[0].length);
}
function _routerNodeToTable(initialPath, initialNode) {
  const table = _createRouteTable();
  function _addNode(path, node) {
    if (path) {
      if (node.type === NODE_TYPES.NORMAL && !(path.includes("*") || path.includes(":"))) {
        if (node.data) {
          table.static.set(path, node.data);
        }
      } else if (node.type === NODE_TYPES.WILDCARD) {
        table.wildcard.set(path.replace("/**", ""), node.data);
      } else if (node.type === NODE_TYPES.PLACEHOLDER) {
        const subTable = _routerNodeToTable("", node);
        if (node.data) {
          subTable.static.set("/", node.data);
        }
        table.dynamic.set(path.replace(/\/\*|\/:\w+/, ""), subTable);
        return;
      }
    }
    for (const [childPath, child] of node.children.entries()) {
      _addNode(`${path}/${childPath}`.replace("//", "/"), child);
    }
  }
  _addNode(initialPath, initialNode);
  return table;
}

function isPlainObject(value) {
  if (value === null || typeof value !== "object") {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== null && prototype !== Object.prototype && Object.getPrototypeOf(prototype) !== null) {
    return false;
  }
  if (Symbol.iterator in value) {
    return false;
  }
  if (Symbol.toStringTag in value) {
    return Object.prototype.toString.call(value) === "[object Module]";
  }
  return true;
}

function _defu(baseObject, defaults, namespace = ".", merger) {
  if (!isPlainObject(defaults)) {
    return _defu(baseObject, {}, namespace, merger);
  }
  const object = { ...defaults };
  for (const key of Object.keys(baseObject)) {
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = baseObject[key];
    if (value === null || value === void 0) {
      continue;
    }
    if (merger && merger(object, key, value, namespace)) {
      continue;
    }
    if (Array.isArray(value) && Array.isArray(object[key])) {
      object[key] = [...value, ...object[key]];
    } else if (isPlainObject(value) && isPlainObject(object[key])) {
      object[key] = _defu(
        value,
        object[key],
        (namespace ? `${namespace}.` : "") + key.toString(),
        merger
      );
    } else {
      object[key] = value;
    }
  }
  return object;
}
function createDefu(merger) {
  return (...arguments_) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    arguments_.reduce((p, c) => _defu(p, c, "", merger), {})
  );
}
const defu = createDefu();
const defuFn = createDefu((object, key, currentValue) => {
  if (object[key] !== void 0 && typeof currentValue === "function") {
    object[key] = currentValue(object[key]);
    return true;
  }
});

function o(n){throw new Error(`${n} is not implemented yet!`)}let i$1 = class i extends EventEmitter{__unenv__={};readableEncoding=null;readableEnded=true;readableFlowing=false;readableHighWaterMark=0;readableLength=0;readableObjectMode=false;readableAborted=false;readableDidRead=false;closed=false;errored=null;readable=false;destroyed=false;static from(e,t){return new i(t)}constructor(e){super();}_read(e){}read(e){}setEncoding(e){return this}pause(){return this}resume(){return this}isPaused(){return  true}unpipe(e){return this}unshift(e,t){}wrap(e){return this}push(e,t){return  false}_destroy(e,t){this.removeAllListeners();}destroy(e){return this.destroyed=true,this._destroy(e),this}pipe(e,t){return {}}compose(e,t){throw new Error("Method not implemented.")}[Symbol.asyncDispose](){return this.destroy(),Promise.resolve()}async*[Symbol.asyncIterator](){throw o("Readable.asyncIterator")}iterator(e){throw o("Readable.iterator")}map(e,t){throw o("Readable.map")}filter(e,t){throw o("Readable.filter")}forEach(e,t){throw o("Readable.forEach")}reduce(e,t,r){throw o("Readable.reduce")}find(e,t){throw o("Readable.find")}findIndex(e,t){throw o("Readable.findIndex")}some(e,t){throw o("Readable.some")}toArray(e){throw o("Readable.toArray")}every(e,t){throw o("Readable.every")}flatMap(e,t){throw o("Readable.flatMap")}drop(e,t){throw o("Readable.drop")}take(e,t){throw o("Readable.take")}asIndexedPairs(e){throw o("Readable.asIndexedPairs")}};let l$1 = class l extends EventEmitter{__unenv__={};writable=true;writableEnded=false;writableFinished=false;writableHighWaterMark=0;writableLength=0;writableObjectMode=false;writableCorked=0;closed=false;errored=null;writableNeedDrain=false;writableAborted=false;destroyed=false;_data;_encoding="utf8";constructor(e){super();}pipe(e,t){return {}}_write(e,t,r){if(this.writableEnded){r&&r();return}if(this._data===void 0)this._data=e;else {const s=typeof this._data=="string"?Buffer$1.from(this._data,this._encoding||t||"utf8"):this._data,a=typeof e=="string"?Buffer$1.from(e,t||this._encoding||"utf8"):e;this._data=Buffer$1.concat([s,a]);}this._encoding=t,r&&r();}_writev(e,t){}_destroy(e,t){}_final(e){}write(e,t,r){const s=typeof t=="string"?this._encoding:"utf8",a=typeof t=="function"?t:typeof r=="function"?r:void 0;return this._write(e,s,a),true}setDefaultEncoding(e){return this}end(e,t,r){const s=typeof e=="function"?e:typeof t=="function"?t:typeof r=="function"?r:void 0;if(this.writableEnded)return s&&s(),this;const a=e===s?void 0:e;if(a){const u=t===s?void 0:t;this.write(a,u);}return this.writableEnded=true,this.writableFinished=true,this.emit("close"),this.emit("finish"),s&&s(),this}cork(){}uncork(){}destroy(e){return this.destroyed=true,delete this._data,this.removeAllListeners(),this}compose(e,t){throw new Error("Method not implemented.")}[Symbol.asyncDispose](){return Promise.resolve()}};const c=class{allowHalfOpen=true;_destroy;constructor(e=new i$1,t=new l$1){Object.assign(this,e),Object.assign(this,t),this._destroy=m(e._destroy,t._destroy);}};function _(){return Object.assign(c.prototype,i$1.prototype),Object.assign(c.prototype,l$1.prototype),c}function m(...n){return function(...e){for(const t of n)t(...e);}}const g=_();class A extends g{__unenv__={};bufferSize=0;bytesRead=0;bytesWritten=0;connecting=false;destroyed=false;pending=false;localAddress="";localPort=0;remoteAddress="";remoteFamily="";remotePort=0;autoSelectFamilyAttemptedAddresses=[];readyState="readOnly";constructor(e){super();}write(e,t,r){return  false}connect(e,t,r){return this}end(e,t,r){return this}setEncoding(e){return this}pause(){return this}resume(){return this}setTimeout(e,t){return this}setNoDelay(e){return this}setKeepAlive(e,t){return this}address(){return {}}unref(){return this}ref(){return this}destroySoon(){this.destroy();}resetAndDestroy(){const e=new Error("ERR_SOCKET_CLOSED");return e.code="ERR_SOCKET_CLOSED",this.destroy(e),this}}class y extends i$1{aborted=false;httpVersion="1.1";httpVersionMajor=1;httpVersionMinor=1;complete=true;connection;socket;headers={};trailers={};method="GET";url="/";statusCode=200;statusMessage="";closed=false;errored=null;readable=false;constructor(e){super(),this.socket=this.connection=e||new A;}get rawHeaders(){const e=this.headers,t=[];for(const r in e)if(Array.isArray(e[r]))for(const s of e[r])t.push(r,s);else t.push(r,e[r]);return t}get rawTrailers(){return []}setTimeout(e,t){return this}get headersDistinct(){return p(this.headers)}get trailersDistinct(){return p(this.trailers)}}function p(n){const e={};for(const[t,r]of Object.entries(n))t&&(e[t]=(Array.isArray(r)?r:[r]).filter(Boolean));return e}class w extends l$1{statusCode=200;statusMessage="";upgrading=false;chunkedEncoding=false;shouldKeepAlive=false;useChunkedEncodingByDefault=false;sendDate=false;finished=false;headersSent=false;strictContentLength=false;connection=null;socket=null;req;_headers={};constructor(e){super(),this.req=e;}assignSocket(e){e._httpMessage=this,this.socket=e,this.connection=e,this.emit("socket",e),this._flush();}_flush(){this.flushHeaders();}detachSocket(e){}writeContinue(e){}writeHead(e,t,r){e&&(this.statusCode=e),typeof t=="string"&&(this.statusMessage=t,t=void 0);const s=r||t;if(s&&!Array.isArray(s))for(const a in s)this.setHeader(a,s[a]);return this.headersSent=true,this}writeProcessing(){}setTimeout(e,t){return this}appendHeader(e,t){e=e.toLowerCase();const r=this._headers[e],s=[...Array.isArray(r)?r:[r],...Array.isArray(t)?t:[t]].filter(Boolean);return this._headers[e]=s.length>1?s:s[0],this}setHeader(e,t){return this._headers[e.toLowerCase()]=t,this}setHeaders(e){for(const[t,r]of Object.entries(e))this.setHeader(t,r);return this}getHeader(e){return this._headers[e.toLowerCase()]}getHeaders(){return this._headers}getHeaderNames(){return Object.keys(this._headers)}hasHeader(e){return e.toLowerCase()in this._headers}removeHeader(e){delete this._headers[e.toLowerCase()];}addTrailers(e){}flushHeaders(){}writeEarlyHints(e,t){typeof t=="function"&&t();}}const E=(()=>{const n=function(){};return n.prototype=Object.create(null),n})();function R(n={}){const e=new E,t=Array.isArray(n)||H(n)?n:Object.entries(n);for(const[r,s]of t)if(s){if(e[r]===void 0){e[r]=s;continue}e[r]=[...Array.isArray(e[r])?e[r]:[e[r]],...Array.isArray(s)?s:[s]];}return e}function H(n){return typeof n?.entries=="function"}function v(n={}){if(n instanceof Headers)return n;const e=new Headers;for(const[t,r]of Object.entries(n))if(r!==void 0){if(Array.isArray(r)){for(const s of r)e.append(t,String(s));continue}e.set(t,String(r));}return e}const S=new Set([101,204,205,304]);async function b(n,e){const t=new y,r=new w(t);t.url=e.url?.toString()||"/";let s;if(!t.url.startsWith("/")){const d=new URL(t.url);s=d.host,t.url=d.pathname+d.search+d.hash;}t.method=e.method||"GET",t.headers=R(e.headers||{}),t.headers.host||(t.headers.host=e.host||s||"localhost"),t.connection.encrypted=t.connection.encrypted||e.protocol==="https",t.body=e.body||null,t.__unenv__=e.context,await n(t,r);let a=r._data;(S.has(r.statusCode)||t.method.toUpperCase()==="HEAD")&&(a=null,delete r._headers["content-length"]);const u={status:r.statusCode,statusText:r.statusMessage,headers:r._headers,body:a};return t.destroy(),r.destroy(),u}async function C(n,e,t={}){try{const r=await b(n,{url:e,...t});return new Response(r.body,{status:r.status,statusText:r.statusText,headers:v(r.headers)})}catch(r){return new Response(r.toString(),{status:Number.parseInt(r.statusCode||r.code)||500,statusText:r.statusText})}}

function hasProp(obj, prop) {
  try {
    return prop in obj;
  } catch {
    return false;
  }
}

class H3Error extends Error {
  static __h3_error__ = true;
  statusCode = 500;
  fatal = false;
  unhandled = false;
  statusMessage;
  data;
  cause;
  constructor(message, opts = {}) {
    super(message, opts);
    if (opts.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
  toJSON() {
    const obj = {
      message: this.message,
      statusCode: sanitizeStatusCode(this.statusCode, 500)
    };
    if (this.statusMessage) {
      obj.statusMessage = sanitizeStatusMessage(this.statusMessage);
    }
    if (this.data !== void 0) {
      obj.data = this.data;
    }
    return obj;
  }
}
function createError$1(input) {
  if (typeof input === "string") {
    return new H3Error(input);
  }
  if (isError(input)) {
    return input;
  }
  const err = new H3Error(input.message ?? input.statusMessage ?? "", {
    cause: input.cause || input
  });
  if (hasProp(input, "stack")) {
    try {
      Object.defineProperty(err, "stack", {
        get() {
          return input.stack;
        }
      });
    } catch {
      try {
        err.stack = input.stack;
      } catch {
      }
    }
  }
  if (input.data) {
    err.data = input.data;
  }
  if (input.statusCode) {
    err.statusCode = sanitizeStatusCode(input.statusCode, err.statusCode);
  } else if (input.status) {
    err.statusCode = sanitizeStatusCode(input.status, err.statusCode);
  }
  if (input.statusMessage) {
    err.statusMessage = input.statusMessage;
  } else if (input.statusText) {
    err.statusMessage = input.statusText;
  }
  if (err.statusMessage) {
    const originalMessage = err.statusMessage;
    const sanitizedMessage = sanitizeStatusMessage(err.statusMessage);
    if (sanitizedMessage !== originalMessage) {
      console.warn(
        "[h3] Please prefer using `message` for longer error messages instead of `statusMessage`. In the future, `statusMessage` will be sanitized by default."
      );
    }
  }
  if (input.fatal !== void 0) {
    err.fatal = input.fatal;
  }
  if (input.unhandled !== void 0) {
    err.unhandled = input.unhandled;
  }
  return err;
}
function sendError(event, error, debug) {
  if (event.handled) {
    return;
  }
  const h3Error = isError(error) ? error : createError$1(error);
  const responseBody = {
    statusCode: h3Error.statusCode,
    statusMessage: h3Error.statusMessage,
    stack: [],
    data: h3Error.data
  };
  if (debug) {
    responseBody.stack = (h3Error.stack || "").split("\n").map((l) => l.trim());
  }
  if (event.handled) {
    return;
  }
  const _code = Number.parseInt(h3Error.statusCode);
  setResponseStatus(event, _code, h3Error.statusMessage);
  event.node.res.setHeader("content-type", MIMES.json);
  event.node.res.end(JSON.stringify(responseBody, void 0, 2));
}
function isError(input) {
  return input?.constructor?.__h3_error__ === true;
}

function parse(multipartBodyBuffer, boundary) {
  let lastline = "";
  let state = 0 /* INIT */;
  let buffer = [];
  const allParts = [];
  let currentPartHeaders = [];
  for (let i = 0; i < multipartBodyBuffer.length; i++) {
    const prevByte = i > 0 ? multipartBodyBuffer[i - 1] : null;
    const currByte = multipartBodyBuffer[i];
    const newLineChar = currByte === 10 || currByte === 13;
    if (!newLineChar) {
      lastline += String.fromCodePoint(currByte);
    }
    const newLineDetected = currByte === 10 && prevByte === 13;
    if (0 /* INIT */ === state && newLineDetected) {
      if ("--" + boundary === lastline) {
        state = 1 /* READING_HEADERS */;
      }
      lastline = "";
    } else if (1 /* READING_HEADERS */ === state && newLineDetected) {
      if (lastline.length > 0) {
        const i2 = lastline.indexOf(":");
        if (i2 > 0) {
          const name = lastline.slice(0, i2).toLowerCase();
          const value = lastline.slice(i2 + 1).trim();
          currentPartHeaders.push([name, value]);
        }
      } else {
        state = 2 /* READING_DATA */;
        buffer = [];
      }
      lastline = "";
    } else if (2 /* READING_DATA */ === state) {
      if (lastline.length > boundary.length + 4) {
        lastline = "";
      }
      if ("--" + boundary === lastline) {
        const j = buffer.length - lastline.length;
        const part = buffer.slice(0, j - 1);
        allParts.push(process$1(part, currentPartHeaders));
        buffer = [];
        currentPartHeaders = [];
        lastline = "";
        state = 3 /* READING_PART_SEPARATOR */;
      } else {
        buffer.push(currByte);
      }
      if (newLineDetected) {
        lastline = "";
      }
    } else if (3 /* READING_PART_SEPARATOR */ === state && newLineDetected) {
      state = 1 /* READING_HEADERS */;
    }
  }
  return allParts;
}
function process$1(data, headers) {
  const dataObj = {};
  const contentDispositionHeader = headers.find((h) => h[0] === "content-disposition")?.[1] || "";
  for (const i of contentDispositionHeader.split(";")) {
    const s = i.split("=");
    if (s.length !== 2) {
      continue;
    }
    const key = (s[0] || "").trim();
    if (key === "name" || key === "filename") {
      const _value = (s[1] || "").trim().replace(/"/g, "");
      dataObj[key] = Buffer.from(_value, "latin1").toString("utf8");
    }
  }
  const contentType = headers.find((h) => h[0] === "content-type")?.[1] || "";
  if (contentType) {
    dataObj.type = contentType;
  }
  dataObj.data = Buffer.from(data);
  return dataObj;
}

function getQuery(event) {
  return getQuery$1(event.path || "");
}
function getRouterParams(event, opts = {}) {
  let params = event.context.params || {};
  if (opts.decode) {
    params = { ...params };
    for (const key in params) {
      params[key] = decode$1(params[key]);
    }
  }
  return params;
}
function getRouterParam(event, name, opts = {}) {
  const params = getRouterParams(event, opts);
  return params[name];
}
function isMethod(event, expected, allowHead) {
  if (typeof expected === "string") {
    if (event.method === expected) {
      return true;
    }
  } else if (expected.includes(event.method)) {
    return true;
  }
  return false;
}
function assertMethod(event, expected, allowHead) {
  if (!isMethod(event, expected)) {
    throw createError$1({
      statusCode: 405,
      statusMessage: "HTTP method is not allowed."
    });
  }
}
function getRequestHeaders(event) {
  const _headers = {};
  for (const key in event.node.req.headers) {
    const val = event.node.req.headers[key];
    _headers[key] = Array.isArray(val) ? val.filter(Boolean).join(", ") : val;
  }
  return _headers;
}
function getRequestHeader(event, name) {
  const headers = getRequestHeaders(event);
  const value = headers[name.toLowerCase()];
  return value;
}
function getRequestHost(event, opts = {}) {
  if (opts.xForwardedHost) {
    const _header = event.node.req.headers["x-forwarded-host"];
    const xForwardedHost = (_header || "").split(",").shift()?.trim();
    if (xForwardedHost) {
      return xForwardedHost;
    }
  }
  return event.node.req.headers.host || "localhost";
}
function getRequestProtocol(event, opts = {}) {
  if (opts.xForwardedProto !== false && event.node.req.headers["x-forwarded-proto"] === "https") {
    return "https";
  }
  return event.node.req.connection?.encrypted ? "https" : "http";
}
function getRequestURL(event, opts = {}) {
  const host = getRequestHost(event, opts);
  const protocol = getRequestProtocol(event, opts);
  const path = (event.node.req.originalUrl || event.path).replace(
    /^[/\\]+/g,
    "/"
  );
  return new URL(path, `${protocol}://${host}`);
}
function getRequestIP(event, opts = {}) {
  if (event.context.clientAddress) {
    return event.context.clientAddress;
  }
  if (opts.xForwardedFor) {
    const xForwardedFor = getRequestHeader(event, "x-forwarded-for")?.split(",").shift()?.trim();
    if (xForwardedFor) {
      return xForwardedFor;
    }
  }
  if (event.node.req.socket.remoteAddress) {
    return event.node.req.socket.remoteAddress;
  }
}

const RawBodySymbol = Symbol.for("h3RawBody");
const ParsedBodySymbol = Symbol.for("h3ParsedBody");
const PayloadMethods$1 = ["PATCH", "POST", "PUT", "DELETE"];
function readRawBody(event, encoding = "utf8") {
  assertMethod(event, PayloadMethods$1);
  const _rawBody = event._requestBody || event.web?.request?.body || event.node.req[RawBodySymbol] || event.node.req.rawBody || event.node.req.body;
  if (_rawBody) {
    const promise2 = Promise.resolve(_rawBody).then((_resolved) => {
      if (Buffer.isBuffer(_resolved)) {
        return _resolved;
      }
      if (typeof _resolved.pipeTo === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.pipeTo(
            new WritableStream({
              write(chunk) {
                chunks.push(chunk);
              },
              close() {
                resolve(Buffer.concat(chunks));
              },
              abort(reason) {
                reject(reason);
              }
            })
          ).catch(reject);
        });
      } else if (typeof _resolved.pipe === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.on("data", (chunk) => {
            chunks.push(chunk);
          }).on("end", () => {
            resolve(Buffer.concat(chunks));
          }).on("error", reject);
        });
      }
      if (_resolved.constructor === Object) {
        return Buffer.from(JSON.stringify(_resolved));
      }
      if (_resolved instanceof URLSearchParams) {
        return Buffer.from(_resolved.toString());
      }
      if (_resolved instanceof FormData) {
        return new Response(_resolved).bytes().then((uint8arr) => Buffer.from(uint8arr));
      }
      return Buffer.from(_resolved);
    });
    return encoding ? promise2.then((buff) => buff.toString(encoding)) : promise2;
  }
  if (!Number.parseInt(event.node.req.headers["content-length"] || "") && !/\bchunked\b/i.test(
    String(event.node.req.headers["transfer-encoding"] ?? "")
  )) {
    return Promise.resolve(void 0);
  }
  const promise = event.node.req[RawBodySymbol] = new Promise(
    (resolve, reject) => {
      const bodyData = [];
      event.node.req.on("error", (err) => {
        reject(err);
      }).on("data", (chunk) => {
        bodyData.push(chunk);
      }).on("end", () => {
        resolve(Buffer.concat(bodyData));
      });
    }
  );
  const result = encoding ? promise.then((buff) => buff.toString(encoding)) : promise;
  return result;
}
async function readBody(event, options = {}) {
  const request = event.node.req;
  if (hasProp(request, ParsedBodySymbol)) {
    return request[ParsedBodySymbol];
  }
  const contentType = request.headers["content-type"] || "";
  const body = await readRawBody(event);
  let parsed;
  if (contentType === "application/json") {
    parsed = _parseJSON(body, options.strict ?? true);
  } else if (contentType.startsWith("application/x-www-form-urlencoded")) {
    parsed = _parseURLEncodedBody(body);
  } else if (contentType.startsWith("text/")) {
    parsed = body;
  } else {
    parsed = _parseJSON(body, options.strict ?? false);
  }
  request[ParsedBodySymbol] = parsed;
  return parsed;
}
async function readMultipartFormData(event) {
  const contentType = getRequestHeader(event, "content-type");
  if (!contentType || !contentType.startsWith("multipart/form-data")) {
    return;
  }
  const boundary = contentType.match(/boundary=([^;]*)(;|$)/i)?.[1];
  if (!boundary) {
    return;
  }
  const body = await readRawBody(event, false);
  if (!body) {
    return;
  }
  return parse(body, boundary);
}
function getRequestWebStream(event) {
  if (!PayloadMethods$1.includes(event.method)) {
    return;
  }
  const bodyStream = event.web?.request?.body || event._requestBody;
  if (bodyStream) {
    return bodyStream;
  }
  const _hasRawBody = RawBodySymbol in event.node.req || "rawBody" in event.node.req || "body" in event.node.req || "__unenv__" in event.node.req;
  if (_hasRawBody) {
    return new ReadableStream({
      async start(controller) {
        const _rawBody = await readRawBody(event, false);
        if (_rawBody) {
          controller.enqueue(_rawBody);
        }
        controller.close();
      }
    });
  }
  return new ReadableStream({
    start: (controller) => {
      event.node.req.on("data", (chunk) => {
        controller.enqueue(chunk);
      });
      event.node.req.on("end", () => {
        controller.close();
      });
      event.node.req.on("error", (err) => {
        controller.error(err);
      });
    }
  });
}
function _parseJSON(body = "", strict) {
  if (!body) {
    return void 0;
  }
  try {
    return destr(body, { strict });
  } catch {
    throw createError$1({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "Invalid JSON body"
    });
  }
}
function _parseURLEncodedBody(body) {
  const form = new URLSearchParams(body);
  const parsedForm = /* @__PURE__ */ Object.create(null);
  for (const [key, value] of form.entries()) {
    if (hasProp(parsedForm, key)) {
      if (!Array.isArray(parsedForm[key])) {
        parsedForm[key] = [parsedForm[key]];
      }
      parsedForm[key].push(value);
    } else {
      parsedForm[key] = value;
    }
  }
  return parsedForm;
}

function handleCacheHeaders(event, opts) {
  const cacheControls = ["public", ...opts.cacheControls || []];
  let cacheMatched = false;
  if (opts.maxAge !== void 0) {
    cacheControls.push(`max-age=${+opts.maxAge}`, `s-maxage=${+opts.maxAge}`);
  }
  if (opts.modifiedTime) {
    const modifiedTime = new Date(opts.modifiedTime);
    const ifModifiedSince = event.node.req.headers["if-modified-since"];
    event.node.res.setHeader("last-modified", modifiedTime.toUTCString());
    if (ifModifiedSince && new Date(ifModifiedSince) >= modifiedTime) {
      cacheMatched = true;
    }
  }
  if (opts.etag) {
    event.node.res.setHeader("etag", opts.etag);
    const ifNonMatch = event.node.req.headers["if-none-match"];
    if (ifNonMatch === opts.etag) {
      cacheMatched = true;
    }
  }
  event.node.res.setHeader("cache-control", cacheControls.join(", "));
  if (cacheMatched) {
    event.node.res.statusCode = 304;
    if (!event.handled) {
      event.node.res.end();
    }
    return true;
  }
  return false;
}

const MIMES = {
  html: "text/html",
  json: "application/json"
};

const DISALLOWED_STATUS_CHARS = /[^\u0009\u0020-\u007E]/g;
function sanitizeStatusMessage(statusMessage = "") {
  return statusMessage.replace(DISALLOWED_STATUS_CHARS, "");
}
function sanitizeStatusCode(statusCode, defaultStatusCode = 200) {
  if (!statusCode) {
    return defaultStatusCode;
  }
  if (typeof statusCode === "string") {
    statusCode = Number.parseInt(statusCode, 10);
  }
  if (statusCode < 100 || statusCode > 999) {
    return defaultStatusCode;
  }
  return statusCode;
}

function getDistinctCookieKey(name, opts) {
  return [name, opts.domain || "", opts.path || "/"].join(";");
}

function parseCookies(event) {
  return parse$1(event.node.req.headers.cookie || "");
}
function getCookie(event, name) {
  return parseCookies(event)[name];
}
function setCookie(event, name, value, serializeOptions = {}) {
  if (!serializeOptions.path) {
    serializeOptions = { path: "/", ...serializeOptions };
  }
  const newCookie = serialize$2(name, value, serializeOptions);
  const currentCookies = splitCookiesString(
    event.node.res.getHeader("set-cookie")
  );
  if (currentCookies.length === 0) {
    event.node.res.setHeader("set-cookie", newCookie);
    return;
  }
  const newCookieKey = getDistinctCookieKey(name, serializeOptions);
  event.node.res.removeHeader("set-cookie");
  for (const cookie of currentCookies) {
    const parsed = parseSetCookie(cookie);
    const key = getDistinctCookieKey(parsed.name, parsed);
    if (key === newCookieKey) {
      continue;
    }
    event.node.res.appendHeader("set-cookie", cookie);
  }
  event.node.res.appendHeader("set-cookie", newCookie);
}
function deleteCookie(event, name, serializeOptions) {
  setCookie(event, name, "", {
    ...serializeOptions,
    maxAge: 0
  });
}
function splitCookiesString(cookiesString) {
  if (Array.isArray(cookiesString)) {
    return cookiesString.flatMap((c) => splitCookiesString(c));
  }
  if (typeof cookiesString !== "string") {
    return [];
  }
  const cookiesStrings = [];
  let pos = 0;
  let start;
  let ch;
  let lastComma;
  let nextStart;
  let cookiesSeparatorFound;
  const skipWhitespace = () => {
    while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
      pos += 1;
    }
    return pos < cookiesString.length;
  };
  const notSpecialChar = () => {
    ch = cookiesString.charAt(pos);
    return ch !== "=" && ch !== ";" && ch !== ",";
  };
  while (pos < cookiesString.length) {
    start = pos;
    cookiesSeparatorFound = false;
    while (skipWhitespace()) {
      ch = cookiesString.charAt(pos);
      if (ch === ",") {
        lastComma = pos;
        pos += 1;
        skipWhitespace();
        nextStart = pos;
        while (pos < cookiesString.length && notSpecialChar()) {
          pos += 1;
        }
        if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
          cookiesSeparatorFound = true;
          pos = nextStart;
          cookiesStrings.push(cookiesString.slice(start, lastComma));
          start = pos;
        } else {
          pos = lastComma + 1;
        }
      } else {
        pos += 1;
      }
    }
    if (!cookiesSeparatorFound || pos >= cookiesString.length) {
      cookiesStrings.push(cookiesString.slice(start));
    }
  }
  return cookiesStrings;
}

const defer = typeof setImmediate === "undefined" ? (fn) => fn() : setImmediate;
function send(event, data, type) {
  if (type) {
    defaultContentType(event, type);
  }
  return new Promise((resolve) => {
    defer(() => {
      if (!event.handled) {
        event.node.res.end(data);
      }
      resolve();
    });
  });
}
function sendNoContent(event, code) {
  if (event.handled) {
    return;
  }
  if (!code && event.node.res.statusCode !== 200) {
    code = event.node.res.statusCode;
  }
  const _code = sanitizeStatusCode(code, 204);
  if (_code === 204) {
    event.node.res.removeHeader("content-length");
  }
  event.node.res.writeHead(_code);
  event.node.res.end();
}
function setResponseStatus(event, code, text) {
  if (code) {
    event.node.res.statusCode = sanitizeStatusCode(
      code,
      event.node.res.statusCode
    );
  }
  if (text) {
    event.node.res.statusMessage = sanitizeStatusMessage(text);
  }
}
function getResponseStatus(event) {
  return event.node.res.statusCode;
}
function getResponseStatusText(event) {
  return event.node.res.statusMessage;
}
function defaultContentType(event, type) {
  if (type && event.node.res.statusCode !== 304 && !event.node.res.getHeader("content-type")) {
    event.node.res.setHeader("content-type", type);
  }
}
function sendRedirect(event, location, code = 302) {
  event.node.res.statusCode = sanitizeStatusCode(
    code,
    event.node.res.statusCode
  );
  event.node.res.setHeader("location", location);
  const encodedLoc = location.replace(/"/g, "%22");
  const html = `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`;
  return send(event, html, MIMES.html);
}
function getResponseHeader(event, name) {
  return event.node.res.getHeader(name);
}
function setResponseHeaders(event, headers) {
  for (const [name, value] of Object.entries(headers)) {
    event.node.res.setHeader(
      name,
      value
    );
  }
}
const setHeaders = setResponseHeaders;
function setResponseHeader(event, name, value) {
  event.node.res.setHeader(name, value);
}
function appendResponseHeader(event, name, value) {
  let current = event.node.res.getHeader(name);
  if (!current) {
    event.node.res.setHeader(name, value);
    return;
  }
  if (!Array.isArray(current)) {
    current = [current.toString()];
  }
  event.node.res.setHeader(name, [...current, value]);
}
function removeResponseHeader(event, name) {
  return event.node.res.removeHeader(name);
}
function isStream(data) {
  if (!data || typeof data !== "object") {
    return false;
  }
  if (typeof data.pipe === "function") {
    if (typeof data._read === "function") {
      return true;
    }
    if (typeof data.abort === "function") {
      return true;
    }
  }
  if (typeof data.pipeTo === "function") {
    return true;
  }
  return false;
}
function isWebResponse(data) {
  return typeof Response !== "undefined" && data instanceof Response;
}
function sendStream(event, stream) {
  if (!stream || typeof stream !== "object") {
    throw new Error("[h3] Invalid stream provided.");
  }
  event.node.res._data = stream;
  if (!event.node.res.socket) {
    event._handled = true;
    return Promise.resolve();
  }
  if (hasProp(stream, "pipeTo") && typeof stream.pipeTo === "function") {
    return stream.pipeTo(
      new WritableStream({
        write(chunk) {
          event.node.res.write(chunk);
        }
      })
    ).then(() => {
      event.node.res.end();
    });
  }
  if (hasProp(stream, "pipe") && typeof stream.pipe === "function") {
    return new Promise((resolve, reject) => {
      stream.pipe(event.node.res);
      if (stream.on) {
        stream.on("end", () => {
          event.node.res.end();
          resolve();
        });
        stream.on("error", (error) => {
          reject(error);
        });
      }
      event.node.res.on("close", () => {
        if (stream.abort) {
          stream.abort();
        }
      });
    });
  }
  throw new Error("[h3] Invalid or incompatible stream provided.");
}
function sendWebResponse(event, response) {
  for (const [key, value] of response.headers) {
    if (key === "set-cookie") {
      event.node.res.appendHeader(key, splitCookiesString(value));
    } else {
      event.node.res.setHeader(key, value);
    }
  }
  if (response.status) {
    event.node.res.statusCode = sanitizeStatusCode(
      response.status,
      event.node.res.statusCode
    );
  }
  if (response.statusText) {
    event.node.res.statusMessage = sanitizeStatusMessage(response.statusText);
  }
  if (response.redirected) {
    event.node.res.setHeader("location", response.url);
  }
  if (!response.body) {
    event.node.res.end();
    return;
  }
  return sendStream(event, response.body);
}

const PayloadMethods = /* @__PURE__ */ new Set(["PATCH", "POST", "PUT", "DELETE"]);
const ignoredHeaders = /* @__PURE__ */ new Set([
  "transfer-encoding",
  "accept-encoding",
  "connection",
  "keep-alive",
  "upgrade",
  "expect",
  "host",
  "accept"
]);
async function proxyRequest(event, target, opts = {}) {
  let body;
  let duplex;
  if (PayloadMethods.has(event.method)) {
    if (opts.streamRequest) {
      body = getRequestWebStream(event);
      duplex = "half";
    } else {
      body = await readRawBody(event, false).catch(() => void 0);
    }
  }
  const method = opts.fetchOptions?.method || event.method;
  const fetchHeaders = mergeHeaders$1(
    getProxyRequestHeaders(event, { host: target.startsWith("/") }),
    opts.fetchOptions?.headers,
    opts.headers
  );
  return sendProxy(event, target, {
    ...opts,
    fetchOptions: {
      method,
      body,
      duplex,
      ...opts.fetchOptions,
      headers: fetchHeaders
    }
  });
}
async function sendProxy(event, target, opts = {}) {
  let response;
  try {
    response = await _getFetch(opts.fetch)(target, {
      headers: opts.headers,
      ignoreResponseError: true,
      // make $ofetch.raw transparent
      ...opts.fetchOptions
    });
  } catch (error) {
    throw createError$1({
      status: 502,
      statusMessage: "Bad Gateway",
      cause: error
    });
  }
  event.node.res.statusCode = sanitizeStatusCode(
    response.status,
    event.node.res.statusCode
  );
  event.node.res.statusMessage = sanitizeStatusMessage(response.statusText);
  const cookies = [];
  for (const [key, value] of response.headers.entries()) {
    if (key === "content-encoding") {
      continue;
    }
    if (key === "content-length") {
      continue;
    }
    if (key === "set-cookie") {
      cookies.push(...splitCookiesString(value));
      continue;
    }
    event.node.res.setHeader(key, value);
  }
  if (cookies.length > 0) {
    event.node.res.setHeader(
      "set-cookie",
      cookies.map((cookie) => {
        if (opts.cookieDomainRewrite) {
          cookie = rewriteCookieProperty(
            cookie,
            opts.cookieDomainRewrite,
            "domain"
          );
        }
        if (opts.cookiePathRewrite) {
          cookie = rewriteCookieProperty(
            cookie,
            opts.cookiePathRewrite,
            "path"
          );
        }
        return cookie;
      })
    );
  }
  if (opts.onResponse) {
    await opts.onResponse(event, response);
  }
  if (response._data !== void 0) {
    return response._data;
  }
  if (event.handled) {
    return;
  }
  if (opts.sendStream === false) {
    const data = new Uint8Array(await response.arrayBuffer());
    return event.node.res.end(data);
  }
  if (response.body) {
    for await (const chunk of response.body) {
      event.node.res.write(chunk);
    }
  }
  return event.node.res.end();
}
function getProxyRequestHeaders(event, opts) {
  const headers = /* @__PURE__ */ Object.create(null);
  const reqHeaders = getRequestHeaders(event);
  for (const name in reqHeaders) {
    if (!ignoredHeaders.has(name) || name === "host" && opts?.host) {
      headers[name] = reqHeaders[name];
    }
  }
  return headers;
}
function fetchWithEvent(event, req, init, options) {
  return _getFetch(options?.fetch)(req, {
    ...init,
    context: init?.context || event.context,
    headers: {
      ...getProxyRequestHeaders(event, {
        host: typeof req === "string" && req.startsWith("/")
      }),
      ...init?.headers
    }
  });
}
function _getFetch(_fetch) {
  if (_fetch) {
    return _fetch;
  }
  if (globalThis.fetch) {
    return globalThis.fetch;
  }
  throw new Error(
    "fetch is not available. Try importing `node-fetch-native/polyfill` for Node.js."
  );
}
function rewriteCookieProperty(header, map, property) {
  const _map = typeof map === "string" ? { "*": map } : map;
  return header.replace(
    new RegExp(`(;\\s*${property}=)([^;]+)`, "gi"),
    (match, prefix, previousValue) => {
      let newValue;
      if (previousValue in _map) {
        newValue = _map[previousValue];
      } else if ("*" in _map) {
        newValue = _map["*"];
      } else {
        return match;
      }
      return newValue ? prefix + newValue : "";
    }
  );
}
function mergeHeaders$1(defaults, ...inputs) {
  const _inputs = inputs.filter(Boolean);
  if (_inputs.length === 0) {
    return defaults;
  }
  const merged = new Headers(defaults);
  for (const input of _inputs) {
    const entries = Array.isArray(input) ? input : typeof input.entries === "function" ? input.entries() : Object.entries(input);
    for (const [key, value] of entries) {
      if (value !== void 0) {
        merged.set(key, value);
      }
    }
  }
  return merged;
}

class H3Event {
  "__is_event__" = true;
  // Context
  node;
  // Node
  web;
  // Web
  context = {};
  // Shared
  // Request
  _method;
  _path;
  _headers;
  _requestBody;
  // Response
  _handled = false;
  // Hooks
  _onBeforeResponseCalled;
  _onAfterResponseCalled;
  constructor(req, res) {
    this.node = { req, res };
  }
  // --- Request ---
  get method() {
    if (!this._method) {
      this._method = (this.node.req.method || "GET").toUpperCase();
    }
    return this._method;
  }
  get path() {
    return this._path || this.node.req.url || "/";
  }
  get headers() {
    if (!this._headers) {
      this._headers = _normalizeNodeHeaders(this.node.req.headers);
    }
    return this._headers;
  }
  // --- Respoonse ---
  get handled() {
    return this._handled || this.node.res.writableEnded || this.node.res.headersSent;
  }
  respondWith(response) {
    return Promise.resolve(response).then(
      (_response) => sendWebResponse(this, _response)
    );
  }
  // --- Utils ---
  toString() {
    return `[${this.method}] ${this.path}`;
  }
  toJSON() {
    return this.toString();
  }
  // --- Deprecated ---
  /** @deprecated Please use `event.node.req` instead. */
  get req() {
    return this.node.req;
  }
  /** @deprecated Please use `event.node.res` instead. */
  get res() {
    return this.node.res;
  }
}
function isEvent(input) {
  return hasProp(input, "__is_event__");
}
function createEvent(req, res) {
  return new H3Event(req, res);
}
function _normalizeNodeHeaders(nodeHeaders) {
  const headers = new Headers();
  for (const [name, value] of Object.entries(nodeHeaders)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        headers.append(name, item);
      }
    } else if (value) {
      headers.set(name, value);
    }
  }
  return headers;
}

function defineEventHandler(handler) {
  if (typeof handler === "function") {
    handler.__is_handler__ = true;
    return handler;
  }
  const _hooks = {
    onRequest: _normalizeArray(handler.onRequest),
    onBeforeResponse: _normalizeArray(handler.onBeforeResponse)
  };
  const _handler = (event) => {
    return _callHandler(event, handler.handler, _hooks);
  };
  _handler.__is_handler__ = true;
  _handler.__resolve__ = handler.handler.__resolve__;
  _handler.__websocket__ = handler.websocket;
  return _handler;
}
function _normalizeArray(input) {
  return input ? Array.isArray(input) ? input : [input] : void 0;
}
async function _callHandler(event, handler, hooks) {
  if (hooks.onRequest) {
    for (const hook of hooks.onRequest) {
      await hook(event);
      if (event.handled) {
        return;
      }
    }
  }
  const body = await handler(event);
  const response = { body };
  if (hooks.onBeforeResponse) {
    for (const hook of hooks.onBeforeResponse) {
      await hook(event, response);
    }
  }
  return response.body;
}
const eventHandler = defineEventHandler;
function isEventHandler(input) {
  return hasProp(input, "__is_handler__");
}
function toEventHandler(input, _, _route) {
  return input;
}
function defineLazyEventHandler(factory) {
  let _promise;
  let _resolved;
  const resolveHandler = () => {
    if (_resolved) {
      return Promise.resolve(_resolved);
    }
    if (!_promise) {
      _promise = Promise.resolve(factory()).then((r) => {
        const handler2 = r.default || r;
        if (typeof handler2 !== "function") {
          throw new TypeError(
            "Invalid lazy handler result. It should be a function:",
            handler2
          );
        }
        _resolved = { handler: toEventHandler(r.default || r) };
        return _resolved;
      });
    }
    return _promise;
  };
  const handler = eventHandler((event) => {
    if (_resolved) {
      return _resolved.handler(event);
    }
    return resolveHandler().then((r) => r.handler(event));
  });
  handler.__resolve__ = resolveHandler;
  return handler;
}
const lazyEventHandler = defineLazyEventHandler;

function createApp(options = {}) {
  const stack = [];
  const handler = createAppEventHandler(stack, options);
  const resolve = createResolver(stack);
  handler.__resolve__ = resolve;
  const getWebsocket = cachedFn(() => websocketOptions(resolve, options));
  const app = {
    // @ts-expect-error
    use: (arg1, arg2, arg3) => use(app, arg1, arg2, arg3),
    resolve,
    handler,
    stack,
    options,
    get websocket() {
      return getWebsocket();
    }
  };
  return app;
}
function use(app, arg1, arg2, arg3) {
  if (Array.isArray(arg1)) {
    for (const i of arg1) {
      use(app, i, arg2, arg3);
    }
  } else if (Array.isArray(arg2)) {
    for (const i of arg2) {
      use(app, arg1, i, arg3);
    }
  } else if (typeof arg1 === "string") {
    app.stack.push(
      normalizeLayer({ ...arg3, route: arg1, handler: arg2 })
    );
  } else if (typeof arg1 === "function") {
    app.stack.push(normalizeLayer({ ...arg2, handler: arg1 }));
  } else {
    app.stack.push(normalizeLayer({ ...arg1 }));
  }
  return app;
}
function createAppEventHandler(stack, options) {
  const spacing = options.debug ? 2 : void 0;
  return eventHandler(async (event) => {
    event.node.req.originalUrl = event.node.req.originalUrl || event.node.req.url || "/";
    const _rawReqUrl = event.node.req.url || "/";
    const _reqPath = _decodePath(event._path || _rawReqUrl);
    event._path = _reqPath;
    const _needsRawUrl = _reqPath !== _rawReqUrl;
    let _layerPath;
    if (options.onRequest) {
      await options.onRequest(event);
    }
    for (const layer of stack) {
      if (layer.route.length > 1) {
        if (!_reqPath.startsWith(layer.route)) {
          continue;
        }
        _layerPath = _reqPath.slice(layer.route.length) || "/";
      } else {
        _layerPath = _reqPath;
      }
      if (layer.match && !layer.match(_layerPath, event)) {
        continue;
      }
      event._path = _layerPath;
      event.node.req.url = _needsRawUrl ? layer.route.length > 1 ? _rawReqUrl.slice(layer.route.length) || "/" : _rawReqUrl : _layerPath;
      const val = await layer.handler(event);
      const _body = val === void 0 ? void 0 : await val;
      if (_body !== void 0) {
        const _response = { body: _body };
        if (options.onBeforeResponse) {
          event._onBeforeResponseCalled = true;
          await options.onBeforeResponse(event, _response);
        }
        await handleHandlerResponse(event, _response.body, spacing);
        if (options.onAfterResponse) {
          event._onAfterResponseCalled = true;
          await options.onAfterResponse(event, _response);
        }
        return;
      }
      if (event.handled) {
        if (options.onAfterResponse) {
          event._onAfterResponseCalled = true;
          await options.onAfterResponse(event, void 0);
        }
        return;
      }
    }
    if (!event.handled) {
      throw createError$1({
        statusCode: 404,
        statusMessage: `Cannot find any path matching ${event.path || "/"}.`
      });
    }
    if (options.onAfterResponse) {
      event._onAfterResponseCalled = true;
      await options.onAfterResponse(event, void 0);
    }
  });
}
function createResolver(stack) {
  return async (path) => {
    let _layerPath;
    for (const layer of stack) {
      if (layer.route === "/" && !layer.handler.__resolve__) {
        continue;
      }
      if (!path.startsWith(layer.route)) {
        continue;
      }
      _layerPath = path.slice(layer.route.length) || "/";
      if (layer.match && !layer.match(_layerPath, void 0)) {
        continue;
      }
      let res = { route: layer.route, handler: layer.handler };
      if (res.handler.__resolve__) {
        const _res = await res.handler.__resolve__(_layerPath);
        if (!_res) {
          continue;
        }
        res = {
          ...res,
          ..._res,
          route: joinURL(res.route || "/", _res.route || "/")
        };
      }
      return res;
    }
  };
}
function normalizeLayer(input) {
  let handler = input.handler;
  if (handler.handler) {
    handler = handler.handler;
  }
  if (input.lazy) {
    handler = lazyEventHandler(handler);
  } else if (!isEventHandler(handler)) {
    handler = toEventHandler(handler, void 0, input.route);
  }
  return {
    route: withoutTrailingSlash(input.route),
    match: input.match,
    handler
  };
}
function handleHandlerResponse(event, val, jsonSpace) {
  if (val === null) {
    return sendNoContent(event);
  }
  if (val) {
    if (isWebResponse(val)) {
      return sendWebResponse(event, val);
    }
    if (isStream(val)) {
      return sendStream(event, val);
    }
    if (val.buffer) {
      return send(event, val);
    }
    if (val.arrayBuffer && typeof val.arrayBuffer === "function") {
      return val.arrayBuffer().then((arrayBuffer) => {
        return send(event, Buffer.from(arrayBuffer), val.type);
      });
    }
    if (val instanceof Error) {
      throw createError$1(val);
    }
    if (typeof val.end === "function") {
      return true;
    }
  }
  const valType = typeof val;
  if (valType === "string") {
    return send(event, val, MIMES.html);
  }
  if (valType === "object" || valType === "boolean" || valType === "number") {
    return send(event, JSON.stringify(val, void 0, jsonSpace), MIMES.json);
  }
  if (valType === "bigint") {
    return send(event, val.toString(), MIMES.json);
  }
  throw createError$1({
    statusCode: 500,
    statusMessage: `[h3] Cannot send ${valType} as response.`
  });
}
function cachedFn(fn) {
  let cache;
  return () => {
    if (!cache) {
      cache = fn();
    }
    return cache;
  };
}
function _decodePath(url) {
  const qIndex = url.indexOf("?");
  const path = qIndex === -1 ? url : url.slice(0, qIndex);
  const query = qIndex === -1 ? "" : url.slice(qIndex);
  const decodedPath = path.includes("%25") ? decodePath(path.replace(/%25/g, "%2525")) : decodePath(path);
  return decodedPath + query;
}
function websocketOptions(evResolver, appOptions) {
  return {
    ...appOptions.websocket,
    async resolve(info) {
      const url = info.request?.url || info.url || "/";
      const { pathname } = typeof url === "string" ? parseURL(url) : url;
      const resolved = await evResolver(pathname);
      return resolved?.handler?.__websocket__ || {};
    }
  };
}

const RouterMethods = [
  "connect",
  "delete",
  "get",
  "head",
  "options",
  "post",
  "put",
  "trace",
  "patch"
];
function createRouter(opts = {}) {
  const _router = createRouter$1({});
  const routes = {};
  let _matcher;
  const router = {};
  const addRoute = (path, handler, method) => {
    let route = routes[path];
    if (!route) {
      routes[path] = route = { path, handlers: {} };
      _router.insert(path, route);
    }
    if (Array.isArray(method)) {
      for (const m of method) {
        addRoute(path, handler, m);
      }
    } else {
      route.handlers[method] = toEventHandler(handler);
    }
    return router;
  };
  router.use = router.add = (path, handler, method) => addRoute(path, handler, method || "all");
  for (const method of RouterMethods) {
    router[method] = (path, handle) => router.add(path, handle, method);
  }
  const matchHandler = (path = "/", method = "get") => {
    const qIndex = path.indexOf("?");
    if (qIndex !== -1) {
      path = path.slice(0, Math.max(0, qIndex));
    }
    const matched = _router.lookup(path);
    if (!matched || !matched.handlers) {
      return {
        error: createError$1({
          statusCode: 404,
          name: "Not Found",
          statusMessage: `Cannot find any route matching ${path || "/"}.`
        })
      };
    }
    let handler = matched.handlers[method] || matched.handlers.all;
    if (!handler) {
      if (!_matcher) {
        _matcher = toRouteMatcher(_router);
      }
      const _matches = _matcher.matchAll(path).reverse();
      for (const _match of _matches) {
        if (_match.handlers[method]) {
          handler = _match.handlers[method];
          matched.handlers[method] = matched.handlers[method] || handler;
          break;
        }
        if (_match.handlers.all) {
          handler = _match.handlers.all;
          matched.handlers.all = matched.handlers.all || handler;
          break;
        }
      }
    }
    if (!handler) {
      return {
        error: createError$1({
          statusCode: 405,
          name: "Method Not Allowed",
          statusMessage: `Method ${method} is not allowed on this route.`
        })
      };
    }
    return { matched, handler };
  };
  const isPreemptive = opts.preemptive || opts.preemtive;
  router.handler = eventHandler((event) => {
    const match = matchHandler(
      event.path,
      event.method.toLowerCase()
    );
    if ("error" in match) {
      if (isPreemptive) {
        throw match.error;
      } else {
        return;
      }
    }
    event.context.matchedRoute = match.matched;
    const params = match.matched.params || {};
    event.context.params = params;
    return Promise.resolve(match.handler(event)).then((res) => {
      if (res === void 0 && isPreemptive) {
        return null;
      }
      return res;
    });
  });
  router.handler.__resolve__ = async (path) => {
    path = withLeadingSlash(path);
    const match = matchHandler(path);
    if ("error" in match) {
      return;
    }
    let res = {
      route: match.matched.path,
      handler: match.handler
    };
    if (match.handler.__resolve__) {
      const _res = await match.handler.__resolve__(path);
      if (!_res) {
        return;
      }
      res = { ...res, ..._res };
    }
    return res;
  };
  return router;
}
function toNodeListener(app) {
  const toNodeHandle = async function(req, res) {
    const event = createEvent(req, res);
    try {
      await app.handler(event);
    } catch (_error) {
      const error = createError$1(_error);
      if (!isError(_error)) {
        error.unhandled = true;
      }
      setResponseStatus(event, error.statusCode, error.statusMessage);
      if (app.options.onError) {
        await app.options.onError(error, event);
      }
      if (event.handled) {
        return;
      }
      if (error.unhandled || error.fatal) {
        console.error("[h3]", error.fatal ? "[fatal]" : "[unhandled]", error);
      }
      if (app.options.onBeforeResponse && !event._onBeforeResponseCalled) {
        await app.options.onBeforeResponse(event, { body: error });
      }
      await sendError(event, error, !!app.options.debug);
      if (app.options.onAfterResponse && !event._onAfterResponseCalled) {
        await app.options.onAfterResponse(event, { body: error });
      }
    }
  };
  return toNodeHandle;
}

function flatHooks(configHooks, hooks = {}, parentName) {
  for (const key in configHooks) {
    const subHook = configHooks[key];
    const name = parentName ? `${parentName}:${key}` : key;
    if (typeof subHook === "object" && subHook !== null) {
      flatHooks(subHook, hooks, name);
    } else if (typeof subHook === "function") {
      hooks[name] = subHook;
    }
  }
  return hooks;
}
const defaultTask = { run: (function_) => function_() };
const _createTask = () => defaultTask;
const createTask = typeof console.createTask !== "undefined" ? console.createTask : _createTask;
function serialTaskCaller(hooks, args) {
  const name = args.shift();
  const task = createTask(name);
  return hooks.reduce(
    (promise, hookFunction) => promise.then(() => task.run(() => hookFunction(...args))),
    Promise.resolve()
  );
}
function parallelTaskCaller(hooks, args) {
  const name = args.shift();
  const task = createTask(name);
  return Promise.all(hooks.map((hook) => task.run(() => hook(...args))));
}
function callEachWith(callbacks, arg0) {
  for (const callback of [...callbacks]) {
    callback(arg0);
  }
}

class Hookable {
  constructor() {
    this._hooks = {};
    this._before = void 0;
    this._after = void 0;
    this._deprecatedMessages = void 0;
    this._deprecatedHooks = {};
    this.hook = this.hook.bind(this);
    this.callHook = this.callHook.bind(this);
    this.callHookWith = this.callHookWith.bind(this);
  }
  hook(name, function_, options = {}) {
    if (!name || typeof function_ !== "function") {
      return () => {
      };
    }
    const originalName = name;
    let dep;
    while (this._deprecatedHooks[name]) {
      dep = this._deprecatedHooks[name];
      name = dep.to;
    }
    if (dep && !options.allowDeprecated) {
      let message = dep.message;
      if (!message) {
        message = `${originalName} hook has been deprecated` + (dep.to ? `, please use ${dep.to}` : "");
      }
      if (!this._deprecatedMessages) {
        this._deprecatedMessages = /* @__PURE__ */ new Set();
      }
      if (!this._deprecatedMessages.has(message)) {
        console.warn(message);
        this._deprecatedMessages.add(message);
      }
    }
    if (!function_.name) {
      try {
        Object.defineProperty(function_, "name", {
          get: () => "_" + name.replace(/\W+/g, "_") + "_hook_cb",
          configurable: true
        });
      } catch {
      }
    }
    this._hooks[name] = this._hooks[name] || [];
    this._hooks[name].push(function_);
    return () => {
      if (function_) {
        this.removeHook(name, function_);
        function_ = void 0;
      }
    };
  }
  hookOnce(name, function_) {
    let _unreg;
    let _function = (...arguments_) => {
      if (typeof _unreg === "function") {
        _unreg();
      }
      _unreg = void 0;
      _function = void 0;
      return function_(...arguments_);
    };
    _unreg = this.hook(name, _function);
    return _unreg;
  }
  removeHook(name, function_) {
    if (this._hooks[name]) {
      const index = this._hooks[name].indexOf(function_);
      if (index !== -1) {
        this._hooks[name].splice(index, 1);
      }
      if (this._hooks[name].length === 0) {
        delete this._hooks[name];
      }
    }
  }
  deprecateHook(name, deprecated) {
    this._deprecatedHooks[name] = typeof deprecated === "string" ? { to: deprecated } : deprecated;
    const _hooks = this._hooks[name] || [];
    delete this._hooks[name];
    for (const hook of _hooks) {
      this.hook(name, hook);
    }
  }
  deprecateHooks(deprecatedHooks) {
    Object.assign(this._deprecatedHooks, deprecatedHooks);
    for (const name in deprecatedHooks) {
      this.deprecateHook(name, deprecatedHooks[name]);
    }
  }
  addHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    const removeFns = Object.keys(hooks).map(
      (key) => this.hook(key, hooks[key])
    );
    return () => {
      for (const unreg of removeFns.splice(0, removeFns.length)) {
        unreg();
      }
    };
  }
  removeHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    for (const key in hooks) {
      this.removeHook(key, hooks[key]);
    }
  }
  removeAllHooks() {
    for (const key in this._hooks) {
      delete this._hooks[key];
    }
  }
  callHook(name, ...arguments_) {
    arguments_.unshift(name);
    return this.callHookWith(serialTaskCaller, name, ...arguments_);
  }
  callHookParallel(name, ...arguments_) {
    arguments_.unshift(name);
    return this.callHookWith(parallelTaskCaller, name, ...arguments_);
  }
  callHookWith(caller, name, ...arguments_) {
    const event = this._before || this._after ? { name, args: arguments_, context: {} } : void 0;
    if (this._before) {
      callEachWith(this._before, event);
    }
    const result = caller(
      name in this._hooks ? [...this._hooks[name]] : [],
      arguments_
    );
    if (result instanceof Promise) {
      return result.finally(() => {
        if (this._after && event) {
          callEachWith(this._after, event);
        }
      });
    }
    if (this._after && event) {
      callEachWith(this._after, event);
    }
    return result;
  }
  beforeEach(function_) {
    this._before = this._before || [];
    this._before.push(function_);
    return () => {
      if (this._before !== void 0) {
        const index = this._before.indexOf(function_);
        if (index !== -1) {
          this._before.splice(index, 1);
        }
      }
    };
  }
  afterEach(function_) {
    this._after = this._after || [];
    this._after.push(function_);
    return () => {
      if (this._after !== void 0) {
        const index = this._after.indexOf(function_);
        if (index !== -1) {
          this._after.splice(index, 1);
        }
      }
    };
  }
}
function createHooks() {
  return new Hookable();
}

const s=globalThis.Headers,i=globalThis.AbortController,l=globalThis.fetch||(()=>{throw new Error("[node-fetch-native] Failed to fetch: `globalThis.fetch` is not available!")});

class FetchError extends Error {
  constructor(message, opts) {
    super(message, opts);
    this.name = "FetchError";
    if (opts?.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
}
function createFetchError(ctx) {
  const errorMessage = ctx.error?.message || ctx.error?.toString() || "";
  const method = ctx.request?.method || ctx.options?.method || "GET";
  const url = ctx.request?.url || String(ctx.request) || "/";
  const requestStr = `[${method}] ${JSON.stringify(url)}`;
  const statusStr = ctx.response ? `${ctx.response.status} ${ctx.response.statusText}` : "<no response>";
  const message = `${requestStr}: ${statusStr}${errorMessage ? ` ${errorMessage}` : ""}`;
  const fetchError = new FetchError(
    message,
    ctx.error ? { cause: ctx.error } : void 0
  );
  for (const key of ["request", "options", "response"]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx[key];
      }
    });
  }
  for (const [key, refKey] of [
    ["data", "_data"],
    ["status", "status"],
    ["statusCode", "status"],
    ["statusText", "statusText"],
    ["statusMessage", "statusText"]
  ]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx.response && ctx.response[refKey];
      }
    });
  }
  return fetchError;
}

const payloadMethods = new Set(
  Object.freeze(["PATCH", "POST", "PUT", "DELETE"])
);
function isPayloadMethod(method = "GET") {
  return payloadMethods.has(method.toUpperCase());
}
function isJSONSerializable(value) {
  if (value === void 0) {
    return false;
  }
  const t = typeof value;
  if (t === "string" || t === "number" || t === "boolean" || t === null) {
    return true;
  }
  if (t !== "object") {
    return false;
  }
  if (Array.isArray(value)) {
    return true;
  }
  if (value.buffer) {
    return false;
  }
  if (value instanceof FormData || value instanceof URLSearchParams) {
    return false;
  }
  return value.constructor && value.constructor.name === "Object" || typeof value.toJSON === "function";
}
const textTypes = /* @__PURE__ */ new Set([
  "image/svg",
  "application/xml",
  "application/xhtml",
  "application/html"
]);
const JSON_RE = /^application\/(?:[\w!#$%&*.^`~-]*\+)?json(;.+)?$/i;
function detectResponseType(_contentType = "") {
  if (!_contentType) {
    return "json";
  }
  const contentType = _contentType.split(";").shift() || "";
  if (JSON_RE.test(contentType)) {
    return "json";
  }
  if (contentType === "text/event-stream") {
    return "stream";
  }
  if (textTypes.has(contentType) || contentType.startsWith("text/")) {
    return "text";
  }
  return "blob";
}
function resolveFetchOptions(request, input, defaults, Headers) {
  const headers = mergeHeaders(
    input?.headers ?? request?.headers,
    defaults?.headers,
    Headers
  );
  let query;
  if (defaults?.query || defaults?.params || input?.params || input?.query) {
    query = {
      ...defaults?.params,
      ...defaults?.query,
      ...input?.params,
      ...input?.query
    };
  }
  return {
    ...defaults,
    ...input,
    query,
    params: query,
    headers
  };
}
function mergeHeaders(input, defaults, Headers) {
  if (!defaults) {
    return new Headers(input);
  }
  const headers = new Headers(defaults);
  if (input) {
    for (const [key, value] of Symbol.iterator in input || Array.isArray(input) ? input : new Headers(input)) {
      headers.set(key, value);
    }
  }
  return headers;
}
async function callHooks(context, hooks) {
  if (hooks) {
    if (Array.isArray(hooks)) {
      for (const hook of hooks) {
        await hook(context);
      }
    } else {
      await hooks(context);
    }
  }
}

const retryStatusCodes = /* @__PURE__ */ new Set([
  408,
  // Request Timeout
  409,
  // Conflict
  425,
  // Too Early (Experimental)
  429,
  // Too Many Requests
  500,
  // Internal Server Error
  502,
  // Bad Gateway
  503,
  // Service Unavailable
  504
  // Gateway Timeout
]);
const nullBodyResponses = /* @__PURE__ */ new Set([101, 204, 205, 304]);
function createFetch(globalOptions = {}) {
  const {
    fetch = globalThis.fetch,
    Headers = globalThis.Headers,
    AbortController = globalThis.AbortController
  } = globalOptions;
  async function onError(context) {
    const isAbort = context.error && context.error.name === "AbortError" && !context.options.timeout || false;
    if (context.options.retry !== false && !isAbort) {
      let retries;
      if (typeof context.options.retry === "number") {
        retries = context.options.retry;
      } else {
        retries = isPayloadMethod(context.options.method) ? 0 : 1;
      }
      const responseCode = context.response && context.response.status || 500;
      if (retries > 0 && (Array.isArray(context.options.retryStatusCodes) ? context.options.retryStatusCodes.includes(responseCode) : retryStatusCodes.has(responseCode))) {
        const retryDelay = typeof context.options.retryDelay === "function" ? context.options.retryDelay(context) : context.options.retryDelay || 0;
        if (retryDelay > 0) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
        return $fetchRaw(context.request, {
          ...context.options,
          retry: retries - 1
        });
      }
    }
    const error = createFetchError(context);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(error, $fetchRaw);
    }
    throw error;
  }
  const $fetchRaw = async function $fetchRaw2(_request, _options = {}) {
    const context = {
      request: _request,
      options: resolveFetchOptions(
        _request,
        _options,
        globalOptions.defaults,
        Headers
      ),
      response: void 0,
      error: void 0
    };
    if (context.options.method) {
      context.options.method = context.options.method.toUpperCase();
    }
    if (context.options.onRequest) {
      await callHooks(context, context.options.onRequest);
      if (!(context.options.headers instanceof Headers)) {
        context.options.headers = new Headers(
          context.options.headers || {}
          /* compat */
        );
      }
    }
    if (typeof context.request === "string") {
      if (context.options.baseURL) {
        context.request = withBase(context.request, context.options.baseURL);
      }
      if (context.options.query) {
        context.request = withQuery(context.request, context.options.query);
        delete context.options.query;
      }
      if ("query" in context.options) {
        delete context.options.query;
      }
      if ("params" in context.options) {
        delete context.options.params;
      }
    }
    if (context.options.body && isPayloadMethod(context.options.method)) {
      if (isJSONSerializable(context.options.body)) {
        const contentType = context.options.headers.get("content-type");
        if (typeof context.options.body !== "string") {
          context.options.body = contentType === "application/x-www-form-urlencoded" ? new URLSearchParams(
            context.options.body
          ).toString() : JSON.stringify(context.options.body);
        }
        if (!contentType) {
          context.options.headers.set("content-type", "application/json");
        }
        if (!context.options.headers.has("accept")) {
          context.options.headers.set("accept", "application/json");
        }
      } else if (
        // ReadableStream Body
        "pipeTo" in context.options.body && typeof context.options.body.pipeTo === "function" || // Node.js Stream Body
        typeof context.options.body.pipe === "function"
      ) {
        if (!("duplex" in context.options)) {
          context.options.duplex = "half";
        }
      }
    }
    let abortTimeout;
    if (!context.options.signal && context.options.timeout) {
      const controller = new AbortController();
      abortTimeout = setTimeout(() => {
        const error = new Error(
          "[TimeoutError]: The operation was aborted due to timeout"
        );
        error.name = "TimeoutError";
        error.code = 23;
        controller.abort(error);
      }, context.options.timeout);
      context.options.signal = controller.signal;
    }
    try {
      context.response = await fetch(
        context.request,
        context.options
      );
    } catch (error) {
      context.error = error;
      if (context.options.onRequestError) {
        await callHooks(
          context,
          context.options.onRequestError
        );
      }
      return await onError(context);
    } finally {
      if (abortTimeout) {
        clearTimeout(abortTimeout);
      }
    }
    const hasBody = (context.response.body || // https://github.com/unjs/ofetch/issues/324
    // https://github.com/unjs/ofetch/issues/294
    // https://github.com/JakeChampion/fetch/issues/1454
    context.response._bodyInit) && !nullBodyResponses.has(context.response.status) && context.options.method !== "HEAD";
    if (hasBody) {
      const responseType = (context.options.parseResponse ? "json" : context.options.responseType) || detectResponseType(context.response.headers.get("content-type") || "");
      switch (responseType) {
        case "json": {
          const data = await context.response.text();
          const parseFunction = context.options.parseResponse || destr;
          context.response._data = parseFunction(data);
          break;
        }
        case "stream": {
          context.response._data = context.response.body || context.response._bodyInit;
          break;
        }
        default: {
          context.response._data = await context.response[responseType]();
        }
      }
    }
    if (context.options.onResponse) {
      await callHooks(
        context,
        context.options.onResponse
      );
    }
    if (!context.options.ignoreResponseError && context.response.status >= 400 && context.response.status < 600) {
      if (context.options.onResponseError) {
        await callHooks(
          context,
          context.options.onResponseError
        );
      }
      return await onError(context);
    }
    return context.response;
  };
  const $fetch = async function $fetch2(request, options) {
    const r = await $fetchRaw(request, options);
    return r._data;
  };
  $fetch.raw = $fetchRaw;
  $fetch.native = (...args) => fetch(...args);
  $fetch.create = (defaultOptions = {}, customGlobalOptions = {}) => createFetch({
    ...globalOptions,
    ...customGlobalOptions,
    defaults: {
      ...globalOptions.defaults,
      ...customGlobalOptions.defaults,
      ...defaultOptions
    }
  });
  return $fetch;
}

function createNodeFetch() {
  const useKeepAlive = JSON.parse(process.env.FETCH_KEEP_ALIVE || "false");
  if (!useKeepAlive) {
    return l;
  }
  const agentOptions = { keepAlive: true };
  const httpAgent = new http.Agent(agentOptions);
  const httpsAgent = new https.Agent(agentOptions);
  const nodeFetchOptions = {
    agent(parsedURL) {
      return parsedURL.protocol === "http:" ? httpAgent : httpsAgent;
    }
  };
  return function nodeFetchWithKeepAlive(input, init) {
    return l(input, { ...nodeFetchOptions, ...init });
  };
}
const fetch = globalThis.fetch ? (...args) => globalThis.fetch(...args) : createNodeFetch();
const Headers$1 = globalThis.Headers || s;
const AbortController = globalThis.AbortController || i;
const ofetch = createFetch({ fetch, Headers: Headers$1, AbortController });
const $fetch = ofetch;

function wrapToPromise(value) {
  if (!value || typeof value.then !== "function") {
    return Promise.resolve(value);
  }
  return value;
}
function asyncCall(function_, ...arguments_) {
  try {
    return wrapToPromise(function_(...arguments_));
  } catch (error) {
    return Promise.reject(error);
  }
}
function isPrimitive(value) {
  const type = typeof value;
  return value === null || type !== "object" && type !== "function";
}
function isPureObject(value) {
  const proto = Object.getPrototypeOf(value);
  return !proto || proto.isPrototypeOf(Object);
}
function stringify(value) {
  if (isPrimitive(value)) {
    return String(value);
  }
  if (isPureObject(value) || Array.isArray(value)) {
    return JSON.stringify(value);
  }
  if (typeof value.toJSON === "function") {
    return stringify(value.toJSON());
  }
  throw new Error("[unstorage] Cannot stringify value!");
}
const BASE64_PREFIX = "base64:";
function serializeRaw(value) {
  if (typeof value === "string") {
    return value;
  }
  return BASE64_PREFIX + base64Encode(value);
}
function deserializeRaw(value) {
  if (typeof value !== "string") {
    return value;
  }
  if (!value.startsWith(BASE64_PREFIX)) {
    return value;
  }
  return base64Decode(value.slice(BASE64_PREFIX.length));
}
function base64Decode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input, "base64");
  }
  return Uint8Array.from(
    globalThis.atob(input),
    (c) => c.codePointAt(0)
  );
}
function base64Encode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input).toString("base64");
  }
  return globalThis.btoa(String.fromCodePoint(...input));
}

const storageKeyProperties = [
  "has",
  "hasItem",
  "get",
  "getItem",
  "getItemRaw",
  "set",
  "setItem",
  "setItemRaw",
  "del",
  "remove",
  "removeItem",
  "getMeta",
  "setMeta",
  "removeMeta",
  "getKeys",
  "clear",
  "mount",
  "unmount"
];
function prefixStorage(storage, base) {
  base = normalizeBaseKey(base);
  if (!base) {
    return storage;
  }
  const nsStorage = { ...storage };
  for (const property of storageKeyProperties) {
    nsStorage[property] = (key = "", ...args) => (
      // @ts-ignore
      storage[property](base + key, ...args)
    );
  }
  nsStorage.getKeys = (key = "", ...arguments_) => storage.getKeys(base + key, ...arguments_).then((keys) => keys.map((key2) => key2.slice(base.length)));
  nsStorage.keys = nsStorage.getKeys;
  nsStorage.getItems = async (items, commonOptions) => {
    const prefixedItems = items.map(
      (item) => typeof item === "string" ? base + item : { ...item, key: base + item.key }
    );
    const results = await storage.getItems(prefixedItems, commonOptions);
    return results.map((entry) => ({
      key: entry.key.slice(base.length),
      value: entry.value
    }));
  };
  nsStorage.setItems = async (items, commonOptions) => {
    const prefixedItems = items.map((item) => ({
      key: base + item.key,
      value: item.value,
      options: item.options
    }));
    return storage.setItems(prefixedItems, commonOptions);
  };
  return nsStorage;
}
function normalizeKey$1(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
}
function joinKeys(...keys) {
  return normalizeKey$1(keys.join(":"));
}
function normalizeBaseKey(base) {
  base = normalizeKey$1(base);
  return base ? base + ":" : "";
}
function filterKeyByDepth(key, depth) {
  if (depth === void 0) {
    return true;
  }
  let substrCount = 0;
  let index = key.indexOf(":");
  while (index > -1) {
    substrCount++;
    index = key.indexOf(":", index + 1);
  }
  return substrCount <= depth;
}
function filterKeyByBase(key, base) {
  if (base) {
    return key.startsWith(base) && key[key.length - 1] !== "$";
  }
  return key[key.length - 1] !== "$";
}

function defineDriver$1(factory) {
  return factory;
}

const DRIVER_NAME$1 = "memory";
const memory = defineDriver$1(() => {
  const data = /* @__PURE__ */ new Map();
  return {
    name: DRIVER_NAME$1,
    getInstance: () => data,
    hasItem(key) {
      return data.has(key);
    },
    getItem(key) {
      return data.get(key) ?? null;
    },
    getItemRaw(key) {
      return data.get(key) ?? null;
    },
    setItem(key, value) {
      data.set(key, value);
    },
    setItemRaw(key, value) {
      data.set(key, value);
    },
    removeItem(key) {
      data.delete(key);
    },
    getKeys() {
      return [...data.keys()];
    },
    clear() {
      data.clear();
    },
    dispose() {
      data.clear();
    }
  };
});

function createStorage(options = {}) {
  const context = {
    mounts: { "": options.driver || memory() },
    mountpoints: [""],
    watching: false,
    watchListeners: [],
    unwatch: {}
  };
  const getMount = (key) => {
    for (const base of context.mountpoints) {
      if (key.startsWith(base)) {
        return {
          base,
          relativeKey: key.slice(base.length),
          driver: context.mounts[base]
        };
      }
    }
    return {
      base: "",
      relativeKey: key,
      driver: context.mounts[""]
    };
  };
  const getMounts = (base, includeParent) => {
    return context.mountpoints.filter(
      (mountpoint) => mountpoint.startsWith(base) || includeParent && base.startsWith(mountpoint)
    ).map((mountpoint) => ({
      relativeBase: base.length > mountpoint.length ? base.slice(mountpoint.length) : void 0,
      mountpoint,
      driver: context.mounts[mountpoint]
    }));
  };
  const onChange = (event, key) => {
    if (!context.watching) {
      return;
    }
    key = normalizeKey$1(key);
    for (const listener of context.watchListeners) {
      listener(event, key);
    }
  };
  const startWatch = async () => {
    if (context.watching) {
      return;
    }
    context.watching = true;
    for (const mountpoint in context.mounts) {
      context.unwatch[mountpoint] = await watch(
        context.mounts[mountpoint],
        onChange,
        mountpoint
      );
    }
  };
  const stopWatch = async () => {
    if (!context.watching) {
      return;
    }
    for (const mountpoint in context.unwatch) {
      await context.unwatch[mountpoint]();
    }
    context.unwatch = {};
    context.watching = false;
  };
  const runBatch = (items, commonOptions, cb) => {
    const batches = /* @__PURE__ */ new Map();
    const getBatch = (mount) => {
      let batch = batches.get(mount.base);
      if (!batch) {
        batch = {
          driver: mount.driver,
          base: mount.base,
          items: []
        };
        batches.set(mount.base, batch);
      }
      return batch;
    };
    for (const item of items) {
      const isStringItem = typeof item === "string";
      const key = normalizeKey$1(isStringItem ? item : item.key);
      const value = isStringItem ? void 0 : item.value;
      const options2 = isStringItem || !item.options ? commonOptions : { ...commonOptions, ...item.options };
      const mount = getMount(key);
      getBatch(mount).items.push({
        key,
        value,
        relativeKey: mount.relativeKey,
        options: options2
      });
    }
    return Promise.all([...batches.values()].map((batch) => cb(batch))).then(
      (r) => r.flat()
    );
  };
  const storage = {
    // Item
    hasItem(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.hasItem, relativeKey, opts);
    },
    getItem(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => destr(value)
      );
    },
    getItems(items, commonOptions = {}) {
      return runBatch(items, commonOptions, (batch) => {
        if (batch.driver.getItems) {
          return asyncCall(
            batch.driver.getItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              options: item.options
            })),
            commonOptions
          ).then(
            (r) => r.map((item) => ({
              key: joinKeys(batch.base, item.key),
              value: destr(item.value)
            }))
          );
        }
        return Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.getItem,
              item.relativeKey,
              item.options
            ).then((value) => ({
              key: item.key,
              value: destr(value)
            }));
          })
        );
      });
    },
    getItemRaw(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.getItemRaw) {
        return asyncCall(driver.getItemRaw, relativeKey, opts);
      }
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => deserializeRaw(value)
      );
    },
    async setItem(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key);
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.setItem) {
        return;
      }
      await asyncCall(driver.setItem, relativeKey, stringify(value), opts);
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async setItems(items, commonOptions) {
      await runBatch(items, commonOptions, async (batch) => {
        if (batch.driver.setItems) {
          return asyncCall(
            batch.driver.setItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              value: stringify(item.value),
              options: item.options
            })),
            commonOptions
          );
        }
        if (!batch.driver.setItem) {
          return;
        }
        await Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.setItem,
              item.relativeKey,
              stringify(item.value),
              item.options
            );
          })
        );
      });
    },
    async setItemRaw(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key, opts);
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.setItemRaw) {
        await asyncCall(driver.setItemRaw, relativeKey, value, opts);
      } else if (driver.setItem) {
        await asyncCall(driver.setItem, relativeKey, serializeRaw(value), opts);
      } else {
        return;
      }
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async removeItem(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { removeMeta: opts };
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.removeItem) {
        return;
      }
      await asyncCall(driver.removeItem, relativeKey, opts);
      if (opts.removeMeta || opts.removeMata) {
        await asyncCall(driver.removeItem, relativeKey + "$", opts);
      }
      if (!driver.watch) {
        onChange("remove", key);
      }
    },
    // Meta
    async getMeta(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { nativeOnly: opts };
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      const meta = /* @__PURE__ */ Object.create(null);
      if (driver.getMeta) {
        Object.assign(meta, await asyncCall(driver.getMeta, relativeKey, opts));
      }
      if (!opts.nativeOnly) {
        const value = await asyncCall(
          driver.getItem,
          relativeKey + "$",
          opts
        ).then((value_) => destr(value_));
        if (value && typeof value === "object") {
          if (typeof value.atime === "string") {
            value.atime = new Date(value.atime);
          }
          if (typeof value.mtime === "string") {
            value.mtime = new Date(value.mtime);
          }
          Object.assign(meta, value);
        }
      }
      return meta;
    },
    setMeta(key, value, opts = {}) {
      return this.setItem(key + "$", value, opts);
    },
    removeMeta(key, opts = {}) {
      return this.removeItem(key + "$", opts);
    },
    // Keys
    async getKeys(base, opts = {}) {
      base = normalizeBaseKey(base);
      const mounts = getMounts(base, true);
      let maskedMounts = [];
      const allKeys = [];
      let allMountsSupportMaxDepth = true;
      for (const mount of mounts) {
        if (!mount.driver.flags?.maxDepth) {
          allMountsSupportMaxDepth = false;
        }
        const rawKeys = await asyncCall(
          mount.driver.getKeys,
          mount.relativeBase,
          opts
        );
        for (const key of rawKeys) {
          const fullKey = mount.mountpoint + normalizeKey$1(key);
          if (!maskedMounts.some((p) => fullKey.startsWith(p))) {
            allKeys.push(fullKey);
          }
        }
        maskedMounts = [
          mount.mountpoint,
          ...maskedMounts.filter((p) => !p.startsWith(mount.mountpoint))
        ];
      }
      const shouldFilterByDepth = opts.maxDepth !== void 0 && !allMountsSupportMaxDepth;
      return allKeys.filter(
        (key) => (!shouldFilterByDepth || filterKeyByDepth(key, opts.maxDepth)) && filterKeyByBase(key, base)
      );
    },
    // Utils
    async clear(base, opts = {}) {
      base = normalizeBaseKey(base);
      await Promise.all(
        getMounts(base, false).map(async (m) => {
          if (m.driver.clear) {
            return asyncCall(m.driver.clear, m.relativeBase, opts);
          }
          if (m.driver.removeItem) {
            const keys = await m.driver.getKeys(m.relativeBase || "", opts);
            return Promise.all(
              keys.map((key) => m.driver.removeItem(key, opts))
            );
          }
        })
      );
    },
    async dispose() {
      await Promise.all(
        Object.values(context.mounts).map((driver) => dispose(driver))
      );
    },
    async watch(callback) {
      await startWatch();
      context.watchListeners.push(callback);
      return async () => {
        context.watchListeners = context.watchListeners.filter(
          (listener) => listener !== callback
        );
        if (context.watchListeners.length === 0) {
          await stopWatch();
        }
      };
    },
    async unwatch() {
      context.watchListeners = [];
      await stopWatch();
    },
    // Mount
    mount(base, driver) {
      base = normalizeBaseKey(base);
      if (base && context.mounts[base]) {
        throw new Error(`already mounted at ${base}`);
      }
      if (base) {
        context.mountpoints.push(base);
        context.mountpoints.sort((a, b) => b.length - a.length);
      }
      context.mounts[base] = driver;
      if (context.watching) {
        Promise.resolve(watch(driver, onChange, base)).then((unwatcher) => {
          context.unwatch[base] = unwatcher;
        }).catch(console.error);
      }
      return storage;
    },
    async unmount(base, _dispose = true) {
      base = normalizeBaseKey(base);
      if (!base || !context.mounts[base]) {
        return;
      }
      if (context.watching && base in context.unwatch) {
        context.unwatch[base]?.();
        delete context.unwatch[base];
      }
      if (_dispose) {
        await dispose(context.mounts[base]);
      }
      context.mountpoints = context.mountpoints.filter((key) => key !== base);
      delete context.mounts[base];
    },
    getMount(key = "") {
      key = normalizeKey$1(key) + ":";
      const m = getMount(key);
      return {
        driver: m.driver,
        base: m.base
      };
    },
    getMounts(base = "", opts = {}) {
      base = normalizeKey$1(base);
      const mounts = getMounts(base, opts.parents);
      return mounts.map((m) => ({
        driver: m.driver,
        base: m.mountpoint
      }));
    },
    // Aliases
    keys: (base, opts = {}) => storage.getKeys(base, opts),
    get: (key, opts = {}) => storage.getItem(key, opts),
    set: (key, value, opts = {}) => storage.setItem(key, value, opts),
    has: (key, opts = {}) => storage.hasItem(key, opts),
    del: (key, opts = {}) => storage.removeItem(key, opts),
    remove: (key, opts = {}) => storage.removeItem(key, opts)
  };
  return storage;
}
function watch(driver, onChange, base) {
  return driver.watch ? driver.watch((event, key) => onChange(event, base + key)) : () => {
  };
}
async function dispose(driver) {
  if (typeof driver.dispose === "function") {
    await asyncCall(driver.dispose);
  }
}

const _assets = {

};

const normalizeKey = function normalizeKey(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
};

const assets$1 = {
  getKeys() {
    return Promise.resolve(Object.keys(_assets))
  },
  hasItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(id in _assets)
  },
  getItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].import() : null)
  },
  getMeta (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].meta : {})
  }
};

function defineDriver(factory) {
  return factory;
}
function createError(driver, message, opts) {
  const err = new Error(`[unstorage] [${driver}] ${message}`, opts);
  if (Error.captureStackTrace) {
    Error.captureStackTrace(err, createError);
  }
  return err;
}
function createRequiredError(driver, name) {
  if (Array.isArray(name)) {
    return createError(
      driver,
      `Missing some of the required options ${name.map((n) => "`" + n + "`").join(", ")}`
    );
  }
  return createError(driver, `Missing required option \`${name}\`.`);
}

function ignoreNotfound(err) {
  return err.code === "ENOENT" || err.code === "EISDIR" ? null : err;
}
function ignoreExists(err) {
  return err.code === "EEXIST" ? null : err;
}
async function writeFile(path, data, encoding) {
  await ensuredir(dirname$1(path));
  return promises.writeFile(path, data, encoding);
}
function readFile(path, encoding) {
  return promises.readFile(path, encoding).catch(ignoreNotfound);
}
function unlink(path) {
  return promises.unlink(path).catch(ignoreNotfound);
}
function readdir(dir) {
  return promises.readdir(dir, { withFileTypes: true }).catch(ignoreNotfound).then((r) => r || []);
}
async function ensuredir(dir) {
  if (existsSync(dir)) {
    return;
  }
  await ensuredir(dirname$1(dir)).catch(ignoreExists);
  await promises.mkdir(dir).catch(ignoreExists);
}
async function readdirRecursive(dir, ignore, maxDepth) {
  if (ignore && ignore(dir)) {
    return [];
  }
  const entries = await readdir(dir);
  const files = [];
  await Promise.all(
    entries.map(async (entry) => {
      const entryPath = resolve$1(dir, entry.name);
      if (entry.isDirectory()) {
        if (maxDepth === void 0 || maxDepth > 0) {
          const dirFiles = await readdirRecursive(
            entryPath,
            ignore,
            maxDepth === void 0 ? void 0 : maxDepth - 1
          );
          files.push(...dirFiles.map((f) => entry.name + "/" + f));
        }
      } else {
        if (!(ignore && ignore(entry.name))) {
          files.push(entry.name);
        }
      }
    })
  );
  return files;
}
async function rmRecursive(dir) {
  const entries = await readdir(dir);
  await Promise.all(
    entries.map((entry) => {
      const entryPath = resolve$1(dir, entry.name);
      if (entry.isDirectory()) {
        return rmRecursive(entryPath).then(() => promises.rmdir(entryPath));
      } else {
        return promises.unlink(entryPath);
      }
    })
  );
}

const PATH_TRAVERSE_RE = /\.\.:|\.\.$/;
const DRIVER_NAME = "fs-lite";
const unstorage_47drivers_47fs_45lite = defineDriver((opts = {}) => {
  if (!opts.base) {
    throw createRequiredError(DRIVER_NAME, "base");
  }
  opts.base = resolve$1(opts.base);
  const r = (key) => {
    if (PATH_TRAVERSE_RE.test(key)) {
      throw createError(
        DRIVER_NAME,
        `Invalid key: ${JSON.stringify(key)}. It should not contain .. segments`
      );
    }
    const resolved = join(opts.base, key.replace(/:/g, "/"));
    return resolved;
  };
  return {
    name: DRIVER_NAME,
    options: opts,
    flags: {
      maxDepth: true
    },
    hasItem(key) {
      return existsSync(r(key));
    },
    getItem(key) {
      return readFile(r(key), "utf8");
    },
    getItemRaw(key) {
      return readFile(r(key));
    },
    async getMeta(key) {
      const { atime, mtime, size, birthtime, ctime } = await promises.stat(r(key)).catch(() => ({}));
      return { atime, mtime, size, birthtime, ctime };
    },
    setItem(key, value) {
      if (opts.readOnly) {
        return;
      }
      return writeFile(r(key), value, "utf8");
    },
    setItemRaw(key, value) {
      if (opts.readOnly) {
        return;
      }
      return writeFile(r(key), value);
    },
    removeItem(key) {
      if (opts.readOnly) {
        return;
      }
      return unlink(r(key));
    },
    getKeys(_base, topts) {
      return readdirRecursive(r("."), opts.ignore, topts?.maxDepth);
    },
    async clear() {
      if (opts.readOnly || opts.noClear) {
        return;
      }
      await rmRecursive(r("."));
    }
  };
});

const storage = createStorage({});

storage.mount('/assets', assets$1);

storage.mount('data', unstorage_47drivers_47fs_45lite({"driver":"fsLite","base":"./.data/kv"}));

function useStorage(base = "") {
  return base ? prefixStorage(storage, base) : storage;
}

function serialize$1(input) {
	if (typeof input === "string") return `'${input}'`;
	return new Serializer().serialize(input);
}
const asciiOrder = " _-,;:!?.'\"()[]{}@*/\\&#%`^+<=>|~$0123456789abcdefghijklmnopqrstuvwxyz";
const asciiWeights = /*@__PURE__*/ (function() {
	const weights = /* @__PURE__ */ new Uint8Array(128);
	for (let i = 0; i < 69; i++) weights[asciiOrder.charCodeAt(i)] = i + 1;
	for (let code = 65; code <= 90; code++) weights[code] = weights[code + 32];
	return weights;
})();
function compareStrings(a, b) {
	if (a === b) return 0;
	const length = Math.min(a.length, b.length);
	let tieBreaker = 0;
	for (let i = 0; i < length; i++) {
		const codeA = a.charCodeAt(i);
		const codeB = b.charCodeAt(i);
		if (codeA === codeB) continue;
		const weightA = codeA < 128 && asciiWeights[codeA] ? asciiWeights[codeA] : codeA + 128;
		const weightB = codeB < 128 && asciiWeights[codeB] ? asciiWeights[codeB] : codeB + 128;
		if (weightA !== weightB) return weightA < weightB ? -1 : 1;
		if (tieBreaker === 0) tieBreaker = codeA > codeB ? -1 : 1;
	}
	if (a.length !== b.length) return a.length < b.length ? -1 : 1;
	return tieBreaker;
}
const Serializer = /*@__PURE__*/ (function() {
	class Serializer {
		#context = /* @__PURE__ */ new Map();
		compare(a, b) {
			const typeA = typeof a;
			const typeB = typeof b;
			if (typeA === "string" && typeB === "string") return compareStrings(a, b);
			if (typeA === "number" && typeB === "number") return a - b;
			return compareStrings(this.serialize(a, true), this.serialize(b, true));
		}
		serialize(value, noQuotes) {
			if (value === null) return "null";
			switch (typeof value) {
				case "string": return noQuotes ? value : `'${value}'`;
				case "bigint": return `${value}n`;
				case "object": return this.$object(value);
				case "function": return this.$function(value);
			}
			return String(value);
		}
		serializeObject(object) {
			const objString = Object.prototype.toString.call(object);
			if (objString !== "[object Object]") return this.serializeBuiltInType(objString.length < 10 ? `unknown:${objString}` : objString.slice(8, -1), object);
			const constructor = object.constructor;
			const objName = constructor === Object || constructor === void 0 ? "" : constructor.name;
			if (objName !== "" && globalThis[objName] === constructor) return this.serializeBuiltInType(objName, object);
			if ("toJSON" in object && typeof object.toJSON === "function") {
				const json = object.toJSON();
				return objName + (json !== null && typeof json === "object" ? this.$object(json) : `(${this.serialize(json)})`);
			}
			const keys = Object.keys(object).sort(compareStrings);
			let content = `${objName}{`;
			for (let i = 0; i < keys.length; i++) {
				const key = keys[i];
				content += `${key}:${this.serialize(object[key])}`;
				if (i < keys.length - 1) content += ",";
			}
			return content + "}";
		}
		serializeBuiltInType(type, object) {
			const handler = this["$" + type];
			if (handler) return handler.call(this, object);
			if (typeof object.entries === "function") return this.serializeObjectEntries(type, object.entries());
			throw new Error(`Cannot serialize ${type}`);
		}
		serializeObjectEntries(type, entries) {
			const sortedEntries = Array.from(entries).sort((a, b) => this.compare(a[0], b[0]));
			let content = `${type}{`;
			for (let i = 0; i < sortedEntries.length; i++) {
				const [key, value] = sortedEntries[i];
				content += `${this.serialize(key, true)}:${this.serialize(value)}`;
				if (i < sortedEntries.length - 1) content += ",";
			}
			return content + "}";
		}
		$object(object) {
			let content = this.#context.get(object);
			if (content === void 0) {
				this.#context.set(object, `#${this.#context.size}`);
				content = this.serializeObject(object);
				this.#context.set(object, content);
			}
			return content;
		}
		$function(fn) {
			const fnStr = Function.prototype.toString.call(fn);
			if (fnStr.slice(-15) === "[native code] }") return `${fn.name || ""}()[native]`;
			return `${fn.name}(${fn.length})${fnStr.replace(/\s*\n\s*/g, "")}`;
		}
		$Array(arr) {
			let content = "[";
			for (let i = 0; i < arr.length; i++) {
				content += this.serialize(arr[i]);
				if (i < arr.length - 1) content += ",";
			}
			return content + "]";
		}
		$Date(date) {
			try {
				return `Date(${date.toISOString()})`;
			} catch {
				return `Date(null)`;
			}
		}
		$ArrayBuffer(arr) {
			return `ArrayBuffer[${new Uint8Array(arr).join(",")}]`;
		}
		$Set(set) {
			return `Set${this.$Array(Array.from(set).sort((a, b) => this.compare(a, b)))}`;
		}
		$Map(map) {
			return this.serializeObjectEntries("Map", map.entries());
		}
	}
	for (const type of [
		"Error",
		"RegExp",
		"URL"
	]) Serializer.prototype["$" + type] = function(val) {
		return `${type}(${val})`;
	};
	for (const type of [
		"Int8Array",
		"Uint8Array",
		"Uint8ClampedArray",
		"Int16Array",
		"Uint16Array",
		"Int32Array",
		"Uint32Array",
		"Float32Array",
		"Float64Array"
	]) Serializer.prototype["$" + type] = function(arr) {
		return `${type}[${arr.join(",")}]`;
	};
	for (const type of ["BigInt64Array", "BigUint64Array"]) Serializer.prototype["$" + type] = function(arr) {
		return `${type}[${arr.join("n,")}${arr.length > 0 ? "n" : ""}]`;
	};
	return Serializer;
})();
function isEqual(object1, object2) {
	if (object1 === object2) return true;
	if (serialize$1(object1) === serialize$1(object2)) return true;
	return false;
}

const fastHash = /*@__PURE__*/ (() => globalThis.process?.getBuiltinModule?.("crypto")?.hash)();
const algorithm = "sha256";
const encoding = "base64url";
function digest(data) {
	if (fastHash) return fastHash(algorithm, data, encoding);
	const h = createHash(algorithm).update(data);
	return globalThis.process?.versions?.webcontainer ? h.digest().toString(encoding) : h.digest(encoding);
}

const Hasher = /* @__PURE__ */ (() => {
  class Hasher2 {
    buff = "";
    #context = /* @__PURE__ */ new Map();
    write(str) {
      this.buff += str;
    }
    dispatch(value) {
      const type = value === null ? "null" : typeof value;
      return this[type](value);
    }
    object(object) {
      if (object && typeof object.toJSON === "function") {
        return this.object(object.toJSON());
      }
      const objString = Object.prototype.toString.call(object);
      let objType = "";
      const objectLength = objString.length;
      objType = objectLength < 10 ? "unknown:[" + objString + "]" : objString.slice(8, objectLength - 1);
      objType = objType.toLowerCase();
      let objectNumber = null;
      if ((objectNumber = this.#context.get(object)) === void 0) {
        this.#context.set(object, this.#context.size);
      } else {
        return this.dispatch("[CIRCULAR:" + objectNumber + "]");
      }
      if (typeof Buffer !== "undefined" && Buffer.isBuffer && Buffer.isBuffer(object)) {
        this.write("buffer:");
        return this.write(object.toString("utf8"));
      }
      if (objType !== "object" && objType !== "function" && objType !== "asyncfunction") {
        if (this[objType]) {
          this[objType](object);
        } else {
          this.unknown(object, objType);
        }
      } else {
        const keys = Object.keys(object).sort();
        const extraKeys = [];
        this.write("object:" + (keys.length + extraKeys.length) + ":");
        const dispatchForKey = (key) => {
          this.dispatch(key);
          this.write(":");
          this.dispatch(object[key]);
          this.write(",");
        };
        for (const key of keys) {
          dispatchForKey(key);
        }
        for (const key of extraKeys) {
          dispatchForKey(key);
        }
      }
    }
    array(arr, unordered) {
      unordered = unordered === void 0 ? false : unordered;
      this.write("array:" + arr.length + ":");
      if (!unordered || arr.length <= 1) {
        for (const entry of arr) {
          this.dispatch(entry);
        }
        return;
      }
      const contextAdditions = /* @__PURE__ */ new Map();
      const entries = arr.map((entry) => {
        const hasher = new Hasher2();
        hasher.dispatch(entry);
        for (const [key, value] of hasher.#context) {
          contextAdditions.set(key, value);
        }
        return hasher.toString();
      });
      this.#context = contextAdditions;
      entries.sort();
      return this.array(entries, false);
    }
    date(date) {
      return this.write("date:" + date.toJSON());
    }
    symbol(sym) {
      return this.write("symbol:" + sym.toString());
    }
    unknown(value, type) {
      this.write(type);
      if (!value) {
        return;
      }
      this.write(":");
      if (value && typeof value.entries === "function") {
        return this.array(
          [...value.entries()],
          true
          /* ordered */
        );
      }
    }
    error(err) {
      return this.write("error:" + err.toString());
    }
    boolean(bool) {
      return this.write("bool:" + bool);
    }
    string(string) {
      this.write("string:" + string.length + ":");
      this.write(string);
    }
    function(fn) {
      this.write("fn:");
      if (isNativeFunction(fn)) {
        this.dispatch("[native]");
      } else {
        this.dispatch(fn.toString());
      }
    }
    number(number) {
      return this.write("number:" + number);
    }
    null() {
      return this.write("Null");
    }
    undefined() {
      return this.write("Undefined");
    }
    regexp(regex) {
      return this.write("regex:" + regex.toString());
    }
    arraybuffer(arr) {
      this.write("arraybuffer:");
      return this.dispatch(new Uint8Array(arr));
    }
    url(url) {
      return this.write("url:" + url.toString());
    }
    map(map) {
      this.write("map:");
      const arr = [...map];
      return this.array(arr, false);
    }
    set(set) {
      this.write("set:");
      const arr = [...set];
      return this.array(arr, false);
    }
    bigint(number) {
      return this.write("bigint:" + number.toString());
    }
  }
  for (const type of [
    "uint8array",
    "uint8clampedarray",
    "unt8array",
    "uint16array",
    "unt16array",
    "uint32array",
    "unt32array",
    "float32array",
    "float64array"
  ]) {
    Hasher2.prototype[type] = function(arr) {
      this.write(type + ":");
      return this.array([...arr], false);
    };
  }
  function isNativeFunction(f) {
    if (typeof f !== "function") {
      return false;
    }
    return Function.prototype.toString.call(f).slice(
      -15
      /* "[native code] }".length */
    ) === "[native code] }";
  }
  return Hasher2;
})();
function serialize(object) {
  const hasher = new Hasher();
  hasher.dispatch(object);
  return hasher.buff;
}
function hash(value) {
  return digest(typeof value === "string" ? value : serialize(value)).replace(/[-_]/g, "").slice(0, 10);
}

function defaultCacheOptions() {
  return {
    name: "_",
    base: "/cache",
    swr: true,
    maxAge: 1
  };
}
function defineCachedFunction(fn, opts = {}) {
  opts = { ...defaultCacheOptions(), ...opts };
  const pending = {};
  const group = opts.group || "nitro/functions";
  const name = opts.name || fn.name || "_";
  const integrity = opts.integrity || hash([fn, opts]);
  const validate = opts.validate || ((entry) => entry.value !== void 0);
  async function get(key, resolver, shouldInvalidateCache, event) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    let entry = await useStorage().getItem(cacheKey).catch((error) => {
      console.error(`[cache] Cache read error.`, error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }) || {};
    if (typeof entry !== "object") {
      entry = {};
      const error = new Error("Malformed data read from cache.");
      console.error("[cache]", error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }
    const ttl = (opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = shouldInvalidateCache || entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || validate(entry) === false;
    const _resolve = async () => {
      const isPending = pending[key];
      if (!isPending) {
        if (entry.value !== void 0 && (opts.staleMaxAge || 0) >= 0 && opts.swr === false) {
          entry.value = void 0;
          entry.integrity = void 0;
          entry.mtime = void 0;
          entry.expires = void 0;
        }
        pending[key] = Promise.resolve(resolver());
      }
      try {
        entry.value = await pending[key];
      } catch (error) {
        if (!isPending) {
          delete pending[key];
        }
        throw error;
      }
      if (!isPending) {
        entry.mtime = Date.now();
        entry.integrity = integrity;
        delete pending[key];
        if (validate(entry) !== false) {
          let setOpts;
          if (opts.maxAge && !opts.swr) {
            setOpts = { ttl: opts.maxAge };
          }
          const promise = useStorage().setItem(cacheKey, entry, setOpts).catch((error) => {
            console.error(`[cache] Cache write error.`, error);
            useNitroApp().captureError(error, { event, tags: ["cache"] });
          });
          if (event?.waitUntil) {
            event.waitUntil(promise);
          }
        }
      }
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (entry.value === void 0) {
      await _resolvePromise;
    } else if (expired && event && event.waitUntil) {
      event.waitUntil(_resolvePromise);
    }
    if (opts.swr && validate(entry) !== false) {
      _resolvePromise.catch((error) => {
        console.error(`[cache] SWR handler error.`, error);
        useNitroApp().captureError(error, { event, tags: ["cache"] });
      });
      return entry;
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const shouldBypassCache = await opts.shouldBypassCache?.(...args);
    if (shouldBypassCache) {
      return fn(...args);
    }
    const key = await (opts.getKey || getKey)(...args);
    const shouldInvalidateCache = await opts.shouldInvalidateCache?.(...args);
    const entry = await get(
      key,
      () => fn(...args),
      shouldInvalidateCache,
      args[0] && isEvent(args[0]) ? args[0] : void 0
    );
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
function cachedFunction(fn, opts = {}) {
  return defineCachedFunction(fn, opts);
}
function getKey(...args) {
  return args.length > 0 ? hash(args) : "";
}
function escapeKey(key) {
  return String(key).replace(/\W/g, "");
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions()) {
  const variableHeaderNames = (opts.varies || []).filter(Boolean).map((h) => h.toLowerCase()).sort();
  const _opts = {
    ...opts,
    getKey: async (event) => {
      const customKey = await opts.getKey?.(event);
      if (customKey) {
        return escapeKey(customKey);
      }
      const _path = event.node.req.originalUrl || event.node.req.url || event.path;
      let _pathname;
      try {
        _pathname = escapeKey(decodeURI(parseURL(_path).pathname)).slice(0, 16) || "index";
      } catch {
        _pathname = "-";
      }
      const _hashedPath = `${_pathname}.${hash(_path)}`;
      const _headers = variableHeaderNames.map((header) => [header, event.node.req.headers[header]]).map(([name, value]) => `${escapeKey(name)}.${hash(value)}`);
      return [_hashedPath, ..._headers].join(":");
    },
    validate: (entry) => {
      if (!entry.value) {
        return false;
      }
      if (entry.value.code >= 400) {
        return false;
      }
      if (entry.value.body === void 0) {
        return false;
      }
      if (entry.value.headers.etag === "undefined" || entry.value.headers["last-modified"] === "undefined") {
        return false;
      }
      return true;
    },
    group: opts.group || "nitro/handlers",
    integrity: opts.integrity || hash([handler, opts])
  };
  const _cachedHandler = cachedFunction(
    async (incomingEvent) => {
      const variableHeaders = {};
      for (const header of variableHeaderNames) {
        const value = incomingEvent.node.req.headers[header];
        if (value !== void 0) {
          variableHeaders[header] = value;
        }
      }
      const reqProxy = cloneWithProxy(incomingEvent.node.req, {
        headers: variableHeaders
      });
      const resHeaders = {};
      let _resSendBody;
      const resProxy = cloneWithProxy(incomingEvent.node.res, {
        statusCode: 200,
        writableEnded: false,
        writableFinished: false,
        headersSent: false,
        closed: false,
        getHeader(name) {
          return resHeaders[name];
        },
        setHeader(name, value) {
          resHeaders[name] = value;
          return this;
        },
        getHeaderNames() {
          return Object.keys(resHeaders);
        },
        hasHeader(name) {
          return name in resHeaders;
        },
        removeHeader(name) {
          delete resHeaders[name];
        },
        getHeaders() {
          return resHeaders;
        },
        end(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        write(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2(void 0);
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return true;
        },
        writeHead(statusCode, headers2) {
          this.statusCode = statusCode;
          if (headers2) {
            if (Array.isArray(headers2) || typeof headers2 === "string") {
              throw new TypeError("Raw headers  is not supported.");
            }
            for (const header in headers2) {
              const value = headers2[header];
              if (value !== void 0) {
                this.setHeader(
                  header,
                  value
                );
              }
            }
          }
          return this;
        }
      });
      const event = createEvent(reqProxy, resProxy);
      event.fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: useNitroApp().localFetch
      });
      event.$fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: globalThis.$fetch
      });
      event.waitUntil = incomingEvent.waitUntil;
      event.context = incomingEvent.context;
      event.context.cache = {
        options: _opts
      };
      const body = await handler(event) || _resSendBody;
      const headers = event.node.res.getHeaders();
      headers.etag = String(
        headers.Etag || headers.etag || `W/"${hash(body)}"`
      );
      headers["last-modified"] = String(
        headers["Last-Modified"] || headers["last-modified"] || (/* @__PURE__ */ new Date()).toUTCString()
      );
      const cacheControl = [];
      if (opts.swr) {
        if (opts.maxAge) {
          cacheControl.push(`s-maxage=${opts.maxAge}`);
        }
        if (opts.staleMaxAge) {
          cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
        } else {
          cacheControl.push("stale-while-revalidate");
        }
      } else if (opts.maxAge) {
        cacheControl.push(`max-age=${opts.maxAge}`);
      }
      if (cacheControl.length > 0) {
        headers["cache-control"] = cacheControl.join(", ");
      }
      const cacheEntry = {
        code: event.node.res.statusCode,
        headers,
        body
      };
      return cacheEntry;
    },
    _opts
  );
  return defineEventHandler(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return;
      }
      return handler(event);
    }
    const response = await _cachedHandler(
      event
    );
    if (event.node.res.headersSent || event.node.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["last-modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.node.res.statusCode = response.code;
    for (const name in response.headers) {
      const value = response.headers[name];
      if (name === "set-cookie") {
        event.node.res.appendHeader(
          name,
          splitCookiesString(value)
        );
      } else {
        if (value !== void 0) {
          event.node.res.setHeader(name, value);
        }
      }
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

function klona(x) {
	if (typeof x !== 'object') return x;

	var k, tmp, str=Object.prototype.toString.call(x);

	if (str === '[object Object]') {
		if (x.constructor !== Object && typeof x.constructor === 'function') {
			tmp = new x.constructor();
			for (k in x) {
				if (x.hasOwnProperty(k) && tmp[k] !== x[k]) {
					tmp[k] = klona(x[k]);
				}
			}
		} else {
			tmp = {}; // null
			for (k in x) {
				if (k === '__proto__') {
					Object.defineProperty(tmp, k, {
						value: klona(x[k]),
						configurable: true,
						enumerable: true,
						writable: true,
					});
				} else {
					tmp[k] = klona(x[k]);
				}
			}
		}
		return tmp;
	}

	if (str === '[object Array]') {
		k = x.length;
		for (tmp=Array(k); k--;) {
			tmp[k] = klona(x[k]);
		}
		return tmp;
	}

	if (str === '[object Set]') {
		tmp = new Set;
		x.forEach(function (val) {
			tmp.add(klona(val));
		});
		return tmp;
	}

	if (str === '[object Map]') {
		tmp = new Map;
		x.forEach(function (val, key) {
			tmp.set(klona(key), klona(val));
		});
		return tmp;
	}

	if (str === '[object Date]') {
		return new Date(+x);
	}

	if (str === '[object RegExp]') {
		tmp = new RegExp(x.source, x.flags);
		tmp.lastIndex = x.lastIndex;
		return tmp;
	}

	if (str === '[object DataView]') {
		return new x.constructor( klona(x.buffer) );
	}

	if (str === '[object ArrayBuffer]') {
		return x.slice(0);
	}

	// ArrayBuffer.isView(x)
	// ~> `new` bcuz `Buffer.slice` => ref
	if (str.slice(-6) === 'Array]') {
		return new x.constructor(x);
	}

	return x;
}

const inlineAppConfig = {};



const appConfig = defuFn(inlineAppConfig);

const NUMBER_CHAR_RE = /\d/;
const STR_SPLITTERS = ["-", "_", "/", "."];
function isUppercase(char = "") {
  if (NUMBER_CHAR_RE.test(char)) {
    return void 0;
  }
  return char !== char.toLowerCase();
}
function splitByCase(str, separators) {
  const splitters = STR_SPLITTERS;
  const parts = [];
  if (!str || typeof str !== "string") {
    return parts;
  }
  let buff = "";
  let previousUpper;
  let previousSplitter;
  for (const char of str) {
    const isSplitter = splitters.includes(char);
    if (isSplitter === true) {
      parts.push(buff);
      buff = "";
      previousUpper = void 0;
      continue;
    }
    const isUpper = isUppercase(char);
    if (previousSplitter === false) {
      if (previousUpper === false && isUpper === true) {
        parts.push(buff);
        buff = char;
        previousUpper = isUpper;
        continue;
      }
      if (previousUpper === true && isUpper === false && buff.length > 1) {
        const lastChar = buff.at(-1);
        parts.push(buff.slice(0, Math.max(0, buff.length - 1)));
        buff = lastChar + char;
        previousUpper = isUpper;
        continue;
      }
    }
    buff += char;
    previousUpper = isUpper;
    previousSplitter = isSplitter;
  }
  parts.push(buff);
  return parts;
}
function kebabCase(str, joiner) {
  return str ? (Array.isArray(str) ? str : splitByCase(str)).map((p) => p.toLowerCase()).join(joiner) : "";
}
function snakeCase(str) {
  return kebabCase(str || "", "_");
}

function getEnv(key, opts) {
  const envKey = snakeCase(key).toUpperCase();
  return destr(
    process.env[opts.prefix + envKey] ?? process.env[opts.altPrefix + envKey]
  );
}
function _isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function applyEnv(obj, opts, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = getEnv(subKey, opts);
    if (_isObject(obj[key])) {
      if (_isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
        applyEnv(obj[key], opts, subKey);
      } else if (envValue === void 0) {
        applyEnv(obj[key], opts, subKey);
      } else {
        obj[key] = envValue ?? obj[key];
      }
    } else {
      obj[key] = envValue ?? obj[key];
    }
    if (opts.envExpansion && typeof obj[key] === "string") {
      obj[key] = _expandFromEnv(obj[key]);
    }
  }
  return obj;
}
const envExpandRx = /\{\{([^{}]*)\}\}/g;
function _expandFromEnv(value) {
  return value.replace(envExpandRx, (match, key) => {
    return process.env[key] || match;
  });
}

const _inlineRuntimeConfig = {
  "app": {
    "baseURL": "/",
    "buildId": "97634f1f-932e-4d0d-ada5-c2b0c241d739",
    "buildAssetsDir": "/_nuxt/",
    "cdnURL": ""
  },
  "nitro": {
    "envPrefix": "NUXT_",
    "routeRules": {
      "/__nuxt_error": {
        "cache": false
      },
      "/_nuxt/builds/meta/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      },
      "/_nuxt/builds/**": {
        "headers": {
          "cache-control": "public, max-age=1, immutable"
        }
      },
      "/_nuxt/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      }
    }
  },
  "public": {},
  "deepseekApiKey": "",
  "deepseekBaseUrl": "https://api.deepseek.com",
  "ipqsApiKey": "",
  "iplocateApiKey": "",
  "adminPassword": "",
  "adminSecret": ""
};
const envOptions = {
  prefix: "NITRO_",
  altPrefix: _inlineRuntimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_",
  envExpansion: _inlineRuntimeConfig.nitro.envExpansion ?? process.env.NITRO_ENV_EXPANSION ?? false
};
const _sharedRuntimeConfig = _deepFreeze(
  applyEnv(klona(_inlineRuntimeConfig), envOptions)
);
function useRuntimeConfig(event) {
  if (!event) {
    return _sharedRuntimeConfig;
  }
  if (event.context.nitro.runtimeConfig) {
    return event.context.nitro.runtimeConfig;
  }
  const runtimeConfig = klona(_inlineRuntimeConfig);
  applyEnv(runtimeConfig, envOptions);
  event.context.nitro.runtimeConfig = runtimeConfig;
  return runtimeConfig;
}
_deepFreeze(klona(appConfig));
function _deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      _deepFreeze(value);
    }
  }
  return Object.freeze(object);
}
new Proxy(/* @__PURE__ */ Object.create(null), {
  get: (_, prop) => {
    console.warn(
      "Please use `useRuntimeConfig()` instead of accessing config directly."
    );
    const runtimeConfig = useRuntimeConfig();
    if (prop in runtimeConfig) {
      return runtimeConfig[prop];
    }
    return void 0;
  }
});

function createContext(opts = {}) {
  let currentInstance;
  let isSingleton = false;
  const checkConflict = (instance) => {
    if (currentInstance && currentInstance !== instance) {
      throw new Error("Context conflict");
    }
  };
  let als;
  if (opts.asyncContext) {
    const _AsyncLocalStorage = opts.AsyncLocalStorage || globalThis.AsyncLocalStorage;
    if (_AsyncLocalStorage) {
      als = new _AsyncLocalStorage();
    } else {
      console.warn("[unctx] `AsyncLocalStorage` is not provided.");
    }
  }
  const _getCurrentInstance = () => {
    if (als) {
      const instance = als.getStore();
      if (instance !== void 0) {
        return instance;
      }
    }
    return currentInstance;
  };
  return {
    use: () => {
      const _instance = _getCurrentInstance();
      if (_instance === void 0) {
        throw new Error("Context is not available");
      }
      return _instance;
    },
    tryUse: () => {
      return _getCurrentInstance();
    },
    set: (instance, replace) => {
      if (!replace) {
        checkConflict(instance);
      }
      currentInstance = instance;
      isSingleton = true;
    },
    unset: () => {
      currentInstance = void 0;
      isSingleton = false;
    },
    call: (instance, callback) => {
      checkConflict(instance);
      currentInstance = instance;
      try {
        return als ? als.run(instance, callback) : callback();
      } finally {
        if (!isSingleton) {
          currentInstance = void 0;
        }
      }
    },
    async callAsync(instance, callback) {
      currentInstance = instance;
      const onRestore = () => {
        currentInstance = instance;
      };
      const onLeave = () => currentInstance === instance ? onRestore : void 0;
      asyncHandlers.add(onLeave);
      try {
        const r = als ? als.run(instance, callback) : callback();
        if (!isSingleton) {
          currentInstance = void 0;
        }
        return await r;
      } finally {
        asyncHandlers.delete(onLeave);
      }
    }
  };
}
function createNamespace(defaultOpts = {}) {
  const contexts = {};
  return {
    get(key, opts = {}) {
      if (!contexts[key]) {
        contexts[key] = createContext({ ...defaultOpts, ...opts });
      }
      return contexts[key];
    }
  };
}
const _globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : {};
const globalKey = "__unctx__";
const defaultNamespace = _globalThis[globalKey] || (_globalThis[globalKey] = createNamespace());
const getContext = (key, opts = {}) => defaultNamespace.get(key, opts);
const asyncHandlersKey = "__unctx_async_handlers__";
const asyncHandlers = _globalThis[asyncHandlersKey] || (_globalThis[asyncHandlersKey] = /* @__PURE__ */ new Set());

getContext("nitro-app", {
  asyncContext: false,
  AsyncLocalStorage: void 0
});

function isPathInScope(pathname, base) {
  let canonical;
  try {
    const pre = pathname.replace(/%2f/gi, "/").replace(/%5c/gi, "\\");
    canonical = new URL(pre, "http://_").pathname;
  } catch {
    return false;
  }
  return !base || canonical === base || canonical.startsWith(base + "/");
}

const config = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(
  createRouter$1({ routes: config.nitro.routeRules })
);
function createRouteRulesHandler(ctx) {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      let target = routeRules.redirect.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.redirect._redirectStripBase;
        if (strpBase) {
          if (!isPathInScope(event.path.split("?")[0], strpBase)) {
            throw createError$1({ statusCode: 400 });
          }
          targetPath = withoutBase(targetPath, strpBase);
        } else if (targetPath.startsWith("//")) {
          targetPath = targetPath.replace(/^\/+/, "/");
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery$1(event.path);
        target = withQuery(target, query);
      }
      return sendRedirect(event, target, routeRules.redirect.statusCode);
    }
    if (routeRules.proxy) {
      let target = routeRules.proxy.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.proxy._proxyStripBase;
        if (strpBase) {
          if (!isPathInScope(event.path.split("?")[0], strpBase)) {
            throw createError$1({ statusCode: 400 });
          }
          targetPath = withoutBase(targetPath, strpBase);
        } else if (targetPath.startsWith("//")) {
          targetPath = targetPath.replace(/^\/+/, "/");
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery$1(event.path);
        target = withQuery(target, query);
      }
      return proxyRequest(event, target, {
        fetch: ctx.localFetch,
        ...routeRules.proxy
      });
    }
  });
}
function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    event.context._nitro.routeRules = getRouteRulesForPath(
      withoutBase(event.path.split("?")[0], useRuntimeConfig().app.baseURL)
    );
  }
  return event.context._nitro.routeRules;
}
function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
}

function _captureError(error, type) {
  console.error(`[${type}]`, error);
  useNitroApp().captureError(error, { tags: [type] });
}
function trapUnhandledNodeErrors() {
  process.on(
    "unhandledRejection",
    (error) => _captureError(error, "unhandledRejection")
  );
  process.on(
    "uncaughtException",
    (error) => _captureError(error, "uncaughtException")
  );
}
function joinHeaders(value) {
  return Array.isArray(value) ? value.join(", ") : String(value);
}
function normalizeFetchResponse(response) {
  if (!response.headers.has("set-cookie")) {
    return response;
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: normalizeCookieHeaders(response.headers)
  });
}
function normalizeCookieHeader(header = "") {
  return splitCookiesString(joinHeaders(header));
}
function normalizeCookieHeaders(headers) {
  const outgoingHeaders = new Headers();
  for (const [name, header] of headers) {
    if (name === "set-cookie") {
      for (const cookie of normalizeCookieHeader(header)) {
        outgoingHeaders.append("set-cookie", cookie);
      }
    } else {
      outgoingHeaders.set(name, joinHeaders(header));
    }
  }
  return outgoingHeaders;
}

//#region src/runtime/utils/error.ts
/**
* Nitro internal functions extracted from https://github.com/nitrojs/nitro/blob/v2/src/runtime/internal/utils.ts
*/
function isJsonRequest(event) {
	if (hasReqHeader(event, "accept", "text/html")) return false;
	return hasReqHeader(event, "accept", "application/json") || hasReqHeader(event, "user-agent", "curl/") || hasReqHeader(event, "user-agent", "httpie/") || hasReqHeader(event, "sec-fetch-mode", "cors") || event.path.startsWith("/api/") || event.path.endsWith(".json");
}
function hasReqHeader(event, name, includes) {
	const value = getRequestHeader(event, name);
	return !!(value && typeof value === "string" && value.toLowerCase().includes(includes));
}

//#region src/runtime/handlers/error.ts
var error_default = async function errorhandler(error, event, { defaultHandler }) {
	if (event.handled || isJsonRequest(event)) return;
	const defaultRes = await defaultHandler(error, event, { json: true });
	const status = error.status || error.statusCode || 500;
	if (status === 404 && defaultRes.status === 302) {
		setResponseHeaders(event, defaultRes.headers);
		setResponseStatus(event, defaultRes.status, defaultRes.statusText);
		return send(event, JSON.stringify(defaultRes.body, null, 2));
	}
	const errorObject = defaultRes.body;
	const url = new URL(errorObject.url);
	errorObject.url = withoutBase(url.pathname, useRuntimeConfig(event).app.baseURL) + url.search + url.hash;
	errorObject.message = error.unhandled ? errorObject.message || "Server Error" : error.message || errorObject.message || "Server Error";
	errorObject.data ||= error.data;
	errorObject.statusText ||= error.statusText || error.statusMessage;
	delete defaultRes.headers["content-type"];
	delete defaultRes.headers["content-security-policy"];
	setResponseHeaders(event, defaultRes.headers);
	const reqHeaders = getRequestHeaders(event);
	const res = event.path.startsWith("/__nuxt_error") || !!reqHeaders["x-nuxt-error"] ? null : await useNitroApp().localFetch(withQuery(joinURL(useRuntimeConfig(event).app.baseURL, "/__nuxt_error"), errorObject), {
		headers: {
			...reqHeaders,
			"x-nuxt-error": "true"
		},
		redirect: "manual"
	}).catch(() => null);
	if (event.handled) return;
	if (!res) {
		const { template } = await import('../_/error-500.mjs');
		setResponseHeader(event, "Content-Type", "text/html;charset=UTF-8");
		return send(event, template(errorObject));
	}
	const html = await res.text();
	for (const [header, value] of res.headers.entries()) {
		if (header === "set-cookie") {
			appendResponseHeader(event, header, value);
			continue;
		}
		setResponseHeader(event, header, value);
	}
	setResponseStatus(event, res.status && res.status !== 200 ? res.status : defaultRes.status, res.statusText || defaultRes.statusText);
	return send(event, html);
};

function defineNitroErrorHandler(handler) {
  return handler;
}

const errorHandler$1 = defineNitroErrorHandler(
  function defaultNitroErrorHandler(error, event) {
    const res = defaultHandler(error, event);
    setResponseHeaders(event, res.headers);
    setResponseStatus(event, res.status, res.statusText);
    return send(event, JSON.stringify(res.body, null, 2));
  }
);
function defaultHandler(error, event, opts) {
  const isSensitive = error.unhandled || error.fatal;
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage || "Server Error";
  const url = getRequestURL(event, { xForwardedHost: true, xForwardedProto: true });
  if (statusCode === 404) {
    const baseURL = "/";
    if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) {
      const redirectTo = `${baseURL}${url.pathname.slice(1)}${url.search}`;
      return {
        status: 302,
        statusText: "Found",
        headers: { location: redirectTo },
        body: `Redirecting...`
      };
    }
  }
  if (isSensitive && !opts?.silent) {
    const tags = [error.unhandled && "[unhandled]", error.fatal && "[fatal]"].filter(Boolean).join(" ");
    console.error(`[request error] ${tags} [${event.method}] ${url}
`, error);
  }
  const headers = {
    "content-type": "application/json",
    // Prevent browser from guessing the MIME types of resources.
    "x-content-type-options": "nosniff",
    // Prevent error page from being embedded in an iframe
    "x-frame-options": "DENY",
    // Prevent browsers from sending the Referer header
    "referrer-policy": "no-referrer",
    // Disable the execution of any js
    "content-security-policy": "script-src 'none'; frame-ancestors 'none';"
  };
  setResponseStatus(event, statusCode, statusMessage);
  if (statusCode === 404 || !getResponseHeader(event, "cache-control")) {
    headers["cache-control"] = "no-cache";
  }
  const body = {
    error: true,
    url: url.href,
    statusCode,
    statusMessage,
    message: isSensitive ? "Server Error" : error.message,
    data: isSensitive ? void 0 : error.data
  };
  return {
    status: statusCode,
    statusText: statusMessage,
    headers,
    body
  };
}

const errorHandlers = [error_default, errorHandler$1];

async function errorHandler(error, event) {
  for (const handler of errorHandlers) {
    try {
      await handler(error, event, { defaultHandler });
      if (event.handled) {
        return; // Response handled
      }
    } catch(error) {
      // Handler itself thrown, log and continue
      console.error(error);
    }
  }
  // H3 will handle fallback
}

const plugins = [
  
];

const assets = {
  "/_nuxt/mobile-padding.d5b16c4d2eb4.css": {"type":"text/css; charset=utf-8","etag":"\"6ac-11xL7fCWVK5KsGbbst4mTnAlHvk\"","mtime":"2026-11-04T17:51:31.401Z","size":1708,"path":"../public/_nuxt/mobile-padding.d5b16c4d2eb4.css"},
  "/favicon.svg": {
    "type": "image/svg+xml",
    "etag": "\"3606-myt8psxX+EWGPQFOJRJSpEiJLoY\"",
    "mtime": "2026-11-02T09:13:40.073Z",
    "size": 13830,
    "path": "../public/favicon.svg"
  },
  "/assets/earth-land-mask.jpg": {
    "type": "image/jpeg",
    "etag": "\"1724b-ZJu8bYF58zNo+X3Wj5QF8CD65sI\"",
    "mtime": "2026-11-02T09:13:40.033Z",
    "size": 94795,
    "path": "../public/assets/earth-land-mask.jpg"
  },
  "/assets/earth-land-texture.jpg": {
    "type": "image/jpeg",
    "etag": "\"7d25e-qEU3llT/YevlCg46iv+XgQmRPN8\"",
    "mtime": "2026-11-02T09:13:40.036Z",
    "size": 512606,
    "path": "../public/assets/earth-land-texture.jpg"
  },
  "/blog-covers/cover-11-9-million-new-proxy-exits-datacenter-blocklist.webp": {
    "type": "image/webp",
    "etag": "\"15722-v0Fy0yf6CiooSsc58B9xSRfwn9Q\"",
    "mtime": "2026-11-02T09:13:40.038Z",
    "size": 87842,
    "path": "../public/blog-covers/cover-11-9-million-new-proxy-exits-datacenter-blocklist.webp"
  },
  "/blog-covers/cover-fbi-seizes-virtualine-bulletproof-hosting.webp": {
    "type": "image/webp",
    "etag": "\"ed42-X2N19OC/8W0MWWOYUcfFPRR7Fwo\"",
    "mtime": "2026-11-02T09:13:40.031Z",
    "size": 60738,
    "path": "../public/blog-covers/cover-fbi-seizes-virtualine-bulletproof-hosting.webp"
  },
  "/blog-covers/cover-maxmind-shared-ip-confidence-cgnat.webp": {
    "type": "image/webp",
    "etag": "\"cea2-Z/OTCoSoL1tCihtTZ9NAe/pnocA\"",
    "mtime": "2026-11-02T09:13:40.040Z",
    "size": 52898,
    "path": "../public/blog-covers/cover-maxmind-shared-ip-confidence-cgnat.webp"
  },
  "/blog-covers/cover-ipvanish-dedicated-ip-shared-vs-dedicated.webp": {
    "type": "image/webp",
    "etag": "\"e938-FrVI4NYzqXfJXP/QvKKU/deW3tw\"",
    "mtime": "2026-11-02T09:13:40.039Z",
    "size": 59704,
    "path": "../public/blog-covers/cover-ipvanish-dedicated-ip-shared-vs-dedicated.webp"
  },
  "/blog-covers/cover-residential-vs-datacenter-vs-mobile-ip.webp": {
    "type": "image/webp",
    "etag": "\"b732-og+5hz7u8YvRVGSvSxZsGTFapGs\"",
    "mtime": "2026-11-02T09:13:40.046Z",
    "size": 46898,
    "path": "../public/blog-covers/cover-residential-vs-datacenter-vs-mobile-ip.webp"
  },
  "/blog-covers/cover-what-is-ip-risk-score.webp": {
    "type": "image/webp",
    "etag": "\"a3f0-Qsw6gGIUu+TM9Y5qq7HAOXuOeG4\"",
    "mtime": "2026-11-02T09:13:40.041Z",
    "size": 41968,
    "path": "../public/blog-covers/cover-what-is-ip-risk-score.webp"
  },
  "/blog-covers/cover-why-chatgpt-claude-blocking-your-ip.webp": {
    "type": "image/webp",
    "etag": "\"cc04-3uspYjleIoOOGGK0V7HsmWRM+hQ\"",
    "mtime": "2026-11-02T09:13:40.046Z",
    "size": 52228,
    "path": "../public/blog-covers/cover-why-chatgpt-claude-blocking-your-ip.webp"
  },
  "/blog-covers/cover-why-is-my-ip-blacklisted.webp": {
    "type": "image/webp",
    "etag": "\"aa2c-o1HHzEK0VNx5XP6rbNuVdUU50do\"",
    "mtime": "2026-11-02T09:13:40.047Z",
    "size": 43564,
    "path": "../public/blog-covers/cover-why-is-my-ip-blacklisted.webp"
  },
  "/blog-covers/cover-what-is-proxyjacking-pawns-app.webp": {
    "type": "image/webp",
    "etag": "\"dfd6-npupS0Jk8ySYP/4GgGSJBM7JHNc\"",
    "mtime": "2026-11-02T09:13:40.046Z",
    "size": 57302,
    "path": "../public/blog-covers/cover-what-is-proxyjacking-pawns-app.webp"
  },
  "/blog-covers/cover-virustotal-quanwang-saomiao.webp": {
    "type": "image/webp",
    "etag": "\"1447c-5/wsDk84Cb3D5FyuesstcAD5BiM\"",
    "mtime": "2026-11-02T09:13:40.040Z",
    "size": 83068,
    "path": "../public/blog-covers/cover-virustotal-quanwang-saomiao.webp"
  },
  "/fonts/ClashDisplay-Variable.ttf": {
    "type": "font/ttf",
    "etag": "\"15800-Y+Ag32AAf4B399K4alzCVz+yYCI\"",
    "mtime": "2026-11-02T09:13:40.031Z",
    "size": 88064,
    "path": "../public/fonts/ClashDisplay-Variable.ttf"
  },
  "/blog-covers/residential-vs-datacenter-vs-mobile-ip-v10.webp": {
    "type": "image/webp",
    "etag": "\"5210c-4xMl70UeE9WBU8Nu85hKmiQWn+0\"",
    "mtime": "2026-11-02T09:13:40.047Z",
    "size": 336140,
    "path": "../public/blog-covers/residential-vs-datacenter-vs-mobile-ip-v10.webp"
  },
  "/_nuxt/0rDkImIb.news1106.js": {"type":"text/javascript","etag":"\"f4-1tmaRZft1T+lWxt2Mpx37yUt1n8\"","mtime":"2026-11-06T00:00:00.000Z","size":244,"path":"../public/_nuxt/0rDkImIb.news1106.js"},
  "/_nuxt/0rDkImIb.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"eb-tEUB0vtBNvTA6+7/vZBLxYdIBXo\"",
    "mtime": "2026-11-02T09:13:39.967Z",
    "size": 235,
    "path": "../public/_nuxt/0rDkImIb.js"
  },
  "/_nuxt/2m5AKH7-.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4a6-pM1Up7hB7zL6nJy6PYtk7kQWvtk\"",
    "mtime": "2026-11-02T09:13:39.968Z",
    "size": 1190,
    "path": "../public/_nuxt/2m5AKH7-.js"
  },
  "/_nuxt/8VOV02sH.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"c50-uOnXl2Sud/SXmsYn3jtVcKy00XQ\"",
    "mtime": "2026-11-02T09:13:39.967Z",
    "size": 3152,
    "path": "../public/_nuxt/8VOV02sH.js"
  },
  "/blog-covers/what-is-ip-risk-score-v10.webp": {
    "type": "image/webp",
    "etag": "\"6a5f8-ef4vwlPoy50xpI0LM69O9n6Trh8\"",
    "mtime": "2026-11-02T09:13:40.048Z",
    "size": 435704,
    "path": "../public/blog-covers/what-is-ip-risk-score-v10.webp"
  },
  "/assets/gradient-green-square.mp4": {
    "type": "video/mp4",
    "etag": "\"e147d-bxh8SbO2Ez9ZX6nWk2hRKtHqts8\"",
    "mtime": "2026-11-02T09:13:40.038Z",
    "size": 922749,
    "path": "../public/assets/gradient-green-square.mp4"
  },
  "/blog-covers/why-is-my-ip-blacklisted-v10.webp": {
    "type": "image/webp",
    "etag": "\"91f04-vox91hw7UZxy7ARtuScIbu6ouAI\"",
    "mtime": "2026-11-02T09:13:40.049Z",
    "size": 597764,
    "path": "../public/blog-covers/why-is-my-ip-blacklisted-v10.webp"
  },
  "/assets/gradient-green-faq.mp4": {
    "type": "video/mp4",
    "etag": "\"108d02-4gczi0sTFS9AZYlIWSRBcfW48Us\"",
    "mtime": "2026-11-02T09:13:40.040Z",
    "size": 1084674,
    "path": "../public/assets/gradient-green-faq.mp4"
  },
  "/_nuxt/D2Uo64ua2.poster1103.color1105.news1106.canon1106.js": {"type":"text/javascript","etag":"\"6cc6-SrLnFxaKJuvyYqPog4QYekt6CAA\"","mtime":"2026-11-06T12:00:00.000Z","size":27846,"path":"../public/_nuxt/D2Uo64ua2.poster1103.color1105.news1106.canon1106.js"},
  "/_nuxt/D2Uo64ua2.poster1103.color1105.news1106.js": {"type":"text/javascript","etag":"\"6c99-ZbNJrhy3xOdnCbVhUIcRexyV/RU\"","mtime":"2026-11-06T00:00:00.000Z","size":27801,"path":"../public/_nuxt/D2Uo64ua2.poster1103.color1105.news1106.js"},
  "/_nuxt/D2Uo64ua2.poster1103.color1105.js": {"type":"text/javascript","etag":"\"6c7e-glpRFHtDtttF2OKH9gSCZ8w56AM\"","mtime":"2026-11-05T00:00:00.000Z","size":27774,"path":"../public/_nuxt/D2Uo64ua2.poster1103.color1105.js"},
  "/_nuxt/D2Uo64ua2.poster1103.js": {"type":"text/javascript","etag":"\"6c31-Su0KNc7Igyigcdr2KTEs/5wJa34\"","mtime":"2026-11-03T05:00:00.000Z","size":27697,"path":"../public/_nuxt/D2Uo64ua2.poster1103.js"},
  "/_nuxt/CczsPb3K.poster1103.news1106.canon1106.js": {"type":"text/javascript","etag":"\"5376-4V79ISXJFihoqjDgszG1507J+5U\"","mtime":"2026-11-06T12:00:00.000Z","size":21366,"path":"../public/_nuxt/CczsPb3K.poster1103.news1106.canon1106.js"},
  "/_nuxt/CczsPb3K.poster1103.news1106.js": {"type":"text/javascript","etag":"\"533e-XHOsJI6jfaS0TIaB2AKYO18yMMM\"","mtime":"2026-11-06T00:00:00.000Z","size":21310,"path":"../public/_nuxt/CczsPb3K.poster1103.news1106.js"},
  "/_nuxt/CczsPb3K.poster1103.js": {"type":"text/javascript","etag":"\"5323-D24qvyibvmFKvTx/5Qve8wx2l9g\"","mtime":"2026-11-03T05:00:00.000Z","size":21283,"path":"../public/_nuxt/CczsPb3K.poster1103.js"},
  "/_nuxt/Dv-YR-fg.poster1103.js": {"type":"text/javascript","etag":"\"f03e-2jQn3hPx//6LWGjF96XfQWv9jdc\"","mtime":"2026-11-03T05:00:00.000Z","size":61502,"path":"../public/_nuxt/Dv-YR-fg.poster1103.js"},
  "/assets/gradient-green-hero-poster.webp": {"type":"image/webp","etag":"\"1596-QpM+kBIKjtlwycf5XdwubF5nOmQ\"","mtime":"2026-11-03T05:00:00.000Z","size":5526,"path":"../public/assets/gradient-green-hero-poster.webp"},
  "/assets/gradient-green-faq-poster.webp": {"type":"image/webp","etag":"\"ee4-P+3jaP5wDzDUtAd88caPsDexduA\"","mtime":"2026-11-03T05:00:00.000Z","size":3812,"path":"../public/assets/gradient-green-faq-poster.webp"},
  "/assets/gradient-blue-hero-poster.webp": {"type":"image/webp","etag":"\"1714-7/R1TIkYsCEhBlg2Cq5KNcmT23g\"","mtime":"2026-11-03T05:00:00.000Z","size":5908,"path":"../public/assets/gradient-blue-hero-poster.webp"},
  "/_nuxt/fe8h-uHL.seo1103.news1106.canon1106.js": {"type":"text/javascript","etag":"\"1472-qXbT0gOD4BcwLwLQKcgwvLm/y1U\"","mtime":"2026-11-06T12:00:00.000Z","size":5234,"path":"../public/_nuxt/fe8h-uHL.seo1103.news1106.canon1106.js"},
  "/_nuxt/fe8h-uHL.seo1103.news1106.js": {"type":"text/javascript","etag":"\"1431-No2pNNo7fTmCi2sZ1+aIjCeOhhg\"","mtime":"2026-11-06T00:00:00.000Z","size":5169,"path":"../public/_nuxt/fe8h-uHL.seo1103.news1106.js"},
  "/_nuxt/fe8h-uHL.seo1103.js": {"type":"text/javascript","etag":"\"1416-0LETes0QFIgxapA127DSgKIRj/s\"","mtime":"2026-11-03T07:30:00.000Z","size":5142,"path":"../public/_nuxt/fe8h-uHL.seo1103.js"},
  "/_nuxt/Dv-YR-fg.poster1103.seo1103.js": {"type":"text/javascript","etag":"\"f04e-zXUQOBZzRmRoQWDdD4iuvgK9jf0\"","mtime":"2026-11-03T07:30:00.000Z","size":61518,"path":"../public/_nuxt/Dv-YR-fg.poster1103.seo1103.js"},
  "/_nuxt/resources.DJjxARCL.badge1104.css": {"type":"text/css; charset=utf-8","etag":"\"26cb-E/keI8UG8eF97Y7ngQVLoCUC6C8\"","mtime":"2026-11-04T14:22:22.392Z","size":9931,"path":"../public/_nuxt/resources.DJjxARCL.badge1104.css"},
  "/_nuxt/Dv-YR-fg.poster1103.seo1103.badge1104.js": {"type":"text/javascript","etag":"\"f058-/vtUXaL1quba7ohU0MVbHRx3ovs\"","mtime":"2026-11-04T14:22:22.393Z","size":61528,"path":"../public/_nuxt/Dv-YR-fg.poster1103.seo1103.badge1104.js"},
  "/_nuxt/resources.DJjxARCL.badge1104b.css": {"type":"text/css; charset=utf-8","etag":"\"269f-BCd35sPj29vXldXefg2gtke6m5A\"","mtime":"2026-11-04T14:43:09.494Z","size":9887,"path":"../public/_nuxt/resources.DJjxARCL.badge1104b.css"},
  "/_nuxt/Dv-YR-fg.poster1103.seo1103.badge1104b.color1105.width1105.mobile1105.news1106.canon1106.js": {"type":"text/javascript","etag":"\"f240-fYKtbc86Jr+lAig8RPWqa5SqQwo\"","mtime":"2026-11-06T12:00:00.000Z","size":62016,"path":"../public/_nuxt/Dv-YR-fg.poster1103.seo1103.badge1104b.color1105.width1105.mobile1105.news1106.canon1106.js"},
  "/_nuxt/Dv-YR-fg.poster1103.seo1103.badge1104b.color1105.width1105.mobile1105.news1106.js": {"type":"text/javascript","etag":"\"f1c8-cq78Gs4gFiaOBrFB43x5YKwEKhQ\"","mtime":"2026-11-06T00:00:00.000Z","size":61896,"path":"../public/_nuxt/Dv-YR-fg.poster1103.seo1103.badge1104b.color1105.width1105.mobile1105.news1106.js"},
  "/_nuxt/Dv-YR-fg.poster1103.seo1103.badge1104b.color1105.width1105.mobile1105.js": {"type":"text/javascript","etag":"\"f096-RTN0yzxk+L1RPI/cjt5GmC+do+8\"","mtime":"2026-11-05T18:00:00.000Z","size":61590,"path":"../public/_nuxt/Dv-YR-fg.poster1103.seo1103.badge1104b.color1105.width1105.mobile1105.js"},
  "/_nuxt/Dv-YR-fg.poster1103.seo1103.badge1104b.color1105.width1105.js": {"type":"text/javascript","etag":"\"f08b-HNXSsyyiWFJHmQWoGaW4L1wWizY\"","mtime":"2026-11-05T12:00:00.000Z","size":61579,"path":"../public/_nuxt/Dv-YR-fg.poster1103.seo1103.badge1104b.color1105.width1105.js"},
  "/_nuxt/Dv-YR-fg.poster1103.seo1103.badge1104b.color1105.js": {"type":"text/javascript","etag":"\"f081-H80vP1ard1vSyG9f6Zo55VPNhHQ\"","mtime":"2026-11-05T00:00:00.000Z","size":61569,"path":"../public/_nuxt/Dv-YR-fg.poster1103.seo1103.badge1104b.color1105.js"},
  "/_nuxt/Dv-YR-fg.poster1103.seo1103.badge1104b.js": {"type":"text/javascript","etag":"\"f059-IcmAeBuOT/GoxqeMGYqBgR9Qcvs\"","mtime":"2026-11-04T14:43:09.494Z","size":61529,"path":"../public/_nuxt/Dv-YR-fg.poster1103.seo1103.badge1104b.js"},
  "/assets/gradient-green-hero.mp4": {
    "type": "video/mp4",
    "etag": "\"1d3c86-nSr+THFqSB57gtqHS9frFUSgcUY\"",
    "mtime": "2026-11-02T09:13:40.041Z",
    "size": 1916038,
    "path": "../public/assets/gradient-green-hero.mp4"
  },
  "/assets/gradient-blue-hero.mp4": {
    "type": "video/mp4",
    "etag": "\"1e98bd-rJRWAc0B+hWdk40Zp9nbWoGqrFo\"",
    "mtime": "2026-11-02T09:13:40.033Z",
    "size": 2005181,
    "path": "../public/assets/gradient-blue-hero.mp4"
  },
  "/_nuxt/9lbuDytq.news1106.js": {"type":"text/javascript","etag":"\"46d-kdKJTsfq5IXPtL0bMx4F6TO7RVY\"","mtime":"2026-11-06T00:00:00.000Z","size":1133,"path":"../public/_nuxt/9lbuDytq.news1106.js"},
  "/_nuxt/9lbuDytq.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"464-/rUpvZbPIts+YuMFprGnvJGufQ8\"",
    "mtime": "2026-11-02T09:13:39.967Z",
    "size": 1124,
    "path": "../public/_nuxt/9lbuDytq.js"
  },
  "/_nuxt/AppFooter.CPBy0SZo.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"9b4-MHRGaqi+P8xjTYeV9mYwE1xrQFM\"",
    "mtime": "2026-11-02T09:13:39.967Z",
    "size": 2484,
    "path": "../public/_nuxt/AppFooter.CPBy0SZo.css"
  },
  "/_nuxt/BDNMzG2s.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"54-MasMfSk/A98C3Gn9uIOxtFxkWNw\"",
    "mtime": "2026-11-02T09:13:39.968Z",
    "size": 84,
    "path": "../public/_nuxt/BDNMzG2s.js"
  },
  "/_nuxt/BHqjuTM_.news1106.js": {"type":"text/javascript","etag":"\"14f18-YvxsjvriTIE4AF6ObozwQ+jxXJs\"","mtime":"2026-11-06T00:00:00.000Z","size":85784,"path":"../public/_nuxt/BHqjuTM_.news1106.js"},
  "/_nuxt/BHqjuTM_.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"14f06-4mu8+1Op+R6xOm2NsG3rKHq/H3k\"",
    "mtime": "2026-11-02T09:13:39.969Z",
    "size": 85766,
    "path": "../public/_nuxt/BHqjuTM_.js"
  },
  "/_nuxt/BPulv7zN2.news1106.canon1106.js": {"type":"text/javascript","etag":"\"1708-rOfrtXh5l6iEH0vi/A4Q8vSSb74\"","mtime":"2026-11-06T12:00:00.000Z","size":5896,"path":"../public/_nuxt/BPulv7zN2.news1106.canon1106.js"},
  "/_nuxt/BPulv7zN2.news1106.js": {"type":"text/javascript","etag":"\"16d2-GypSnWVxnHT7rCOUO9U1oVUThhM\"","mtime":"2026-11-06T00:00:00.000Z","size":5842,"path":"../public/_nuxt/BPulv7zN2.news1106.js"},
  "/_nuxt/BPulv7zN2.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"16c0-hPm3Fyv5FFfRVuDIgADlaw1pNAg\"",
    "mtime": "2026-11-02T09:13:39.967Z",
    "size": 5824,
    "path": "../public/_nuxt/BPulv7zN2.js"
  },
  "/_nuxt/BShyHmY4.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"7e89-SwoeFV7Dt2TMW1jKO6rVlj0ML1w\"",
    "mtime": "2026-11-02T09:13:39.968Z",
    "size": 32393,
    "path": "../public/_nuxt/BShyHmY4.js"
  },
  "/_nuxt/BJJqepEs.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"19122-e4Za/La5Do9g4ngrKkaPZZ3ElQc\"",
    "mtime": "2026-11-02T09:13:39.969Z",
    "size": 102690,
    "path": "../public/_nuxt/BJJqepEs.js"
  },
  "/_nuxt/BrywZTfe.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"162-ZjIYXdWWAh2v0bLKCqDhK81qXgU\"",
    "mtime": "2026-11-02T09:13:39.968Z",
    "size": 354,
    "path": "../public/_nuxt/BrywZTfe.js"
  },
  "/_nuxt/BqJrR-8D.news1106.js": {"type":"text/javascript","etag":"\"1bfe-KrPk0tjKc9YN+XAySrPXrooTifQ\"","mtime":"2026-11-06T00:00:00.000Z","size":7166,"path":"../public/_nuxt/BqJrR-8D.news1106.js"},
  "/_nuxt/BqJrR-8D.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1bf5-AuQ8OGSM6NebLYtiwlcA1VssYyw\"",
    "mtime": "2026-11-02T09:13:39.968Z",
    "size": 7157,
    "path": "../public/_nuxt/BqJrR-8D.js"
  },
  "/_nuxt/BuSybzV-.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1990-C/xY1qFZf8OkuY637WJCOA9UjI0\"",
    "mtime": "2026-11-02T09:13:39.969Z",
    "size": 6544,
    "path": "../public/_nuxt/BuSybzV-.js"
  },
  "/_nuxt/BnG19esN2.news1106.js": {"type":"text/javascript","etag":"\"f2-09Z0xiwgMwgWEfhxa3xyqIbIf44\"","mtime":"2026-11-06T00:00:00.000Z","size":242,"path":"../public/_nuxt/BnG19esN2.news1106.js"},
  "/_nuxt/BnG19esN2.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"e9-Y053cMsEwIBi8vKcjELLGUEzRcM\"",
    "mtime": "2026-11-02T09:13:39.968Z",
    "size": 233,
    "path": "../public/_nuxt/BnG19esN2.js"
  },
  "/_nuxt/BxFmCBgx.news1106.js": {"type":"text/javascript","etag":"\"25a-L1CMfTz4fcvzBhlwX48rJZstIWc\"","mtime":"2026-11-06T00:00:00.000Z","size":602,"path":"../public/_nuxt/BxFmCBgx.news1106.js"},
  "/_nuxt/BxFmCBgx.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"251-K5X/SAomGkPVxT2kv69hJ0Vv2qg\"",
    "mtime": "2026-11-02T09:13:39.968Z",
    "size": 593,
    "path": "../public/_nuxt/BxFmCBgx.js"
  },
  "/_nuxt/C-M2vFy-.news1106.js": {"type":"text/javascript","etag":"\"273-yuhcpQRCovVY4Y3zmsM0Y5Vzh3M\"","mtime":"2026-11-06T00:00:00.000Z","size":627,"path":"../public/_nuxt/C-M2vFy-.news1106.js"},
  "/_nuxt/C-M2vFy-.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"26a-Kd15gU8k5cWQbayRfj0tD95E+CA\"",
    "mtime": "2026-11-02T09:13:39.968Z",
    "size": 618,
    "path": "../public/_nuxt/C-M2vFy-.js"
  },
  "/_nuxt/C9Tai6WB2.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"e97-fDgJ3BQHOc2P1J3aa9/aJutT1uQ\"",
    "mtime": "2026-11-02T09:13:39.970Z",
    "size": 3735,
    "path": "../public/_nuxt/C9Tai6WB2.js"
  },
  "/_nuxt/CAbgu5Lp.news1106.js": {"type":"text/javascript","etag":"\"6e7-Xt9rVB9bunL5eq13hvo8U1Oe8MM\"","mtime":"2026-11-06T00:00:00.000Z","size":1767,"path":"../public/_nuxt/CAbgu5Lp.news1106.js"},
  "/_nuxt/CAbgu5Lp.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"6de-fQ+qYXrWnMrD8S7e5ChxksAtWb4\"",
    "mtime": "2026-11-02T09:13:39.969Z",
    "size": 1758,
    "path": "../public/_nuxt/CAbgu5Lp.js"
  },
  "/_nuxt/CKCfbw_T.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"65-T+dwZWjpty/ljwKMk9UZRVJ0kSY\"",
    "mtime": "2026-11-02T09:13:39.969Z",
    "size": 101,
    "path": "../public/_nuxt/CKCfbw_T.js"
  },
  "/_nuxt/CNvEpvty.news1106.js": {"type":"text/javascript","etag":"\"f2-9WCe/NG7PpepNqQsNEuyGerjUm8\"","mtime":"2026-11-06T00:00:00.000Z","size":242,"path":"../public/_nuxt/CNvEpvty.news1106.js"},
  "/_nuxt/CNvEpvty.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"e9-899Zp9eYOYr/l3vOeNE95HkDQ70\"",
    "mtime": "2026-11-02T09:13:39.969Z",
    "size": 233,
    "path": "../public/_nuxt/CNvEpvty.js"
  },
  "/_nuxt/CQMnziXA.news1106.js": {"type":"text/javascript","etag":"\"ab08-lcE79EM54ouJnx7r+Nyf9lKb8E4\"","mtime":"2026-11-06T00:00:00.000Z","size":43784,"path":"../public/_nuxt/CQMnziXA.news1106.js"},
  "/_nuxt/CQMnziXA.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"aad2-nNq6xg+t8HMi3C8AyhFuhO08ZIQ\"",
    "mtime": "2026-11-02T09:13:39.969Z",
    "size": 43730,
    "path": "../public/_nuxt/CQMnziXA.js"
  },
  "/_nuxt/CczsPb3K.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"52f3-QYj6Nkb9uhcn9vmE39wsvRQ6D0o\"",
    "mtime": "2026-11-02T09:13:39.970Z",
    "size": 21235,
    "path": "../public/_nuxt/CczsPb3K.js"
  },
  "/fonts/DingTalk-JinBuTi.ttf": {
    "type": "font/ttf",
    "etag": "\"207cf0-QKpiXOpRqYUxm7NakwfSR6CfcJo\"",
    "mtime": "2026-11-02T09:13:40.051Z",
    "size": 2129136,
    "path": "../public/fonts/DingTalk-JinBuTi.ttf"
  },
  "/_nuxt/ChAmtJMs.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"21df-kYN5gQA6znwwraImCadQa3Y07tg\"",
    "mtime": "2026-11-02T09:13:39.970Z",
    "size": 8671,
    "path": "../public/_nuxt/ChAmtJMs.js"
  },
  "/_nuxt/CsmPqC0c.color1105.news1106.canon1106.js": {"type":"text/javascript","etag":"\"502c-/9qZSjgN8DbD9319jjAjJAK5sBA\"","mtime":"2026-11-06T12:00:00.000Z","size":20524,"path":"../public/_nuxt/CsmPqC0c.color1105.news1106.canon1106.js"},
  "/_nuxt/CsmPqC0c.color1105.news1106.js": {"type":"text/javascript","etag":"\"4ffa-Slo4QWiSCckZ7akpXO7cItxaEeQ\"","mtime":"2026-11-06T00:00:00.000Z","size":20474,"path":"../public/_nuxt/CsmPqC0c.color1105.news1106.js"},
  "/_nuxt/CsmPqC0c.color1105.js": {"type":"text/javascript","etag":"\"4fd6-a3daIKtb716T0k1E11PYyFic338\"","mtime":"2026-11-05T00:00:00.000Z","size":20438,"path":"../public/_nuxt/CsmPqC0c.color1105.js"},
  "/_nuxt/CsmPqC0c.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4f88-JQyk5/sy77aKoiHFIYpbBor6onw\"",
    "mtime": "2026-11-02T09:13:39.970Z",
    "size": 20360,
    "path": "../public/_nuxt/CsmPqC0c.js"
  },
  "/_nuxt/CvORIAsC.news1106.canon1106.js": {"type":"text/javascript","etag":"\"f75-VHr8gnR3M1rnJbyP6gojppm8lIg\"","mtime":"2026-11-06T12:00:00.000Z","size":3957,"path":"../public/_nuxt/CvORIAsC.news1106.canon1106.js"},
  "/_nuxt/CvORIAsC.news1106.js": {"type":"text/javascript","etag":"\"f42-iGQLyD0HyDHIIoAMnDHfo5xam7I\"","mtime":"2026-11-06T00:00:00.000Z","size":3906,"path":"../public/_nuxt/CvORIAsC.news1106.js"},
  "/_nuxt/CvORIAsC.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"f01-xc1+Giw9NcVGPPRddo61bpnPxPI\"",
    "mtime": "2026-11-02T09:13:39.970Z",
    "size": 3841,
    "path": "../public/_nuxt/CvORIAsC.js"
  },
  "/_nuxt/D2Uo64ua2.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"6bd0-HsHHOZmmcvISzt20RyyQUoiLkd8\"",
    "mtime": "2026-11-02T09:13:39.970Z",
    "size": 27600,
    "path": "../public/_nuxt/D2Uo64ua2.js"
  },
  "/_nuxt/DCntoh4u2.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"d3a-9VZGhheb7i2Bd8n7m3mBqCErpdc\"",
    "mtime": "2026-11-02T09:13:39.971Z",
    "size": 3386,
    "path": "../public/_nuxt/DCntoh4u2.js"
  },
  "/_nuxt/DFReJX94.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"42-eebaa9DsP3HC80pteDG/H7BW6Wc\"",
    "mtime": "2026-11-02T09:13:39.970Z",
    "size": 66,
    "path": "../public/_nuxt/DFReJX94.js"
  },
  "/_nuxt/DNOYF1aZ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1c84-VZtJQ+wbLh9YvCS2/TlLcxdfd58\"",
    "mtime": "2026-11-02T09:13:39.971Z",
    "size": 7300,
    "path": "../public/_nuxt/DNOYF1aZ.js"
  },
  "/_nuxt/DQynAwdz.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"38cd-ydZ2ViouLsMUvMaWIs4aXeamyx0\"",
    "mtime": "2026-11-02T09:13:39.970Z",
    "size": 14541,
    "path": "../public/_nuxt/DQynAwdz.js"
  },
  "/_nuxt/DVh4192o.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"ba5-GkcBGvnSOA4IzTYdyvQZSeyCT6M\"",
    "mtime": "2026-11-02T09:13:39.970Z",
    "size": 2981,
    "path": "../public/_nuxt/DVh4192o.js"
  },
  "/_nuxt/DeOpG6bM.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"7068-MAgREWfNn0dmTxsD/jOh79zDIGA\"",
    "mtime": "2026-11-02T09:13:39.971Z",
    "size": 28776,
    "path": "../public/_nuxt/DeOpG6bM.js"
  },
  "/_nuxt/DnLDYUNZ.news1106.js": {"type":"text/javascript","etag":"\"2672-qvqhQFm2LNTOe5r+na8q9Yc5vZg\"","mtime":"2026-11-06T00:00:00.000Z","size":9842,"path":"../public/_nuxt/DnLDYUNZ.news1106.js"},
  "/_nuxt/DnLDYUNZ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2645-oYVUHWdS/lDtK9m8A5m8sHfjF4U\"",
    "mtime": "2026-11-02T09:13:39.971Z",
    "size": 9797,
    "path": "../public/_nuxt/DnLDYUNZ.js"
  },
  "/_nuxt/DsaQ1DWu.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1279-DbfeXzydLN5oGKDUkplaNQE6pmY\"",
    "mtime": "2026-11-02T09:13:39.971Z",
    "size": 4729,
    "path": "../public/_nuxt/DsaQ1DWu.js"
  },
  "/_nuxt/Dv-YR-fg.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"f012-wMi/JsHQA3xgDMZsBPjBPZPT+kU\"",
    "mtime": "2026-11-02T09:13:39.972Z",
    "size": 61458,
    "path": "../public/_nuxt/Dv-YR-fg.js"
  },
  "/_nuxt/Dx7oLvBN.news1106.js": {"type":"text/javascript","etag":"\"f4-5QJNCPsr7ats+EBOa/miK84rr7I\"","mtime":"2026-11-06T00:00:00.000Z","size":244,"path":"../public/_nuxt/Dx7oLvBN.news1106.js"},
  "/_nuxt/Dx7oLvBN.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"eb-FcExkgnYB9DueQLXhMKJtKXaodA\"",
    "mtime": "2026-11-02T09:13:39.971Z",
    "size": 235,
    "path": "../public/_nuxt/Dx7oLvBN.js"
  },
  "/_nuxt/PlatformLandingPage.dSo__XYj.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"b414-zlL5cDKQOBNWfEZKNWN2EVHJWWk\"",
    "mtime": "2026-11-02T09:13:39.971Z",
    "size": 46100,
    "path": "../public/_nuxt/PlatformLandingPage.dSo__XYj.css"
  },
  "/_nuxt/T9Ybx9e_2.news1106.js": {"type":"text/javascript","etag":"\"ee-NvxKrqQNzIS1lVTQOJR3dJ5+llA\"","mtime":"2026-11-06T00:00:00.000Z","size":238,"path":"../public/_nuxt/T9Ybx9e_2.news1106.js"},
  "/_nuxt/T9Ybx9e_2.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"e5-/SajA9C5kpVQXxI91Sik9I+0DS8\"",
    "mtime": "2026-11-02T09:13:39.971Z",
    "size": 229,
    "path": "../public/_nuxt/T9Ybx9e_2.js"
  },
  "/_nuxt/batch-check.Rj1wv1f-.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2e8d-yaOvfFxXBICfrAv/cAoOOiiEvIk\"",
    "mtime": "2026-11-02T09:13:39.973Z",
    "size": 11917,
    "path": "../public/_nuxt/batch-check.Rj1wv1f-.css"
  },
  "/_nuxt/check.BdkoyriM.width1105.mobile1105.css": {"type":"text/css; charset=utf-8","etag":"\"1c53-7JKGTCkeDk5bxHtF3E68mxmU94Y\"","mtime":"2026-11-05T18:00:00.000Z","size":7251,"path":"../public/_nuxt/check.BdkoyriM.width1105.mobile1105.css"},
  "/_nuxt/check.BdkoyriM.width1105.css": {"type":"text/css; charset=utf-8","etag":"\"1b99-HFm+tnGXOmCrgINNuvclkEShYyA\"","mtime":"2026-11-05T12:00:00.000Z","size":7065,"path":"../public/_nuxt/check.BdkoyriM.width1105.css"},
  "/_nuxt/check.BdkoyriM.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1bb8-TE+zXeXKKjy8ImH2qJzRxNsEJoY\"",
    "mtime": "2026-11-02T09:13:39.972Z",
    "size": 7096,
    "path": "../public/_nuxt/check.BdkoyriM.css"
  },
  "/_nuxt/error-404.DpIhUoa0.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"97d-ssrBF0hBbkz82aK1vhiOHeM/zMg\"",
    "mtime": "2026-11-02T09:13:39.972Z",
    "size": 2429,
    "path": "../public/_nuxt/error-404.DpIhUoa0.css"
  },
  "/_nuxt/entry.BZo3tGvk.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"184d4-7IIN8UksZHieLPsj9HY9fuHemow\"",
    "mtime": "2026-11-02T09:13:39.972Z",
    "size": 99540,
    "path": "../public/_nuxt/entry.BZo3tGvk.css"
  },
  "/_nuxt/entry.BZo3tGvk.border1102.color1105.mobile1105.css": {"type":"text/css; charset=utf-8","etag":"\"1864c-RPTJt9gornwXC3bbGvmB5eDJdr0\"","mtime":"2026-11-05T18:00:00.000Z","size":99916,"path":"../public/_nuxt/entry.BZo3tGvk.border1102.color1105.mobile1105.css"},
  "/_nuxt/entry.BZo3tGvk.border1102.color1105.css": {"type":"text/css; charset=utf-8","etag":"\"18627-gU+3H2SG56ZPH1GBX0P11vB8eeg\"","mtime":"2026-11-05T00:00:00.000Z","size":99879,"path":"../public/_nuxt/entry.BZo3tGvk.border1102.color1105.css"},
  "/_nuxt/entry.BZo3tGvk.border1102.css": {"type":"text/css; charset=utf-8","etag":"\"18523-PBkBq9sx6ApsEG4IuwZF9cv4ShA\"","mtime":"2026-11-02T09:13:39.972Z","size":99619,"path":"../public/_nuxt/entry.BZo3tGvk.border1102.css"},
  "/_nuxt/fgIp3SdQ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1c30-m/DlzA8t+V5/SvEjX4OJ+E6/3WE\"",
    "mtime": "2026-11-02T09:13:39.972Z",
    "size": 7216,
    "path": "../public/_nuxt/fgIp3SdQ.js"
  },
  "/_nuxt/error-500.DdyDsVmG.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"772-jm01H041ktHLg4YP+vC6uEuVuAc\"",
    "mtime": "2026-11-02T09:13:39.975Z",
    "size": 1906,
    "path": "../public/_nuxt/error-500.DdyDsVmG.css"
  },
  "/_nuxt/fe8h-uHL.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"13e6-idMQYwD1Xdv31dJpaAokAn/JJP4\"",
    "mtime": "2026-11-02T09:13:39.972Z",
    "size": 5094,
    "path": "../public/_nuxt/fe8h-uHL.js"
  },
  "/_nuxt/nHVgxKWC.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"26117-ohyT3fhhwXgC6/0EoT6qVAgbvcw\"",
    "mtime": "2026-11-02T09:13:39.973Z",
    "size": 155927,
    "path": "../public/_nuxt/nHVgxKWC.js"
  },
  "/_nuxt/otVYgH2v.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1aaf-V9WsbaSJ95W6bSbjzOJesgjjCQY\"",
    "mtime": "2026-11-02T09:13:39.975Z",
    "size": 6831,
    "path": "../public/_nuxt/otVYgH2v.js"
  },
  "/_nuxt/qfpJzYdO.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"57-gZvnRbcFYieVLLFwU/56sCzT8hI\"",
    "mtime": "2026-11-02T09:13:39.975Z",
    "size": 87,
    "path": "../public/_nuxt/qfpJzYdO.js"
  },
  "/_nuxt/resources.DJjxARCL.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"268e-Gv8qSEzKhyL4NmUBSetbXodXId0\"",
    "mtime": "2026-11-02T09:13:39.976Z",
    "size": 9870,
    "path": "../public/_nuxt/resources.DJjxARCL.css"
  },
  "/_nuxt/txgHq3Va.news1106.js": {"type":"text/javascript","etag":"\"a92-joIfsh9UBVwK0QOjsyxaAnFXpOs\"","mtime":"2026-11-06T00:00:00.000Z","size":2706,"path":"../public/_nuxt/txgHq3Va.news1106.js"},
  "/_nuxt/txgHq3Va.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"a89-RPnj15UIA7lMWPYjoSPlZh8docE\"",
    "mtime": "2026-11-02T09:13:39.975Z",
    "size": 2697,
    "path": "../public/_nuxt/txgHq3Va.js"
  },
  "/assets/blog-covers/batch-share.svg": {
    "type": "image/svg+xml",
    "etag": "\"de9-WzvDax5/fq2Xhi55nFdn9wi16LU\"",
    "mtime": "2026-11-02T09:13:40.053Z",
    "size": 3561,
    "path": "../public/assets/blog-covers/batch-share.svg"
  },
  "/assets/blog-covers/blacklist-check.svg": {
    "type": "image/svg+xml",
    "etag": "\"b8f-rowFRpUUUyHMcHnut8RK9VZyiO0\"",
    "mtime": "2026-11-02T09:13:40.032Z",
    "size": 2959,
    "path": "../public/assets/blog-covers/blacklist-check.svg"
  },
  "/assets/blog-covers/checklist.svg": {
    "type": "image/svg+xml",
    "etag": "\"cce-8EeWd6Ziv3MWKnuwMOol6KzSKh0\"",
    "mtime": "2026-11-02T09:13:40.053Z",
    "size": 3278,
    "path": "../public/assets/blog-covers/checklist.svg"
  },
  "/assets/blog-covers/discord-ban.svg": {
    "type": "image/svg+xml",
    "etag": "\"c3d-3gcOlgOz+kAd4qf9Rd1ZIhjy/pk\"",
    "mtime": "2026-11-02T09:13:40.053Z",
    "size": 3133,
    "path": "../public/assets/blog-covers/discord-ban.svg"
  },
  "/assets/blog-covers/home-network.svg": {
    "type": "image/svg+xml",
    "etag": "\"db9-vzqHkOGIjRYhcD/yqvIc/sbhvCw\"",
    "mtime": "2026-11-02T09:13:40.053Z",
    "size": 3513,
    "path": "../public/assets/blog-covers/home-network.svg"
  },
  "/assets/blog-covers/ip-types.svg": {
    "type": "image/svg+xml",
    "etag": "\"106c-8oFkNEFJCyXFhnemUujC5EEMltQ\"",
    "mtime": "2026-11-02T09:13:40.055Z",
    "size": 4204,
    "path": "../public/assets/blog-covers/ip-types.svg"
  },
  "/assets/blog-covers/ip-bans.svg": {
    "type": "image/svg+xml",
    "etag": "\"b1f-37GY6+zIvZm7hb++aX+lSDxWe5o\"",
    "mtime": "2026-11-02T09:13:40.054Z",
    "size": 2847,
    "path": "../public/assets/blog-covers/ip-bans.svg"
  },
  "/assets/blog-covers/low-fraud-score.svg": {
    "type": "image/svg+xml",
    "etag": "\"c1a-Z9OqfhPAgvUkD82fq8qTB0GGKHk\"",
    "mtime": "2026-11-02T09:13:40.053Z",
    "size": 3098,
    "path": "../public/assets/blog-covers/low-fraud-score.svg"
  },
  "/assets/blog-covers/open-proxy.svg": {
    "type": "image/svg+xml",
    "etag": "\"d21-BfG/+AD4d4rG+EZyKgUSs6/V7KE\"",
    "mtime": "2026-11-02T09:13:40.054Z",
    "size": 3361,
    "path": "../public/assets/blog-covers/open-proxy.svg"
  },
  "/assets/blog-covers/platform-flags.svg": {
    "type": "image/svg+xml",
    "etag": "\"e25-TjkC9xRoow1reZ5flO9W4tFUNFA\"",
    "mtime": "2026-11-02T09:13:40.054Z",
    "size": 3621,
    "path": "../public/assets/blog-covers/platform-flags.svg"
  },
  "/assets/blog-covers/risk-score.svg": {
    "type": "image/svg+xml",
    "etag": "\"a0f-ZAnDENk9Mk1YAVfmn5DSavqHThw\"",
    "mtime": "2026-11-02T09:13:40.054Z",
    "size": 2575,
    "path": "../public/assets/blog-covers/risk-score.svg"
  },
  "/assets/blog-covers/score-history.svg": {
    "type": "image/svg+xml",
    "etag": "\"b20-B8yybdsUAirCnQ85ErchoVTCZzg\"",
    "mtime": "2026-11-02T09:13:40.056Z",
    "size": 2848,
    "path": "../public/assets/blog-covers/score-history.svg"
  },
  "/assets/blog-covers/session-clean.svg": {
    "type": "image/svg+xml",
    "etag": "\"d28-b8FhE47KPsFJAo7xfw/mE95X2xI\"",
    "mtime": "2026-11-02T09:13:40.054Z",
    "size": 3368,
    "path": "../public/assets/blog-covers/session-clean.svg"
  },
  "/assets/figma/icon-browser.png": {
    "type": "image/png",
    "etag": "\"396-P+4531LPYI5H7fPODtuO+ALmt1A\"",
    "mtime": "2026-11-02T09:13:40.032Z",
    "size": 918,
    "path": "../public/assets/figma/icon-browser.png"
  },
  "/assets/figma/icon-location.png": {
    "type": "image/png",
    "etag": "\"312-ZcDBlqOGMzI/lkryM8xH06HRC7o\"",
    "mtime": "2026-11-02T09:13:40.054Z",
    "size": 786,
    "path": "../public/assets/figma/icon-location.png"
  },
  "/assets/figma/icon-time.png": {
    "type": "image/png",
    "etag": "\"1bf-vGkbuRHEuRLmMon/8xMINwxcwoY\"",
    "mtime": "2026-11-02T09:13:40.054Z",
    "size": 447,
    "path": "../public/assets/figma/icon-time.png"
  },
  "/assets/figma/imgAliexpress.svg": {
    "type": "image/svg+xml",
    "etag": "\"119e-fcOc5qwwA6jL8zS3opjK2pLGN3g\"",
    "mtime": "2026-11-02T09:13:40.056Z",
    "size": 4510,
    "path": "../public/assets/figma/imgAliexpress.svg"
  },
  "/assets/figma/imgAmazon.svg": {
    "type": "image/svg+xml",
    "etag": "\"18f3-SvlMlmlktjJcH+MQYR42cCWNM1Y\"",
    "mtime": "2026-11-02T09:13:40.056Z",
    "size": 6387,
    "path": "../public/assets/figma/imgAmazon.svg"
  },
  "/assets/figma/imgBestuy.svg": {
    "type": "image/svg+xml",
    "etag": "\"3bd5-po4/4z7zVX4RMlzmz2LOf0thcWg\"",
    "mtime": "2026-11-02T09:13:40.055Z",
    "size": 15317,
    "path": "../public/assets/figma/imgBestuy.svg"
  },
  "/assets/figma/imgBg.svg": {
    "type": "image/svg+xml",
    "etag": "\"6e5-smwLBhEmMcKv67NG2CZy9kdpaYM\"",
    "mtime": "2026-11-02T09:13:40.055Z",
    "size": 1765,
    "path": "../public/assets/figma/imgBg.svg"
  },
  "/assets/figma/imgDiscord.svg": {
    "type": "image/svg+xml",
    "etag": "\"1ad4-4d4Sp4Wyq7Sj2mXsNv+dOFCdIR8\"",
    "mtime": "2026-11-02T09:13:40.056Z",
    "size": 6868,
    "path": "../public/assets/figma/imgDiscord.svg"
  },
  "/assets/figma/imgEbay.svg": {
    "type": "image/svg+xml",
    "etag": "\"a18-myAJQMIX9RxoCd2Hxv1aM60hwq8\"",
    "mtime": "2026-11-02T09:13:40.058Z",
    "size": 2584,
    "path": "../public/assets/figma/imgEbay.svg"
  },
  "/assets/figma/imgEllipse11.svg": {
    "type": "image/svg+xml",
    "etag": "\"2b0-OMxfRq5/N6oNS02w/3xxQIzMV6U\"",
    "mtime": "2026-11-02T09:13:40.056Z",
    "size": 688,
    "path": "../public/assets/figma/imgEllipse11.svg"
  },
  "/assets/figma/imgCleanShot20240707At2241422X1.png": {
    "type": "image/png",
    "etag": "\"ecd52-+Jos+KPl7VOV8Y3AY5xOSHcbaYU\"",
    "mtime": "2026-11-02T09:13:40.060Z",
    "size": 970066,
    "path": "../public/assets/figma/imgCleanShot20240707At2241422X1.png"
  },
  "/assets/figma/imgEllipse12.svg": {
    "type": "image/svg+xml",
    "etag": "\"2b0-IV1US5a/9nH72DGKSgLqeYuJ2c4\"",
    "mtime": "2026-11-02T09:13:40.056Z",
    "size": 688,
    "path": "../public/assets/figma/imgEllipse12.svg"
  },
  "/assets/figma/imgEtsy.svg": {
    "type": "image/svg+xml",
    "etag": "\"c7e-SU24Bwq14hJd5+LxAU+nc5S3saw\"",
    "mtime": "2026-11-02T09:13:40.058Z",
    "size": 3198,
    "path": "../public/assets/figma/imgEtsy.svg"
  },
  "/assets/figma/imgFacebook.svg": {
    "type": "image/svg+xml",
    "etag": "\"e0b-kqvBpygHjdU+cTBI26n9334XH1c\"",
    "mtime": "2026-11-02T09:13:40.057Z",
    "size": 3595,
    "path": "../public/assets/figma/imgFacebook.svg"
  },
  "/assets/figma/imgGroup.svg": {
    "type": "image/svg+xml",
    "etag": "\"102-P/P+CD5jyHAycoshKf0JKd1fvQY\"",
    "mtime": "2026-11-02T09:13:40.058Z",
    "size": 258,
    "path": "../public/assets/figma/imgGroup.svg"
  },
  "/assets/figma/imgGroup1.svg": {
    "type": "image/svg+xml",
    "etag": "\"2d6-9h5TXgvGN9z/jfVj8RVf99bBXEo\"",
    "mtime": "2026-11-02T09:13:40.058Z",
    "size": 726,
    "path": "../public/assets/figma/imgGroup1.svg"
  },
  "/assets/figma/imgInstagram.svg": {
    "type": "image/svg+xml",
    "etag": "\"25da-CaiUYiP9ucB4yhnPWm4T7HuZCpg\"",
    "mtime": "2026-11-02T09:13:40.058Z",
    "size": 9690,
    "path": "../public/assets/figma/imgInstagram.svg"
  },
  "/assets/figma/imgLinkedin.svg": {
    "type": "image/svg+xml",
    "etag": "\"1749-dtJMfPQx9m+FZoEDvKKjNFB6S3o\"",
    "mtime": "2026-11-02T09:13:40.058Z",
    "size": 5961,
    "path": "../public/assets/figma/imgLinkedin.svg"
  },
  "/assets/figma/imgLogo.svg": {
    "type": "image/svg+xml",
    "etag": "\"3606-myt8psxX+EWGPQFOJRJSpEiJLoY\"",
    "mtime": "2026-11-02T09:13:40.059Z",
    "size": 13830,
    "path": "../public/assets/figma/imgLogo.svg"
  },
  "/assets/figma/imgLogo1.svg": {
    "type": "image/svg+xml",
    "etag": "\"1f8-UycHQllT2chdKJ1sUboBXq7KcCs\"",
    "mtime": "2026-11-02T09:13:40.059Z",
    "size": 504,
    "path": "../public/assets/figma/imgLogo1.svg"
  },
  "/assets/figma/imgMacOs.svg": {
    "type": "image/svg+xml",
    "etag": "\"1b9c-fhOubqb+uGl8CiDj1/MNn6BT8hw\"",
    "mtime": "2026-11-02T09:13:40.059Z",
    "size": 7068,
    "path": "../public/assets/figma/imgMacOs.svg"
  },
  "/assets/figma/imgMaskGroup.svg": {
    "type": "image/svg+xml",
    "etag": "\"348c-+NKa9ED5FrbM/jvABKUKp+wea+U\"",
    "mtime": "2026-11-02T09:13:40.059Z",
    "size": 13452,
    "path": "../public/assets/figma/imgMaskGroup.svg"
  },
  "/assets/figma/imgNetflix.svg": {
    "type": "image/svg+xml",
    "etag": "\"56f-pab7yyGSruMWNPQPs+g+e37Cqxg\"",
    "mtime": "2026-11-02T09:13:40.059Z",
    "size": 1391,
    "path": "../public/assets/figma/imgNetflix.svg"
  },
  "/assets/figma/imgShopee.svg": {
    "type": "image/svg+xml",
    "etag": "\"188e-F7tKqM9exSQaA8CmCn4xnhf2fVw\"",
    "mtime": "2026-11-02T09:13:40.060Z",
    "size": 6286,
    "path": "../public/assets/figma/imgShopee.svg"
  },
  "/assets/figma/imgReddit.svg": {
    "type": "image/svg+xml",
    "etag": "\"a7c-/HqcfEL3n81U4l/3VegKAvjl+ec\"",
    "mtime": "2026-11-02T09:13:40.059Z",
    "size": 2684,
    "path": "../public/assets/figma/imgReddit.svg"
  },
  "/assets/figma/imgShopify.svg": {
    "type": "image/svg+xml",
    "etag": "\"d03-loskrrFprz8/XTBdSEPe8wzYbFk\"",
    "mtime": "2026-11-02T09:13:40.059Z",
    "size": 3331,
    "path": "../public/assets/figma/imgShopify.svg"
  },
  "/assets/figma/imgStar2.svg": {
    "type": "image/svg+xml",
    "etag": "\"222-YMIVLmOM//fQBM5h7Cteu3vDZ3w\"",
    "mtime": "2026-11-02T09:13:40.060Z",
    "size": 546,
    "path": "../public/assets/figma/imgStar2.svg"
  },
  "/assets/figma/imgSubtract.svg": {
    "type": "image/svg+xml",
    "etag": "\"4e8-QT9kpn6bZiHbCO3J4aLGXCfXKXQ\"",
    "mtime": "2026-11-02T09:13:40.060Z",
    "size": 1256,
    "path": "../public/assets/figma/imgSubtract.svg"
  },
  "/assets/figma/imgTemu.svg": {
    "type": "image/svg+xml",
    "etag": "\"151f-nejP5UjILxQm4ZcfP/kKj7kLDVs\"",
    "mtime": "2026-11-02T09:13:40.060Z",
    "size": 5407,
    "path": "../public/assets/figma/imgTemu.svg"
  },
  "/assets/figma/imgTiktok.svg": {
    "type": "image/svg+xml",
    "etag": "\"92d-F4cQxmV0XEP/Bcoh0Y3YzKCEut8\"",
    "mtime": "2026-11-02T09:13:40.061Z",
    "size": 2349,
    "path": "../public/assets/figma/imgTiktok.svg"
  },
  "/assets/figma/imgVector.svg": {
    "type": "image/svg+xml",
    "etag": "\"290-AsgXccTupVdRxa1QVpdceylQC9Y\"",
    "mtime": "2026-11-02T09:13:40.060Z",
    "size": 656,
    "path": "../public/assets/figma/imgVector.svg"
  },
  "/assets/figma/imgSubtract1.svg": {
    "type": "image/svg+xml",
    "etag": "\"353-PXxeztKURfHYUo9/xP+MDzRScBM\"",
    "mtime": "2026-11-02T09:13:40.060Z",
    "size": 851,
    "path": "../public/assets/figma/imgSubtract1.svg"
  },
  "/assets/figma/imgVector1.svg": {
    "type": "image/svg+xml",
    "etag": "\"a44-ZcsZNb5pKHvvtlITMmcl/3/9s7Y\"",
    "mtime": "2026-11-02T09:13:40.060Z",
    "size": 2628,
    "path": "../public/assets/figma/imgVector1.svg"
  },
  "/assets/figma/imgVector10.svg": {
    "type": "image/svg+xml",
    "etag": "\"118-G5byhRH++8EwkCtcL60P0MoxgHM\"",
    "mtime": "2026-11-02T09:13:40.061Z",
    "size": 280,
    "path": "../public/assets/figma/imgVector10.svg"
  },
  "/assets/figma/imgVector11.svg": {
    "type": "image/svg+xml",
    "etag": "\"411-QMLPzJlRYmcJwXmKmP7dDWc6ygE\"",
    "mtime": "2026-11-02T09:13:40.061Z",
    "size": 1041,
    "path": "../public/assets/figma/imgVector11.svg"
  },
  "/assets/figma/imgVector12.svg": {
    "type": "image/svg+xml",
    "etag": "\"21b-t71uwCsRJVxBY4Kb/J1okicG+OU\"",
    "mtime": "2026-11-02T09:13:40.061Z",
    "size": 539,
    "path": "../public/assets/figma/imgVector12.svg"
  },
  "/assets/figma/imgVector13.svg": {
    "type": "image/svg+xml",
    "etag": "\"203-W1DOG7nUzvyqdx5kSu0B9We6na8\"",
    "mtime": "2026-11-02T09:13:40.061Z",
    "size": 515,
    "path": "../public/assets/figma/imgVector13.svg"
  },
  "/assets/figma/imgVector14.svg": {
    "type": "image/svg+xml",
    "etag": "\"100-NLOXwKLMwzb9gIL8A04SLCA5Hzw\"",
    "mtime": "2026-11-02T09:13:40.061Z",
    "size": 256,
    "path": "../public/assets/figma/imgVector14.svg"
  },
  "/assets/figma/imgVector15.svg": {
    "type": "image/svg+xml",
    "etag": "\"100-+1BV1QX2LXn8G3kZ7B+tM5W0Znw\"",
    "mtime": "2026-11-02T09:13:40.062Z",
    "size": 256,
    "path": "../public/assets/figma/imgVector15.svg"
  },
  "/assets/figma/imgVector17.svg": {
    "type": "image/svg+xml",
    "etag": "\"720-7yNapXWhDAA+o8nCJls2Inl5hRA\"",
    "mtime": "2026-11-02T09:13:40.062Z",
    "size": 1824,
    "path": "../public/assets/figma/imgVector17.svg"
  },
  "/assets/figma/imgVector18.svg": {
    "type": "image/svg+xml",
    "etag": "\"e1-1gI8m+4JkLtZAGBaCE4nPlGsgiM\"",
    "mtime": "2026-11-02T09:13:40.062Z",
    "size": 225,
    "path": "../public/assets/figma/imgVector18.svg"
  },
  "/assets/figma/imgVector16.svg": {
    "type": "image/svg+xml",
    "etag": "\"e54-Oa8gMilvK+tWPlyGmIFGNo2KGHQ\"",
    "mtime": "2026-11-02T09:13:40.061Z",
    "size": 3668,
    "path": "../public/assets/figma/imgVector16.svg"
  },
  "/assets/figma/imgVector2.svg": {
    "type": "image/svg+xml",
    "etag": "\"3ab-A0qGsavv6wEWtsuSQ3hWStcBZ9M\"",
    "mtime": "2026-11-02T09:13:40.062Z",
    "size": 939,
    "path": "../public/assets/figma/imgVector2.svg"
  },
  "/assets/figma/imgVector20.svg": {
    "type": "image/svg+xml",
    "etag": "\"2f8-Ca8Ew1yctE1A3cnBWxz7+o0YNik\"",
    "mtime": "2026-11-02T09:13:40.063Z",
    "size": 760,
    "path": "../public/assets/figma/imgVector20.svg"
  },
  "/assets/figma/imgVector19.svg": {
    "type": "image/svg+xml",
    "etag": "\"2a3-5Lb5FbhwsiZJpMBKYVOdb2/nU2U\"",
    "mtime": "2026-11-02T09:13:40.061Z",
    "size": 675,
    "path": "../public/assets/figma/imgVector19.svg"
  },
  "/assets/figma/imgVector22.svg": {
    "type": "image/svg+xml",
    "etag": "\"1f3-3GWMZhy8REWM0NbIpWibAstDE2A\"",
    "mtime": "2026-11-02T09:13:40.062Z",
    "size": 499,
    "path": "../public/assets/figma/imgVector22.svg"
  },
  "/assets/figma/imgVector21.svg": {
    "type": "image/svg+xml",
    "etag": "\"1f3-B+WorEL78kR7HkwymXM7VgjsFeY\"",
    "mtime": "2026-11-02T09:13:40.062Z",
    "size": 499,
    "path": "../public/assets/figma/imgVector21.svg"
  },
  "/assets/figma/imgVector23.svg": {
    "type": "image/svg+xml",
    "etag": "\"1f1-pOmLsLV2TXVFLrhmW63z7IZTGD8\"",
    "mtime": "2026-11-02T09:13:40.062Z",
    "size": 497,
    "path": "../public/assets/figma/imgVector23.svg"
  },
  "/assets/figma/imgVector25.svg": {
    "type": "image/svg+xml",
    "etag": "\"1ab-sJBe7x8qymM1O0kFyGld82BxiOM\"",
    "mtime": "2026-11-02T09:13:40.062Z",
    "size": 427,
    "path": "../public/assets/figma/imgVector25.svg"
  },
  "/assets/figma/imgVector24.svg": {
    "type": "image/svg+xml",
    "etag": "\"320-xu5kO/mOUZoSuaSFxPfuOPtuiBc\"",
    "mtime": "2026-11-02T09:13:40.062Z",
    "size": 800,
    "path": "../public/assets/figma/imgVector24.svg"
  },
  "/assets/figma/imgVector28.svg": {
    "type": "image/svg+xml",
    "etag": "\"1df-6hGDi3T/d9cMckdc79uMWvd+js8\"",
    "mtime": "2026-11-02T09:13:40.063Z",
    "size": 479,
    "path": "../public/assets/figma/imgVector28.svg"
  },
  "/assets/figma/imgVector26.svg": {
    "type": "image/svg+xml",
    "etag": "\"1a5-fWIhVzNhEnUCIQxpPb4yoRDv8tY\"",
    "mtime": "2026-11-02T09:13:40.063Z",
    "size": 421,
    "path": "../public/assets/figma/imgVector26.svg"
  },
  "/assets/figma/imgVector27.svg": {
    "type": "image/svg+xml",
    "etag": "\"282-cl0pIbF0+WqFjx2/JK50/JFXPFA\"",
    "mtime": "2026-11-02T09:13:40.063Z",
    "size": 642,
    "path": "../public/assets/figma/imgVector27.svg"
  },
  "/assets/figma/imgVector29.svg": {
    "type": "image/svg+xml",
    "etag": "\"326-S2CePaWh452Pjx4GX8Es6Pq3xP8\"",
    "mtime": "2026-11-02T09:13:40.063Z",
    "size": 806,
    "path": "../public/assets/figma/imgVector29.svg"
  },
  "/assets/figma/imgVector30.svg": {
    "type": "image/svg+xml",
    "etag": "\"e4-IhQ/gMYdX+8+ELqnaVW1/M49fNg\"",
    "mtime": "2026-11-02T09:13:40.063Z",
    "size": 228,
    "path": "../public/assets/figma/imgVector30.svg"
  },
  "/assets/figma/imgVector3.svg": {
    "type": "image/svg+xml",
    "etag": "\"152-WqUR2xggl1u183Csem7YvEoOoLk\"",
    "mtime": "2026-11-02T09:13:40.063Z",
    "size": 338,
    "path": "../public/assets/figma/imgVector3.svg"
  },
  "/assets/figma/imgVector31.svg": {
    "type": "image/svg+xml",
    "etag": "\"3b7-PxJAX8oqTXD2bRt7ASS6+OEpoHU\"",
    "mtime": "2026-11-02T09:13:40.064Z",
    "size": 951,
    "path": "../public/assets/figma/imgVector31.svg"
  },
  "/assets/figma/imgVector32.svg": {
    "type": "image/svg+xml",
    "etag": "\"290-aZfgHuLYgkCEU6jN8YzB/h5EruU\"",
    "mtime": "2026-11-02T09:13:40.063Z",
    "size": 656,
    "path": "../public/assets/figma/imgVector32.svg"
  },
  "/assets/figma/imgVector33.svg": {
    "type": "image/svg+xml",
    "etag": "\"310-VuY/H/Y89xKiK4rfEKP+HcUVX5Y\"",
    "mtime": "2026-11-02T09:13:40.063Z",
    "size": 784,
    "path": "../public/assets/figma/imgVector33.svg"
  },
  "/assets/figma/imgVector34.svg": {
    "type": "image/svg+xml",
    "etag": "\"14a-E51+2jXK5QsmT34hvB8+6Nndmr8\"",
    "mtime": "2026-11-02T09:13:40.064Z",
    "size": 330,
    "path": "../public/assets/figma/imgVector34.svg"
  },
  "/assets/figma/imgVector35.svg": {
    "type": "image/svg+xml",
    "etag": "\"191-G64YThkEae0ykEfrbtRZE7ey+lI\"",
    "mtime": "2026-11-02T09:13:40.064Z",
    "size": 401,
    "path": "../public/assets/figma/imgVector35.svg"
  },
  "/assets/figma/imgVector36.svg": {
    "type": "image/svg+xml",
    "etag": "\"16c-YqSyB3e7cewBBjZ9P6/h8RpIBNg\"",
    "mtime": "2026-11-02T09:13:40.064Z",
    "size": 364,
    "path": "../public/assets/figma/imgVector36.svg"
  },
  "/assets/figma/imgVector37.svg": {
    "type": "image/svg+xml",
    "etag": "\"18f-cVvxAxzmaAxQhy4AcZ1NOsNT00I\"",
    "mtime": "2026-11-02T09:13:40.064Z",
    "size": 399,
    "path": "../public/assets/figma/imgVector37.svg"
  },
  "/assets/figma/imgVector38.svg": {
    "type": "image/svg+xml",
    "etag": "\"194-ttmHYD0zJlZTWvNUhemlRm2N0gs\"",
    "mtime": "2026-11-02T09:13:40.064Z",
    "size": 404,
    "path": "../public/assets/figma/imgVector38.svg"
  },
  "/assets/figma/imgVector39.svg": {
    "type": "image/svg+xml",
    "etag": "\"18b-0hv1lOhUH4eu5b5np+lJqeOKpZc\"",
    "mtime": "2026-11-02T09:13:40.064Z",
    "size": 395,
    "path": "../public/assets/figma/imgVector39.svg"
  },
  "/assets/figma/imgVector4.svg": {
    "type": "image/svg+xml",
    "etag": "\"6cd-45wqSAScMtn+EXQ6ixGQeFKCbzE\"",
    "mtime": "2026-11-02T09:13:40.064Z",
    "size": 1741,
    "path": "../public/assets/figma/imgVector4.svg"
  },
  "/assets/figma/imgVector41.svg": {
    "type": "image/svg+xml",
    "etag": "\"797-ClCqKm+KYGCTlHjswfwRg6dkcM8\"",
    "mtime": "2026-11-02T09:13:40.065Z",
    "size": 1943,
    "path": "../public/assets/figma/imgVector41.svg"
  },
  "/assets/figma/imgVector40.svg": {
    "type": "image/svg+xml",
    "etag": "\"46f-b10q7UL7uHBEq77qr4wfSwmRlTE\"",
    "mtime": "2026-11-02T09:13:40.064Z",
    "size": 1135,
    "path": "../public/assets/figma/imgVector40.svg"
  },
  "/assets/figma/imgVector42.svg": {
    "type": "image/svg+xml",
    "etag": "\"5b1-J60MWy1qZoNcVDtU6K42Cyciukk\"",
    "mtime": "2026-11-02T09:13:40.064Z",
    "size": 1457,
    "path": "../public/assets/figma/imgVector42.svg"
  },
  "/assets/figma/imgVector43.svg": {
    "type": "image/svg+xml",
    "etag": "\"6b3-tF/zGC3UoDxemiwqa6P9duP2/mk\"",
    "mtime": "2026-11-02T09:13:40.065Z",
    "size": 1715,
    "path": "../public/assets/figma/imgVector43.svg"
  },
  "/assets/figma/imgVector44.svg": {
    "type": "image/svg+xml",
    "etag": "\"31d-I6Y9nUMbFI9cONR2DapC2F6h5MM\"",
    "mtime": "2026-11-02T09:13:40.065Z",
    "size": 797,
    "path": "../public/assets/figma/imgVector44.svg"
  },
  "/assets/figma/imgVector6.svg": {
    "type": "image/svg+xml",
    "etag": "\"840-3dzUAfU09iBsn7rTFYKi8z7ix24\"",
    "mtime": "2026-11-02T09:13:40.065Z",
    "size": 2112,
    "path": "../public/assets/figma/imgVector6.svg"
  },
  "/assets/figma/imgVector7.svg": {
    "type": "image/svg+xml",
    "etag": "\"48f-BpB1U4GutBcQKfK9S/oe9mnZyks\"",
    "mtime": "2026-11-02T09:13:40.065Z",
    "size": 1167,
    "path": "../public/assets/figma/imgVector7.svg"
  },
  "/assets/figma/imgVector5.svg": {
    "type": "image/svg+xml",
    "etag": "\"e6f-SGfg8Nmkhhcoy2gcC4Vpe9zWgm4\"",
    "mtime": "2026-11-02T09:13:40.065Z",
    "size": 3695,
    "path": "../public/assets/figma/imgVector5.svg"
  },
  "/assets/figma/imgVector8.svg": {
    "type": "image/svg+xml",
    "etag": "\"1a5-3nf9Y/wYWjvYYurNGVAm5kl2G3c\"",
    "mtime": "2026-11-02T09:13:40.065Z",
    "size": 421,
    "path": "../public/assets/figma/imgVector8.svg"
  },
  "/assets/figma/imgVector9.svg": {
    "type": "image/svg+xml",
    "etag": "\"195-8OHLnNdSBGJSSClxmij05tlWb2M\"",
    "mtime": "2026-11-02T09:13:40.065Z",
    "size": 405,
    "path": "../public/assets/figma/imgVector9.svg"
  },
  "/assets/figma/imgYoutube.svg": {
    "type": "image/svg+xml",
    "etag": "\"12d5-Q76QycopDeVCE0b1D9YDO7wfa+M\"",
    "mtime": "2026-11-02T09:13:40.067Z",
    "size": 4821,
    "path": "../public/assets/figma/imgYoutube.svg"
  },
  "/assets/platform/aliexpress.svg": {
    "type": "image/svg+xml",
    "etag": "\"14db-xsWiJORzg/nFs5w49yVQ29SAZhk\"",
    "mtime": "2026-11-02T09:13:40.030Z",
    "size": 5339,
    "path": "../public/assets/platform/aliexpress.svg"
  },
  "/assets/platform/amazon.svg": {
    "type": "image/svg+xml",
    "etag": "\"a60-fMCRB+IY/zfApa0aKEJF5q55I80\"",
    "mtime": "2026-11-02T09:13:40.048Z",
    "size": 2656,
    "path": "../public/assets/platform/amazon.svg"
  },
  "/assets/platform/chatgpt.svg": {
    "type": "image/svg+xml",
    "etag": "\"df1-CJG4aC2sC4WKocczwthuhmbugt0\"",
    "mtime": "2026-11-02T09:13:40.048Z",
    "size": 3569,
    "path": "../public/assets/platform/chatgpt.svg"
  },
  "/assets/platform/binance.svg": {
    "type": "image/svg+xml",
    "etag": "\"31a-Qwhkx7Yfge3XvUFYHYU14jl7REM\"",
    "mtime": "2026-11-02T09:13:40.049Z",
    "size": 794,
    "path": "../public/assets/platform/binance.svg"
  },
  "/assets/platform/claude.svg": {
    "type": "image/svg+xml",
    "etag": "\"9d8-87kPwVWsXM+9RokEYf3KEej2MkM\"",
    "mtime": "2026-11-02T09:13:40.049Z",
    "size": 2520,
    "path": "../public/assets/platform/claude.svg"
  },
  "/assets/platform/discord.svg": {
    "type": "image/svg+xml",
    "etag": "\"7ec-LdFfAyAqzsxi8JYXuOMg51pzq+0\"",
    "mtime": "2026-11-02T09:13:40.049Z",
    "size": 2028,
    "path": "../public/assets/platform/discord.svg"
  },
  "/assets/platform/ebay.svg": {
    "type": "image/svg+xml",
    "etag": "\"816-9o0xmmfdsMH8LvGjbxC4NMqeSnU\"",
    "mtime": "2026-11-02T09:13:40.049Z",
    "size": 2070,
    "path": "../public/assets/platform/ebay.svg"
  },
  "/assets/platform/etsy.svg": {
    "type": "image/svg+xml",
    "etag": "\"48d-rywGKesitLbMICO5N7g6gH5F34k\"",
    "mtime": "2026-11-02T09:13:40.049Z",
    "size": 1165,
    "path": "../public/assets/platform/etsy.svg"
  },
  "/assets/platform/facebook.svg": {
    "type": "image/svg+xml",
    "etag": "\"1a3-kS7FiRadKI0pZpRmfI7L1dq4rh4\"",
    "mtime": "2026-11-02T09:13:40.049Z",
    "size": 419,
    "path": "../public/assets/platform/facebook.svg"
  },
  "/assets/platform/gemini.svg": {
    "type": "image/svg+xml",
    "etag": "\"2bc8-zwYfXQ47zepRGTfNaCfdE7X9YpU\"",
    "mtime": "2026-11-02T09:13:40.049Z",
    "size": 11208,
    "path": "../public/assets/platform/gemini.svg"
  },
  "/assets/platform/grok.svg": {
    "type": "image/svg+xml",
    "etag": "\"3fa-Pl1Daw/p4uNq2gaMDvaTkzFWRxg\"",
    "mtime": "2026-11-02T09:13:40.049Z",
    "size": 1018,
    "path": "../public/assets/platform/grok.svg"
  },
  "/assets/platform/instagram.svg": {
    "type": "image/svg+xml",
    "etag": "\"2271-FzTE5SVepOMuPeF2v2W1uXt0U9E\"",
    "mtime": "2026-11-02T09:13:40.050Z",
    "size": 8817,
    "path": "../public/assets/platform/instagram.svg"
  },
  "/assets/platform/linkedin.svg": {
    "type": "image/svg+xml",
    "etag": "\"6d5-32l3LWrA5vnpVWVJA3QYR1u/gtc\"",
    "mtime": "2026-11-02T09:13:40.050Z",
    "size": 1749,
    "path": "../public/assets/platform/linkedin.svg"
  },
  "/assets/platform/reddit.svg": {
    "type": "image/svg+xml",
    "etag": "\"1fbe-MDAzN0QrKmRcmQHEvp6GuB9TmgM\"",
    "mtime": "2026-11-02T09:13:40.050Z",
    "size": 8126,
    "path": "../public/assets/platform/reddit.svg"
  },
  "/assets/platform/shopify.svg": {
    "type": "image/svg+xml",
    "etag": "\"859-prnEqjAhd2kgTe0GPqL0fjdqhGg\"",
    "mtime": "2026-11-02T09:13:40.050Z",
    "size": 2137,
    "path": "../public/assets/platform/shopify.svg"
  },
  "/assets/platform/youtube.svg": {
    "type": "image/svg+xml",
    "etag": "\"2b0-AcSUEpl/ZVoEAhZhIbsVRcxEBFQ\"",
    "mtime": "2026-11-02T09:13:40.050Z",
    "size": 688,
    "path": "../public/assets/platform/youtube.svg"
  },
  "/assets/resources/datacenter.jpg": {
    "type": "image/jpeg",
    "etag": "\"19b18-SId4fmhHiYZlTt2AWsRVHHJTcO4\"",
    "mtime": "2026-11-04T14:02:25.259Z",
    "size": 105240,
    "path": "../public/assets/resources/datacenter.jpg"
  },
  "/assets/platform/perplexity.svg": {
    "type": "image/svg+xml",
    "etag": "\"29e-omgVGgAAbKm/AdDXQTUDpV2COEg\"",
    "mtime": "2026-11-02T09:13:40.050Z",
    "size": 670,
    "path": "../public/assets/platform/perplexity.svg"
  },
  "/assets/resources/mobile.jpg": {
    "type": "image/jpeg",
    "etag": "\"18c52-sx2BuA2/24cNqaaPzaRkqk2EzG0\"",
    "mtime": "2026-11-04T14:02:25.259Z",
    "size": 101458,
    "path": "../public/assets/resources/mobile.jpg"
  },
  "/assets/platform/tiktok.svg": {
    "type": "image/svg+xml",
    "etag": "\"b19-IIPZZtJPq/DamPu0rc0LK5X+BBc\"",
    "mtime": "2026-11-02T09:13:40.051Z",
    "size": 2841,
    "path": "../public/assets/platform/tiktok.svg"
  },
  "/assets/resources/rotating.jpg": {
    "type": "image/jpeg",
    "etag": "\"23a77-6+tjCRmKJ6dOAQkbWlhy1vo2oUQ\"",
    "mtime": "2026-11-04T14:02:25.259Z",
    "size": 146039,
    "path": "../public/assets/resources/rotating.jpg"
  },
  "/assets/resources/static.jpg": {
    "type": "image/jpeg",
    "etag": "\"197c7-ZAM0XkegwoNnhTgB7NByVWrHIrU\"",
    "mtime": "2026-11-04T14:02:25.259Z",
    "size": 104391,
    "path": "../public/assets/resources/static.jpg"
  },
  "/landing/blog/ai-candidate-evaluation-research-insights.png": {
    "type": "image/png",
    "etag": "\"18a91-fF79nwCKyMESOh8f47g0KGzfOfk\"",
    "mtime": "2026-11-02T09:13:40.069Z",
    "size": 101009,
    "path": "../public/landing/blog/ai-candidate-evaluation-research-insights.png"
  },
  "/landing/blog/ai-recruiting-custom-data-warm-networks.png": {
    "type": "image/png",
    "etag": "\"3d5bd-UR3gviyup6CmWU+GdkmaAv3nO0I\"",
    "mtime": "2026-11-02T09:13:40.075Z",
    "size": 251325,
    "path": "../public/landing/blog/ai-recruiting-custom-data-warm-networks.png"
  },
  "/landing/blog/ai-recruiting-tools-sourcing-hiring.png": {
    "type": "image/png",
    "etag": "\"47822-5xxxdYItHWBvaiowoFABVeHZYNo\"",
    "mtime": "2026-11-02T09:13:40.075Z",
    "size": 292898,
    "path": "../public/landing/blog/ai-recruiting-tools-sourcing-hiring.png"
  },
  "/landing/blog/ai-recruiting-kpis.png": {
    "type": "image/png",
    "etag": "\"4c817-nsDkeQ2RFcfk/yGU7ojq4fsFLRQ\"",
    "mtime": "2026-11-02T09:13:40.075Z",
    "size": 313367,
    "path": "../public/landing/blog/ai-recruiting-kpis.png"
  },
  "/landing/blog/ai-sourcing-for-technical-recruiting.png": {
    "type": "image/png",
    "etag": "\"46056-8KZ3vddTF4W/CREmQp1MaLP2XCQ\"",
    "mtime": "2026-11-02T09:13:40.078Z",
    "size": 286806,
    "path": "../public/landing/blog/ai-sourcing-for-technical-recruiting.png"
  },
  "/landing/blog/ai-sourcing-hiring-tools-enterprise.png": {
    "type": "image/png",
    "etag": "\"19045-4BBqaSYTMdYYAVZ3yKW7b1ZFloo\"",
    "mtime": "2026-11-02T09:13:40.077Z",
    "size": 102469,
    "path": "../public/landing/blog/ai-sourcing-hiring-tools-enterprise.png"
  },
  "/landing/blog/ai-sourcing-platforms-best-candidates.png": {
    "type": "image/png",
    "etag": "\"193fb-5B1Qd8hiuZk4OqkA2hzq4siiVSg\"",
    "mtime": "2026-11-02T09:13:40.077Z",
    "size": 103419,
    "path": "../public/landing/blog/ai-sourcing-platforms-best-candidates.png"
  },
  "/landing/blog/ai-sourcing-tools-network-search-2025.png": {
    "type": "image/png",
    "etag": "\"17375-oCU6TQRB+ZpZzmtlmmbDxH29610\"",
    "mtime": "2026-11-02T09:13:40.083Z",
    "size": 95093,
    "path": "../public/landing/blog/ai-sourcing-tools-network-search-2025.png"
  },
  "/landing/blog/ai-tools-researcher-github-discovery.png": {
    "type": "image/png",
    "etag": "\"7893-yk5FXXFVH5n4R/LPP+c3fN4Q3nM\"",
    "mtime": "2026-11-02T09:13:40.080Z",
    "size": 30867,
    "path": "../public/landing/blog/ai-tools-researcher-github-discovery.png"
  },
  "/landing/blog/ai-variables-and-individual-sequence-edits.png": {
    "type": "image/png",
    "etag": "\"61e9b-VZrvr4KjpXzTvTV885uDZeHwRuk\"",
    "mtime": "2026-11-02T09:13:40.084Z",
    "size": 401051,
    "path": "../public/landing/blog/ai-variables-and-individual-sequence-edits.png"
  },
  "/landing/blog/best-ai-sourcing-tools-2026.png": {
    "type": "image/png",
    "etag": "\"60c60-p1GtseGcKKbWqA725YhdJy9Abb8\"",
    "mtime": "2026-11-02T09:13:40.084Z",
    "size": 396384,
    "path": "../public/landing/blog/best-ai-sourcing-tools-2026.png"
  },
  "/landing/blog/ai-people-search-benchmark.png": {
    "type": "image/png",
    "etag": "\"18ea9b-705k0IBQ+wKeh3qoJkREXNKMeAQ\"",
    "mtime": "2026-11-02T09:13:40.077Z",
    "size": 1632923,
    "path": "../public/landing/blog/ai-people-search-benchmark.png"
  },
  "/landing/blog/building-unified-talent-graph.png": {
    "type": "image/png",
    "etag": "\"40b1c-pssWTFNUK81iD1wTpuPzwOK58oE\"",
    "mtime": "2026-11-02T09:13:40.085Z",
    "size": 264988,
    "path": "../public/landing/blog/building-unified-talent-graph.png"
  },
  "/landing/blog/best-talent-intelligence-platforms-2026.png": {
    "type": "image/png",
    "etag": "\"561ed-RU8UPRSmKkn4wFieAM1S/BI/VHo\"",
    "mtime": "2026-11-02T09:13:40.085Z",
    "size": 352749,
    "path": "../public/landing/blog/best-talent-intelligence-platforms-2026.png"
  },
  "/landing/blog/definitive-ai-network-search-guide.jpeg": {
    "type": "image/jpeg",
    "etag": "\"3d973-n7GbFQpv5aq+wcqc/JOUkwcQ0Pc\"",
    "mtime": "2026-11-02T09:13:40.103Z",
    "size": 252275,
    "path": "../public/landing/blog/definitive-ai-network-search-guide.jpeg"
  },
  "/landing/blog/introducing-detailed-company-info-in-sourcing.png": {
    "type": "image/png",
    "etag": "\"23115-BP61pEU1HtxdAD/oX+l8Z10MbFA\"",
    "mtime": "2026-11-02T09:13:40.089Z",
    "size": 143637,
    "path": "../public/landing/blog/introducing-detailed-company-info-in-sourcing.png"
  },
  "/landing/blog/enterprise-hiring-ai-recruiting-transformation.png": {
    "type": "image/png",
    "etag": "\"19182-0eL07v4pIQ5nSNEJil0Vvuz2+J4\"",
    "mtime": "2026-11-02T09:13:40.088Z",
    "size": 102786,
    "path": "../public/landing/blog/enterprise-hiring-ai-recruiting-transformation.png"
  },
  "/landing/blog/future-of-ai-sourcing-tools-2026.png": {
    "type": "image/png",
    "etag": "\"6291c-ugh8BcJMcJLq0NKEDHbloBEVOm0\"",
    "mtime": "2026-11-02T09:13:40.088Z",
    "size": 403740,
    "path": "../public/landing/blog/future-of-ai-sourcing-tools-2026.png"
  },
  "/landing/blog/generative-ai-sourcing-vs-traditional-recruiting-tools.png": {
    "type": "image/png",
    "etag": "\"52091-xnXkj+4u9il37u9K0Z11w3KcAtk\"",
    "mtime": "2026-11-02T09:13:40.092Z",
    "size": 336017,
    "path": "../public/landing/blog/generative-ai-sourcing-vs-traditional-recruiting-tools.png"
  },
  "/landing/blog/introducing-wrangle-bookings-and-the-interview-platform.png": {
    "type": "image/png",
    "etag": "\"3caf1-yQE0YCRw3rYqlCKKaMR5dlH0FRo\"",
    "mtime": "2026-11-02T09:13:40.093Z",
    "size": 248561,
    "path": "../public/landing/blog/introducing-wrangle-bookings-and-the-interview-platform.png"
  },
  "/landing/blog/introducing-interview-note-templates-and-ai-answers.png": {
    "type": "image/png",
    "etag": "\"70051-JmU9fHGHTjnFIucUXbX+aIqtC8U\"",
    "mtime": "2026-11-02T09:13:40.093Z",
    "size": 458833,
    "path": "../public/landing/blog/introducing-interview-note-templates-and-ai-answers.png"
  },
  "/landing/blog/introducing-search-by-calibration-profile.png": {
    "type": "image/png",
    "etag": "\"50500-rPjzU9CEyGJQ8/VVC84FDDJ+7ns\"",
    "mtime": "2026-11-02T09:13:40.094Z",
    "size": 328960,
    "path": "../public/landing/blog/introducing-search-by-calibration-profile.png"
  },
  "/landing/blog/placeholder.png": {
    "type": "image/png",
    "etag": "\"a52-sQ5cNA3+jdMm26xOBLuNrxeS88I\"",
    "mtime": "2026-11-02T09:13:40.109Z",
    "size": 2642,
    "path": "../public/landing/blog/placeholder.png"
  },
  "/landing/blog/introducing-wrangle-for-your-slack-workspace.png": {
    "type": "image/png",
    "etag": "\"24c8c-FnbF3DT/9WcxDlrjvXvtQtFOv1c\"",
    "mtime": "2026-11-02T09:13:40.103Z",
    "size": 150668,
    "path": "../public/landing/blog/introducing-wrangle-for-your-slack-workspace.png"
  },
  "/landing/blog/talent-search-tools-juicebox-alternatives.png": {
    "type": "image/png",
    "etag": "\"17a21-Q5Z/YndYQnLLJz4lj4s6APTTUEs\"",
    "mtime": "2026-11-02T09:13:40.104Z",
    "size": 96801,
    "path": "../public/landing/blog/talent-search-tools-juicebox-alternatives.png"
  },
  "/landing/blog/network-intelligence-talent-graph.png": {
    "type": "image/png",
    "etag": "\"47472-y/ckg80atDvzR2Ks1VXJfujpiK4\"",
    "mtime": "2026-11-02T09:13:40.103Z",
    "size": 291954,
    "path": "../public/landing/blog/network-intelligence-talent-graph.png"
  },
  "/landing/blog/best-candidate-outreach-tools-2026.png": {
    "type": "image/png",
    "etag": "\"143992-b3z776WaZxenltAOjCyXcPG0kTE\"",
    "mtime": "2026-11-02T09:13:40.086Z",
    "size": 1325458,
    "path": "../public/landing/blog/best-candidate-outreach-tools-2026.png"
  },
  "/landing/blog/new-role-of-recruiters-ai-world.png": {
    "type": "image/png",
    "etag": "\"4490f-E6NEAdChlYA4zAwN2BogqOdeBt4\"",
    "mtime": "2026-11-02T09:13:40.103Z",
    "size": 280847,
    "path": "../public/landing/blog/new-role-of-recruiters-ai-world.png"
  },
  "/landing/blog/wrangle-vs-fetcher.png": {
    "type": "image/png",
    "etag": "\"57b97-OMSVHPo76HQFbxstG40+bshv+is\"",
    "mtime": "2026-11-02T09:13:40.109Z",
    "size": 359319,
    "path": "../public/landing/blog/wrangle-vs-fetcher.png"
  },
  "/landing/blog/wrangle-vs-findem.png": {
    "type": "image/png",
    "etag": "\"4bcc5-4ciD/v9FNB2HbiA+53romWy5oEE\"",
    "mtime": "2026-11-02T09:13:40.107Z",
    "size": 310469,
    "path": "../public/landing/blog/wrangle-vs-findem.png"
  },
  "/landing/blog/what-is-ai-sourcing.png": {
    "type": "image/png",
    "etag": "\"7298f-w+ivaOVi+5YAhUSqKUlk71Pm9ys\"",
    "mtime": "2026-11-02T09:13:40.105Z",
    "size": 469391,
    "path": "../public/landing/blog/what-is-ai-sourcing.png"
  },
  "/landing/blog/wrangle-vs-gem.png": {
    "type": "image/png",
    "etag": "\"5613c-IyVNCUjArw8Uz2RbCVE+w6zOf64\"",
    "mtime": "2026-11-02T09:13:40.110Z",
    "size": 352572,
    "path": "../public/landing/blog/wrangle-vs-gem.png"
  },
  "/landing/blog/introducing-market-mapping.png": {
    "type": "image/png",
    "etag": "\"e339b-OjyVruFKiPWFNQr3aEaBign6dIg\"",
    "mtime": "2026-11-02T09:13:40.094Z",
    "size": 930715,
    "path": "../public/landing/blog/introducing-market-mapping.png"
  },
  "/landing/blog/wrangle-vs-hireez.png": {
    "type": "image/png",
    "etag": "\"59e37-KsqkB0WIIN1rmZsLn72yLA14f0M\"",
    "mtime": "2026-11-02T09:13:40.109Z",
    "size": 368183,
    "path": "../public/landing/blog/wrangle-vs-hireez.png"
  },
  "/landing/blog/wrangle-vs-juicebox.png": {
    "type": "image/png",
    "etag": "\"4e900-AFXTHYn62OAQJFDkCwf42Swrn04\"",
    "mtime": "2026-11-02T09:13:40.110Z",
    "size": 321792,
    "path": "../public/landing/blog/wrangle-vs-juicebox.png"
  },
  "/_nuxt/builds/latest.json": {
    "type": "application/json",
    "etag": "\"47-YgwD0uR6BCNFWsBcF+afmLDtvXo\"",
    "mtime": "2026-11-02T09:13:39.955Z",
    "size": 71,
    "path": "../public/_nuxt/builds/latest.json"
  },
  "/assets/figma/device-details/chrome-1.svg": {
    "type": "image/svg+xml",
    "etag": "\"1f8-Mlz2Lx++8UZFjDLUPdH+3NvBoXo\"",
    "mtime": "2026-11-02T09:13:40.032Z",
    "size": 504,
    "path": "../public/assets/figma/device-details/chrome-1.svg"
  },
  "/landing/blog/wrangle-vs-seekout.png": {
    "type": "image/png",
    "etag": "\"4d6ab-+JHPianbldfmIoCGuoPp8v4G1zw\"",
    "mtime": "2026-11-02T09:13:40.110Z",
    "size": 317099,
    "path": "../public/landing/blog/wrangle-vs-seekout.png"
  },
  "/landing/blog/wrangle-vs-linkedin-recruiter-nls.png": {
    "type": "image/png",
    "etag": "\"1766bc-y4NiT6EcMlhBMjEWyhwLLh1A6DU\"",
    "mtime": "2026-11-02T09:13:40.117Z",
    "size": 1533628,
    "path": "../public/landing/blog/wrangle-vs-linkedin-recruiter-nls.png"
  },
  "/assets/figma/device-details/chrome-2.svg": {
    "type": "image/svg+xml",
    "etag": "\"1f1-TMnAOztEgJ4c2jB3QufxydRNXD0\"",
    "mtime": "2026-11-02T09:13:40.065Z",
    "size": 497,
    "path": "../public/assets/figma/device-details/chrome-2.svg"
  },
  "/assets/figma/device-details/chrome-3.svg": {
    "type": "image/svg+xml",
    "etag": "\"1ee-lQPS9Xw+xxOQJFw/j7ZMdxdrkTU\"",
    "mtime": "2026-11-02T09:13:40.065Z",
    "size": 494,
    "path": "../public/assets/figma/device-details/chrome-3.svg"
  },
  "/assets/figma/device-details/chrome-4.svg": {
    "type": "image/svg+xml",
    "etag": "\"224-VGI9bEaz43odtKlY7xGTmL3XCBE\"",
    "mtime": "2026-11-02T09:13:40.067Z",
    "size": 548,
    "path": "../public/assets/figma/device-details/chrome-4.svg"
  },
  "/assets/figma/device-details/chrome-5.svg": {
    "type": "image/svg+xml",
    "etag": "\"22d-dpSVDJg2R5ZNmFn0qKirjvNrtlY\"",
    "mtime": "2026-11-02T09:13:40.067Z",
    "size": 557,
    "path": "../public/assets/figma/device-details/chrome-5.svg"
  },
  "/assets/figma/device-details/location.svg": {
    "type": "image/svg+xml",
    "etag": "\"60a-u4bABYi1n6+C+j+Vpo491RP2hIE\"",
    "mtime": "2026-11-02T09:13:40.067Z",
    "size": 1546,
    "path": "../public/assets/figma/device-details/location.svg"
  },
  "/assets/figma/device-details/time.svg": {
    "type": "image/svg+xml",
    "etag": "\"5db-PVAq8XwpheZo9pJNtQ3e8FZOGGA\"",
    "mtime": "2026-11-02T09:13:40.067Z",
    "size": 1499,
    "path": "../public/assets/figma/device-details/time.svg"
  },
  "/assets/icons/flags/AD.svg": {
    "type": "image/svg+xml",
    "etag": "\"604-8Y1MPEpxs3dghUr2KrV7OYInTWA\"",
    "mtime": "2026-11-02T09:13:40.120Z",
    "size": 1540,
    "path": "../public/assets/icons/flags/AD.svg"
  },
  "/assets/icons/flags/AE.svg": {
    "type": "image/svg+xml",
    "etag": "\"47f-POCd52DfGE2REIVpSFgKq8MJ6pc\"",
    "mtime": "2026-11-02T09:13:40.069Z",
    "size": 1151,
    "path": "../public/assets/icons/flags/AE.svg"
  },
  "/assets/icons/flags/AF.svg": {
    "type": "image/svg+xml",
    "etag": "\"59f-3D01Fu473JSDHRcMXp36RdgMdwc\"",
    "mtime": "2026-11-02T09:13:40.113Z",
    "size": 1439,
    "path": "../public/assets/icons/flags/AF.svg"
  },
  "/assets/icons/flags/AG.svg": {
    "type": "image/svg+xml",
    "etag": "\"559-8OabDM4s5cuh6AdvPQyu7erMTgw\"",
    "mtime": "2026-11-02T09:13:40.119Z",
    "size": 1369,
    "path": "../public/assets/icons/flags/AG.svg"
  },
  "/assets/icons/flags/AI.svg": {
    "type": "image/svg+xml",
    "etag": "\"14b6-LYMqLwQImcHQ2cYUfyGGQV/l1es\"",
    "mtime": "2026-11-02T09:13:40.113Z",
    "size": 5302,
    "path": "../public/assets/icons/flags/AI.svg"
  },
  "/assets/icons/flags/AL.svg": {
    "type": "image/svg+xml",
    "etag": "\"44a-z7/zboCUsP+KSK3Xiz/EKA8lEm0\"",
    "mtime": "2026-11-02T09:13:40.111Z",
    "size": 1098,
    "path": "../public/assets/icons/flags/AL.svg"
  },
  "/assets/icons/flags/AM.svg": {
    "type": "image/svg+xml",
    "etag": "\"431-NpXK09p6bVs3gcad+FrVCEbT0q0\"",
    "mtime": "2026-11-02T09:13:40.113Z",
    "size": 1073,
    "path": "../public/assets/icons/flags/AM.svg"
  },
  "/assets/icons/flags/AN.svg": {
    "type": "image/svg+xml",
    "etag": "\"4ae-5Jrpk5BJXxi2QB/eWulMsdMNW+o\"",
    "mtime": "2026-11-02T09:13:40.113Z",
    "size": 1198,
    "path": "../public/assets/icons/flags/AN.svg"
  },
  "/assets/icons/flags/AO.svg": {
    "type": "image/svg+xml",
    "etag": "\"599-wkToinCHK10QrN3QeE7q65HcV4s\"",
    "mtime": "2026-11-02T09:13:40.113Z",
    "size": 1433,
    "path": "../public/assets/icons/flags/AO.svg"
  },
  "/assets/icons/flags/AR.svg": {
    "type": "image/svg+xml",
    "etag": "\"47c-Vpp2awVS6+6bY4+YIrmW5yQGwJs\"",
    "mtime": "2026-11-02T09:13:40.114Z",
    "size": 1148,
    "path": "../public/assets/icons/flags/AR.svg"
  },
  "/assets/icons/flags/AS.svg": {
    "type": "image/svg+xml",
    "etag": "\"6416-ToTZHM8kjj8lnVRyTtq8/KokkLQ\"",
    "mtime": "2026-11-02T09:13:40.114Z",
    "size": 25622,
    "path": "../public/assets/icons/flags/AS.svg"
  },
  "/assets/icons/flags/AT.svg": {
    "type": "image/svg+xml",
    "etag": "\"3eb-bC+rbhdUT7djObuWjighD8gq79I\"",
    "mtime": "2026-11-02T09:13:40.114Z",
    "size": 1003,
    "path": "../public/assets/icons/flags/AT.svg"
  },
  "/assets/icons/flags/AU.svg": {
    "type": "image/svg+xml",
    "etag": "\"584-O+a5scfTUS1Ik6e9V1wffvVbtkI\"",
    "mtime": "2026-11-02T09:13:40.114Z",
    "size": 1412,
    "path": "../public/assets/icons/flags/AU.svg"
  },
  "/assets/icons/flags/AW.svg": {
    "type": "image/svg+xml",
    "etag": "\"76f-kZR4pBOIkNQzi5tidMvz5S/ISXg\"",
    "mtime": "2026-11-02T09:13:40.115Z",
    "size": 1903,
    "path": "../public/assets/icons/flags/AW.svg"
  },
  "/assets/icons/flags/AX.svg": {
    "type": "image/svg+xml",
    "etag": "\"3b1-BBWihz//SygZJEK2TGoWS/wxueU\"",
    "mtime": "2026-11-02T09:13:40.114Z",
    "size": 945,
    "path": "../public/assets/icons/flags/AX.svg"
  },
  "/assets/icons/flags/AZ.svg": {
    "type": "image/svg+xml",
    "etag": "\"570-mHJm1caT6nCi5+2KeSI/nC9jz90\"",
    "mtime": "2026-11-02T09:13:40.115Z",
    "size": 1392,
    "path": "../public/assets/icons/flags/AZ.svg"
  },
  "/assets/icons/flags/BA.svg": {
    "type": "image/svg+xml",
    "etag": "\"48c-m1L9mmSPFS1+sMh/ulpGuG9Ecy0\"",
    "mtime": "2026-11-02T09:13:40.115Z",
    "size": 1164,
    "path": "../public/assets/icons/flags/BA.svg"
  },
  "/assets/icons/flags/BB.svg": {
    "type": "image/svg+xml",
    "etag": "\"4e4-goUIunJq1/SmKE41JxXrLXjs48g\"",
    "mtime": "2026-11-02T09:13:40.115Z",
    "size": 1252,
    "path": "../public/assets/icons/flags/BB.svg"
  },
  "/assets/icons/flags/AQ.svg": {
    "type": "image/svg+xml",
    "etag": "\"1b911e-C0YoHo8dujj0cyuNaFSxOQ3Hbs0\"",
    "mtime": "2026-11-02T09:13:40.117Z",
    "size": 1806622,
    "path": "../public/assets/icons/flags/AQ.svg"
  },
  "/assets/icons/flags/BD.svg": {
    "type": "image/svg+xml",
    "etag": "\"41c-uer3UJj5B3l0ZEzJlIOtUH/Vdw0\"",
    "mtime": "2026-11-02T09:13:40.115Z",
    "size": 1052,
    "path": "../public/assets/icons/flags/BD.svg"
  },
  "/assets/icons/flags/BE.svg": {
    "type": "image/svg+xml",
    "etag": "\"42f-Kf5Qu9pMeRYquVjH7hm/ZG0Lsqg\"",
    "mtime": "2026-11-02T09:13:40.115Z",
    "size": 1071,
    "path": "../public/assets/icons/flags/BE.svg"
  },
  "/assets/icons/flags/BG.svg": {
    "type": "image/svg+xml",
    "etag": "\"42f-3XBqoz6sSXjlKRDNe5oYtTkAago\"",
    "mtime": "2026-11-02T09:13:40.119Z",
    "size": 1071,
    "path": "../public/assets/icons/flags/BG.svg"
  },
  "/assets/icons/flags/BH.svg": {
    "type": "image/svg+xml",
    "etag": "\"446-569jLXQwdW6yoQEbVro31SJoJ/w\"",
    "mtime": "2026-11-02T09:13:40.120Z",
    "size": 1094,
    "path": "../public/assets/icons/flags/BH.svg"
  },
  "/assets/icons/flags/BF.svg": {
    "type": "image/svg+xml",
    "etag": "\"49e-nL5w/fdMGAfBxmfd8yxdpLbTf1k\"",
    "mtime": "2026-11-02T09:13:40.115Z",
    "size": 1182,
    "path": "../public/assets/icons/flags/BF.svg"
  },
  "/assets/icons/flags/BI.svg": {
    "type": "image/svg+xml",
    "etag": "\"612-/d0ffRgAsY4gOIfvrt8cS46Twog\"",
    "mtime": "2026-11-02T09:13:40.116Z",
    "size": 1554,
    "path": "../public/assets/icons/flags/BI.svg"
  },
  "/assets/icons/flags/BJ.svg": {
    "type": "image/svg+xml",
    "etag": "\"42f-GivChiPCR1vtWywPsZv3GuCxzDU\"",
    "mtime": "2026-11-02T09:13:40.116Z",
    "size": 1071,
    "path": "../public/assets/icons/flags/BJ.svg"
  },
  "/assets/icons/flags/BM.svg": {
    "type": "image/svg+xml",
    "etag": "\"e250-PT6FuXg2iDowZDBVvjG/ECpD8A4\"",
    "mtime": "2026-11-02T09:13:40.117Z",
    "size": 57936,
    "path": "../public/assets/icons/flags/BM.svg"
  },
  "/assets/icons/flags/BN.svg": {
    "type": "image/svg+xml",
    "etag": "\"4e4-RNelbfr3VHx+RKQdKOoJGzXMB28\"",
    "mtime": "2026-11-02T09:13:40.119Z",
    "size": 1252,
    "path": "../public/assets/icons/flags/BN.svg"
  },
  "/assets/icons/flags/BL.svg": {
    "type": "image/svg+xml",
    "etag": "\"287b0-55R1EACjtfI2gdr7+wdg6yAB4mQ\"",
    "mtime": "2026-11-02T09:13:40.117Z",
    "size": 165808,
    "path": "../public/assets/icons/flags/BL.svg"
  },
  "/assets/icons/flags/BO.svg": {
    "type": "image/svg+xml",
    "etag": "\"431-63M+dWvmrRAZpl2yNlJBUMTiee8\"",
    "mtime": "2026-11-02T09:13:40.119Z",
    "size": 1073,
    "path": "../public/assets/icons/flags/BO.svg"
  },
  "/assets/icons/flags/BR.svg": {
    "type": "image/svg+xml",
    "etag": "\"518-V7wOIQHon1DwnpAecQOWNDrBxCI\"",
    "mtime": "2026-11-02T09:13:40.121Z",
    "size": 1304,
    "path": "../public/assets/icons/flags/BR.svg"
  },
  "/assets/icons/flags/BQ.svg": {
    "type": "image/svg+xml",
    "etag": "\"54b-RtaUQ63TWpPf4vW29QmWL9TSIGY\"",
    "mtime": "2026-11-02T09:13:40.119Z",
    "size": 1355,
    "path": "../public/assets/icons/flags/BQ.svg"
  },
  "/assets/icons/flags/BS.svg": {
    "type": "image/svg+xml",
    "etag": "\"435-dYaXDY6h9G5Wnk/TIf1JObfStpg\"",
    "mtime": "2026-11-02T09:13:40.120Z",
    "size": 1077,
    "path": "../public/assets/icons/flags/BS.svg"
  },
  "/assets/icons/flags/BT.svg": {
    "type": "image/svg+xml",
    "etag": "\"49f-vucZSBAfpO+TEfD8tXWr093iToM\"",
    "mtime": "2026-11-02T09:13:40.120Z",
    "size": 1183,
    "path": "../public/assets/icons/flags/BT.svg"
  },
  "/assets/icons/flags/BV.svg": {
    "type": "image/svg+xml",
    "etag": "\"44e-YkSLDYAW26S5UxewQISzYxxxy5k\"",
    "mtime": "2026-11-02T09:13:40.122Z",
    "size": 1102,
    "path": "../public/assets/icons/flags/BV.svg"
  },
  "/assets/icons/flags/BW.svg": {
    "type": "image/svg+xml",
    "etag": "\"47b-DBA+dvsTCho3l9gNKvLzKe2AbxI\"",
    "mtime": "2026-11-02T09:13:40.122Z",
    "size": 1147,
    "path": "../public/assets/icons/flags/BW.svg"
  },
  "/assets/icons/flags/BY.svg": {
    "type": "image/svg+xml",
    "etag": "\"52c-QFlPPBh1nVHzkw7+F7dMx3Lzvro\"",
    "mtime": "2026-11-02T09:13:40.122Z",
    "size": 1324,
    "path": "../public/assets/icons/flags/BY.svg"
  },
  "/assets/icons/flags/BZ.svg": {
    "type": "image/svg+xml",
    "etag": "\"728-EO0P4y9YxYbHuyf7U9x+1v3pOo0\"",
    "mtime": "2026-11-02T09:13:40.125Z",
    "size": 1832,
    "path": "../public/assets/icons/flags/BZ.svg"
  },
  "/assets/icons/flags/CA.svg": {
    "type": "image/svg+xml",
    "etag": "\"42f-BTuItnr755eosvQgwO2AxOY2bG8\"",
    "mtime": "2026-11-02T09:13:40.124Z",
    "size": 1071,
    "path": "../public/assets/icons/flags/CA.svg"
  },
  "/assets/icons/flags/CD.svg": {
    "type": "image/svg+xml",
    "etag": "\"550-0QFYbaWCcLkVq12Qsi1z+RsvyJg\"",
    "mtime": "2026-11-02T09:13:40.122Z",
    "size": 1360,
    "path": "../public/assets/icons/flags/CD.svg"
  },
  "/assets/icons/flags/CC.svg": {
    "type": "image/svg+xml",
    "etag": "\"1c3f-vv2VRxaumtrxFaaRrgM9LHo1GIY\"",
    "mtime": "2026-11-02T09:13:40.124Z",
    "size": 7231,
    "path": "../public/assets/icons/flags/CC.svg"
  },
  "/assets/icons/flags/CF.svg": {
    "type": "image/svg+xml",
    "etag": "\"59e-cVzx/PhZEfz2AcaGEHh+BJ2al20\"",
    "mtime": "2026-11-02T09:13:40.125Z",
    "size": 1438,
    "path": "../public/assets/icons/flags/CF.svg"
  },
  "/assets/icons/flags/CG.svg": {
    "type": "image/svg+xml",
    "etag": "\"43a-JHAxIXecjVNVMVrkqPkR6clSz40\"",
    "mtime": "2026-11-02T09:13:40.125Z",
    "size": 1082,
    "path": "../public/assets/icons/flags/CG.svg"
  },
  "/assets/icons/flags/CH.svg": {
    "type": "image/svg+xml",
    "etag": "\"3ed-ZLkqYA51WJq9Xq9XUnxAAsRS1zw\"",
    "mtime": "2026-11-02T09:13:40.126Z",
    "size": 1005,
    "path": "../public/assets/icons/flags/CH.svg"
  },
  "/assets/icons/flags/CK.svg": {
    "type": "image/svg+xml",
    "etag": "\"ec7-De9BFvruhlaFGD17tXauBUIcftA\"",
    "mtime": "2026-11-02T09:13:40.127Z",
    "size": 3783,
    "path": "../public/assets/icons/flags/CK.svg"
  },
  "/assets/icons/flags/CI.svg": {
    "type": "image/svg+xml",
    "etag": "\"42f-jW1GSnNswj+6mBGIf/IysQEemlI\"",
    "mtime": "2026-11-02T09:13:40.125Z",
    "size": 1071,
    "path": "../public/assets/icons/flags/CI.svg"
  },
  "/assets/icons/flags/CL.svg": {
    "type": "image/svg+xml",
    "etag": "\"4f2-dgk9VkXTmijyoewxbpTgRkI3mPA\"",
    "mtime": "2026-11-02T09:13:40.126Z",
    "size": 1266,
    "path": "../public/assets/icons/flags/CL.svg"
  },
  "/assets/icons/flags/CN.svg": {
    "type": "image/svg+xml",
    "etag": "\"48d-FxfiEwGQ+3LkjYZjoSe8rFobPJE\"",
    "mtime": "2026-11-02T09:13:40.125Z",
    "size": 1165,
    "path": "../public/assets/icons/flags/CN.svg"
  },
  "/assets/icons/flags/CM.svg": {
    "type": "image/svg+xml",
    "etag": "\"4fb-WWJ2LXzwFgnC2QdaaTexFQvl/mk\"",
    "mtime": "2026-11-02T09:13:40.125Z",
    "size": 1275,
    "path": "../public/assets/icons/flags/CM.svg"
  },
  "/assets/icons/flags/CO.svg": {
    "type": "image/svg+xml",
    "etag": "\"431-ZakiRcHwSkXX/cgotICVI1hPLV8\"",
    "mtime": "2026-11-02T09:13:40.126Z",
    "size": 1073,
    "path": "../public/assets/icons/flags/CO.svg"
  },
  "/assets/icons/flags/CR.svg": {
    "type": "image/svg+xml",
    "etag": "\"480-3zcOmqmwZ1/WXGNKmaFoQ7hxtv0\"",
    "mtime": "2026-11-02T09:13:40.126Z",
    "size": 1152,
    "path": "../public/assets/icons/flags/CR.svg"
  },
  "/assets/icons/flags/CU.svg": {
    "type": "image/svg+xml",
    "etag": "\"508-G+MU2YPUFEmu1oM1U/vo8BZWxE0\"",
    "mtime": "2026-11-02T09:13:40.126Z",
    "size": 1288,
    "path": "../public/assets/icons/flags/CU.svg"
  },
  "/assets/icons/flags/CW.svg": {
    "type": "image/svg+xml",
    "etag": "\"512-p4InAUDw4CXZ/gSxJ7OMNJIftMo\"",
    "mtime": "2026-11-02T09:13:40.127Z",
    "size": 1298,
    "path": "../public/assets/icons/flags/CW.svg"
  },
  "/assets/icons/flags/CV.svg": {
    "type": "image/svg+xml",
    "etag": "\"53c-n/CWzFkwbl5a+t1WmKwvtIzimIc\"",
    "mtime": "2026-11-02T09:13:40.126Z",
    "size": 1340,
    "path": "../public/assets/icons/flags/CV.svg"
  },
  "/assets/icons/flags/CX.svg": {
    "type": "image/svg+xml",
    "etag": "\"1e61-zex3J67xQhayJnoYLAOMkC3pN5s\"",
    "mtime": "2026-11-02T09:13:40.129Z",
    "size": 7777,
    "path": "../public/assets/icons/flags/CX.svg"
  },
  "/assets/icons/flags/CZ.svg": {
    "type": "image/svg+xml",
    "etag": "\"431-8V9syIYI+/P1jBGm8YVMeC3Sav8\"",
    "mtime": "2026-11-02T09:13:40.127Z",
    "size": 1073,
    "path": "../public/assets/icons/flags/CZ.svg"
  },
  "/assets/icons/flags/CY.svg": {
    "type": "image/svg+xml",
    "etag": "\"48d-Yg8M15itPiEYPR/su/9EXaizyOw\"",
    "mtime": "2026-11-02T09:13:40.126Z",
    "size": 1165,
    "path": "../public/assets/icons/flags/CY.svg"
  },
  "/assets/icons/flags/DE.svg": {
    "type": "image/svg+xml",
    "etag": "\"42f-LRA0GdcTZ1UY1XqUz0Gz+SO5QTs\"",
    "mtime": "2026-11-02T09:13:40.126Z",
    "size": 1071,
    "path": "../public/assets/icons/flags/DE.svg"
  },
  "/assets/icons/flags/DJ.svg": {
    "type": "image/svg+xml",
    "etag": "\"4fb-ci1jkGrMKTheNST5qWS/vXYmxqo\"",
    "mtime": "2026-11-02T09:13:40.127Z",
    "size": 1275,
    "path": "../public/assets/icons/flags/DJ.svg"
  },
  "/assets/icons/flags/DK.svg": {
    "type": "image/svg+xml",
    "etag": "\"3eb-5Ua0dyRrLcc9CaeTmpYwvVAs6WU\"",
    "mtime": "2026-11-02T09:13:40.127Z",
    "size": 1003,
    "path": "../public/assets/icons/flags/DK.svg"
  },
  "/assets/icons/flags/DM.svg": {
    "type": "image/svg+xml",
    "etag": "\"648-MzQDQVQ46fxku02j9lApiozNHiE\"",
    "mtime": "2026-11-02T09:13:40.127Z",
    "size": 1608,
    "path": "../public/assets/icons/flags/DM.svg"
  },
  "/assets/icons/flags/DO.svg": {
    "type": "image/svg+xml",
    "etag": "\"686-6HID7DWd6088pVdBOLP+qn4IPX8\"",
    "mtime": "2026-11-02T09:13:40.127Z",
    "size": 1670,
    "path": "../public/assets/icons/flags/DO.svg"
  },
  "/assets/icons/flags/DZ.svg": {
    "type": "image/svg+xml",
    "etag": "\"587-w+nJAlQVC70XS2SXmUeTpnPj3+g\"",
    "mtime": "2026-11-02T09:13:40.129Z",
    "size": 1415,
    "path": "../public/assets/icons/flags/DZ.svg"
  },
  "/assets/icons/flags/EC.svg": {
    "type": "image/svg+xml",
    "etag": "\"5ad-QK7W4+QY3xppkqAVBewRvbUwevs\"",
    "mtime": "2026-11-02T09:13:40.129Z",
    "size": 1453,
    "path": "../public/assets/icons/flags/EC.svg"
  },
  "/assets/icons/flags/EE.svg": {
    "type": "image/svg+xml",
    "etag": "\"42d-jtorLpPBOR7Q4qMqwqXzz+Kn3oM\"",
    "mtime": "2026-11-02T09:13:40.127Z",
    "size": 1069,
    "path": "../public/assets/icons/flags/EE.svg"
  },
  "/assets/icons/flags/EG.svg": {
    "type": "image/svg+xml",
    "etag": "\"4a3-atdMNTY5OxSbYmcS0iB+guPqeEw\"",
    "mtime": "2026-11-02T09:13:40.128Z",
    "size": 1187,
    "path": "../public/assets/icons/flags/EG.svg"
  },
  "/assets/icons/flags/EH.svg": {
    "type": "image/svg+xml",
    "etag": "\"6a9-+U3TjDRxVSn1zy7Lg0EvjQgozMI\"",
    "mtime": "2026-11-02T09:13:40.128Z",
    "size": 1705,
    "path": "../public/assets/icons/flags/EH.svg"
  },
  "/assets/icons/flags/ER.svg": {
    "type": "image/svg+xml",
    "etag": "\"5ea-cCsIoXUorAQF/4jqUrRhdPe78YQ\"",
    "mtime": "2026-11-02T09:13:40.128Z",
    "size": 1514,
    "path": "../public/assets/icons/flags/ER.svg"
  },
  "/assets/icons/flags/ES.svg": {
    "type": "image/svg+xml",
    "etag": "\"7d6-U23YGIAkHMgh8sdwIV8PVMP3ty4\"",
    "mtime": "2026-11-02T09:13:40.129Z",
    "size": 2006,
    "path": "../public/assets/icons/flags/ES.svg"
  },
  "/assets/icons/flags/ET.svg": {
    "type": "image/svg+xml",
    "etag": "\"59f-ERxM0xXjZr78JUw/wRrXGIO4IIc\"",
    "mtime": "2026-11-02T09:13:40.129Z",
    "size": 1439,
    "path": "../public/assets/icons/flags/ET.svg"
  },
  "/assets/icons/flags/FI.svg": {
    "type": "image/svg+xml",
    "etag": "\"3eb-e+ql+vnQpqnYMh3cGl69FEZKw70\"",
    "mtime": "2026-11-02T09:13:40.129Z",
    "size": 1003,
    "path": "../public/assets/icons/flags/FI.svg"
  },
  "/assets/icons/flags/FJ.svg": {
    "type": "image/svg+xml",
    "etag": "\"640-Cbc047lP+TL2i4GH3u25KH3iaRw\"",
    "mtime": "2026-11-02T09:13:40.129Z",
    "size": 1600,
    "path": "../public/assets/icons/flags/FJ.svg"
  },
  "/assets/icons/flags/FM.svg": {
    "type": "image/svg+xml",
    "etag": "\"79f-Og0VwzWRhWlPmgyqJlqiCnm4lmI\"",
    "mtime": "2026-11-02T09:13:40.129Z",
    "size": 1951,
    "path": "../public/assets/icons/flags/FM.svg"
  },
  "/assets/icons/flags/FO.svg": {
    "type": "image/svg+xml",
    "etag": "\"30d-hxq84I0QeikPCXsktr4ifHHovWo\"",
    "mtime": "2026-11-02T09:13:40.130Z",
    "size": 781,
    "path": "../public/assets/icons/flags/FO.svg"
  },
  "/assets/icons/flags/FR.svg": {
    "type": "image/svg+xml",
    "etag": "\"42f-s8Z/f/K0OXQ14qyGggCtltYOwGk\"",
    "mtime": "2026-11-02T09:13:40.129Z",
    "size": 1071,
    "path": "../public/assets/icons/flags/FR.svg"
  },
  "/assets/icons/flags/GA.svg": {
    "type": "image/svg+xml",
    "etag": "\"431-cNX7GXJTEp/voFXejETHnTulbpM\"",
    "mtime": "2026-11-02T09:13:40.130Z",
    "size": 1073,
    "path": "../public/assets/icons/flags/GA.svg"
  },
  "/assets/icons/flags/GD.svg": {
    "type": "image/svg+xml",
    "etag": "\"6e8-p+n34/Af/9XLsVsK+wf9Om3rn0M\"",
    "mtime": "2026-11-02T09:13:40.130Z",
    "size": 1768,
    "path": "../public/assets/icons/flags/GD.svg"
  },
  "/assets/icons/flags/GB.svg": {
    "type": "image/svg+xml",
    "etag": "\"65e-XHh0+9GiCMSkHTQRCepOSsC7srM\"",
    "mtime": "2026-11-02T09:13:40.130Z",
    "size": 1630,
    "path": "../public/assets/icons/flags/GB.svg"
  },
  "/assets/icons/flags/GE.svg": {
    "type": "image/svg+xml",
    "etag": "\"4c1-afklpCZK1ZsgL3c8yhOzwy1UY8s\"",
    "mtime": "2026-11-02T09:13:40.130Z",
    "size": 1217,
    "path": "../public/assets/icons/flags/GE.svg"
  },
  "/assets/icons/flags/GF.svg": {
    "type": "image/svg+xml",
    "etag": "\"2f2-EZwb38180/I4pRGTzg3DCANCneI\"",
    "mtime": "2026-11-02T09:13:40.130Z",
    "size": 754,
    "path": "../public/assets/icons/flags/GF.svg"
  },
  "/assets/icons/flags/GG.svg": {
    "type": "image/svg+xml",
    "etag": "\"31d-n+LZWuiZJoBJCWf2fxVhKiCZWRM\"",
    "mtime": "2026-11-02T09:13:40.130Z",
    "size": 797,
    "path": "../public/assets/icons/flags/GG.svg"
  },
  "/assets/icons/flags/GH.svg": {
    "type": "image/svg+xml",
    "etag": "\"4f9-opj7rNWN/hnnIcs2xC3hDa5PJEM\"",
    "mtime": "2026-11-02T09:13:40.131Z",
    "size": 1273,
    "path": "../public/assets/icons/flags/GH.svg"
  },
  "/assets/icons/flags/GI.svg": {
    "type": "image/svg+xml",
    "etag": "\"2caf-7t1/JFHCMxhsHv7+JF83D3gayk4\"",
    "mtime": "2026-11-02T09:13:40.131Z",
    "size": 11439,
    "path": "../public/assets/icons/flags/GI.svg"
  },
  "/assets/icons/flags/GL.svg": {
    "type": "image/svg+xml",
    "etag": "\"380-GzejAzsx57CeeRVU+0JDP+iGXhM\"",
    "mtime": "2026-11-02T09:13:40.131Z",
    "size": 896,
    "path": "../public/assets/icons/flags/GL.svg"
  },
  "/assets/icons/flags/GM.svg": {
    "type": "image/svg+xml",
    "etag": "\"481-VWkMUkAF07WeslPS+cmk5TN+cSc\"",
    "mtime": "2026-11-02T09:13:40.130Z",
    "size": 1153,
    "path": "../public/assets/icons/flags/GM.svg"
  },
  "/assets/icons/flags/GN.svg": {
    "type": "image/svg+xml",
    "etag": "\"431-QDRRDGbujGmv4p9EtwnGHQ7/5e0\"",
    "mtime": "2026-11-02T09:13:40.131Z",
    "size": 1073,
    "path": "../public/assets/icons/flags/GN.svg"
  },
  "/assets/icons/flags/GP.svg": {
    "type": "image/svg+xml",
    "etag": "\"2d6-Q/qYcCe3/3wWOciYE6wZaSdyv6w\"",
    "mtime": "2026-11-02T09:13:40.131Z",
    "size": 726,
    "path": "../public/assets/icons/flags/GP.svg"
  },
  "/assets/icons/flags/GQ.svg": {
    "type": "image/svg+xml",
    "etag": "\"781-l2fLOsNeO6CdfibcivWswV5yKbc\"",
    "mtime": "2026-11-02T09:13:40.131Z",
    "size": 1921,
    "path": "../public/assets/icons/flags/GQ.svg"
  },
  "/assets/icons/flags/GR.svg": {
    "type": "image/svg+xml",
    "etag": "\"496-fZ1QCXxkGIu1aviqAu5Qpgensk4\"",
    "mtime": "2026-11-02T09:13:40.131Z",
    "size": 1174,
    "path": "../public/assets/icons/flags/GR.svg"
  },
  "/assets/icons/flags/GT.svg": {
    "type": "image/svg+xml",
    "etag": "\"584-PvHvZz469ovSKFGv42+2VQ+CVFk\"",
    "mtime": "2026-11-02T09:13:40.131Z",
    "size": 1412,
    "path": "../public/assets/icons/flags/GT.svg"
  },
  "/assets/icons/flags/GU.svg": {
    "type": "image/svg+xml",
    "etag": "\"4f10-84ugk/FYHRSxg+3mOKyoiNVGODs\"",
    "mtime": "2026-11-02T09:13:40.132Z",
    "size": 20240,
    "path": "../public/assets/icons/flags/GU.svg"
  },
  "/assets/icons/flags/GW.svg": {
    "type": "image/svg+xml",
    "etag": "\"4f7-JVajzpiL7yynej1YNeWZsksT1lA\"",
    "mtime": "2026-11-02T09:13:40.132Z",
    "size": 1271,
    "path": "../public/assets/icons/flags/GW.svg"
  },
  "/assets/icons/flags/GY.svg": {
    "type": "image/svg+xml",
    "etag": "\"4ec-KcaF8kEAuKtQt/uNt+gSw8191iE\"",
    "mtime": "2026-11-02T09:13:40.131Z",
    "size": 1260,
    "path": "../public/assets/icons/flags/GY.svg"
  },
  "/assets/icons/flags/HIMI.svg": {
    "type": "image/svg+xml",
    "etag": "\"627c-c/Z7aMAB9OKkUgbzji7uWA//XTY\"",
    "mtime": "2026-11-02T09:13:40.132Z",
    "size": 25212,
    "path": "../public/assets/icons/flags/HIMI.svg"
  },
  "/assets/icons/flags/HN.svg": {
    "type": "image/svg+xml",
    "etag": "\"435-vhWA8AF8LQDZnDW0OmlJBXkqckw\"",
    "mtime": "2026-11-02T09:13:40.132Z",
    "size": 1077,
    "path": "../public/assets/icons/flags/HN.svg"
  },
  "/assets/icons/flags/HR.svg": {
    "type": "image/svg+xml",
    "etag": "\"784-hwIfQ+fE3gKyrmdZRPM4UI3GyBY\"",
    "mtime": "2026-11-02T09:13:40.132Z",
    "size": 1924,
    "path": "../public/assets/icons/flags/HR.svg"
  },
  "/assets/icons/flags/HK.svg": {
    "type": "image/svg+xml",
    "etag": "\"7d8-14MuCy+4g+QeoWbp/al+FStSN4A\"",
    "mtime": "2026-11-02T09:13:40.132Z",
    "size": 2008,
    "path": "../public/assets/icons/flags/HK.svg"
  },
  "/assets/icons/flags/HU.svg": {
    "type": "image/svg+xml",
    "etag": "\"42f-SmsdnVccyYEokG3MZYokkci+ImU\"",
    "mtime": "2026-11-02T09:13:40.133Z",
    "size": 1071,
    "path": "../public/assets/icons/flags/HU.svg"
  },
  "/assets/icons/flags/ID.svg": {
    "type": "image/svg+xml",
    "etag": "\"3da-vgLtSTGuRGpp9LHLjYmIAP07oQE\"",
    "mtime": "2026-11-02T09:13:40.132Z",
    "size": 986,
    "path": "../public/assets/icons/flags/ID.svg"
  },
  "/assets/icons/flags/IE.svg": {
    "type": "image/svg+xml",
    "etag": "\"42f-CK6808H7QzW+kXxQUSbusTzYeok\"",
    "mtime": "2026-11-02T09:13:40.132Z",
    "size": 1071,
    "path": "../public/assets/icons/flags/IE.svg"
  },
  "/assets/icons/flags/IL.svg": {
    "type": "image/svg+xml",
    "etag": "\"470-vbhGm8gOdiqQxaDMw2v8LZfErek\"",
    "mtime": "2026-11-02T09:13:40.133Z",
    "size": 1136,
    "path": "../public/assets/icons/flags/IL.svg"
  },
  "/assets/icons/flags/HT.svg": {
    "type": "image/svg+xml",
    "etag": "\"54c-FbExm8O1iIuYNknrH7b/Js4/N1o\"",
    "mtime": "2026-11-02T09:13:40.132Z",
    "size": 1356,
    "path": "../public/assets/icons/flags/HT.svg"
  },
  "/assets/icons/flags/IM.svg": {
    "type": "image/svg+xml",
    "etag": "\"7fe5-dKImjJawAw5yWa1tmqHwqSANMV4\"",
    "mtime": "2026-11-02T09:13:40.134Z",
    "size": 32741,
    "path": "../public/assets/icons/flags/IM.svg"
  },
  "/assets/icons/flags/IN.svg": {
    "type": "image/svg+xml",
    "etag": "\"5d1-kVy06AvLGViDlQSaQhUA0bRve2A\"",
    "mtime": "2026-11-02T09:13:40.134Z",
    "size": 1489,
    "path": "../public/assets/icons/flags/IN.svg"
  },
  "/assets/icons/flags/IO.svg": {
    "type": "image/svg+xml",
    "etag": "\"14b51-BgeqO6LfN+FJkIHU8IpDV40m8HM\"",
    "mtime": "2026-11-02T09:13:40.134Z",
    "size": 84817,
    "path": "../public/assets/icons/flags/IO.svg"
  },
  "/assets/icons/flags/IQ.svg": {
    "type": "image/svg+xml",
    "etag": "\"619-O50PMuW6muDTCRKbGTwjr51be74\"",
    "mtime": "2026-11-02T09:13:40.133Z",
    "size": 1561,
    "path": "../public/assets/icons/flags/IQ.svg"
  },
  "/assets/icons/flags/IR.svg": {
    "type": "image/svg+xml",
    "etag": "\"5dd-lgQfLVjfkPgnYbqM8oKBp8lYZuQ\"",
    "mtime": "2026-11-02T09:13:40.133Z",
    "size": 1501,
    "path": "../public/assets/icons/flags/IR.svg"
  },
  "/assets/icons/flags/IS.svg": {
    "type": "image/svg+xml",
    "etag": "\"44e-7sF6lXJYzhUyhSWyP8IWbJ9KlDM\"",
    "mtime": "2026-11-02T09:13:40.135Z",
    "size": 1102,
    "path": "../public/assets/icons/flags/IS.svg"
  },
  "/assets/icons/flags/IT.svg": {
    "type": "image/svg+xml",
    "etag": "\"42f-4MQKe+0tCf15y6BoVHZhH6GgJTU\"",
    "mtime": "2026-11-02T09:13:40.133Z",
    "size": 1071,
    "path": "../public/assets/icons/flags/IT.svg"
  },
  "/assets/icons/flags/JE.svg": {
    "type": "image/svg+xml",
    "etag": "\"7e45-kjUE5xQhj3EkoFJ7MrM0J9FLPiQ\"",
    "mtime": "2026-11-02T09:13:40.134Z",
    "size": 32325,
    "path": "../public/assets/icons/flags/JE.svg"
  },
  "/assets/icons/flags/JM.svg": {
    "type": "image/svg+xml",
    "etag": "\"4a0-EIEI28GKlu0OY0f7Sybng88pbso\"",
    "mtime": "2026-11-02T09:13:40.133Z",
    "size": 1184,
    "path": "../public/assets/icons/flags/JM.svg"
  },
  "/assets/icons/flags/JO.svg": {
    "type": "image/svg+xml",
    "etag": "\"4f9-qlZ49RzXkKdXV1+xpoB+U7szIY8\"",
    "mtime": "2026-11-02T09:13:40.136Z",
    "size": 1273,
    "path": "../public/assets/icons/flags/JO.svg"
  },
  "/assets/icons/flags/JP.svg": {
    "type": "image/svg+xml",
    "etag": "\"40f-AAqhyj5HdPanvVCEsPLTa5Udfsg\"",
    "mtime": "2026-11-02T09:13:40.134Z",
    "size": 1039,
    "path": "../public/assets/icons/flags/JP.svg"
  },
  "/assets/icons/flags/KE.svg": {
    "type": "image/svg+xml",
    "etag": "\"a4c-NVipYkt9PeHOFn3mhqebXfJjLjU\"",
    "mtime": "2026-11-02T09:13:40.134Z",
    "size": 2636,
    "path": "../public/assets/icons/flags/KE.svg"
  },
  "/assets/icons/flags/KH.svg": {
    "type": "image/svg+xml",
    "etag": "\"644-IMWr0tzisbI6N3N7Kj8kf+b2TpE\"",
    "mtime": "2026-11-02T09:13:40.134Z",
    "size": 1604,
    "path": "../public/assets/icons/flags/KH.svg"
  },
  "/assets/icons/flags/KG.svg": {
    "type": "image/svg+xml",
    "etag": "\"666-pye749Ft94xOydYjG7EKgv9/dzY\"",
    "mtime": "2026-11-02T09:13:40.135Z",
    "size": 1638,
    "path": "../public/assets/icons/flags/KG.svg"
  },
  "/assets/icons/flags/KI.svg": {
    "type": "image/svg+xml",
    "etag": "\"67d-69IVu/RG9fZTzSGdtGoRBApQkqI\"",
    "mtime": "2026-11-02T09:13:40.135Z",
    "size": 1661,
    "path": "../public/assets/icons/flags/KI.svg"
  },
  "/assets/icons/flags/KM.svg": {
    "type": "image/svg+xml",
    "etag": "\"5f4-xrEd4WLLhYcemanYHJtW7TF8myM\"",
    "mtime": "2026-11-02T09:13:40.135Z",
    "size": 1524,
    "path": "../public/assets/icons/flags/KM.svg"
  },
  "/assets/icons/flags/KN.svg": {
    "type": "image/svg+xml",
    "etag": "\"604-xrdxVx5PVra9DZAX/MWOrvhdORQ\"",
    "mtime": "2026-11-02T09:13:40.135Z",
    "size": 1540,
    "path": "../public/assets/icons/flags/KN.svg"
  },
  "/assets/icons/flags/KP.svg": {
    "type": "image/svg+xml",
    "etag": "\"5dc-PhDGmeuIGkdVDHaSD5oP0KT32Ks\"",
    "mtime": "2026-11-02T09:13:40.135Z",
    "size": 1500,
    "path": "../public/assets/icons/flags/KP.svg"
  },
  "/assets/icons/flags/KR.svg": {
    "type": "image/svg+xml",
    "etag": "\"5e8-8ObghLXQDOA7WfEt5IceRLHzd54\"",
    "mtime": "2026-11-02T09:13:40.136Z",
    "size": 1512,
    "path": "../public/assets/icons/flags/KR.svg"
  },
  "/assets/icons/flags/KW.svg": {
    "type": "image/svg+xml",
    "etag": "\"48d-YiSfdg7IOihbFWCCvEO3ej79EdE\"",
    "mtime": "2026-11-02T09:13:40.135Z",
    "size": 1165,
    "path": "../public/assets/icons/flags/KW.svg"
  },
  "/assets/icons/flags/LA.svg": {
    "type": "image/svg+xml",
    "etag": "\"492-pUGuwV1kGQRF7WFIsMQTm1fNlFE\"",
    "mtime": "2026-11-02T09:13:40.135Z",
    "size": 1170,
    "path": "../public/assets/icons/flags/LA.svg"
  },
  "/assets/icons/flags/LB.svg": {
    "type": "image/svg+xml",
    "etag": "\"456-vskW1XkXXCD+P3zFzWW5akkDdhw\"",
    "mtime": "2026-11-02T09:13:40.136Z",
    "size": 1110,
    "path": "../public/assets/icons/flags/LB.svg"
  },
  "/assets/icons/flags/KZ.svg": {
    "type": "image/svg+xml",
    "etag": "\"892-NSPJAWEzLH3mk/PJco8Qm/lyTRo\"",
    "mtime": "2026-11-02T09:13:40.135Z",
    "size": 2194,
    "path": "../public/assets/icons/flags/KZ.svg"
  },
  "/assets/icons/flags/LC.svg": {
    "type": "image/svg+xml",
    "etag": "\"491-h+4Ujk6MD2g7IrIwbQS3ptDE7gY\"",
    "mtime": "2026-11-02T09:13:40.136Z",
    "size": 1169,
    "path": "../public/assets/icons/flags/LC.svg"
  },
  "/assets/icons/flags/LK.svg": {
    "type": "image/svg+xml",
    "etag": "\"3b3d-hUMcrZAh4E237WaW+34DhoV+EP8\"",
    "mtime": "2026-11-02T09:13:40.136Z",
    "size": 15165,
    "path": "../public/assets/icons/flags/LK.svg"
  },
  "/assets/icons/flags/LI.svg": {
    "type": "image/svg+xml",
    "etag": "\"54b-sIWYEbx12ipmflHb+RBJOJwn3pM\"",
    "mtime": "2026-11-02T09:13:40.137Z",
    "size": 1355,
    "path": "../public/assets/icons/flags/LI.svg"
  },
  "/assets/icons/flags/KY.svg": {
    "type": "image/svg+xml",
    "etag": "\"14582-aFbJeTlqa8bXkGaYCDbM+v/4uMU\"",
    "mtime": "2026-11-02T09:13:40.136Z",
    "size": 83330,
    "path": "../public/assets/icons/flags/KY.svg"
  },
  "/assets/icons/flags/LR.svg": {
    "type": "image/svg+xml",
    "etag": "\"578-IWpjljemWBhrMtTea/wZP/oeUTk\"",
    "mtime": "2026-11-02T09:13:40.137Z",
    "size": 1400,
    "path": "../public/assets/icons/flags/LR.svg"
  },
  "/assets/icons/flags/LS.svg": {
    "type": "image/svg+xml",
    "etag": "\"534-CE6wQ0jTouOXugPAvogpTD+4PoY\"",
    "mtime": "2026-11-02T09:13:40.137Z",
    "size": 1332,
    "path": "../public/assets/icons/flags/LS.svg"
  },
  "/assets/icons/flags/LT.svg": {
    "type": "image/svg+xml",
    "etag": "\"431-EE0CTeJulJIporUEvdp3flf+pkw\"",
    "mtime": "2026-11-02T09:13:40.136Z",
    "size": 1073,
    "path": "../public/assets/icons/flags/LT.svg"
  },
  "/assets/icons/flags/LU.svg": {
    "type": "image/svg+xml",
    "etag": "\"42f-npmvSFYvUz7sQ0hfiJ+3Xfb0cUw\"",
    "mtime": "2026-11-02T09:13:40.136Z",
    "size": 1071,
    "path": "../public/assets/icons/flags/LU.svg"
  },
  "/assets/icons/flags/LV.svg": {
    "type": "image/svg+xml",
    "etag": "\"3e9-taXYkZa3Wtgix8LNadZzrNWPBG8\"",
    "mtime": "2026-11-02T09:13:40.138Z",
    "size": 1001,
    "path": "../public/assets/icons/flags/LV.svg"
  },
  "/assets/icons/flags/LY.svg": {
    "type": "image/svg+xml",
    "etag": "\"56e-LKDPImrAKx1Ewo9v03LNAbBP78U\"",
    "mtime": "2026-11-02T09:13:40.137Z",
    "size": 1390,
    "path": "../public/assets/icons/flags/LY.svg"
  },
  "/assets/icons/flags/MA.svg": {
    "type": "image/svg+xml",
    "etag": "\"46e-DjA6QwfI0BFHwDeFOVZQ1aoO2eI\"",
    "mtime": "2026-11-02T09:13:40.137Z",
    "size": 1134,
    "path": "../public/assets/icons/flags/MA.svg"
  },
  "/assets/icons/flags/MC.svg": {
    "type": "image/svg+xml",
    "etag": "\"3db-nq/a9k/Knmg8HrMh0kcU30CcN00\"",
    "mtime": "2026-11-02T09:13:40.137Z",
    "size": 987,
    "path": "../public/assets/icons/flags/MC.svg"
  },
  "/assets/icons/flags/MD.svg": {
    "type": "image/svg+xml",
    "etag": "\"62a-KzUxyskxabMvairw258WkAB4VG4\"",
    "mtime": "2026-11-02T09:13:40.137Z",
    "size": 1578,
    "path": "../public/assets/icons/flags/MD.svg"
  },
  "/assets/icons/flags/ME.svg": {
    "type": "image/svg+xml",
    "etag": "\"6a2-ZenAXECxOMG1kCTTy1Lu2sK8mWs\"",
    "mtime": "2026-11-02T09:13:40.138Z",
    "size": 1698,
    "path": "../public/assets/icons/flags/ME.svg"
  },
  "/assets/icons/flags/MG.svg": {
    "type": "image/svg+xml",
    "etag": "\"42d-0havLv28VQN6qw7dLntudZLxUMM\"",
    "mtime": "2026-11-02T09:13:40.137Z",
    "size": 1069,
    "path": "../public/assets/icons/flags/MG.svg"
  },
  "/assets/icons/flags/MF.svg": {
    "type": "image/svg+xml",
    "etag": "\"811-eNQ/DTSIBSA2Pbk53LynVthe9oE\"",
    "mtime": "2026-11-02T09:13:40.138Z",
    "size": 2065,
    "path": "../public/assets/icons/flags/MF.svg"
  },
  "/assets/icons/flags/MH.svg": {
    "type": "image/svg+xml",
    "etag": "\"4b3-POgizXDzQOcCG2EGCwC/ZssMgEw\"",
    "mtime": "2026-11-02T09:13:40.138Z",
    "size": 1203,
    "path": "../public/assets/icons/flags/MH.svg"
  },
  "/assets/icons/flags/MN.svg": {
    "type": "image/svg+xml",
    "etag": "\"5ec-wJdeCyqEy9D1fX6Qhuo6glf8qk8\"",
    "mtime": "2026-11-02T09:13:40.138Z",
    "size": 1516,
    "path": "../public/assets/icons/flags/MN.svg"
  },
  "/assets/icons/flags/ML.svg": {
    "type": "image/svg+xml",
    "etag": "\"431-2SyoE1RJNj71o/iWuQx3gSHJwCI\"",
    "mtime": "2026-11-02T09:13:40.139Z",
    "size": 1073,
    "path": "../public/assets/icons/flags/ML.svg"
  },
  "/assets/icons/flags/MQ.svg": {
    "type": "image/svg+xml",
    "etag": "\"333-RqeSzGagSyb/IdI/QCNc2eI5xuQ\"",
    "mtime": "2026-11-02T09:13:40.139Z",
    "size": 819,
    "path": "../public/assets/icons/flags/MQ.svg"
  },
  "/assets/icons/flags/MR.svg": {
    "type": "image/svg+xml",
    "etag": "\"59a-XxhisywnxU06wcgSjk1uQtoo/CM\"",
    "mtime": "2026-11-02T09:13:40.139Z",
    "size": 1434,
    "path": "../public/assets/icons/flags/MR.svg"
  },
  "/assets/icons/flags/MO.svg": {
    "type": "image/svg+xml",
    "etag": "\"365e-78s1dhHsHtgFz1+YLvhHfql/iQM\"",
    "mtime": "2026-11-02T09:13:40.138Z",
    "size": 13918,
    "path": "../public/assets/icons/flags/MO.svg"
  },
  "/assets/icons/flags/MK.svg": {
    "type": "image/svg+xml",
    "etag": "\"5db-nopfp7hXbo6ocIZolYBJQFhUdOI\"",
    "mtime": "2026-11-02T09:13:40.138Z",
    "size": 1499,
    "path": "../public/assets/icons/flags/MK.svg"
  },
  "/assets/icons/flags/MS.svg": {
    "type": "image/svg+xml",
    "etag": "\"3158-MzArOZA1i8G/fwI8fAnb10Q4G+E\"",
    "mtime": "2026-11-02T09:13:40.139Z",
    "size": 12632,
    "path": "../public/assets/icons/flags/MS.svg"
  },
  "/assets/icons/flags/MU.svg": {
    "type": "image/svg+xml",
    "etag": "\"483-P3vIJaUdh89jYiIMcxuw4BtlYjk\"",
    "mtime": "2026-11-02T09:13:40.139Z",
    "size": 1155,
    "path": "../public/assets/icons/flags/MU.svg"
  },
  "/assets/icons/flags/MT.svg": {
    "type": "image/svg+xml",
    "etag": "\"43c-TpGtprE4IRH4Y61RK4raIk0aV4E\"",
    "mtime": "2026-11-02T09:13:40.139Z",
    "size": 1084,
    "path": "../public/assets/icons/flags/MT.svg"
  },
  "/assets/icons/flags/MW.svg": {
    "type": "image/svg+xml",
    "etag": "\"4ca-z7OtsIp+LKZrqoEcDeSi0nPsNnc\"",
    "mtime": "2026-11-02T09:13:40.139Z",
    "size": 1226,
    "path": "../public/assets/icons/flags/MW.svg"
  },
  "/assets/icons/flags/MV.svg": {
    "type": "image/svg+xml",
    "etag": "\"4d6-UhO/O4+PcX9m0Zsd43NUtDUEzCI\"",
    "mtime": "2026-11-02T09:13:40.140Z",
    "size": 1238,
    "path": "../public/assets/icons/flags/MV.svg"
  },
  "/assets/icons/flags/MM.svg": {
    "type": "image/svg+xml",
    "etag": "\"4eb-x4YXibvn0CJR3aN51toXcFXse1c\"",
    "mtime": "2026-11-02T09:13:40.138Z",
    "size": 1259,
    "path": "../public/assets/icons/flags/MM.svg"
  },
  "/assets/icons/flags/MX.svg": {
    "type": "image/svg+xml",
    "etag": "\"5c8-zyOfg1vXYUG6pxvKk81HnNepVLE\"",
    "mtime": "2026-11-02T09:13:40.141Z",
    "size": 1480,
    "path": "../public/assets/icons/flags/MX.svg"
  },
  "/assets/icons/flags/MY.svg": {
    "type": "image/svg+xml",
    "etag": "\"5b4-5+sE9AOgRGB4yk+knQywWjSs/pc\"",
    "mtime": "2026-11-02T09:13:40.140Z",
    "size": 1460,
    "path": "../public/assets/icons/flags/MY.svg"
  },
  "/assets/icons/flags/MZ.svg": {
    "type": "image/svg+xml",
    "etag": "\"6c1-8VK05ZTAN4CoHg6Mb0vjRyvJS0k\"",
    "mtime": "2026-11-02T09:13:40.141Z",
    "size": 1729,
    "path": "../public/assets/icons/flags/MZ.svg"
  },
  "/assets/icons/flags/NA.svg": {
    "type": "image/svg+xml",
    "etag": "\"5a3-lmxw3/PQD/aZoUivpdY28P+vYd8\"",
    "mtime": "2026-11-02T09:13:40.141Z",
    "size": 1443,
    "path": "../public/assets/icons/flags/NA.svg"
  },
  "/assets/icons/flags/MP.svg": {
    "type": "image/svg+xml",
    "etag": "\"5600a-Hw8pdLJGClk1h9cTCOiwLM2OkfA\"",
    "mtime": "2026-11-02T09:13:40.142Z",
    "size": 352266,
    "path": "../public/assets/icons/flags/MP.svg"
  },
  "/assets/icons/flags/NC.svg": {
    "type": "image/svg+xml",
    "etag": "\"6e7-b68667kewr309Q0VqUzXqSwNiU0\"",
    "mtime": "2026-11-02T09:13:40.143Z",
    "size": 1767,
    "path": "../public/assets/icons/flags/NC.svg"
  },
  "/assets/icons/flags/NE.svg": {
    "type": "image/svg+xml",
    "etag": "\"4c0-Jrbp5fGGqYWBKLW107ZxlL+H7tY\"",
    "mtime": "2026-11-02T09:13:40.141Z",
    "size": 1216,
    "path": "../public/assets/icons/flags/NE.svg"
  },
  "/assets/icons/flags/NF.svg": {
    "type": "image/svg+xml",
    "etag": "\"3519-7V6VkdKzBtUvq61jL2YXXPnOsNM\"",
    "mtime": "2026-11-02T09:13:40.142Z",
    "size": 13593,
    "path": "../public/assets/icons/flags/NF.svg"
  },
  "/assets/icons/flags/NG.svg": {
    "type": "image/svg+xml",
    "etag": "\"3eb-WKmnx1mcog9vs3d6dlk51MtyDuQ\"",
    "mtime": "2026-11-02T09:13:40.142Z",
    "size": 1003,
    "path": "../public/assets/icons/flags/NG.svg"
  },
  "/assets/icons/flags/NI.svg": {
    "type": "image/svg+xml",
    "etag": "\"442-M72BzOM5l07i6QS+z49PgbGhR30\"",
    "mtime": "2026-11-02T09:13:40.142Z",
    "size": 1090,
    "path": "../public/assets/icons/flags/NI.svg"
  },
  "/assets/icons/flags/NL.svg": {
    "type": "image/svg+xml",
    "etag": "\"42f-ccT/+fa8bUCgHifR/JnOshgMYzM\"",
    "mtime": "2026-11-02T09:13:40.143Z",
    "size": 1071,
    "path": "../public/assets/icons/flags/NL.svg"
  },
  "/assets/icons/flags/NO.svg": {
    "type": "image/svg+xml",
    "etag": "\"44e-/uFmo9S3LFalvnCgIKdlswr4fg8\"",
    "mtime": "2026-11-02T09:13:40.142Z",
    "size": 1102,
    "path": "../public/assets/icons/flags/NO.svg"
  },
  "/assets/icons/flags/NP.svg": {
    "type": "image/svg+xml",
    "etag": "\"545-H79Nxh9HhX42qf0ijngA/L74XO4\"",
    "mtime": "2026-11-02T09:13:40.143Z",
    "size": 1349,
    "path": "../public/assets/icons/flags/NP.svg"
  },
  "/assets/icons/flags/NR.svg": {
    "type": "image/svg+xml",
    "etag": "\"49b-+EI95Djj+9ID9ArQU+pKLMpnck4\"",
    "mtime": "2026-11-02T09:13:40.143Z",
    "size": 1179,
    "path": "../public/assets/icons/flags/NR.svg"
  },
  "/assets/icons/flags/NU.svg": {
    "type": "image/svg+xml",
    "etag": "\"7a5-hUb1xoHmv1mEr1iKFkNSowJdKFo\"",
    "mtime": "2026-11-02T09:13:40.142Z",
    "size": 1957,
    "path": "../public/assets/icons/flags/NU.svg"
  },
  "/assets/icons/flags/NZ.svg": {
    "type": "image/svg+xml",
    "etag": "\"53c-cbKTVN+PIaGOB6F23qJsrAU4vZU\"",
    "mtime": "2026-11-02T09:13:40.143Z",
    "size": 1340,
    "path": "../public/assets/icons/flags/NZ.svg"
  },
  "/assets/icons/flags/OM.svg": {
    "type": "image/svg+xml",
    "etag": "\"6d5-F8bTLN8mjSvKknkJmMdSIwvLDCI\"",
    "mtime": "2026-11-02T09:13:40.143Z",
    "size": 1749,
    "path": "../public/assets/icons/flags/OM.svg"
  },
  "/assets/icons/flags/PA.svg": {
    "type": "image/svg+xml",
    "etag": "\"6b5-ii9144I/cC/1cmncn2XXmx6tBlg\"",
    "mtime": "2026-11-02T09:13:40.143Z",
    "size": 1717,
    "path": "../public/assets/icons/flags/PA.svg"
  },
  "/assets/icons/flags/PE.svg": {
    "type": "image/svg+xml",
    "etag": "\"3eb-7Vx9rq/mbnW2jBEqXIVjA3MoM9c\"",
    "mtime": "2026-11-02T09:13:40.143Z",
    "size": 1003,
    "path": "../public/assets/icons/flags/PE.svg"
  },
  "/assets/icons/flags/PF.svg": {
    "type": "image/svg+xml",
    "etag": "\"30f4-cMydGkkNeBGAyGrilLcP3w6/3ck\"",
    "mtime": "2026-11-02T09:13:40.143Z",
    "size": 12532,
    "path": "../public/assets/icons/flags/PF.svg"
  },
  "/assets/icons/flags/PG.svg": {
    "type": "image/svg+xml",
    "etag": "\"73f-UTWwIExIcrKdV6dLvgrmT9jUOTM\"",
    "mtime": "2026-11-02T09:13:40.144Z",
    "size": 1855,
    "path": "../public/assets/icons/flags/PG.svg"
  },
  "/assets/icons/flags/PH.svg": {
    "type": "image/svg+xml",
    "etag": "\"719-XTwNqwKUxoh/gKGqojHl3P5SGz4\"",
    "mtime": "2026-11-02T09:13:40.144Z",
    "size": 1817,
    "path": "../public/assets/icons/flags/PH.svg"
  },
  "/assets/icons/flags/PK.svg": {
    "type": "image/svg+xml",
    "etag": "\"604-aBcivhla/5ZcNQCbpSrRwPGjAyY\"",
    "mtime": "2026-11-02T09:13:40.144Z",
    "size": 1540,
    "path": "../public/assets/icons/flags/PK.svg"
  },
  "/assets/icons/flags/PL.svg": {
    "type": "image/svg+xml",
    "etag": "\"3da-6LzzB+jVcxowXQC0aesMjaMBRDs\"",
    "mtime": "2026-11-02T09:13:40.143Z",
    "size": 986,
    "path": "../public/assets/icons/flags/PL.svg"
  },
  "/assets/icons/flags/PN.svg": {
    "type": "image/svg+xml",
    "etag": "\"7bca-TqwaJwnGX8UztagO1D7xS/urJ30\"",
    "mtime": "2026-11-02T09:13:40.144Z",
    "size": 31690,
    "path": "../public/assets/icons/flags/PN.svg"
  },
  "/assets/icons/flags/PR.svg": {
    "type": "image/svg+xml",
    "etag": "\"31f-EZY3s5IgTnH4znMmQZgOsUGdreE\"",
    "mtime": "2026-11-02T09:13:40.144Z",
    "size": 799,
    "path": "../public/assets/icons/flags/PR.svg"
  },
  "/assets/icons/flags/PM.svg": {
    "type": "image/svg+xml",
    "etag": "\"2185e-m3jp2NCa7axKccgFqnDhQ5KXu3g\"",
    "mtime": "2026-11-02T09:13:40.145Z",
    "size": 137310,
    "path": "../public/assets/icons/flags/PM.svg"
  },
  "/assets/icons/flags/PS.svg": {
    "type": "image/svg+xml",
    "etag": "\"488-aj8P9/3zSPfJikhk7UxyVf18BaU\"",
    "mtime": "2026-11-02T09:13:40.144Z",
    "size": 1160,
    "path": "../public/assets/icons/flags/PS.svg"
  },
  "/assets/icons/flags/PW.svg": {
    "type": "image/svg+xml",
    "etag": "\"41c-8nlSxjKOivXeEgo5ohOWrAV76Ss\"",
    "mtime": "2026-11-02T09:13:40.144Z",
    "size": 1052,
    "path": "../public/assets/icons/flags/PW.svg"
  },
  "/assets/icons/flags/PT.svg": {
    "type": "image/svg+xml",
    "etag": "\"588-53/ivV8mJEtG2l8pLw13HLE3rNs\"",
    "mtime": "2026-11-02T09:13:40.144Z",
    "size": 1416,
    "path": "../public/assets/icons/flags/PT.svg"
  },
  "/assets/icons/flags/PY.svg": {
    "type": "image/svg+xml",
    "etag": "\"5fa-xxs7mvt30jrwmYD+QQjGCIkltks\"",
    "mtime": "2026-11-02T09:13:40.144Z",
    "size": 1530,
    "path": "../public/assets/icons/flags/PY.svg"
  },
  "/assets/icons/flags/QA.svg": {
    "type": "image/svg+xml",
    "etag": "\"419-lPoJ1h8+5clve6/bROujBENCyr8\"",
    "mtime": "2026-11-02T09:13:40.145Z",
    "size": 1049,
    "path": "../public/assets/icons/flags/QA.svg"
  },
  "/assets/icons/flags/RE.svg": {
    "type": "image/svg+xml",
    "etag": "\"15706-AJ/wCYbvHgB2/qRAhOJ4+G5HJ2s\"",
    "mtime": "2026-11-02T09:13:40.149Z",
    "size": 87814,
    "path": "../public/assets/icons/flags/RE.svg"
  },
  "/assets/icons/flags/RO.svg": {
    "type": "image/svg+xml",
    "etag": "\"431-eTRWE7TO3DRpkZdRyMC+a/mZRIw\"",
    "mtime": "2026-11-02T09:13:40.145Z",
    "size": 1073,
    "path": "../public/assets/icons/flags/RO.svg"
  },
  "/assets/icons/flags/RS.svg": {
    "type": "image/svg+xml",
    "etag": "\"651-Lfj+bfj4epaMWSQSXISqxPnDxW8\"",
    "mtime": "2026-11-02T09:13:40.147Z",
    "size": 1617,
    "path": "../public/assets/icons/flags/RS.svg"
  },
  "/assets/icons/flags/RU.svg": {
    "type": "image/svg+xml",
    "etag": "\"42f-ziwO0yURSv+UB+r+v7WY2aiMUNg\"",
    "mtime": "2026-11-02T09:13:40.145Z",
    "size": 1071,
    "path": "../public/assets/icons/flags/RU.svg"
  },
  "/assets/icons/flags/RW.svg": {
    "type": "image/svg+xml",
    "etag": "\"573-h9GsnuZwm8Non9ZDE19gMLiMH3I\"",
    "mtime": "2026-11-02T09:13:40.147Z",
    "size": 1395,
    "path": "../public/assets/icons/flags/RW.svg"
  },
  "/assets/icons/flags/SA.svg": {
    "type": "image/svg+xml",
    "etag": "\"5f24-HOB7iRaUdUVgnCpFMs6QNiB4Vms\"",
    "mtime": "2026-11-02T09:13:40.149Z",
    "size": 24356,
    "path": "../public/assets/icons/flags/SA.svg"
  },
  "/assets/icons/flags/SB.svg": {
    "type": "image/svg+xml",
    "etag": "\"73f-nDgus73BswjnGPjP2nsYnQx4O+A\"",
    "mtime": "2026-11-02T09:13:40.147Z",
    "size": 1855,
    "path": "../public/assets/icons/flags/SB.svg"
  },
  "/assets/icons/flags/SD.svg": {
    "type": "image/svg+xml",
    "etag": "\"488-59moXieHf5nL8onM5IfWpURF5Gs\"",
    "mtime": "2026-11-02T09:13:40.147Z",
    "size": 1160,
    "path": "../public/assets/icons/flags/SD.svg"
  },
  "/assets/icons/flags/SE.svg": {
    "type": "image/svg+xml",
    "etag": "\"3ed-mWtNP1MAuw7flVyOaZ2oh+QLAtQ\"",
    "mtime": "2026-11-02T09:13:40.147Z",
    "size": 1005,
    "path": "../public/assets/icons/flags/SE.svg"
  },
  "/assets/icons/flags/SC.svg": {
    "type": "image/svg+xml",
    "etag": "\"4de-I9z8m6KrNZoQBJcAcUJVdhbazX8\"",
    "mtime": "2026-11-02T09:13:40.147Z",
    "size": 1246,
    "path": "../public/assets/icons/flags/SC.svg"
  },
  "/assets/icons/flags/SG.svg": {
    "type": "image/svg+xml",
    "etag": "\"509-QrWeMPeHll/yG4Qt5b9SA609N7Q\"",
    "mtime": "2026-11-02T09:13:40.149Z",
    "size": 1289,
    "path": "../public/assets/icons/flags/SG.svg"
  },
  "/assets/icons/flags/SH.svg": {
    "type": "image/svg+xml",
    "etag": "\"1865d-86PNtQuR2fkq72Yr+1d6bRZrTAw\"",
    "mtime": "2026-11-02T09:13:40.149Z",
    "size": 99933,
    "path": "../public/assets/icons/flags/SH.svg"
  },
  "/assets/icons/flags/SI.svg": {
    "type": "image/svg+xml",
    "etag": "\"60f-8Y/3EBJO9C17BKx5wn+Dj3+f3fI\"",
    "mtime": "2026-11-02T09:13:40.149Z",
    "size": 1551,
    "path": "../public/assets/icons/flags/SI.svg"
  },
  "/assets/icons/flags/SK.svg": {
    "type": "image/svg+xml",
    "etag": "\"64c-azZD6bzsenDmbySRLaMKPr2YBjo\"",
    "mtime": "2026-11-02T09:13:40.149Z",
    "size": 1612,
    "path": "../public/assets/icons/flags/SK.svg"
  },
  "/assets/icons/flags/SL.svg": {
    "type": "image/svg+xml",
    "etag": "\"42f-yJjjLyo6hQj1pPg+4/dzs8slb7A\"",
    "mtime": "2026-11-02T09:13:40.149Z",
    "size": 1071,
    "path": "../public/assets/icons/flags/SL.svg"
  },
  "/assets/icons/flags/SM.svg": {
    "type": "image/svg+xml",
    "etag": "\"5d3-ASiV7B6yJfLUSikhIQ83jZZHyL0\"",
    "mtime": "2026-11-02T09:13:40.149Z",
    "size": 1491,
    "path": "../public/assets/icons/flags/SM.svg"
  },
  "/assets/icons/flags/SN.svg": {
    "type": "image/svg+xml",
    "etag": "\"4fb-cl/w3td4XT/fpMq7s8nB0MokjEo\"",
    "mtime": "2026-11-02T09:13:40.150Z",
    "size": 1275,
    "path": "../public/assets/icons/flags/SN.svg"
  },
  "/assets/icons/flags/SR.svg": {
    "type": "image/svg+xml",
    "etag": "\"508-ldqPEfAdAS9Nt2Iuq87U4VoH8Pw\"",
    "mtime": "2026-11-02T09:13:40.149Z",
    "size": 1288,
    "path": "../public/assets/icons/flags/SR.svg"
  },
  "/assets/icons/flags/SO.svg": {
    "type": "image/svg+xml",
    "etag": "\"454-dgvwYlUuzi1CU4OUXUX0Lbc3H4k\"",
    "mtime": "2026-11-02T09:13:40.150Z",
    "size": 1108,
    "path": "../public/assets/icons/flags/SO.svg"
  },
  "/assets/icons/flags/SS.svg": {
    "type": "image/svg+xml",
    "etag": "\"5cc-623NnSZeeVWA/fi8GFbGLQl1jVg\"",
    "mtime": "2026-11-02T09:13:40.152Z",
    "size": 1484,
    "path": "../public/assets/icons/flags/SS.svg"
  },
  "/assets/icons/flags/ST.svg": {
    "type": "image/svg+xml",
    "etag": "\"5a4-yAR+xhMLhWjCt9vkMM8c4thtYGM\"",
    "mtime": "2026-11-02T09:13:40.150Z",
    "size": 1444,
    "path": "../public/assets/icons/flags/ST.svg"
  },
  "/assets/icons/flags/SV.svg": {
    "type": "image/svg+xml",
    "etag": "\"579-koGZW8UshKSFAO1SFsaLUYEn/MA\"",
    "mtime": "2026-11-02T09:13:40.150Z",
    "size": 1401,
    "path": "../public/assets/icons/flags/SV.svg"
  },
  "/assets/icons/flags/SX.svg": {
    "type": "image/svg+xml",
    "etag": "\"552-17vHjUIr46uzKxtH+x8A6PUdScU\"",
    "mtime": "2026-11-02T09:13:40.150Z",
    "size": 1362,
    "path": "../public/assets/icons/flags/SX.svg"
  },
  "/assets/icons/flags/SY.svg": {
    "type": "image/svg+xml",
    "etag": "\"58b-AnpqlvWoDgKLtJ6NjayMLjcYPRI\"",
    "mtime": "2026-11-02T09:13:40.150Z",
    "size": 1419,
    "path": "../public/assets/icons/flags/SY.svg"
  },
  "/assets/icons/flags/SZ.svg": {
    "type": "image/svg+xml",
    "etag": "\"6fc-iH+xTieCOMfe0iI/2Tv63WFz5IE\"",
    "mtime": "2026-11-02T09:13:40.151Z",
    "size": 1788,
    "path": "../public/assets/icons/flags/SZ.svg"
  },
  "/assets/icons/flags/TAAF.svg": {
    "type": "image/svg+xml",
    "etag": "\"cca-qgH8CXBLUf3NMTPBmn7Accouc64\"",
    "mtime": "2026-11-02T09:13:40.151Z",
    "size": 3274,
    "path": "../public/assets/icons/flags/TAAF.svg"
  },
  "/assets/icons/flags/TC.svg": {
    "type": "image/svg+xml",
    "etag": "\"6f3c-LMGUwNv9Q034C3kQOfSMpCALL8U\"",
    "mtime": "2026-11-02T09:13:40.151Z",
    "size": 28476,
    "path": "../public/assets/icons/flags/TC.svg"
  },
  "/assets/icons/flags/TD.svg": {
    "type": "image/svg+xml",
    "etag": "\"431-7VljaCCwCQSo7XDqKQR3mljG84c\"",
    "mtime": "2026-11-02T09:13:40.151Z",
    "size": 1073,
    "path": "../public/assets/icons/flags/TD.svg"
  },
  "/assets/icons/flags/TG.svg": {
    "type": "image/svg+xml",
    "etag": "\"511-zcT00njHzP3QmbLFqRf9V8JmGRQ\"",
    "mtime": "2026-11-02T09:13:40.151Z",
    "size": 1297,
    "path": "../public/assets/icons/flags/TG.svg"
  },
  "/assets/icons/flags/TH.svg": {
    "type": "image/svg+xml",
    "etag": "\"43e-iBEStBQ/jNYgR03YMicJs1xU8j0\"",
    "mtime": "2026-11-02T09:13:40.151Z",
    "size": 1086,
    "path": "../public/assets/icons/flags/TH.svg"
  },
  "/assets/icons/flags/TJ.svg": {
    "type": "image/svg+xml",
    "etag": "\"58a-XTxAqZG94y9yJj56wSIynGn7FmY\"",
    "mtime": "2026-11-02T09:13:40.151Z",
    "size": 1418,
    "path": "../public/assets/icons/flags/TJ.svg"
  },
  "/assets/icons/flags/TK.svg": {
    "type": "image/svg+xml",
    "etag": "\"669-rhwY8xuWBpbdov8inadrEwTHDoU\"",
    "mtime": "2026-11-02T09:13:40.151Z",
    "size": 1641,
    "path": "../public/assets/icons/flags/TK.svg"
  },
  "/assets/icons/flags/TL.svg": {
    "type": "image/svg+xml",
    "etag": "\"4fe-acc0YUsX8nG6GncWIvyJKNBy7Xo\"",
    "mtime": "2026-11-02T09:13:40.153Z",
    "size": 1278,
    "path": "../public/assets/icons/flags/TL.svg"
  },
  "/assets/icons/flags/TM.svg": {
    "type": "image/svg+xml",
    "etag": "\"6d6-9yCtY/vDjkrtZXleGovj0GORBJM\"",
    "mtime": "2026-11-02T09:13:40.152Z",
    "size": 1750,
    "path": "../public/assets/icons/flags/TM.svg"
  },
  "/assets/icons/flags/TN.svg": {
    "type": "image/svg+xml",
    "etag": "\"550-h0nvXAqPZKcH3CZQPe1dJWe1JI4\"",
    "mtime": "2026-11-02T09:13:40.151Z",
    "size": 1360,
    "path": "../public/assets/icons/flags/TN.svg"
  },
  "/assets/icons/flags/TO.svg": {
    "type": "image/svg+xml",
    "etag": "\"43b-R47PD5z4LiKIIbVPYsE3P2Kw4Nk\"",
    "mtime": "2026-11-02T09:13:40.151Z",
    "size": 1083,
    "path": "../public/assets/icons/flags/TO.svg"
  },
  "/assets/icons/flags/TR.svg": {
    "type": "image/svg+xml",
    "etag": "\"567-6OYl5R8dLEs9vsh4qdVQWcSFfks\"",
    "mtime": "2026-11-02T09:13:40.152Z",
    "size": 1383,
    "path": "../public/assets/icons/flags/TR.svg"
  },
  "/assets/icons/flags/TT.svg": {
    "type": "image/svg+xml",
    "etag": "\"438-uiSWRZ1JnuRcp2Vj01NZtK9ZtfM\"",
    "mtime": "2026-11-02T09:13:40.152Z",
    "size": 1080,
    "path": "../public/assets/icons/flags/TT.svg"
  },
  "/assets/icons/flags/TV.svg": {
    "type": "image/svg+xml",
    "etag": "\"55d-slZ7TQJOLdW4ypiJmC+PrKeiMbM\"",
    "mtime": "2026-11-02T09:13:40.152Z",
    "size": 1373,
    "path": "../public/assets/icons/flags/TV.svg"
  },
  "/assets/icons/flags/TW.svg": {
    "type": "image/svg+xml",
    "etag": "\"46d-bQ9kFmS3WWSouasPvyDmvhGbEnY\"",
    "mtime": "2026-11-02T09:13:40.152Z",
    "size": 1133,
    "path": "../public/assets/icons/flags/TW.svg"
  },
  "/assets/icons/flags/TZ.svg": {
    "type": "image/svg+xml",
    "etag": "\"4eb-0WBXdNvCORecVVDDq+By7thXU1E\"",
    "mtime": "2026-11-02T09:13:40.152Z",
    "size": 1259,
    "path": "../public/assets/icons/flags/TZ.svg"
  },
  "/assets/icons/flags/UA.svg": {
    "type": "image/svg+xml",
    "etag": "\"3dc-/u6/aLc3oEfHLI40b1/BHnJhKJo\"",
    "mtime": "2026-11-02T09:13:40.153Z",
    "size": 988,
    "path": "../public/assets/icons/flags/UA.svg"
  },
  "/assets/icons/flags/UG.svg": {
    "type": "image/svg+xml",
    "etag": "\"60c-s16fvJR/pmHoLwa7voMRVZl44fI\"",
    "mtime": "2026-11-02T09:13:40.152Z",
    "size": 1548,
    "path": "../public/assets/icons/flags/UG.svg"
  },
  "/assets/icons/flags/UM.svg": {
    "type": "image/svg+xml",
    "etag": "\"5c4-ji6dnqe1M0uxKrMZ+R2kwI+gzVE\"",
    "mtime": "2026-11-02T09:13:40.153Z",
    "size": 1476,
    "path": "../public/assets/icons/flags/UM.svg"
  },
  "/assets/icons/flags/US.svg": {
    "type": "image/svg+xml",
    "etag": "\"5c4-oWgJplG7IJLP+wa/c75YeBL7eac\"",
    "mtime": "2026-11-02T09:13:40.154Z",
    "size": 1476,
    "path": "../public/assets/icons/flags/US.svg"
  },
  "/assets/icons/flags/UY.svg": {
    "type": "image/svg+xml",
    "etag": "\"6d0-tMax10Oi6E0Sl7/Niv1p+axY/hk\"",
    "mtime": "2026-11-02T09:13:40.153Z",
    "size": 1744,
    "path": "../public/assets/icons/flags/UY.svg"
  },
  "/assets/icons/flags/UZ.svg": {
    "type": "image/svg+xml",
    "etag": "\"5c4-rQdIV9o3QQtbfLxcZjBEY9YFSkA\"",
    "mtime": "2026-11-02T09:13:40.154Z",
    "size": 1476,
    "path": "../public/assets/icons/flags/UZ.svg"
  },
  "/assets/icons/flags/VA.svg": {
    "type": "image/svg+xml",
    "etag": "\"512-LFUSLsUY22IG2CVUCPeW1AGltmg\"",
    "mtime": "2026-11-02T09:13:40.155Z",
    "size": 1298,
    "path": "../public/assets/icons/flags/VA.svg"
  },
  "/assets/icons/flags/VC.svg": {
    "type": "image/svg+xml",
    "etag": "\"484-e4wwPCXCcKvenFL7a140bI33mho\"",
    "mtime": "2026-11-02T09:13:40.154Z",
    "size": 1156,
    "path": "../public/assets/icons/flags/VC.svg"
  },
  "/assets/icons/flags/VE.svg": {
    "type": "image/svg+xml",
    "etag": "\"4bf-PaP1mL3DHhm0O345PQLSwcrZY4Y\"",
    "mtime": "2026-11-02T09:13:40.154Z",
    "size": 1215,
    "path": "../public/assets/icons/flags/VE.svg"
  },
  "/assets/icons/flags/VG.svg": {
    "type": "image/svg+xml",
    "etag": "\"f955-YIfHrMsu9hQQEIBkjXce05udors\"",
    "mtime": "2026-11-02T09:13:40.155Z",
    "size": 63829,
    "path": "../public/assets/icons/flags/VG.svg"
  },
  "/assets/icons/flags/VI.svg": {
    "type": "image/svg+xml",
    "etag": "\"72a-z+0k1ihQoV2QaVUls6rO95+Vs/4\"",
    "mtime": "2026-11-02T09:13:40.155Z",
    "size": 1834,
    "path": "../public/assets/icons/flags/VI.svg"
  },
  "/assets/icons/flags/VN.svg": {
    "type": "image/svg+xml",
    "etag": "\"456-qUQC92ssHcBF1ZYkq8NuVeIdiG0\"",
    "mtime": "2026-11-02T09:13:40.155Z",
    "size": 1110,
    "path": "../public/assets/icons/flags/VN.svg"
  },
  "/assets/icons/flags/VU.svg": {
    "type": "image/svg+xml",
    "etag": "\"67b-rwAUZ9McjBg+ngEQEIM+LwYZoYI\"",
    "mtime": "2026-11-02T09:13:40.155Z",
    "size": 1659,
    "path": "../public/assets/icons/flags/VU.svg"
  },
  "/assets/icons/flags/WF.svg": {
    "type": "image/svg+xml",
    "etag": "\"3f4-+QQVU17+0gxiK0RZKQtVZU66vok\"",
    "mtime": "2026-11-02T09:13:40.155Z",
    "size": 1012,
    "path": "../public/assets/icons/flags/WF.svg"
  },
  "/assets/icons/flags/WS.svg": {
    "type": "image/svg+xml",
    "etag": "\"5bd-7q+pLmN6W/oqtI4+VuSphtIuDjE\"",
    "mtime": "2026-11-02T09:13:40.158Z",
    "size": 1469,
    "path": "../public/assets/icons/flags/WS.svg"
  },
  "/assets/icons/flags/XK.svg": {
    "type": "image/svg+xml",
    "etag": "\"1a58-CC94v/MOckW8IPw7Q+ZepeqDcww\"",
    "mtime": "2026-11-02T09:13:40.156Z",
    "size": 6744,
    "path": "../public/assets/icons/flags/XK.svg"
  },
  "/assets/icons/flags/YE.svg": {
    "type": "image/svg+xml",
    "etag": "\"42d-N+5ToK4ZtCAAK1uS/SVIKTowy24\"",
    "mtime": "2026-11-02T09:13:40.155Z",
    "size": 1069,
    "path": "../public/assets/icons/flags/YE.svg"
  },
  "/assets/icons/flags/ZA.svg": {
    "type": "image/svg+xml",
    "etag": "\"5b7-/ZzVpXcOi7/X8OqA0cEoHyCgeXE\"",
    "mtime": "2026-11-02T09:13:40.156Z",
    "size": 1463,
    "path": "../public/assets/icons/flags/ZA.svg"
  },
  "/assets/icons/flags/ZM.svg": {
    "type": "image/svg+xml",
    "etag": "\"4f2-+iFcGrimq9YjNbZrepX1IhQRSLg\"",
    "mtime": "2026-11-02T09:13:40.155Z",
    "size": 1266,
    "path": "../public/assets/icons/flags/ZM.svg"
  },
  "/assets/icons/flags/ZW.svg": {
    "type": "image/svg+xml",
    "etag": "\"65c-eeTme7iXCrL++6lfNVpTacTB4tU\"",
    "mtime": "2026-11-02T09:13:40.156Z",
    "size": 1628,
    "path": "../public/assets/icons/flags/ZW.svg"
  },
  "/assets/icons/platform/IP_ic_Adyen.svg": {
    "type": "image/svg+xml",
    "etag": "\"235-ior2RnPBUZMnCf8l2XWK6qigQZY\"",
    "mtime": "2026-11-02T09:13:40.158Z",
    "size": 565,
    "path": "../public/assets/icons/platform/IP_ic_Adyen.svg"
  },
  "/assets/icons/platform/IP_ic_11street.svg": {
    "type": "image/svg+xml",
    "etag": "\"61b-xiY1YajOWsemFX9DGnKmqth2v4o\"",
    "mtime": "2026-11-02T09:13:40.158Z",
    "size": 1563,
    "path": "../public/assets/icons/platform/IP_ic_11street.svg"
  },
  "/assets/icons/flags/YT.svg": {
    "type": "image/svg+xml",
    "etag": "\"16d87-GJgPN3c27v/jcnrBywZL/NgiZgU\"",
    "mtime": "2026-11-02T09:13:40.158Z",
    "size": 93575,
    "path": "../public/assets/icons/flags/YT.svg"
  },
  "/assets/icons/platform/IP_ic_AliExpress.svg": {
    "type": "image/svg+xml",
    "etag": "\"14db-xsWiJORzg/nFs5w49yVQ29SAZhk\"",
    "mtime": "2026-11-02T09:13:40.072Z",
    "size": 5339,
    "path": "../public/assets/icons/platform/IP_ic_AliExpress.svg"
  },
  "/assets/icons/platform/IP_ic_Alibaba.svg": {
    "type": "image/svg+xml",
    "etag": "\"bb2-rymYQLRVtanyS8jmfWPvaQI5N9o\"",
    "mtime": "2026-11-02T09:13:40.160Z",
    "size": 2994,
    "path": "../public/assets/icons/platform/IP_ic_Alibaba.svg"
  },
  "/assets/icons/platform/IP_ic_Alipay.svg": {
    "type": "image/svg+xml",
    "etag": "\"e51-HdqleeXraTcGrDjcQrD6JyQzyVc\"",
    "mtime": "2026-11-02T09:13:40.159Z",
    "size": 3665,
    "path": "../public/assets/icons/platform/IP_ic_Alipay.svg"
  },
  "/assets/icons/platform/IP_ic_Allegro.svg": {
    "type": "image/svg+xml",
    "etag": "\"183d-TSPH6W52+uAXuhHKEMB5HacT5g0\"",
    "mtime": "2026-11-02T09:13:40.158Z",
    "size": 6205,
    "path": "../public/assets/icons/platform/IP_ic_Allegro.svg"
  },
  "/assets/icons/platform/IP_ic_Amazon.svg": {
    "type": "image/svg+xml",
    "etag": "\"a60-fMCRB+IY/zfApa0aKEJF5q55I80\"",
    "mtime": "2026-11-02T09:13:40.161Z",
    "size": 2656,
    "path": "../public/assets/icons/platform/IP_ic_Amazon.svg"
  },
  "/assets/icons/platform/IP_ic_Amazon_Prime_Video.svg": {
    "type": "image/svg+xml",
    "etag": "\"386e-7nEI8fVniWL2jGYqPQOqbe075bc\"",
    "mtime": "2026-11-02T09:13:40.159Z",
    "size": 14446,
    "path": "../public/assets/icons/platform/IP_ic_Amazon_Prime_Video.svg"
  },
  "/assets/icons/platform/IP_ic_Americanas.svg": {
    "type": "image/svg+xml",
    "etag": "\"45ef-818iGTJZXJqE2UwLJepgCRW5FuA\"",
    "mtime": "2026-11-02T09:13:40.158Z",
    "size": 17903,
    "path": "../public/assets/icons/platform/IP_ic_Americanas.svg"
  },
  "/assets/icons/platform/IP_ic_B&Q.svg": {
    "type": "image/svg+xml",
    "etag": "\"ba8-R6Hkk7TrUjcImG9e4XQoF1SKx1U\"",
    "mtime": "2026-11-02T09:13:40.159Z",
    "size": 2984,
    "path": "../public/assets/icons/platform/IP_ic_B&Q.svg"
  },
  "/assets/icons/platform/IP_ic_Amazon_ads.svg": {
    "type": "image/svg+xml",
    "etag": "\"5beb0-SLuUQcjXPVCYrpkJ2aGfvAUHgo0\"",
    "mtime": "2026-11-02T09:13:40.160Z",
    "size": 376496,
    "path": "../public/assets/icons/platform/IP_ic_Amazon_ads.svg"
  },
  "/assets/icons/platform/IP_ic_B2W_Group.svg": {
    "type": "image/svg+xml",
    "etag": "\"2179-30jkPFQuX+OTtafDvy8QyYaVjY4\"",
    "mtime": "2026-11-02T09:13:40.159Z",
    "size": 8569,
    "path": "../public/assets/icons/platform/IP_ic_B2W_Group.svg"
  },
  "/assets/icons/platform/IP_ic_Bukalapak.svg": {
    "type": "image/svg+xml",
    "etag": "\"483-urM9ASueoXTJKgkn4h94xMjMytU\"",
    "mtime": "2026-11-02T09:13:40.160Z",
    "size": 1155,
    "path": "../public/assets/icons/platform/IP_ic_Bukalapak.svg"
  },
  "/assets/icons/platform/IP_ic_CasasBahia.svg": {
    "type": "image/svg+xml",
    "etag": "\"166c-qlbThVnw1ggLt7JuM/SPCWrA0BY\"",
    "mtime": "2026-11-02T09:13:40.160Z",
    "size": 5740,
    "path": "../public/assets/icons/platform/IP_ic_CasasBahia.svg"
  },
  "/assets/icons/platform/IP_ic_Catch.svg": {
    "type": "image/svg+xml",
    "etag": "\"fa0-WFU7P86qmEi5mNeJJv97SVHgomk\"",
    "mtime": "2026-11-02T09:13:40.160Z",
    "size": 4000,
    "path": "../public/assets/icons/platform/IP_ic_Catch.svg"
  },
  "/assets/icons/platform/IP_ic_Coupang.svg": {
    "type": "image/svg+xml",
    "etag": "\"80b-7Ap1VPNKLM2y6ujn9tPHm7MVkBI\"",
    "mtime": "2026-11-02T09:13:40.161Z",
    "size": 2059,
    "path": "../public/assets/icons/platform/IP_ic_Coupang.svg"
  },
  "/assets/icons/platform/IP_ic_Crawlee.svg": {
    "type": "image/svg+xml",
    "etag": "\"10d4-SSbDpsVQsnYtqZaBGPISACGJke0\"",
    "mtime": "2026-11-02T09:13:40.160Z",
    "size": 4308,
    "path": "../public/assets/icons/platform/IP_ic_Crawlee.svg"
  },
  "/assets/icons/platform/IP_ic_DHgate.svg": {
    "type": "image/svg+xml",
    "etag": "\"1699-Z0TzFqhIBtmq21V05D9PWU6DvR8\"",
    "mtime": "2026-11-02T09:13:40.160Z",
    "size": 5785,
    "path": "../public/assets/icons/platform/IP_ic_DHgate.svg"
  },
  "/assets/icons/platform/IP_ic_Crunchyroll.svg": {
    "type": "image/svg+xml",
    "etag": "\"a04-sfBXbhNqcB7UBH3pmYFbaj68J2M\"",
    "mtime": "2026-11-02T09:13:40.160Z",
    "size": 2564,
    "path": "../public/assets/icons/platform/IP_ic_Crunchyroll.svg"
  },
  "/assets/icons/platform/IP_ic_Debenhams.svg": {
    "type": "image/svg+xml",
    "etag": "\"18f3-zMa8aUokRec3hRaTSofbt7VjNpw\"",
    "mtime": "2026-11-02T09:13:40.161Z",
    "size": 6387,
    "path": "../public/assets/icons/platform/IP_ic_Debenhams.svg"
  },
  "/assets/icons/platform/IP_ic_Disney.svg": {
    "type": "image/svg+xml",
    "etag": "\"ffe-B2VYwC1uO+fYRdnrqUSO6YHtPkQ\"",
    "mtime": "2026-11-02T09:13:40.161Z",
    "size": 4094,
    "path": "../public/assets/icons/platform/IP_ic_Disney.svg"
  },
  "/assets/icons/platform/IP_ic_EZbuy.svg": {
    "type": "image/svg+xml",
    "etag": "\"c71-4jGvVPCypIttRIqVkmA4umZ6p5w\"",
    "mtime": "2026-11-02T09:13:40.161Z",
    "size": 3185,
    "path": "../public/assets/icons/platform/IP_ic_EZbuy.svg"
  },
  "/assets/icons/platform/IP_ic_Empik.svg": {
    "type": "image/svg+xml",
    "etag": "\"783-B0Gv6H+BBHMcU5+L4FULflP5jiM\"",
    "mtime": "2026-11-02T09:13:40.161Z",
    "size": 1923,
    "path": "../public/assets/icons/platform/IP_ic_Empik.svg"
  },
  "/assets/icons/platform/IP_ic_Etsy.svg": {
    "type": "image/svg+xml",
    "etag": "\"48d-rywGKesitLbMICO5N7g6gH5F34k\"",
    "mtime": "2026-11-02T09:13:40.161Z",
    "size": 1165,
    "path": "../public/assets/icons/platform/IP_ic_Etsy.svg"
  },
  "/assets/icons/platform/IP_ic_Facebook.svg": {
    "type": "image/svg+xml",
    "etag": "\"1a3-kS7FiRadKI0pZpRmfI7L1dq4rh4\"",
    "mtime": "2026-11-02T09:13:40.161Z",
    "size": 419,
    "path": "../public/assets/icons/platform/IP_ic_Facebook.svg"
  },
  "/assets/icons/platform/IP_ic_Fruugo.svg": {
    "type": "image/svg+xml",
    "etag": "\"13ab-gdyUp/dSvCAd6zQb4EBnWgzuax8\"",
    "mtime": "2026-11-02T09:13:40.161Z",
    "size": 5035,
    "path": "../public/assets/icons/platform/IP_ic_Fruugo.svg"
  },
  "/assets/icons/platform/IP_ic_Fyndiq.svg": {
    "type": "image/svg+xml",
    "etag": "\"1bfd-WBMWKb9T3zXs76XhkigYujMMv7A\"",
    "mtime": "2026-11-02T09:13:40.162Z",
    "size": 7165,
    "path": "../public/assets/icons/platform/IP_ic_Fyndiq.svg"
  },
  "/assets/icons/platform/IP_ic_GMX.svg": {
    "type": "image/svg+xml",
    "etag": "\"3f7-UxMrmeEmVC3Im5N193kMUYfnx5I\"",
    "mtime": "2026-11-02T09:13:40.161Z",
    "size": 1015,
    "path": "../public/assets/icons/platform/IP_ic_GMX.svg"
  },
  "/assets/icons/platform/IP_ic_Hepsiburada.svg": {
    "type": "image/svg+xml",
    "etag": "\"2d12-6iw5RgKGnttHvUe3IMdFIEXfTo8\"",
    "mtime": "2026-11-02T09:13:40.162Z",
    "size": 11538,
    "path": "../public/assets/icons/platform/IP_ic_Hepsiburada.svg"
  },
  "/assets/icons/platform/IP_ic_Hulu.svg": {
    "type": "image/svg+xml",
    "etag": "\"1ff-C76P8wE/ixyQlwcz5zjnoY5BJlI\"",
    "mtime": "2026-11-02T09:13:40.162Z",
    "size": 511,
    "path": "../public/assets/icons/platform/IP_ic_Hulu.svg"
  },
  "/assets/icons/platform/IP_ic_Gmail.svg": {
    "type": "image/svg+xml",
    "etag": "\"2cf-yRS+nSQ6g8pCvg6IXNvbikb719g\"",
    "mtime": "2026-11-02T09:13:40.161Z",
    "size": 719,
    "path": "../public/assets/icons/platform/IP_ic_Gmail.svg"
  },
  "/assets/icons/platform/IP_ic_JDCENTRAL.svg": {
    "type": "image/svg+xml",
    "etag": "\"52b12-uEu2FM+NJx9fAG8EKSFPjkkUuvk\"",
    "mtime": "2026-11-02T09:13:40.166Z",
    "size": 338706,
    "path": "../public/assets/icons/platform/IP_ic_JDCENTRAL.svg"
  },
  "/assets/icons/platform/IP_ic_Jumia.svg": {
    "type": "image/svg+xml",
    "etag": "\"4bbc-3eznl0QByat3EeHzTlTudUQ6Mow\"",
    "mtime": "2026-11-02T09:13:40.162Z",
    "size": 19388,
    "path": "../public/assets/icons/platform/IP_ic_Jumia.svg"
  },
  "/assets/icons/platform/IP_ic_Kilimall.svg": {
    "type": "image/svg+xml",
    "etag": "\"8a1-XHKAlybUxMFIme23Ym3r4P0GBIQ\"",
    "mtime": "2026-11-02T09:13:40.162Z",
    "size": 2209,
    "path": "../public/assets/icons/platform/IP_ic_Kilimall.svg"
  },
  "/assets/icons/platform/IP_ic_KASPI.svg": {
    "type": "image/svg+xml",
    "etag": "\"15df-BvmeaoJgBz3zzv+N6FxlPWp0VnA\"",
    "mtime": "2026-11-02T09:13:40.165Z",
    "size": 5599,
    "path": "../public/assets/icons/platform/IP_ic_KASPI.svg"
  },
  "/assets/icons/platform/IP_ic_Kogan.svg": {
    "type": "image/svg+xml",
    "etag": "\"224d-rlpGKmzpElrgPACS6jaZjaxqasg\"",
    "mtime": "2026-11-02T09:13:40.162Z",
    "size": 8781,
    "path": "../public/assets/icons/platform/IP_ic_Kogan.svg"
  },
  "/assets/icons/platform/IP_ic_MONMALL.svg": {
    "type": "image/svg+xml",
    "etag": "\"4c5-zO7Fpl5ek7TgkHEK8QSv/qtgITQ\"",
    "mtime": "2026-11-02T09:13:40.162Z",
    "size": 1221,
    "path": "../public/assets/icons/platform/IP_ic_MONMALL.svg"
  },
  "/assets/icons/platform/IP_ic_Mail.com.svg": {
    "type": "image/svg+xml",
    "etag": "\"443-/+qiht6bfdTzoPxgN7QjzHRBIDE\"",
    "mtime": "2026-11-02T09:13:40.162Z",
    "size": 1091,
    "path": "../public/assets/icons/platform/IP_ic_Mail.com.svg"
  },
  "/assets/icons/platform/IP_ic_Mail.ru.svg": {
    "type": "image/svg+xml",
    "etag": "\"533-lRBK5OAimgeJV3Undjc4QjJHMuM\"",
    "mtime": "2026-11-02T09:13:40.163Z",
    "size": 1331,
    "path": "../public/assets/icons/platform/IP_ic_Mail.ru.svg"
  },
  "/assets/icons/platform/IP_ic_Makro.svg": {
    "type": "image/svg+xml",
    "etag": "\"fbb-EWCzkCDDbqURvOWbEDqsF3I9tFE\"",
    "mtime": "2026-11-02T09:13:40.162Z",
    "size": 4027,
    "path": "../public/assets/icons/platform/IP_ic_Makro.svg"
  },
  "/assets/icons/platform/IP_ic_ManoMano.svg": {
    "type": "image/svg+xml",
    "etag": "\"490-bXw2eYXbuhPzo1NRpVPYLkJs7aI\"",
    "mtime": "2026-11-02T09:13:40.163Z",
    "size": 1168,
    "path": "../public/assets/icons/platform/IP_ic_ManoMano.svg"
  },
  "/assets/icons/platform/IP_ic_MercadoLibre.svg": {
    "type": "image/svg+xml",
    "etag": "\"316e-NTbmYw5VOQVJs+blep+nAysaM2I\"",
    "mtime": "2026-11-02T09:13:40.162Z",
    "size": 12654,
    "path": "../public/assets/icons/platform/IP_ic_MercadoLibre.svg"
  },
  "/assets/icons/platform/IP_ic_Miravia.svg": {
    "type": "image/svg+xml",
    "etag": "\"478-knRDAgD+TEmpUa8mRBzBYexgw/Y\"",
    "mtime": "2026-11-02T09:13:40.165Z",
    "size": 1144,
    "path": "../public/assets/icons/platform/IP_ic_Miravia.svg"
  },
  "/assets/icons/platform/IP_ic_N11.svg": {
    "type": "image/svg+xml",
    "etag": "\"929-e9uYTH310NVho2kJcOQ0Tiu/qPs\"",
    "mtime": "2026-11-02T09:13:40.166Z",
    "size": 2345,
    "path": "../public/assets/icons/platform/IP_ic_N11.svg"
  },
  "/assets/icons/platform/IP_ic_Octopia.svg": {
    "type": "image/svg+xml",
    "etag": "\"e01-3+/iHz71fBCZZ2XMFZ013Y1QVro\"",
    "mtime": "2026-11-02T09:13:40.165Z",
    "size": 3585,
    "path": "../public/assets/icons/platform/IP_ic_Octopia.svg"
  },
  "/assets/icons/platform/IP_ic_OkCupid.svg": {
    "type": "image/svg+xml",
    "etag": "\"12b0-pk9Jn4mIO3Lg+PXDP+HjGayBZDA\"",
    "mtime": "2026-11-02T09:13:40.165Z",
    "size": 4784,
    "path": "../public/assets/icons/platform/IP_ic_OkCupid.svg"
  },
  "/assets/icons/platform/IP_ic_Onet.pl.svg": {
    "type": "image/svg+xml",
    "etag": "\"2d3-l9gBKLClM1h6JdfIw4M5vGHYW38\"",
    "mtime": "2026-11-02T09:13:40.165Z",
    "size": 723,
    "path": "../public/assets/icons/platform/IP_ic_Onet.pl.svg"
  },
  "/assets/icons/platform/IP_ic_Outlook.svg": {
    "type": "image/svg+xml",
    "etag": "\"1b56-vqnZEouE8faIL/UBTEPdfTraWcI\"",
    "mtime": "2026-11-02T09:13:40.165Z",
    "size": 6998,
    "path": "../public/assets/icons/platform/IP_ic_Outlook.svg"
  },
  "/assets/icons/platform/IP_ic_PayPal.svg": {
    "type": "image/svg+xml",
    "etag": "\"94d-XLBrRT5azVBeYdTfQRSIl0AZqXs\"",
    "mtime": "2026-11-02T09:13:40.166Z",
    "size": 2381,
    "path": "../public/assets/icons/platform/IP_ic_PayPal.svg"
  },
  "/assets/icons/platform/IP_ic_Payoneer.svg": {
    "type": "image/svg+xml",
    "etag": "\"1114-7DnKnmJdp6whcJ7LAICD2WdhJlc\"",
    "mtime": "2026-11-02T09:13:40.166Z",
    "size": 4372,
    "path": "../public/assets/icons/platform/IP_ic_Payoneer.svg"
  },
  "/assets/icons/platform/IP_ic_Ozon.ru.svg": {
    "type": "image/svg+xml",
    "etag": "\"5a7-J60HjwerV4JxkI/PDaq4EsJkpAA\"",
    "mtime": "2026-11-02T09:13:40.166Z",
    "size": 1447,
    "path": "../public/assets/icons/platform/IP_ic_Ozon.ru.svg"
  },
  "/assets/icons/platform/IP_ic_Peacocktv.svg": {
    "type": "image/svg+xml",
    "etag": "\"7e1-dAQi1JLAArocLRiJB4P2wgpU9wU\"",
    "mtime": "2026-11-02T09:13:40.166Z",
    "size": 2017,
    "path": "../public/assets/icons/platform/IP_ic_Peacocktv.svg"
  },
  "/assets/icons/platform/IP_ic_Pingpong.svg": {
    "type": "image/svg+xml",
    "etag": "\"367-Z6NqCZkdjeM7Ds6Oue3LXHSTAWg\"",
    "mtime": "2026-11-02T09:13:40.167Z",
    "size": 871,
    "path": "../public/assets/icons/platform/IP_ic_Pingpong.svg"
  },
  "/assets/icons/platform/IP_ic_Playwright.svg": {
    "type": "image/svg+xml",
    "etag": "\"1573-YmqATn0Bk4PVoe403tqjHA878Jg\"",
    "mtime": "2026-11-02T09:13:40.167Z",
    "size": 5491,
    "path": "../public/assets/icons/platform/IP_ic_Playwright.svg"
  },
  "/assets/icons/platform/IP_ic_Poshmark.svg": {
    "type": "image/svg+xml",
    "etag": "\"57e-mNzfqNTsWoTot83oPJsntms23QM\"",
    "mtime": "2026-11-02T09:13:40.167Z",
    "size": 1406,
    "path": "../public/assets/icons/platform/IP_ic_Poshmark.svg"
  },
  "/assets/icons/platform/IP_ic_Rackhams.svg": {
    "type": "image/svg+xml",
    "etag": "\"f65-6Qbink++kUyTXCbji/axPYCPMw0\"",
    "mtime": "2026-11-02T09:13:40.167Z",
    "size": 3941,
    "path": "../public/assets/icons/platform/IP_ic_Rackhams.svg"
  },
  "/assets/icons/platform/IP_ic_Puppeteer.svg": {
    "type": "image/svg+xml",
    "etag": "\"28eff-Ed2JtbjPuOGieYo91SvVaKQUsfM\"",
    "mtime": "2026-11-02T09:13:40.167Z",
    "size": 167679,
    "path": "../public/assets/icons/platform/IP_ic_Puppeteer.svg"
  },
  "/assets/icons/platform/IP_ic_Rakuten.svg": {
    "type": "image/svg+xml",
    "etag": "\"311-VWM9VWSvaMWkt6qse5pLJXjhDo4\"",
    "mtime": "2026-11-02T09:13:40.167Z",
    "size": 785,
    "path": "../public/assets/icons/platform/IP_ic_Rakuten.svg"
  },
  "/assets/icons/platform/IP_ic_Rambler.ru.svg": {
    "type": "image/svg+xml",
    "etag": "\"291-br9sXQzgi/6iQatqLhuBgWpHndE\"",
    "mtime": "2026-11-02T09:13:40.168Z",
    "size": 657,
    "path": "../public/assets/icons/platform/IP_ic_Rambler.ru.svg"
  },
  "/assets/icons/platform/IP_ic_Scrapy.svg": {
    "type": "image/svg+xml",
    "etag": "\"349-6+thfF+IuKhNXXqjFQji/EpnXDQ\"",
    "mtime": "2026-11-02T09:13:40.167Z",
    "size": 841,
    "path": "../public/assets/icons/platform/IP_ic_Scrapy.svg"
  },
  "/assets/icons/platform/IP_ic_Selenium.svg": {
    "type": "image/svg+xml",
    "etag": "\"1219-aqiH0PRId71n0VEhgWfR3+KzvIQ\"",
    "mtime": "2026-11-02T09:13:40.167Z",
    "size": 4633,
    "path": "../public/assets/icons/platform/IP_ic_Selenium.svg"
  },
  "/assets/icons/platform/IP_ic_Shopee.svg": {
    "type": "image/svg+xml",
    "etag": "\"9b4-BiDNniyaR4aQkZufTK2qmw1P4/Y\"",
    "mtime": "2026-11-02T09:13:40.168Z",
    "size": 2484,
    "path": "../public/assets/icons/platform/IP_ic_Shopee.svg"
  },
  "/assets/icons/platform/IP_ic_Shopify.svg": {
    "type": "image/svg+xml",
    "etag": "\"859-prnEqjAhd2kgTe0GPqL0fjdqhGg\"",
    "mtime": "2026-11-02T09:13:40.168Z",
    "size": 2137,
    "path": "../public/assets/icons/platform/IP_ic_Shopify.svg"
  },
  "/assets/icons/platform/IP_ic_Shoplazza.svg": {
    "type": "image/svg+xml",
    "etag": "\"28f-j4IJwsKci/OjS3laaqFxlVSrzkc\"",
    "mtime": "2026-11-02T09:13:40.168Z",
    "size": 655,
    "path": "../public/assets/icons/platform/IP_ic_Shoplazza.svg"
  },
  "/assets/icons/platform/IP_ic_Skrill.svg": {
    "type": "image/svg+xml",
    "etag": "\"475-QN6YUqC4L5brQ6tSciDpT4FVzuw\"",
    "mtime": "2026-11-02T09:13:40.167Z",
    "size": 1141,
    "path": "../public/assets/icons/platform/IP_ic_Skrill.svg"
  },
  "/assets/icons/platform/IP_ic_Square.svg": {
    "type": "image/svg+xml",
    "etag": "\"3b7-q0LyaQvcILx1vMmGQf+a8cc+fvQ\"",
    "mtime": "2026-11-02T09:13:40.168Z",
    "size": 951,
    "path": "../public/assets/icons/platform/IP_ic_Square.svg"
  },
  "/assets/icons/platform/IP_ic_Stripe.svg": {
    "type": "image/svg+xml",
    "etag": "\"2db-ZB1cQ+Mnq2s++BgFjs7iIyUn3m8\"",
    "mtime": "2026-11-02T09:13:40.168Z",
    "size": 731,
    "path": "../public/assets/icons/platform/IP_ic_Stripe.svg"
  },
  "/assets/icons/platform/IP_ic_Therange.svg": {
    "type": "image/svg+xml",
    "etag": "\"530f-cxHKGoA38K3UL0VjEdfSifz7mq8\"",
    "mtime": "2026-11-02T09:13:40.168Z",
    "size": 21263,
    "path": "../public/assets/icons/platform/IP_ic_Therange.svg"
  },
  "/assets/icons/platform/IP_ic_TospinoMall.svg": {
    "type": "image/svg+xml",
    "etag": "\"1c02-qoiUO01TvAf0aK7zyBOtWcHhQ4w\"",
    "mtime": "2026-11-02T09:13:40.169Z",
    "size": 7170,
    "path": "../public/assets/icons/platform/IP_ic_TospinoMall.svg"
  },
  "/assets/icons/platform/IP_ic_UZUM.svg": {
    "type": "image/svg+xml",
    "etag": "\"50a-xzuhBcmNlwX4ylvMhksxQHsbNE8\"",
    "mtime": "2026-11-02T09:13:40.169Z",
    "size": 1290,
    "path": "../public/assets/icons/platform/IP_ic_UZUM.svg"
  },
  "/assets/icons/platform/IP_ic_Vente-unique.svg": {
    "type": "image/svg+xml",
    "etag": "\"350-LzPBqK1waXLIaTa2o2iGa94daec\"",
    "mtime": "2026-11-02T09:13:40.169Z",
    "size": 848,
    "path": "../public/assets/icons/platform/IP_ic_Vente-unique.svg"
  },
  "/assets/icons/platform/IP_ic_Verifone.svg": {
    "type": "image/svg+xml",
    "etag": "\"69d-jxpy9VUHtKfrLfT+9qBOyjDHIMk\"",
    "mtime": "2026-11-02T09:13:40.169Z",
    "size": 1693,
    "path": "../public/assets/icons/platform/IP_ic_Verifone.svg"
  },
  "/assets/icons/platform/IP_ic_Vinted.svg": {
    "type": "image/svg+xml",
    "etag": "\"38f-/kyyKbGcuzqiD+pU4yq6X+kNV9w\"",
    "mtime": "2026-11-02T09:13:40.169Z",
    "size": 911,
    "path": "../public/assets/icons/platform/IP_ic_Vinted.svg"
  },
  "/assets/icons/platform/IP_ic_Walmart.svg": {
    "type": "image/svg+xml",
    "etag": "\"7f4-OPSlzpIDCbyHVJ8pIAgWfAUbcHk\"",
    "mtime": "2026-11-02T09:13:40.169Z",
    "size": 2036,
    "path": "../public/assets/icons/platform/IP_ic_Walmart.svg"
  },
  "/assets/icons/platform/IP_ic_Voghion.svg": {
    "type": "image/svg+xml",
    "etag": "\"115d-poor/NB9XnJVTN/zYYQW7g0h15o\"",
    "mtime": "2026-11-02T09:13:40.169Z",
    "size": 4445,
    "path": "../public/assets/icons/platform/IP_ic_Voghion.svg"
  },
  "/assets/icons/platform/IP_ic_Wayfair.svg": {
    "type": "image/svg+xml",
    "etag": "\"4e3-fTMvLlAVVfrzQc8+tCrCuAJaJEM\"",
    "mtime": "2026-11-02T09:13:40.169Z",
    "size": 1251,
    "path": "../public/assets/icons/platform/IP_ic_Wayfair.svg"
  },
  "/assets/icons/platform/IP_ic_Web.de.svg": {
    "type": "image/svg+xml",
    "etag": "\"12e5-Q0XrUwM19j+0ScLM5zxX4n+bCqg\"",
    "mtime": "2026-11-02T09:13:40.169Z",
    "size": 4837,
    "path": "../public/assets/icons/platform/IP_ic_Web.de.svg"
  },
  "/assets/icons/platform/IP_ic_Wildberries.svg": {
    "type": "image/svg+xml",
    "etag": "\"abe-T0wSw6NhtOSZ+MfXB1GN9bbykQY\"",
    "mtime": "2026-11-02T09:13:40.170Z",
    "size": 2750,
    "path": "../public/assets/icons/platform/IP_ic_Wildberries.svg"
  },
  "/assets/icons/platform/IP_ic_Wise.svg": {
    "type": "image/svg+xml",
    "etag": "\"169-h2NGhvbLeNr8wCEH76q7ovPxOrI\"",
    "mtime": "2026-11-02T09:13:40.170Z",
    "size": 361,
    "path": "../public/assets/icons/platform/IP_ic_Wise.svg"
  },
  "/assets/icons/platform/IP_ic_Wish.svg": {
    "type": "image/svg+xml",
    "etag": "\"744-FxTDGBt262K7v+emUb7FFsg3HmQ\"",
    "mtime": "2026-11-02T09:13:40.170Z",
    "size": 1860,
    "path": "../public/assets/icons/platform/IP_ic_Wish.svg"
  },
  "/assets/icons/platform/IP_ic_WorldFirst.svg": {
    "type": "image/svg+xml",
    "etag": "\"3d8-o25CyoZRIFgcVVGRfhG64c4017I\"",
    "mtime": "2026-11-02T09:13:40.170Z",
    "size": 984,
    "path": "../public/assets/icons/platform/IP_ic_WorldFirst.svg"
  },
  "/assets/icons/platform/IP_ic_Worten.svg": {
    "type": "image/svg+xml",
    "etag": "\"fce-jR586IaRfarJdpcR1Lf9u+l7WCk\"",
    "mtime": "2026-11-02T09:13:40.170Z",
    "size": 4046,
    "path": "../public/assets/icons/platform/IP_ic_Worten.svg"
  },
  "/assets/icons/platform/IP_ic_Xshoppy.svg": {
    "type": "image/svg+xml",
    "etag": "\"16a2-yHNt3+vlc2cDYWpnfEcKB8qryXQ\"",
    "mtime": "2026-11-02T09:13:40.170Z",
    "size": 5794,
    "path": "../public/assets/icons/platform/IP_ic_Xshoppy.svg"
  },
  "/assets/icons/platform/IP_ic_Zalora.svg": {
    "type": "image/svg+xml",
    "etag": "\"65a-1RsAnUD5oBcRhrdlwyPwDjx5CEM\"",
    "mtime": "2026-11-02T09:13:40.171Z",
    "size": 1626,
    "path": "../public/assets/icons/platform/IP_ic_Zalora.svg"
  },
  "/assets/icons/platform/IP_ic_amazon_site.svg": {
    "type": "image/svg+xml",
    "etag": "\"783-PpFNdvS8NEa3t7ONsn/EpbMPKp0\"",
    "mtime": "2026-11-02T09:13:40.170Z",
    "size": 1923,
    "path": "../public/assets/icons/platform/IP_ic_amazon_site.svg"
  },
  "/assets/icons/platform/IP_ic_aol.com.svg": {
    "type": "image/svg+xml",
    "etag": "\"843-CQLtkLaFQz7PHJ9doNKyXfnRXeA\"",
    "mtime": "2026-11-02T09:13:40.170Z",
    "size": 2115,
    "path": "../public/assets/icons/platform/IP_ic_aol.com.svg"
  },
  "/assets/icons/platform/IP_ic_apple_tv.svg": {
    "type": "image/svg+xml",
    "etag": "\"45e-q+YxbdGlcdO66OVpB0kfFB9V0yA\"",
    "mtime": "2026-11-02T09:13:40.171Z",
    "size": 1118,
    "path": "../public/assets/icons/platform/IP_ic_apple_tv.svg"
  },
  "/assets/icons/platform/IP_ic_auctions.yahoo.svg": {
    "type": "image/svg+xml",
    "etag": "\"2254f-b7UY9uV7fZq0iNGRneWiJWSmLvo\"",
    "mtime": "2026-11-02T09:13:40.172Z",
    "size": 140623,
    "path": "../public/assets/icons/platform/IP_ic_auctions.yahoo.svg"
  },
  "/assets/icons/platform/IP_ic_badoo.svg": {
    "type": "image/svg+xml",
    "etag": "\"ecf-G1qoBCawnZuI058APvz/xdIFnMw\"",
    "mtime": "2026-11-02T09:13:40.171Z",
    "size": 3791,
    "path": "../public/assets/icons/platform/IP_ic_badoo.svg"
  },
  "/assets/icons/platform/IP_ic_bestbuy.svg": {
    "type": "image/svg+xml",
    "etag": "\"13eb-e3HyM3+eVf/WxYu2dBHVK02eHeQ\"",
    "mtime": "2026-11-02T09:13:40.171Z",
    "size": 5099,
    "path": "../public/assets/icons/platform/IP_ic_bestbuy.svg"
  },
  "/assets/icons/platform/IP_ic_binance.svg": {
    "type": "image/svg+xml",
    "etag": "\"31a-Qwhkx7Yfge3XvUFYHYU14jl7REM\"",
    "mtime": "2026-11-02T09:13:40.171Z",
    "size": 794,
    "path": "../public/assets/icons/platform/IP_ic_binance.svg"
  },
  "/assets/icons/platform/IP_ic_blibli.svg": {
    "type": "image/svg+xml",
    "etag": "\"ec2-ZSBCRI1qVFjX7YY9JUyQvrbMaw8\"",
    "mtime": "2026-11-02T09:13:40.171Z",
    "size": 3778,
    "path": "../public/assets/icons/platform/IP_ic_blibli.svg"
  },
  "/assets/icons/platform/IP_ic_bizmanager.yahoo.co.svg": {
    "type": "image/svg+xml",
    "etag": "\"2c0d2-NWQjSmdDW0kjTgbYAHSbNvVr8Mk\"",
    "mtime": "2026-11-02T09:13:40.174Z",
    "size": 180434,
    "path": "../public/assets/icons/platform/IP_ic_bizmanager.yahoo.co.svg"
  },
  "/assets/icons/platform/IP_ic_bol.svg": {
    "type": "image/svg+xml",
    "etag": "\"519-Epe5FobPCX9pxG6vYuQ+yhzJt5U\"",
    "mtime": "2026-11-02T09:13:40.171Z",
    "size": 1305,
    "path": "../public/assets/icons/platform/IP_ic_bol.svg"
  },
  "/assets/icons/platform/IP_ic_carrefour-1.svg": {
    "type": "image/svg+xml",
    "etag": "\"7f39-9IQUQjfgz1bVoQUvKksPT4eborM\"",
    "mtime": "2026-11-02T09:13:40.172Z",
    "size": 32569,
    "path": "../public/assets/icons/platform/IP_ic_carrefour-1.svg"
  },
  "/assets/icons/platform/IP_ic_carrefour.svg": {
    "type": "image/svg+xml",
    "etag": "\"629-CXZpRheNg3yefomZ4oha0fyx9A8\"",
    "mtime": "2026-11-02T09:13:40.173Z",
    "size": 1577,
    "path": "../public/assets/icons/platform/IP_ic_carrefour.svg"
  },
  "/assets/icons/platform/IP_ic_chatgpt.svg": {
    "type": "image/svg+xml",
    "etag": "\"df1-CJG4aC2sC4WKocczwthuhmbugt0\"",
    "mtime": "2026-11-02T09:13:40.171Z",
    "size": 3569,
    "path": "../public/assets/icons/platform/IP_ic_chatgpt.svg"
  },
  "/assets/icons/platform/IP_ic_claude.svg": {
    "type": "image/svg+xml",
    "etag": "\"9d8-87kPwVWsXM+9RokEYf3KEej2MkM\"",
    "mtime": "2026-11-02T09:13:40.172Z",
    "size": 2520,
    "path": "../public/assets/icons/platform/IP_ic_claude.svg"
  },
  "/assets/icons/platform/IP_ic_coinlist.svg": {
    "type": "image/svg+xml",
    "etag": "\"a2c-9n3oZaK6DcDdrlbp7d4WEp6yWjU\"",
    "mtime": "2026-11-02T09:13:40.173Z",
    "size": 2604,
    "path": "../public/assets/icons/platform/IP_ic_coinlist.svg"
  },
  "/assets/icons/platform/IP_ic_commercehub.svg": {
    "type": "image/svg+xml",
    "etag": "\"11b-u7n0Dos+sAd7ME7evjv0b/2ylyk\"",
    "mtime": "2026-11-02T09:13:40.172Z",
    "size": 283,
    "path": "../public/assets/icons/platform/IP_ic_commercehub.svg"
  },
  "/assets/icons/platform/IP_ic_crusor.svg": {
    "type": "image/svg+xml",
    "etag": "\"2de-PCz2eFzrEF1gvTpA88pWETaLQ+w\"",
    "mtime": "2026-11-02T09:13:40.172Z",
    "size": 734,
    "path": "../public/assets/icons/platform/IP_ic_crusor.svg"
  },
  "/assets/icons/platform/IP_ic_dafiti.svg": {
    "type": "image/svg+xml",
    "etag": "\"a89-La5LInju52GS9gY6jWLo31Y/Ptw\"",
    "mtime": "2026-11-02T09:13:40.172Z",
    "size": 2697,
    "path": "../public/assets/icons/platform/IP_ic_dafiti.svg"
  },
  "/assets/icons/platform/IP_ic_currys.svg": {
    "type": "image/svg+xml",
    "etag": "\"c8a-lC/3+LToVYXQamWzf7lOrneqXfs\"",
    "mtime": "2026-11-02T09:13:40.172Z",
    "size": 3210,
    "path": "../public/assets/icons/platform/IP_ic_currys.svg"
  },
  "/assets/icons/platform/IP_ic_darty.svg": {
    "type": "image/svg+xml",
    "etag": "\"f2f-agYMmZFGrfC2WB/eBPGag8hNIHs\"",
    "mtime": "2026-11-02T09:13:40.173Z",
    "size": 3887,
    "path": "../public/assets/icons/platform/IP_ic_darty.svg"
  },
  "/assets/icons/platform/IP_ic_daraz.svg": {
    "type": "image/svg+xml",
    "etag": "\"399-B5zkJP9zUKfpoGPfOoN4ttzpZ4k\"",
    "mtime": "2026-11-02T09:13:40.174Z",
    "size": 921,
    "path": "../public/assets/icons/platform/IP_ic_daraz.svg"
  },
  "/assets/icons/platform/IP_ic_depop.svg": {
    "type": "image/svg+xml",
    "etag": "\"2ee-fO4Hg6hbb5Ak7bjVabVmu03Mv8c\"",
    "mtime": "2026-11-02T09:13:40.176Z",
    "size": 750,
    "path": "../public/assets/icons/platform/IP_ic_depop.svg"
  },
  "/assets/icons/platform/IP_ic_discord.svg": {
    "type": "image/svg+xml",
    "etag": "\"7ec-LdFfAyAqzsxi8JYXuOMg51pzq+0\"",
    "mtime": "2026-11-02T09:13:40.174Z",
    "size": 2028,
    "path": "../public/assets/icons/platform/IP_ic_discord.svg"
  },
  "/assets/icons/platform/IP_ic_doudian.svg": {
    "type": "image/svg+xml",
    "etag": "\"f88-l5lXbi6V7GQN8tptWJuPOsa6hEY\"",
    "mtime": "2026-11-02T09:13:40.173Z",
    "size": 3976,
    "path": "../public/assets/icons/platform/IP_ic_doudian.svg"
  },
  "/assets/icons/platform/IP_ic_eBay.svg": {
    "type": "image/svg+xml",
    "etag": "\"816-9o0xmmfdsMH8LvGjbxC4NMqeSnU\"",
    "mtime": "2026-11-02T09:13:40.174Z",
    "size": 2070,
    "path": "../public/assets/icons/platform/IP_ic_eBay.svg"
  },
  "/assets/icons/platform/IP_ic_elitesingles.svg": {
    "type": "image/svg+xml",
    "etag": "\"dc7-Uhx/ut/TzopEZC5cNfvLc0Br5SI\"",
    "mtime": "2026-11-02T09:13:40.174Z",
    "size": 3527,
    "path": "../public/assets/icons/platform/IP_ic_elitesingles.svg"
  },
  "/assets/icons/platform/IP_ic_emag.svg": {
    "type": "image/svg+xml",
    "etag": "\"c26-+fWIkfiPfoYP2BudekyN/7jEuBY\"",
    "mtime": "2026-11-02T09:13:40.174Z",
    "size": 3110,
    "path": "../public/assets/icons/platform/IP_ic_emag.svg"
  },
  "/assets/icons/platform/IP_ic_falabella.svg": {
    "type": "image/svg+xml",
    "etag": "\"465-8Vy6uu5JJNb04emPkQjm4tx8pqo\"",
    "mtime": "2026-11-02T09:13:40.175Z",
    "size": 1125,
    "path": "../public/assets/icons/platform/IP_ic_falabella.svg"
  },
  "/assets/icons/platform/IP_ic_fanno_shop.svg": {
    "type": "image/svg+xml",
    "etag": "\"fb6-Pokfhn1xYWNIBx9v7ah3QI/pPGs\"",
    "mtime": "2026-11-02T09:13:40.174Z",
    "size": 4022,
    "path": "../public/assets/icons/platform/IP_ic_fanno_shop.svg"
  },
  "/assets/icons/platform/IP_ic_fnac.svg": {
    "type": "image/svg+xml",
    "etag": "\"a42-HIAcJm0DX2PhzAj6wmkKzSEgFS0\"",
    "mtime": "2026-11-02T09:13:40.176Z",
    "size": 2626,
    "path": "../public/assets/icons/platform/IP_ic_fnac.svg"
  },
  "/assets/icons/platform/IP_ic_gemini.svg": {
    "type": "image/svg+xml",
    "etag": "\"2bc8-zwYfXQ47zepRGTfNaCfdE7X9YpU\"",
    "mtime": "2026-11-02T09:13:40.175Z",
    "size": 11208,
    "path": "../public/assets/icons/platform/IP_ic_gemini.svg"
  },
  "/assets/icons/platform/IP_ic_gmarket.svg": {
    "type": "image/svg+xml",
    "etag": "\"588-cYkH55KVwSRfz6oin7F//Gceem8\"",
    "mtime": "2026-11-02T09:13:40.175Z",
    "size": 1416,
    "path": "../public/assets/icons/platform/IP_ic_gmarket.svg"
  },
  "/assets/icons/platform/IP_ic_grok.svg": {
    "type": "image/svg+xml",
    "etag": "\"3fa-Pl1Daw/p4uNq2gaMDvaTkzFWRxg\"",
    "mtime": "2026-11-02T09:13:40.175Z",
    "size": 1018,
    "path": "../public/assets/icons/platform/IP_ic_grok.svg"
  },
  "/assets/icons/platform/IP_ic_hbo.svg": {
    "type": "image/svg+xml",
    "etag": "\"c8b-jaGDjizWEyJFbcsHMmcNR1Lwe9A\"",
    "mtime": "2026-11-02T09:13:40.176Z",
    "size": 3211,
    "path": "../public/assets/icons/platform/IP_ic_hbo.svg"
  },
  "/assets/icons/platform/IP_ic_homedepot.svg": {
    "type": "image/svg+xml",
    "etag": "\"1caf-eO+ttRTCcCNWaHxu+ydYfx5Gs6k\"",
    "mtime": "2026-11-02T09:13:40.176Z",
    "size": 7343,
    "path": "../public/assets/icons/platform/IP_ic_homedepot.svg"
  },
  "/assets/icons/platform/IP_ic_instagram.svg": {
    "type": "image/svg+xml",
    "etag": "\"2271-FzTE5SVepOMuPeF2v2W1uXt0U9E\"",
    "mtime": "2026-11-02T09:13:40.177Z",
    "size": 8817,
    "path": "../public/assets/icons/platform/IP_ic_instagram.svg"
  },
  "/assets/icons/platform/IP_ic_houzz.svg": {
    "type": "image/svg+xml",
    "etag": "\"dc-hwyB97g0W7Xz6Bs/AuBWKcr06vw\"",
    "mtime": "2026-11-02T09:13:40.176Z",
    "size": 220,
    "path": "../public/assets/icons/platform/IP_ic_houzz.svg"
  },
  "/assets/icons/platform/IP_ic_joom.svg": {
    "type": "image/svg+xml",
    "etag": "\"229-Q+Bkx/kihYmO47Ra06sofmqJpt4\"",
    "mtime": "2026-11-02T09:13:40.177Z",
    "size": 553,
    "path": "../public/assets/icons/platform/IP_ic_joom.svg"
  },
  "/assets/icons/platform/IP_ic_joybuy.svg": {
    "type": "image/svg+xml",
    "etag": "\"2e8-zD2LaI6Qx2UpIV0MIPzYz9GqmZY\"",
    "mtime": "2026-11-02T09:13:40.176Z",
    "size": 744,
    "path": "../public/assets/icons/platform/IP_ic_joybuy.svg"
  },
  "/assets/icons/platform/IP_ic_l192.svg": {
    "type": "image/svg+xml",
    "etag": "\"f76-gsZ+L8304oHsb8WkUQXY+/nyw4Q\"",
    "mtime": "2026-11-02T09:13:40.177Z",
    "size": 3958,
    "path": "../public/assets/icons/platform/IP_ic_l192.svg"
  },
  "/assets/icons/platform/IP_ic_kuaishou.svg": {
    "type": "image/svg+xml",
    "etag": "\"c30-/2Ukm1ZJHySr7WwHhZiMEhGe44w\"",
    "mtime": "2026-11-02T09:13:40.177Z",
    "size": 3120,
    "path": "../public/assets/icons/platform/IP_ic_kuaishou.svg"
  },
  "/assets/icons/platform/IP_ic_kohlsus.svg": {
    "type": "image/svg+xml",
    "etag": "\"d2c-fK1v6BhKT70YeQJ+eFUy6mI1mwQ\"",
    "mtime": "2026-11-02T09:13:40.177Z",
    "size": 3372,
    "path": "../public/assets/icons/platform/IP_ic_kohlsus.svg"
  },
  "/assets/icons/platform/IP_ic_leroymerlin.svg": {
    "type": "image/svg+xml",
    "etag": "\"1738-r0kfbIz1DX6YXbccLdf+k+OfSOk\"",
    "mtime": "2026-11-02T09:13:40.177Z",
    "size": 5944,
    "path": "../public/assets/icons/platform/IP_ic_leroymerlin.svg"
  },
  "/assets/icons/platform/IP_ic_line.svg": {
    "type": "image/svg+xml",
    "etag": "\"86a-mH3sWg/hHjTBDLmMIRwJEk2cK7o\"",
    "mtime": "2026-11-02T09:13:40.177Z",
    "size": 2154,
    "path": "../public/assets/icons/platform/IP_ic_line.svg"
  },
  "/assets/icons/platform/IP_ic_lazada.svg": {
    "type": "image/svg+xml",
    "etag": "\"e84-Hn8wQ5v9WF12Ha0/r3mpgxBZMUA\"",
    "mtime": "2026-11-02T09:13:40.193Z",
    "size": 3716,
    "path": "../public/assets/icons/platform/IP_ic_lazada.svg"
  },
  "/assets/icons/platform/IP_ic_linio.svg": {
    "type": "image/svg+xml",
    "etag": "\"7c6-LEP+0MA08UR7tc44mQ770nR2D2M\"",
    "mtime": "2026-11-02T09:13:40.177Z",
    "size": 1990,
    "path": "../public/assets/icons/platform/IP_ic_linio.svg"
  },
  "/assets/icons/platform/IP_ic_linkedin.svg": {
    "type": "image/svg+xml",
    "etag": "\"6d5-32l3LWrA5vnpVWVJA3QYR1u/gtc\"",
    "mtime": "2026-11-02T09:13:40.178Z",
    "size": 1749,
    "path": "../public/assets/icons/platform/IP_ic_linkedin.svg"
  },
  "/assets/icons/platform/IP_ic_linux.svg": {
    "type": "image/svg+xml",
    "etag": "\"2497-UZk+oIkRZdmRq5j6ZCV7lwKufj0\"",
    "mtime": "2026-11-02T09:13:40.178Z",
    "size": 9367,
    "path": "../public/assets/icons/platform/IP_ic_linux.svg"
  },
  "/assets/icons/platform/IP_ic_lowes.svg": {
    "type": "image/svg+xml",
    "etag": "\"c70-NVL+jzOCoZw1sBYXmhzekNywUMM\"",
    "mtime": "2026-11-02T09:13:40.178Z",
    "size": 3184,
    "path": "../public/assets/icons/platform/IP_ic_lowes.svg"
  },
  "/assets/icons/platform/IP_ic_mcp.svg": {
    "type": "image/svg+xml",
    "etag": "\"6ec-3YEIRAvQD5dhtQaKsbCBxc3Eeks\"",
    "mtime": "2026-11-02T09:13:40.178Z",
    "size": 1772,
    "path": "../public/assets/icons/platform/IP_ic_mcp.svg"
  },
  "/assets/icons/platform/IP_ic_match.svg": {
    "type": "image/svg+xml",
    "etag": "\"a3c-iG4pyZYHZE8fCTjXgc/EuBiPCJ4\"",
    "mtime": "2026-11-02T09:13:40.178Z",
    "size": 2620,
    "path": "../public/assets/icons/platform/IP_ic_match.svg"
  },
  "/assets/icons/platform/IP_ic_makuake.svg": {
    "type": "image/svg+xml",
    "etag": "\"dff-igl8hTlvRWjSjU04LvdMUXzDM/g\"",
    "mtime": "2026-11-02T09:13:40.178Z",
    "size": 3583,
    "path": "../public/assets/icons/platform/IP_ic_makuake.svg"
  },
  "/assets/icons/platform/IP_ic_midjourney.svg": {
    "type": "image/svg+xml",
    "etag": "\"1efa-fRvsENVksuVMHxzDqzBnXcAFto8\"",
    "mtime": "2026-11-02T09:13:40.178Z",
    "size": 7930,
    "path": "../public/assets/icons/platform/IP_ic_midjourney.svg"
  },
  "/assets/icons/platform/IP_ic_meta.svg": {
    "type": "image/svg+xml",
    "etag": "\"5af7f-DfPVlcZwiG7O14kVWJyphTrN0Fc\"",
    "mtime": "2026-11-02T09:13:40.181Z",
    "size": 372607,
    "path": "../public/assets/icons/platform/IP_ic_meta.svg"
  },
  "/assets/icons/platform/IP_ic_mintj.svg": {
    "type": "image/svg+xml",
    "etag": "\"98d-fKV41v0/9TfAgYGCZeFhPyMeAtQ\"",
    "mtime": "2026-11-02T09:13:40.179Z",
    "size": 2445,
    "path": "../public/assets/icons/platform/IP_ic_mintj.svg"
  },
  "/assets/icons/platform/IP_ic_naver.svg": {
    "type": "image/svg+xml",
    "etag": "\"20cb-J7f5Rd5jhkyoThI36c5G8UdQueM\"",
    "mtime": "2026-11-02T09:13:40.179Z",
    "size": 8395,
    "path": "../public/assets/icons/platform/IP_ic_naver.svg"
  },
  "/assets/icons/platform/IP_ic_netflix.svg": {
    "type": "image/svg+xml",
    "etag": "\"444-m9KQQIgxURMWuQz5vnGljOBZoEs\"",
    "mtime": "2026-11-02T09:13:40.179Z",
    "size": 1092,
    "path": "../public/assets/icons/platform/IP_ic_netflix.svg"
  },
  "/assets/icons/platform/IP_ic_newegg.svg": {
    "type": "image/svg+xml",
    "etag": "\"2aff-lScZV1Fw44fXzRtCG8ls0XLk5eU\"",
    "mtime": "2026-11-02T09:13:40.179Z",
    "size": 11007,
    "path": "../public/assets/icons/platform/IP_ic_newegg.svg"
  },
  "/assets/icons/platform/IP_ic_noon.svg": {
    "type": "image/svg+xml",
    "etag": "\"3b3-NnMyqF69YkdJTeTwc7ZHtFO8sJc\"",
    "mtime": "2026-11-02T09:13:40.180Z",
    "size": 947,
    "path": "../public/assets/icons/platform/IP_ic_noon.svg"
  },
  "/assets/icons/platform/IP_ic_onbuy.svg": {
    "type": "image/svg+xml",
    "etag": "\"f9b-zJ5DENuoY+Wuo9f+zsr2eR8ya2o\"",
    "mtime": "2026-11-02T09:13:40.179Z",
    "size": 3995,
    "path": "../public/assets/icons/platform/IP_ic_onbuy.svg"
  },
  "/assets/icons/platform/IP_ic_otto.svg": {
    "type": "image/svg+xml",
    "etag": "\"daf-PRl/v8snR7Go/kaqe4kqRIJLvD4\"",
    "mtime": "2026-11-02T09:13:40.179Z",
    "size": 3503,
    "path": "../public/assets/icons/platform/IP_ic_otto.svg"
  },
  "/assets/icons/platform/IP_ic_ourtime.svg": {
    "type": "image/svg+xml",
    "etag": "\"f21-AO673wduRw3mhkEmMmAJNeg26Mc\"",
    "mtime": "2026-11-02T09:13:40.180Z",
    "size": 3873,
    "path": "../public/assets/icons/platform/IP_ic_ourtime.svg"
  },
  "/assets/icons/platform/IP_ic_payssion.svg": {
    "type": "image/svg+xml",
    "etag": "\"7d5-0oyI3RoNsCD601Wp6dMZzc5Mr8E\"",
    "mtime": "2026-11-02T09:13:40.181Z",
    "size": 2005,
    "path": "../public/assets/icons/platform/IP_ic_payssion.svg"
  },
  "/assets/icons/platform/IP_ic_overstock.svg": {
    "type": "image/svg+xml",
    "etag": "\"3e0-LxzFzW/4z2+/FPiNMohyktOPe2g\"",
    "mtime": "2026-11-02T09:13:40.181Z",
    "size": 992,
    "path": "../public/assets/icons/platform/IP_ic_overstock.svg"
  },
  "/assets/icons/platform/IP_ic_phhgroup.svg": {
    "type": "image/svg+xml",
    "etag": "\"51d-bIKolraUT5AfIXklndJ3sPB/phA\"",
    "mtime": "2026-11-02T09:13:40.181Z",
    "size": 1309,
    "path": "../public/assets/icons/platform/IP_ic_phhgroup.svg"
  },
  "/assets/icons/platform/IP_ic_pinduoduo.svg": {
    "type": "image/svg+xml",
    "etag": "\"7db-u7db3GpCqUbHnyuq3VYwqvQ9J/s\"",
    "mtime": "2026-11-02T09:13:40.181Z",
    "size": 2011,
    "path": "../public/assets/icons/platform/IP_ic_pinduoduo.svg"
  },
  "/assets/icons/platform/IP_ic_phonehouse.svg": {
    "type": "image/svg+xml",
    "etag": "\"176f-YzaKj5wkllZaowJMe/wwyVXKuKo\"",
    "mtime": "2026-11-02T09:13:40.180Z",
    "size": 5999,
    "path": "../public/assets/icons/platform/IP_ic_phonehouse.svg"
  },
  "/assets/icons/platform/IP_ic_perplexity.svg": {
    "type": "image/svg+xml",
    "etag": "\"29e-omgVGgAAbKm/AdDXQTUDpV2COEg\"",
    "mtime": "2026-11-02T09:13:40.180Z",
    "size": 670,
    "path": "../public/assets/icons/platform/IP_ic_perplexity.svg"
  },
  "/assets/icons/platform/IP_ic_protonmail.svg": {
    "type": "image/svg+xml",
    "etag": "\"5aa-6khS5t1ZZSG9E8qNLxHYde/zh/w\"",
    "mtime": "2026-11-02T09:13:40.185Z",
    "size": 1450,
    "path": "../public/assets/icons/platform/IP_ic_protonmail.svg"
  },
  "/assets/icons/platform/IP_ic_qianniu.svg": {
    "type": "image/svg+xml",
    "etag": "\"6fd-bk0aW3fPixEV8qJkr1WEyYhNKXs\"",
    "mtime": "2026-11-02T09:13:40.185Z",
    "size": 1789,
    "path": "../public/assets/icons/platform/IP_ic_qianniu.svg"
  },
  "/assets/icons/platform/IP_ic_quora.svg": {
    "type": "image/svg+xml",
    "etag": "\"515-gqvMv8wEBOQw0YLcZrqJAFx1QeI\"",
    "mtime": "2026-11-02T09:13:40.183Z",
    "size": 1301,
    "path": "../public/assets/icons/platform/IP_ic_quora.svg"
  },
  "/assets/icons/platform/IP_ic_rdc.svg": {
    "type": "image/svg+xml",
    "etag": "\"1d42-7VS996hO4+qWM6X0hnpUM8wnDS4\"",
    "mtime": "2026-11-02T09:13:40.185Z",
    "size": 7490,
    "path": "../public/assets/icons/platform/IP_ic_rdc.svg"
  },
  "/assets/icons/platform/IP_ic_real.svg": {
    "type": "image/svg+xml",
    "etag": "\"3c6-f9Fx/DSikDWWMGgMJ5eLb6cVH8w\"",
    "mtime": "2026-11-02T09:13:40.185Z",
    "size": 966,
    "path": "../public/assets/icons/platform/IP_ic_real.svg"
  },
  "/assets/icons/platform/IP_ic_reddit.svg": {
    "type": "image/svg+xml",
    "etag": "\"1fbe-MDAzN0QrKmRcmQHEvp6GuB9TmgM\"",
    "mtime": "2026-11-02T09:13:40.185Z",
    "size": 8126,
    "path": "../public/assets/icons/platform/IP_ic_reddit.svg"
  },
  "/assets/icons/platform/IP_ic_sendo.svg": {
    "type": "image/svg+xml",
    "etag": "\"b6d-Kh80hb5hCmUtvFyX8i508rLMoQ8\"",
    "mtime": "2026-11-02T09:13:40.185Z",
    "size": 2925,
    "path": "../public/assets/icons/platform/IP_ic_sendo.svg"
  },
  "/assets/icons/platform/IP_ic_shein.svg": {
    "type": "image/svg+xml",
    "etag": "\"a5b-jsH1sxSHGAXxUQKY1WVmCUuKheY\"",
    "mtime": "2026-11-02T09:13:40.185Z",
    "size": 2651,
    "path": "../public/assets/icons/platform/IP_ic_shein.svg"
  },
  "/assets/icons/platform/IP_ic_shopbase.svg": {
    "type": "image/svg+xml",
    "etag": "\"c80-FZsAYp48Fja7usB9S41W2A9KXBc\"",
    "mtime": "2026-11-02T09:13:40.185Z",
    "size": 3200,
    "path": "../public/assets/icons/platform/IP_ic_shopbase.svg"
  },
  "/assets/icons/platform/IP_ic_shoplineapp.svg": {
    "type": "image/svg+xml",
    "etag": "\"14e8-8qj4DUBvTUhGWqprC4gCZT4LphI\"",
    "mtime": "2026-11-02T09:13:40.185Z",
    "size": 5352,
    "path": "../public/assets/icons/platform/IP_ic_shoplineapp.svg"
  },
  "/assets/icons/platform/IP_ic_shoptime.svg": {
    "type": "image/svg+xml",
    "etag": "\"201-e0G8cMQqATk2ICQrg1YhLZW4asw\"",
    "mtime": "2026-11-02T09:13:40.185Z",
    "size": 513,
    "path": "../public/assets/icons/platform/IP_ic_shoptime.svg"
  },
  "/assets/icons/platform/IP_ic_shopyy.svg": {
    "type": "image/svg+xml",
    "etag": "\"788-tkPIVeLrriDjtrOcHS6fcjpyLlE\"",
    "mtime": "2026-11-02T09:13:40.185Z",
    "size": 1928,
    "path": "../public/assets/icons/platform/IP_ic_shopyy.svg"
  },
  "/assets/icons/platform/IP_ic_souq.svg": {
    "type": "image/svg+xml",
    "etag": "\"3788-H/z2MPR5WEfS9rhZHxRv+xprS8o\"",
    "mtime": "2026-11-02T09:13:40.185Z",
    "size": 14216,
    "path": "../public/assets/icons/platform/IP_ic_souq.svg"
  },
  "/assets/icons/platform/IP_ic_spotify.svg": {
    "type": "image/svg+xml",
    "etag": "\"951-FV4fHdBFLgjsrRbAmnV1N/G8s5U\"",
    "mtime": "2026-11-02T09:13:40.185Z",
    "size": 2385,
    "path": "../public/assets/icons/platform/IP_ic_spotify.svg"
  },
  "/assets/icons/platform/IP_ic_steam.svg": {
    "type": "image/svg+xml",
    "etag": "\"9ec-C3d9DmbDLJJQmteNP1Lt9k+LNcc\"",
    "mtime": "2026-11-02T09:13:40.186Z",
    "size": 2540,
    "path": "../public/assets/icons/platform/IP_ic_steam.svg"
  },
  "/assets/icons/platform/IP_ic_takealot.svg": {
    "type": "image/svg+xml",
    "etag": "\"2250-1BjZ3COuERRFm/XtZHrNc119As0\"",
    "mtime": "2026-11-02T09:13:40.186Z",
    "size": 8784,
    "path": "../public/assets/icons/platform/IP_ic_takealot.svg"
  },
  "/assets/icons/platform/IP_ic_taobao.svg": {
    "type": "image/svg+xml",
    "etag": "\"1990-CEOWmofjYCY4Fn8kuBH/iCPFVQU\"",
    "mtime": "2026-11-02T09:13:40.186Z",
    "size": 6544,
    "path": "../public/assets/icons/platform/IP_ic_taobao.svg"
  },
  "/assets/icons/platform/IP_ic_target.svg": {
    "type": "image/svg+xml",
    "etag": "\"485-AfYiS2MqKQ2apDtYB/MUWYzwJRQ\"",
    "mtime": "2026-11-02T09:13:40.186Z",
    "size": 1157,
    "path": "../public/assets/icons/platform/IP_ic_target.svg"
  },
  "/assets/icons/platform/IP_ic_telegram.svg": {
    "type": "image/svg+xml",
    "etag": "\"53a-lNGaCCv7goVkcWY2SvKjJmiC+DM\"",
    "mtime": "2026-11-02T09:13:40.186Z",
    "size": 1338,
    "path": "../public/assets/icons/platform/IP_ic_telegram.svg"
  },
  "/assets/icons/platform/IP_ic_temu.svg": {
    "type": "image/svg+xml",
    "etag": "\"133d-r0dPlmBcAOTQqH2S/DlIcG6BnsM\"",
    "mtime": "2026-11-02T09:13:40.187Z",
    "size": 4925,
    "path": "../public/assets/icons/platform/IP_ic_temu.svg"
  },
  "/assets/icons/platform/IP_ic_this-shop.svg": {
    "type": "image/svg+xml",
    "etag": "\"1654-2MPu+wqTsUXihfil0hF8CBkLfiM\"",
    "mtime": "2026-11-02T09:13:40.187Z",
    "size": 5716,
    "path": "../public/assets/icons/platform/IP_ic_this-shop.svg"
  },
  "/assets/icons/platform/IP_ic_tiki.svg": {
    "type": "image/svg+xml",
    "etag": "\"1ac1-KZLTIXHt3gAPsNT+zzs6/O+Wtd0\"",
    "mtime": "2026-11-02T09:13:40.187Z",
    "size": 6849,
    "path": "../public/assets/icons/platform/IP_ic_tiki.svg"
  },
  "/assets/icons/platform/IP_ic_tiktok.svg": {
    "type": "image/svg+xml",
    "etag": "\"b19-IIPZZtJPq/DamPu0rc0LK5X+BBc\"",
    "mtime": "2026-11-02T09:13:40.187Z",
    "size": 2841,
    "path": "../public/assets/icons/platform/IP_ic_tiktok.svg"
  },
  "/assets/icons/platform/IP_ic_tiktok_shop.svg": {
    "type": "image/svg+xml",
    "etag": "\"af7-K+zrcQKeAapEss0HV0+LAm21Pes\"",
    "mtime": "2026-11-02T09:13:40.187Z",
    "size": 2807,
    "path": "../public/assets/icons/platform/IP_ic_tiktok_shop.svg"
  },
  "/assets/icons/platform/IP_ic_tinder.svg": {
    "type": "image/svg+xml",
    "etag": "\"358-L2NCKwfrBOKRUEvjVHUDjVTjKIk\"",
    "mtime": "2026-11-02T09:13:40.187Z",
    "size": 856,
    "path": "../public/assets/icons/platform/IP_ic_tinder.svg"
  },
  "/assets/icons/platform/IP_ic_trendyol.svg": {
    "type": "image/svg+xml",
    "etag": "\"afd-fYw6LRwSqKVpGGUZebHvGHNbBus\"",
    "mtime": "2026-11-02T09:13:40.187Z",
    "size": 2813,
    "path": "../public/assets/icons/platform/IP_ic_trendyol.svg"
  },
  "/assets/icons/platform/IP_ic_tumblr.svg": {
    "type": "image/svg+xml",
    "etag": "\"199-JDzZcb4Hh5Qtk4r35G5Cx0urbec\"",
    "mtime": "2026-11-02T09:13:40.187Z",
    "size": 409,
    "path": "../public/assets/icons/platform/IP_ic_tumblr.svg"
  },
  "/assets/icons/platform/IP_ic_wechat.svg": {
    "type": "image/svg+xml",
    "etag": "\"eb5-CyR744PbPcFFmiuW17Y3N1n7Q34\"",
    "mtime": "2026-11-02T09:13:40.187Z",
    "size": 3765,
    "path": "../public/assets/icons/platform/IP_ic_wechat.svg"
  },
  "/assets/icons/platform/IP_ic_twitter.svg": {
    "type": "image/svg+xml",
    "etag": "\"23a-2HFNAN/zkHj4VT7wnXwcXC3pHGk\"",
    "mtime": "2026-11-02T09:13:40.187Z",
    "size": 570,
    "path": "../public/assets/icons/platform/IP_ic_twitter.svg"
  },
  "/assets/icons/platform/IP_ic_whatsapp.svg": {
    "type": "image/svg+xml",
    "etag": "\"89c-0p2SSAKdMT4vGGLRKB5T3ZniXP8\"",
    "mtime": "2026-11-02T09:13:40.188Z",
    "size": 2204,
    "path": "../public/assets/icons/platform/IP_ic_whatsapp.svg"
  },
  "/assets/icons/platform/IP_ic_xiaohongshu.svg": {
    "type": "image/svg+xml",
    "etag": "\"1e96-lDID2x5q07FfSVRRfpZEHoDVdzA\"",
    "mtime": "2026-11-02T09:13:40.188Z",
    "size": 7830,
    "path": "../public/assets/icons/platform/IP_ic_xiaohongshu.svg"
  },
  "/assets/icons/platform/IP_ic_wowma.svg": {
    "type": "image/svg+xml",
    "etag": "\"3c67-xg9wxGw1S3H07e9HumftpSXU7tM\"",
    "mtime": "2026-11-02T09:13:40.189Z",
    "size": 15463,
    "path": "../public/assets/icons/platform/IP_ic_wowma.svg"
  },
  "/assets/icons/platform/IP_ic_yahoo.svg": {
    "type": "image/svg+xml",
    "etag": "\"89d-chI4wg3+O4bQ/QTwIfwweDFSXfs\"",
    "mtime": "2026-11-02T09:13:40.188Z",
    "size": 2205,
    "path": "../public/assets/icons/platform/IP_ic_yahoo.svg"
  },
  "/assets/icons/platform/IP_ic_yandex.svg": {
    "type": "image/svg+xml",
    "etag": "\"1f3-hLYLRteoFWmace/hpGEZ6XiUALw\"",
    "mtime": "2026-11-02T09:13:40.188Z",
    "size": 499,
    "path": "../public/assets/icons/platform/IP_ic_yandex.svg"
  },
  "/assets/icons/platform/IP_ic_ymatou.svg": {
    "type": "image/svg+xml",
    "etag": "\"4a58-vyTqYK1uzMjLkiaRgONQg/2xstc\"",
    "mtime": "2026-11-02T09:13:40.188Z",
    "size": 19032,
    "path": "../public/assets/icons/platform/IP_ic_ymatou.svg"
  },
  "/assets/icons/platform/IP_ic_youtube.svg": {
    "type": "image/svg+xml",
    "etag": "\"2b0-AcSUEpl/ZVoEAhZhIbsVRcxEBFQ\"",
    "mtime": "2026-11-02T09:13:40.188Z",
    "size": 688,
    "path": "../public/assets/icons/platform/IP_ic_youtube.svg"
  },
  "/assets/icons/platform/IP_ic_zalo.svg": {
    "type": "image/svg+xml",
    "etag": "\"d80-Zt2i7BLHtV2/9+HCTB9nkiwpIA0\"",
    "mtime": "2026-11-02T09:13:40.188Z",
    "size": 3456,
    "path": "../public/assets/icons/platform/IP_ic_zalo.svg"
  },
  "/assets/icons/platform/IP_ic_tokopedia.svg": {
    "type": "image/svg+xml",
    "etag": "\"812a2-qHkipH9D7oArDbWNo6VsUf0+vTQ\"",
    "mtime": "2026-11-02T09:13:40.188Z",
    "size": 529058,
    "path": "../public/assets/icons/platform/IP_ic_tokopedia.svg"
  },
  "/assets/icons/platform/IP_ic_露天拍卖.svg": {
    "type": "image/svg+xml",
    "etag": "\"1983-CX45C5o0ZzYhlBQsjp75l1eahPE\"",
    "mtime": "2026-11-02T09:13:40.188Z",
    "size": 6531,
    "path": "../public/assets/icons/platform/IP_ic_露天拍卖.svg"
  },
  "/_nuxt/builds/meta/97634f1f-932e-4d0d-ada5-c2b0c241d739.json": {
    "type": "application/json",
    "etag": "\"58-+bXapGY911bcEbNQY6JTSGOHQg0\"",
    "mtime": "2026-11-02T09:13:39.951Z",
    "size": 88,
    "path": "../public/_nuxt/builds/meta/97634f1f-932e-4d0d-ada5-c2b0c241d739.json"
  }
};

const _DRIVE_LETTER_START_RE = /^[A-Za-z]:\//;
function normalizeWindowsPath(input = "") {
  if (!input) {
    return input;
  }
  return input.replace(/\\/g, "/").replace(_DRIVE_LETTER_START_RE, (r) => r.toUpperCase());
}
const _IS_ABSOLUTE_RE = /^[/\\](?![/\\])|^[/\\]{2}(?!\.)|^[A-Za-z]:[/\\]/;
const _DRIVE_LETTER_RE = /^[A-Za-z]:$/;
const _ROOT_FOLDER_RE = /^\/([A-Za-z]:)?$/;
function cwd() {
  if (typeof process !== "undefined" && typeof process.cwd === "function") {
    return process.cwd().replace(/\\/g, "/");
  }
  return "/";
}
const resolve = function(...arguments_) {
  arguments_ = arguments_.map((argument) => normalizeWindowsPath(argument));
  let resolvedPath = "";
  let resolvedAbsolute = false;
  for (let index = arguments_.length - 1; index >= -1 && !resolvedAbsolute; index--) {
    const path = index >= 0 ? arguments_[index] : cwd();
    if (!path || path.length === 0) {
      continue;
    }
    resolvedPath = `${path}/${resolvedPath}`;
    resolvedAbsolute = isAbsolute(path);
  }
  resolvedPath = normalizeString(resolvedPath, !resolvedAbsolute);
  if (resolvedAbsolute && !isAbsolute(resolvedPath)) {
    return `/${resolvedPath}`;
  }
  return resolvedPath.length > 0 ? resolvedPath : ".";
};
function normalizeString(path, allowAboveRoot) {
  let res = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let char = null;
  for (let index = 0; index <= path.length; ++index) {
    if (index < path.length) {
      char = path[index];
    } else if (char === "/") {
      break;
    } else {
      char = "/";
    }
    if (char === "/") {
      if (lastSlash === index - 1 || dots === 1) ; else if (dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res[res.length - 1] !== "." || res[res.length - 2] !== ".") {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf("/");
            if (lastSlashIndex === -1) {
              res = "";
              lastSegmentLength = 0;
            } else {
              res = res.slice(0, lastSlashIndex);
              lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
            }
            lastSlash = index;
            dots = 0;
            continue;
          } else if (res.length > 0) {
            res = "";
            lastSegmentLength = 0;
            lastSlash = index;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          res += res.length > 0 ? "/.." : "..";
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0) {
          res += `/${path.slice(lastSlash + 1, index)}`;
        } else {
          res = path.slice(lastSlash + 1, index);
        }
        lastSegmentLength = index - lastSlash - 1;
      }
      lastSlash = index;
      dots = 0;
    } else if (char === "." && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}
const isAbsolute = function(p) {
  return _IS_ABSOLUTE_RE.test(p);
};
const relative = function(from, to) {
  const _from = resolve(from).replace(_ROOT_FOLDER_RE, "$1").split("/");
  const _to = resolve(to).replace(_ROOT_FOLDER_RE, "$1").split("/");
  if (_to[0][1] === ":" && _from[0][1] === ":" && _from[0] !== _to[0]) {
    return _to.join("/");
  }
  const _fromCopy = [..._from];
  for (const segment of _fromCopy) {
    if (_to[0] !== segment) {
      break;
    }
    _from.shift();
    _to.shift();
  }
  return [..._from.map(() => ".."), ..._to].join("/");
};
const dirname = function(p) {
  const segments = normalizeWindowsPath(p).replace(/\/$/, "").split("/").slice(0, -1);
  if (segments.length === 1 && _DRIVE_LETTER_RE.test(segments[0])) {
    segments[0] += "/";
  }
  return segments.join("/") || (isAbsolute(p) ? "/" : ".");
};

function readAsset (id) {
  const serverDir = dirname(fileURLToPath(globalThis._importMeta_.url));
  return promises.readFile(resolve(serverDir, assets[id].path))
}

const publicAssetBases = {"/_nuxt/builds/meta/":{"maxAge":31536000},"/_nuxt/builds/":{"maxAge":1},"/_nuxt/":{"maxAge":31536000}};

function isPublicAssetURL(id = '') {
  if (assets[id]) {
    return true
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

function getAsset (id) {
  return assets[id]
}

const METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
const EncodingMap = { gzip: ".gz", br: ".br" };
const _iwQV_f = eventHandler((event) => {
  if (event.method && !METHODS.has(event.method)) {
    return;
  }
  let id = decodePath(
    withLeadingSlash(withoutTrailingSlash(parseURL(event.path).pathname))
  );
  let asset;
  const encodingHeader = String(
    getRequestHeader(event, "accept-encoding") || ""
  );
  const encodings = [
    ...encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(),
    ""
  ];
  for (const encoding of encodings) {
    for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
      const _asset = getAsset(_id);
      if (_asset) {
        asset = _asset;
        id = _id;
        break;
      }
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      removeResponseHeader(event, "Cache-Control");
      throw createError$1({ statusCode: 404 });
    }
    return;
  }
  if (asset.encoding !== void 0) {
    appendResponseHeader(event, "Vary", "Accept-Encoding");
  }
  const ifNotMatch = getRequestHeader(event, "if-none-match") === asset.etag;
  if (ifNotMatch) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  const ifModifiedSinceH = getRequestHeader(event, "if-modified-since");
  const mtimeDate = new Date(asset.mtime);
  if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  if (asset.type && !getResponseHeader(event, "Content-Type")) {
    setResponseHeader(event, "Content-Type", asset.type);
  }
  if (asset.etag && !getResponseHeader(event, "ETag")) {
    setResponseHeader(event, "ETag", asset.etag);
  }
  if (asset.mtime && !getResponseHeader(event, "Last-Modified")) {
    setResponseHeader(event, "Last-Modified", mtimeDate.toUTCString());
  }
  if (asset.encoding && !getResponseHeader(event, "Content-Encoding")) {
    setResponseHeader(event, "Content-Encoding", asset.encoding);
  }
  if (asset.size > 0 && !getResponseHeader(event, "Content-Length")) {
    setResponseHeader(event, "Content-Length", asset.size);
  }
  return readAsset(id);
});

const ADMIN_COOKIE = "blog_admin";
function safeEqual(a, b) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}
function getAdminPassword() {
  const password = useRuntimeConfig().adminPassword;
  if (!password) {
    console.warn('[admin] NUXT_ADMIN_PASSWORD is not set \u2014 falling back to the dev default "admin123". Set it before deploying.');
    return "admin123";
  }
  return password;
}
function getSecret() {
  const config = useRuntimeConfig();
  return config.adminSecret || `${getAdminPassword()}::ip-ready-blog-admin`;
}
function createSessionToken() {
  return createHmac("sha256", getSecret()).update("blog-admin-session").digest("hex");
}
function verifyPassword(input) {
  return safeEqual(input, getAdminPassword());
}
function verifySessionToken(token) {
  if (!token) return false;
  return safeEqual(token, createSessionToken());
}
function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  };
}

const _N0550C = defineEventHandler((event) => {
  const url = getRequestURL(event);
  if (!url.pathname.startsWith("/api/admin")) return;
  if (url.pathname === "/api/admin/login") return;
  if (url.pathname === "/api/admin/session") return;
  const token = getCookie(event, ADMIN_COOKIE);
  if (!verifySessionToken(token)) {
    throw createError$1({ statusCode: 401, statusMessage: "Admin authentication required." });
  }
});

const _SxA8c9 = defineEventHandler(() => {});

const _lazy_sqhiKG = () => import('../routes/api/admin/blog-covers.post.mjs');
const _lazy_bKtWlP = () => import('../routes/api/admin/login.post.mjs');
const _lazy_xgAcJA = () => import('../routes/api/admin/logout.post.mjs');
const _lazy_RlLkQh = () => import('../routes/api/admin/posts.get.mjs');
const _lazy_iKWyDz = () => import('../routes/api/admin/posts.post.mjs');
const _lazy_AfYuO0 = () => import('../routes/api/admin/posts/_slug_.delete.mjs');
const _lazy_2q9iVm = () => import('../routes/api/admin/posts/_slug_.get.mjs');
const _lazy_NMjiVA = () => import('../routes/api/admin/posts/_slug_.put.mjs');
const _lazy_geHLSF = () => import('../routes/api/admin/posts/order.post.mjs');
const _lazy_FNn6Wl = () => import('../routes/api/admin/risk-stats.get.mjs');
const _lazy_Ywm0a2 = () => import('../routes/api/admin/session.get.mjs');
const _lazy_SqmDRG = () => import('../routes/api/ip-batch-check.post.mjs');
const _lazy_0ZKhPY = () => import('../routes/api/ip-check.get.mjs');
const _lazy_zgyFUc = () => import('../routes/api/posts.get.mjs');
const _lazy_otqeDT = () => import('../routes/api/posts/_slug_.get.mjs');
const _lazy_yd6Gie = () => import('../routes/api/blog-assets/_name_.mjs');
const _lazy_xpgkCb = () => import('../routes/blog-covers/_name_.get.mjs');
const _lazy_mVgrNw = () => import('../routes/robots.txt.get.mjs');
const _lazy_OuAoM7 = () => import('../routes/sitemap-index.xml.get.mjs').then(function (n) { return n.a; });
const _lazy_ZEa0qx = () => import('../routes/sitemap-index.xml.get.mjs').then(function (n) { return n.s; });
const _lazy_xafXgU = () => import('../routes/renderer.mjs').then(function (n) { return n.r; });

const _canon1106_slash = defineEventHandler((event) => {
  if (event.method !== "GET" && event.method !== "HEAD") return;
  const url = event.path || "/";
  const q = url.indexOf("?");
  const pathname = q === -1 ? url : url.slice(0, q);
  if (pathname.length < 2 || !pathname.endsWith("/")) return;
  if (pathname[1] === "/" || pathname[1] === "\\") return;
  if (/^\/(?:api|_nuxt|blog-covers|__nuxt[^/]*)(?:\/|$)/.test(pathname)) return;
  const target = pathname.replace(/\/+$/, "");
  if (!target || /\.[^/]*$/.test(target)) return;
  return sendRedirect(event, target + (q === -1 ? "" : url.slice(q)), 301);
});

const handlers = [
  { route: '', handler: _canon1106_slash, lazy: false, middleware: true, method: undefined },
  { route: '', handler: _iwQV_f, lazy: false, middleware: true, method: undefined },
  { route: '', handler: _N0550C, lazy: false, middleware: true, method: undefined },
  { route: '/api/admin/blog-covers', handler: _lazy_sqhiKG, lazy: true, middleware: false, method: "post" },
  { route: '/api/admin/login', handler: _lazy_bKtWlP, lazy: true, middleware: false, method: "post" },
  { route: '/api/admin/logout', handler: _lazy_xgAcJA, lazy: true, middleware: false, method: "post" },
  { route: '/api/admin/posts', handler: _lazy_RlLkQh, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin/posts', handler: _lazy_iKWyDz, lazy: true, middleware: false, method: "post" },
  { route: '/api/admin/posts/:slug', handler: _lazy_AfYuO0, lazy: true, middleware: false, method: "delete" },
  { route: '/api/admin/posts/:slug', handler: _lazy_2q9iVm, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin/posts/:slug', handler: _lazy_NMjiVA, lazy: true, middleware: false, method: "put" },
  { route: '/api/admin/posts/order', handler: _lazy_geHLSF, lazy: true, middleware: false, method: "post" },
  { route: '/api/admin/risk-stats', handler: _lazy_FNn6Wl, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin/session', handler: _lazy_Ywm0a2, lazy: true, middleware: false, method: "get" },
  { route: '/api/ip-batch-check', handler: _lazy_SqmDRG, lazy: true, middleware: false, method: "post" },
  { route: '/api/ip-check', handler: _lazy_0ZKhPY, lazy: true, middleware: false, method: "get" },
  { route: '/api/posts', handler: _lazy_zgyFUc, lazy: true, middleware: false, method: "get" },
  { route: '/api/posts/:slug', handler: _lazy_otqeDT, lazy: true, middleware: false, method: "get" },
  { route: '/api/blog-assets/:name', handler: _lazy_yd6Gie, lazy: true, middleware: false, method: undefined },
  { route: '/blog-covers/:name', handler: _lazy_xpgkCb, lazy: true, middleware: false, method: "get" },
  { route: '/robots.txt', handler: _lazy_mVgrNw, lazy: true, middleware: false, method: "get" },
  { route: '/sitemap-index.xml', handler: _lazy_OuAoM7, lazy: true, middleware: false, method: "get" },
  { route: '/sitemap.xml', handler: _lazy_ZEa0qx, lazy: true, middleware: false, method: "get" },
  { route: '/__nuxt_error', handler: _lazy_xafXgU, lazy: true, middleware: false, method: undefined },
  { route: '/__nuxt_island/**', handler: _SxA8c9, lazy: false, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_xafXgU, lazy: true, middleware: false, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const captureError = (error, context = {}) => {
    const promise = hooks.callHookParallel("error", error, context).catch((error_) => {
      console.error("Error while capturing another error", error_);
    });
    if (context.event && isEvent(context.event)) {
      const errors = context.event.context.nitro?.errors;
      if (errors) {
        errors.push({ error, context });
      }
      if (context.event.waitUntil) {
        context.event.waitUntil(promise);
      }
    }
  };
  const h3App = createApp({
    debug: destr(false),
    onError: (error, event) => {
      captureError(error, { event, tags: ["request"] });
      return errorHandler(error, event);
    },
    onRequest: async (event) => {
      event.context.nitro = event.context.nitro || { errors: [] };
      const fetchContext = event.node.req?.__unenv__;
      if (fetchContext?._platform) {
        event.context = {
          _platform: fetchContext?._platform,
          // #3335
          ...fetchContext._platform,
          ...event.context
        };
      }
      if (!event.context.waitUntil && fetchContext?.waitUntil) {
        event.context.waitUntil = fetchContext.waitUntil;
      }
      event.fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: localFetch });
      event.$fetch = (req, init) => fetchWithEvent(event, req, init, {
        fetch: $fetch
      });
      event.waitUntil = (promise) => {
        if (!event.context.nitro._waitUntilPromises) {
          event.context.nitro._waitUntilPromises = [];
        }
        event.context.nitro._waitUntilPromises.push(promise);
        if (event.context.waitUntil) {
          event.context.waitUntil(promise);
        }
      };
      event.captureError = (error, context) => {
        captureError(error, { event, ...context });
      };
      await nitroApp$1.hooks.callHook("request", event).catch((error) => {
        captureError(error, { event, tags: ["request"] });
      });
    },
    onBeforeResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("beforeResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    },
    onAfterResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("afterResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    }
  });
  const router = createRouter({
    preemptive: true
  });
  const nodeHandler = toNodeListener(h3App);
  const localCall = (aRequest) => b(
    nodeHandler,
    aRequest
  );
  const localFetch = (input, init) => {
    if (!input.toString().startsWith("/")) {
      return globalThis.fetch(input, init);
    }
    return C(
      nodeHandler,
      input,
      init
    ).then((response) => normalizeFetchResponse(response));
  };
  const $fetch = createFetch({
    fetch: localFetch,
    Headers: Headers$1,
    defaults: { baseURL: config.app.baseURL }
  });
  globalThis.$fetch = $fetch;
  h3App.use(createRouteRulesHandler({ localFetch }));
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(
        /\/+/g,
        "/"
      );
      h3App.use(middlewareBase, handler);
    } else {
      const routeRules = getRouteRulesForPath(
        h.route.replace(/:\w+|\*\*/g, "_")
      );
      if (routeRules.cache) {
        handler = cachedEventHandler(handler, {
          group: "nitro/routes",
          ...routeRules.cache
        });
      }
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router.handler);
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch,
    captureError
  };
  return app;
}
function runNitroPlugins(nitroApp2) {
  for (const plugin of plugins) {
    try {
      plugin(nitroApp2);
    } catch (error) {
      nitroApp2.captureError(error, { tags: ["plugin"] });
      throw error;
    }
  }
}
const nitroApp$1 = createNitroApp();
function useNitroApp() {
  return nitroApp$1;
}
runNitroPlugins(nitroApp$1);

function defineRenderHandler(render) {
  const runtimeConfig = useRuntimeConfig();
  return eventHandler(async (event) => {
    const nitroApp = useNitroApp();
    const ctx = { event, render, response: void 0 };
    await nitroApp.hooks.callHook("render:before", ctx);
    if (!ctx.response) {
      if (event.path === `${runtimeConfig.app.baseURL}favicon.ico`) {
        setResponseHeader(event, "Content-Type", "image/x-icon");
        return send(
          event,
          "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
        );
      }
      ctx.response = await ctx.render(event);
      if (!ctx.response) {
        const _currentStatus = getResponseStatus(event);
        setResponseStatus(event, _currentStatus === 200 ? 500 : _currentStatus);
        return send(
          event,
          "No response returned from render handler: " + event.path
        );
      }
    }
    await nitroApp.hooks.callHook("render:response", ctx.response, ctx);
    if (ctx.response.headers) {
      setResponseHeaders(event, ctx.response.headers);
    }
    if (ctx.response.statusCode || ctx.response.statusMessage) {
      setResponseStatus(
        event,
        ctx.response.statusCode,
        ctx.response.statusMessage
      );
    }
    return ctx.response.body;
  });
}

const debug = (...args) => {
};
function GracefulShutdown(server, opts) {
  opts = opts || {};
  const options = Object.assign(
    {
      signals: "SIGINT SIGTERM",
      timeout: 3e4,
      development: false,
      forceExit: true,
      onShutdown: (signal) => Promise.resolve(signal),
      preShutdown: (signal) => Promise.resolve(signal)
    },
    opts
  );
  let isShuttingDown = false;
  const connections = {};
  let connectionCounter = 0;
  const secureConnections = {};
  let secureConnectionCounter = 0;
  let failed = false;
  let finalRun = false;
  function onceFactory() {
    let called = false;
    return (emitter, events, callback) => {
      function call() {
        if (!called) {
          called = true;
          return Reflect.apply(callback, this, arguments);
        }
      }
      for (const e of events) {
        emitter.on(e, call);
      }
    };
  }
  const signals = options.signals.split(" ").map((s) => s.trim()).filter((s) => s.length > 0);
  const once = onceFactory();
  once(process, signals, (signal) => {
    debug("received shut down signal", signal);
    shutdown(signal).then(() => {
      if (options.forceExit) {
        process.exit(failed ? 1 : 0);
      }
    }).catch((error) => {
      debug("server shut down error occurred", error);
      process.exit(1);
    });
  });
  function isFunction(functionToCheck) {
    const getType = Object.prototype.toString.call(functionToCheck);
    return /^\[object\s([A-Za-z]+)?Function]$/.test(getType);
  }
  function destroy(socket, force = false) {
    if (socket._isIdle && isShuttingDown || force) {
      socket.destroy();
      if (socket.server instanceof http.Server) {
        delete connections[socket._connectionId];
      } else {
        delete secureConnections[socket._connectionId];
      }
    }
  }
  function destroyAllConnections(force = false) {
    debug("Destroy Connections : " + (force ? "forced close" : "close"));
    let counter = 0;
    let secureCounter = 0;
    for (const key of Object.keys(connections)) {
      const socket = connections[key];
      const serverResponse = socket._httpMessage;
      if (serverResponse && !force) {
        if (!serverResponse.headersSent) {
          serverResponse.setHeader("connection", "close");
        }
      } else {
        counter++;
        destroy(socket);
      }
    }
    debug("Connections destroyed : " + counter);
    debug("Connection Counter    : " + connectionCounter);
    for (const key of Object.keys(secureConnections)) {
      const socket = secureConnections[key];
      const serverResponse = socket._httpMessage;
      if (serverResponse && !force) {
        if (!serverResponse.headersSent) {
          serverResponse.setHeader("connection", "close");
        }
      } else {
        secureCounter++;
        destroy(socket);
      }
    }
    debug("Secure Connections destroyed : " + secureCounter);
    debug("Secure Connection Counter    : " + secureConnectionCounter);
  }
  server.on("request", (req, res) => {
    req.socket._isIdle = false;
    if (isShuttingDown && !res.headersSent) {
      res.setHeader("connection", "close");
    }
    res.on("finish", () => {
      req.socket._isIdle = true;
      destroy(req.socket);
    });
  });
  server.on("connection", (socket) => {
    if (isShuttingDown) {
      socket.destroy();
    } else {
      const id = connectionCounter++;
      socket._isIdle = true;
      socket._connectionId = id;
      connections[id] = socket;
      socket.once("close", () => {
        delete connections[socket._connectionId];
      });
    }
  });
  server.on("secureConnection", (socket) => {
    if (isShuttingDown) {
      socket.destroy();
    } else {
      const id = secureConnectionCounter++;
      socket._isIdle = true;
      socket._connectionId = id;
      secureConnections[id] = socket;
      socket.once("close", () => {
        delete secureConnections[socket._connectionId];
      });
    }
  });
  process.on("close", () => {
    debug("closed");
  });
  function shutdown(sig) {
    function cleanupHttp() {
      destroyAllConnections();
      debug("Close http server");
      return new Promise((resolve, reject) => {
        server.close((err) => {
          if (err) {
            return reject(err);
          }
          return resolve(true);
        });
      });
    }
    debug("shutdown signal - " + sig);
    if (options.development) {
      debug("DEV-Mode - immediate forceful shutdown");
      return process.exit(0);
    }
    function finalHandler() {
      if (!finalRun) {
        finalRun = true;
        if (options.finally && isFunction(options.finally)) {
          debug("executing finally()");
          options.finally();
        }
      }
      return Promise.resolve();
    }
    function waitForReadyToShutDown(totalNumInterval) {
      debug(`waitForReadyToShutDown... ${totalNumInterval}`);
      if (totalNumInterval === 0) {
        debug(
          `Could not close connections in time (${options.timeout}ms), will forcefully shut down`
        );
        return Promise.resolve(true);
      }
      const allConnectionsClosed = Object.keys(connections).length === 0 && Object.keys(secureConnections).length === 0;
      if (allConnectionsClosed) {
        debug("All connections closed. Continue to shutting down");
        return Promise.resolve(false);
      }
      debug("Schedule the next waitForReadyToShutdown");
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(waitForReadyToShutDown(totalNumInterval - 1));
        }, 250);
      });
    }
    if (isShuttingDown) {
      return Promise.resolve();
    }
    debug("shutting down");
    return options.preShutdown(sig).then(() => {
      isShuttingDown = true;
      cleanupHttp();
    }).then(() => {
      const pollIterations = options.timeout ? Math.round(options.timeout / 250) : 0;
      return waitForReadyToShutDown(pollIterations);
    }).then((force) => {
      debug("Do onShutdown now");
      if (force) {
        destroyAllConnections(force);
      }
      return options.onShutdown(sig);
    }).then(finalHandler).catch((error) => {
      const errString = typeof error === "string" ? error : JSON.stringify(error);
      debug(errString);
      failed = true;
      throw errString;
    });
  }
  function shutdownManual() {
    return shutdown("manual");
  }
  return shutdownManual;
}

function getGracefulShutdownConfig() {
  return {
    disabled: !!process.env.NITRO_SHUTDOWN_DISABLED,
    signals: (process.env.NITRO_SHUTDOWN_SIGNALS || "SIGTERM SIGINT").split(" ").map((s) => s.trim()),
    timeout: Number.parseInt(process.env.NITRO_SHUTDOWN_TIMEOUT || "", 10) || 3e4,
    forceExit: !process.env.NITRO_SHUTDOWN_NO_FORCE_EXIT
  };
}
function setupGracefulShutdown(listener, nitroApp) {
  const shutdownConfig = getGracefulShutdownConfig();
  if (shutdownConfig.disabled) {
    return;
  }
  GracefulShutdown(listener, {
    signals: shutdownConfig.signals.join(" "),
    timeout: shutdownConfig.timeout,
    forceExit: shutdownConfig.forceExit,
    onShutdown: async () => {
      await new Promise((resolve) => {
        const timeout = setTimeout(() => {
          console.warn("Graceful shutdown timeout, force exiting...");
          resolve();
        }, shutdownConfig.timeout);
        nitroApp.hooks.callHook("close").catch((error) => {
          console.error(error);
        }).finally(() => {
          clearTimeout(timeout);
          resolve();
        });
      });
    }
  });
}

const cert = process.env.NITRO_SSL_CERT;
const key = process.env.NITRO_SSL_KEY;
const nitroApp = useNitroApp();
const server = cert && key ? new Server({ key, cert }, toNodeListener(nitroApp.h3App)) : new Server$1(toNodeListener(nitroApp.h3App));
const port = destr(process.env.NITRO_PORT || process.env.PORT) || 3e3;
const host = process.env.NITRO_HOST || process.env.HOST;
const path = process.env.NITRO_UNIX_SOCKET;
const listener = server.listen(path ? { path } : { port, host }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  const protocol = cert && key ? "https" : "http";
  const addressInfo = listener.address();
  if (typeof addressInfo === "string") {
    console.log(`Listening on unix socket ${addressInfo}`);
    return;
  }
  const baseURL = (useRuntimeConfig().app.baseURL || "").replace(/\/$/, "");
  const url = `${protocol}://${addressInfo.family === "IPv6" ? `[${addressInfo.address}]` : addressInfo.address}:${addressInfo.port}${baseURL}`;
  console.log(`Listening on ${url}`);
});
trapUnhandledNodeErrors();
setupGracefulShutdown(listener, nitroApp);
const nodeServer = {};

export { $fetch as $, ADMIN_COOKIE as A, withQuery as B, sanitizeStatusCode as C, parseURL as D, encodePath as E, decodePath as F, defu as G, isEqual as H, joinRelativeURL as I, defineRenderHandler as J, destr as K, getRouteRules as L, relative as M, getResponseStatusText as N, getResponseStatus as O, useNitroApp as P, nodeServer as Q, readBody as a, createSessionToken as b, createError$1 as c, defineEventHandler as d, sessionCookieOptions as e, deleteCookie as f, getRequestHeader as g, setResponseStatus as h, getRouterParam as i, verifySessionToken as j, getCookie as k, getQuery as l, getRequestHeaders as m, getRequestIP as n, setResponseHeader as o, hasProtocol as p, joinURL as q, readMultipartFormData as r, setCookie as s, parseQuery as t, useRuntimeConfig as u, verifyPassword as v, isScriptProtocol as w, withTrailingSlash as x, withoutTrailingSlash as y, klona as z };
//# sourceMappingURL=nitro.mjs.map
