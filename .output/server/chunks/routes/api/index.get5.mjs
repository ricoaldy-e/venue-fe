import { d as defineEventHandler, u as useRuntimeConfig, c as createError } from '../../nitro/nitro.mjs';
import { print } from 'graphql';
import gql from 'graphql-tag';
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

const QUERY_GET_OPTION = gql`
    query Options {
        options {
            address
            description
            email
            name
            nohp
        }
    }
`;

const index_get = defineEventHandler(async () => {
  var _a, _b, _c, _d, _e;
  const config = useRuntimeConfig();
  const endpoint = config.public.gqlHttpEndpoint;
  if (!endpoint) {
    throw createError({ statusCode: 500, statusMessage: "Missing GQL_HTTP_ENDPOINT" });
  }
  try {
    const response = await $fetch(endpoint, {
      method: "POST",
      body: {
        query: print(QUERY_GET_OPTION)
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
    return (_e = (_d = response == null ? void 0 : response.data) == null ? void 0 : _d.options) != null ? _e : null;
  } catch (e) {
    const err = e;
    if (err.statusCode) throw err;
    throw createError({ statusCode: 502, statusMessage: "Operating hour service unreachable" });
  }
});

export { index_get as default };
//# sourceMappingURL=index.get5.mjs.map
