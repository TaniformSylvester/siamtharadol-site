import { Resend } from "resend";
import { logError } from "@/lib/log";
import { bookingCancelledEmail, bookingConfirmedEmail } from "./templates";

const resendClient = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM_ADDRESS = process.env.EMAIL_FROM ?? "Siam Tharadol <onboarding@resend.dev>";

/**
 * No email provider is configured until RESEND_API_KEY is set (see .env.example) — until then
 * this logs what would have been sent instead of throwing, so the booking/cancellation flow
 * never breaks for lack of email credentials. Get a real key at https://resend.com (free tier
 * is enough for a single hotel's volume) and verify a sending domain before going live —
 * `onboarding@resend.dev` only delivers to the Resend account's own verified email in test mode.
 */
async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  if (!resendClient) {
    console.log(`[email] RESEND_API_KEY not set — would send "${subject}" to ${to}`);
    return { sent: false as const };
  }
  try {
    const result = await resendClient.emails.send({ from: FROM_ADDRESS, to, subject, html });
    if (result.error) throw new Error(result.error.message);
    return { sent: true as const };
  } catch (err) {
    logError("email", err);
    return { sent: false as const };
  }
}

type BookingForEmail = Parameters<typeof bookingConfirmedEmail>[0] & { guestEmail?: string };

export async function sendBookingConfirmedEmail(booking: BookingForEmail & { guestEmail: string }) {
  const { subject, html } = bookingConfirmedEmail(booking);
  return sendEmail({ to: booking.guestEmail, subject, html });
}

export async function sendBookingCancelledEmail({
  booking,
  wasPaid,
  cancelledBy,
}: {
  booking: BookingForEmail & { guestEmail: string };
  wasPaid: boolean;
  cancelledBy: "admin" | "guest";
}) {
  const { subject, html } = bookingCancelledEmail(booking, { wasPaid, cancelledBy });
  return sendEmail({ to: booking.guestEmail, subject, html });
}
