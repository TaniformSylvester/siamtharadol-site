import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { createPaymentToken, TwoC2PError } from "@/lib/payments/2c2p";
import { logError } from "@/lib/log";

const bodySchema = z.object({ reference: z.string().min(1) });

const SANDBOX_MODE = process.env.PAYMENT_SANDBOX_MODE === "true";

/**
 * Creates a Payment record and returns where the guest should go to pay.
 *
 * In sandbox mode (the default until a real 2C2P merchant account exists), this never talks to
 * 2C2P — it sends the guest to this project's own simulator at /book/pay/[reference]. With
 * PAYMENT_SANDBOX_MODE=false and real TWOC2P_* credentials, it calls the real 2C2P paymentToken
 * API (see src/lib/payments/2c2p.ts) and redirects to the webPaymentUrl 2C2P returns.
 */
export async function POST(request: NextRequest) {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const booking = await prisma.booking.findUnique({ where: { reference: parsed.data.reference } });
  if (!booking) {
    return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  }
  if (booking.status !== "PENDING_PAYMENT") {
    return NextResponse.json({ error: `Booking is ${booking.status.toLowerCase().replace("_", " ")}, cannot pay.` }, { status: 409 });
  }
  if (booking.expiresAt < new Date()) {
    return NextResponse.json({ error: "This booking hold has expired. Please search again." }, { status: 410 });
  }

  if (SANDBOX_MODE) {
    const transactionRef = `PGW-${randomUUID().slice(0, 12).toUpperCase()}`;
    await prisma.payment.create({
      data: {
        bookingId: booking.id,
        provider: "2c2p",
        transactionRef,
        amountThb: booking.totalThb,
        currency: booking.currency,
        status: "PENDING",
      },
    });
    return NextResponse.json({ redirectUrl: `/book/pay/${booking.reference}?txn=${transactionRef}` });
  }

  try {
    const result = await createPaymentToken({
      bookingReference: booking.reference,
      amountThb: booking.totalThb,
      description: `Siam Tharadol — ${booking.reference}`,
    });

    // NOTE: not yet verified against a real sandbox account — confirm that the notification
    // 2C2P posts to TWOC2P_BACKEND_URL actually contains `paymentToken`, or whether it should
    // be matched by `invoiceNo` (= booking.reference) instead. See src/lib/payments/confirm.ts.
    await prisma.payment.create({
      data: {
        bookingId: booking.id,
        provider: "2c2p",
        transactionRef: result.paymentToken,
        amountThb: booking.totalThb,
        currency: booking.currency,
        status: "PENDING",
      },
    });

    return NextResponse.json({ redirectUrl: result.webPaymentUrl });
  } catch (err) {
    logError("api/payments/create", err);
    const message = err instanceof TwoC2PError ? err.message : "Could not start payment. Please try again.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
