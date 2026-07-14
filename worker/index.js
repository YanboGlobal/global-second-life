const OWNER_DOMAIN = "https://YOUR-DOMAIN.com";
const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const STRIPE_API_BASE = "https://api.stripe.com/v1";
const DEFAULT_TRIP_PRICE = { amount: 218000, currency: "usd" };
const TRIP_PRICES = {
  "aug-sep-2026-retreat": DEFAULT_TRIP_PRICE,
  "october-2026-retreat": DEFAULT_TRIP_PRICE
};

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return corsResponse(null, 204);

    const url = new URL(request.url);
    try {
      if (url.pathname === "/create-payment" && request.method === "POST") return createPayment(request, env);
      if (url.pathname === "/stripe-webhook" && request.method === "POST") return stripeWebhook(request, env);
      if (url.pathname === "/submit-booking" && request.method === "POST") return submitBooking(request, env);
      if (url.pathname === "/admin/export" && request.method === "GET") return adminExport(request, env);
      if (url.pathname === "/admin/record" && request.method === "DELETE") return adminDelete(request, env);
      return json({ error: "Not found" }, 404);
    } catch (error) {
      return json({ error: error.message || "Server error" }, error.status || 500);
    }
  }
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": OWNER_DOMAIN,
    "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization,Stripe-Signature",
    "Access-Control-Max-Age": "86400"
  };
}

function corsResponse(body, status = 200, headers = {}) {
  return new Response(body, { status, headers: { ...corsHeaders(), ...headers } });
}

function json(body, status = 200) {
  return corsResponse(JSON.stringify(body), status, { "Content-Type": "application/json" });
}

function requireAdmin(request, env) {
  const expected = `Bearer ${env.ADMIN_TOKEN}`;
  if (!env.ADMIN_TOKEN || request.headers.get("Authorization") !== expected) {
    throw new HttpError("Unauthorized", 401);
  }
}

async function readJson(request) {
  try {
    return await request.json();
  } catch {
    throw new HttpError("Invalid JSON", 400);
  }
}

async function verifyTurnstile(token, request, env) {
  if (!env.TURNSTILE_SECRET_KEY) throw new HttpError("Turnstile secret is not configured", 500);
  if (!token) throw new HttpError("Missing bot protection token", 400);

  const form = new FormData();
  form.append("secret", env.TURNSTILE_SECRET_KEY);
  form.append("response", token);
  form.append("remoteip", request.headers.get("CF-Connecting-IP") || "");

  const response = await fetch(TURNSTILE_VERIFY_URL, { method: "POST", body: form });
  const result = await response.json();
  if (!result.success) throw new HttpError("Bot protection failed", 400);
}

function requireAllowedOrigin(request) {
  const origin = request.headers.get("Origin");
  if (origin && origin !== OWNER_DOMAIN) {
    throw new HttpError("Origin not allowed", 403);
  }
}

function newBookingId() {
  return `bk_${crypto.randomUUID().replaceAll("-", "").slice(0, 18)}`;
}

function newPaymentId() {
  return `pay_${crypto.randomUUID().replaceAll("-", "").slice(0, 18)}`;
}

function cleanText(value, max = 500) {
  return String(value || "").trim().slice(0, max);
}

async function submitBooking(request, env) {
  requireAllowedOrigin(request);
  const body = await readJson(request);
  await verifyTurnstile(body.turnstileToken, request, env);

  const travelerName = cleanText(body.traveler_name, 200);
  const email = cleanText(body.email, 200);
  const tripCode = cleanText(body.trip_code, 120);
  const sealed = cleanText(body.sealed, 20000);

  if (!travelerName || !email || !tripCode || !sealed) {
    throw new HttpError("Missing booking fields", 400);
  }

  const id = newBookingId();
  await env.DB.prepare(
    "INSERT INTO bookings (id, traveler_name, email, trip_code, sealed) VALUES (?, ?, ?, ?, ?)"
  ).bind(id, travelerName, email, tripCode, sealed).run();

  return json({ booking_id: id });
}

