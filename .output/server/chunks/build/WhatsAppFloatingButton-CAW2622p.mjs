import { defineComponent, ref, computed, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr } from 'vue/server-renderer';
import { _ as _export_sfc, u as useAppOptions } from './server.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "WhatsAppFloatingButton",
  __ssrInlineRender: true,
  props: {
    stadiumName: {}
  },
  setup(__props) {
    const props = __props;
    const isFooterVisible = ref(false);
    const { options } = useAppOptions();
    const phoneNumber = computed(() => options.value.data?.nohp || "+62 851 6566 0339");
    const phoneDisplay = computed(() => phoneNumber.value);
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
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["fixed right-6 z-50 flex items-center gap-3 transition-all duration-500 ease-out", isFooterVisible.value ? "bottom-[160px] sm:bottom-[140px]" : "bottom-6"]
      }, _attrs))} data-v-70db4bb3><div class="whatsapp-tooltip hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white shadow-lg shadow-gray-200/60 border border-gray-100 opacity-0 translate-x-2 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" data-v-70db4bb3><svg class="h-4 w-4 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" data-v-70db4bb3><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" data-v-70db4bb3></path></svg><div class="flex flex-col" data-v-70db4bb3><span class="text-sm font-semibold text-gray-900 whitespace-nowrap" data-v-70db4bb3>Hubungi Operator</span><span class="text-xs text-gray-500 whitespace-nowrap" data-v-70db4bb3>${ssrInterpolate(phoneDisplay.value)}</span></div></div><a${ssrRenderAttr("href", whatsappUrl.value)} target="_blank" rel="noopener noreferrer" class="whatsapp-btn group relative flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] text-white shadow-lg shadow-green-500/40 transition-all duration-300 [@media(hover:hover)]:hover:scale-110 [@media(hover:hover)]:hover:shadow-xl [@media(hover:hover)]:hover:shadow-green-500/50 active:scale-95" aria-label="Hubungi Operator via WhatsApp" data-v-70db4bb3><span class="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" data-v-70db4bb3></span><svg class="relative h-6 w-6 sm:h-7 sm:w-7 transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24" data-v-70db4bb3><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" data-v-70db4bb3></path></svg></a></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/client/WhatsAppFloatingButton.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_3 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-70db4bb3"]]), { __name: "ClientWhatsAppFloatingButton" });

export { __nuxt_component_3 as _ };
//# sourceMappingURL=WhatsAppFloatingButton-CAW2622p.mjs.map
