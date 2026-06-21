"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGuest } from "@/entities/guest";
import { DASHBOARD_QUERY_KEY } from "@/shared/lib/query-keys";

export function useAddGuest() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createGuest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY }),
  });

  return {
    addGuest: mutation.mutateAsync,
    isAdding: mutation.isPending,
  };
}
