import { prisma } from "@/lib/db";
import { releaseBookingInventory } from "@/lib/booking";
import { sendBookingConfirmedEmail } from "@/lib/email";

export type ConfirmPaymentInput = {
  transactionRef: string;
  /**
   * Fallback lookup key (= Booking.reference / 2C2P's `invoiceNo`), used only if no Payment
   * matches `transactionRef` directly. Needed because it hasn't been verified against a real
   * 2C2P sandbox account which token/ref field actually comes back in the notification — see
   * the comment in src/app/api/payments/create/route.ts.
   */
  bookingReference?: string;
  status: "SUCCESS" | "FAILED" | "CANCELLED";
  responseCode?: string;
  rawPayload?: string;
};

export class PaymentConfirmError extends Error {
  constructor(message: string, public status = 400) {
    super(message);
  }
}

/**
 * The single place that transitions Payment/Booking status. Called from the (signature
 * verified) 2C2P webhook handler, and from the local sandbox simulator. Idempotent on
 * transactionRef so replayed/duplicate confirmations are safe no-ops.
 */
export async function confirmPayment(input: ConfirmPaymentInput) {
  let payment = await prisma.payment.findUnique({
    where: { transactionRef: input.transactionRef },
    include: { booking: { include: { room: true } } },
  });

  if (!payment && input.bookingReference) {
    payment = await prisma.payment.findFirst({
      where: { status: "PENDING", booking: { reference: input.bookingReference } },
      orderBy: { createdAt: "desc" },
      include: { booking: { include: { room: true } } },
    });
  }

  if (!payment) throw new PaymentConfirmError("Unknown transaction.", 404);

  if (payment.status !== "PENDING") {
    return { ok: true as const, alreadyProcessed: true };
  }

  const resolvedStatus = input.status === "SUCCESS" ? "PAID" : input.status === "CANCELLED" ? "CANCELLED" : "FAILED";

  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { id: payment.id },
      data: { status: resolvedStatus, responseCode: input.responseCode, rawPayload: input.rawPayload },
    });
    await tx.booking.update({ where: { id: payment.bookingId }, data: { status: resolvedStatus } });
    if (input.status !== "SUCCESS") {
      await releaseBookingInventory(tx, payment.booking);
    }
  });

  if (input.status === "SUCCESS") {
    await sendBookingConfirmedEmail(payment.booking);
  }

  return { ok: true as const, alreadyProcessed: false };
}
