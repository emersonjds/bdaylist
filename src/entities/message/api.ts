import { apiGet, apiSend } from "@/shared/lib/http";
import type { Message } from "./model";

interface SendMessageBody {
  eventId: string;
  author: string;
  text: string;
}

export async function getMessages(eventId: string): Promise<{ messages: Message[] }> {
  return apiGet<{ messages: Message[] }>(`/api/messages/${eventId}`);
}

export async function sendMessage(body: SendMessageBody): Promise<{ message: Message }> {
  return apiSend<{ message: Message }>("/api/messages", { method: "POST", body });
}
