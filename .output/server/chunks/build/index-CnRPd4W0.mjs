import { _ as __nuxt_component_0 } from './nuxt-link-DqM75kvd.mjs';
import { _ as __nuxt_component_3 } from './WhatsAppFloatingButton-CAW2622p.mjs';
import { defineComponent, computed, ref, withAsyncContext, watch, mergeProps, withCtx, createVNode, toDisplayString, createBlock, openBlock, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderClass } from 'vue/server-renderer';
import { u as useHead } from './composables-D8u1NqZw.mjs';
import { _ as _export_sfc, u as useAppOptions } from './server.mjs';
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
import 'vue-router';

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
    const { options } = useAppOptions();
    computed(() => options.value.data?.name || "VENUE UNDIP");
    const unitName = computed(() => options.value.data?.unitName || "UPT Layanan Seni, Budaya dan Olahraga");
    const unitDesc = computed(() => options.value.data?.unitDesc || "Temukan stadion pilihan Anda. Lihat lapangan yang tersedia dan siap untuk dijadwalkan kapan saja Anda butuhkan.");
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
          return activeFieldCount(b) - activeFieldCount(a);
        } else {
          return (b.bookingCount ?? 0) - (a.bookingCount ?? 0);
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
    const totalStadions = computed(
      () => stadionsData.value?.filter((s) => s.status === "ACTIVE").length ?? 0
    );
    const activeFieldCount = (stadion) => stadion?.fields?.filter((f) => f.status === "ACTIVE").length ?? 0;
    const totalFreeFields = computed(
      () => stadionsData.value?.filter((s) => s.status === "ACTIVE").reduce((sum, s) => sum + activeFieldCount(s), 0) ?? 0
    );
    const formatNumber = (num) => {
      if (num >= 1e3) {
        return (num / 1e3).toFixed(1).replace(/\.0$/, "") + "k+";
      }
      return num.toString();
    };
    const topFreeStadions = computed(() => {
      const list = (stadionsData.value || []).filter((s) => s.status === "ACTIVE");
      const mapped = [...list].map((s) => ({
        ...s,
        freeFields: activeFieldCount(s),
        bookingCountDisplay: formatNumber(s.bookingCount ?? 0),
        cover: getCoverImage(s)
      })).filter((s) => (s.bookingCount ?? 0) > 0).sort((a, b) => (b.bookingCount ?? 0) - (a.bookingCount ?? 0)).slice(0, 3);
      if (mapped.length === 0) {
        return [...list].map((s) => ({
          ...s,
          freeFields: activeFieldCount(s),
          bookingCountDisplay: "0",
          cover: getCoverImage(s)
        })).sort((a, b) => b.freeFields - a.freeFields).slice(0, 3);
      }
      return mapped;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_ClientWhatsAppFloatingButton = __nuxt_component_3;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gradient-to-br from-[#f5f7fb] via-[#f8fafc] to-[#f5f7fb]" }, _attrs))} data-v-7d780bea><div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-8 lg:space-y-12" data-v-7d780bea><section class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0f1f4a] via-[#1a2d5a] to-[#0f1f4a] px-6 py-10 text-white shadow-2xl shadow-[#0f1f4a]/40 sm:px-10 lg:py-12" data-v-7d780bea><div class="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" data-v-7d780bea></div><div class="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl" data-v-7d780bea></div><div class="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between" data-v-7d780bea><div class="space-y-4 max-w-xl" data-v-7d780bea><div class="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 px-4 py-1.5" data-v-7d780bea><span class="relative flex h-2.5 w-2.5" data-v-7d780bea><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" data-v-7d780bea></span><span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" data-v-7d780bea></span></span><span class="text-xs font-bold uppercase tracking-wider text-emerald-100" data-v-7d780bea>Statistik Terkini</span></div><div class="space-y-2" data-v-7d780bea><p class="text-xs uppercase tracking-[0.2em] text-blue-200/70 font-semibold" data-v-7d780bea>Ringkasan Lapangan</p><h2 class="uppercase text-3xl lg:text-4xl font-bold leading-[1.4] pb-1 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent" data-v-7d780bea>${ssrInterpolate(unitName.value)}</h2></div><p class="text-sm leading-relaxed text-blue-100/90 max-w-md" data-v-7d780bea>${ssrInterpolate(unitDesc.value)}</p></div><div class="grid w-full max-w-md grid-cols-2 gap-3 sm:gap-4" data-v-7d780bea><div class="group relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-4 sm:p-5 shadow-xl transition-transform duration-300 [@media(hover:hover)]:hover:-translate-y-1 [@media(hover:hover)]:hover:shadow-2xl cursor-pointer transform-gpu" data-v-7d780bea><div class="absolute inset-0 bg-white/0 [@media(hover:hover)]:group-hover:bg-white/10 transition-colors duration-300 pointer-events-none" data-v-7d780bea></div><div class="relative z-10" data-v-7d780bea><div class="flex items-start justify-between mb-3" data-v-7d780bea><div class="flex items-center justify-center h-10 w-10 rounded-xl bg-blue-500/20 border border-blue-400/30" data-v-7d780bea><svg class="h-5 w-5 text-blue-300" fill="currentColor" viewBox="0 0 24 24" data-v-7d780bea><path d="M12 3C6.48 3 2 5.24 2 8V12C2 14.76 6.48 17 12 17C17.52 17 22 14.76 22 12V8C22 5.24 17.52 3 12 3ZM4 8C4 6.34 7.58 5 12 5C16.42 5 20 6.34 20 8C20 9.66 16.42 11 12 11C7.58 11 4 9.66 4 8ZM20 12C20 12.24 19.94 12.48 19.8 12.71C18.92 14.15 15.78 15 12 15C8.22 15 5.08 14.15 4.2 12.71C4.06 12.48 4 12.24 4 12V10.74C5.77 11.64 8.64 12.25 12 12.25C15.36 12.25 18.23 11.64 20 10.74V12Z" data-v-7d780bea></path></svg></div></div><p class="text-[10px] uppercase tracking-wider text-blue-200/80 font-bold mb-1" data-v-7d780bea>Total Stadion</p><p class="text-2xl sm:text-4xl font-black mb-1" data-v-7d780bea>${ssrInterpolate(totalStadions.value)}</p><p class="text-[10px] sm:text-xs text-blue-100/70 font-medium" data-v-7d780bea>Lokasi terdaftar</p></div></div><div class="group relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-4 sm:p-5 shadow-xl transition-transform duration-300 [@media(hover:hover)]:hover:-translate-y-1 [@media(hover:hover)]:hover:shadow-2xl cursor-pointer transform-gpu" data-v-7d780bea><div class="absolute inset-0 bg-white/0 [@media(hover:hover)]:group-hover:bg-white/10 transition-colors duration-300 pointer-events-none" data-v-7d780bea></div><div class="relative z-10" data-v-7d780bea><div class="flex items-start justify-between mb-3" data-v-7d780bea><div class="flex items-center justify-center h-10 w-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30" data-v-7d780bea><svg class="h-5 w-5 text-emerald-300" fill="currentColor" viewBox="0 0 24 24" data-v-7d780bea><path d="M4 5C2.9 5 2 5.9 2 7V17C2 18.1 2.9 19 4 19H20C21.1 19 22 18.1 22 17V7C22 5.9 21.1 5 20 5H4ZM4 7H11V17H4V7ZM13 7H20V17H13V7ZM9 9C8.45 9 8 9.45 8 10C8 10.55 8.45 11 9 11C9.55 11 10 10.55 10 10C10 9.45 9.55 9 9 9ZM15 9C14.45 9 14 9.45 14 10C14 10.55 14.45 11 15 11C15.55 11 16 10.55 16 10C16 9.45 15.55 9 15 9Z" data-v-7d780bea></path></svg></div></div><p class="text-[10px] uppercase tracking-wider text-blue-200/80 font-bold mb-1" data-v-7d780bea>Lapangan Aktif</p><p class="text-2xl sm:text-4xl font-black mb-1" data-v-7d780bea>${ssrInterpolate(totalFreeFields.value)}</p><p class="text-[10px] sm:text-xs text-blue-100/70 font-medium" data-v-7d780bea>Siap dijadwalkan</p></div></div></div></div><div class="relative z-10 mt-6 space-y-4" data-v-7d780bea><div class="flex items-center justify-between" data-v-7d780bea><h3 class="text-lg font-bold text-white flex items-center gap-2" data-v-7d780bea><svg class="h-5 w-5 text-amber-400" fill="currentColor" viewBox="0 0 24 24" data-v-7d780bea><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" data-v-7d780bea></path></svg> Stadion Terpopuler </h3></div><div class="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" data-v-7d780bea><!--[-->`);
      ssrRenderList(topFreeStadions.value, (stadion) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: stadion.id,
          to: `/venues/${stadion.id}`,
          class: "group relative flex gap-3 overflow-hidden rounded-lg border border-white/20 bg-white/5 backdrop-blur-sm p-2.5 transition-all duration-300 [@media(hover:hover)]:hover:border-amber-400/40 [@media(hover:hover)]:hover:bg-white/10 [@media(hover:hover)]:hover:shadow-lg [@media(hover:hover)]:hover:shadow-amber-500/10"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="absolute -top-1 -left-1 flex items-center justify-center w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-br-lg shadow-md z-10" data-v-7d780bea${_scopeId}><span class="text-xs font-black text-white" data-v-7d780bea${_scopeId}>${ssrInterpolate(topFreeStadions.value.indexOf(stadion) + 1)}</span></div><div class="relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-md" data-v-7d780bea${_scopeId}><img${ssrRenderAttr("src", stadion.cover)}${ssrRenderAttr("alt", stadion.name)} class="h-full w-full object-cover transition-transform duration-500 [@media(hover:hover)]:group-hover:scale-110" data-v-7d780bea${_scopeId}><div class="absolute inset-0 bg-gradient-to-br from-black/20 to-black/40" data-v-7d780bea${_scopeId}></div></div><div class="flex-1 flex flex-col justify-between min-w-0 py-0.5" data-v-7d780bea${_scopeId}><div data-v-7d780bea${_scopeId}><h4 class="text-sm font-bold text-white leading-tight line-clamp-1 mb-1.5 [@media(hover:hover)]:group-hover:text-amber-300 transition-colors" data-v-7d780bea${_scopeId}>${ssrInterpolate(stadion.name)}</h4><div class="flex flex-col gap-0.5 text-[11px]" data-v-7d780bea${_scopeId}><div class="flex items-center gap-1.5 text-blue-100/80" data-v-7d780bea${_scopeId}><svg class="h-3 w-3 text-amber-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" data-v-7d780bea${_scopeId}><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" data-v-7d780bea${_scopeId}></path></svg><span data-v-7d780bea${_scopeId}><span class="font-bold text-white" data-v-7d780bea${_scopeId}>${ssrInterpolate(stadion.bookingCountDisplay)}</span> orang telah booking</span></div><div class="flex items-center gap-1.5 text-blue-100/80" data-v-7d780bea${_scopeId}><svg class="h-3 w-3 text-emerald-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" data-v-7d780bea${_scopeId}><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" data-v-7d780bea${_scopeId}></path></svg><span data-v-7d780bea${_scopeId}><span class="font-bold text-white" data-v-7d780bea${_scopeId}>${ssrInterpolate(stadion.freeFields)}</span> lapangan tersedia</span></div></div></div><div class="flex items-center justify-end mt-1" data-v-7d780bea${_scopeId}><svg class="h-3.5 w-3.5 text-white/60 transition-all [@media(hover:hover)]:group-hover:text-amber-300 [@media(hover:hover)]:group-hover:translate-x-0.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" data-v-7d780bea${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" data-v-7d780bea${_scopeId}></path></svg></div></div>`);
            } else {
              return [
                createVNode("div", { class: "absolute -top-1 -left-1 flex items-center justify-center w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-br-lg shadow-md z-10" }, [
                  createVNode("span", { class: "text-xs font-black text-white" }, toDisplayString(topFreeStadions.value.indexOf(stadion) + 1), 1)
                ]),
                createVNode("div", { class: "relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-md" }, [
                  createVNode("img", {
                    src: stadion.cover,
                    alt: stadion.name,
                    class: "h-full w-full object-cover transition-transform duration-500 [@media(hover:hover)]:group-hover:scale-110"
                  }, null, 8, ["src", "alt"]),
                  createVNode("div", { class: "absolute inset-0 bg-gradient-to-br from-black/20 to-black/40" })
                ]),
                createVNode("div", { class: "flex-1 flex flex-col justify-between min-w-0 py-0.5" }, [
                  createVNode("div", null, [
                    createVNode("h4", { class: "text-sm font-bold text-white leading-tight line-clamp-1 mb-1.5 [@media(hover:hover)]:group-hover:text-amber-300 transition-colors" }, toDisplayString(stadion.name), 1),
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
                          createVNode("span", { class: "font-bold text-white" }, toDisplayString(stadion.bookingCountDisplay), 1),
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
                      class: "h-3.5 w-3.5 text-white/60 transition-all [@media(hover:hover)]:group-hover:text-amber-300 [@media(hover:hover)]:group-hover:translate-x-0.5",
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
      _push(`<!--]--></div></div></section><section class="rounded-2xl bg-white p-6 shadow-lg shadow-gray-200/50 border border-gray-100/50" data-v-7d780bea><div class="flex flex-col gap-3" data-v-7d780bea><div class="flex flex-col sm:flex-row items-stretch gap-3" data-v-7d780bea><div class="flex flex-1 items-center gap-3 rounded-xl border-2 border-gray-200 px-4 py-3.5 text-sm transition-all duration-200 focus-within:border-[#1f2a56] focus-within:ring-4 focus-within:ring-[#1f2a56]/10" data-v-7d780bea><svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-7d780bea><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" data-v-7d780bea></path></svg><input type="text" placeholder="Cari stadion berdasarkan nama..."${ssrRenderAttr("value", searchQuery.value)} class="w-full border-none text-gray-700 placeholder:text-gray-400 focus:outline-none font-medium" data-v-7d780bea>`);
      if (searchQuery.value) {
        _push(`<button class="text-gray-400 [@media(hover:hover)]:hover:text-gray-600 active:text-gray-600 transition-colors" data-v-7d780bea><svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-7d780bea><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" data-v-7d780bea></path></svg></button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><button class="group inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-[#1f2a56] to-[#0f1a3c] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#1f2a56]/20 transition-all duration-300 [@media(hover:hover)]:hover:shadow-xl [@media(hover:hover)]:hover:shadow-[#1f2a56]/30 [@media(hover:hover)]:hover:-translate-y-0.5 active:scale-[0.98] sm:w-auto w-full" data-v-7d780bea><svg class="h-5 w-5 transition-transform [@media(hover:hover)]:group-hover:scale-110" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" data-v-7d780bea><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" data-v-7d780bea></path></svg> Cari Sekarang </button></div></div></section>`);
      if (unref(pending)) {
        _push(`<section class="grid w-full place-items-center rounded-2xl bg-white py-16 shadow-lg border border-gray-100" data-v-7d780bea><div class="flex flex-col items-center gap-4" data-v-7d780bea><div class="relative" data-v-7d780bea><div class="h-16 w-16 rounded-full border-4 border-gray-200" data-v-7d780bea></div><div class="absolute top-0 h-16 w-16 animate-spin rounded-full border-4 border-[#1f2a56] border-t-transparent" data-v-7d780bea></div></div><p class="text-gray-600 font-medium" data-v-7d780bea>Memuat data stadion...</p></div></section>`);
      } else if (unref(error)) {
        _push(`<section class="grid w-full place-items-center rounded-2xl bg-white py-16 shadow-lg border border-red-100" data-v-7d780bea><div class="space-y-5 text-center max-w-md" data-v-7d780bea><div class="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-100" data-v-7d780bea><svg class="h-8 w-8 text-red-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-7d780bea><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" data-v-7d780bea></path></svg></div><div data-v-7d780bea><h3 class="text-lg font-bold text-gray-900 mb-2" data-v-7d780bea>Gagal Memuat Data</h3><p class="text-sm text-gray-600 max-w-xs mx-auto leading-relaxed" data-v-7d780bea> Layanan sedang tidak tersedia saat ini. Mohon periksa koneksi internet Anda atau coba muat ulang halaman. </p><details class="group mt-2" data-v-7d780bea><summary class="cursor-pointer text-xs text-gray-400 [@media(hover:hover)]:hover:text-gray-600 active:text-gray-600 transition-colors select-none list-none flex items-center justify-center gap-1" data-v-7d780bea><span data-v-7d780bea>Detail Error</span><svg class="w-3 h-3 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-7d780bea><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" data-v-7d780bea></path></svg></summary><pre class="mt-2 p-3 bg-gray-50 rounded-lg text-[10px] text-red-500 font-mono text-left overflow-x-auto border border-gray-100 whitespace-pre-wrap break-all" data-v-7d780bea>${ssrInterpolate(unref(error).message)}</pre></details></div><button class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1f2a56] to-[#0f1a3c] px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all [@media(hover:hover)]:hover:shadow-xl [@media(hover:hover)]:hover:-translate-y-0.5 active:scale-[0.98]" data-v-7d780bea><svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-7d780bea><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" data-v-7d780bea></path></svg> Coba Lagi </button></div></section>`);
      } else if (searchQuery.value && filteredStadions.value.length === 0) {
        _push(`<section class="grid w-full place-items-center rounded-2xl bg-white py-16 shadow-lg border border-gray-100" data-v-7d780bea><div class="space-y-5 text-center max-w-md" data-v-7d780bea><div class="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-100" data-v-7d780bea><svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-7d780bea><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" data-v-7d780bea></path></svg></div><div data-v-7d780bea><h3 class="text-lg font-bold text-gray-900 mb-2" data-v-7d780bea>Tidak Ada Hasil</h3><p class="text-sm text-gray-600" data-v-7d780bea>Tidak ada stadion yang cocok dengan &quot;<span class="font-semibold" data-v-7d780bea>${ssrInterpolate(searchQuery.value)}</span>&quot;</p><p class="text-xs text-gray-500 mt-2" data-v-7d780bea>Coba gunakan kata kunci lain atau periksa ejaan.</p></div><button class="inline-flex items-center gap-2 rounded-xl bg-gray-100 px-6 py-3 text-sm font-semibold text-gray-700 transition-all [@media(hover:hover)]:hover:bg-gray-200 active:bg-gray-200" data-v-7d780bea><svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-7d780bea><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" data-v-7d780bea></path></svg> Hapus Pencarian </button></div></section>`);
      } else {
        _push(`<section id="stadium-list" data-v-7d780bea><div class="flex items-center justify-between mb-6" data-v-7d780bea><div data-v-7d780bea><h2 class="text-2xl font-bold text-gray-900" data-v-7d780bea>${ssrInterpolate(searchQuery.value ? "Hasil Pencarian" : "Semua Stadion")}</h2><p class="text-sm text-gray-600 mt-1" data-v-7d780bea>${ssrInterpolate(searchQuery.value ? `${filteredStadions.value.length} stadion ditemukan` : `Menampilkan ${paginatedStadions.value.length} dari ${filteredStadions.value.length} stadion`)}</p></div></div><div${ssrRenderAttrs({
          name: "stadium-list",
          class: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8"
        })} data-v-7d780bea>`);
        ssrRenderList(paginatedStadions.value, (stadion) => {
          _push(`<article class="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-sm [@media(hover:hover)]:hover:shadow-lg [@media(hover:hover)]:hover:border-blue-300 transition-all duration-300 cursor-pointer h-full" data-v-7d780bea><div class="relative h-48 w-full overflow-hidden bg-gray-100" data-v-7d780bea><img${ssrRenderAttr("src", getCoverImage(stadion))}${ssrRenderAttr("alt", stadion.name)} class="h-full w-full object-cover transition-transform duration-500 [@media(hover:hover)]:group-hover:scale-105" data-v-7d780bea><div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60" data-v-7d780bea></div></div><div class="flex flex-col flex-1 p-5" data-v-7d780bea><div class="flex-1" data-v-7d780bea><p class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1" data-v-7d780bea>Venue</p><h3 class="text-lg font-bold text-gray-900 [@media(hover:hover)]:group-hover:text-blue-700 transition-colors line-clamp-2" data-v-7d780bea>${ssrInterpolate(stadion.name)}</h3></div><div class="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between" data-v-7d780bea><div class="flex items-center gap-1.5 text-xs text-gray-500" data-v-7d780bea><svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-7d780bea><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" data-v-7d780bea></path></svg><span class="font-semibold text-gray-700" data-v-7d780bea>${ssrInterpolate(activeFieldCount(stadion))}</span><span data-v-7d780bea>Lapangan Aktif</span></div><div class="flex items-center gap-1 text-sm font-bold text-blue-600 [@media(hover:hover)]:group-hover:translate-x-1 transition-transform" data-v-7d780bea> Lihat Jadwal <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-7d780bea><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" data-v-7d780bea></path></svg></div></div></div></article>`);
        });
        _push(`</div>`);
        if (totalPages.value > 1) {
          _push(`<div class="flex items-center justify-center gap-2 mt-8" data-v-7d780bea><button${ssrIncludeBooleanAttr(currentPage.value === 1) ? " disabled" : ""} class="p-2 rounded-lg border border-gray-200 [@media(hover:hover)]:hover:bg-gray-50 active:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" data-v-7d780bea><svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-7d780bea><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" data-v-7d780bea></path></svg></button><div class="flex items-center gap-1" data-v-7d780bea><!--[-->`);
          ssrRenderList(totalPages.value, (page) => {
            _push(`<button class="${ssrRenderClass([
              "w-10 h-10 rounded-lg text-sm font-semibold transition-all duration-200",
              currentPage.value === page ? "bg-[#1f2a56] text-white shadow-lg shadow-[#1f2a56]/20 scale-105" : "text-gray-600 [@media(hover:hover)]:hover:bg-gray-100 active:bg-gray-100"
            ])}" data-v-7d780bea>${ssrInterpolate(page)}</button>`);
          });
          _push(`<!--]--></div><button${ssrIncludeBooleanAttr(currentPage.value === totalPages.value) ? " disabled" : ""} class="p-2 rounded-lg border border-gray-200 [@media(hover:hover)]:hover:bg-gray-50 active:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" data-v-7d780bea><svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-7d780bea><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" data-v-7d780bea></path></svg></button></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</section>`);
      }
      _push(`</div>`);
      _push(ssrRenderComponent(_component_ClientWhatsAppFloatingButton, null, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-7d780bea"]]);

export { index as default };
//# sourceMappingURL=index-CnRPd4W0.mjs.map
