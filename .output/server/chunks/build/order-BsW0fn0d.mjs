import { defineComponent, withAsyncContext, computed, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrRenderClass, ssrIncludeBooleanAttr, ssrLooseContain } from 'vue/server-renderer';
import { u as useHead } from './composables-BHx0r5C2.mjs';
import { u as useRouter, n as navigateTo, c as createError } from './server.mjs';
import { u as useState } from './state-_I5XcLqc.mjs';
import { u as useAsyncData } from './asyncData-DN5Vrwgx.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
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
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'vue-router';
import 'perfect-debounce';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "order",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    useHead({
      title: "Booking Lapangan - VENUE UNDIP",
      meta: [
        { name: "description", content: "Selesaikan booking lapangan olahraga Anda di VENUE UNDIP" }
      ]
    });
    useRouter();
    const bookingCart = useState("booking-cart", () => ({
      stadionId: null,
      stadionName: "",
      slots: []
    }));
    if (!bookingCart.value.stadionId || bookingCart.value.slots.length === 0) {
      [__temp, __restore] = withAsyncContext(() => navigateTo("/")), await __temp, __restore();
    }
    const stadionId = bookingCart.value.stadionId;
    const { data: stadion, pending, error: fetchError } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData(
      () => stadionId ? `booking-stadion-${stadionId}` : "",
      async () => {
        if (!stadionId) return null;
        return await $fetch(`/api/stadions/${stadionId}`);
      },
      { immediate: Boolean(stadionId) }
    )), __temp = await __temp, __restore(), __temp);
    if (fetchError.value) {
      throw createError({
        statusCode: 404,
        statusMessage: "Stadion tidak ditemukan",
        fatal: true
      });
    }
    const orderSlots = computed(() => bookingCart.value.slots);
    const totalPrice = computed(
      () => orderSlots.value.reduce((sum, slot) => sum + (slot.price || 0), 0)
    );
    const customerName = ref("");
    const customerContact = ref("");
    const customerEmail = ref("");
    const customerInstitution = ref("");
    const customerAcademic = ref(false);
    const bookingLoading = ref(false);
    const bookingError = ref(null);
    const bookingSuccess = ref(null);
    const customerSuratUrl = ref("");
    const errors = ref({
      name: "",
      contact: "",
      email: "",
      suratUrl: ""
    });
    const formatDateLong = (slotDate, label) => {
      try {
        const d = new Date(slotDate);
        if (Number.isNaN(d.getTime())) return label;
        return new Intl.DateTimeFormat("id-ID", {
          weekday: "long",
          day: "2-digit",
          month: "long",
          year: "numeric"
        }).format(d);
      } catch {
        return label;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-[#f5f7fb] pb-16" }, _attrs))}><div class="mx-auto grid max-w-6xl gap-6 px-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,1fr)]"><section class="space-y-6"><div class="rounded-3xl bg-white p-6 shadow-sm"><header class="mb-6"><p class="text-xs font-semibold uppercase tracking-widest text-gray-500">Detail Venue</p><h1 class="text-2xl font-bold text-[#1f2a56]">${ssrInterpolate(unref(stadion)?.name || unref(bookingCart).stadionName)}</h1>`);
      if (unref(stadion)?.mapUrl) {
        _push(`<p class="text-sm text-gray-500"><a${ssrRenderAttr("href", unref(stadion).mapUrl)} class="text-[#1f2a56] underline" target="_blank" rel="noopener"> Lihat lokasi di peta </a></p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</header><div class="space-y-4"><!--[-->`);
      ssrRenderList(orderSlots.value, (slot) => {
        _push(`<article class="flex items-center justify-between rounded-2xl border border-gray-200 px-4 py-3"><div><p class="text-sm font-semibold text-[#1f2a56]">${ssrInterpolate(slot.courtName)}</p><p class="text-sm text-gray-600">${ssrInterpolate(formatDateLong(slot.dateKey, slot.dateLabel))} • ${ssrInterpolate(slot.range)}</p><p class="text-base font-semibold text-[#1f2a56]"> Rp${ssrInterpolate(slot.price.toLocaleString("id-ID"))}</p></div><button class="text-red-500 hover:text-red-700"><span class="sr-only">Hapus slot</span><svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 7h12M10 11v6m4-6v6M9 7l.867-1.8A1 1 0 0 1 10.79 5h2.42a1 1 0 0 1 .923.2L15 7"></path><path stroke-linecap="round" stroke-linejoin="round" d="M7 7v11a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V7"></path></svg></button></article>`);
      });
      _push(`<!--]--></div><button class="mt-4 text-sm font-semibold text-[#1f2a56] hover:underline"> Tambah Jadwal </button></div></section><aside class="space-y-4"><div class="rounded-3xl bg-white p-4 shadow-sm"><p class="mb-3 font-semibold text-[#1f2a56]">Data Pemesan</p><div class="space-y-3 text-sm"><label class="block"><span class="text-gray-600">Nama Lengkap <span class="text-red-500">*</span></span><input${ssrRenderAttr("value", customerName.value)} type="text" placeholder="Masukkan nama lengkap" class="${ssrRenderClass([
        "mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 transition-colors",
        errors.value.name ? "border-red-500 focus:border-red-500 focus:ring-red-200 bg-red-50" : "border-gray-200 focus:border-[#1f2a56] focus:ring-[#1f2a56]/20"
      ])}">`);
      if (errors.value.name) {
        _push(`<p class="mt-1 text-xs text-red-600 flex items-center gap-1"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> ${ssrInterpolate(errors.value.name)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</label><label class="block"><span class="text-gray-600">Nomor Kontak <span class="text-red-500">*</span></span><input${ssrRenderAttr("value", customerContact.value)} type="tel" placeholder="Contoh: 081234567890" class="${ssrRenderClass([
        "mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 transition-colors",
        errors.value.contact ? "border-red-500 focus:border-red-500 focus:ring-red-200 bg-red-50" : "border-gray-200 focus:border-[#1f2a56] focus:ring-[#1f2a56]/20"
      ])}">`);
      if (errors.value.contact) {
        _push(`<p class="mt-1 text-xs text-red-600 flex items-center gap-1"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> ${ssrInterpolate(errors.value.contact)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</label><label class="block"><span class="text-gray-600">Email <span class="text-red-500">*</span></span><input${ssrRenderAttr("value", customerEmail.value)} type="email" placeholder="nama@email.com" class="${ssrRenderClass([
        "mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 transition-colors",
        errors.value.email ? "border-red-500 focus:border-red-500 focus:ring-red-200 bg-red-50" : "border-gray-200 focus:border-[#1f2a56] focus:ring-[#1f2a56]/20"
      ])}">`);
      if (errors.value.email) {
        _push(`<p class="mt-1 text-xs text-red-600 flex items-center gap-1"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> ${ssrInterpolate(errors.value.email)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</label><label class="block"><span class="text-gray-600">Instansi (opsional)</span><input${ssrRenderAttr("value", customerInstitution.value)} type="text" class="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 focus:border-[#1f2a56] focus:outline-none focus:ring-2 focus:ring-[#1f2a56]/20"></label><label class="inline-flex items-center gap-2 text-gray-600"><input${ssrIncludeBooleanAttr(Array.isArray(customerAcademic.value) ? ssrLooseContain(customerAcademic.value, null) : customerAcademic.value) ? " checked" : ""} type="checkbox" class="rounded border-gray-300 text-[#1f2a56] focus:ring-[#1f2a56]"> Pemesan berasal dari unit akademik </label>`);
      if (customerAcademic.value) {
        _push(`<label class="block"><span class="text-gray-600">URL Surat Pengantar <span class="text-gray-400">(opsional)</span></span><input${ssrRenderAttr("value", customerSuratUrl.value)} type="url" placeholder="https://contoh.com/surat.pdf" class="${ssrRenderClass([
          "mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 transition-colors",
          errors.value.suratUrl ? "border-red-500 focus:border-red-500 focus:ring-red-200 bg-red-50" : "border-gray-200 focus:border-[#1f2a56] focus:ring-[#1f2a56]/20"
        ])}">`);
        if (errors.value.suratUrl) {
          _push(`<p class="mt-1 text-xs text-red-600 flex items-center gap-1"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> ${ssrInterpolate(errors.value.suratUrl)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</label>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
      if (bookingError.value) {
        _push(`<div class="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">${ssrInterpolate(bookingError.value)}</div>`);
      } else if (bookingSuccess.value) {
        _push(`<div class="rounded-2xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">${ssrInterpolate(bookingSuccess.value)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="rounded-3xl bg-white p-4 shadow-sm"><div class="flex items-center justify-between"><p class="font-semibold text-[#1f2a56]">Gunakan Voucher</p><span class="text-gray-400">+</span></div></div><div class="rounded-3xl bg-white p-4 shadow-sm"><p class="mb-3 font-semibold text-[#1f2a56]">Rincian Biaya</p><div class="space-y-2 text-sm text-gray-600"><div class="flex items-center justify-between"><span>Biaya Sewa</span><span>Rp${ssrInterpolate(totalPrice.value.toLocaleString("id-ID"))}</span></div><div class="flex items-center justify-between"><span>Biaya Tambahan</span><span>Rp0</span></div></div><div class="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 text-sm font-semibold text-[#1f2a56]"><span>Total Bayar</span><span>Rp${ssrInterpolate(totalPrice.value.toLocaleString("id-ID"))}</span></div></div><div class="rounded-3xl bg-white p-4 shadow-sm"><p class="mb-2 font-semibold text-[#1f2a56]">Atur Pembayaran</p><p class="text-sm text-gray-600">Bayar Lunas</p><p class="text-base font-bold text-[#1f2a56]">Rp${ssrInterpolate(totalPrice.value.toLocaleString("id-ID"))}</p></div><div class="rounded-3xl bg-white p-4 shadow-sm"><p class="font-semibold text-[#1f2a56]">Kebijakan Reschedule &amp; Pembatalan</p><p class="mt-1 text-sm text-gray-500">Hubungi admin untuk informasi lebih lanjut.</p></div><button class="w-full rounded-xl bg-[#1f2a56] py-3 text-sm font-semibold text-white shadow hover:bg-[#162347] disabled:cursor-not-allowed disabled:bg-gray-400"${ssrIncludeBooleanAttr(unref(pending) || !orderSlots.value.length || bookingLoading.value) ? " disabled" : ""}>${ssrInterpolate(bookingLoading.value ? "Memproses..." : "Buat Booking")}</button></aside></div></main>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/booking/order.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=order-BsW0fn0d.mjs.map
