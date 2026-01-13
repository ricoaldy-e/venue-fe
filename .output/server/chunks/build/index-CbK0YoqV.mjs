import { _ as __nuxt_component_0 } from './server.mjs';
import { defineComponent, withAsyncContext, computed, mergeProps, withCtx, createBlock, createVNode, openBlock, unref, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderList, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { Icon } from '@iconify/vue';
import { u as useHead } from './composables-BHx0r5C2.mjs';
import { u as useAsyncData } from './asyncData-DN5Vrwgx.mjs';
import { u as useSearch } from './useSearch-CZIgd0ZN.mjs';
import { u as usePagination } from './usePagination-A_v6pkFW.mjs';
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
import 'vue-router';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'perfect-debounce';
import './constants-BG8e5vSv.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    useHead({
      title: "Kelola Fasilitas - VENUE UNDIP",
      meta: [
        { name: "description", content: "Kelola daftar fasilitas venue di VENUE UNDIP" }
      ]
    });
    const { data: facilities, pending, error, refresh } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "facilitiesList",
      () => $fetch("/api/facilities")
    )), __temp = await __temp, __restore(), __temp);
    const facilitiesRef = computed(() => facilities.value || []);
    const { searchQuery, filteredItems: filteredFacilities } = useSearch(
      facilitiesRef,
      (facility) => [facility.name, String(facility.id)]
    );
    const {
      currentPage,
      paginatedItems: paginatedFacilities,
      summary: paginationSummary,
      totalPages
    } = usePagination(filteredFacilities);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "flex w-full flex-col gap-6 sm:gap-8 pb-16" }, _attrs))}><header class="flex flex-col sm:flex-row sm:items-center justify-between gap-6"><div class="flex items-start gap-4"><div class="p-3 bg-blue-50 rounded-xl border border-blue-100 shrink-0 hidden sm:flex items-center justify-center"><svg class="w-6 h-6 text-blue-800" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M11 19V17H13V19H11ZM11 15V13H13V15H11ZM7 15V13H9V15H7ZM7 11V9H9V11H7ZM11 11V9H13V11H11ZM15 11V9H17V11H15ZM15 7V5H17V7H15ZM11 7V5H13V7H11ZM5 7V5H7V7H5ZM5 11V9H3V11H5ZM5 15V13H3V15H5ZM5 19V17H3V19H5ZM15 19V17H17V19H15ZM19 19V17H21V19H19ZM19 15V13H21V15H19ZM19 11V9H21V11H19ZM19 7V5H21V7H19ZM15 3V5H9V3H15Z"></path></svg></div><div><h1 class="text-2xl uppercase font-bold text-gray-900 tracking-tight">Manajemen Fasilitas</h1><p class="text-sm text-gray-500 mt-1"> Kelola master data fasilitas umum seperti toilet, kantin, area parkir, dan lainnya. </p></div></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/facilities/create",
        class: "w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 hover:shadow-md transition-all active:scale-95"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"${_scopeId}></path></svg><span${_scopeId}>Tambah Fasilitas</span>`);
          } else {
            return [
              (openBlock(), createBlock("svg", {
                class: "h-5 w-5",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24"
              }, [
                createVNode("path", {
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                  "stroke-width": "2",
                  d: "M12 4v16m8-8H4"
                })
              ])),
              createVNode("span", null, "Tambah Fasilitas")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</header><div class="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden flex flex-col"><div class="p-5 border-b border-gray-300 bg-gray-50/30 flex flex-col md:flex-row justify-between items-center gap-4"><div class="relative w-full md:max-w-xs"><div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></div><input${ssrRenderAttr("value", unref(searchQuery))} type="search" class="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-500 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 transition-shadow" placeholder="Cari fasilitas berdasarkan nama atau ID..."></div></div>`);
      if (unref(error)) {
        _push(`<div class="p-6"><div class="rounded-xl border border-red-200 bg-red-50 p-4 flex items-center gap-3 text-red-700"><svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><div class="text-sm font-medium">${ssrInterpolate(unref(error)?.message || "Terjadi kesalahan saat memuat data.")} <button class="underline ml-1 font-bold hover:text-red-800">Coba lagi</button></div></div></div>`);
      } else if (unref(pending)) {
        _push(`<div class="p-12 text-center"><div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-100 border-t-blue-600 mb-4"></div><p class="text-sm text-gray-500 font-medium">Memuat data fasilitas...</p></div>`);
      } else if (unref(filteredFacilities).length === 0) {
        _push(`<div class="flex flex-col items-center justify-center py-16 text-center"><div class="p-4 bg-gray-50 rounded-full mb-3"><svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg></div><h3 class="text-base font-bold text-gray-900">Data tidak ditemukan</h3><p class="text-sm text-gray-500 mt-1 max-w-xs mx-auto">${ssrInterpolate(unref(searchQuery) ? `Tidak ada hasil untuk "${unref(searchQuery)}"` : "Belum ada fasilitas yang terdaftar.")}</p>`);
        if (unref(searchQuery)) {
          _push(`<button class="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700"> Bersihkan Pencarian </button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!--[--><div class="hidden md:block overflow-x-auto"><table class="w-full text-left border-collapse"><thead><tr class="bg-gray-50/50 border-b border-gray-300"><th class="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-left w-2/5">Nama Fasilitas</th><th class="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center w-1/5">Simbol / Ikon</th><th class="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center w-1/5">Aksi</th></tr></thead><tbody class="divide-y divide-gray-300"><!--[-->`);
        ssrRenderList(unref(paginatedFacilities), (facility) => {
          _push(`<tr class="group hover:bg-gray-100 transition-colors duration-200"><td class="px-6 py-4 align-middle"><div class="flex flex-col"><span class="text-sm font-bold text-gray-900 group-hover:text-blue-700 transition-colors">${ssrInterpolate(facility.name)}</span><span class="text-xs text-gray-400">ID: #${ssrInterpolate(facility.id)}</span></div></td><td class="px-6 py-4 text-center align-middle"><div class="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gray-50 border border-gray-300 text-gray-600">`);
          if (facility.icon) {
            _push(ssrRenderComponent(unref(Icon), {
              icon: facility.icon,
              class: "h-5 w-5"
            }, null, _parent));
          } else {
            _push(`<span class="text-xs text-gray-400">-</span>`);
          }
          _push(`</div></td><td class="px-6 py-4 text-center align-middle">`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/admin/facilities/${facility.id}`,
            class: "text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline decoration-2 underline-offset-2 transition-all"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Edit `);
              } else {
                return [
                  createTextVNode(" Edit ")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</td></tr>`);
        });
        _push(`<!--]--></tbody></table></div><div class="md:hidden flex flex-col gap-3 p-4 bg-gray-50 border-t border-gray-300"><!--[-->`);
        ssrRenderList(unref(paginatedFacilities), (facility) => {
          _push(`<div class="bg-white rounded-xl border border-gray-300 p-4 shadow-sm hover:shadow-md transition-all duration-200"><div class="flex items-center gap-4"><div class="shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-blue-50 border border-blue-100 text-blue-600">`);
          if (facility.icon) {
            _push(ssrRenderComponent(unref(Icon), {
              icon: facility.icon,
              class: "h-6 w-6"
            }, null, _parent));
          } else {
            _push(`<span class="text-xs font-bold text-blue-300">?</span>`);
          }
          _push(`</div><div class="flex-1 min-w-0"><h3 class="text-sm font-bold text-gray-900 truncate">${ssrInterpolate(facility.name)}</h3><p class="text-xs text-gray-500 mt-0.5">System ID: #${ssrInterpolate(facility.id)}</p></div><div class="shrink-0">`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/admin/facilities/${facility.id}`,
            class: "text-sm font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Edit `);
              } else {
                return [
                  createTextVNode(" Edit ")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div></div></div>`);
        });
        _push(`<!--]--></div><!--]-->`);
      }
      if (!unref(pending) && unref(totalPages) > 1) {
        _push(`<nav class="flex flex-col-reverse items-center justify-between gap-4 border-t border-gray-300 p-5 sm:flex-row bg-gray-50/50"><span class="text-xs text-gray-500 font-medium">${ssrInterpolate(unref(paginationSummary))}</span><div class="flex items-center gap-2"><button${ssrIncludeBooleanAttr(unref(currentPage) === 1) ? " disabled" : ""} class="p-2 rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"><svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"></path></svg></button><div class="px-4 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-bold text-gray-700 shadow-sm">${ssrInterpolate(unref(currentPage))} / ${ssrInterpolate(unref(totalPages))}</div><button${ssrIncludeBooleanAttr(unref(currentPage) === unref(totalPages)) ? " disabled" : ""} class="p-2 rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"><svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"></path></svg></button></div></nav>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/facilities/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-CbK0YoqV.mjs.map
