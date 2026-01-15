import { _ as __nuxt_component_0 } from './server.mjs';
import { defineComponent, ref, withAsyncContext, computed, watch, mergeProps, withCtx, createVNode, createBlock, openBlock, toDisplayString, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderClass } from 'vue/server-renderer';
import { u as useHead } from './composables-B5D2SRP0.mjs';
import { u as useAsyncData } from './asyncData-VRyZt-9X.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
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

const fallbackImage = "https://images.unsplash.com/photo-1522778526097-ce0a22ceb253?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
const itemsPerPage = 6;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    useHead({
      title: "VENUE UNDIP - Sewa Venue & Lapangan Olahraga",
      meta: [
        { name: "description", content: "Temukan dan sewa venue serta lapangan olahraga terbaik di Universitas Diponegoro. Booking mudah, cepat, dan terpercaya." }
      ]
    });
    const searchQuery = ref("");
    const debouncedSearchQuery = ref("");
    const sortBy = ref("fields");
    const currentPage = ref(1);
    const { data: stadionsData, pending, error, refresh } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "home-stadions",
      () => $fetch("/api/stadions/with-bookings")
    )), __temp = await __temp, __restore(), __temp);
    const filteredStadions = computed(() => {
      let list = stadionsData.value || [];
      list = list.filter((stadion) => stadion.status === "ACTIVE");
      const query = debouncedSearchQuery.value.trim().toLowerCase();
      if (query) {
        list = list.filter((stadion) => stadion.name?.toLowerCase().includes(query));
      }
      const sorted = [...list].sort((a, b) => {
        if (sortBy.value === "fields") {
          return (b.fields?.length ?? 0) - (a.fields?.length ?? 0);
        } else {
          const getBookingCount = (s) => {
            const uniqueBookingIds = /* @__PURE__ */ new Set();
            s.fields?.forEach((field) => {
              field.bookingDetails?.forEach((bd) => {
                if (bd.Booking?.status === "APPROVED" && bd.bookingId) {
                  uniqueBookingIds.add(bd.bookingId);
                }
              });
            });
            return uniqueBookingIds.size;
          };
          return getBookingCount(b) - getBookingCount(a);
        }
      });
      return sorted;
    });
    const paginatedStadions = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return filteredStadions.value.slice(start, end);
    });
    const totalPages = computed(() => Math.ceil(filteredStadions.value.length / itemsPerPage));
    let debounceTimeout = null;
    watch(searchQuery, (newValue) => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
      debounceTimeout = setTimeout(() => {
        debouncedSearchQuery.value = newValue;
        currentPage.value = 1;
      }, 300);
    });
    watch(debouncedSearchQuery, () => {
      currentPage.value = 1;
    });
    const getCoverImage = (stadion) => stadion.images?.[0]?.imageUrl || fallbackImage;
    const totalStadions = computed(() => stadionsData.value?.length ?? 0);
    computed(
      () => stadionsData.value?.reduce((sum, s) => sum + (s.fields?.length ?? 0), 0) ?? 0
    );
    const activeFieldCount = (stadion) => stadion?.fields?.length ?? 0;
    const totalFreeFields = computed(
      () => stadionsData.value?.reduce((sum, s) => sum + activeFieldCount(s), 0) ?? 0
    );
    const stadionWithMostFields = computed(() => {
      const list = stadionsData.value || [];
      if (!list.length) return null;
      return list.reduce((max, current) => {
        const maxLen = activeFieldCount(max);
        const currLen = activeFieldCount(current);
        return currLen > maxLen ? current : max;
      });
    });
    const topFreeStadions = computed(() => {
      const list = stadionsData.value || [];
      const getStadiumBookingCount = (s) => {
        const uniqueBookingIds = /* @__PURE__ */ new Set();
        s.fields?.forEach((field) => {
          field.bookingDetails?.forEach((bd) => {
            if (bd.Booking?.status === "APPROVED" && bd.bookingId) {
              uniqueBookingIds.add(bd.bookingId);
            }
          });
        });
        const count = uniqueBookingIds.size;
        return count;
      };
      const mapped = [...list].map((s) => ({
        ...s,
        freeFields: activeFieldCount(s),
        bookingCount: getStadiumBookingCount(s),
        cover: getCoverImage(s)
      })).filter((s) => s.bookingCount > 0).sort((a, b) => b.bookingCount - a.bookingCount).slice(0, 3);
      if (mapped.length === 0) {
        return [...list].map((s) => ({
          ...s,
          freeFields: activeFieldCount(s),
          bookingCount: 0,
          cover: getCoverImage(s)
        })).sort((a, b) => b.freeFields - a.freeFields).slice(0, 3);
      }
      return mapped;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gradient-to-br from-[#f5f7fb] via-[#f8fafc] to-[#f5f7fb]" }, _attrs))} data-v-3807b3fe><div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-8 lg:space-y-12" data-v-3807b3fe><section class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0f1f4a] via-[#1a2d5a] to-[#0f1f4a] px-6 py-10 text-white shadow-2xl shadow-[#0f1f4a]/40 sm:px-10 lg:py-12" data-v-3807b3fe><div class="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" data-v-3807b3fe></div><div class="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl" data-v-3807b3fe></div><div class="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between" data-v-3807b3fe><div class="space-y-4 max-w-xl" data-v-3807b3fe><div class="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 px-4 py-1.5" data-v-3807b3fe><span class="relative flex h-2.5 w-2.5" data-v-3807b3fe><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" data-v-3807b3fe></span><span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" data-v-3807b3fe></span></span><span class="text-xs font-bold uppercase tracking-wider text-emerald-100" data-v-3807b3fe>Live Update</span></div><div class="space-y-2" data-v-3807b3fe><p class="text-xs uppercase tracking-[0.2em] text-blue-200/70 font-semibold" data-v-3807b3fe>Ringkasan Lapangan</p><h2 class="text-3xl lg:text-4xl font-bold leading-[1.4] pb-1 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent" data-v-3807b3fe> Layanan Penyewaan Lapangan Olahraga </h2></div><p class="text-sm leading-relaxed text-blue-100/90 max-w-md" data-v-3807b3fe> Temukan stadion pilihan Anda. Lihat lapangan yang tersedia dan siap untuk dijadwalkan kapan saja Anda butuhkan. </p></div><div class="grid w-full max-w-2xl grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3" data-v-3807b3fe><div class="group rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md p-5 shadow-xl transition-all duration-300 hover:border-white/30 hover:bg-white/15 hover:-translate-y-1 hover:shadow-2xl cursor-pointer" data-v-3807b3fe><div class="flex items-start justify-between mb-3" data-v-3807b3fe><div class="flex items-center justify-center h-10 w-10 rounded-xl bg-blue-500/20 border border-blue-400/30" data-v-3807b3fe><svg class="h-5 w-5 text-blue-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-3807b3fe><path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" data-v-3807b3fe></path></svg></div></div><p class="text-[10px] uppercase tracking-wider text-blue-200/80 font-bold mb-1" data-v-3807b3fe>Total Stadion</p><p class="text-4xl font-black mb-1" data-v-3807b3fe>${ssrInterpolate(totalStadions.value)}</p><p class="text-xs text-blue-100/70 font-medium" data-v-3807b3fe>Lokasi terdaftar</p></div><div class="group rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md p-5 shadow-xl transition-all duration-300 hover:border-white/30 hover:bg-white/15 hover:-translate-y-1 hover:shadow-2xl cursor-pointer" data-v-3807b3fe><div class="flex items-start justify-between mb-3" data-v-3807b3fe><div class="flex items-center justify-center h-10 w-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30" data-v-3807b3fe><svg class="h-5 w-5 text-emerald-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-3807b3fe><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" data-v-3807b3fe></path></svg></div></div><p class="text-[10px] uppercase tracking-wider text-blue-200/80 font-bold mb-1" data-v-3807b3fe>Lapangan Aktif</p><p class="text-4xl font-black mb-1" data-v-3807b3fe>${ssrInterpolate(totalFreeFields.value)}</p><p class="text-xs text-blue-100/70 font-medium" data-v-3807b3fe>Siap dijadwalkan</p></div>`);
      if (stadionWithMostFields.value) {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/venues/${stadionWithMostFields.value.id}`,
          class: "group rounded-2xl border border-white/20 bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md p-5 shadow-xl transition-all duration-300 hover:border-white/40 hover:from-white/25 hover:to-white/10 hover:-translate-y-1 hover:shadow-2xl"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex items-start justify-between mb-3" data-v-3807b3fe${_scopeId}><div class="flex items-center justify-center h-10 w-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex-shrink-0" data-v-3807b3fe${_scopeId}><svg class="h-5 w-5 text-amber-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-3807b3fe${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" data-v-3807b3fe${_scopeId}></path></svg></div></div><p class="text-[10px] uppercase tracking-wider text-blue-200/80 font-bold mb-1" data-v-3807b3fe${_scopeId}>Lapangan Terbanyak</p><p class="text-xl font-bold leading-tight mb-1 line-clamp-1" data-v-3807b3fe${_scopeId}>${ssrInterpolate(activeFieldCount(stadionWithMostFields.value))}</p><p class="text-xs text-blue-100/70 font-medium mb-2 truncate" data-v-3807b3fe${_scopeId}>${ssrInterpolate(stadionWithMostFields.value.name)}</p><div class="inline-flex items-center gap-1 text-xs font-bold text-white group-hover:gap-1.5 transition-all" data-v-3807b3fe${_scopeId}> Lihat Detail <svg class="h-3 w-3 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" data-v-3807b3fe${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" data-v-3807b3fe${_scopeId}></path></svg></div>`);
            } else {
              return [
                createVNode("div", { class: "flex items-start justify-between mb-3" }, [
                  createVNode("div", { class: "flex items-center justify-center h-10 w-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex-shrink-0" }, [
                    (openBlock(), createBlock("svg", {
                      class: "h-5 w-5 text-amber-300",
                      fill: "none",
                      stroke: "currentColor",
                      "stroke-width": "2",
                      viewBox: "0 0 24 24"
                    }, [
                      createVNode("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        d: "M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
                      })
                    ]))
                  ])
                ]),
                createVNode("p", { class: "text-[10px] uppercase tracking-wider text-blue-200/80 font-bold mb-1" }, "Lapangan Terbanyak"),
                createVNode("p", { class: "text-xl font-bold leading-tight mb-1 line-clamp-1" }, toDisplayString(activeFieldCount(stadionWithMostFields.value)), 1),
                createVNode("p", { class: "text-xs text-blue-100/70 font-medium mb-2 truncate" }, toDisplayString(stadionWithMostFields.value.name), 1),
                createVNode("div", { class: "inline-flex items-center gap-1 text-xs font-bold text-white group-hover:gap-1.5 transition-all" }, [
                  createTextVNode(" Lihat Detail "),
                  (openBlock(), createBlock("svg", {
                    class: "h-3 w-3 transition-transform group-hover:translate-x-0.5",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    "stroke-width": "2.5"
                  }, [
                    createVNode("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      d: "M9 5l7 7-7 7"
                    })
                  ]))
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<div class="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-md p-5 shadow-xl" data-v-3807b3fe><div class="flex items-start justify-between mb-3" data-v-3807b3fe><div class="flex items-center justify-center h-10 w-10 rounded-xl bg-gray-500/20 border border-gray-400/30" data-v-3807b3fe><svg class="h-5 w-5 text-gray-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-3807b3fe><path stroke-linecap="round" stroke-linejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" data-v-3807b3fe></path></svg></div></div><p class="text-[10px] uppercase tracking-wider text-blue-200/80 font-bold mb-1" data-v-3807b3fe>Lapangan Terbanyak</p><p class="text-sm text-blue-100/70" data-v-3807b3fe>Data belum tersedia</p></div>`);
      }
      _push(`</div></div><div class="relative z-10 mt-4 space-y-4" data-v-3807b3fe><div class="flex items-center justify-between" data-v-3807b3fe><h3 class="text-lg font-bold text-white flex items-center gap-2" data-v-3807b3fe><svg class="h-5 w-5 text-amber-400" fill="currentColor" viewBox="0 0 24 24" data-v-3807b3fe><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" data-v-3807b3fe></path></svg> Stadion Terpopuler </h3></div><div class="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" data-v-3807b3fe><!--[-->`);
      ssrRenderList(topFreeStadions.value, (stadion) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: stadion.id,
          to: `/venues/${stadion.id}`,
          class: "group relative flex gap-3 overflow-hidden rounded-lg border border-white/20 bg-white/5 backdrop-blur-sm p-2.5 transition-all duration-300 hover:border-amber-400/40 hover:bg-white/10 hover:shadow-lg hover:shadow-amber-500/10"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="absolute -top-1 -left-1 flex items-center justify-center w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-br-lg shadow-md z-10" data-v-3807b3fe${_scopeId}><span class="text-xs font-black text-white" data-v-3807b3fe${_scopeId}>${ssrInterpolate(topFreeStadions.value.indexOf(stadion) + 1)}</span></div><div class="relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-md" data-v-3807b3fe${_scopeId}><img${ssrRenderAttr("src", stadion.cover)}${ssrRenderAttr("alt", stadion.name)} class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" data-v-3807b3fe${_scopeId}><div class="absolute inset-0 bg-gradient-to-br from-black/20 to-black/40" data-v-3807b3fe${_scopeId}></div></div><div class="flex-1 flex flex-col justify-between min-w-0 py-0.5" data-v-3807b3fe${_scopeId}><div data-v-3807b3fe${_scopeId}><h4 class="text-sm font-bold text-white leading-tight line-clamp-1 mb-1.5 group-hover:text-amber-300 transition-colors" data-v-3807b3fe${_scopeId}>${ssrInterpolate(stadion.name)}</h4><div class="flex flex-col gap-0.5 text-[11px]" data-v-3807b3fe${_scopeId}><div class="flex items-center gap-1.5 text-blue-100/80" data-v-3807b3fe${_scopeId}><svg class="h-3 w-3 text-amber-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" data-v-3807b3fe${_scopeId}><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" data-v-3807b3fe${_scopeId}></path></svg><span data-v-3807b3fe${_scopeId}><span class="font-bold text-white" data-v-3807b3fe${_scopeId}>${ssrInterpolate(stadion.bookingCount)}</span> orang telah booking</span></div><div class="flex items-center gap-1.5 text-blue-100/80" data-v-3807b3fe${_scopeId}><svg class="h-3 w-3 text-emerald-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" data-v-3807b3fe${_scopeId}><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" data-v-3807b3fe${_scopeId}></path></svg><span data-v-3807b3fe${_scopeId}><span class="font-bold text-white" data-v-3807b3fe${_scopeId}>${ssrInterpolate(stadion.freeFields)}</span> lapangan tersedia</span></div></div></div><div class="flex items-center justify-end mt-1" data-v-3807b3fe${_scopeId}><svg class="h-3.5 w-3.5 text-white/60 transition-all group-hover:text-amber-300 group-hover:translate-x-0.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" data-v-3807b3fe${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" data-v-3807b3fe${_scopeId}></path></svg></div></div>`);
            } else {
              return [
                createVNode("div", { class: "absolute -top-1 -left-1 flex items-center justify-center w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-br-lg shadow-md z-10" }, [
                  createVNode("span", { class: "text-xs font-black text-white" }, toDisplayString(topFreeStadions.value.indexOf(stadion) + 1), 1)
                ]),
                createVNode("div", { class: "relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-md" }, [
                  createVNode("img", {
                    src: stadion.cover,
                    alt: stadion.name,
                    class: "h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  }, null, 8, ["src", "alt"]),
                  createVNode("div", { class: "absolute inset-0 bg-gradient-to-br from-black/20 to-black/40" })
                ]),
                createVNode("div", { class: "flex-1 flex flex-col justify-between min-w-0 py-0.5" }, [
                  createVNode("div", null, [
                    createVNode("h4", { class: "text-sm font-bold text-white leading-tight line-clamp-1 mb-1.5 group-hover:text-amber-300 transition-colors" }, toDisplayString(stadion.name), 1),
                    createVNode("div", { class: "flex flex-col gap-0.5 text-[11px]" }, [
                      createVNode("div", { class: "flex items-center gap-1.5 text-blue-100/80" }, [
                        (openBlock(), createBlock("svg", {
                          class: "h-3 w-3 text-amber-400 flex-shrink-0",
                          fill: "currentColor",
                          viewBox: "0 0 20 20"
                        }, [
                          createVNode("path", { d: "M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" })
                        ])),
                        createVNode("span", null, [
                          createVNode("span", { class: "font-bold text-white" }, toDisplayString(stadion.bookingCount), 1),
                          createTextVNode(" orang telah booking")
                        ])
                      ]),
                      createVNode("div", { class: "flex items-center gap-1.5 text-blue-100/80" }, [
                        (openBlock(), createBlock("svg", {
                          class: "h-3 w-3 text-emerald-400 flex-shrink-0",
                          fill: "currentColor",
                          viewBox: "0 0 20 20"
                        }, [
                          createVNode("path", { d: "M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" })
                        ])),
                        createVNode("span", null, [
                          createVNode("span", { class: "font-bold text-white" }, toDisplayString(stadion.freeFields), 1),
                          createTextVNode(" lapangan tersedia")
                        ])
                      ])
                    ])
                  ]),
                  createVNode("div", { class: "flex items-center justify-end mt-1" }, [
                    (openBlock(), createBlock("svg", {
                      class: "h-3.5 w-3.5 text-white/60 transition-all group-hover:text-amber-300 group-hover:translate-x-0.5",
                      fill: "none",
                      stroke: "currentColor",
                      "stroke-width": "2.5",
                      viewBox: "0 0 24 24"
                    }, [
                      createVNode("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        d: "M9 5l7 7-7 7"
                      })
                    ]))
                  ])
                ])
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div></div></section><section class="rounded-2xl bg-white p-6 shadow-lg shadow-gray-200/50 border border-gray-100/50" data-v-3807b3fe><div class="flex flex-col gap-3" data-v-3807b3fe><div class="flex flex-col sm:flex-row items-stretch gap-3" data-v-3807b3fe><div class="flex flex-1 items-center gap-3 rounded-xl border-2 border-gray-200 px-4 py-3.5 text-sm transition-all duration-200 focus-within:border-[#1f2a56] focus-within:ring-4 focus-within:ring-[#1f2a56]/10" data-v-3807b3fe><svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-3807b3fe><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" data-v-3807b3fe></path></svg><input type="text" placeholder="Cari stadion berdasarkan nama..."${ssrRenderAttr("value", searchQuery.value)} class="w-full border-none text-gray-700 placeholder:text-gray-400 focus:outline-none font-medium" data-v-3807b3fe>`);
      if (searchQuery.value) {
        _push(`<button class="text-gray-400 hover:text-gray-600 transition-colors" data-v-3807b3fe><svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-3807b3fe><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" data-v-3807b3fe></path></svg></button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><button class="group inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-[#1f2a56] to-[#0f1a3c] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#1f2a56]/20 transition-all duration-300 hover:shadow-xl hover:shadow-[#1f2a56]/30 hover:-translate-y-0.5 sm:w-auto w-full" data-v-3807b3fe><svg class="h-5 w-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" data-v-3807b3fe><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" data-v-3807b3fe></path></svg> Cari Sekarang </button></div></div></section>`);
      if (unref(pending)) {
        _push(`<section class="grid w-full place-items-center rounded-2xl bg-white py-16 shadow-lg border border-gray-100" data-v-3807b3fe><div class="flex flex-col items-center gap-4" data-v-3807b3fe><div class="relative" data-v-3807b3fe><div class="h-16 w-16 rounded-full border-4 border-gray-200" data-v-3807b3fe></div><div class="absolute top-0 h-16 w-16 animate-spin rounded-full border-4 border-[#1f2a56] border-t-transparent" data-v-3807b3fe></div></div><p class="text-gray-600 font-medium" data-v-3807b3fe>Memuat data stadion...</p></div></section>`);
      } else if (unref(error)) {
        _push(`<section class="grid w-full place-items-center rounded-2xl bg-white py-16 shadow-lg border border-red-100" data-v-3807b3fe><div class="space-y-5 text-center max-w-md" data-v-3807b3fe><div class="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-100" data-v-3807b3fe><svg class="h-8 w-8 text-red-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-3807b3fe><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" data-v-3807b3fe></path></svg></div><div data-v-3807b3fe><h3 class="text-lg font-bold text-gray-900 mb-2" data-v-3807b3fe>Gagal Memuat Data</h3><p class="text-sm text-gray-600" data-v-3807b3fe>${ssrInterpolate(unref(error).message)}</p></div><button class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1f2a56] to-[#0f1a3c] px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5" data-v-3807b3fe><svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-3807b3fe><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" data-v-3807b3fe></path></svg> Coba Lagi </button></div></section>`);
      } else if (searchQuery.value && filteredStadions.value.length === 0) {
        _push(`<section class="grid w-full place-items-center rounded-2xl bg-white py-16 shadow-lg border border-gray-100" data-v-3807b3fe><div class="space-y-5 text-center max-w-md" data-v-3807b3fe><div class="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-100" data-v-3807b3fe><svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-3807b3fe><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" data-v-3807b3fe></path></svg></div><div data-v-3807b3fe><h3 class="text-lg font-bold text-gray-900 mb-2" data-v-3807b3fe>Tidak Ada Hasil</h3><p class="text-sm text-gray-600" data-v-3807b3fe>Tidak ada stadion yang cocok dengan &quot;<span class="font-semibold" data-v-3807b3fe>${ssrInterpolate(searchQuery.value)}</span>&quot;</p><p class="text-xs text-gray-500 mt-2" data-v-3807b3fe>Coba gunakan kata kunci lain atau periksa ejaan.</p></div><button class="inline-flex items-center gap-2 rounded-xl bg-gray-100 px-6 py-3 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-200" data-v-3807b3fe><svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-3807b3fe><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" data-v-3807b3fe></path></svg> Hapus Pencarian </button></div></section>`);
      } else {
        _push(`<section id="stadium-list" data-v-3807b3fe><div class="flex items-center justify-between mb-6" data-v-3807b3fe><div data-v-3807b3fe><h2 class="text-2xl font-bold text-gray-900" data-v-3807b3fe>${ssrInterpolate(searchQuery.value ? "Hasil Pencarian" : "Semua Stadion")}</h2><p class="text-sm text-gray-600 mt-1" data-v-3807b3fe>${ssrInterpolate(searchQuery.value ? `${filteredStadions.value.length} stadion ditemukan` : `Menampilkan ${paginatedStadions.value.length} dari ${filteredStadions.value.length} stadion`)}</p></div></div><div${ssrRenderAttrs({
          name: "stadium-list",
          class: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8"
        })} data-v-3807b3fe>`);
        ssrRenderList(paginatedStadions.value, (stadion) => {
          _push(`<article class="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all duration-300 cursor-pointer h-full" data-v-3807b3fe><div class="relative h-48 w-full overflow-hidden bg-gray-100" data-v-3807b3fe><img${ssrRenderAttr("src", getCoverImage(stadion))}${ssrRenderAttr("alt", stadion.name)} class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" data-v-3807b3fe><div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60" data-v-3807b3fe></div></div><div class="flex flex-col flex-1 p-5" data-v-3807b3fe><div class="flex-1" data-v-3807b3fe><p class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1" data-v-3807b3fe>Venue</p><h3 class="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-2" data-v-3807b3fe>${ssrInterpolate(stadion.name)}</h3></div><div class="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between" data-v-3807b3fe><div class="flex items-center gap-1.5 text-xs text-gray-500" data-v-3807b3fe><svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-3807b3fe><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" data-v-3807b3fe></path></svg><span class="font-semibold text-gray-700" data-v-3807b3fe>${ssrInterpolate(stadion.fields?.length ?? 0)}</span><span data-v-3807b3fe>Lapangan</span></div><div class="flex items-center gap-1 text-sm font-bold text-blue-600 group-hover:translate-x-1 transition-transform" data-v-3807b3fe> Lihat Jadwal <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-3807b3fe><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" data-v-3807b3fe></path></svg></div></div></div></article>`);
        });
        _push(`</div>`);
        if (totalPages.value > 1) {
          _push(`<div class="flex items-center justify-center gap-2 mt-8" data-v-3807b3fe><button${ssrIncludeBooleanAttr(currentPage.value === 1) ? " disabled" : ""} class="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" data-v-3807b3fe><svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-3807b3fe><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" data-v-3807b3fe></path></svg></button><div class="flex items-center gap-1" data-v-3807b3fe><!--[-->`);
          ssrRenderList(totalPages.value, (page) => {
            _push(`<button class="${ssrRenderClass([
              "w-10 h-10 rounded-lg text-sm font-semibold transition-all duration-200",
              currentPage.value === page ? "bg-[#1f2a56] text-white shadow-lg shadow-[#1f2a56]/20 scale-105" : "text-gray-600 hover:bg-gray-100"
            ])}" data-v-3807b3fe>${ssrInterpolate(page)}</button>`);
          });
          _push(`<!--]--></div><button${ssrIncludeBooleanAttr(currentPage.value === totalPages.value) ? " disabled" : ""} class="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" data-v-3807b3fe><svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-3807b3fe><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" data-v-3807b3fe></path></svg></button></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</section>`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-3807b3fe"]]);

export { index as default };
//# sourceMappingURL=index-B8dEMF68.mjs.map
