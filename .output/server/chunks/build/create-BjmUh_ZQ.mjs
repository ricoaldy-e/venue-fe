import { _ as __nuxt_component_0 } from './ConfirmationModal-CeBamt8k.mjs';
import { defineComponent, computed, ref, reactive, watch, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrInterpolate, ssrRenderAttr, ssrRenderClass, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderStyle, ssrRenderComponent } from 'vue/server-renderer';
import { u as useAppOptions, a as useRoute } from './server.mjs';
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
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "create",
  __ssrInlineRender: true,
  setup(__props) {
    const { options } = useAppOptions();
    computed(() => options.value.data?.name || "VENUE UNDIP");
    useHead({
      title: "Buat Booking Baru - VENUE UNDIP",
      meta: [
        { name: "description", content: "Buat booking baru untuk lapangan di VENUE UNDIP" }
      ]
    });
    const route = useRoute();
    Number(route.params.id);
    const selectedSlots = ref([]);
    try {
      const raw = route.query.selections;
      if (raw) selectedSlots.value = JSON.parse(decodeURIComponent(raw));
    } catch {
      selectedSlots.value = [];
    }
    const bookingForm = reactive({
      name: "",
      contact: "",
      email: "",
      renterType: "UMUM",
      institution: "",
      suratFile: null,
      sptjmFile: null
    });
    const errorMsg = ref(null);
    ref(null);
    const uploadProgress = ref(null);
    const submitting = ref(false);
    const checkingAvailability = ref(false);
    const confirmationModal = ref(null);
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
      }).format(amount);
    };
    const fieldErrors = ref({
      name: "",
      contact: "",
      email: "",
      institution: ""
    });
    const isUploadingFiles = ref(false);
    const totalPrice = computed(() => {
      if (bookingForm.renterType === "AKADEMIK") {
        return 0;
      }
      return selectedSlots.value.reduce((sum, s) => {
        const price = bookingForm.renterType === "TENDIK" && s.priceTendik ? s.priceTendik : s.pricePerHour || 0;
        return sum + price;
      }, 0);
    });
    watch(() => bookingForm.renterType, (val) => {
      if (val === "UMUM") {
        bookingForm.suratFile = null;
        bookingForm.institution = "";
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ConfirmationModal = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "flex w-full flex-col gap-6 sm:gap-8 pb-12 relative max-w-7xl mx-auto" }, _attrs))}><header class="flex flex-col sm:flex-row sm:items-center justify-between gap-6"><div class="flex items-start gap-4"><div class="p-3 bg-blue-50 rounded-xl border border-blue-100 shrink-0 hidden sm:flex items-center justify-center"><svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg></div><div><h1 class="text-2xl uppercase font-bold text-gray-900 tracking-tight">Buat Booking Baru</h1><p class="text-sm text-gray-500 mt-1"> Lengkapi informasi pemesan untuk membuat booking lapangan olahraga. </p></div></div></header><form id="booking-form" class="flex flex-col gap-8 w-full"><div class="w-full"><div class="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden"><div class="p-5 border-b border-gray-200 bg-gray-50/50"><h3 class="text-base font-bold text-gray-900">Slot yang Dipilih</h3><p class="text-xs text-gray-500 mt-0.5">Review jadwal booking sebelum melanjutkan.</p></div><div class="p-6">`);
      if (unref(selectedSlots).length === 0) {
        _push(`<div class="text-center py-8"><svg class="w-16 h-16 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg><p class="text-sm text-gray-500 font-medium">Tidak ada slot yang dipilih</p><p class="text-xs text-gray-400 mt-1">Silakan pilih slot terlebih dahulu</p></div>`);
      } else {
        _push(`<div class="space-y-3"><!--[-->`);
        ssrRenderList(unref(selectedSlots), (slot) => {
          _push(`<div class="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 shadow-sm hover:shadow-md transition-shadow"><div class="flex items-start justify-between"><div class="flex-1"><p class="font-bold text-gray-900 text-base">${ssrInterpolate(slot.fieldName)}</p><div class="flex items-center gap-2 mt-2 text-sm text-gray-600"><svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg><span class="font-medium">${ssrInterpolate(slot.date.split("T")[0])}</span></div><div class="flex items-center gap-2 mt-1.5 text-sm text-gray-600"><svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><span class="font-medium">${ssrInterpolate(slot.startHour)}:00 - ${ssrInterpolate(slot.startHour + 1)}:00</span></div></div><div class="text-right"><p class="text-xs text-gray-500 uppercase tracking-wide font-bold">Harga</p>`);
          if (unref(bookingForm).renterType === "AKADEMIK") {
            _push(`<p class="text-lg font-bold text-green-600 mt-1">GRATIS</p>`);
          } else if (unref(bookingForm).renterType === "TENDIK" && slot.priceTendik) {
            _push(`<!--[--><p class="text-lg font-bold text-purple-600 mt-1">Rp ${ssrInterpolate(slot.priceTendik.toLocaleString("id-ID"))}</p><p class="text-xs text-gray-400 line-through">Rp ${ssrInterpolate(slot.pricePerHour.toLocaleString("id-ID"))}</p><!--]-->`);
          } else {
            _push(`<p class="text-lg font-bold text-blue-600 mt-1">Rp ${ssrInterpolate(slot.pricePerHour.toLocaleString("id-ID"))}</p>`);
          }
          _push(`</div></div></div>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div></div></div><div class="w-full"><div class="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden"><div class="p-5 border-b border-gray-200 bg-gray-50/50"><h3 class="text-base font-bold text-gray-900">Informasi Pemesan</h3><p class="text-xs text-gray-500 mt-0.5">Data kontak untuk konfirmasi booking.</p></div><div class="p-6 space-y-4"><div class="space-y-1.5"><label class="block text-xs font-bold text-gray-700 uppercase tracking-wider">Nama Lengkap <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", unref(bookingForm).name)} type="text" required placeholder="Masukkan nama lengkap" class="${ssrRenderClass([
        "block w-full rounded-xl border pl-4 pr-4 py-3 text-sm font-medium text-gray-900 focus:ring-2 shadow-sm transition-all",
        unref(fieldErrors).name ? "border-red-500 focus:border-red-500 focus:ring-red-200 bg-red-50" : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
      ])}">`);
      if (unref(fieldErrors).name) {
        _push(`<p class="mt-1.5 text-xs text-red-600 font-medium flex items-start gap-1.5"><svg class="w-3.5 h-3.5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><span>${ssrInterpolate(unref(fieldErrors).name)}</span></p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="space-y-1.5"><label class="block text-xs font-bold text-gray-700 uppercase tracking-wider">Nomor Kontak <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", unref(bookingForm).contact)} type="tel" required placeholder="Contoh: 081234567890" class="${ssrRenderClass([
        "block w-full rounded-xl border pl-4 pr-4 py-3 text-sm font-medium text-gray-900 focus:ring-2 shadow-sm transition-all",
        unref(fieldErrors).contact ? "border-red-500 focus:border-red-500 focus:ring-red-200 bg-red-50" : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
      ])}">`);
      if (unref(fieldErrors).contact) {
        _push(`<p class="mt-1.5 text-xs text-red-600 font-medium flex items-start gap-1.5"><svg class="w-3.5 h-3.5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><span>${ssrInterpolate(unref(fieldErrors).contact)}</span></p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="space-y-1.5"><label class="block text-xs font-bold text-gray-700 uppercase tracking-wider">Alamat Email <span class="text-red-500">*</span></label><p class="text-xs text-gray-500 mt-1">Harap masukkan email client yang valid untuk keperluan pengiriman kode booking dan informasi lainnya.</p><input${ssrRenderAttr("value", unref(bookingForm).email)} type="email" required placeholder="contoh@email.com" class="${ssrRenderClass([
        "block w-full rounded-xl border pl-4 pr-4 py-3 text-sm font-medium text-gray-900 focus:ring-2 shadow-sm transition-all",
        unref(fieldErrors).email ? "border-red-500 focus:border-red-500 focus:ring-red-200 bg-red-50" : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
      ])}">`);
      if (unref(fieldErrors).email) {
        _push(`<p class="mt-1.5 text-xs text-red-600 font-medium flex items-start gap-1.5"><svg class="w-3.5 h-3.5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><span>${ssrInterpolate(unref(fieldErrors).email)}</span></p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div></div><div class="w-full"><div class="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden"><div class="p-5 border-b border-gray-200 bg-gray-50/50"><h3 class="text-base font-bold text-gray-900">Kategori Booking</h3><p class="text-xs text-gray-500 mt-0.5">Pilih jenis booking untuk keperluan akademik.</p></div><div class="p-6 space-y-6"><div class="space-y-1.5"><label class="block text-xs font-bold text-gray-700 uppercase tracking-wider">Tipe Penyewa</label><div class="relative"><select class="block w-full rounded-xl border border-gray-300 pl-4 pr-10 py-3 text-sm font-medium text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 bg-white shadow-sm transition-all appearance-none cursor-pointer"><option value="UMUM"${ssrIncludeBooleanAttr(Array.isArray(unref(bookingForm).renterType) ? ssrLooseContain(unref(bookingForm).renterType, "UMUM") : ssrLooseEqual(unref(bookingForm).renterType, "UMUM")) ? " selected" : ""}>Umum (Mahasiswa Umum)</option><option value="TENDIK"${ssrIncludeBooleanAttr(Array.isArray(unref(bookingForm).renterType) ? ssrLooseContain(unref(bookingForm).renterType, "TENDIK") : ssrLooseEqual(unref(bookingForm).renterType, "TENDIK")) ? " selected" : ""}>Tendik (Tenaga Kependidikan)</option><option value="AKADEMIK"${ssrIncludeBooleanAttr(Array.isArray(unref(bookingForm).renterType) ? ssrLooseContain(unref(bookingForm).renterType, "AKADEMIK") : ssrLooseEqual(unref(bookingForm).renterType, "AKADEMIK")) ? " selected" : ""}>Akademik (Mahasiswa dengan Kegiatan Kampus)</option></select><div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"><svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg></div></div><p class="text-xs text-gray-500 mt-1"> Pilih kategori penyewa untuk menentukan harga sewa. </p></div><div class="space-y-1.5"><label class="block text-xs font-bold text-gray-700 uppercase tracking-wider">Upload SPTJM (PDF) <span class="text-red-500">*</span></label><div class="relative"><input type="file" accept="application/pdf" class="block w-full text-sm text-gray-900 border border-gray-300 rounded-xl cursor-pointer bg-gray-50 focus:outline-none focus:border-blue-500 file:mr-4 file:py-3 file:px-4 file:rounded-l-xl file:border-0 file:text-sm file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition-all"></div><p class="text-xs text-gray-500 mt-1"> 💡 Surat Pernyataan Tanggung Jawab Mutlak (Wajib), format PDF max 5MB. </p></div>`);
      if (unref(bookingForm).renterType !== "UMUM") {
        _push(`<div class="space-y-4 pt-4 border-t border-gray-100"><div class="space-y-1.5"><label class="block text-xs font-bold text-gray-700 uppercase tracking-wider">Nama Institusi <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", unref(bookingForm).institution)} type="text" required placeholder="Fakultas / Jurusan / Unit / Organisasi..." class="${ssrRenderClass([
          "block w-full rounded-xl border pl-4 pr-4 py-3 text-sm font-medium text-gray-900 focus:ring-2 shadow-sm transition-all",
          unref(fieldErrors).institution ? "border-red-500 focus:border-red-500 focus:ring-red-200 bg-red-50" : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        ])}">`);
        if (unref(fieldErrors).institution) {
          _push(`<p class="mt-1.5 text-xs text-red-600 font-medium flex items-start gap-1.5"><svg class="w-3.5 h-3.5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><span>${ssrInterpolate(unref(fieldErrors).institution)}</span></p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="space-y-1.5"><label class="block text-xs font-bold text-gray-700 uppercase tracking-wider">Upload Surat Pengantar (PDF)</label><div class="relative"><input type="file" accept="application/pdf" class="block w-full text-sm text-gray-900 border border-gray-300 rounded-xl cursor-pointer bg-gray-50 focus:outline-none focus:border-blue-500 file:mr-4 file:py-3 file:px-4 file:rounded-l-xl file:border-0 file:text-sm file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition-all"></div><p class="text-xs text-gray-500 mt-1"> 💡 Surat pengantar dari institusi/fakultas (Wajib untuk Akademik/Tendik). </p></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(uploadProgress) !== null) {
        _push(`<div class="mt-3 space-y-2"><div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden"><div style="${ssrRenderStyle({ width: unref(uploadProgress) + "%" })}" class="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300 ease-out"></div></div><div class="flex items-center justify-between text-xs"><span class="text-gray-600 font-medium">Mengunggah file...</span><span class="text-blue-600 font-bold">${ssrInterpolate(unref(uploadProgress))}%</span></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div><div class="w-full"><div class="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden"><div class="p-5 border-b border-gray-200 bg-gray-50/50"><h3 class="text-base font-bold text-gray-900">Total Harga</h3><p class="text-xs text-gray-500 mt-0.5">Ringkasan biaya booking lapangan.</p></div><div class="p-6"><div class="flex justify-between items-center"><span class="text-sm font-medium text-gray-700">Total Biaya Booking</span><span class="text-lg font-bold text-gray-900">${ssrInterpolate(formatCurrency(unref(totalPrice)))}</span></div>`);
      if (unref(bookingForm).renterType === "AKADEMIK") {
        _push(`<div class="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg"><div class="flex items-center gap-2"><svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg><p class="text-xs font-semibold text-green-700">Gratis untuk kegiatan Akademik.</p></div></div>`);
      } else if (unref(bookingForm).renterType === "TENDIK") {
        _push(`<div class="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-lg"><div class="flex items-center gap-2"><svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><p class="text-xs font-semibold text-purple-700">Harga khusus Tendik diterapkan.</p></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div>`);
      if (unref(errorMsg)) {
        _push(`<div class="p-4 rounded-xl border border-red-200 bg-red-50 text-red-700 flex items-start gap-3 shadow-sm animate-shake"><svg class="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg><div class="flex-1"><p class="font-bold text-sm">Terjadi Kesalahan</p><p class="text-sm">${ssrInterpolate(unref(errorMsg))}</p></div><button type="button" class="text-red-700 hover:text-red-900 transition-colors" aria-label="Tutup pesan error"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-4"><button type="button" class="flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-bold text-gray-700 shadow-sm transition-all active:scale-95 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"> Batal </button><button type="submit"${ssrIncludeBooleanAttr(unref(checkingAvailability) || unref(submitting) || unref(isUploadingFiles)) ? " disabled" : ""} class="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-700 hover:shadow-md transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed">`);
      if (unref(checkingAvailability) || unref(submitting) || unref(isUploadingFiles)) {
        _push(`<svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<span>${ssrInterpolate(unref(submitting) || unref(isUploadingFiles) ? "Menyimpan..." : "Buat Booking")}</span></button></div></form>`);
      _push(ssrRenderComponent(_component_ConfirmationModal, {
        ref_key: "confirmationModal",
        ref: confirmationModal
      }, null, _parent));
      _push(`</section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/bookings/[id]/create.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=create-BjmUh_ZQ.mjs.map
