"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getRegistry } from "@/entities/registry";
import type { Registry } from "@/entities/registry";
import type { PriceRange } from "./price-filter";

type GiftItem = Registry["gifts"][number];

interface UseRegistryResult {
  registry: Registry | undefined;
  isLoading: boolean;
  isError: boolean;
  search: string;
  setSearch: (value: string) => void;
  priceRange: PriceRange;
  setPriceRange: (value: PriceRange) => void;
  filteredGifts: GiftItem[];
}

function matchesPriceRange(price: number, range: PriceRange): boolean {
  switch (range) {
    case "upTo100":
      return price <= 100;
    case "100to300":
      return price > 100 && price <= 300;
    case "above300":
      return price > 300;
    default:
      return true;
  }
}

export function useRegistry(token: string): UseRegistryResult {
  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState<PriceRange>("all");

  const query = useQuery({
    queryKey: ["registry", token],
    queryFn: () => getRegistry(token),
  });

  const gifts = query.data?.gifts ?? [];

  const filteredGifts = gifts.filter((gift) => {
    const matchesSearch =
      search.trim() === "" || gift.name.toLowerCase().includes(search.toLowerCase());
    const matchesPrice = matchesPriceRange(gift.referencePrice, priceRange);
    return matchesSearch && matchesPrice;
  });

  return {
    registry: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    search,
    setSearch,
    priceRange,
    setPriceRange,
    filteredGifts,
  };
}
