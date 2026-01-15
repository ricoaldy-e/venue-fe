import { B as executeAsync } from '../nitro/nitro.mjs';
import { h as defineNuxtRouteMiddleware, n as navigateTo } from './server.mjs';
import { u as useFetch } from './fetch-6ryk-beQ.mjs';
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
import 'vue';
import 'vue-router';
import 'vue/server-renderer';
import '@vue/shared';
import './asyncData-VRyZt-9X.mjs';
import 'perfect-debounce';

const authAdmin = defineNuxtRouteMiddleware(async (to) => {
  let __temp, __restore;
  if (!to.path.startsWith("/admin")) {
    return;
  }
  const { data, error } = ([__temp, __restore] = executeAsync(() => useFetch("/api/auth/me", {
    method: "GET",
    credentials: "include"
  }, "$An8-YjcmXN")), __temp = await __temp, __restore(), __temp);
  const isAuthenticated = !error.value && data.value?.authenticated === true;
  if (isAuthenticated && to.path === "/admin/login") {
    return navigateTo("/admin");
  }
  if (!isAuthenticated && to.path !== "/admin/login") {
    return navigateTo("/admin/login?next=" + encodeURIComponent(to.fullPath));
  }
});

export { authAdmin as default };
//# sourceMappingURL=auth-admin-CTbXmSTG.mjs.map
