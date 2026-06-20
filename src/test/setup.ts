import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { server } from "@/mocks/server";
import { db } from "@/mocks/db";

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });
});

afterEach(() => {
  cleanup();
  server.resetHandlers();
  db.reset();
});

afterAll(() => {
  server.close();
});
