import { FinalizarPresenteScreen } from "@/features/reservar-presente/finalizar-presente-screen";

// Static params for all seeded gift × token combinations
export function generateStaticParams() {
  const giftIds = ["p1", "p2", "p3", "p4", "p5"];
  return giftIds.map((giftId) => ({ token: "festa-rodrigo-25", giftId }));
}

interface PageProps {
  params: Promise<{ token: string; giftId: string }>;
}

export default async function Page({ params }: PageProps) {
  const { token, giftId } = await params;
  return <FinalizarPresenteScreen token={token} giftId={giftId} />;
}
