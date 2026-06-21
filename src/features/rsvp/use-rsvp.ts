import { useMutation } from "@tanstack/react-query";
import { submitRsvp } from "@/entities/rsvp";

interface UseRsvpOptions {
  onSuccess?: () => void;
}

export function useRsvp(eventId: string, options?: UseRsvpOptions) {
  return useMutation({
    mutationFn: (name: string) => submitRsvp({ eventId, name }),
    onSuccess: options?.onSuccess,
  });
}
