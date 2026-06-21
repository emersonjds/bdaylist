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

  it("returns the user from the backend when the call succeeds", async () => {
    apiSendMock.mockResolvedValue({
      user: { id: "u9", name: "Ana", email: "ana@example.com", avatarUrl: "" },
    });

    const user = await signInWithGoogle();

    expect(user.name).toBe("Ana");
  });

  it("falls back to demo user when there is no backend", async () => {
    apiSendMock.mockRejectedValue(new Error("network down"));

    const user = await signInWithGoogle();

    expect(user.id).toBe("host-1");
    expect(user.name).toBe("Rodrigo");
  });
});
