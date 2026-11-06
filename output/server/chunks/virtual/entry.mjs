import { getCurrentScope, ref, watchEffect, getCurrentInstance, onBeforeUnmount, onDeactivated, onActivated, shallowReactive, reactive, effectScope, hasInjectionContext, inject, createApp, provide, onErrorCaptured, onServerPrefetch, unref, createVNode, resolveDynamicComponent, defineComponent, mergeProps, computed, toRef, defineAsyncComponent, h, isRef, isVNode, createCommentVNode, shallowRef, isReadonly, watch, Suspense, Fragment, useSSRContext, isShallow, isReactive, toRaw, customRef } from 'vue';
import { walkResolver } from 'unhead/utils';
import { i as injectHead$1, V as VueResolver, h as headSymbol, b as baseURL } from '../routes/renderer.mjs';
import { c as createError, $ as $fetch, p as hasProtocol, w as isScriptProtocol, q as joinURL, z as klona, B as withQuery, C as sanitizeStatusCode, D as parseURL, E as encodePath, F as decodePath, G as defu, g as getRequestHeader, H as isEqual, s as setCookie, k as getCookie, f as deleteCookie } from '../nitro/nitro.mjs';
import { RouterView, createMemoryHistory, createRouter, START_LOCATION } from 'vue-router';
import { ssrRenderSuspense, ssrRenderComponent, ssrRenderVNode } from 'vue/server-renderer';

function useHead(input, options = {}) {
  const head = options.head || injectHead$1();
  return head.ssr ? head.push(input || {}, options) : clientUseHead(head, input, options);
}
function clientUseHead(head, input, options = {}) {
  const scope = getCurrentScope();
  if (scope && !scope.active) {
    return { patch() {
    }, dispose() {
    }, _i: -1 };
  }
  const deactivated = ref(false);
  if (options.onRendered && scope) {
    const _onRendered = options.onRendered;
    options = { ...options, onRendered: (ctx) => scope.run(() => _onRendered(ctx)) };
  }
  let entry;
  watchEffect(() => {
    const i = deactivated.value ? {} : walkResolver(input, VueResolver);
    if (entry) {
      entry.patch(i);
    } else {
      entry = head.push(i, options);
    }
  });
  const vm = getCurrentInstance();
  if (vm) {
    onBeforeUnmount(() => {
      entry.dispose();
    });
    onDeactivated(() => {
      deactivated.value = true;
    });
    onActivated(() => {
      deactivated.value = false;
    });
  }
  return entry;
}

function flatHooks(configHooks, hooks = {}, parentName) {
	for (const key in configHooks) {
		const subHook = configHooks[key];
		const name = parentName ? `${parentName}:${key}` : key;
		if (typeof subHook === "object" && subHook !== null) flatHooks(subHook, hooks, name);
		else if (typeof subHook === "function") hooks[name] = subHook;
	}
	return hooks;
}
const createTask = /* @__PURE__ */ (() => {
	if (console.createTask) return console.createTask;
	const defaultTask = { run: (fn) => fn() };
	return () => defaultTask;
})();
function callHooks(hooks, args, startIndex, task) {
	for (let i = startIndex; i < hooks.length; i += 1) try {
		const result = task ? task.run(() => hooks[i](...args)) : hooks[i](...args);
		if (result && typeof result.then === "function") return Promise.resolve(result).then(() => callHooks(hooks, args, i + 1, task));
	} catch (error) {
		return Promise.reject(error);
	}
}
function serialTaskCaller(hooks, args, name) {
	if (hooks.length > 0) return callHooks(hooks, args, 0, createTask(name));
}
function parallelTaskCaller(hooks, args, name) {
	if (hooks.length > 0) {
		const task = createTask(name);
		return Promise.all(hooks.map((hook) => task.run(() => hook(...args))));
	}
}
function callEachWith(callbacks, arg0) {
	for (const callback of [...callbacks]) callback(arg0);
}
var Hookable = class {
	_hooks;
	_before;
	_after;
	_deprecatedHooks;
	_deprecatedMessages;
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
		if (!name || typeof function_ !== "function") return () => {};
		const originalName = name;
		let dep;
		while (this._deprecatedHooks[name]) {
			dep = this._deprecatedHooks[name];
			name = dep.to;
		}
		if (dep && !options.allowDeprecated) {
			let message = dep.message;
			if (!message) message = `${originalName} hook has been deprecated` + (dep.to ? `, please use ${dep.to}` : "");
			if (!this._deprecatedMessages) this._deprecatedMessages = /* @__PURE__ */ new Set();
			if (!this._deprecatedMessages.has(message)) {
				console.warn(message);
				this._deprecatedMessages.add(message);
			}
		}
		if (!function_.name) try {
			Object.defineProperty(function_, "name", {
				get: () => "_" + name.replace(/\W+/g, "_") + "_hook_cb",
				configurable: true
			});
		} catch {}
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
			if (typeof _unreg === "function") _unreg();
			_unreg = void 0;
			_function = void 0;
			return function_(...arguments_);
		};
		_unreg = this.hook(name, _function);
		return _unreg;
	}
	removeHook(name, function_) {
		const hooks = this._hooks[name];
		if (hooks) {
			const index = hooks.indexOf(function_);
			if (index !== -1) hooks.splice(index, 1);
			if (hooks.length === 0) this._hooks[name] = void 0;
		}
	}
	clearHook(name) {
		this._hooks[name] = void 0;
	}
	deprecateHook(name, deprecated) {
		this._deprecatedHooks[name] = typeof deprecated === "string" ? { to: deprecated } : deprecated;
		const _hooks = this._hooks[name] || [];
		this._hooks[name] = void 0;
		for (const hook of _hooks) this.hook(name, hook);
	}
	deprecateHooks(deprecatedHooks) {
		for (const name in deprecatedHooks) this.deprecateHook(name, deprecatedHooks[name]);
	}
	addHooks(configHooks) {
		const hooks = flatHooks(configHooks);
		const removeFns = Object.keys(hooks).map((key) => this.hook(key, hooks[key]));
		return () => {
			for (const unreg of removeFns) unreg();
			removeFns.length = 0;
		};
	}
	removeHooks(configHooks) {
		const hooks = flatHooks(configHooks);
		for (const key in hooks) this.removeHook(key, hooks[key]);
	}
	removeAllHooks() {
		this._hooks = {};
	}
	callHook(name, ...args) {
		return this.callHookWith(serialTaskCaller, name, args);
	}
	callHookParallel(name, ...args) {
		return this.callHookWith(parallelTaskCaller, name, args);
	}
	callHookWith(caller, name, args) {
		const event = this._before || this._after ? {
			name,
			args,
			context: {}
		} : void 0;
		if (this._before) callEachWith(this._before, event);
		const result = caller(this._hooks[name] ? [...this._hooks[name]] : [], args, name);
		if (result instanceof Promise) return result.finally(() => {
			if (this._after && event) callEachWith(this._after, event);
		});
		if (this._after && event) callEachWith(this._after, event);
		return result;
	}
	beforeEach(function_) {
		this._before = this._before || [];
		this._before.push(function_);
		return () => {
			if (this._before !== void 0) {
				const index = this._before.indexOf(function_);
				if (index !== -1) this._before.splice(index, 1);
			}
		};
	}
	afterEach(function_) {
		this._after = this._after || [];
		this._after.push(function_);
		return () => {
			if (this._after !== void 0) {
				const index = this._after.indexOf(function_);
				if (index !== -1) this._after.splice(index, 1);
			}
		};
	}
};
function createHooks() {
	return new Hookable();
}

function _getAsyncLocalStorage() {
	return globalThis.AsyncLocalStorage || globalThis.process?.getBuiltinModule?.("node:async_hooks")?.AsyncLocalStorage;
}
function createContext(opts = {}) {
	let currentInstance;
	let isSingleton = false;
	const checkConflict = (instance) => {
		if (currentInstance && currentInstance !== instance) throw new Error("Context conflict");
	};
	let als;
	if (opts.asyncContext) {
		const _AsyncLocalStorage = opts.AsyncLocalStorage || _getAsyncLocalStorage();
		if (_AsyncLocalStorage) als = new _AsyncLocalStorage();
		else console.warn("[unctx] `AsyncLocalStorage` is not provided.");
	}
	const _wrapInstance = (instance) => als && instance !== null && typeof instance === "object" ? { __unctx_weak: new WeakRef(instance) } : instance;
	const _unwrapInstance = (store) => store && store.__unctx_weak ? store.__unctx_weak.deref() : store;
	const _getCurrentInstance = () => {
		if (als) {
			const store = als.getStore();
			if (store !== void 0) return _unwrapInstance(store);
		}
		return currentInstance;
	};
	return {
		use: () => {
			const _instance = _getCurrentInstance();
			if (_instance === void 0) throw new Error("Context is not available");
			return _instance;
		},
		tryUse: () => {
			return _getCurrentInstance();
		},
		set: (instance, replace) => {
			if (!replace) checkConflict(instance);
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
				return als ? als.run(_wrapInstance(instance), callback) : callback();
			} finally {
				if (!isSingleton) currentInstance = void 0;
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
				const r = als ? als.run(_wrapInstance(instance), callback) : callback();
				if (!isSingleton) currentInstance = void 0;
				return await r;
			} finally {
				asyncHandlers.delete(onLeave);
			}
		}
	};
}
function createNamespace(defaultOpts = {}) {
	const contexts = {};
	return { get(key, opts = {}) {
		if (!contexts[key]) contexts[key] = createContext({
			...defaultOpts,
			...opts
		});
		return contexts[key];
	} };
}
const _globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : {};
const globalKey = "__unctx__";
const defaultNamespace = _globalThis[globalKey] || (_globalThis[globalKey] = createNamespace());
const getContext = (key, opts = {}) => defaultNamespace.get(key, opts);
const asyncHandlersKey = "__unctx_async_handlers__";
const asyncHandlers = _globalThis[asyncHandlersKey] || (_globalThis[asyncHandlersKey] = /* @__PURE__ */ new Set());
function executeAsync(function_) {
	const restores = [];
	for (const leaveHandler of asyncHandlers) {
		const restore = leaveHandler();
		if (restore) restores.push(restore);
	}
	const restore = () => {
		for (const restore of restores) restore();
	};
	let awaitable = function_();
	if (awaitable && typeof awaitable === "object" && "catch" in awaitable) awaitable = awaitable.catch((error) => {
		restore();
		throw error;
	});
	return [awaitable, restore];
}

var captureStackTrace = Error.captureStackTrace;
var Diagnostic = class Diagnostic extends Error {
	name;
	/**
	* The diagnostic code, e.g. `MATH_E001`.
	* Also appears as the `name` property.
	*/
	code;
	/**
	* URL to extended documentation for this diagnostic code.
	* Auto-generated from {@link DefineDiagnosticsOptions.docsBase}.
	*/
	docs;
	/**
	* Optional actionable instructions on how to resolve the problem.
	*/
	fix;
	/**
	* Locations in user code that contributed to this diagnostic, in
	* `file:line:column` format. Relevant when the stack trace doesn't reflect
	* the user's source (e.g. compilers, bundlers), otherwise redundant with the
	* stack and should be omitted.
	*/
	sources;
	/**
	* Alias for {@link Error.message}: the reason this diagnostic was raised.
	*/
	get why() {
		return this.message;
	}
	/**
	* @param init        structured initializer; `why` is required
	* @param captureFrom V8 stack-cutoff frame. Defaults to {@link Diagnostic}
	* so the top of the trace is the `new Diagnostic(...)` call site.
	* `defineDiagnostics` passes its action method to strip its own frames too.
	* Ignored on engines without `Error.captureStackTrace`.
	*/
	constructor(init, captureFrom = Diagnostic) {
		super(init.why, { cause: init.cause });
		this.code = this.name = init.code;
		this.fix = init.fix;
		this.docs = init.docs;
		this.sources = init.sources;
		captureStackTrace?.(this, captureFrom);
	}
	/**
	* Converts the diagnostic into a serializable structured object.
	*/
	toJSON() {
		return {
			name: this.name,
			why: this.why,
			fix: this.fix,
			docs: this.docs,
			sources: this.sources,
			cause: this.cause,
			stack: this.stack
		};
	}
};
/**
* Resolves the docs URL for a code from a `docsBase` (string template or
* resolver function). Shared by {@link defineDiagnostics} and
* {@link defineProdDiagnostics}. Per-code `docs` overrides are handled by the
* caller; this only covers the `docsBase`-derived case.
*
* @internal
*/
function deriveDocs(docsBase, code) {
	return typeof docsBase === "string" ? `${docsBase}/${code.toLowerCase()}` : docsBase?.(code);
}
/**
* Production counterpart to {@link defineDiagnostics}. Returns a `Proxy` that
* builds a minimal {@link Diagnostic} for any accessed code: the code becomes
* the instance `name`, `docs` is derived from `docsBase`, and `why` points to
* the docs URL when one exists (empty otherwise, so the thrown header is just
* the code). It carries no catalog text, so it stays tiny in a bundle.
*
* The strip plugin (`@nostics/unplugin`) can rewrite a `defineDiagnostics()`
* call into a `"production" === 'production'` ternary that selects this
* factory in production, dropping every `why`/`fix` string from the bundle.
*
* @example
* ```ts
* const diagnostics = defineProdDiagnostics({ docsBase: 'https://docs.example.com' })
* throw diagnostics.NUXT_B2011() // NUXT_B2011: https://docs.example.com/nuxt_b2011
* ```
*/
/* @__NO_SIDE_EFFECTS__ */
function defineProdDiagnostics(options = {}) {
	const { docsBase, reporters = [] } = options;
	return new Proxy({}, { get(_target, code) {
		if (typeof code !== "string") return void 0;
		const handle = (params = {}, reporterOptions = {}) => {
			const docs = deriveDocs(docsBase, code);
			const diagnostic = new Diagnostic({
				code,
				why: docs ?? "",
				docs,
				cause: params.cause,
				sources: params.sources
			}, handle);
			for (const reporter of reporters) reporter(diagnostic, reporterOptions);
			return diagnostic;
		};
		return handle;
	} });
}
//#endregion
//#region node_modules/.pnpm/nuxt@4.5.2_@babel+plugin-syntax-jsx@7.29.7_@babel+core@7.29.7__@babel+plugin-syntax-typ_7b5abac9ad6b4131f0af60bfddb7caf2/node_modules/nuxt/dist/app/diagnostics/_shared.js
/**
* Shared configuration for the runtime (E<N>xxx) diagnostics catalogs.
*
* Catalogs are split by domain and imported directly where used (no barrel),
* so the browser bundle only pulls in the codes a module references. Pair the
* pure-call annotations on each `defineDiagnostics()` with dev-guarded,
* statement-level report calls so report-only diagnostics strip from production.
*
* Codes are stable, fully-qualified `NUXT_E<NNNN>` identifiers. Codes with a
* dedicated docs page resolve a `see:` URL via {@link docsBase}; the rest opt
* out with `docs: false`.
*/
function docsBase(code) {
	return `https://nuxt.com/docs/4.x/errors/${code.replace("NUXT_", "").toLowerCase()}`;
}
var prodReporter = (diagnostic) => {
	console.error(`[${diagnostic.name}]`);
};
var prodReporters = [prodReporter];
//#endregion
//#region node_modules/.pnpm/nuxt@4.5.2_@babel+plugin-syntax-jsx@7.29.7_@babel+core@7.29.7__@babel+plugin-syntax-typ_7b5abac9ad6b4131f0af60bfddb7caf2/node_modules/nuxt/dist/app/diagnostics/core.js
/**
* E1xxx
* Core / Nuxt-instance / lifecycle runtime diagnostics.
*/
var appDiagnostics = /* #__PURE__ */ defineProdDiagnostics({
	docsBase,
	reporters: prodReporters
});
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fnuxt.config.mjs
var nuxtLinkDefaults = {
	"componentName": "NuxtLink"};
