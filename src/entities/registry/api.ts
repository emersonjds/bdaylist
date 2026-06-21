import { apiGet } from "@/shared/lib/http";
import type { Registry } from "./model";

export async function getRegistry(token: string): Promise<Registry> {
  return apiGet<Registry>(`/api/registry/${token}`);
}
