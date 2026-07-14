import sodium from "https://cdn.jsdelivr.net/npm/libsodium-wrappers-sumo@0.7.15/+esm";

// SETUP REQUIRED: replace these constants before going live.
const WORKER_BASE_URL = "https://YOUR-WORKER.YOUR-SUBDOMAIN.workers.dev";
const STRIPE_PUBLISHABLE_KEY = "pk_test_REPLACE_ME";
const BOOKING_PUBLIC_KEY_BASE64 = "REPLACE_WITH_LIBSODIUM_PUBLIC_KEY_BASE64";
const TURNSTILE_SITE_KEY = "1x00000000000000000000AA";
const CURRENCY = "usd";
const DISPLAY_AMOUNT_CENTS = 218000;

const form = document.querySelector("#secure-booking-form");
const tripSelect = document.querySelector("#trip-code");
const amountDisplay = document.querySelector("#amount-display");
const statusBox = document.querySelector("#encryption-status");
const messageBox = document.querySelector("#booking-message");
const stripeArea = document.querySelector("#stripe-payment-area");
const wireBox = document.querySelector("#wire-instructions");
const wireReference = document.querySelector("#wire-booking-reference");
const manualPaymentTitle = document.querySelector("#manual-payment-title");
const manualPaymentDetails = document.querySelector("#manual-payment-details");
const confirmPaymentButton = document.querySelector("#confirm-payment-button");

let stripe;
let elements;
let bookingId;
let paymentReady = false;
let bookingTurnstileWidget;
let paymentTurnstileWidget;

const sensitiveFields = [
  "phone",
  "given_names",
  "surname",
  "date_of_birth",
  "nationality",
  "passport_number",
  "passport_issue_date",
  "passport_expiry_date",
  "emergency_name",
  "emergency_phone",
  "emergency_relationship"
];

function formatAmount(cents) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: CURRENCY.toUpperCase()
  }).format(cents / 100);
}

function selectedAmount() {
  return DISPLAY_AMOUNT_CENTS;
}

function selectedMethod() {
  return form.elements.payment_method.value;
}

function setMessage(text, type = "") {
  messageBox.textContent = text;
  messageBox.dataset.type = type;
}

window.onTurnstileReady = () => {
  if (!window.turnstile) return;
  bookingTurnstileWidget = window.turnstile.render("#booking-turnstile", {
    sitekey: TURNSTILE_SITE_KEY,
    theme: "light"
  });
  paymentTurnstileWidget = window.turnstile.render("#payment-turnstile", {
    sitekey: TURNSTILE_SITE_KEY,
    theme: "light"
  });
};

function getTurnstileToken(widgetId) {
  if (!window.turnstile || widgetId === undefined) return "";
  const token = window.turnstile.getResponse(widgetId);
  return token || "";
}

function collectSensitivePayload(formData) {
  const payload = {};
  for (const field of sensitiveFields) {
    payload[field] = String(formData.get(field) || "").trim();
  }
  return payload;
}

async function encryptSensitivePayload(payload) {
  if (!BOOKING_PUBLIC_KEY_BASE64 || BOOKING_PUBLIC_KEY_BASE64.includes("REPLACE_")) {
    throw new Error("Missing public encryption key. Add it to BOOKING_PUBLIC_KEY_BASE64 in payment.js.");
  }

  await sodium.ready;
  const publicKey = sodium.from_base64(BOOKING_PUBLIC_KEY_BASE64, sodium.base64_variants.ORIGINAL);
  const message = sodium.from_string(JSON.stringify(payload));
  const sealed = sodium.crypto_box_seal(message, publicKey);
  return sodium.to_base64(sealed, sodium.base64_variants.ORIGINAL);
}

