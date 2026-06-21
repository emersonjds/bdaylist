import type { Event } from "@/entities/event/model";
import type { Gift } from "@/entities/gift/model";
import type { Guest } from "@/entities/guest/model";
import type { Reservation } from "@/entities/reservation/model";
import type { Rsvp } from "@/entities/rsvp/model";
import type { Message } from "@/entities/message/model";

const UNSPLASH = "https://images.unsplash.com";
const IMG_PARAMS = "w=600&q=80&fit=crop&auto=format";

let idCounter = 0;

export function nextId(): string {
  idCounter += 1;
  return String(idCounter);
}

export const db = {
  events: [] as Event[],
  gifts: [] as Gift[],
  guests: [] as Guest[],
  reservations: [] as Reservation[],
  rsvps: [] as Rsvp[],
  messages: [] as Message[],

  reset() {
    idCounter = 0;

    this.events = [
      {
        id: "event-1",
        hostId: "host-1",
        title: "Meus 25 Anos!",
        birthDate: "2026-07-02",
        theme: "Vibrant Celebration",
        message: "Venha celebrar comigo esse dia especial!",
        coverUrl: "",
        listToken: "festa-rodrigo-25",
        goal: { target: 5000, reached: 2450 },
      },
    ];

    this.gifts = [
      {
        id: "p1",
        eventId: "event-1",
        name: "Fone Bluetooth Premium",
        description: "Fone sem fio com cancelamento de ruído",
        imageUrl: `${UNSPLASH}/photo-1505740420928-5e560c06d30e?${IMG_PARAMS}`,
        referencePrice: 1299,
        storeLink: "",
        mostWanted: true,
        isGroup: false,
        status: "available",
      },
      {
        id: "p2",
        eventId: "event-1",
        name: "Câmera Instantânea",
        description: "Câmera para fotos instantâneas e memórias únicas",
        imageUrl: `${UNSPLASH}/photo-1526170375885-4d8ecf77b99f?${IMG_PARAMS}`,
        referencePrice: 450,
        storeLink: "",
        mostWanted: false,
        isGroup: false,
        status: "available",
      },
      {
        id: "p3",
        eventId: "event-1",
        name: "Kit Velas Aromáticas",
        description: "Conjunto de velas aromáticas artesanais",
        imageUrl: `${UNSPLASH}/photo-1603006905003-be475563bc59?${IMG_PARAMS}`,
        referencePrice: 120,
        storeLink: "",
        mostWanted: false,
        isGroup: false,
        status: "available",
      },
      {
        id: "p4",
        eventId: "event-1",
        name: "Cafeteira Especial",
        description: "Cafeteira de alta qualidade para os amantes de café",
        imageUrl: `${UNSPLASH}/photo-1495474472287-4d71bcdd2085?${IMG_PARAMS}`,
        referencePrice: 1500,
        storeLink: "",
        mostWanted: false,
        isGroup: true,
        status: "available",
        groupGoal: { target: 1500, collected: 600 },
      },
      {
        id: "p5",
        eventId: "event-1",
        name: "Livro Edição Luxo",
        description: "Edição especial com capa dura e ilustrações exclusivas",
        imageUrl: `${UNSPLASH}/photo-1544947950-fa07a98d237f?${IMG_PARAMS}`,
        referencePrice: 89.9,
        storeLink: "",
        mostWanted: false,
        isGroup: false,
        status: "available",
      },
    ];

    this.guests = [
      { id: "g1", eventId: "event-1", name: "Carla Mendes", email: "carla@example.com" },
      { id: "g2", eventId: "event-1", name: "Bruno Lima", email: "bruno@example.com" },
      { id: "g3", eventId: "event-1", name: "Aline Souza", email: "aline@example.com" },
      { id: "g4", eventId: "event-1", name: "Diego Rocha", email: "diego@example.com" },
    ];

    this.reservations = [];

    this.rsvps = [
      { id: "r1", eventId: "event-1", name: "Carla Mendes", status: "confirmed" },
      { id: "r2", eventId: "event-1", name: "Bruno Lima", status: "confirmed" },
      { id: "r3", eventId: "event-1", name: "Aline Souza", status: "confirmed" },
      { id: "r4", eventId: "event-1", name: "Diego Rocha", status: "confirmed" },
    ];

    this.messages = [];
  },
};

db.reset();
