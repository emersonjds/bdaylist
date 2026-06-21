import { describe, it, expect } from "vitest";
import { groupGoalPercent } from "./group-goal";

describe("groupGoalPercent", () => {
  it("calculates the rounded collected percentage", () => {
    expect(groupGoalPercent({ target: 1500, collected: 600 })).toBe(40);
  });
  it("returns 0 when target is 0", () => {
    expect(groupGoalPercent({ target: 0, collected: 50 })).toBe(0);
  });
  it("caps at 100", () => {
    expect(groupGoalPercent({ target: 100, collected: 300 })).toBe(100);
  });
});
