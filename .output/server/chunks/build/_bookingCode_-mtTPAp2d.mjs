import { c as useRoute, d as createError, _ as __nuxt_component_0 } from './server.mjs';
import { _ as __nuxt_component_0$1 } from './ConfirmationModal-CkZ4EmBW.mjs';
import { defineComponent, ref, withAsyncContext, computed, mergeProps, withCtx, createBlock, createVNode, openBlock, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrRenderAttr, ssrRenderList, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { u as useHead } from './composables-B5D2SRP0.mjs';
import { u as useAsyncData } from './asyncData-VRyZt-9X.mjs';
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
import './_plugin-vue_export-helper-1tPrXgE0.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'perfect-debounce';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[bookingCode]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    useHead({
      title: "Detail Booking - VENUE UNDIP",
      meta: [
        { name: "description", content: "Detail dan status booking lapangan di VENUE UNDIP" }
      ]
    });
    const confirmationModal = ref(null);
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC"
      });
    };
    const route = useRoute();
    const bookingCode = route.params.bookingCode;
    const { data: booking, pending, error, refresh } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      `booking-${bookingCode}`,
      () => $fetch(`/api/bookings/${bookingCode}`)
    )), __temp = await __temp, __restore(), __temp);
    if (error.value) {
      throw createError({
        statusCode: 404,
        statusMessage: "Booking tidak ditemukan",
        fatal: true
      });
    }
    const isPdf = (url) => {
      return !!url && url.toLowerCase().endsWith(".pdf");
    };
    const updating = ref(false);
    const getStatusClasses = (status) => {
      const classes = {
        "PENDING": "bg-yellow-50 text-yellow-700 border-yellow-200",
        "APPROVED": "bg-green-50 text-green-700 border-green-200",
        "CANCELLED": "bg-red-50 text-red-700 border-red-200"
      };
      return classes[status] || "bg-gray-50 text-gray-700 border-gray-200";
    };
    const getPaymentStatusClasses = (status) => {
      return status === "PAID" ? "bg-green-50 text-green-700 border-green-200" : "bg-orange-50 text-orange-700 border-orange-200";
    };
    const getStatusText = (status) => {
      const texts = {
        "PENDING": "Menunggu Persetujuan",
        "APPROVED": "Disetujui",
        "CANCELLED": "Dibatalkan"
      };
      return texts[status] || status;
    };
    const getPaymentText = (status) => {
      return status === "PAID" ? "Lunas" : "Belum Bayar";
    };
    const getTimeSlot = (hour) => {
      return `${hour.toString().padStart(2, "0")}:00 - ${(hour + 1).toString().padStart(2, "0")}:00`;
    };
    const groupedDetails = computed(() => {
      if (!booking.value?.details) return [];
      const grouped = /* @__PURE__ */ new Map();
      booking.value.details.forEach((detail) => {
        const key = detail.bookingDate;
        if (!grouped.has(key)) {
          grouped.set(key, []);
        }
        grouped.get(key).push(detail);
      });
      return Array.from(grouped.entries()).map(([date, details]) => ({
        date,
        details: details.sort((a, b) => a.startHour - b.startHour)
      }));
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_ConfirmationModal = __nuxt_component_0$1;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "flex w-full flex-col gap-6 sm:gap-8 pb-16" }, _attrs))}><header class="flex flex-col sm:flex-row sm:items-center justify-between gap-6"><div class="flex items-start gap-4"><div class="p-3 bg-blue-50 rounded-xl border border-blue-100 shrink-0 hidden sm:flex items-center justify-center"><svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg></div><div><h1 class="text-2xl uppercase font-bold text-gray-900 tracking-tight">Detail Booking</h1><p class="text-sm text-gray-500 mt-1"> Informasi lengkap dan status reservasi booking. </p></div></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/bookings/history",
        class: "inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:text-[#1f2a56] hover:border-[#1f2a56] hover:shadow-md active:scale-95"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"${_scopeId}></path></svg><span${_scopeId}>Kembali</span>`);
          } else {
            return [
              (openBlock(), createBlock("svg", {
                class: "h-4 w-4",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24"
              }, [
                createVNode("path", {
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                  "stroke-width": "2",
                  d: "M15 19l-7-7 7-7"
                })
              ])),
              createVNode("span", null, "Kembali")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</header>`);
      if (unref(pending)) {
        _push(`<div class="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse"><div class="lg:col-span-2 space-y-6"><div class="bg-white rounded-2xl border border-gray-200 p-8 h-64"></div><div class="bg-white rounded-2xl border border-gray-200 p-8 h-96"></div></div><div class="bg-white rounded-2xl border border-gray-200 p-8 h-96"></div></div>`);
      } else if (unref(booking)) {
        _push(`<div class="grid grid-cols-1 lg:grid-cols-3 gap-6"><div class="lg:col-span-2 space-y-6"><div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"><div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-200"><div><p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Kode Booking</p><p class="text-2xl font-bold text-blue-600">${ssrInterpolate(unref(booking).bookingCode)}</p></div><div class="flex flex-wrap gap-2"><span class="${ssrRenderClass([
          "inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold border",
          getStatusClasses(unref(booking).status)
        ])}">${ssrInterpolate(getStatusText(unref(booking).status))}</span><span class="${ssrRenderClass([
          "inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold border",
          getPaymentStatusClasses(unref(booking).paymentStatus)
        ])}">${ssrInterpolate(getPaymentText(unref(booking).paymentStatus))}</span></div></div><div class="space-y-4"><h3 class="text-sm font-bold text-gray-900 uppercase tracking-wide">Informasi Pemesan</h3><div class="grid grid-cols-1 sm:grid-cols-2 gap-4"><div><p class="text-xs font-semibold text-gray-500 mb-1">Nama Lengkap</p><p class="text-sm font-semibold text-gray-900">${ssrInterpolate(unref(booking).name)}</p></div><div><p class="text-xs font-semibold text-gray-500 mb-1">Nomor Kontak</p><p class="text-sm font-semibold text-gray-900">${ssrInterpolate(unref(booking).contact)}</p></div><div><p class="text-xs font-semibold text-gray-500 mb-1">Email</p><p class="text-sm font-semibold text-gray-900">${ssrInterpolate(unref(booking).email)}</p></div><div><p class="text-xs font-semibold text-gray-500 mb-1">Tipe Booking</p><p class="text-sm font-semibold text-gray-900">${ssrInterpolate(unref(booking).isAcademic ? "Akademik" : "Non-Akademik")}</p></div>`);
        if (unref(booking).isAcademic && unref(booking).institution) {
          _push(`<div class="sm:col-span-2"><p class="text-xs font-semibold text-gray-500 mb-1">Institusi</p><p class="text-sm font-semibold text-gray-900">${ssrInterpolate(unref(booking).institution)}</p></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (unref(booking).isAcademic && unref(booking).suratUrl) {
          _push(`<div class="pt-4 border-t border-gray-100"><p class="text-xs font-semibold text-gray-500 mb-2">Surat Keterangan</p>`);
          if (isPdf(unref(booking).suratUrl)) {
            _push(`<a${ssrRenderAttr("href", unref(booking).suratUrl)} target="_blank" class="inline-flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 rounded-lg text-sm font-semibold transition-colors"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"></path></svg> Lihat Surat (PDF) </a>`);
          } else {
            _push(`<a${ssrRenderAttr("href", unref(booking).suratUrl)} target="_blank" class="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 rounded-lg text-sm font-semibold transition-colors"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg> Lihat Gambar </a>`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div><div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"><h3 class="text-sm font-bold text-gray-900 uppercase tracking-wide mb-6">Detail Reservasi</h3>`);
        if (unref(booking).status === "CANCELLED") {
          _push(`<div class="mb-6 bg-red-50 rounded-xl border border-red-200 p-4"><div class="flex items-start gap-3"><svg class="w-5 h-5 text-red-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg><div><p class="text-xs font-bold text-red-900 mb-1">Booking Dibatalkan</p><p class="text-xs text-red-700 leading-relaxed"> Booking ini telah dibatalkan dan tidak dapat diproses lebih lanjut. </p></div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="space-y-6"><!--[-->`);
        ssrRenderList(unref(groupedDetails), (group, index) => {
          _push(`<div class="space-y-3"><div class="flex items-center gap-2 pb-2 border-b border-gray-200"><svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg><p class="text-sm font-bold text-gray-900">${ssrInterpolate(formatDate(group.date))}</p></div><div class="space-y-2"><!--[-->`);
          ssrRenderList(group.details, (detail) => {
            _push(`<div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"><div class="flex items-center gap-3"><div class="p-2 bg-white rounded-lg border border-gray-300"><svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg></div><div><p class="text-sm font-semibold text-gray-900">${ssrInterpolate(detail.Field.name)}</p><p class="text-xs text-gray-500">${ssrInterpolate(getTimeSlot(detail.startHour))}</p></div></div></div>`);
          });
          _push(`<!--]--></div></div>`);
        });
        _push(`<!--]--></div></div></div><div class="space-y-6"><div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"><h3 class="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">Ringkasan Pembayaran</h3><div class="space-y-3 mb-6"><div class="flex justify-between items-center"><span class="text-sm text-gray-600">Total Booking</span><span class="text-sm font-semibold text-gray-900">${ssrInterpolate(unref(booking).details.length)} sesi</span></div></div><div>`);
        if (unref(booking).paymentStatus !== "PAID") {
          _push(`<button${ssrIncludeBooleanAttr(unref(updating)) ? " disabled" : ""} class="w-full px-4 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white text-sm font-semibold rounded-xl transition-all shadow-sm">`);
          if (unref(updating)) {
            _push(`<span>Memproses...</span>`);
          } else {
            _push(`<span>Tandai Sudah Dibayar</span>`);
          }
          _push(`</button>`);
        } else {
          _push(`<div class="space-y-3"><div class="w-full px-4 py-2.5 bg-green-50 border border-green-200 text-green-700 text-sm font-semibold rounded-xl text-center"> ✓ Pembayaran Lunas </div><button${ssrIncludeBooleanAttr(unref(updating)) ? " disabled" : ""} class="w-full px-4 py-2.5 bg-white hover:bg-orange-50 border border-orange-300 disabled:bg-gray-100 text-orange-700 text-sm font-semibold rounded-xl transition-all shadow-sm">`);
          if (unref(updating)) {
            _push(`<span>Memproses...</span>`);
          } else {
            _push(`<span>Tandai Belum Lunas</span>`);
          }
          _push(`</button></div>`);
        }
        _push(`</div></div>`);
        if (unref(booking).status !== "CANCELLED") {
          _push(`<div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"><h3 class="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">Aksi Booking</h3><div class="space-y-3">`);
          if (unref(booking).status === "PENDING") {
            _push(`<button${ssrIncludeBooleanAttr(unref(updating)) ? " disabled" : ""} class="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-sm font-semibold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Setujui Booking </button>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<button${ssrIncludeBooleanAttr(unref(updating)) ? " disabled" : ""} class="w-full px-4 py-2.5 bg-white hover:bg-red-50 border border-red-300 disabled:bg-gray-100 text-red-700 text-sm font-semibold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Batalkan Booking </button></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="bg-gray-50 rounded-2xl border border-gray-200 p-5"><div class="flex items-start gap-3"><svg class="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><div><p class="text-xs font-bold text-gray-900 mb-1">Informasi</p><p class="text-xs text-gray-600 leading-relaxed"> Booking dibuat pada ${ssrInterpolate(formatDate(unref(booking).createdAt))}. ${ssrInterpolate(unref(booking).status === "PENDING" ? "Segera proses untuk konfirmasi kepada pemesan." : "")}</p></div></div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_ConfirmationModal, {
        ref_key: "confirmationModal",
        ref: confirmationModal
      }, null, _parent));
      _push(`</section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/bookings/detail/[bookingCode].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_bookingCode_-mtTPAp2d.mjs.map
