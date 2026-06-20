"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getLista } from "@/entities/lista";
import type { Lista } from "@/entities/lista";
import type { PriceFaixa } from "./price-filter";

type PresenteItem = Lista["presentes"][number];

interface UseListaResult {
  lista: Lista | undefined;
  isLoading: boolean;
  isError: boolean;
  search: string;
  setSearch: (value: string) => void;
  priceFaixa: PriceFaixa;
  setPriceFaixa: (value: PriceFaixa) => void;
  presentesFiltrados: PresenteItem[];
}

function matchesPriceFaixa(preco: number, faixa: PriceFaixa): boolean {
  switch (faixa) {
    case "ate100":
      return preco <= 100;
    case "100a300":
      return preco > 100 && preco <= 300;
    case "acima300":
      return preco > 300;
    default:
      return true;
  }
}

export function useLista(token: string): UseListaResult {
  const [search, setSearch] = useState("");
  const [priceFaixa, setPriceFaixa] = useState<PriceFaixa>("todos");

  const query = useQuery({
    queryKey: ["lista", token],
    queryFn: () => getLista(token),
  });

  const presentes = query.data?.presentes ?? [];

  const presentesFiltrados = presentes.filter((presente) => {
    const matchesSearch =
      search.trim() === "" ||
      presente.nome.toLowerCase().includes(search.toLowerCase());
    const matchesPrice = matchesPriceFaixa(presente.precoReferencia, priceFaixa);
    return matchesSearch && matchesPrice;
  });

  return {
    lista: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    search,
    setSearch,
    priceFaixa,
    setPriceFaixa,
    presentesFiltrados,
  };
}
