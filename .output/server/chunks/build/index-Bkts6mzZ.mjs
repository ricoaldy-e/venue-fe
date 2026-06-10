import { _ as __nuxt_component_0 } from './nuxt-link-DqM75kvd.mjs';
import { defineComponent, computed, ref, withAsyncContext, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderClass, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderStyle, ssrRenderComponent } from 'vue/server-renderer';
import { _ as _imports_0 } from './VENUE-UNDIP-LOGO-C_mmPH8T.mjs';
import { u as useHead } from './composables-D8u1NqZw.mjs';
import { _ as _export_sfc, u as useAppOptions } from './server.mjs';
import { u as useFetch } from './fetch-B8t2Jth9.mjs';
import { gql } from 'graphql-tag';
import { print } from 'graphql';
import dayjs from 'dayjs';
import { t as toUtcMidnightIso } from './dateHelpers-jbKEnFTU.mjs';
import isBetween from 'dayjs/plugin/isBetween.js';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
import { O as OPERATING_HOURS } from './constants-BG8e5vSv.mjs';
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
import 'vue-router';
import '@vue/shared';
import './asyncData-DCHdo3Ys.mjs';

dayjs.extend(isBetween);
dayjs.extend(utc);
dayjs.extend(timezone);
const useDashboardLogic = () => {
  const getDailyHours = (opHours) => {
    return Math.max(0, opHours.closeHour - opHours.openHour);
  };
  const calculateDailyStats = (fields, bookings, opHours, targetDate) => {
    const dailyCapacity = getDailyHours(opHours);
    return fields.map((field) => {
      let bookedCount = 0;
      bookings.forEach((b) => {
        if (b.status === "CANCELLED") return;
        b.details.forEach((d) => {
          const dbDate = dayjs(d.bookingDate).tz("Asia/Jakarta").format("YYYY-MM-DD");
          if (String(d.fieldId) === String(field.id) && dbDate === targetDate) {
            bookedCount++;
          }
        });
      });
      const remaining = Math.max(0, dailyCapacity - bookedCount);
      const occupancyRate = dailyCapacity > 0 ? bookedCount / dailyCapacity * 100 : 0;
      let statusLabel = "Tersedia";
      let statusColor = "bg-green-100 text-green-700 border-green-200";
      if (bookedCount >= dailyCapacity) {
        statusLabel = "Full Booked";
        statusColor = "bg-red-100 text-red-700 border-red-200";
      } else if (occupancyRate > 75) {
        statusLabel = "Hampir Penuh";
        statusColor = "bg-amber-100 text-amber-700 border-amber-200";
      }
      return {
        id: field.id,
        name: field.name,
        stadionId: field.stadionId || Number(field.Stadion?.id) || 0,
        stadionName: field.Stadion?.name || "-",
        mode: "daily",
        totalCapacity: dailyCapacity,
        totalBooked: bookedCount,
        remaining,
        occupancyRate,
        statusLabel,
        statusColor
      };
    });
  };
  const calculateRangeStats = (fields, bookings, opHours, startDate, endDate) => {
    const start = dayjs(startDate).startOf("day");
    const end = dayjs(endDate).endOf("day");
    const totalDays = end.diff(start, "day") + 1;
    const hoursPerDay = getDailyHours(opHours);
    const totalRangeCapacity = hoursPerDay * totalDays;
    return fields.map((field) => {
      let rangeBookedCount = 0;
      bookings.forEach((b) => {
        if (b.status === "CANCELLED") return;
        b.details.forEach((d) => {
          const dDate = dayjs(d.bookingDate).tz("Asia/Jakarta");
          if (String(d.fieldId) === String(field.id) && (dDate.isSame(start, "day") || dDate.isSame(end, "day") || dDate.isBetween(start, end, "day", "[]"))) {
            rangeBookedCount++;
          }
        });
      });
      const remaining = Math.max(0, totalRangeCapacity - rangeBookedCount);
      const occupancyRate = totalRangeCapacity > 0 ? rangeBookedCount / totalRangeCapacity * 100 : 0;
      let statusLabel = `${rangeBookedCount} Jam Terpakai`;
      let statusColor = "bg-blue-50 text-blue-700 border-blue-200";
      if (rangeBookedCount === 0) {
        statusLabel = "Kosong (0 Jam)";
        statusColor = "bg-gray-100 text-gray-600 border-gray-200";
      } else if (occupancyRate > 80) {
        statusLabel = "Sangat Sibuk";
        statusColor = "bg-orange-100 text-orange-700 border-orange-200";
      }
      return {
        id: field.id,
        name: field.name,
        stadionId: field.stadionId || Number(field.Stadion?.id) || 0,
        stadionName: field.Stadion?.name || "-",
        mode: "range",
        totalCapacity: totalRangeCapacity,
        totalBooked: rangeBookedCount,
        remaining,
        occupancyRate,
        statusLabel,
        statusColor
      };
    });
  };
  return { calculateDailyStats, calculateRangeStats };
};
const QUERY_GET_FIELDS = `
  query FieldsDashboard($stadionId: ID) {
    fields(stadionId: $stadionId) {
      id
      stadionId
      name
      description
      pricePerHour
      priceTendik
      status
      Stadion {
        id
        name
      }
      images {
        imageUrl
      }
      bookingDetails {
        id
        bookingDate
        startHour
        subtotal
      }
    }
  }
`;
const QUERY_GET_BOOKINGS = `
  query Bookings($stadionId: ID, $date: DateTime, $startDate: DateTime, $endDate: DateTime) {
    bookings(stadionId: $stadionId, date: $date, startDate: $startDate, endDate: $endDate) {
      data {
        id
        bookingCode
        name
        contact
        email
        renterType
        status
        paymentStatus
        totalPrice
        createdAt
        details {
          fieldId
          bookingDate
          startHour
          subtotal
          Field {
            id
            name
            stadionId
            Stadion {
              id
              name
            }
          }
        }
      }
      pagination {
        page
        limit
        total
        totalPages
        hasNextPage
        hasPrevPage
      }
      fieldAnalytics {
        fieldId
        fieldName
        stadionId
        stadionName
        totalCapacity
        totalBooked
        remaining
        occupancyRate
        statusLabel
        statusColor
      }
    }
  }
`;
const QUERY_GET_STADIONS = `
  query StadionsWithDetails {
    stadions {
      id
      name
      description
      mapUrl
      status
      operatingHours {
        openHour
        closeHour
      }
      facilities {
        Facility {
          id
          name
        }
      }
      images {
        id
        imageUrl
      }
      fields {
        id
        name
        pricePerHour
        images {
          id
          imageUrl
        }
      }
    }
  }
`;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { options } = useAppOptions();
    const appName = computed(() => options.value.data?.name || "VENUE UNDIP");
    useHead({
      title: "Dashboard Admin - VENUE UNDIP",
      meta: [
        { name: "description", content: "Dashboard admin untuk mengelola venue dan booking lapangan olahraga VENUE UNDIP" }
      ]
    });
    dayjs.locale("id");
    const getQueryString = (query) => typeof query === "string" ? query : print(query);
    const { calculateDailyStats, calculateRangeStats } = useDashboardLogic();
    const filterMode = ref("daily");
    const singleDate = ref(dayjs().add(1, "day").format("YYYY-MM-DD"));
    const formattedSingleDate = computed(() => dayjs(singleDate.value).format("dddd, DD MMMM YYYY"));
    const startDate = ref(dayjs().format("YYYY-MM-DD"));
    const endDate = ref(dayjs().add(6, "day").format("YYYY-MM-DD"));
    const selectedStadionId = ref("");
    const searchQuery = ref("");
    const printTimestamp = ref("");
    const lastRefreshTime = ref("");
    const isRefreshing = ref(false);
    const formattedRangeDate = computed(() => {
      return `${dayjs(startDate.value).format("DD MMM YYYY")} - ${dayjs(endDate.value).format("DD MMM YYYY")}`;
    });
    const isRangeActive = (days) => {
      const targetStart = dayjs().format("YYYY-MM-DD");
      const targetEnd = dayjs().add(days - 1, "day").format("YYYY-MM-DD");
      return startDate.value === targetStart && endDate.value === targetEnd;
    };
    const QUERY_OP_HOURS_INLINE = gql`query GetOpHours { operatingHours { openHour closeHour } }`;
    const { data: opHoursData } = ([__temp, __restore] = withAsyncContext(() => useFetch("/api/graphql", {
      method: "POST",
      body: { query: getQueryString(QUERY_OP_HOURS_INLINE) }
    }, "$BDyEMCVgmz")), __temp = await __temp, __restore(), __temp);
    const opHours = computed(() => opHoursData.value?.data?.operatingHours || {
      openHour: OPERATING_HOURS.DEFAULT_OPEN,
      closeHour: OPERATING_HOURS.DEFAULT_CLOSE
    });
    const { data: fieldsData } = ([__temp, __restore] = withAsyncContext(() => useFetch("/api/graphql", {
      method: "POST",
      body: computed(() => ({
        query: getQueryString(QUERY_GET_FIELDS),
        variables: { stadionId: null }
      }))
    }, "$-5AfRAlzgG")), __temp = await __temp, __restore(), __temp);
    const allFields = computed(() => fieldsData.value?.data?.fields || []);
    const { data: stadionsData } = ([__temp, __restore] = withAsyncContext(() => useFetch("/api/graphql", {
      method: "POST",
      body: { query: getQueryString(QUERY_GET_STADIONS) }
    }, "$nALoJjdaOr")), __temp = await __temp, __restore(), __temp);
    const stadionList = computed(() => stadionsData.value?.data?.stadions || []);
    const bookingPayload = computed(() => {
      const vars = { stadionId: selectedStadionId.value || void 0 };
      const toUTCMidnight = (dateStr) => toUtcMidnightIso(dateStr) || "";
      if (filterMode.value === "daily") {
        vars.date = toUTCMidnight(singleDate.value);
      } else {
        vars.startDate = toUTCMidnight(startDate.value);
        vars.endDate = toUTCMidnight(endDate.value);
      }
      return {
        query: getQueryString(QUERY_GET_BOOKINGS),
        variables: vars
      };
    });
    const { data: bookingsResponse, pending: isLoading, refresh: refreshBookings } = ([__temp, __restore] = withAsyncContext(() => useFetch("/api/graphql", {
      method: "POST",
      body: bookingPayload,
      watch: [singleDate, startDate, endDate, filterMode, selectedStadionId]
    }, "$qd0hbVVkjo")), __temp = await __temp, __restore(), __temp);
    ref(null);
    const rawBookings = computed(() => bookingsResponse.value?.data?.bookings?.data || []);
    const beFieldAnalytics = computed(() => bookingsResponse.value?.data?.bookings?.fieldAnalytics || []);
    const dashboardData = computed(() => {
      if (beFieldAnalytics.value && beFieldAnalytics.value.length > 0) {
        let beData = beFieldAnalytics.value;
        if (selectedStadionId.value) {
          beData = beData.filter(
            (item) => String(item.stadionId) === String(selectedStadionId.value)
          );
        }
        return beData.map((item) => ({
          id: item.fieldId,
          name: item.fieldName,
          stadionId: Number(item.stadionId),
          stadionName: item.stadionName,
          mode: filterMode.value,
          totalCapacity: item.totalCapacity,
          totalBooked: item.totalBooked,
          remaining: item.remaining,
          occupancyRate: item.occupancyRate,
          statusLabel: item.statusLabel,
          statusColor: item.statusColor
        }));
      }
      let fieldsToCheck = allFields.value;
      if (selectedStadionId.value) {
        fieldsToCheck = fieldsToCheck.filter(
          (f) => String(f.stadionId) === String(selectedStadionId.value) || String(f.Stadion?.id) === String(selectedStadionId.value)
        );
      }
      return filterMode.value === "daily" ? calculateDailyStats(fieldsToCheck, rawBookings.value, opHours.value, singleDate.value) : calculateRangeStats(fieldsToCheck, rawBookings.value, opHours.value, startDate.value, endDate.value);
    });
    const filteredDashboardData = computed(() => {
      if (!searchQuery.value.trim()) return dashboardData.value;
      const query = searchQuery.value.toLowerCase().trim();
      return dashboardData.value.filter(
        (item) => item.name.toLowerCase().includes(query)
      );
    });
    const totalAvailable = computed(() => filteredDashboardData.value.reduce((acc, curr) => acc + curr.remaining, 0));
    const totalBooked = computed(() => filteredDashboardData.value.reduce((acc, curr) => acc + curr.totalBooked, 0));
    const totalCapacity = computed(() => filteredDashboardData.value.reduce((acc, curr) => acc + curr.totalCapacity, 0));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "w-full pb-16 print:p-0 print:pb-16 max-w-7xl mx-auto" }, _attrs))} data-v-c4e7a8ca><div class="hidden print:block mb-6 pb-4 border-b-2 border-gray-900" data-v-c4e7a8ca><div class="flex items-start gap-4" data-v-c4e7a8ca><div class="w-16 h-16 flex items-center justify-center shrink-0" data-v-c4e7a8ca><img${ssrRenderAttr("src", _imports_0)} alt="{{ appName }} Logo" class="w-full h-full object-contain logo-print-color" data-v-c4e7a8ca></div><div class="flex-1" data-v-c4e7a8ca><h1 class="text-xl font-bold text-gray-900 uppercase tracking-tight leading-tight" data-v-c4e7a8ca>Laporan Operasional Lapangan</h1><h2 class="text-base font-semibold text-gray-700 mt-0.5" data-v-c4e7a8ca>UPT Layanan Seni, Budaya dan Olahraga</h2><p class="text-[10px] text-gray-600 mt-1 leading-tight" data-v-c4e7a8ca>Jl. Prof. Soedarto, Tembalang, Kec. Tembalang, Kota Semarang, Jawa Tengah</p></div><div class="text-right shrink-0" data-v-c4e7a8ca><div class="mb-2" data-v-c4e7a8ca><p class="text-[9px] font-bold text-gray-500 uppercase tracking-wider" data-v-c4e7a8ca>Periode Data</p><p class="text-xs font-bold text-gray-900" data-v-c4e7a8ca>${ssrInterpolate(filterMode.value === "daily" ? formattedSingleDate.value : formattedRangeDate.value)}</p></div><div data-v-c4e7a8ca><p class="text-[9px] font-bold text-gray-500 uppercase tracking-wider" data-v-c4e7a8ca>Dicetak Pada</p><p class="text-[10px] font-medium text-gray-700" data-v-c4e7a8ca>${ssrInterpolate(printTimestamp.value)}</p></div></div></div></div><div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 print:hidden" data-v-c4e7a8ca><div class="flex items-start gap-4" data-v-c4e7a8ca><div class="p-3 bg-blue-50 rounded-xl border border-blue-100 shrink-0 hidden sm:flex items-center justify-center" data-v-c4e7a8ca><svg class="w-6 h-6 text-blue-800" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" data-v-c4e7a8ca><path d="M5 11H11V5H5V11ZM5 19H11V13H5V19ZM13 19H19V13H13V19ZM13 5V11H19V5H13Z" data-v-c4e7a8ca></path></svg></div><div data-v-c4e7a8ca><h1 class="text-2xl uppercase font-bold text-gray-900 tracking-tight" data-v-c4e7a8ca>Dashboard Analisis</h1><p class="text-sm text-gray-500 mt-1 leading-relaxed" data-v-c4e7a8ca> Pantau ketersediaan lapangan secara real-time untuk efisiensi pengelolaan. </p><div class="flex items-center gap-3 mt-2" data-v-c4e7a8ca><button${ssrIncludeBooleanAttr(isRefreshing.value) ? " disabled" : ""} class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-lg [@media(hover:hover)]:hover:bg-blue-100 transition-all active:scale-95 disabled:opacity-50" title="Refresh data" data-v-c4e7a8ca><svg class="${ssrRenderClass(["h-3.5 w-3.5", isRefreshing.value ? "animate-spin" : ""])}" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-c4e7a8ca><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" data-v-c4e7a8ca></path></svg><span data-v-c4e7a8ca>Refresh</span></button>`);
      if (lastRefreshTime.value) {
        _push(`<span class="text-xs text-gray-400" data-v-c4e7a8ca><span class="hidden sm:inline" data-v-c4e7a8ca>Update terakhir:</span> ${ssrInterpolate(lastRefreshTime.value)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<span class="text-xs text-gray-400 hidden sm:inline" data-v-c4e7a8ca>• Auto-refresh: 1 menit</span></div></div></div><div class="bg-gray-100 p-1.5 rounded-xl flex w-full md:w-auto md:inline-flex border border-gray-200/50" data-v-c4e7a8ca><button class="${ssrRenderClass([filterMode.value === "daily" ? "bg-white text-blue-700 shadow-sm ring-1 ring-black/5" : "text-gray-500 [@media(hover:hover)]:hover:text-gray-700", "flex-1 md:flex-none justify-center px-5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center gap-2"])}" data-v-c4e7a8ca><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-c4e7a8ca><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" data-v-c4e7a8ca></path></svg> Harian </button><button class="${ssrRenderClass([filterMode.value === "range" ? "bg-white text-blue-700 shadow-sm ring-1 ring-black/5" : "text-gray-500 [@media(hover:hover)]:hover:text-gray-700", "flex-1 md:flex-none justify-center px-5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center gap-2"])}" data-v-c4e7a8ca><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-c4e7a8ca><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" data-v-c4e7a8ca></path></svg> Rentang </button></div></div><div class="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm mb-8 flex flex-col lg:flex-row gap-5 items-end print:hidden" data-v-c4e7a8ca><div class="flex-1 w-full" data-v-c4e7a8ca><label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2" data-v-c4e7a8ca>Lokasi Stadion</label><div class="relative" data-v-c4e7a8ca><select class="appearance-none w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 p-3 pr-10 transition-colors [@media(hover:hover)]:hover:bg-gray-100/50 cursor-pointer font-medium" data-v-c4e7a8ca><option value="" data-v-c4e7a8ca${ssrIncludeBooleanAttr(Array.isArray(selectedStadionId.value) ? ssrLooseContain(selectedStadionId.value, "") : ssrLooseEqual(selectedStadionId.value, "")) ? " selected" : ""}>Semua Stadion</option><!--[-->`);
      ssrRenderList(stadionList.value, (s) => {
        _push(`<option${ssrRenderAttr("value", s.id)} data-v-c4e7a8ca${ssrIncludeBooleanAttr(Array.isArray(selectedStadionId.value) ? ssrLooseContain(selectedStadionId.value, s.id) : ssrLooseEqual(selectedStadionId.value, s.id)) ? " selected" : ""}>${ssrInterpolate(s.name)}</option>`);
      });
      _push(`<!--]--></select><div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500" data-v-c4e7a8ca><svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-c4e7a8ca><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" data-v-c4e7a8ca></path></svg></div></div></div><div class="flex-1 w-full" data-v-c4e7a8ca><label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2" data-v-c4e7a8ca>Cari Lapangan</label><div class="relative" data-v-c4e7a8ca><div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-v-c4e7a8ca><svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-c4e7a8ca><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" data-v-c4e7a8ca></path></svg></div><input${ssrRenderAttr("value", searchQuery.value)} type="search" class="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 transition-shadow font-medium" placeholder="Cari nama ..." data-v-c4e7a8ca></div></div><div class="flex-[2] w-full" data-v-c4e7a8ca><div class="flex justify-between items-center mb-2" data-v-c4e7a8ca><label class="block text-xs font-bold text-gray-500 uppercase tracking-wider" data-v-c4e7a8ca>${ssrInterpolate(filterMode.value === "daily" ? "Pilih Tanggal" : "Pilih Periode Waktu")}</label>`);
      if (filterMode.value === "range") {
        _push(`<div class="flex gap-2" data-v-c4e7a8ca><button class="${ssrRenderClass([isRangeActive(7) ? "bg-blue-600 text-white shadow-sm" : "bg-blue-50 text-blue-600 [@media(hover:hover)]:hover:bg-blue-100", "text-[10px] font-semibold px-2 py-1 rounded transition-colors"])}" data-v-c4e7a8ca>7 Hari ke Depan</button><button class="${ssrRenderClass([isRangeActive(30) ? "bg-blue-600 text-white shadow-sm" : "bg-blue-50 text-blue-600 [@media(hover:hover)]:hover:bg-blue-100", "text-[10px] font-semibold px-2 py-1 rounded transition-colors"])}" data-v-c4e7a8ca>1 Bulan ke Depan</button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (filterMode.value === "daily") {
        _push(`<div class="flex flex-col sm:flex-row items-center gap-3" data-v-c4e7a8ca><input type="date"${ssrRenderAttr("value", singleDate.value)} class="w-full sm:w-auto bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3 font-medium cursor-pointer" data-v-c4e7a8ca><div class="hidden sm:flex items-center gap-2 w-full text-sm font-medium text-gray-600 bg-gray-50 px-4 py-3 rounded-xl border border-gray-200 border-dashed" data-v-c4e7a8ca>${ssrInterpolate(formattedSingleDate.value)}</div></div>`);
      } else {
        _push(`<div class="flex flex-col sm:flex-row items-center gap-3 w-full" data-v-c4e7a8ca><div class="relative w-full" data-v-c4e7a8ca><div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-v-c4e7a8ca><span class="text-gray-400 text-xs font-bold uppercase" data-v-c4e7a8ca>Dari</span></div><input type="date"${ssrRenderAttr("value", startDate.value)} class="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block pl-12 p-2.5 font-medium cursor-pointer shadow-sm" data-v-c4e7a8ca></div><div class="text-gray-400 shrink-0" data-v-c4e7a8ca><svg class="w-4 h-4 transform rotate-90 sm:rotate-0 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-c4e7a8ca><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" data-v-c4e7a8ca></path></svg></div><div class="relative w-full" data-v-c4e7a8ca><div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-v-c4e7a8ca><span class="text-gray-400 text-xs font-bold uppercase" data-v-c4e7a8ca>Smp</span></div><input type="date"${ssrRenderAttr("value", endDate.value)} class="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block pl-12 p-2.5 font-medium cursor-pointer shadow-sm" data-v-c4e7a8ca></div></div>`);
      }
      _push(`</div><div class="flex gap-2 w-full lg:w-auto" data-v-c4e7a8ca><button class="flex-1 lg:flex-none px-4 py-3 bg-gray-800 text-white rounded-xl [@media(hover:hover)]:hover:bg-gray-900 font-semibold transition-all flex items-center justify-center gap-2 shadow-sm" data-v-c4e7a8ca><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-c4e7a8ca><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" data-v-c4e7a8ca></path></svg><span data-v-c4e7a8ca>Cetak</span></button></div></div><div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10 print:grid-cols-1 print:gap-3 print:mb-5 print:break-inside-avoid" data-v-c4e7a8ca><div class="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 rounded-2xl p-8 text-white shadow-2xl shadow-emerald-200/50 print:bg-white print:text-black print:border-2 print:border-gray-800 print:shadow-none print:rounded-lg print:p-4 print:w-80 print:mx-0" data-v-c4e7a8ca><div class="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl print:hidden" data-v-c4e7a8ca></div><div class="absolute -left-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-xl print:hidden" data-v-c4e7a8ca></div><div class="absolute right-4 top-4 opacity-10 print:hidden" data-v-c4e7a8ca><svg class="w-24 h-24" fill="currentColor" viewBox="0 0 24 24" data-v-c4e7a8ca><path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" data-v-c4e7a8ca></path></svg></div><div class="relative z-10" data-v-c4e7a8ca><div class="flex items-center gap-2 mb-3 print:mb-2" data-v-c4e7a8ca><div class="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-pulse print:hidden" data-v-c4e7a8ca></div><p class="text-emerald-50 text-xs font-bold uppercase tracking-wider print:text-gray-800 print:text-[10px]" data-v-c4e7a8ca>${ssrInterpolate(filterMode.value === "daily" ? `Sisa Kapasitas (${formattedSingleDate.value})` : `Sisa Kapasitas (${formattedRangeDate.value})`)}</p></div><div class="flex items-end gap-3 mb-2 print:mb-1 print:flex-row print:items-baseline print:gap-2" data-v-c4e7a8ca><h2 class="text-7xl font-black tracking-tighter leading-none print:hidden" data-v-c4e7a8ca>${ssrInterpolate(totalAvailable.value)}</h2><h2 class="hidden print:block print:text-2xl print:font-extrabold print:text-black" data-v-c4e7a8ca>${ssrInterpolate(totalBooked.value)}</h2><span class="hidden print:inline print:text-xl print:font-bold print:text-gray-700" data-v-c4e7a8ca>/</span><h2 class="hidden print:block print:text-2xl print:font-extrabold print:text-black" data-v-c4e7a8ca>${ssrInterpolate(totalCapacity.value)}</h2><div class="pb-2 print:pb-0 print:hidden" data-v-c4e7a8ca><span class="text-lg font-bold text-emerald-100 uppercase tracking-wide" data-v-c4e7a8ca>Slot</span><span class="block text-sm font-semibold text-emerald-200 -mt-1" data-v-c4e7a8ca>Tersedia</span></div></div><div class="flex items-center gap-2 mt-3 print:mt-1" data-v-c4e7a8ca><svg class="w-4 h-4 text-emerald-300 print:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-c4e7a8ca><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" data-v-c4e7a8ca></path></svg><p class="text-sm text-emerald-100 font-semibold print:text-gray-700 print:text-[10px] print:font-bold" data-v-c4e7a8ca><span class="print:hidden" data-v-c4e7a8ca>Siap untuk booking</span><span class="hidden print:inline" data-v-c4e7a8ca>Slot Terbooking / Slot Tersedia</span></p></div></div></div><div class="print:hidden relative overflow-hidden bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-lg [@media(hover:hover)]:hover:shadow-xl transition-shadow duration-300" data-v-c4e7a8ca><div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-100 to-red-100 opacity-50 rounded-bl-full print:hidden" data-v-c4e7a8ca></div><div class="absolute right-4 top-4 opacity-5 print:hidden" data-v-c4e7a8ca><svg class="w-24 h-24 text-red-600" fill="currentColor" viewBox="0 0 24 24" data-v-c4e7a8ca><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" data-v-c4e7a8ca></path></svg></div><div class="relative z-10" data-v-c4e7a8ca><div class="flex items-center gap-2 mb-3 print:mb-1" data-v-c4e7a8ca><div class="w-1.5 h-1.5 bg-red-500 rounded-full print:hidden" data-v-c4e7a8ca></div><p class="text-gray-600 text-xs font-bold uppercase tracking-wider print:text-gray-700 print:text-[9px]" data-v-c4e7a8ca>${ssrInterpolate(filterMode.value === "daily" ? `Terbooking (${formattedSingleDate.value})` : `Total Terbooking (${formattedRangeDate.value})`)}</p></div><div class="flex items-end gap-3 mb-2 print:mb-0.5" data-v-c4e7a8ca><h2 class="text-7xl font-black text-gray-900 tracking-tighter leading-none print:text-black print:text-3xl" data-v-c4e7a8ca>${ssrInterpolate(totalBooked.value)}</h2><div class="pb-2 print:pb-0" data-v-c4e7a8ca><span class="text-lg font-bold text-gray-600 uppercase tracking-wide print:text-gray-700 print:text-xs" data-v-c4e7a8ca>Slot</span><span class="block text-sm font-semibold text-gray-500 -mt-1 print:text-gray-600 print:text-[8px] print:mt-0" data-v-c4e7a8ca>Terisi</span></div></div><div class="flex items-center gap-2 mt-3 print:mt-0.5" data-v-c4e7a8ca><div class="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden print:hidden" data-v-c4e7a8ca><div class="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-700" style="${ssrRenderStyle({ width: totalCapacity.value > 0 ? `${Math.min(totalBooked.value / totalCapacity.value * 100, 100)}%` : "0%" })}" data-v-c4e7a8ca></div></div><span class="text-sm font-bold text-gray-700 print:text-[9px]" data-v-c4e7a8ca>${ssrInterpolate(totalCapacity.value > 0 ? Math.round(totalBooked.value / totalCapacity.value * 100) : 0)}% </span></div></div></div></div>`);
      if (unref(isLoading)) {
        _push(`<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-pulse print:hidden" data-v-c4e7a8ca><!--[-->`);
        ssrRenderList(3, (i) => {
          _push(`<div class="bg-white rounded-2xl h-64 border border-gray-200 p-5 flex flex-col justify-between" data-v-c4e7a8ca><div class="space-y-3" data-v-c4e7a8ca><div class="h-4 bg-gray-200 rounded w-3/4" data-v-c4e7a8ca></div><div class="h-10 bg-gray-200 rounded w-full" data-v-c4e7a8ca></div></div></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (filteredDashboardData.value.length === 0) {
        _push(`<div class="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-dashed border-gray-300 print:border-gray-800 print:py-10 print:mx-6 print:border-2" data-v-c4e7a8ca><div class="p-4 bg-gray-50 rounded-full mb-4 print:hidden" data-v-c4e7a8ca><svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-c4e7a8ca><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" data-v-c4e7a8ca></path></svg></div><h3 class="text-lg font-bold text-gray-900" data-v-c4e7a8ca>${ssrInterpolate(searchQuery.value ? "Tidak ada hasil pencarian" : "Tidak ada data lapangan")}</h3><p class="text-gray-500 mt-1 max-w-sm text-center" data-v-c4e7a8ca>${ssrInterpolate(searchQuery.value ? `Tidak ditemukan lapangan dengan kata kunci "${searchQuery.value}"` : "Belum ada lapangan yang aktif atau sesuai dengan filter lokasi yang Anda pilih.")}</p><button class="mt-6 px-5 py-2.5 text-sm font-medium text-blue-700 bg-blue-50 [@media(hover:hover)]:hover:bg-blue-100 border border-blue-100 rounded-xl transition-colors print:hidden flex items-center gap-2" data-v-c4e7a8ca><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-c4e7a8ca><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" data-v-c4e7a8ca></path></svg> Reset Filter Pencarian </button></div>`);
      } else {
        _push(`<div class="print:hidden grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" data-v-c4e7a8ca><!--[-->`);
        ssrRenderList(filteredDashboardData.value, (item) => {
          _push(`<div class="group bg-white rounded-2xl border border-gray-200 shadow-sm [@media(hover:hover)]:hover:shadow-lg [@media(hover:hover)]:hover:border-blue-300 transition-all duration-300 overflow-hidden flex flex-col break-inside-avoid" data-v-c4e7a8ca><div class="p-5 border-b border-gray-100 bg-gray-50/50" data-v-c4e7a8ca><div class="flex justify-between items-start gap-4" data-v-c4e7a8ca><div class="min-w-0 flex-1" data-v-c4e7a8ca><h3 class="text-lg font-bold text-gray-900 line-clamp-2"${ssrRenderAttr("title", item.name)} data-v-c4e7a8ca>${ssrInterpolate(item.name)}</h3><div class="flex items-start gap-1.5 mt-2" data-v-c4e7a8ca><svg class="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-c4e7a8ca><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" data-v-c4e7a8ca></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" data-v-c4e7a8ca></path></svg><p class="text-xs font-medium text-gray-500 uppercase tracking-wide break-words" data-v-c4e7a8ca>${ssrInterpolate(item.stadionName)}</p></div></div><span class="${ssrRenderClass([item.statusColor, "shrink-0 px-3 py-1 rounded-full text-[11px] font-bold border uppercase tracking-wide shadow-sm"])}" data-v-c4e7a8ca>${ssrInterpolate(item.statusLabel)}</span></div></div><div class="p-6 flex-1 flex flex-col justify-center" data-v-c4e7a8ca><div class="flex justify-between items-end mb-3" data-v-c4e7a8ca><div data-v-c4e7a8ca><span class="text-xs font-bold uppercase text-gray-400 block mb-1" data-v-c4e7a8ca>Sisa</span><div class="flex items-baseline gap-1.5" data-v-c4e7a8ca><span class="text-4xl font-extrabold text-gray-900 tracking-tighter" data-v-c4e7a8ca>${ssrInterpolate(item.remaining)}</span><span class="text-sm font-semibold text-gray-400" data-v-c4e7a8ca>/ ${ssrInterpolate(item.totalCapacity)}</span></div></div><div class="text-right" data-v-c4e7a8ca><span class="text-xs font-bold text-gray-400 block mb-1" data-v-c4e7a8ca>Terisi</span><span class="${ssrRenderClass([item.occupancyRate > 80 ? "text-red-600" : "text-blue-600", "text-xl font-bold"])}" data-v-c4e7a8ca>${ssrInterpolate(Math.round(item.occupancyRate))}% </span></div></div><div class="w-full bg-gray-100 rounded-full h-3 overflow-hidden shadow-inner" data-v-c4e7a8ca><div class="${ssrRenderClass([item.occupancyRate > 80 ? "bg-red-500" : item.occupancyRate > 50 ? "bg-amber-500" : "bg-green-500", "h-full rounded-full transition-all duration-700 ease-out relative"])}" style="${ssrRenderStyle({ width: `${Math.max(item.occupancyRate, 5)}%` })}" data-v-c4e7a8ca></div></div></div><div class="p-4 bg-gray-50 border-t border-gray-100 [@media(hover:hover)]:group-hover:bg-blue-50/30 transition-colors" data-v-c4e7a8ca>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/admin/bookings/${item.stadionId}`,
            class: "flex items-center justify-center w-full py-2.5 text-sm font-semibold text-gray-700 [@media(hover:hover)]:hover:text-blue-700 bg-white border border-gray-200 [@media(hover:hover)]:hover:border-blue-300 rounded-xl shadow-sm [@media(hover:hover)]:hover:shadow transition-all gap-2"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Lihat Jadwal Detail `);
              } else {
                return [
                  createTextVNode(" Lihat Jadwal Detail ")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div></div>`);
        });
        _push(`<!--]--></div>`);
      }
      if (filteredDashboardData.value.length > 0) {
        _push(`<div class="hidden print:block pb-6" data-v-c4e7a8ca><table class="w-full border-collapse border border-gray-900 mb-6 text-[9px]" data-v-c4e7a8ca><thead data-v-c4e7a8ca><tr class="bg-gray-200" data-v-c4e7a8ca><th class="border border-gray-900 px-1.5 py-1.5 text-center font-bold text-gray-900 uppercase tracking-wide" style="${ssrRenderStyle({ "width": "8%" })}" data-v-c4e7a8ca>No.</th><th class="border border-gray-900 px-2 py-1.5 text-left font-bold text-gray-900 uppercase tracking-wide" style="${ssrRenderStyle({ "width": "40%" })}" data-v-c4e7a8ca>Nama Lapangan</th><th class="border border-gray-900 px-1.5 py-1.5 text-center font-bold text-gray-900 uppercase tracking-wide" style="${ssrRenderStyle({ "width": "13%" })}" data-v-c4e7a8ca>Total Kuota</th><th class="border border-gray-900 px-1.5 py-1.5 text-center font-bold text-gray-900 uppercase tracking-wide" style="${ssrRenderStyle({ "width": "13%" })}" data-v-c4e7a8ca>Terbooking</th><th class="border border-gray-900 px-1.5 py-1.5 text-center font-bold text-gray-900 uppercase tracking-wide" style="${ssrRenderStyle({ "width": "13%" })}" data-v-c4e7a8ca>Sisa</th><th class="border border-gray-900 px-1.5 py-1.5 text-center font-bold text-gray-900 uppercase tracking-wide" style="${ssrRenderStyle({ "width": "13%" })}" data-v-c4e7a8ca>% Okupansi</th></tr></thead><tbody data-v-c4e7a8ca><!--[-->`);
        ssrRenderList(filteredDashboardData.value, (item, index2) => {
          _push(`<tr class="${ssrRenderClass(index2 % 2 === 0 ? "bg-white" : "bg-gray-50")}" data-v-c4e7a8ca><td class="border border-gray-900 px-1.5 py-1.5 font-medium text-gray-900 text-center" data-v-c4e7a8ca>${ssrInterpolate(index2 + 1)}</td><td class="border border-gray-900 px-2 py-1.5 font-medium text-gray-900" data-v-c4e7a8ca>${ssrInterpolate(item.name)}</td><td class="border border-gray-900 px-1.5 py-1.5 font-medium text-gray-900 text-center" data-v-c4e7a8ca>${ssrInterpolate(item.totalCapacity)}</td><td class="border border-gray-900 px-1.5 py-1.5 font-medium text-gray-900 text-center" data-v-c4e7a8ca>${ssrInterpolate(item.totalBooked)}</td><td class="border border-gray-900 px-1.5 py-1.5 font-medium text-gray-900 text-center" data-v-c4e7a8ca>${ssrInterpolate(item.remaining)}</td><td class="${ssrRenderClass([item.occupancyRate >= 100 ? "bg-red-100 text-red-900" : item.occupancyRate > 75 ? "bg-amber-100 text-amber-900" : "bg-green-100 text-green-900", "border border-gray-900 px-1.5 py-1.5 font-medium text-center print:bg-transparent print:text-gray-900"])}" data-v-c4e7a8ca>${ssrInterpolate(Math.round(item.occupancyRate))}% </td></tr>`);
        });
        _push(`<!--]--></tbody><tfoot data-v-c4e7a8ca><tr class="bg-gray-200 font-bold" data-v-c4e7a8ca><td colspan="2" class="border border-gray-900 px-2 py-2 font-bold text-gray-900 uppercase" data-v-c4e7a8ca>Total</td><td class="border border-gray-900 px-1.5 py-2 font-bold text-gray-900 text-center" data-v-c4e7a8ca>${ssrInterpolate(totalCapacity.value)}</td><td class="border border-gray-900 px-1.5 py-2 font-bold text-gray-900 text-center" data-v-c4e7a8ca>${ssrInterpolate(totalBooked.value)}</td><td class="border border-gray-900 px-1.5 py-2 font-bold text-gray-900 text-center" data-v-c4e7a8ca>${ssrInterpolate(totalAvailable.value)}</td><td class="border border-gray-900 px-1.5 py-2 font-bold text-gray-900 text-center" data-v-c4e7a8ca>${ssrInterpolate(totalCapacity.value > 0 ? (totalBooked.value / totalCapacity.value * 100).toFixed(2) : "0.00")}% </td></tr></tfoot></table><div class="mt-4 mb-2 space-y-3 text-[9px] text-gray-800 leading-tight" data-v-c4e7a8ca><div class="border-t border-gray-400 pt-2" data-v-c4e7a8ca><p class="font-bold mb-1.5 text-[10px]" data-v-c4e7a8ca>Keterangan Informasi:</p><ul class="list-disc list-inside space-y-0.5 text-gray-700 ml-2" data-v-c4e7a8ca><li data-v-c4e7a8ca><span class="font-semibold" data-v-c4e7a8ca>Total Kuota:</span> Kapasitas slot operasional lapangan selama periode yang dipilih.</li><li data-v-c4e7a8ca><span class="font-semibold" data-v-c4e7a8ca>Terbooking:</span> Jumlah slot yang sudah dipesan oleh pengguna.</li><li data-v-c4e7a8ca><span class="font-semibold" data-v-c4e7a8ca>Sisa:</span> Jumlah slot yang masih tersedia untuk dipesan.</li><li data-v-c4e7a8ca><span class="font-semibold" data-v-c4e7a8ca>Persentase Okupansi:</span> Tingkat penggunaan lapangan (Terbooking / Total Kuota × 100%).</li></ul></div><div class="border-t border-gray-400 pt-2" data-v-c4e7a8ca><p class="text-gray-600 italic text-[8px]" data-v-c4e7a8ca>Laporan ini dicetak secara otomatis oleh Sistem Informasi ${ssrInterpolate(appName.value)}.</p></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-c4e7a8ca"]]);

export { index as default };
//# sourceMappingURL=index-Bkts6mzZ.mjs.map
