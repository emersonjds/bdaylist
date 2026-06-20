import { http, HttpResponse } from "msw";
import { db, nextId } from "./db";

interface CriarPresenteBody {
  nome: string;
  descricao?: string;
  imagemUrl?: string;
  precoReferencia?: number;
  linkLoja?: string;
  maisDesejado?: boolean;
  emGrupo?: boolean;
}

interface AtualizarPresenteBody {
  nome?: string;
  descricao?: string;
  imagemUrl?: string;
  precoReferencia?: number;
  linkLoja?: string;
  maisDesejado?: boolean;
  emGrupo?: boolean;
}

interface ReservaBody {
  convidadoNome: string;
  recado: string;
  idempotencyKey: string;
}

interface RsvpBody {
  eventoId: string;
  nome: string;
  status?: "confirmado" | "recusado";
}

interface RecadoBody {
  eventoId: string;
  autor: string;
  texto: string;
}

export const handlers = [
  http.get("/api/lista/:token", ({ params }) => {
    const token = params.token as string;
    const evento = db.eventos.find((e) => e.listToken === token);
    if (!evento) {
      return HttpResponse.json({ message: "Lista não encontrada" }, { status: 404 });
    }
    const presentes = db.presentes.filter((p) => p.eventoId === evento.id);
    const host = { nome: "Rodrigo", id: evento.hostId };
    return HttpResponse.json({ evento, host, presentes });
  }),

  http.get("/api/painel", ({ request }) => {
    if (!request.headers.get("Authorization")) {
      return HttpResponse.json({ message: "Não autorizado" }, { status: 401 });
    }
    const evento = db.eventos[0];
    if (!evento) {
      return HttpResponse.json({ message: "Evento não encontrado" }, { status: 404 });
    }
    const presentes = db.presentes.filter((p) => p.eventoId === evento.id);
    const convidados = db.convidados.filter((c) => c.eventoId === evento.id);
    const confirmados = db.rsvps.filter(
      (r) => r.eventoId === evento.id && r.status === "confirmado"
    ).length;
    return HttpResponse.json({
      evento,
      presentes,
      convidados,
      metrics: { confirmados },
    });
  }),

  http.post("/api/presentes", async ({ request }) => {
    const body = (await request.json()) as unknown as CriarPresenteBody;
    const evento = db.eventos[0];
    if (!evento) {
      return HttpResponse.json({ message: "Evento não encontrado" }, { status: 404 });
    }
    const presente = {
      id: `new-${nextId()}`,
      eventoId: evento.id,
      nome: body.nome,
      descricao: body.descricao ?? "",
      imagemUrl: body.imagemUrl ?? "",
      precoReferencia: body.precoReferencia ?? 0,
      linkLoja: body.linkLoja ?? "",
      maisDesejado: body.maisDesejado ?? false,
      emGrupo: body.emGrupo ?? false,
      status: "disponivel" as const,
    };
    db.presentes.push(presente);
    return HttpResponse.json({ presente }, { status: 201 });
  }),

  http.patch("/api/presentes/:id", async ({ params, request }) => {
    const id = params.id as string;
    const index = db.presentes.findIndex((p) => p.id === id);
    if (index === -1) {
      return HttpResponse.json({ message: "Presente não encontrado" }, { status: 404 });
    }
    const body = (await request.json()) as unknown as AtualizarPresenteBody;
    db.presentes[index] = { ...db.presentes[index]!, ...body };
    return HttpResponse.json({ presente: db.presentes[index] });
  }),

  http.delete("/api/presentes/:id", ({ params }) => {
    const id = params.id as string;
    const index = db.presentes.findIndex((p) => p.id === id);
    if (index === -1) {
      return HttpResponse.json({ message: "Presente não encontrado" }, { status: 404 });
    }
    db.presentes.splice(index, 1);
    return HttpResponse.json({ success: true });
  }),

  http.post("/api/presentes/:id/reserva", async ({ params, request }) => {
    const id = params.id as string;
    const presente = db.presentes.find((p) => p.id === id);
    if (!presente) {
      return HttpResponse.json({ message: "Presente não encontrado" }, { status: 404 });
    }

    const body = (await request.json()) as unknown as ReservaBody;

    // Atomic check: look up existing reservation by presenteId as source of truth
    const existingReserva = db.reservas.find((r) => r.presenteId === id);

    if (existingReserva) {
      if (existingReserva.idempotencyKey === body.idempotencyKey) {
        // Same caller retrying: idempotent replay — return the original record
        return HttpResponse.json({ reserva: existingReserva }, { status: 200 });
      }
      // Different caller: conflict
      return HttpResponse.json(
        { message: "Este presente já foi reservado por outra pessoa." },
        { status: 409 }
      );
    }

    // Gift is available: create reservation and flip status server-side
    const reserva = {
      id: nextId(),
      presenteId: id,
      convidadoNome: body.convidadoNome,
      recado: body.recado,
      idempotencyKey: body.idempotencyKey,
      criadaEm: new Date().toISOString(),
    };
    db.reservas.push(reserva);

    const presenteIndex = db.presentes.findIndex((p) => p.id === id);
    db.presentes[presenteIndex]!.status = "reservado";

    return HttpResponse.json({ reserva }, { status: 201 });
  }),

  http.post("/api/rsvp", async ({ request }) => {
    const body = (await request.json()) as unknown as RsvpBody;
    const rsvp = {
      id: nextId(),
      eventoId: body.eventoId,
      nome: body.nome,
      status: body.status ?? ("confirmado" as const),
    };
    db.rsvps.push(rsvp);
    return HttpResponse.json({ rsvp }, { status: 201 });
  }),

  http.get("/api/recados/:eventoId", ({ params }) => {
    const eventoId = params.eventoId as string;
    const recados = db.recados.filter((r) => r.eventoId === eventoId);
    return HttpResponse.json({ recados });
  }),

  http.post("/api/recados", async ({ request }) => {
    const body = (await request.json()) as unknown as RecadoBody;
    const recado = {
      id: nextId(),
      eventoId: body.eventoId,
      autor: body.autor,
      texto: body.texto,
      criadoEm: new Date().toISOString(),
    };
    db.recados.push(recado);
    return HttpResponse.json({ recado }, { status: 201 });
  }),

  http.post("/api/auth/google", () => {
    return HttpResponse.json({
      user: {
        id: "host-1",
        nome: "Rodrigo",
        email: "rodrigo@example.com",
        avatarUrl: "",
      },
    });
  }),
];
