import { _ as __nuxt_component_0 } from './server.mjs';
import { defineComponent, withAsyncContext, ref, computed, mergeProps, withCtx, createBlock, createVNode, openBlock, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { u as useHead } from './composables-CKJj7D3Z.mjs';
import { u as useAsyncData } from './asyncData-BrYQBPBc.mjs';
import { u as usePagination } from './usePagination-A_v6pkFW.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "history",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    useHead({
      title: "Riwayat Booking - VENUE UNDIP",
      meta: [
        { name: "description", content: "Riwayat semua booking lapangan di VENUE UNDIP" }
      ]
    });
    const { data: bookings, pending, error, refresh } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "bookingsHistory",
      () => $fetch("/api/bookings/history"),
      {
        server: false,
        lazy: true,
        default: () => []
      }
    )), __temp = await __temp, __restore(), __temp);
    const searchQuery = ref("");
    const filteredBookings = computed(() => {
      if (!bookings.value) return [];
      const query = searchQuery.value.toLowerCase().trim();
      if (!query) return bookings.value;
      return bookings.value.filter(
        (booking) => booking.bookingCode.toLowerCase().includes(query) || booking.name.toLowerCase().includes(query)
      );
    });
    const statusFilter = ref("ALL");
    const paymentFilter = ref("ALL");
    const filteredByStatus = computed(() => {
      if (statusFilter.value === "ALL") return filteredBookings.value;
      return filteredBookings.value.filter((booking) => booking.status === statusFilter.value);
    });
    const filteredByPayment = computed(() => {
      if (paymentFilter.value === "ALL") return filteredByStatus.value;
      return filteredByStatus.value.filter((booking) => booking.paymentStatus === paymentFilter.value);
    });
    const sortOrder = ref("newest");
    const sortedBookings = computed(() => {
      const sorted = [...filteredByPayment.value];
      sorted.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder.value === "newest" ? dateB - dateA : dateA - dateB;
      });
      return sorted;
    });
    const {
      currentPage,
      paginatedItems: paginatedBookings,
      summary: paginationSummary,
      totalPages
    } = usePagination(sortedBookings, { itemsPerPage: 10 });
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    };
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
        "PENDING": "Menunggu",
        "APPROVED": "Disetujui",
        "CANCELLED": "Dibatalkan"
      };
      return texts[status] || status;
    };
    const getPaymentText = (status) => {
      return status === "PAID" ? "Lunas" : "Belum Bayar";
    };
    const getTotalBookings = (status) => {
      if (!bookings.value) return 0;
      if (!status || status === "ALL") return bookings.value.length;
      return bookings.value.filter((b) => b.status === status).length;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "flex w-full flex-col gap-6 sm:gap-8 pb-16" }, _attrs))}><header class="flex flex-col sm:flex-row sm:items-center justify-between gap-6"><div class="flex items-start gap-4"><div class="p-3 bg-blue-50 rounded-xl border border-blue-100 shrink-0 hidden sm:flex items-center justify-center"><svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div><div><h1 class="text-2xl uppercase font-bold text-gray-900 tracking-tight">Riwayat Booking</h1><p class="text-sm text-gray-500 mt-1"> Kelola dan pantau seluruh riwayat reservasi lapangan olahraga. </p></div></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/bookings",
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
      _push(`</header><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"><button class="${ssrRenderClass([
        "bg-white rounded-xl border p-5 shadow-sm text-left transition-all duration-200 hover:shadow-lg hover:scale-105 hover:border-blue-400 cursor-pointer",
        statusFilter.value === "ALL" ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200"
      ])}"><div class="flex items-center justify-between"><div><p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total Booking</p><p class="text-2xl font-bold text-gray-900 mt-1">${ssrInterpolate(getTotalBookings("ALL"))}</p></div><div class="${ssrRenderClass([
        "p-3 rounded-lg transition-colors",
        statusFilter.value === "ALL" ? "bg-blue-100" : "bg-blue-50"
      ])}"><svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg></div></div></button><button class="${ssrRenderClass([
        "bg-white rounded-xl border p-5 shadow-sm text-left transition-all duration-200 hover:shadow-lg hover:scale-105 hover:border-yellow-400 cursor-pointer",
        statusFilter.value === "PENDING" ? "border-yellow-500 ring-2 ring-yellow-200" : "border-gray-200"
      ])}"><div class="flex items-center justify-between"><div><p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Menunggu</p><p class="text-2xl font-bold text-yellow-600 mt-1">${ssrInterpolate(getTotalBookings("PENDING"))}</p></div><div class="${ssrRenderClass([
        "p-3 rounded-lg transition-colors",
        statusFilter.value === "PENDING" ? "bg-yellow-100" : "bg-yellow-50"
      ])}"><svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div></div></button><button class="${ssrRenderClass([
        "bg-white rounded-xl border p-5 shadow-sm text-left transition-all duration-200 hover:shadow-lg hover:scale-105 hover:border-green-400 cursor-pointer",
        statusFilter.value === "APPROVED" ? "border-green-500 ring-2 ring-green-200" : "border-gray-200"
      ])}"><div class="flex items-center justify-between"><div><p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Disetujui</p><p class="text-2xl font-bold text-green-600 mt-1">${ssrInterpolate(getTotalBookings("APPROVED"))}</p></div><div class="${ssrRenderClass([
        "p-3 rounded-lg transition-colors",
        statusFilter.value === "APPROVED" ? "bg-green-100" : "bg-green-50"
      ])}"><svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div></div></button><button class="${ssrRenderClass([
        "bg-white rounded-xl border p-5 shadow-sm text-left transition-all duration-200 hover:shadow-lg hover:scale-105 hover:border-red-400 cursor-pointer",
        statusFilter.value === "CANCELLED" ? "border-red-500 ring-2 ring-red-200" : "border-gray-200"
      ])}"><div class="flex items-center justify-between"><div><p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Dibatalkan</p><p class="text-2xl font-bold text-red-600 mt-1">${ssrInterpolate(getTotalBookings("CANCELLED"))}</p></div><div class="${ssrRenderClass([
        "p-3 rounded-lg transition-colors",
        statusFilter.value === "CANCELLED" ? "bg-red-100" : "bg-red-50"
      ])}"><svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div></div></button></div><div class="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden"><div class="p-5 border-b border-gray-200 bg-gray-50/30"><div class="flex flex-col gap-4"><div class="relative w-full lg:max-w-md"><div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></div><input${ssrRenderAttr("value", searchQuery.value)} type="search" class="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-500 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 transition-shadow" placeholder="Cari kode booking atau nama client..."></div><div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"><div class="flex items-center gap-2 flex-wrap"><span class="text-xs font-semibold text-gray-600 mr-1">Status Pembayaran:</span><button class="${ssrRenderClass([
        "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
        paymentFilter.value === "ALL" ? "bg-blue-600 text-white shadow-md" : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
      ])}"> Semua </button><button class="${ssrRenderClass([
        "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
        paymentFilter.value === "PAID" ? "bg-green-600 text-white shadow-md" : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
      ])}"> Lunas </button><button class="${ssrRenderClass([
        "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
        paymentFilter.value === "UNPAID" ? "bg-orange-600 text-white shadow-md" : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
      ])}"> Belum Bayar </button></div><div class="flex items-center gap-2"><span class="text-xs font-semibold text-gray-600 mr-1">Urutkan:</span><button class="${ssrRenderClass([
        "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1",
        sortOrder.value === "newest" ? "bg-blue-600 text-white shadow-md" : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
      ])}"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg> Terbaru </button><button class="${ssrRenderClass([
        "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1",
        sortOrder.value === "oldest" ? "bg-blue-600 text-white shadow-md" : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
      ])}"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path></svg> Terlama </button></div></div></div></div>`);
      if (unref(error)) {
        _push(`<div class="p-8 text-center"><div class="inline-flex items-center justify-center w-16 h-16 bg-red-50 rounded-full mb-4"><svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div><p class="text-sm font-semibold text-gray-900 mb-1">Gagal memuat data riwayat booking</p><button class="mt-3 text-sm font-semibold text-blue-600 hover:text-blue-700 underline"> Coba lagi </button></div>`);
      } else if (unref(pending)) {
        _push(`<div class="p-8"><div class="animate-pulse space-y-4"><!--[-->`);
        ssrRenderList(5, (i) => {
          _push(`<div class="h-16 bg-gray-100 rounded-lg"></div>`);
        });
        _push(`<!--]--></div></div>`);
      } else if (sortedBookings.value.length === 0) {
        _push(`<div class="p-12 text-center"><div class="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4"><svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg></div><h3 class="text-base font-bold text-gray-900 mb-1">Tidak ada data booking</h3><p class="text-sm text-gray-500">${ssrInterpolate(searchQuery.value ? "Tidak ditemukan booking dengan kata kunci tersebut." : "Belum ada riwayat booking.")}</p></div>`);
      } else {
        _push(`<div class="overflow-x-auto"><table class="w-full"><thead class="bg-gray-50 border-b border-gray-200"><tr><th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"> Kode Booking </th><th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"> Nama Client </th><th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"> Kontak </th><th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"> Status </th><th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"> Pembayaran </th><th class="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider"> Aksi </th></tr></thead><tbody class="bg-white divide-y divide-gray-200"><!--[-->`);
        ssrRenderList(unref(paginatedBookings), (booking) => {
          _push(`<tr class="hover:bg-gray-50 transition-colors"><td class="px-6 py-4"><div class="flex flex-col"><span class="text-sm font-bold text-blue-600">${ssrInterpolate(booking.bookingCode)}</span><span class="text-xs text-gray-500 mt-0.5">${ssrInterpolate(formatDate(booking.createdAt))}</span></div></td><td class="px-6 py-4"><div class="flex flex-col"><span class="text-sm font-semibold text-gray-900">${ssrInterpolate(booking.name)}</span>`);
          if (booking.isAcademic) {
            _push(`<span class="text-xs text-gray-500 mt-0.5"><span class="inline-flex items-center gap-1"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg> Akademik </span></span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></td><td class="px-6 py-4"><div class="flex flex-col"><span class="text-sm text-gray-900">${ssrInterpolate(booking.contact)}</span><span class="text-xs text-gray-500">${ssrInterpolate(booking.email)}</span></div></td><td class="px-6 py-4 whitespace-nowrap"><span class="${ssrRenderClass([
            "inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border",
            getStatusClasses(booking.status)
          ])}">${ssrInterpolate(getStatusText(booking.status))}</span></td><td class="px-6 py-4 whitespace-nowrap"><span class="${ssrRenderClass([
            "inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border",
            getPaymentStatusClasses(booking.paymentStatus)
          ])}">${ssrInterpolate(getPaymentText(booking.paymentStatus))}</span></td><td class="px-6 py-4 whitespace-nowrap text-center"><button class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg> Detail </button></td></tr>`);
        });
        _push(`<!--]--></tbody></table></div>`);
      }
      if (!unref(pending) && unref(totalPages) > 1) {
        _push(`<nav class="flex flex-col-reverse items-center justify-between gap-4 bg-gray-50/30 px-6 py-4 border-t border-gray-200 sm:flex-row"><span class="text-xs text-gray-500 font-medium">${ssrInterpolate(unref(paginationSummary))}</span><div class="flex items-center gap-2"><button${ssrIncludeBooleanAttr(unref(currentPage) === 1) ? " disabled" : ""} class="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"><svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"></path></svg></button><div class="px-4 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 shadow-sm">${ssrInterpolate(unref(currentPage))} / ${ssrInterpolate(unref(totalPages))}</div><button${ssrIncludeBooleanAttr(unref(currentPage) === unref(totalPages)) ? " disabled" : ""} class="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"><svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"></path></svg></button></div></nav>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/bookings/history.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=history-Bcyy7VFg.mjs.map
