import { c as defineEventHandler, u as useRuntimeConfig, e as createError, g as getCookie, $ as $fetch } from '../../_/nitro.mjs';
import gql from 'graphql-tag';
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

const QUERY_GET_OPTION = gql`
    query Options {
        options {
            name
            nameKet
            description
            unitName
            unitDesc
            email
            nohp
            address
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
  try {
    const headers = { "Content-Type": "application/json" };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    const response = await $fetch(endpoint, {
      method: "POST",
      headers,
      body: {
        query: QUERY_GET_OPTION
      }
    });
    if ((_a = response == null ? void 0 : response.errors) == null ? void 0 : _a.length) {
      const firstError = response.errors[0];
      const errorCode = ((_b = firstError == null ? void 0 : firstError.extensions) == null ? void 0 : _b.code) || "UNKNOWN";
      console.error("GraphQL error fetching options:", {
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
        statusMessage: "Failed to fetch options"
      });
    }
    return (_e = (_d = response == null ? void 0 : response.data) == null ? void 0 : _d.options) != null ? _e : null;
  } catch (error) {
    if (error == null ? void 0 : error.statusCode) throw error;
    throw createError({ statusCode: 502, statusMessage: "Option service unreachable" });
  }
});

export { index_get as default };
//# sourceMappingURL=index.get5.mjs.map
