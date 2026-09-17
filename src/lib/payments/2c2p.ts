import jwt from "jsonwebtoken";

/**
 * 2C2P Payment Gateway (PGW) v4.3 integration — the "Payment Token" / Redirect API flow.
 *
 * Verified against the official docs at https://developer.2c2p.com/docs/api-payment-token and
 * https://developer.2c2p.com/docs/redirect-api-integrate-with-payment (checked 2026-09-17).
 * The whole API is JWT-based (HS256, signed with the merchant secret key) — both the request
 * you send and the response/webhook 2C2P sends back are `{ "payload": "<jwt>" }`.
 *
 * Flow:
 *   1. createPaymentToken() — POST a signed JWT to /payment/4.3/paymentToken, get back a
 *      webPaymentUrl to redirect the guest to.
 *   2. Guest pays on 2C2P's hosted page.
 *   3. 2C2P POSTs a signed JWT to TWOC2P_BACKEND_URL (server-to-server) — verifyNotification()
 *      checks and decodes it. This is the ONLY thing allowed to confirm payment; see
 *      src/lib/payments/confirm.ts.
 *   4. The guest's browser is redirected to TWOC2P_RETURN_URL — cosmetic only, never trusted.
 *
 * Re-check the docs before going live: 2C2P versions and field lists do change, and this was
 * built without a real merchant account to test against.
 */

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

export type CreatePaymentTokenInput = {
  bookingReference: string;
  amountThb: number;
  description: string;
};

export type PaymentTokenResult = {
  webPaymentUrl: string;
  paymentToken: string;
  respCode: string;
  respDesc: string;
};

export class TwoC2PError extends Error {}

/**
 * Calls the real 2C2P paymentToken endpoint. Requires real merchant credentials — do not call
 * this while PAYMENT_SANDBOX_MODE=true (see /api/payments/create), since it will genuinely hit
 * 2C2P's servers and fail with whatever fake credentials are in .env.
 */
export async function createPaymentToken(input: CreatePaymentTokenInput): Promise<PaymentTokenResult> {
  const merchantID = requireEnv("TWOC2P_MERCHANT_ID");
  const secret = requireEnv("TWOC2P_SECRET");
  const apiUrl = requireEnv("TWOC2P_API_URL");
  const backendReturnUrl = requireEnv("TWOC2P_BACKEND_URL");
  const frontendReturnUrl = requireEnv("TWOC2P_RETURN_URL");

  const requestPayload = {
    merchantID,
    invoiceNo: input.bookingReference,
    description: input.description.slice(0, 250),
    amount: Number(input.amountThb.toFixed(2)),
    currencyCode: "THB",
    backendReturnUrl,
    frontendReturnUrl,
  };

  const token = jwt.sign(requestPayload, secret, { algorithm: "HS256", noTimestamp: true });

  const res = await fetch(`${apiUrl}/payment/4.3/paymentToken`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ payload: token }),
  });

  if (!res.ok) {
    throw new TwoC2PError(`2C2P paymentToken request failed: HTTP ${res.status}`);
  }

  const { payload: responseJwt } = (await res.json()) as { payload: string };
  const decoded = jwt.verify(responseJwt, secret, { algorithms: ["HS256"] }) as Record<string, string>;

  if (decoded.respCode !== "0000") {
    throw new TwoC2PError(`2C2P paymentToken rejected: ${decoded.respCode} ${decoded.respDesc ?? ""}`);
  }

  return {
    webPaymentUrl: decoded.webPaymentUrl,
    paymentToken: decoded.paymentToken,
    respCode: decoded.respCode,
    respDesc: decoded.respDesc,
  };
}

export type PaymentNotification = {
  invoiceNo: string;
  tranRef: string;
  amount: string;
  respCode: string;
  // Exact success/failure respCode values must be confirmed against current 2C2P docs
  // (https://developer.2c2p.com/docs/api-payment-response-backend) before going live.
};

/**
 * Verifies and decodes the JWT 2C2P POSTs to TWOC2P_BACKEND_URL. Throws if the signature
 * doesn't check out against our secret — never trust an unverified notification.
 */
export function verifyNotification(rawBody: string): PaymentNotification {
  const secret = requireEnv("TWOC2P_SECRET");
  const { payload } = JSON.parse(rawBody) as { payload: string };
  return jwt.verify(payload, secret, { algorithms: ["HS256"] }) as unknown as PaymentNotification;
}
