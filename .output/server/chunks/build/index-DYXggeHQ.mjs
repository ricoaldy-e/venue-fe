import { _ as __nuxt_component_0 } from './nuxt-link-DqM75kvd.mjs';
import { g as generateTimeSlots, _ as __nuxt_component_1, a as __nuxt_component_2, p as parseBackendError } from './errorParser-BWIBQjb-.mjs';
import { defineComponent, computed, ref, withAsyncContext, watch, mergeProps, withCtx, createBlock, createVNode, openBlock, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { g as getNextNDays, a as toDateKey, t as toUtcMidnightIso, b as getTodayInWib } from './dateHelpers-jbKEnFTU.mjs';
import { Icon } from '@iconify/vue';
import { _ as _export_sfc, u as useAppOptions, a as useRoute } from './server.mjs';
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
import 'vue-router';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';

const MOBILE_FIELD_DESC_LIMIT = 150;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { options } = useAppOptions();
    computed(() => options.value.data?.name || "VENUE UNDIP");
    useHead({
      title: "Booking Lapangan - VENUE UNDIP",
      meta: [
        { name: "description", content: "Kelola booking lapangan per stadion di VENUE UNDIP" }
      ]
    });
    const initialDays = getNextNDays(null, 7, true);
    const selectedDate = ref(initialDays[0]?.value ?? "");
    const days = computed(() => getNextNDays(null, 7, true));
    const selectedDateKey = computed(() => toDateKey(selectedDate.value));
    const isDateEqual = (date1, date2) => {
      return toDateKey(date1) === toDateKey(date2);
    };
    function hourFrom(entry, key) {
      if (!entry) return key === "open" ? 8 : 22;
      const direct = key === "open" ? entry.openHour : entry.closeHour;
      if (typeof direct === "number") return direct;
      const time = key === "open" ? entry.openTime : entry.closeTime;
      if (time) return new Date(time).getUTCHours();
      return key === "open" ? 8 : 22;
    }
    function extractOperatingHours(operatingHours) {
      if (!operatingHours || Array.isArray(operatingHours) && operatingHours.length === 0) {
        return { openHour: 8, closeHour: 22 };
      }
      const entries = Array.isArray(operatingHours) ? operatingHours : [operatingHours];
      const openHour = Math.min(...entries.map((entry) => hourFrom(entry, "open")));
      const closeHour = Math.max(...entries.map((entry) => hourFrom(entry, "close")));
      return { openHour, closeHour };
    }
    const route = useRoute();
    const stadionId = Number(route.params.id);
    const { data: stadion, pending, error } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      `admin-bookings-stadion-${stadionId}`,
      () => $fetch(`/api/stadions/${stadionId}`),
      {
        transform: (stadion2) => {
          const { openHour, closeHour } = extractOperatingHours(stadion2.operatingHours);
          const fields = stadion2.fields.map((field) => ({
            ...field,
            priceTendik: field.priceTendik,
            gallery: field.images?.map((img) => img.imageUrl) || [],
            slots: generateTimeSlots(openHour, closeHour, field.pricePerHour)
          }));
          return { ...stadion2, fields };
        }
      }
    )), __temp = await __temp, __restore(), __temp);
    const stadionImageIndex = ref(0);
    watch(stadion, (s) => {
      if (!s) return;
      stadionImageIndex.value = 0;
      if (s.fields && Array.isArray(s.fields)) {
        s.fields.forEach((f) => {
          if (f && f.id != null && fieldImageIndex.value[f.id] == null) fieldImageIndex.value[f.id] = 0;
        });
      }
    });
    ref(null);
    const currentStadionImage = computed(() => stadion.value?.images?.[stadionImageIndex.value]?.imageUrl || "/placeholder-stadium.jpg");
    const fieldImageIndex = ref({});
    function getFieldImageUrl(fieldId) {
      const field = stadion.value?.fields?.find((f) => Number(f.id) === Number(fieldId));
      const idx = fieldImageIndex.value[fieldId] || 0;
      return field?.gallery?.[idx] || field?.images?.[idx]?.imageUrl || "/placeholder-field.jpg";
    }
    ref({});
    const publicBookings = ref([]);
    const bookingError = ref(null);
    const loadPublicBookings = async () => {
      if (!stadionId || !selectedDateKey.value) {
        publicBookings.value = [];
        bookingError.value = null;
        return;
      }
      try {
        bookingError.value = null;
        publicBookings.value = await $fetch("/api/bookings", {
          query: { stadionId, date: toUtcMidnightIso(selectedDateKey.value) }
        });
      } catch (error2) {
        const parsed = parseBackendError(error2);
        console.error("Failed to load bookings:", parsed.message);
        bookingError.value = parsed.message;
        publicBookings.value = [];
      }
    };
    watch(selectedDateKey, () => loadPublicBookings());
    const expandedFields = ref({});
    const expandedFieldDescriptions = ref({});
    const isFieldDescriptionExpanded = (fieldId) => {
      return expandedFieldDescriptions.value[fieldId] ?? false;
    };
    const truncatedFieldDescription = (description, fieldId) => {
      if (!description || description.length <= MOBILE_FIELD_DESC_LIMIT) return description;
      return isFieldDescriptionExpanded(fieldId) ? description : description.slice(0, MOBILE_FIELD_DESC_LIMIT);
    };
    const needsFieldDescriptionTruncation = (description) => {
      return (description?.length || 0) > MOBILE_FIELD_DESC_LIMIT;
    };
    function isFieldExpanded(id) {
      return expandedFields.value[id] ?? false;
    }
    function isSlotBooked(fieldId, startHour) {
      if (!publicBookings.value || !selectedDateKey.value) return false;
      return publicBookings.value.some(
        (booking) => booking.details?.some(
          (detail) => detail.fieldId === fieldId && toDateKey(detail.bookingDate) === selectedDateKey.value && detail.startHour === startHour
        )
      );
    }
    function isFieldFullyBooked(field) {
      return field.slots.every((slot) => {
        const startHour = Number(slot.start.split(":")[0]);
        return isSlotBooked(Number(field.id), startHour);
      });
    }
    function availableSlotsCount(field) {
      return field.slots.filter((slot) => {
        const startHour = Number(slot.start.split(":")[0]);
        return !isSlotBooked(Number(field.id), startHour);
      }).length;
    }
    function getBookingInfo(fieldId, startHour) {
      const selectedKey = selectedDateKey.value;
      if (!selectedKey) return null;
      const booking = publicBookings.value?.find(
        (b) => b.details.some(
          (d) => d.fieldId === fieldId && toDateKey(d.bookingDate) === selectedKey && d.startHour === startHour
        )
      );
      return booking ? {
        name: booking.name,
        renterType: booking.renterType,
        bookingCode: booking.bookingCode
      } : null;
    }
    function getFirstName(fullName) {
      if (!fullName) return "N/A";
      const names = fullName.trim().split(" ");
      return names[0] || "N/A";
    }
    const selectedSlots = ref([]);
    function isSlotSelected(fieldId, startHour) {
      return selectedSlots.value.some(
        (s) => s.fieldId === fieldId && s.startHour === startHour && s.date === selectedDate.value
      );
    }
    function isSelectedDatePastOrToday() {
      if (!selectedDate.value) return false;
      const selected = new Date(selectedDate.value);
      selected.setHours(0, 0, 0, 0);
      const today = getTodayInWib();
      return selected <= today;
    }
    watch(() => selectedSlots.value.length, (newLength) => {
      if (newLength === 0) {
        selectedSlots.value = [];
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_PlaceholderImage = __nuxt_component_1;
      const _component_SmartDatePicker = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "w-full pb-16" }, _attrs))} data-v-56ebd091><header class="mx-auto flex max-w-7xl items-center justify-between pt-2 pb-4 sm:pt-1 sm:pb-6" data-v-56ebd091>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/bookings",
        class: "inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-all [@media(hover:hover)]:hover:bg-gray-50 [@media(hover:hover)]:hover:text-[#1f2a56] [@media(hover:hover)]:hover:border-[#1f2a56] [@media(hover:hover)]:hover:shadow-md active:scale-95"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-56ebd091${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" data-v-56ebd091${_scopeId}></path></svg><span data-v-56ebd091${_scopeId}>Kembali</span>`);
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
        _push(`<section class="text-center py-20" data-v-56ebd091><div class="inline-flex flex-col items-center gap-4" data-v-56ebd091><div class="w-12 h-12 border-4 border-gray-200 border-t-[#1f2a56] rounded-full animate-spin" data-v-56ebd091></div><p class="text-sm font-medium text-gray-600" data-v-56ebd091>Memuat detail stadion...</p></div></section>`);
      } else if (unref(error)) {
        _push(`<section class="mx-auto max-w-6xl py-12" data-v-56ebd091><div class="bg-red-50 border border-red-200 rounded-2xl p-6 text-center" data-v-56ebd091><div class="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-4" data-v-56ebd091><svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-56ebd091><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-v-56ebd091></path></svg></div><h3 class="text-lg font-semibold text-red-900 mb-2" data-v-56ebd091>Terjadi Kesalahan</h3><p class="text-sm text-red-700" data-v-56ebd091>${ssrInterpolate(unref(error).message)}</p></div></section>`);
      } else {
        _push(`<section class="mx-auto max-w-7xl space-y-4 sm:space-y-6 overflow-hidden" data-v-56ebd091><div class="grid gap-3 lg:grid-cols-[minmax(0,2.3fr)_minmax(320px,1fr)]" data-v-56ebd091><div class="relative overflow-hidden rounded-[32px] border border-gray-200/80 bg-white shadow-md" data-v-56ebd091><div class="relative aspect-[16/10] w-full overflow-hidden bg-gray-200 p-[1px] leading-[0]" data-v-56ebd091>`);
        if (unref(stadion)?.images && unref(stadion).images.length > 0) {
          _push(`<img${ssrRenderAttr("src", currentStadionImage.value)}${ssrRenderAttr("alt", unref(stadion)?.name)} class="absolute inset-[1px] h-[calc(100%-2px)] w-[calc(100%-2px)] object-cover block" data-v-56ebd091>`);
        } else {
          _push(`<div class="absolute inset-[1px] flex items-center justify-center bg-gray-100" data-v-56ebd091>`);
          _push(ssrRenderComponent(_component_PlaceholderImage, { text: "Foto Stadion Belum Ditambahkan" }, null, _parent));
          _push(`</div>`);
        }
        _push(`</div>`);
        if ((unref(stadion)?.images?.length || 0) > 1) {
          _push(`<button class="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-1.5 sm:p-2.5 text-gray-700 shadow-lg [@media(hover:hover)]:hover:bg-white [@media(hover:hover)]:hover:scale-110 transition-all backdrop-blur-sm active:scale-95" aria-label="Foto sebelumnya" data-v-56ebd091><svg class="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-56ebd091><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" data-v-56ebd091></path></svg></button>`);
        } else {
          _push(`<!---->`);
        }
        if ((unref(stadion)?.images?.length || 0) > 1) {
          _push(`<button class="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-1.5 sm:p-2.5 text-gray-700 shadow-lg [@media(hover:hover)]:hover:bg-white transition-all backdrop-blur-sm" aria-label="Foto berikutnya" data-v-56ebd091><svg class="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-56ebd091><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" data-v-56ebd091></path></svg></button>`);
        } else {
          _push(`<!---->`);
        }
        if ((unref(stadion)?.images?.length || 0) > 1) {
          _push(`<div class="absolute bottom-3 sm:bottom-4 left-0 right-0 flex justify-center gap-1.5 sm:gap-2" data-v-56ebd091><!--[-->`);
          ssrRenderList(unref(stadion)?.images, (img, idx) => {
            _push(`<button class="${ssrRenderClass([idx === stadionImageIndex.value ? "bg-white w-6 sm:w-8" : "bg-white/60 w-1.5 sm:w-2 [@media(hover:hover)]:hover:bg-white/80", "h-1.5 sm:h-2 rounded-full transition-all"])}"${ssrRenderAttr("aria-label", `Gambar ${idx + 1}`)} data-v-56ebd091></button>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(stadion)?.images && unref(stadion).images.length > 0) {
          _push(`<span class="absolute top-3 sm:top-4 right-3 sm:right-4 rounded-lg bg-black/75 backdrop-blur-sm px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold text-white" data-v-56ebd091>${ssrInterpolate(stadionImageIndex.value + 1)} / ${ssrInterpolate(unref(stadion).images.length)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="hidden lg:grid gap-3 grid-rows-2 h-full" data-v-56ebd091>`);
        if (unref(stadion)?.images && unref(stadion).images.length > 1) {
          _push(`<!--[-->`);
          ssrRenderList(unref(stadion)?.images?.slice(1, 3), (img, idx) => {
            _push(`<div class="relative w-full h-full overflow-hidden rounded-[24px] shadow-sm cursor-pointer transition-all duration-200 [@media(hover:hover)]:hover:opacity-80 [@media(hover:hover)]:hover:shadow-md [@media(hover:hover)]:hover:scale-[1.02]" data-v-56ebd091><img${ssrRenderAttr("src", img.imageUrl)}${ssrRenderAttr("alt", `${unref(stadion)?.name} preview ${idx + 1}`)} class="absolute inset-0 h-full w-full object-cover" data-v-56ebd091></div>`);
          });
          _push(`<!--]-->`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div><div class="space-y-4 sm:space-y-5 rounded-xl sm:rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm" data-v-56ebd091><div class="space-y-2 pb-3 sm:pb-4 border-b border-gray-100" data-v-56ebd091><h1 class="text-2xl sm:text-3xl font-bold text-gray-900" data-v-56ebd091>${ssrInterpolate(unref(stadion)?.name)}</h1></div><div class="space-y-4" data-v-56ebd091><div data-v-56ebd091><h2 class="text-sm sm:text-base font-semibold text-gray-900 mb-2 flex items-center gap-2" data-v-56ebd091><svg class="w-4 h-4 sm:w-5 sm:h-5 text-[#1f2a56]" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-56ebd091><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" data-v-56ebd091></path></svg> Deskripsi </h2>`);
        if (unref(stadion)?.description?.trim()) {
          _push(`<p class="text-xs sm:text-sm text-gray-600 whitespace-pre-line leading-relaxed" data-v-56ebd091>${ssrInterpolate(unref(stadion).description)}</p>`);
        } else {
          _push(`<p class="text-xs sm:text-sm text-gray-500 italic" data-v-56ebd091> Deskripsi belum tersedia. </p>`);
        }
        _push(`</div><div class="relative rounded-lg sm:rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-white p-3 sm:p-4 border border-gray-200" data-v-56ebd091><div class="absolute inset-0 opacity-[0.08] pointer-events-none" data-v-56ebd091><svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 300" preserveAspectRatio="xMidYMid slice" data-v-56ebd091><path d="M 0 150 Q 50 145, 100 150 Q 140 155, 180 150 Q 220 145, 260 140 Q 300 138, 350 140" stroke="#94a3b8" stroke-width="2.5" fill="none" data-v-56ebd091></path><path d="M 350 140 Q 400 142, 450 145 Q 500 148, 550 150 L 600 152" stroke="#94a3b8" stroke-width="2" fill="none" data-v-56ebd091></path><path d="M 180 0 Q 185 40, 180 80 Q 175 120, 180 150 Q 182 180, 185 220 Q 188 260, 190 300" stroke="#94a3b8" stroke-width="2.5" fill="none" data-v-56ebd091></path><path d="M 420 0 Q 415 50, 420 100 Q 425 130, 420 160 Q 418 200, 420 240 L 420 300" stroke="#94a3b8" stroke-width="2" fill="none" data-v-56ebd091></path><path d="M 0 80 Q 40 78, 80 80 Q 120 82, 160 85 Q 200 83, 240 80 Q 280 78, 320 80" stroke="#94a3b8" stroke-width="1.5" fill="none" data-v-56ebd091></path><path d="M 100 50 Q 102 70, 100 90 Q 98 120, 100 150 Q 102 180, 105 210" stroke="#94a3b8" stroke-width="1.5" fill="none" data-v-56ebd091></path><path d="M 0 220 Q 60 218, 120 220 Q 180 222, 240 220 Q 300 218, 360 220 Q 420 222, 480 220 L 600 218" stroke="#94a3b8" stroke-width="1.5" fill="none" data-v-56ebd091></path><path d="M 350 140 Q 360 120, 370 100 Q 380 85, 390 80" stroke="#94a3b8" stroke-width="1" fill="none" data-v-56ebd091></path><path d="M 260 80 Q 270 100, 280 120 Q 285 135, 280 150" stroke="#94a3b8" stroke-width="1" fill="none" data-v-56ebd091></path><path d="M 500 80 Q 490 110, 485 140 Q 483 170, 490 200" stroke="#94a3b8" stroke-width="1" fill="none" data-v-56ebd091></path><path d="M 300 220 Q 310 200, 320 180 Q 330 160, 340 145" stroke="#94a3b8" stroke-width="1" fill="none" data-v-56ebd091></path><circle cx="180" cy="150" r="3" fill="#3b82f6" opacity="0.7" data-v-56ebd091></circle><circle cx="350" cy="140" r="3" fill="#3b82f6" opacity="0.7" data-v-56ebd091></circle><circle cx="420" cy="160" r="3" fill="#3b82f6" opacity="0.7" data-v-56ebd091></circle><circle cx="180" cy="80" r="3" fill="#3b82f6" opacity="0.7" data-v-56ebd091></circle><circle cx="260" cy="140" r="3" fill="#3b82f6" opacity="0.7" data-v-56ebd091></circle><circle cx="100" cy="150" r="3" fill="#3b82f6" opacity="0.7" data-v-56ebd091></circle><circle cx="420" cy="100" r="3" fill="#3b82f6" opacity="0.7" data-v-56ebd091></circle><circle cx="240" cy="220" r="3" fill="#3b82f6" opacity="0.7" data-v-56ebd091></circle><circle cx="500" cy="145" r="3" fill="#3b82f6" opacity="0.7" data-v-56ebd091></circle><circle cx="100" cy="80" r="2.5" fill="#3b82f6" opacity="0.6" data-v-56ebd091></circle><circle cx="260" cy="80" r="2.5" fill="#3b82f6" opacity="0.6" data-v-56ebd091></circle><circle cx="320" cy="80" r="2.5" fill="#3b82f6" opacity="0.6" data-v-56ebd091></circle></svg></div><div class="relative z-10" data-v-56ebd091><p class="text-xs sm:text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2" data-v-56ebd091><svg class="w-4 h-4 text-[#3b82f6]" fill="currentColor" viewBox="0 0 24 24" data-v-56ebd091><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" data-v-56ebd091></path></svg><span data-v-56ebd091>Lokasi Venue</span></p><div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4" data-v-56ebd091><span class="text-xs sm:text-sm text-gray-600" data-v-56ebd091>${ssrInterpolate(unref(stadion)?.mapUrl || "Lokasi belum tersedia")}</span>`);
        if (unref(stadion)?.mapUrl) {
          _push(`<a${ssrRenderAttr("href", unref(stadion).mapUrl)} target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 text-sm font-semibold text-[#3b82f6] [@media(hover:hover)]:hover:text-[#2563eb] [@media(hover:hover)]:hover:underline transition-all whitespace-nowrap" data-v-56ebd091><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-56ebd091><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" data-v-56ebd091></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" data-v-56ebd091></path></svg><span data-v-56ebd091>Buka Peta</span></a>`);
        } else {
          _push(`<span class="text-xs sm:text-sm text-gray-400 whitespace-nowrap" data-v-56ebd091>Peta belum tersedia</span>`);
        }
        _push(`</div></div></div></div><div class="space-y-3 pt-2" data-v-56ebd091><h2 class="text-sm sm:text-base font-semibold text-gray-900 flex items-center gap-2" data-v-56ebd091><svg class="w-4 h-4 sm:w-5 sm:h-5 text-[#1f2a56]" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-56ebd091><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" data-v-56ebd091></path></svg> Fasilitas </h2>`);
        if (unref(stadion)?.facilities && unref(stadion).facilities.length > 0) {
          _push(`<ul class="grid gap-2 text-gray-700 sm:grid-cols-2" data-v-56ebd091><!--[-->`);
          ssrRenderList(unref(stadion)?.facilities, (facility) => {
            _push(`<li class="flex items-center gap-2 sm:gap-2.5 text-xs sm:text-sm bg-gray-50 rounded-lg px-2.5 sm:px-3 py-2 sm:py-2.5 border border-gray-100 [@media(hover:hover)]:hover:bg-white [@media(hover:hover)]:hover:border-gray-300 [@media(hover:hover)]:hover:shadow-sm [@media(hover:hover)]:hover:scale-[1.02] transition-all" data-v-56ebd091><div class="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg bg-gray-100 border border-gray-200 text-[#1f2a56]" data-v-56ebd091>`);
            if (facility.Facility.icon) {
              _push(ssrRenderComponent(unref(Icon), {
                icon: facility.Facility.icon,
                class: "h-3.5 w-3.5 sm:h-4 sm:w-4"
              }, null, _parent));
            } else {
              _push(`<span class="w-1.5 h-1.5 rounded-full bg-[#1f2a56]" data-v-56ebd091></span>`);
            }
            _push(`</div><span class="font-medium" data-v-56ebd091>${ssrInterpolate(facility.Facility.name)}</span></li>`);
          });
          _push(`<!--]--></ul>`);
        } else {
          _push(`<p class="text-xs sm:text-sm text-gray-500 italic" data-v-56ebd091> Belum ada fasilitas tersedia. </p>`);
        }
        _push(`</div></div><section class="rounded-xl sm:rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden" data-v-56ebd091><div class="flex flex-wrap items-center justify-between gap-3 sm:gap-4 border-b border-gray-200 bg-gray-50/50 px-4 sm:px-6 py-3 sm:py-4" data-v-56ebd091><div class="flex items-center gap-2 sm:gap-3" data-v-56ebd091><span class="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-[#1f2a56]" data-v-56ebd091></span><h3 class="text-base sm:text-lg font-bold text-gray-900 uppercase tracking-tight" data-v-56ebd091>Pilih Lapangan &amp; Jadwal</h3></div>`);
        _push(ssrRenderComponent(_component_SmartDatePicker, {
          modelValue: selectedDate.value,
          "onUpdate:modelValue": ($event) => selectedDate.value = $event,
          "allow-past-dates": true
        }, null, _parent));
        _push(`</div><div class="px-4 sm:px-6 py-3 sm:py-3.5 bg-white border-b border-gray-200" data-v-56ebd091><div class="flex items-center gap-2.5 sm:gap-3" data-v-56ebd091><div class="flex items-center gap-2 sm:gap-2.5 flex-1 min-w-0" data-v-56ebd091><div class="flex-shrink-0" data-v-56ebd091><svg class="w-5 h-5 sm:w-5.5 sm:h-5.5 text-[#1f2a56]" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-56ebd091><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" data-v-56ebd091></path></svg></div><div class="flex-1 min-w-0" data-v-56ebd091><p class="text-xs text-gray-500 font-medium" data-v-56ebd091>Tanggal Dipilih</p><p class="text-sm sm:text-base font-bold text-gray-900 truncate" data-v-56ebd091>${ssrInterpolate(new Date(selectedDate.value).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jakarta" }))}</p></div></div></div></div><div class="px-4 sm:px-6 py-4 sm:py-5 bg-gray-50/30 border-b border-gray-200" data-v-56ebd091><div class="flex flex-wrap items-center gap-2 sm:gap-2.5" data-v-56ebd091><!--[-->`);
        ssrRenderList(days.value.slice(0, 3), (day, index2) => {
          _push(`<button class="${ssrRenderClass([
            isDateEqual(selectedDate.value, day.value) ? "bg-[#1f2a56] text-white shadow border-[#1f2a56] [@media(hover:hover)]:hover:bg-[#162347]" : "bg-white text-gray-700 border-gray-200 [@media(hover:hover)]:hover:bg-gray-50 [@media(hover:hover)]:hover:border-gray-300",
            "rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold transition-all border"
          ])}" data-v-56ebd091>${ssrInterpolate(day.label)}</button>`);
        });
        _push(`<!--]--><!--[-->`);
        ssrRenderList(days.value.slice(3), (day, index2) => {
          _push(`<button class="${ssrRenderClass([
            isDateEqual(selectedDate.value, day.value) ? "bg-[#1f2a56] text-white shadow border-[#1f2a56] [@media(hover:hover)]:hover:bg-[#162347]" : "bg-white text-gray-700 border-gray-200 [@media(hover:hover)]:hover:bg-gray-50 [@media(hover:hover)]:hover:border-gray-300",
            "hidden sm:inline-flex rounded-xl px-4 py-2.5 text-sm font-semibold transition-all border"
          ])}" data-v-56ebd091>${ssrInterpolate(day.label)}</button>`);
        });
        _push(`<!--]--></div></div>`);
        if (bookingError.value) {
          _push(`<div class="px-4 sm:px-6 py-4 bg-yellow-50 border-b border-yellow-200" data-v-56ebd091><div class="flex items-start gap-3" data-v-56ebd091><svg class="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-56ebd091><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" data-v-56ebd091></path></svg><div class="flex-1" data-v-56ebd091><p class="text-sm font-semibold text-yellow-900" data-v-56ebd091>Gagal Memuat Data Booking</p><p class="text-xs text-yellow-700 mt-1" data-v-56ebd091>${ssrInterpolate(bookingError.value)}</p><button class="mt-2 text-xs font-semibold text-yellow-900 [@media(hover:hover)]:hover:text-yellow-700 underline" data-v-56ebd091> Coba Lagi </button></div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (!unref(stadion)?.fields || unref(stadion).fields.length === 0) {
          _push(`<div class="flex flex-col items-center justify-center py-16 px-4" data-v-56ebd091><div class="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center mb-6" data-v-56ebd091><svg class="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-56ebd091><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" data-v-56ebd091></path></svg></div><h3 class="text-xl font-bold text-gray-900 mb-2" data-v-56ebd091>Belum Ada Lapangan di Stadion Ini</h3><p class="text-sm text-gray-500 text-center max-w-md mb-6" data-v-56ebd091> Stadion ini belum memiliki lapangan. Silakan tambahkan lapangan terlebih dahulu untuk mulai menerima booking. </p>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/admin/fields/create?stadionId=${unref(stadionId)}`,
            class: "inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm [@media(hover:hover)]:hover:bg-blue-700 transition-all active:scale-95"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-56ebd091${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" data-v-56ebd091${_scopeId}></path></svg><span data-v-56ebd091${_scopeId}>Tambah Lapangan</span>`);
              } else {
                return [
                  (openBlock(), createBlock("svg", {
                    class: "w-4 h-4",
                    fill: "none",
                    stroke: "currentColor",
                    viewBox: "0 0 24 24"
                  }, [
                    createVNode("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      "stroke-width": "2",
                      d: "M12 4v16m8-8H4"
                    })
                  ])),
                  createVNode("span", null, "Tambah Lapangan")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--[-->`);
        ssrRenderList(unref(stadion)?.fields, (field) => {
          _push(`<div class="border-b border-gray-100 last:border-b-0" data-v-56ebd091><div class="p-4 sm:p-5" data-v-56ebd091><div class="flex flex-col gap-5 rounded-3xl border border-gray-200 p-5 lg:flex-row" data-v-56ebd091><div class="relative w-full overflow-hidden rounded-[28px] border border-white shadow lg:w-[420px] h-56" data-v-56ebd091>`);
          if (getFieldImageUrl(Number(field.id)) && !getFieldImageUrl(Number(field.id)).includes("placeholder")) {
            _push(`<img${ssrRenderAttr("src", getFieldImageUrl(Number(field.id)))}${ssrRenderAttr("alt", field.name)} class="absolute inset-0 h-full w-full object-cover transition-transform duration-500" data-v-56ebd091>`);
          } else {
            _push(`<div class="absolute inset-0 h-full w-full flex items-center justify-center bg-gray-100" data-v-56ebd091>`);
            _push(ssrRenderComponent(_component_PlaceholderImage, { text: "Foto Lapangan Belum Ditambahkan" }, null, _parent));
            _push(`</div>`);
          }
          if (field.gallery && field.gallery.length > 1) {
            _push(`<!--[--><button aria-label="Foto sebelumnya" class="absolute left-2 sm:left-2.5 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-1.5 sm:p-2 text-gray-700 [@media(hover:hover)]:hover:bg-white [@media(hover:hover)]:hover:scale-110 shadow-lg transition-all backdrop-blur-sm active:scale-95" data-v-56ebd091><svg class="h-3.5 w-3.5 sm:h-4 sm:w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-56ebd091><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" data-v-56ebd091></path></svg></button><button aria-label="Foto berikutnya" class="absolute right-2 sm:right-2.5 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-1.5 sm:p-2 text-gray-700 [@media(hover:hover)]:hover:bg-white [@media(hover:hover)]:hover:scale-110 shadow-lg transition-all backdrop-blur-sm active:scale-95" data-v-56ebd091><svg class="h-3.5 w-3.5 sm:h-4 sm:w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-56ebd091><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" data-v-56ebd091></path></svg></button><!--]-->`);
          } else {
            _push(`<!---->`);
          }
          if (field.gallery && field.gallery.length > 0) {
            _push(`<span class="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 rounded-lg bg-black/75 backdrop-blur-sm px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold text-white" data-v-56ebd091>${ssrInterpolate((fieldImageIndex.value[Number(field.id)] ?? 0) + 1)} / ${ssrInterpolate(field.gallery.length)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div class="flex-1 space-y-3 sm:space-y-4" data-v-56ebd091><div class="space-y-2" data-v-56ebd091><h4 class="text-lg sm:text-xl font-bold text-gray-900" data-v-56ebd091>${ssrInterpolate(field.name)}</h4><div class="flex items-center gap-2 flex-wrap" data-v-56ebd091>`);
          if (field.status !== "ACTIVE") {
            _push(`<span class="inline-flex items-center gap-1.5 rounded-lg px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs font-semibold border bg-amber-50 text-amber-700 border-amber-200" data-v-56ebd091><span class="w-1.5 h-1.5 rounded-full bg-amber-600" data-v-56ebd091></span> Maintenance </span>`);
          } else if (isFieldFullyBooked(field)) {
            _push(`<span class="inline-flex items-center gap-1.5 rounded-lg px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs font-semibold border bg-red-50 text-red-700 border-red-200" data-v-56ebd091><span class="w-1.5 h-1.5 rounded-full bg-red-600" data-v-56ebd091></span> Full Booked </span>`);
          } else {
            _push(`<!--[--><span class="inline-flex items-center gap-1.5 rounded-lg px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs font-semibold border bg-green-50 text-green-700 border-green-200" data-v-56ebd091><span class="relative flex h-1.5 w-1.5" data-v-56ebd091><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" data-v-56ebd091></span><span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-600" data-v-56ebd091></span></span> Ready </span>`);
            if (availableSlotsCount(field) > 0) {
              _push(`<span class="inline-flex items-center gap-1 rounded-lg px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs font-bold bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-sm" data-v-56ebd091><svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" data-v-56ebd091><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" data-v-56ebd091></path></svg> ${ssrInterpolate(availableSlotsCount(field))} Slot Tersedia </span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`<!--]-->`);
          }
          _push(`</div>`);
          if (field.description) {
            _push(`<p class="hidden sm:block text-sm text-gray-600 leading-relaxed" data-v-56ebd091>${ssrInterpolate(field.description)}</p>`);
          } else {
            _push(`<!---->`);
          }
          if (field.description) {
            _push(`<div class="block sm:hidden" data-v-56ebd091><p class="text-xs text-gray-600 leading-relaxed" data-v-56ebd091>${ssrInterpolate(truncatedFieldDescription(field.description, Number(field.id)))}`);
            if (!isFieldDescriptionExpanded(Number(field.id)) && needsFieldDescriptionTruncation(field.description)) {
              _push(`<span data-v-56ebd091>...</span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</p>`);
            if (needsFieldDescriptionTruncation(field.description)) {
              _push(`<button class="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-[#3b82f6] [@media(hover:hover)]:hover:text-[#2563eb] transition-colors active:text-[#2563eb]" data-v-56ebd091><span data-v-56ebd091>${ssrInterpolate(isFieldDescriptionExpanded(Number(field.id)) ? "Lebih Sedikit" : "Selengkapnya")}</span><svg class="${ssrRenderClass([isFieldDescriptionExpanded(Number(field.id)) ? "rotate-180" : "", "w-3 h-3 transition-transform duration-200"])}" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-56ebd091><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" data-v-56ebd091></path></svg></button>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><button class="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-[#1f2a56] px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white shadow [@media(hover:hover)]:hover:bg-[#162347] transition-all active:scale-95" data-v-56ebd091><svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-56ebd091><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" data-v-56ebd091></path></svg><span data-v-56ebd091>${ssrInterpolate(isFieldExpanded(Number(field.id)) ? "Sembunyikan Jadwal" : "Lihat Jadwal")}</span><svg class="${ssrRenderClass([isFieldExpanded(Number(field.id)) ? "rotate-180" : "", "h-3 w-3 transition-transform"])}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-56ebd091><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" data-v-56ebd091></path></svg></button></div></div>`);
          if (isFieldExpanded(Number(field.id))) {
            _push(`<div class="mt-4 sm:mt-5 grid gap-2 sm:gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5" data-v-56ebd091><!--[-->`);
            ssrRenderList(field.slots, (slot) => {
              _push(`<button type="button" class="${ssrRenderClass([[
                isSlotBooked(Number(field.id), Number(slot.start.split(":")[0])) ? "bg-blue-50 text-blue-600 border-blue-200 cursor-pointer [@media(hover:hover)]:hover:bg-blue-100 [@media(hover:hover)]:hover:border-blue-300" : field.status !== "ACTIVE" ? "bg-orange-50 text-orange-400 border-orange-100 cursor-not-allowed" : isSelectedDatePastOrToday() ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed opacity-70" : isSlotSelected(Number(field.id), Number(slot.start.split(":")[0])) ? "bg-[#1f2a56] text-white border-[#1f2a56] shadow-md ring-2 ring-[#1f2a56] ring-offset-2" : "bg-white text-gray-900 border-gray-200 [@media(hover:hover)]:hover:border-emerald-500 [@media(hover:hover)]:hover:bg-emerald-50 [@media(hover:hover)]:hover:shadow-lg [@media(hover:hover)]:hover:shadow-emerald-500/20 [@media(hover:hover)]:hover:scale-105 active:scale-100 cursor-pointer"
              ], "group relative rounded-lg sm:rounded-xl border p-2 sm:p-3 text-left shadow-sm transition-all overflow-hidden"])}" data-v-56ebd091>`);
              if (isSlotBooked(Number(field.id), Number(slot.start.split(":")[0]))) {
                _push(`<div class="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#1f2a56]/90 opacity-0 backdrop-blur-[2px] transition-all duration-300 [@media(hover:hover)]:group-hover:opacity-100" data-v-56ebd091><svg class="mb-1 h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-56ebd091><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" data-v-56ebd091></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" data-v-56ebd091></path></svg><span class="px-1 text-center text-[10px] font-bold text-white leading-tight" data-v-56ebd091> Lihat Detail Booking </span></div>`);
              } else {
                _push(`<!---->`);
              }
              if (isSlotBooked(Number(field.id), Number(slot.start.split(":")[0]))) {
                _push(`<div class="flex items-center justify-between mb-1 [@media(hover:hover)]:group-hover:opacity-0 transition-opacity" data-v-56ebd091><p class="text-[10px] sm:text-[0.65rem] font-bold text-blue-700 truncate flex-1 pr-1" data-v-56ebd091>${ssrInterpolate(getFirstName(getBookingInfo(Number(field.id), Number(slot.start.split(":")[0]))?.name))}</p><span class="${ssrRenderClass([getBookingInfo(Number(field.id), Number(slot.start.split(":")[0]))?.renterType === "AKADEMIK" ? "bg-blue-100 text-blue-700 border border-blue-200" : getBookingInfo(Number(field.id), Number(slot.start.split(":")[0]))?.renterType === "TENDIK" ? "bg-purple-100 text-purple-700 border border-purple-200" : "bg-gray-100 text-gray-700 border border-gray-200", "inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-semibold whitespace-nowrap"])}" data-v-56ebd091>`);
                if (getBookingInfo(Number(field.id), Number(slot.start.split(":")[0]))?.renterType === "AKADEMIK") {
                  _push(`<svg class="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="currentColor" viewBox="0 0 20 20" data-v-56ebd091><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" data-v-56ebd091></path></svg>`);
                } else if (getBookingInfo(Number(field.id), Number(slot.start.split(":")[0]))?.renterType === "TENDIK") {
                  _push(`<svg class="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-56ebd091><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" data-v-56ebd091></path></svg>`);
                } else {
                  _push(`<svg class="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="currentColor" viewBox="0 0 20 20" data-v-56ebd091><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" data-v-56ebd091></path></svg>`);
                }
                if (getBookingInfo(Number(field.id), Number(slot.start.split(":")[0]))?.renterType === "AKADEMIK") {
                  _push(`<span data-v-56ebd091>Akademik</span>`);
                } else if (getBookingInfo(Number(field.id), Number(slot.start.split(":")[0]))?.renterType === "TENDIK") {
                  _push(`<span data-v-56ebd091>Tendik</span>`);
                } else {
                  _push(`<span data-v-56ebd091>Umum</span>`);
                }
                _push(`</span></div>`);
              } else {
                _push(`<!---->`);
              }
              _push(`<p class="${ssrRenderClass([[
                isSlotBooked(Number(field.id), Number(slot.start.split(":")[0])) ? "text-blue-500 [@media(hover:hover)]:group-hover:opacity-0 transition-opacity" : field.status !== "ACTIVE" ? "text-orange-400" : isSelectedDatePastOrToday() ? "text-gray-400" : isSlotSelected(Number(field.id), Number(slot.start.split(":")[0])) ? "text-white/80" : "text-gray-500"
              ], "text-[10px] sm:text-[0.65rem] uppercase tracking-wide font-semibold"])}" data-v-56ebd091> 60 Menit </p><p class="${ssrRenderClass([[
                isSlotBooked(Number(field.id), Number(slot.start.split(":")[0])) ? "text-blue-700 [@media(hover:hover)]:group-hover:opacity-0 transition-opacity" : field.status !== "ACTIVE" ? "text-orange-600" : isSelectedDatePastOrToday() ? "text-gray-400" : isSlotSelected(Number(field.id), Number(slot.start.split(":")[0])) ? "text-white" : "text-[#1f2a56]"
              ], "text-sm sm:text-base font-bold mt-0.5"])}" data-v-56ebd091>${ssrInterpolate(slot.start)} - ${ssrInterpolate(slot.end)}</p><div class="flex items-center justify-between mt-1" data-v-56ebd091>`);
              if (isSlotBooked(Number(field.id), Number(slot.start.split(":")[0]))) {
                _push(`<p class="text-[10px] sm:text-xs font-semibold text-blue-600 [@media(hover:hover)]:group-hover:opacity-0 transition-opacity" data-v-56ebd091> Booked </p>`);
              } else if (field.status !== "ACTIVE") {
                _push(`<p class="text-[10px] sm:text-xs font-semibold text-orange-500" data-v-56ebd091> Maintenance </p>`);
              } else if (isSelectedDatePastOrToday()) {
                _push(`<p class="text-[10px] sm:text-xs font-semibold text-gray-400" data-v-56ebd091> Tidak Tersedia </p>`);
              } else {
                _push(`<p class="${ssrRenderClass([isSlotSelected(Number(field.id), Number(slot.start.split(":")[0])) ? "text-white" : "text-green-600", "text-[10px] sm:text-xs font-semibold"])}" data-v-56ebd091> Available </p>`);
              }
              if (isSlotSelected(Number(field.id), Number(slot.start.split(":")[0]))) {
                _push(`<svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20" data-v-56ebd091><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" data-v-56ebd091></path></svg>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</div></button>`);
            });
            _push(`<!--]--></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        });
        _push(`<!--]--></section></section>`);
      }
      if (selectedSlots.value.length > 0) {
        _push(`<div class="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white shadow-2xl backdrop-blur-sm lg:left-64" data-v-56ebd091><div class="mx-auto flex max-w-6xl items-center justify-between gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 w-full" data-v-56ebd091><div class="flex items-center gap-2 sm:gap-3" data-v-56ebd091><div class="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 bg-[#1f2a56] rounded-full" data-v-56ebd091><span class="text-sm sm:text-base font-bold text-white" data-v-56ebd091>${ssrInterpolate(selectedSlots.value.length)}</span></div><div data-v-56ebd091><p class="text-xs sm:text-sm font-semibold text-gray-900" data-v-56ebd091>${ssrInterpolate(selectedSlots.value.length)} Jadwal Dipilih</p><p class="text-[10px] sm:text-xs text-gray-500" data-v-56ebd091>Lanjutkan untuk membuat booking</p></div></div><div class="flex gap-2 sm:gap-2.5" data-v-56ebd091><button type="button" class="rounded-lg sm:rounded-xl border border-gray-300 bg-white px-3 sm:px-5 py-1.5 sm:py-2.5 text-xs sm:text-sm font-semibold text-gray-700 [@media(hover:hover)]:hover:bg-gray-50 [@media(hover:hover)]:hover:border-gray-400 transition-all active:scale-95" data-v-56ebd091> Batalkan </button><button type="button" class="inline-flex items-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl bg-[#1f2a56] px-3 sm:px-5 py-1.5 sm:py-2.5 text-xs sm:text-sm font-semibold text-white shadow [@media(hover:hover)]:hover:bg-[#162347] transition-all active:scale-95" data-v-56ebd091><span data-v-56ebd091>Lanjut</span><svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-56ebd091><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" data-v-56ebd091></path></svg></button></div></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/bookings/[id]/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-56ebd091"]]);

export { index as default };
//# sourceMappingURL=index-DYXggeHQ.mjs.map
