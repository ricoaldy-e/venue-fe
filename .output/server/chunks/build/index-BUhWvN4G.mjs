import { defineComponent, computed, ref, mergeProps, unref, isRef, createVNode, resolveDynamicComponent, watch, reactive, getCurrentInstance, onMounted, onScopeDispose, hasInjectionContext, inject, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderClass, ssrRenderDynamicModel, ssrRenderComponent, ssrIncludeBooleanAttr, ssrRenderVNode } from 'vue/server-renderer';
import { K as parseURL, G as parseQuery, x as withQuery, F as defu } from '../_/nitro.mjs';
import { _ as _export_sfc, u as useAppOptions, b as useRouter, a as useRoute, f as useRuntimeConfig, e as useNuxtApp } from './server.mjs';
import { u as useHead, i as injectHead$1 } from './composables-D8u1NqZw.mjs';
import { useScript as useScript$2 } from 'unhead/scripts';
import { useEventListener } from '@vueuse/core';
import { tryOnMounted, tryOnScopeDispose } from '@vueuse/shared';
import { _ as _imports_0 } from './VENUE-UNDIP-LOGO-C_mmPH8T.mjs';
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
import 'vue-router';
import 'vue3-lottie';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';

const headSymbol = "usehead";
// @__NO_SIDE_EFFECTS__
function injectHead() {
  if (hasInjectionContext()) {
    const instance = inject(headSymbol);
    if (!instance) {
      throw new Error("useHead() was called without provide context, ensure you call it through the setup() function.");
    }
    return instance;
  }
  throw new Error("useHead() was called without provide context, ensure you call it through the setup() function.");
}
const onNuxtReady = (callback) => {
  {
    return;
  }
};
function registerVueScopeHandlers(script, scope) {
  if (!scope) {
    return;
  }
  const _registerCb = (key, cb) => {
    if (!script._cbs[key]) {
      cb(script.instance);
      return () => {
      };
    }
    let i = script._cbs[key].push(cb);
    const destroy = () => {
      if (i) {
        script._cbs[key]?.splice(i - 1, 1);
        i = null;
      }
    };
    onScopeDispose(destroy);
    return destroy;
  };
  script.onLoaded = (cb) => _registerCb("loaded", cb);
  script.onError = (cb) => _registerCb("error", cb);
  onScopeDispose(() => {
    script._triggerAbortController?.abort();
  });
}
function useScript$1(_input, _options) {
  const input = typeof _input === "string" ? { src: _input } : _input;
  const options = _options || {};
  const head = options?.head || /* @__PURE__ */ injectHead();
  options.head = head;
  const scope = getCurrentInstance();
  options.eventContext = scope;
  if (scope && typeof options.trigger === "undefined") {
    options.trigger = onMounted;
  } else if (isRef(options.trigger)) {
    const refTrigger = options.trigger;
    let off;
    options.trigger = new Promise((resolve) => {
      off = watch(refTrigger, (val) => {
        if (val) {
          resolve(true);
        }
      }, {
        immediate: true
      });
      onScopeDispose(() => resolve(false), true);
    }).then((val) => {
      off?.();
      return val;
    });
  }
  head._scriptStatusWatcher = head._scriptStatusWatcher || head.hooks.hook("script:updated", ({ script: s }) => {
    s._statusRef.value = s.status;
  });
  const script = useScript$2(head, input, options);
  script._statusRef = script._statusRef || ref(script.status);
  registerVueScopeHandlers(script, scope);
  return new Proxy(script, {
    get(_, key, a) {
      return Reflect.get(_, key === "status" ? "_statusRef" : key, a);
    }
  });
}
function resolveTrigger(trigger) {
  return null;
}
function useNuxtScriptRuntimeConfig() {
  return useRuntimeConfig().public["nuxt-scripts"];
}
function resolveScriptKey(input) {
  return input.key || input.src || (typeof input.innerHTML === "string" ? input.innerHTML : "");
}
function useScript(input, options) {
  input = typeof input === "string" ? { src: input } : input;
  options = defu(options, useNuxtScriptRuntimeConfig()?.defaultScriptOptions);
  if (options.trigger && typeof options.trigger === "object" && !("then" in options.trigger)) {
    resolveTrigger(options.trigger);
  }
  const id = String(resolveScriptKey(input));
  const nuxtApp = useNuxtApp();
  options.head = options.head || injectHead$1();
  if (!options.head) {
    throw new Error("useScript() has been called without Nuxt context.");
  }
  nuxtApp.$scripts = nuxtApp.$scripts || reactive({});
  !!nuxtApp.$scripts?.[id];
  const err = options._validate?.();
  if (options.trigger === "onNuxtReady" || options.trigger === "client") {
    if (!options.warmupStrategy) {
      options.warmupStrategy = "preload";
    }
    if (options.trigger === "onNuxtReady") {
      options.trigger = onNuxtReady;
    }
  }
  const instance = useScript$1(input, options);
  const _remove = instance.remove;
  instance.remove = () => {
    nuxtApp.$scripts[id] = void 0;
    return _remove();
  };
  const _load = instance.load;
  instance.load = async () => {
    if (err) {
      return Promise.reject(err);
    }
    return _load();
  };
  nuxtApp.$scripts[id] = instance;
  return instance;
}
Object.freeze(
  Object.assign(
    () => {
    },
    { __mock__: true }
  )
);
function scriptRuntimeConfig(key) {
  return (useRuntimeConfig().public.scripts || {})[key];
}
function useRegistryScript(registryKey, optionsFn, _userOptions) {
  const scriptConfig = scriptRuntimeConfig(registryKey);
  const userOptions = Object.assign(_userOptions || {}, typeof scriptConfig === "object" ? scriptConfig : {});
  const options = optionsFn(userOptions, { scriptInput: userOptions.scriptInput });
  let finalScriptInput = options.scriptInput;
  const userSrc = userOptions.scriptInput?.src;
  const optionsSrc = options.scriptInput?.src;
  if (userSrc && optionsSrc && typeof optionsSrc === "string" && typeof userSrc === "string") {
    const defaultUrl = parseURL(optionsSrc);
    const customUrl = parseURL(userSrc);
    const defaultQuery = parseQuery(defaultUrl.search || "");
    const customQuery = parseQuery(customUrl.search || "");
    const mergedQuery = { ...defaultQuery, ...customQuery };
    const baseUrl = customUrl.href?.split("?")[0] || userSrc;
    finalScriptInput = {
      ...options.scriptInput || {},
      src: withQuery(baseUrl, mergedQuery)
    };
  }
  const scriptInput = defu(finalScriptInput, userOptions.scriptInput, { key: registryKey });
  const scriptOptions = Object.assign(userOptions?.scriptOptions || {}, options.scriptOptions || {});
  const init = scriptOptions.beforeInit;
  scriptOptions.beforeInit = () => {
    init?.();
  };
  return useScript(scriptInput, scriptOptions);
}
function useScriptCloudflareTurnstile(userOptions) {
  return useRegistryScript("cloudflareTurnstile", () => ({
    scriptInput: {
      src: "https://challenges.cloudflare.com/turnstile/v0/api.js"
    },
    scriptOptions: {
      use: () => (void 0).turnstile
    }
  }), userOptions);
}
function useScriptTriggerElement(options) {
  const { el, trigger } = options;
  const triggers = (Array.isArray(options.trigger) ? options.trigger : [options.trigger]).filter(Boolean);
  if (!trigger || triggers.includes("immediate") || triggers.includes("onNuxtReady")) {
    return "onNuxtReady";
  }
  if (triggers.some((t) => ["visibility", "visible"].includes(t))) {
    {
      return new Promise(() => {
      });
    }
  }
  const ssrAttrs = {};
  {
    triggers.forEach((trigger2) => {
      ssrAttrs[`on${trigger2}`] = `this.dataset.script_${trigger2} = true`;
    });
  }
  const p = new Promise((resolve) => {
    const target = typeof el !== "undefined" ? el : (void 0).body;
    const _ = useEventListener(
      target,
      triggers,
      () => {
        _();
        resolve(true);
      },
      { once: true, passive: true }
    );
    tryOnMounted(() => {
      watch(target, ($el) => {
        if ($el) {
          triggers.forEach((trigger2) => {
            if ($el.dataset[`script_${trigger2}`]) {
              _();
              resolve(true);
            }
          });
        }
      }, {
        immediate: true
      });
    });
    tryOnScopeDispose(() => resolve(false));
  });
  return Object.assign(p, { ssrAttrs });
}
const _sfc_main$1 = {
  __name: "NuxtTurnstile",
  __ssrInlineRender: true,
  props: {
    modelValue: { type: String, required: false },
    trigger: { type: [String, Array, Boolean], required: false },
    element: { type: String, required: false, default: "div" },
    siteKey: { type: String, required: false },
    options: { type: Object, required: false, default: () => ({}) },
    resetInterval: { type: Number, required: false, default: 1e3 * 250 }
  },
  emits: ["update:modelValue"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    useRuntimeConfig().public.turnstile;
    const el = ref();
    ref(false);
    const { onLoaded } = useScriptCloudflareTurnstile({
      scriptOptions: {
        trigger: useScriptTriggerElement({ trigger: props.trigger, el })
      }
    });
    const reset = () => {
    };
    __expose({ reset });
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderVNode(_push, createVNode(resolveDynamicComponent(__props.element), mergeProps({
        ref_key: "el",
        ref: el
      }, _attrs), null), _parent);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxtjs/turnstile/dist/runtime/components/NuxtTurnstile.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "AdminLogin" },
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { options } = useAppOptions();
    const appName = computed(() => options.value.data?.name || "VENUE UNDIP");
    useHead({
      title: "Login Admin - VENUE UNDIP",
      meta: [
        { name: "description", content: "Halaman login untuk administrator VENUE UNDIP" }
      ]
    });
    const email = ref("");
    const password = ref("");
    const token = ref(void 0);
    const loading = ref(false);
    const errorMsg = ref(null);
    const errorField = ref(null);
    const passwordFieldType = ref("password");
    useRouter();
    useRoute();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtTurnstile = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex min-h-screen flex-col items-center justify-center bg-ds-gradient-blue px-4 py-8 md:py-0 relative overflow-hidden" }, _attrs))} data-v-92363c02><div class="absolute inset-0 overflow-hidden pointer-events-none" data-v-92363c02><div class="absolute -top-40 -right-40 w-80 h-80 bg-ds-blue-600/10 rounded-full blur-3xl" data-v-92363c02></div><div class="absolute -bottom-40 -left-40 w-80 h-80 bg-ds-blue-700/10 rounded-full blur-3xl" data-v-92363c02></div></div><div class="flex flex-col items-center mb-6 md:mb-3 relative z-10 animate-fade-in" data-v-92363c02><div class="flex justify-center mb-3 md:mb-2 transform transition-transform duration-300 hover:scale-105" data-v-92363c02><div class="relative" data-v-92363c02><img${ssrRenderAttr("src", _imports_0)} alt="Venue UNDIP Logo" class="w-20 h-20 sm:w-20 sm:h-20 md:w-16 md:h-16 object-contain relative z-10 drop-shadow-2xl" data-v-92363c02></div></div><h1 class="text-2xl sm:text-3xl md:text-2xl font-bold text-ds-surface tracking-wide drop-shadow-lg text-center" data-v-92363c02>${ssrInterpolate(unref(appName))}</h1><div class="mt-2 h-0.5 w-16 bg-gradient-to-r from-transparent via-white to-transparent rounded-full" data-v-92363c02></div></div><div class="flex w-full max-w-sm flex-col items-center rounded-2xl border border-white/10 bg-white/95 backdrop-blur-xl px-5 sm:px-6 py-7 md:py-4 text-center shadow-2xl relative z-10 animate-slide-up mx-auto" data-v-92363c02><div class="mb-6 md:mb-3" data-v-92363c02><h2 class="text-xl md:text-lg font-bold text-ds-blue-900 mb-1.5 tracking-tight" data-v-92363c02>Operator Login</h2><p class="text-xs text-ds-muted" data-v-92363c02> Masukkan kredensial Anda untuk melanjutkan </p></div><form class="grid gap-4 md:gap-3 w-full text-left" data-v-92363c02><label class="grid gap-1.5" data-v-92363c02><span class="text-xs font-semibold text-ds-text flex items-center gap-1.5" data-v-92363c02><svg class="w-3.5 h-3.5 text-ds-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-92363c02><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" data-v-92363c02></path></svg> Email </span><div class="${ssrRenderClass([
        "relative flex items-center rounded-lg border-2 px-3 h-10 md:h-9 transition-all duration-300",
        unref(errorField) === "email" ? "border-red-500 bg-red-50/50 ring-4 ring-red-100" : "border-gray-200 bg-gray-50/50 focus-within:border-ds-blue-600 focus-within:bg-white focus-within:ring-4 focus-within:ring-ds-blue-100"
      ])}" data-v-92363c02><input${ssrRenderAttr("value", unref(email))} type="email" required placeholder="nama@email.com" autocomplete="email" class="flex-1 bg-transparent text-sm text-ds-text placeholder:text-ds-muted/60 outline-none" data-v-92363c02></div></label><label class="grid gap-1.5" data-v-92363c02><span class="text-xs font-semibold text-ds-text flex items-center gap-1.5" data-v-92363c02><svg class="w-3.5 h-3.5 text-ds-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-92363c02><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" data-v-92363c02></path></svg> Password </span><div class="${ssrRenderClass([
        "relative flex items-center rounded-lg border-2 px-3 h-10 md:h-9 transition-all duration-300",
        unref(errorField) === "password" ? "border-red-500 bg-red-50/50 ring-4 ring-red-100" : "border-gray-200 bg-gray-50/50 focus-within:border-ds-blue-600 focus-within:bg-white focus-within:ring-4 focus-within:ring-ds-blue-100"
      ])}" data-v-92363c02><input${ssrRenderDynamicModel(unref(passwordFieldType), unref(password), null)}${ssrRenderAttr("type", unref(passwordFieldType))} required placeholder="Masukkan password Anda" autocomplete="current-password" class="flex-1 bg-transparent text-sm text-ds-text placeholder:text-ds-muted/60 outline-none pr-2" data-v-92363c02><button type="button" class="flex items-center justify-center text-ds-muted hover:text-ds-blue-700 transition-colors duration-200 p-1 rounded-md hover:bg-ds-blue-50" tabindex="-1" data-v-92363c02>`);
      if (unref(passwordFieldType) === "password") {
        _push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="w-5 h-5" data-v-92363c02><path d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17Z" fill="currentColor" data-v-92363c02></path><circle cx="12" cy="12" r="2.5" fill="currentColor" data-v-92363c02></circle></svg>`);
      } else {
        _push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="w-5 h-5" data-v-92363c02><path d="M12 7C14.76 7 17 9.24 17 12C17 12.65 16.87 13.26 16.64 13.83L19.56 16.75C21.07 15.49 22.26 13.86 22.99 12C21.26 7.61 17 4.5 12 4.5C10.59 4.5 9.25 4.75 8.01 5.2L10.17 7.36C10.74 7.13 11.35 7 12 7ZM2 4.27L4.28 6.55L4.74 7.01C3.08 8.3 1.78 10.02 1 12C2.73 16.39 7 19.5 12 19.5C13.55 19.5 15.03 19.2 16.38 18.66L16.8 19.08L19.73 22L21 20.73L3.27 3L2 4.27ZM7.53 9.8L9.08 11.35C9.03 11.56 9 11.78 9 12C9 13.66 10.34 15 12 15C12.22 15 12.44 14.97 12.65 14.92L14.2 16.47C13.53 16.8 12.79 17 12 17C9.24 17 7 14.76 7 12C7 11.21 7.2 10.47 7.53 9.8Z" fill="currentColor" data-v-92363c02></path></svg>`);
      }
      _push(`</button></div></label><div class="grid gap-1.5" data-v-92363c02><span class="text-xs font-semibold text-ds-text flex items-center gap-1.5" data-v-92363c02><svg class="w-3.5 h-3.5 text-ds-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-92363c02><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" data-v-92363c02></path></svg> Verifikasi Keamanan </span><div class="${ssrRenderClass([
        "relative flex items-center justify-center rounded-lg border-2 p-3 transition-all duration-300 min-h-[70px] md:min-h-[60px]",
        unref(errorField) === "token" ? "border-red-500 bg-red-50/50" : unref(token) ? "border-green-500 bg-green-50/30" : "border-gray-200 bg-gray-50/50"
      ])}" data-v-92363c02>`);
      if (unref(token)) {
        _push(`<div class="absolute top-1.5 right-1.5 flex items-center gap-1 px-2 py-1 bg-green-50 border border-green-200 rounded-md shadow-sm" data-v-92363c02><svg class="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20" data-v-92363c02><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" data-v-92363c02></path></svg><span class="text-[10px] font-semibold text-green-700" data-v-92363c02>Terverifikasi</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_NuxtTurnstile, {
        modelValue: unref(token),
        "onUpdate:modelValue": ($event) => isRef(token) ? token.value = $event : null
      }, null, _parent));
      _push(`</div>`);
      if (!unref(token) && !unref(errorField)) {
        _push(`<p class="text-[10px] text-ds-muted/70 text-center" data-v-92363c02> Sistem akan memverifikasi secara otomatis </p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (unref(errorMsg)) {
        _push(`<div class="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 animate-shake" data-v-92363c02><svg class="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" data-v-92363c02><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" data-v-92363c02></path></svg><p class="text-xs text-red-700 font-medium flex-1" data-v-92363c02>${ssrInterpolate(unref(errorMsg))}</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button type="submit"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} class="relative flex h-10 md:h-9 w-full items-center justify-center rounded-lg bg-gradient-to-r from-ds-blue-700 to-ds-blue-800 text-white font-semibold text-sm shadow-lg hover:shadow-xl hover:from-ds-blue-800 hover:to-ds-blue-900 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] overflow-hidden group" data-v-92363c02><span class="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" data-v-92363c02></span><span class="relative flex items-center gap-2" data-v-92363c02>`);
      if (unref(loading)) {
        _push(`<svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-v-92363c02><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" data-v-92363c02></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" data-v-92363c02></path></svg>`);
      } else {
        _push(`<!---->`);
      }
      _push(` ${ssrInterpolate(unref(loading) ? "Memproses..." : "Masuk")}</span></button></form><p class="mt-5 md:mt-3 text-[10px] text-ds-muted/80" data-v-92363c02> Sistem Booking Venue Olahraga Universitas Diponegoro </p></div><p class="mt-5 text-[10px] text-white/60 relative z-10" data-v-92363c02> © ${ssrInterpolate((/* @__PURE__ */ new Date()).getFullYear())} ${ssrInterpolate(unref(appName))}. All rights reserved. </p></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/login/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-92363c02"]]);

export { index as default };
//# sourceMappingURL=index-BUhWvN4G.mjs.map
