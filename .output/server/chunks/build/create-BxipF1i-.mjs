import { _ as __nuxt_component_0 } from './server.mjs';
import { defineComponent, ref, computed, mergeProps, withCtx, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrIncludeBooleanAttr, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrRenderClass, ssrLooseEqual } from 'vue/server-renderer';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import { V as VALID_FACILITY_ICONS, a as availableIconsWithId } from './validIconList-DAEULMGW.mjs';
import { u as useHead } from './composables-BHx0r5C2.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'better-sqlite3';
import 'ipx';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "create",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Tambah Fasilitas - VENUE UNDIP",
      meta: [
        { name: "description", content: "Tambah fasilitas baru ke VENUE UNDIP" }
      ]
    });
    useRouter();
    const form = ref({
      name: "",
      icon: VALID_FACILITY_ICONS[0]
    });
    const loading = ref(false);
    const errorMsg = ref(null);
    const searchQuery = ref("");
    const filteredIcons = computed(() => {
      if (!searchQuery.value.trim()) return availableIconsWithId;
      const query = searchQuery.value.toLowerCase().trim();
      return availableIconsWithId.filter(
        (icon) => icon.name.toLowerCase().includes(query)
      );
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "flex w-full flex-col gap-6 sm:gap-8 pb-12 relative" }, _attrs))}><header class="flex flex-col sm:flex-row sm:items-center justify-between gap-6"><div class="flex items-start gap-4"><div class="p-3 bg-blue-50 rounded-xl border border-blue-100 shrink-0 hidden sm:flex items-center justify-center"><svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg></div><div><h1 class="text-2xl uppercase font-bold text-gray-900 tracking-tight">Tambah Fasilitas</h1><p class="text-sm text-gray-500 mt-1"> Buat master data fasilitas baru (mis: Toilet, Kantin, WiFi). </p></div></div><div class="hidden sm:flex items-center gap-3">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/facilities",
        class: "inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-bold text-gray-700 shadow-sm transition-all active:scale-95 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Batal `);
          } else {
            return [
              createTextVNode(" Batal ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<button type="submit" form="create-facility-form"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} class="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-700 hover:shadow-md transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed">`);
      if (loading.value) {
        _push(`<svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<span>${ssrInterpolate(loading.value ? "Menyimpan..." : "Simpan Fasilitas")}</span></button></div></header><form id="create-facility-form" class="flex flex-col gap-8 max-w-5xl mx-auto w-full"><div class="w-full"><div class="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden"><div class="p-5 border-b border-gray-200 bg-gray-50/50"><h3 class="text-base font-bold text-gray-900">Informasi Dasar</h3><p class="text-xs text-gray-500 mt-0.5">Detail utama fasilitas.</p></div><div class="p-6 space-y-4"><div class="space-y-1.5"><label class="block text-xs font-bold text-gray-700 uppercase tracking-wider">Nama Fasilitas <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", form.value.name)} type="text" required placeholder="Mis: Toilet, WiFi, Kantin" class="block w-full rounded-xl border border-gray-300 pl-4 pr-4 py-3 text-sm font-medium text-gray-900 focus:border-blue-500 focus:ring-blue-500 shadow-sm transition-all">`);
      if (errorMsg.value && errorMsg.value.includes("Nama fasilitas")) {
        _push(`<p class="mt-2 text-xs text-red-600 font-medium flex items-start gap-1.5"><svg class="w-3.5 h-3.5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><span>${ssrInterpolate(errorMsg.value)}</span></p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div></div><div class="w-full"><div class="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden"><div class="p-5 border-b border-gray-200 bg-gray-50/50"><h3 class="text-base font-bold text-gray-900">Pilih Visual Ikon</h3><p class="text-xs text-gray-500 mt-0.5">Pilih simbol yang paling merepresentasikan fasilitas ini.</p></div><div class="p-6"><div class="mb-6"><div class="relative"><div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5"><svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></div><input${ssrRenderAttr("value", searchQuery.value)} type="text" placeholder="Cari ikon... (mis: toilet, wifi, parkir)" class="block w-full rounded-xl border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all">`);
      if (searchQuery.value) {
        _push(`<button type="button" class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"><svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><p class="mt-2 text-xs text-gray-500 flex items-center gap-1.5"><span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px]">${ssrInterpolate(unref(filteredIcons).length)}</span> ${ssrInterpolate(unref(filteredIcons).length === unref(availableIconsWithId).length ? "Semua ikon tersedia" : `ikon ditemukan dari ${unref(availableIconsWithId).length} total`)}</p></div>`);
      if (unref(filteredIcons).length === 0) {
        _push(`<div class="flex flex-col items-center justify-center py-12 px-4 text-center"><div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4"><svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></div><h4 class="text-sm font-semibold text-gray-900 mb-1">Tidak ada ikon ditemukan</h4><p class="text-xs text-gray-500 mb-4">Coba gunakan kata kunci lain seperti &quot;toilet&quot;, &quot;wifi&quot;, atau &quot;parkir&quot;</p><button type="button" class="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg> Tampilkan semua ikon </button></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(filteredIcons).length > 0) {
        _push(`<div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3"><!--[-->`);
        ssrRenderList(unref(filteredIcons), (icon) => {
          _push(`<label class="${ssrRenderClass([[form.value.icon === icon.value ? "border-blue-500 bg-blue-50/50 shadow-md ring-1 ring-blue-500/20" : "border-gray-200 bg-white hover:border-blue-400 hover:bg-blue-50/30 hover:shadow-sm"], "group relative flex flex-col items-center justify-center p-3 rounded-xl border cursor-pointer transition-all duration-200"])}"><input type="radio"${ssrIncludeBooleanAttr(ssrLooseEqual(form.value.icon, icon.value)) ? " checked" : ""}${ssrRenderAttr("value", icon.value)} class="sr-only">`);
          if (form.value.icon === icon.value) {
            _push(`<div class="absolute top-2 right-2 bg-blue-500 rounded-full p-0.5 shadow-sm"><svg class="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(ssrRenderComponent(unref(Icon), {
            icon: icon.value,
            class: ["w-8 h-8 mb-2 transition-transform duration-200 group-hover:scale-110", form.value.icon === icon.value ? "text-blue-600" : "text-gray-400 group-hover:text-blue-500"]
          }, null, _parent));
          _push(`<span class="${ssrRenderClass([form.value.icon === icon.value ? "text-blue-700 font-bold" : "text-gray-600 group-hover:text-blue-600", "text-[10px] font-medium text-center leading-tight transition-colors"])}">${ssrInterpolate(icon.name)}</span></label>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<p class="mt-6 text-xs text-center text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-200"> 💡 Ikon ini akan muncul pada kartu stadion dan halaman detail venue. </p></div></div></div><div class="sm:hidden flex flex-col gap-3 mt-4"><button type="submit"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} class="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-bold text-white shadow-sm active:bg-blue-700 disabled:opacity-70">`);
      if (loading.value) {
        _push(`<svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<span>${ssrInterpolate(loading.value ? "Menyimpan..." : "Simpan Fasilitas")}</span></button>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/facilities",
        class: "w-full flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-sm font-bold text-gray-700 active:bg-gray-50"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Batal `);
          } else {
            return [
              createTextVNode(" Batal ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></form></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/facilities/create.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=create-BxipF1i-.mjs.map
