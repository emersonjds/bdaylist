import { describe, it, expect } from "vitest";
import { goalPercent } from "./goal";

describe("goalPercent", () => {
  it("calculates reached percentage rounded", () => {
    expect(goalPercent({ target: 5000, reached: 2450 })).toBe(49);
  });
  it("returns 0 when target is 0", () => {
    expect(goalPercent({ target: 0, reached: 100 })).toBe(0);
  });
  it("caps at 100", () => {
    expect(goalPercent({ target: 100, reached: 250 })).toBe(100);
  });
});
