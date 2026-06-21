"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";
import { Dialog, Input, Button } from "@/shared/ui";

const guestFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
});

export type GuestFormValues = z.infer<typeof guestFormSchema>;

interface GuestFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: GuestFormValues) => Promise<void>;
}

export function GuestForm({ open, onClose, onSubmit }: GuestFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GuestFormValues>({
    resolver: zodResolver(guestFormSchema),
    defaultValues: { name: "", email: "" },
  });

  useEffect(() => {
    if (open) reset({ name: "", email: "" });
  }, [open, reset]);

  async function handleFormSubmit(data: GuestFormValues) {
    await onSubmit(data);
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-on-surface">Adicionar Convidado</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4" noValidate>
        <div>
          <Input id="name" label="Nome do Convidado" placeholder="Ex: Carla Mendes" {...register("name")} />
          {errors.name && <p className="mt-1 text-xs text-error">{errors.name.message}</p>}
        </div>

        <div>
          <Input
            id="email"
            label="E-mail"
            type="email"
            placeholder="convidado@email.com"
            {...register("email")}
          />
          {errors.email && <p className="mt-1 text-xs text-error">{errors.email.message}</p>}
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="ghost" className="flex-1" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" className="flex-1" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Adicionar"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
