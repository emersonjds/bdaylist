import { describe, it, expect, vi, beforeEach } from "vitest";
import { apiSend } from "@/shared/lib/http";
import { signInWithGoogle } from "./sign-in";

vi.mock("@/shared/lib/http", () => ({
  apiSend: vi.fn(),
}));

const apiSendMock = vi.mocked(apiSend);

describe("signInWithGoogle", () => {
  beforeEach(() => {
    apiSendMock.mockReset();
  });

  it("retorna o usuário do backend quando a chamada funciona", async () => {
    apiSendMock.mockResolvedValue({
      user: { id: "u9", nome: "Ana", email: "ana@example.com", avatarUrl: "" },
    });

    const user = await signInWithGoogle();

    expect(user.nome).toBe("Ana");
  });

  it("entra com usuário de demonstração quando não há backend", async () => {
    apiSendMock.mockRejectedValue(new Error("network down"));

    const user = await signInWithGoogle();

    expect(user.id).toBe("host-1");
    expect(user.nome).toBe("Rodrigo");
  });
});
