"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { PartyPopper } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { HttpError } from "@/shared/lib/http";
import { useReserveGift } from "./use-reserve-gift";
import type { Registry } from "@/entities/registry/model";

type GiftItem = Registry["gifts"][number];

const schema = z.object({
  guestName: z.string().min(1, "Informe seu nome"),
  message: z.string().max(500, "Máximo de 500 caracteres"),
});

type FormValues = z.infer<typeof schema>;

interface ReservationFormProps {
  gift: GiftItem;
  token?: string;
  onSuccess: () => void;
}

export function ReservationForm({ gift, token, onSuccess }: ReservationFormProps) {
  const router = useRouter();
  const mutation = useReserveGift(gift.id, token);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { guestName: "", message: "" },
  });

  async function onSubmit(values: FormValues) {
    try {
      await mutation.mutateAsync(values);
      onSuccess();
    } catch (error) {
      if (error instanceof HttpError && error.status === 409) {
        toast.error("Este presente já foi reservado.");
        if (token) router.push(`/l/${token}`);
        return;
      }
      toast.error("Erro ao reservar presente. Tente novamente.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <div className="space-y-1">
        <Input
          id="guestName"
          label="Seu nome"
          placeholder="Como você quer ser chamado(a)?"
          aria-invalid={!!errors.guestName}
          {...register("guestName")}
        />
        {errors.guestName && (
          <p className="mt-1 text-xs text-error" role="alert">
            {errors.guestName.message}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Textarea
          id="message"
          label="Mensagem Carinhosa"
          placeholder="Escreva algo especial para o aniversariante..."
          className="h-32 resize-none"
          aria-invalid={!!errors.message}
          {...register("message")}
        />
        {errors.message && (
          <p className="mt-1 text-xs text-error" role="alert">
            {errors.message.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={isSubmitting || mutation.isPending}
      >
        <PartyPopper className="h-5 w-5" />
        Confirmar Reserva
      </Button>
    </form>
  );
}
