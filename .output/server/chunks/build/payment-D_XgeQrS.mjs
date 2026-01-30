import { _ as __nuxt_component_0 } from './nuxt-link-DqM75kvd.mjs';
import { defineComponent, computed, ref, withAsyncContext, watch, mergeProps, unref, withCtx, createBlock, createVNode, openBlock, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderClass, ssrIncludeBooleanAttr, ssrRenderComponent, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderStyle } from 'vue/server-renderer';
import { _ as _imports_0 } from './VENUE-UNDIP-LOGO-C_mmPH8T.mjs';
import { useDebounceFn } from '@vueuse/core';
import dayjs from 'dayjs';
import { _ as _export_sfc, u as useAppOptions } from './server.mjs';
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
  __name: "payment",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { options } = useAppOptions();
    computed(() => options.value.data?.name || "VENUE UNDIP");
    useHead({
      title: "Laporan Pembayaran - VENUE UNDIP",
      meta: [
        { name: "description", content: "Laporan pembayaran dan pendapatan sewa lapangan di VENUE UNDIP" }
      ]
    });
    dayjs.locale("id");
    const filterMode = ref("daily");
    const selectedDate = ref(dayjs().format("YYYY-MM-DD"));
    const startDate = ref(dayjs().subtract(30, "day").format("YYYY-MM-DD"));
    const endDate = ref(dayjs().format("YYYY-MM-DD"));
    const printTimestamp = ref("");
    const selectedStadionId = ref("");
    const renterTypeFilter = ref("");
    const bookingStatusFilter = ref("");
    const paymentStatusFilter = ref("");
    const currentPage = ref(1);
    const itemsPerPage = ref(10);
    ref(null);
    const lastRefreshTime = ref("");
    const isRefreshing = ref(false);
    const queryParams = computed(() => {
      const params = {
        page: currentPage.value,
        limit: itemsPerPage.value,
        sortOrder: "desc"
      };
      if (filterMode.value === "daily") {
        params.startDate = selectedDate.value;
        params.endDate = selectedDate.value;
      } else {
        params.startDate = startDate.value;
        params.endDate = endDate.value;
      }
      if (selectedStadionId.value) {
        params.stadionId = selectedStadionId.value;
      }
      if (paymentStatusFilter.value) {
        params.paymentStatus = paymentStatusFilter.value;
      }
      if (renterTypeFilter.value) {
        params.renterType = renterTypeFilter.value;
      }
      if (bookingStatusFilter.value) {
        params.status = bookingStatusFilter.value;
      }
      return params;
    });
    const defaultSummary = {
      totalRevenue: 0,
      totalCount: 0,
      paidCount: 0,
      unpaidCount: 0,
      umumCount: 0,
      tendikCount: 0,
      academicCount: 0,
      nonAcademicCount: 0,
      academicRevenue: 0,
      nonAcademicRevenue: 0,
      paidPercentage: 0,
      averagePerBooking: 0
    };
    const { data: response, pending, error, refresh } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/bookings/history",
      {
        query: queryParams,
        server: false,
        lazy: true,
        watch: false,
        default: () => ({
          data: [],
          pagination: { page: 1, limit: 10, total: 0, totalPages: 0, hasNextPage: false, hasPrevPage: false },
          summary: defaultSummary
        })
      },
      "$8h024MF9og"
    )), __temp = await __temp, __restore(), __temp);
    const { data: stadionsData } = ([__temp, __restore] = withAsyncContext(() => useFetch("/api/stadions", {
      server: false,
      lazy: true,
      default: () => []
    }, "$Q57oRZXIa4")), __temp = await __temp, __restore(), __temp);
    const stadions = computed(() => stadionsData.value || []);
    const bookings = computed(() => response.value?.data || []);
    const pagination = computed(() => response.value?.pagination || { page: 1, limit: 10, total: 0, totalPages: 0, hasNextPage: false, hasPrevPage: false });
    const serverSummary = computed(() => response.value?.summary || defaultSummary);
    const debouncedRefresh = useDebounceFn(() => {
      currentPage.value = 1;
      refresh();
    }, 300);
    watch([filterMode, selectedDate, startDate, endDate, selectedStadionId, paymentStatusFilter, renterTypeFilter, bookingStatusFilter], () => {
      debouncedRefresh();
    });
    const isRangeActive = (days) => {
      if (days === 0) {
        return startDate.value === dayjs().startOf("month").format("YYYY-MM-DD") && endDate.value === dayjs().endOf("month").format("YYYY-MM-DD");
      }
      return startDate.value === dayjs().subtract(days - 1, "day").format("YYYY-MM-DD") && endDate.value === dayjs().format("YYYY-MM-DD");
    };
    const formattedDateRange = computed(() => {
      if (filterMode.value === "daily") {
        return dayjs(selectedDate.value).format("dddd, DD MMMM YYYY");
      }
      return `${dayjs(startDate.value).format("DD MMM YYYY")} - ${dayjs(endDate.value).format("DD MMM YYYY")}`;
    });
    const selectedDayName = computed(() => {
      return dayjs(selectedDate.value).format("dddd");
    });
    const paginationSummary = computed(() => {
      const p = pagination.value;
      if (p.total === 0) return "Tidak ada data";
      const start = (p.page - 1) * p.limit + 1;
      const end = Math.min(p.page * p.limit, p.total);
      return `Menampilkan ${start}-${end} dari ${p.total} data`;
    });
    const paymentSummary = computed(() => {
      const summary = serverSummary.value;
      return {
        totalRevenue: summary.totalRevenue,
        totalBookings: summary.totalCount,
        paidBookings: summary.paidCount,
        unpaidBookings: summary.unpaidCount,
        umumBookings: summary.umumCount || 0,
        tendikBookings: summary.tendikCount || 0,
        academicBookings: summary.academicCount,
        nonAcademicBookings: summary.nonAcademicCount,
        academicRevenue: summary.academicRevenue,
        nonAcademicRevenue: summary.nonAcademicRevenue,
        avgPerBooking: summary.averagePerBooking,
        paidPercentage: summary.paidPercentage
      };
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
      const formatDateItem = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Jakarta" });
      };
      if (isConsecutive(uniqueDates)) {
        return `${formatDateItem(uniqueDates[0])} - ${formatDateItem(uniqueDates[uniqueDates.length - 1])}`;
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
          return formatDateItem(group[0]);
        } else {
          return `${formatDateItem(group[0])} - ${formatDateItem(group[group.length - 1])}`;
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
    const getPaymentStatusClasses = (status) => {
      return status === "PAID" ? "bg-green-50 text-green-700 border-green-200" : "bg-orange-50 text-orange-700 border-orange-200";
    };
    const getStatusClasses = (status) => {
      const classes = {
        // 'PENDING': 'bg-yellow-50 text-yellow-700 border-yellow-200', // Temporarily disabled
        "APPROVED": "bg-green-50 text-green-700 border-green-200",
        "CANCELLED": "bg-red-50 text-red-700 border-red-200"
      };
      return classes[status] || "bg-gray-50 text-gray-700 border-gray-200";
    };
    const getStatusText = (status) => {
      const texts = {
        "APPROVED": "Disetujui",
        "CANCELLED": "Dibatalkan"
      };
      return texts[status] || status;
    };
    const getPaymentText = (status) => {
      return status === "PAID" ? "Lunas" : "Belum Bayar";
    };
    ref(false);
    ref(10);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "flex w-full flex-col gap-6 sm:gap-8 pb-16 print:pb-8 max-w-7xl mx-auto" }, _attrs))} data-v-d27126ed><div class="hidden print:block pb-4 border-b-2 border-gray-900" data-v-d27126ed><div class="flex items-start gap-4" data-v-d27126ed><div class="w-16 h-16 flex items-center justify-center shrink-0" data-v-d27126ed><img${ssrRenderAttr("src", _imports_0)} alt="VENUE UNDIP Logo" class="w-full h-full object-contain logo-print-color" data-v-d27126ed></div><div class="flex-1" data-v-d27126ed><h1 class="text-xl font-bold text-gray-900 uppercase tracking-tight leading-tight" data-v-d27126ed>Laporan Pembayaran Booking</h1><h2 class="text-base font-semibold text-gray-700 mt-0.5" data-v-d27126ed>${ssrInterpolate(unref(options).data?.unitName || "UPT Layanan Seni, Budaya dan Olahraga")}</h2><p class="text-[10px] text-gray-600 mt-1 leading-tight" data-v-d27126ed>${ssrInterpolate(unref(options).data?.address || "Jl. Prof. Soedarto, Tembalang, Kec. Tembalang, Kota Semarang, Jawa Tengah")}</p></div><div class="text-right shrink-0" data-v-d27126ed><div class="mb-2" data-v-d27126ed><p class="text-[9px] font-bold text-gray-500 uppercase tracking-wider" data-v-d27126ed>Periode Data</p><p class="text-xs font-bold text-gray-900" data-v-d27126ed>${ssrInterpolate(formattedDateRange.value)}</p></div><div data-v-d27126ed><p class="text-[9px] font-bold text-gray-500 uppercase tracking-wider" data-v-d27126ed>Dicetak Pada</p><p class="text-[10px] font-medium text-gray-700" data-v-d27126ed>${ssrInterpolate(printTimestamp.value)}</p></div></div></div></div><header class="flex flex-col sm:flex-row sm:items-center justify-between gap-6 print:hidden" data-v-d27126ed><div class="flex items-start gap-4" data-v-d27126ed><div class="p-3 bg-emerald-50 rounded-xl border border-emerald-100 shrink-0 hidden sm:flex items-center justify-center" data-v-d27126ed><svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-d27126ed><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" data-v-d27126ed></path></svg></div><div data-v-d27126ed><h1 class="text-2xl uppercase font-bold text-gray-900 tracking-tight" data-v-d27126ed>Laporan Pembayaran</h1><p class="text-sm text-gray-500 mt-1" data-v-d27126ed> Analisis pendapatan dan laporan pembayaran booking lapangan. </p><div class="flex items-center gap-3 mt-2" data-v-d27126ed><button${ssrIncludeBooleanAttr(isRefreshing.value) ? " disabled" : ""} class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-all active:scale-95 disabled:opacity-50" title="Refresh data" data-v-d27126ed><svg class="${ssrRenderClass(["h-3.5 w-3.5", isRefreshing.value ? "animate-spin" : ""])}" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-d27126ed><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" data-v-d27126ed></path></svg><span data-v-d27126ed>Refresh</span></button>`);
      if (lastRefreshTime.value) {
        _push(`<span class="text-xs text-gray-400" data-v-d27126ed><span class="hidden sm:inline" data-v-d27126ed>Update terakhir:</span> ${ssrInterpolate(lastRefreshTime.value)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<span class="text-xs text-gray-400 hidden sm:inline" data-v-d27126ed>• Auto-refresh: 1 menit</span></div></div></div><div class="flex items-center gap-2" data-v-d27126ed>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/bookings/history",
        class: "inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:text-[#1f2a56] hover:border-[#1f2a56] hover:shadow-md active:scale-95"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-d27126ed${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" data-v-d27126ed${_scopeId}></path></svg><span data-v-d27126ed${_scopeId}>Kembali</span>`);
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
      _push(`<button class="inline-flex items-center gap-2 rounded-lg border border-gray-800 bg-gray-800 px-4 py-2 text-sm font-bold text-white shadow-sm transition-all hover:bg-gray-900 active:scale-95" data-v-d27126ed><svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-d27126ed><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" data-v-d27126ed></path></svg><span data-v-d27126ed>Cetak Laporan</span></button></div></header><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:hidden" data-v-d27126ed><div class="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-6 text-white shadow-lg min-h-[120px] flex flex-col" data-v-d27126ed><div class="flex items-center justify-between mb-2" data-v-d27126ed><span class="text-xs font-bold uppercase tracking-wide opacity-90" data-v-d27126ed>Total Pendapatan</span><svg class="w-8 h-8 opacity-20 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" data-v-d27126ed><path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" data-v-d27126ed></path><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd" data-v-d27126ed></path></svg></div><p class="text-3xl font-black flex-grow break-words overflow-hidden" data-v-d27126ed>${ssrInterpolate(formatCurrency(paymentSummary.value.totalRevenue))}</p><p class="text-xs opacity-90 mt-2" data-v-d27126ed>${ssrInterpolate(paymentSummary.value.paidBookings)} transaksi lunas</p></div><div class="bg-white border-2 border-blue-200 rounded-xl p-6 shadow-sm min-h-[120px] flex flex-col" data-v-d27126ed><div class="flex items-center justify-between mb-2" data-v-d27126ed><span class="text-xs font-bold uppercase tracking-wide text-gray-600" data-v-d27126ed>Rata-rata / Booking</span><svg class="w-8 h-8 text-blue-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" data-v-d27126ed><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" data-v-d27126ed></path></svg></div><p class="text-3xl font-black text-gray-900 flex-grow break-words overflow-hidden" data-v-d27126ed>${ssrInterpolate(formatCurrency(paymentSummary.value.avgPerBooking))}</p><p class="text-xs text-gray-500 mt-2" data-v-d27126ed>Per transaksi lunas</p></div><div class="bg-white border-2 border-green-200 rounded-xl p-6 shadow-sm min-h-[120px] flex flex-col" data-v-d27126ed><div class="flex items-center justify-between mb-2" data-v-d27126ed><span class="text-xs font-bold uppercase tracking-wide text-gray-600" data-v-d27126ed>Tingkat Lunas</span><svg class="w-8 h-8 text-green-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" data-v-d27126ed><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" data-v-d27126ed></path></svg></div><p class="text-3xl font-black text-green-600 flex-grow" data-v-d27126ed>${ssrInterpolate(Math.round(paymentSummary.value.paidPercentage))}%</p><p class="text-xs text-gray-500 mt-2" data-v-d27126ed>${ssrInterpolate(paymentSummary.value.paidBookings)}/${ssrInterpolate(paymentSummary.value.totalBookings)} booking</p></div><div class="bg-white border-2 border-purple-200 rounded-xl p-6 shadow-sm min-h-[120px] flex flex-col" data-v-d27126ed><div class="flex items-center justify-between mb-2" data-v-d27126ed><span class="text-xs font-bold uppercase tracking-wide text-gray-600" data-v-d27126ed>Tipe Penyewa</span><svg class="w-8 h-8 text-purple-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" data-v-d27126ed><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" data-v-d27126ed></path></svg></div><div class="space-y-1 flex-grow overflow-y-auto" data-v-d27126ed><div class="flex justify-between text-sm" data-v-d27126ed><span class="text-gray-600 font-medium" data-v-d27126ed>Umum:</span><span class="font-bold text-gray-900" data-v-d27126ed>${ssrInterpolate(paymentSummary.value.umumBookings)}</span></div><div class="flex justify-between text-sm" data-v-d27126ed><span class="text-gray-600 font-medium" data-v-d27126ed>Tendik:</span><span class="font-bold text-purple-600" data-v-d27126ed>${ssrInterpolate(paymentSummary.value.tendikBookings)}</span></div><div class="flex justify-between text-sm" data-v-d27126ed><span class="text-gray-600 font-medium" data-v-d27126ed>Akademik:</span><span class="font-bold text-blue-600" data-v-d27126ed>${ssrInterpolate(paymentSummary.value.academicBookings)}</span></div></div></div></div><div class="hidden print:block" data-v-d27126ed><div class="grid grid-cols-4 gap-4 mb-2" data-v-d27126ed><div class="bg-transparent p-3 rounded border border-gray-900" data-v-d27126ed><p class="text-[9px] font-bold text-black uppercase mb-1" data-v-d27126ed>Total Pendapatan</p><p class="text-base font-black text-black" data-v-d27126ed>${ssrInterpolate(formatCurrency(paymentSummary.value.totalRevenue))}</p><p class="text-[8px] text-gray-700" data-v-d27126ed>${ssrInterpolate(paymentSummary.value.paidBookings)} transaksi lunas</p></div><div class="bg-transparent p-3 rounded border border-gray-900" data-v-d27126ed><p class="text-[9px] font-bold text-black uppercase mb-1" data-v-d27126ed>Rata-rata / Booking</p><p class="text-base font-black text-black" data-v-d27126ed>${ssrInterpolate(formatCurrency(paymentSummary.value.avgPerBooking))}</p><p class="text-[8px] text-gray-700" data-v-d27126ed>Per transaksi lunas</p></div><div class="bg-transparent p-3 rounded border border-gray-900" data-v-d27126ed><p class="text-[9px] font-bold text-black uppercase mb-1" data-v-d27126ed>Lunas / Belum Bayar</p><p class="text-base font-black text-black" data-v-d27126ed>${ssrInterpolate(paymentSummary.value.paidBookings)} / ${ssrInterpolate(paymentSummary.value.unpaidBookings)}</p><p class="text-[8px] text-gray-700" data-v-d27126ed>${ssrInterpolate(Math.round(paymentSummary.value.paidPercentage))}% tingkat lunas</p></div><div class="bg-transparent p-3 rounded border border-gray-900" data-v-d27126ed><p class="text-[9px] font-bold text-black uppercase mb-1" data-v-d27126ed>Tipe Penyewa</p><div class="flex justify-between text-[9px]" data-v-d27126ed><span data-v-d27126ed>Umum:</span><span class="font-bold" data-v-d27126ed>${ssrInterpolate(paymentSummary.value.umumBookings)}</span></div><div class="flex justify-between text-[9px]" data-v-d27126ed><span data-v-d27126ed>Tendik:</span><span class="font-bold" data-v-d27126ed>${ssrInterpolate(paymentSummary.value.tendikBookings)}</span></div><div class="flex justify-between text-[9px]" data-v-d27126ed><span data-v-d27126ed>Akademik:</span><span class="font-bold" data-v-d27126ed>${ssrInterpolate(paymentSummary.value.academicBookings)}</span></div></div></div></div><div class="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden print:hidden" data-v-d27126ed><div class="p-5 border-b border-gray-200 bg-gray-50/30" data-v-d27126ed><h3 class="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4" data-v-d27126ed>Filter Laporan</h3><div class="space-y-4" data-v-d27126ed><div data-v-d27126ed><label class="block text-xs font-semibold text-gray-600 mb-2" data-v-d27126ed>Mode Laporan</label><div class="flex gap-2" data-v-d27126ed><button class="${ssrRenderClass(["flex-1 px-4 py-2.5 rounded-xl text-sm font-bold transition-all", filterMode.value === "daily" ? "bg-blue-600 text-white shadow-md" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"])}" data-v-d27126ed> Harian </button><button class="${ssrRenderClass(["flex-1 px-4 py-2.5 rounded-xl text-sm font-bold transition-all", filterMode.value === "range" ? "bg-blue-600 text-white shadow-md" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"])}" data-v-d27126ed> Rentang Tanggal </button></div></div>`);
      if (filterMode.value === "daily") {
        _push(`<div data-v-d27126ed><label class="block text-xs font-semibold text-gray-600 mb-2" data-v-d27126ed>Tanggal Booking Dibuat</label><div class="grid grid-cols-1 sm:grid-cols-2 gap-3" data-v-d27126ed><input type="date"${ssrRenderAttr("value", selectedDate.value)} class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 p-3 font-medium cursor-pointer shadow-sm" data-v-d27126ed><div class="hidden sm:flex items-center gap-2 w-full text-sm font-medium text-gray-600 bg-gray-50 px-4 py-3 rounded-xl border border-gray-300 border-dashed" data-v-d27126ed><svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-d27126ed><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" data-v-d27126ed></path></svg><span class="font-semibold" data-v-d27126ed>${ssrInterpolate(selectedDayName.value)}</span><span class="text-gray-400" data-v-d27126ed>•</span><span data-v-d27126ed>${ssrInterpolate(unref(dayjs)(selectedDate.value).format("DD/MM/YYYY"))}</span></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (filterMode.value === "range") {
        _push(`<div class="space-y-3" data-v-d27126ed><div data-v-d27126ed><label class="block text-xs font-semibold text-gray-600 mb-2" data-v-d27126ed>Periode Tanggal Booking Dibuat</label><div class="flex flex-col sm:flex-row items-start sm:items-center gap-3" data-v-d27126ed><div class="flex items-center gap-2 flex-1 w-full" data-v-d27126ed><input type="date"${ssrRenderAttr("value", startDate.value)} class="flex-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 p-2.5 shadow-sm" data-v-d27126ed><span class="text-gray-400" data-v-d27126ed>—</span><input type="date"${ssrRenderAttr("value", endDate.value)} class="flex-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 p-2.5 shadow-sm" data-v-d27126ed></div><div class="flex gap-2" data-v-d27126ed><button class="${ssrRenderClass(["px-3 py-2 rounded-lg text-xs font-bold transition-all", isRangeActive(7) ? "bg-blue-600 text-white shadow-md" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"])}" data-v-d27126ed> 7 Hari </button><button class="${ssrRenderClass(["px-3 py-2 rounded-lg text-xs font-bold transition-all", isRangeActive(30) ? "bg-blue-600 text-white shadow-md" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"])}" data-v-d27126ed> 30 Hari </button><button class="${ssrRenderClass(["px-3 py-2 rounded-lg text-xs font-bold transition-all", isRangeActive(0) ? "bg-blue-600 text-white shadow-md" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"])}" data-v-d27126ed> Bulan Ini </button></div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" data-v-d27126ed><div data-v-d27126ed><label class="block text-xs font-semibold text-gray-600 mb-2" data-v-d27126ed>Stadion</label><div class="relative" data-v-d27126ed><select class="appearance-none w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 p-3 pr-10 transition-colors hover:bg-gray-100/50 cursor-pointer font-medium shadow-sm" data-v-d27126ed><option value="" data-v-d27126ed${ssrIncludeBooleanAttr(Array.isArray(selectedStadionId.value) ? ssrLooseContain(selectedStadionId.value, "") : ssrLooseEqual(selectedStadionId.value, "")) ? " selected" : ""}>Semua Stadion</option><!--[-->`);
      ssrRenderList(stadions.value, (stadion) => {
        _push(`<option${ssrRenderAttr("value", stadion.id)} data-v-d27126ed${ssrIncludeBooleanAttr(Array.isArray(selectedStadionId.value) ? ssrLooseContain(selectedStadionId.value, stadion.id) : ssrLooseEqual(selectedStadionId.value, stadion.id)) ? " selected" : ""}>${ssrInterpolate(stadion.name)}</option>`);
      });
      _push(`<!--]--></select><div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500" data-v-d27126ed><svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-d27126ed><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" data-v-d27126ed></path></svg></div></div></div><div data-v-d27126ed><label class="block text-xs font-semibold text-gray-600 mb-2" data-v-d27126ed>Tipe Penyewa</label><div class="relative" data-v-d27126ed><select class="appearance-none w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 p-3 pr-10 transition-colors hover:bg-gray-100/50 cursor-pointer font-medium shadow-sm" data-v-d27126ed><option value="" data-v-d27126ed${ssrIncludeBooleanAttr(Array.isArray(renterTypeFilter.value) ? ssrLooseContain(renterTypeFilter.value, "") : ssrLooseEqual(renterTypeFilter.value, "")) ? " selected" : ""}>Semua Tipe</option><option value="UMUM" data-v-d27126ed${ssrIncludeBooleanAttr(Array.isArray(renterTypeFilter.value) ? ssrLooseContain(renterTypeFilter.value, "UMUM") : ssrLooseEqual(renterTypeFilter.value, "UMUM")) ? " selected" : ""}>Umum</option><option value="TENDIK" data-v-d27126ed${ssrIncludeBooleanAttr(Array.isArray(renterTypeFilter.value) ? ssrLooseContain(renterTypeFilter.value, "TENDIK") : ssrLooseEqual(renterTypeFilter.value, "TENDIK")) ? " selected" : ""}>Tendik</option><option value="AKADEMIK" data-v-d27126ed${ssrIncludeBooleanAttr(Array.isArray(renterTypeFilter.value) ? ssrLooseContain(renterTypeFilter.value, "AKADEMIK") : ssrLooseEqual(renterTypeFilter.value, "AKADEMIK")) ? " selected" : ""}>Akademik</option></select><div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500" data-v-d27126ed><svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-d27126ed><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" data-v-d27126ed></path></svg></div></div></div><div data-v-d27126ed><label class="block text-xs font-semibold text-gray-600 mb-2" data-v-d27126ed>Status Booking</label><div class="relative" data-v-d27126ed><select class="appearance-none w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 p-3 pr-10 transition-colors hover:bg-gray-100/50 cursor-pointer font-medium shadow-sm" data-v-d27126ed><option value="" data-v-d27126ed${ssrIncludeBooleanAttr(Array.isArray(bookingStatusFilter.value) ? ssrLooseContain(bookingStatusFilter.value, "") : ssrLooseEqual(bookingStatusFilter.value, "")) ? " selected" : ""}>Semua Status</option><option value="APPROVED" data-v-d27126ed${ssrIncludeBooleanAttr(Array.isArray(bookingStatusFilter.value) ? ssrLooseContain(bookingStatusFilter.value, "APPROVED") : ssrLooseEqual(bookingStatusFilter.value, "APPROVED")) ? " selected" : ""}>Disetujui</option><option value="CANCELLED" data-v-d27126ed${ssrIncludeBooleanAttr(Array.isArray(bookingStatusFilter.value) ? ssrLooseContain(bookingStatusFilter.value, "CANCELLED") : ssrLooseEqual(bookingStatusFilter.value, "CANCELLED")) ? " selected" : ""}>Dibatalkan</option></select><div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500" data-v-d27126ed><svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-d27126ed><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" data-v-d27126ed></path></svg></div></div></div><div data-v-d27126ed><label class="block text-xs font-semibold text-gray-600 mb-2" data-v-d27126ed>Status Pembayaran</label><div class="relative" data-v-d27126ed><select class="appearance-none w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 p-3 pr-10 transition-colors hover:bg-gray-100/50 cursor-pointer font-medium shadow-sm" data-v-d27126ed><option value="" data-v-d27126ed${ssrIncludeBooleanAttr(Array.isArray(paymentStatusFilter.value) ? ssrLooseContain(paymentStatusFilter.value, "") : ssrLooseEqual(paymentStatusFilter.value, "")) ? " selected" : ""}>Semua Status</option><option value="PAID" data-v-d27126ed${ssrIncludeBooleanAttr(Array.isArray(paymentStatusFilter.value) ? ssrLooseContain(paymentStatusFilter.value, "PAID") : ssrLooseEqual(paymentStatusFilter.value, "PAID")) ? " selected" : ""}>Lunas</option><option value="UNPAID" data-v-d27126ed${ssrIncludeBooleanAttr(Array.isArray(paymentStatusFilter.value) ? ssrLooseContain(paymentStatusFilter.value, "UNPAID") : ssrLooseEqual(paymentStatusFilter.value, "UNPAID")) ? " selected" : ""}>Belum Bayar</option></select><div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500" data-v-d27126ed><svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-d27126ed><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" data-v-d27126ed></path></svg></div></div></div></div></div></div></div><div class="hidden print:block mb-6" data-v-d27126ed><table class="w-full border-collapse border border-gray-900 text-[9px]" data-v-d27126ed><thead data-v-d27126ed><tr class="bg-gray-100" data-v-d27126ed><th class="border border-gray-900 px-2 py-1.5 text-center font-bold text-gray-900 uppercase tracking-wide" style="${ssrRenderStyle({ "width": "5%" })}" data-v-d27126ed>No</th><th class="border border-gray-900 px-2 py-1.5 text-left font-bold text-gray-900 uppercase tracking-wide" data-v-d27126ed>Info Booking</th><th class="border border-gray-900 px-2 py-1.5 text-center font-bold text-gray-900 uppercase tracking-wide" data-v-d27126ed>Client</th><th class="border border-gray-900 px-2 py-1.5 text-center font-bold text-gray-900 uppercase tracking-wide" data-v-d27126ed>Stadion</th><th class="border border-gray-900 px-2 py-1.5 text-center font-bold text-gray-900 uppercase tracking-wide" data-v-d27126ed>Total Harga</th><th class="border border-gray-900 px-2 py-1.5 text-center font-bold text-gray-900 uppercase tracking-wide" data-v-d27126ed>Status</th><th class="border border-gray-900 px-2 py-1.5 text-center font-bold text-gray-900 uppercase tracking-wide" data-v-d27126ed>Pembayaran</th></tr></thead><tbody data-v-d27126ed><!--[-->`);
      ssrRenderList(bookings.value, (booking, index) => {
        _push(`<tr data-v-d27126ed><td class="border border-gray-900 px-2 py-1.5 text-center font-medium text-gray-900 align-middle" data-v-d27126ed>${ssrInterpolate(index + 1)}</td><td class="border border-gray-900 px-2 py-1.5 text-gray-900 align-middle" data-v-d27126ed><span class="block font-bold" data-v-d27126ed>${ssrInterpolate(booking.bookingCode)}</span><span class="block text-[8px]" data-v-d27126ed>${ssrInterpolate(formatDate(booking.createdAt))}</span><span class="block text-[8px]" data-v-d27126ed>${ssrInterpolate(formatSlotDate(booking))}</span></td><td class="border border-gray-900 px-2 py-1.5 text-gray-900 align-middle" data-v-d27126ed><span class="font-medium" data-v-d27126ed>${ssrInterpolate(booking.name)}</span>`);
        if (booking.renterType === "UMUM") {
          _push(`<span class="block text-[8px] italic" data-v-d27126ed>(Umum)</span>`);
        } else if (booking.renterType === "TENDIK") {
          _push(`<span class="block text-[8px] italic" data-v-d27126ed>(Tendik)</span>`);
        } else if (booking.renterType === "AKADEMIK") {
          _push(`<span class="block text-[8px] italic" data-v-d27126ed>(Akademik)</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</td><td class="border border-gray-900 px-2 py-1.5 text-gray-900 align-middle" data-v-d27126ed>${ssrInterpolate(getStadiumName(booking))}</td><td class="border border-gray-900 px-2 py-1.5 text-right font-medium text-gray-900 align-middle" data-v-d27126ed>${ssrInterpolate(formatCurrency(booking.totalPrice))} <span class="block text-[8px] font-normal" data-v-d27126ed>${ssrInterpolate(booking.details.length)} slot</span></td><td class="border border-gray-900 px-2 py-1.5 text-center font-medium text-gray-900 align-middle uppercase text-[8px]" data-v-d27126ed>${ssrInterpolate(getStatusText(booking.status))}</td><td class="border border-gray-900 px-2 py-1.5 text-center font-medium text-gray-900 align-middle uppercase text-[8px]" data-v-d27126ed>${ssrInterpolate(getPaymentText(booking.paymentStatus))}</td></tr>`);
      });
      _push(`<!--]--></tbody></table></div><div class="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden print:hidden" data-v-d27126ed><div class="p-5 border-b border-gray-200 bg-gray-50/30 print:hidden" data-v-d27126ed><div class="flex items-center justify-between" data-v-d27126ed><h3 class="text-sm font-bold text-gray-900 uppercase tracking-wider" data-v-d27126ed>Data Booking</h3><div class="text-sm text-gray-600" data-v-d27126ed><span class="font-bold text-blue-600" data-v-d27126ed>${ssrInterpolate(pagination.value.total)}</span> transaksi </div></div></div>`);
      if (unref(pending)) {
        _push(`<div class="p-12 text-center" data-v-d27126ed><div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-blue-600" data-v-d27126ed></div><p class="mt-4 text-sm text-gray-500" data-v-d27126ed>Memuat data...</p></div>`);
      } else if (unref(error)) {
        _push(`<div class="p-12 text-center" data-v-d27126ed><div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4" data-v-d27126ed><svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-d27126ed><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" data-v-d27126ed></path></svg></div><p class="text-sm font-semibold text-gray-900" data-v-d27126ed>Gagal memuat data</p><button class="mt-4 text-sm text-blue-600 hover:text-blue-700 font-semibold" data-v-d27126ed> Coba Lagi </button></div>`);
      } else if (bookings.value.length === 0) {
        _push(`<div class="p-12 text-center" data-v-d27126ed><div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4" data-v-d27126ed><svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-d27126ed><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" data-v-d27126ed></path></svg></div><p class="text-sm font-semibold text-gray-900" data-v-d27126ed>Tidak ada data</p><p class="text-xs text-gray-500 mt-1" data-v-d27126ed>Coba ubah filter untuk melihat data booking</p></div>`);
      } else {
        _push(`<div class="overflow-x-auto" data-v-d27126ed><table class="w-full border-collapse" data-v-d27126ed><thead data-v-d27126ed><tr class="bg-gray-50 border-b-2 border-gray-200" data-v-d27126ed><th class="px-5 py-3.5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider" data-v-d27126ed> Info Booking </th><th class="px-5 py-3.5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider" data-v-d27126ed> Client </th><th class="px-5 py-3.5 text-center text-xs font-bold text-gray-700 uppercase tracking-wider" data-v-d27126ed> Stadion </th><th class="px-5 py-3.5 text-right text-xs font-bold text-gray-700 uppercase tracking-wider" data-v-d27126ed> Total Harga </th><th class="px-5 py-3.5 text-center text-xs font-bold text-gray-700 uppercase tracking-wider" data-v-d27126ed> Status </th><th class="px-5 py-3.5 text-center text-xs font-bold text-gray-700 uppercase tracking-wider" data-v-d27126ed> Pembayaran </th></tr></thead><tbody class="bg-white divide-y divide-gray-100" data-v-d27126ed><!--[-->`);
        ssrRenderList(bookings.value, (booking) => {
          _push(`<tr class="hover:bg-blue-50/30 transition-colors duration-150 print:hover:bg-transparent" data-v-d27126ed><td class="px-5 py-4" data-v-d27126ed><div class="flex flex-col gap-1.5" data-v-d27126ed><span class="text-sm font-bold text-blue-600 tracking-tight" data-v-d27126ed>${ssrInterpolate(booking.bookingCode)}</span><div class="flex items-center gap-1.5 text-[11px] text-gray-500" data-v-d27126ed><svg class="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-d27126ed><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" data-v-d27126ed></path></svg><span class="font-medium" data-v-d27126ed>${ssrInterpolate(formatDate(booking.createdAt))}</span></div><div class="flex items-center gap-1.5 text-[11px] font-semibold text-gray-700" data-v-d27126ed><svg class="w-3 h-3 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-d27126ed><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" data-v-d27126ed></path></svg><span data-v-d27126ed>${ssrInterpolate(formatSlotDate(booking))}</span></div></div></td><td class="px-5 py-4" data-v-d27126ed><div class="flex flex-col gap-1.5 max-w-xs" data-v-d27126ed><span class="text-sm font-bold text-gray-900 truncate" data-v-d27126ed>${ssrInterpolate(booking.name)}</span><div class="flex items-center gap-2 flex-wrap" data-v-d27126ed>`);
          if (booking.renterType === "UMUM") {
            _push(`<span class="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 border border-gray-300 rounded-md text-[10px] font-bold text-gray-700" data-v-d27126ed><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-d27126ed><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" data-v-d27126ed></path></svg> Umum </span>`);
          } else if (booking.renterType === "AKADEMIK") {
            _push(`<span class="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 border border-blue-200 rounded-md text-[10px] font-bold text-blue-700 print:bg-gray-100 print:text-gray-800 print:border-gray-400" data-v-d27126ed><svg class="w-3 h-3 print:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-d27126ed><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" data-v-d27126ed></path></svg> Akademik </span>`);
          } else if (booking.renterType === "TENDIK") {
            _push(`<span class="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-50 border border-purple-200 rounded-md text-[10px] font-bold text-purple-700 print:bg-gray-100 print:text-gray-800 print:border-gray-400" data-v-d27126ed><svg class="w-3 h-3 print:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-d27126ed><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" data-v-d27126ed></path></svg> Tendik </span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div></td><td class="px-5 py-4" data-v-d27126ed><div class="flex justify-center" data-v-d27126ed><span class="text-sm font-semibold text-gray-700 bg-gray-50 px-3 py-1 rounded-md border border-gray-200" data-v-d27126ed>${ssrInterpolate(getStadiumName(booking))}</span></div></td><td class="px-5 py-4" data-v-d27126ed><div class="flex flex-col gap-0.5 items-end" data-v-d27126ed><span class="text-sm font-bold text-gray-900 tabular-nums" data-v-d27126ed>${ssrInterpolate(formatCurrency(booking.totalPrice))}</span><span class="text-[10px] text-gray-500 font-medium" data-v-d27126ed>${ssrInterpolate(booking.details.length)} slot</span></div></td><td class="px-5 py-4" data-v-d27126ed><div class="flex justify-center" data-v-d27126ed><span class="${ssrRenderClass([
            "inline-flex items-center px-3 py-1.5 rounded-lg text-[11px] font-bold border whitespace-nowrap print:shadow-none print:border-none print:text-black print:bg-transparent print:p-0",
            getStatusClasses(booking.status)
          ])}" data-v-d27126ed>${ssrInterpolate(getStatusText(booking.status))}</span></div></td><td class="px-5 py-4" data-v-d27126ed><div class="flex justify-center" data-v-d27126ed><span class="${ssrRenderClass([
            "inline-flex items-center px-3 py-1.5 rounded-lg text-[11px] font-bold border whitespace-nowrap print:shadow-none print:border-none print:text-black print:bg-transparent print:p-0",
            getPaymentStatusClasses(booking.paymentStatus)
          ])}" data-v-d27126ed>${ssrInterpolate(getPaymentText(booking.paymentStatus))}</span></div></td></tr>`);
        });
        _push(`<!--]--></tbody></table></div>`);
      }
      if (!unref(pending) && pagination.value.totalPages > 1) {
        _push(`<nav class="flex flex-col-reverse items-center justify-between gap-4 bg-gray-50/30 px-6 py-4 border-t border-gray-200 sm:flex-row print:hidden" data-v-d27126ed><span class="text-xs text-gray-500 font-medium" data-v-d27126ed>${ssrInterpolate(paginationSummary.value)}</span><div class="flex items-center gap-2" data-v-d27126ed><button${ssrIncludeBooleanAttr(!pagination.value.hasPrevPage) ? " disabled" : ""} class="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm" data-v-d27126ed><svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" data-v-d27126ed><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" data-v-d27126ed></path></svg></button><div class="px-4 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 shadow-sm" data-v-d27126ed>${ssrInterpolate(pagination.value.page)} / ${ssrInterpolate(pagination.value.totalPages)}</div><button${ssrIncludeBooleanAttr(!pagination.value.hasNextPage) ? " disabled" : ""} class="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm" data-v-d27126ed><svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" data-v-d27126ed><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" data-v-d27126ed></path></svg></button></div></nav>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/bookings/history/payment.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const payment = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-d27126ed"]]);

export { payment as default };
//# sourceMappingURL=payment-D_XgeQrS.mjs.map
