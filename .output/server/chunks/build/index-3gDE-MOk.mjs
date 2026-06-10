import { defineComponent, computed, withAsyncContext, ref, reactive, watch, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderAttr } from 'vue/server-renderer';
import { u as useAppOptions } from './server.mjs';
import { u as useHead } from './composables-D8u1NqZw.mjs';
import { u as useAsyncData } from './asyncData-DCHdo3Ys.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "AdminSchedules" },
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { options: appOptions } = useAppOptions();
    const appName = computed(() => appOptions.value.data?.name || "VENUE UNDIP");
    useHead({
      title: "Jadwal Operasional - VENUE UNDIP",
      meta: [
        { name: "description", content: "Kelola jadwal operasional venue di VENUE UNDIP" }
      ]
    });
    const FALLBACK_HOURS = { openHour: 8, closeHour: 22 };
    const { data: operatingHours, pending, error, refresh } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "operating-hours",
      () => $fetch("/api/operating-hours")
    )), __temp = await __temp, __restore(), __temp);
    const editing = ref(false);
    const submitting = ref(false);
    const submitError = ref(null);
    ref(null);
    const formState = reactive({
      open: "",
      close: ""
    });
    const padHour = (hour) => String(hour).padStart(2, "0");
    const toTimeInputValue = (hour) => {
      if (typeof hour !== "number" || Number.isNaN(hour)) return "";
      const bounded = Math.min(24, Math.max(0, hour));
      return `${padHour(bounded)}:00`;
    };
    const displayHour = (hour) => {
      if (typeof hour !== "number" || Number.isNaN(hour)) return "-";
      const bounded = Math.min(24, Math.max(0, hour));
      return `${padHour(bounded)}:00 WIB`;
    };
    const syncFormFromData = () => {
      const source = operatingHours.value ?? FALLBACK_HOURS;
      formState.open = toTimeInputValue(source.openHour);
      formState.close = toTimeInputValue(source.closeHour);
    };
    watch(
      () => operatingHours.value,
      () => {
        if (!editing.value) {
          syncFormFromData();
        }
      },
      { immediate: true }
    );
    watch(editing, (isEditing) => {
      if (!isEditing) {
        submitError.value = null;
        syncFormFromData();
      }
    });
    const hasExistingHours = computed(() => Boolean(operatingHours.value));
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "flex w-full flex-col gap-6 sm:gap-8 pb-16 max-w-7xl mx-auto" }, _attrs))}><header class="flex flex-col sm:flex-row sm:items-center justify-between gap-6"><div class="flex items-start gap-4"><div class="p-3 bg-blue-50 rounded-xl border border-blue-100 shrink-0 hidden sm:flex items-center justify-center"><svg class="w-6 h-6 text-blue-800" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M7 3V5H5C3.9 5 3 5.9 3 7V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V7C21 5.9 20.1 5 19 5H17V3H15V5H9V3H7ZM5 9H19V19H5V9ZM7 11V13H12V11H7ZM13 11V13H17V11H13ZM7 15V17H12V15H7ZM13 15V17H17V15H13Z"></path></svg></div><div><h1 class="text-2xl uppercase font-bold text-gray-900 tracking-tight">Kelola Jadwal</h1><p class="text-sm text-gray-500 mt-1"> Atur jam operasional venue untuk membatasi ketersediaan pemesanan. </p></div></div>`);
      if (!editing.value) {
        _push(`<button type="button" class="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm sm:hover:bg-blue-700 sm:hover:shadow-md transition-all active:scale-[0.98]"${ssrIncludeBooleanAttr(unref(pending) || Boolean(unref(error))) ? " disabled" : ""}><svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg><span>${ssrInterpolate(hasExistingHours.value ? "Ubah Jadwal Operasional" : "Set Jadwal Baru")}</span></button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</header><div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300">`);
      if (unref(pending)) {
        _push(`<div class="p-12 text-center"><div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-100 border-t-blue-600 mb-4"></div><p class="text-sm text-gray-500 font-medium">Memuat data jadwal...</p></div>`);
      } else if (unref(error)) {
        _push(`<div class="p-6"><div class="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700"><p class="font-semibold text-sm">Gagal memuat data: ${ssrInterpolate(unref(error).message)}</p><button class="mt-2 text-sm font-bold underline [@media(hover:hover)]:hover:text-red-800 active:text-red-800">Coba lagi</button></div></div>`);
      } else if (!editing.value) {
        _push(`<div class="p-6 sm:p-8"><div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"><div class="group relative overflow-hidden rounded-xl bg-white border border-gray-200 p-6 shadow-sm sm:hover:shadow-lg sm:hover:border-green-300 transition-all duration-300 cursor-pointer active:bg-gray-50"><div class="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br from-green-50 to-emerald-50 rounded-full opacity-50 sm:group-hover:opacity-70 transition-opacity"></div><div class="relative z-10"><div class="flex items-center gap-3 mb-4"><div class="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center sm:group-hover:bg-green-600 transition-colors"><svg class="w-6 h-6 text-green-600 sm:group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg></div><div class="flex-1"><p class="text-xs font-bold text-gray-500 uppercase tracking-wider">Jam Buka</p><p class="text-xs text-gray-500">Waktu operasional dimulai</p></div></div><p class="text-3xl font-black text-gray-900">${ssrInterpolate(displayHour(unref(operatingHours)?.openHour))}</p></div></div><div class="group relative overflow-hidden rounded-xl bg-white border border-gray-200 p-6 shadow-sm sm:hover:shadow-lg sm:hover:border-slate-300 transition-all duration-300 cursor-pointer active:bg-gray-50"><div class="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br from-slate-50 to-gray-100 rounded-full opacity-50 sm:group-hover:opacity-70 transition-opacity"></div><div class="relative z-10"><div class="flex items-center gap-3 mb-4"><div class="w-12 h-12 rounded-lg bg-slate-200 flex items-center justify-center sm:group-hover:bg-slate-600 transition-colors"><svg class="w-6 h-6 text-slate-600 sm:group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg></div><div class="flex-1"><p class="text-xs font-bold text-gray-500 uppercase tracking-wider">Jam Tutup</p><p class="text-xs text-gray-500">Waktu operasional berakhir</p></div></div><p class="text-3xl font-black text-gray-900">${ssrInterpolate(displayHour(unref(operatingHours)?.closeHour))}</p></div></div></div><div class="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border border-blue-200 p-5 shadow-sm"><div class="absolute -right-8 -top-8 w-32 h-32 bg-blue-200/30 rounded-full blur-2xl"></div><div class="relative z-10 flex items-start gap-4"><div class="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg"><svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div><div class="flex-1"><h4 class="text-sm font-bold text-blue-900 mb-1">Informasi Penting</h4><p class="text-sm text-blue-800 leading-relaxed"> Perubahan jadwal ini akan berlaku untuk semua lapangan yang terdaftar di <span class="font-bold">${ssrInterpolate(appName.value)}</span>. Pastikan tidak ada jadwal booking aktif yang berkonflik sebelum mengubah jam operasional. </p></div></div></div></div>`);
      } else {
        _push(`<div class="p-6 sm:p-8"><div class="max-w-5xl mx-auto"><div class="flex items-center justify-between mb-6 pb-4 border-b border-gray-200"><div><h2 class="text-lg font-bold text-gray-900">Edit Jadwal Operasional</h2><p class="text-xs text-gray-500 mt-1">Sesuaikan jam buka dan tutup venue.</p></div><button class="p-2 text-gray-400 sm:hover:text-gray-600 sm:hover:bg-gray-100 active:bg-gray-100 rounded-full transition-colors"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div><div class="relative overflow-hidden mb-8 flex items-start gap-4 p-5 rounded-2xl bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 border-2 border-amber-200 shadow-sm"><div class="absolute -right-8 -top-8 w-32 h-32 bg-amber-200/30 rounded-full blur-2xl"></div><div class="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center flex-shrink-0 shadow-lg relative z-10"><svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg></div><div class="flex-1 relative z-10"><p class="text-sm font-bold text-amber-900 mb-1">Perhatian Penting</p><p class="text-sm text-amber-800 leading-relaxed"> Mengubah jam operasional dapat mempengaruhi slot booking yang tersedia di halaman publik. Pastikan perubahan ini sudah sesuai dengan kebijakan venue sebelum disimpan. </p></div></div><form class="space-y-8 bg-white p-8 rounded-2xl border-2 border-gray-200 shadow-xl"><div><h3 class="text-base font-bold text-gray-900 mb-1 flex items-center gap-2"><div class="w-1 h-5 bg-blue-600 rounded-full"></div> Waktu Operasional </h3><p class="text-xs text-gray-500 mb-5 ml-3">Tentukan jam buka dan tutup venue</p><div class="grid gap-6 sm:grid-cols-2"><div class="space-y-2"><label class="block text-xs font-bold text-gray-700 uppercase tracking-wider">Jam Buka (WIB)</label><div class="relative group"><div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><svg class="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg></div><select class="block w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 shadow-sm appearance-none transition-all cursor-pointer [@media(hover:hover)]:hover:border-gray-400" required${ssrIncludeBooleanAttr(submitting.value) ? " disabled" : ""}><option value="" disabled${ssrIncludeBooleanAttr(Array.isArray(formState.open) ? ssrLooseContain(formState.open, "") : ssrLooseEqual(formState.open, "")) ? " selected" : ""}>Pilih jam buka</option><!--[-->`);
        ssrRenderList(24, (hour) => {
          _push(`<option${ssrRenderAttr("value", toTimeInputValue(hour - 1))}${ssrIncludeBooleanAttr(Array.isArray(formState.open) ? ssrLooseContain(formState.open, toTimeInputValue(hour - 1)) : ssrLooseEqual(formState.open, toTimeInputValue(hour - 1))) ? " selected" : ""}>${ssrInterpolate(padHour(hour - 1))}:00 </option>`);
        });
        _push(`<!--]--></select><div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"><svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></div></div></div><div class="space-y-2"><label class="block text-xs font-bold text-gray-700 uppercase tracking-wider">Jam Tutup (WIB)</label><div class="relative group"><div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><svg class="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg></div><select class="block w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 shadow-sm appearance-none transition-all cursor-pointer [@media(hover:hover)]:hover:border-gray-400" required${ssrIncludeBooleanAttr(submitting.value) ? " disabled" : ""}><option value="" disabled${ssrIncludeBooleanAttr(Array.isArray(formState.close) ? ssrLooseContain(formState.close, "") : ssrLooseEqual(formState.close, "")) ? " selected" : ""}>Pilih jam tutup</option><!--[-->`);
        ssrRenderList(24, (hour) => {
          _push(`<option${ssrRenderAttr("value", toTimeInputValue(hour))}${ssrIncludeBooleanAttr(Array.isArray(formState.close) ? ssrLooseContain(formState.close, toTimeInputValue(hour)) : ssrLooseEqual(formState.close, toTimeInputValue(hour))) ? " selected" : ""}>${ssrInterpolate(padHour(hour))}:00 </option>`);
        });
        _push(`<!--]--></select><div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"><svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></div></div></div></div></div>`);
        if (submitError.value) {
          _push(`<div class="p-4 rounded-xl bg-red-50 border-2 border-red-200 text-red-700 text-sm font-semibold flex items-center gap-3"><svg class="w-5 h-5 shrink-0 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> ${ssrInterpolate(submitError.value)}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 pt-6 border-t border-gray-200"><button type="button" class="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-bold text-gray-700 shadow-sm transition-all active:scale-[0.98] sm:hover:bg-blue-50 sm:hover:text-blue-700 sm:hover:border-blue-300"${ssrIncludeBooleanAttr(submitting.value) ? " disabled" : ""}> Batal </button><button type="submit" class="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm sm:hover:bg-blue-700 sm:hover:shadow-md transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"${ssrIncludeBooleanAttr(submitting.value) ? " disabled" : ""}>`);
        if (submitting.value) {
          _push(`<svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<span>${ssrInterpolate(submitting.value ? "Menyimpan..." : "Simpan Perubahan")}</span></button></div></form></div></div>`);
      }
      _push(`</div></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/schedules/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-3gDE-MOk.mjs.map
