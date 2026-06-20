"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";
import type { Presente } from "@/entities/presente";
import { Dialog, Input, Textarea, Button } from "@/shared/ui";

const giftFormSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  descricao: z.string(),
  imagemUrl: z.string(),
  precoReferencia: z.number().min(0, "Preço deve ser positivo"),
  linkLoja: z.string(),
  maisDesejado: z.boolean(),
  emGrupo: z.boolean(),
});

export type GiftFormValues = z.infer<typeof giftFormSchema>;

interface GiftFormProps {
  open: boolean;
  onClose: () => void;
  presente?: Presente;
  onSubmit: (data: GiftFormValues) => Promise<void>;
}

export function GiftForm({ open, onClose, presente, onSubmit }: GiftFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GiftFormValues>({
    resolver: zodResolver(giftFormSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      imagemUrl: "",
      precoReferencia: 0,
      linkLoja: "",
      maisDesejado: false,
      emGrupo: false,
    },
  });

  useEffect(() => {
    if (open) {
      reset(
        presente
          ? {
              nome: presente.nome,
              descricao: presente.descricao,
              imagemUrl: presente.imagemUrl,
              precoReferencia: presente.precoReferencia,
              linkLoja: presente.linkLoja,
              maisDesejado: presente.maisDesejado,
              emGrupo: presente.emGrupo,
            }
          : {
              nome: "",
              descricao: "",
              imagemUrl: "",
              precoReferencia: 0,
              linkLoja: "",
              maisDesejado: false,
              emGrupo: false,
            }
      );
    }
  }, [open, presente, reset]);

  async function handleFormSubmit(data: GiftFormValues) {
    await onSubmit(data);
    onClose();
  }

  const titulo = presente ? "Editar Presente" : "Adicionar Presente";

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
            id="nome"
            label="Nome do Presente"
            placeholder="Ex: Fone Bluetooth"
            {...register("nome")}
          />
          {errors.nome && <p className="mt-1 text-xs text-error">{errors.nome.message}</p>}
        </div>

        <Textarea
          id="descricao"
          label="Descrição"
          placeholder="Descreva o presente..."
          rows={3}
          {...register("descricao")}
        />

        <div>
          <Input
            id="precoReferencia"
            label="Preço de Referência (R$)"
            type="number"
            min={0}
            step={0.01}
            placeholder="0,00"
            {...register("precoReferencia", { valueAsNumber: true })}
          />
          {errors.precoReferencia && (
            <p className="mt-1 text-xs text-error">{errors.precoReferencia.message}</p>
          )}
        </div>

        <Input
          id="linkLoja"
          label="Link da Loja"
          type="url"
          placeholder="https://..."
          {...register("linkLoja")}
        />

        <Input
          id="imagemUrl"
          label="URL da Imagem"
          type="url"
          placeholder="https://..."
          {...register("imagemUrl")}
        />

        <div className="flex gap-6">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded accent-primary"
              {...register("maisDesejado")}
            />
            <span className="text-sm font-semibold text-on-surface">Mais Desejado</span>
          </label>

          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded accent-primary"
              {...register("emGrupo")}
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
