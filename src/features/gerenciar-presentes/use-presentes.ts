"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/features/auth";
import { getPainel } from "@/entities/evento";
import { criarPresente, atualizarPresente, removerPresente } from "@/entities/presente";

export const PAINEL_QUERY_KEY = ["painel"] as const;

interface AtualizarArgs {
  id: string;
  nome?: string;
  descricao?: string;
  imagemUrl?: string;
  precoReferencia?: number;
  linkLoja?: string;
  maisDesejado?: boolean;
  emGrupo?: boolean;
}

export function usePresentes() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const authToken = user?.id ?? "";

  const query = useQuery({
    queryKey: PAINEL_QUERY_KEY,
    queryFn: () => getPainel(authToken),
    enabled: !!user,
  });

  const criarMutation = useMutation({
    mutationFn: criarPresente,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PAINEL_QUERY_KEY }),
  });

  const atualizarMutation = useMutation({
    mutationFn: ({ id, ...body }: AtualizarArgs) => atualizarPresente(id, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PAINEL_QUERY_KEY }),
  });

  const removerMutation = useMutation({
    mutationFn: (id: string) => removerPresente(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PAINEL_QUERY_KEY }),
  });

  return {
    painel: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    criar: criarMutation.mutateAsync,
    atualizar: atualizarMutation.mutateAsync,
    remover: removerMutation.mutateAsync,
    isCriando: criarMutation.isPending,
    isAtualizando: atualizarMutation.isPending,
    isRemovendo: removerMutation.isPending,
  };
}
