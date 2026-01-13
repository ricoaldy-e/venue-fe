import { c as defineEventHandler, u as useRuntimeConfig, e as createError, g as getCookie, $ as $fetch } from '../../_/nitro.mjs';
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

const QUERY_GET_OPERATING_HOURS = `
  query GetOperatingHours {
    operatingHours {
      id
      openHour
      closeHour
    }
  }
`;

const index_get = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e;
  const config = useRuntimeConfig();
  const endpoint = config.public.gqlHttpEndpoint;
  if (!endpoint) {
    throw createError({ statusCode: 500, statusMessage: "Missing GQL_HTTP_ENDPOINT" });
  }
  const token = getCookie(event, "admin_token");
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: "Not authenticated" });
  }
  try {
    const response = await $fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: {
        query: QUERY_GET_OPERATING_HOURS
      }
    });
    if ((_a = response == null ? void 0 : response.errors) == null ? void 0 : _a.length) {
      const firstError = response.errors[0];
      const errorCode = ((_b = firstError == null ? void 0 : firstError.extensions) == null ? void 0 : _b.code) || "UNKNOWN";
      console.error("GraphQL error fetching operating hours:", {
        code: (_c = firstError == null ? void 0 : firstError.extensions) == null ? void 0 : _c.code,
        message: firstError == null ? void 0 : firstError.message,
        fullError: firstError
      });
      let statusCode = 400;
      if (errorCode === "UNAUTHENTICATED") {
        statusCode = 401;
      } else if (errorCode === "FORBIDDEN") {
        statusCode = 403;
      } else if (errorCode === "INTERNAL" || errorCode === "INTERNAL_SERVER_ERROR") {
        statusCode = 500;
      }
      throw createError({
        statusCode,
        statusMessage: "Failed to fetch operating hours"
      });
    }
    return (_e = (_d = response == null ? void 0 : response.data) == null ? void 0 : _d.operatingHours) != null ? _e : null;
  } catch (error) {
    if (error == null ? void 0 : error.statusCode) throw error;
    throw createError({ statusCode: 502, statusMessage: "Operating hour service unreachable" });
  }
});

export { index_get as default };
//# sourceMappingURL=index.get4.mjs.map
