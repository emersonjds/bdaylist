import { generateListToken } from "./token";

test("generates a unique non-sequential token", () => {
  const a = generateListToken();
  const b = generateListToken();
  expect(a).not.toBe(b);
  expect(a.length).toBeGreaterThanOrEqual(16);
});
