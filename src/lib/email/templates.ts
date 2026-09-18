import { hotel } from "@/content/hotel";
import { formatDateDisplay, formatThb } from "@/lib/utils";

type BookingForEmail = {
  reference: string;
  guestName: string;
  checkIn: Date;
  checkOut: Date;
  adults: number;
  children: number;
  subtotalThb: number;
  taxThb: number;
  totalThb: number;
  room: { name: string };
};

// Table-based layout with inline styles only — the safe subset that renders consistently
// across email clients (no <style> blocks, no flex/grid).
function baseLayout(bodyHtml: string) {
  return `
<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#faf7f1;font-family:Georgia,'Times New Roman',serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#faf7f1;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background:#fffdfa;border:1px solid #e6ddce;max-width:560px;width:100%;">
            <tr>
              <td style="padding:32px 32px 20px;border-bottom:1px solid #e6ddce;">
                <p style="margin:0;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#7c5e2a;font-family:Arial,sans-serif;">Siam Tharadol</p>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px;border-top:1px solid #e6ddce;font-family:Arial,sans-serif;">
                <p style="margin:0;font-size:12px;color:#8a8178;">${hotel.address.full}</p>
                <p style="margin:6px 0 0;font-size:12px;color:#8a8178;">${hotel.phone.primaryDisplay} &middot; ${hotel.email}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function detailRow(label: string, value: string) {
  return `
    <tr>
      <td style="padding:6px 0;font-family:Arial,sans-serif;font-size:13px;color:#56504a;">${label}</td>
      <td style="padding:6px 0;font-family:Arial,sans-serif;font-size:13px;color:#221d17;font-weight:bold;text-align:right;">${value}</td>
    </tr>`;
}

function bookingDetailsTable(booking: BookingForEmail) {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;border-top:1px solid #e6ddce;border-bottom:1px solid #e6ddce;padding:4px 0;">
      ${detailRow("Booking Reference", booking.reference)}
      ${detailRow("Guest", booking.guestName)}
      ${detailRow("Room", booking.room.name)}
      ${detailRow("Check-in", formatDateDisplay(booking.checkIn))}
      ${detailRow("Check-out", formatDateDisplay(booking.checkOut))}
      ${detailRow("Guests", `${booking.adults} adult${booking.adults > 1 ? "s" : ""}${booking.children ? `, ${booking.children} child${booking.children > 1 ? "ren" : ""}` : ""}`)}
    </table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;">
      ${detailRow("Subtotal", formatThb(booking.subtotalThb))}
      ${detailRow("Tax", formatThb(booking.taxThb))}
      ${detailRow("Total", formatThb(booking.totalThb))}
    </table>`;
}

export function bookingConfirmedEmail(booking: BookingForEmail) {
  const manageUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://siamtharadol.com"}/book/manage?ref=${booking.reference}`;
  const body = `
    <h1 style="margin:0 0 8px;font-size:24px;color:#221d17;">Booking Confirmed</h1>
    <p style="margin:0;font-family:Arial,sans-serif;font-size:14px;color:#56504a;line-height:1.6;">
      Thank you, ${booking.guestName}. Your stay at Siam Tharadol is confirmed.
    </p>
    ${bookingDetailsTable(booking)}
    <p style="margin:20px 0 0;font-family:Arial,sans-serif;font-size:13px;color:#56504a;line-height:1.6;">
      Need to change or cancel your reservation? <a href="${manageUrl}" style="color:#a9813f;">Manage your booking</a>,
      or call us at ${hotel.phone.primaryDisplay}.
    </p>`;
  return { subject: `Booking Confirmed — ${booking.reference}`, html: baseLayout(body) };
}

export function bookingCancelledEmail(
  booking: BookingForEmail,
  { wasPaid, cancelledBy }: { wasPaid: boolean; cancelledBy: "admin" | "guest" }
) {
  const refundNote = wasPaid
    ? `<p style="margin:16px 0 0;font-family:Arial,sans-serif;font-size:13px;color:#56504a;line-height:1.6;">
         This booking had been paid. Our cancellation and refund policy is confirmed on a
         case-by-case basis — our team will be in touch about your refund, or you can reach us
         directly at ${hotel.phone.primaryDisplay} or ${hotel.email}.
       </p>`
    : "";
  const intro =
    cancelledBy === "guest"
      ? "As requested, your reservation at Siam Tharadol has been cancelled."
      : "Your reservation at Siam Tharadol has been cancelled by our team.";
  const body = `
    <h1 style="margin:0 0 8px;font-size:24px;color:#221d17;">Booking Cancelled</h1>
    <p style="margin:0;font-family:Arial,sans-serif;font-size:14px;color:#56504a;line-height:1.6;">
      ${booking.guestName}, ${intro}
    </p>
    ${bookingDetailsTable(booking)}
    ${refundNote}
    <p style="margin:20px 0 0;font-family:Arial,sans-serif;font-size:13px;color:#56504a;line-height:1.6;">
      We hope to welcome you another time. Questions? Call ${hotel.phone.primaryDisplay} or email ${hotel.email}.
    </p>`;
  return { subject: `Booking Cancelled — ${booking.reference}`, html: baseLayout(body) };
}
