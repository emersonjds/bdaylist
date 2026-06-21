"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";
import type { Gift } from "@/entities/gift";
import { Dialog, Input, Textarea, Button } from "@/shared/ui";

const safeUrl = z
  .string()
  .refine(
    (value) => value === "" || /^https?:\/\//i.test(value),
    "URL deve começar com http:// ou https://"
  );

const giftFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string(),
  imageUrl: safeUrl,
  referencePrice: z.number().min(0, "Preço deve ser positivo"),
  storeLink: safeUrl,
  mostWanted: z.boolean(),
  isGroup: z.boolean(),
});

export type GiftFormValues = z.infer<typeof giftFormSchema>;

interface GiftFormProps {
  open: boolean;
  onClose: () => void;
  gift?: Gift;
  onSubmit: (data: GiftFormValues) => Promise<void>;
}

export function GiftForm({ open, onClose, gift, onSubmit }: GiftFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GiftFormValues>({
    resolver: zodResolver(giftFormSchema),
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "",
      referencePrice: 0,
      storeLink: "",
      mostWanted: false,
      isGroup: false,
    },
  });

  useEffect(() => {
    if (open) {
      reset(
        gift
          ? {
              name: gift.name,
              description: gift.description,
              imageUrl: gift.imageUrl,
              referencePrice: gift.referencePrice,
              storeLink: gift.storeLink,
              mostWanted: gift.mostWanted,
              isGroup: gift.isGroup,
            }
          : {
              name: "",
              description: "",
              imageUrl: "",
              referencePrice: 0,
              storeLink: "",
              mostWanted: false,
              isGroup: false,
            }
      );
    }
  }, [open, gift, reset]);

  async function handleFormSubmit(data: GiftFormValues) {
    await onSubmit(data);
    onClose();
  }

  const titulo = gift ? "Editar Presente" : "Adicionar Presente";

  return (
    <Dialog open={open} onClose={onClose}>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-on-surface">{titulo}</h2>
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
          <Input
            id="name"
            label="Nome do Presente"
            placeholder="Ex: Fone Bluetooth"
            {...register("name")}
          />
          {errors.name && <p className="mt-1 text-xs text-error">{errors.name.message}</p>}
        </div>

        <Textarea
          id="description"
          label="Descrição"
          placeholder="Descreva o presente..."
          rows={3}
          {...register("description")}
        />

        <div>
          <Input
            id="referencePrice"
            label="Preço de Referência (R$)"
            type="number"
            min={0}
            step={0.01}
            placeholder="0,00"
            {...register("referencePrice", { valueAsNumber: true })}
          />
          {errors.referencePrice && (
            <p className="mt-1 text-xs text-error">{errors.referencePrice.message}</p>
          )}
        </div>

        <Input
          id="storeLink"
          label="Link da Loja"
          type="url"
          placeholder="https://..."
          {...register("storeLink")}
        />

        <Input
          id="imageUrl"
          label="URL da Imagem"
          type="url"
          placeholder="https://..."
          {...register("imageUrl")}
        />

        <div className="flex gap-6">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded accent-primary"
              {...register("mostWanted")}
            />
            <span className="text-sm font-semibold text-on-surface">Mais Desejado</span>
          </label>

          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded accent-primary"
              {...register("isGroup")}
            />
            <span className="text-sm font-semibold text-on-surface">Presente em Grupo</span>
          </label>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="ghost" className="flex-1" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" className="flex-1" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