var asyncDataDefaults = { "deep": false };
//#endregion
//#region node_modules/.pnpm/nuxt@4.5.2_@babel+plugin-syntax-jsx@7.29.7_@babel+core@7.29.7__@babel+plugin-syntax-typ_7b5abac9ad6b4131f0af60bfddb7caf2/node_modules/nuxt/dist/app/nuxt.js
function getNuxtAppCtx(id = "nuxt-app") {
	return getContext(id, { asyncContext: false });
}
var NuxtPluginIndicator = "__nuxt_plugin";
/** @since 3.0.0 */
function createNuxtApp(options) {
	let hydratingCount = 0;
	const nuxtApp = {
		_id: options.id || "nuxt-app",
		_scope: effectScope(),
		provide: void 0,
		versions: {
			get nuxt() {
				return "4.5.2";
			},
			get vue() {
				return nuxtApp.vueApp.version;
			}
		},
		payload: shallowReactive({
			...options.ssrContext?.payload || {},
			data: shallowReactive({}),
			state: reactive({}),
			once: /* @__PURE__ */ new Set(),
			_errors: shallowReactive({})
		}),
		static: { data: {} },
		runWithContext(fn) {
			if (nuxtApp._scope.active && !getCurrentScope()) return nuxtApp._scope.run(() => callWithNuxt(nuxtApp, fn));
			return callWithNuxt(nuxtApp, fn);
		},
		isHydrating: false,
		deferHydration() {
			if (!nuxtApp.isHydrating) return () => {};
			hydratingCount++;
			let called = false;
			return () => {
				if (called) return;
				called = true;
				hydratingCount--;
				if (hydratingCount === 0) {
					nuxtApp.isHydrating = false;
					return nuxtApp.callHook("app:suspense:resolve");
				}
			};
		},
		_asyncDataPromises: {},
		_asyncData: shallowReactive({}),
		_state: shallowReactive({}),
		_payloadRevivers: {},
		...options
	};
	nuxtApp.payload.serverRendered = true;
	if (nuxtApp.ssrContext) {
		nuxtApp.payload.path = nuxtApp.ssrContext.url;
		nuxtApp.ssrContext.nuxt = nuxtApp;
		nuxtApp.ssrContext.payload = nuxtApp.payload;
		nuxtApp.ssrContext.config = {
			public: nuxtApp.ssrContext.runtimeConfig.public,
			app: nuxtApp.ssrContext.runtimeConfig.app
		};
	}
	nuxtApp.hooks = createHooks();
	nuxtApp.hook = nuxtApp.hooks.hook;
	{
		const contextCaller = async function(hooks, args) {
			for (const hook of hooks) await nuxtApp.runWithContext(() => hook(...args));
		};
		nuxtApp.hooks.callHook = (name, ...args) => nuxtApp.hooks.callHookWith(contextCaller, name, args);
	}
	nuxtApp.callHook = nuxtApp.hooks.callHook;
	nuxtApp.provide = (name, value) => {
		const $name = "$" + name;
		defineGetter(nuxtApp, $name, value);
		defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
	};
	defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
	defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
	const runtimeConfig = options.ssrContext.runtimeConfig;
	nuxtApp.provide("config", runtimeConfig);
	return nuxtApp;
}
/** @since 3.0.0 */
async function applyPlugin(nuxtApp, plugin) {
	if (typeof plugin === "function") {
		const run = () => nuxtApp.runWithContext(() => plugin(nuxtApp));
		const { provide } = await run() || {};
		if (provide && typeof provide === "object") for (const key in provide) nuxtApp.provide(key, provide[key]);
	}
}
/** @since 3.0.0 */
async function applyPlugins(nuxtApp, plugins) {
	let error;
	for (const plugin of plugins) try {
		await applyPlugin(nuxtApp, plugin);
	} catch (e) {
		if (!nuxtApp.payload.error) throw e;
		error ||= e;
	}
	if (error) throw nuxtApp.payload.error || error;
}
/** @since 3.0.0 */
/* @__NO_SIDE_EFFECTS__ */
function defineNuxtPlugin(plugin) {
	if (typeof plugin === "function") return plugin;
	const _name = plugin._name || plugin.name;
	delete plugin.name;
	return Object.assign(plugin.setup || (() => {}), plugin, {
		[NuxtPluginIndicator]: true,
		_name
	});
}
/**
* Ensures that the setup function passed in has access to the Nuxt instance via `useNuxtApp`.
* @param nuxt A Nuxt instance
* @param setup The function to call
* @since 3.0.0
*/
function callWithNuxt(nuxt, setup, args) {
	const fn = () => setup();
	const nuxtAppCtx = getNuxtAppCtx(nuxt._id);
	return nuxt.vueApp.runWithContext(() => nuxtAppCtx.callAsync(nuxt, fn));
}
function tryUseNuxtApp(id) {
	let nuxtAppInstance;
	if (hasInjectionContext()) nuxtAppInstance = getCurrentInstance()?.appContext.app.$nuxt;
	nuxtAppInstance ||= getNuxtAppCtx(id).tryUse();
	return nuxtAppInstance || null;
}
function useNuxtApp(id) {
	const nuxtAppInstance = tryUseNuxtApp(id);
	if (!nuxtAppInstance) throw appDiagnostics.NUXT_E1001();
	return nuxtAppInstance;
}
/** @since 3.0.0 */
/* @__NO_SIDE_EFFECTS__ */
function useRuntimeConfig(_event) {
	return useNuxtApp().$config;
}
function defineGetter(obj, key, val) {
	Object.defineProperty(obj, key, { get: () => val });
}
//#endregion
//#region node_modules/.pnpm/nuxt@4.5.2_@babel+plugin-syntax-jsx@7.29.7_@babel+core@7.29.7__@babel+plugin-syntax-typ_7b5abac9ad6b4131f0af60bfddb7caf2/node_modules/nuxt/dist/app/diagnostics/head.js
/**
* E6xxx
* Head / unhead runtime diagnostics.
*/
var unheadDiagnostics = /* #__PURE__ */ defineProdDiagnostics({
	docsBase,
	reporters: prodReporters
});
//#endregion
//#region node_modules/.pnpm/nuxt@4.5.2_@babel+plugin-syntax-jsx@7.29.7_@babel+core@7.29.7__@babel+plugin-syntax-typ_7b5abac9ad6b4131f0af60bfddb7caf2/node_modules/nuxt/dist/head/runtime/composables.js
/**
* Injects the head client from the Nuxt context or Vue inject.
*/
function injectHead(nuxtApp) {
	const nuxt = nuxtApp || useNuxtApp();
	return nuxt.ssrContext?.head || nuxt.runWithContext(() => {
		if (hasInjectionContext()) {
			const head = inject(headSymbol);
			if (!head) throw unheadDiagnostics.NUXT_E6001();
			return head;
		}
	});
}
function useHead$1(input, options = {}) {
	const head = options.head || injectHead(options.nuxt);
	return useHead(input, {
		head,
		...options
	});
}

function endIndex(str, min, len) {
	const index = str.indexOf(";", min);
	return index === -1 ? len : index;
}
function eqIndex(str, min, max) {
	const index = str.indexOf("=", min);
	return index < max ? index : -1;
}
function valueSlice(str, min, max) {
	if (min === max) return "";
	let start = min;
	let end = max;
	do {
		const code = str.charCodeAt(start);
		if (code !== 32 && code !== 9) break;
	} while (++start < end);
	while (end > start) {
		const code = str.charCodeAt(end - 1);
		if (code !== 32 && code !== 9) break;
		end--;
	}
	return str.slice(start, end);
}
const NullObject = /* @__PURE__ */ (() => {
	const C = function() {};
	C.prototype = Object.create(null);
	return C;
})();
function parse(str, options) {
	const obj = new NullObject();
	const len = str.length;
	if (len < 2) return obj;
	const dec = options?.decode || decode;
	const allowMultiple = options?.allowMultiple || false;
	let index = 0;
	do {
		const eqIdx = eqIndex(str, index, len);
		if (eqIdx === -1) break;
		const endIdx = endIndex(str, index, len);
		if (eqIdx > endIdx) {
			index = str.lastIndexOf(";", eqIdx - 1) + 1;
			continue;
		}
		const key = valueSlice(str, index, eqIdx);
		if (options?.filter && !options.filter(key)) {
			index = endIdx + 1;
			continue;
		}
		const val = dec(valueSlice(str, eqIdx + 1, endIdx));
		if (allowMultiple) {
			const existing = obj[key];
			if (existing === void 0) obj[key] = val;
			else if (Array.isArray(existing)) existing.push(val);
			else obj[key] = [existing, val];
		} else if (obj[key] === void 0) obj[key] = val;
		index = endIdx + 1;
	} while (index < len);
	return obj;
}
function decode(str) {
	if (!str.includes("%")) return str;
	try {
		return decodeURIComponent(str);
	} catch {
		return str;
	}
}

