import { defineComponent, withAsyncContext, ref, reactive, watch, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrIncludeBooleanAttr, ssrInterpolate, ssrRenderAttr } from 'vue/server-renderer';
import { u as useHead } from './composables-B5D2SRP0.mjs';
import { u as useAsyncData } from './asyncData-VRyZt-9X.mjs';
import './server.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "AdminOptions" },
  __name: "options",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    useHead({
      title: "Option - VENUE UNDIP",
      meta: [
        { name: "description", content: "Kelola option venue di VENUE UNDIP" }
      ]
    });
    const FALLBACK_OPTIONS = {
      name: "VENUE UNDIP",
      description: "Platform booking lapangan olahraga terpercaya untuk Sivitas Akademika Universitas Diponegoro.",
      email: "contact@venueundip.id",
      nohp: "+62 851 6566 0339",
      address: "Jl. Prof. Soedarto, Tembalang, Kec. Tembalang, Kota Semarang, Jawa Tengah"
    };
    const {
      data: options,
      pending,
      error,
      refresh
    } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "options",
      () => $fetch("/api/options")
    )), __temp = await __temp, __restore(), __temp);
    const editing = ref(false);
    const submitting = ref(false);
    const submitError = ref(null);
    const formState = reactive({
      name: "",
      description: "",
      email: "",
      nohp: "",
      address: ""
    });
    const syncFormFromData = () => {
      const source = options.value ?? FALLBACK_OPTIONS;
      formState.name = source.name;
      formState.description = source.description;
      formState.email = source.email;
      formState.nohp = source.nohp;
      formState.address = source.address;
    };
    watch(
      () => options.value,
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
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "flex w-full flex-col gap-6 sm:gap-8 pb-16" }, _attrs))}><header class="flex flex-col sm:flex-row sm:items-center justify-between gap-6"><div class="flex items-start gap-4"><div class="p-3 bg-blue-50 rounded-xl border border-blue-100 shrink-0 hidden sm:flex items-center justify-center"><svg class="w-6 h-6 text-blue-800" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M7 3V5H5C3.9 5 3 5.9 3 7V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V7C21 5.9 20.1 5 19 5H17V3H15V5H9V3H7ZM5 9H19V19H5V9ZM7 11V13H12V11H7ZM13 11V13H17V11H13ZM7 15V17H12V15H7ZM13 15V17H17V15H13Z"></path></svg></div><div><h1 class="text-2xl uppercase font-bold text-gray-900 tracking-tight"> Manajemen Option </h1><p class="text-sm text-gray-500 mt-1"> Atur Option untuk informasi dasar VENUE UNDIP yang akan ditampilkan pada halaman publik. </p></div></div>`);
      if (!unref(editing)) {
        _push(`<button type="button" class="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 hover:shadow-md transition-all active:scale-95"${ssrIncludeBooleanAttr(unref(pending) || Boolean(unref(error))) ? " disabled" : ""}><svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg><span>Ubah Option</span></button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</header><div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300">`);
      if (unref(pending)) {
        _push(`<div class="p-12 text-center"><div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-100 border-t-blue-600 mb-4"></div><p class="text-sm text-gray-500 font-medium">Memuat data option...</p></div>`);
      } else if (unref(error)) {
        _push(`<div class="p-6"><div class="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700"><p class="font-semibold text-sm"> Gagal memuat data: ${ssrInterpolate(unref(error).message)}</p><button class="mt-2 text-sm font-bold underline hover:text-red-800"> Coba lagi </button></div></div>`);
      } else if (!unref(editing)) {
        _push(`<div class="p-6 sm:p-8"><div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div class="p-5 rounded-xl bg-gray-100 border border-gray-200 flex items-center gap-4"><div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg></div><div><p class="text-xs font-bold text-gray-500 uppercase tracking-wider"> Nama </p><p class="text-2xl font-bold text-gray-900 mt-0.5">${ssrInterpolate(unref(options)?.name)}</p></div></div><div class="p-5 rounded-xl bg-gray-100 border border-gray-200 flex items-center gap-4"><div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg></div><div><p class="text-xs font-bold text-gray-500 uppercase tracking-wider"> Deskripsi </p><p class="text-2xl font-bold text-gray-900 mt-0.5">${ssrInterpolate(unref(options)?.description)}</p></div></div><div class="p-5 rounded-xl bg-gray-100 border border-gray-200 flex items-center gap-4"><div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg></div><div><p class="text-xs font-bold text-gray-500 uppercase tracking-wider"> email </p><p class="text-2xl font-bold text-gray-900 mt-0.5">${ssrInterpolate(unref(options)?.email)}</p></div></div></div><div class="p-5 rounded-xl bg-gray-100 border border-gray-200 flex items-center gap-4"><div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg></div><div><p class="text-xs font-bold text-gray-500 uppercase tracking-wider"> No. HP </p><p class="text-2xl font-bold text-gray-900 mt-0.5">${ssrInterpolate(unref(options)?.nohp)}</p></div></div><div class="mt-6 flex items-start gap-3 p-4 rounded-lg bg-blue-50 border border-blue-100 text-blue-700 text-sm"><svg class="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><p> Perubahan pada option ini akan mempengaruhi informasi dasar yang ditampilkan pada halaman publik ${ssrInterpolate(unref(options)?.name)}. </p></div></div>`);
      } else {
        _push(`<div class="p-6 sm:p-8 bg-gray-50/30"><div class="max-w-3xl mx-auto"><div class="flex items-center justify-between mb-6 pb-4 border-b border-gray-200"><div><h2 class="text-lg font-bold text-gray-900"> Edit Informasi Dasar </h2><p class="text-xs text-gray-500 mt-1"> Sesuaikan informasi dasar ${ssrInterpolate(unref(options)?.name)} yang akan ditampilkan pada halaman publik </p></div><button class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div><div class="mb-6 flex items-start gap-3 p-4 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm"><svg class="w-5 h-5 shrink-0 mt-0.5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg><div><p class="font-semibold">Perhatian:</p><p> Mengubah informasi dasar ${ssrInterpolate(unref(options)?.name)} akan mempengaruhi tampilan pada halaman publik. Pastikan data yang dimasukkan akurat dan sesuai dengan kebijakan institusi. </p></div></div><form class="space-y-6 bg-white p-8 rounded-2xl border border-gray-300 shadow-md ring-1 ring-black/5"><div class="grid gap-6 sm:grid-cols-2"><div class="space-y-2"><label class="block text-xs font-bold text-gray-700 uppercase tracking-wider">Nama</label><div class="relative group"><div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><svg class="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg></div><input${ssrRenderAttr("value", unref(formState).name)} type="text" class="block w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 shadow-sm transition-all hover:border-gray-400" placeholder="Masukkan nama venue" required${ssrIncludeBooleanAttr(unref(submitting)) ? " disabled" : ""}><div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"><svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></div></div></div><div class="space-y-2"><label class="block text-xs font-bold text-gray-700 uppercase tracking-wider">Alamat</label><div class="relative group"><div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><svg class="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg></div><input${ssrRenderAttr("value", unref(formState).address)} type="text" class="block w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 shadow-sm transition-all hover:border-gray-400" placeholder="Masukkan nama venue" required${ssrIncludeBooleanAttr(unref(submitting)) ? " disabled" : ""}><div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"><svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></div></div></div><div class="space-y-2"><label class="block text-xs font-bold text-gray-700 uppercase tracking-wider">Deskripsi</label><div class="relative group"><div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><svg class="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg></div><input${ssrRenderAttr("value", unref(formState).description)} type="text" class="block w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 shadow-sm transition-all hover:border-gray-400" placeholder="Masukkan nama venue" required${ssrIncludeBooleanAttr(unref(submitting)) ? " disabled" : ""}><div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"><svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></div></div></div><div class="space-y-2"><label class="block text-xs font-bold text-gray-700 uppercase tracking-wider">Email</label><div class="relative group"><div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><svg class="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg></div><input${ssrRenderAttr("value", unref(formState).email)} type="text" class="block w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 shadow-sm transition-all hover:border-gray-400" placeholder="Masukkan email" required${ssrIncludeBooleanAttr(unref(submitting)) ? " disabled" : ""}><div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"><svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></div></div></div><div class="space-y-2"><label class="block text-xs font-bold text-gray-700 uppercase tracking-wider">No. WA</label><div class="relative group"><div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><svg class="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg></div><input${ssrRenderAttr("value", unref(formState).nohp)} type="text" class="block w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 shadow-sm transition-all hover:border-gray-400" placeholder="Masukkan no. WA (diawali dengan 62)" required${ssrIncludeBooleanAttr(unref(submitting)) ? " disabled" : ""}><div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"><svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></div></div></div></div>`);
        if (unref(submitError)) {
          _push(`<div class="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm font-medium flex items-center gap-2 animate-pulse"><svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> ${ssrInterpolate(unref(submitError))}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex items-center justify-end gap-3 pt-2"><button type="button" class="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-gray-50 border border-gray-300 rounded-xl hover:bg-gray-100 hover:text-gray-900 transition-colors"${ssrIncludeBooleanAttr(unref(submitting)) ? " disabled" : ""}> Batal </button><button type="submit" class="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-md hover:shadow-lg focus:ring-4 focus:ring-blue-100 transition-all disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-95"${ssrIncludeBooleanAttr(unref(submitting)) ? " disabled" : ""}>`);
        if (unref(submitting)) {
          _push(`<svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`);
        } else {
          _push(`<span>Simpan Perubahan</span>`);
        }
        _push(`</button></div></form></div></div>`);
      }
      _push(`</div></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/options.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=options-p7iFHWRW.mjs.map
