import { c as createError, _ as __nuxt_component_0 } from './server.mjs';
import { defineComponent, ref, withAsyncContext, computed, mergeProps, withCtx, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrIncludeBooleanAttr, ssrInterpolate, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderAttr, ssrRenderClass } from 'vue/server-renderer';
import { useRouter, useRoute } from 'vue-router';
import { Icon } from '@iconify/vue';
import { u as useHead } from './composables-CKJj7D3Z.mjs';
import { u as useAsyncData } from './asyncData-BrYQBPBc.mjs';
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
    useHead({
      title: "Edit Lapangan - VENUE UNDIP",
      meta: [
        { name: "description", content: "Edit detail lapangan di VENUE UNDIP" }
      ]
    });
    useRouter();
    const route = useRoute();
    const fieldId = route.params.id;
    const form = ref({
      stadionId: 0,
      name: "",
      description: "",
      pricePerHour: 0,
      status: "ACTIVE"
    });
    const loading = ref(false);
    const loadingDelete = ref(false);
    const errorMsg = ref(null);
    const existingImages = ref([]);
    ref([]);
    const selectedImages = ref([]);
    const imagePreviews = ref([]);
    const isDragging = ref(false);
    const { data: stadions, pending: pendingStadions } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "stadionListForSelect",
      () => $fetch("/api/stadions")
    )), __temp = await __temp, __restore(), __temp);
    const { data: field, error: fetchError, pending: pagePending } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      `field-${fieldId}`,
      () => $fetch(`/api/fields/${fieldId}`)
    )), __temp = await __temp, __restore(), __temp);
    if (fetchError.value) {
      throw createError({
        statusCode: 404,
        statusMessage: "Lapangan tidak ditemukan",
        fatal: true
      });
    }
    if (field.value) {
      form.value.stadionId = field.value.stadionId;
      form.value.name = field.value.name;
      form.value.description = field.value.description || "";
      form.value.pricePerHour = field.value.pricePerHour;
      form.value.status = field.value.status;
      existingImages.value = field.value.images ? [...field.value.images] : [];
    } else if (fetchError.value) {
      const typedError = fetchError.value;
      errorMsg.value = typedError.data?.statusMessage || "Gagal memuat data lapangan.";
    }
    const selectedStadion = computed(() => {
      if (!form.value.stadionId || !stadions.value) return null;
      return stadions.value.find((s) => s.id === form.value.stadionId);
    });
    const activeImageCount = computed(() => {
      return existingImages.value.length + selectedImages.value.length;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "flex w-full flex-col gap-6 sm:gap-8 pb-12 relative" }, _attrs))}><header class="flex flex-col sm:flex-row sm:items-center justify-between gap-6"><div class="flex items-start gap-4"><div class="p-3 bg-blue-50 rounded-xl border border-blue-100 shrink-0 hidden sm:flex items-center justify-center"><svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></div><div><h1 class="text-2xl uppercase font-bold text-gray-900 tracking-tight">Edit Lapangan</h1><p class="text-sm text-gray-500 mt-1"> Perbarui informasi dan status lapangan. </p></div></div><div class="hidden sm:flex items-center gap-3">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/fields",
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
      _push(`<button type="button"${ssrIncludeBooleanAttr(loadingDelete.value || loading.value) ? " disabled" : ""} class="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-bold text-red-700 shadow-sm transition-all active:scale-95 hover:bg-red-100 hover:border-red-300 disabled:opacity-50">`);
      if (loadingDelete.value) {
        _push(`<svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<span>${ssrInterpolate(loadingDelete.value ? "Menghapus..." : "Hapus")}</span></button><button type="submit" form="edit-field-form"${ssrIncludeBooleanAttr(loading.value || loadingDelete.value) ? " disabled" : ""} class="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-700 hover:shadow-md transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed">`);
      if (loading.value) {
        _push(`<svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<span>${ssrInterpolate(loading.value ? "Menyimpan..." : "Simpan Perubahan")}</span></button></div></header>`);
      if (unref(pagePending)) {
        _push(`<div class="p-12 text-center rounded-2xl border border-gray-300 bg-white"><div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-100 border-t-blue-600 mb-4"></div><p class="text-sm text-gray-500 font-medium">Memuat data lapangan...</p></div>`);
      } else if (errorMsg.value && !unref(field)) {
        _push(`<div class="p-8 text-center rounded-2xl border border-red-200 bg-red-50 text-red-700"><p class="font-bold mb-2">Terjadi Kesalahan</p><p class="text-sm">${ssrInterpolate(errorMsg.value)}</p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/admin/fields",
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
        _push(`<form id="edit-field-form" class="grid grid-cols-1 lg:grid-cols-3 gap-8"><div class="lg:col-span-2 space-y-8"><div class="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden"><div class="p-5 border-b border-gray-200 bg-gray-50/50"><h3 class="text-base font-bold text-gray-900">Informasi Lapangan</h3><p class="text-xs text-gray-500 mt-0.5">Detail utama lapangan.</p></div><div class="p-6 space-y-6"><div class="space-y-1.5"><label class="block text-xs font-bold text-gray-700 uppercase tracking-wider">Stadion Induk <span class="text-red-500">*</span></label><div class="relative"><div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg></div><select class="block w-full rounded-xl border border-gray-300 pl-10 pr-10 py-3 text-sm font-medium text-gray-900 focus:border-blue-500 focus:ring-blue-500 shadow-sm transition-all hover:border-gray-400 cursor-pointer appearance-none bg-white disabled:bg-gray-100"${ssrIncludeBooleanAttr(unref(pendingStadions)) ? " disabled" : ""} required><option value="" disabled${ssrIncludeBooleanAttr(Array.isArray(form.value.stadionId) ? ssrLooseContain(form.value.stadionId, "") : ssrLooseEqual(form.value.stadionId, "")) ? " selected" : ""}>Pilih Stadion...</option><!--[-->`);
        ssrRenderList(unref(stadions), (stadion) => {
          _push(`<option${ssrRenderAttr("value", stadion.id)}${ssrIncludeBooleanAttr(Array.isArray(form.value.stadionId) ? ssrLooseContain(form.value.stadionId, stadion.id) : ssrLooseEqual(form.value.stadionId, stadion.id)) ? " selected" : ""}>${ssrInterpolate(stadion.name)} ${ssrInterpolate(stadion.status === "INACTIVE" ? "(Non-Aktif)" : "")}</option>`);
        });
        _push(`<!--]--></select><div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">`);
        if (unref(pendingStadions)) {
          _push(`<svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`);
        } else {
          _push(`<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>`);
        }
        _push(`</div></div></div><div class="space-y-1.5"><label class="block text-xs font-bold text-gray-700 uppercase tracking-wider">Nama Lapangan <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", form.value.name)} type="text" required placeholder="Contoh: Lapangan Futsal A" class="block w-full rounded-xl border border-gray-300 pl-4 pr-4 py-3 text-sm font-medium text-gray-900 focus:border-blue-500 focus:ring-blue-500 shadow-sm transition-all"></div><div class="space-y-1.5"><label class="block text-xs font-bold text-gray-700 uppercase tracking-wider"> Deskripsi Lapangan <span class="text-gray-400 font-normal">(Opsional)</span></label><textarea rows="4" maxlength="191" placeholder="Jelaskan spesifikasi lapangan: jenis lantai, ukuran, pencahayaan, fasilitas penunjang, dll..." class="block w-full rounded-xl border border-gray-300 pl-4 pr-4 py-3 text-sm font-medium text-gray-900 focus:border-blue-500 focus:ring-blue-500 shadow-sm transition-all resize-none">${ssrInterpolate(form.value.description)}</textarea><div class="flex items-center justify-between text-[11px]"><p class="text-gray-500"><svg class="w-3.5 h-3.5 inline-block mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Detail spesifikasi membantu pengguna memahami kondisi dan fasilitas lapangan </p><span class="${ssrRenderClass([form.value.description.length >= 191 ? "text-red-500" : "text-gray-400", "font-semibold"])}">${ssrInterpolate(form.value.description.length)}/191 </span></div></div></div></div></div><div class="lg:col-span-1 space-y-8"><div class="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden"><div class="p-5 border-b border-gray-200 bg-gray-50/50"><h3 class="text-base font-bold text-gray-900">Status Operasional</h3></div><div class="p-6 space-y-4"><div class="space-y-1.5"><label class="block text-xs font-bold text-gray-700 uppercase tracking-wider">Status</label><div class="relative"><select${ssrIncludeBooleanAttr(selectedStadion.value?.status === "INACTIVE") ? " disabled" : ""} class="block w-full rounded-xl border border-gray-300 pl-4 pr-10 py-3 text-sm font-medium focus:border-blue-500 focus:ring-blue-500 cursor-pointer shadow-sm transition-all hover:border-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none bg-white"><option value="ACTIVE"${ssrIncludeBooleanAttr(Array.isArray(form.value.status) ? ssrLooseContain(form.value.status, "ACTIVE") : ssrLooseEqual(form.value.status, "ACTIVE")) ? " selected" : ""}>Aktif</option><option value="INACTIVE"${ssrIncludeBooleanAttr(Array.isArray(form.value.status) ? ssrLooseContain(form.value.status, "INACTIVE") : ssrLooseEqual(form.value.status, "INACTIVE")) ? " selected" : ""}>Non-Aktif</option></select><div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"><svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></div></div>`);
        if (selectedStadion.value?.status === "INACTIVE") {
          _push(`<p class="text-xs text-amber-600 mt-2 flex items-center gap-1.5 font-medium bg-amber-50 p-2 rounded-lg border border-amber-100"><svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg> Stadion induk sedang non-aktif. </p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div><div class="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden"><div class="p-5 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center"><div><h3 class="text-base font-bold text-gray-900">Foto Venue</h3><p class="text-xs text-gray-500 mt-0.5">Maksimal 5 foto.</p></div><span class="text-[10px] font-extrabold uppercase px-2 py-1 bg-blue-100 text-blue-700 rounded-md tracking-wide">${ssrInterpolate(activeImageCount.value)}/5</span></div><div class="p-5">`);
        if (activeImageCount.value < 5) {
          _push(`<div class="${ssrRenderClass([[
            isDragging.value ? "border-blue-500 bg-blue-50/50 ring-4 ring-blue-500/10" : "border-gray-200 bg-gray-50 hover:border-blue-400 hover:bg-gray-100",
            activeImageCount.value === 0 ? "h-40" : "h-24 mb-4"
          ], "relative w-full rounded-xl transition-all duration-200 ease-in-out border-2 border-dashed overflow-hidden"])}"><label class="flex flex-col items-center justify-center w-full h-full cursor-pointer"><div class="flex flex-col items-center justify-center p-4 text-center"><div class="p-2 rounded-full bg-white shadow-sm ring-1 ring-gray-100 mb-2">`);
          _push(ssrRenderComponent(unref(Icon), {
            icon: "solar:upload-minimalistic-bold",
            class: "w-5 h-5 text-blue-600"
          }, null, _parent));
          _push(`</div><p class="text-xs font-bold text-gray-700">Klik / Tarik Foto</p><p class="text-[10px] text-gray-500 mt-0.5">JPG/PNG (Maks 2MB)</p></div><input type="file" multiple accept="image/*" class="hidden"></label></div>`);
        } else {
          _push(`<div class="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-xl text-center"><p class="text-xs text-gray-500 font-medium">Kuota foto penuh (5/5).</p></div>`);
        }
        if (activeImageCount.value > 0) {
          _push(`<div class="flex flex-col gap-3">`);
          if (existingImages.value.length > 0) {
            _push(`<div class="flex flex-col gap-3"><div class="relative w-full aspect-video rounded-xl overflow-hidden border border-gray-200 shadow-sm group"><img${ssrRenderAttr("src", existingImages.value[0]?.imageUrl)} class="w-full h-full object-cover"><div class="absolute top-0 left-0 right-0 p-2 bg-gradient-to-b from-black/60 to-transparent"><div class="flex items-center gap-1.5">`);
            _push(ssrRenderComponent(unref(Icon), {
              icon: "solar:star-bold",
              class: "text-amber-400 w-3.5 h-3.5"
            }, null, _parent));
            _push(`<span class="text-[10px] font-bold text-white tracking-wide uppercase">Cover Utama</span></div></div><button type="button" class="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 shadow-sm" title="Hapus">`);
            _push(ssrRenderComponent(unref(Icon), {
              icon: "solar:trash-bin-trash-bold",
              class: "w-4 h-4"
            }, null, _parent));
            _push(`</button></div>`);
            if (existingImages.value.length > 1) {
              _push(`<div class="grid grid-cols-2 gap-3"><!--[-->`);
              ssrRenderList(existingImages.value.slice(1), (img, idx) => {
                _push(`<div class="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group bg-gray-100"><img${ssrRenderAttr("src", img.imageUrl)} class="w-full h-full object-cover"><button type="button" class="absolute top-1.5 right-1.5 p-1 bg-white/90 rounded-md text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 shadow-sm">`);
                _push(ssrRenderComponent(unref(Icon), {
                  icon: "solar:trash-bin-trash-bold",
                  class: "w-3.5 h-3.5"
                }, null, _parent));
                _push(`</button></div>`);
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
            _push(`<div class="grid grid-cols-2 gap-3"><!--[-->`);
            ssrRenderList(imagePreviews.value, (src, idx) => {
              _push(`<div class="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 shadow-sm"><img${ssrRenderAttr("src", src)} class="w-full h-full object-cover"><div class="absolute top-1.5 left-1.5 bg-blue-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">BARU</div>`);
              if (existingImages.value.length === 0 && idx === 0) {
                _push(`<div class="absolute top-0 left-0 right-0 p-2 bg-gradient-to-b from-black/60 to-transparent"><div class="flex items-center gap-1.5">`);
                _push(ssrRenderComponent(unref(Icon), {
                  icon: "solar:star-bold",
                  class: "text-amber-400 w-3.5 h-3.5"
                }, null, _parent));
                _push(`<span class="text-[10px] font-bold text-white tracking-wide uppercase">Cover</span></div></div>`);
              } else {
                _push(`<!---->`);
              }
              _push(`<button type="button" class="absolute top-1.5 right-1.5 p-1 bg-white/90 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 shadow-sm" title="Hapus">`);
              _push(ssrRenderComponent(unref(Icon), {
                icon: "solar:trash-bin-trash-bold",
                class: "w-3.5 h-3.5"
              }, null, _parent));
              _push(`</button></div>`);
            });
            _push(`<!--]--></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        if (errorMsg.value && (errorMsg.value.includes("gambar") || errorMsg.value.includes("foto") || errorMsg.value.includes("5"))) {
          _push(`<p class="mt-3 text-xs text-red-600 font-medium flex items-start gap-1.5 p-3 bg-red-50 rounded-lg border border-red-100"><svg class="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg><span>${ssrInterpolate(errorMsg.value)}</span></p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div>`);
        if (errorMsg.value && !(errorMsg.value.includes("gambar") || errorMsg.value.includes("foto") || errorMsg.value.includes("5"))) {
          _push(`<div class="lg:col-span-3 p-4 rounded-xl border border-red-200 bg-red-50 text-red-700 flex items-start gap-3 shadow-sm animate-shake"><svg class="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg><div class="flex-1"><p class="font-bold text-sm">Terjadi Kesalahan</p><p class="text-sm">${ssrInterpolate(errorMsg.value)}</p></div><button type="button" class="text-red-700 hover:text-red-900 transition-colors" aria-label="Tutup pesan error"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="lg:col-span-3 sm:hidden flex flex-col gap-3 mt-4"><button type="submit"${ssrIncludeBooleanAttr(loading.value || loadingDelete.value) ? " disabled" : ""} class="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-bold text-white shadow-sm active:bg-blue-700 disabled:opacity-70">`);
        if (loading.value) {
          _push(`<svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<span>${ssrInterpolate(loading.value ? "Menyimpan..." : "Simpan Perubahan")}</span></button><div class="grid grid-cols-2 gap-3">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/admin/fields",
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
        _push(`<button type="button"${ssrIncludeBooleanAttr(loadingDelete.value) ? " disabled" : ""} class="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm font-bold text-red-700 active:bg-red-100">${ssrInterpolate(loadingDelete.value ? "..." : "Hapus")}</button></div></div></form>`);
      }
      _push(`</section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/fields/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-Dkp9grj1.mjs.map
