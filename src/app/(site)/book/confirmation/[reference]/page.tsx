import { Container } from "@/components/ui/Container";
import { ConfirmationStatus } from "@/components/booking/ConfirmationStatus";

export default async function ConfirmationPage({ params }: { params: Promise<{ reference: string }> }) {
  const { reference } = await params;

  return (
    <div className="pt-28 pb-24 sm:pt-32">
      <Container className="flex justify-center">
        <div className="w-full max-w-2xl">
          <ConfirmationStatus reference={reference} />
        </div>
      </Container>
    </div>
  );
}
