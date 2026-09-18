import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ManageBookingClient } from "@/components/booking/ManageBookingClient";

export const metadata: Metadata = {
  title: "Manage Your Booking",
  description: "Look up your Siam Tharadol reservation to view details or cancel.",
};

export default async function ManageBookingPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;

  return (
    <div className="pt-28 pb-24 sm:pt-32">
      <Container>
        <div className="mx-auto max-w-md text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-deep">Manage Booking</p>
          <h1 className="mt-3 font-display text-3xl text-ink">Your Reservation</h1>
        </div>
        <div className="mt-10">
          <ManageBookingClient initialReference={ref ?? ""} />
        </div>
      </Container>
    </div>
  );
}
