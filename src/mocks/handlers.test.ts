import { apiGet } from "@/shared/lib/http";

test("GET /api/lista/:token returns event and gifts", async () => {
  const data = await apiGet<{ gifts: unknown[] }>("/api/lista/festa-rodrigo-25");
  expect(data.gifts).toHaveLength(5);
});
