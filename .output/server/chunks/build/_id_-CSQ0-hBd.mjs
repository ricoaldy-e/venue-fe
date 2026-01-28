import { _ as __nuxt_component_0 } from './nuxt-link-DqM75kvd.mjs';
import { defineComponent, computed, ref, withAsyncContext, mergeProps, withCtx, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrIncludeBooleanAttr, ssrInterpolate, ssrRenderComponent, ssrRenderAttr, ssrRenderClass, ssrRenderList, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
import { useRouter, useRoute } from 'vue-router';
import { Icon } from '@iconify/vue';
import { u as useAppOptions, c as createError } from './server.mjs';
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
      title: "Edit Stadion - VENUE UNDIP",
      meta: [
        { name: "description", content: "Edit detail stadion di VENUE UNDIP" }
      ]
    });
    useRouter();
    const route = useRoute();
    const stadionId = route.params.id;
    const form = ref({
      name: "",
      description: "",
      mapUrl: "",
      status: "ACTIVE",
      facilityIds: []
    });
    const loading = ref(false);
    const loadingDelete = ref(false);
    const errorMsg = ref(null);
    const existingImages = ref([]);
    const removedImageIds = ref([]);
    const selectedImages = ref([]);
    const imagePreviews = ref([]);
    const isDragging = ref(false);
    const { data: stadion, error: fetchError, pending: pagePending } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      `admin-stadiums-stadion-${stadionId}`,
      () => $fetch(`/api/stadions/${stadionId}`)
    )), __temp = await __temp, __restore(), __temp);
    const { data: facilities, error: facilityError, pending: facilitiesPending, refresh: refreshFacilities } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "facilitiesListForStadion",
      () => $fetch("/api/facilities")
    )), __temp = await __temp, __restore(), __temp);
    if (fetchError.value) {
      throw createError({
        statusCode: 404,
        statusMessage: "Stadion tidak ditemukan",
        fatal: true
      });
    }
    if (stadion.value) {
      form.value.name = stadion.value.name;
      form.value.description = stadion.value.description || "";
      form.value.mapUrl = stadion.value.mapUrl;
      form.value.status = stadion.value.status;
      form.value.facilityIds = stadion.value.facilities.map((fac) => fac.Facility.id);
      existingImages.value = stadion.value.images ? [...stadion.value.images] : [];
    } else if (fetchError.value) {
      const typedError = fetchError.value;
      errorMsg.value = typedError.data?.statusMessage || "Gagal memuat data stadion.";
    }
    const activeImageCount = computed(() => {
      return existingImages.value.length - removedImageIds.value.length + selectedImages.value.length;
    });
    const activeExistingImages = computed(() => {
      return existingImages.value.filter((img) => !removedImageIds.value.includes(img.id));
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "flex w-full flex-col gap-6 sm:gap-8 pb-12 relative max-w-7xl mx-auto" }, _attrs))}><header class="flex flex-col sm:flex-row sm:items-center justify-between gap-6"><div class="flex items-start gap-4"><div class="p-3 bg-blue-50 rounded-xl border border-blue-100 shrink-0 hidden sm:flex items-center justify-center"><svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></div><div><h1 class="text-2xl uppercase font-bold text-gray-900 tracking-tight">Edit Stadion</h1><p class="text-sm text-gray-500 mt-1"> Perbarui informasi stadion dan fasilitas. </p></div></div><div class="hidden sm:flex items-center gap-3"><button type="button"${ssrIncludeBooleanAttr(loadingDelete.value || loading.value) ? " disabled" : ""} class="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-bold text-red-700 shadow-sm transition-all active:scale-95 hover:bg-red-100 hover:border-red-300 disabled:opacity-50">`);
      if (loadingDelete.value) {
        _push(`<svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<span>${ssrInterpolate(loadingDelete.value ? "Menghapus..." : "Hapus")}</span></button>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/stadiums",
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
      _push(`<button type="submit" form="edit-stadium-form"${ssrIncludeBooleanAttr(loading.value || loadingDelete.value) ? " disabled" : ""} class="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-700 hover:shadow-md transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed">`);
      if (loading.value) {
        _push(`<svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<span>${ssrInterpolate(loading.value ? "Menyimpan..." : "Simpan Perubahan")}</span></button></div></header>`);
      if (unref(pagePending)) {
        _push(`<div class="p-12 text-center rounded-2xl border border-gray-300 bg-white"><div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-100 border-t-blue-600 mb-4"></div><p class="text-sm text-gray-500 font-medium">Memuat data stadion...</p></div>`);
      } else if (errorMsg.value && !unref(stadion)) {
        _push(`<div class="p-8 text-center rounded-2xl border border-red-200 bg-red-50 text-red-700"><p class="font-bold mb-2">Terjadi Kesalahan</p><p class="text-sm">${ssrInterpolate(errorMsg.value)}</p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/admin/stadiums",
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
        _push(`<form id="edit-stadium-form" class="grid grid-cols-1 lg:grid-cols-3 gap-8"><div class="lg:col-span-2 space-y-8"><div class="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden"><div class="p-5 border-b border-gray-200 bg-gray-50/50"><h3 class="text-base font-bold text-gray-900">Informasi Dasar</h3><p class="text-xs text-gray-500 mt-0.5">Detail utama mengenai stadion.</p></div><div class="p-6 space-y-6"><div class="space-y-1.5"><label class="block text-xs font-bold text-gray-700 uppercase tracking-wider">Nama Stadion <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", form.value.name)} type="text" required placeholder="Contoh: Stadion Futsal" class="block w-full rounded-xl border border-gray-300 pl-4 pr-4 py-3 text-sm font-medium text-gray-900 focus:border-blue-500 focus:ring-blue-500 shadow-sm transition-all">`);
        if (errorMsg.value && errorMsg.value.includes("Nama stadion")) {
          _push(`<p class="mt-2 text-xs text-red-600 font-medium flex items-start gap-1.5"><svg class="w-3.5 h-3.5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><span>${ssrInterpolate(errorMsg.value)}</span></p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="space-y-1.5"><label class="block text-xs font-bold text-gray-700 uppercase tracking-wider"> Deskripsi <span class="text-gray-400 font-normal">(Opsional)</span></label><textarea rows="5" maxlength="1000" placeholder="Jelaskan fasilitas unggulan, lokasi strategis, atau keunggulan stadion ini..." class="block w-full rounded-xl border border-gray-300 pl-4 pr-4 py-3 text-sm font-medium text-gray-900 focus:border-blue-500 focus:ring-blue-500 shadow-sm transition-all resize-none">${ssrInterpolate(form.value.description)}</textarea><div class="flex items-center justify-between text-[11px]"><p class="text-gray-500"><svg class="w-3.5 h-3.5 inline-block mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Tambahkan deskripsi untuk memberikan informasi lengkap kepada pengunjung </p><span class="${ssrRenderClass([form.value.description.length >= 1e3 ? "text-red-500" : "text-gray-400", "font-semibold"])}">${ssrInterpolate(form.value.description.length)}/1000 </span></div></div><div class="space-y-1.5"><label class="block text-xs font-bold text-gray-700 uppercase tracking-wider">URL Google Maps <span class="text-red-500">*</span></label><div class="relative"><div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg></div><input${ssrRenderAttr("value", form.value.mapUrl)} type="url" required placeholder="https://maps.app.goo.gl/..." class="block w-full rounded-xl border border-gray-300 pl-10 pr-4 py-3 text-sm font-medium text-gray-900 focus:border-blue-500 focus:ring-blue-500 shadow-sm transition-all"></div>`);
        if (errorMsg.value && (errorMsg.value.includes("URL Peta") || errorMsg.value.includes("URL"))) {
          _push(`<p class="mt-2 text-xs text-red-600 font-medium flex items-start gap-1.5"><svg class="w-3.5 h-3.5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><span>${ssrInterpolate(errorMsg.value)}</span></p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div><div class="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden"><div class="p-5 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center"><div><h3 class="text-base font-bold text-gray-900">Fasilitas Tersedia</h3><p class="text-xs text-gray-500 mt-0.5">Pilih fasilitas yang tersedia (maksimal 10).</p></div><span class="text-xs font-bold px-2 py-1 rounded bg-blue-50 text-blue-700 border border-blue-100">${ssrInterpolate(form.value.facilityIds.length)}/10 Dipilih</span></div><div class="p-6 space-y-4">`);
        if (unref(facilitiesPending)) {
          _push(`<div class="text-center py-8 text-sm text-gray-500"><div class="inline-block animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-blue-600 mb-2"></div><p>Memuat fasilitas...</p></div>`);
        } else if (unref(facilityError)) {
          _push(`<div class="text-center py-8 text-red-600 text-sm">Gagal memuat data. <button type="button" class="underline font-bold">Coba lagi</button></div>`);
        } else {
          _push(`<div class="space-y-4"><div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3"><!--[-->`);
          ssrRenderList(unref(facilities), (facility) => {
            _push(`<label class="${ssrRenderClass([[form.value.facilityIds.includes(facility.id) ? "border-blue-500 bg-blue-50/50 shadow-md ring-1 ring-blue-500/20" : "border-gray-200 bg-white hover:border-blue-400 hover:bg-blue-50/30 hover:shadow-sm", form.value.facilityIds.length >= 10 && !form.value.facilityIds.includes(facility.id) ? "opacity-50 cursor-not-allowed grayscale" : ""], "group relative flex flex-col items-center justify-center p-3 rounded-xl border cursor-pointer transition-all duration-200"])}"><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(form.value.facilityIds) ? ssrLooseContain(form.value.facilityIds, facility.id) : form.value.facilityIds) ? " checked" : ""}${ssrRenderAttr("value", facility.id)}${ssrIncludeBooleanAttr(form.value.facilityIds.length >= 10 && !form.value.facilityIds.includes(facility.id)) ? " disabled" : ""} class="sr-only">`);
            if (form.value.facilityIds.includes(facility.id)) {
              _push(`<div class="absolute top-2 right-2 bg-blue-500 rounded-full p-0.5 shadow-sm"><svg class="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg></div>`);
            } else {
              _push(`<!---->`);
            }
            _push(ssrRenderComponent(unref(Icon), {
              icon: facility.icon,
              class: ["w-8 h-8 mb-2 transition-transform duration-200 group-hover:scale-110", form.value.facilityIds.includes(facility.id) ? "text-blue-600" : "text-gray-400 group-hover:text-blue-500"]
            }, null, _parent));
            _push(`<span class="${ssrRenderClass([form.value.facilityIds.includes(facility.id) ? "text-blue-700 font-bold" : "text-gray-600 group-hover:text-blue-600", "text-xs font-medium text-center leading-tight transition-colors"])}">${ssrInterpolate(facility.name)}</span></label>`);
          });
          _push(`<!--]--></div>`);
          if (errorMsg.value && errorMsg.value.includes("Fasilitas")) {
            _push(`<p class="mt-2 text-xs text-red-600 font-medium flex items-start gap-1.5"><svg class="w-3.5 h-3.5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><span>${ssrInterpolate(errorMsg.value)}</span></p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        }
        _push(`</div></div></div><div class="lg:col-span-1 space-y-8"><div class="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden"><div class="p-5 border-b border-gray-200 bg-gray-50/50"><h3 class="text-base font-bold text-gray-900">Status Operasional</h3></div><div class="p-6 space-y-4"><div class="space-y-1.5"><label class="block text-xs font-bold text-gray-700 uppercase tracking-wider">Status</label><div class="relative"><select class="block w-full rounded-xl border border-gray-300 pl-4 pr-10 py-3 text-sm font-medium focus:border-blue-500 focus:ring-blue-500 cursor-pointer shadow-sm transition-all hover:border-gray-400 appearance-none bg-white"><option value="ACTIVE"${ssrIncludeBooleanAttr(Array.isArray(form.value.status) ? ssrLooseContain(form.value.status, "ACTIVE") : ssrLooseEqual(form.value.status, "ACTIVE")) ? " selected" : ""}>Aktif)</option><option value="INACTIVE"${ssrIncludeBooleanAttr(Array.isArray(form.value.status) ? ssrLooseContain(form.value.status, "INACTIVE") : ssrLooseEqual(form.value.status, "INACTIVE")) ? " selected" : ""}>Non-Aktif</option></select><div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"><svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></div></div></div></div></div><div class="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden"><div class="p-5 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center"><div><h3 class="text-base font-bold text-gray-900">Foto Venue</h3><p class="text-xs text-gray-500 mt-0.5">Maksimal 5 foto.</p></div><span class="text-[10px] font-extrabold uppercase px-2 py-1 bg-blue-100 text-blue-700 rounded-md tracking-wide">${ssrInterpolate(activeImageCount.value)}/5</span></div><div class="p-5">`);
        if (activeImageCount.value < 5) {
          _push(`<div class="${ssrRenderClass([[
            isDragging.value ? "border-blue-500 bg-blue-50/50 ring-4 ring-blue-500/10" : "border-gray-200 bg-gray-50 hover:border-blue-400 hover:bg-gray-100",
            activeImageCount.value === 0 ? "h-40" : "h-24 mb-4"
          ], "relative w-full rounded-xl transition-all duration-200 ease-in-out border-2 border-dashed overflow-hidden"])}"><label class="flex flex-col items-center justify-center w-full h-full cursor-pointer"><div class="flex flex-col items-center justify-center p-4 text-center"><div class="p-2 rounded-full bg-white shadow-sm ring-1 ring-gray-100 mb-2"><svg class="w-6 h-6 text-gray-400 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div><p class="text-xs font-bold text-gray-700">Klik / Tarik Foto</p><p class="text-[10px] text-gray-500 mt-0.5">JPG/PNG (Maks 2MB)</p></div><input type="file" multiple accept="image/*" class="hidden"></label></div>`);
        } else {
          _push(`<div class="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-xl text-center"><p class="text-xs text-gray-500 font-medium">Kuota foto penuh (5/5).</p></div>`);
        }
        if (activeExistingImages.value.length > 0) {
          _push(`<div class="flex flex-col gap-3"><div class="relative w-full aspect-video rounded-xl overflow-hidden border border-gray-200 shadow-sm group"><img${ssrRenderAttr("src", activeExistingImages.value[0]?.imageUrl)} class="w-full h-full object-cover"><div class="absolute top-0 left-0 right-0 p-2 bg-gradient-to-b from-black/60 to-transparent"><div class="flex items-center gap-1.5"><svg class="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg><span class="text-[10px] font-bold text-white tracking-wide uppercase">Cover Utama</span></div></div><button type="button" class="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 shadow-sm" title="Hapus"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button></div>`);
          if (activeExistingImages.value.length > 1) {
            _push(`<div class="grid grid-cols-2 gap-3"><!--[-->`);
            ssrRenderList(activeExistingImages.value.slice(1), (img, idx) => {
              _push(`<div class="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group bg-gray-100"><img${ssrRenderAttr("src", img.imageUrl)} class="w-full h-full object-cover"><div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div><button type="button" class="absolute top-1.5 right-1.5 p-1 bg-white/90 rounded-md text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 shadow-sm"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button></div>`);
            });
            _push(`<!--]--></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        if (imagePreviews.value.length > 0) {
          _push(`<div class="mt-3"><p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Akan Diupload</p><div class="grid grid-cols-2 gap-3"><!--[-->`);
          ssrRenderList(imagePreviews.value, (src, idx) => {
            _push(`<div class="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 shadow-sm"><img${ssrRenderAttr("src", src)} class="w-full h-full object-cover"><div class="absolute top-1.5 left-1.5 bg-green-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">BARU</div><button type="button" class="absolute top-1.5 right-1.5 p-1 bg-white/90 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 shadow-sm"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div>`);
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (removedImageIds.value.length > 0) {
          _push(`<div class="mt-4 p-3 bg-red-50 rounded-xl border border-red-100"><div class="flex items-center gap-2 mb-2 text-red-800"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg><span class="text-xs font-bold">${ssrInterpolate(removedImageIds.value.length)} foto ditandai hapus</span></div><div class="flex flex-wrap gap-2"><!--[-->`);
          ssrRenderList(removedImageIds.value, (id) => {
            _push(`<button type="button" class="inline-flex items-center gap-1 text-[10px] font-semibold bg-white border border-red-200 text-red-600 px-2 py-1 rounded-md shadow-sm hover:bg-red-50 hover:border-red-300 transition-all"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path></svg><span>Batal Hapus #${ssrInterpolate(id)}</span></button>`);
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (errorMsg.value && (errorMsg.value.includes("gambar") || errorMsg.value.includes("foto") || errorMsg.value.includes("5"))) {
          _push(`<p class="mt-3 text-xs text-red-600 font-medium flex items-start gap-1.5 p-3 bg-red-50 rounded-lg border border-red-100"><svg class="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg><span>${ssrInterpolate(errorMsg.value)}</span></p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div><div class="lg:col-span-3 sm:hidden flex flex-col gap-3 mt-4"><button type="submit"${ssrIncludeBooleanAttr(loading.value || loadingDelete.value) ? " disabled" : ""} class="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-bold text-white shadow-sm active:bg-blue-700 disabled:opacity-70">`);
        if (loading.value) {
          _push(`<svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<span>${ssrInterpolate(loading.value ? "Menyimpan..." : "Simpan Perubahan")}</span></button><div class="grid grid-cols-2 gap-3"><button type="button"${ssrIncludeBooleanAttr(loadingDelete.value) ? " disabled" : ""} class="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm font-bold text-red-700 active:bg-red-100">${ssrInterpolate(loadingDelete.value ? "..." : "Hapus")}</button>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/admin/stadiums",
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/stadiums/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-CSQ0-hBd.mjs.map
