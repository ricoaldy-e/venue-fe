import { c as defineEventHandler, u as useRuntimeConfig, e as createError, g as getCookie } from '../../../_/nitro.mjs';
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

const upload_post = defineEventHandler(async (event) => {
  var _a, _b;
  const config = useRuntimeConfig();
  const endpoint = config.public.gqlHttpEndpoint;
  if (!endpoint) throw createError({ statusCode: 500, statusMessage: "Missing GQL_HTTP_ENDPOINT" });
  const contentType = event.node.req.headers["content-type"] || "";
  if (!contentType.includes("multipart/form-data")) {
    throw createError({ statusCode: 400, statusMessage: "Expected multipart/form-data" });
  }
  const token = getCookie(event, "admin_token");
  const headers = {
    "apollo-require-preflight": "true",
    "content-type": contentType
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  try {
    const chunks = [];
    for await (const chunk of event.node.req) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    const reqBuffer = Buffer.concat(chunks);
    const bodyText = reqBuffer.toString("utf8", 0, Math.min(reqBuffer.length, 1024 * 10));
    if (!/name=["']?map["']?/i.test(bodyText) && !/"map"\s*:/.test(bodyText)) {
      throw createError({ statusCode: 400, statusMessage: 'Missing multipart field "map" in request.' });
    }
    const res = await fetch(endpoint, { method: "POST", headers, body: reqBuffer });
    const respContentType = res.headers.get && res.headers.get("content-type") || "";
    if (respContentType.includes("application/json")) {
      const json = await res.json();
      if ((_a = json.errors) == null ? void 0 : _a.length) throw createError({ statusCode: 400, statusMessage: ((_b = json.errors[0]) == null ? void 0 : _b.message) || "Upload failed" });
      return json.data;
    }
    const text = await res.text();
    const summary = text ? text.slice(0, 200) : "Empty response";
    throw createError({ statusCode: res.status || 502, statusMessage: `Upstream returned non-JSON response: ${summary}` });
  } catch (err) {
    if (err == null ? void 0 : err.statusCode) throw err;
    throw createError({ statusCode: 502, statusMessage: (err == null ? void 0 : err.message) || "Upload service unreachable" });
  }
});

export { upload_post as default };
//# sourceMappingURL=upload.post.mjs.map
