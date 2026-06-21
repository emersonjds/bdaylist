"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/features/auth";
import { getDashboard } from "@/entities/event";
import { createGift, updateGift, deleteGift } from "@/entities/gift";
import { DASHBOARD_QUERY_KEY } from "@/shared/lib/query-keys";

interface UpdateArgs {
  id: string;
  name?: string;
  description?: string;
  imageUrl?: string;
  referencePrice?: number;
  storeLink?: string;
  mostWanted?: boolean;
  isGroup?: boolean;
}

export function useGifts() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const authToken = user?.id ?? "";

  const query = useQuery({
    queryKey: DASHBOARD_QUERY_KEY,
    queryFn: () => getDashboard(authToken),
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationFn: createGift,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...body }: UpdateArgs) => updateGift(id, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteGift(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY }),
  });

  return {
    dashboard: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    create: createMutation.mutateAsync,
    update: updateMutation.mutateAsync,
    remove: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isRemoving: deleteMutation.isPending,
  };
}