//#region node_modules/.pnpm/nuxt@4.5.2_@babel+plugin-syntax-jsx@7.29.7_@babel+core@7.29.7__@babel+plugin-syntax-typ_7b5abac9ad6b4131f0af60bfddb7caf2/node_modules/nuxt/dist/app/components/injections.js
var LayoutMetaSymbol = Symbol("layout-meta");
var PageRouteSymbol = Symbol("route");
//#endregion
//#region node_modules/.pnpm/nuxt@4.5.2_@babel+plugin-syntax-jsx@7.29.7_@babel+core@7.29.7__@babel+plugin-syntax-typ_7b5abac9ad6b4131f0af60bfddb7caf2/node_modules/nuxt/dist/app/diagnostics/navigation.js
/**
* E2xxx
* Navigation / routing / middleware runtime diagnostics.
*/
var navigationDiagnostics = /* #__PURE__ */ defineProdDiagnostics({
	docsBase,
	reporters: prodReporters
});
//#endregion
//#region node_modules/.pnpm/nuxt@4.5.2_@babel+plugin-syntax-jsx@7.29.7_@babel+core@7.29.7__@babel+plugin-syntax-typ_7b5abac9ad6b4131f0af60bfddb7caf2/node_modules/nuxt/dist/app/composables/router.js
/** @since 3.0.0 */
var useRouter = () => {
	return useNuxtApp()?.$router;
};
/**
* Whether the current effect scope is (a descendant of) the component instance's scope.
* A detached scope (e.g. `createSharedComposable`) outlives the component, so the
* per-page route injected there would freeze after navigation (#18903).
*/
function isScopeWithinInstance(instance) {
	const instanceScope = instance.scope;
	let scope = getCurrentScope();
	while (scope) {
		if (scope === instanceScope) return true;
		scope = scope.parent;
	}
	return false;
}
/** @since 3.0.0 */
var useRoute$1 = (() => {
	if (hasInjectionContext()) {
		const instance = getCurrentInstance();
		if (!instance || isScopeWithinInstance(instance)) return inject(PageRouteSymbol, useNuxtApp()._route);
	}
	return useNuxtApp()._route;
});
/** @since 3.0.0 */
/* @__NO_SIDE_EFFECTS__ */
function defineNuxtRouteMiddleware(middleware) {
	return middleware;
}
/** @since 3.0.0 */
var isProcessingMiddleware = () => {
	try {
		if (useNuxtApp()._processingMiddleware) return true;
	} catch {
		return false;
	}
	return false;
};
var HTML_ATTR_UNSAFE_RE = /[&"'<>]/g;
var HTML_ATTR_ENCODE_MAP = {
	"&": "&amp;",
	"\"": "&quot;",
	"'": "&#x27;",
	"<": "&lt;",
	">": "&gt;"
};
function encodeForHtmlAttr(value) {
	return value.replace(HTML_ATTR_UNSAFE_RE, (c) => HTML_ATTR_ENCODE_MAP[c]);
}
/**
* A helper that aids in programmatic navigation within your Nuxt application.
*
* Can be called on the server and on the client, within pages, route middleware, plugins, and more.
* @param {RouteLocationRaw | undefined | null} [to] - The route to navigate to. Accepts a route object, string path, `undefined`, or `null`. Defaults to '/'.
* @param {NavigateToOptions} [options] - Optional customization for controlling the behavior of the navigation.
* @returns {Promise<void | NavigationFailure | false> | false | void | RouteLocationRaw} The navigation result, which varies depending on context and options.
* @see https://nuxt.com/docs/4.x/api/utils/navigate-to
* @since 3.0.0
*/
var navigateTo = (to, options) => {
	to ||= "/";
	const toPath = typeof to === "string" ? to : "path" in to ? resolveRouteObject(to) : useRouter().resolve(to).href;
	const isExternalHost = hasProtocol(toPath, { acceptRelative: true });
	const isExternal = options?.external || isExternalHost;
	if (isExternal) {
		if (!options?.external) throw navigationDiagnostics.NUXT_E2001({ toPath });
		const { protocol } = new URL(toPath, "http://localhost");
		if (protocol && isScriptProtocol(protocol)) throw navigationDiagnostics.NUXT_E2002({
			toPath,
			protocol
		});
	}
	const inMiddleware = isProcessingMiddleware();
	const router = useRouter();
	const nuxtApp = useNuxtApp();
	if (nuxtApp.ssrContext) {
		const fullPath = typeof to === "string" || isExternal ? toPath : router.resolve(to).fullPath || "/";
		const location = isExternal ? toPath : joinURL((/* @__PURE__ */ useRuntimeConfig()).app.baseURL, fullPath);
		const redirect = async function(response) {
			await nuxtApp.callHook("app:redirected");
			const encodedHeader = encodeURL(location, isExternalHost);
			const encodedLoc = encodeForHtmlAttr(encodedHeader);
			nuxtApp.ssrContext["~renderResponse"] = {
				statusCode: sanitizeStatusCode(options?.redirectCode || 302, 302),
				body: `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`,
				headers: { location: encodedHeader }
			};
			return response;
		};
		if (!isExternal && inMiddleware) {
			router.afterEach((final) => final.fullPath === fullPath ? redirect(false) : void 0);
			return to;
		}
		return redirect(!inMiddleware ? void 0 : false);
	}
	if (isExternal) {
		nuxtApp._scope.stop();
		if (options?.replace) (void 0).replace(toPath);
		else (void 0).href = toPath;
		if (inMiddleware) {
			if (!nuxtApp.isHydrating) return false;
			return new Promise(() => {});
		}
		return Promise.resolve();
	}
	const encodedTo = typeof to === "string" ? encodeRoutePath(to) : to;
	return options?.replace ? router.replace(encodedTo) : router.push(encodedTo);
};
/**
* @internal
*/
function resolveRouteObject(to) {
	return withQuery(to.path || "", to.query || {}) + (to.hash || "");
}
/**
* @internal
*/
function encodeURL(location, isExternalHost = false) {
	const url = new URL(location, "http://localhost");
	if (!isExternalHost) return url.pathname.replace(/^\/{2,}/, "/") + url.search + url.hash;
	if (location.startsWith("//")) return url.toString().replace(url.protocol, "");
	return url.toString();
}
/**
* Encode the pathname of a route location string. Ensures decoded paths like
* `/café` are percent-encoded to match vue-router's encoded route records.
* Already-encoded paths are not double-encoded.
* @internal
*/
function encodeRoutePath(url) {
	const parsed = parseURL(url);
	return encodePath(decodePath(parsed.pathname)) + parsed.search + parsed.hash;
}
//#endregion
//#region node_modules/.pnpm/nuxt@4.5.2_@babel+plugin-syntax-jsx@7.29.7_@babel+core@7.29.7__@babel+plugin-syntax-typ_7b5abac9ad6b4131f0af60bfddb7caf2/node_modules/nuxt/dist/app/composables/error.js
var NUXT_ERROR_SIGNATURE = "__nuxt_error";
/** @since 3.0.0 */
var useError = /* @__NO_SIDE_EFFECTS__ */ () => toRef(useNuxtApp().payload, "error");
/** @since 3.0.0 */
var showError = (error) => {
	const nuxtError = createError$1(error);
	try {
		const error = /* @__PURE__ */ useError();
		error.value ||= nuxtError;
	} catch {
		throw nuxtError;
	}
	return nuxtError;
};
/**
* Show the error page unless the current client is a crawler, in which case the
* bot receives the already server-rendered HTML instead (#32137, #35338).
*
* @internal
*/
var _showErrorUnlessCrawler = async (nuxtApp, error) => {
	await nuxtApp.runWithContext(() => showError(error));
};
/** @since 3.0.0 */
var isNuxtError = (error) => !!error && typeof error === "object" && "__nuxt_error" in error;
/** @since 3.0.0 */
var createError$1 = (error) => {
	if (typeof error !== "string" && error.statusText) error.message ??= error.statusText;
	const nuxtError = createError(error);
	Object.defineProperty(nuxtError, NUXT_ERROR_SIGNATURE, {
		value: true,
		configurable: false,
		writable: false
	});
	Object.defineProperty(nuxtError, "status", {
		get: () => nuxtError.statusCode,
		configurable: true
	});
	Object.defineProperty(nuxtError, "statusText", {
		get: () => nuxtError.statusMessage,
		configurable: true
	});
	return nuxtError;
};
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Ffetch.mjs
if (!globalThis.$fetch) globalThis.$fetch = $fetch.create({ baseURL: baseURL() });
var $fetch$2 = globalThis.$fetch;
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fglobal-polyfills.mjs
if (!("global" in globalThis)) globalThis.global = globalThis;
//#endregion
//#region node_modules/.pnpm/nuxt@4.5.2_@babel+plugin-syntax-jsx@7.29.7_@babel+core@7.29.7__@babel+plugin-syntax-typ_7b5abac9ad6b4131f0af60bfddb7caf2/node_modules/nuxt/dist/head/runtime/island-head.js
/**
* No-op `head.push` until the returned `unfreeze` runs. Plugin/transformer
* augmentations on the same head are unaffected.
*/
function freezeHead(head) {
	const realPush = head.push;
	head.push = () => ({
		dispose: () => {},
		patch: () => {},
		_i: 0
	});
	return () => {
		head.push = realPush;
	};
}
//#endregion
//#region node_modules/.pnpm/nuxt@4.5.2_@babel+plugin-syntax-jsx@7.29.7_@babel+core@7.29.7__@babel+plugin-syntax-typ_7b5abac9ad6b4131f0af60bfddb7caf2/node_modules/nuxt/dist/head/runtime/plugins/unhead.server.js
var plugin$2 = defineNuxtPlugin({
	name: "nuxt:head",
	enforce: "pre",
	setup(nuxtApp) {
		const head = nuxtApp.ssrContext.head;
		if (nuxtApp.ssrContext.islandContext) {
			const unfreeze = freezeHead(head);
			nuxtApp.hooks.hookOnce("app:created", unfreeze);
		}
		nuxtApp.vueApp.use(head);
	}
});
//#endregion
//#region node_modules/.pnpm/nuxt@4.5.2_@babel+plugin-syntax-jsx@7.29.7_@babel+core@7.29.7__@babel+plugin-syntax-typ_7b5abac9ad6b4131f0af60bfddb7caf2/node_modules/nuxt/dist/pages/runtime/utils.js
var ROUTE_KEY_PARENTHESES_RE$1 = /(:\w+)\([^)]+\)/g;
var ROUTE_KEY_SYMBOLS_RE$1 = /(:\w+)[?+*]/g;
var ROUTE_KEY_NORMAL_RE$1 = /:\w+/g;
var interpolatePath = (route, match) => {
	return match.path.replace(ROUTE_KEY_PARENTHESES_RE$1, "$1").replace(ROUTE_KEY_SYMBOLS_RE$1, "$1").replace(ROUTE_KEY_NORMAL_RE$1, (r) => route.params[r.slice(1)]?.toString() || "");
};
var generateRouteKey$1 = (routeProps, override) => {
	const matchedRoute = routeProps.route.matched.find((m) => m.components?.default === routeProps.Component.type);
	const source = matchedRoute?.meta.key ?? (matchedRoute && interpolatePath(routeProps.route, matchedRoute));
	return typeof source === "function" ? source(routeProps.route) : source;
};
/** @since 3.9.0 */
function toArray(value) {
	return Array.isArray(value) ? value : [value];
}
//#endregion
//#region node_modules/.pnpm/nuxt@4.5.2_@babel+plugin-syntax-jsx@7.29.7_@babel+core@7.29.7__@babel+plugin-syntax-typ_7b5abac9ad6b4131f0af60bfddb7caf2/node_modules/nuxt/dist/app/components/utils.js
var ROUTE_KEY_PARENTHESES_RE = /(:\w+)\([^)]+\)/g;
var ROUTE_KEY_SYMBOLS_RE = /(:\w+)[?+*]/g;
var ROUTE_KEY_NORMAL_RE = /:\w+/g;
function generateRouteKey(route) {
	const source = route?.meta.key ?? route.path.replace(ROUTE_KEY_PARENTHESES_RE, "$1").replace(ROUTE_KEY_SYMBOLS_RE, "$1").replace(ROUTE_KEY_NORMAL_RE, (r) => route.params[r.slice(1)]?.toString() || "");
	return typeof source === "function" ? source(route) : source;
}
/**
* Utility used within router guards
* return true if the route has been changed with a page change during navigation
*/
function isChangingPage(to, from) {
	if (to === from || from === START_LOCATION) return false;
	if (generateRouteKey(to) !== generateRouteKey(from)) return true;
	if (to.matched.every((comp, index) => comp.components && comp.components.default === from.matched[index]?.components?.default)) return false;
	return true;
}
var VALID_TAG_RE = /^[a-z][a-z0-9-]*$/i;
/** Return `tag` if it is a safe HTML tag name, otherwise `fallback`. */
function sanitizeTag(tag, fallback) {
	return tag && VALID_TAG_RE.test(tag) ? tag : fallback;
}
//#endregion
//#region node_modules/.pnpm/nuxt@4.5.2_@babel+plugin-syntax-jsx@7.29.7_@babel+core@7.29.7__@babel+plugin-syntax-typ_7b5abac9ad6b4131f0af60bfddb7caf2/node_modules/nuxt/dist/pages/runtime/router.options.js
var router_options_default = { scrollBehavior(to, from, savedPosition) {
	const nuxtApp = useNuxtApp();
	const router = useRouter();
	const hashScrollBehaviour = router.options?.scrollBehaviorType ?? "auto";
	if (to.path.replace(/\/$/, "") === from.path.replace(/\/$/, "")) {
		if (from.hash && !to.hash) return savedPosition ?? {
			left: 0,
			top: 0
		};
		if (to.hash) return {
			el: to.hash,
			top: _getHashElementScrollMarginTop(to.hash),
			behavior: hashScrollBehaviour
		};
		return false;
	}
	if ((typeof to.meta.scrollToTop === "function" ? to.meta.scrollToTop(to, from) : to.meta.scrollToTop) === false) return false;
	if (from === START_LOCATION) return _calculatePosition(to, from, savedPosition, hashScrollBehaviour);
	return new Promise((resolve) => {
		const doScroll = () => {
			requestAnimationFrame(() => {
				if (router.currentRoute.value.fullPath !== to.fullPath) {
					resolve(false);
					return;
				}
				resolve(_calculatePosition(to, from, savedPosition, hashScrollBehaviour));
			});
		};
		nuxtApp.hooks.hookOnce("page:loading:end", () => {
			const transitionPromise = nuxtApp["~transitionPromise"];
			if (transitionPromise) transitionPromise.then(doScroll);
			else doScroll();
		});
	});
} };
function _getHashElementScrollMarginTop(selector) {
	try {
		const elem = (void 0).querySelector(selector);
		if (elem) return (Number.parseFloat(getComputedStyle(elem).scrollMarginTop) || 0) + (Number.parseFloat(getComputedStyle((void 0).documentElement).scrollPaddingTop) || 0);
	} catch {}
	return 0;
}
function _calculatePosition(to, from, savedPosition, defaultHashScrollBehaviour) {
	if (savedPosition) return savedPosition;
	if (to.hash) return {
		el: to.hash,
		top: _getHashElementScrollMarginTop(to.hash),
		behavior: isChangingPage(to, from) ? defaultHashScrollBehaviour : "instant"
	};
	return {
		left: 0,
		top: 0
	};
}
var virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Frouter_options_default = {
	hashMode: false,
	scrollBehaviorType: "auto",
	...router_options_default
};
Object.assign(Object.create(null), {});
var pageIslandRoutes = Object.assign(Object.create(null), {});
//#endregion
//#region node_modules/.pnpm/nuxt@4.5.2_@babel+plugin-syntax-jsx@7.29.7_@babel+core@7.29.7__@babel+plugin-syntax-typ_7b5abac9ad6b4131f0af60bfddb7caf2/node_modules/nuxt/dist/pages/runtime/validate.js
var middleware$1 = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to) => {
	let __temp, __restore;
	if (!to.meta?.validate) return;
	const result = ([__temp, __restore] = executeAsync(() => Promise.resolve(to.meta.validate(to))), __temp = await __temp, __restore(), __temp);
	if (result === true) return;
	return createError$1({
		fatal: false,
		status: result && (result.status || result.statusCode) || 404,
		statusText: result && (result.statusText || result.statusMessage) || `Page Not Found: ${to.fullPath}`,
		data: { path: to.fullPath }
	});
});
//#endregion
//#region node_modules/.pnpm/nuxt@4.5.2_@babel+plugin-syntax-jsx@7.29.7_@babel+core@7.29.7__@babel+plugin-syntax-typ_7b5abac9ad6b4131f0af60bfddb7caf2/node_modules/nuxt/dist/app/diagnostics/manifest.js
/**
* E5xxx
* App manifest / route-rules runtime diagnostics.
*/
var manifestDiagnostics = /* #__PURE__ */ defineProdDiagnostics({
	docsBase,
	reporters: prodReporters
});
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Froute-rules.mjs
var sensitiveMatcher = (m, p) => {
	return [];
};
var foldedMatcher = sensitiveMatcher;
var decodeRoutePath = function decodeRoutePath(path) {
	if (!path.includes("%")) return path;
	const queryIndex = path.indexOf("?");
	const pathname = queryIndex === -1 ? path : path.slice(0, queryIndex);
	try {
		return queryIndex === -1 ? decodeURI(pathname) : decodeURI(pathname) + path.slice(queryIndex);
	} catch {
		return path;
	}
};
var normalizePath = (path, fold) => {
	if (typeof path !== "string") return path;
	const decoded = decodeRoutePath(path);
	return fold ? decoded.toLowerCase() : decoded;
};
var virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Froute_rules_default = (path) => virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Frouter_options_default.sensitive ? defu({}, ...sensitiveMatcher("", normalizePath(path, false)).map((r) => r.data).reverse()) : defu({}, ...foldedMatcher("", normalizePath(path, true)).map((r) => r.data).reverse());
//#endregion
//#region node_modules/.pnpm/nuxt@4.5.2_@babel+plugin-syntax-jsx@7.29.7_@babel+core@7.29.7__@babel+plugin-syntax-typ_7b5abac9ad6b4131f0af60bfddb7caf2/node_modules/nuxt/dist/app/composables/manifest.js
var routeRulesMatcher = virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Froute_rules_default;
function getRouteRules(arg) {
	const path = typeof arg === "string" ? arg : arg.path;
	try {
		return routeRulesMatcher(path);
	} catch (e) {
		manifestDiagnostics.NUXT_E5003({
			path,
			cause: e
		});
		return {};
	}
}
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fmiddleware.mjs
var globalMiddleware = [middleware$1, /* @__PURE__ */ defineNuxtRouteMiddleware((to) => {})];
var namedMiddleware = {};
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Froutes.mjs
var virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Froutes_default = [
	{
		name: "admin-posts-new",
		path: "/admin/posts/new",
		component: () => import('../build/new-BBwWnQXI.mjs')
	},
	{
		name: "admin-posts-slug",
		path: "/admin/posts/:slug()",
		component: () => import('../build/_slug_-DSd1Rt18.mjs')
	},
	{
		name: "blog-slug",
		path: "/blog/:slug()",
		component: () => import('../build/_slug_-DcBDuRpJ.mjs')
	},
	{
		name: "admin",
		path: "/admin",
		component: () => import('../build/admin-BzuN5PkU.mjs')
	},
	{
		name: "amazon-ip-check",
		path: "/amazon-ip-check",
		component: () => import('../build/amazon-ip-check-C1XLnmJz.mjs')
	},
	{
		name: "batch-check",
		path: "/batch-check",
		component: () => import('../build/batch-check-D1VnV_s1.mjs')
	},
	{
		name: "binance-ip-check",
		path: "/binance-ip-check",
		component: () => import('../build/binance-ip-check-CYbCnY53.mjs')
	},
	{
		name: "blog",
		path: "/blog",
		component: () => import('../build/blog-D2gIckYV.mjs')
	},
	{
		name: "chatgpt-ip-check",
		path: "/chatgpt-ip-check",
		component: () => import('../build/chatgpt-ip-check-MujBAqSC.mjs')
	},
	{
		name: "check",
		path: "/check",
		component: () => import('../build/check-CCkgP7so.mjs')
	},
	{
		name: "claude-ip-check",
		path: "/claude-ip-check",
		component: () => import('../build/claude-ip-check-iQveyk-q.mjs')
	},
	{
		name: "ebay-ip-check",
		path: "/ebay-ip-check",
		component: () => import('../build/ebay-ip-check-DbmbFsuI.mjs')
	},
	{
		name: "resources",
		path: "/resources",
		component: () => import('../build/resources-CkDo594k.mjs')
	},
	{
		name: "index",
		path: "/",
		component: () => import('../build/pages-BuNf1zPR.mjs')
	}
];
//#endregion
//#region node_modules/.pnpm/nuxt@4.5.2_@babel+plugin-syntax-jsx@7.29.7_@babel+core@7.29.7__@babel+plugin-syntax-typ_7b5abac9ad6b4131f0af60bfddb7caf2/node_modules/nuxt/dist/pages/runtime/plugins/router.js
var plugin$1 = defineNuxtPlugin({
	name: "nuxt:router",
	enforce: "pre",
	async setup(nuxtApp) {
		let __temp, __restore;
		let routerBase = useRuntimeConfig().app.baseURL;
		const history = virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Frouter_options_default.history?.(routerBase) ?? createMemoryHistory(routerBase);
		const routes = virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Frouter_options_default.routes ? ([__temp, __restore] = executeAsync(() => virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Frouter_options_default.routes(virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Froutes_default)), __temp = await __temp, __restore(), __temp) ?? virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Froutes_default : virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Froutes_default;
		let startPosition;
		const router = createRouter({
			...virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Frouter_options_default,
			scrollBehavior: (to, from, savedPosition) => {
				if (from === START_LOCATION) {
					startPosition = savedPosition;
					return;
				}
				if (virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Frouter_options_default.scrollBehavior) {
					router.options.scrollBehavior = virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Frouter_options_default.scrollBehavior;
					if ("scrollRestoration" in (void 0).history) {
						const unsub = router.beforeEach(() => {
							unsub();
							(void 0).history.scrollRestoration = "manual";
						});
					}
					return virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Frouter_options_default.scrollBehavior(to, START_LOCATION, startPosition || savedPosition);
				}
			},
			history,
			routes
		});
		nuxtApp.vueApp.use(router);
		const previousRoute = shallowRef(router.currentRoute.value);
		router.afterEach((_to, from) => {
			previousRoute.value = from;
		});
		Object.defineProperty(nuxtApp.vueApp.config.globalProperties, "previousRoute", { get: () => previousRoute.value });
		const initialURL = nuxtApp.ssrContext.url;
		const _route = shallowRef(router.currentRoute.value);
		const syncCurrentRoute = () => {
			_route.value = router.currentRoute.value;
		};
		router.afterEach((to, from) => {
			const lastTo = to.matched.at(-1)?.components?.default;
			const lastFrom = from.matched.at(-1)?.components?.default;
			if (lastTo === lastFrom) {
				if (generateRouteKey$1({
					route: to,
					Component: { type: lastTo }
				}) === generateRouteKey$1({
					route: from,
					Component: { type: lastFrom }
				})) syncCurrentRoute();
				return;
			}
			if (to.matched.length < from.matched.length && to.matched.every((m, i) => m.components?.default === from.matched[i]?.components?.default)) syncCurrentRoute();
		});
		const route = { sync: syncCurrentRoute };
		for (const key in _route.value) Object.defineProperty(route, key, {
			get: () => _route.value[key],
			enumerable: true
		});
		nuxtApp._route = shallowReactive(route);
		nuxtApp._middleware ||= {
			global: [],
			named: {}
		};
		const error = /* @__PURE__ */ useError();
		const isServerPage = nuxtApp.ssrContext?.islandContext?.name?.startsWith("page_");
		if (!nuxtApp.ssrContext?.islandContext || isServerPage) router.afterEach(async (to, _from, failure) => {
			delete nuxtApp._processingMiddleware;
			delete nuxtApp._middlewareTo;
			if (failure) await nuxtApp.callHook("page:loading:end");
			if (failure?.type === 4) return;
			if (to.redirectedFrom && to.fullPath !== initialURL) await nuxtApp.runWithContext(() => navigateTo(to.fullPath || "/"));
		});
		try {
			[__temp, __restore] = executeAsync(() => router.push(initialURL)), __temp = await __temp, __restore();
			[__temp, __restore] = executeAsync(() => router.isReady()), await __temp, __restore();
		} catch (error) {
			[__temp, __restore] = executeAsync(() => _showErrorUnlessCrawler(nuxtApp, error)), await __temp, __restore();
		}
		const resolvedInitialRoute = router.currentRoute.value;
		syncCurrentRoute();
		if (nuxtApp.ssrContext?.islandContext && !isServerPage) return { provide: { router } };
		const initialLayout = nuxtApp.payload.state._layout;
		router.beforeEach(async (to, from) => {
			await nuxtApp.callHook("page:loading:start");
			to.meta = reactive(to.meta);
			if (nuxtApp.isHydrating && initialLayout && !isReadonly(to.meta.layout)) to.meta.layout = initialLayout;
			nuxtApp._processingMiddleware = true;
			nuxtApp._middlewareTo = to;
			if (!nuxtApp.ssrContext?.islandContext || isServerPage) {
				const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
				for (const component of to.matched) {
					const componentMiddleware = component.meta.middleware;
					if (!componentMiddleware) continue;
					for (const entry of toArray(componentMiddleware)) middlewareEntries.add(entry);
				}
				const routeRules = getRouteRules({ path: to.path });
				if (routeRules.appMiddleware) for (const key in routeRules.appMiddleware) if (routeRules.appMiddleware[key]) middlewareEntries.add(key);
				else middlewareEntries.delete(key);
				for (const entry of middlewareEntries) {
					const middleware = typeof entry === "string" ? nuxtApp._middleware.named[entry] || await namedMiddleware[entry]?.().then((r) => r.default || r) : entry;
					if (!middleware) throw navigationDiagnostics.NUXT_E2004({
						entry: String(entry),
						validMiddleware: void 0
					});
					try {
						const result = await nuxtApp.runWithContext(() => middleware(to, from));
						if (result === false || result instanceof Error) {
							const error = result || createError$1({
								status: 404,
								statusText: `Page Not Found: ${initialURL}`
							});
							await nuxtApp.runWithContext(() => showError(error));
							return false;
						}
						if (result === true) continue;
						if (result === false) return result;
						if (result) {
							if (isNuxtError(result) && result.fatal) await nuxtApp.runWithContext(() => showError(result));
							return result;
						}
					} catch (err) {
						const error = createError$1(err);
						if (error.fatal) await nuxtApp.runWithContext(() => showError(error));
						return error;
					}
				}
			}
		});
		if (isServerPage) router.beforeResolve((to) => {
			const expected = pageIslandRoutes[nuxtApp.ssrContext.islandContext.name];
			const actual = to.matched.find((m) => (m.components?.default)?.__nuxt_island)?.components?.default;
			if (!expected || expected !== actual?.__nuxt_island) {
				nuxtApp.ssrContext["~renderResponse"] = {
					statusCode: 400,
					statusMessage: "Invalid island request path"
				};
				return false;
			}
		});
		router.onError(async () => {
			delete nuxtApp._processingMiddleware;
			delete nuxtApp._middlewareTo;
			await nuxtApp.callHook("page:loading:end");
		});
		router.afterEach((to) => {
			if (to.matched.length === 0 && !error.value) return nuxtApp.runWithContext(() => showError(createError$1({
				status: 404,
				fatal: false,
				statusText: `Page not found: ${to.fullPath}`,
				data: { path: to.fullPath }
			})));
		});
		nuxtApp.hooks.hookOnce("app:created", async () => {
			try {
				if ("name" in resolvedInitialRoute) resolvedInitialRoute.name = void 0;
				await router.replace({
					...resolvedInitialRoute,
					force: true
				});
				router.options.scrollBehavior = virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Frouter_options_default.scrollBehavior;
			} catch (error) {
				await _showErrorUnlessCrawler(nuxtApp, error);
			}
		});
		return { provide: { router } };
	}
});
//#endregion
//#region node_modules/.pnpm/nuxt@4.5.2_@babel+plugin-syntax-jsx@7.29.7_@babel+core@7.29.7__@babel+plugin-syntax-typ_7b5abac9ad6b4131f0af60bfddb7caf2/node_modules/nuxt/dist/app/diagnostics/state.js
/**
* E7xxx
* Payload / state / cookie runtime diagnostics.
*/
var stateDiagnostics = /* #__PURE__ */ defineProdDiagnostics({
	docsBase,
	reporters: prodReporters
});
//#endregion
//#region node_modules/.pnpm/nuxt@4.5.2_@babel+plugin-syntax-jsx@7.29.7_@babel+core@7.29.7__@babel+plugin-syntax-typ_7b5abac9ad6b4131f0af60bfddb7caf2/node_modules/nuxt/dist/app/composables/payload.js
/**
* This is an experimental function for configuring passing rich data from server -> client.
* @since 3.4.0
*/
function definePayloadReducer(name, reduce) {
	useNuxtApp().ssrContext["~payloadReducers"][name] = reduce;
}
//#endregion
//#region node_modules/.pnpm/nuxt@4.5.2_@babel+plugin-syntax-jsx@7.29.7_@babel+core@7.29.7__@babel+plugin-syntax-typ_7b5abac9ad6b4131f0af60bfddb7caf2/node_modules/nuxt/dist/app/plugins/revive-payload.server.js
var reducers = [
	["NuxtError", (data) => isNuxtError(data) && data.toJSON()],
	["EmptyShallowRef", (data) => isRef(data) && isShallow(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
	["EmptyRef", (data) => isRef(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
	["ShallowRef", (data) => isRef(data) && isShallow(data) && data.value],
	["ShallowReactive", (data) => isReactive(data) && isShallow(data) && toRaw(data)],
	["Ref", (data) => isRef(data) && data.value],
	["Reactive", (data) => isReactive(data) && toRaw(data)]
];
var plugin = /* @__PURE__ */ defineNuxtPlugin({
	name: "nuxt:revive-payload:server",
	setup() {
		for (const [reducer, fn] of reducers) definePayloadReducer(reducer, fn);
	}
});
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fcomponents.plugin.mjs
var virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fcomponents_plugin_default = defineNuxtPlugin({ name: "nuxt:global-components" });
//#endregion
//#region node_modules/.pnpm/nuxt@4.5.2_@babel+plugin-syntax-jsx@7.29.7_@babel+core@7.29.7__@babel+plugin-syntax-typ_7b5abac9ad6b4131f0af60bfddb7caf2/node_modules/nuxt/dist/app/composables/ssr.js
var $fetch$1 = $fetch$2;
/** @since 3.0.0 */
function useRequestEvent(nuxtApp) {
	nuxtApp ||= useNuxtApp();
	return nuxtApp.ssrContext?.event;
}
/** @since 3.2.0 */
function useRequestFetch() {
	return useRequestEvent()?.$fetch || $fetch$1;
}
//#endregion
//#region node_modules/.pnpm/nuxt@4.5.2_@babel+plugin-syntax-jsx@7.29.7_@babel+core@7.29.7__@babel+plugin-syntax-typ_7b5abac9ad6b4131f0af60bfddb7caf2/node_modules/nuxt/dist/app/composables/cookie.js
function parseCookieValue(value) {
	if (value === "undefined") return;
	try {
		const parsed = JSON.parse(value);
		if (typeof parsed === "number" && String(parsed) !== value) return value;
		return parsed;
	} catch {
		return value;
	}
}
var CookieDefaults = {
	path: "/",
	watch: true,
	decode: (val) => val ? parseCookieValue(decodeURIComponent(val)) : val,
	encode: (val) => {
		if (typeof val !== "string" || val === "undefined") return encodeURIComponent(JSON.stringify(val));
		try {
			if (typeof JSON.parse(val) !== "string") return encodeURIComponent(JSON.stringify(val));
		} catch {}
		return encodeURIComponent(val);
	},
	refresh: false
};
function useCookie(name, _opts) {
	const opts = {
		...CookieDefaults,
		..._opts
	};
	opts.filter ??= (key) => key === name;
	const cookies = readRawCookies(opts) || {};
	let delay;
	if (opts.maxAge !== void 0) delay = opts.maxAge * 1e3;
	else if (opts.expires) delay = opts.expires.getTime() - Date.now();
	const cookie = cookieServerRef(name, klona(delay !== void 0 && delay <= 0 ? void 0 : cookies[name] ?? opts.default?.()));
	{
		const nuxtApp = useNuxtApp();
		const writeFinalCookieValue = () => {
			const valueIsSame = isEqual(cookie.value, cookies[name]);
			if (opts.readonly || valueIsSame && !opts.refresh) return;
			nuxtApp._cookiesChanged ||= {};
			if (valueIsSame && opts.refresh && !nuxtApp._cookiesChanged[name]) return;
			nuxtApp._cookies ||= {};
			if (name in nuxtApp._cookies) {
				if (isEqual(cookie.value, nuxtApp._cookies[name])) return;
			}
			nuxtApp._cookies[name] = cookie.value;
			const encoded = cookie.value === null || cookie.value === void 0 ? void 0 : opts.encode(cookie.value);
			writeServerCookie(useRequestEvent(nuxtApp), name, encoded, opts);
		};
		const unhook = nuxtApp.hooks.hookOnce("app:rendered", writeFinalCookieValue);
		nuxtApp.hooks.hookOnce("app:error", () => {
			unhook();
			return writeFinalCookieValue();
		});
	}
	return cookie;
}
function readRawCookies(opts = {}) {
	return parse(getRequestHeader(useRequestEvent(), "cookie") || "", opts);
}
var identityEncode = (val) => val;
function toSerializeOptions(opts) {
	const { encode: _encode, decode: _decode, ...rest } = opts;
	return {
		...rest,
		encode: identityEncode
	};
}
function writeServerCookie(event, name, value, opts = {}) {
	if (event) {
		const serializeOpts = toSerializeOptions(opts);
		if (value !== void 0) return setCookie(event, name, value, serializeOpts);
		if (getCookie(event, name) !== void 0) return deleteCookie(event, name, serializeOpts);
	}
}
/**
* Custom ref that tracks explicit cookie writes on the server.
*
* This is required for the `refresh` option to ensure the cookie is
* re-written on SSR even when the value remains unchanged.
*/
function cookieServerRef(name, value) {
	const internalRef = ref(value);
	const nuxtApp = useNuxtApp();
	return customRef((track, trigger) => {
		return {
			get() {
				track();
				return internalRef.value;
			},
			set(newValue) {
				nuxtApp._cookiesChanged ||= {};
				nuxtApp._cookiesChanged[name] = true;
				internalRef.value = newValue;
				trigger();
			}
		};
	});
}
//#endregion
//#region node_modules/.pnpm/nuxt@4.5.2_@babel+plugin-syntax-jsx@7.29.7_@babel+core@7.29.7__@babel+plugin-syntax-typ_7b5abac9ad6b4131f0af60bfddb7caf2/node_modules/nuxt/dist/app/composables/state.js
var useStateKeyPrefix = "$s";
function useState(...args) {
	const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
	if (typeof args[0] !== "string") args.unshift(autoKey);
	const [_key, init] = args;
	if (!_key || typeof _key !== "string") throw stateDiagnostics.NUXT_E7009({ key: _key });
	if (init !== void 0 && typeof init !== "function") throw stateDiagnostics.NUXT_E7007({ type: typeof init });
	const key = useStateKeyPrefix + _key;
	const nuxtApp = useNuxtApp();
	const state = toRef(nuxtApp.payload.state, key);
	if (init) nuxtApp._state[key] ??= { _default: init };
	if (state.value === void 0 && init) {
		const initialValue = init();
		if (isRef(initialValue)) {
			nuxtApp.payload.state[key] = initialValue;
			return initialValue;
		}
		state.value = initialValue;
	}
	return state;
}
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fplugins.server.mjs
var virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fplugins_server_default = [
	plugin$2,
	plugin$1,
	plugin,
	virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fcomponents_plugin_default,
	defineNuxtPlugin(() => {
		const cookie = useCookie("ip-ready-locale", {
			maxAge: 31536e3,
			sameSite: "lax",
			default: () => null
		});
		const locale = useState("locale", () => cookie.value === "zh" ? "zh" : "en");
		watch(locale, (value) => {
			cookie.value = value;
		});
	})
];
//#endregion
//#region node_modules/.pnpm/nuxt@4.5.2_@babel+plugin-syntax-jsx@7.29.7_@babel+core@7.29.7__@babel+plugin-syntax-typ_7b5abac9ad6b4131f0af60bfddb7caf2/node_modules/nuxt/dist/app/components/route-provider.js
var defineRouteProvider = (name = "RouteProvider") => defineComponent({
	name,
	props: {
		route: {
			type: Object,
			required: true
		},
		vnode: Object,
		vnodeRef: Object,
		renderKey: String,
		trackRootNodes: Boolean,
		routeRecord: Object
	},
	setup(props) {
		const previousKey = props.renderKey;
		const previousRoute = props.route;
		const route = {};
		for (const key in props.route) Object.defineProperty(route, key, {
			get: () => previousKey === props.renderKey ? props.route[key] : previousRoute[key],
			enumerable: true
		});
		provide(PageRouteSymbol, shallowReactive(route));
		return () => {
			if (!props.vnode) return props.vnode;
			return h(props.vnode, { ref: props.vnodeRef });
		};
	}
});
var RouteProvider = defineRouteProvider();
//#endregion
//#region node_modules/.pnpm/nuxt@4.5.2_@babel+plugin-syntax-jsx@7.29.7_@babel+core@7.29.7__@babel+plugin-syntax-typ_7b5abac9ad6b4131f0af60bfddb7caf2/node_modules/nuxt/dist/pages/runtime/page.js
var page_default = defineComponent({
	name: "NuxtPage",
	inheritAttrs: false,
	props: {
		name: { type: String },
		transition: {
			type: [Boolean, Object],
			default: void 0
		},
		keepalive: {
			type: [Boolean, Object],
			default: void 0
		},
		route: { type: Object },
		pageKey: {
			type: [Function, String],
			default: null
		}
	},
	setup(props, { attrs, slots, expose }) {
		const nuxtApp = useNuxtApp();
		const pageRef = ref();
		inject(PageRouteSymbol, null);
		expose({ pageRef });
		inject(LayoutMetaSymbol, null);
		nuxtApp.deferHydration();
		return () => {
			return h(RouterView, {
				name: props.name,
				route: props.route,
				...attrs
			}, { default: markStableSlot((routeProps) => {
				return h(Suspense, { suspensible: true }, { default() {
					return h(RouteProvider, {
						vnode: slots.default ? normalizeSlot(slots.default, routeProps) : routeProps.Component,
						route: routeProps.route,
						vnodeRef: pageRef
					});
				} });
			}) });
		};
	}
});
function markStableSlot(fn) {
	const wrapped = ((routeProps) => {
		const result = fn(routeProps);
		if (Array.isArray(result)) return result;
		if (result == null || !isVNode(result)) return [createCommentVNode()];
		return [result];
	});
	wrapped._n = true;
	return wrapped;
}
function normalizeSlot(slot, data) {
	const slotContent = slot(data);
	return slotContent.length === 1 ? h(slotContent[0]) : h(Fragment, void 0, slotContent);
}
//#endregion
//#region app/composables/useI18n.ts
var messages = {
	en: {
		"report.queriedIp": "IP Address",
		"status.abuseListed": "Listed in an abuse database",
		"report.popularPlatforms": "Popular platforms",
		"misc.clickToCopy": "Click to copy",
		"device.desktop": "Desktop / laptop",
		"device.mobile": "Mobile phone",
		"device.tablet": "Tablet",
		"network.isp": "ISP",
		"network.residential": "Residential",
		"network.hosting": "Datacenter",
		"network.business": "Business",
		"network.mobile": "Mobile",
		"network.education": "Education",
		"network.government": "Government",
		"analysis.low": "Your Network Looks Healthy.",
		"analysis.medium": "Your Network Needs Attention.",
		"analysis.high": "Your Network Shows Elevated Risk.",
		"analysis.suspectedExitTitle": "This Network May Be a Suspected Exit.",
		"analysis.clean": "No active proxy, VPN, or Tor signal was detected in this scan.",
		"analysis.suspectedExit": "No active proxy, VPN, or Tor signal was detected, but this hosting network is a suspected exit signal.",
		"analysis.suspectedExitConcern": "This IP is in a datacenter range and may be a proxy or VPN exit, even though it was not found on known VPN exit lists.",
		"analysis.anonymizer": "An anonymizing network signal was detected, which may trigger additional verification.",
		"analysis.abuse": "This IP address appears in an abuse database.",
		"analysis.hosting": "Hosting or datacenter characteristics may affect verification on some platforms.",
		"analysis.noConcern": "No major network concern was identified from the available signals.",
		"batch.inputHint": "Enter one IP address per line.",
		"batch.ignoredN": "{n} invalid lines ignored",
		"batch.limitHint": "More than 20 valid addresses: only the first 20 will be checked.",
		"platform.emptyCategory": "No platforms in this category are currently evaluated.",
		"meta.title": "IP Risk Score Check & AI IP Checker — IP Ready",
		"meta.description": "Check your IP risk score free. Our AI IP checker explains the proxy, VPN, blacklist, and datacenter signals behind your fraud score — and what to fix.",
		"lang.switch": "Switch language",
		"nav.checkAnother": "Check Another IP",
		"nav.batchCheck": "Batch Check",
		"nav.resources": "Resources",
		"nav.blog": "Blog",
		"nav.partners": "Partners",
		"nav.contact": "Contact us",
		"hero.label": "AI-Powered IP Intelligence",
		"hero.titleLead": "Know Your IP.",
		"hero.titleRest": "Understand its Risk and Platform Readiness.",
		"hero.subtitle": "AI IP Checker turns public network data into a clear score, an explainable verdict, and practical platform-readiness signals.",
		"hero.pointScore": "Free · No sign-up required",
		"hero.pointData": "12 risk signals checked",
		"hero.pointAI": "Verdicts for 5 platforms",
		"check.label": "Check Another IP",
		"check.metaTitle": "Free IP Fraud Score & Risk Score Check — IP Ready",
		"check.metaDescription": "Check any IP address free: a 0–100 fraud and risk score with proxy, VPN, blacklist, and datacenter signals explained, plus an AI verdict on what to fix.",
		"check.title": "Check Any IP’s Risk Score.",
		"check.subtitle": "Paste an IPv4 or IPv6 address to get the same report as the homepage scan: risk score, network intelligence, and an AI-assisted verdict.",
		"check.placeholder": "Paste an IP address, e.g. 8.8.8.8",
		"check.phrase2": "IPv6 works too, e.g. 2606:4700::1111",
		"check.phrase3": "One scan, instant risk score and AI verdict",
		"check.submit": "Check IP",
		"check.invalid": "Please enter a valid IPv4 or IPv6 address.",
		"check.try": "Try one of these:",
		"batch.label": "Batch IP Check",
		"batch.metaTitle": "Batch IP Check — Free Bulk IP Risk Score Checker — IP Ready",
		"batch.metaDescription": "Check up to 20 IPs in one batch scan. Every address gets a risk score, proxy and VPN signals, and an AI verdict — a free bulk IP checker.",
		"batch.title": "Paste once. Weed out every risky IP.",
		"batch.subtitle": "Up to 20 IPs, one per line — risk scores, proxy/VPN signals and platform verdicts in one pass.",
		"batch.placeholder": "Paste IP addresses here, one per line…",
		"batch.phrase2": "e.g. 8.8.8.8 or 2606:4700::1111",
		"batch.phrase3": "Up to 20 IPs in one batch scan",
		"batch.phrase4": "Proxy strings like 1.2.3.4:7778:user:pass work too",
		"batch.tabBasic": "Basic Check",
		"batch.tabPlatforms": "Platform Fit",
		"batch.colPlatform": "Platform",
		"batch.noPlatformData": "No successful results to evaluate platforms.",
		"batch.submit": "Check IPs",
		"batch.scanningN": "Scanning {n} IPs…",
		"batch.counter": "{n} / 20 IPs",
		"batch.maxNote": "You can check up to 20 IPs at a time. Extra entries were removed.",
		"batch.skippedN": "{n} invalid entries were skipped.",
		"batch.paste": "Paste from clipboard",
		"batch.clear": "Clear input",
		"batch.addToInput": "Add to input",
		"batch.empty": "Enter at least one IP address.",
		"batch.failed": "Batch scan failed.",
		"batch.resultsTitle": "Batch Check Results.",
		"batch.resultsSubtitle": "Risk scores, network signals, and AI verdicts for every IP in your list.",
		"batch.summaryIps": "IPs checked",
		"batch.summaryLow": "Low risk",
		"batch.summaryFlagged": "Needs attention",
		"batch.summaryFailed": "Failed",
		"batch.colIp": "IP Address",
		"batch.colLocation": "Location",
		"batch.colIsp": "ISP / ASN",
		"batch.colSignals": "Risk Signals",
		"batch.colVerdict": "AI Verdict",
		"batch.clean": "Clean",
		"batch.rowFailed": "Lookup failed",
		"batch.viewReport": "Open full report",
		"batch.rescan": "Scan Again",
		"report.yourIp": "Your Current IP Address",
		"report.detecting": "Detecting…",
		"report.unavailable": "Unavailable",
		"report.copyIp": "Copy IP address",
		"report.isp": "ISP / Organization",
		"report.networkType": "Network type",
		"report.timezone": "Time Zone",
		"report.location": "Location",
		"report.score": "Safety Score",
		"report.aiAnalysis": "AI Analysis",
		"report.analyzing": "Analyzing your network…",
		"report.checkingSignals": "Checking public network intelligence and reputation signals.",
		"report.mainConcern": "Main concern:",
		"report.analysisPending": "Analysis will appear when the scan completes.",
		"report.networkPending": "Network pending",
		"report.locationAvailable": "Location signal available",
		"report.locationLimited": "Limited location signal",
		"report.iplocateChecked": "IPLocate intelligence checked",
		"report.detectingLocation": "Detecting location…",
		"report.scanning": "Scanning",
		"report.quickRead": "Quick Platform Read",
		"report.good": "Good",
		"report.poor": "Risky",
		"report.otherPlatforms": "Check Other Platforms",
		"risk.high": "High Risk",
		"risk.medium": "Medium Risk",
		"risk.low": "Low Risk",
		"readiness.index": "Platform Compatibility",
		"readiness.title": "Readiness Estimates by Use Case.",
		"readiness.subtitle": "Each platform uses its own model for IP region, anonymizer, datacenter and abuse signals. These are diagnostic estimates, not platform guarantees.",
		"tabs.all": "All",
		"tabs.ai": "AI Intelligence",
		"tabs.ecommerce": "Ecommerce",
		"tabs.advertising": "Advertising",
		"tabs.social": "Social",
		"platform.ready": "Ready",
		"platform.applicable": "Current Network is Applicable to This Platform",
		"platform.caution": "This network may trigger risk checks on this platform",
		"platform.notApplicable": "This network is not suitable for this platform",
		"platform.categories": "Platform categories",
		"platform.assessingIp": "Assessment for IP {ip}",
		"platform.showReason": "Show why {platform} may not be suitable",
		"platform.reasonTitle": "Why this conclusion",
		"platform.reason.regionBlocked": "{platform} restricts access from IPs in {country}.",
		"platform.reason.regionUnsupported": "{platform} is not currently available for IPs in {country}.",
		"platform.reason.anonymizer": "This IP has VPN, proxy, Tor, or another anonymizer signal.",
		"platform.reason.datacenter": "This IP is identified as a datacenter or hosting address.",
		"platform.reason.abuse": "Recent abuse activity is associated with this IP.",
		"signal.region": "IP region restricted",
		"signal.anonymizer": "VPN / proxy / Tor signals",
		"signal.datacenter": "Datacenter IP",
		"signal.abuse": "Abuse reports on this IP",
		"metrics.signals": "Signals analyzed",
		"metrics.live": "Live",
		"metrics.iplocate": "IPLocate intelligence",
		"metrics.platforms": "Platforms evaluated",
		"metrics.aiPass": "AI analysis pass",
		"info.index": "Basic Information",
		"info.title": "Device Fingerprint Information",
		"info.subtitle": "Understand your network and device signals for safer browsing.",
		"info.location": "Location",
		"info.country": "Country",
		"info.state": "State",
		"info.city": "City",
		"info.hostname": "Hostname",
		"info.postalCode": "Postal Code",
		"info.coordinates": "Coordinates",
		"info.isp": "ISP",
		"info.organization": "Organization",
		"info.connection": "Connection",
		"info.asn": "ASN",
		"info.time": "Time",
		"info.timezone": "Time Zone",
		"info.ipLocalTime": "IP Local Time",
		"info.systemTime": "System Time",
		"info.browser": "Browser",
		"info.userAgent": "User Agent",
		"info.detectedBrowser": "Detected Browser",
		"info.os": "Operating System",
		"info.device": "Device",
		"status.detected": "Detected",
		"status.notDetected": "Not Detected",
		"status.suspectedExit": "Suspected exit",
		"status.suspectedExitHelp": "Datacenter IP · not on known VPN lists",
		"status.proxy": "Proxy",
		"status.vpnTor": "VPN / Tor",
		"status.recentAbuse": "Recent Abuse",
		"status.riskScore": "Risk Score",
		"status.safetyScore": "Safety Score",
		"status.detecting": "Detecting",
		"faq.title": "Frequently Asked Questions",
		"faq.q1": "What does IP Ready check?",
		"faq.a1": "IP Ready analyzes your public IP, location, ISP, ASN, DNS, network type, proxy and blacklist signals, browser, and device details. It combines these signals into a Risk Score and a practical platform-readiness report.",
		"faq.q2": "How is the platform readiness score calculated?",
		"faq.a2": "Each platform has its own model: region availability, anonymizer signals (VPN/proxy/Tor), datacenter hosting, and abuse reports are weighted per platform based on its known risk-control behavior. It is a diagnostic estimate, not a guarantee that a third-party platform will approve an account or session.",
		"faq.q3": "Is my IP address and browsing data private?",
		"faq.a3": "IP Ready only uses the technical network and device signals needed to generate your report. It never asks for account passwords, private messages, or browsing history, and scan results are not designed to identify you personally.",
		"faq.q4": "Which platforms can I check?",
		"faq.a4": "You can check Claude, ChatGPT, Amazon, eBay, and Binance using diagnostic network signals.",
		"faq.q5": "Why can my scan results change?",
		"faq.a5": "IP reputation databases, routing, DNS, VPN endpoints, and blacklist records change over time. Run a new scan whenever you switch networks, proxies, VPN locations, or devices to see the most relevant result.",
		"feature.reliable": "Professional and Reliable",
		"feature.efficient": "Efficient and Convenient",
		"feature.accurate": "Accurate Data",
		"feature.stable": "Safe and Stable",
		"footer.platform": "Platform",
		"footer.useCases": "Use Cases",
		"footer.ipIntelligence": "IP Intelligence",
		"footer.resources": "Resources",
		"footer.company": "Company",
		"footer.platformReadiness": "Platform Readiness",
		"footer.riskScore": "Risk Score",
		"footer.ipInformation": "IP Information",
		"footer.fraudSignals": "Fraud Signals",
		"footer.faq": "FAQ",
		"footer.rights": "© 2026 IP Ready. All rights reserved.",
		"footer.systems": "AI-powered IP intelligence",
		"misc.na": "N/A",
		"misc.unknown": "Unknown",
		"misc.copied": "Copied to clipboard",
		"misc.ipCopied": "IP address copied",
		"misc.scanFailed": "IP scan failed.",
		"blog.metaTitle": "IP Blog — Risk Scores, Blacklists & VPN Detection — IP Ready",
		"blog.metaDescription": "Practical guides on IP risk scores, blacklists, platform IP bans, and VPN detection — how platforms judge your IP and how to fix what they see.",
		"blog.kicker": "Field notes on IP health and account trust",
		"blog.heroTitle": "IP Risk, Blacklists,\nBans & Practical Fixes",
		"blog.heroSub": "Guides on risk scores, blacklists, platform bans, and VPN detection — updated weekly.",
		"blog.featuredLabel": "Featured",
		"blog.latest": "The latest",
		"blog.recent": "Recent stories",
		"blog.by": "By:",
		"blog.back": "Back to Blog",
		"blog.loading": "Loading posts…",
		"blog.filter.label": "Filter stories",
		"blog.filter.allPosts": "All Posts",
		"blog.filter.changelog": "Changelog",
		"blog.filter.resources": "Resources",
		"blog.filter.news": "News",
		"blog.categoryLabel": "",
		"blog.emailLabel": "Email address",
		"blog.emailPlaceholder": "Email address",
		"blog.emailSubmit": "Sign Up",
		"blog.keepReading": "Keep reading",
		"blog.detail.lead": "Finding the right tool is one of the highest-leverage decisions a team can make. The right choice reduces time-to-value, improves readability, and lets people focus on the work that matters. The wrong one creates another siloed system nobody uses. This guide compares the leading options on real features and pricing, and lays out why a clean, focused approach is the strongest fit for most modern teams.",
		"blog.detail.h2a": "What Makes a Good Tool?",
		"blog.detail.pa": "A good tool refers to software that helps teams find, understand, and act on the right signals at scale, without requiring manual effort for every step. This includes:",
		"blog.detail.l1": "Clear, structured reporting",
		"blog.detail.l1b": "generated from trusted data and updated over time",
		"blog.detail.l2": "AI-assisted summaries",
		"blog.detail.l2b": "that turn raw signals into plain-language insight",
		"blog.detail.l3": "Reliable integrations",
		"blog.detail.l3b": "that keep everything in sync with your existing stack.",
		"blog.detail.h2b": "What to Look For",
		"blog.detail.pb": "When you evaluate a tool, focus on the capabilities that actually change an outcome. The table below summarizes what matters most.",
		"blog.detail.col1": "Feature",
		"blog.detail.col2": "Why It Matters",
		"blog.detail.r1": "Transparent pricing",
		"blog.detail.r1b": "You should know what you pay before a call, not after.",
		"blog.detail.r2": "Disclosed accuracy",
		"blog.detail.r2b": "A tool that claims to be smart should show you a real number.",
		"blog.detail.r3": "Human-in-the-loop controls",
		"blog.detail.r3b": "AI drafts and recommends; people approve before anything ships.",
		"blog.filter.all": "All",
		"blog.filter.guides": "Guides",
		"blog.filter.privacy": "Privacy",
		"blog.filter.platforms": "Platforms",
		"blog.readStory": "Read story",
		"blog.featured.title": "What a risk score really means",
		"blog.featured.excerpt": "How fraud teams read an IP report, and why the number is only the first line of the story.",
		"blog.featured.author": "Lin Xu",
		"blog.featured.readTime": "7 min read",
		"blog.p1.title": "Five checks before you list",
		"blog.p1.excerpt": "A short pre-flight ritual for sellers: network, browser, device, score, and the verdict behind them.",
		"blog.p1.author": "Mina Chen",
		"blog.p1.readTime": "5 min read",
		"blog.p2.title": "Residential, mobile, or datacenter",
		"blog.p2.excerpt": "What each network type signals to a platform, and when the honest answer is none of them.",
		"blog.p2.author": "Leah Soto",
		"blog.p2.readTime": "6 min read",
		"blog.p3.title": "When a session gets flagged",
		"blog.p3.excerpt": "A teardown of one risky sign-in: which signals fired, in what order, and what would have prevented each.",
		"blog.p3.author": "Jon Bell",
		"blog.p3.readTime": "4 min read",
		"blog.p4.title": "Reading proxy flags without panic",
		"blog.p4.excerpt": "VPN, tor, recent abuse: what each flag means on its own and what it means when they stack.",
		"blog.p4.author": "Lin Xu",
		"blog.p4.readTime": "8 min read",
		"blog.p5.title": "The quiet hour of a VPN log",
		"blog.p5.excerpt": "We followed one connection across three countries and two restarts to see what leaks and what holds.",
		"blog.p5.author": "Leah Soto",
		"blog.p5.readTime": "5 min read",
		"blog.p6.title": "One shop, three accounts",
		"blog.p6.excerpt": "Inside a small store that runs several storefronts safely, and the walls they keep between them.",
		"blog.p6.author": "Mina Chen",
		"blog.p6.readTime": "6 min read",
		"resources.metaTitle": "IP Guides — Blacklist Checks, IP Types & Glossary — IP Ready",
		"resources.metaDescription": "Guides to lower your IP risk score, blacklist check how-tos, residential vs datacenter IP comparisons, lookup tools, and a plain-language glossary.",
		"resources.kicker": "IP knowledge, tools, and references",
		"resources.heroTitle": "Understand Your IP Risk and Choose the Type That Fits.",
		"resources.heroSub": "IP type breakdowns, online checking tools, and plain definitions of the terms used in reports.",
		"resources.tools.check.title": "Check an IP",
		"resources.tools.check.desc": "A full report for any IPv4 or IPv6: risk score, network signals, and an AI verdict.",
		"resources.tools.check.cta": "Open IP check",
		"resources.tools.batch.title": "Check a List",
		"resources.tools.batch.desc": "Up to 20 IPs in one batch scan, with a verdict for each address.",
		"resources.tools.batch.cta": "Open batch check",
		"resources.types.title": "Common IP Types and Their Best-Fit Businesses.",
		"resources.types.sub": "The characteristics of each type, the businesses it fits, and how platforms identify it.",
		"resources.types.bestFor": "Best for",
		"resources.types.datacenter.name": "Datacenter IP",
		"resources.types.datacenter.tag": "Easiest to flag",
		"resources.types.datacenter.trait": "Rented from cloud and hosting providers. Cheap, fast, and available in minutes.",
		"resources.types.datacenter.use1": "Web scraping and data collection",
		"resources.types.datacenter.use2": "SEO and price monitoring",
		"resources.types.datacenter.use3": "Load and availability testing",
		"resources.types.datacenter.use4": "High-volume tasks where account trust is irrelevant",
		"resources.types.datacenter.risk": "Platforms flag datacenter ranges the fastest — expect friction on ecommerce and social.",
		"resources.types.static.name": "Static Residential IP",
		"resources.types.static.tag": "Best long-term reputation",
		"resources.types.static.trait": "A fixed IP registered to a residential ISP. It stays put for months, so reputation compounds.",
		"resources.types.static.use1": "Cross-border ecommerce stores",
		"resources.types.static.use2": "Social accounts nurtured over time",
		"resources.types.static.use3": "Ad accounts that must never shift location",
		"resources.types.static.use4": "Long-running sessions on AI platforms",
		"resources.types.static.risk": "The closest thing to a home connection — the strongest choice when consistency is what you need.",
		"resources.types.rotating.name": "Rotating Residential IP",
		"resources.types.rotating.tag": "Hard to block",
		"resources.types.rotating.trait": "Real home-broadband exits that rotate per request or session, drawn from a large pool.",
		"resources.types.rotating.use1": "Large-scale scraping",
		"resources.types.rotating.use2": "Ad verification",
		"resources.types.rotating.use3": "Competitor and price monitoring",
		"resources.types.rotating.use4": "Tasks that need many distinct exits",
		"resources.types.rotating.risk": "Constant rotation trips location-jump checks — a poor fit for nurturing accounts.",
		"resources.types.mobile.name": "Mobile IP",
		"resources.types.mobile.tag": "Highest trust",
		"resources.types.mobile.trait": "4G/5G carrier exits shared by thousands of real subscribers through CGNAT.",
		"resources.types.mobile.use1": "Social media sign-ups",
		"resources.types.mobile.use2": "Short, high-trust tasks on strict platforms",
		"resources.types.mobile.use3": "Probing how strict a platform really is",
		"resources.types.mobile.use4": "Recovering accounts flagged on other networks",
		"resources.types.mobile.risk": "Banning one mobile exit means banning real customers — the highest trust, at the highest cost.",
		"resources.types.note": "After picking an IP type, run a scan to verify platform readiness.",
		"resources.glossary.title": "Common Terms Explained.",
		"resources.glossary.sub": "Plain definitions for the terms used in IP reports.",
		"resources.glossary.ip.term": "IP Address",
		"resources.glossary.ip.def": "The number every device shows the internet — identity and rough location in one.",
		"resources.glossary.ipv4.term": "IPv4 / IPv6",
		"resources.glossary.ipv4.def": "Two address generations: the 32-bit classic running out of room, and its 128-bit successor.",
		"resources.glossary.isp.term": "ISP",
		"resources.glossary.isp.def": "Internet Service Provider — the company your IP belongs to, visible to every site you visit.",
		"resources.glossary.asn.term": "ASN",
		"resources.glossary.asn.def": "Autonomous System Number — the network an IP range is registered under: carrier, ISP, or cloud.",
		"resources.glossary.datacenter.term": "Datacenter IP",
		"resources.glossary.datacenter.def": "An IP hosted in a commercial datacenter and owned by a cloud or hosting company.",
		"resources.glossary.residential.term": "Residential IP",
		"resources.glossary.residential.def": "An IP assigned by a consumer ISP to a home broadband line.",
		"resources.glossary.mobile.term": "Mobile IP",
		"resources.glossary.mobile.def": "A cellular exit shared by many subscribers at once through carrier-grade NAT.",
		"resources.glossary.cgnat.term": "CGNAT",
		"resources.glossary.cgnat.def": "Carrier-Grade NAT: thousands of subscribers behind one public IP, which is why mobile exits are hard to ban.",
		"resources.glossary.proxy.term": "Proxy",
		"resources.glossary.proxy.def": "Any server that forwards your traffic, so destinations see its IP instead of yours.",
		"resources.glossary.vpn.term": "VPN",
		"resources.glossary.vpn.def": "An encrypted tunnel to a provider server — a proxy with privacy guarantees and a subscription.",
		"resources.glossary.tor.term": "Tor",
		"resources.glossary.tor.def": "A relay network that bounces traffic through three volunteer nodes for anonymity.",
		"resources.glossary.dnsbl.term": "DNSBL",
		"resources.glossary.dnsbl.def": "A DNS-based blocklist: a blacklist of addresses flagged for spam or abuse.",
		"resources.glossary.score.term": "Risk Score",
		"resources.glossary.score.def": "A 0–100 estimate of how risky an IP looks, built from reputation, network type, and behavior signals.",
		"resources.glossary.rotation.term": "IP Rotation",
		"resources.glossary.rotation.def": "Changing exit IPs on a schedule or per request, usually through a proxy pool.",
		"resources.glossary.geo.term": "Geolocation",
		"resources.glossary.geo.def": "Mapping an IP to a country, region, and city — approximate by design.",
		"resources.cta.title": "Now Look at Your Own IP.",
		"resources.cta.sub": "One scan returns a risk score, its signals, and a platform readiness estimate.",
		"resources.cta.button": "Check My IP"
	},
	zh: {
		"report.queriedIp": "查询的 IP 地址",
		"status.abuseListed": "出现在滥用名单中",
		"report.popularPlatforms": "热门平台",
		"misc.clickToCopy": "点击复制",
		"device.desktop": "台式机 / 笔记本电脑",
		"device.mobile": "手机",
		"device.tablet": "平板电脑",
		"network.isp": "互联网服务商",
		"network.residential": "住宅网络",
		"network.hosting": "数据中心 / 机房",
		"network.business": "企业网络",
		"network.mobile": "移动网络",
		"network.education": "教育网络",
		"network.government": "政府网络",
		"analysis.low": "你的网络状况良好。",
		"analysis.medium": "你的网络需要留意。",
		"analysis.high": "你的网络存在较高风险。",
		"analysis.suspectedExitTitle": "该网络疑似为出口。",
		"analysis.clean": "本次检测未发现活动代理、VPN 或 Tor 信号。",
		"analysis.suspectedExit": "未发现活动代理、VPN 或 Tor 信号，但该托管网络疑似是出口。",
		"analysis.suspectedExitConcern": "该 IP 位于机房号段，疑似代理或 VPN 出口，只是未命中已知 VPN 出口名单。",
		"analysis.anonymizer": "检测到匿名网络信号，部分平台可能要求额外验证。",
		"analysis.abuse": "此 IP 地址出现在滥用名单中。",
		"analysis.hosting": "机房或托管网络特征可能影响部分平台的验证。",
		"analysis.noConcern": "根据现有信号，未发现明显的网络风险。",
		"batch.inputHint": "每行输入一个 IP 地址。",
		"batch.ignoredN": "已忽略 {n} 个无效行",
		"batch.limitHint": "有效地址超过 20 个，只会检测前 20 个。",
		"platform.emptyCategory": "此分类目前没有提供评估的平台。",
		"meta.title": "IP 风险评分查询 — AI IP 检测工具 — IP Ready",
		"meta.description": "免费查询 IP 风险评分：AI 检测工具解析代理、VPN、黑名单与数据中心信号背后的欺诈评分，并给出修复建议。",
		"lang.switch": "切换语言",
		"nav.checkAnother": "检测其他 IP",
		"nav.batchCheck": "批量检测",
		"nav.resources": "资源中心",
		"nav.blog": "博客",
		"nav.partners": "合作伙伴",
		"nav.contact": "联系我们",
		"hero.label": "AI 驱动的 IP 情报",
		"hero.titleLead": "了解你的 IP。",
		"hero.titleRest": "洞悉其风险与平台可用性。",
		"hero.subtitle": "AI IP 检测将公开网络数据转化为清晰的评分、可解释的结论，以及实用的平台可用性信号。",
		"hero.pointScore": "完全免费 · 无需注册",
		"hero.pointData": "12 项风险信号检测",
		"hero.pointAI": "五大平台逐项结论",
		"check.label": "检测其他 IP",
		"check.metaTitle": "免费 IP 欺诈评分查询 — IP 风险评分检测 — IP Ready",
		"check.metaDescription": "免费查询任意 IP：0–100 风险评分，解析代理、VPN、黑名单与数据中心信号，并给出 AI 结论与修复建议。",
		"check.title": "查询任意 IP 的风险评分",
		"check.subtitle": "粘贴一个 IPv4 或 IPv6 地址，获得与首页检测一致的报告：风险评分、网络情报与 AI 辅助结论。",
		"check.placeholder": "粘贴 IP 地址，如 8.8.8.8",
		"check.phrase2": "也支持 IPv6，如 2606:4700::1111",
		"check.phrase3": "一键获取风险评分与 AI 结论",
		"check.submit": "开始检测",
		"check.invalid": "请输入有效的 IPv4 或 IPv6 地址。",
		"check.try": "试试这些：",
		"batch.label": "批量 IP 检测",
		"batch.metaTitle": "批量 IP 检测 — 免费批量 IP 风险评分工具 — IP Ready",
		"batch.metaDescription": "一次批量检测最多 20 个 IP：每个地址都有风险评分、代理与 VPN 信号及 AI 结论。免费批量 IP 检测工具。",
		"batch.title": "一次粘贴，筛掉所有危险 IP。",
		"batch.subtitle": "最多 20 个、每行一个，一次出齐风险评分、代理/VPN 信号与平台可用性。",
		"batch.placeholder": "在此粘贴 IP 地址，每行一个…",
		"batch.phrase2": "例如 8.8.8.8 或 2606:4700::1111",
		"batch.phrase3": "单次最多批量检测 20 个 IP",
		"batch.phrase4": "ip:端口:账号:密码 的代理串也可以直接粘贴",
		"batch.tabBasic": "基础检测",
		"batch.tabPlatforms": "适用平台",
		"batch.colPlatform": "平台",
		"batch.noPlatformData": "暂无可用于平台评估的结果。",
		"batch.submit": "开始检测",
		"batch.scanningN": "正在检测 {n} 个 IP…",
		"batch.counter": "{n} / 20 个 IP",
		"batch.maxNote": "单次最多检测 20 个 IP，超出部分已忽略。",
		"batch.skippedN": "已跳过 {n} 个无效 IP。",
		"batch.paste": "从剪贴板粘贴",
		"batch.clear": "清空输入",
		"batch.addToInput": "加入输入框",
		"batch.empty": "请至少输入一个 IP 地址。",
		"batch.failed": "批量检测失败。",
		"batch.resultsTitle": "批量检测结果。",
		"batch.resultsSubtitle": "列表中每个 IP 的风险评分、网络信号与 AI 结论。",
		"batch.summaryIps": "已检测 IP",
		"batch.summaryLow": "低风险",
		"batch.summaryFlagged": "需关注",
		"batch.summaryFailed": "失败",
		"batch.colIp": "IP 地址",
		"batch.colLocation": "位置",
		"batch.colIsp": "ISP / ASN",
		"batch.colSignals": "风险信号",
		"batch.colVerdict": "AI 结论",
		"batch.clean": "无异常",
		"batch.rowFailed": "查询失败",
		"batch.viewReport": "查看完整报告",
		"batch.rescan": "重新扫描",
		"report.yourIp": "你当前的 IP 地址",
		"report.detecting": "检测中…",
		"report.unavailable": "暂不可用",
		"report.copyIp": "复制 IP 地址",
		"report.isp": "ISP / 运营组织",
		"report.networkType": "网络类型",
		"report.timezone": "时区",
		"report.location": "位置",
		"report.score": "安全评分",
		"report.aiAnalysis": "AI 分析",
		"report.analyzing": "正在分析你的网络…",
		"report.checkingSignals": "正在检查公开网络情报与信誉信号。",
		"report.mainConcern": "主要风险点：",
		"report.analysisPending": "扫描完成后将显示分析结果。",
		"report.networkPending": "网络检测中",
		"report.locationAvailable": "已获取位置信号",
		"report.locationLimited": "位置信号有限",
		"report.iplocateChecked": "已检查 IPLocate 情报",
		"report.detectingLocation": "正在检测位置…",
		"report.scanning": "扫描中",
		"report.quickRead": "平台速览",
		"report.good": "良好",
		"report.poor": "有风险",
		"report.otherPlatforms": "检测其他平台",
		"risk.high": "高风险",
		"risk.medium": "中风险",
		"risk.low": "低风险",
		"readiness.index": "平台兼容性",
		"readiness.title": "按使用场景评估可用性。",
		"readiness.subtitle": "每个平台按各自的风控模型独立评分：IP 归属地、匿名信号、数据中心与滥用记录。仅为诊断性估算，并非平台官方承诺。",
		"tabs.all": "全部",
		"tabs.ai": "AI 智能",
		"tabs.ecommerce": "电商",
		"tabs.advertising": "广告",
		"tabs.social": "社媒",
		"platform.ready": "可用",
		"platform.applicable": "当前网络适用于该平台",
		"platform.caution": "当前网络在该平台可能触发风控，建议留意",
		"platform.notApplicable": "当前网络不适用于该平台",
		"platform.categories": "平台分类",
		"platform.assessingIp": "当前评估 IP：{ip}",
		"platform.showReason": "查看 {platform} 可能不适用的原因",
		"platform.reasonTitle": "结论原因",
		"platform.reason.regionBlocked": "{platform} 对来自{country}的 IP 存在地区限制。",
		"platform.reason.regionUnsupported": "{platform} 目前不支持来自{country}的 IP。",
		"platform.reason.anonymizer": "该 IP 命中 VPN、代理、Tor 或其他匿名网络信号。",
		"platform.reason.datacenter": "该 IP 被识别为数据中心或托管网络地址。",
		"platform.reason.abuse": "该 IP 关联了近期滥用记录。",
		"signal.region": "IP 归属地受限",
		"signal.anonymizer": "VPN / 代理 / Tor 匿名信号",
		"signal.datacenter": "数据中心 IP",
		"signal.abuse": "IP 滥用记录",
		"metrics.signals": "分析信号数",
		"metrics.live": "实时",
		"metrics.iplocate": "IPLocate 情报",
		"metrics.platforms": "评估平台数",
		"metrics.aiPass": "AI 分析轮次",
		"info.index": "基础信息",
		"info.title": "设备指纹信息",
		"info.subtitle": "无痕的信息，让上网更安全",
		"info.location": "位置",
		"info.country": "国家 / 地区",
		"info.state": "州 / 省",
		"info.city": "城市",
		"info.hostname": "主机名",
		"info.postalCode": "邮编",
		"info.coordinates": "经纬度",
		"info.isp": "ISP",
		"info.organization": "组织",
		"info.connection": "连接方式",
		"info.asn": "ASN",
		"info.time": "时间",
		"info.timezone": "时区",
		"info.ipLocalTime": "IP 本地时间",
		"info.systemTime": "系统时间",
		"info.browser": "浏览器",
		"info.userAgent": "User Agent",
		"info.detectedBrowser": "检测到的浏览器",
		"info.os": "操作系统",
		"info.device": "设备",
		"status.detected": "已检测到",
		"status.notDetected": "未检测到",
		"status.suspectedExit": "疑似出口",
		"status.suspectedExitHelp": "机房 IP · 未命中已知 VPN 名单",
		"status.proxy": "代理",
		"status.vpnTor": "VPN / Tor",
		"status.recentAbuse": "近期滥用",
		"status.riskScore": "风险评分",
		"status.safetyScore": "安全评分",
		"status.detecting": "检测中",
		"faq.title": "常见问题",
		"faq.q1": "IP Ready 会检测哪些内容？",
		"faq.a1": "IP Ready 会分析你的公网 IP、位置、ISP、ASN、DNS、网络类型、代理与黑名单信号、浏览器及设备信息，并将这些信号综合为风险评分和实用的平台可用性报告。",
		"faq.q2": "平台可用性评分是如何计算的？",
		"faq.a2": "每个平台有独立的模型：根据平台已知的风控行为，对地区可用性、匿名信号（VPN/代理/Tor）、数据中心 IP 和滥用记录分别加权评分。它是一种诊断性估算，并不保证第三方平台会批准账号或会话。",
		"faq.q3": "我的 IP 和浏览数据是私密的吗？",
		"faq.a3": "IP Ready 只使用生成报告所需的技术性网络与设备信号，绝不会索取账号密码、私信或浏览记录，扫描结果也不会用于识别你的个人身份。",
		"faq.q4": "可以检测哪些平台？",
		"faq.a4": "目前提供 Claude、ChatGPT、Amazon、eBay 和 Binance 的网络信号诊断评估。",
		"faq.q5": "为什么扫描结果会变化？",
		"faq.a5": "IP 信誉数据库、路由、DNS、VPN 节点和黑名单记录都会随时间变化。当你切换网络、代理、VPN 节点或设备时，请重新扫描以获得最相关的结果。",
		"feature.reliable": "专业可靠",
		"feature.efficient": "高效便捷",
		"feature.accurate": "数据精准",
		"feature.stable": "安全稳定",
		"footer.platform": "平台",
		"footer.useCases": "使用场景",
		"footer.ipIntelligence": "IP 情报",
		"footer.resources": "资源",
		"footer.company": "公司",
		"footer.platformReadiness": "平台可用性",
		"footer.riskScore": "风险评分",
		"footer.ipInformation": "IP 信息",
		"footer.fraudSignals": "欺诈信号",
		"footer.faq": "常见问题",
		"footer.rights": "© 2026 IP Ready 保留所有权利。",
		"footer.systems": "AI 驱动的 IP 情报",
		"misc.na": "未知",
		"misc.unknown": "未知",
		"misc.copied": "已复制到剪贴板",
		"misc.ipCopied": "IP 地址已复制",
		"misc.scanFailed": "IP 扫描失败。",
		"blog.metaTitle": "IP 博客 — 风险评分、黑名单与 VPN 检测 — IP Ready",
		"blog.metaDescription": "关于 IP 风险评分、黑名单、平台封禁与 VPN 检测的实战指南：平台如何评判你的 IP，以及如何修复。",
		"blog.kicker": "关于 IP 健康与账号信任的实践笔记",
		"blog.heroTitle": "IP 风险、黑名单\n与实用修复指南",
		"blog.heroSub": "风险评分、黑名单、平台封禁与 VPN 检测的实战指南，每周更新。",
		"blog.featuredLabel": "精选",
		"blog.latest": "最新内容",
		"blog.recent": "近期文章",
		"blog.by": "作者：",
		"blog.back": "返回博客",
		"blog.loading": "正在加载文章…",
		"blog.filter.label": "筛选文章",
		"blog.filter.allPosts": "全部文章",
		"blog.filter.changelog": "更新日志",
		"blog.filter.resources": "资源",
		"blog.filter.news": "资讯",
		"blog.categoryLabel": "",
		"blog.emailLabel": "邮箱地址",
		"blog.emailPlaceholder": "邮箱地址",
		"blog.emailSubmit": "订阅",
		"blog.keepReading": "继续阅读",
		"blog.detail.lead": "选对工具是团队能做的最关键决策之一。正确的选择能缩短见效时间、提升可读性，让人专注于真正重要的内容；错误的选择只会制造又一个没人用的孤岛系统。本文对比主流方案的特性与定价，并说明为什么一套干净、聚焦的做法最适合大多数现代团队。",
		"blog.detail.h2a": "什么样的工具才算好？",
		"blog.detail.pa": "好的工具指能帮助团队规模化地发现、理解并作用于正确信号的软件，而不需要为每一步都付出人工。这包括：",
		"blog.detail.l1": "清晰的结构化报告",
		"blog.detail.l1b": "基于可信数据生成并持续更新",
		"blog.detail.l2": "AI 辅助摘要",
		"blog.detail.l2b": "把原始信号转化为通俗易懂的洞察",
		"blog.detail.l3": "可靠的集成",
		"blog.detail.l3b": "让你的数据与你现有的技术栈保持同步。",
		"blog.detail.h2b": "应该关注什么",
		"blog.detail.pb": "评估工具时，请聚焦那些真正改变结果的能。下表总结了最重要的几点。",
		"blog.detail.col1": "功能",
		"blog.detail.col2": "为什么重要",
		"blog.detail.r1": "透明的定价",
		"blog.detail.r1b": "你应在销售电话之前就知道要花多少钱，而不是之后。",
		"blog.detail.r2": "公开的准确度数据",
		"blog.detail.r2b": "声称智能的工具应能给出真实数字作为支撑。",
		"blog.detail.r3": "人工参与的控制",
		"blog.detail.r3b": "AI 起草并建议，人工在上线前确认。",
		"blog.filter.all": "全部",
		"blog.filter.guides": "指南",
		"blog.filter.privacy": "隐私",
		"blog.filter.platforms": "平台",
		"blog.readStory": "阅读全文",
		"blog.featured.title": "风险评分到底意味着什么",
		"blog.featured.excerpt": "欺诈分析团队是如何读一份 IP 报告的，以及为什么分数只是故事的第一行。",
		"blog.featured.author": "Lin Xu",
		"blog.featured.readTime": "7 分钟阅读",
		"blog.p1.title": "上架前的五项检查",
		"blog.p1.excerpt": "一份给卖家的快速预检清单：网络、浏览器、设备、评分，以及它们背后的结论。",
		"blog.p1.author": "Mina Chen",
		"blog.p1.readTime": "5 分钟阅读",
		"blog.p2.title": "住宅、移动还是机房 IP",
		"blog.p2.excerpt": "不同网络类型向平台传递了什么信号，以及什么时候诚实的答案是“都不是”。",
		"blog.p2.author": "Leah Soto",
		"blog.p2.readTime": "6 分钟阅读",
		"blog.p3.title": "当一次登录被标记",
		"blog.p3.excerpt": "拆解一次高风险登录：哪些信号被触发、按什么顺序触发，以及每一步本可以如何避免。",
		"blog.p3.author": "Jon Bell",
		"blog.p3.readTime": "4 分钟阅读",
		"blog.p4.title": "冷静读懂代理标记",
		"blog.p4.excerpt": "VPN、Tor、近期滥用：每个标记单独出现意味着什么，叠加在一起又意味着什么。",
		"blog.p4.author": "Lin Xu",
		"blog.p4.readTime": "8 分钟阅读",
		"blog.p5.title": "VPN 日志的安静一小时",
		"blog.p5.excerpt": "我们跟随一条连接跨越三个国家、两次断线重连，看看什么会泄露、什么能守住。",
		"blog.p5.author": "Leah Soto",
		"blog.p5.readTime": "5 分钟阅读",
		"blog.p6.title": "一间小店，三个账号",
		"blog.p6.excerpt": "走进一家同时运营多个店铺的小店，看看他们如何在账号之间筑起隔离墙。",
		"blog.p6.author": "Mina Chen",
		"blog.p6.readTime": "6 分钟阅读",
		"resources.metaTitle": "IP 指南 — 黑名单查询、IP 类型与术语表 — IP Ready",
		"resources.metaDescription": "降低 IP 风险评分的实用指南、黑名单查询方法、住宅与数据中心 IP 对比、查询工具与通俗术语表。",
		"resources.kicker": "IP 知识、工具与参考资源",
		"resources.heroTitle": "了解 IP 风险，选对适合业务的类型。",
		"resources.heroSub": "提供 IP 类型讲解、在线检测工具与常见术语解释，帮助你判断网络与平台的适配情况。",
		"resources.tools.check.title": "检测单个 IP",
		"resources.tools.check.desc": "任意 IPv4 / IPv6 的完整报告：风险评分、网络信号与 AI 结论。",
		"resources.tools.check.cta": "打开单 IP 检测",
		"resources.tools.batch.title": "批量检测",
		"resources.tools.batch.desc": "一次最多批量扫描 20 个 IP，每个地址都有独立结论。",
		"resources.tools.batch.cta": "打开批量检测",
		"resources.types.title": "常见 IP 类型与适用业务。",
		"resources.types.sub": "介绍每种类型的特点、适合的业务场景，以及平台对其的识别方式。",
		"resources.types.bestFor": "适合的业务",
		"resources.types.datacenter.name": "数据中心 IP",
		"resources.types.datacenter.tag": "最易被标记",
		"resources.types.datacenter.trait": "向云服务商与 IDC 机房租用。便宜、带宽高、分钟级可得。",
		"resources.types.datacenter.use1": "爬虫与数据采集",
		"resources.types.datacenter.use2": "SEO 与价格监控",
		"resources.types.datacenter.use3": "负载与可用性测试",
		"resources.types.datacenter.use4": "不依赖账号信任的大批量任务",
		"resources.types.datacenter.risk": "数据中心网段最容易被平台识别——电商与社媒场景要有心理预期。",
		"resources.types.static.name": "静态住宅 IP",
		"resources.types.static.tag": "长期信誉最佳",
		"resources.types.static.trait": "注册在住宅 ISP 名下的固定 IP，几个月不变，信誉随时间持续积累。",
		"resources.types.static.use1": "跨境电商长期店铺",
		"resources.types.static.use2": "社媒账号长期养号",
		"resources.types.static.use3": "绝不能变更地点的广告账户",
		"resources.types.static.use4": "AI 平台的长期会话",
		"resources.types.static.risk": "最接近真实家庭宽带的类型——需要“稳定一致”时，它是最强选择。",
		"resources.types.rotating.name": "动态住宅 IP",
		"resources.types.rotating.tag": "难以封禁",
		"resources.types.rotating.trait": "真实家庭宽带出口，按请求或会话从大地址池中轮换。",
		"resources.types.rotating.use1": "大规模数据采集",
		"resources.types.rotating.use2": "广告验证",
		"resources.types.rotating.use3": "竞品与价格监控",
		"resources.types.rotating.use4": "需要大量不同出口的任务",
		"resources.types.rotating.risk": "频繁轮换会触发“位置跳变”风控——不适合养号场景。",
		"resources.types.mobile.name": "移动 IP",
		"resources.types.mobile.tag": "信任度最高",
		"resources.types.mobile.trait": "4G/5G 运营商出口，经 CGNAT 由成千上万真实用户共享。",
		"resources.types.mobile.use1": "社媒账号注册",
		"resources.types.mobile.use2": "严格平台上的高信任短任务",
		"resources.types.mobile.use3": "试探平台真实的风控强度",
		"resources.types.mobile.use4": "找回在其他网络被标记的账号",
		"resources.types.mobile.risk": "封一个移动出口等于封真实用户——信任度最高，成本也最高。",
		"resources.types.note": "选择 IP 类型后，建议通过实际扫描验证各平台的可用性。",
		"resources.glossary.title": "常见术语解释。",
		"resources.glossary.sub": "检测报告中常见术语的通俗说明。",
		"resources.glossary.ip.term": "IP 地址",
		"resources.glossary.ip.def": "每台设备在互联网上亮出的号码——既是身份，也是大致位置。",
		"resources.glossary.ipv4.term": "IPv4 / IPv6",
		"resources.glossary.ipv4.def": "两代地址体系：32 位的经典版本日渐枯竭，128 位的新版本接棒。",
		"resources.glossary.isp.term": "ISP",
		"resources.glossary.isp.def": "互联网服务提供商——你的 IP 归属的公司，你访问的每个网站都能看到它。",
		"resources.glossary.asn.term": "ASN",
		"resources.glossary.asn.def": "自治系统编号——一个 IP 网段注册在哪家网络（运营商、ISP 或云厂商）名下。",
		"resources.glossary.datacenter.term": "数据中心 IP",
		"resources.glossary.datacenter.def": "托管在商业机房、由云或托管公司持有的 IP。",
		"resources.glossary.residential.term": "住宅 IP",
		"resources.glossary.residential.def": "由消费级 ISP 分配给家庭宽带线路的 IP。",
		"resources.glossary.mobile.term": "移动 IP",
		"resources.glossary.mobile.def": "经运营商级 NAT 共享给大量用户的蜂窝网络出口。",
		"resources.glossary.cgnat.term": "CGNAT",
		"resources.glossary.cgnat.def": "运营商级 NAT：成千上万用户共用一个公网 IP，这也是移动出口难以被封禁的原因。",
		"resources.glossary.proxy.term": "代理",
		"resources.glossary.proxy.def": "任何替你转发流量的服务器，目标网站看到的是它的 IP 而不是你的。",
		"resources.glossary.vpn.term": "VPN",
		"resources.glossary.vpn.def": "通往服务商服务器的加密隧道——带隐私保障、要付订阅费的代理。",
		"resources.glossary.tor.term": "Tor",
		"resources.glossary.tor.def": "把流量弹过三个志愿者节点的匿名网络。",
		"resources.glossary.dnsbl.term": "DNSBL",
		"resources.glossary.dnsbl.def": "基于 DNS 的黑名单：收录因垃圾或滥用行为被标记的地址。",
		"resources.glossary.score.term": "风险评分",
		"resources.glossary.score.def": "一个 0–100 的估算，衡量一个 IP 在平台眼中的风险，由信誉、网络类型与行为信号构成。",
		"resources.glossary.rotation.term": "IP 轮换",
		"resources.glossary.rotation.def": "按计划或按请求更换出口 IP，通常通过代理地址池实现。",
		"resources.glossary.geo.term": "地理位置",
		"resources.glossary.geo.def": "把 IP 映射到国家、地区与城市——设计上就只是近似。",
		"resources.cta.title": "现在，看看你自己的 IP。",
		"resources.cta.sub": "一次扫描即可获得风险评分、信号详情与平台可用性评估。",
		"resources.cta.button": "检测我的 IP"
	}
};
function useI18n() {
	const locale = useState("locale", () => "en");
	const t = (key, params) => {
		const message = messages[locale.value][key] ?? messages.en[key] ?? key;
		if (!params) return message;
		return message.replace(/\{(\w+)\}/g, (match, name) => String(params[name] ?? match));
	};
	const setLocale = (next) => {
		locale.value = next;
	};
	return {
		locale,
		t,
		setLocale
	};
}
//#endregion
//#region app/app.vue?vue&type=script&setup=true&lang.ts
var app_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "app",
	__ssrInlineRender: true,
	setup(__props) {
		const { locale } = useI18n();
		useHead$1({
			htmlAttrs: { lang: computed(() => locale.value === "zh" ? "zh-CN" : "en") },
			script: [{
				defer: true,
				src: "https://cloud.umami.is/script.js",
				"data-website-id": "f555f81d-f480-4b78-a3b6-ab9ac0278f2c"
			}]
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(page_default, _attrs, null, _parent));
		};
	}
});
//#endregion
//#region app/app.vue
var _sfc_setup$3 = app_vue_vue_type_script_setup_true_lang_default.setup;
app_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("app.vue");
	return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
var app_default = app_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region node_modules/.pnpm/nuxt@4.5.2_@babel+plugin-syntax-jsx@7.29.7_@babel+core@7.29.7__@babel+plugin-syntax-typ_7b5abac9ad6b4131f0af60bfddb7caf2/node_modules/nuxt/dist/app/components/nuxt-error-page.vue
var _sfc_main$1 = {
	__name: "nuxt-error-page",
	__ssrInlineRender: true,
	props: { error: Object },
	setup(__props) {
		const _error = __props.error;
		const status = Number(_error.statusCode || 500);
		const is404 = status === 404;
		const statusText = _error.statusMessage ?? (is404 ? "Page Not Found" : "Internal Server Error");
		const description = _error.message || _error.toString();
		const stack = void 0;
		const _Error404 = defineAsyncComponent(() => import('../build/error-404-ByleBdjO.mjs'));
		const _Error = defineAsyncComponent(() => import('../build/error-500-iMJbUCsI.mjs'));
		const ErrorTemplate = is404 ? _Error404 : _Error;
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(unref(ErrorTemplate), mergeProps({
				status: unref(status),
				statusText: unref(statusText),
				statusCode: unref(status),
				statusMessage: unref(statusText),
				description: unref(description),
				stack: unref(stack)
			}, _attrs), null, _parent));
		};
	}
};
var _sfc_setup$2 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/nuxt@4.5.2_@babel+plugin-syntax-jsx@7.29.7_@babel+core@7.29.7__@babel+plugin-syntax-typ_7b5abac9ad6b4131f0af60bfddb7caf2/node_modules/nuxt/dist/app/components/nuxt-error-page.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
//#endregion
//#region app/error.vue?vue&type=script&setup=true&lang.ts
var error_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "error",
	__ssrInlineRender: true,
	props: { error: {} },
	setup(__props) {
		const props = __props;
		useHead$1({
			title: () => props.error.statusCode === 404 ? "Page Not Found — IP Ready" : "Error — IP Ready",
			titleTemplate: (title) => props.error.statusCode === 404 ? "Page Not Found — IP Ready" : title || "Error — IP Ready"
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(_sfc_main$1, mergeProps({ error: __props.error }, _attrs), null, _parent));
		};
	}
});
//#endregion
//#region app/error.vue
var _sfc_setup$1 = error_vue_vue_type_script_setup_true_lang_default.setup;
error_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("error.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var error_default = error_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fisland-renderer.mjs
var IslandRenderer = () => null;
//#endregion
//#region node_modules/.pnpm/nuxt@4.5.2_@babel+plugin-syntax-jsx@7.29.7_@babel+core@7.29.7__@babel+plugin-syntax-typ_7b5abac9ad6b4131f0af60bfddb7caf2/node_modules/nuxt/dist/app/components/nuxt-root.vue
var _sfc_main = {
	__name: "nuxt-root",
	__ssrInlineRender: true,
	setup(__props) {
		const nuxtApp = useNuxtApp();
		nuxtApp.deferHydration();
		nuxtApp.ssrContext.url;
		const SingleRenderer = false;
		provide(PageRouteSymbol, useRoute$1());
		nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup", []);
		const error = /* @__PURE__ */ useError();
		const abortRender = error.value && !nuxtApp.ssrContext.error;
		function invokeAppErrorHandler(err, target, info) {
			const errorHandler = nuxtApp.vueApp.config.errorHandler;
			if (errorHandler && !errorHandler.__nuxt_default) try {
				errorHandler(err, target, info);
			} catch (handlerError) {
				console.error("[nuxt] Error in `app.config.errorHandler`", handlerError);
			}
		}
		onErrorCaptured((err, target, info) => {
			nuxtApp.hooks.callHook("vue:error", err, target, info)?.catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
			{
				const p = nuxtApp.runWithContext(() => showError(err));
				onServerPrefetch(() => p);
				invokeAppErrorHandler(err, target, info);
				return false;
			}
		});
		const islandContext = nuxtApp.ssrContext.islandContext;
		return (_ctx, _push, _parent, _attrs) => {
			ssrRenderSuspense(_push, {
				default: () => {
					if (unref(abortRender)) _push(`<div></div>`);
					else if (unref(error)) _push(ssrRenderComponent(unref(error_default), { error: unref(error) }, null, _parent));
					else if (unref(islandContext)) _push(ssrRenderComponent(unref(IslandRenderer), { context: unref(islandContext) }, null, _parent));
					else if (unref(SingleRenderer)) ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(SingleRenderer)), null, null), _parent);
					else _push(ssrRenderComponent(unref(app_default), null, null, _parent));
				},
				_: 1
			});
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/nuxt@4.5.2_@babel+plugin-syntax-jsx@7.29.7_@babel+core@7.29.7__@babel+plugin-syntax-typ_7b5abac9ad6b4131f0af60bfddb7caf2/node_modules/nuxt/dist/app/components/nuxt-root.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
//#endregion
//#region node_modules/.pnpm/nuxt@4.5.2_@babel+plugin-syntax-jsx@7.29.7_@babel+core@7.29.7__@babel+plugin-syntax-typ_7b5abac9ad6b4131f0af60bfddb7caf2/node_modules/nuxt/dist/app/entry.js
var entry$1 = async function createNuxtAppServer(ssrContext) {
	const vueApp = createApp(_sfc_main);
	const nuxt = createNuxtApp({
		vueApp,
		ssrContext
	});
	try {
		await applyPlugins(nuxt, virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fplugins_server_default);
		await nuxt.hooks.callHook("app:created", vueApp);
	} catch (error) {
		await nuxt.hooks.callHook("app:error", error);
		nuxt.payload.error ||= createError$1(error);
	}
	if (ssrContext && (ssrContext["~renderResponse"] || ssrContext._renderResponse)) throw new Error("skipping render");
	return vueApp;
};
var entry_default = ((ssrContext) => entry$1(ssrContext));

const entry = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: entry_default
}, Symbol.toStringTag, { value: 'Module' }));

export { $fetch$2 as $, useRoute$1 as a, useRequestFetch as b, useI18n as c, createError$1 as d, appDiagnostics as e, useNuxtApp as f, asyncDataDefaults as g, defineProdDiagnostics as h, docsBase as i, useRouter as j, encodeRoutePath as k, useRuntimeConfig as l, nuxtLinkDefaults as m, navigateTo as n, entry as o, prodReporters as p, resolveRouteObject as r, sanitizeTag as s, useHead$1 as u };
//# sourceMappingURL=entry.mjs.map
