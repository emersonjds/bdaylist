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
import { useReservar } from "./use-reservar";
import type { Lista } from "@/entities/lista/model";

type PresenteItem = Lista["presentes"][number];

const schema = z.object({
  convidadoNome: z.string().min(1, "Informe seu nome"),
  recado: z.string().max(500, "Máximo de 500 caracteres"),
});

type FormValues = z.infer<typeof schema>;

interface ReservaFormProps {
  gift: PresenteItem;
  token?: string;
  onSuccess: () => void;
}

export function ReservaForm({ gift, token, onSuccess }: ReservaFormProps) {
  const router = useRouter();
  const mutation = useReservar(gift.id, token);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { convidadoNome: "", recado: "" },
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
          id="convidadoNome"
          label="Seu nome"
          placeholder="Como você quer ser chamado(a)?"
          aria-invalid={!!errors.convidadoNome}
          {...register("convidadoNome")}
        />
        {errors.convidadoNome && (
          <p className="mt-1 text-xs text-error" role="alert">
            {errors.convidadoNome.message}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Textarea
          id="recado"
          label="Mensagem Carinhosa"
          placeholder="Escreva algo especial para o aniversariante..."
          className="h-32 resize-none"
          aria-invalid={!!errors.recado}
          {...register("recado")}
        />
        {errors.recado && (
          <p className="mt-1 text-xs text-error" role="alert">
            {errors.recado.message}
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
