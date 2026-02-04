import process from 'node:process';globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import { hasInjectionContext, inject, toRef, isRef, readonly, getCurrentInstance, defineAsyncComponent, defineComponent, useSSRContext, h as h$2, computed, unref, shallowRef, provide, shallowReactive, ref, Suspense, Fragment, createElementBlock, cloneVNode, createApp, mergeProps, withAsyncContext, withCtx, createVNode, onErrorCaptured, onServerPrefetch, resolveDynamicComponent, reactive, effectScope, isReadonly, isShallow, isReactive, toRaw, nextTick, getCurrentScope } from 'vue';
import { e as createError$1, q as hasProtocol, v as isScriptProtocol, w as joinURL, x as withQuery, y as sanitizeStatusCode, z as getContext, $ as $fetch$1, A as baseURL, B as createHooks, C as executeAsync, D as toRouteMatcher, E as createRouter$1, F as defu } from '../_/nitro.mjs';
import { useRoute as useRoute$1, RouterView, createMemoryHistory, createRouter, START_LOCATION } from 'vue-router';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrRenderSuspense, ssrRenderVNode } from 'vue/server-renderer';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:url';
import 'node:path';
import 'better-sqlite3';
import 'ipx';
import 'node:crypto';

if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch$1.create({
    baseURL: baseURL()
  });
}
if (!("global" in globalThis)) {
  globalThis.global = globalThis;
}
const appLayoutTransition = {};
const nuxtLinkDefaults = { "componentName": "NuxtLink" };
const asyncDataDefaults = { "deep": false };
const fetchDefaults = {};
const appId = "nuxt-app";
function getNuxtAppCtx(id = appId) {
  return getContext(id, {
    asyncContext: false
  });
}
const NuxtPluginIndicator = "__nuxt_plugin";
function createNuxtApp(options) {
  let hydratingCount = 0;
  const nuxtApp = {
    _id: options.id || appId || "nuxt-app",
    _scope: effectScope(),
    provide: void 0,
    versions: {
      get nuxt() {
        return "4.2.2";
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
    static: {
      data: {}
    },
    runWithContext(fn) {
      if (nuxtApp._scope.active && !getCurrentScope()) {
        return nuxtApp._scope.run(() => callWithNuxt(nuxtApp, fn));
      }
      return callWithNuxt(nuxtApp, fn);
    },
    isHydrating: false,
    deferHydration() {
      if (!nuxtApp.isHydrating) {
        return () => {
        };
      }
      hydratingCount++;
      let called = false;
      return () => {
        if (called) {
          return;
        }
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
    _payloadRevivers: {},
    ...options
  };
  {
    nuxtApp.payload.serverRendered = true;
  }
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
      for (const hook of hooks) {
        await nuxtApp.runWithContext(() => hook(...args));
      }
    };
    nuxtApp.hooks.callHook = (name, ...args) => nuxtApp.hooks.callHookWith(contextCaller, name, ...args);
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
function registerPluginHooks(nuxtApp, plugin2) {
  if (plugin2.hooks) {
    nuxtApp.hooks.addHooks(plugin2.hooks);
  }
}
async function applyPlugin(nuxtApp, plugin2) {
  if (typeof plugin2 === "function") {
    const { provide: provide2 } = await nuxtApp.runWithContext(() => plugin2(nuxtApp)) || {};
    if (provide2 && typeof provide2 === "object") {
      for (const key in provide2) {
        nuxtApp.provide(key, provide2[key]);
      }
    }
  }
}
async function applyPlugins(nuxtApp, plugins2) {
  const resolvedPlugins = /* @__PURE__ */ new Set();
  const unresolvedPlugins = [];
  const parallels = [];
  let error = void 0;
  let promiseDepth = 0;
  async function executePlugin(plugin2) {
    const unresolvedPluginsForThisPlugin = plugin2.dependsOn?.filter((name) => plugins2.some((p) => p._name === name) && !resolvedPlugins.has(name)) ?? [];
    if (unresolvedPluginsForThisPlugin.length > 0) {
      unresolvedPlugins.push([new Set(unresolvedPluginsForThisPlugin), plugin2]);
    } else {
      const promise = applyPlugin(nuxtApp, plugin2).then(async () => {
        if (plugin2._name) {
          resolvedPlugins.add(plugin2._name);
          await Promise.all(unresolvedPlugins.map(async ([dependsOn, unexecutedPlugin]) => {
            if (dependsOn.has(plugin2._name)) {
              dependsOn.delete(plugin2._name);
              if (dependsOn.size === 0) {
                promiseDepth++;
                await executePlugin(unexecutedPlugin);
              }
            }
          }));
        }
      }).catch((e) => {
        if (!plugin2.parallel && !nuxtApp.payload.error) {
          throw e;
        }
        error ||= e;
      });
      if (plugin2.parallel) {
        parallels.push(promise);
      } else {
        await promise;
      }
    }
  }
  for (const plugin2 of plugins2) {
    if (nuxtApp.ssrContext?.islandContext && plugin2.env?.islands === false) {
      continue;
    }
    registerPluginHooks(nuxtApp, plugin2);
  }
  for (const plugin2 of plugins2) {
    if (nuxtApp.ssrContext?.islandContext && plugin2.env?.islands === false) {
      continue;
    }
    await executePlugin(plugin2);
  }
  await Promise.all(parallels);
  if (promiseDepth) {
    for (let i = 0; i < promiseDepth; i++) {
      await Promise.all(parallels);
    }
  }
  if (error) {
    throw nuxtApp.payload.error || error;
  }
}
// @__NO_SIDE_EFFECTS__
function defineNuxtPlugin(plugin2) {
  if (typeof plugin2 === "function") {
    return plugin2;
  }
  const _name = plugin2._name || plugin2.name;
  delete plugin2.name;
  return Object.assign(plugin2.setup || (() => {
  }), plugin2, { [NuxtPluginIndicator]: true, _name });
}
function callWithNuxt(nuxt, setup, args) {
  const fn = () => setup();
  const nuxtAppCtx = getNuxtAppCtx(nuxt._id);
  {
    return nuxt.vueApp.runWithContext(() => nuxtAppCtx.callAsync(nuxt, fn));
  }
}
function tryUseNuxtApp(id) {
  let nuxtAppInstance;
  if (hasInjectionContext()) {
    nuxtAppInstance = getCurrentInstance()?.appContext.app.$nuxt;
  }
  nuxtAppInstance ||= getNuxtAppCtx(id).tryUse();
  return nuxtAppInstance || null;
}
function useNuxtApp(id) {
  const nuxtAppInstance = tryUseNuxtApp(id);
  if (!nuxtAppInstance) {
    {
      throw new Error("[nuxt] instance unavailable");
    }
  }
  return nuxtAppInstance;
}
// @__NO_SIDE_EFFECTS__
function useRuntimeConfig(_event) {
  return useNuxtApp().$config;
}
function defineGetter(obj, key, val) {
  Object.defineProperty(obj, key, { get: () => val });
}
const LayoutMetaSymbol = /* @__PURE__ */ Symbol("layout-meta");
const PageRouteSymbol = /* @__PURE__ */ Symbol("route");
globalThis._importMeta_.url.replace(/\/app\/.*$/, "/");
const useRouter = () => {
  return useNuxtApp()?.$router;
};
const useRoute = () => {
  if (hasInjectionContext()) {
    return inject(PageRouteSymbol, useNuxtApp()._route);
  }
  return useNuxtApp()._route;
};
// @__NO_SIDE_EFFECTS__
function defineNuxtRouteMiddleware(middleware) {
  return middleware;
}
const isProcessingMiddleware = () => {
  try {
    if (useNuxtApp()._processingMiddleware) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
};
const URL_QUOTE_RE = /"/g;
const navigateTo = (to, options) => {
  to ||= "/";
  const toPath = typeof to === "string" ? to : "path" in to ? resolveRouteObject(to) : useRouter().resolve(to).href;
  const isExternalHost = hasProtocol(toPath, { acceptRelative: true });
  const isExternal = options?.external || isExternalHost;
  if (isExternal) {
    if (!options?.external) {
      throw new Error("Navigating to an external URL is not allowed by default. Use `navigateTo(url, { external: true })`.");
    }
    const { protocol } = new URL(toPath, "http://localhost");
    if (protocol && isScriptProtocol(protocol)) {
      throw new Error(`Cannot navigate to a URL with '${protocol}' protocol.`);
    }
  }
  const inMiddleware = isProcessingMiddleware();
  const router = useRouter();
  const nuxtApp = useNuxtApp();
  {
    if (nuxtApp.ssrContext) {
      const fullPath = typeof to === "string" || isExternal ? toPath : router.resolve(to).fullPath || "/";
      const location2 = isExternal ? toPath : joinURL((/* @__PURE__ */ useRuntimeConfig()).app.baseURL, fullPath);
      const redirect = async function(response) {
        await nuxtApp.callHook("app:redirected");
        const encodedLoc = location2.replace(URL_QUOTE_RE, "%22");
        const encodedHeader = encodeURL(location2, isExternalHost);
        nuxtApp.ssrContext._renderResponse = {
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
      return redirect(!inMiddleware ? void 0 : (
        /* abort route navigation */
        false
      ));
    }
  }
  if (isExternal) {
    nuxtApp._scope.stop();
    if (options?.replace) {
      (void 0).replace(toPath);
    } else {
      (void 0).href = toPath;
    }
    if (inMiddleware) {
      if (!nuxtApp.isHydrating) {
        return false;
      }
      return new Promise(() => {
      });
    }
    return Promise.resolve();
  }
  return options?.replace ? router.replace(to) : router.push(to);
};
function resolveRouteObject(to) {
  return withQuery(to.path || "", to.query || {}) + (to.hash || "");
}
function encodeURL(location2, isExternalHost = false) {
  const url = new URL(location2, "http://localhost");
  if (!isExternalHost) {
    return url.pathname + url.search + url.hash;
  }
  if (location2.startsWith("//")) {
    return url.toString().replace(url.protocol, "");
  }
  return url.toString();
}
const NUXT_ERROR_SIGNATURE = "__nuxt_error";
const useError = /* @__NO_SIDE_EFFECTS__ */ () => toRef(useNuxtApp().payload, "error");
const showError = (error) => {
  const nuxtError = createError(error);
  try {
    const error2 = /* @__PURE__ */ useError();
    if (false) ;
    error2.value ||= nuxtError;
  } catch {
    throw nuxtError;
  }
  return nuxtError;
};
const isNuxtError = (error) => !!error && typeof error === "object" && NUXT_ERROR_SIGNATURE in error;
const createError = (error) => {
  const nuxtError = createError$1(error);
  Object.defineProperty(nuxtError, NUXT_ERROR_SIGNATURE, {
    value: true,
    configurable: false,
    writable: false
  });
  return nuxtError;
};
const unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:head",
  enforce: "pre",
  setup(nuxtApp) {
    const head = nuxtApp.ssrContext.head;
    nuxtApp.vueApp.use(head);
  }
});
function toArray(value) {
  return Array.isArray(value) ? value : [value];
}
async function getRouteRules(arg) {
  const path = typeof arg === "string" ? arg : arg.path;
  {
    useNuxtApp().ssrContext._preloadManifest = true;
    const _routeRulesMatcher2 = toRouteMatcher(
      createRouter$1({ routes: (/* @__PURE__ */ useRuntimeConfig()).nitro.routeRules })
    );
    return defu({}, ..._routeRulesMatcher2.matchAll(path).reverse());
  }
}
const __nuxt_page_meta$k = { layout: "admin" };
const __nuxt_page_meta$j = {
  key: (route2) => route2.fullPath
};
const __nuxt_page_meta$i = {
  layout: "admin",
  key: (route2) => route2.fullPath
};
const __nuxt_page_meta$h = {
  layout: "auth"
};
const __nuxt_page_meta$g = {
  layout: "admin"
};
const __nuxt_page_meta$f = {
  layout: "admin"
};
const __nuxt_page_meta$e = {
  layout: "admin"
};
const __nuxt_page_meta$d = {
  layout: "admin",
  key: (route2) => route2.fullPath
};
const __nuxt_page_meta$c = {
  layout: "admin"
};
const __nuxt_page_meta$b = {
  layout: "admin"
};
const __nuxt_page_meta$a = {
  layout: "admin"
};
const __nuxt_page_meta$9 = {
  layout: "admin"
};
const __nuxt_page_meta$8 = {
  layout: "admin"
};
const __nuxt_page_meta$7 = {
  layout: "admin"
};
const __nuxt_page_meta$6 = {
  layout: "admin"
};
const __nuxt_page_meta$5 = {
  layout: "admin"
};
const __nuxt_page_meta$4 = {
  layout: "admin"
};
const __nuxt_page_meta$3 = {
  layout: "admin"
};
const __nuxt_page_meta$2 = {
  layout: "admin"
};
const __nuxt_page_meta$1 = {
  layout: "admin",
  key: (route2) => route2.fullPath
};
const __nuxt_page_meta = {
  layout: "admin",
  key: (route2) => route2.fullPath
};
const _routes = [
  {
    name: "index",
    path: "/",
    component: () => import('./index-T8ipJgA4.mjs')
  },
  {
    name: "admin",
    path: "/admin",
    meta: { ...__nuxt_page_meta$k || {}, ...{ "middleware": "auth-admin" } },
    component: () => import('./index-Bkts6mzZ.mjs')
  },
  {
    name: "venues-id",
    path: "/venues/:id()",
    meta: __nuxt_page_meta$j || {},
    component: () => import('./_id_-DhbM8nTz.mjs')
  },
  {
    name: "booking-order",
    path: "/booking/order",
    component: () => import('./order-BlhrS0vw.mjs')
  },
  {
    name: "admin-fields-id",
    path: "/admin/fields/:id()",
    meta: { ...__nuxt_page_meta$i || {}, ...{ "middleware": "auth-admin" } },
    component: () => import('./_id_-Doq_hKKF.mjs')
  },
  {
    name: "admin-login",
    path: "/admin/login",
    meta: __nuxt_page_meta$h || {},
    component: () => import('./index-Cy1f4WXG.mjs')
  },
  {
    name: "admin-fields",
    path: "/admin/fields",
    meta: { ...__nuxt_page_meta$g || {}, ...{ "middleware": "auth-admin" } },
    component: () => import('./index-4wiuc9u9.mjs')
  },
  {
    name: "admin-fields-create",
    path: "/admin/fields/create",
    meta: { ...__nuxt_page_meta$f || {}, ...{ "middleware": "auth-admin" } },
    component: () => import('./create-x53M7Vdy.mjs')
  },
  {
    name: "admin-options",
    path: "/admin/options",
    meta: { ...__nuxt_page_meta$e || {}, ...{ "middleware": "auth-admin" } },
    component: () => import('./index-CSR4EPEQ.mjs')
  },
  {
    name: "admin-stadiums-id",
    path: "/admin/stadiums/:id()",
    meta: { ...__nuxt_page_meta$d || {}, ...{ "middleware": "auth-admin" } },
    component: () => import('./_id_-CsjAifSz.mjs')
  },
  {
    name: "admin-bookings",
    path: "/admin/bookings",
    meta: { ...__nuxt_page_meta$c || {}, ...{ "middleware": "auth-admin" } },
    component: () => import('./index-ZFdEnMkZ.mjs')
  },
  {
    name: "admin-stadiums",
    path: "/admin/stadiums",
    meta: { ...__nuxt_page_meta$b || {}, ...{ "middleware": "auth-admin" } },
    component: () => import('./index-B-SKbos8.mjs')
  },
  {
    name: "admin-facilities-id",
    path: "/admin/facilities/:id()",
    meta: { ...__nuxt_page_meta$a || {}, ...{ "middleware": "auth-admin" } },
    component: () => import('./_id_-CnfxHK2_.mjs')
  },
  {
    name: "admin-schedules",
    path: "/admin/schedules",
    meta: { ...__nuxt_page_meta$9 || {}, ...{ "middleware": "auth-admin" } },
    component: () => import('./index-3gDE-MOk.mjs')
  },
  {
    name: "admin-stadiums-create",
    path: "/admin/stadiums/create",
    meta: { ...__nuxt_page_meta$8 || {}, ...{ "middleware": "auth-admin" } },
    component: () => import('./create-Cyv6AMpi.mjs')
  },
  {
    name: "admin-facilities",
    path: "/admin/facilities",
    meta: { ...__nuxt_page_meta$7 || {}, ...{ "middleware": "auth-admin" } },
    component: () => import('./index-CmlF8Mr7.mjs')
  },
  {
    name: "admin-facilities-create",
    path: "/admin/facilities/create",
    meta: { ...__nuxt_page_meta$6 || {}, ...{ "middleware": "auth-admin" } },
    component: () => import('./create-CGgJuTc_.mjs')
  },
  {
    name: "bantuan-panduan-booking",
    path: "/bantuan/panduan-booking",
    component: () => import('./panduan-booking-C-NRev9Y.mjs')
  },
  {
    name: "bantuan-syarat-ketentuan",
    path: "/bantuan/syarat-ketentuan",
    component: () => import('./syarat-ketentuan-D0dsZbmx.mjs')
  },
  {
    name: "admin-bookings-id",
    path: "/admin/bookings/:id()",
    meta: { ...__nuxt_page_meta$5 || {}, ...{ "middleware": "auth-admin" } },
    component: () => import('./index-CEEGvHf0.mjs')
  },
  {
    name: "bantuan-kebijakan-privasi",
    path: "/bantuan/kebijakan-privasi",
    component: () => import('./kebijakan-privasi-C9fV2vZy.mjs')
  },
  {
    name: "admin-bookings-id-create",
    path: "/admin/bookings/:id()/create",
    meta: { ...__nuxt_page_meta$4 || {}, ...{ "middleware": "auth-admin" } },
    component: () => import('./create-DaKYuewO.mjs')
  },
  {
    name: "admin-bookings-history",
    path: "/admin/bookings/history",
    meta: { ...__nuxt_page_meta$3 || {}, ...{ "middleware": "auth-admin" } },
    component: () => import('./index-D1ZTnlSu.mjs')
  },
  {
    name: "admin-bookings-history-payment",
    path: "/admin/bookings/history/payment",
    meta: { ...__nuxt_page_meta$2 || {}, ...{ "middleware": "auth-admin" } },
    component: () => import('./payment-CMwppByA.mjs')
  },
  {
    name: "admin-bookings-id-bookingCode",
    path: "/admin/bookings/:id()/:bookingCode()",
    meta: { ...__nuxt_page_meta$1 || {}, ...{ "middleware": "auth-admin" } },
    component: () => import('./_bookingCode_-Ddzb1Nxj.mjs')
  },
  {
    name: "admin-bookings-detail-bookingCode",
    path: "/admin/bookings/detail/:bookingCode()",
    meta: { ...__nuxt_page_meta || {}, ...{ "middleware": "auth-admin" } },
    component: () => import('./_bookingCode_-BhElF97s.mjs')
  }
];
const _wrapInTransition = (props2, children) => {
  return { default: () => children.default?.() };
};
const ROUTE_KEY_PARENTHESES_RE = /(:\w+)\([^)]+\)/g;
const ROUTE_KEY_SYMBOLS_RE = /(:\w+)[?+*]/g;
const ROUTE_KEY_NORMAL_RE = /:\w+/g;
function generateRouteKey(route) {
  const source = route?.meta.key ?? route.path.replace(ROUTE_KEY_PARENTHESES_RE, "$1").replace(ROUTE_KEY_SYMBOLS_RE, "$1").replace(ROUTE_KEY_NORMAL_RE, (r) => route.params[r.slice(1)]?.toString() || "");
  return typeof source === "function" ? source(route) : source;
}
function isChangingPage(to, from) {
  if (to === from || from === START_LOCATION) {
    return false;
  }
  if (generateRouteKey(to) !== generateRouteKey(from)) {
    return true;
  }
  const areComponentsSame = to.matched.every(
    (comp, index) => comp.components && comp.components.default === from.matched[index]?.components?.default
  );
  if (areComponentsSame) {
    return false;
  }
  return true;
}
const routerOptions0 = {
  scrollBehavior(to, from, savedPosition) {
    const nuxtApp = useNuxtApp();
    const hashScrollBehaviour = useRouter().options?.scrollBehaviorType ?? "auto";
    if (to.path.replace(/\/$/, "") === from.path.replace(/\/$/, "")) {
      if (from.hash && !to.hash) {
        return { left: 0, top: 0 };
      }
      if (to.hash) {
        return { el: to.hash, top: _getHashElementScrollMarginTop(to.hash), behavior: hashScrollBehaviour };
      }
      return false;
    }
    const routeAllowsScrollToTop = typeof to.meta.scrollToTop === "function" ? to.meta.scrollToTop(to, from) : to.meta.scrollToTop;
    if (routeAllowsScrollToTop === false) {
      return false;
    }
    const hookToWait = nuxtApp._runningTransition ? "page:transition:finish" : "page:loading:end";
    return new Promise((resolve) => {
      if (from === START_LOCATION) {
        resolve(_calculatePosition(to, from, savedPosition, hashScrollBehaviour));
        return;
      }
      nuxtApp.hooks.hookOnce(hookToWait, () => {
        requestAnimationFrame(() => resolve(_calculatePosition(to, from, savedPosition, hashScrollBehaviour)));
      });
    });
  }
};
function _getHashElementScrollMarginTop(selector) {
  try {
    const elem = (void 0).querySelector(selector);
    if (elem) {
      return (Number.parseFloat(getComputedStyle(elem).scrollMarginTop) || 0) + (Number.parseFloat(getComputedStyle((void 0).documentElement).scrollPaddingTop) || 0);
    }
  } catch {
  }
  return 0;
}
function _calculatePosition(to, from, savedPosition, defaultHashScrollBehaviour) {
  if (savedPosition) {
    return savedPosition;
  }
  const isPageNavigation = isChangingPage(to, from);
  if (to.hash) {
    return {
      el: to.hash,
      top: _getHashElementScrollMarginTop(to.hash),
      behavior: isPageNavigation ? defaultHashScrollBehaviour : "instant"
    };
  }
  return {
    left: 0,
    top: 0
  };
}
const configRouterOptions = {
  hashMode: false,
  scrollBehaviorType: "auto"
};
const routerOptions = {
  ...configRouterOptions,
  ...routerOptions0
};
const validate = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to, from) => {
  let __temp, __restore;
  if (!to.meta?.validate) {
    return;
  }
  const result = ([__temp, __restore] = executeAsync(() => Promise.resolve(to.meta.validate(to))), __temp = await __temp, __restore(), __temp);
  if (result === true) {
    return;
  }
  const error = createError({
    fatal: false,
    statusCode: result && result.statusCode || 404,
    statusMessage: result && result.statusMessage || `Page Not Found: ${to.fullPath}`,
    data: {
      path: to.fullPath
    }
  });
  return error;
});
const manifest_45route_45rule = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to) => {
  {
    return;
  }
});
const globalMiddleware = [
  validate,
  manifest_45route_45rule
];
const namedMiddleware = {
  "auth-admin": () => import('./auth-admin-BjDqv9EQ.mjs')
};
const plugin = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:router",
  enforce: "pre",
  async setup(nuxtApp) {
    let __temp, __restore;
    let routerBase = (/* @__PURE__ */ useRuntimeConfig()).app.baseURL;
    const history = routerOptions.history?.(routerBase) ?? createMemoryHistory(routerBase);
    const routes2 = routerOptions.routes ? ([__temp, __restore] = executeAsync(() => routerOptions.routes(_routes)), __temp = await __temp, __restore(), __temp) ?? _routes : _routes;
    let startPosition;
    const router = createRouter({
      ...routerOptions,
      scrollBehavior: (to, from, savedPosition) => {
        if (from === START_LOCATION) {
          startPosition = savedPosition;
          return;
        }
        if (routerOptions.scrollBehavior) {
          router.options.scrollBehavior = routerOptions.scrollBehavior;
          if ("scrollRestoration" in (void 0).history) {
            const unsub = router.beforeEach(() => {
              unsub();
              (void 0).history.scrollRestoration = "manual";
            });
          }
          return routerOptions.scrollBehavior(to, START_LOCATION, startPosition || savedPosition);
        }
      },
      history,
      routes: routes2
    });
    nuxtApp.vueApp.use(router);
    const previousRoute = shallowRef(router.currentRoute.value);
    router.afterEach((_to, from) => {
      previousRoute.value = from;
    });
    Object.defineProperty(nuxtApp.vueApp.config.globalProperties, "previousRoute", {
      get: () => previousRoute.value
    });
    const initialURL = nuxtApp.ssrContext.url;
    const _route = shallowRef(router.currentRoute.value);
    const syncCurrentRoute = () => {
      _route.value = router.currentRoute.value;
    };
    router.afterEach((to, from) => {
      if (to.matched.at(-1)?.components?.default === from.matched.at(-1)?.components?.default) {
        syncCurrentRoute();
      }
    });
    const route = { sync: syncCurrentRoute };
    for (const key in _route.value) {
      Object.defineProperty(route, key, {
        get: () => _route.value[key],
        enumerable: true
      });
    }
    nuxtApp._route = shallowReactive(route);
    nuxtApp._middleware ||= {
      global: [],
      named: {}
    };
    if (!nuxtApp.ssrContext?.islandContext) {
      router.afterEach(async (to, _from, failure) => {
        delete nuxtApp._processingMiddleware;
        if (failure) {
          await nuxtApp.callHook("page:loading:end");
        }
        if (failure?.type === 4) {
          return;
        }
        if (to.redirectedFrom && to.fullPath !== initialURL) {
          await nuxtApp.runWithContext(() => navigateTo(to.fullPath || "/"));
        }
      });
    }
    try {
      if (true) {
        ;
        [__temp, __restore] = executeAsync(() => router.push(initialURL)), await __temp, __restore();
        ;
      }
      ;
      [__temp, __restore] = executeAsync(() => router.isReady()), await __temp, __restore();
      ;
    } catch (error2) {
      [__temp, __restore] = executeAsync(() => nuxtApp.runWithContext(() => showError(error2))), await __temp, __restore();
    }
    const resolvedInitialRoute = router.currentRoute.value;
    syncCurrentRoute();
    if (nuxtApp.ssrContext?.islandContext) {
      return { provide: { router } };
    }
    const initialLayout = nuxtApp.payload.state._layout;
    router.beforeEach(async (to, from) => {
      await nuxtApp.callHook("page:loading:start");
      to.meta = reactive(to.meta);
      if (nuxtApp.isHydrating && initialLayout && !isReadonly(to.meta.layout)) {
        to.meta.layout = initialLayout;
      }
      nuxtApp._processingMiddleware = true;
      if (!nuxtApp.ssrContext?.islandContext) {
        const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
        for (const component of to.matched) {
          const componentMiddleware = component.meta.middleware;
          if (!componentMiddleware) {
            continue;
          }
          for (const entry2 of toArray(componentMiddleware)) {
            middlewareEntries.add(entry2);
          }
        }
        {
          const routeRules = await nuxtApp.runWithContext(() => getRouteRules({ path: to.path }));
          if (routeRules.appMiddleware) {
            for (const key in routeRules.appMiddleware) {
              if (routeRules.appMiddleware[key]) {
                middlewareEntries.add(key);
              } else {
                middlewareEntries.delete(key);
              }
            }
          }
        }
        for (const entry2 of middlewareEntries) {
          const middleware = typeof entry2 === "string" ? nuxtApp._middleware.named[entry2] || await namedMiddleware[entry2]?.().then((r) => r.default || r) : entry2;
          if (!middleware) {
            throw new Error(`Unknown route middleware: '${entry2}'.`);
          }
          try {
            if (false) ;
            const result = await nuxtApp.runWithContext(() => middleware(to, from));
            if (true) {
              if (result === false || result instanceof Error) {
                const error2 = result || createError({
                  statusCode: 404,
                  statusMessage: `Page Not Found: ${initialURL}`
                });
                await nuxtApp.runWithContext(() => showError(error2));
                return false;
              }
            }
            if (result === true) {
              continue;
            }
            if (result === false) {
              return result;
            }
            if (result) {
              if (isNuxtError(result) && result.fatal) {
                await nuxtApp.runWithContext(() => showError(result));
              }
              return result;
            }
          } catch (err) {
            const error2 = createError(err);
            if (error2.fatal) {
              await nuxtApp.runWithContext(() => showError(error2));
            }
            return error2;
          }
        }
      }
    });
    router.onError(async () => {
      delete nuxtApp._processingMiddleware;
      await nuxtApp.callHook("page:loading:end");
    });
    router.afterEach((to) => {
      if (to.matched.length === 0) {
        return nuxtApp.runWithContext(() => showError(createError({
          statusCode: 404,
          fatal: false,
          statusMessage: `Page not found: ${to.fullPath}`,
          data: {
            path: to.fullPath
          }
        })));
      }
    });
    nuxtApp.hooks.hookOnce("app:created", async () => {
      try {
        if ("name" in resolvedInitialRoute) {
          resolvedInitialRoute.name = void 0;
        }
        await router.replace({
          ...resolvedInitialRoute,
          force: true
        });
        router.options.scrollBehavior = routerOptions.scrollBehavior;
      } catch (error2) {
        await nuxtApp.runWithContext(() => showError(error2));
      }
    });
    return { provide: { router } };
  }
});
function definePayloadReducer(name, reduce) {
  {
    useNuxtApp().ssrContext._payloadReducers[name] = reduce;
  }
}
const reducers = [
  ["NuxtError", (data) => isNuxtError(data) && data.toJSON()],
  ["EmptyShallowRef", (data) => isRef(data) && isShallow(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["EmptyRef", (data) => isRef(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["ShallowRef", (data) => isRef(data) && isShallow(data) && data.value],
  ["ShallowReactive", (data) => isReactive(data) && isShallow(data) && toRaw(data)],
  ["Ref", (data) => isRef(data) && data.value],
  ["Reactive", (data) => isReactive(data) && toRaw(data)]
];
const revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:revive-payload:server",
  setup() {
    for (const [reducer, fn] of reducers) {
      definePayloadReducer(reducer, fn);
    }
  }
});
const LazyProseA = defineAsyncComponent(() => import('./ProseA-C96Jfnnj.mjs').then((r) => r["default"] || r.default || r));
const LazyProseBlockquote = defineAsyncComponent(() => import('./ProseBlockquote-DcCUsqYK.mjs').then((r) => r["default"] || r.default || r));
const LazyProseCode = defineAsyncComponent(() => import('./ProseCode-DCf1S1Dn.mjs').then((r) => r["default"] || r.default || r));
const LazyProseEm = defineAsyncComponent(() => import('./ProseEm-D1ymfCZY.mjs').then((r) => r["default"] || r.default || r));
const LazyProseH1 = defineAsyncComponent(() => import('./ProseH1-y1y-y_wD.mjs').then((r) => r["default"] || r.default || r));
const LazyProseH2 = defineAsyncComponent(() => import('./ProseH2-bH8VIi8a.mjs').then((r) => r["default"] || r.default || r));
const LazyProseH3 = defineAsyncComponent(() => import('./ProseH3-fkhewHw0.mjs').then((r) => r["default"] || r.default || r));
const LazyProseH4 = defineAsyncComponent(() => import('./ProseH4-BgxaC22M.mjs').then((r) => r["default"] || r.default || r));
const LazyProseH5 = defineAsyncComponent(() => import('./ProseH5-C-9fIkZL.mjs').then((r) => r["default"] || r.default || r));
const LazyProseH6 = defineAsyncComponent(() => import('./ProseH6-CAeIWKQD.mjs').then((r) => r["default"] || r.default || r));
const LazyProseHr = defineAsyncComponent(() => import('./ProseHr-BkXUJAGh.mjs').then((r) => r["default"] || r.default || r));
const LazyProseImg = defineAsyncComponent(() => import('./ProseImg-DBbphOzI.mjs').then((r) => r["default"] || r.default || r));
const LazyProseLi = defineAsyncComponent(() => import('./ProseLi-ntggpAHL.mjs').then((r) => r["default"] || r.default || r));
const LazyProseOl = defineAsyncComponent(() => import('./ProseOl-BDOSe7ug.mjs').then((r) => r["default"] || r.default || r));
const LazyProseP = defineAsyncComponent(() => import('./ProseP-D7YXf1Nz.mjs').then((r) => r["default"] || r.default || r));
const LazyProsePre = defineAsyncComponent(() => import('./ProsePre-ByG-rB1z.mjs').then((r) => r["default"] || r.default || r));
const LazyProseScript = defineAsyncComponent(() => import('./ProseScript-DacBrTIN.mjs').then((r) => r["default"] || r.default || r));
const LazyProseStrong = defineAsyncComponent(() => import('./ProseStrong-DElHo39Z.mjs').then((r) => r["default"] || r.default || r));
const LazyProseTable = defineAsyncComponent(() => import('./ProseTable-C76OEme0.mjs').then((r) => r["default"] || r.default || r));
const LazyProseTbody = defineAsyncComponent(() => import('./ProseTbody-CVm3VFEr.mjs').then((r) => r["default"] || r.default || r));
const LazyProseTd = defineAsyncComponent(() => import('./ProseTd-CSb2L64M.mjs').then((r) => r["default"] || r.default || r));
const LazyProseTh = defineAsyncComponent(() => import('./ProseTh-04cUUJVF.mjs').then((r) => r["default"] || r.default || r));
const LazyProseThead = defineAsyncComponent(() => import('./ProseThead-DgK_rI_-.mjs').then((r) => r["default"] || r.default || r));
const LazyProseTr = defineAsyncComponent(() => import('./ProseTr-lIkHHQ-3.mjs').then((r) => r["default"] || r.default || r));
const LazyProseUl = defineAsyncComponent(() => import('./ProseUl-t54HdZ5i.mjs').then((r) => r["default"] || r.default || r));
const lazyGlobalComponents = [
  ["ProseA", LazyProseA],
  ["ProseBlockquote", LazyProseBlockquote],
  ["ProseCode", LazyProseCode],
  ["ProseEm", LazyProseEm],
  ["ProseH1", LazyProseH1],
  ["ProseH2", LazyProseH2],
  ["ProseH3", LazyProseH3],
  ["ProseH4", LazyProseH4],
  ["ProseH5", LazyProseH5],
  ["ProseH6", LazyProseH6],
  ["ProseHr", LazyProseHr],
  ["ProseImg", LazyProseImg],
  ["ProseLi", LazyProseLi],
  ["ProseOl", LazyProseOl],
  ["ProseP", LazyProseP],
  ["ProsePre", LazyProsePre],
  ["ProseScript", LazyProseScript],
  ["ProseStrong", LazyProseStrong],
  ["ProseTable", LazyProseTable],
  ["ProseTbody", LazyProseTbody],
  ["ProseTd", LazyProseTd],
  ["ProseTh", LazyProseTh],
  ["ProseThead", LazyProseThead],
  ["ProseTr", LazyProseTr],
  ["ProseUl", LazyProseUl]
];
const components_plugin_4kY4pyzJIYX99vmMAAIorFf3CnAaptHitJgf7JxiED8 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:global-components",
  setup(nuxtApp) {
    for (const [name, component] of lazyGlobalComponents) {
      nuxtApp.vueApp.component(name, component);
      nuxtApp.vueApp.component("Lazy" + name, component);
    }
  }
});
function useRequestEvent(nuxtApp) {
  nuxtApp ||= useNuxtApp();
  return nuxtApp.ssrContext?.event;
}
function useRequestFetch() {
  return useRequestEvent()?.$fetch || globalThis.$fetch;
}
const prerender_server_sqIxOBipVr4FbVMA9kqWL0wT8FPop6sKAXLVfifsJzk = /* @__PURE__ */ defineNuxtPlugin(async () => {
  {
    return;
  }
});
const plugins = [
  unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU,
  plugin,
  revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms,
  components_plugin_4kY4pyzJIYX99vmMAAIorFf3CnAaptHitJgf7JxiED8,
  prerender_server_sqIxOBipVr4FbVMA9kqWL0wT8FPop6sKAXLVfifsJzk
];
const intervalError = "[nuxt] `setInterval` should not be used on the server. Consider wrapping it with an `onNuxtReady`, `onBeforeMount` or `onMounted` lifecycle hook, or ensure you only call it in the browser by checking `false`.";
const setInterval = () => {
  console.error(intervalError);
};
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "LoadingBar",
  __ssrInlineRender: true,
  setup(__props) {
    const isLoading = ref(false);
    const progress = ref(0);
    let interval = null;
    const start = () => {
      isLoading.value = true;
      progress.value = 0;
      if (interval) clearInterval(interval);
      interval = setInterval();
    };
    const finish = () => {
      progress.value = 100;
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
      setTimeout(() => {
        isLoading.value = false;
        progress.value = 0;
      }, 300);
    };
    const nuxtApp = useNuxtApp();
    nuxtApp.hook("page:start", () => {
      start();
    });
    nuxtApp.hook("page:finish", () => {
      finish();
    });
    nuxtApp.hook("page:transition:finish", () => {
      finish();
    });
    nuxtApp.hook("vue:error", () => {
      finish();
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "fixed top-0 left-0 right-0 z-[9999] h-1 bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg transition-all duration-200",
        style: { width: unref(progress) + "%" }
      }, _attrs, {
        style: unref(isLoading) ? null : { display: "none" }
      }))} data-v-e1d94206><div class="h-full w-full bg-gradient-to-r from-blue-400 to-blue-500 opacity-50 animate-pulse" data-v-e1d94206></div></div>`);
    };
  }
});
const _export_sfc = (sfc, props2) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props2) {
    target[key] = val;
  }
  return target;
};
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props2, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/LoadingBar.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props2, ctx) : void 0;
};
const __nuxt_component_0$1 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$4, [["__scopeId", "data-v-e1d94206"]]), { __name: "LoadingBar" });
const layouts = {
  admin: defineAsyncComponent(() => import('./admin-kOjSwZ83.mjs').then((m) => m.default || m)),
  auth: defineAsyncComponent(() => import('./auth-5gVP7TYT.mjs').then((m) => m.default || m)),
  default: defineAsyncComponent(() => import('./default-eimwTuYW.mjs').then((m) => m.default || m))
};
const LayoutLoader = defineComponent({
  name: "LayoutLoader",
  inheritAttrs: false,
  props: {
    name: String,
    layoutProps: Object
  },
  setup(props2, context) {
    return () => h$2(layouts[props2.name], props2.layoutProps, context.slots);
  }
});
const nuxtLayoutProps = {
  name: {
    type: [String, Boolean, Object],
    default: null
  },
  fallback: {
    type: [String, Object],
    default: null
  }
};
const __nuxt_component_1 = defineComponent({
  name: "NuxtLayout",
  inheritAttrs: false,
  props: nuxtLayoutProps,
  setup(props2, context) {
    const nuxtApp = useNuxtApp();
    const injectedRoute = inject(PageRouteSymbol);
    const shouldUseEagerRoute = !injectedRoute || injectedRoute === useRoute();
    const route = shouldUseEagerRoute ? useRoute$1() : injectedRoute;
    const layout = computed(() => {
      let layout2 = unref(props2.name) ?? route?.meta.layout ?? "default";
      if (layout2 && !(layout2 in layouts)) {
        if (props2.fallback) {
          layout2 = unref(props2.fallback);
        }
      }
      return layout2;
    });
    const layoutRef = shallowRef();
    context.expose({ layoutRef });
    const done = nuxtApp.deferHydration();
    let lastLayout;
    return () => {
      const hasLayout = layout.value && layout.value in layouts;
      const transitionProps = route?.meta.layoutTransition ?? appLayoutTransition;
      const previouslyRenderedLayout = lastLayout;
      lastLayout = layout.value;
      return _wrapInTransition(hasLayout && transitionProps, {
        default: () => h$2(Suspense, { suspensible: true, onResolve: () => {
          nextTick(done);
        } }, {
          default: () => h$2(
            LayoutProvider,
            {
              layoutProps: mergeProps(context.attrs, { ref: layoutRef }),
              key: layout.value || void 0,
              name: layout.value,
              shouldProvide: !props2.name,
              isRenderingNewLayout: (name) => {
                return name !== previouslyRenderedLayout && name === layout.value;
              },
              hasTransition: !!transitionProps
            },
            context.slots
          )
        })
      }).default();
    };
  }
});
const LayoutProvider = defineComponent({
  name: "NuxtLayoutProvider",
  inheritAttrs: false,
  props: {
    name: {
      type: [String, Boolean]
    },
    layoutProps: {
      type: Object
    },
    hasTransition: {
      type: Boolean
    },
    shouldProvide: {
      type: Boolean
    },
    isRenderingNewLayout: {
      type: Function,
      required: true
    }
  },
  setup(props2, context) {
    const name = props2.name;
    if (props2.shouldProvide) {
      provide(LayoutMetaSymbol, {
        isCurrent: (route) => name === (route.meta.layout ?? "default")
      });
    }
    const injectedRoute = inject(PageRouteSymbol);
    const isNotWithinNuxtPage = injectedRoute && injectedRoute === useRoute();
    if (isNotWithinNuxtPage) {
      const vueRouterRoute = useRoute$1();
      const reactiveChildRoute = {};
      for (const _key in vueRouterRoute) {
        const key = _key;
        Object.defineProperty(reactiveChildRoute, key, {
          enumerable: true,
          get: () => {
            return props2.isRenderingNewLayout(props2.name) ? vueRouterRoute[key] : injectedRoute[key];
          }
        });
      }
      provide(PageRouteSymbol, shallowReactive(reactiveChildRoute));
    }
    return () => {
      if (!name || typeof name === "string" && !(name in layouts)) {
        return context.slots.default?.();
      }
      return h$2(
        LayoutLoader,
        { key: name, layoutProps: props2.layoutProps, name },
        context.slots
      );
    };
  }
});
const defineRouteProvider = (name = "RouteProvider") => defineComponent({
  name,
  props: {
    route: {
      type: Object,
      required: true
    },
    vnode: Object,
    vnodeRef: Object,
    renderKey: String,
    trackRootNodes: Boolean
  },
  setup(props2) {
    const previousKey = props2.renderKey;
    const previousRoute = props2.route;
    const route = {};
    for (const key in props2.route) {
      Object.defineProperty(route, key, {
        get: () => previousKey === props2.renderKey ? props2.route[key] : previousRoute[key],
        enumerable: true
      });
    }
    provide(PageRouteSymbol, shallowReactive(route));
    return () => {
      if (!props2.vnode) {
        return props2.vnode;
      }
      return h$2(props2.vnode, { ref: props2.vnodeRef });
    };
  }
});
const RouteProvider = defineRouteProvider();
const __nuxt_component_2 = defineComponent({
  name: "NuxtPage",
  inheritAttrs: false,
  props: {
    name: {
      type: String
    },
    transition: {
      type: [Boolean, Object],
      default: void 0
    },
    keepalive: {
      type: [Boolean, Object],
      default: void 0
    },
    route: {
      type: Object
    },
    pageKey: {
      type: [Function, String],
      default: null
    }
  },
  setup(props2, { attrs, slots, expose }) {
    const nuxtApp = useNuxtApp();
    const pageRef = ref();
    inject(PageRouteSymbol, null);
    expose({ pageRef });
    inject(LayoutMetaSymbol, null);
    nuxtApp.deferHydration();
    return () => {
      return h$2(RouterView, { name: props2.name, route: props2.route, ...attrs }, {
        default: (routeProps) => {
          return h$2(Suspense, { suspensible: true }, {
            default() {
              return h$2(RouteProvider, {
                vnode: slots.default ? normalizeSlot(slots.default, routeProps) : routeProps.Component,
                route: routeProps.route,
                vnodeRef: pageRef
              });
            }
          });
        }
      });
    };
  }
});
function normalizeSlot(slot, data) {
  const slotContent = slot(data);
  return slotContent.length === 1 ? h$2(slotContent[0]) : h$2(Fragment, void 0, slotContent);
}
const useStateKeyPrefix = "$s";
function useState(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (typeof args[0] !== "string") {
    args.unshift(autoKey);
  }
  const [_key, init] = args;
  if (!_key || typeof _key !== "string") {
    throw new TypeError("[nuxt] [useState] key must be a string: " + _key);
  }
  if (init !== void 0 && typeof init !== "function") {
    throw new Error("[nuxt] [useState] init must be a function: " + init);
  }
  const key = useStateKeyPrefix + _key;
  const nuxtApp = useNuxtApp();
  const state = toRef(nuxtApp.payload.state, key);
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
const useAppOptions = () => {
  const defaults = {
    name: "VENUE UNDIP",
    nameKet: "Sistem Reservasi Fasilitas Olahraga Universitas Diponegoro",
    description: "Platform booking lapangan olahraga terpercaya untuk Sivitas Akademika Universitas Diponegoro.",
    unitName: "UPT Layanan Seni, Budaya dan Olahraga",
    unitDesc: "Unit Pelaksana Teknis yang mengelola fasilitas seni, budaya, dan olahraga di lingkungan Universitas Diponegoro",
    email: "helpdesk@undip.ac.id",
    nohp: "+62 851 6566 0339",
    address: "Jl. Prof. Soedarto, Tembalang, Kec. Tembalang, Kota Semarang, Jawa Tengah"
  };
  const options = useState("app-options", () => ({
    data: null,
    pending: false,
    error: null
  }));
  const fetchOptions = async (force = false) => {
    if (options.value.data && !force) {
      return options.value.data;
    }
    if (options.value.pending && !force) {
      return;
    }
    options.value.pending = true;
    options.value.error = null;
    try {
      const data = await $fetch("/api/options");
      options.value.data = { ...defaults, ...data };
      return options.value.data;
    } catch (err) {
      console.error("[useAppOptions] Failed to fetch:", err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error fetching options";
      options.value.error = errorMessage;
      if (!options.value.data) {
        options.value.data = defaults;
      }
      return null;
    } finally {
      options.value.pending = false;
    }
  };
  const refresh = () => fetchOptions(true);
  const reset = () => {
    options.value = {
      data: null,
      pending: false,
      error: null
    };
  };
  return {
    options: readonly(options),
    fetchOptions,
    refresh,
    reset
  };
};
async function callOnce(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (typeof args[0] !== "string") {
    args.unshift(autoKey);
  }
  const [_key, fn, options] = args;
  if (!_key || typeof _key !== "string") {
    throw new TypeError("[nuxt] [callOnce] key must be a string: " + _key);
  }
  if (fn !== void 0 && typeof fn !== "function") {
    throw new Error("[nuxt] [callOnce] fn must be a function: " + fn);
  }
  const nuxtApp = useNuxtApp();
  if (options?.mode === "navigation") {
    let callback = function() {
      nuxtApp.payload.once.delete(_key);
      for (const cleanup of cleanups) {
        cleanup();
      }
    };
    const cleanups = [];
    cleanups.push(nuxtApp.hooks.hook("page:start", callback), useRouter().beforeResolve(callback));
  }
  if (nuxtApp.payload.once.has(_key)) {
    {
      return;
    }
  }
  nuxtApp._once ||= {};
  nuxtApp._once[_key] ||= fn() || true;
  await nuxtApp._once[_key];
  nuxtApp.payload.once.add(_key);
  delete nuxtApp._once[_key];
}
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "app",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const isHydrated = ref(false);
    const { fetchOptions, options } = useAppOptions();
    const errorDismissed = useState("app-error-dismissed", () => false);
    [__temp, __restore] = withAsyncContext(async () => callOnce(async () => {
      await fetchOptions();
    }, "$aTUEVnxcOx")), await __temp, __restore();
    if (options.value.error && !errorDismissed.value) {
      throw createError({
        statusCode: 502,
        statusMessage: "Layanan tidak tersedia. Silakan coba lagi nanti.",
        fatal: true
      });
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_LoadingBar = __nuxt_component_0$1;
      const _component_NuxtLayout = __nuxt_component_1;
      const _component_NuxtPage = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_LoadingBar, null, null, _parent));
      if (!unref(isHydrated)) {
        _push(`<div class="loading-screen"><div class="loading-content"><div class="spinner-wrapper"><div class="spinner"><div class="spinner-ring"></div><div class="spinner-ring"></div><div class="spinner-ring"></div></div></div><p class="loading-text">Memuat...</p></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_NuxtLayout, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_NuxtPage, null, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_NuxtPage)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props2, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("app.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props2, ctx) : void 0;
};
const v$1 = "5.7.1";
const fr$1 = 25;
const ip$1 = 0;
const op$1 = 125;
const w$1 = 700;
const h$1 = 400;
const nm$1 = "404-error";
const ddd$1 = 0;
const assets$1 = [];
const layers$1 = /* @__PURE__ */ JSON.parse(`[{"ddd":0,"ind":1,"ty":4,"nm":"#ground","ln":"ground","parent":22,"sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[100.5,-93.5,0],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[-193,0]],"o":[[0,0],[0,0],[193,0]],"v":[[292,84],[-283,84],[-9,98]],"c":true},"ix":2},"nm":"TracÃ© 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"fl","c":{"a":0,"k":[0,0,0,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fond 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":12,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transformer "}],"nm":"Forme 2","np":2,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0]],"o":[[0,0],[0,0]],"v":[[69.5,115.5],[177.5,115.5]],"c":false},"ix":2},"nm":"TracÃ© 6","mn":"ADBE Vector Shape - Group","hd":false},{"ind":1,"ty":"sh","ix":2,"ks":{"a":0,"k":{"i":[[0,0],[0,0]],"o":[[0,0],[0,0]],"v":[[252,102.5],[310,102.5]],"c":false},"ix":2},"nm":"TracÃ© 5","mn":"ADBE Vector Shape - Group","hd":false},{"ind":2,"ty":"sh","ix":3,"ks":{"a":0,"k":{"i":[[0,0],[0,0]],"o":[[0,0],[0,0]],"v":[[-203.5,114.5],[-169,114.5]],"c":false},"ix":2},"nm":"TracÃ© 4","mn":"ADBE Vector Shape - Group","hd":false},{"ind":3,"ty":"sh","ix":4,"ks":{"a":0,"k":{"i":[[0,0],[0,0]],"o":[[0,0],[0,0]],"v":[[157,102],[207,102]],"c":false},"ix":2},"nm":"TracÃ© 3","mn":"ADBE Vector Shape - Group","hd":false},{"ind":4,"ty":"sh","ix":5,"ks":{"a":0,"k":{"i":[[0,0],[0,0]],"o":[[0,0],[0,0]],"v":[[-293.5,96.5],[-177,96.5]],"c":false},"ix":2},"nm":"TracÃ© 2","mn":"ADBE Vector Shape - Group","hd":false},{"ind":5,"ty":"sh","ix":6,"ks":{"a":0,"k":{"i":[[0,0],[0,0]],"o":[[0,0],[0,0]],"v":[[-283,84],[292,84]],"c":false},"ix":2},"nm":"TracÃ© 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"st","c":{"a":0,"k":[0.549019607843,0.549019607843,0.549019607843,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":3,"ix":5},"lc":2,"lj":1,"ml":4,"bm":0,"nm":"Contour 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transformer "}],"nm":"Forme 1","np":7,"cix":2,"bm":0,"ix":2,"mn":"ADBE Vector Group","hd":false}],"ip":0,"op":125,"st":0,"bm":0},{"ddd":0,"ind":2,"ty":4,"nm":"#dust3","ln":"dust3","parent":22,"sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[100.5,-223.5,0],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[-70,1],[-65,-2],[-11.591,41.402],[40.352,-34.064],[-28.61,-12.383],[-66,-72]],"o":[[0,0],[70,-1],[30.936,0.952],[12.763,-45.587],[-34.443,29.076],[35.349,15.3],[66,72]],"v":[[-293,-20],[-144,79],[21,48],[135.613,-25.388],[53,-93],[67.944,-12.87],[276,78]],"c":false},"ix":2},"nm":"TracÃ© 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"st","c":{"a":0,"k":[1,1,1,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":1,"k":[{"i":{"x":[0],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":67,"s":[0]},{"i":{"x":[0.833],"y":[1]},"o":{"x":[0.467],"y":[0]},"t":76,"s":[8]},{"i":{"x":[0.833],"y":[1]},"o":{"x":[0.816],"y":[0]},"t":115,"s":[15]},{"t":123,"s":[0]}],"ix":5},"lc":2,"lj":1,"ml":4,"bm":0,"nm":"Contour 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"tm","s":{"a":0,"k":5.455,"ix":1,"x":"var $bm_rt;\\n$bm_rt = $bm_sub(content('Forme 1').content('R\\\\xe9duire les trac\\\\xe9s 1').end, 0.1);"},"e":{"a":1,"k":[{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":67,"s":[0]},{"t":123,"s":[100]}],"ix":2},"o":{"a":0,"k":0,"ix":3},"m":1,"ix":3,"nm":"RÃ©duire les tracÃ©s 1","mn":"ADBE Vector Filter - Trim","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transformer "}],"nm":"Forme 1","np":3,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":67,"op":124,"st":67,"bm":0},{"ddd":0,"ind":3,"ty":4,"nm":"#dust2","ln":"dust2","parent":22,"sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[100.5,-143.5,0],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[-70,1],[-65,-2],[-11.591,41.402],[40.352,-34.064],[-28.61,-12.383],[-66,-72]],"o":[[0,0],[70,-1],[30.936,0.952],[12.763,-45.587],[-34.443,29.076],[35.349,15.3],[66,72]],"v":[[-293,-20],[-144,79],[21,48],[135.613,-25.388],[53,-93],[67.944,-12.87],[276,78]],"c":false},"ix":2},"nm":"TracÃ© 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"st","c":{"a":0,"k":[1,1,1,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":1,"k":[{"i":{"x":[0],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":0,"s":[0]},{"i":{"x":[0.794],"y":[1]},"o":{"x":[0.372],"y":[0]},"t":9,"s":[7]},{"i":{"x":[0.833],"y":[1]},"o":{"x":[0.816],"y":[0]},"t":48,"s":[15]},{"t":56,"s":[0]}],"ix":5},"lc":2,"lj":1,"ml":4,"bm":0,"nm":"Contour 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"tm","s":{"a":0,"k":5.455,"ix":1,"x":"var $bm_rt;\\n$bm_rt = $bm_sub(content('Forme 1').content('R\\\\xe9duire les trac\\\\xe9s 1').end, 0.1);"},"e":{"a":1,"k":[{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":0,"s":[0]},{"t":56,"s":[100]}],"ix":2},"o":{"a":0,"k":0,"ix":3},"m":1,"ix":3,"nm":"RÃ©duire les tracÃ©s 1","mn":"ADBE Vector Filter - Trim","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transformer "}],"nm":"Forme 1","np":3,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":0,"op":57,"st":0,"bm":0},{"ddd":0,"ind":4,"ty":4,"nm":"#dust 2","ln":"dust","parent":22,"sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[130.5,-143.5,0],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[-40,65],[38,-20],[-65,-2],[-65,-12],[-69,-7],[0,0]],"o":[[0,0],[40,-65],[-38,20],[65,2],[65,12],[69,7],[0,0]],"v":[[-293,-20],[-128,-79],[-181,-151],[-116,-19],[53,-93],[194,-8],[311,-45]],"c":false},"ix":2},"nm":"TracÃ© 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"st","c":{"a":0,"k":[0.313725490196,0.313725490196,0.313725490196,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":1,"k":[{"i":{"x":[0],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":40,"s":[0]},{"i":{"x":[0.833],"y":[1]},"o":{"x":[0.467],"y":[0]},"t":49,"s":[15]},{"i":{"x":[0.833],"y":[1]},"o":{"x":[0.816],"y":[0]},"t":88,"s":[11]},{"t":96,"s":[0]}],"ix":5},"lc":2,"lj":1,"ml":4,"bm":0,"nm":"Contour 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"tm","s":{"a":0,"k":5.455,"ix":1,"x":"var $bm_rt;\\n$bm_rt = $bm_sub(content('Forme 1').content('R\\\\xe9duire les trac\\\\xe9s 1').end, 0.1);"},"e":{"a":1,"k":[{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":40,"s":[0]},{"t":96,"s":[100]}],"ix":2},"o":{"a":0,"k":0,"ix":3},"m":1,"ix":3,"nm":"RÃ©duire les tracÃ©s 1","mn":"ADBE Vector Filter - Trim","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transformer "}],"nm":"Forme 1","np":3,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":40,"op":97,"st":40,"bm":0},{"ddd":0,"ind":5,"ty":4,"nm":"#dust","ln":"dust","parent":22,"sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[100.5,-93.5,0],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[-40,65],[38,-20],[-65,-2],[-65,-12],[-69,-7],[0,0]],"o":[[0,0],[40,-65],[-38,20],[65,2],[65,12],[69,7],[0,0]],"v":[[-293,-20],[-128,-79],[-181,-151],[-116,-19],[53,-93],[194,-8],[311,-45]],"c":false},"ix":2},"nm":"TracÃ© 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"st","c":{"a":0,"k":[0.313725490196,0.313725490196,0.313725490196,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":1,"k":[{"i":{"x":[0],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":12,"s":[0]},{"i":{"x":[0.833],"y":[1]},"o":{"x":[0.467],"y":[0]},"t":21,"s":[5]},{"i":{"x":[0.833],"y":[1]},"o":{"x":[0.816],"y":[0]},"t":60,"s":[15]},{"t":68,"s":[0]}],"ix":5},"lc":2,"lj":1,"ml":4,"bm":0,"nm":"Contour 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"tm","s":{"a":0,"k":5.455,"ix":1,"x":"var $bm_rt;\\n$bm_rt = $bm_sub(content('Forme 1').content('R\\\\xe9duire les trac\\\\xe9s 1').end, 0.1);"},"e":{"a":1,"k":[{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":12,"s":[0]},{"t":68,"s":[100]}],"ix":2},"o":{"a":0,"k":0,"ix":3},"m":1,"ix":3,"nm":"RÃ©duire les tracÃ©s 1","mn":"ADBE Vector Filter - Trim","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transformer "}],"nm":"Forme 1","np":3,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":12,"op":69,"st":12,"bm":0},{"ddd":0,"ind":6,"ty":4,"nm":"#page","ln":"page","parent":22,"sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[100.5,-93.5,0],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"hasMask":true,"masksProperties":[{"inv":false,"mode":"s","pt":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0]],"v":[[402,85],[-336,85],[-336,247],[402,247]],"c":true},"ix":1},"o":{"a":0,"k":100,"ix":3},"x":{"a":0,"k":0,"ix":4},"nm":"Masque 1"}],"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0]],"v":[[16.25,-132],[13.383,-131.312],[11.905,-125.813],[12,157.5]],"c":false},"ix":2},"nm":"TracÃ© 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"tm","s":{"a":1,"k":[{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.167],"y":[0]},"t":69,"s":[0]},{"i":{"x":[1],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":94,"s":[3]},{"t":106,"s":[100]}],"ix":1},"e":{"a":0,"k":100,"ix":2,"x":"var $bm_rt;\\n$bm_rt = $bm_sum(content('Forme 2').content('R\\\\xe9duire les trac\\\\xe9s 1').start, 0.1);"},"o":{"a":0,"k":0,"ix":3},"m":1,"ix":2,"nm":"RÃ©duire les tracÃ©s 1","mn":"ADBE Vector Filter - Trim","hd":false},{"ty":"st","c":{"a":0,"k":[0.414963456696,0.663659069585,0.874509803922,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":1,"k":[{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":69,"s":[0]},{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":90,"s":[5]},{"t":100,"s":[8]}],"ix":5},"lc":2,"lj":1,"ml":4,"bm":0,"nm":"Contour 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transformer "}],"nm":"Forme 2","np":3,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0]],"v":[[16.25,-132],[13.383,-131.312],[11.905,-125.813],[12,157.5]],"c":false},"ix":2},"nm":"TracÃ© 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"tm","s":{"a":1,"k":[{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.167],"y":[0]},"t":13,"s":[0]},{"i":{"x":[1],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":38,"s":[3]},{"t":50,"s":[100]}],"ix":1},"e":{"a":0,"k":100,"ix":2,"x":"var $bm_rt;\\n$bm_rt = $bm_sum(content('Forme 1').content('R\\\\xe9duire les trac\\\\xe9s 1').start, 0.1);"},"o":{"a":0,"k":0,"ix":3},"m":1,"ix":2,"nm":"RÃ©duire les tracÃ©s 1","mn":"ADBE Vector Filter - Trim","hd":false},{"ty":"st","c":{"a":0,"k":[0.414963456696,0.663659069585,0.874509803922,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":1,"k":[{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":13,"s":[0]},{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":34,"s":[5]},{"t":44,"s":[8]}],"ix":5},"lc":2,"lj":1,"ml":4,"bm":0,"nm":"Contour 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transformer "}],"nm":"Forme 1","np":3,"cix":2,"bm":0,"ix":2,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[-1.125,-7.875]],"o":[[0,0],[1.125,7.875]],"v":[[14.375,-121.125],[28,-120.125]],"c":false},"ix":2},"nm":"TracÃ© 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"st","c":{"a":0,"k":[0.549019607843,0.549019607843,0.549019607843,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":2,"ix":5},"lc":2,"lj":1,"ml":4,"bm":0,"nm":"Contour 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transformer "}],"nm":"mouth","np":2,"cix":2,"bm":0,"ix":3,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":1,"k":[{"i":{"x":0.667,"y":1},"o":{"x":0.333,"y":0},"t":0,"s":[{"i":[[0,0],[-5.043,0.672]],"o":[[0,0],[5.043,-0.672]],"v":[[8.363,-146.657],[17.04,-144.078]],"c":false}]},{"i":{"x":0.667,"y":1},"o":{"x":0.333,"y":0},"t":12.333,"s":[{"i":[[0,0],[-4.635,2.748]],"o":[[0,0],[4.376,-2.594]],"v":[[8.305,-147.345],[16.982,-144.766]],"c":false}]},{"i":{"x":0.667,"y":1},"o":{"x":0.333,"y":0},"t":26.359,"s":[{"i":[[0,0],[-5.043,0.672]],"o":[[0,0],[5.043,-0.672]],"v":[[8.363,-146.657],[17.04,-144.078]],"c":false}]},{"i":{"x":0.667,"y":1},"o":{"x":0.333,"y":0},"t":40.386,"s":[{"i":[[0,0],[-4.635,2.748]],"o":[[0,0],[4.376,-2.594]],"v":[[8.305,-147.345],[16.982,-144.766]],"c":false}]},{"i":{"x":0.667,"y":1},"o":{"x":0.333,"y":0},"t":54.412,"s":[{"i":[[0,0],[-5.043,0.672]],"o":[[0,0],[5.043,-0.672]],"v":[[8.363,-146.657],[17.04,-144.078]],"c":false}]},{"i":{"x":0.667,"y":1},"o":{"x":0.333,"y":0},"t":68.921,"s":[{"i":[[0,0],[-4.635,2.748]],"o":[[0,0],[4.376,-2.594]],"v":[[8.305,-147.345],[16.982,-144.766]],"c":false}]},{"i":{"x":0.667,"y":1},"o":{"x":0.333,"y":0},"t":82.947,"s":[{"i":[[0,0],[-5.043,0.672]],"o":[[0,0],[5.043,-0.672]],"v":[[8.363,-146.657],[17.04,-144.078]],"c":false}]},{"i":{"x":0.667,"y":1},"o":{"x":0.333,"y":0},"t":96.974,"s":[{"i":[[0,0],[-4.635,2.748]],"o":[[0,0],[4.376,-2.594]],"v":[[8.305,-147.345],[16.982,-144.766]],"c":false}]},{"i":{"x":0.667,"y":1},"o":{"x":0.333,"y":0},"t":111,"s":[{"i":[[0,0],[-5.043,0.672]],"o":[[0,0],[5.043,-0.672]],"v":[[8.363,-146.657],[17.04,-144.078]],"c":false}]},{"t":124,"s":[{"i":[[0,0],[-5.043,0.672]],"o":[[0,0],[5.043,-0.672]],"v":[[8.363,-146.657],[17.04,-144.078]],"c":false}]}],"ix":2},"nm":"TracÃ© 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"st","c":{"a":0,"k":[0.549019607843,0.549019607843,0.549019607843,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":2,"ix":5},"lc":2,"lj":1,"ml":4,"bm":0,"nm":"Contour 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"fl","c":{"a":0,"k":[1,0.996078431373,0.996078431373,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fond 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transformer "}],"nm":"Forme 1","np":3,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"d":1,"ty":"el","s":{"a":0,"k":[3,3],"ix":2},"p":{"a":0,"k":[0,0],"ix":3},"nm":"TracÃ© d'ellipse 1","mn":"ADBE Vector Shape - Ellipse","hd":false},{"ty":"fl","c":{"a":0,"k":[1,0.996078431373,0.996078431373,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fond 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[13.125,-138.25],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transformer "}],"nm":"Ellipse 2","np":2,"cix":2,"bm":0,"ix":2,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"d":1,"ty":"el","s":{"a":0,"k":[5,8],"ix":2},"p":{"a":0,"k":[0,0],"ix":3},"nm":"TracÃ© d'ellipse 1","mn":"ADBE Vector Shape - Ellipse","hd":false},{"ty":"fl","c":{"a":0,"k":[0.337254901961,0.337254901961,0.337254901961,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fond 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[12.5,-137],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transformer "}],"nm":"Ellipse 1","np":2,"cix":2,"bm":0,"ix":3,"mn":"ADBE Vector Group","hd":false},{"ty":"tr","p":{"a":0,"k":[33.125,-136.875],"ix":2},"a":{"a":0,"k":[13.125,-140.125],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":10,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transformer "}],"nm":"eyes right","np":3,"cix":2,"bm":0,"ix":4,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":1,"k":[{"i":{"x":0.667,"y":1},"o":{"x":0.333,"y":0},"t":0,"s":[{"i":[[0,0],[-2.625,3.875]],"o":[[0,0],[2.625,-3.875]],"v":[[8.5,-143],[17.75,-147.25]],"c":false}]},{"i":{"x":0.667,"y":1},"o":{"x":0.333,"y":0},"t":12.333,"s":[{"i":[[0,0],[-1.739,5.855]],"o":[[0,0],[1.333,-4.487]],"v":[[8.442,-143.688],[17.692,-147.938]],"c":false}]},{"i":{"x":0.667,"y":1},"o":{"x":0.333,"y":0},"t":26.359,"s":[{"i":[[0,0],[-2.625,3.875]],"o":[[0,0],[2.625,-3.875]],"v":[[8.5,-143],[17.75,-147.25]],"c":false}]},{"i":{"x":0.667,"y":1},"o":{"x":0.333,"y":0},"t":40.386,"s":[{"i":[[0,0],[-1.739,5.855]],"o":[[0,0],[1.333,-4.487]],"v":[[8.442,-143.688],[17.692,-147.938]],"c":false}]},{"i":{"x":0.667,"y":1},"o":{"x":0.333,"y":0},"t":54.412,"s":[{"i":[[0,0],[-2.625,3.875]],"o":[[0,0],[2.625,-3.875]],"v":[[8.5,-143],[17.75,-147.25]],"c":false}]},{"i":{"x":0.667,"y":1},"o":{"x":0.333,"y":0},"t":68.921,"s":[{"i":[[0,0],[-1.739,5.855]],"o":[[0,0],[1.333,-4.487]],"v":[[8.442,-143.688],[17.692,-147.938]],"c":false}]},{"i":{"x":0.667,"y":1},"o":{"x":0.333,"y":0},"t":82.947,"s":[{"i":[[0,0],[-2.625,3.875]],"o":[[0,0],[2.625,-3.875]],"v":[[8.5,-143],[17.75,-147.25]],"c":false}]},{"i":{"x":0.667,"y":1},"o":{"x":0.333,"y":0},"t":96.974,"s":[{"i":[[0,0],[-1.739,5.855]],"o":[[0,0],[1.333,-4.487]],"v":[[8.442,-143.688],[17.692,-147.938]],"c":false}]},{"i":{"x":0.667,"y":1},"o":{"x":0.333,"y":0},"t":111,"s":[{"i":[[0,0],[-2.625,3.875]],"o":[[0,0],[2.625,-3.875]],"v":[[8.5,-143],[17.75,-147.25]],"c":false}]},{"t":124,"s":[{"i":[[0,0],[-2.625,3.875]],"o":[[0,0],[2.625,-3.875]],"v":[[8.5,-143],[17.75,-147.25]],"c":false}]}],"ix":2},"nm":"TracÃ© 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"st","c":{"a":0,"k":[0.549019607843,0.549019607843,0.549019607843,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":2,"ix":5},"lc":2,"lj":1,"ml":4,"bm":0,"nm":"Contour 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"fl","c":{"a":0,"k":[1,0.996078431373,0.996078431373,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fond 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transformer "}],"nm":"Forme 1","np":3,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"d":1,"ty":"el","s":{"a":0,"k":[3,3],"ix":2},"p":{"a":0,"k":[0,0],"ix":3},"nm":"TracÃ© d'ellipse 1","mn":"ADBE Vector Shape - Ellipse","hd":false},{"ty":"fl","c":{"a":0,"k":[1,0.996078431373,0.996078431373,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fond 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[13.125,-138.25],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transformer "}],"nm":"Ellipse 2","np":2,"cix":2,"bm":0,"ix":2,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"d":1,"ty":"el","s":{"a":0,"k":[5,8],"ix":2},"p":{"a":0,"k":[0,0],"ix":3},"nm":"TracÃ© d'ellipse 1","mn":"ADBE Vector Shape - Ellipse","hd":false},{"ty":"fl","c":{"a":0,"k":[0.337254901961,0.337254901961,0.337254901961,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fond 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[12.5,-137],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transformer "}],"nm":"Ellipse 1","np":2,"cix":2,"bm":0,"ix":3,"mn":"ADBE Vector Group","hd":false},{"ty":"tr","p":{"a":0,"k":[15.625,-138.875],"ix":2},"a":{"a":0,"k":[13.125,-140.125],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":10,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transformer "}],"nm":"eyes left","np":3,"cix":2,"bm":0,"ix":5,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[-2.875,0.875],[-15,-1.75]],"o":[[2.875,-0.875],[13.306,1.552]],"v":[[-3,-99.375],[20.875,-99.375]],"c":false},"ix":2},"nm":"TracÃ© 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"st","c":{"a":0,"k":[0.549019607843,0.549019607843,0.549019607843,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":2,"ix":5},"lc":2,"lj":1,"ml":4,"bm":0,"nm":"Contour 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transformer "}],"nm":"plis","np":2,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":1,"k":[{"i":{"x":0.667,"y":1},"o":{"x":0.333,"y":0},"t":0,"s":[{"i":[[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0]],"v":[[-3.5,-150.625],[8.875,-147.625],[8,-161.5]],"c":false}]},{"i":{"x":0.667,"y":1},"o":{"x":0.333,"y":0},"t":25,"s":[{"i":[[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0]],"v":[[-3.5,-150.625],[11.625,-151],[8,-161.5]],"c":false}]},{"i":{"x":0.667,"y":1},"o":{"x":0.333,"y":0},"t":50,"s":[{"i":[[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0]],"v":[[-3.5,-150.625],[8.875,-148.25],[8,-161.5]],"c":false}]},{"i":{"x":0.667,"y":1},"o":{"x":0.333,"y":0},"t":75,"s":[{"i":[[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0]],"v":[[-3.5,-150.625],[11.75,-151],[8,-161.5]],"c":false}]},{"i":{"x":0.667,"y":1},"o":{"x":0.333,"y":0},"t":100,"s":[{"i":[[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0]],"v":[[-3.5,-150.625],[8.75,-147.375],[8,-161.5]],"c":false}]},{"t":124,"s":[{"i":[[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0]],"v":[[-3.5,-150.625],[8.875,-147.625],[8,-161.5]],"c":false}]}],"ix":2},"nm":"TracÃ© 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"st","c":{"a":0,"k":[0.549019607843,0.549019607843,0.549019607843,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":3,"ix":5},"lc":2,"lj":2,"bm":0,"nm":"Contour 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transformer "}],"nm":"angle","np":2,"cix":2,"bm":0,"ix":2,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":1,"k":[{"i":{"x":0.667,"y":1},"o":{"x":0.333,"y":0},"t":0,"s":[{"i":[[0,0],[0,0],[0,0],[-7.5,-15],[-14.5,-2],[0,0],[-7.688,16.696],[-8.292,3.252],[10.125,0.776]],"o":[[0,0],[0,0],[0,0],[24.5,-4.5],[-1,-14],[0,0],[3.705,-8.046],[-12.384,-4.911],[-13.587,-1.042]],"v":[[7.5,-162],[-4.5,-152],[-13.5,-97],[1,-84],[52,-81.5],[40.5,-98.5],[47.96,-136.143],[65.5,-154.5],[30.607,-162.271]],"c":true}]},{"i":{"x":0.667,"y":1},"o":{"x":0.333,"y":0},"t":25,"s":[{"i":[[0,0],[0,0],[0,0],[-7.5,-15],[-14.5,-2],[0,0],[-7.688,16.696],[-8.875,0.875],[10.125,0.776]],"o":[[0,0],[0,0],[0,0],[24.5,-4.5],[-1,-14],[0,0],[3.705,-8.046],[-9.625,-9.5],[-13.587,-1.042]],"v":[[7.5,-162],[-4.5,-152],[-13.5,-97],[1,-84],[52,-81.5],[40.5,-98.5],[47.96,-136.143],[63.75,-147.875],[29.607,-159.771]],"c":true}]},{"i":{"x":0.667,"y":1},"o":{"x":0.333,"y":0},"t":49,"s":[{"i":[[0,0],[0,0],[0,0],[-7.5,-15],[-14.5,-2],[0,0],[-7.688,16.696],[-1.924,4.606],[10.125,0.776]],"o":[[0,0],[0,0],[0,0],[24.5,-4.5],[-1,-14],[0,0],[3.705,-8.046],[-12.049,3.356],[-13.587,-1.042]],"v":[[7.5,-162],[-4.5,-152],[-13.5,-97],[1,-84],[52,-81.5],[40.5,-98.5],[47.96,-136.143],[60.799,-161.356],[29.107,-163.771]],"c":true}]},{"i":{"x":0.667,"y":1},"o":{"x":0.333,"y":0},"t":71,"s":[{"i":[[0,0],[0,0],[0,0],[-7.5,-15],[-14.5,-2],[0,0],[-7.688,16.696],[-8.875,0.875],[10.125,0.776]],"o":[[0,0],[0,0],[0,0],[24.5,-4.5],[-1,-14],[0,0],[3.705,-8.046],[-9.625,-9.5],[-13.587,-1.042]],"v":[[7.5,-162],[-4.5,-152],[-13.5,-97],[1,-84],[52,-81.5],[40.5,-98.5],[47.96,-136.143],[63.75,-147.875],[30.107,-160.271]],"c":true}]},{"i":{"x":0.667,"y":1},"o":{"x":0.333,"y":0},"t":95,"s":[{"i":[[0,0],[0,0],[0,0],[-7.5,-15],[-14.5,-2],[0,0],[-7.688,16.696],[-1.924,4.606],[10.125,0.776]],"o":[[0,0],[0,0],[0,0],[24.5,-4.5],[-1,-14],[0,0],[3.705,-8.046],[-12.049,3.356],[-13.587,-1.042]],"v":[[7.5,-162],[-4.5,-152],[-13.5,-97],[1,-84],[52,-81.5],[40.5,-98.5],[47.96,-136.143],[60.799,-161.356],[30.607,-162.271]],"c":true}]},{"t":124,"s":[{"i":[[0,0],[0,0],[0,0],[-7.5,-15],[-14.5,-2],[0,0],[-7.688,16.696],[-8.292,3.252],[10.125,0.776]],"o":[[0,0],[0,0],[0,0],[24.5,-4.5],[-1,-14],[0,0],[3.705,-8.046],[-12.384,-4.911],[-13.587,-1.042]],"v":[[7.5,-162],[-4.5,-152],[-13.5,-97],[1,-84],[52,-81.5],[40.5,-98.5],[47.96,-136.143],[65.5,-154.5],[30.607,-162.271]],"c":true}]}],"ix":2},"nm":"TracÃ© 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"st","c":{"a":0,"k":[0.549019607843,0.549019607843,0.549019607843,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":3,"ix":5},"lc":2,"lj":2,"bm":0,"nm":"Contour 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"fl","c":{"a":0,"k":[1,1,1,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fond 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transformer "}],"nm":"corp","np":3,"cix":2,"bm":0,"ix":3,"mn":"ADBE Vector Group","hd":false},{"ty":"tr","p":{"a":0,"k":[26,-122.087],"ix":2},"a":{"a":0,"k":[26,-122.087],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transformer "}],"nm":"body","np":3,"cix":2,"bm":0,"ix":6,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[2.125,-10],[0,0]],"o":[[0,0],[5,0.125],[0,0]],"v":[[1.75,-86.5],[4.375,-70.25],[12.375,-69.625]],"c":false},"ix":2},"nm":"TracÃ© 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"st","c":{"a":0,"k":[0,0,0,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":3,"ix":5},"lc":2,"lj":1,"ml":4,"bm":0,"nm":"Contour 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"tr","p":{"a":0,"k":[50.688,-82.625],"ix":2},"a":{"a":0,"k":[2.563,-85.188],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":1,"k":[{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":0,"s":[0]},{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":29,"s":[25]},{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":59,"s":[-29.222]},{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":95,"s":[25]},{"t":124,"s":[0]}],"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transformer "}],"nm":"foot 2","np":2,"cix":2,"bm":0,"ix":7,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[2.125,-10],[0,0]],"o":[[0,0],[5,0.125],[0,0]],"v":[[1.75,-86.5],[4.375,-70.25],[12.375,-69.625]],"c":false},"ix":2},"nm":"TracÃ© 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"st","c":{"a":0,"k":[0,0,0,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":3,"ix":5},"lc":2,"lj":1,"ml":4,"bm":0,"nm":"Contour 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"tr","p":{"a":0,"k":[2.563,-85.188],"ix":2},"a":{"a":0,"k":[2.563,-85.188],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":1,"k":[{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":0,"s":[0]},{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":29,"s":[-36]},{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":59,"s":[10.6]},{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":95,"s":[-36]},{"t":124,"s":[0]}],"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transformer "}],"nm":"foot","np":2,"cix":2,"bm":0,"ix":8,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[3,-23.25]],"o":[[0,0],[-2.788,21.607]],"v":[[-3,-131.25],[-27,-87.5]],"c":false},"ix":2},"nm":"TracÃ© 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"st","c":{"a":0,"k":[0,0,0,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":3,"ix":5},"lc":2,"lj":1,"ml":4,"bm":0,"nm":"Contour 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transformer "}],"nm":"Forme 1","np":2,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"d":1,"ty":"el","s":{"a":0,"k":[8,8],"ix":2},"p":{"a":0,"k":[0,0],"ix":3},"nm":"TracÃ© d'ellipse 1","mn":"ADBE Vector Shape - Ellipse","hd":false},{"ty":"fl","c":{"a":0,"k":[0,0,0,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fond 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[-27.25,-86],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transformer "}],"nm":"Ellipse 1","np":2,"cix":2,"bm":0,"ix":2,"mn":"ADBE Vector Group","hd":false},{"ty":"tr","p":{"a":0,"k":[52.875,-107.875],"ix":2},"a":{"a":0,"k":[52.875,-107.875],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transformer "}],"nm":"arm 2","np":2,"cix":2,"bm":0,"ix":9,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[3,-23.25]],"o":[[0,0],[-2.788,21.607]],"v":[[44,-133.75],[57.5,-87]],"c":false},"ix":2},"nm":"TracÃ© 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"st","c":{"a":0,"k":[0,0,0,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":3,"ix":5},"lc":2,"lj":1,"ml":4,"bm":0,"nm":"Contour 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transformer "}],"nm":"Forme 1","np":2,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"d":1,"ty":"el","s":{"a":0,"k":[8,8],"ix":2},"p":{"a":0,"k":[0,0],"ix":3},"nm":"TracÃ© d'ellipse 1","mn":"ADBE Vector Shape - Ellipse","hd":false},{"ty":"fl","c":{"a":0,"k":[0,0,0,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fond 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[57.75,-86],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transformer "}],"nm":"Ellipse 1","np":2,"cix":2,"bm":0,"ix":2,"mn":"ADBE Vector Group","hd":false},{"ty":"tr","p":{"a":0,"k":[52.875,-107.875],"ix":2},"a":{"a":0,"k":[52.875,-107.875],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transformer "}],"nm":"arm","np":2,"cix":2,"bm":0,"ix":10,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[3.625,-6.75],[0,0]],"o":[[0,0],[0,0],[45.75,-3.625],[0,0]],"v":[[35.625,-97.75],[-12.75,-97.125],[-8.5,-78.625],[46.125,-77.25]],"c":true},"ix":2},"nm":"TracÃ© 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"fl","c":{"a":0,"k":[0,0,0,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fond 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":17,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transformer "}],"nm":"shadow","np":2,"cix":2,"bm":0,"ix":11,"mn":"ADBE Vector Group","hd":false}],"ip":0,"op":125,"st":0,"bm":0},{"ddd":0,"ind":7,"ty":4,"nm":"#wind5","ln":"wind5","parent":22,"sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[290.5,-73.5,0],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0]],"o":[[0,0],[0,0]],"v":[[-256,-130],[60,-130]],"c":false},"ix":2},"nm":"TracÃ© 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"st","c":{"a":0,"k":[1,1,1,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":3,"ix":5},"lc":1,"lj":1,"ml":4,"bm":0,"nm":"Contour 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transformer "}],"nm":"Forme 1","np":2,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false},{"ty":"tm","s":{"a":1,"k":[{"i":{"x":[0],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":112,"s":[0]},{"t":125,"s":[100]}],"ix":1},"e":{"a":1,"k":[{"i":{"x":[0.197],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":104,"s":[0]},{"t":125,"s":[100]}],"ix":2},"o":{"a":0,"k":0,"ix":3},"m":1,"ix":2,"nm":"RÃ©duire les tracÃ©s 1","mn":"ADBE Vector Filter - Trim","hd":false}],"ip":104,"op":125,"st":104,"bm":0},{"ddd":0,"ind":8,"ty":4,"nm":"#wind4","ln":"wind4","parent":22,"sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[100.5,-133.5,0],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0]],"o":[[0,0],[0,0]],"v":[[-256,-130],[60,-130]],"c":false},"ix":2},"nm":"TracÃ© 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"st","c":{"a":0,"k":[1,1,1,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":3,"ix":5},"lc":1,"lj":1,"ml":4,"bm":0,"nm":"Contour 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transformer "}],"nm":"Forme 1","np":2,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false},{"ty":"tm","s":{"a":1,"k":[{"i":{"x":[0],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":81,"s":[0]},{"t":94,"s":[100]}],"ix":1},"e":{"a":1,"k":[{"i":{"x":[0.197],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":73,"s":[0]},{"t":94,"s":[100]}],"ix":2},"o":{"a":0,"k":0,"ix":3},"m":1,"ix":2,"nm":"RÃ©duire les tracÃ©s 1","mn":"ADBE Vector Filter - Trim","hd":false}],"ip":73,"op":94,"st":73,"bm":0},{"ddd":0,"ind":10,"ty":4,"nm":"#wind 5","ln":"wind","parent":22,"sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[100.5,6.5,0],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0]],"o":[[0,0],[0,0]],"v":[[-256,-130],[270,-130]],"c":false},"ix":2},"nm":"TracÃ© 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"st","c":{"a":0,"k":[0.717647058824,0.717647058824,0.717647058824,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":3,"ix":5},"lc":1,"lj":1,"ml":4,"bm":0,"nm":"Contour 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transformer "}],"nm":"Forme 1","np":2,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false},{"ty":"tm","s":{"a":1,"k":[{"i":{"x":[0],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":88,"s":[0]},{"t":105,"s":[100]}],"ix":1},"e":{"a":1,"k":[{"i":{"x":[0.197],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":80,"s":[0]},{"t":105,"s":[100]}],"ix":2},"o":{"a":0,"k":0,"ix":3},"m":1,"ix":2,"nm":"RÃ©duire les tracÃ©s 1","mn":"ADBE Vector Filter - Trim","hd":false}],"ip":80,"op":106,"st":80,"bm":0},{"ddd":0,"ind":12,"ty":4,"nm":"#wind3","ln":"wind3","parent":22,"sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[290.5,-73.5,0],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0]],"o":[[0,0],[0,0]],"v":[[-256,-130],[60,-130]],"c":false},"ix":2},"nm":"TracÃ© 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"st","c":{"a":0,"k":[1,1,1,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":3,"ix":5},"lc":1,"lj":1,"ml":4,"bm":0,"nm":"Contour 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transformer "}],"nm":"Forme 1","np":2,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false},{"ty":"tm","s":{"a":1,"k":[{"i":{"x":[0],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":54,"s":[0]},{"t":67,"s":[100]}],"ix":1},"e":{"a":1,"k":[{"i":{"x":[0.197],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":46,"s":[0]},{"t":67,"s":[100]}],"ix":2},"o":{"a":0,"k":0,"ix":3},"m":1,"ix":2,"nm":"RÃ©duire les tracÃ©s 1","mn":"ADBE Vector Filter - Trim","hd":false}],"ip":46,"op":67,"st":46,"bm":0},{"ddd":0,"ind":14,"ty":4,"nm":"#wind 3","ln":"wind","parent":22,"sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[100.5,-143.5,0],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0]],"o":[[0,0],[0,0]],"v":[[-107,-130],[270,-130]],"c":false},"ix":2},"nm":"TracÃ© 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"st","c":{"a":0,"k":[0.717647058824,0.717647058824,0.717647058824,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":3,"ix":5},"lc":1,"lj":1,"ml":4,"bm":0,"nm":"Contour 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transformer "}],"nm":"Forme 1","np":2,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false},{"ty":"tm","s":{"a":1,"k":[{"i":{"x":[0],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":28,"s":[0]},{"t":45,"s":[100]}],"ix":1},"e":{"a":1,"k":[{"i":{"x":[0.197],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":20,"s":[0]},{"t":45,"s":[100]}],"ix":2},"o":{"a":0,"k":0,"ix":3},"m":1,"ix":2,"nm":"RÃ©duire les tracÃ©s 1","mn":"ADBE Vector Filter - Trim","hd":false}],"ip":20,"op":46,"st":20,"bm":0},{"ddd":0,"ind":15,"ty":4,"nm":"#wind 2","ln":"wind","parent":22,"sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[100.5,6.5,0],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0]],"o":[[0,0],[0,0]],"v":[[-256,-130],[270,-130]],"c":false},"ix":2},"nm":"TracÃ© 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"st","c":{"a":0,"k":[0.717647058824,0.717647058824,0.717647058824,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":3,"ix":5},"lc":1,"lj":1,"ml":4,"bm":0,"nm":"Contour 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transformer "}],"nm":"Forme 1","np":2,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false},{"ty":"tm","s":{"a":1,"k":[{"i":{"x":[0],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":45,"s":[0]},{"t":62,"s":[100]}],"ix":1},"e":{"a":1,"k":[{"i":{"x":[0.197],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":37,"s":[0]},{"t":62,"s":[100]}],"ix":2},"o":{"a":0,"k":0,"ix":3},"m":1,"ix":2,"nm":"RÃ©duire les tracÃ©s 1","mn":"ADBE Vector Filter - Trim","hd":false}],"ip":37,"op":63,"st":37,"bm":0},{"ddd":0,"ind":17,"ty":4,"nm":"shadow","parent":22,"sr":1,"ks":{"o":{"a":0,"k":10,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[202,14.5,0],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"hasMask":true,"masksProperties":[{"inv":false,"mode":"s","pt":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0]],"v":[[212.5,-24],[-26,-24],[-26,39],[212.5,39]],"c":true},"ix":1},"o":{"a":0,"k":100,"ix":3},"x":{"a":0,"k":0,"ix":4},"nm":"Masque 1"},{"inv":false,"mode":"s","pt":{"a":0,"k":{"i":[[0,0],[37,-26.5],[10.5,-14.5],[0,0],[0,0],[0,0]],"o":[[0,0],[-37,26.5],[-10.5,14.5],[0,0],[0,0],[0,0]],"v":[[155,-235.5],[60.5,-229.5],[-2.5,-122.5],[-26.5,-52],[48.5,-35],[158,-41.5]],"c":true},"ix":1},"o":{"a":0,"k":100,"ix":3},"x":{"a":0,"k":0,"ix":4},"nm":"Masque 2"}],"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"v":[[139.106,-212.883],[91.222,-212.883],[91.222,-212.457],[8.383,-79.176],[11.225,-49.906],[91.222,-49.906],[91.222,-6],[139.106,-6],[139.106,-49.906],[160.135,-49.906],[160.135,-86.849],[139.106,-86.849]],"c":true},"ix":2},"nm":"4","mn":"ADBE Vector Shape - Group","hd":false},{"ind":1,"ty":"sh","ix":2,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0]],"v":[[88.238,-145.674],[91.222,-150.505],[91.222,-86.849],[53.994,-86.849]],"c":true},"ix":2},"nm":"4","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"mm","mm":1,"nm":"Fusionner les tracÃ©s 1","mn":"ADBE Vector Filter - Merge","hd":false},{"ty":"fl","c":{"a":0,"k":[0,0,0,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fond 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[58.5,3],"ix":2},"a":{"a":0,"k":[91.327,-6.373],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":9,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transformer "}],"nm":"4","np":4,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":0,"op":125,"st":0,"bm":0},{"ddd":0,"ind":18,"ty":4,"nm":"#4last","ln":"4last","parent":22,"sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[202,14.5,0],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"hasMask":true,"masksProperties":[{"inv":false,"mode":"s","pt":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0]],"v":[[212.5,-24],[-26,-24],[-26,39],[212.5,39]],"c":true},"ix":1},"o":{"a":0,"k":100,"ix":3},"x":{"a":0,"k":0,"ix":4},"nm":"Masque 1"}],"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"v":[[139.106,-212.883],[91.222,-212.883],[91.222,-212.457],[8.383,-79.176],[11.225,-49.906],[91.222,-49.906],[91.222,-6],[139.106,-6],[139.106,-49.906],[160.135,-49.906],[160.135,-86.849],[139.106,-86.849]],"c":true},"ix":2},"nm":"4","mn":"ADBE Vector Shape - Group","hd":false},{"ind":1,"ty":"sh","ix":2,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0]],"v":[[88.238,-145.674],[91.222,-150.505],[91.222,-86.849],[53.994,-86.849]],"c":true},"ix":2},"nm":"4","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"mm","mm":1,"nm":"Fusionner les tracÃ©s 1","mn":"ADBE Vector Filter - Merge","hd":false},{"ty":"fl","c":{"a":0,"k":[0.549019607843,0.549019607843,0.549019607843,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fond 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[58.5,3],"ix":2},"a":{"a":0,"k":[91.327,-6.373],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":9,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transformer "}],"nm":"4","np":4,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":0,"op":125,"st":0,"bm":0},{"ddd":0,"ind":19,"ty":4,"nm":"shadow","parent":22,"sr":1,"ks":{"o":{"a":0,"k":10,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[-126,14.5,0],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"hasMask":true,"masksProperties":[{"inv":false,"mode":"s","pt":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0]],"v":[[212.5,-24],[-26,-24],[-26,39],[212.5,39]],"c":true},"ix":1},"o":{"a":0,"k":100,"ix":3},"x":{"a":0,"k":0,"ix":4},"nm":"Masque 1"},{"inv":false,"mode":"s","pt":{"a":0,"k":{"i":[[46,-1.5],[34.5,-13],[-21,-61.5],[0,0],[0,0],[0,0]],"o":[[-46,1.5],[-34.5,13],[21,61.5],[0,0],[0,0],[0,0]],"v":[[78,-236],[1,-228],[-56.5,-151.5],[-21.5,-31.5],[157,-45.5],[141,-145]],"c":true},"ix":1},"o":{"a":0,"k":100,"ix":3},"x":{"a":0,"k":0,"ix":4},"nm":"Masque 2"}],"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"v":[[139.106,-212.883],[91.222,-212.883],[91.222,-212.457],[8.383,-79.176],[11.225,-49.906],[91.222,-49.906],[91.222,-6],[139.106,-6],[139.106,-49.906],[160.135,-49.906],[160.135,-86.849],[139.106,-86.849]],"c":true},"ix":2},"nm":"4","mn":"ADBE Vector Shape - Group","hd":false},{"ind":1,"ty":"sh","ix":2,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0]],"v":[[88.238,-145.674],[91.222,-150.505],[91.222,-86.849],[53.994,-86.849]],"c":true},"ix":2},"nm":"4","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"mm","mm":1,"nm":"Fusionner les tracÃ©s 1","mn":"ADBE Vector Filter - Merge","hd":false},{"ty":"fl","c":{"a":0,"k":[0,0,0,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fond 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[104,-5],"ix":2},"a":{"a":0,"k":[91.327,-6.373],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":-29,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transformer "}],"nm":"4","np":5,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":0,"op":125,"st":0,"bm":0},{"ddd":0,"ind":20,"ty":4,"nm":"#4","ln":"4","parent":22,"sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[-126,14.5,0],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"hasMask":true,"masksProperties":[{"inv":false,"mode":"s","pt":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0]],"v":[[212.5,-24],[-26,-24],[-26,39],[212.5,39]],"c":true},"ix":1},"o":{"a":0,"k":100,"ix":3},"x":{"a":0,"k":0,"ix":4},"nm":"Masque 1"}],"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"v":[[139.106,-212.883],[91.222,-212.883],[91.222,-212.457],[8.383,-79.176],[11.225,-49.906],[91.222,-49.906],[91.222,-6],[139.106,-6],[139.106,-49.906],[160.135,-49.906],[160.135,-86.849],[139.106,-86.849]],"c":true},"ix":2},"nm":"4","mn":"ADBE Vector Shape - Group","hd":false},{"ind":1,"ty":"sh","ix":2,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0]],"v":[[88.238,-145.674],[91.222,-150.505],[91.222,-86.849],[53.994,-86.849]],"c":true},"ix":2},"nm":"4","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"mm","mm":1,"nm":"Fusionner les tracÃ©s 1","mn":"ADBE Vector Filter - Merge","hd":false},{"ty":"fl","c":{"a":0,"k":[0.549019607843,0.549019607843,0.549019607843,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fond 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[104,-5],"ix":2},"a":{"a":0,"k":[91.327,-6.373],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":-29,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transformer "}],"nm":"4","np":5,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":0,"op":125,"st":0,"bm":0},{"ddd":0,"ind":21,"ty":4,"nm":"shadow","sr":1,"ks":{"o":{"a":0,"k":10,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[241.5,302.5,0],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"hasMask":true,"masksProperties":[{"inv":false,"mode":"s","pt":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0]],"v":[[254.5,-9],[-66.5,-9],[-66.5,63.5],[254.5,63.5]],"c":true},"ix":1},"o":{"a":0,"k":100,"ix":3},"x":{"a":0,"k":0,"ix":4},"nm":"Masque 1"},{"inv":false,"mode":"s","pt":{"a":0,"k":{"i":[[-1.5,0],[0,0],[-41.5,0],[0,0],[0,0]],"o":[[1.5,0],[0,0],[41.5,0],[0,0],[0,0]],"v":[[6,-263.5],[22.5,-45],[93.5,-17.5],[177,-31],[233.5,-243.5]],"c":true},"ix":1},"o":{"a":0,"k":100,"ix":3},"x":{"a":0,"k":0,"ix":4},"nm":"Masque 2"}],"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[12.597,15.252],[22.923,0],[12.551,-15.155],[0,-27.943],[0,0],[-12.599,-15.25],[-23.019,0],[-12.553,15.157],[0,27.945]],"o":[[0,-27.85],[-12.599,-15.25],[-22.925,0],[-12.553,15.157],[0,0],[0,27.756],[12.597,15.252],[22.828,0],[12.551,-15.155],[0,0]],"v":[[156.299,-128.197],[137.401,-192.848],[84.117,-215.725],[30.905,-192.99],[12.078,-128.339],[12.078,-90.543],[30.976,-26.035],[84.401,-3.158],[137.472,-25.893],[156.299,-90.543]],"c":true},"ix":2},"nm":"0","mn":"ADBE Vector Shape - Group","hd":false},{"ind":1,"ty":"sh","ix":2,"ks":{"a":0,"k":{"i":[[0,0],[3.883,-6.962],[8.146,0],[3.883,7.153],[0,15.441],[0,0],[-3.743,6.82],[-8.241,0],[-3.885,-7.34],[0,-14.871]],"o":[[-0.095,14.873],[-3.885,6.962],[-8.432,0],[-3.885,-7.151],[0,0],[0.284,-13.829],[3.741,-6.82],[8.43,0],[3.883,7.342],[0,0]],"v":[[108.415,-83.297],[102.447,-50.545],[84.401,-40.102],[65.93,-50.829],[60.104,-84.718],[60.104,-137.575],[66.143,-168.551],[84.117,-178.781],[102.589,-167.769],[108.415,-134.449]],"c":true},"ix":2},"nm":"0","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"mm","mm":1,"nm":"Fusionner les tracÃ©s 1","mn":"ADBE Vector Filter - Merge","hd":false},{"ty":"st","c":{"a":0,"k":[0,0,0,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":3,"ix":5},"lc":1,"lj":1,"ml":4,"bm":0,"nm":"Contour 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"fl","c":{"a":0,"k":[0,0,0,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fond 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":13,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transformer "}],"nm":"0","np":5,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":0,"op":125,"st":0,"bm":0},{"ddd":0,"ind":22,"ty":4,"nm":"#0","ln":"0","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[241.5,302.5,0],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"hasMask":true,"masksProperties":[{"inv":false,"mode":"s","pt":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0]],"v":[[254.5,-9],[-66.5,-9],[-66.5,63.5],[254.5,63.5]],"c":true},"ix":1},"o":{"a":0,"k":100,"ix":3},"x":{"a":0,"k":0,"ix":4},"nm":"Masque 1"}],"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[12.597,15.252],[22.923,0],[12.551,-15.155],[0,-27.943],[0,0],[-12.599,-15.25],[-23.019,0],[-12.553,15.157],[0,27.945]],"o":[[0,-27.85],[-12.599,-15.25],[-22.925,0],[-12.553,15.157],[0,0],[0,27.756],[12.597,15.252],[22.828,0],[12.551,-15.155],[0,0]],"v":[[156.299,-128.197],[137.401,-192.848],[84.117,-215.725],[30.905,-192.99],[12.078,-128.339],[12.078,-90.543],[30.976,-26.035],[84.401,-3.158],[137.472,-25.893],[156.299,-90.543]],"c":true},"ix":2},"nm":"0","mn":"ADBE Vector Shape - Group","hd":false},{"ind":1,"ty":"sh","ix":2,"ks":{"a":0,"k":{"i":[[0,0],[3.883,-6.962],[8.146,0],[3.883,7.153],[0,15.441],[0,0],[-3.743,6.82],[-8.241,0],[-3.885,-7.34],[0,-14.871]],"o":[[-0.095,14.873],[-3.885,6.962],[-8.432,0],[-3.885,-7.151],[0,0],[0.284,-13.829],[3.741,-6.82],[8.43,0],[3.883,7.342],[0,0]],"v":[[108.415,-83.297],[102.447,-50.545],[84.401,-40.102],[65.93,-50.829],[60.104,-84.718],[60.104,-137.575],[66.143,-168.551],[84.117,-178.781],[102.589,-167.769],[108.415,-134.449]],"c":true},"ix":2},"nm":"0","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"mm","mm":1,"nm":"Fusionner les tracÃ©s 1","mn":"ADBE Vector Filter - Merge","hd":false},{"ty":"st","c":{"a":0,"k":[0.549019607843,0.549019607843,0.549019607843,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":3,"ix":5},"lc":1,"lj":1,"ml":4,"bm":0,"nm":"Contour 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"fl","c":{"a":0,"k":[1,1,1,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fond 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":13,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transformer "}],"nm":"0","np":5,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":0,"op":125,"st":0,"bm":0}]`);
const markers$1 = [];
const Lonely404 = {
  v: v$1,
  fr: fr$1,
  ip: ip$1,
  op: op$1,
  w: w$1,
  h: h$1,
  nm: nm$1,
  ddd: ddd$1,
  assets: assets$1,
  layers: layers$1,
  markers: markers$1
};
const v = "5.12.1";
const fr = 30;
const ip = 0;
const op = 180;
const w = 418;
const h = 612;
const nm = "Sad walking";
const ddd = 0;
const assets = [{ "id": "comp_0", "nm": "main", "fr": 30, "layers": [{ "ddd": 0, "ind": 1, "ty": 4, "nm": "head", "parent": 3, "sr": 1, "ks": { "o": { "a": 0, "k": 100, "ix": 11 }, "r": { "a": 0, "k": 0, "ix": 10 }, "p": { "a": 1, "k": [{ "i": { "x": 0.77, "y": 0.987 }, "o": { "x": 0.513, "y": 0.029 }, "t": 0, "s": [30.375, -106.375, 0], "to": [0, 0.5, 0], "ti": [0, 0.167, 0] }, { "i": { "x": 0.546, "y": 0.979 }, "o": { "x": 0.245, "y": 0.012 }, "t": 11, "s": [30.375, -103.375, 0], "to": [0, -0.167, 0], "ti": [0, 0.5, 0] }, { "i": { "x": 0.795, "y": 1 }, "o": { "x": 0.439, "y": 0.039 }, "t": 23, "s": [30.375, -107.375, 0], "to": [0, -0.5, 0], "ti": [0, -0.167, 0] }, { "t": 30, "s": [30.375, -106.375, 0] }], "ix": 2, "l": 2 }, "a": { "a": 0, "k": [29.875, -105.625, 0], "ix": 1, "l": 2 }, "s": { "a": 0, "k": [100, 100, 100], "ix": 6, "l": 2 } }, "ao": 0, "shapes": [{ "ty": "gr", "it": [{ "d": 1, "ty": "el", "s": { "a": 0, "k": [71.75, 71.75], "ix": 2 }, "p": { "a": 0, "k": [0, 0], "ix": 3 }, "nm": "Ellipse Path 1", "mn": "ADBE Vector Shape - Ellipse", "hd": false }, { "ty": "fl", "c": { "a": 0, "k": [0, 0, 0, 1], "ix": 4 }, "o": { "a": 0, "k": 100, "ix": 5 }, "r": 1, "bm": 0, "nm": "Fill 1", "mn": "ADBE Vector Graphic - Fill", "hd": false }, { "ty": "tr", "p": { "a": 0, "k": [29.875, -105.625], "ix": 2 }, "a": { "a": 0, "k": [0, 0], "ix": 1 }, "s": { "a": 0, "k": [100, 100], "ix": 3 }, "r": { "a": 0, "k": 0, "ix": 6 }, "o": { "a": 0, "k": 100, "ix": 7 }, "sk": { "a": 0, "k": 0, "ix": 4 }, "sa": { "a": 0, "k": 0, "ix": 5 }, "nm": "Transform" }], "nm": "Ellipse 1", "np": 3, "cix": 2, "bm": 0, "ix": 1, "mn": "ADBE Vector Group", "hd": false }], "ip": 0, "op": 180, "st": 0, "ct": 1, "bm": 0 }, { "ddd": 0, "ind": 2, "ty": 3, "nm": "Null 2", "sr": 1, "ks": { "o": { "a": 0, "k": 0, "ix": 11 }, "r": { "a": 0, "k": 0, "ix": 10 }, "p": { "a": 0, "k": [525.919, 641.898, 0], "ix": 2, "l": 2 }, "a": { "a": 0, "k": [50, 50, 0], "ix": 1, "l": 2 }, "s": { "a": 0, "k": [166, 166, 100], "ix": 6, "l": 2 } }, "ao": 0, "ip": 0, "op": 180, "st": 0, "bm": 0 }, { "ddd": 0, "ind": 3, "ty": 4, "nm": "body", "parent": 2, "sr": 1, "ks": { "o": { "a": 0, "k": 100, "ix": 11 }, "r": { "a": 0, "k": 0, "ix": 10 }, "p": { "a": 1, "k": [{ "i": { "x": 0.667, "y": 1 }, "o": { "x": 0.333, "y": 0 }, "t": 0, "s": [42.955, -16.898, 0], "to": [0, 0.792, 0], "ti": [0, 0.229, 0] }, { "i": { "x": 0.667, "y": 1 }, "o": { "x": 0.333, "y": 0 }, "t": 11, "s": [42.955, -12.148, 0], "to": [0, -0.229, 0], "ti": [0, 0.792, 0] }, { "i": { "x": 0.667, "y": 1 }, "o": { "x": 0.333, "y": 0 }, "t": 23, "s": [42.955, -18.273, 0], "to": [0, -0.792, 0], "ti": [0, -0.229, 0] }, { "t": 30, "s": [42.955, -16.898, 0] }], "ix": 2, "l": 2 }, "a": { "a": 0, "k": [-21.126, 35, 0], "ix": 1, "l": 2 }, "s": { "a": 0, "k": [100, 100, 100], "ix": 6, "l": 2 } }, "ao": 0, "shapes": [{ "ty": "gr", "it": [{ "ind": 0, "ty": "sh", "ix": 1, "ks": { "a": 0, "k": { "i": [[7.375, -1], [10.459, -23.754], [0, 0], [0, 0], [0.076, 1.748]], "o": [[-4.351, 0.59], [-17.052, 38.726], [0, 0], [0, 0], [-0.25, -5.75]], "v": [[-6.75, -77], [-33.198, -41.726], [-49.75, 35], [7.5, 35], [7.25, -66.375]], "c": true }, "ix": 2 }, "nm": "Path 1", "mn": "ADBE Vector Shape - Group", "hd": false }, { "ty": "fl", "c": { "a": 0, "k": [0, 0, 0, 1], "ix": 4 }, "o": { "a": 0, "k": 100, "ix": 5 }, "r": 1, "bm": 0, "nm": "Fill 1", "mn": "ADBE Vector Graphic - Fill", "hd": false }, { "ty": "tr", "p": { "a": 0, "k": [0, 0], "ix": 2 }, "a": { "a": 0, "k": [0, 0], "ix": 1 }, "s": { "a": 0, "k": [100, 100], "ix": 3 }, "r": { "a": 0, "k": 0, "ix": 6 }, "o": { "a": 0, "k": 100, "ix": 7 }, "sk": { "a": 0, "k": 0, "ix": 4 }, "sa": { "a": 0, "k": 0, "ix": 5 }, "nm": "Transform" }], "nm": "Shape 1", "np": 3, "cix": 2, "bm": 0, "ix": 1, "mn": "ADBE Vector Group", "hd": false }], "ip": 0, "op": 180, "st": 0, "ct": 1, "bm": 0 }, { "ddd": 0, "ind": 4, "ty": 4, "nm": "Shape Layer 2", "parent": 2, "sr": 1, "ks": { "o": { "a": 0, "k": 100, "ix": 11 }, "r": { "a": 1, "k": [{ "i": { "x": [0.833], "y": [0.833] }, "o": { "x": [0.167], "y": [0.167] }, "t": 0, "s": [9] }, { "i": { "x": [0.833], "y": [0.833] }, "o": { "x": [0.167], "y": [0.167] }, "t": 6, "s": [22.8] }, { "i": { "x": [0.833], "y": [0.833] }, "o": { "x": [0.167], "y": [0.167] }, "t": 11, "s": [43.133] }, { "i": { "x": [0.833], "y": [0.833] }, "o": { "x": [0.167], "y": [0.167] }, "t": 16, "s": [49.467] }, { "i": { "x": [0.833], "y": [0.833] }, "o": { "x": [0.167], "y": [0.167] }, "t": 23, "s": [-6.267] }, { "i": { "x": [0.833], "y": [0.833] }, "o": { "x": [0.167], "y": [0.167] }, "t": 26, "s": [-28.438] }, { "t": 30, "s": [-14] }], "ix": 10 }, "p": { "a": 1, "k": [{ "i": { "x": 0.833, "y": 0.833 }, "o": { "x": 0.167, "y": 0.167 }, "t": 0, "s": [10.143, 106.852, 0], "to": [0.811, -1.779, 0], "ti": [-4.22, 2.639, 0] }, { "i": { "x": 0.833, "y": 0.833 }, "o": { "x": 0.167, "y": 0.167 }, "t": 6, "s": [17.371, 101.477, 0], "to": [5.496, -3.437, 0], "ti": [-10.402, 2.404, 0] }, { "i": { "x": 0.833, "y": 0.833 }, "o": { "x": 0.167, "y": 0.167 }, "t": 16, "s": [51.11, 87.227, 0], "to": [15.565, -3.597, 0], "ti": [-5.183, -2.26, 0] }, { "i": { "x": 0.833, "y": 0.833 }, "o": { "x": 0.167, "y": 0.167 }, "t": 23, "s": [87.44, 88.192, 0], "to": [7.744, 3.377, 0], "ti": [0.653, -1.854, 0] }, { "t": 30, "s": [92.393, 101.477, 0] }], "ix": 2, "l": 2 }, "a": { "a": 0, "k": [17.563, 142.875, 0], "ix": 1, "l": 2 }, "s": { "a": 0, "k": [100, 100, 100], "ix": 6, "l": 2 } }, "ao": 0, "shapes": [{ "ty": "gr", "it": [{ "ind": 0, "ty": "sh", "ix": 1, "ks": { "a": 0, "k": { "i": [[0, 0], [0, 0]], "o": [[0, 0], [0, 0]], "v": [[4.25, 144.875], [30.875, 140.875]], "c": false }, "ix": 2 }, "nm": "Path 1", "mn": "ADBE Vector Shape - Group", "hd": false }, { "ty": "st", "c": { "a": 0, "k": [0, 0, 0, 1], "ix": 3 }, "o": { "a": 0, "k": 100, "ix": 4 }, "w": { "a": 0, "k": 13, "ix": 5 }, "lc": 2, "lj": 1, "ml": 4, "bm": 0, "nm": "Stroke 1", "mn": "ADBE Vector Graphic - Stroke", "hd": false }, { "ty": "tr", "p": { "a": 0, "k": [0, 0], "ix": 2 }, "a": { "a": 0, "k": [0, 0], "ix": 1 }, "s": { "a": 0, "k": [100, 100], "ix": 3 }, "r": { "a": 0, "k": 0, "ix": 6 }, "o": { "a": 0, "k": 100, "ix": 7 }, "sk": { "a": 0, "k": 0, "ix": 4 }, "sa": { "a": 0, "k": 0, "ix": 5 }, "nm": "Transform" }], "nm": "Shape 1", "np": 3, "cix": 2, "bm": 0, "ix": 1, "mn": "ADBE Vector Group", "hd": false }], "ip": 0, "op": 180, "st": 0, "ct": 1, "bm": 0 }, { "ddd": 0, "ind": 5, "ty": 4, "nm": "Shape Layer 1", "parent": 2, "sr": 1, "ks": { "o": { "a": 0, "k": 100, "ix": 11 }, "r": { "a": 1, "k": [{ "i": { "x": [0.833], "y": [0.833] }, "o": { "x": [0.167], "y": [0.167] }, "t": 0, "s": [-14] }, { "i": { "x": [0.833], "y": [0.833] }, "o": { "x": [0.167], "y": [0.167] }, "t": 6, "s": [9] }, { "t": 30, "s": [9] }], "ix": 10 }, "p": { "a": 1, "k": [{ "i": { "x": 0.833, "y": 0.833 }, "o": { "x": 0.167, "y": 0.167 }, "t": 0, "s": [92.643, 101.227, 0], "to": [-2.167, 0.979, 0], "ti": [13.75, -0.938, 0] }, { "i": { "x": 0.833, "y": 0.833 }, "o": { "x": 0.167, "y": 0.167 }, "t": 6, "s": [79.643, 107.102, 0], "to": [-13.75, 0.938, 0], "ti": [11.583, 0.042, 0] }, { "t": 30, "s": [10.143, 106.852, 0] }], "ix": 2, "l": 2 }, "a": { "a": 0, "k": [17.563, 142.875, 0], "ix": 1, "l": 2 }, "s": { "a": 0, "k": [100, 100, 100], "ix": 6, "l": 2 } }, "ao": 0, "shapes": [{ "ty": "gr", "it": [{ "ind": 0, "ty": "sh", "ix": 1, "ks": { "a": 0, "k": { "i": [[0, 0], [0, 0]], "o": [[0, 0], [0, 0]], "v": [[4.25, 144.875], [30.875, 140.875]], "c": false }, "ix": 2 }, "nm": "Path 1", "mn": "ADBE Vector Shape - Group", "hd": false }, { "ty": "st", "c": { "a": 0, "k": [0, 0, 0, 1], "ix": 3 }, "o": { "a": 0, "k": 100, "ix": 4 }, "w": { "a": 0, "k": 13, "ix": 5 }, "lc": 2, "lj": 1, "ml": 4, "bm": 0, "nm": "Stroke 1", "mn": "ADBE Vector Graphic - Stroke", "hd": false }, { "ty": "tr", "p": { "a": 0, "k": [0, 0], "ix": 2 }, "a": { "a": 0, "k": [0, 0], "ix": 1 }, "s": { "a": 0, "k": [100, 100], "ix": 3 }, "r": { "a": 0, "k": 0, "ix": 6 }, "o": { "a": 0, "k": 100, "ix": 7 }, "sk": { "a": 0, "k": 0, "ix": 4 }, "sa": { "a": 0, "k": 0, "ix": 5 }, "nm": "Transform" }], "nm": "Shape 1", "np": 3, "cix": 2, "bm": 0, "ix": 1, "mn": "ADBE Vector Group", "hd": false }], "ip": 0, "op": 180, "st": 0, "ct": 1, "bm": 0 }, { "ddd": 0, "ind": 6, "ty": 4, "nm": "Shape Layer 3", "parent": 2, "sr": 1, "ks": { "o": { "a": 0, "k": 20, "ix": 11 }, "r": { "a": 0, "k": 0, "ix": 10 }, "p": { "a": 0, "k": [42.956, 112.602, 0], "ix": 2, "l": 2 }, "a": { "a": 0, "k": [-21.125, 164.5, 0], "ix": 1, "l": 2 }, "s": { "a": 1, "k": [{ "i": { "x": [0.833, 0.833, 0.833], "y": [0.833, 0.833, 0.833] }, "o": { "x": [0.167, 0.167, 0.167], "y": [0.167, 0.167, 0.167] }, "t": 0, "s": [100, 100, 100] }, { "i": { "x": [0.833, 0.833, 0.833], "y": [0.833, 0.833, 0.833] }, "o": { "x": [0.167, 0.167, 0.167], "y": [0.167, 0.167, 0.167] }, "t": 16, "s": [83, 83, 100] }, { "t": 30, "s": [100, 100, 100] }], "ix": 6, "l": 2 } }, "ao": 0, "shapes": [{ "ty": "gr", "it": [{ "d": 1, "ty": "el", "s": { "a": 0, "k": [145.75, 10], "ix": 2 }, "p": { "a": 0, "k": [0, 0], "ix": 3 }, "nm": "Ellipse Path 1", "mn": "ADBE Vector Shape - Ellipse", "hd": false }, { "ty": "fl", "c": { "a": 0, "k": [0, 0, 0, 1], "ix": 4 }, "o": { "a": 0, "k": 100, "ix": 5 }, "r": 1, "bm": 0, "nm": "Fill 1", "mn": "ADBE Vector Graphic - Fill", "hd": false }, { "ty": "tr", "p": { "a": 0, "k": [-21.125, 164.5], "ix": 2 }, "a": { "a": 0, "k": [0, 0], "ix": 1 }, "s": { "a": 0, "k": [100, 100], "ix": 3 }, "r": { "a": 0, "k": 0, "ix": 6 }, "o": { "a": 0, "k": 100, "ix": 7 }, "sk": { "a": 0, "k": 0, "ix": 4 }, "sa": { "a": 0, "k": 0, "ix": 5 }, "nm": "Transform" }], "nm": "Ellipse 1", "np": 3, "cix": 2, "bm": 0, "ix": 1, "mn": "ADBE Vector Group", "hd": false }], "ip": 0, "op": 180, "st": 0, "ct": 1, "bm": 0 }] }];
const layers = [{ "ddd": 0, "ind": 1, "ty": 0, "nm": "main", "refId": "comp_0", "sr": 1, "ks": { "o": { "a": 0, "k": 100, "ix": 11 }, "r": { "a": 0, "k": 0, "ix": 10 }, "p": { "a": 0, "k": [214, 364, 0], "ix": 2, "l": 2 }, "a": { "a": 0, "k": [540, 540, 0], "ix": 1, "l": 2 }, "s": { "a": 0, "k": [100, 100, 100], "ix": 6, "l": 2 } }, "ao": 0, "w": 1080, "h": 1080, "ip": 150, "op": 180, "st": 150, "bm": 0 }, { "ddd": 0, "ind": 2, "ty": 0, "nm": "main", "refId": "comp_0", "sr": 1, "ks": { "o": { "a": 0, "k": 100, "ix": 11 }, "r": { "a": 0, "k": 0, "ix": 10 }, "p": { "a": 0, "k": [214, 364, 0], "ix": 2, "l": 2 }, "a": { "a": 0, "k": [540, 540, 0], "ix": 1, "l": 2 }, "s": { "a": 0, "k": [100, 100, 100], "ix": 6, "l": 2 } }, "ao": 0, "w": 1080, "h": 1080, "ip": 120, "op": 150, "st": 120, "bm": 0 }, { "ddd": 0, "ind": 3, "ty": 0, "nm": "main", "refId": "comp_0", "sr": 1, "ks": { "o": { "a": 0, "k": 100, "ix": 11 }, "r": { "a": 0, "k": 0, "ix": 10 }, "p": { "a": 0, "k": [214, 364, 0], "ix": 2, "l": 2 }, "a": { "a": 0, "k": [540, 540, 0], "ix": 1, "l": 2 }, "s": { "a": 0, "k": [100, 100, 100], "ix": 6, "l": 2 } }, "ao": 0, "w": 1080, "h": 1080, "ip": 90, "op": 120, "st": 90, "bm": 0 }, { "ddd": 0, "ind": 4, "ty": 0, "nm": "main", "refId": "comp_0", "sr": 1, "ks": { "o": { "a": 0, "k": 100, "ix": 11 }, "r": { "a": 0, "k": 0, "ix": 10 }, "p": { "a": 0, "k": [214, 364, 0], "ix": 2, "l": 2 }, "a": { "a": 0, "k": [540, 540, 0], "ix": 1, "l": 2 }, "s": { "a": 0, "k": [100, 100, 100], "ix": 6, "l": 2 } }, "ao": 0, "w": 1080, "h": 1080, "ip": 60, "op": 90, "st": 60, "bm": 0 }, { "ddd": 0, "ind": 5, "ty": 0, "nm": "main", "refId": "comp_0", "sr": 1, "ks": { "o": { "a": 0, "k": 100, "ix": 11 }, "r": { "a": 0, "k": 0, "ix": 10 }, "p": { "a": 0, "k": [214, 364, 0], "ix": 2, "l": 2 }, "a": { "a": 0, "k": [540, 540, 0], "ix": 1, "l": 2 }, "s": { "a": 0, "k": [100, 100, 100], "ix": 6, "l": 2 } }, "ao": 0, "w": 1080, "h": 1080, "ip": 30, "op": 60, "st": 30, "bm": 0 }, { "ddd": 0, "ind": 6, "ty": 0, "nm": "main", "refId": "comp_0", "sr": 1, "ks": { "o": { "a": 0, "k": 100, "ix": 11 }, "r": { "a": 0, "k": 0, "ix": 10 }, "p": { "a": 0, "k": [214, 364, 0], "ix": 2, "l": 2 }, "a": { "a": 0, "k": [540, 540, 0], "ix": 1, "l": 2 }, "s": { "a": 0, "k": [100, 100, 100], "ix": 6, "l": 2 } }, "ao": 0, "w": 1080, "h": 1080, "ip": 0, "op": 30, "st": 0, "bm": 0 }];
const markers = [{ "tm": 30, "cm": "1", "dr": 0 }];
const props = {};
const SadWalking = {
  v,
  fr,
  ip,
  op,
  w,
  h,
  nm,
  ddd,
  assets,
  layers,
  markers,
  props
};
defineComponent({
  name: "ServerPlaceholder",
  render() {
    return createElementBlock("div");
  }
});
const clientOnlySymbol = /* @__PURE__ */ Symbol.for("nuxt:client-only");
const __nuxt_component_0 = defineComponent({
  name: "ClientOnly",
  inheritAttrs: false,
  props: ["fallback", "placeholder", "placeholderTag", "fallbackTag"],
  ...false,
  setup(props2, { slots, attrs }) {
    const mounted = shallowRef(false);
    const vm = getCurrentInstance();
    if (vm) {
      vm._nuxtClientOnly = true;
    }
    provide(clientOnlySymbol, true);
    return () => {
      if (mounted.value) {
        const vnodes = slots.default?.();
        if (vnodes && vnodes.length === 1) {
          return [cloneVNode(vnodes[0], attrs)];
        }
        return vnodes;
      }
      const slot = slots.fallback || slots.placeholder;
      if (slot) {
        return h$2(slot);
      }
      const fallbackStr = props2.fallback || props2.placeholder || "";
      const fallbackTag = props2.fallbackTag || props2.placeholderTag || "span";
      return createElementBlock(fallbackTag, attrs, fallbackStr);
    };
  }
});
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "LottieAnimation",
  __ssrInlineRender: true,
  props: {
    animationData: {},
    animationPath: {},
    width: { default: "100%" },
    height: { default: "100%" },
    loop: { type: Boolean, default: true },
    autoPlay: { type: Boolean, default: true },
    speed: { default: 1 },
    pauseOnHover: { type: Boolean, default: false }
  },
  setup(__props, { expose: __expose }) {
    const lottieRef = ref(null);
    ref(false);
    const hasError = ref(false);
    const play = () => lottieRef.value?.play();
    const pause = () => lottieRef.value?.pause();
    const stop = () => lottieRef.value?.stop();
    __expose({ play, pause, stop });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_client_only = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "lottie-wrapper" }, _attrs))} data-v-e35dde1d>`);
      _push(ssrRenderComponent(_component_client_only, null, {}, _parent));
      if (unref(hasError)) {
        _push(`<div class="lottie-fallback" data-v-e35dde1d><svg class="fallback-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-e35dde1d><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" data-v-e35dde1d></path></svg></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props2, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/LottieAnimation.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props2, ctx) : void 0;
};
const LottieAnimation = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$2, [["__scopeId", "data-v-e35dde1d"]]), { __name: "LottieAnimation" });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "error",
  __ssrInlineRender: true,
  props: {
    error: {}
  },
  setup(__props) {
    const props2 = __props;
    useRouter();
    const errorCode = computed(() => props2.error?.statusCode || 500);
    const currentAnimation = computed(() => {
      if (errorCode.value === 404) {
        return Lonely404;
      }
      return SadWalking;
    });
    const errorMessage = computed(() => {
      if (props2.error?.statusMessage) return props2.error.statusMessage;
      if (props2.error?.message) return props2.error.message;
      switch (errorCode.value) {
        case 404:
          return "Halaman yang Anda cari tidak ditemukan";
        case 403:
          return "Maaf, Anda tidak memiliki izin untuk mengakses halaman ini.";
        case 500:
          return "Terjadi kesalahan pada server";
        case 502:
          return "Layanan sedang tidak dapat dihubungi saat ini.";
        case 503:
          return "Layanan sedang dalam pemeliharaan rutin.";
        default:
          return "Terjadi kesalahan yang tidak terduga.";
      }
    });
    const errorTitle = computed(() => {
      switch (errorCode.value) {
        case 404:
          return "Halaman Tidak Ditemukan";
        case 502:
          return "Koneksi Terputus";
        case 500:
          return "Kesalahan Sistem";
        default:
          return "Terjadi Kesalahan";
      }
    });
    const { options } = useAppOptions();
    const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
    const appName = computed(() => options.value.data?.name || "VENUE UNDIP");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen w-full flex items-center justify-center bg-white sm:bg-gray-50 px-4 sm:px-6 py-12 relative overflow-hidden" }, _attrs))}><div class="w-full max-w-5xl grid lg:grid-cols-2 gap-8 lg:gap-12 items-center mx-auto z-10"><div class="space-y-6 text-center lg:text-left order-2 lg:order-1"><div class="space-y-4"><div class="inline-flex items-center justify-center px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 font-bold text-xs tracking-wide shadow-sm"> ERROR ${ssrInterpolate(unref(errorCode))}</div><h1 class="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight leading-tight">${ssrInterpolate(unref(errorTitle))}</h1><p class="text-base sm:text-lg text-gray-500 leading-relaxed font-medium max-w-xl mx-auto lg:mx-0">${ssrInterpolate(unref(errorMessage))}</p>`);
      if (props2.error?.url) {
        _push(`<div class="mt-2 p-2 bg-gray-50 rounded border border-gray-200 inline-block text-left"><p class="text-[10px] font-mono text-gray-400 break-all"><span class="font-bold text-gray-500">Source:</span> ${ssrInterpolate(props2.error.url)}</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-2">`);
      if (unref(errorCode) === 500 || unref(errorCode) === 502 || unref(errorCode) === 503) {
        _push(`<button class="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-200 text-sm font-bold rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-200 transition-all shadow-sm hover:shadow active:scale-[0.98]"><svg class="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg> Coba Lagi </button>`);
      } else {
        _push(`<button class="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-200 text-sm font-bold rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-200 transition-all shadow-sm hover:shadow active:scale-[0.98]"><svg class="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg> Kembali </button>`);
      }
      _push(`<button class="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all shadow-md hover:shadow-lg active:scale-[0.98]"><svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg> Kembali ke Beranda </button></div></div><div class="order-1 lg:order-2 flex justify-center items-center relative w-full"><div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] bg-gradient-to-tr from-blue-100/40 via-indigo-50/40 to-white rounded-full blur-3xl -z-10"></div><div class="${ssrRenderClass([unref(errorCode) === 404 ? "max-w-[240px] sm:max-w-xs lg:max-w-md" : "max-w-[180px] sm:max-w-[220px] lg:max-w-[300px]", "w-full transition-all duration-500 hover:scale-105"])}">`);
      _push(ssrRenderComponent(LottieAnimation, {
        "animation-data": unref(currentAnimation),
        loop: true,
        "auto-play": true
      }, null, _parent));
      _push(`</div></div></div><div class="absolute bottom-4 left-0 w-full text-center px-4"><p class="text-xs text-gray-400 font-medium"> © ${ssrInterpolate(unref(currentYear))} <span class="text-gray-500 font-semibold">${ssrInterpolate(unref(appName))}</span>. All rights reserved. </p></div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props2, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("error.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props2, ctx) : void 0;
};
const _sfc_main = {
  __name: "nuxt-root",
  __ssrInlineRender: true,
  setup(__props) {
    const IslandRenderer = () => null;
    const nuxtApp = useNuxtApp();
    nuxtApp.deferHydration();
    nuxtApp.ssrContext.url;
    const SingleRenderer = false;
    provide(PageRouteSymbol, useRoute());
    nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup");
    const error = /* @__PURE__ */ useError();
    const abortRender = error.value && !nuxtApp.ssrContext.error;
    onErrorCaptured((err, target, info) => {
      nuxtApp.hooks.callHook("vue:error", err, target, info).catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
      {
        const p = nuxtApp.runWithContext(() => showError(err));
        onServerPrefetch(() => p);
        return false;
      }
    });
    const islandContext = nuxtApp.ssrContext.islandContext;
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderSuspense(_push, {
        default: () => {
          if (unref(abortRender)) {
            _push(`<div></div>`);
          } else if (unref(error)) {
            _push(ssrRenderComponent(unref(_sfc_main$1), { error: unref(error) }, null, _parent));
          } else if (unref(islandContext)) {
            _push(ssrRenderComponent(unref(IslandRenderer), { context: unref(islandContext) }, null, _parent));
          } else if (unref(SingleRenderer)) {
            ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(SingleRenderer)), null, null), _parent);
          } else {
            _push(ssrRenderComponent(unref(_sfc_main$3), null, null, _parent));
          }
        },
        _: 1
      });
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props2, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-root.vue");
  return _sfc_setup ? _sfc_setup(props2, ctx) : void 0;
};
let entry;
{
  entry = async function createNuxtAppServer(ssrContext) {
    const vueApp = createApp(_sfc_main);
    const nuxt = createNuxtApp({ vueApp, ssrContext });
    try {
      await applyPlugins(nuxt, plugins);
      await nuxt.hooks.callHook("app:created", vueApp);
    } catch (error) {
      await nuxt.hooks.callHook("app:error", error);
      nuxt.payload.error ||= createError(error);
    }
    if (ssrContext?._renderResponse) {
      throw new Error("skipping render");
    }
    return vueApp;
  };
}
const entry_default = (ssrContext) => entry(ssrContext);

export { _export_sfc as _, useRoute as a, useRouter as b, createError as c, useState as d, entry_default as default, useNuxtApp as e, useRuntimeConfig as f, nuxtLinkDefaults as g, asyncDataDefaults as h, fetchDefaults as i, useRequestFetch as j, defineNuxtRouteMiddleware as k, useRequestEvent as l, navigateTo as n, resolveRouteObject as r, setInterval as s, useAppOptions as u };
//# sourceMappingURL=server.mjs.map
