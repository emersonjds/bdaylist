import { GuestListScreen } from "@/features/guest-list/guest-list-screen";

export function generateStaticParams() {
  return [{ token: "festa-rodrigo-25" }];
}

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function Page({ params }: PageProps) {
  const { token } = await params;
  return <GuestListScreen token={token} />;
}
