/**
 * Same-origin proxy for the Airtable REST API.
 * Matches landing-pages / thelocalpick: clients call
 *   fetch("/api/airtable/v0/{baseId}/{tableId}", …)
 * and must NOT send Bearer tokens from the browser.
 *
 * Cloudflare secret: AIRTABLE_API_KEY (preferred) or Airtable (thelocalpick name).
 */
const ALLOWED_PREFIX = "v0/";

export async function onRequest(context) {
  const apiKey = context.env.AIRTABLE_API_KEY || context.env.Airtable;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "Airtable API not configured (AIRTABLE_API_KEY or Airtable)" }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }

  const raw = context.params.path;
  const path =
    raw == null
      ? ""
      : Array.isArray(raw)
        ? raw.filter(Boolean).join("/")
        : String(raw).replace(/^\/+/, "");
  if (!path || !path.startsWith(ALLOWED_PREFIX)) {
    return new Response(JSON.stringify({ error: "Invalid path; expected /api/airtable/v0/…" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const url = new URL(context.request.url);
  const targetUrl = `https://api.airtable.com/${path}${url.search}`;

  const method = context.request.method.toUpperCase();
  if (method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Methods": "GET,HEAD,POST,PATCH,PUT,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Accept",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  if (!["GET", "HEAD", "POST", "PATCH", "PUT", "DELETE"].includes(method)) {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const headers = new Headers();
  headers.set("Authorization", `Bearer ${apiKey}`);
  const ct = context.request.headers.get("Content-Type");
  if (ct) headers.set("Content-Type", ct);
  else if (method !== "GET" && method !== "HEAD") headers.set("Content-Type", "application/json");
  const accept = context.request.headers.get("Accept");
  if (accept) headers.set("Accept", accept);

  /** @type {RequestInit} */
  const init = { method, headers, redirect: "follow" };
  if (!["GET", "HEAD"].includes(method)) {
    init.body = context.request.body;
  }

  try {
    const res = await fetch(targetUrl, init);
    return new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers: {
        "Content-Type": res.headers.get("Content-Type") || "application/json",
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Airtable proxy error", message: String(err && err.message) }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }
}
