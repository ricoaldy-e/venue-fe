import { _ as __nuxt_component_0 } from './nuxt-link-DqM75kvd.mjs';
import { defineComponent, computed, ref, withAsyncContext, watch, mergeProps, withCtx, createBlock, createVNode, openBlock, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrIncludeBooleanAttr, ssrInterpolate, ssrRenderComponent, ssrRenderAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList } from 'vue/server-renderer';
import { useDebounceFn } from '@vueuse/core';
import { u as useAppOptions } from './server.mjs';
import { u as useHead } from './composables-D8u1NqZw.mjs';
import { u as useFetch } from './fetch-B8t2Jth9.mjs';
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
import '@vue/shared';
import './asyncData-DCHdo3Ys.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { options } = useAppOptions();
    computed(() => options.value.data?.name || "VENUE UNDIP");
    useHead({
      title: "Riwayat Booking - VENUE UNDIP",
      meta: [
        { name: "description", content: "Lihat seluruh riwayat booking lapangan di VENUE UNDIP" }
      ]
    });
    const currentPage = ref(1);
    const itemsPerPage = ref(10);
    const searchQuery = ref("");
    const statusFilter = ref("");
    const paymentFilter = ref("");
    const selectedStadionId = ref("");
    const sortOrder = ref("desc");
    ref(null);
    const lastRefreshTime = ref("");
    const isRefreshing = ref(false);
    const queryParams = computed(() => ({
      page: currentPage.value,
      limit: itemsPerPage.value,
      search: searchQuery.value || void 0,
      status: statusFilter.value || void 0,
      paymentStatus: paymentFilter.value || void 0,
      stadionId: selectedStadionId.value || void 0,
      sortOrder: sortOrder.value
    }));
    const defaultSummary = {
      totalCount: 0,
      paidCount: 0,
      unpaidCount: 0,
      academicCount: 0,
      nonAcademicCount: 0,
      approvedCount: 0,
      cancelledCount: 0,
      pendingCount: 0
    };
    const { data: response, pending, error, refresh } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/bookings/history",
      {
        query: queryParams,
        server: false,
        lazy: true,
        default: () => ({
          data: [],
          pagination: { page: 1, limit: 10, total: 0, totalPages: 0, hasNextPage: false, hasPrevPage: false },
          summary: defaultSummary
        })
      },
      "$Gq7AAfq7Ei"
    )), __temp = await __temp, __restore(), __temp);
    const { data: stadionsData } = ([__temp, __restore] = withAsyncContext(() => useFetch("/api/stadions", {
      server: false,
      lazy: true,
      default: () => []
    }, "$2nx8NG8bdF")), __temp = await __temp, __restore(), __temp);
    const stadions = computed(() => stadionsData.value || []);
    const bookings = computed(() => response.value?.data || []);
    const pagination = computed(() => response.value?.pagination || { page: 1, limit: 10, total: 0, totalPages: 0, hasNextPage: false, hasPrevPage: false });
    const summary = computed(() => response.value?.summary || defaultSummary);
    const debouncedRefresh = useDebounceFn(() => {
      currentPage.value = 1;
      refresh();
    }, 300);
    watch([searchQuery, statusFilter, paymentFilter, selectedStadionId, sortOrder], () => {
      debouncedRefresh();
    });
    const paginationSummary = computed(() => {
      const p = pagination.value;
      if (p.total === 0) return "Tidak ada data";
      const start = (p.page - 1) * p.limit + 1;
      const end = Math.min(p.page * p.limit, p.total);
      return `Menampilkan ${start}-${end} dari ${p.total} data`;
    });
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Jakarta"
      });
    };
    const formatSlotDate = (booking) => {
      if (!booking.details || booking.details.length === 0) return "-";
      const uniqueDates = [...new Set(booking.details.map((d) => d.bookingDate))].sort();
      if (uniqueDates.length === 0) return "-";
      if (uniqueDates.length === 1) {
        const date = new Date(uniqueDates[0]);
        return date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Jakarta" });
      }
      const isConsecutive = (dates) => {
        for (let i = 1; i < dates.length; i++) {
          const prev = new Date(dates[i - 1]);
          const curr = new Date(dates[i]);
          const diffDays = (curr.getTime() - prev.getTime()) / (1e3 * 60 * 60 * 24);
          if (diffDays !== 1) return false;
        }
        return true;
      };
      const formatDate2 = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Jakarta" });
      };
      if (isConsecutive(uniqueDates)) {
        return `${formatDate2(uniqueDates[0])} - ${formatDate2(uniqueDates[uniqueDates.length - 1])}`;
      }
      const groups = [];
      let currentGroup = [uniqueDates[0]];
      for (let i = 1; i < uniqueDates.length; i++) {
        const prev = new Date(uniqueDates[i - 1]);
        const curr = new Date(uniqueDates[i]);
        const diffDays = (curr.getTime() - prev.getTime()) / (1e3 * 60 * 60 * 24);
        if (diffDays === 1) {
          currentGroup.push(uniqueDates[i]);
        } else {
          groups.push([...currentGroup]);
          currentGroup = [uniqueDates[i]];
        }
      }
      groups.push(currentGroup);
      const formattedGroups = groups.map((group) => {
        if (group.length === 1) {
          return formatDate2(group[0]);
        } else {
          return `${formatDate2(group[0])} - ${formatDate2(group[group.length - 1])}`;
        }
      });
      return formattedGroups.join(", ");
    };
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
      }).format(amount);
    };
    const getStatusClasses = (status) => {
      const classes = {
        // 'PENDING': 'bg-yellow-50 text-yellow-700 border-yellow-200', // Temporarily disabled
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
        // 'PENDING': 'Menunggu',
        "APPROVED": "Disetujui",
        "CANCELLED": "Dibatalkan"
      };
      return texts[status] || status;
    };
    const getPaymentText = (status) => {
      return status === "PAID" ? "Lunas" : "Belum Bayar";
    };
    const stadiumNameMap = computed(() => {
      const map = /* @__PURE__ */ new Map();
      if (stadions.value && stadions.value.length > 0) {
        stadions.value.forEach((s) => {
          map.set(Number(s.id), s.name);
        });
      }
      return map;
    });
    const getStadiumName = (booking) => {
      if (!booking.details || booking.details.length === 0) return "-";
      const stadiumNames = [...new Set(
        booking.details.map((d) => {
          if (d.Field?.stadionId) {
            const mappedName = stadiumNameMap.value.get(Number(d.Field.stadionId));
            if (mappedName) {
              return mappedName;
            }
          }
          if (d.Field?.Stadion?.name) {
            return d.Field.Stadion.name;
          }
          return null;
        }).filter((name) => name !== null && name !== "-" && name !== void 0)
      )];
      if (stadiumNames.length === 0) return "-";
      if (stadiumNames.length === 1) return stadiumNames[0];
      return `${stadiumNames[0]} (+${stadiumNames.length - 1})`;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "flex w-full flex-col gap-6 sm:gap-8 pb-16 max-w-7xl mx-auto" }, _attrs))}><header class="flex flex-col sm:flex-row sm:items-center justify-between gap-6"><div class="flex items-start gap-4"><div class="p-3 bg-blue-50 rounded-xl border border-blue-100 shrink-0 hidden sm:flex items-center justify-center"><svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div><div><h1 class="text-2xl uppercase font-bold text-gray-900 tracking-tight">Riwayat &amp; Kelola Booking</h1><p class="text-sm text-gray-500 mt-1"> Kelola dan pantau seluruh riwayat reservasi lapangan olahraga. </p><div class="flex items-center gap-3 mt-2"><button${ssrIncludeBooleanAttr(isRefreshing.value) ? " disabled" : ""} class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-all active:scale-95 disabled:opacity-50" title="Refresh data"><svg class="${ssrRenderClass(["h-3.5 w-3.5", isRefreshing.value ? "animate-spin" : ""])}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg><span>Refresh</span></button>`);
      if (lastRefreshTime.value) {
        _push(`<span class="text-xs text-gray-400"><span class="hidden sm:inline">Update terakhir:</span> ${ssrInterpolate(lastRefreshTime.value)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<span class="text-xs text-gray-400 hidden sm:inline">• Auto-refresh: 1 menit</span></div></div></div><div class="flex items-center gap-2">`);
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
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/bookings/history/payment",
        class: "inline-flex items-center gap-2 rounded-lg border border-emerald-600 bg-emerald-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition-all hover:bg-emerald-700 active:scale-95"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"${_scopeId}></path></svg><span${_scopeId}>Laporan Pembayaran</span>`);
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
                  d: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                })
              ])),
              createVNode("span", null, "Laporan Pembayaran")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></header><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"><div class="${ssrRenderClass([
        "bg-white rounded-xl border p-5 shadow-sm text-left transition-all duration-200",
        statusFilter.value === "" ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200"
      ])}"><div class="flex items-center justify-between"><div><p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total Booking</p><p class="text-2xl font-bold text-gray-900 mt-1">${ssrInterpolate(pagination.value.total)}</p></div><div class="${ssrRenderClass([
        "p-3 rounded-lg transition-colors",
        statusFilter.value === "" ? "bg-blue-100" : "bg-blue-50"
      ])}"><svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg></div></div></div><div class="${ssrRenderClass([
        "bg-white rounded-xl border p-5 shadow-sm text-left transition-all duration-200",
        statusFilter.value === "APPROVED" ? "border-green-500 ring-2 ring-green-200" : "border-gray-200"
      ])}"><div class="flex items-center justify-between"><div><p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Disetujui</p><p class="text-2xl font-bold text-green-600 mt-1">${ssrInterpolate(summary.value.approvedCount)}</p></div><div class="${ssrRenderClass([
        "p-3 rounded-lg transition-colors",
        statusFilter.value === "APPROVED" ? "bg-green-100" : "bg-green-50"
      ])}"><svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div></div></div><div class="${ssrRenderClass([
        "bg-white rounded-xl border p-5 shadow-sm text-left transition-all duration-200",
        statusFilter.value === "CANCELLED" ? "border-red-500 ring-2 ring-red-200" : "border-gray-200"
      ])}"><div class="flex items-center justify-between"><div><p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Dibatalkan</p><p class="text-2xl font-bold text-red-600 mt-1">${ssrInterpolate(summary.value.cancelledCount)}</p></div><div class="${ssrRenderClass([
        "p-3 rounded-lg transition-colors",
        statusFilter.value === "CANCELLED" ? "bg-red-100" : "bg-red-50"
      ])}"><svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div></div></div></div><div class="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden"><div class="p-5 border-b border-gray-200 bg-gray-50/30"><div class="flex flex-col gap-4"><div class="relative w-full lg:max-w-md"><div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></div><input${ssrRenderAttr("value", searchQuery.value)} type="search" class="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-500 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 transition-shadow" placeholder="Cari kode booking atau nama client..."></div><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"><div><label class="block text-xs font-semibold text-gray-600 mb-2">Stadion</label><div class="relative"><select class="appearance-none w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 p-3 pr-10 transition-colors hover:bg-gray-100/50 cursor-pointer font-medium shadow-sm"><option value=""${ssrIncludeBooleanAttr(Array.isArray(selectedStadionId.value) ? ssrLooseContain(selectedStadionId.value, "") : ssrLooseEqual(selectedStadionId.value, "")) ? " selected" : ""}>Semua Stadion</option><!--[-->`);
      ssrRenderList(stadions.value, (stadion) => {
        _push(`<option${ssrRenderAttr("value", stadion.id)}${ssrIncludeBooleanAttr(Array.isArray(selectedStadionId.value) ? ssrLooseContain(selectedStadionId.value, stadion.id) : ssrLooseEqual(selectedStadionId.value, stadion.id)) ? " selected" : ""}>${ssrInterpolate(stadion.name)}</option>`);
      });
      _push(`<!--]--></select><div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"><svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></div></div></div><div><label class="block text-xs font-semibold text-gray-600 mb-2">Status Booking</label><div class="relative"><select class="appearance-none w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 p-3 pr-10 transition-colors hover:bg-gray-100/50 cursor-pointer font-medium shadow-sm"><option value=""${ssrIncludeBooleanAttr(Array.isArray(statusFilter.value) ? ssrLooseContain(statusFilter.value, "") : ssrLooseEqual(statusFilter.value, "")) ? " selected" : ""}>Semua Status</option><option value="APPROVED"${ssrIncludeBooleanAttr(Array.isArray(statusFilter.value) ? ssrLooseContain(statusFilter.value, "APPROVED") : ssrLooseEqual(statusFilter.value, "APPROVED")) ? " selected" : ""}>Disetujui</option><option value="CANCELLED"${ssrIncludeBooleanAttr(Array.isArray(statusFilter.value) ? ssrLooseContain(statusFilter.value, "CANCELLED") : ssrLooseEqual(statusFilter.value, "CANCELLED")) ? " selected" : ""}>Dibatalkan</option></select><div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"><svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></div></div></div><div><label class="block text-xs font-semibold text-gray-600 mb-2">Status Pembayaran</label><div class="relative"><select class="appearance-none w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 p-3 pr-10 transition-colors hover:bg-gray-100/50 cursor-pointer font-medium shadow-sm"><option value=""${ssrIncludeBooleanAttr(Array.isArray(paymentFilter.value) ? ssrLooseContain(paymentFilter.value, "") : ssrLooseEqual(paymentFilter.value, "")) ? " selected" : ""}>Semua Status</option><option value="PAID"${ssrIncludeBooleanAttr(Array.isArray(paymentFilter.value) ? ssrLooseContain(paymentFilter.value, "PAID") : ssrLooseEqual(paymentFilter.value, "PAID")) ? " selected" : ""}>Lunas</option><option value="UNPAID"${ssrIncludeBooleanAttr(Array.isArray(paymentFilter.value) ? ssrLooseContain(paymentFilter.value, "UNPAID") : ssrLooseEqual(paymentFilter.value, "UNPAID")) ? " selected" : ""}>Belum Bayar</option></select><div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"><svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></div></div></div><div><label class="block text-xs font-semibold text-gray-600 mb-2">Urutkan</label><div class="relative"><select class="appearance-none w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 p-3 pr-10 transition-colors hover:bg-gray-100/50 cursor-pointer font-medium shadow-sm"><option value="desc"${ssrIncludeBooleanAttr(Array.isArray(sortOrder.value) ? ssrLooseContain(sortOrder.value, "desc") : ssrLooseEqual(sortOrder.value, "desc")) ? " selected" : ""}>Terbaru</option><option value="asc"${ssrIncludeBooleanAttr(Array.isArray(sortOrder.value) ? ssrLooseContain(sortOrder.value, "asc") : ssrLooseEqual(sortOrder.value, "asc")) ? " selected" : ""}>Terlama</option></select><div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"><svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></div></div></div></div></div></div></div><div class="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden"><div class="p-5 border-b border-gray-200 bg-gray-50/30"><div class="flex items-center justify-between"><h3 class="text-sm font-bold text-gray-900 uppercase tracking-wider">Data Booking</h3><div class="text-sm text-gray-600"><span class="font-bold text-blue-600">${ssrInterpolate(pagination.value.total)}</span> transaksi </div></div></div>`);
      if (unref(error)) {
        _push(`<div class="p-12 text-center"><div class="inline-flex items-center justify-center w-16 h-16 bg-red-50 rounded-full mb-4"><svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div><p class="text-sm font-semibold text-gray-900 mb-1">Gagal memuat data booking</p><button class="mt-3 text-sm font-semibold text-blue-600 hover:text-blue-700 underline"> Coba lagi </button></div>`);
      } else if (unref(pending)) {
        _push(`<div class="p-12 text-center"><div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-blue-600"></div><p class="mt-4 text-sm text-gray-500">Memuat data...</p></div>`);
      } else if (bookings.value.length === 0) {
        _push(`<div class="p-12 text-center"><div class="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4"><svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg></div><p class="text-sm font-semibold text-gray-900 mb-1">Tidak ada data booking</p><p class="text-xs text-gray-500 mt-1">${ssrInterpolate(searchQuery.value ? "Tidak ditemukan booking dengan kata kunci tersebut." : "Belum ada riwayat booking.")}</p></div>`);
      } else {
        _push(`<div class="overflow-x-auto"><table class="w-full border-collapse"><thead><tr class="bg-gray-50 border-b-2 border-gray-200"><th class="px-5 py-3.5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"> Info Booking </th><th class="px-5 py-3.5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"> Client </th><th class="px-5 py-3.5 text-center text-xs font-bold text-gray-700 uppercase tracking-wider"> Stadion </th><th class="px-5 py-3.5 text-right text-xs font-bold text-gray-700 uppercase tracking-wider"> Total Harga </th><th class="px-5 py-3.5 text-center text-xs font-bold text-gray-700 uppercase tracking-wider"> Status </th><th class="px-5 py-3.5 text-center text-xs font-bold text-gray-700 uppercase tracking-wider"> Pembayaran </th><th class="px-5 py-3.5 text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-28"> Aksi </th></tr></thead><tbody class="bg-white divide-y divide-gray-100"><!--[-->`);
        ssrRenderList(bookings.value, (booking) => {
          _push(`<tr class="hover:bg-blue-50/30 transition-colors duration-150"><td class="px-5 py-4"><div class="flex flex-col gap-1.5"><span class="text-sm font-bold text-blue-600 tracking-tight">${ssrInterpolate(booking.bookingCode)}</span><div class="flex items-center gap-1.5 text-[11px] text-gray-500"><svg class="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><span class="font-medium">${ssrInterpolate(formatDate(booking.createdAt))}</span></div><div class="flex items-center gap-1.5 text-[11px] font-semibold text-gray-700"><svg class="w-3 h-3 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg><span>${ssrInterpolate(formatSlotDate(booking))}</span></div></div></td><td class="px-5 py-4"><div class="flex flex-col gap-1.5 max-w-xs"><span class="text-sm font-bold text-gray-900 truncate">${ssrInterpolate(booking.name)}</span><div class="flex items-center gap-2 flex-wrap"><span class="text-[11px] text-gray-600 font-medium">${ssrInterpolate(booking.contact)}</span>`);
          if (booking.renterType === "UMUM") {
            _push(`<span class="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 border border-gray-300 rounded-md text-[10px] font-bold text-gray-700"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"></path></svg> Umum </span>`);
          } else if (booking.renterType === "AKADEMIK") {
            _push(`<span class="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 border border-blue-200 rounded-md text-[10px] font-bold text-blue-700"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg> Akademik </span>`);
          } else if (booking.renterType === "TENDIK") {
            _push(`<span class="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-50 border border-purple-200 rounded-md text-[10px] font-bold text-purple-700"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg> Tendik </span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><span class="text-[11px] text-gray-500 truncate">${ssrInterpolate(booking.email)}</span></div></td><td class="px-5 py-4"><div class="flex justify-center"><span class="text-sm font-semibold text-gray-700 bg-gray-50 px-3 py-1 rounded-md border border-gray-200">${ssrInterpolate(getStadiumName(booking))}</span></div></td><td class="px-5 py-4"><div class="flex flex-col gap-0.5 items-end"><span class="text-sm font-bold text-gray-900 tabular-nums">${ssrInterpolate(formatCurrency(booking.totalPrice))}</span><span class="text-[10px] text-gray-500 font-medium">${ssrInterpolate(booking.details.length)} slot</span></div></td><td class="px-5 py-4"><div class="flex justify-center"><span class="${ssrRenderClass([
            "inline-flex items-center px-3 py-1.5 rounded-lg text-[11px] font-bold border whitespace-nowrap",
            getStatusClasses(booking.status)
          ])}">${ssrInterpolate(getStatusText(booking.status))}</span></div></td><td class="px-5 py-4"><div class="flex justify-center"><span class="${ssrRenderClass([
            "inline-flex items-center px-3 py-1.5 rounded-lg text-[11px] font-bold border whitespace-nowrap",
            getPaymentStatusClasses(booking.paymentStatus)
          ])}">${ssrInterpolate(getPaymentText(booking.paymentStatus))}</span></div></td><td class="px-5 py-4"><div class="flex justify-center"><button class="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-lg transition-all shadow-sm hover:shadow-md active:scale-95"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg> Detail </button></div></td></tr>`);
        });
        _push(`<!--]--></tbody></table></div>`);
      }
      if (!unref(pending) && pagination.value.totalPages > 1) {
        _push(`<nav class="flex flex-col-reverse items-center justify-between gap-4 bg-gray-50/30 px-6 py-4 border-t border-gray-200 sm:flex-row"><span class="text-xs text-gray-500 font-medium">${ssrInterpolate(paginationSummary.value)}</span><div class="flex items-center gap-2"><button${ssrIncludeBooleanAttr(!pagination.value.hasPrevPage) ? " disabled" : ""} class="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"><svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"></path></svg></button><div class="px-4 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 shadow-sm">${ssrInterpolate(pagination.value.page)} / ${ssrInterpolate(pagination.value.totalPages)}</div><button${ssrIncludeBooleanAttr(!pagination.value.hasNextPage) ? " disabled" : ""} class="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"><svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"></path></svg></button></div></nav>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/bookings/history/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-CPk5G_06.mjs.map
