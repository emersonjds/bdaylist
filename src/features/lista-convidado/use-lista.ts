"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getLista } from "@/entities/lista";
import type { Lista } from "@/entities/lista";
import type { PriceFaixa } from "./price-filter";

type GiftItem = Lista["gifts"][number];

interface UseListaResult {
  lista: Lista | undefined;
  isLoading: boolean;
  isError: boolean;
  search: string;
  setSearch: (value: string) => void;
  priceFaixa: PriceFaixa;
  setPriceFaixa: (value: PriceFaixa) => void;
  filteredGifts: GiftItem[];
}

function matchesPriceFaixa(price: number, faixa: PriceFaixa): boolean {
  switch (faixa) {
    case "ate100":
      return price <= 100;
    case "100a300":
      return price > 100 && price <= 300;
    case "acima300":
      return price > 300;
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

  const gifts = query.data?.gifts ?? [];

  const filteredGifts = gifts.filter((gift) => {
    const matchesSearch =
      search.trim() === "" || gift.name.toLowerCase().includes(search.toLowerCase());
    const matchesPrice = matchesPriceFaixa(gift.referencePrice, priceFaixa);
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
    filteredGifts,
  };
}
