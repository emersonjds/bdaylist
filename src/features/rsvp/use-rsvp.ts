import { useMutation } from "@tanstack/react-query";
import { enviarRsvp } from "@/entities/rsvp";

interface UseRsvpOptions {
  onSuccess?: () => void;
}

export function useRsvp(eventoId: string, options?: UseRsvpOptions) {
  return useMutation({
    mutationFn: (nome: string) => enviarRsvp({ eventoId, nome }),
    onSuccess: options?.onSuccess,
  });
}
