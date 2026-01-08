import { a as useRoute, u as useRouter, _ as __nuxt_component_0$1 } from './server.mjs';
import { defineComponent, useSSRContext, ref, mergeProps, withCtx, createBlock, createVNode, openBlock, createTextVNode } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderComponent, ssrInterpolate, ssrRenderTeleport, ssrRenderSlot } from 'vue/server-renderer';
import { _ as _imports_0 } from './VENUE-UNDIP-LOGO-C_mmPH8T.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
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
import 'vue-router';

const _imports_1 = "" + __buildAssetsURL("icon-badminton.FzaqMlDK.png");
const _imports_2 = "" + __buildAssetsURL("icon-football.DjpYSn94.png");
const _imports_3 = "" + __buildAssetsURL("icon-basket.x9meY51K.png");
const _imports_4 = "" + __buildAssetsURL("icon-futsal.BOYPlxnb.png");
const _imports_5 = "" + __buildAssetsURL("icon-tenis.B6dAMh7A.png");
const _imports_6 = "" + __buildAssetsURL("icon-voli.B57vPpBS.png");
const _imports_7 = "" + __buildAssetsURL("icon-karate.BkEFj8P9.png");
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "TopBar",
  __ssrInlineRender: true,
  setup(__props) {
    useRoute();
    useRouter();
    const isScrolled = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<header${ssrRenderAttrs(mergeProps({
        class: [
          "sticky top-0 z-[60] bg-gradient-to-br from-[#f5f7fb] via-[#f8fafc] to-[#f5f7fb] backdrop-blur-sm border-b border-gray-200/50 transition-shadow duration-300",
          isScrolled.value ? "shadow-lg" : "shadow-sm"
        ]
      }, _attrs))}><div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5"><div class="flex items-center justify-between gap-3 lg:gap-6"><button class="group flex items-center gap-2.5 sm:gap-3 flex-shrink-0 text-left transition-all duration-300 cursor-pointer"><img${ssrRenderAttr("src", _imports_0)} alt="Venue UNDIP Logo" class="h-10 w-10 sm:h-12 sm:w-14 object-contain flex-shrink-0 group-hover:scale-105 transition-all duration-300 drop-shadow-lg"><div class="min-w-0"><div class="text-lg sm:text-2xl font-bold tracking-tight text-[#1f2a56] truncate group-hover:text-[#0f1a3c] transition-colors duration-300">VENUE UNDIP</div><div class="hidden sm:block text-xs text-gray-500 font-medium truncate group-hover:text-gray-700 transition-colors duration-300">Booking Lapangan Olahraga Universitas Diponegoro</div></div></button><div class="hidden lg:flex items-center gap-3 xl:gap-14 flex-1 justify-center px-6"><div class="relative group"><img${ssrRenderAttr("src", _imports_1)} alt="Badminton" class="h-7 w-7 xl:h-8 xl:w-8 object-contain opacity-40 grayscale group-hover:opacity-70 group-hover:grayscale-0 group-hover:-translate-y-1 transition-all duration-300 cursor-pointer"><span class="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Smash!</span></div><div class="relative group"><img${ssrRenderAttr("src", _imports_2)} alt="Football" class="h-7 w-7 xl:h-8 xl:w-8 object-contain opacity-40 grayscale group-hover:opacity-70 group-hover:grayscale-0 group-hover:-translate-y-1 transition-all duration-300 cursor-pointer"><span class="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Siuu!</span></div><div class="relative group"><img${ssrRenderAttr("src", _imports_3)} alt="Basketball" class="h-7 w-7 xl:h-8 xl:w-8 object-contain opacity-40 grayscale group-hover:opacity-70 group-hover:grayscale-0 group-hover:-translate-y-1 transition-all duration-300 cursor-pointer"><span class="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Dunk!</span></div><div class="relative group"><img${ssrRenderAttr("src", _imports_4)} alt="Futsal" class="h-7 w-7 xl:h-8 xl:w-8 object-contain opacity-40 grayscale group-hover:opacity-70 group-hover:grayscale-0 group-hover:-translate-y-1 transition-all duration-300 cursor-pointer"><span class="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Shoot!</span></div><div class="relative group"><img${ssrRenderAttr("src", _imports_5)} alt="Tennis" class="h-7 w-7 xl:h-8 xl:w-8 object-contain opacity-40 grayscale group-hover:opacity-70 group-hover:grayscale-0 group-hover:-translate-y-1 transition-all duration-300 cursor-pointer"><span class="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Ace!</span></div><div class="relative group"><img${ssrRenderAttr("src", _imports_6)} alt="Volleyball" class="h-7 w-7 xl:h-8 xl:w-8 object-contain opacity-40 grayscale group-hover:opacity-70 group-hover:grayscale-0 group-hover:-translate-y-1 transition-all duration-300 cursor-pointer"><span class="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Spike!</span></div><div class="relative group"><img${ssrRenderAttr("src", _imports_7)} alt="Karate" class="h-7 w-7 xl:h-8 xl:w-8 object-contain opacity-40 -scale-x-100 grayscale group-hover:opacity-70 group-hover:grayscale-0 group-hover:-translate-y-1 transition-all duration-300 cursor-pointer"><span class="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Shaah!</span></div></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/login",
        class: "sm:hidden group flex flex-col items-center justify-center gap-0.5 rounded-xl bg-gradient-to-r from-[#1f2a56] to-[#0f1a3c] px-3 py-2 text-white shadow-lg shadow-[#1f2a56]/25 transition-all duration-300 hover:shadow-xl hover:shadow-[#1f2a56]/35 hover:scale-105 flex-shrink-0"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg class="h-4 w-4 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"${_scopeId}></path></svg><span class="text-[10px] font-bold leading-none"${_scopeId}>Admin</span>`);
          } else {
            return [
              (openBlock(), createBlock("svg", {
                class: "h-4 w-4 transition-transform group-hover:rotate-12",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "2",
                viewBox: "0 0 24 24"
              }, [
                createVNode("path", {
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                  d: "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                })
              ])),
              createVNode("span", { class: "text-[10px] font-bold leading-none" }, "Admin")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/login",
        class: "hidden sm:inline-flex group items-center gap-2 rounded-xl bg-gradient-to-r from-[#1f2a56] to-[#0f1a3c] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#1f2a56]/25 transition-all duration-300 hover:shadow-xl hover:shadow-[#1f2a56]/35 hover:-translate-y-0.5 flex-shrink-0"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg class="h-4 w-4 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"${_scopeId}></path></svg> Login Admin `);
          } else {
            return [
              (openBlock(), createBlock("svg", {
                class: "h-4 w-4 transition-transform group-hover:rotate-12",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "2",
                viewBox: "0 0 24 24"
              }, [
                createVNode("path", {
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                  d: "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                })
              ])),
              createTextVNode(" Login Admin ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></header>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/client/TopBar.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main$2, { __name: "ClientTopBar" });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "Footer",
  __ssrInlineRender: true,
  setup(__props) {
    useRoute();
    useRouter();
    const isComingSoonModalOpen = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<footer${ssrRenderAttrs(mergeProps({ class: "mt-16 bg-gradient-to-br from-[#0f1f4a] via-[#1a2d5a] to-[#0f1f4a] text-white" }, _attrs))} data-v-f30e70c3><div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16" data-v-f30e70c3><div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 mb-12" data-v-f30e70c3><div class="space-y-4" data-v-f30e70c3><div class="flex items-center gap-3" data-v-f30e70c3><img${ssrRenderAttr("src", _imports_0)} alt="Venue UNDIP Logo" class="h-10 w-10 object-contain drop-shadow-lg" data-v-f30e70c3><div data-v-f30e70c3><p class="text-lg font-bold leading-tight" data-v-f30e70c3>VENUE UNDIP</p><p class="text-xs text-blue-200/70" data-v-f30e70c3>Booking Lapangan</p></div></div><p class="text-sm text-blue-100/80 leading-relaxed" data-v-f30e70c3>Platform booking lapangan olahraga terpercaya untuk Sivitas Akademika Universitas Diponegoro.</p></div><div class="space-y-4" data-v-f30e70c3><h3 class="text-sm font-bold uppercase tracking-wider text-white mb-4" data-v-f30e70c3>Navigasi</h3><ul class="space-y-2.5" data-v-f30e70c3><li data-v-f30e70c3><button class="group inline-flex items-center gap-2 text-sm text-blue-100/80 hover:text-white transition-all duration-200" data-v-f30e70c3><span class="relative" data-v-f30e70c3> Beranda <span class="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300" data-v-f30e70c3></span></span></button></li><li data-v-f30e70c3><button class="group inline-flex items-center gap-2 text-sm text-blue-100/80 hover:text-white transition-all duration-200" data-v-f30e70c3><span class="relative" data-v-f30e70c3> Stadion <span class="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300" data-v-f30e70c3></span></span></button></li><li data-v-f30e70c3>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/login",
        class: "group inline-flex items-center gap-2 text-sm text-blue-100/80 hover:text-white transition-all duration-200"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="relative" data-v-f30e70c3${_scopeId}> Admin Panel <span class="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300" data-v-f30e70c3${_scopeId}></span></span>`);
          } else {
            return [
              createVNode("span", { class: "relative" }, [
                createTextVNode(" Admin Panel "),
                createVNode("span", { class: "absolute -bottom-0.5 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300" })
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li></ul></div><div class="space-y-4" data-v-f30e70c3><h3 class="text-sm font-bold uppercase tracking-wider text-white mb-4" data-v-f30e70c3>Bantuan</h3><ul class="space-y-2.5" data-v-f30e70c3><li data-v-f30e70c3><a href="https://helpdesk.undip.ac.id" target="_blank" rel="noopener noreferrer" class="group inline-flex items-center gap-2 text-sm text-blue-100/80 hover:text-white transition-all duration-200" data-v-f30e70c3><span class="relative" data-v-f30e70c3> Pusat Bantuan <span class="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300" data-v-f30e70c3></span></span></a></li><li data-v-f30e70c3>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/bantuan/panduan-booking",
        class: "group inline-flex items-center gap-2 text-sm text-blue-100/80 hover:text-white transition-all duration-200"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="relative" data-v-f30e70c3${_scopeId}> Panduan Booking <span class="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300" data-v-f30e70c3${_scopeId}></span></span>`);
          } else {
            return [
              createVNode("span", { class: "relative" }, [
                createTextVNode(" Panduan Booking "),
                createVNode("span", { class: "absolute -bottom-0.5 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300" })
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li data-v-f30e70c3>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/bantuan/kebijakan-privasi",
        class: "group inline-flex items-center gap-2 text-sm text-blue-100/80 hover:text-white transition-all duration-200"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="relative" data-v-f30e70c3${_scopeId}> Kebijakan Privasi <span class="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300" data-v-f30e70c3${_scopeId}></span></span>`);
          } else {
            return [
              createVNode("span", { class: "relative" }, [
                createTextVNode(" Kebijakan Privasi "),
                createVNode("span", { class: "absolute -bottom-0.5 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300" })
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li data-v-f30e70c3>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/bantuan/syarat-ketentuan",
        class: "group inline-flex items-center gap-2 text-sm text-blue-100/80 hover:text-white transition-all duration-200"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="relative" data-v-f30e70c3${_scopeId}> Syarat &amp; Ketentuan <span class="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300" data-v-f30e70c3${_scopeId}></span></span>`);
          } else {
            return [
              createVNode("span", { class: "relative" }, [
                createTextVNode(" Syarat & Ketentuan "),
                createVNode("span", { class: "absolute -bottom-0.5 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300" })
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li></ul></div><div class="space-y-4" data-v-f30e70c3><h3 class="text-sm font-bold uppercase tracking-wider text-white mb-4" data-v-f30e70c3>Hubungi Kami</h3><ul class="space-y-3" data-v-f30e70c3><li class="group flex items-start gap-3" data-v-f30e70c3><svg class="h-5 w-5 text-blue-300 flex-shrink-0 mt-0.5 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-f30e70c3><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" data-v-f30e70c3></path></svg><a href="mailto:helpdesk@live.undip.ac.id" class="text-sm text-blue-100/80 hover:text-white transition-colors duration-200 break-all hover:underline underline-offset-2" data-v-f30e70c3>helpdesk@live.undip.ac.id</a></li><li class="group flex items-start gap-3" data-v-f30e70c3><svg class="h-5 w-5 text-blue-300 flex-shrink-0 mt-0.5 group-hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24" data-v-f30e70c3><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" data-v-f30e70c3></path></svg><a href="https://wa.me/6285165660339" target="_blank" rel="noopener noreferrer" class="text-sm text-blue-100/80 hover:text-white transition-colors duration-200 hover:underline underline-offset-2" data-v-f30e70c3>+62 851 6566 0339</a></li><li class="group flex items-start gap-3" data-v-f30e70c3><svg class="h-5 w-5 text-blue-300 flex-shrink-0 mt-0.5 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-f30e70c3><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" data-v-f30e70c3></path><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" data-v-f30e70c3></path></svg><a href="https://maps.google.com/?q=Universitas+Diponegoro+Tembalang+Semarang" target="_blank" rel="noopener noreferrer" class="text-sm text-blue-100/80 hover:text-white transition-colors duration-200 hover:underline underline-offset-2" data-v-f30e70c3>Jl. Prof. Soedarto, Tembalang, Kec. Tembalang, Kota Semarang, Jawa Tengah</a></li></ul></div></div><div class="border-t border-white/10" data-v-f30e70c3></div><div class="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4" data-v-f30e70c3><p class="text-sm text-blue-100/70 text-center sm:text-left" data-v-f30e70c3> © ${ssrInterpolate((/* @__PURE__ */ new Date()).getFullYear())} VENUE UNDIP. Semua hak cipta dilindungi. Dikembangkan dengan <span class="text-red-400" data-v-f30e70c3>❤</span> untuk Sivitas Akademika Universitas Diponegoro. </p><div class="flex items-center gap-3" data-v-f30e70c3><a href="https://undip.ac.id" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-110 hover:-translate-y-1" title="Website Resmi UNDIP" data-v-f30e70c3><svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-f30e70c3><path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" data-v-f30e70c3></path></svg></a><a href="https://www.facebook.com/undip.official" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-110 hover:-translate-y-1" title="Facebook" data-v-f30e70c3><svg class="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24" data-v-f30e70c3><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" data-v-f30e70c3></path></svg></a><a href="https://www.instagram.com/undip.official" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-110 hover:-translate-y-1" title="Instagram" data-v-f30e70c3><svg class="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24" data-v-f30e70c3><path d="M12 0C5.373 0 0 5.373 0 12c0 6.627 5.373 12 12 12s12-5.373 12-12c0-6.627-5.373-12-12-12zm0 2.25c5.385 0 9.75 4.365 9.75 9.75s-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12 6.615 2.25 12 2.25zm0 1.688c-4.454 0-8.062 3.608-8.062 8.062S7.546 20.062 12 20.062s8.062-3.608 8.062-8.062S16.454 3.938 12 3.938zm0 1.312c3.727 0 6.75 3.023 6.75 6.75s-3.023 6.75-6.75 6.75-6.75-3.023-6.75-6.75 3.023-6.75 6.75-6.75zm3.938-1.312c-.58 0-1.05.47-1.05 1.05s.47 1.05 1.05 1.05 1.05-.47 1.05-1.05-.47-1.05-1.05-1.05z" data-v-f30e70c3></path></svg></a><a href="https://x.com/undip" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-110 hover:-translate-y-1" title="X (Twitter)" data-v-f30e70c3><svg class="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24" data-v-f30e70c3><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" data-v-f30e70c3></path></svg></a><a href="https://www.tiktok.com/@undip.official" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-110 hover:-translate-y-1" title="TikTok" data-v-f30e70c3><svg class="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24" data-v-f30e70c3><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" data-v-f30e70c3></path></svg></a><a href="http://www.youtube.com/@UndipTV" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-110 hover:-translate-y-1" title="YouTube" data-v-f30e70c3><svg class="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24" data-v-f30e70c3><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" data-v-f30e70c3></path></svg></a></div></div></div>`);
      ssrRenderTeleport(_push, (_push2) => {
        if (isComingSoonModalOpen.value) {
          _push2(`<div class="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md px-4" data-v-f30e70c3><div class="relative max-w-md w-full bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden" data-v-f30e70c3><div class="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" data-v-f30e70c3></div><div class="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl" data-v-f30e70c3></div><button class="absolute top-4 right-4 z-10 inline-flex items-center justify-center h-8 w-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-all duration-200 hover:scale-110" data-v-f30e70c3><svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-f30e70c3><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" data-v-f30e70c3></path></svg></button><div class="relative p-8 space-y-6" data-v-f30e70c3><div class="flex justify-center" data-v-f30e70c3><div class="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-[#1f2a56] to-[#0f1a3c] shadow-lg shadow-[#1f2a56]/25" data-v-f30e70c3><svg class="h-10 w-10 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-f30e70c3><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" data-v-f30e70c3></path></svg></div></div><div class="text-center space-y-3" data-v-f30e70c3><h3 class="text-2xl font-bold text-gray-900" data-v-f30e70c3>Segera Hadir!</h3><p class="text-gray-600 leading-relaxed" data-v-f30e70c3> Maaf, fitur ini sedang dalam tahap pengembangan dan akan tersedia dalam waktu dekat. </p><div class="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-lg" data-v-f30e70c3><svg class="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24" data-v-f30e70c3><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" data-v-f30e70c3></path></svg><span class="text-sm font-medium text-blue-900" data-v-f30e70c3>Terima kasih atas pengertian Anda</span></div></div><button class="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1f2a56] to-[#0f1a3c] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#1f2a56]/20 transition-all duration-300 hover:shadow-xl hover:shadow-[#1f2a56]/30 hover:-translate-y-0.5" data-v-f30e70c3> Mengerti <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" data-v-f30e70c3><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" data-v-f30e70c3></path></svg></button></div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`</footer>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/client/Footer.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$1, [["__scopeId", "data-v-f30e70c3"]]), { __name: "ClientFooter" });
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_ClientTopBar = __nuxt_component_0;
  const _component_ClientFooter = __nuxt_component_1;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex flex-col" }, _attrs))}>`);
  _push(ssrRenderComponent(_component_ClientTopBar, null, null, _parent));
  _push(`<main class="flex-1">`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</main>`);
  _push(ssrRenderComponent(_component_ClientFooter, null, null, _parent));
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _default = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { _default as default };
//# sourceMappingURL=default-DoX8a-Fv.mjs.map
