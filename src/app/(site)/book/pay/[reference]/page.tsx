import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Container } from "@/components/ui/Container";
import { PaymentSimulator } from "@/components/booking/PaymentSimulator";

export default async function PayPage({
  params,
  searchParams,
}: {
  params: Promise<{ reference: string }>;
  searchParams: Promise<{ txn?: string }>;
}) {
  const { reference } = await params;
  const { txn } = await searchParams;

  const booking = await prisma.booking.findUnique({
    where: { reference },
    include: { payments: { orderBy: { createdAt: "desc" }, take: 1 } },
  });
  if (!booking) notFound();

  const transactionRef = txn ?? booking.payments[0]?.transactionRef;
  if (!transactionRef || booking.status !== "PENDING_PAYMENT") notFound();

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-ivory pt-24 pb-16">
      <Container className="flex justify-center">
        <div className="w-full max-w-md">
          <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.28em] text-gold-deep">
            Secure Payment
          </p>
          <PaymentSimulator reference={booking.reference} transactionRef={transactionRef} totalThb={booking.totalThb} />
        </div>
      </Container>
    </div>
  );
}
