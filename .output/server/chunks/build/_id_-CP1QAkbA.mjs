import { _ as __nuxt_component_0 } from './nuxt-link-DqM75kvd.mjs';
import { defineComponent, computed, ref, withAsyncContext, mergeProps, withCtx, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrIncludeBooleanAttr, ssrInterpolate, ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrRenderClass, ssrLooseEqual } from 'vue/server-renderer';
import { useRouter, useRoute } from 'vue-router';
import { V as VALID_FACILITY_ICONS, a as availableIconsWithId } from './validIconList-DL-8OQus.mjs';
import { Icon } from '@iconify/vue';
import { u as useAppOptions, c as createError } from './server.mjs';
import { u as useHead } from './composables-D8u1NqZw.mjs';
import { u as useAsyncData } from './asyncData-BJ2gw_p3.mjs';
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
import 'vue3-lottie';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { options } = useAppOptions();
    computed(() => options.value.data?.name || "VENUE UNDIP");
    useHead({
      title: "Edit Fasilitas - VENUE UNDIP",
      meta: [
        { name: "description", content: "Edit detail fasilitas di VENUE UNDIP" }
      ]
    });
    useRouter();
    const route = useRoute();
    const facilityId = Number(route.params.id);
    const form = ref({
      name: "",
      icon: VALID_FACILITY_ICONS[0]
    });
    const searchQuery = ref("");
    const loading = ref(false);
    const loadingDelete = ref(false);
    const errorMsg = ref(null);
    const filteredIcons = computed(() => {
      if (!searchQuery.value.trim()) return availableIconsWithId;
      const query = searchQuery.value.toLowerCase();
      return availableIconsWithId.filter((icon) => icon.name.toLowerCase().includes(query));
    });
    function getValidIcon(icon) {
      return icon && VALID_FACILITY_ICONS.includes(icon) ? icon : VALID_FACILITY_ICONS[0];
    }
    const { data: facility, error: fetchError, pending: pagePending } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      `facility-${facilityId}`,
      () => $fetch(`/api/facilities/${facilityId}`)
    )), __temp = await __temp, __restore(), __temp);
    if (fetchError.value) {
      throw createError({
        statusCode: 404,
        statusMessage: "Fasilitas tidak ditemukan",
        fatal: true
      });
    }
    if (facility.value) {
      form.value.name = facility.value.name;
      form.value.icon = getValidIcon(facility.value.icon);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "flex w-full flex-col gap-6 sm:gap-8 pb-12 relative max-w-7xl mx-auto" }, _attrs))}><header class="flex flex-col sm:flex-row sm:items-center justify-between gap-6"><div class="flex items-start gap-4"><div class="p-3 bg-blue-50 rounded-xl border border-blue-100 shrink-0 hidden sm:flex items-center justify-center"><svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></div><div><h1 class="text-2xl uppercase font-bold text-gray-900 tracking-tight">Edit Fasilitas</h1><p class="text-sm text-gray-500 mt-1"> Perbarui informasi dan ikon fasilitas. </p></div></div><div class="hidden sm:flex items-center gap-3"><button type="button"${ssrIncludeBooleanAttr(loadingDelete.value || loading.value) ? " disabled" : ""} class="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-bold text-red-700 shadow-sm transition-all active:scale-95 hover:bg-red-100 hover:border-red-300 disabled:opacity-50">`);
      if (loadingDelete.value) {
        _push(`<svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<span>${ssrInterpolate(loadingDelete.value ? "Menghapus..." : "Hapus")}</span></button>`);
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
      _push(`<button type="submit" form="edit-facility-form"${ssrIncludeBooleanAttr(loading.value || loadingDelete.value) ? " disabled" : ""} class="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-700 hover:shadow-md transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed">`);
      if (loading.value) {
        _push(`<svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<span>${ssrInterpolate(loading.value ? "Menyimpan..." : "Simpan Perubahan")}</span></button></div></header>`);
      if (unref(pagePending)) {
        _push(`<div class="p-12 text-center rounded-2xl border border-gray-300 bg-white"><div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-100 border-t-blue-600 mb-4"></div><p class="text-sm text-gray-500 font-medium">Memuat data fasilitas...</p></div>`);
      } else if (errorMsg.value && !unref(facility)) {
        _push(`<div class="p-8 text-center rounded-2xl border border-red-200 bg-red-50 text-red-700"><p class="font-bold mb-2">Terjadi Kesalahan</p><p class="text-sm">${ssrInterpolate(errorMsg.value)}</p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/admin/facilities",
          class: "mt-4 inline-block underline hover:no-underline"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Kembali ke daftar`);
            } else {
              return [
                createTextVNode("Kembali ke daftar")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<form id="edit-facility-form" class="flex flex-col gap-8"><div class="w-full"><div class="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden"><div class="p-5 border-b border-gray-200 bg-gray-50/50"><h3 class="text-base font-bold text-gray-900">Informasi Dasar</h3><p class="text-xs text-gray-500 mt-0.5">Detail utama fasilitas.</p></div><div class="p-6 space-y-4"><div class="space-y-1.5"><label class="block text-xs font-bold text-gray-700 uppercase tracking-wider">Nama Fasilitas <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", form.value.name)} type="text" required placeholder="Contoh: Mushola" class="block w-full rounded-xl border border-gray-300 pl-4 pr-4 py-3 text-sm font-medium text-gray-900 focus:border-blue-500 focus:ring-blue-500 shadow-sm transition-all"></div></div></div></div><div class="w-full"><div class="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden"><div class="p-5 border-b border-gray-200 bg-gray-50/50"><h3 class="text-base font-bold text-gray-900">Pilih Visual Ikon</h3><p class="text-xs text-gray-500 mt-0.5">Pilih simbol yang paling merepresentasikan fasilitas ini.</p></div><div class="p-6"><div class="mb-5 relative"><div class="relative"><div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none"><svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></div><input${ssrRenderAttr("value", searchQuery.value)} type="text" placeholder="Cari ikon... (contoh: toilet, parkir, wifi)" class="block w-full rounded-xl border border-gray-300 pl-11 pr-10 py-3 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 shadow-sm transition-all">`);
        if (searchQuery.value) {
          _push(`<button type="button" class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="mt-2 flex items-center justify-between"><span class="text-xs text-gray-500"><span class="font-bold text-blue-600">${ssrInterpolate(filteredIcons.value.length)}</span> ikon ditemukan dari <span class="font-bold">${ssrInterpolate(unref(availableIconsWithId).length)}</span> total </span></div></div>`);
        if (filteredIcons.value.length > 0) {
          _push(`<div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3"><!--[-->`);
          ssrRenderList(filteredIcons.value, (icon) => {
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
          _push(`<div class="text-center py-12"><svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg><h3 class="mt-3 text-sm font-bold text-gray-900">Tidak ada ikon ditemukan</h3><p class="mt-1 text-xs text-gray-500">Coba kata kunci lain atau hapus filter pencarian</p><button type="button" class="mt-4 inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-bold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg> Reset Pencarian </button></div>`);
        }
        _push(`<p class="mt-6 text-xs text-center text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-200"> 💡 Ikon ini akan muncul pada kartu stadion dan halaman detail venue. </p></div></div></div><div class="sm:hidden flex flex-col gap-3 mt-4"><button type="submit"${ssrIncludeBooleanAttr(loading.value || loadingDelete.value) ? " disabled" : ""} class="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-bold text-white shadow-sm active:bg-blue-700 disabled:opacity-70">`);
        if (loading.value) {
          _push(`<svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<span>${ssrInterpolate(loading.value ? "Menyimpan..." : "Simpan Perubahan")}</span></button><div class="grid grid-cols-2 gap-3"><button type="button"${ssrIncludeBooleanAttr(loadingDelete.value) ? " disabled" : ""} class="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm font-bold text-red-700 active:bg-red-100">${ssrInterpolate(loadingDelete.value ? "..." : "Hapus")}</button>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/admin/facilities",
          class: "flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-sm font-bold text-gray-700 active:bg-gray-50"
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
        _push(`</div></div></form>`);
      }
      _push(`</section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/facilities/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-CP1QAkbA.mjs.map
