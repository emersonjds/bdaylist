import type { Event } from "@/entities/event/model";
import type { Gift } from "@/entities/gift/model";
import type { Convidado } from "@/entities/convidado/model";
import type { Reservation } from "@/entities/reservation/model";
import type { Rsvp } from "@/entities/rsvp/model";
import type { Recado } from "@/entities/recado/model";

let idCounter = 0;

export function nextId(): string {
  idCounter += 1;
  return String(idCounter);
}

export const db = {
  events: [] as Event[],
  gifts: [] as Gift[],
  convidados: [] as Convidado[],
  reservations: [] as Reservation[],
  rsvps: [] as Rsvp[],
  recados: [] as Recado[],

  reset() {
    idCounter = 0;

    this.events = [
      {
        id: "evento-1",
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
        eventId: "evento-1",
        name: "Fone Bluetooth Premium",
        description: "Fone sem fio com cancelamento de ruído",
        imageUrl: "",
        referencePrice: 1299,
        storeLink: "",
        mostWanted: true,
        isGroup: false,
        status: "available",
      },
      {
        id: "p2",
        eventId: "evento-1",
        name: "Câmera Instantânea",
        description: "Câmera para fotos instantâneas e memórias únicas",
        imageUrl: "",
        referencePrice: 450,
        storeLink: "",
        mostWanted: false,
        isGroup: false,
        status: "available",
      },
      {
        id: "p3",
        eventId: "evento-1",
        name: "Kit Velas Aromáticas",
        description: "Conjunto de velas aromáticas artesanais",
        imageUrl: "",
        referencePrice: 120,
        storeLink: "",
        mostWanted: false,
        isGroup: false,
        status: "available",
      },
      {
        id: "p4",
        eventId: "evento-1",
        name: "Cafeteira Especial",
        description: "Cafeteira de alta qualidade para os amantes de café",
        imageUrl: "",
        referencePrice: 1500,
        storeLink: "",
        mostWanted: false,
        isGroup: true,
        status: "available",
        groupGoal: { target: 1500, collected: 600 },
      },
      {
        id: "p5",
        eventId: "evento-1",
        name: "Livro Edição Luxo",
        description: "Edição especial com capa dura e ilustrações exclusivas",
        imageUrl: "",
        referencePrice: 89.9,
        storeLink: "",
        mostWanted: false,
        isGroup: false,
        status: "available",
      },
    ];

    this.convidados = [];
    this.reservations = [];
    this.rsvps = [];
    this.recados = [];
  },
};

db.reset();
