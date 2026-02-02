import { _ as __nuxt_component_0 } from './nuxt-link-DqM75kvd.mjs';
import { defineComponent, computed, withAsyncContext, mergeProps, withCtx, createBlock, createVNode, openBlock, unref, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { u as useAppOptions } from './server.mjs';
import { u as useHead } from './composables-D8u1NqZw.mjs';
import { u as useAsyncData } from './asyncData-DCHdo3Ys.mjs';
import { u as useSearch, a as usePagination } from './usePagination-Ch3-eZSq.mjs';
import '../_/nitro.mjs';
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
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import './constants-BG8e5vSv.mjs';

const normalizeStadiumFromField = (field) => {
  if (field?.Stadion) {
    return {
      id: field.Stadion.id,
      name: field.Stadion.name
    };
  }
  if (field?.stadion) {
    return {
      id: field.stadion.id,
      name: field.stadion.name
    };
  }
  return null;
};
const getStadiumName = (field) => {
  const stadium = normalizeStadiumFromField(field);
  return stadium?.name || "Tidak ada stadion";
};
const normalizeFieldsArray = (fields) => {
  return fields.map((field) => {
    if (field.Stadion) {
      return field;
    }
    if (field.stadion) {
      return {
        ...field,
        Stadion: field.stadion
      };
    }
    return field;
  });
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { options } = useAppOptions();
    computed(() => options.value.data?.name || "VENUE UNDIP");
    useHead({
      title: "Kelola Lapangan - VENUE UNDIP",
      meta: [
        { name: "description", content: "Kelola daftar lapangan olahraga di VENUE UNDIP" }
      ]
    });
    const { data: rawFields, pending, error, refresh } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "fieldsList",
      () => $fetch("/api/fields")
    )), __temp = await __temp, __restore(), __temp);
    const normalizedFields = computed(() => normalizeFieldsArray(rawFields.value || []));
    const { searchQuery, filteredItems: filteredFields } = useSearch(
      normalizedFields,
      (field) => [
        field.name,
        String(field.id),
        getStadiumName(field)
      ]
    );
    const {
      currentPage,
      paginatedItems: paginatedFields,
      summary: paginationSummary,
      totalPages
    } = usePagination(filteredFields);
    const getStatusClasses = (status) => {
      return status === "ACTIVE" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200";
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "flex w-full flex-col gap-6 sm:gap-8 pb-16 max-w-7xl mx-auto" }, _attrs))}><header class="flex flex-col sm:flex-row sm:items-center justify-between gap-6"><div class="flex items-start gap-4"><div class="p-3 bg-blue-50 rounded-xl border border-blue-100 shrink-0 hidden sm:flex items-center justify-center"><svg class="w-6 h-6 text-blue-800" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M4 5C2.9 5 2 5.9 2 7V17C2 18.1 2.9 19 4 19H20C21.1 19 22 18.1 22 17V7C22 5.9 21.1 5 20 5H4ZM4 7H11V17H4V7ZM13 7H20V17H13V7ZM9 9C8.45 9 8 9.45 8 10C8 10.55 8.45 11 9 11C9.55 11 10 10.55 10 10C10 9.45 9.55 9 9 9ZM15 9C14.45 9 14 9.45 14 10C14 10.55 14.45 11 15 11C15.55 11 16 10.55 16 10C16 9.45 15.55 9 15 9Z"></path></svg></div><div><h1 class="text-2xl uppercase font-bold text-gray-900 tracking-tight">Kelola Lapangan</h1><p class="text-sm text-gray-500 mt-1"> Kelola data lapangan, tarif sewa, dan status ketersediaan. </p></div></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/fields/create",
        class: "w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm [@media(hover:hover)]:hover:bg-blue-700 [@media(hover:hover)]:hover:shadow-md transition-all active:scale-95"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"${_scopeId}></path></svg><span${_scopeId}>Tambah Lapangan</span>`);
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
              createVNode("span", null, "Tambah Lapangan")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</header><div class="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden flex flex-col"><div class="p-5 border-b border-gray-300 bg-gray-50/30 flex flex-col md:flex-row justify-between items-center gap-4"><div class="relative w-full md:max-w-xs"><div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></div><input${ssrRenderAttr("value", unref(searchQuery))} type="search" class="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-500 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 transition-shadow" placeholder="Cari lapangan atau stadion..."></div></div>`);
      if (unref(error)) {
        _push(`<div class="p-6"><div class="rounded-xl border border-red-200 bg-red-50 p-4 flex items-center gap-3 text-red-700"><svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><div class="text-sm font-medium">${ssrInterpolate(unref(error)?.message || "Terjadi kesalahan saat memuat data.")} <button class="underline ml-1 font-bold [@media(hover:hover)]:hover:text-red-800 active:text-red-800">Coba lagi</button></div></div></div>`);
      } else if (unref(pending)) {
        _push(`<div class="p-12 text-center"><div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-100 border-t-blue-600 mb-4"></div><p class="text-sm text-gray-500 font-medium">Memuat data lapangan...</p></div>`);
      } else if (unref(filteredFields).length === 0) {
        _push(`<div class="flex flex-col items-center justify-center py-16 text-center"><div class="p-4 bg-gray-50 rounded-full mb-3"><svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg></div><h3 class="text-base font-bold text-gray-900">Data tidak ditemukan</h3><p class="text-sm text-gray-500 mt-1 max-w-xs mx-auto">${ssrInterpolate(unref(searchQuery) ? `Tidak ada hasil untuk "${unref(searchQuery)}"` : "Belum ada lapangan yang terdaftar.")}</p>`);
        if (unref(searchQuery)) {
          _push(`<button class="mt-4 text-sm font-medium text-blue-600 [@media(hover:hover)]:hover:text-blue-700 active:text-blue-700"> Bersihkan Pencarian </button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!--[--><div class="hidden md:block overflow-x-auto"><table class="w-full text-left border-collapse"><thead><tr class="bg-gray-50/50 border-b border-gray-300"><th class="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-left">Info Lapangan</th><th class="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center">Harga / Jam</th><th class="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center">Status</th><th class="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center">Aksi</th></tr></thead><tbody class="divide-y divide-gray-300"><!--[-->`);
        ssrRenderList(unref(paginatedFields), (field) => {
          _push(`<tr class="group [@media(hover:hover)]:hover:bg-gray-100 transition-colors duration-200"><td class="px-6 py-4 align-middle"><div class="flex flex-col"><span class="text-sm font-bold text-gray-900 [@media(hover:hover)]:group-hover:text-blue-700 transition-colors">${ssrInterpolate(field.name)}</span><div class="flex items-center gap-1.5 mt-1"><svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg><span class="text-xs text-gray-500 font-medium">${ssrInterpolate(unref(getStadiumName)(field))}</span></div></div></td><td class="px-6 py-4 text-center align-middle"><span class="text-sm font-semibold text-gray-900"> Rp ${ssrInterpolate(field.pricePerHour.toLocaleString("id-ID"))}</span></td><td class="px-6 py-4 text-center align-middle"><span class="${ssrRenderClass([getStatusClasses(field.status), "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize shadow-sm"])}"><span class="${ssrRenderClass([field.status === "ACTIVE" ? "bg-green-500" : "bg-red-500", "w-1.5 h-1.5 rounded-full mr-1.5"])}"></span> ${ssrInterpolate(field.status === "ACTIVE" ? "Aktif" : "Non-Aktif")}</span></td><td class="px-6 py-4 text-center align-middle">`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/admin/fields/${field.id}`,
            class: "text-sm font-semibold text-blue-600 [@media(hover:hover)]:hover:text-blue-800 [@media(hover:hover)]:hover:underline decoration-2 underline-offset-2 transition-all"
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
        ssrRenderList(unref(paginatedFields), (field) => {
          _push(`<div class="bg-white rounded-xl border border-gray-300 p-4 shadow-sm [@media(hover:hover)]:hover:shadow-md transition-all duration-200"><div class="flex justify-between items-start gap-3"><div class="flex-1 min-w-0"><h3 class="text-sm font-bold text-gray-900 leading-tight line-clamp-2">${ssrInterpolate(field.name)}</h3><div class="flex items-center gap-1.5 mt-1.5 text-xs text-gray-500"><svg class="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg><span class="truncate">${ssrInterpolate(unref(getStadiumName)(field))}</span></div></div><span class="${ssrRenderClass([getStatusClasses(field.status), "shrink-0 inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold border capitalize"])}">${ssrInterpolate(field.status === "ACTIVE" ? "Aktif" : "Non-Aktif")}</span></div><div class="border-t border-gray-300 my-3"></div><div class="flex items-center justify-end">`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/admin/fields/${field.id}`,
            class: "text-sm font-semibold text-blue-600 [@media(hover:hover)]:hover:text-blue-800 [@media(hover:hover)]:hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
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
          _push(`</div></div>`);
        });
        _push(`<!--]--></div><!--]-->`);
      }
      if (!unref(pending) && unref(totalPages) > 1) {
        _push(`<nav class="flex flex-col-reverse items-center justify-between gap-4 border-t border-gray-300 p-5 sm:flex-row bg-gray-50/50"><span class="text-xs text-gray-500 font-medium">${ssrInterpolate(unref(paginationSummary))}</span><div class="flex items-center gap-2"><button${ssrIncludeBooleanAttr(unref(currentPage) === 1) ? " disabled" : ""} class="p-2 rounded-lg border border-gray-300 bg-white text-gray-600 [@media(hover:hover)]:hover:bg-gray-50 [@media(hover:hover)]:hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"><svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"></path></svg></button><div class="px-4 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-bold text-gray-700 shadow-sm">${ssrInterpolate(unref(currentPage))} / ${ssrInterpolate(unref(totalPages))}</div><button${ssrIncludeBooleanAttr(unref(currentPage) === unref(totalPages)) ? " disabled" : ""} class="p-2 rounded-lg border border-gray-300 bg-white text-gray-600 [@media(hover:hover)]:hover:bg-gray-50 [@media(hover:hover)]:hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"><svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"></path></svg></button></div></nav>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/fields/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-4wiuc9u9.mjs.map
