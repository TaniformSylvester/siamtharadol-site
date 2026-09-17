import { NextRequest, NextResponse } from "next/server";
import { confirmPayment, PaymentConfirmError } from "@/lib/payments/confirm";
import { logError } from "@/lib/log";
import { verifyNotification } from "@/lib/payments/2c2p";

/**
 * Server-to-server payment confirmation, called by 2C2P itself (TWOC2P_BACKEND_URL). This is
 * the ONLY handler allowed to mark a booking PAID or FAILED — the browser-facing
 * /api/payments/return route never does. Idempotent on the resolved Payment row.
 *
 * respCode "0000" = success per the current docs; every other code is treated as a failure.
 * 2C2P's docs don't clearly separate "cancelled by guest" from "failed" at this field, so both
 * currently resolve to FAILED — revisit once tested against a real sandbox account.
 */
export async function POST(request: NextRequest) {
  const rawBody = await request.text();

  let notification;
  try {
    notification = verifyNotification(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }

  const status: "SUCCESS" | "FAILED" = notification.respCode === "0000" ? "SUCCESS" : "FAILED";

  try {
    const result = await confirmPayment({
      transactionRef: notification.tranRef,
      bookingReference: notification.invoiceNo,
      status,
      responseCode: notification.respCode,
      rawPayload: rawBody,
    });
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof PaymentConfirmError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    logError("api/payments/webhook", err);
    return NextResponse.json({ error: "Could not process payment confirmation." }, { status: 500 });
  }
}
