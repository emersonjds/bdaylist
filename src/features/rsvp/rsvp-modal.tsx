"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2 } from "lucide-react";
import { Dialog } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { useRsvp } from "./use-rsvp";

interface RsvpModalProps {
  open: boolean;
  onClose: () => void;
  eventoId: string;
}

export function RsvpModal({ open, onClose, eventoId }: RsvpModalProps) {
  const [nome, setNome] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const mutation = useRsvp(eventoId, {
    onSuccess: () => setConfirmed(true),
  });

  function handleClose() {
    setNome("");
    setConfirmed(false);
    mutation.reset();
    onClose();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (nome.trim()) {
      mutation.mutate(nome.trim());
    }
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      {confirmed ? (
        <div className="py-2 text-center">
          <CheckCircle2 className="mx-auto mb-4 h-14 w-14 text-secondary" />
          <h2 className="mb-2 text-2xl font-extrabold text-on-surface">Presença Confirmada!</h2>
          <p className="mb-6 text-on-surface-variant">
            Mal posso esperar para te ver na festa. Prepare-se para muita diversão!
          </p>
          <Button className="w-full" size="lg" onClick={handleClose}>
            Excelente!
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <h2 className="text-center text-xl font-extrabold text-on-surface">
            Confirmar Presença (RSVP)
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              id="rsvp-nome"
              label="Seu nome"
              placeholder="Digite seu nome"
              value={nome}
              onChange={(event) => setNome(event.target.value)}
              required
              maxLength={100}
            />
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={mutation.isPending || !nome.trim()}
            >
              {mutation.isPending ? "Confirmando..." : "Confirmar Presença"}
            </Button>
            {mutation.isError && (
              <p className="text-center text-sm text-primary">
                Não foi possível confirmar. Tente novamente.
              </p>
            )}
          </form>
        </div>
      )}
    </Dialog>
  );
}
