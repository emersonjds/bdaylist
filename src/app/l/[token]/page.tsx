import { ListaConvidadoScreen } from "@/features/lista-convidado/lista-convidado-screen";

export function generateStaticParams() {
  return [{ token: "festa-rodrigo-25" }];
}

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function Page({ params }: PageProps) {
  const { token } = await params;
  return <ListaConvidadoScreen token={token} />;
}
