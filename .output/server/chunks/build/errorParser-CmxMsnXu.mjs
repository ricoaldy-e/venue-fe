import { defineComponent, mergeProps, ref, computed, watch, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderTeleport, ssrRenderStyle, ssrRenderList, ssrRenderClass, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { b as getTodayInWib } from './dateHelpers-jbKEnFTU.mjs';
import { _ as _export_sfc } from './server.mjs';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "PlaceholderImage",
  __ssrInlineRender: true,
  props: {
    width: { default: 400 },
    height: { default: 300 },
    viewBox: { default: "0 0 400 300" },
    className: { default: "w-full h-auto" },
    text: { default: "Tidak ada gambar" }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<svg${ssrRenderAttrs(mergeProps({
        viewBox: __props.viewBox,
        width: __props.width,
        height: __props.height,
        class: __props.className,
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none"
      }, _attrs))}><rect width="100%" height="100%" fill="#f3f4f6"></rect><defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" stroke-width="1"></path></pattern></defs><rect width="100%" height="100%" fill="url(#grid)"></rect><g transform="translate(150, 70)"><rect x="-30" y="-25" width="60" height="50" fill="none" stroke="#9ca3af" stroke-width="2" rx="4"></rect><path d="M -20 5 L -10 -8 L 0 2 L 10 -5 L 20 8" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><circle cx="10" cy="-15" r="4" fill="#9ca3af"></circle></g><text x="50%" y="80%" text-anchor="middle" fill="#9ca3af" font-size="16" font-family="system-ui, -apple-system, sans-serif" font-weight="500">${ssrInterpolate(__props.text)}</text></svg>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/PlaceholderImage.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main$1, { __name: "PlaceholderImage" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "SmartDatePicker",
  __ssrInlineRender: true,
  props: {
    modelValue: {},
    minDate: {},
    maxDate: {},
    allowPastDates: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const isOpen = ref(false);
    const triggerButton = ref();
    const popoverContent = ref();
    const datePickerDate = ref(/* @__PURE__ */ new Date());
    const popoverStyles = ref({
      top: "0px",
      left: "0px"
    });
    const currentMonth = computed(() => {
      const date = datePickerDate.value;
      return date.toLocaleDateString("id-ID", { month: "long", year: "numeric", timeZone: "Asia/Jakarta" });
    });
    const calendarDays = computed(() => {
      const year = datePickerDate.value.getFullYear();
      const month = datePickerDate.value.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const daysInMonth = lastDay.getDate();
      const startingDayOfWeek = firstDay.getDay();
      const days = [];
      for (let i = 0; i < startingDayOfWeek; i++) {
        days.push({ day: null, date: null });
      }
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        days.push({ day, date });
      }
      return days;
    });
    function toLocalDateKey(value) {
      if (!value) return null;
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return null;
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
    function isDatePast(date) {
      if (!date) return false;
      if (props.allowPastDates) return false;
      const today = getTodayInWib();
      return date <= today;
    }
    function isDatePastOrToday(date) {
      if (!date) return false;
      const today = getTodayInWib();
      return date <= today;
    }
    function isDateSelected(date) {
      if (!date || !props.modelValue) return false;
      return toLocalDateKey(date) === toLocalDateKey(props.modelValue);
    }
    function closePicker() {
      isOpen.value = false;
    }
    function updatePopoverPosition() {
      if (!triggerButton.value || !popoverContent.value) return;
      const triggerRect = triggerButton.value.getBoundingClientRect();
      const popoverRect = popoverContent.value.getBoundingClientRect();
      let top = triggerRect.bottom + 8;
      let left = triggerRect.right - popoverRect.width;
      const viewportWidth = (void 0).innerWidth;
      const viewportHeight = (void 0).innerHeight;
      const padding = 16;
      if (left + popoverRect.width > viewportWidth - padding) {
        left = viewportWidth - popoverRect.width - padding;
      }
      if (left < padding) {
        left = padding;
      }
      if (top + popoverRect.height > viewportHeight - padding) {
        top = triggerRect.top - popoverRect.height - 8;
      }
      popoverStyles.value = {
        top: `${top}px`,
        left: `${left}px`
      };
    }
    function handleWindowResize() {
      if (isOpen.value) {
        updatePopoverPosition();
      }
    }
    function handleScroll() {
      if (isOpen.value) {
        closePicker();
      }
    }
    watch(isOpen, (newVal) => {
      if (newVal) {
        (void 0).addEventListener("resize", handleWindowResize);
        (void 0).addEventListener("scroll", handleScroll, true);
      } else {
        (void 0).removeEventListener("resize", handleWindowResize);
        (void 0).removeEventListener("scroll", handleScroll, true);
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "date-picker-wrapper" }, _attrs))} data-v-1cdebc6a><button class="inline-flex items-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold transition-all border bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm active:scale-95" data-v-1cdebc6a><svg class="w-4 h-4 sm:w-4.5 sm:h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-1cdebc6a><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" data-v-1cdebc6a></path></svg><span class="hidden sm:inline" data-v-1cdebc6a>Pilih Tanggal</span><span class="sm:hidden" data-v-1cdebc6a>Kalender</span></button>`);
      ssrRenderTeleport(_push, (_push2) => {
        if (isOpen.value) {
          _push2(`<div style="${ssrRenderStyle(popoverStyles.value)}" class="fixed z-50 w-[280px] sm:w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden" data-v-1cdebc6a><div class="flex items-center justify-between px-4 py-3 bg-[#1f2a56] text-white" data-v-1cdebc6a><button class="p-1.5 rounded-lg hover:bg-white/10 transition-colors" data-v-1cdebc6a><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-1cdebc6a><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" data-v-1cdebc6a></path></svg></button><span class="text-sm font-semibold" data-v-1cdebc6a>${ssrInterpolate(currentMonth.value)}</span><button class="p-1.5 rounded-lg hover:bg-white/10 transition-colors" data-v-1cdebc6a><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-1cdebc6a><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" data-v-1cdebc6a></path></svg></button></div><div class="p-3 sm:p-4" data-v-1cdebc6a><div class="grid grid-cols-7 gap-1 mb-2" data-v-1cdebc6a><!--[-->`);
          ssrRenderList(["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"], (day) => {
            _push2(`<div class="text-center text-xs font-semibold text-gray-600 py-1" data-v-1cdebc6a>${ssrInterpolate(day)}</div>`);
          });
          _push2(`<!--]--></div><div class="grid grid-cols-7 gap-1" data-v-1cdebc6a><!--[-->`);
          ssrRenderList(calendarDays.value, (item, index) => {
            _push2(`<button${ssrIncludeBooleanAttr(!item.date || isDatePast(item.date)) ? " disabled" : ""} class="${ssrRenderClass([[
              !item.date ? "invisible" : "",
              isDatePast(item.date) ? "text-gray-400 bg-gray-100 cursor-not-allowed opacity-50" : isDateSelected(item.date) ? "bg-[#1f2a56] text-white shadow-md scale-105" : isDatePastOrToday(item.date) && props.allowPastDates ? "text-gray-500 bg-gray-50 border border-gray-300 hover:bg-gray-100 hover:border-gray-400 hover:scale-105 active:scale-95" : "text-gray-700 hover:bg-gray-100 hover:scale-105 active:scale-95"
            ], "aspect-square rounded-lg text-sm font-medium transition-all"])}" data-v-1cdebc6a>${ssrInterpolate(item.day)}</button>`);
          });
          _push2(`<!--]--></div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      if (isOpen.value) {
        _push(`<div class="fixed inset-0 z-40" data-v-1cdebc6a></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/SmartDatePicker.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_2 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-1cdebc6a"]]), { __name: "SmartDatePicker" });
function parsePrismaUniqueConstraint(error) {
  if (error.includes("Unique constraint failed") && error.includes("BookingDetail")) {
    return {
      title: "Slot Tidak Tersedia",
      message: "Slot waktu yang dipilih sudah dibooking oleh pengguna lain. Silakan pilih slot yang berbeda atau coba lagi.",
      isUserFriendly: true
    };
  }
  if (error.includes("Unique constraint failed")) {
    return {
      title: "Data Sudah Ada",
      message: "Data dengan informasi tersebut sudah ada di sistem. Silakan periksa kembali.",
      isUserFriendly: true
    };
  }
  return null;
}
function parsePrismaForeignKey(error) {
  if (error.includes("Foreign key constraint")) {
    return {
      title: "Data Tidak Valid",
      message: "Data yang Anda pilih tidak valid atau sudah tidak tersedia. Silakan refresh halaman dan coba lagi.",
      isUserFriendly: true
    };
  }
  return null;
}
function parsePrismaNotFound(error) {
  if (error.includes("Record to update not found") || error.includes("Record to delete not found")) {
    return {
      title: "Data Tidak Ditemukan",
      message: "Data yang Anda cari sudah tidak ada atau telah dihapus.",
      isUserFriendly: true
    };
  }
  return null;
}
function parseAuthError(error) {
  if (error.includes("Invalid email or password")) {
    return {
      title: "Login Gagal",
      message: "Email atau password yang Anda masukkan salah. Silakan periksa kembali.",
      isUserFriendly: true
    };
  }
  if (error.includes("Unauthorized") || error.includes("unauthorized")) {
    return {
      title: "Akses Ditolak",
      message: "Sesi Anda telah berakhir. Silakan login kembali.",
      isUserFriendly: true
    };
  }
  if (error.includes("Token expired") || error.includes("jwt expired")) {
    return {
      title: "Sesi Berakhir",
      message: "Sesi Anda telah berakhir. Silakan login kembali untuk melanjutkan.",
      isUserFriendly: true
    };
  }
  return null;
}
function parseValidationError(error) {
  if (error.includes("validation") || error.includes("invalid")) {
    return {
      title: "Data Tidak Valid",
      message: "Data yang Anda masukkan tidak sesuai format. Silakan periksa kembali.",
      isUserFriendly: true
    };
  }
  return null;
}
function parseNetworkError(error) {
  if (error.includes("timeout") || error.includes("ECONNREFUSED") || error.includes("Network error")) {
    return {
      title: "Koneksi Bermasalah",
      message: "Tidak dapat terhubung ke server. Periksa koneksi internet Anda atau coba beberapa saat lagi.",
      isUserFriendly: true
    };
  }
  if (error.includes("502") || error.includes("Bad Gateway")) {
    return {
      title: "Server Tidak Tersedia",
      message: "Server sedang mengalami gangguan. Mohon coba beberapa saat lagi.",
      isUserFriendly: true
    };
  }
  return null;
}
function parseBackendError(error) {
  let errorMessage = "";
  if (typeof error === "string") {
    errorMessage = error;
  } else if (error?.message) {
    errorMessage = error.message;
  } else if (error?.statusMessage) {
    errorMessage = error.statusMessage;
  } else if (error?.data?.statusMessage) {
    errorMessage = error.data.statusMessage;
  } else if (error?.data?.message) {
    errorMessage = error.data.message;
  }
  const parsers = [
    parsePrismaUniqueConstraint,
    parsePrismaForeignKey,
    parsePrismaNotFound,
    parseAuthError,
    parseValidationError,
    parseNetworkError
  ];
  for (const parser of parsers) {
    const parsed = parser(errorMessage);
    if (parsed) return parsed;
  }
  const cleanMessage = errorMessage.replace(/\[POST\]\s*"[^"]+"\s*:\s*\d+\s*/g, "").replace(/Invalid `prisma\.[^`]+` invocation[^]*?(?=\n|$)/gi, "").replace(/in\/app\/src\/[^\s]+/g, "").replace(/Unique constraint failed on the constraint: `[^`]+`/gi, "Data sudah ada atau tidak valid").trim();
  if (!cleanMessage || cleanMessage.length < 5 || cleanMessage.includes("prisma") || cleanMessage.includes("resolver")) {
    return {
      title: "Terjadi Kesalahan",
      message: "Mohon maaf, terjadi kesalahan pada sistem. Silakan coba lagi atau hubungi administrator jika masalah berlanjut.",
      isUserFriendly: true
    };
  }
  return {
    message: cleanMessage,
    isUserFriendly: false
  };
}

export { __nuxt_component_1 as _, __nuxt_component_2 as a, parseBackendError as p };
//# sourceMappingURL=errorParser-CmxMsnXu.mjs.map