async function createPayment(request, env) {
  requireAllowedOrigin(request);
  const body = await readJson(request);
  await verifyTurnstile(body.turnstileToken, request, env);

  const bookingId = cleanText(body.booking_id, 80);
  const method = cleanText(body.method, 20);

  if (!bookingId || !["card", "zelle", "paypal"].includes(method)) throw new HttpError("Invalid payment method", 400);

  const existing = await env.DB.prepare("SELECT id, trip_code FROM bookings WHERE id = ?").bind(bookingId).first();
  if (!existing) throw new HttpError("Booking not found", 404);

  const price = TRIP_PRICES[existing.trip_code] || DEFAULT_TRIP_PRICE;
  const amount = price.amount;
  const currency = price.currency;

  if (method === "zelle" || method === "paypal") {
    const paymentId = newPaymentId();
    await env.DB.prepare(
      "INSERT INTO payments (id, booking_id, method, stripe_ref, amount, currency, status) VALUES (?, ?, ?, NULL, ?, ?, ?)"
    ).bind(paymentId, bookingId, method, amount, currency, `${method}_pending`).run();
    return json({ payment_id: paymentId, status: `${method}_pending` });
  }

  if (!env.STRIPE_SECRET_KEY) throw new HttpError("Stripe secret is not configured", 500);

  const params = new URLSearchParams();
  params.set("amount", String(amount));
  params.set("currency", currency);
  params.append("payment_method_types[]", "card");
  params.set("metadata[booking_id]", bookingId);
  params.set("metadata[trip_code]", existing.trip_code);
  params.set("metadata[method]", method);

  const stripeResponse = await fetch(`${STRIPE_API_BASE}/payment_intents`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: params
  });
  const intent = await stripeResponse.json();
  if (!stripeResponse.ok) throw new HttpError(intent.error?.message || "Stripe error", 400);

  await env.DB.prepare(
    "INSERT INTO payments (id, booking_id, method, stripe_ref, amount, currency, status) VALUES (?, ?, ?, ?, ?, ?, ?)"
  ).bind(newPaymentId(), bookingId, method, intent.id, amount, currency, intent.status).run();

  return json({ client_secret: intent.client_secret });
}

async function stripeWebhook(request, env) {
  const signature = request.headers.get("Stripe-Signature");
  const rawBody = await request.text();
  await verifyStripeSignature(rawBody, signature, env.STRIPE_WEBHOOK_SECRET);

  const event = JSON.parse(rawBody);
  if (event.type?.startsWith("payment_intent.")) {
    const intent = event.data.object;
    await env.DB.prepare(
      "UPDATE payments SET status = ? WHERE stripe_ref = ?"
    ).bind(intent.status, intent.id).run();
  }

  return json({ received: true });
}

async function adminExport(request, env) {
  requireAdmin(request, env);
  const rows = await env.DB.prepare(
    `SELECT
      b.id AS booking_id,
      b.created_at,
      b.traveler_name,
      b.email,
      b.trip_code,
      b.sealed,
      p.method,
      p.stripe_ref,
      p.amount,
      p.currency,
      p.status AS payment_status
    FROM bookings b
    LEFT JOIN payments p ON p.booking_id = b.id
    ORDER BY b.created_at DESC`
  ).all();

  return json({ rows: rows.results || [] });
}

async function adminDelete(request, env) {
  requireAdmin(request, env);
  const url = new URL(request.url);
  const bookingId = cleanText(url.searchParams.get("booking_id"), 80);
  const tripCode = cleanText(url.searchParams.get("trip_code"), 120);

  if (!bookingId && !tripCode) throw new HttpError("Pass booking_id or trip_code", 400);

  if (bookingId) {
    await env.DB.prepare("DELETE FROM payments WHERE booking_id = ?").bind(bookingId).run();
    await env.DB.prepare("DELETE FROM bookings WHERE id = ?").bind(bookingId).run();
    return json({ deleted: "booking", booking_id: bookingId });
  }

  const ids = await env.DB.prepare("SELECT id FROM bookings WHERE trip_code = ?").bind(tripCode).all();
  for (const row of ids.results || []) {
    await env.DB.prepare("DELETE FROM payments WHERE booking_id = ?").bind(row.id).run();
  }
  await env.DB.prepare("DELETE FROM bookings WHERE trip_code = ?").bind(tripCode).run();
  return json({ deleted: "trip", trip_code: tripCode });
}

async function verifyStripeSignature(payload, signatureHeader, webhookSecret) {
  if (!signatureHeader || !webhookSecret) throw new HttpError("Missing Stripe signature", 400);

  const parts = Object.fromEntries(signatureHeader.split(",").map((part) => part.split("=")));
  const timestamp = parts.t;
  const signature = parts.v1;
  if (!timestamp || !signature) throw new HttpError("Invalid Stripe signature header", 400);
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) {
    throw new HttpError("Stripe signature timestamp is too old", 400);
  }

  const signedPayload = `${timestamp}.${payload}`;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(webhookSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const expected = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(signedPayload));
  const expectedHex = [...new Uint8Array(expected)].map((byte) => byte.toString(16).padStart(2, "0")).join("");

  if (!timingSafeEqual(expectedHex, signature)) throw new HttpError("Stripe signature verification failed", 400);
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let index = 0; index < a.length; index += 1) {
    result |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }
  return result === 0;
}

class HttpError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}
