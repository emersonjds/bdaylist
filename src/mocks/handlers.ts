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

interface ReservationBody {
  guestName: string;
  message: string;
  idempotencyKey: string;
}

interface RsvpBody {
  eventId: string;
  name: string;
  status?: "confirmed" | "declined";
}

interface MessageBody {
  eventId: string;
  author: string;
  text: string;
}

interface GuestBody {
  name: string;
  email: string;
}

export const handlers = [
  http.get("/api/registry/:token", ({ params }) => {
    const token = params.token as string;
    const event = db.events.find((e) => e.listToken === token);
    if (!event) {
      return HttpResponse.json({ message: "Lista não encontrada" }, { status: 404 });
    }
    const gifts = db.gifts.filter((g) => g.eventId === event.id);
    const host = { name: "Rodrigo", id: event.hostId };
    return HttpResponse.json({ event, host, gifts });
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
    const confirmedNames = new Set(
      db.rsvps
        .filter((r) => r.eventId === event.id && r.status === "confirmed")
        .map((r) => r.name)
    );
    const guests = db.guests
      .filter((g) => g.eventId === event.id)
      .map((g) => ({ ...g, confirmed: confirmedNames.has(g.name) }));
    return HttpResponse.json({
      event,
      gifts,
      guests,
      metrics: { confirmed: confirmedNames.size },
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

    const body = (await request.json()) as unknown as ReservationBody;

    // Atomic check: server is source of truth for reservations
    const existingReservation = db.reservations.find((r) => r.giftId === id);

    if (existingReservation) {
      if (existingReservation.idempotencyKey === body.idempotencyKey) {
        // Same caller retrying: idempotent replay — return the original record
        return HttpResponse.json({ reservation: existingReservation }, { status: 200 });
      }
      // Different caller: conflict
      return HttpResponse.json(
        { message: "Este presente já foi reservado por outra pessoa." },
        { status: 409 }
      );
    }

    // Gift is available: create reservation and flip status server-side
    const reservation = {
      id: nextId(),
      giftId: id,
      guestName: body.guestName,
      message: body.message,
      idempotencyKey: body.idempotencyKey,
      createdAt: new Date().toISOString(),
    };
    db.reservations.push(reservation);

    const giftIndex = db.gifts.findIndex((g) => g.id === id);
    db.gifts[giftIndex]!.status = "reserved";

    return HttpResponse.json({ reservation }, { status: 201 });
  }),

  http.post("/api/guests", async ({ request }) => {
    const body = (await request.json()) as unknown as GuestBody;
    const event = db.events[0];
    if (!event) {
      return HttpResponse.json({ message: "Evento não encontrado" }, { status: 404 });
    }
    const guest = {
      id: `guest-${nextId()}`,
      eventId: event.id,
      name: body.name,
      email: body.email,
    };
    db.guests.push(guest);
    return HttpResponse.json({ guest }, { status: 201 });
  }),

  http.post("/api/rsvp", async ({ request }) => {
    const body = (await request.json()) as unknown as RsvpBody;
    const rsvp = {
      id: nextId(),
      eventId: body.eventId,
      name: body.name,
      status: body.status ?? ("confirmed" as const),
    };
    db.rsvps.push(rsvp);
    return HttpResponse.json({ rsvp }, { status: 201 });
  }),

  http.get("/api/messages/:eventId", ({ params }) => {
    const eventId = params.eventId as string;
    const messages = db.messages.filter((m) => m.eventId === eventId);
    return HttpResponse.json({ messages });
  }),

  http.post("/api/messages", async ({ request }) => {
    const body = (await request.json()) as unknown as MessageBody;
    const message = {
      id: nextId(),
      eventId: body.eventId,
      author: body.author,
      text: body.text,
      createdAt: new Date().toISOString(),
    };
    db.messages.push(message);
    return HttpResponse.json({ message }, { status: 201 });
  }),

  http.post("/api/auth/google", () => {
    return HttpResponse.json({
      user: {
        id: "host-1",
        name: "Rodrigo",
        email: "rodrigo@example.com",
        avatarUrl: "",
      },
    });
  }),
];
