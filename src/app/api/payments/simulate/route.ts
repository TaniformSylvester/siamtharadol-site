import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { confirmPayment, PaymentConfirmError } from "@/lib/payments/confirm";
import { logError } from "@/lib/log";

const bodySchema = z.object({
  transactionRef: z.string().min(1),
  outcome: z.enum(["SUCCESS", "FAILED", "CANCELLED"]),
});

/**
 * Stands in for 2C2P's server calling our webhook, so the full booking → pay → confirm flow
 * can be tested end to end without a live merchant account. Only reachable when
 * PAYMENT_SANDBOX_MODE=true — must be disabled (unset or "false") before any real deployment,
 * since it lets a caller flip a payment to PAID without going through a real gateway.
 */
export async function POST(request: NextRequest) {
  if (process.env.PAYMENT_SANDBOX_MODE !== "true") {
    return NextResponse.json({ error: "Sandbox simulation is disabled." }, { status: 403 });
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  try {
    const result = await confirmPayment({
      transactionRef: parsed.data.transactionRef,
      status: parsed.data.outcome,
      responseCode: "SANDBOX_SIMULATED",
      rawPayload: JSON.stringify({ simulated: true, ...parsed.data }),
    });
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof PaymentConfirmError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    logError("api/payments/simulate", err);
    return NextResponse.json({ error: "Could not simulate payment." }, { status: 500 });
  }
}
