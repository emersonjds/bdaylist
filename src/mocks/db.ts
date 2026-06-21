import type { Evento } from "@/entities/evento/model";
import type { Gift } from "@/entities/gift/model";
import type { Convidado } from "@/entities/convidado/model";
import type { Reserva } from "@/entities/reserva/model";
import type { Rsvp } from "@/entities/rsvp/model";
import type { Recado } from "@/entities/recado/model";

let idCounter = 0;

export function nextId(): string {
  idCounter += 1;
  return String(idCounter);
}

export const db = {
  eventos: [] as Evento[],
  gifts: [] as Gift[],
  convidados: [] as Convidado[],
  reservas: [] as Reserva[],
  rsvps: [] as Rsvp[],
  recados: [] as Recado[],

  reset() {
    idCounter = 0;

    this.eventos = [
      {
        id: "evento-1",
        hostId: "host-1",
        titulo: "Meus 25 Anos!",
        dataAniversario: "2026-07-02",
        tema: "Vibrant Celebration",
        mensagem: "Venha celebrar comigo esse dia especial!",
        capaUrl: "",
        listToken: "festa-rodrigo-25",
        meta: { alvo: 5000, atingido: 2450 },
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
    this.reservas = [];
    this.rsvps = [];
    this.recados = [];
  },
};

db.reset();
