import { apiGet } from "@/shared/lib/http";

test("GET /api/lista/:token devolve evento e presentes", async () => {
  const data = await apiGet<{ presentes: unknown[] }>(
    "/api/lista/festa-rodrigo-25",
  );
  expect(data.presentes).toHaveLength(5);
});
