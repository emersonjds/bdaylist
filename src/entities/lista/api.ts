import { apiGet } from "@/shared/lib/http";
import type { Lista } from "./model";

export async function getLista(token: string): Promise<Lista> {
  return apiGet<Lista>(`/api/lista/${token}`);
}
