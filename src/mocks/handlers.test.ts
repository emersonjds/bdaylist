import { apiGet } from "@/shared/lib/http";

test("GET /api/registry/:token returns event and gifts", async () => {
  const data = await apiGet<{ gifts: unknown[] }>("/api/registry/festa-rodrigo-25");
  expect(data.gifts).toHaveLength(5);
});
