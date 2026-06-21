import { http, HttpResponse } from "msw";
import { db, nextId } from "./db";

interface CreateGiftBody {
  name: string;
  description?: string;
  imageUrl?: string;
  referencePrice?: number;
  storeLink?: string;
  mostWanted?: boolean;
  isGroup?: boolean;
}

interface UpdateGiftBody {
  name?: string;
  description?: string;
  imageUrl?: string;
  referencePrice?: number;
  storeLink?: string;
  mostWanted?: boolean;
  isGroup?: boolean;
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
    const event = db.events.find((e) => e.listToken === token);
    if (!event) {
      return HttpResponse.json({ message: "Lista não encontrada" }, { status: 404 });
    }
    const gifts = db.gifts.filter((g) => g.eventId === event.id);
    const host = { nome: "Rodrigo", id: event.hostId };
    return HttpResponse.json({ evento: event, host, gifts });
  }),

  http.get("/api/dashboard", ({ request }) => {
    if (!request.headers.get("Authorization")) {
      return HttpResponse.json({ message: "Não autorizado" }, { status: 401 });
    }
    const event = db.events[0];
    if (!event) {
      return HttpResponse.json({ message: "Evento não encontrado" }, { status: 404 });
    }
    const gifts = db.gifts.filter((g) => g.eventId === event.id);
    const convidados = db.convidados.filter((c) => c.eventoId === event.id);
    const confirmed = db.rsvps.filter(
      (r) => r.eventoId === event.id && r.status === "confirmado"
    ).length;
    return HttpResponse.json({
      event,
      gifts,
      convidados,
      metrics: { confirmed },
    });
  }),

  http.post("/api/gifts", async ({ request }) => {
    const body = (await request.json()) as unknown as CreateGiftBody;
    const event = db.events[0];
    if (!event) {
      return HttpResponse.json({ message: "Evento não encontrado" }, { status: 404 });
    }
    const gift = {
      id: `new-${nextId()}`,
      eventId: event.id,
      name: body.name,
      description: body.description ?? "",
      imageUrl: body.imageUrl ?? "",
      referencePrice: body.referencePrice ?? 0,
      storeLink: body.storeLink ?? "",
      mostWanted: body.mostWanted ?? false,
      isGroup: body.isGroup ?? false,
      status: "available" as const,
    };
    db.gifts.push(gift);
    return HttpResponse.json({ gift }, { status: 201 });
  }),

  http.patch("/api/gifts/:id", async ({ params, request }) => {
    const id = params.id as string;
    const index = db.gifts.findIndex((g) => g.id === id);
    if (index === -1) {
      return HttpResponse.json({ message: "Presente não encontrado" }, { status: 404 });
    }
    const body = (await request.json()) as unknown as UpdateGiftBody;
    db.gifts[index] = { ...db.gifts[index]!, ...body };
    return HttpResponse.json({ gift: db.gifts[index] });
  }),

  http.delete("/api/gifts/:id", ({ params }) => {
    const id = params.id as string;
    const index = db.gifts.findIndex((g) => g.id === id);
    if (index === -1) {
      return HttpResponse.json({ message: "Presente não encontrado" }, { status: 404 });
    }
    db.gifts.splice(index, 1);
    return HttpResponse.json({ success: true });
  }),

  http.post("/api/gifts/:id/reservation", async ({ params, request }) => {
    const id = params.id as string;
    const gift = db.gifts.find((g) => g.id === id);
    if (!gift) {
      return HttpResponse.json({ message: "Presente não encontrado" }, { status: 404 });
    }

    const body = (await request.json()) as unknown as ReservaBody;

    // Atomic check: server is source of truth for reservations
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

    const giftIndex = db.gifts.findIndex((g) => g.id === id);
    db.gifts[giftIndex]!.status = "reserved";

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
