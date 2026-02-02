import { _ as __nuxt_component_0 } from './ConfirmationModal-CeBamt8k.mjs';
import { _ as __nuxt_component_0$1 } from './nuxt-link-DqM75kvd.mjs';
import { defineComponent, ref, computed, watch, mergeProps, unref, withCtx, createBlock, createCommentVNode, createVNode, openBlock, toDisplayString, withAsyncContext, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderTeleport, ssrInterpolate, ssrRenderSlot, ssrRenderAttr, ssrRenderList, ssrRenderClass, ssrRenderStyle, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { _ as _imports_0 } from './VENUE-UNDIP-LOGO-C_mmPH8T.mjs';
import { useRouter, useRoute } from 'vue-router';
import { d as useState, s as setInterval, n as navigateTo, u as useAppOptions } from './server.mjs';
import { u as useFetch } from './fetch-B8t2Jth9.mjs';
import { A as AUTH } from './constants-BG8e5vSv.mjs';
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
import '@vue/shared';
import './asyncData-DCHdo3Ys.mjs';

const useAdminLayout = () => {
  const isSidebarOpen = useState("isSidebarOpen", () => false);
  const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
  };
  const closeSidebar = () => {
    isSidebarOpen.value = false;
  };
  return { isSidebarOpen, toggleSidebar, closeSidebar };
};
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "AdminSidebar",
  __ssrInlineRender: true,
  setup(__props) {
    const { options } = useAppOptions();
    const venueName = computed(() => options.value.data?.name || "Venue UNDIP");
    useRouter();
    const route = useRoute();
    const logoutLoading = ref(false);
    const isMenuLainnyaOpen = ref(false);
    const { isSidebarOpen, closeSidebar } = useAdminLayout();
    const primaryNav = [
      { label: "Dashboard", icon: "dashboard", to: "/admin", exact: true },
      { label: "Booking", icon: "booking", to: "/admin/bookings" }
    ];
    const menuLainnya = [
      { label: "Stadion", icon: "stadium", to: "/admin/stadiums" },
      { label: "Lapangan", icon: "field", to: "/admin/fields" },
      { label: "Fasilitas", icon: "facility", to: "/admin/facilities" },
      { label: "Jadwal", icon: "schedule", to: "/admin/schedules" },
      { label: "Pengaturan", icon: "option", to: "/admin/options" }
    ];
    const secondaryNav = [
      { label: "Logout", icon: "logout", action: "logout" }
    ];
    const normalizePath = (input) => input.replace(/\/+$/, "") || "/";
    const currentPath = computed(() => normalizePath(route.path || "/"));
    const isActive = (item) => {
      if (!item.to) return false;
      const target = normalizePath(item.to);
      if (item.exact) return currentPath.value === target;
      return currentPath.value === target || currentPath.value.startsWith(`${target}/`);
    };
    const isMenuLainnyaActive = computed(() => {
      return menuLainnya.some((item) => isActive(item));
    });
    if (isMenuLainnyaActive.value) {
      isMenuLainnyaOpen.value = true;
    }
    const handleNavClick = () => {
      if ((void 0).innerWidth < 1024) closeSidebar();
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<aside${ssrRenderAttrs(mergeProps({
        class: ["bg-ds-blue-900 text-white flex flex-col justify-between h-full fixed inset-y-0 left-0 z-[70] w-64 transition-all duration-300 ease-in-out border-r border-ds-blue-800", [unref(isSidebarOpen) ? "translate-x-0" : "-translate-x-full lg:translate-x-0"]]
      }, _attrs))}><div class="px-6 py-7 border-b border-ds-blue-800"><div class="flex items-center gap-3"><img${ssrRenderAttr("src", _imports_0)} alt="Venue UNDIP Logo" class="h-11 w-11 object-contain drop-shadow-lg"><div class="flex flex-col"><p class="font-bold uppercase text-base text-white leading-tight tracking-wide">${ssrInterpolate(venueName.value)}</p><p class="text-xs text-blue-200/90 leading-tight font-medium">Admin Panel</p></div></div></div><nav aria-label="Admin utama" class="px-4 py-6 flex-1 overflow-y-auto"><p class="px-3 mb-3 text-[10px] uppercase tracking-widest font-bold text-blue-400">Main Menu</p><ul class="space-y-1"><!--[-->`);
      ssrRenderList(primaryNav, (item) => {
        _push(`<li>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: item.to,
          onClick: handleNavClick,
          class: ["group relative flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200", [
            isActive(item) ? "bg-blue-600 text-white shadow-sm" : "text-blue-200 [@media(hover:hover)]:hover:bg-ds-blue-800 [@media(hover:hover)]:hover:text-white"
          ]],
          "aria-current": isActive(item) ? "page" : void 0
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (isActive(item)) {
                _push2(`<span class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"${_scopeId}></span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<span class="${ssrRenderClass([[isActive(item) ? "text-white" : "text-blue-300 [@media(hover:hover)]:group-hover:text-white"], "w-5 h-5 flex-shrink-0 transition-transform duration-200"])}"${_scopeId}>`);
              if (item.icon === "dashboard") {
                _push2(`<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"${_scopeId}><path d="M5 11H11V5H5V11ZM5 19H11V13H5V19ZM13 19H19V13H13V19ZM13 5V11H19V5H13Z"${_scopeId}></path></svg>`);
              } else if (item.icon === "booking") {
                _push2(`<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"${_scopeId}><path d="M6 3C4.9 3 4 3.9 4 5V21L12 17L20 21V5C20 3.9 19.1 3 18 3H6ZM6 5H18V17.97L12 15.2L6 17.97V5Z"${_scopeId}></path></svg>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</span><span class="flex-1 whitespace-nowrap"${_scopeId}>${ssrInterpolate(item.label)}</span>`);
              if (isActive(item)) {
                _push2(`<span class="w-2 h-2 rounded-full bg-white shadow-sm"${_scopeId}></span>`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                isActive(item) ? (openBlock(), createBlock("span", {
                  key: 0,
                  class: "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"
                })) : createCommentVNode("", true),
                createVNode("span", {
                  class: ["w-5 h-5 flex-shrink-0 transition-transform duration-200", [isActive(item) ? "text-white" : "text-blue-300 [@media(hover:hover)]:group-hover:text-white"]]
                }, [
                  item.icon === "dashboard" ? (openBlock(), createBlock("svg", {
                    key: 0,
                    width: "20",
                    height: "20",
                    viewBox: "0 0 24 24",
                    fill: "currentColor"
                  }, [
                    createVNode("path", { d: "M5 11H11V5H5V11ZM5 19H11V13H5V19ZM13 19H19V13H13V19ZM13 5V11H19V5H13Z" })
                  ])) : item.icon === "booking" ? (openBlock(), createBlock("svg", {
                    key: 1,
                    width: "20",
                    height: "20",
                    viewBox: "0 0 24 24",
                    fill: "currentColor"
                  }, [
                    createVNode("path", { d: "M6 3C4.9 3 4 3.9 4 5V21L12 17L20 21V5C20 3.9 19.1 3 18 3H6ZM6 5H18V17.97L12 15.2L6 17.97V5Z" })
                  ])) : createCommentVNode("", true)
                ], 2),
                createVNode("span", { class: "flex-1 whitespace-nowrap" }, toDisplayString(item.label), 1),
                isActive(item) ? (openBlock(), createBlock("span", {
                  key: 1,
                  class: "w-2 h-2 rounded-full bg-white shadow-sm"
                })) : createCommentVNode("", true)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</li>`);
      });
      _push(`<!--]--><li><button type="button" class="${ssrRenderClass([[
        isMenuLainnyaActive.value ? "bg-blue-600 text-white shadow-sm" : "text-blue-200 [@media(hover:hover)]:hover:bg-ds-blue-800 [@media(hover:hover)]:hover:text-white"
      ], "group w-full relative flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200"])}">`);
      if (isMenuLainnyaActive.value) {
        _push(`<span class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<span class="${ssrRenderClass([[isMenuLainnyaActive.value ? "text-white" : "text-blue-300 [@media(hover:hover)]:group-hover:text-white"], "w-5 h-5 flex-shrink-0 transition-transform duration-200"])}"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"></path></svg></span><span class="flex-1 whitespace-nowrap text-left">Master</span><svg class="${ssrRenderClass([[isMenuLainnyaOpen.value ? "rotate-180" : "", isMenuLainnyaActive.value ? "text-white" : "text-blue-300"], "w-4 h-4 transition-transform duration-300 ease-out"])}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path></svg></button><ul class="mt-1 ml-4 space-y-1 overflow-hidden" style="${ssrRenderStyle(isMenuLainnyaOpen.value ? null : { display: "none" })}"><!--[-->`);
      ssrRenderList(menuLainnya, (item) => {
        _push(`<li>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: item.to,
          onClick: handleNavClick,
          class: ["group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200", [
            isActive(item) ? "bg-blue-500 text-white shadow-sm" : "text-blue-200 [@media(hover:hover)]:hover:bg-ds-blue-800 [@media(hover:hover)]:hover:text-white"
          ]],
          "aria-current": isActive(item) ? "page" : void 0
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="${ssrRenderClass([[isActive(item) ? "text-white" : "text-blue-300 [@media(hover:hover)]:group-hover:text-white"], "w-4 h-4 flex-shrink-0 transition-transform duration-200"])}"${_scopeId}>`);
              if (item.icon === "stadium") {
                _push2(`<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"${_scopeId}><path d="M12 3C6.48 3 2 5.24 2 8V12C2 14.76 6.48 17 12 17C17.52 17 22 14.76 22 12V8C22 5.24 17.52 3 12 3ZM4 8C4 6.34 7.58 5 12 5C16.42 5 20 6.34 20 8C20 9.66 16.42 11 12 11C7.58 11 4 9.66 4 8ZM20 12C20 12.24 19.94 12.48 19.8 12.71C18.92 14.15 15.78 15 12 15C8.22 15 5.08 14.15 4.2 12.71C4.06 12.48 4 12.24 4 12V10.74C5.77 11.64 8.64 12.25 12 12.25C15.36 12.25 18.23 11.64 20 10.74V12Z"${_scopeId}></path></svg>`);
              } else if (item.icon === "field") {
                _push2(`<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"${_scopeId}><path d="M4 5C2.9 5 2 5.9 2 7V17C2 18.1 2.9 19 4 19H20C21.1 19 22 18.1 22 17V7C22 5.9 21.1 5 20 5H4ZM4 7H11V17H4V7ZM13 7H20V17H13V7ZM9 9C8.45 9 8 9.45 8 10C8 10.55 8.45 11 9 11C9.55 11 10 10.55 10 10C10 9.45 9.55 9 9 9ZM15 9C14.45 9 14 9.45 14 10C14 10.55 14.45 11 15 11C15.55 11 16 10.55 16 10C16 9.45 15.55 9 15 9Z"${_scopeId}></path></svg>`);
              } else if (item.icon === "facility") {
                _push2(`<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"${_scopeId}><path d="M11 19V17H13V19H11ZM11 15V13H13V15H11ZM7 15V13H9V15H7ZM7 11V9H9V11H7ZM11 11V9H13V11H11ZM15 11V9H17V11H15ZM15 7V5H17V7H15ZM11 7V5H13V7H11ZM5 7V5H7V7H5ZM5 11V9H3V11H5ZM5 15V13H3V15H5ZM5 19V17H3V19H5ZM15 19V17H17V19H15ZM19 19V17H21V19H19ZM19 15V13H21V15H19ZM19 11V9H21V11H19ZM19 7V5H21V7H19ZM15 3V5H9V3H15Z"${_scopeId}></path></svg>`);
              } else if (item.icon === "schedule") {
                _push2(`<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"${_scopeId}><path d="M7 3V5H5C3.9 5 3 5.9 3 7V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V7C21 5.9 20.1 5 19 5H17V3H15V5H9V3H7ZM5 9H19V19H5V9ZM7 11V13H12V11H7ZM13 11V13H17V11H13ZM7 15V17H12V15H7ZM13 15V17H17V15H13Z"${_scopeId}></path></svg>`);
              } else if (item.icon === "option") {
                _push2(`<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"${_scopeId}><path d="M19.14 12.94c.04-.3.06-.61.06-.94c0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94L14.4 2.81c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6s3.6 1.62 3.6 3.6s-1.62 3.6-3.6 3.6z"${_scopeId}></path></svg>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</span><span class="flex-1 whitespace-nowrap text-xs"${_scopeId}>${ssrInterpolate(item.label)}</span>`);
              if (isActive(item)) {
                _push2(`<span class="w-2 h-2 rounded-full bg-white shadow-sm"${_scopeId}></span>`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                createVNode("span", {
                  class: ["w-4 h-4 flex-shrink-0 transition-transform duration-200", [isActive(item) ? "text-white" : "text-blue-300 [@media(hover:hover)]:group-hover:text-white"]]
                }, [
                  item.icon === "stadium" ? (openBlock(), createBlock("svg", {
                    key: 0,
                    width: "16",
                    height: "16",
                    viewBox: "0 0 24 24",
                    fill: "currentColor"
                  }, [
                    createVNode("path", { d: "M12 3C6.48 3 2 5.24 2 8V12C2 14.76 6.48 17 12 17C17.52 17 22 14.76 22 12V8C22 5.24 17.52 3 12 3ZM4 8C4 6.34 7.58 5 12 5C16.42 5 20 6.34 20 8C20 9.66 16.42 11 12 11C7.58 11 4 9.66 4 8ZM20 12C20 12.24 19.94 12.48 19.8 12.71C18.92 14.15 15.78 15 12 15C8.22 15 5.08 14.15 4.2 12.71C4.06 12.48 4 12.24 4 12V10.74C5.77 11.64 8.64 12.25 12 12.25C15.36 12.25 18.23 11.64 20 10.74V12Z" })
                  ])) : item.icon === "field" ? (openBlock(), createBlock("svg", {
                    key: 1,
                    width: "16",
                    height: "16",
                    viewBox: "0 0 24 24",
                    fill: "currentColor"
                  }, [
                    createVNode("path", { d: "M4 5C2.9 5 2 5.9 2 7V17C2 18.1 2.9 19 4 19H20C21.1 19 22 18.1 22 17V7C22 5.9 21.1 5 20 5H4ZM4 7H11V17H4V7ZM13 7H20V17H13V7ZM9 9C8.45 9 8 9.45 8 10C8 10.55 8.45 11 9 11C9.55 11 10 10.55 10 10C10 9.45 9.55 9 9 9ZM15 9C14.45 9 14 9.45 14 10C14 10.55 14.45 11 15 11C15.55 11 16 10.55 16 10C16 9.45 15.55 9 15 9Z" })
                  ])) : item.icon === "facility" ? (openBlock(), createBlock("svg", {
                    key: 2,
                    width: "16",
                    height: "16",
                    viewBox: "0 0 24 24",
                    fill: "currentColor"
                  }, [
                    createVNode("path", { d: "M11 19V17H13V19H11ZM11 15V13H13V15H11ZM7 15V13H9V15H7ZM7 11V9H9V11H7ZM11 11V9H13V11H11ZM15 11V9H17V11H15ZM15 7V5H17V7H15ZM11 7V5H13V7H11ZM5 7V5H7V7H5ZM5 11V9H3V11H5ZM5 15V13H3V15H5ZM5 19V17H3V19H5ZM15 19V17H17V19H15ZM19 19V17H21V19H19ZM19 15V13H21V15H19ZM19 11V9H21V11H19ZM19 7V5H21V7H19ZM15 3V5H9V3H15Z" })
                  ])) : item.icon === "schedule" ? (openBlock(), createBlock("svg", {
                    key: 3,
                    width: "16",
                    height: "16",
                    viewBox: "0 0 24 24",
                    fill: "currentColor"
                  }, [
                    createVNode("path", { d: "M7 3V5H5C3.9 5 3 5.9 3 7V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V7C21 5.9 20.1 5 19 5H17V3H15V5H9V3H7ZM5 9H19V19H5V9ZM7 11V13H12V11H7ZM13 11V13H17V11H13ZM7 15V17H12V15H7ZM13 15V17H17V15H13Z" })
                  ])) : item.icon === "option" ? (openBlock(), createBlock("svg", {
                    key: 4,
                    width: "16",
                    height: "16",
                    viewBox: "0 0 24 24",
                    fill: "currentColor"
                  }, [
                    createVNode("path", { d: "M19.14 12.94c.04-.3.06-.61.06-.94c0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94L14.4 2.81c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6s3.6 1.62 3.6 3.6s-1.62 3.6-3.6 3.6z" })
                  ])) : createCommentVNode("", true)
                ], 2),
                createVNode("span", { class: "flex-1 whitespace-nowrap text-xs" }, toDisplayString(item.label), 1),
                isActive(item) ? (openBlock(), createBlock("span", {
                  key: 0,
                  class: "w-2 h-2 rounded-full bg-white shadow-sm"
                })) : createCommentVNode("", true)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</li>`);
      });
      _push(`<!--]--></ul></li></ul></nav><nav class="px-4 pb-6 border-t border-ds-blue-800" aria-label="Akun"><div class="pt-6"><ul class="space-y-1"><!--[-->`);
      ssrRenderList(secondaryNav, (item) => {
        _push(`<li>`);
        if (!item.to) {
          _push(`<button type="button" class="group w-full relative flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 text-red-300 [@media(hover:hover)]:hover:bg-red-500/10 [@media(hover:hover)]:hover:text-red-200 disabled:opacity-50 disabled:cursor-wait"${ssrIncludeBooleanAttr(logoutLoading.value) ? " disabled" : ""}><span class="w-5 h-5 flex-shrink-0 transition-all duration-200 [@media(hover:hover)]:group-hover:scale-110 opacity-80 [@media(hover:hover)]:group-hover:opacity-100">`);
          if (!logoutLoading.value) {
            _push(`<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M16 13V11H8V8L3 12L8 16V13H16ZM20 3H12V5H20V19H12V21H20C21.1 21 22 20.1 22 19V5C22 3.9 21.1 3 20 3Z"></path></svg>`);
          } else {
            _push(`<svg class="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`);
          }
          _push(`</span><span class="flex-1 whitespace-nowrap text-left">${ssrInterpolate(logoutLoading.value ? "Logging out..." : item.label)}</span></button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</li>`);
      });
      _push(`<!--]--></ul></div></nav></aside>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/admin/AdminSidebar.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main$3, { __name: "AdminSidebar" });
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "TopBar",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    useRouter();
    const { isSidebarOpen } = useAdminLayout();
    const { data: me } = ([__temp, __restore] = withAsyncContext(() => useFetch("/api/auth/me", { method: "GET" }, "$RClMjtIlPE")), __temp = await __temp, __restore(), __temp);
    const nameMapping = {
      "stadiums": "Stadion",
      "fields": "Lapangan",
      "facilities": "Fasilitas",
      "bookings": "Booking",
      "schedules": "Jadwal",
      "create": "Tambah Baru",
      "edit": "Edit",
      "detail": "Riwayat",
      "history": "Riwayat",
      "payment": "Laporan Pembayaran",
      "options": "Pengaturan"
    };
    const dynamicNames = ref({});
    watch(() => route.path, async (newPath) => {
      const params = route.params;
      if (!params.id) return;
      const id = String(params.id);
      let type = "";
      if (newPath.includes("/stadiums/")) type = "stadions";
      else if (newPath.includes("/fields/")) type = "fields";
      else if (newPath.includes("/facilities/")) type = "facilities";
      else if (newPath.includes("/bookings/") && !newPath.includes("/bookings/order")) type = "stadions";
      if (type) {
        const key = `${type}-${id}`;
        if (dynamicNames.value[key]) return;
        try {
          const data = await $fetch(`/api/${type}/${id}`);
          if (data && data.name) {
            dynamicNames.value[key] = data.name;
          } else {
            dynamicNames.value[key] = id;
          }
        } catch (e) {
          console.error(`Failed to fetch name for ${type} ${id}`, e);
          dynamicNames.value[key] = id;
        }
      }
    }, { immediate: true });
    const breadcrumbs = computed(() => {
      const pathParts = route.path.split("/").filter((p) => p && p !== "admin");
      const crumbs = [{ name: "Dashboard", to: "/admin", isLast: pathParts.length === 0 }];
      let currentPath = "/admin";
      pathParts.forEach((part, index) => {
        currentPath += `/${part}`;
        let displayName = nameMapping[part] || part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, " ");
        if (part === String(route.params.id)) {
          const prevPart = pathParts[index - 1];
          let type = "";
          if (prevPart === "stadiums") type = "stadions";
          else if (prevPart === "fields") type = "fields";
          else if (prevPart === "facilities") type = "facilities";
          else if (prevPart === "bookings") type = "stadions";
          const key = `${type}-${part}`;
          const name = dynamicNames.value[key];
          if (type) {
            if (name) {
              displayName = name;
            } else {
              displayName = "...";
            }
          }
        }
        if (part === "fields" && index === pathParts.length - 1 && route.params.id) {
          displayName = `Lapangan`;
        }
        let crumbTo = currentPath;
        if (part === "detail") {
          crumbTo = "/admin/bookings/history";
        }
        crumbs.push({
          name: displayName,
          to: crumbTo,
          isLast: index === pathParts.length - 1
        });
      });
      return crumbs;
    });
    const topbarLogoutLoading = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<header${ssrRenderAttrs(mergeProps({ class: "sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm" }, _attrs))}><div class="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8"><div class="flex items-center gap-3 sm:gap-4 min-w-0 flex-1"><button type="button" class="lg:hidden relative flex items-center justify-center h-10 w-10 rounded-lg text-gray-700 [@media(hover:hover)]:hover:bg-gradient-to-br [@media(hover:hover)]:hover:from-blue-50 [@media(hover:hover)]:hover:to-indigo-50 [@media(hover:hover)]:hover:text-blue-600 transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" aria-label="Buka sidebar"><div class="relative h-5 w-5"><svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M4 6h16" class="${ssrRenderClass([{ "rotate-45 translate-y-1.5": unref(isSidebarOpen) }, "transition-all duration-300 ease-out origin-center"])}"></path><path d="M4 12h16" class="${ssrRenderClass([{ "opacity-0 scale-75": unref(isSidebarOpen) }, "transition-all duration-200 ease-out"])}"></path><path d="M4 18h16" class="${ssrRenderClass([{ "-rotate-45 -translate-y-1.5": unref(isSidebarOpen) }, "transition-all duration-300 ease-out origin-center"])}"></path></svg></div></button><nav class="hidden lg:flex items-center text-sm font-medium min-w-0" aria-label="Breadcrumb"><ol class="flex items-center gap-1.5 text-gray-600 min-w-0"><!--[-->`);
      ssrRenderList(breadcrumbs.value, (crumb, index) => {
        _push(`<li class="flex items-center gap-1.5 min-w-0">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: crumb.to,
          class: [
            "transition-all duration-200 px-2.5 py-1.5 rounded-md truncate",
            crumb.isLast ? "text-gray-900 font-semibold bg-gradient-to-br from-blue-50 to-indigo-50 pointer-events-none" : "[@media(hover:hover)]:hover:text-blue-600 [@media(hover:hover)]:hover:bg-gray-50"
          ],
          "aria-current": crumb.isLast ? "page" : void 0
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(crumb.name)}`);
            } else {
              return [
                createTextVNode(toDisplayString(crumb.name), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        if (!crumb.isLast) {
          _push(`<svg class="h-4 w-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"></path></svg>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</li>`);
      });
      _push(`<!--]--></ol></nav><div class="lg:hidden flex items-center min-w-0"><span class="text-sm font-semibold text-gray-900 truncate">${ssrInterpolate(breadcrumbs.value[breadcrumbs.value.length - 1]?.name)}</span></div></div><div class="flex items-center gap-2 sm:gap-3"><button type="button"${ssrIncludeBooleanAttr(topbarLogoutLoading.value) ? " disabled" : ""} class="group flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 text-gray-700 bg-gray-100 [@media(hover:hover)]:hover:bg-red-50 [@media(hover:hover)]:hover:text-red-600 [@media(hover:hover)]:hover:shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-wait disabled:[@media(hover:hover)]:hover:scale-100 border border-gray-200 [@media(hover:hover)]:hover:border-red-200">`);
      if (!topbarLogoutLoading.value) {
        _push(`<svg class="w-4 h-4 transition-transform duration-200 [@media(hover:hover)]:group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M16 13V11H8V8L3 12L8 16V13H16ZM20 3H12V5H20V19H12V21H20C21.1 21 22 20.1 22 19V5C22 3.9 21.1 3 20 3Z"></path></svg>`);
      } else {
        _push(`<svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`);
      }
      _push(`<span class="hidden sm:inline">${ssrInterpolate(topbarLogoutLoading.value ? "Keluar..." : "Logout")}</span></button></div></div></header>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/admin/TopBar.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_2 = Object.assign(_sfc_main$2, { __name: "AdminTopBar" });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "Footer",
  __ssrInlineRender: true,
  setup(__props) {
    const { options } = useAppOptions();
    const venueName = computed(() => options.value.data?.name || "VENUE UNDIP");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<footer${ssrRenderAttrs(mergeProps({ class: "relative bg-gradient-to-br from-gray-50 via-white to-gray-50 border-t border-gray-200/80 shadow-inner" }, _attrs))}><div class="absolute inset-0 bg-[url(&#39;data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMCwwLDAsMC4wMikiLz48L3N2Zz4=&#39;)] opacity-40"></div><div class="relative max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8"><div class="flex flex-col sm:flex-row items-center justify-between gap-4"><div class="flex items-center gap-3"><img${ssrRenderAttr("src", _imports_0)} alt="Venue UNDIP Logo" class="h-8 w-8 object-contain drop-shadow-sm"><div class="flex flex-col"><p class="text-sm font-bold text-gray-900 leading-tight">${ssrInterpolate(venueName.value)}</p><p class="text-xs text-gray-500 leading-tight"> © ${ssrInterpolate((/* @__PURE__ */ new Date()).getFullYear())} Admin Panel v1.0 </p></div></div><div class="flex items-center gap-6 text-xs text-gray-600"><div class="flex items-center gap-1.5 group cursor-help" title="System Status"><div class="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div><span class="font-medium [@media(hover:hover)]:group-hover:text-green-600 transition-colors">System Online</span></div><span class="hidden sm:inline text-gray-400">•</span><p class="hidden sm:block font-medium text-gray-500"> Dikembangkan dengan <span class="text-red-500">❤</span> untuk Universitas Diponegoro </p></div></div></div></footer>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/admin/Footer.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_3 = Object.assign(_sfc_main$1, { __name: "AdminFooter" });
const WARNING_THRESHOLD = 5 * 60;
const useAuthSession = () => {
  const isAuthenticated = ref(false);
  const sessionExpiry = ref(null);
  const timeRemaining = ref(0);
  let warningShown = false;
  const isExpiringSoon = computed(() => {
    return timeRemaining.value > 0 && timeRemaining.value <= WARNING_THRESHOLD;
  });
  const checkSession = async () => {
    try {
      const data = await $fetch("/api/auth/me", {
        method: "GET",
        credentials: "include"
      });
      if (!data?.authenticated) {
        isAuthenticated.value = false;
        sessionExpiry.value = null;
        return false;
      }
      isAuthenticated.value = true;
      if (data.expiresAt) {
        sessionExpiry.value = data.expiresAt;
      } else {
        sessionExpiry.value = Date.now() + AUTH.TOKEN_MAX_AGE * 1e3;
      }
      return true;
    } catch {
      isAuthenticated.value = false;
      return false;
    }
  };
  const refreshSession = async () => {
    try {
      const isValid = await checkSession();
      if (isValid) {
        warningShown = false;
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };
  const logout = async () => {
    try {
      await $fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include"
      });
    } catch {
    } finally {
      isAuthenticated.value = false;
      sessionExpiry.value = null;
      await navigateTo("/admin/login");
    }
  };
  const startMonitoring = () => {
    checkSession();
    setInterval();
  };
  return {
    isAuthenticated,
    timeRemaining,
    isExpiringSoon,
    checkSession,
    refreshSession,
    logout,
    startMonitoring
  };
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "admin",
  __ssrInlineRender: true,
  setup(__props) {
    const { isSidebarOpen } = useAdminLayout();
    const {
      isExpiringSoon,
      timeRemaining
    } = useAuthSession();
    const confirmModal = ref(null);
    const showSessionWarning = ref(false);
    const formattedTimeRemaining = computed(() => {
      const seconds = timeRemaining.value;
      const minutes = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${minutes} menit ${secs} detik`;
    });
    watch(isExpiringSoon, (expiring) => {
      if (expiring) {
        showSessionWarning.value = true;
      } else {
        showSessionWarning.value = false;
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ConfirmationModal = __nuxt_component_0;
      const _component_AdminSidebar = __nuxt_component_1;
      const _component_AdminTopBar = __nuxt_component_2;
      const _component_AdminFooter = __nuxt_component_3;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex min-h-screen overflow-x-clip" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_ConfirmationModal, {
        ref_key: "confirmModal",
        ref: confirmModal
      }, null, _parent));
      ssrRenderTeleport(_push, (_push2) => {
        if (showSessionWarning.value) {
          _push2(`<div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"><div class="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-[scale-in_0.2s_ease-out]"><div class="flex items-center gap-3"><div class="flex-shrink-0 w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center"><svg class="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg></div><div><h3 class="text-lg font-semibold text-gray-900">Sesi Akan Berakhir</h3><p class="text-sm text-gray-500">${ssrInterpolate(formattedTimeRemaining.value)}</p></div></div><p class="text-gray-600 text-sm"> Sesi Anda akan berakhir dalam waktu singkat. Klik tombol di bawah untuk memperpanjang sesi atau Anda akan otomatis logout. </p><div class="flex gap-3"><button class="flex-1 px-4 py-2.5 bg-blue-600 [@media(hover:hover)]:hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"> Perpanjang Sesi </button><button class="px-4 py-2.5 bg-gray-100 [@media(hover:hover)]:hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"> Logout </button></div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(ssrRenderComponent(_component_AdminSidebar, null, null, _parent));
      if (unref(isSidebarOpen)) {
        _push(`<div class="fixed inset-0 z-[60] bg-black/50 lg:hidden" aria-hidden="true"></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex-1 min-w-0 flex flex-col lg:pl-64 min-h-screen">`);
      _push(ssrRenderComponent(_component_AdminTopBar, null, null, _parent));
      _push(`<main class="flex-1 min-w-0 p-6 sm:p-8 bg-gray-100">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main>`);
      _push(ssrRenderComponent(_component_AdminFooter, null, null, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/admin.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=admin-kOjSwZ83.mjs.map
