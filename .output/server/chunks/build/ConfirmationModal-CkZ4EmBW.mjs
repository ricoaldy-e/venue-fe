import { defineComponent, ref, useSSRContext } from 'vue';
import { ssrRenderTeleport, ssrRenderClass, ssrInterpolate } from 'vue/server-renderer';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ConfirmationModal",
  __ssrInlineRender: true,
  setup(__props, { expose: __expose }) {
    const isOpen = ref(false);
    const options = ref({
      title: "Konfirmasi",
      message: "Apakah Anda yakin?",
      confirmText: "Ya, Lanjutkan",
      cancelText: "Batal",
      type: "info",
      mode: "confirm"
    });
    const open = (opts) => {
      options.value = {
        confirmText: "Ya, Lanjutkan",
        cancelText: "Batal",
        type: "info",
        mode: "confirm",
        ...opts
      };
      isOpen.value = true;
      return new Promise((resolve) => {
      });
    };
    __expose({ open });
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(_push, (_push2) => {
        if (isOpen.value) {
          _push2(`<div class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md p-4" role="dialog" aria-modal="true" data-v-12975cec><div class="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden" data-v-12975cec><div class="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" data-v-12975cec></div><div class="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" data-v-12975cec></div>`);
          if (options.value.type === "danger") {
            _push2(`<div class="absolute top-0 left-0 w-40 h-40 bg-red-500/10 rounded-full blur-3xl pointer-events-none" data-v-12975cec></div>`);
          } else {
            _push2(`<!---->`);
          }
          if (options.value.type === "warning") {
            _push2(`<div class="absolute bottom-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" data-v-12975cec></div>`);
          } else {
            _push2(`<!---->`);
          }
          if (options.value.type === "success") {
            _push2(`<div class="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" data-v-12975cec></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<button class="absolute top-4 right-4 z-10 inline-flex items-center justify-center h-8 w-8 rounded-lg bg-gray-200/80 hover:bg-gray-300/80 text-gray-700 hover:text-gray-900 transition-all duration-200 hover:scale-110 focus:outline-none" data-v-12975cec><svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-12975cec><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" data-v-12975cec></path></svg></button><div class="relative p-8 space-y-6 text-center" data-v-12975cec><div class="flex justify-center" data-v-12975cec><div class="${ssrRenderClass([{
            "bg-gradient-to-br from-red-600 to-red-800 shadow-red-600/30": options.value.type === "danger",
            "bg-gradient-to-br from-amber-500 to-amber-700 shadow-amber-500/30": options.value.type === "warning",
            "bg-gradient-to-br from-[#1f2a56] to-[#0f1a3c] shadow-[#1f2a56]/25": options.value.type === "info",
            "bg-gradient-to-br from-emerald-600 to-emerald-800 shadow-emerald-600/30": options.value.type === "success"
          }, "inline-flex items-center justify-center h-20 w-20 rounded-full shadow-lg transition-all duration-300"])}" data-v-12975cec>`);
          if (options.value.type === "danger") {
            _push2(`<svg class="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" data-v-12975cec><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" data-v-12975cec></path></svg>`);
          } else if (options.value.type === "warning") {
            _push2(`<svg class="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" data-v-12975cec><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" data-v-12975cec></path></svg>`);
          } else if (options.value.type === "success") {
            _push2(`<svg class="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" data-v-12975cec><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" data-v-12975cec></path></svg>`);
          } else {
            _push2(`<svg class="h-10 w-10 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-12975cec><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" data-v-12975cec></path></svg>`);
          }
          _push2(`</div></div><div class="space-y-3" data-v-12975cec><h3 class="text-2xl font-bold text-gray-900" id="modal-title" data-v-12975cec>${ssrInterpolate(options.value.title)}</h3><p class="text-gray-600 leading-relaxed whitespace-pre-line" data-v-12975cec>${ssrInterpolate(options.value.message)}</p></div><div class="flex flex-col sm:flex-row gap-3 pt-2" data-v-12975cec>`);
          if (options.value.mode === "confirm") {
            _push2(`<button type="button" class="order-2 sm:order-1 flex-1 inline-flex items-center justify-center px-4 py-3.5 text-sm font-bold text-gray-800 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-xl transition-all duration-200 focus:outline-none hover:border-gray-400 active:scale-[0.98]" data-v-12975cec>${ssrInterpolate(options.value.cancelText)}</button>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<button type="button" class="${ssrRenderClass([{
            "bg-gradient-to-r from-red-600 to-red-800 shadow-red-600/20 hover:shadow-red-600/30": options.value.type === "danger",
            "bg-gradient-to-r from-amber-500 to-amber-700 shadow-amber-500/20 hover:shadow-amber-500/30": options.value.type === "warning",
            "bg-gradient-to-r from-[#1f2a56] to-[#0f1a3c] shadow-[#1f2a56]/20 hover:shadow-[#1f2a56]/30": options.value.type === "info",
            "bg-gradient-to-r from-emerald-600 to-emerald-800 shadow-emerald-600/20 hover:shadow-emerald-600/30": options.value.type === "success"
          }, "order-1 sm:order-2 flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 focus:outline-none active:scale-[0.98]"])}" data-v-12975cec>${ssrInterpolate(options.value.confirmText)} `);
          if (options.value.mode === "alert") {
            _push2(`<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" data-v-12975cec><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" data-v-12975cec></path></svg>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</button></div></div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ConfirmationModal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-12975cec"]]), { __name: "ConfirmationModal" });

export { __nuxt_component_0 as _ };
//# sourceMappingURL=ConfirmationModal-CkZ4EmBW.mjs.map
