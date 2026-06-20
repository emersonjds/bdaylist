"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { Button } from "@/shared/ui/button";
import { useRecados } from "./use-recados";

const recadoSchema = z.object({
  autor: z.string().min(1, "Informe seu nome"),
  texto: z.string().min(1, "Escreva uma mensagem").max(500, "Máximo de 500 caracteres"),
});

type RecadoFormData = z.infer<typeof recadoSchema>;

interface RecadoFormProps {
  eventoId: string;
}

export function RecadoForm({ eventoId }: RecadoFormProps) {
  const { enviar } = useRecados(eventoId);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RecadoFormData>({
    resolver: zodResolver(recadoSchema),
    defaultValues: { autor: "", texto: "" },
  });

  const textoLength = watch("texto").length;

  async function onSubmit(data: RecadoFormData) {
    await enviar.mutateAsync(data);
    reset();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label
          htmlFor="recado-autor"
          className="text-sm font-semibold text-on-surface"
        >
          Seu nome
        </label>
        <Input
          id="recado-autor"
          placeholder="Como devemos te chamar?"
          {...register("autor")}
        />
        {errors.autor && (
          <p className="text-xs text-primary">{errors.autor.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="recado-texto"
          className="text-sm font-semibold text-on-surface"
        >
          Mensagem
        </label>
        <Textarea
          id="recado-texto"
          rows={3}
          placeholder="Deixe um recado carinhoso..."
          {...register("texto")}
        />
        <div className="flex justify-between items-center">
          {errors.texto ? (
            <p className="text-xs text-primary">{errors.texto.message}</p>
          ) : (
            <span />
          )}
          <span className="text-xs text-on-surface-variant">
            {textoLength}/500
          </span>
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        disabled={isSubmitting || enviar.isPending}
        className="self-end"
      >
        <Send className="w-4 h-4" />
        Enviar Recado
      </Button>
    </form>
  );
}
