import type { Evento } from "@/entities/evento/model";
import type { Presente } from "@/entities/presente/model";
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
  presentes: [] as Presente[],
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

    this.presentes = [
      {
        id: "p1",
        eventoId: "evento-1",
        nome: "Fone Bluetooth Premium",
        descricao: "Fone sem fio com cancelamento de ruído",
        imagemUrl: "",
        precoReferencia: 1299,
        linkLoja: "",
        maisDesejado: true,
        emGrupo: false,
        status: "disponivel",
      },
      {
        id: "p2",
        eventoId: "evento-1",
        nome: "Câmera Instantânea",
        descricao: "Câmera para fotos instantâneas e memórias únicas",
        imagemUrl: "",
        precoReferencia: 450,
        linkLoja: "",
        maisDesejado: false,
        emGrupo: false,
        status: "disponivel",
      },
      {
        id: "p3",
        eventoId: "evento-1",
        nome: "Kit Velas Aromáticas",
        descricao: "Conjunto de velas aromáticas artesanais",
        imagemUrl: "",
        precoReferencia: 120,
        linkLoja: "",
        maisDesejado: false,
        emGrupo: false,
        status: "disponivel",
      },
      {
        id: "p4",
        eventoId: "evento-1",
        nome: "Cafeteira Especial",
        descricao: "Cafeteira de alta qualidade para os amantes de café",
        imagemUrl: "",
        precoReferencia: 1500,
        linkLoja: "",
        maisDesejado: false,
        emGrupo: true,
        status: "disponivel",
        metaGrupo: { alvo: 1500, arrecadado: 600 },
      },
      {
        id: "p5",
        eventoId: "evento-1",
        nome: "Livro Edição Luxo",
        descricao: "Edição especial com capa dura e ilustrações exclusivas",
        imagemUrl: "",
        precoReferencia: 89.9,
        linkLoja: "",
        maisDesejado: false,
        emGrupo: false,
        status: "disponivel",
      },
    ];

    this.convidados = [];
    this.reservas = [];
    this.rsvps = [];
    this.recados = [];
  },
};

db.reset();
