import { defineComponent, computed, withAsyncContext, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrRenderClass, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
import { u as useAppOptions, b as useRouter, d as useState, n as navigateTo, c as createError } from './server.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "order",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { options } = useAppOptions();
    computed(() => options.value.data?.name || "VENUE UNDIP");
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
    const renterType = ref("UMUM");
    const bookingLoading = ref(false);
    const bookingError = ref(null);
    const bookingSuccess = ref(null);
    const customerSuratUrl = ref("");
    const sptjmFile = ref(null);
    const errors = ref({
      name: "",
      contact: "",
      email: "",
      suratUrl: "",
      sptjm: ""
    });
    const displayPrice = computed(() => {
      if (renterType.value === "AKADEMIK") return 0;
      return totalPrice.value;
    });
    const needsInstitution = computed(() => renterType.value !== "UMUM");
    const needsSuratPengantar = computed(() => renterType.value !== "UMUM");
    const formatDateLong = (slotDate, label) => {
      try {
        const d = new Date(slotDate);
        if (Number.isNaN(d.getTime())) return label;
        return new Intl.DateTimeFormat("id-ID", {
          weekday: "long",
          day: "2-digit",
          month: "long",
          year: "numeric",
          timeZone: "Asia/Jakarta"
        }).format(d);
      } catch {
        return label;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-[#f5f7fb] pb-16" }, _attrs))}><div class="mx-auto grid max-w-7xl gap-6 px-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,1fr)]"><section class="space-y-6"><div class="rounded-3xl bg-white p-6 shadow-sm"><header class="mb-6"><p class="text-xs font-semibold uppercase tracking-widest text-gray-500">Detail Venue</p><h1 class="text-2xl font-bold text-[#1f2a56]">${ssrInterpolate(unref(stadion)?.name || unref(bookingCart).stadionName)}</h1>`);
      if (unref(stadion)?.mapUrl) {
        _push(`<p class="text-sm text-gray-500"><a${ssrRenderAttr("href", unref(stadion).mapUrl)} class="text-[#1f2a56] underline" target="_blank" rel="noopener"> Lihat lokasi di peta </a></p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</header><div class="space-y-4"><!--[-->`);
      ssrRenderList(orderSlots.value, (slot) => {
        _push(`<article class="flex items-center justify-between rounded-2xl border border-gray-200 px-4 py-3"><div><p class="text-sm font-semibold text-[#1f2a56]">${ssrInterpolate(slot.courtName)}</p><p class="text-sm text-gray-600">${ssrInterpolate(formatDateLong(slot.dateKey, slot.dateLabel))} • ${ssrInterpolate(slot.range)}</p><p class="text-base font-semibold text-[#1f2a56]"> Rp${ssrInterpolate(slot.price.toLocaleString("id-ID"))}</p></div><button class="text-red-500 [@media(hover:hover)]:hover:text-red-700 active:text-red-700"><span class="sr-only">Hapus slot</span><svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 7h12M10 11v6m4-6v6M9 7l.867-1.8A1 1 0 0 1 10.79 5h2.42a1 1 0 0 1 .923.2L15 7"></path><path stroke-linecap="round" stroke-linejoin="round" d="M7 7v11a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V7"></path></svg></button></article>`);
      });
      _push(`<!--]--></div><button class="mt-4 text-sm font-semibold text-[#1f2a56] [@media(hover:hover)]:hover:underline active:underline"> Tambah Jadwal </button></div></section><aside class="space-y-4"><div class="rounded-3xl bg-white p-4 shadow-sm"><p class="mb-3 font-semibold text-[#1f2a56]">Data Pemesan</p><div class="space-y-3 text-sm"><label class="block"><span class="text-gray-600">Nama Lengkap <span class="text-red-500">*</span></span><input${ssrRenderAttr("value", customerName.value)} type="text" placeholder="Masukkan nama lengkap" class="${ssrRenderClass([
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
      _push(`</label><div class="block"><span class="text-gray-600">Kategori Penyewa <span class="text-red-500">*</span></span><select class="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 focus:border-[#1f2a56] focus:outline-none focus:ring-2 focus:ring-[#1f2a56]/20 bg-white"><option value="UMUM"${ssrIncludeBooleanAttr(Array.isArray(renterType.value) ? ssrLooseContain(renterType.value, "UMUM") : ssrLooseEqual(renterType.value, "UMUM")) ? " selected" : ""}>Umum (Mahasiswa Umum)</option><option value="TENDIK"${ssrIncludeBooleanAttr(Array.isArray(renterType.value) ? ssrLooseContain(renterType.value, "TENDIK") : ssrLooseEqual(renterType.value, "TENDIK")) ? " selected" : ""}>Tenaga Kependidikan</option><option value="AKADEMIK"${ssrIncludeBooleanAttr(Array.isArray(renterType.value) ? ssrLooseContain(renterType.value, "AKADEMIK") : ssrLooseEqual(renterType.value, "AKADEMIK")) ? " selected" : ""}>Akademik (Mahasiswa dengan Kegiatan Kampus)</option></select><p class="mt-1 text-xs text-gray-500">`);
      if (renterType.value === "UMUM") {
        _push(`<!--[-->Harga standar berlaku<!--]-->`);
      } else if (renterType.value === "TENDIK") {
        _push(`<!--[-->Harga khusus tenaga kependidikan UNDIP<!--]-->`);
      } else {
        _push(`<!--[-->Gratis untuk kegiatan akademik resmi<!--]-->`);
      }
      _push(`</p></div>`);
      if (needsInstitution.value) {
        _push(`<label class="block"><span class="text-gray-600">Instansi/Unit <span class="text-red-500">*</span></span><input${ssrRenderAttr("value", customerInstitution.value)} type="text" placeholder="Contoh: Fakultas Teknik UNDIP" class="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 focus:border-[#1f2a56] focus:outline-none focus:ring-2 focus:ring-[#1f2a56]/20"></label>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="block"><span class="text-gray-600">Upload SPTJM <span class="text-red-500">*</span></span><p class="text-xs text-gray-500 mb-2">Surat Pernyataan Tanggung Jawab Mutlak (format PDF)</p>`);
      if (!sptjmFile.value) {
        _push(`<div class="mt-1"><label class="flex items-center justify-center w-full rounded-xl border-2 border-dashed border-gray-300 px-3 py-4 cursor-pointer [@media(hover:hover)]:hover:border-[#1f2a56] [@media(hover:hover)]:hover:bg-gray-50 active:bg-gray-50 transition-colors"><div class="flex flex-col items-center"><svg class="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg><span class="text-sm text-gray-600">Klik untuk upload PDF</span></div><input type="file" accept=".pdf" class="hidden"></label></div>`);
      } else {
        _push(`<div class="mt-1 flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-3 py-2"><div class="flex items-center gap-2"><svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><span class="text-sm text-green-700 font-medium truncate max-w-[150px]">${ssrInterpolate(sptjmFile.value.name)}</span></div><button type="button" class="text-red-500 [@media(hover:hover)]:hover:text-red-700 active:text-red-700 p-1"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div>`);
      }
      if (errors.value.sptjm) {
        _push(`<p class="mt-1 text-xs text-red-600 flex items-center gap-1"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> ${ssrInterpolate(errors.value.sptjm)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (needsSuratPengantar.value) {
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
      _push(`<div class="rounded-3xl bg-white p-4 shadow-sm"><div class="flex items-center justify-between"><p class="font-semibold text-[#1f2a56]">Gunakan Voucher</p><span class="text-gray-400">+</span></div></div><div class="rounded-3xl bg-white p-4 shadow-sm"><p class="mb-3 font-semibold text-[#1f2a56]">Rincian Biaya</p><div class="space-y-2 text-sm text-gray-600"><div class="flex items-center justify-between"><span>Biaya Sewa</span><span>Rp${ssrInterpolate(displayPrice.value.toLocaleString("id-ID"))}</span></div><div class="flex items-center justify-between"><span>Biaya Tambahan</span><span>Rp0</span></div></div>`);
      if (renterType.value === "AKADEMIK") {
        _push(`<div class="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg"><p class="text-xs text-green-700 font-medium">✓ Gratis untuk kegiatan akademik</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 text-sm font-semibold text-[#1f2a56]"><span>Total Bayar</span><span>Rp${ssrInterpolate(displayPrice.value.toLocaleString("id-ID"))}</span></div></div><div class="rounded-3xl bg-white p-4 shadow-sm"><p class="mb-2 font-semibold text-[#1f2a56]">Atur Pembayaran</p><p class="text-sm text-gray-600">Bayar Lunas</p><p class="text-base font-bold text-[#1f2a56]">Rp${ssrInterpolate(displayPrice.value.toLocaleString("id-ID"))}</p></div><div class="rounded-3xl bg-white p-4 shadow-sm"><p class="font-semibold text-[#1f2a56]">Kebijakan Reschedule &amp; Pembatalan</p><p class="mt-1 text-sm text-gray-500">Hubungi admin untuk informasi lebih lanjut.</p></div><button class="w-full rounded-xl bg-[#1f2a56] py-3 text-sm font-semibold text-white shadow [@media(hover:hover)]:hover:bg-[#162347] disabled:bg-[#1f2a56]/70 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"${ssrIncludeBooleanAttr(unref(pending) || !orderSlots.value.length || bookingLoading.value) ? " disabled" : ""}>`);
      if (bookingLoading.value) {
        _push(`<svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<span>${ssrInterpolate(bookingLoading.value ? "Memproses..." : "Buat Booking")}</span></button></aside></div></main>`);
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
//# sourceMappingURL=order-BlhrS0vw.mjs.map
