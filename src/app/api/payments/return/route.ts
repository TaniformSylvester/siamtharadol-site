import { NextRequest, NextResponse } from "next/server";

/**
 * Browser return URL from the payment page. This is COSMETIC ONLY — it must never mark a
 * booking as paid. It simply sends the guest to the confirmation page, which reads the
 * booking's current status (set only by /api/payments/webhook) and polls until it settles.
 */
export async function GET(request: NextRequest) {
  const reference = request.nextUrl.searchParams.get("ref");
  if (!reference) {
    return NextResponse.redirect(new URL("/book", request.url));
  }
  return NextResponse.redirect(new URL(`/book/confirmation/${reference}`, request.url));
}
