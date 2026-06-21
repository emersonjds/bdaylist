import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMessages, sendMessage } from "@/entities/message";
import type { Message } from "@/entities/message";

interface SendMessageBody {
  author: string;
  text: string;
}

export function useMessages(eventId: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["messages", eventId],
    queryFn: () => getMessages(eventId),
  });

  const mutation = useMutation({
    mutationFn: (body: SendMessageBody) => sendMessage({ eventId, ...body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", eventId] });
    },
  });

  const messages: Message[] = query.data?.messages ?? [];

  return {
    messages,
    isLoading: query.isLoading,
    send: mutation,
  };
}
