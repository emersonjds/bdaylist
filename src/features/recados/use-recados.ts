import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRecados, criarRecado } from "@/entities/recado";
import type { Recado } from "@/entities/recado";

interface EnviarRecadoBody {
  autor: string;
  texto: string;
}

export function useRecados(eventoId: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["recados", eventoId],
    queryFn: () => getRecados(eventoId),
  });

  const mutation = useMutation({
    mutationFn: (body: EnviarRecadoBody) =>
      criarRecado({ eventoId, ...body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recados", eventoId] });
    },
  });

  const recados: Recado[] = query.data?.recados ?? [];

  return {
    recados,
    isLoading: query.isLoading,
    enviar: mutation,
  };
}
