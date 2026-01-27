import { _ as __nuxt_component_0 } from './nuxt-link-DqM75kvd.mjs';
import { _ as __nuxt_component_1, a as __nuxt_component_2, p as parseBackendError } from './errorParser-CmxMsnXu.mjs';
import { _ as __nuxt_component_3 } from './WhatsAppFloatingButton-Crzgp58d.mjs';
import { defineComponent, withAsyncContext, ref, computed, watch, mergeProps, withCtx, createBlock, createVNode, openBlock, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderTeleport, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { Icon } from '@iconify/vue';
import { g as getNextNDays, a as toDateKey, t as toUtcMidnightIso } from './dateHelpers-jbKEnFTU.mjs';
import { _ as _export_sfc, a as useRoute, c as createError, b as useRouter, d as useState, u as useAppOptions } from './server.mjs';
import { u as useAsyncData } from './asyncData-BJ2gw_p3.mjs';
import { u as useHead } from './composables-D8u1NqZw.mjs';
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
import 'vue3-lottie';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "InfoModal",
  __ssrInlineRender: true,
  props: {
    modelValue: { type: Boolean, default: false },
    title: { type: String, default: "Cara Melakukan Booking" },
    message: { type: String, default: "" },
    showWhatsApp: { type: Boolean, default: true },
    stadiumName: { type: String, default: "" }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const { options } = useAppOptions();
    const phoneNumber = computed(() => options.value.data?.nohp || "+62 851 6566 0339");
    const cleanPhoneNumber = computed(() => {
      let phone = phoneNumber.value.replace(/[\s\-\(\)]/g, "");
      if (phone.startsWith("08")) {
        phone = "62" + phone.substring(1);
      }
      if (phone.startsWith("+")) {
        phone = phone.substring(1);
      }
      return phone;
    });
    const venueName = computed(() => options.value.data?.name || "VENUE UNDIP");
    const whatsappUrl = computed(() => {
      if (props.stadiumName) {
        const message2 = encodeURIComponent(`Halo, saya ingin bertanya mengenai booking lapangan di ${props.stadiumName}, ${venueName.value}.`);
        return `https://wa.me/${cleanPhoneNumber.value}?text=${message2}`;
      }
      const message = encodeURIComponent(`Halo, saya ingin bertanya mengenai booking lapangan di ${venueName.value}.`);
      return `https://wa.me/${cleanPhoneNumber.value}?text=${message}`;
    });
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(_push, (_push2) => {
        if (__props.modelValue) {
          _push2(`<div class="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md px-4" data-v-64a089a1><div class="relative max-w-lg w-full bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden" data-v-64a089a1><div class="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-3xl" data-v-64a089a1></div><div class="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-green-500/10 to-emerald-500/10 rounded-full blur-2xl" data-v-64a089a1></div><button class="absolute top-4 right-4 z-10 inline-flex items-center justify-center h-8 w-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-all duration-200 hover:scale-110" aria-label="Tutup modal" data-v-64a089a1><svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-64a089a1><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" data-v-64a089a1></path></svg></button><div class="relative p-6 sm:p-8" data-v-64a089a1><div class="text-center mb-6" data-v-64a089a1><div class="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-[#1f2a56] to-[#0f1a3c] shadow-lg shadow-[#1f2a56]/25 mb-4" data-v-64a089a1><svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-64a089a1><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" data-v-64a089a1></path></svg></div><h3 class="text-xl sm:text-2xl font-bold text-gray-900" data-v-64a089a1>${ssrInterpolate(__props.title)}</h3>`);
          if (__props.message) {
            _push2(`<p class="text-gray-600 text-sm mt-2 leading-relaxed" data-v-64a089a1>${__props.message ?? ""}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div><div class="space-y-3 mb-4" data-v-64a089a1>`);
          if (__props.showWhatsApp) {
            _push2(`<div class="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200" data-v-64a089a1><div class="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-white shadow-sm border border-green-200" data-v-64a089a1><svg class="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 24 24" data-v-64a089a1><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" data-v-64a089a1></path></svg></div><div class="flex-1" data-v-64a089a1><h4 class="font-semibold text-gray-900 text-sm" data-v-64a089a1>Hubungi Operator via WhatsApp</h4><p class="text-xs text-gray-600 mt-0.5" data-v-64a089a1>Tanyakan ketersediaan dan lakukan koordinasi booking dengan operator.</p></div></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<div class="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200" data-v-64a089a1><div class="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-white shadow-sm border border-gray-200" data-v-64a089a1><svg class="h-5 w-5 text-[#1f2a56]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-64a089a1><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" data-v-64a089a1></path><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" data-v-64a089a1></path></svg></div><div class="flex-1" data-v-64a089a1><h4 class="font-semibold text-gray-900 text-sm" data-v-64a089a1>Datang Langsung ke Venue</h4><p class="text-xs text-gray-600 mt-0.5" data-v-64a089a1>Kunjungi lokasi dan temui operator untuk melakukan booking secara langsung.</p></div></div></div><div class="flex flex-col sm:flex-row gap-3" data-v-64a089a1>`);
          if (__props.showWhatsApp) {
            _push2(`<a${ssrRenderAttr("href", whatsappUrl.value)} target="_blank" rel="noopener noreferrer" class="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#25D366] to-[#128C7E] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-green-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-0.5 active:translate-y-0" data-v-64a089a1><svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" data-v-64a089a1><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" data-v-64a089a1></path></svg> Hubungi Operator </a>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<button class="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1f2a56] to-[#0f1a3c] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#1f2a56]/20 transition-all duration-300 hover:shadow-xl hover:shadow-[#1f2a56]/30 hover:-translate-y-0.5 active:translate-y-0" data-v-64a089a1> Saya Mengerti <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" data-v-64a089a1><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" data-v-64a089a1></path></svg></button></div></div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/InfoModal.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const InfoModal = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$1, [["__scopeId", "data-v-64a089a1"]]), { __name: "InfoModal" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const fallbackOperatingHours = { open: 6, close: 22 };
    const padHour = (value) => value.toString().padStart(2, "0");
    const createFallbackVenue = () => ({
      id: 0,
      name: "Stadion Venue Undip",
      city: "Lokasi belum tersedia",
      sport: "Multi Sport",
      gallery: [],
      description: "Deskripsi belum tersedia.",
      location: "Lokasi belum tersedia",
      price: 0,
      facilities: [],
      scheduleDays: getNextNDays(null, 7, true),
      courts: [],
      mapUrl: void 0
    });
    const buildSlotsForField = (field, hours, renterType2 = "UMUM") => {
      const booked = new Set(
        (field?.bookingDetails ?? []).map((detail) => Number(detail?.startHour)).filter((val) => Number.isFinite(val))
      );
      const slots = [];
      const openHour = Number.isFinite(hours.open) ? hours.open : fallbackOperatingHours.open;
      const closeHour = Number.isFinite(hours.close) ? hours.close : fallbackOperatingHours.close;
      for (let hour = openHour; hour < closeHour; hour++) {
        const next = hour + 1;
        const startTime = `${padHour(hour)}:00`;
        const range = `${startTime} - ${padHour(next)}:00`;
        const isBooked = booked.has(hour);
        let price = 0;
        if (renterType2 === "AKADEMIK") {
          price = 0;
        } else if (renterType2 === "TENDIK" && field?.priceTendik) {
          price = field.priceTendik;
        } else {
          price = Number(field?.pricePerHour || 0);
        }
        slots.push({
          start: startTime,
          range,
          status: isBooked ? "Booked" : "Available",
          price: !isBooked ? price : void 0,
          highlight: !isBooked && hour === openHour
        });
      }
      return slots;
    };
    const mapFieldToCourt = (field, hours, renterType2) => {
      const rawImages = field?.images?.map((img) => img?.imageUrl).filter((url) => Boolean(url)) || [];
      return {
        id: Number(field?.id) || 0,
        name: field?.name ?? "Lapangan",
        surface: field?.description || "Permukaan belum tersedia",
        type: field?.type,
        status: field?.status === "ACTIVE" ? "Ready" : "Maintenance",
        image: rawImages[0] || "",
        gallery: rawImages,
        slots: buildSlotsForField(field, hours, renterType2)
      };
    };
    const buildVenueFromGraphQL = (stadion, renterType2 = "UMUM") => {
      const fallback = createFallbackVenue();
      if (!stadion) return fallback;
      const gallery = stadion.images?.map((img) => img?.imageUrl).filter((url) => Boolean(url)) || [];
      const facilities = stadion.facilities?.map((item) => ({
        name: item?.Facility?.name || "",
        icon: item?.Facility?.icon || void 0
      })).filter((fac) => Boolean(fac.name)) ?? [];
      const fields = Array.isArray(stadion.fields) ? stadion.fields : [];
      const prices = fields.map((field) => Number(field?.pricePerHour)).filter((val) => Number.isFinite(val) && val >= 0);
      const hours = {
        open: Number(stadion.operatingHours?.openHour ?? fallbackOperatingHours.open),
        close: Number(stadion.operatingHours?.closeHour ?? fallbackOperatingHours.close)
      };
      return {
        id: Number(stadion.id) || fallback.id,
        name: stadion.name ?? fallback.name,
        city: stadion.city ?? fallback.city,
        sport: fields.length ? "Multi Sport" : fallback.sport,
        gallery,
        description: stadion.description || fallback.description,
        location: stadion.location || fallback.location,
        price: prices.length ? Math.min(...prices) : fallback.price,
        facilities: facilities.length ? facilities : fallback.facilities,
        scheduleDays: getNextNDays(null, 7, true),
        courts: fields.length ? fields.map((field) => mapFieldToCourt(field, hours, renterType2)) : fallback.courts,
        mapUrl: stadion.mapUrl ?? void 0
      };
    };
    const route = useRoute();
    const stadionId = Number(route.params.id ?? 0);
    const { data: stadionData } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      `stadion-detail-${stadionId}`,
      () => $fetch(`/api/stadions/${stadionId}`)
    )), __temp = await __temp, __restore(), __temp);
    if (stadionData.value?.status === "INACTIVE") {
      throw createError({
        statusCode: 404,
        statusMessage: "Venue tidak tersedia",
        fatal: true
      });
    }
    const renterType = ref("UMUM");
    const venue = computed(() => buildVenueFromGraphQL(stadionData.value, renterType.value));
    useHead({
      title: computed(() => `${venue.value.name} - VENUE UNDIP`),
      meta: [
        { name: "description", content: computed(() => venue.value.description || `Booking lapangan di ${venue.value.name}`) },
        { property: "og:title", content: computed(() => `${venue.value.name} - VENUE UNDIP`) },
        { property: "og:description", content: computed(() => venue.value.description || `Booking lapangan di ${venue.value.name}`) },
        { property: "og:image", content: computed(() => venue.value.gallery[0] || "") },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: computed(() => `${venue.value.name} - VENUE UNDIP`) },
        { name: "twitter:description", content: computed(() => venue.value.description || `Booking lapangan di ${venue.value.name}`) },
        { name: "twitter:image", content: computed(() => venue.value.gallery[0] || "") }
      ]
    });
    const activeGalleryIndex = ref(0);
    computed(() => venue.value?.gallery?.length ?? 0);
    watch(venue, () => {
      activeGalleryIndex.value = 0;
    });
    ref(null);
    ref({});
    const selectedDate = ref(getNextNDays(null, 7, true)[0]?.value ?? "");
    const expandedCourts = ref({});
    const courtImageIndices = ref({});
    const selectedSlots = ref([]);
    const isDrawerOpen = ref(false);
    const isInfoModalOpen = ref(false);
    useRouter();
    useState("booking-cart", () => ({
      stadionId: null,
      stadionName: "",
      slots: []
    }));
    const selectedDayIndex = computed(() => {
      const index = venue.value?.scheduleDays.findIndex((day) => day.value === selectedDate.value) ?? -1;
      return index >= 0 ? index : 0;
    });
    const selectedDayLabel = computed(() => venue.value?.scheduleDays[selectedDayIndex.value]?.label ?? "");
    const selectedDayKey = computed(() => toDateKey(selectedDate.value));
    const fullSelectedDateLabel = computed(() => {
      if (!selectedDate.value) return "";
      const date = new Date(selectedDate.value);
      return new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Jakarta"
      }).format(date);
    });
    computed(() => selectedSlots.value.length);
    const slotKey = (courtId, range) => `${courtId}-${range}-${selectedDayKey.value ?? "none"}`;
    const isSlotSelected = (courtId, range) => selectedSlots.value.some((slot) => slot.key === slotKey(courtId, range));
    const getCourtImageUrl = (court) => {
      const index = courtImageIndices.value[court.id] ?? 0;
      return court.gallery[index] || court.image;
    };
    const isCourtExpanded = (courtId) => expandedCourts.value[courtId] ?? false;
    const isDateEqual = (date1, date2) => {
      return toDateKey(date1) === toDateKey(date2);
    };
    const availableCountWithServer = (court) => {
      return court.slots.filter((slot) => {
        const startHour = Number(slot.start.split(":")[0]);
        const isBooked = slot.status === "Booked" || isSlotBookedFromServer(court.id, Number.isNaN(startHour) ? 0 : startHour);
        return !isBooked;
      }).length;
    };
    const isCourtFullyBooked = (court) => {
      return court.slots.every((slot) => {
        const startHour = Number(slot.start.split(":")[0]);
        return slot.status === "Booked" || isSlotBookedFromServer(court.id, Number.isNaN(startHour) ? 0 : startHour);
      });
    };
    const publicBookings = ref([]);
    const loadPublicBookings = async () => {
      if (!stadionId || !selectedDayKey.value) {
        publicBookings.value = [];
        return;
      }
      try {
        publicBookings.value = await $fetch("/api/public-bookings", {
          query: { stadionId, date: toUtcMidnightIso(selectedDayKey.value) }
        });
      } catch (error) {
        const parsed = parseBackendError(error);
        console.error("Failed to load bookings:", parsed.message);
        publicBookings.value = [];
      }
    };
    watch(selectedDayKey, () => loadPublicBookings());
    const isSlotBookedFromServer = (fieldId, startHour) => {
      if (!publicBookings.value || !selectedDayKey.value) return false;
      return publicBookings.value.some(
        (booking) => booking.details?.some(
          (detail) => detail.fieldId === fieldId && toDateKey(detail.bookingDate) === selectedDayKey.value && detail.startHour === startHour
        )
      );
    };
    watch(selectedDate, () => {
      selectedSlots.value = [];
      isDrawerOpen.value = false;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_PlaceholderImage = __nuxt_component_1;
      const _component_SmartDatePicker = __nuxt_component_2;
      const _component_ClientWhatsAppFloatingButton = __nuxt_component_3;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-[#f5f7fb]" }, _attrs))} data-v-b242e861><div class="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 py-4 sm:py-6" data-v-b242e861>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:text-[#1f2a56] hover:border-[#1f2a56] hover:shadow-md active:scale-95",
        "aria-label": "Kembali ke halaman utama"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-b242e861${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" data-v-b242e861${_scopeId}></path></svg><span data-v-b242e861${_scopeId}>Kembali</span>`);
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
      _push(`</div><section class="mx-auto max-w-6xl space-y-4 sm:space-y-6 px-4 sm:px-6" data-v-b242e861><div class="grid gap-3 lg:grid-cols-[minmax(0,2.3fr)_minmax(320px,1fr)]" data-v-b242e861><div class="relative overflow-hidden rounded-[32px] border border-white/70 bg-white shadow-md" data-v-b242e861>`);
      if (venue.value?.gallery && venue.value.gallery.length > 0) {
        _push(`<img${ssrRenderAttr("src", venue.value?.gallery[activeGalleryIndex.value])}${ssrRenderAttr("alt", venue.value?.name)} loading="lazy" decoding="async" class="aspect-[16/9] w-full object-cover" data-v-b242e861>`);
      } else {
        _push(`<div class="aspect-[16/9] w-full flex items-center justify-center bg-gray-100" data-v-b242e861>`);
        _push(ssrRenderComponent(_component_PlaceholderImage, { text: "Foto Stadion Belum Ditambahkan" }, null, _parent));
        _push(`</div>`);
      }
      if ((venue.value?.gallery?.length || 0) > 1) {
        _push(`<button class="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-1.5 sm:p-2.5 text-gray-700 shadow-lg hover:bg-white hover:scale-110 transition-all backdrop-blur-sm active:scale-95" aria-label="Foto sebelumnya" data-v-b242e861><svg class="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-b242e861><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" data-v-b242e861></path></svg></button>`);
      } else {
        _push(`<!---->`);
      }
      if ((venue.value?.gallery?.length || 0) > 1) {
        _push(`<button class="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-1.5 sm:p-2.5 text-gray-700 shadow-lg hover:bg-white hover:scale-110 transition-all backdrop-blur-sm active:scale-95" aria-label="Foto berikutnya" data-v-b242e861><svg class="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-b242e861><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" data-v-b242e861></path></svg></button>`);
      } else {
        _push(`<!---->`);
      }
      if ((venue.value?.gallery?.length || 0) > 1) {
        _push(`<div class="absolute bottom-3 sm:bottom-4 left-0 right-0 flex justify-center gap-1.5 sm:gap-2" data-v-b242e861><!--[-->`);
        ssrRenderList(venue.value?.gallery, (img, idx) => {
          _push(`<button class="${ssrRenderClass([idx === activeGalleryIndex.value ? "bg-white w-6 sm:w-8" : "bg-white/60 w-1.5 sm:w-2 hover:bg-white/80", "h-1.5 sm:h-2 rounded-full transition-all"])}"${ssrRenderAttr("aria-label", `Lihat gambar ${idx + 1} dari ${venue.value.gallery.length}`)}${ssrRenderAttr("aria-current", idx === activeGalleryIndex.value)} data-v-b242e861></button>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      if (venue.value?.gallery && venue.value.gallery.length > 0) {
        _push(`<span class="absolute top-3 sm:top-4 right-3 sm:right-4 rounded-lg bg-black/75 backdrop-blur-sm px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold text-white" data-v-b242e861>${ssrInterpolate(activeGalleryIndex.value + 1)} / ${ssrInterpolate(venue.value.gallery.length)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="hidden lg:grid gap-3 grid-rows-2 h-full" data-v-b242e861>`);
      if (venue.value?.gallery && venue.value.gallery.length > 1) {
        _push(`<!--[-->`);
        ssrRenderList(venue.value?.gallery?.slice(1, 3), (img, idx) => {
          _push(`<div class="relative w-full h-full overflow-hidden rounded-[24px] shadow-sm cursor-pointer transition-all hover:opacity-80 hover:shadow-md hover:scale-[1.02]" data-v-b242e861><img${ssrRenderAttr("src", img)}${ssrRenderAttr("alt", `${venue.value?.name} preview ${idx + 1}`)} loading="lazy" decoding="async" class="absolute inset-0 h-full w-full object-cover" data-v-b242e861></div>`);
        });
        _push(`<!--]-->`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="space-y-4 sm:space-y-5 rounded-xl sm:rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm" data-v-b242e861><div class="space-y-2 pb-3 sm:pb-4 border-b border-gray-100" data-v-b242e861><h1 class="text-2xl sm:text-3xl font-bold text-gray-900" data-v-b242e861>${ssrInterpolate(venue.value.name)}</h1></div><div class="space-y-4" data-v-b242e861><div data-v-b242e861><h2 class="text-sm sm:text-base font-semibold text-gray-900 mb-2 flex items-center gap-2" data-v-b242e861><svg class="w-4 h-4 sm:w-5 sm:h-5 text-[#1f2a56]" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-b242e861><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" data-v-b242e861></path></svg> Deskripsi </h2><p class="text-xs sm:text-sm text-gray-600 whitespace-pre-line leading-relaxed" data-v-b242e861>${ssrInterpolate(venue.value.description || "Belum ada deskripsi.")}</p></div><div class="relative rounded-lg sm:rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-white p-3 sm:p-4 border border-gray-200" data-v-b242e861><div class="absolute inset-0 opacity-[0.08] pointer-events-none" data-v-b242e861><svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 300" preserveAspectRatio="xMidYMid slice" data-v-b242e861><path d="M 0 150 Q 50 145, 100 150 Q 140 155, 180 150 Q 220 145, 260 140 Q 300 138, 350 140" stroke="#94a3b8" stroke-width="2.5" fill="none" data-v-b242e861></path><path d="M 350 140 Q 400 142, 450 145 Q 500 148, 550 150 L 600 152" stroke="#94a3b8" stroke-width="2" fill="none" data-v-b242e861></path><path d="M 180 0 Q 185 40, 180 80 Q 175 120, 180 150 Q 182 180, 185 220 Q 188 260, 190 300" stroke="#94a3b8" stroke-width="2.5" fill="none" data-v-b242e861></path><path d="M 420 0 Q 415 50, 420 100 Q 425 130, 420 160 Q 418 200, 420 240 L 420 300" stroke="#94a3b8" stroke-width="2" fill="none" data-v-b242e861></path><path d="M 0 80 Q 40 78, 80 80 Q 120 82, 160 85 Q 200 83, 240 80 Q 280 78, 320 80" stroke="#94a3b8" stroke-width="1.5" fill="none" data-v-b242e861></path><path d="M 100 50 Q 102 70, 100 90 Q 98 120, 100 150 Q 102 180, 105 210" stroke="#94a3b8" stroke-width="1.5" fill="none" data-v-b242e861></path><path d="M 0 220 Q 60 218, 120 220 Q 180 222, 240 220 Q 300 218, 360 220 Q 420 222, 480 220 L 600 218" stroke="#94a3b8" stroke-width="1.5" fill="none" data-v-b242e861></path><path d="M 350 140 Q 360 120, 370 100 Q 380 85, 390 80" stroke="#94a3b8" stroke-width="1" fill="none" data-v-b242e861></path><path d="M 260 80 Q 270 100, 280 120 Q 285 135, 280 150" stroke="#94a3b8" stroke-width="1" fill="none" data-v-b242e861></path><path d="M 500 80 Q 490 110, 485 140 Q 483 170, 490 200" stroke="#94a3b8" stroke-width="1" fill="none" data-v-b242e861></path><path d="M 300 220 Q 310 200, 320 180 Q 330 160, 340 145" stroke="#94a3b8" stroke-width="1" fill="none" data-v-b242e861></path><circle cx="180" cy="150" r="3" fill="#3b82f6" opacity="0.7" data-v-b242e861></circle><circle cx="350" cy="140" r="3" fill="#3b82f6" opacity="0.7" data-v-b242e861></circle><circle cx="420" cy="160" r="3" fill="#3b82f6" opacity="0.7" data-v-b242e861></circle><circle cx="180" cy="80" r="3" fill="#3b82f6" opacity="0.7" data-v-b242e861></circle><circle cx="260" cy="140" r="3" fill="#3b82f6" opacity="0.7" data-v-b242e861></circle><circle cx="100" cy="150" r="3" fill="#3b82f6" opacity="0.7" data-v-b242e861></circle><circle cx="420" cy="100" r="3" fill="#3b82f6" opacity="0.7" data-v-b242e861></circle><circle cx="240" cy="220" r="3" fill="#3b82f6" opacity="0.7" data-v-b242e861></circle><circle cx="500" cy="145" r="3" fill="#3b82f6" opacity="0.7" data-v-b242e861></circle><circle cx="100" cy="80" r="2.5" fill="#3b82f6" opacity="0.6" data-v-b242e861></circle><circle cx="260" cy="80" r="2.5" fill="#3b82f6" opacity="0.6" data-v-b242e861></circle><circle cx="320" cy="80" r="2.5" fill="#3b82f6" opacity="0.6" data-v-b242e861></circle></svg></div><div class="relative z-10" data-v-b242e861><p class="text-xs sm:text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2" data-v-b242e861><svg class="w-4 h-4 text-[#3b82f6]" fill="currentColor" viewBox="0 0 24 24" data-v-b242e861><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" data-v-b242e861></path></svg><span data-v-b242e861>Lokasi Venue</span></p><div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4" data-v-b242e861><span class="text-xs sm:text-sm text-gray-600" data-v-b242e861>${ssrInterpolate(venue.value.mapUrl || "Lokasi belum tersedia")}</span>`);
      if (venue.value.mapUrl) {
        _push(`<a${ssrRenderAttr("href", venue.value.mapUrl)} target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 text-sm font-semibold text-[#3b82f6] hover:text-[#2563eb] hover:underline transition-all whitespace-nowrap" data-v-b242e861><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-b242e861><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" data-v-b242e861></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" data-v-b242e861></path></svg><span data-v-b242e861>Buka Peta</span></a>`);
      } else {
        _push(`<span class="text-xs sm:text-sm text-gray-400 whitespace-nowrap" data-v-b242e861>Peta belum tersedia</span>`);
      }
      _push(`</div></div></div></div><div class="space-y-3 pt-2" data-v-b242e861><h2 class="text-sm sm:text-base font-semibold text-gray-900 flex items-center gap-2" data-v-b242e861><svg class="w-4 h-4 sm:w-5 sm:h-5 text-[#1f2a56]" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-b242e861><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" data-v-b242e861></path></svg> Fasilitas </h2><ul class="grid gap-2 text-gray-700 sm:grid-cols-2" data-v-b242e861><!--[-->`);
      ssrRenderList(venue.value.facilities, (facility, index) => {
        _push(`<li class="flex items-center gap-2 sm:gap-2.5 text-xs sm:text-sm bg-gray-50 rounded-lg px-2.5 sm:px-3 py-2 sm:py-2.5 border border-gray-100 [@media(hover:hover)]:hover:bg-white [@media(hover:hover)]:hover:border-gray-300 [@media(hover:hover)]:hover:shadow-sm [@media(hover:hover)]:hover:scale-[1.02] transition-all" data-v-b242e861><div class="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg bg-gray-100 border border-gray-200 text-[#1f2a56]" data-v-b242e861>`);
        if (facility.icon) {
          _push(ssrRenderComponent(unref(Icon), {
            icon: facility.icon,
            class: "h-3.5 w-3.5 sm:h-4 sm:w-4"
          }, null, _parent));
        } else {
          _push(`<span class="w-1.5 h-1.5 rounded-full bg-[#1f2a56]" data-v-b242e861></span>`);
        }
        _push(`</div><span class="font-medium" data-v-b242e861>${ssrInterpolate(facility.name || facility)}</span></li>`);
      });
      _push(`<!--]--></ul></div></div><section class="rounded-xl sm:rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden" data-v-b242e861><div class="flex flex-wrap items-center justify-between gap-3 sm:gap-4 border-b border-gray-200 bg-gray-50/50 px-4 sm:px-6 py-3 sm:py-4" data-v-b242e861><div class="flex items-center gap-2 sm:gap-3" data-v-b242e861><span class="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-[#1f2a56]" data-v-b242e861></span><h3 class="text-base sm:text-lg font-bold text-gray-900 uppercase tracking-tight" data-v-b242e861>Pilih Lapangan &amp; Jadwal</h3></div>`);
      _push(ssrRenderComponent(_component_SmartDatePicker, {
        modelValue: selectedDate.value,
        "onUpdate:modelValue": ($event) => selectedDate.value = $event,
        "allow-past-dates": false
      }, null, _parent));
      _push(`</div><div class="px-4 sm:px-6 py-3 sm:py-3.5 bg-white border-b border-gray-200" data-v-b242e861><div class="flex items-center gap-2.5 sm:gap-3" data-v-b242e861><div class="flex items-center gap-2 sm:gap-2.5 flex-1 min-w-0" data-v-b242e861><div class="flex-shrink-0" data-v-b242e861><svg class="w-5 h-5 sm:w-5.5 sm:h-5.5 text-[#1f2a56]" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-b242e861><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" data-v-b242e861></path></svg></div><div class="flex-1 min-w-0" data-v-b242e861><p class="text-xs text-gray-500 font-medium" data-v-b242e861>Tanggal Dipilih</p><p class="text-sm sm:text-base font-bold text-gray-900 truncate" data-v-b242e861>${ssrInterpolate(fullSelectedDateLabel.value)}</p></div></div></div></div><div class="px-4 sm:px-6 py-4 sm:py-5 bg-gray-50/30 border-b border-gray-200" data-v-b242e861><div class="flex flex-wrap items-center gap-2 sm:gap-2.5" data-v-b242e861><!--[-->`);
      ssrRenderList(venue.value?.scheduleDays.slice(0, 3), (day, index) => {
        _push(`<button class="${ssrRenderClass([
          isDateEqual(selectedDate.value, day.value) ? "bg-[#1f2a56] text-white shadow border-[#1f2a56] hover:bg-[#162347]" : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300",
          "rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold transition-all border"
        ])}" data-v-b242e861>${ssrInterpolate(day.label)}</button>`);
      });
      _push(`<!--]--><!--[-->`);
      ssrRenderList(venue.value?.scheduleDays.slice(3), (day, index) => {
        _push(`<button class="${ssrRenderClass([
          isDateEqual(selectedDate.value, day.value) ? "bg-[#1f2a56] text-white shadow border-[#1f2a56] hover:bg-[#162347]" : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300",
          "hidden sm:inline-flex rounded-xl px-4 py-2.5 text-sm font-semibold transition-all border"
        ])}" data-v-b242e861>${ssrInterpolate(day.label)}</button>`);
      });
      _push(`<!--]--></div></div>`);
      if (!venue.value?.courts || venue.value.courts.length === 0) {
        _push(`<div class="flex flex-col items-center justify-center py-16 px-4" data-v-b242e861><div class="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6" data-v-b242e861><svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-b242e861><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" data-v-b242e861></path></svg></div><h3 class="text-xl font-bold text-gray-900 mb-2" data-v-b242e861>Belum Ada Lapangan Tersedia</h3><p class="text-sm text-gray-500 text-center max-w-md mb-6" data-v-b242e861> Saat ini venue belum memiliki lapangan yang dapat dibooking. Silakan hubungi pengelola untuk informasi lebih lanjut. </p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/",
          class: "inline-flex items-center gap-2 rounded-xl bg-[#1f2a56] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#162347] transition-all active:scale-95"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-b242e861${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" data-v-b242e861${_scopeId}></path></svg><span data-v-b242e861${_scopeId}>Kembali ke Beranda</span>`);
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
                    d: "M15 19l-7-7 7-7"
                  })
                ])),
                createVNode("span", null, "Kembali ke Beranda")
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
      ssrRenderList(venue.value?.courts, (court) => {
        _push(`<div class="border-b border-gray-100 last:border-b-0" data-v-b242e861><div class="p-4 sm:p-5" data-v-b242e861><div class="flex flex-col gap-5 rounded-3xl border border-gray-200 p-5 lg:flex-row" data-v-b242e861><div class="relative w-full overflow-hidden rounded-[28px] border border-white shadow lg:w-[420px]" data-v-b242e861>`);
        if (getCourtImageUrl(court) && !getCourtImageUrl(court).includes("placeholder")) {
          _push(`<img${ssrRenderAttr("src", getCourtImageUrl(court))}${ssrRenderAttr("alt", court.name)} loading="lazy" decoding="async" class="h-56 w-full object-cover transition-transform duration-500" data-v-b242e861>`);
        } else {
          _push(`<div class="h-56 w-full flex items-center justify-center bg-gray-100" data-v-b242e861>`);
          _push(ssrRenderComponent(_component_PlaceholderImage, { text: "Foto Lapangan Belum Ditambahkan" }, null, _parent));
          _push(`</div>`);
        }
        if (court.gallery && court.gallery.length > 1) {
          _push(`<!--[--><button aria-label="Foto sebelumnya" class="absolute left-2 sm:left-2.5 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-1.5 sm:p-2 text-gray-700 hover:bg-white hover:scale-110 shadow-lg transition-all backdrop-blur-sm active:scale-95" data-v-b242e861><svg class="h-3.5 w-3.5 sm:h-4 sm:w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-b242e861><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" data-v-b242e861></path></svg></button><button aria-label="Foto berikutnya" class="absolute right-2 sm:right-2.5 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-1.5 sm:p-2 text-gray-700 hover:bg-white hover:scale-110 shadow-lg transition-all backdrop-blur-sm active:scale-95" data-v-b242e861><svg class="h-3.5 w-3.5 sm:h-4 sm:w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-b242e861><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" data-v-b242e861></path></svg></button><!--]-->`);
        } else {
          _push(`<!---->`);
        }
        if (court.gallery && court.gallery.length > 0) {
          _push(`<span class="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 rounded-lg bg-black/75 backdrop-blur-sm px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold text-white" data-v-b242e861>${ssrInterpolate((courtImageIndices.value[court.id] ?? 0) + 1)} / ${ssrInterpolate(court.gallery.length)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="flex-1 space-y-3 sm:space-y-4" data-v-b242e861><div class="space-y-2" data-v-b242e861><h4 class="text-lg sm:text-xl font-bold text-gray-900" data-v-b242e861>${ssrInterpolate(court.name)}</h4><div class="flex items-center gap-2 flex-wrap" data-v-b242e861>`);
        if (court.status !== "Ready") {
          _push(`<span class="inline-flex items-center gap-1.5 rounded-lg px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs font-semibold border bg-amber-50 text-amber-700 border-amber-200" data-v-b242e861><span class="w-1.5 h-1.5 rounded-full bg-amber-600" data-v-b242e861></span> Maintenance </span>`);
        } else if (isCourtFullyBooked(court)) {
          _push(`<span class="inline-flex items-center gap-1.5 rounded-lg px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs font-semibold border bg-red-50 text-red-700 border-red-200" data-v-b242e861><span class="w-1.5 h-1.5 rounded-full bg-red-600" data-v-b242e861></span> Full Booked </span>`);
        } else {
          _push(`<!--[--><span class="inline-flex items-center gap-1.5 rounded-lg px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs font-semibold border bg-green-50 text-green-700 border-green-200" data-v-b242e861><span class="relative flex h-1.5 w-1.5" data-v-b242e861><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" data-v-b242e861></span><span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-600" data-v-b242e861></span></span> Ready </span>`);
          if (availableCountWithServer(court) > 0) {
            _push(`<span class="inline-flex items-center gap-1 rounded-lg px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs font-bold bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-sm" data-v-b242e861><svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" data-v-b242e861><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" data-v-b242e861></path></svg> ${ssrInterpolate(availableCountWithServer(court))} Slot Tersedia </span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<!--]-->`);
        }
        _push(`</div><p class="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-2 sm:line-clamp-none" data-v-b242e861>${ssrInterpolate(court.surface || "Tidak ada deskripsi tersedia.")}</p></div><div class="flex flex-wrap items-center gap-2 sm:gap-3" data-v-b242e861><button class="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-[#1f2a56] px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white shadow hover:bg-[#162347] transition-all active:scale-95"${ssrRenderAttr("aria-expanded", isCourtExpanded(court.id))}${ssrRenderAttr("aria-controls", `court-schedule-${court.id}`)}${ssrRenderAttr("aria-label", `${isCourtExpanded(court.id) ? "Sembunyikan" : "Lihat"} jadwal ${court.name}`)} data-v-b242e861><svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-b242e861><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" data-v-b242e861></path></svg><span data-v-b242e861>${ssrInterpolate(isCourtExpanded(court.id) ? "Sembunyikan Jadwal" : "Lihat Jadwal")}</span><svg class="${ssrRenderClass([isCourtExpanded(court.id) ? "rotate-180" : "", "h-3 w-3 transition-transform"])}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-b242e861><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" data-v-b242e861></path></svg></button></div></div></div>`);
        if (isCourtExpanded(court.id)) {
          _push(`<div${ssrRenderAttr("id", `court-schedule-${court.id}`)} class="mt-4 sm:mt-5 grid gap-2 sm:gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6" role="region"${ssrRenderAttr("aria-label", `Jadwal untuk ${court.name}`)} data-v-b242e861><!--[-->`);
          ssrRenderList(court.slots, (slot) => {
            _push(`<button type="button"${ssrRenderAttr(
              "title",
              slot.status === "Booked" || isSlotBookedFromServer(court.id, Number(slot.start.split(":")[0])) ? "Slot ini sudah dibooking" : court.status === "Maintenance" ? "Lapangan sedang dalam perbaikan/maintenance" : "Klik untuk pilih slot ini"
            )}${ssrRenderAttr("aria-label", `Slot ${slot.range}, ${slot.status === "Booked" ? "sudah dibooking" : court.status === "Maintenance" ? "maintenance" : "tersedia"}`)}${ssrRenderAttr("aria-disabled", slot.status === "Booked" || court.status === "Maintenance" || isSlotBookedFromServer(court.id, Number(slot.start.split(":")[0])))} class="${ssrRenderClass([[
              slot.status === "Booked" || isSlotBookedFromServer(court.id, Number(slot.start.split(":")[0])) ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed" : court.status === "Maintenance" ? "bg-orange-50 text-orange-400 border-orange-100 cursor-not-allowed" : isSlotSelected(court.id, slot.range) ? "bg-[#1f2a56] text-white border-[#1f2a56] shadow-md ring-2 ring-[#1f2a56] ring-offset-2" : "bg-white text-gray-900 border-gray-200 [@media(hover:hover)]:hover:border-emerald-500 [@media(hover:hover)]:hover:bg-emerald-50 [@media(hover:hover)]:hover:shadow-lg [@media(hover:hover)]:hover:shadow-emerald-500/20 [@media(hover:hover)]:hover:scale-105 active:scale-100 cursor-pointer"
            ], "group relative rounded-lg sm:rounded-xl border p-2 sm:p-3 text-left shadow-sm transition-all overflow-hidden"])}" data-v-b242e861><p class="${ssrRenderClass([[
              slot.status === "Booked" || isSlotBookedFromServer(court.id, Number(slot.start.split(":")[0])) ? "text-gray-400" : court.status === "Maintenance" ? "text-orange-400" : isSlotSelected(court.id, slot.range) ? "text-white/80" : "text-gray-500"
            ], "text-[10px] sm:text-[0.65rem] uppercase tracking-wide font-semibold"])}" data-v-b242e861> 60 Menit </p><p class="${ssrRenderClass([[
              slot.status === "Booked" || isSlotBookedFromServer(court.id, Number(slot.start.split(":")[0])) ? "text-gray-500" : court.status === "Maintenance" ? "text-orange-600" : isSlotSelected(court.id, slot.range) ? "text-white" : "text-[#1f2a56]"
            ], "text-sm sm:text-base font-bold mt-0.5"])}" data-v-b242e861>${ssrInterpolate(slot.range)}</p><div class="flex items-center justify-between mt-1" data-v-b242e861>`);
            if (slot.status === "Booked" || isSlotBookedFromServer(court.id, Number(slot.start.split(":")[0]))) {
              _push(`<p class="text-[10px] sm:text-xs font-semibold text-gray-400" data-v-b242e861> Booked </p>`);
            } else if (court.status === "Maintenance") {
              _push(`<p class="text-[10px] sm:text-xs font-semibold text-orange-500" data-v-b242e861> Maintenance </p>`);
            } else {
              _push(`<p class="${ssrRenderClass([isSlotSelected(court.id, slot.range) ? "text-white" : "text-green-600", "text-[10px] sm:text-xs font-semibold"])}" data-v-b242e861> Available </p>`);
            }
            if (isSlotSelected(court.id, slot.range)) {
              _push(`<svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20" data-v-b242e861><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" data-v-b242e861></path></svg>`);
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
      _push(ssrRenderComponent(InfoModal, {
        modelValue: isInfoModalOpen.value,
        "onUpdate:modelValue": ($event) => isInfoModalOpen.value = $event,
        title: "Informasi",
        message: `Paltform ini digunakan untuk melihat sisa kuota booking. Untuk booking, silahkan hubungi operator atau datang langsung ke venue terkait.`,
        "stadium-name": venue.value.name
      }, null, _parent));
      ssrRenderTeleport(_push, (_push2) => {
        if (isDrawerOpen.value) {
          _push2(`<div class="fixed inset-0 z-40" data-v-b242e861><div class="absolute inset-0 bg-black/40" data-v-b242e861></div><div class="absolute inset-y-0 right-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl" data-v-b242e861><header class="flex items-center justify-between border-b border-gray-100 px-6 py-5" data-v-b242e861><div data-v-b242e861><p class="text-xs font-semibold uppercase tracking-[0.4em] text-[#1f2a56]" data-v-b242e861>Jadwal Dipilih</p><p class="text-sm text-gray-500" data-v-b242e861>${ssrInterpolate(selectedDayLabel.value)}</p></div><button class="text-gray-500 hover:text-gray-800" data-v-b242e861><span class="sr-only" data-v-b242e861>Tutup</span><svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" data-v-b242e861><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" data-v-b242e861></path></svg></button></header><section class="flex-1 overflow-y-auto px-6 py-4 space-y-4" data-v-b242e861>`);
          if (!selectedSlots.value.length) {
            _push2(`<p class="text-sm text-gray-500" data-v-b242e861> Belum ada jadwal yang dipilih. Silakan pilih slot tersedia. </p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<!--[-->`);
          ssrRenderList(selectedSlots.value, (item) => {
            _push2(`<article class="flex items-start justify-between rounded-xl border border-gray-200 bg-[#f4f6fc] px-4 py-3 text-sm text-[#1f2a56]" data-v-b242e861><div data-v-b242e861><p class="text-sm font-semibold" data-v-b242e861>${ssrInterpolate(item.courtName)}</p><p data-v-b242e861>${ssrInterpolate(item.dateLabel)} • ${ssrInterpolate(item.range)}</p><p class="mt-1 font-semibold" data-v-b242e861>Rp${ssrInterpolate(item.price.toLocaleString("id-ID"))}</p></div><button class="text-[#b91c1c] hover:text-red-700" data-v-b242e861><span class="sr-only" data-v-b242e861>Hapus slot</span><svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" data-v-b242e861><path stroke-linecap="round" stroke-linejoin="round" d="M6 7h12M10 11v6m4-6v6M9 7l.867-1.8A1 1 0 0 1 10.79 5h2.42a1 1 0 0 1 .923.2L15 7" data-v-b242e861></path><path stroke-linecap="round" stroke-linejoin="round" d="M7 7v11a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V7" data-v-b242e861></path></svg></button></article>`);
          });
          _push2(`<!--]--></section><footer class="border-t border-gray-100 px-6 py-4" data-v-b242e861><button type="button" class="w-full rounded-xl bg-[#1f2a56] px-4 py-3 text-sm font-semibold text-white shadow hover:bg-[#162347] disabled:cursor-not-allowed disabled:bg-gray-300"${ssrIncludeBooleanAttr(!selectedSlots.value.length) ? " disabled" : ""} data-v-b242e861> Selanjutnya </button></footer></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(ssrRenderComponent(_component_ClientWhatsAppFloatingButton, {
        "stadium-name": venue.value.name
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/venues/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _id_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-b242e861"]]);

export { _id_ as default };
//# sourceMappingURL=_id_-BRsGil-D.mjs.map
