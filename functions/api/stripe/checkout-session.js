/**
 * GET /api/stripe/checkout-session?session_id=cs_…
 * Returns normalized customer + shipping fields from a Stripe Checkout Session.
 * Requires Cloudflare secret: STRIPE_SECRET_KEY
 */
function json(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Accept",
      ...extraHeaders,
    },
  });
}

function splitName(full) {
  const s = String(full || "").trim();
  if (!s) return { firstName: "", lastName: "" };
  const parts = s.split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

function pickAddress(session) {
  const shipping = session.shipping_details && session.shipping_details.address;
  const billing = session.customer_details && session.customer_details.address;
  const addr = shipping || billing || {};
  const nameSource =
    (session.shipping_details && session.shipping_details.name) ||
    (session.customer_details && session.customer_details.name) ||
    "";
  const { firstName, lastName } = splitName(nameSource);
  return {
    firstName,
    lastName,
    email: (session.customer_details && session.customer_details.email) || "",
    phone: (session.customer_details && session.customer_details.phone) || "",
    streetAddress: [addr.line1, addr.line2].filter(Boolean).join(", "),
    city: addr.city || "",
    state: addr.state || "",
    zip: addr.postal_code || "",
  };
}

export async function onRequest(context) {
  if (context.request.method === "OPTIONS") {
    return json({}, 204);
  }
  if (context.request.method !== "GET") {
    return json({ error: "Method not allowed" }, 405);
  }

  const key = (context.env.STRIPE_SECRET_KEY || "").trim();
  if (!key) {
    return json({ error: "STRIPE_SECRET_KEY not configured" }, 503);
  }

  const url = new URL(context.request.url);
  const sessionId = (url.searchParams.get("session_id") || "").trim();
  if (!sessionId || !sessionId.startsWith("cs_")) {
    return json({ error: "session_id required (cs_…)" }, 400);
  }

  try {
    const stripeUrl =
      "https://api.stripe.com/v1/checkout/sessions/" +
      encodeURIComponent(sessionId);
    const res = await fetch(stripeUrl, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + key,
        "Stripe-Version": "2024-11-20.acacia",
      },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return json(
        { error: (data && data.error && data.error.message) || "Stripe error", status: res.status },
        res.status >= 400 && res.status < 600 ? res.status : 502
      );
    }

    const fields = pickAddress(data);
    return json({
      ok: true,
      sessionId: data.id,
      paymentStatus: data.payment_status,
      amountTotal: data.amount_total,
      currency: data.currency,
      clientReferenceId: data.client_reference_id || "",
      ...fields,
    });
  } catch (err) {
    return json(
      { error: "Stripe fetch failed", message: String(err && err.message) },
      502
    );
  }
}