async function postJson(path, body) {
  const response = await fetch(`${WORKER_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result.error || "The server could not complete that request.");
  }
  return result;
}

async function createBooking(formData, sealed) {
  return postJson("/submit-booking", {
    traveler_name: `${formData.get("given_names")} ${formData.get("surname")}`.trim(),
    email: String(formData.get("email") || "").trim(),
    trip_code: String(formData.get("trip_code") || "").trim(),
    sealed,
    turnstileToken: getTurnstileToken(bookingTurnstileWidget)
  });
}

async function createPayment(currentBookingId) {
  return postJson("/create-payment", {
    booking_id: currentBookingId,
    method: selectedMethod(),
    turnstileToken: getTurnstileToken(paymentTurnstileWidget)
  });
}

async function mountStripePayment(clientSecret, method) {
  stripe = stripe || Stripe(STRIPE_PUBLISHABLE_KEY);
  elements = stripe.elements({
    clientSecret,
    appearance: {
      theme: "stripe",
      variables: {
        fontSizeBase: "19px",
        borderRadius: "8px",
        colorPrimary: "#174f49"
      }
    }
  });

  const paymentElement = elements.create("payment", {
    defaultValues: {
      billingDetails: {}
    },
    fields: {
      billingDetails: "auto"
    }
  });
  paymentElement.mount("#payment-element");

  stripeArea.hidden = false;
  wireBox.hidden = true;
  confirmPaymentButton.textContent = "Pay securely by card";
  paymentReady = true;
}

function showManualPayment(method, currentBookingId) {
  const instructions = {
    zelle: {
      title: "Zelle payment",
      html: `
        <p><strong>Zelle To:</strong> wangyanbo@gmail.com</p>
        <p>Please send the payment through your own bank's Zelle app or website. We do not collect your bank login, account number, or routing number.</p>
      `,
      message: "Zelle selected. Please send payment to wangyanbo@gmail.com and include the booking reference."
    },
    paypal: {
      title: "PayPal payment",
      html: `
        <p><strong>PayPal to:</strong> wangyanbo@gmail.com</p>
        <p>Please send the payment through PayPal directly. We do not collect your PayPal login or financial details.</p>
      `,
      message: "PayPal selected. Please send payment to wangyanbo@gmail.com and include the booking reference."
    }
  };

  const instruction = instructions[method];
  if (!instruction) return false;

  stripeArea.hidden = true;
  wireBox.hidden = false;
  wireReference.textContent = currentBookingId;
  manualPaymentTitle.textContent = instruction.title;
  manualPaymentDetails.innerHTML = instruction.html;
  setMessage(instruction.message, "success");
  return true;
}

function updateAmount() {
  amountDisplay.textContent = formatAmount(selectedAmount());
}

async function prepareEncryptionIndicator() {
  try {
    await sodium.ready;
    statusBox.textContent = "Ready: sensitive details will be encrypted before leaving this device.";
    statusBox.className = "encryption-status is-ready";
  } catch (error) {
    statusBox.textContent = "Encryption could not load. Please refresh before submitting.";
    statusBox.className = "encryption-status is-error";
  }
}

form.addEventListener("change", (event) => {
  if (event.target === tripSelect) updateAmount();

  if (event.target.name === "payment_method") {
    stripeArea.hidden = true;
    wireBox.hidden = true;
    paymentReady = false;
    setMessage("");
  }
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  setMessage("Encrypting your travel details in this browser...", "");

  try {
    if (!getTurnstileToken(bookingTurnstileWidget) || !getTurnstileToken(paymentTurnstileWidget)) {
      throw new Error("Please complete both bot protection checks before submitting.");
    }

    const formData = new FormData(form);
    const sealed = await encryptSensitivePayload(collectSensitivePayload(formData));
    const booking = await createBooking(formData, sealed);
    bookingId = booking.booking_id;

    setMessage(`Booking ${bookingId} was saved securely. Preparing payment...`, "success");

    const payment = await createPayment(bookingId);
    if (showManualPayment(selectedMethod(), bookingId)) {
      return;
    }

    await mountStripePayment(payment.client_secret, selectedMethod());
    setMessage("Stripe is ready. Complete the secure payment box below.", "success");
  } catch (error) {
    setMessage(error.message, "error");
  }
});

confirmPaymentButton.addEventListener("click", async () => {
  if (!paymentReady || !stripe || !elements) return;
  setMessage("Sending you through Stripe's secure payment confirmation...", "");

  const { error } = await stripe.confirmPayment({
    elements,
    confirmParams: {
      return_url: `${window.location.origin}${window.location.pathname}?booking=${encodeURIComponent(bookingId || "")}`
    }
  });

  if (error) {
    setMessage(error.message || "Stripe could not confirm the payment.", "error");
  }
});

updateAmount();
prepareEncryptionIndicator();
