"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { Button } from "@/shared/ui/button";
import { useMessages } from "./use-messages";

const messageSchema = z.object({
  author: z.string().min(1, "Informe seu nome"),
  text: z.string().min(1, "Escreva uma mensagem").max(500, "Máximo de 500 caracteres"),
});

type MessageFormData = z.infer<typeof messageSchema>;

interface MessageFormProps {
  eventId: string;
}

export function MessageForm({ eventId }: MessageFormProps) {
  const { send } = useMessages(eventId);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<MessageFormData>({
    resolver: zodResolver(messageSchema),
    defaultValues: { author: "", text: "" },
  });

  const textLength = watch("text").length;

  async function onSubmit(data: MessageFormData) {
    await send.mutateAsync(data);
    reset();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="message-author" className="text-sm font-semibold text-on-surface">
          Seu nome no recado
        </label>
        <Input id="message-author" placeholder="Como devemos te chamar?" {...register("author")} />
        {errors.author && <p className="text-xs text-primary">{errors.author.message}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="message-text" className="text-sm font-semibold text-on-surface">
          Mensagem
        </label>
        <Textarea
          id="message-text"
          rows={3}
          placeholder="Deixe um recado carinhoso..."
          {...register("text")}
        />
        <div className="flex items-center justify-between">
          {errors.text ? <p className="text-xs text-primary">{errors.text.message}</p> : <span />}
          <span className="text-xs text-on-surface-variant">{textLength}/500</span>
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        disabled={isSubmitting || send.isPending}
        className="self-end"
      >
        <Send className="h-4 w-4" />
        Enviar Recado
      </Button>
    </form>
  );
}
